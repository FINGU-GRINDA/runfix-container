import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { UserPlain } from "../../../../prisma/schema/prismabox/User";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readUserRouter = new Elysia({
	name: "read-user-router",
	detail: {
		description: "Get a user by ID",
		summary: "Get a user by ID",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbUser = await ctx.db.user.findUnique({
				where: {
					id: ctx.params.id,
				},
			});

			return dbUser;
		},
		{
			response: t.Nullable(UserPlain),
			params: t.Object({
				id: t.String(),
			}),
		},
	);
