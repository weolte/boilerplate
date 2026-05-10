import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UpdateTodoType } from "@starter/shared/schemas";
import { todos } from "@tables/todos.js";
import { eq } from "drizzle-orm";

export async function updateTodo({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { uuid } = request.params as { uuid: string };
  const body = request.body as Partial<UpdateTodoType>;

  if (uuid !== body.uuid)
    return reply.status(409).send({ message: "Invalide uuid" });

  const [result] = await fastify.db
    .select()
    .from(todos)
    .where(eq(todos.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db
    .update(todos)
    .set(body)
    .where(eq(todos.uuid, result.uuid))
    .returning();
  return reply.code(204).send();
}
