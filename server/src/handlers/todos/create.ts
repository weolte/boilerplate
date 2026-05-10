import type { InsertTodoType } from "@starter/shared/schemas";
import { todos } from "@tables/index.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function createTodo({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const body = request.body as InsertTodoType;
  const [result] = await fastify.db.insert(todos).values(body).returning();
  return reply.code(201).send(result);
}
