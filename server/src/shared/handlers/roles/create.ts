import { type InsertRoleType } from "@starter/shared/schemas";
import { roles } from "@/shared/tables/roles.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function createRole({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const body = request.body as InsertRoleType;
  const [result] = await fastify.db.insert(roles).values(body).returning();
  return reply.code(201).send(result);
}
