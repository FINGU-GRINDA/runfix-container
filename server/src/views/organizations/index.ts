import Elysia from "elysia";
import { createRouter } from "./create";
import { deleteRouter } from "./delete";
import { readRouter } from "./read";
import { readAllRouter } from "./read-all";
import { updateRouter } from "./update";

export const organizationRouter = new Elysia({
	name: "organizations-router",
	prefix: "/organizations",
	tags: ["Organizations"],
	detail: {
		description: "Organization management",
		summary: "Organization management",
	},
})
	.use(createRouter)
	.use(readRouter)
	.use(readAllRouter)
	.use(updateRouter)
	.use(deleteRouter);
