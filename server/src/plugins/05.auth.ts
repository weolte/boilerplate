import fastifyPlugin from "fastify-plugin";
import fastifyAuth from "@fastify/auth";
import type { FastifyReply, FastifyRequest } from "fastify";

export default fastifyPlugin(async (fastify, options) => {
  fastify.decorate(
    "verifyJWTandLevel",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.code(401).send({
          message: "Invalid or missing token",
        });
      }
    },
  );

  await fastify.register(fastifyAuth);
});
