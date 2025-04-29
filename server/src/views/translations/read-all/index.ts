import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import {
	allLanguageCodes,
	languageToDbCode,
} from "../../../data/language-codes";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const readAllTranslationRouter = new Elysia({
	detail: {
		description: "Read all translations",
		summary: "Read all",
	},
})
	.use(authenticateUserPlugin)
	.get(
		"",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			if (!ctx.query.projectId) {
				throw HttpError.BadRequest("Missing project ID");
			}

			const filterByText = ctx.query.textFilter;
			const filterByLanguage = ctx.query.languageFilter;

			if (!filterByText) {
				const dbTranslation = await ctx.db.translation.findMany({
					where: {
						projectId: ctx.query.projectId,
					},
				});

				return dbTranslation;
			}

			const whereFilter: Record<
				string,
				{ contains: string; mode: "insensitive" }
			> = {};

			for (const language of filterByLanguage) {
				whereFilter[languageToDbCode({ languageCode: language })] = {
					contains: filterByText,
					mode: "insensitive",
				};
			}

			const dbTranslation = await ctx.db.translation.findMany({
				where: {
					projectId: ctx.query.projectId,
					...whereFilter,
				},
			});

			return dbTranslation;
		},
		{
			query: t.Object({
				projectId: t.String(),
				textFilter: t.Optional(
					t.String({
						description:
							"Text to filter by, used in conjunction with languageFilter",
					}),
				),
				languageFilter: t.Array(
					t.String({
						enum: allLanguageCodes,
						description: "ISO 639-1 language codes",
					}),
					{
						default: allLanguageCodes,
						description: "ISO 639-1 language codes, to be used with textFilter",
					},
				),
			}),
			response: t.Array(TranslationPlain),
		},
	);
