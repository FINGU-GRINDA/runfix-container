import Elysia from "elysia";
import { type Static, t } from "elysia";
import { jwtPlugin } from "./jwt-plugin";
import { parseValuePlugin } from "./parse-value-plugin";

// WebAuthn registration options schema
const PublicKeyCredentialParameterSchema = t.Object({
	alg: t.Number(),
	type: t.Literal("public-key"),
});

const RelyingPartySchema = t.Object({
	name: t.String(),
	id: t.String(),
});

const UserSchema = t.Object({
	id: t.String(),
	name: t.String(),
	displayName: t.String(),
});

const AuthenticatorSelectionCriteriaSchema = t.Object({
	residentKey: t.Union([
		t.Literal("discouraged"),
		t.Literal("preferred"),
		t.Literal("required"),
	]),
	userVerification: t.Union([
		t.Literal("discouraged"),
		t.Literal("preferred"),
		t.Literal("required"),
	]),
	authenticatorAttachment: t.Optional(
		t.Union([t.Literal("platform"), t.Literal("cross-platform")]),
	),
	requireResidentKey: t.Boolean(),
});

const ExtensionsSchema = t.Object({
	credProps: t.Boolean(),
});

export const WebAuthnRegistrationOptionsSchema = t.Object({
	challenge: t.String(),
	rp: RelyingPartySchema,
	user: UserSchema,
	pubKeyCredParams: t.Array(PublicKeyCredentialParameterSchema),
	timeout: t.Number(),
	attestation: t.Union([
		t.Literal("none"),
		t.Literal("indirect"),
		t.Literal("direct"),
		t.Literal("enterprise"),
	]),
	excludeCredentials: t.Array(t.Any()),
	authenticatorSelection: AuthenticatorSelectionCriteriaSchema,
	extensions: ExtensionsSchema,
	hints: t.Array(t.String()),
});

export type WebAuthnRegistrationOptions =
	typeof WebAuthnRegistrationOptionsSchema.static;

export const passkeyRegisterOptionsCookiePlugin = new Elysia({
	name: "passkey-register-options-cookie",
	detail: {
		description: "Passkey register options cookie",
		summary: "Passkey register options cookie",
	},
})
	.guard({
		cookie: t.Object({
			passkeyRegisterOptionsToken: t.Optional(t.String()),
		}),
	})
	.use(jwtPlugin)
	.use(parseValuePlugin)
	.resolve(async (ctx) => {
		const passkeyOptionsToken = ctx.cookie.passkeyRegisterOptionsToken.value;

		if (!passkeyOptionsToken) {
			return {
				passkeyRegisterOptions: null,
			};
		}

		const tokenPayload = await ctx.jwt.verify({ token: passkeyOptionsToken });

		const passkeyOptions = ctx.parseValue(
			WebAuthnRegistrationOptionsSchema,
			tokenPayload.options,
		);

		return {
			passkeyRegisterOptions: passkeyOptions,
		};
	})
	.as("plugin");

// Schema for WebAuthn Authentication Options (for signing in with existing passkeys)
export const PasskeyAuthenticateOptionsSchema = t.Object({
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

export type PasskeyAuthenticateOptions = Static<
	typeof PasskeyAuthenticateOptionsSchema
>;

export const passkeyAuthenticateOptionsCookiePlugin = new Elysia({
	name: "passkey-authenticate-options-cookie",
	detail: {
		description: "Passkey authenticate options cookie",
		summary: "Passkey authenticate options cookie",
	},
})
	.guard({
		cookie: t.Object({
			passkeyAuthenticateOptionsToken: t.Optional(t.String()),
		}),
	})
	.use(jwtPlugin)
	.resolve(async (ctx) => {
		const passkeyOptionsToken =
			ctx.cookie.passkeyAuthenticateOptionsToken.value;

		if (!passkeyOptionsToken) {
			return {
				passkeyAuthenticateOptions: null,
			};
		}

		const tokenPayload = await ctx.jwt.verify({ token: passkeyOptionsToken });

		const passkeyOptions = tokenPayload.options;

		return {
			passkeyAuthenticateOptions: passkeyOptions as PasskeyAuthenticateOptions,
		};
	})
	.as("plugin");
