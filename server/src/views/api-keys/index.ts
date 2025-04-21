import Elysia from "elysia";
import { createApiKeyRouter } from "./create";
import { deleteApiKeyRouter } from "./delete";
import { readAllApiKeysRouter } from "./read-all";

export const apiKeyRouter = new Elysia({
	prefix: "/api-keys",
	tags: ["Api Keys"],
	name: "api-key-router",
	detail: {
		description: "API key management",
		summary: "API key management",
	},
})
	.use(createApiKeyRouter)
	.use(readAllApiKeysRouter)
	.use(deleteApiKeyRouter);
