import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const readAllTranslationRouter = new Elysia({
	prefix: "/translations",
	tags: ["Translations"],
	name: "read-all-translation-router",
	detail: {
		description: "Read all translations",
		summary: "Read all translations",
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

			const dbTranslations = await ctx.db.translation.findMany({
				where: {
					projectId: ctx.query.projectId,
				},
			});

			return dbTranslations;
		},
		{
			query: t.Object({
				projectId: t.String(),
			}),
			response: t.Array(TranslationPlain),
		},
	);
