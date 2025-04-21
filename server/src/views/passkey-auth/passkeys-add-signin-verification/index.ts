import {
	// @ts-expect-error wrong types
	type VerifiedRegistrationResponse,
	// @ts-expect-error wrong types
	verifyRegistrationResponse,
} from "@simplewebauthn/server";
import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { env } from "../../../config";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { databasePlugin } from "../../../procedures/stateful/database-plugin";
import { passkeyRegisterOptionsCookiePlugin } from "../../../procedures/stateless/passkey-plugin";
import { wordsGeneratorPlugin } from "../../../procedures/stateless/words-generator-plugin";

export const addPasskeySigninVerificationRouter = new Elysia({
	name: "add-passkey-signin-verification-router",
	detail: {
		description: "Add passkey signin verification",
		summary: "Add passkey signin verification",
	},
})
	.use(passkeyRegisterOptionsCookiePlugin)
	.use(databasePlugin)
	.use(authenticateUserPlugin)
	.use(wordsGeneratorPlugin)
	.post(
		"/add-signin-verification",
		async (ctx) => {
			ctx.cookie.passkeyRegisterOptionsToken.remove();

			if (!ctx.passkeyRegisterOptions) {
				throw HttpError.Unauthorized("Passkey registration not found");
			}

			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in first");
			}

			try {
				const verification: VerifiedRegistrationResponse =
					await verifyRegistrationResponse({
						response: ctx.body,
						expectedChallenge: ctx.passkeyRegisterOptions?.challenge,
						expectedOrigin: env.CLIENT_BASE_URL,
						expectedRPID: env.ISSUER,
					});

				if (!verification.verified) {
					throw HttpError.BadRequest("Failed to verify passkey, not verified");
				}
				const { registrationInfo } = verification;

				if (!registrationInfo) {
					throw HttpError.BadRequest(
						"Failed to verify passkey, missing registration info",
					);
				}

				const { credential, credentialDeviceType, credentialBackedUp } =
					registrationInfo;

				await ctx.db.passkeyAuth.create({
					data: {
						id: credential.id,
						counter: credential.counter,
						deviceType: credentialDeviceType,
						backedUpAt: new Date(),
						publicKey: credential.publicKey,
						webAuthnUserId: ctx.passkeyRegisterOptions?.user.id as string,
						transports: JSON.stringify(credential.transports),
						isBackupEligible: credentialBackedUp,
						userId: ctx.user.id as string,
					},
				});

				return {
					message: "Passkey added successfully",
				};
			} catch (error) {
				console.error("Error verifying passkey:", error);
				return {
					message: "Failed to verify passkey",
				};
			}
		},
		{
			body: t.Object({
				id: t.String(),
				rawId: t.String(),
				response: t.Object({
					attestationObject: t.String(),
					clientDataJSON: t.String(),
					transports: t.Array(t.String()),
					publicKeyAlgorithm: t.Number(),
					publicKey: t.String(),
					authenticatorData: t.String(),
				}),
				type: t.Literal("public-key"),
				clientExtensionResults: t.Object({
					credProps: t.Object({
						rk: t.Boolean(),
					}),
				}),
				authenticatorAttachment: t.Optional(
					t.Union([t.Literal("platform"), t.Literal("cross-platform")]),
				),
			}),
			response: t.Object({
				message: t.String(),
			}),
		},
	);
