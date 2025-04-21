import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
	// LOGGING
	AXIOM_TOKEN: Type.String(),
	AXIOM_DATASET: Type.String(),
	AXIOM_URL: Type.String(),

	//   DATABASE
	DATABASE_URL: Type.String(),
	REDIS_URL: Type.String(),
	CACHE_TTL: Type.Number({ default: 360000 }),

	//   AUTH
	JWT_SECRET: Type.String(),
	CLIENT_DOMAIN: Type.String({
		examples: ["localhost", "hanatranslate.space"],
	}),
	CLIENT_BASE_URL: Type.String({
		examples: ["http://localhost:3000", "https://hanatranslate.space"],
	}),
	AUTH_TOKEN_EXPIRY_DURATION_MINUTES: Type.Number({ default: 60 }),
	ISSUER: Type.String({ default: "hanatranslate.space" }),
	SERVER_BASE_URL: Type.String({
		examples: ["http://localhost:8000", "https://hanatranslate.space"],
	}),
	SERVER_NAME: Type.String({
		default: "Hana Translate",
		examples: ["localhost", "Hana Translate"],
	}),

	//   AI
	OPENAI_API_KEY: Type.String(),

	//   EMAIL SERVICES
	RESEND_API_KEY: Type.String(),
});

export const env = Value.Parse(EnvSchema, process.env);
