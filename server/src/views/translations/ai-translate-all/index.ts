import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";
import { translateTextWithGoogle } from "../ai-translate/procedures/google-translate";
import { allLanguageCodes, languageToDbCode } from "../constants";
import { isValidLanguageCode } from "./procedures/language-validation";

export const aiTranslateAllRouter = new Elysia({
	prefix: "/translations",
	tags: ["Translations"],
	name: "ai-translate-all-router",
	detail: {
		description: "Translate text using AI",
		summary: "Translate text using AI",
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
			});

			// translate all translations
			const promises = translations.map(async (translation) => {
				const translatedTexts: Record<string, string | undefined> = {};

				for (const languageCode of ctx.body.targetLanguage) {
					const translatedText = await translateTextWithGoogle({
						sourceText: translation[
							languageToDbCode({
								languageCode: ctx.body.originalLanguage,
							}) as keyof typeof translation
						] as string,
						sourceLanguage: ctx.body.originalLanguage,
						targetLanguage: languageCode,
					});

					translatedTexts[languageToDbCode({ languageCode })] = translatedText;
				}

				// save to db
				const updatedTranslation = await ctx.db.translation.update({
					where: {
						id: translation.id,
					},
					data: translatedTexts,
				});

				return updatedTranslation;
			});

			const updatedTranslations = await Promise.all(promises);

			// invalidate all cache
			// TODO: make it only for this project
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
