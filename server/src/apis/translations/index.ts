import Elysia, { t } from "elysia";
import { translateTextWithGoogle } from "../../services/translate-text";
import { getApiKey, isRateLimited, logApiKeyUsage } from "./utils";

export const translationRouter = new Elysia({ prefix: "/translations" })
  .guard({
    beforeHandle: async ({ headers, body }) => {
      // More explicit type check to satisfy TypeScript
      const apiKey = getApiKey({ headers: headers as unknown as Headers });

      await logApiKeyUsage({
        apiKey,
        headers: headers as unknown as Headers,
        body,
      });

      if (
        await isRateLimited({
          apiKey,
          headers: headers as unknown as Headers,
          body,
        })
      ) {
        throw new Error("Rate limited");
      }
    },
  })
  .post(
    "",
    async (params) => {
      // TODO: log translation time
      // TODO: cache translation results
      // TODO: log translation result
      const translatedText = await translateTextWithGoogle({
        sourceLanguage: params.body.sourceLanguage,
        targetLanguage: params.body.targetLanguage,
        text: params.body.text,
      });
      return {
        sourceText: params.body.text,
        sourceLanguage: params.body.sourceLanguage,
        targetLanguage: params.body.targetLanguage,
        translatedText,
      };
    },
    {
      body: t.Object(
        {
          text: t.String(),
          sourceLanguage: t.String({
            description:
              "Source language code in ISO 639-1 format (e.g., 'en' for English)",
          }),
          targetLanguage: t.String({
            description:
              "Target language code in ISO 639-1 format (e.g., 'fr' for French)",
          }),
        },
        {
          description: "Expected a text, source language and target language",
        }
      ),
      response: t.Object({
        sourceText: t.String(),
        sourceLanguage: t.String(),
        targetLanguage: t.String(),
        translatedText: t.String(),
      }),
      detail: {
        summary: "Translate text",
        tags: ["translation"],
      },
    }
  );
