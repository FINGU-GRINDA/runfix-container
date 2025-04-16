import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export const ClientEnvSchema = Type.Object(
  {
    NEXT_PUBLIC_SERVER_BASE_URL: Type.String({
      default: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    }),
  },
  { readOnly: true }
);

export const clientEnv = Value.Parse(ClientEnvSchema, process.env);
