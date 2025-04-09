import Elysia, { t } from "elysia";
import { authenticateApiKeyUser } from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import { translateTextWithOpenAI } from "../../utils/openai-translate";
import { getTranslationFromDB } from "../../services/get-translation-from-db";
import { prisma } from "../../deps/prisma";
import { languageToDbCode } from "../../utils/language-code-to-dbcode";

export const translationRouter = new Elysia({ prefix: "/translations" })
  .use(authenticateApiKeyUser)
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("None or invalid api key");
      }

      //   check if translation exists in database
      const dbTranslatedText = await getTranslationFromDB({
        sourceText: ctx.query.sourceText,
        sourceLanguage: ctx.query.sourceLanguage,
        targetLanguage: ctx.query.targetLanguage,
        userId: ctx.user.id,
      });

      if (dbTranslatedText) {
        return {
          sourceText: ctx.query.sourceText,
          sourceLanguage: ctx.query.sourceLanguage,
          targetLanguage: ctx.query.targetLanguage,
          context: ctx.query.context,
          translatedText: dbTranslatedText,
          isCached: true,
        };
      }

      //   translate with openai
      const translatedText = await translateTextWithOpenAI({
        sourceText: ctx.query.sourceText,
        sourceLanguage: ctx.query.sourceLanguage,
        targetLanguage: ctx.query.targetLanguage,
        context: ctx.query.context,
      });

      return {
        sourceText: ctx.query.sourceText,
        sourceLanguage: ctx.query.sourceLanguage,
        targetLanguage: ctx.query.targetLanguage,
        context: ctx.query.context,
        translatedText: translatedText,
        isCached: false,
      };
    },
    {
      query: t.Object({
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

        const translatedText = ctx.response.translatedText;
        //   save translation to database
        await prisma.$transaction(async (tx) => {
          // find existing translation
          const existingTranslation = await prisma.translation.findFirst({
            where: {
              userId: ctx.user.id,
              [languageToDbCode({ languageCode: ctx.query.sourceLanguage })]:
                ctx.query.sourceText,
            },
          });

          if (existingTranslation) {
            // update translation
            await tx.translation.updateMany({
              where: {
                userId: ctx.user.id,
                [languageToDbCode({
                  languageCode: ctx.query.sourceLanguage,
                })]: ctx.query.sourceText,
              },
              data: {
                [languageToDbCode({
                  languageCode: ctx.query.targetLanguage,
                })]: translatedText,
              },
            });
          } else {
            // create translation
            await tx.translation.create({
              data: {
                userId: ctx.user.id,
                [languageToDbCode({
                  languageCode: ctx.query.sourceLanguage,
                })]: ctx.query.sourceText,
                [languageToDbCode({
                  languageCode: ctx.query.targetLanguage,
                })]: translatedText,
              },
            });
          }
        });
      },
    }
  )
  .post("", async (ctx) => {
    if (!ctx.user) {
      throw HttpError.Unauthorized("None or invalid api key");
    }

    throw HttpError.NotImplemented();
  });
