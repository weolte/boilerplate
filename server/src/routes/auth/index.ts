import type { FastifyInstance } from "fastify";
import * as arctic from "arctic";

const authentik = new arctic.Authentik(
  String(process.env.OIDC_BASE_URL),
  String(process.env.OIDC_PROVIDER_CLIENT),
  String(process.env.OIDC_PROVIDER_SECRET),
  String(process.env.OIDC_PROVIDER_CALLBACK),
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

        const accessToken = tokens.accessToken();
        const refreshToken = tokens.refreshToken();
        const idToken = tokens.idToken();

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
    },
  );

  fastify.get(
    "/refresh",
    {
      schema: {
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const refreshToken = request.headers["authorization"];

      if (!refreshToken)
        return reply.status(400).send({ message: "Bad Request" });

      try {
        const tokens = await authentik.refreshAccessToken(refreshToken);
        return reply.send(tokens);
      } catch (e) {
        return reply.status(400).send({ message: "Unauthorized" });
      }
    },
  );

  fastify.get(
    "/me",
    {
      schema: {
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const user = request.user;
      return reply.send(user);
    },
  );

  fastify.get(
    "/logout",
    {
      schema: {
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const token = request.headers.authorization?.replace("Bearer ", "");
      if (!token) return reply.status(400).send({ message: "Bad Request" });
      try {
        await authentik.revokeToken(token);
        return reply.status(204).send();
      } catch (e) {
        return reply.status(400).send({ message: "Unauthorized" });
      }
    },
  );
}
