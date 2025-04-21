import { OrganizationMemberRole } from "@prisma/client";
import { Elysia, type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationPlain } from "../../../../prisma/schema/prismabox/Organization";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const CreateOrganization = t.Pick(OrganizationPlain, [
	"name",
	"description",
]);
export type CreateOrganization = Static<typeof CreateOrganization>;

export const createOrganizationRouter = new Elysia({
	name: "create-organization-router",
	detail: {
		description: "Create a new organization",
		summary: "Create a new organization",
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

			const dbOrganization = await ctx.db.organization.create({
				data: {
					...ctx.body,
					OrganizationMembers: {
						create: {
							userId: ctx.user.id,
							role: OrganizationMemberRole.OWNER,
						},
					},
				},
			});

			return dbOrganization;
		},
		{
			body: CreateOrganization,
			response: t.Object({
				id: t.String(),
				name: t.String(),
				description: t.Optional(t.String()),
				createdAt: t.Date(),
				updatedAt: t.Date(),
			}),
		},
	);
