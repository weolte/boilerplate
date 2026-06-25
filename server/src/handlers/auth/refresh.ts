import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";
import { sessions } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

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
  const accessToken = request.headers["x-access-token"] as string | undefined;
  if (!refreshToken || !accessToken)
    return reply.status(400).send({ message: "Bad Request" });
  try {
    const { data }: { data: any } =
      await authentik.refreshAccessToken(refreshToken);

    const ip = request.ip;
    const agent = request.headers["user-agent"] || "";

    await fastify.db
      .update(sessions)
      .set({ userToken: data.access_token, updatedAt: new Date(), userIp: ip, userAgent: agent })
      .where(eq(sessions.userToken, accessToken));

    return reply.send({
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
    });
  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
