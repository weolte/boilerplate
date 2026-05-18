import type { FastifyInstance } from "fastify";
import * as arctic from "arctic";

const authentik = new arctic.Authentik(
  "https://auth.shukrullojondev.uz",
  "UNCMdATwwTtuW6jIIx9L9oIVrPCdI36U4kDKTv4F",
  "EGvoXRrLN4gZFOi3Jks6jAmFy2R0Ayra5Z5AX4aPiYVhi4haRsAXMzwy9kWesIqPY43zBcEEbrlKLYHnlDqS0jSCUGK6jILnaGdqkTxk2F0UPUzLDfLZ30lhOr0s5Mq9",
  "http://localhost:3002/auth/callback",
);

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/login",
    {
      schema: {
        tags: ["auth"],
      },
    },
    async (_request, reply) => {
      const state = arctic.generateState();
      const codeVerifier = arctic.generateCodeVerifier();

      const scopes = ["openid", "profile", "email", "groups", "offline_access"];

      const url = authentik.createAuthorizationURL(state, codeVerifier, scopes);

      console.log(url.toString());

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
        .redirect(url.toString());
    },
  );

  fastify.get(
    "/callback",
    {
      schema: {
        tags: ["auth"],
      },
    },
    async (request, reply) => {
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

        console.log(tokens);

        const accessToken = tokens.accessToken();
        const refreshToken = tokens.refreshToken();
        const idToken = tokens.idToken();

        return {
          accessToken,
          refreshToken,
          idToken,
        };
      } catch (error) {
        console.error(error);

        return reply.code(500).send({
          message: "OAuth failed",
        });
      }
    },
  );
}
