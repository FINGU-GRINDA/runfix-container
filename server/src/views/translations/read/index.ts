import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const readRouter = new Elysia({
	prefix: "/translations",
	tags: ["Translations"],
	detail: {
		description: "Read a translation",
		summary: "Read a translation",
	},
})
	.use(authenticateUserPlugin)
	.get(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			if (!ctx.params.id) {
				throw HttpError.BadRequest("Missing translation id");
			}

			const dbTranslation = await ctx.db.translation.findUnique({
				where: {
					id: ctx.params.id,
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

			if (!dbTranslation) {
				throw HttpError.NotFound("Translation not found");
			}

			return dbTranslation;
		},
		{
			response: TranslationPlain,
			params: t.Object({
				id: t.String(),
			}),
		},
	);
