import fastifyPlugin from "fastify-plugin";
import fastifyRedis from "@fastify/redis";

export default fastifyPlugin(async (fastify) => {
  await fastify.register(fastifyRedis, {
    host: "localhost",
  });
});
