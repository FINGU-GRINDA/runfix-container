import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllRouter = new Elysia({
	detail: {
		description: "Get all projects in an organization",
		summary: "Read all",
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

			const dbProjects = await ctx.db.project.findMany({
				where: {
					Organization: {
						OrganizationMembers: {
							some: {
								userId: ctx.user.id,
							},
						},
						id: ctx.query.organizationId,
					},
				},
			});

			return dbProjects;
		},
		{
			query: t.Object({
				organizationId: t.String(),
			}),
			response: t.Array(ProjectPlain),
		},
	);
