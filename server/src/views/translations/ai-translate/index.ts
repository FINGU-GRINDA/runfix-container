import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateApiKeyProjectPlugin } from "../../../procedures/stateful/authenticate-api-key-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";
import { languageToDbCode } from "../constants";
import { getTranslationFromDB } from "./procedures/get-translation-from-db";
import { translateTextWithGoogle } from "./procedures/google-translate";

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
				projectId: ctx.apiKey.projectId,
			});

			if (maybeTranslation) {
				return {
					sourceText: ctx.body.sourceText,
					sourceLanguage: ctx.body.sourceLanguage,
					targetLanguage: ctx.body.targetLanguage,
					translatedText: maybeTranslation,
					context: null,
					isCached: false,
				};
			}

			// translate
			const translatedText = await translateTextWithGoogle({
				sourceText: ctx.body.sourceText,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				context: ctx.body.context,
			});

			const response = {
				sourceText: ctx.body.sourceText,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				translatedText: translatedText,
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
				context: t.Optional(t.String()),
			}),
			response: t.Object({
				sourceText: t.String(),
				sourceLanguage: t.String(),
				targetLanguage: t.String(),
				translatedText: t.String(),
				context: t.Nullable(t.String()),
				isCached: t.Boolean(),
			}),
			afterResponse: async (ctx) => {
				if (!ctx.apiKey) {
					throw HttpError.Unauthorized("Please sign in");
				}

				if (!ctx.apiKey.projectId) {
					throw HttpError.Unauthorized("Missing project id");
				}

				// TODO: save translation to log for analytics
				if (ctx.response.isCached) {
					return;
				}

				//   store cache
				const cacheKey = JSON.stringify({
					route: ctx.path,
					params: ctx.params,
					body: ctx.body,
					projectId: ctx.apiKey.projectId,
				});

				ctx.response.isCached = true;

				await ctx.cache.set({
					key: cacheKey,
					value: ctx.response,
				});

				const translatedText = ctx.response.translatedText;

				//   save translation to database
				await ctx.db.$transaction(
					async (tx) => {
						// find existing translation
						const existingTranslation = await tx.translation.findFirst({
							where: {
								projectId: ctx.apiKey.projectId,
								[languageToDbCode({ languageCode: ctx.body.sourceLanguage })]:
									ctx.body.sourceText,
							},
							orderBy: {
								createdAt: "asc",
							},
						});

						if (existingTranslation) {
							// update translation
							await tx.translation.updateMany({
								where: {
									projectId: ctx.apiKey.projectId,
									[languageToDbCode({
										languageCode: ctx.body.sourceLanguage,
									})]: ctx.body.sourceText,
								},
								data: {
									[languageToDbCode({
										languageCode: ctx.body.targetLanguage,
									})]: translatedText,
								},
							});
						} else {
							// create translation
							await tx.translation.create({
								data: {
									projectId: ctx.apiKey.projectId,
									[languageToDbCode({
										languageCode: ctx.body.sourceLanguage,
									})]: ctx.body.sourceText,
									[languageToDbCode({
										languageCode: ctx.body.targetLanguage,
									})]: translatedText,
								},
							});
						}
					},
					{ timeout: 1000 * 60 * 1000, maxWait: 1000 * 60 * 1000 },
				);
			},
		},
	);
