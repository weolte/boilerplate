import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { devices } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function listDevices({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const user = request.user as any;
  const userUuid = user?.sub;

  if (!userUuid)
    return reply.status(401).send({ message: "Unauthorized" });

  const list = await fastify.db
    .select()
    .from(devices)
    .where(eq(devices.userUuid, userUuid))
    .orderBy(devices.createdAt);

  return reply.send(list);
}
