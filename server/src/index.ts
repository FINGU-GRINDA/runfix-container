import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { apiRouter } from "./apis";
import { cors } from "@elysiajs/cors";
import { logger } from "@rasla/logify";
import { config } from "../config";
const rootApp = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Grinda i18n Translation Server",
          version: "0.7.2",
          description: "A translation server for Grinda i18n service",
          contact: {
            email: "support@grinda.com",
          },
        },
      },
    })
  )
  .use(logger())
  .use(cors())
  .use(apiRouter)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${rootApp.server?.hostname}:${rootApp.server?.port}`
);
