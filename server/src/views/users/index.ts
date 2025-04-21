import { Elysia } from "elysia";
import { deleteUserRouter } from "./delete";
import { readUserRouter } from "./read";
import { readAllUsersRouter } from "./read-all";
import { updateUserRouter } from "./update";

export const usersRouter = new Elysia({
	prefix: "/users",
	tags: ["Users"],
	name: "users-router",
	detail: {
		description: "User management",
		summary: "User management",
	},
})
	.use(readUserRouter)
	.use(readAllUsersRouter)
	.use(updateUserRouter)
	.use(deleteUserRouter);
