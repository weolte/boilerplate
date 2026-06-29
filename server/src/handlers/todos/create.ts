import type { InsertTodoType } from "@starter/shared/schemas";
import { todos } from "@starter/shared/tables";
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
  const user = request.user as any;
  const userUuid = user?.sub;
  const body = request.body as InsertTodoType;
  const [result] = await fastify.db
    .insert(todos)
    .values({ ...body, userUuid })
    .returning();
  return reply.code(201).send(result);
}
