import Elysia, { type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { prisma } from "../../../data/prisma";

import { ProjectPlain } from "../../../../prisma/schema/prismabox/Project";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const CreateProject = t.Pick(ProjectPlain, [
	"name",
	"description",
	"organizationId",
]);

export type CreateProject = Static<typeof CreateProject>;

export const createProject = new Elysia({
	name: "create-project-router",
	detail: {
		description: "Create a new project",
		summary: "Create a new project",
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
