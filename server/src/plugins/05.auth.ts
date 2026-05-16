import fastifyPlugin from "fastify-plugin";
import fastifyAuth from "@fastify/auth";
import type { FastifyReply, FastifyRequest } from "fastify";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyAuth);
});
