import Elysia from "elysia";
import { translationRouter } from "./translations";
import { authRouter } from "./auth";

export const apiRouter = new Elysia({ prefix: "/api" })
  .use(translationRouter)
  .use(authRouter);
