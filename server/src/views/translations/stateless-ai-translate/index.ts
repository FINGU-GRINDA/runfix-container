import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateApiKeyProjectPlugin } from "../../../procedures/stateful/authenticate-api-key-plugin";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { AlibabaTranslate } from "../../../procedures/stateless/llm-translation/alibaba-translate";
import type { AbstractLLMTranslate } from "../../../procedures/stateless/llm-translation/base";
import { OpenAITranslate } from "../../../procedures/stateless/llm-translation/openai-translate";
import { OpenRouterTranslate } from "../../../procedures/stateless/llm-translation/openrouter-translate";

export const statelessAITranslateRoute = new Elysia({
	detail: {
		description: "Translate text using AI - for stateless translation",
		summary: "Stateless AI translation",
	},
})
	.use(authenticateUserPlugin)
	.use(authenticateApiKeyProjectPlugin)
	.post(
		"/stateless-ai-translate",
		async (ctx) => {
			if (!ctx.user && !ctx.apiKey.projectId) {
				throw HttpError.Unauthorized("Please sign in or use an API key");
			}

			let llmTranslator: AbstractLLMTranslate;

			if (ctx.body.model.includes("qwen")) {
				llmTranslator = new AlibabaTranslate({
					model: ctx.body.model,
				});
			} else if (ctx.body.model.includes("/")) {
				llmTranslator = new OpenRouterTranslate({
					model: ctx.body.model,
				});
			} else {
				llmTranslator = new OpenAITranslate({
					model: ctx.body.model,
				});
			}

			const translation = await llmTranslator.translate({
				path: ctx.body.path,
				sourceLanguage: ctx.body.sourceLanguage,
				sourceText: ctx.body.sourceText,
				targetLanguage: ctx.body.targetLanguage,
				context: ctx.body.context,
			});

			return {
				sourceText: ctx.body.sourceText,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				translatedText: translation,
				path: ctx.body.path,
				context: ctx.body.context || null,
				isCached: false,
			};
		},
		{
			body: t.Object({
				sourceText: t.String(),
				sourceLanguage: t.String({ default: "ko", maxLength: 2, minLength: 2 }),
				targetLanguage: t.String({ default: "ja", maxLength: 2, minLength: 2 }),
				path: t.String({ default: "body > div > div > div" }),
				context: t.Optional(t.String()),
				model: t.String({ default: "qwen/qwen3-8b:free" }),
			}),
			response: t.Object({
				path: t.String(),
				context: t.Union([t.String(), t.Null()]),
				sourceText: t.String(),
				sourceLanguage: t.String(),
				targetLanguage: t.String({ maxLength: 2, minLength: 2 }),
				translatedText: t.String(),
				isCached: t.Boolean(),
			}),
		},
	);
