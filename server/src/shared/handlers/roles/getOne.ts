import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { roles } from "@/shared/tables/roles.js";
import { eq } from "drizzle-orm";

export async function getRole({
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
  return reply.send(result);
}
