import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.post(
    "/init",
    {
      preHandler: async (request, reply) => {},
      schema: { tags: ["flows"] },
    },
    async (request, reply) => {},
  );
}
