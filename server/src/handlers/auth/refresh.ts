import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { devices, users } from "@starter/shared/tables";
import { and, eq } from "drizzle-orm";
import { accessExpiresIn, refreshExpiresIn } from "@starter/shared/constants";

export async function refresh({
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

    const [device] = await fastify.db
      .select()
      .from(devices)
      .where(
        and(
          eq(devices.uuid, payload.jti),
          eq(devices.userUuid, payload.sub),
        ),
      );

    if (!device)
      return reply.status(401).send({ message: "Device not found" });

    const [user] = await fastify.db
      .select()
      .from(users)
      .where(eq(users.uuid, device.userUuid));

    if (!user)
      return reply.status(401).send({ message: "User not found" });

    const ip = request.ip;
    const agent = request.headers["user-agent"] || "";

    const [newDevice] = await fastify.db
      .insert(devices)
      .values({
        userUuid: device.userUuid,
        userIp: ip,
        userAgent: agent,
        userToken: "",
      })
      .returning();

    await fastify.db
      .delete(devices)
      .where(eq(devices.uuid, device.uuid));

    const newAccessToken = fastify.jwt.sign(
      {
        sub: user.uuid,
        email: user.email,
        username: user.username,
        type: "access",
      },
      { expiresIn: accessExpiresIn },
    );

    const newRefreshToken = fastify.jwt.sign(
      {
        sub: user.uuid,
        jti: newDevice.uuid,
        type: "refresh",
      },
      { expiresIn: refreshExpiresIn },
    );

    await fastify.db
      .update(devices)
      .set({ userToken: newAccessToken })
      .where(eq(devices.uuid, newDevice.uuid));

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    return reply.status(401).send({ message: "Invalid refresh token" });
  }
}
