import Elysia from "elysia";
import { opentelemetry } from "@elysiajs/opentelemetry";

import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

export const otelPlugin = new Elysia().use(
  opentelemetry({
    spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
  })
);
