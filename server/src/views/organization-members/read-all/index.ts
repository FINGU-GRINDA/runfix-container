import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationMemberPlain } from "../../../../prisma/schema/prismabox/OrganizationMember";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllRouter = new Elysia({
	detail: {
		description: "Get all organization members.",
		summary: "Read all",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			const dbOrganizationMembers = await ctx.db.organizationMember.findMany({
				where: {
					organizationId: ctx.query.organizationId,
				},
			});

			return dbOrganizationMembers;
		},
		{
			query: t.Object({
				organizationId: t.String(),
			}),
			response: t.Array(OrganizationMemberPlain),
		},
	);
