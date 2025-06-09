// env-server.ts
import { z } from "zod";
import { envClient, envClientSchema } from "./env-client";

// Define server-specific environment variables
const serverSchema = z.object({
	NEXT_PUBLIC_APP_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_APP_URL as string),
	NEXT_PUBLIC_SERVER_BASE_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_SERVER_BASE_URL as string),
});

// Merge with client schema
export const envServerSchema = serverSchema.merge(envClientSchema);

// Parse the environment variables
export const envServer = envServerSchema.parse(envClient);
