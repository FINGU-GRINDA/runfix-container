import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readRouter = new Elysia({
	detail: {
		description: "Get a project by ID",
		summary: "Read",
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
