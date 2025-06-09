import { z } from "zod";

export const clientConfigSchema = z.object({
	NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
});

export const clientConfig = clientConfigSchema.parse({
	NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
