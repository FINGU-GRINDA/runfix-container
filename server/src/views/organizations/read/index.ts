import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationPlain } from "../../../../prisma/schema/prismabox/Organization";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readRouter = new Elysia({
	detail: {
		description: "Get organization by id",
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
