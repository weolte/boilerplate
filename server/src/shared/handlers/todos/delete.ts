import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { todos } from "@shared/tables/todos.js";
import { eq } from "drizzle-orm";

export async function deleteTodo({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { uuid } = request.params as { uuid: string };

  const [result] = await fastify.db
    .select()
    .from(todos)
    .where(eq(todos.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db.delete(todos).where(eq(todos.uuid, result.uuid));

  return reply.code(204).send();
}
