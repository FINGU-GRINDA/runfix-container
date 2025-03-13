import Elysia from "elysia";
import { translationRouter } from "./translations";

export const apiRouter = new Elysia({ prefix: "/api" }).use(translationRouter);
