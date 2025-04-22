import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { apiRouter } from "./routes";
import { cors } from "@elysiajs/cors";
import { Logestic } from "logestic";
import { httpError, httpErrorDecorator } from "elysia-http-error";
import { getVersion } from "./utils/get-version";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { env } from "../config";
import staticPlugin from "@elysiajs/static";

const app = new Elysia({ name: "Investment Idea Generator API" })
  .use(Logestic.preset("common"))
  .use(
    opentelemetry({
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: env.AXIOM_URL,
            headers: {
              Authorization: `Bearer ${env.AXIOM_TOKEN}`,
              "X-Axiom-Dataset": env.AXIOM_DATASET,
            },
          })
        ),
      ],
      serviceName: "Grinda Translation API",
    })
  )
  .use(cors())
  .use(httpError())
  .use(staticPlugin())
  .use(httpErrorDecorator)
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Grinda i18n Translation Server",
          version: await getVersion(),
          description: "A translation server for Grinda i18n service",
          contact: {
            email: "vikyw@grinda.ai",
          },
        },
      },
    })
  )
  .get(
    "/",
    async () => {
      return {
        message: "go to /docs for documentation",
        status: "success",
        statusCode: 200,
      };
    },
    {
      response: t.Object({
        message: t.String(),
        status: t.String(),
        statusCode: t.Number(),
      }),
      tags: ["health"],
    }
  )
  .use(apiRouter)
  .listen({ port: 8000, idleTimeout: 255 });
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`
);
