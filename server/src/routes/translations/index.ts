import Elysia, { t } from "elysia";
import {
  authenticateApiKeyProject,
  authenticateUser,
} from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import { getTranslationFromDB } from "../../services/get-translation-from-db";
import { prisma } from "../../deps/prisma";
import { languageToDbCode } from "../../utils/language-code-to-dbcode";
import { getCache, setCache } from "../../services/redis-cache";
import { translateTextWithGoogle } from "../../utils/google-translate";
import { allLanguageCodes } from "./constants";
import { redis } from "../../deps/redis";
import { BaseTranslationSchema, UpdateTranslationSchema } from "./models";
import { parseValue } from "../../utils/parse-value";

export const translationRouter = new Elysia({
  prefix: "/translations",
  tags: ["translations"],
})
  .guard((app) =>
    app.use(authenticateApiKeyProject).post(
      "/ai-translate",
      async (ctx) => {
        if (!ctx.project) {
          throw HttpError.Unauthorized("None or invalid api key");
        }

        //   check cache
        const cacheKey = JSON.stringify({
          route: ctx.path,
          params: ctx.params,
          body: ctx.body,
          projectId: ctx.project.id,
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
          projectId: ctx.project.id,
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
        afterResponse: async (ctx: any) => {
          if (!ctx.project) {
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
            projectId: ctx.project.id,
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
                projectId: ctx.project.id,
                [languageToDbCode({ languageCode: ctx.body.sourceLanguage })]:
                  ctx.body.sourceText,
              },
            });

            if (existingTranslation) {
              // update translation
              await tx.translation.updateMany({
                where: {
                  projectId: ctx.project.id,
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
                  projectId: ctx.project.id,
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
  )
  .guard((app) =>
    app
      .use(authenticateUser)
      .get(
        "",
        async (ctx) => {
          if (!ctx.user) {
            throw HttpError.Unauthorized("Please sign in");
          }

          const translations = await prisma.translation.findMany({
            where: {
              projectId: ctx.query.projectId,
              Project: {
                Organization: {
                  OrganizationMembers: {
                    some: {
                      userId: ctx.user.id,
                    },
                  },
                },
              },
            },
          });

          return translations;
        },
        {
          query: t.Object({
            projectId: t.String(),
          }),
          response: t.Array(BaseTranslationSchema),
        }
      )
      .post(
        "/translate-all",
        async (ctx) => {
          if (!ctx.user) {
            throw HttpError.Unauthorized("None or invalid api key");
          }

          // get all translations for the project
          const translations = await prisma.translation.findMany({
            where: {
              projectId: ctx.body.projectId,
              [languageToDbCode({ languageCode: ctx.body.originalLanguage })]: {
                not: null,
              },
              Project: {
                Organization: {
                  OrganizationMembers: {
                    some: {
                      userId: ctx.user.id,
                    },
                  },
                },
              },
            },
          });

          // translate all translations
          const promises = translations.map(async (translation) => {
            const translatedTexts: Record<string, string | undefined> = {};

            for (const languageCode of ctx.body.targetLanguage) {
              const translatedText = await translateTextWithGoogle({
                sourceText: translation[
                  languageToDbCode({
                    languageCode: ctx.body.originalLanguage,
                  }) as keyof typeof translation
                ] as string,
                sourceLanguage: ctx.body.originalLanguage,
                targetLanguage: languageCode,
              });

              translatedTexts[languageToDbCode({ languageCode })] =
                translatedText;
            }

            // save to db
            const updatedTranslation = await prisma.translation.update({
              where: {
                id: translation.id,
              },
              data: translatedTexts,
            });

            return parseValue(BaseTranslationSchema, updatedTranslation);
          });

          const updatedTranslations = await Promise.all(promises);

          // invalidate all cache
          // TODO: make it only for this project
          await redis.del(`*${ctx.query.projectId}*`);
          return {
            message: "Translations completed",
            updatedTranslations: updatedTranslations,
          };
        },
        {
          body: t.Object({
            originalLanguage: t.String(),
            projectId: t.String(),
            targetLanguage: t.Array(t.String(), {
              default: [
                "en",
                "ko",
                "ja",
                "zh",
                "uz",
                "vi",
                "ru",
                "kk",
                "mn",
                "th",
                "id",
              ],
            }),
          }),
          response: t.Object({
            message: t.String(),
            updatedTranslations: t.Array(BaseTranslationSchema),
          }),
          detail: "Translate all translations and invalidate cache",
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
            data: { ...ctx.body },
          });

          if (!translation) {
            throw HttpError.NotFound("Translation not found");
          }

          return parseValue(BaseTranslationSchema, translation);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: UpdateTranslationSchema,
          response: BaseTranslationSchema,
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
          response: BaseTranslationSchema,
        }
      )
  );
