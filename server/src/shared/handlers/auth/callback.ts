import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";

export async function callback({
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
  const code = (request.query as any).code;
  const state = (request.query as any).state;

  const storedState = request.cookies.oauth_state;

  const storedVerifier = request.cookies.oauth_verifier;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedVerifier ||
    state !== storedState
  ) {
    return reply.code(400).send({
      message: "Invalid OAuth state",
    });
  }

  try {
    const tokens = await authentik.validateAuthorizationCode(
      code,
      storedVerifier,
    );

    const accessToken = tokens.accessToken();
    const refreshToken = tokens.refreshToken();
    const idToken = tokens.idToken();
    const claims = arctic.decodeIdToken(idToken);
    console.log(claims);

    return {
      accessToken,
      refreshToken,
      idToken,
    };
  } catch (error) {
    return reply.code(500).send({
      message: "OAuth failed",
    });
  }
}
