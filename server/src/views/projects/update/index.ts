import { Elysia, type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const UpdateProject = t.Partial(
	t.Pick(ProjectPlain, ["name", "description"]),
);
export type UpdateProject = Static<typeof UpdateProject>;

export const updateProject = new Elysia({
	name: "update-project-router",
	detail: {
		description: "Update a project by ID",
		summary: "Update a project by ID",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.patch(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbProject = await ctx.db.project.update({
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
				data: ctx.body,
			});

			return dbProject;
		},
		{
			body: UpdateProject,
			response: ProjectPlain,
		},
	);
