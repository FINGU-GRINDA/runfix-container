import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationPlain } from "../../../../prisma/schema/prismabox/Organization";
import { prisma } from "../../../data/prisma";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readOrganizationRouter = new Elysia({
	name: "read-organization-router",
	detail: {
		description: "Get organization by id",
		summary: "Get organization by id",
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

			const dbOrganization = await ctx.db.organization.findUnique({
				where: {
					id: ctx.params.id,
				},
				include: {
					OrganizationMembers: {
						where: {
							userId: ctx.user.id,
						},
					},
				},
			});

			if (!dbOrganization) {
				throw HttpError.NotFound("Organization not found");
			}

			return dbOrganization;
		},
		{
			response: t.Nullable(OrganizationPlain),
			params: t.Object({
				id: t.String(),
			}),
		},
	);
