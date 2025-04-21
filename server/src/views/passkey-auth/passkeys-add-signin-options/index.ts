import type { PasskeyAuth } from "@prisma/client";
// @ts-expect-error wrong types
import { generateRegistrationOptions } from "@simplewebauthn/server";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { env } from "../../../config";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { jwtPlugin } from "../../../procedures/stateless/jwt-plugin";
import { parseValuePlugin } from "../../../procedures/stateless/parse-value-plugin";
import { WebAuthnRegistrationOptionsSchema } from "../../../procedures/stateless/passkey-plugin";

export const addPasskeySigninOptionsRouter = new Elysia({
	name: "add-passkey-signin-options-router",
	detail: {
		description: "Add passkey signin options",
		summary: "Add passkey signin options",
	},
})
	.use(jwtPlugin)
	.use(authenticateUserPlugin)
	.use(parseValuePlugin)
	.post(
		"/add-signin-options",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in first");
			}

			const dbUser = await ctx.db.user.findUnique({
				where: {
					id: ctx.user.id,
				},
				include: {
					EmailAuths: true,
					PasskeyAuths: true,
				},
			});

			if (!dbUser) {
				throw HttpError.Unauthorized("User not found");
			}

			const userPasskeys: PasskeyAuth[] = dbUser.PasskeyAuths;

			const options: PublicKeyCredentialCreationOptionsJSON =
				await generateRegistrationOptions({
					rpName: env.ISSUER,
					rpID: env.ISSUER,
					userName: dbUser.EmailAuths[0].emailAddress,
					userID: Buffer.from(dbUser.id),
					// Don't prompt users for additional information about the authenticator
					// (Recommended for smoother UX)
					attestationType: "none",
					// Prevent users from re-registering existing authenticators
					excludeCredentials: userPasskeys.map((passkey) => ({
						id: passkey.id,
						// Optional
						// transports: passkey.transports,
					})),
					// See "Guiding use of authenticators via authenticatorSelection" below
					authenticatorSelection: {
						// Defaults
						residentKey: "preferred",
						userVerification: "preferred",
						// Optional
						authenticatorAttachment: "cross-platform",
					},
					userDisplayName: dbUser.EmailAuths[0].emailAddress,
				});

			// sign these options
			const signedOptionsToken = await ctx.jwt.sign({
				payload: {
					options: options,
				},
			});

			// attach options to user
			ctx.cookie.passkeyRegisterOptionsToken.set({
				value: signedOptionsToken,
				httpOnly: true,
				secure: true,
			});

			return ctx.parseValue(WebAuthnRegistrationOptionsSchema, options);
		},
		{
			response: WebAuthnRegistrationOptionsSchema,
		},
	);
