import { Type, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
  AXIOM_TOKEN: Type.String(),
  AXIOM_DATASET: Type.String(),
  AXIOM_URL: Type.String(),

  DATABASE_URL: Type.String(),
  REDIS_URL: Type.String(),
  JWT_SECRET: Type.String(),
  CLIENT_DOMAIN: Type.String(),
  CLIENT_RPID: Type.String(),

  OPENAI_API_KEY: Type.String(),

  AUTH_TOKEN_EXPIRY_DURATION_MINUTES: Type.Number(),
  ISSUER: Type.String(),
  SERVER_BASE_URL: Type.String(),
});

type Env = Static<typeof EnvSchema>;

export const env = Value.Parse(EnvSchema, {
  ...process.env,
  AUTH_TOKEN_EXPIRY_DURATION_MINUTES: 1200,
  ISSUER: "Translation API",
});
