import Elysia from "elysia";
import { createRouter } from "./create";
import { deleteRouter } from "./delete";
import { readRouter } from "./read";
import { readAllRouter } from "./read-all";
import { updateRouter } from "./update";

export const projectRouter = new Elysia({
	prefix: "/projects",
	tags: ["Projects"],
	detail: {
		description: "Projects",
		summary: "Projects",
	},
})
	.use(createRouter)
	.use(readAllRouter)
	.use(readRouter)
	.use(updateRouter)
	.use(deleteRouter);
