import Elysia from "elysia";

import { createWithMagicLinkRouter } from "./create-with-magic-link";
import { readAllRouter } from "./read-all";
import { signOutRouter } from "./sign-out";
import { signOutAllRouter } from "./sign-out-all";
import { whoAmISessionRouter } from "./who-am-i";

export const sessionsRouter = new Elysia({
	prefix: "/sessions",
	tags: ["Sessions"],
	name: "sessions-router",
	detail: {
		description: "Session management",
		summary: "Session management",
	},
})
	.use(whoAmISessionRouter)
	.use(readAllRouter)
	.use(createWithMagicLinkRouter)
	.use(signOutRouter)
	.use(signOutAllRouter);
