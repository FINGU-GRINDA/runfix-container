import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { passkeyAuthenticateOptionsCookiePlugin } from "../../../procedures/stateless/passkey-plugin";

import {
	// @ts-expect-error wrong types
	type AuthenticationResponseJSON,
	// @ts-expect-error wrong types
	verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { env } from "../../../config";

export const createWithPasskeyRouter = new Elysia({
	name: "create-with-passkey-router",
	detail: {
		description: "Create session with passkey",
		summary: "Create session with passkey",
	},
})
	.use(passkeyAuthenticateOptionsCookiePlugin)
	.use(databasePlugin)
	.post(
		"/create-with-passkey",
		async (ctx) => {
			ctx.cookie.passkeyAuthenticateOptionsToken.remove();

			if (!ctx.passkeyAuthenticateOptions) {
				throw HttpError.Unauthorized("Passkey authentication not found");
			}

			// First, fetch the passkey credential from the database using the credential ID
			const credentialID = ctx.body.id;

			const passkeyAuth = await ctx.db.passkeyAuth.findFirst({
				where: {
					id: credentialID,
				},
			});

			if (!passkeyAuth) {
				throw HttpError.NotFound("Passkey credential not found");
			}

			// Now we can verify the authentication response
			const verification = await verifyAuthenticationResponse({
				response: ctx.body as AuthenticationResponseJSON,
				expectedChallenge: ctx.passkeyAuthenticateOptions.challenge,
				expectedOrigin: env.CLIENT_BASE_URL,
				expectedRPID: env.ISSUER,
				credential: {
					id: passkeyAuth.id,
					publicKey: passkeyAuth.publicKey,
					counter: passkeyAuth.counter,
				},
			});

			if (!verification.verified) {
				throw HttpError.Unauthorized("Failed to verify passkey authentication");
			}

			// Update the passkey counter to prevent replay attacks
			const dbSession = await ctx.db.$transaction(
				async (tx) => {
					if (!passkeyAuth.userId) {
						throw HttpError.Unauthorized(
							"Passkey credential not associated with a user",
						);
					}

					const promises = [];
					promises.push(
						tx.passkeyAuth.update({
							where: { id: passkeyAuth.id },
							data: { counter: verification.authenticationInfo.newCounter },
						}),
					);

					// Create a new session for this user
					promises.push(
						tx.session.create({
							data: {
								headers: ctx.request.headers.toJSON(),
								userId: passkeyAuth.userId,
								ipAddress: ctx.server?.requestIP(ctx.request)?.address,
								userAgent: ctx.request.headers.get("user-agent"),
							},
							include: {
								User: true,
							},
							omit: {
								headers: true,
							},
						}),
					);

					const [, newSession] = await Promise.all(promises);
					return newSession;
				},
				// 1 min
				{ maxWait: 1000 * 60, timeout: 1000 * 60 },
			);

			// sign session token
			const signedSessionToken = await ctx.jwt.sign({
				payload: {
					session: dbSession,
				},
			});

			// attach session token to user
			ctx.cookie.session.set({
				value: signedSessionToken,
				httpOnly: true,
				secure: true,
			});

			// Return success message
			return {
				message: "Successfully authenticated with passkey",
				session: dbSession,
			};
		},
		{
			response: t.Object({
				message: t.String(),
				session: t.Any(),
			}),
			body: t.Object({
				id: t.String(),
				rawId: t.String(),
				response: t.Object({
					clientDataJSON: t.String(),
					authenticatorData: t.String(),
					signature: t.String(),
					userHandle: t.Optional(t.String()),
				}),
				type: t.String(),
				clientExtensionResults: t.Optional(t.Object({})),
			}),
		},
	);
