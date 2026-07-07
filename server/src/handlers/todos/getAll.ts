import { todos } from "@starter/shared/tables";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";

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

export async function getOwnTodos({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const user = request.user as any;
  const userUuid = user?.sub;
  const result = await fastify.db
    .select()
    .from(todos)
    .where(eq(todos.createdBy, userUuid));
  return reply.send(result);
}
