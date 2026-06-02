import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { users } from "@shared/tables/users.js";
import { eq } from "drizzle-orm";

export async function deleteUser({
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
    .from(users)
    .where(eq(users.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db.delete(users).where(eq(users.uuid, result.uuid)).returning();
  return reply.code(204).send();
}
