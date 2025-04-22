import Elysia from "elysia";
import { HttpError } from "elysia-http-error";
import { EmailAuthPlain } from "../../../../prisma/schema/prismabox/EmailAuth";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const deleteEmailAuthRouter = new Elysia({
	name: "delete-email-auth-router",
	detail: {
		description: "Delete email auth",
		summary: "Delete email auth",
	},
})
	.use(authenticateUserPlugin)
	.delete(
		":id",
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
