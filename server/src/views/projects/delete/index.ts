import Elysia from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const deleteProject = new Elysia({
	name: "delete-project-router",
	detail: {
		description: "Delete a project by ID",
		summary: "Delete a project by ID",
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

			const dbProject = await ctx.db.project.delete({
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
			response: ProjectPlain,
		},
	);
