import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UpdateUserType } from "@starter/shared/schemas";
import { users } from "@shared/tables/users.js";
import { eq } from "drizzle-orm";

export async function updateUser({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { uuid } = request.params as { uuid: string };
  const body = request.body as Partial<UpdateUserType>;

  if (uuid !== body.uuid)
    return reply.status(409).send({ message: "Invalide uuid" });

  const [result] = await fastify.db
    .select()
    .from(users)
    .where(eq(users.uuid, uuid));
  if (!result) return reply.code(404).send({ message: "Not found" });

  await fastify.db
    .update(users)
    .set(body)
    .where(eq(users.uuid, result.uuid))
    .returning();
  return reply.code(204).send();
}
