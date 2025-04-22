import { UserRole } from "@prisma/client";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { UserPlain } from "../../../../prisma/schema/prismabox/User";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { UpdateUser } from "./model";

export const updateRouter = new Elysia({
	detail: {
		description: "Update a user by ID",
		summary: "Update",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.patch(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			// can only edit if user is admin or owner
			if (ctx.user.role !== UserRole.ADMIN || ctx.user.id !== ctx.params.id) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbUser = await ctx.db.user.update({
				where: {
					id: ctx.params.id,
				},
				data: ctx.body,
			});

			return dbUser;
		},
		{
			response: t.Nullable(UserPlain),
			body: UpdateUser,
			params: t.Object({
				id: t.String(),
			}),
		},
	);
