import bcrypt from "bcrypt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { devices, users } from "@starter/shared/tables";
import { eq, or } from "drizzle-orm";
import { accessExpiresIn, refreshExpiresIn } from "@starter/shared/constants";

export async function register({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { username, email, password } = request.body as Record<string, string>;

  if (!username || !email || !password)
    return reply.status(400).send({ message: "Username, email, and password required" });

  if (password.length < 8)
    return reply.status(400).send({ message: "Password must be at least 8 characters" });

  const [existing] = await fastify.db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)));

  if (existing) {
    const field = existing.email === email ? "email" : "username";
    return reply.status(409).send({ message: `A user with this ${field} already exists` });
  }

  const hash = await bcrypt.hash(password, 10);

  const [user] = await fastify.db
    .insert(users)
    .values({
      username,
      email,
      password: hash,
      verified: false,
    })
    .returning();

  const ip = request.ip;
  const agent = request.headers["user-agent"] || "";

  const [device] = await fastify.db
    .insert(devices)
    .values({
      userUuid: user.uuid,
      userIp: ip,
      userAgent: agent,
      userToken: "",
    })
    .returning();

  const accessToken = fastify.jwt.sign(
    {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      type: "access",
    },
    { expiresIn: accessExpiresIn },
  );

  const refreshToken = fastify.jwt.sign(
    {
      sub: user.uuid,
      jti: device.uuid,
      type: "refresh",
    },
    { expiresIn: refreshExpiresIn },
  );

  await fastify.db
    .update(devices)
    .set({ userToken: accessToken })
    .where(eq(devices.uuid, device.uuid));

  return reply.status(201).send({ accessToken, refreshToken });
}
