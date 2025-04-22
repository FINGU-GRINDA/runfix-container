import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const signOutAllRouter = new Elysia({
	detail: {
		description: "Sign out from all sessions",
		summary: "Sign out from all sessions",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.post(
		"/sign-out-all-sessions",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			ctx.cookie.session.remove();

			await ctx.db.session.updateMany({
				where: {
					userId: ctx.user.id,
					invalidatedAt: null,
				},
				data: {
					invalidatedAt: new Date(),
				},
			});

			return {
				message: "Successfully signed out from all sessions",
			};
		},
		{
			response: t.Object({
				message: t.String(),
			}),
		},
	);
