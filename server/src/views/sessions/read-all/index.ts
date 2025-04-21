import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { SessionPlain } from "../../../../prisma/schema/prismabox/Session";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";

export const readAllSessionsRouter = new Elysia({
	name: "read-all-sessions-router",
	detail: {
		description: "Get all user session",
		summary: "Get all sessions",
	},
})
	.use(authenticateUserPlugin)
	.use(databasePlugin)
	.get(
		"",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("User not authenticated");
			}

			const dbSessions = await ctx.db.session.findMany({
				where: {
					userId: ctx.user.id,
					invalidatedAt: ctx.query.onlyActiveSessions
						? { not: null }
						: undefined,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});

			return dbSessions;
		},
		{
			response: t.Array(SessionPlain),
			query: t.Object({
				onlyActiveSessions: t.Optional(t.Boolean({ default: true })),
			}),
		},
	);
