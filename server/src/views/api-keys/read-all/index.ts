import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ApiKeyPlain } from "../../../../prisma/schema/prismabox/ApiKey";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllRouter = new Elysia({
	detail: {
		description: "Get all API keys for a specific project",
		summary: "Read all",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"",

		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			if (!ctx.query.projectId) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbApiKeys = await ctx.db.apiKey.findMany({
				where: {
					projectId: ctx.query.projectId,
					Project: {
						Organization: {
							OrganizationMembers: {
								some: {
									userId: ctx.user.id,
								},
							},
						},
					},
				},
			});

			return dbApiKeys.map((apiKey) => ({
				...apiKey,
				usageCount: Number(apiKey.usageCount),
			}));
		},
		{
			query: t.Object({
				projectId: t.String(),
			}),
			response: t.Array(ApiKeyPlain),
		},
	);
