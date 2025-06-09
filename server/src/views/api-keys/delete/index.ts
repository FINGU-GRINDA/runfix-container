import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ApiKeyPlain } from "../../../../prisma/schema/prismabox/ApiKey";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { parseValue } from "../../../procedures/stateless/parse-value-plugin";

export const deleteRouter = new Elysia({
	detail: {
		description: "Delete an API key",
		summary: "Delete",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.delete(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Unauthorized");
			}

			const dbApiKey = await ctx.db.apiKey.delete({
				where: {
					id: ctx.params.id,
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

			return {
				writeAccess: true,
				readAccess: true,
				createdAt: dbApiKey.createdAt,
				updatedAt: dbApiKey.updatedAt,
				lastFourChars: dbApiKey.lastFourChars,
				usageCount: Number(dbApiKey.usageCount),
				id: dbApiKey.id,
				projectId: dbApiKey.projectId,
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			response: ApiKeyPlain,
		},
	);
