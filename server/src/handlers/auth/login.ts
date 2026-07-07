import bcrypt from "bcrypt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { devices, users } from "@starter/shared/tables";
import { eq } from "drizzle-orm";
import { accessExpiresIn } from "@starter/shared/constants";

export async function login({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { email, password } = request.body as Record<string, string>;

  if (!email || !password)
    return reply.status(400).send({ message: "Email and password required" });

  const [user] = await fastify.db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) return reply.status(401).send({ message: "Invalid credentials" });

  if (!user.password)
    return reply.status(401).send({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return reply.status(401).send({ message: "Invalid credentials" });

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

  if (!device)
    return reply.status(500).send({ message: "Failed to create device" });

  const accessToken = fastify.jwt.sign(
    {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      type: "access",
    },
    { expiresIn: accessExpiresIn },
  );

  await fastify.db
    .update(devices)
    .set({ userToken: accessToken })
    .where(eq(devices.uuid, device.uuid));

  return reply.send({ accessToken });
}
