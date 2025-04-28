import Elysia from "elysia";
import { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { cachePlugin } from "../../../procedures/stateful/cache-plugin";

export const deleteAllRouter = new Elysia({
	detail: {
		description: "Delete all translations for a project",
		summary: "Delete all",
	},
})
	.use(authenticateUserPlugin)
	.use(cachePlugin)
	.delete(
		"/delete-all",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbTranslations = await ctx.db.translation.deleteMany({
				where: {
					projectId: ctx.body.projectId,
				},
			});

			await ctx.cache.delete({ key: `*${ctx.body.projectId}*` });

			return {
				deletedCount: dbTranslations.count,
				message: "Translations deleted",
			};
		},
		{
			body: t.Object({
				projectId: t.String(),
			}),
			response: t.Object({
				deletedCount: t.Number(),
				message: t.String(),
			}),
		},
	);
