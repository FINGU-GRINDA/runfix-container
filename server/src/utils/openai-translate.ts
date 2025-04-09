import { z } from "zod";
import { env } from "../../config";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
const openaiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const translationSchema = z.object({
  translatedText: z.string(),
});

export const translateTextWithOpenAI = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}): Promise<string> => {
  if (params.sourceLanguage === params.targetLanguage) {
    return params.sourceText;
  }

  const response = await openaiClient.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional translation assistant specializing in accurate, culturally-appropriate translations.

You will receive:
- sourceLanguage: ISO 639-1 code (e.g., 'en', 'ko', 'ja')
- targetLanguage: ISO 639-1 code
- sourceText: Text to be translated
- context: (Optional) Additional context about where/how the text is used

Guidelines:
1. Preserve the original meaning and intent completely
2. Maintain formatting, including line breaks and spacing
3. Adapt idioms and cultural references to the target language when appropriate
4. Keep technical terms consistent
5. Preserve tone (formal/informal) and style of the original text
6. When context is provided, use it to inform your translation choices
7. Consider cultural sensitivities specific to the target language
8. For UI text, maintain conciseness appropriate for interfaces
`,
      },
      {
        role: "user",
        content: `{
            "sourceLanguage": "${params.sourceLanguage}",
            "targetLanguage": "${params.targetLanguage}",
            "sourceText": "${params.sourceText}"
            ${params.context ? `"context": "${params.context}"` : ""}
        }`,
      },
    ],
    response_format: zodResponseFormat(translationSchema, "translationSchema"),
  });

  const maybeTranslation = response.choices[0].message.parsed;

  if (!maybeTranslation) {
    throw new Error("Failed to translate text");
  }

  return maybeTranslation.translatedText;
};
