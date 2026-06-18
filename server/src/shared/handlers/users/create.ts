import type { InsertUserType } from "@starter/shared/schemas";
import { users } from "@/shared/tables/users";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function createUser({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const body = request.body as InsertUserType;
  const [result] = await fastify.db.insert(users).values(body).returning();
  return reply.code(201).send(result);
}
