import { OrganizationMemberRole, UserRole } from "@prisma/client";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

import { OrganizationMemberPlain } from "../../../../prisma/schema/prismabox/OrganizationMember";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const UpdateOrganizationMemberSchema = t.Partial(
	OrganizationMemberPlain,
	t.Pick(OrganizationMemberPlain, ["role"]),
);

export const updateRouter = new Elysia({
	detail: {
		description: "Update an organization member.",
		summary: "Update",
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
							"You do not have permission to update this organization member",
						);
					}
				}

				// Update organization member
				const dbUserOrganizationMember = await tx.organizationMember.update({
					where: {
						id: ctx.params.id,
					},
					data: ctx.body,
				});

				return dbUserOrganizationMember;
			});

			return dbUserOrganizationMember;
		},
		{
			body: UpdateOrganizationMemberSchema,
			response: t.Nullable(OrganizationMemberPlain),
		},
	);
