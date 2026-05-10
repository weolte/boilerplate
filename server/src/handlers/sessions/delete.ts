import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sessions } from "@tables/sessions.js";
import { eq } from "drizzle-orm";

export async function deleteSession({
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
    .from(sessions)
    .where(eq(sessions.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db
    .delete(sessions)
    .where(eq(sessions.uuid, result.uuid))
    .returning();
  return reply.code(204).send();
}
