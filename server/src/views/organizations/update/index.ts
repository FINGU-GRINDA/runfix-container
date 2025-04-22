import { OrganizationMemberRole } from "@prisma/client";
import { Elysia, type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationPlain } from "../../../../prisma/schema/prismabox/Organization";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const UpdateOrganization = t.Partial(
	t.Pick(OrganizationPlain, ["name", "description"]),
);

export type UpdateOrganization = Static<typeof UpdateOrganization>;

export const updateOrganizationRouter = new Elysia({
	name: "update-organization-router",
	detail: {
		description:
			"Update an organization's details. Only organization owners can perform this action.",
		summary: "Update an organization's details",
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
					"Only organization owners can update organization details",
				);
			}

			const updatedOrganization = await ctx.db.organization.update({
				where: {
					id: ctx.params.id,
				},
				data: ctx.body,
			});

			return updatedOrganization;
		},
		{
			body: UpdateOrganization,
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
