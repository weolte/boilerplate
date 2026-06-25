import { todos } from "@starter/shared/tables";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function getTodos({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const result = await fastify.db.select().from(todos);
  return reply.send(result);
}
