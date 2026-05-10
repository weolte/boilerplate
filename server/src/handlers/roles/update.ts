import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UpdateRoleType } from "@starter/shared/schemas";
import { roles } from "@tables/roles.js";
import { eq } from "drizzle-orm";

export async function updateRole({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { uuid } = request.params as { uuid: string };
  const body = request.body as Partial<UpdateRoleType>;

  if (uuid !== body.uuid)
    return reply.status(409).send({ message: "Invalide uuid" });

  const [result] = await fastify.db
    .select()
    .from(roles)
    .where(eq(roles.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db
    .update(roles)
    .set(body)
    .where(eq(roles.uuid, result.uuid))
    .returning();
  return reply.code(204).send();
}
