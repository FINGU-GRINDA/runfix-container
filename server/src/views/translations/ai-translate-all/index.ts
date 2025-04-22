import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";
import { allLanguageCodes, languageToDbCode } from "../constants";
import { isValidLanguageCode } from "./procedures/language-validation";
import { llmTranslateBatch } from "./procedures/llm-translate";

export const aiTranslateAllRouter = new Elysia({
	detail: {
		description: "Pre-translate all text using AI, this will take a while ",
		summary: "Pre-translate all text using AI",
	},
})
	.use(authenticateUserPlugin)
	.use(cachePlugin)
	.post(
		"/ai-translate-all",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("None or invalid api key");
			}

			// validate language code
			if (!isValidLanguageCode({ code: ctx.body.originalLanguage })) {
				throw HttpError.BadRequest(
					`Invalid language code, should be any of ${allLanguageCodes.join(", ")}`,
				);
			}

			// get all translations for the project
			const translations = await ctx.db.translation.findMany({
				where: {
					projectId: ctx.body.projectId,
					[languageToDbCode({ languageCode: ctx.body.originalLanguage })]: {
						not: null,
					},
					Project: {
						Organization: {
							OrganizationMembers: {
								some: {
									userId: ctx.user.id,
								},
							},
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			/**
			 * LLM TRANSLATE 1 target language at the time
			 */
			const sourceLanguage = ctx.body.originalLanguage;
			const remainingTargetLanguages = ctx.body.targetLanguage;
			const sourceTexts = translations.map(
				(t) =>
					t[
						languageToDbCode({
							languageCode: sourceLanguage,
						}) as keyof typeof t
					] as string,
			);

			while (true) {
				const targetLanguage = remainingTargetLanguages.pop();

				if (!targetLanguage) {
					break;
				}

				const translatedTexts = await llmTranslateBatch({
					sourceTexts: sourceTexts,
					sourceLanguage: sourceLanguage,
					targetLanguage: targetLanguage,
					context: "",
				});

				const promises = [];
				for (let i = 0; i < sourceTexts.length; i++) {
					const translatedText = translatedTexts[i];
					promises.push(
						ctx.db.translation.update({
							where: {
								id: translations[i].id,
							},
							data: {
								[languageToDbCode({ languageCode: targetLanguage })]:
									translatedText,
							},
						}),
					);
				}

				await Promise.all(promises);
			}

			const updatedTranslations = await ctx.db.translation.findMany({
				where: {
					projectId: ctx.body.projectId,
				},
			});

			/**
			 * GOOGLE TRANSLATE
			 */

			// // translate all translations using google
			// const promises = translations.map(async (translation) => {
			// 	const translatedTexts: Record<string, string | undefined> = {};

			// 	for (const languageCode of ctx.body.targetLanguage) {
			// 		const translatedText = await translateTextWithGoogle({
			// 			sourceText: translation[
			// 				languageToDbCode({
			// 					languageCode: ctx.body.originalLanguage,
			// 				}) as keyof typeof translation
			// 			] as string,
			// 			sourceLanguage: ctx.body.originalLanguage,
			// 			targetLanguage: languageCode,
			// 		});

			// 		translatedTexts[languageToDbCode({ languageCode })] = translatedText;
			// 	}

			// 	// save to db
			// 	const updatedTranslation = await ctx.db.translation.update({
			// 		where: {
			// 			id: translation.id,
			// 		},
			// 		data: translatedTexts,
			// 	});

			// 	return updatedTranslation;
			// });

			// const updatedTranslations = await Promise.all(promises);

			await ctx.cache.delete({ key: `*${ctx.body.projectId}*` });

			return {
				message: "Translations completed",
				updatedTranslations: updatedTranslations,
			};
		},
		{
			body: t.Object({
				originalLanguage: t.String({ default: "ko" }),
				projectId: t.String(),
				targetLanguage: t.Array(t.String({ maxLength: 2, minLength: 2 }), {
					default: [
						"en",
						"ko",
						"ja",
						"zh",
						"uz",
						"vi",
						"ru",
						"kk",
						"mn",
						"th",
						"id",
					],
				}),
			}),
			response: t.Object({
				message: t.String(),
				updatedTranslations: t.Array(TranslationPlain),
			}),
		},
	);
