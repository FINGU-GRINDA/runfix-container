import type { PrismaClient } from "@prisma/client";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { env } from "../../../config";
import { authenticateApiKeyProjectPlugin } from "../../../procedures/stateful/authenticate-api-key-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { languageToDbCode } from "../constants";
import { batchTranslateTextWithBing } from "./procedures";

export const aiTranslateV2Router = new Elysia({
	name: "ai-translate-v2-router",
	detail: {
		description: "Translate text using AI v2",
		summary: "Translate text using AI v2",
	},
})
	.use(authenticateApiKeyProjectPlugin)
	.use(databasePlugin)
	.use(cachePlugin)
	.post(
		"/ai-translate-v2",
		async (ctx) => {
			if (!ctx.apiKey) {
				throw HttpError.Unauthorized("Please signin and use a project api key");
			}

			if (!ctx.apiKey.projectId) {
				throw HttpError.Unauthorized("Missing project id");
			}

			// check cache
			const cacheKey = JSON.stringify({
				sourceTexts: ctx.body.sourceTexts,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				context: ctx.body.context,
				projectId: ctx.apiKey.projectId,
			});
			const cachedResponse = await ctx.cache.get({ key: cacheKey });

			if (cachedResponse) {
				return cachedResponse;
			}

			const dbKeySourceLanguage = languageToDbCode({
				languageCode: ctx.body.sourceLanguage,
			});
			const dbKeyTargetLanguage = languageToDbCode({
				languageCode: ctx.body.targetLanguage,
			});

			const dbTranslations = await ctx.db.translation.findMany({
				where: {
					projectId: ctx.apiKey.projectId,
					[dbKeySourceLanguage]: {
						in: ctx.body.sourceTexts,
					},
				},
			});

			// create a map of source text to translated text
			const translationMap: Record<string, string | null> = {};
			for (const translation of dbTranslations) {
				const sourceText = translation[
					dbKeySourceLanguage as keyof typeof translation
				] as string;

				translationMap[sourceText] = translation[
					dbKeyTargetLanguage as keyof typeof translation
				] as string | null;
			}

			const textsToTranslate: string[] = [];

			for (const sourceText of ctx.body.sourceTexts) {
				if (!translationMap[sourceText]) {
					textsToTranslate.push(sourceText);
				}
			}

			// batch translate
			const batchTranslations = await batchTranslateTextWithBing({
				sourceTexts: textsToTranslate,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				context: ctx.body.context,
			});

			// add batch translations to translation map
			for (let i = 0; i < textsToTranslate.length; i++) {
				translationMap[textsToTranslate[i]] = batchTranslations[i];
			}

			// construct response
			const translatedTexts = ctx.body.sourceTexts.map((sourceText) => {
				return {
					translation: translationMap[sourceText] as string,
					isCached: false,
				};
			});

			return {
				translations: translatedTexts,
				sourceTexts: ctx.body.sourceTexts,
				sourceLanguage: ctx.body.sourceLanguage,
				targetLanguage: ctx.body.targetLanguage,
				context: ctx.body.context ?? null,
			};
		},
		{
			body: t.Object({
				sourceTexts: t.Array(t.String()),
				sourceLanguage: t.String(),
				targetLanguage: t.String(),
				context: t.Optional(t.String()),
			}),
			response: t.Object({
				translations: t.Array(
					t.Object({
						translation: t.String(),
						isCached: t.Boolean(),
					}),
				),
				sourceTexts: t.Array(t.String()),
				sourceLanguage: t.String(),
				targetLanguage: t.String(),
				context: t.Nullable(t.String()),
			}),
			afterResponse: async (ctx) => {
				if (!ctx.apiKey) {
					throw HttpError.Unauthorized(
						"Please signin and use a project api key",
					);
				}
				const projectId = ctx.apiKey.projectId;
				if (!projectId) {
					throw HttpError.Unauthorized("Missing project id");
				}

				// check if response of cached, else save to db
				const notCachedTranslations = ctx.response.translations.filter(
					(t) => !t.isCached,
				);

				if (notCachedTranslations.length === 0) {
					return;
				}

				const dbPromises = [];

				for (let i = 0; i < notCachedTranslations.length; i++) {
					const sourceText = ctx.body.sourceTexts[i];
					const translation = notCachedTranslations[i].translation;

					// upsert translation
					dbPromises.push(
						upsertTranslation({
							db: ctx.db,
							sourceText: sourceText,
							translation: translation,
							sourceLanguage: ctx.body.sourceLanguage,
							targetLanguage: ctx.body.targetLanguage,
							projectId: projectId,
						}),
					);
				}

				await Promise.all(dbPromises);

				await ctx.cache.set({
					key: JSON.stringify({
						sourceTexts: ctx.body.sourceTexts,
						sourceLanguage: ctx.body.sourceLanguage,
						targetLanguage: ctx.body.targetLanguage,
						context: ctx.body.context,
						projectId: projectId,
					}),
					value: ctx.response.translations,
					ttl: env.CACHE_TTL,
				});
			},
		},
	);

export const upsertTranslation = async (params: {
	db: PrismaClient;
	sourceText: string;
	translation: string;
	sourceLanguage: string;
	targetLanguage: string;
	projectId: string;
}) => {
	const dbKeySourceLanguage = languageToDbCode({
		languageCode: params.sourceLanguage,
	});
	const dbKeyTargetLanguage = languageToDbCode({
		languageCode: params.targetLanguage,
	});

	const dbTranslation = await params.db.translation.findFirst({
		where: {
			projectId: params.projectId,
			[dbKeySourceLanguage]: params.sourceText,
		},
	});

	if (dbTranslation) {
		await params.db.translation.update({
			where: {
				id: dbTranslation.id,
			},
			data: {
				[dbKeyTargetLanguage]: params.translation,
			},
		});
		return;
	}

	await params.db.translation.create({
		data: {
			projectId: params.projectId,
			[dbKeySourceLanguage]: params.sourceText,
			[dbKeyTargetLanguage]: params.translation,
		},
	});
};
