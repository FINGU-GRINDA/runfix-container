import { Elysia } from "elysia";
import { userRouter } from "./users";
import { authAccountRouter } from "./auth-accounts";
import { apiKeyRouter } from "./api-keys";
import { authSessionRouter } from "./auth-sessions";
import { translationRouter } from "./translations";

export const apiRouter = new Elysia({ prefix: "/api" })
  .use(userRouter)
  .use(authAccountRouter)
  .use(authSessionRouter)
  .use(apiKeyRouter)
  .use(translationRouter);
