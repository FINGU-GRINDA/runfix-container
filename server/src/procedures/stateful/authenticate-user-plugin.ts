import Elysia, { type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { Session } from "../../../prisma/schema/prismabox/Session";
import { jwtPlugin } from "../stateless/jwt-plugin";
import { parseValue, parseValuePlugin } from "../stateless/parse-value-plugin";
import { databasePlugin } from "./database-plugin";

export const SessionUserSchema = t.Omit(Session, ["headers"]);

export type SessionUser = Static<typeof SessionUserSchema>;

export const tokenSessionPlugin = new Elysia({
	name: "token-session-plugin",
	detail: {
		description: "Token session plugin",
		summary: "Token session plugin",
	},
})
	.guard({
		cookie: t.Object({
			session: t.Optional(t.String()),
		}),
	})
	.as("plugin");

export const authenticateUserPlugin = new Elysia({
	name: "authenticate-user-plugin",
	detail: {
		description: "Authenticate user plugin",
		summary: "Authenticate user plugin",
	},
})
	.use(tokenSessionPlugin)
	.use(databasePlugin)
	.use(jwtPlugin)
	.use(parseValuePlugin)
	.resolve(async (ctx) => {
		const token = ctx.cookie.session.value;

		if (!token) {
			return {
				user: undefined,
				session: undefined,
			};
		}

		try {
			const verifiedToken = await ctx.jwt.verify({ token: token });
			const session = ctx.parseValue(SessionUserSchema, verifiedToken.session);

			return {
				user: session.User,
				session: session,
			};
		} catch (err) {
			ctx.cookie.session.remove();
			console.warn(`Failed to verify token: ${err}`);
		}

		// we will try decoding token
		let session: SessionUser | undefined;
		try {
			const decodedToken = await ctx.jwt.decode({ token: token });

			session = ctx.parseValue(
				SessionUserSchema,
				decodedToken.session,
			) as unknown as SessionUser;
		} catch (_err) {
			throw HttpError.BadRequest("Invalid token, token is malformed");
		}

		// we will try renewing token, while checking if token is compromised by comparing version
		try {
			const renewedSession = await ctx.db.session.update({
				where: {
					id: session.id,
					version: session.version,
					invalidatedAt: null,
				},
				data: {
					version: { increment: 1 },
					ipAddress: ctx.server?.requestIP(ctx.request)?.address,
					userAgent: ctx.request.headers.get("user-agent"),
					headers: ctx.request.headers,
				},
				include: {
					User: true,
				},
				omit: {
					headers: true,
				},
			});

			const newToken = await ctx.jwt.sign({
				payload: {
					session: renewedSession,
				},
			});

			ctx.cookie.session.set({
				value: newToken,
				secure: true,
				httpOnly: true,
			});

			return {
				user: renewedSession.User,
				session: renewedSession,
			};
		} catch (err) {
			// TODO: notify user that their session has been compromised
			console.error(`Failed to renew token: ${err}`);
			// deactivate session
			await ctx.db.session.update({
				where: {
					id: session.id,
				},
				data: {
					invalidatedAt: new Date(),
				},
			});

			throw HttpError.BadRequest(
				"Token is compromised, please change authentication",
			);
		}
	})
	.as("plugin");
