import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.addHook("onRequest", async (request, reply) => {
    const url = request.url;

    const publicRoutes = ["/auth/signup", "/auth/signin", "/auth/refresh"];

    if (publicRoutes.includes(url)) return;

    await request.accessVerify();
  });
}
