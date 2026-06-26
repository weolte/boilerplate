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
  const refreshToken = request.headers.authorization?.replace("Bearer ", "");

  if (!refreshToken)
    return reply.status(400).send({ message: "Refresh token required" });

  try {
    const payload = fastify.jwt.verify(refreshToken) as any;

    if (payload.type !== "refresh")
      return reply.status(401).send({ message: "Invalid token type" });

    await fastify.db
      .delete(devices)
      .where(eq(devices.uuid, payload.jti));

    return reply.status(204).send();
  } catch {
    return reply.status(400).send({ message: "Logout failed" });
  }
}
