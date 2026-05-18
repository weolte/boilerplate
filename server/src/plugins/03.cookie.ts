import fastifyPlugin from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import type { FastifyReply, FastifyRequest } from "fastify";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyCookie, {
    secret: "my-secret",
    hook: "onRequest",
    parseOptions: {},
  });
});
