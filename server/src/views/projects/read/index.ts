import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readProject = new Elysia({
	name: "read-project-router",
	detail: {
		description: "Get a project by ID",
		summary: "Get a project by ID",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbProject = await ctx.db.project.findUnique({
				where: {
					id: ctx.params.id,
					Organization: {
						OrganizationMembers: {
							some: {
								userId: ctx.user.id,
							},
						},
					},
				},
			});

			return dbProject;
		},
		{
			response: t.Nullable(ProjectPlain),
		},
	);
