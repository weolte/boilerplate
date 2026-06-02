import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { roles } from "@shared/tables/roles.js";
import { eq } from "drizzle-orm";

export async function deleteRole({
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
    .from(roles)
    .where(eq(roles.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db.delete(roles).where(eq(roles.uuid, result.uuid)).returning();
  return reply.code(204).send();
}
