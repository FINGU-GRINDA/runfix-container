import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "../../../config";
import { batchArray } from "../batch-array";
import type { AbstractLLMTranslate } from "./base";

const openaiClient = new OpenAI({
	apiKey: env.OPENROUTER_API_KEY,
	baseURL: env.OPENROUTER_BASE_URL,
});

const TranslationSchema = z.object({
	translatedText: z.string(),
});

const client = Instructor({
	client: openaiClient,
	mode: "MD_JSON",
});

export class OpenRouterTranslate implements AbstractLLMTranslate {
	model: string;
	constructor(params: { model: string }) {
		this.model = params.model;
	}
	async translate(params: {
		sourceText: string;
		sourceLanguage: string;
		targetLanguage: string;
		path: string;
		context?: string;
	}): Promise<string> {
		// const path = `Here's the html tag path of this element: ${params.path}`;

		const context =
			params.context && params.context !== params.sourceText
				? `Here's the context of the text to be translated, only use this as a guide: ${params.context}`
				: "";

		const response = await client.chat.completions.create({
			model: this.model,
			messages: [
				{
					role: "system",
					content: `You are a translation assistant. Translate the following text from ${params.sourceLanguage} to ${params.targetLanguage} (ISO 639-1 codes). 
Respond ONLY with the translated text, without any additional explanation.
Maintain original formatting, including HTML tags, uppercase lowercase and do not add any new lines or spaces.
        
${context}`,
				},
				{
					role: "user",
					content: params.sourceText,
				},
			],
			response_model: {
				schema: TranslationSchema,
				name: "TranslationSchema",
			},
		});

		return response.translatedText;
	}

	async batchTranslate(params: {
		sourceTexts: string[];
		sourceLanguage: string;
		targetLanguage: string;
		path: Array<string | null>;
		contexts: Array<string | null>;
	}): Promise<string[]> {
		const sourceWithContext = [];
		for (let i = 0; i < params.sourceTexts.length; i++) {
			const sourceText = params.sourceTexts[i];
			const context = params.contexts ? params.contexts[i] : null;
			const path = params.path[i] as unknown as string;

			sourceWithContext.push({
				sourceText,
				context,
				path,
			});
		}

		const batchedSourceWithContext = batchArray({
			array: sourceWithContext,
			batchSize: 10,
		});

		const translations: string[] = [];

		for (const batch of batchedSourceWithContext) {
			const promises = batch.map((item) =>
				this.translate({
					sourceText: item.sourceText,
					sourceLanguage: params.sourceLanguage,
					targetLanguage: params.targetLanguage,
					path: item.path,
					context: item.context || undefined,
				}),
			);

			translations.push(...(await Promise.all(promises)));
		}

		return translations;
	}
}
