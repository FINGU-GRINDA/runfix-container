import { Elysia } from "elysia";
import { deleteRouter } from "./delete";
import { readAllRouter } from "./read-all";
import { signinWithMagicLinkRouter } from "./signin-with-magic-link";

export const emailAuthRouter = new Elysia({
	prefix: "/email-auth",
	tags: ["Email Auth"],
	name: "email-auth-router",
	detail: {
		description: "Authentication",
		summary: "Authentication",
	},
})
	.use(signinWithMagicLinkRouter)
	.use(readAllRouter)
	.use(deleteRouter);
