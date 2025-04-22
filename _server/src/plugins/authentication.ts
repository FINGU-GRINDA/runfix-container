import Elysia, { Static, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { HttpError } from "elysia-http-error";
import { prisma } from "../deps/prisma";
import { UserPlain } from "../../prisma/prismabox/User";
import { ProjectPlain } from "../../prisma/prismabox/Project";

export const SessionUserSchema = UserPlain;

export type SessionUser = Static<typeof SessionUserSchema>;

export const SessionProjectSchema = ProjectPlain;

export type SessionProject = Static<typeof SessionProjectSchema>;

export const tokenSessionPlugin = new Elysia()
	.guard({
		cookie: t.Object({
			session: t.Optional(t.String()),
		}),
	})
	.as("plugin");

export const authenticateUser = new Elysia({
	name: "authenticateUser",
})
	.use(tokenSessionPlugin)
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	.resolve(async (ctx) => {
		if (!ctx.cookie.session.value) {
			return {
				user: undefined,
			};
		}

		const decodedToken = await ctx.jwt.verify(ctx.cookie.session.value);

		if (!decodedToken) {
			throw HttpError.Unauthorized("Invalid token");
		}

		if (!decodedToken.sub) {
			throw HttpError.Unauthorized("Invalid token");
		}

		const user = JSON.parse(decodedToken.sub) as SessionUser;

		return {
			user: user,
		};
	})
	.as("plugin");

export const apiKeyPlugin = new Elysia()
	.guard({
		headers: t.Object({
			"api-key": t.String(),
		}),
	})
	.as("plugin");

export const authenticateApiKeyProject = new Elysia({
	name: "authenticateApiKeyProject",
})
	.use(apiKeyPlugin)
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	.resolve(async (ctx) => {
		const token = ctx.headers["api-key"];

		if (!token) {
			throw HttpError.Unauthorized("Missing API key");
		}

		const decodedToken = await ctx.jwt.verify(token);

		if (!decodedToken) {
			throw HttpError.Unauthorized("Invalid API key");
		}

		if (!decodedToken.sub) {
			throw HttpError.Unauthorized("Invalid API key");
		}

		const project = JSON.parse(decodedToken.sub) as SessionProject;

		return {
			project: project,
		};
	})
	.onAfterResponse(async (ctx) => {
		const token = ctx.headers["api-key"];

		if (!token) {
			throw HttpError.Unauthorized("Missing API key");
		}

		// increment api key usage
		await prisma.apiKey.update({
			where: {
				key: token,
			},
			data: {
				usageCount: {
					increment: 1,
				},
			},
		});
	})
	.as("plugin");
