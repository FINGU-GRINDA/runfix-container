import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "../../../config";
import { batchArray } from "../batch-array";
import type { AbstractLLMTranslate } from "./base";

const openaiClient = new OpenAI({
	apiKey: env.ALIBABA_API_KEY,
	baseURL: env.ALIBABA_BASE_URL,
});

const TranslationSchema = z.object({
	translatedText: z.string(),
});

const client = Instructor({
	client: openaiClient,
	mode: "FUNCTIONS",
});

export class AlibabaTranslate implements AbstractLLMTranslate {
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
				? `CONTEXT (DO NOT TRANSLATE THIS): ${params.context}`
				: "";

		const response = await client.chat.completions.create({
			model: this.model,
			messages: [
				{
					role: "system",
					content: `You are a professional translation assistant specializing in ${params.sourceLanguage} to ${params.targetLanguage} translations.

TRANSLATION RULES:
1. Translate ONLY the user's input text from ${params.sourceLanguage} to ${params.targetLanguage}
2. Preserve all formatting, HTML tags, numbers, and special characters exactly as they appear
3. Maintain the same capitalization pattern (uppercase/lowercase)
4. If the input is a single number or appears to be a code/ID, do not translate it - return it exactly as provided
5. If context is provided, use it ONLY to understand the meaning - do not translate the context itself
6. For ambiguous terms, choose the most appropriate translation based on context
7. Return ONLY the translated text with no explanations, notes, or additional content

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
