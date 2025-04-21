import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { env } from "../../../config";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { sendMagicLinkEmailPlugin } from "../../../procedures/stateful/email-plugin";
import { getExpTimestampPlugin } from "../../../procedures/stateless/get-exp-timestamp-plugin";
import { jwtPlugin } from "../../../procedures/stateless/jwt-plugin";

export const signinWithMagicLinkRouter = new Elysia({
	name: "signin-with-magic-link-router",
	detail: {
		description: "Sign in with magic link",
		summary: "Sign in with magic link",
	},
})
	.use(jwtPlugin)
	.use(sendMagicLinkEmailPlugin)
	.use(databasePlugin)
	.use(getExpTimestampPlugin)
	.post(
		"/signin-with-magic-link",
		async (ctx) => {
			// normalize email
			const normalizedEmail = ctx.body.email.toLowerCase();

			// create email auth only if verificationSendAt is older than 1 minute
			const dbEmailAuth = await ctx.db.$transaction(
				async (tx) => {
					// retrieve email auth
					const emailAuth = await tx.emailAuth.findUnique({
						where: {
							emailAddress: normalizedEmail,
						},
					});

					if (!emailAuth || !emailAuth.verificationSendAt) {
						// create email auth
						const newEmailAuth = await tx.emailAuth.create({
							data: {
								emailAddress: normalizedEmail,
								verificationSendAt: new Date(),
							},
						});
						return newEmailAuth;
					}

					// check if verificationSendAt is older than 1 minute
					const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

					if (emailAuth.verificationSendAt > oneMinuteAgo) {
						const secondsRemaining = Math.ceil(
							(emailAuth.verificationSendAt.getTime() + 60_000 - Date.now()) /
								1000,
						);
						throw HttpError.BadRequest(
							`Please wait ${secondsRemaining} seconds before sending another magic link`,
						);
					}

					// update email auth
					const updatedEmailAuth = await tx.emailAuth.update({
						where: {
							emailAddress: normalizedEmail,
						},
						data: {
							verificationSendAt: new Date(),
						},
					});

					return updatedEmailAuth;
				},
				// 1 min
				{ maxWait: 1000 * 60, timeout: 1000 * 60 },
			);

			// create token of email
			const signedToken = await ctx.jwt.sign({
				payload: {
					emailAuth: dbEmailAuth,
					exp: ctx.getExpTimestamp({
						seconds: env.AUTH_TOKEN_EXPIRY_DURATION_MINUTES * 60 * 1000,
					}),
				},
			});

			// send email
			await ctx.sendMagicLinkEmail({
				verificationUrl: `${env.SERVER_BASE_URL}/api/sessions/create-with-magic-link?token=${signedToken}&redirectUrl=${ctx.body.redirectUrl}`,
				to: normalizedEmail,
			});

			return {
				userEmail: normalizedEmail,
				message: "Magic link sent, please check your email to sign in",
			};
		},
		{
			body: t.Object({
				email: t.String(),
				redirectUrl: t.String({ default: `${env.SERVER_BASE_URL}/docs` }),
			}),
			response: t.Object({
				message: t.String(),
				userEmail: t.String(),
			}),
		},
	)
	.as("plugin");
