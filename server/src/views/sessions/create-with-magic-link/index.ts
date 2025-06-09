import { OrganizationMemberRole, UserRole } from "@prisma/client";
import Elysia, { t, type Static } from "elysia";
import { HttpError } from "elysia-http-error";
import { EmailAuthPlain } from "../../../../prisma/schema/prismabox/EmailAuth";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { jwtPlugin } from "../../../procedures/stateless/jwt-plugin";
import { parseValuePlugin } from "../../../procedures/stateless/parse-value-plugin";
import { wordsGeneratorPlugin } from "../../../procedures/stateless/words-generator-plugin";

export const createWithMagicLinkRouter = new Elysia({
	detail: {
		description:
			"Create a new session with magic link from `/email-auth/signin-with-magic-link`",
		summary: "Create session with magic link",
	},
})
	.use(jwtPlugin)
	.use(databasePlugin)
	.use(parseValuePlugin)
	.use(wordsGeneratorPlugin)
	.get(
		"/create-with-magic-link",
		async (ctx) => {
			const token = ctx.query.token;

			// verify token
			const payload = await ctx.jwt.verify({ token: token });

			// parse email auth
			const emailAuth = ctx.parseValue(EmailAuthPlain, payload.emailAuth);

			// only token that's exact match (latest magic link) is valid
			const emailAuthForMagicLink = await ctx.db.emailAuth.findFirst({
				where: {
					id: emailAuth.id,
					verificationSendAt: emailAuth.verificationSendAt,
					updatedAt: emailAuth.updatedAt,
				},
			});

			if (!emailAuthForMagicLink) {
				throw HttpError.BadRequest("Please use the latest magic link");
			}

			const dbSession = await ctx.db.$transaction(
				async (tx) => {
					// check if email auth is connected to user

					// if there's no user attached to the email auth, we create one
					if (!emailAuth.userId) {
						const [firstName, lastName] = ctx.generateRandomName();

						const dbUser = await tx.user.create({
							data: {
								firstName: firstName,
								lastName: lastName,
								role: UserRole.USER,
								EmailAuths: {
									connect: {
										id: emailAuth.id,
									},
								},
								OrganizationMembers: {
									create: {
										role: OrganizationMemberRole.OWNER,
										Organization: {
											create: {
												name: "Default Organization",
												description: "Default Organization",
												Projects: {
													create: {
														name: "Default Project",
														description: "Default Project",
													},
												},
											},
										},
									},
								},
							},
						});

						emailAuth.userId = dbUser.id;
					} else {
						await tx.user.update({
							where: {
								id: emailAuth.userId,
							},
							data: {
								EmailAuths: {
									connect: {
										id: emailAuth.id,
									},
								},
							},
						});
					}

					// we create session
					const dbSession = await tx.session.create({
						data: {
							headers: ctx.request.headers.toJSON(),
							ipAddress: ctx.server?.requestIP(ctx.request)?.address,
							userAgent: ctx.request.headers.get("user-agent"),
							userId: emailAuth.userId,
						},
						include: {
							User: true,
						},
						omit: {
							headers: true,
						},
					});

					return dbSession;
				},
				// 1 min
				{ maxWait: 1000 * 60, timeout: 1000 * 60 },
			);

			// prepare token
			const newSessionToken = await ctx.jwt.sign({
				payload: {
					session: dbSession,
				},
			});

			//   set cookie
			ctx.cookie.session.set({
				value: newSessionToken,
				secure: true,
				httpOnly: true,
			});

			// redirect
			return ctx.redirect(ctx.query.redirectUrl);
		},
		{
			query: t.Object({
				token: t.String(),
				redirectUrl: t.String(),
			}),
		},
	);
