import fastifyPlugin from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifyScalar from "@scalar/fastify-api-reference";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Test swagger",
        description: "Testing the Fastify swagger API",
        version: "0.1.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(fastifyScalar, {
    routePrefix: "/doc",
    prefix: "/api",
  });
});
