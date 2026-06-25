import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { todos } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function getTodo({
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
  return reply.send(result);
}
