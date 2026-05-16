import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.addHook("onRequest", async (request, reply) => {
    await request.jwtVerify();
  });
}
