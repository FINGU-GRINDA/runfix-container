import Elysia, { t } from "elysia";
import { authenticateApiKeyUser } from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import { getTranslationFromDB } from "../../services/get-translation-from-db";
import { prisma } from "../../deps/prisma";
import { languageToDbCode } from "../../utils/language-code-to-dbcode";
import { getCache, setCache } from "../../services/redis-cache";
import { translateTextWithGoogle } from "../../utils/google-translate";
import { allLanguageCodes } from "./constants";
import { redis } from "../../deps/redis";
import { translationSchema, updateTranslationSchema } from "./models";

export const translationRouter = new Elysia({
  prefix: "/translations",
  tags: ["translations"],
})
  .use(authenticateApiKeyUser)
  .model({
    Translation: translationSchema,
    UpdateTranslation: updateTranslationSchema,
  })
  .post(
    "/ai-translate",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      //   check cache
      const cacheKey = JSON.stringify({
        route: ctx.path,
        params: ctx.params,
        body: ctx.body,
        userId: ctx.user.id,
      });

      const cachedResponse = await getCache({
        key: cacheKey,
      });

      if (cachedResponse) {
        return cachedResponse;
      }

      //   check if translation exists in database
      const dbTranslatedText = await getTranslationFromDB({
        sourceText: ctx.body.sourceText,
        sourceLanguage: ctx.body.sourceLanguage,
        targetLanguage: ctx.body.targetLanguage,
        userId: ctx.user.id,
      });

      if (dbTranslatedText) {
        return {
          sourceText: ctx.body.sourceText,
          sourceLanguage: ctx.body.sourceLanguage,
          targetLanguage: ctx.body.targetLanguage,
          context: ctx.body.context,
          translatedText: dbTranslatedText,
          isCached: false,
        };
      }

      const translatedText = await translateTextWithGoogle({
        sourceText: ctx.body.sourceText,
        sourceLanguage: ctx.body.sourceLanguage,
        targetLanguage: ctx.body.targetLanguage,
        context: ctx.body.context,
      });

      const response = {
        sourceText: ctx.body.sourceText,
        sourceLanguage: ctx.body.sourceLanguage,
        targetLanguage: ctx.body.targetLanguage,
        context: ctx.body.context,
        translatedText: translatedText,
        isCached: false,
      };

      return response;
    },
    {
      body: t.Object({
        sourceText: t.String(),
        sourceLanguage: t.String(),
        targetLanguage: t.String(),
        context: t.Optional(t.String()),
      }),
      response: t.Object({
        sourceText: t.String(),
        sourceLanguage: t.String(),
        targetLanguage: t.String(),
        context: t.Optional(t.String()),
        translatedText: t.String(),
        isCached: t.Boolean(),
      }),
      afterResponse: async (ctx) => {
        if (!ctx.user) {
          throw HttpError.Unauthorized("None or invalid api key");
        }

        // TODO: save translation to log for analytics
        if (ctx.response.isCached) {
          return;
        }

        //   store cache
        const cacheKey = JSON.stringify({
          route: ctx.path,
          params: ctx.params,
          body: ctx.body,
          userId: ctx.user.id,
        });

        ctx.response.isCached = true;

        await setCache({
          key: cacheKey,
          value: JSON.stringify(ctx.response),
        });

        const translatedText = ctx.response.translatedText;

        //   save translation to database
        await prisma.$transaction(async (tx) => {
          // find existing translation
          const existingTranslation = await prisma.translation.findFirst({
            where: {
              userId: ctx.user.id,
              [languageToDbCode({ languageCode: ctx.body.sourceLanguage })]:
                ctx.body.sourceText,
            },
          });

          if (existingTranslation) {
            // update translation
            await tx.translation.updateMany({
              where: {
                userId: ctx.user.id,
                [languageToDbCode({
                  languageCode: ctx.body.sourceLanguage,
                })]: ctx.body.sourceText,
              },
              data: {
                [languageToDbCode({
                  languageCode: ctx.body.targetLanguage,
                })]: translatedText,
              },
            });
          } else {
            // create translation
            await tx.translation.create({
              data: {
                userId: ctx.user.id,
                [languageToDbCode({
                  languageCode: ctx.body.sourceLanguage,
                })]: ctx.body.sourceText,
                [languageToDbCode({
                  languageCode: ctx.body.targetLanguage,
                })]: translatedText,
              },
            });
          }
        });
      },
    }
  )
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      if (ctx.query.userId !== ctx.user.id) {
        throw HttpError.Forbidden(
          "You are not allowed to access this resource"
        );
      }

      const translations = await prisma.translation.findMany({
        where: {
          userId: ctx.query.userId ?? ctx.user.id,
        },
      });

      return translations;
    },
    {
      query: t.Optional(
        t.Object({
          userId: t.Optional(t.String()),
        })
      ),
      response: t.Array(translationSchema),
    }
  )
  .post(
    "/translate-all",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      // get all translations for the user
      const translations = await prisma.translation.findMany({
        where: {
          userId: ctx.user.id,
          [languageToDbCode({ languageCode: ctx.body.originalLanguage })]: {
            not: null,
          },
        },
      });

      // translate all translations
      const promises = translations.map(async (translation) => {
        const translatedTexts: Record<string, string> = {};

        for (const languageCode of allLanguageCodes) {
          const translatedText = await translateTextWithGoogle({
            sourceText: translation[
              languageToDbCode({
                languageCode: ctx.body.originalLanguage,
              }) as keyof typeof translation
            ] as string,
            sourceLanguage: ctx.body.originalLanguage,
            targetLanguage: languageCode,
          });

          translatedTexts[languageToDbCode({ languageCode })] = translatedText;
        }

        // save to db
        await prisma.translation.update({
          where: {
            id: translation.id,
          },
          data: translatedTexts,
        });
      });

      await Promise.all(promises);

      // invalidate all cache
      // TODO: make it only for this user
      await redis.del(`*${ctx.user.id}*`);
      return {
        message: "Translations completed",
      };
    },
    {
      body: t.Object({
        originalLanguage: t.String(),
      }),
      response: t.Object({
        message: t.String(),
      }),
    }
  )
  .patch(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      const translation = await prisma.translation.update({
        where: {
          id: ctx.params.id,
        },
        data: {},
      });

      if (!translation) {
        throw HttpError.NotFound("Translation not found");
      }

      return translation;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: "UpdateTranslation",
      response: "Translation",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      const translation = await prisma.translation.delete({
        where: {
          id: ctx.params.id,
        },
      });

      if (!translation) {
        throw HttpError.NotFound("Translation not found");
      }

      return translation;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: "Translation",
    }
  );
