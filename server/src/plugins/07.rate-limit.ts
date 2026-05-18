import fastifyPlugin from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
});
