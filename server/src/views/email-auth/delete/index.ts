import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { EmailAuthPlain } from "../../../../prisma/schema/prismabox/EmailAuth";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const deleteRouter = new Elysia({
	detail: {
		description: "Delete email auth",
		summary: "Delete",
	},
})
	.use(authenticateUserPlugin)
	.delete(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbAuth = await ctx.db.emailAuth.delete({
				where: {
					userId: ctx.user.id,
					id: ctx.params.id,
				},
			});

			return dbAuth;
		},
		{ response: EmailAuthPlain },
	);
