import { OrganizationMemberRole } from "@prisma/client";
import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const deleteOrganizationRouter = new Elysia({
	name: "delete-organization-router",
	detail: {
		description:
			"Delete an organization. Only organization owners can perform this action.",
		summary: "Delete an organization",
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

			const member = dbOrganization.OrganizationMembers[0];
			if (!member || member.role !== OrganizationMemberRole.OWNER) {
				throw HttpError.Unauthorized(
					"Only organization owners can delete organizations",
				);
			}

			const deletedOrganization = await ctx.db.organization.delete({
				where: {
					id: ctx.params.id,
				},
			});

			return deletedOrganization;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			response: t.Object({
				id: t.String(),
				name: t.String(),
				description: t.Optional(t.String()),
				createdAt: t.Date(),
				updatedAt: t.Date(),
			}),
		},
	);
