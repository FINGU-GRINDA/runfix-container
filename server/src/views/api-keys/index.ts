import Elysia from "elysia";
import { createNewRouter } from "./create";
import { deleteRouter } from "./delete";
import { readAllRouter } from "./read-all";

export const apiKeyRouter = new Elysia({
	prefix: "/api-keys",
	tags: ["Api Keys"],
	name: "api-key-router",
	detail: {
		description: "API key management",
		summary: "API key management",
	},
})
	.use(createNewRouter)
	.use(readAllRouter)
	.use(deleteRouter);
