import { refreshExpiresIn } from "@starter/shared/constants";
import type { SelectUserType } from "@starter/shared/schemas";
import { sessions } from "@tables/sessions.js";
import { and, eq } from "drizzle-orm";
import type { FastifyInstance, FastifyRequest } from "fastify";

export async function createSession({
  fastify,
  request,
  user,
  tokens,
}: {
  fastify: FastifyInstance;
  request: FastifyRequest;
  user: SelectUserType;
  tokens: any;
}) {
  const userIp = request.ip;
  const userAgent = request.headers["user-agent"];

  const [existedSession] = await fastify.db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.userUuid, user.uuid),
        eq(sessions.userIp, userIp),
        eq(sessions.userAgent, userAgent!),
        eq(sessions.userToken, tokens.refreshToken),
      ),
    );

  if (existedSession) throw new Error("This user session already exist");

  const [result] = await fastify.db
    .insert(sessions)
    .values({
      userIp: userIp,
      userAgent: userAgent!,
      userUuid: user.uuid,
      userToken: tokens.refreshToken,
    })
    .returning();

  if (!result) throw new Error("Error to create session");
  // await fastify.redis.set(
  //   `session:${result?.uuid}`,
  //   JSON.stringify({
  //     userIp,
  //     userAgent,
  //     userUuid: user.uuid,
  //   }),
  //   "EX",
  //   refreshExpiresIn,
  // );
}
