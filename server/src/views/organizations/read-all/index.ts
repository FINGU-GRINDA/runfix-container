import { Elysia, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { OrganizationPlain } from "../../../../prisma/schema/prismabox/Organization";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllRouter = new Elysia({
	detail: {
		description: "Get all organizations the user is a member of",
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

			if (ctx.query.userId !== ctx.user.id) {
				throw HttpError.Forbidden(
					"Not allowed to read other users' organizations",
				);
			}

			const dbOrganizations = await ctx.db.organization.findMany({
				where: {
					OrganizationMembers: {
						some: {
							userId: ctx.user.id,
						},
					},
				},
				take: ctx.query.take,
				skip: ctx.query.skip,
			});

			return dbOrganizations;
		},
		{
			query: t.Object({
				take: t.Optional(t.Number({ default: 10 })),
				skip: t.Optional(t.Number({ default: 0 })),
				userId: t.String(),
			}),
			response: t.Array(OrganizationPlain),
		},
	);
