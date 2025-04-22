import { Elysia } from "elysia";
import { deleteEmailAuthRouter } from "./delete";
import { readAllEmailAuthRouter } from "./read-all";
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
	.use(readAllEmailAuthRouter)
	.use(deleteEmailAuthRouter);
