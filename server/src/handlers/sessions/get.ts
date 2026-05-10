import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sessions } from "@tables/sessions.js";
import { eq } from "drizzle-orm";

export async function getSessions({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { userUuid } = request.params as any;
  const sessions = await fastify.db
    .select()
    .from(sessions)
    .where(eq(sessions.userUuid, userUuid));
  console.log(sessions);

  const result = await Promise.all(
    sessions.map(async (session) => {
      const expiresIn = await fastify.redis.ttl(`session:${session.uuid}`);
      return { ...session, expiresIn };
    }),
  );

  return reply.send(result);
}
