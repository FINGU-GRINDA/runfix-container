import { cors } from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import staticPlugin from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Elysia, t } from "elysia";
import { httpError, httpErrorDecorator } from "elysia-http-error";
import { Logestic } from "logestic";
import { env } from "./config";
import { getVersion } from "./procedures/stateful/get-version-plugin";
import { apiRouter } from "./views";

const app = new Elysia({
	name: "Hana Lang Connect",
	detail: {
		description: "A translation API",
		summary: "A translation API",
	},
})
	// .use(pluginGracefulServer())
	.use(Logestic.preset("fancy"))
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
					}),
				),
			],
			serviceName: "Hana Lang Connect",
		}),
	)
	.use(cors())
	.use(httpError())
	.use(staticPlugin())
	.use(httpErrorDecorator)
	.use(
		swagger({
			path: "/",
			documentation: {
				info: {
					title: "Hana Lang Connect API",
					version: await getVersion(),
					description: "A translation API",
					contact: {
						email: "vikyw89@gmail.com",
					},
				},
			},
			exclude: ["/json"],
		}),
	)
	.get(
		"/health",
		async () => {
			return {
				message: "go to / for documentation",
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
			tags: ["Health"],
			summary: "Get health status",
			description: "Get health status",
		},
	)
	.use(apiRouter)
	.listen({ port: 8000, idleTimeout: 255 });

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
