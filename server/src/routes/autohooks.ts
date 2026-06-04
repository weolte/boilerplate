import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.addHook("onRequest", async (request, reply) => {
    const publicRoutes = ["/auth/login", "/auth/callback", "/auth/refresh"];

    if (
      publicRoutes.some(
        (publicRoute) => publicRoute === request.url.split("?")[0]!,
      )
    ) {
      return;
    }

    return await request.jwtVerify();
  });
}
