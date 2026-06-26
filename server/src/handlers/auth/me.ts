import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function me({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const user = request.user;
  return reply.send(user);
}
