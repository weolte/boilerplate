import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { users } from "@tables/index.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "@services/sessions/create.js";

export async function signin({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const { identifier, password } = request.body as {
    identifier: string;
    password: string;
  };

  const [user] = await fastify.db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);

  if (!user) {
    return reply.code(401).send({ message: "Invalid email or username" });
  }

  const passwordMatch = await bcrypt.compare(`${password}`, `${user.password}`);
  if (!passwordMatch) {
    return reply.code(401).send({ message: "Invalid password" });
  }

  const payload = {
    sid: user.uuid,
    username: user.username,
    email: user.email,
  };
  const tokens = await fastify.generateTokens(payload, reply);

  // try {
  //   await createSession({
  //     fastify,
  //     request,
  //     user: user as any,
  //     tokens,
  //   });
  // } catch (err) {
  //   return reply.send(err);
  // }

  return reply.send(tokens);
}
