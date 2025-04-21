import { opentelemetry } from "@elysiajs/opentelemetry";
import Elysia from "elysia";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

export const otelPlugin = new Elysia({
	name: "otel-plugin",
	detail: {
		description: "OpenTelemetry plugin",
		summary: "OpenTelemetry plugin",
	},
})
	.use(
		opentelemetry({
			spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
		}),
	)
	.as("plugin");
