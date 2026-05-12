import type { FastifyInstance } from "fastify";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  fastify.addHook("onRequest", async (request, reply) => {
    const url = request.url;
    const method = request.method;

    const publicRoutes = ["/auth/signup", "/auth/signin", "/auth/refresh"];

    if (publicRoutes.includes(url)) return;

    try {
      await request.accessVerify();
      const user = request.user as any;
      const accessible = await fastify.casbin.enforce(user.sid, url, method);
      if (!accessible) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Unauthorized",
          message: "Access denied",
        });
      }
    } catch (err) {
      return reply.status(401).send(err);
    }
  });
}
