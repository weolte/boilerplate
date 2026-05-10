import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { InsertUserType } from "@starter/shared/schemas";
import { users } from "@tables/users.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function signup({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const body = request.body as InsertUserType;
  const { password, email, username, ..._ } = body;
  const passwordHash = await bcrypt.hash(`${password}`, 10);

  const [existedUser] = await fastify.db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)))
    .limit(1);

  if (existedUser)
    return reply
      .status(409)
      .send({ message: "User with this email or username already exist" });

  const [user] = await fastify.db
    .insert(users)
    .values({ ...body, password: passwordHash })
    .returning();

  if (!user) return reply.status(500).send({ message: "Error to create user" });

  const payload = {
    sid: user.uuid,
    username: user.username,
    email: user.email,
  };
  const tokens = await fastify.generateTokens(payload, reply);
  return reply.send(tokens);
}
