import bcrypt from "bcrypt";
import type { InsertUserType } from "@starter/shared/schemas";
import { users } from "@starter/shared/tables";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function createUser({
  fastify,
  request,
  reply,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const body = request.body as InsertUserType;
  const hashedPassword = await bcrypt.hash(body.password, 12);
  const [result] = await fastify.db
    .insert(users)
    .values({ ...body, password: hashedPassword })
    .returning();
  return reply.code(201).send(result);
}
