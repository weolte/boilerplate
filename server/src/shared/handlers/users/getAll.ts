import { users } from "@shared/tables/users.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function getUsers({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const result = await fastify.db.select().from(users);
  return reply.send(result);
}
