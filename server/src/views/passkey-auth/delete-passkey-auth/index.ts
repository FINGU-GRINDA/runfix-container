import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { PasskeyAuthPlain } from "../../../../prisma/schema/prismabox/PasskeyAuth";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const deletePasskeyAuthRouter = new Elysia({
	name: "delete-passkey-auth-router",
	detail: {
		description: "Delete passkey auth",
		summary: "Delete passkey auth",
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

			const dbAuth = await ctx.db.passkeyAuth.delete({
				where: {
					userId: ctx.user.id,
					id: ctx.params.id,
				},
			});

			return dbAuth;
		},
		{ response: PasskeyAuthPlain },
	);
