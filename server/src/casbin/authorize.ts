import type { FastifyReply, FastifyRequest } from "fastify";

export function authorize(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;
    if (!user) return reply.status(401).send({ message: "Unauthorized" });

    const sub = user.sub || user.email || user.preferred_username;
    if (!sub) return reply.status(401).send({ message: "Unauthorized" });

    const allowed = await request.server.casbin.enforce(sub, resource, action);
    if (!allowed) return reply.status(403).send({ message: "Forbidden" });
  };
}
