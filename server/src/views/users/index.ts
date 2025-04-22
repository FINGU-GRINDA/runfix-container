import { Elysia } from "elysia";
import { deleteRouter } from "./delete";
import { readRouter } from "./read";
import { readAllRouter } from "./read-all";
import { updateRouter } from "./update";

export const usersRouter = new Elysia({
	prefix: "/users",
	tags: ["Users"],
	name: "users-router",
	detail: {
		description: "User management",
		summary: "User management",
	},
})
	.use(readRouter)
	.use(readAllRouter)
	.use(updateRouter)
	.use(deleteRouter);
