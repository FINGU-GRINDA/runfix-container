import { UserRole } from "@prisma/client";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { UserPlain } from "../../../../prisma/schema/prismabox/User";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const deleteUserRouter = new Elysia({
	name: "delete-user-router",
	detail: {
		description: "Delete a user by ID",
		summary: "Delete a user by ID",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.delete(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			// can only delete if user is admin or owner
			if (ctx.user.role !== UserRole.ADMIN || ctx.user.id !== ctx.params.id) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbUser = await ctx.db.user.delete({
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
