import { sessions } from "@tables/sessions.js";
import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";

export async function deleteSession({
  fastify,
  sessionUuid,
}: {
  fastify: FastifyInstance;
  sessionUuid: string;
}) {
  await fastify.db.delete(sessions).where(eq(sessions.uuid, sessionUuid));
}
