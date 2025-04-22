import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { env } from "../../../../config";
import { batchArray } from "./batch-array";

const openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const TranslationSchema = z.object({
	translatedText: z.string(),
});

export const llmTranslate = async (params: {
	sourceText: string;
	sourceLanguage: string;
	targetLanguage: string;
	context?: string;
}): Promise<string> => {
	const response = await openaiClient.beta.chat.completions.parse({
		model: "gpt-4.1",
		messages: [
			{
				role: "system",
				content: `You are a translation assistant. Translate the following text from ${params.sourceLanguage} to ${params.targetLanguage} (ISO 639-1 codes). Respond ONLY with the translated text, without any additional explanation or formatting.`,
			},
			{
				role: "user",
				content: params.sourceText,
			},
		],
		response_format: zodResponseFormat(TranslationSchema, "TranslationSchema"),
	});

	const maybeTranslation = response.choices[0].message.parsed?.translatedText;

	if (!maybeTranslation) {
		throw new Error("Failed to translate");
	}

	return maybeTranslation;
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
		batchSize: 10,
	});

	const translations: string[] = [];

	for (const batch of batchedSourceTexts) {
		const promises = batch.map((text) =>
			llmTranslate({
				sourceText: text,
				sourceLanguage: params.sourceLanguage,
				targetLanguage: params.targetLanguage,
				context: params.context,
			}),
		);

		translations.push(...(await Promise.all(promises)));
	}

	return translations;
};
