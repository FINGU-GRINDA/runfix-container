import { z } from "zod";

export const envClientSchema = z.object({
	NEXT_PUBLIC_APP_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_APP_URL as string),
	NEXT_PUBLIC_SERVER_BASE_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_SERVER_BASE_URL as string),
});

export const envClient = envClientSchema.parse(process.env);
