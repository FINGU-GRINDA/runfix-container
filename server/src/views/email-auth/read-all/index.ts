import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { EmailAuthPlain } from "../../../../prisma/schema/prismabox/EmailAuth";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllRouter = new Elysia({
	detail: {
		description: "Read all email auth router",
		summary: "Read all",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			if (ctx.query.userId && ctx.query.userId !== ctx.user.id) {
				throw HttpError.Unauthorized("You are not allowed to read this");
			}

			const dbAuth = await ctx.db.emailAuth.findMany({
				where: {
					userId: ctx.user.id,
				},
			});

			return dbAuth;
		},
		{
			response: t.Array(EmailAuthPlain),
			query: t.Object({
				userId: t.String({ description: "Filter by user ID" }),
			}),
		},
	);
