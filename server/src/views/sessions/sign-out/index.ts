import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const signOutSessionRouter = new Elysia({
	name: "sign-out-session-router",
	detail: {
		description: "Sign out the current session",
		summary: "Sign out from current session",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.post(
		"/sign-out-current-session",
		async (ctx) => {
			ctx.cookie.session.remove();
			const session = ctx.session;

			if (!session) {
				throw HttpError.Unauthorized("User not authenticated");
			}

			await ctx.db.session.update({
				where: {
					id: session.id,
					invalidatedAt: null,
				},
				data: {
					invalidatedAt: new Date(),
				},
			});

			return {
				message: "Successfully signed out",
			};
		},
		{
			response: t.Object({
				message: t.String(),
			}),
		},
	);
