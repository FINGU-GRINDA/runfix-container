import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { env } from "../../../../config";
import { batchArray } from "./batch-array";

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


${JSON.stringify(params.sourceTexts)}`,
			},
		],
		response_format: zodResponseFormat(TranslationSchema, "TranslationSchema"),
	});

	const maybeTranslations = response.choices[0].message.parsed?.translations;

	if (!maybeTranslations) {
		throw new Error("Failed to translate");
	}

	return maybeTranslations;
};

export const llmTranslateBatch = async (params: {
	sourceTexts: string[];
	sourceLanguage: string;
	targetLanguage: string;
	context?: string;
}): Promise<string[]> => {
	// split text batch into 2 if it's over 50

	const batchedSourceTexts = batchArray({
		array: params.sourceTexts,
		batchSize: 50,
	});

	const translationsPromises: Promise<string[]>[] = [];

	for (const batch of batchedSourceTexts) {
		translationsPromises.push(
			llmTranslate({
				sourceTexts: batch,
				sourceLanguage: params.sourceLanguage,
				targetLanguage: params.targetLanguage,
				context: params.context,
			}),
		);
	}

	const translations = await Promise.all(translationsPromises);

	return translations.flat();
};
