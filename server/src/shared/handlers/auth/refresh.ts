import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";

export async function refresh({
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
    const tokens = await authentik.refreshAccessToken(refreshToken);
    return reply.send(tokens);
  } catch (e) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
