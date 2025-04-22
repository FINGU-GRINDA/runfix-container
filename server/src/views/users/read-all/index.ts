import { UserRole } from "@prisma/client";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { UserPlain } from "../../../../prisma/schema/prismabox/User";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllUsersRouter = new Elysia({
	name: "read-all-users-router",
	detail: {
		description: "Get all users",
		summary: "Get all users",
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

			if (ctx.user.role !== UserRole.ADMIN) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbUsers = await ctx.db.user.findMany({
				take: ctx.query.take,
				skip: ctx.query.skip,
			});

			// Transform the response to convert bigint values to numbers
			return dbUsers;
		},
		{
			query: t.Optional(
				t.Object({
					take: t.Optional(t.Number({ default: 10 })),
					skip: t.Optional(t.Number({ default: 0 })),
				}),
			),
			response: t.Array(UserPlain),
		},
	);
