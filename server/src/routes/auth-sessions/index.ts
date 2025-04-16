import Elysia, { t } from "elysia";

import { prisma } from "../../deps/prisma";
import { HttpError } from "elysia-http-error";
import {
	authenticateUser,
	SessionUserSchema,
} from "../../plugins/authentication";
import jwt from "@elysiajs/jwt";
import { env } from "../../../config";
import { parseValue } from "../../utils/parse-value";

export const authSessionRouter = new Elysia({
	prefix: "/auth-sessions",
	tags: ["auth-sessions"],
})
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET || "",
		}),
	)
	.post(
		"/create-with-email-sign-in",
		async (ctx) => {
			// authenticate user
			const dbUser = await prisma.user.findFirst({
				where: {
					EmailAuths: {
						some: {
							emailAddress: ctx.body.emailAddress,
						},
					},
				},
				include: {
					EmailAuths: true,
				},
			});

			if (!dbUser) {
				throw HttpError.Unauthorized("User not found");
			}

			const isPasswordVerified = await Bun.password.verify(
				ctx.body.password,
				dbUser.EmailAuths[0].password as string,
			);

			if (!isPasswordVerified) {
				throw HttpError.Unauthorized("Invalid password");
			}

			const expireAt =
				new Date().getTime() +
				env.AUTH_TOKEN_EXPIRY_DURATION_MINUTES * 60 * 1000;

			const sessionUser = parseValue(SessionUserSchema, dbUser);

			// create new access token
			const newToken = await ctx.jwt.sign({
				sub: JSON.stringify(sessionUser),
				exp: expireAt,
			});

			const userAgent = ctx.request.headers.get("user-agent");
			const headers = ctx.request.headers.toJSON();
			const ipAddress = ctx.request.headers.get("x-real-ip");

			// create new access token
			const newSession = await prisma.session.create({
				data: {
					accessToken: newToken,
					userAgent: userAgent!,
					userId: dbUser.id,
					headers: headers,
					ipAddress: ipAddress!,
				},
			});

			ctx.cookie.session.set({
				value: newToken,
				secure: true,
				httpOnly: true,
			});

			return {
				message: "Successfully signed in",
			};
		},
		{
			body: t.Object({
				emailAddress: t.String({ format: "email" }),
				password: t.String(),
			}),
			response: t.Object({
				message: t.String(),
			}),
		},
	)
	.post("/sign-out", async (ctx) => {
		ctx.cookie.session.set({
			value: "",
			secure: true,
		});

		return {
			message: "Successfully signed out",
		};
	})
	.guard((app) =>
		app
			.use(authenticateUser)
			.post(
				"/sign-out",
				async (ctx) => {
					if (!ctx.user) {
						throw HttpError.Unauthorized(
							"User not authenticated, already signed out",
						);
					}

					// invalidate session
					const session = await prisma.session.update({
						where: {
							id: ctx.user.id,
						},
						data: {
							invalidatedAt: new Date(),
						},
					});

					return {
						success: true,
						expiredSession: session,
					};
				},
				{
					response: t.Object({
						success: t.Boolean(),
						expiredSession: t.Any(),
					}),
				},
			)
			.get(
				"/who-am-i",
				async (ctx) => {
					if (!ctx.user) {
						return null;
					}
					return parseValue(SessionUserSchema, ctx.user);
				},
				{
					response: t.Nullable(SessionUserSchema),
				},
			),
	);
