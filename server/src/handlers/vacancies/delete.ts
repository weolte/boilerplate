import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { todos } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function deleteVacancy({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { uuid } = request.params as { uuid: string };
  const user = request.user as any;
  const userUuid = user?.sub;

  const [result] = await fastify.db
    .select()
    .from(todos)
    .where(eq(todos.uuid, uuid));

  if (!result) return reply.code(404).send({ message: "Not found" });
  if (result.userUuid !== userUuid)
    return reply.code(403).send({ message: "Forbidden" });

  await fastify.db.delete(todos).where(eq(todos.uuid, result.uuid));

  return reply.code(204).send();
}
