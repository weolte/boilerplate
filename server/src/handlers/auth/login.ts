import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";

export async function login({
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
  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();

  const scopes = ["openid", "profile", "email", "groups", "offline_access"];

  const url = authentik.createAuthorizationURL(state, codeVerifier, scopes);

  const referer = request.headers["referer"];
  const origin = referer ? new URL(referer).origin : "http://localhost:5555";

  return reply
    .setCookie("oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .setCookie("oauth_verifier", codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .setCookie("oauth_origin", origin, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .redirect(url.toString());
}
