// @ts-expect-error wrong types
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import Elysia, { t } from "elysia";
import type { Static } from "elysia";
import { env } from "../../../config";
import { jwtPlugin } from "../../../procedures/stateless/jwt-plugin";
import { PasskeyAuthenticateOptionsSchema } from "../../../procedures/stateless/passkey-plugin";

export const PasskeyRegisterResponseSchema = t.Object({
	challenge: t.String(),
	timeout: t.Optional(t.Number()),
	rpId: t.Optional(t.String()),
	allowCredentials: t.Optional(
		t.Array(
			t.Object({
				id: t.String(),
				type: t.String(),
				transports: t.Optional(t.Array(t.String())),
			}),
		),
	),
	userVerification: t.Optional(t.String()),
	extensions: t.Optional(t.Object({})),
});

export type PasskeyRegisterResponse = Static<
	typeof PasskeyRegisterResponseSchema
>;

export const signinWithPasskeyRouter = new Elysia({
	name: "signin-with-passkey-router",
	detail: {
		description: "Sign in with passkey",
		summary: "Sign in with passkey",
	},
})
	.use(jwtPlugin)
	.post(
		"/signin-with-passkey",
		async (ctx) => {
			const options = await generateAuthenticationOptions({
				rpID: env.ISSUER,
				allowCredentials: [],
			});

			// sign these options
			const signedOptionsToken = await ctx.jwt.sign({
				payload: {
					options: options,
				},
			});

			// attach options to user
			ctx.cookie.passkeyAuthenticateOptionsToken.set({
				value: signedOptionsToken,
				httpOnly: true,
				secure: true,
			});

			// return options
			return options;
		},
		{
			response: PasskeyAuthenticateOptionsSchema,
		},
	);
