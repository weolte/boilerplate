import { todos } from "@starter/shared/tables";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";
import { vacancies } from "@starter/shared/tables";

export async function getPublicVacancies({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const result = await fastify.db
    .select()
    .from(vacancies)
    .where(eq(vacancies.isPublic, true));
  return reply.send(result);
}
