import { z } from "zod";

const configSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  CLIENT_BASE_URL: z.string(),
});

export const config = configSchema.parse(process.env);
console.log({ config });
