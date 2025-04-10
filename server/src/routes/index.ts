import { Elysia } from "elysia";
import { userRouter } from "./users";
import { authAccountRouter } from "./auth-accounts";
import { apiKeyRouter } from "./api-keys";
import { authSessionRouter } from "./auth-sessions";
import { translationRouter } from "./translations";
import { organizationRouter } from "./organizations";
import { projectRouter } from "./projects";

export const apiRouter = new Elysia({ prefix: "/api" })
  .use(authAccountRouter)
  .use(authSessionRouter)
  .use(userRouter)
  .use(organizationRouter)
  .use(projectRouter)
  .use(apiKeyRouter)
  .use(translationRouter);
