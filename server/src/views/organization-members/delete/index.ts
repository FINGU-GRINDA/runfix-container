import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

import { OrganizationMemberRole, UserRole } from "@prisma/client";
import { OrganizationMemberPlain } from "../../../../prisma/schema/prismabox/OrganizationMember";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const deleteRouter = new Elysia({
	detail: {
		description:
			"Delete an organization member. Only organization owners and admins can perform this action.",
		summary: "Delete",
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

			const dbUserOrganizationMember = await ctx.db.$transaction(async (tx) => {
				// Check user organization role
				const isAppAdmin = ctx.user.role === UserRole.ADMIN;

				if (!isAppAdmin) {
					const dbUserOrganizationAdminOrOwnerMember =
						await tx.organizationMember.findFirst({
							where: {
								userId: ctx.user.id,
								role: {
									in: [
										OrganizationMemberRole.OWNER,
										OrganizationMemberRole.ADMIN,
									],
								},
							},
						});
					if (!dbUserOrganizationAdminOrOwnerMember) {
						throw HttpError.Forbidden(
							"You do not have permission to delete this organization member",
						);
					}
				}

				// Delete organization member
				const dbUserOrganizationMember = await tx.organizationMember.delete({
					where: {
						id: ctx.params.id,
					},
				});

				return dbUserOrganizationMember;
			});

			return dbUserOrganizationMember;
		},
		{
			response: t.Nullable(OrganizationMemberPlain),
		},
	);
