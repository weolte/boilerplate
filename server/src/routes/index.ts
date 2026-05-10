import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.get(
    "/routes",
    {
      schema: { tags: ["routes"] },
    },
    async (request, reply) => {
      const routes = Array.from(fastify.routes).map((route: any) => ({
        url: route[1][0].url,
        method: route[1][0].method,
        routePath: route[1][0].routePath,
        prefix: route[1][0].prefix,
      }));
      return routes;
    },
  );
}
