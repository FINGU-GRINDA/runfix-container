import Elysia, { t } from "elysia";
import { SessionUserSchema } from "../../../procedures/stateful/authenticate-user-plugin";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { parseValue } from "../../../procedures/stateless/parse-value-plugin";

export const whoAmISessionRouter = new Elysia({
	detail: {
		description: "Get the current session / user information",
		summary: "Get current session / user",
	},
})
	.use(authenticateUserPlugin)
	.post(
		"/who-am-i",
		async (ctx) => {
			if (!ctx.session) {
				return {
					data: null,
					message: "No session found",
				};
			}
			return {
				data: parseValue(SessionUserSchema, ctx.session),
				message: "Session found",
			};
		},
		{
			response: t.Object({
				data: t.Nullable(SessionUserSchema),
				message: t.String(),
			}),
		},
	);
