import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { env } from "../../../config";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { getExpTimestampPlugin } from "../../../procedures/stateless/get-exp-timestamp-plugin";

export const createNewRouter = new Elysia({
	detail: {
		description: "Create a new API key for a project",
		summary: "Create a new API key for a project",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.use(getExpTimestampPlugin)
	.post(
		"/create-new",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbApiKey = await ctx.db.apiKey.create({
				data: {
					projectId: ctx.body.projectId,
					readAccess: ctx.body.readAccess,
					writeAccess: ctx.body.writeAccess,
				},
				include: {
					Project: true,
				},
			});

			if (!dbApiKey) {
				throw HttpError.Internal("Failed to create API key");
			}

			if (!dbApiKey.Project) {
				throw HttpError.Internal("Failed to create API key, no project found");
			}

			// create token
			const newToken = await ctx.jwt.sign({
				payload: {
					apiKey: dbApiKey,
					// 100 years
					exp: ctx.getExpTimestamp({
						seconds:
							Number(env.AUTH_TOKEN_EXPIRY_DURATION_MINUTES) *
							60 *
							24 *
							365 *
							1000,
					}),
				},
			});

			// retrieve last 4 characters of the API key
			const lastFourChars = dbApiKey.id.slice(-4);

			// update API key
			await ctx.db.apiKey.update({
				where: {
					id: dbApiKey.id,
				},
				data: {
					lastFourChars: lastFourChars,
				},
			});

			return {
				apiKey: newToken,
				projectId: dbApiKey.Project.id,
				message: `API key created successfully, to use API key, add "api-key" header with value ${newToken}`,
				readAccess: ctx.body.readAccess,
				writeAccess: ctx.body.writeAccess,
			};
		},
		{
			response: t.Object({
				apiKey: t.String(),
				projectId: t.String(),
				message: t.String(),
				readAccess: t.Boolean(),
				writeAccess: t.Boolean(),
			}),
			body: t.Object({
				projectId: t.String(),
				readAccess: t.Boolean({ default: true, description: "Allow read access" }),
				writeAccess: t.Boolean({ default: true, description: "Allow write access" }),
			}),
		},
	);
