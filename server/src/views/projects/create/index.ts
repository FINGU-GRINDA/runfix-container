import Elysia, { type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const CreateProject = t.Pick(ProjectPlain, [
	"name",
	"description",
	"organizationId",
]);

export type CreateProject = Static<typeof CreateProject>;

export const createRouter = new Elysia({
	detail: {
		description: "Create a new project",
		summary: "Create",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.post(
		"",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbProject = await ctx.db.project.create({
				data: {
					name: ctx.body.name,
					description: ctx.body.description,
					organizationId: ctx.body.organizationId,
				},
			});

			return dbProject;
		},
		{
			body: CreateProject,
			response: ProjectPlain,
		},
	);
