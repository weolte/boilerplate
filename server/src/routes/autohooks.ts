import type { FastifyInstance, FastifyRequest } from "fastify";

export default async function (
  fastify: FastifyInstance,
  _options: Record<string, unknown>,
) {
  const publicRoutes = ["/auth/login", "/auth/register", "/public/*"];

  function isPublicRoute(request: FastifyRequest): boolean {
    const path = request.url.split("?")[0] ?? "";

    return publicRoutes.some((route) => {
      if (route.endsWith("/*")) {
        const prefix = route.slice(0, -1);
        return path.startsWith(prefix);
      }

      return route === path;
    });
  }

  fastify.addHook("onRequest", async (request) => {
    if (isPublicRoute(request)) {
      return;
    }

    await request.jwtVerify();
  });
}
