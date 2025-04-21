import { Elysia } from "elysia";
import { apiKeyRouter } from "./api-keys";
import { emailAuthRouter } from "./email-auth";
import { organizationMemberRouter } from "./organization-members";
import { organizationRouter } from "./organizations";
import { passkeyAuthRouter } from "./passkey-auth";
import { projectRouter } from "./projects";
import { sessionsRouter } from "./sessions";
import { translationRouter } from "./translations";
import { usersRouter } from "./users";

export const apiRouter = new Elysia({ prefix: "/api" })
	.use(emailAuthRouter)
	.use(passkeyAuthRouter)
	.use(usersRouter)
	.use(sessionsRouter)
	.use(organizationRouter)
	.use(organizationMemberRouter)
	.use(projectRouter)
	.use(apiKeyRouter)
	.use(translationRouter);
