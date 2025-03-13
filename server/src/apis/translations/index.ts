import Elysia, { t } from "elysia";
import { translateTextWithGoogle } from "../../services/translate-text";

export const translationRouter = new Elysia({ prefix: "/translations" }).post(
  "",
  async (params) => {
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
        sourceLanguage: t.String(),
        targetLanguage: t.String(),
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
