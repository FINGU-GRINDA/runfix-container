import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { PasskeyAuthPlain } from "../../../../prisma/schema/prismabox/PasskeyAuth";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllPasskeyAuthRouter = new Elysia({
	name: "read-all-passkey-auth-router",
	detail: {
		description: "Read all passkey auth",
		summary: "Read all passkey auth",
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

			if (ctx.query.userId !== ctx.user.id) {
				throw HttpError.Unauthorized("You are not allowed to read this");
			}

			const dbAuth = await ctx.db.passkeyAuth.findMany({
				where: {
					userId: ctx.query.userId,
				},
			});

			return dbAuth;
		},
		{
			response: t.Array(PasskeyAuthPlain),
			query: t.Object({ userId: t.String() }),
		},
	);
