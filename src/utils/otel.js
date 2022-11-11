// https://www.apollographql.com/docs/federation/opentelemetry/

// Import required symbols
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor, ConsoleSpanExporter, BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";

// Register server-related instrumentation
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation()
  ]
});

// Initialize provider and identify this particular service
const provider = new NodeTracerProvider({
  resource: Resource.default().merge(new Resource({
    // Replace with any string to identify this service in your system
    "service.name": "{{ cookiecutter.resource }}-service",
  })),
});

if (process.env.NODE_ENV === "production") {
  // Configure an exporter that pushes all traces to a Collector
  // (This assumes the Collector is running on the default url
  // of http://localhost:4318/v1/traces)
  const collectorTraceExporter = new OTLPTraceExporter();
  provider.addSpanProcessor(
    new BatchSpanProcessor(collectorTraceExporter, {
      maxQueueSize: 1000,
      scheduledDelayMillis: 1000,
    }),
  );
} else {
  // Configure a test exporter to print all traces to the console
  const consoleExporter = new ConsoleSpanExporter();
  provider.addSpanProcessor(
    new SimpleSpanProcessor(consoleExporter)
  );
}

// Register the provider to begin tracing
provider.register();
