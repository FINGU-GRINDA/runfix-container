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
	CLIENT_BASE_URL: Type.String({
		examples: ["http://localhost:3000", "https://demo.hanalangconnect.site"],
	}),
	AUTH_TOKEN_EXPIRY_DURATION_MINUTES: Type.Number({ default: 60 }),
	SERVER_BASE_URL: Type.String({
		examples: ["http://localhost:8000", "https://api.hanalangconnect.site"],
	}),
	ISSUER: Type.String({
		examples: ["localhost", "hanalangconnect.site"],
	}),

	// MAIL
	MAIL_DOMAIN: Type.String({
		examples: ["hanalangconnect.site"],
	}),

	//   AI
	OPENAI_API_KEY: Type.String(),
	OPENROUTER_API_KEY: Type.String(),
	OPENROUTER_BASE_URL: Type.String({ default: "https://openrouter.ai/api/v1" }),
	ALIBABA_API_KEY: Type.String(),
	ALIBABA_BASE_URL: Type.String({
		default: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
	}),

	//   EMAIL SERVICES
	RESEND_API_KEY: Type.String(),

	// TESTING
	TEST_API_KEY: Type.Optional(Type.String()),
});

export const env = Value.Parse(EnvSchema, process.env);
