import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";

export async function logout({
  authentik,
  fastify,
  request,
  reply,
}: {
  authentik: arctic.Authentik;
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const refreshToken = request.headers.authorization?.replace("Bearer ", "");
  if (!refreshToken) return reply.status(400).send({ message: "Bad Request" });
  try {
    await authentik.revokeToken(refreshToken);
    return reply.status(204).send();
  } catch (e) {
    return reply.status(400).send({ message: "Unauthorized" });
  }
}
