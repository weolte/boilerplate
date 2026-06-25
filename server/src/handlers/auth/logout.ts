import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";
import { sessions } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

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
  const accessToken = request.headers["x-access-token"] as string | undefined;
  if (!refreshToken || !accessToken)
    return reply.status(400).send({ message: "Bad Request" });
  try {
    await authentik.revokeToken(refreshToken);

    await fastify.db
      .delete(sessions)
      .where(eq(sessions.userToken, accessToken));

    return reply.status(204).send();
  } catch {
    return reply.status(400).send({ message: "Logout failed" });
  }
}
