import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { devices } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function logout({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) return reply.status(400).send({ message: "Token required" });

  try {
    await fastify.db.delete(devices).where(eq(devices.userToken, token));

    return reply.status(204).send();
  } catch {
    return reply.status(400).send({ message: "Logout failed" });
  }
}
