import Elysia from "elysia";

import { createWithMagicLinkRouter } from "./create-with-magic-link";
import { createWithPasskeyRouter } from "./create-with-passkey";
import { readAllSessionsRouter } from "./read-all";
import { signOutSessionRouter } from "./sign-out";
import { signOutAllSessionRouter } from "./sign-out-all";
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
	.use(readAllSessionsRouter)
	.use(createWithMagicLinkRouter)
	.use(createWithPasskeyRouter)
	.use(signOutSessionRouter)
	.use(signOutAllSessionRouter);
