import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sessions, users } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function listSessions({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const user = request.user as any;
  const email = user?.email;
  if (!email) return reply.status(401).send({ message: "Unauthorized" });

  const [localUser] = await fastify.db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!localUser) return reply.status(404).send({ message: "User not found" });

  const list = await fastify.db
    .select()
    .from(sessions)
    .where(eq(sessions.userUuid, localUser.uuid))
    .orderBy(sessions.createdAt);

  return reply.send(list);
}
