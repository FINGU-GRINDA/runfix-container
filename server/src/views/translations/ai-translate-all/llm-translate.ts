import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { env } from "../../../config";

const openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const TranslationSchema = z.object({
	translations: z.array(z.string()),
});

export const llmTranslate = async (params: {
	sourceTexts: string[];
	sourceLanguage: string;
	targetLanguage: string;
	context?: string;
}): Promise<string[]> => {
	const response = await openaiClient.beta.chat.completions.parse({
		model: "gpt-4.1",
		messages: [
			{
				role: "system",
				content: `Translate the following from ${params.sourceLanguage} to ${params.targetLanguage} (ISO 639-1 codes).
Maintain context and ordering:${params.context}


${JSON.stringify(params.sourceTexts)}
`,
			},
		],
		response_format: zodResponseFormat(TranslationSchema, "TranslationSchema"),
	});

	const maybeTranslations = response.choices[0].message.parsed?.translations;

	if (!maybeTranslations) {
		throw new Error("Failed to translate");
	}

	if (maybeTranslations.length !== params.sourceTexts.length) {
		throw new Error("Failed to translate, missmatch length");
	}

	return maybeTranslations;
};
