import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { languageToDbCode } from "../../../data/language-codes";
import { authenticateApiKeyProjectPlugin } from "../../../procedures/stateful/authenticate-api-key-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";
import { batchTranslateTextWithBing } from "../../../procedures/stateless/batch-translate-bing";
import { getTranslationFromDB } from "./procedures/get-translation-from-db";

export const aiTranslateRouter = new Elysia({
	detail: {
		description: "Translate text using AI",
		summary: "Translate text using AI",
	},
})
	.use(authenticateApiKeyProjectPlugin)
	.use(cachePlugin)
	.post(
		"/ai-translate",
		async (ctx) => {
			if (!ctx.apiKey) {
				throw HttpError.Unauthorized("Please sign in");
			}

			if (!ctx.apiKey.projectId) {
				throw HttpError.Unauthorized("Missing project id");
			}

			const cacheKey = JSON.stringify({
				route: ctx.path,
				params: ctx.params,
				body: ctx.body,
				projectId: ctx.apiKey.projectId,
			});

			const cachedResult = await ctx.cache.get({ key: cacheKey });

			if (cachedResult) {
				return cachedResult;
			}

			// check if translation exists in database
			const maybeTranslation = await getTranslationFromDB({
				sourceText: ctx.body.sourceText,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				path: ctx.body.path,
				projectId: ctx.apiKey.projectId,
			});

			if (maybeTranslation) {
				return {
					sourceText: ctx.body.sourceText,
					sourceLanguage: ctx.body.sourceLanguage,
					targetLanguage: ctx.body.targetLanguage,
					translatedText: maybeTranslation,
					path: ctx.body.path,
					context: ctx.body.context || null,
					isCached: true,
				};
			}

			// translate
			const translatedTexts = await batchTranslateTextWithBing({
				sourceTexts: [ctx.body.sourceText],
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
			});

			if (!translatedTexts || translatedTexts.length === 0) {
				throw HttpError.Internal("Translation failed");
			}

			const response = {
				sourceText: ctx.body.sourceText,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				translatedText: translatedTexts[0],
				path: ctx.body.path,
				context: ctx.body.context || null,
				isCached: false,
			};

			return response;
		},
		{
			body: t.Object({
				sourceText: t.String(),
				sourceLanguage: t.String(),
				targetLanguage: t.String(),
				path: t.String(),
				context: t.Optional(t.String()),
			}),
			response: t.Object({
				sourceText: t.String(),
				sourceLanguage: t.String(),
				targetLanguage: t.String(),
				translatedText: t.String(),
				path: t.String(),
				context: t.Nullable(t.String()),
				isCached: t.Boolean(),
			}),
			afterResponse: async (ctx) => {
				const sourceText = ctx.body.sourceText;
				const sourceLanguage = ctx.body.sourceLanguage;
				const targetLanguage = ctx.body.targetLanguage;
				const translatedText = ctx.response.translatedText;
				const path = ctx.response.path;
				const context = ctx.body.context;
				const isCached = ctx.response.isCached;

				if (isCached) {
					return;
				}

				const cacheKey = JSON.stringify({
					route: ctx.path,
					params: ctx.params,
					body: { ...ctx.body, isCached: true },
					projectId: ctx.apiKey.projectId,
				});

				const cachedResult = await ctx.cache.set({
					key: cacheKey,
					value: ctx.response,
				});

				// store cached result
				//   save translation to database
				await ctx.db.$transaction(
					async (tx) => {
						// find oldest existing translation (original)
						const existingTranslation = await tx.translation.findFirst({
							where: {
								projectId: ctx.apiKey.projectId,
								[languageToDbCode({ languageCode: sourceLanguage })]:
									sourceText,
								path: path,
								context: context,
							},
						});

						if (existingTranslation) {
							// update translation
							await tx.translation.update({
								where: {
									id: existingTranslation.id,
								},
								data: {
									[languageToDbCode({
										languageCode: targetLanguage,
									})]: translatedText,
								},
							});
						} else {
							// create translation
							await tx.translation.create({
								data: {
									projectId: ctx.apiKey.projectId,
									[languageToDbCode({
										languageCode: sourceLanguage,
									})]: sourceText,
									[languageToDbCode({
										languageCode: targetLanguage,
									})]: translatedText,
									path: path,
									context: context,
								},
							});
						}
					},
					{ timeout: 1000 * 60 * 1000, maxWait: 1000 * 60 * 1000 },
				);
			},
		},
	);
