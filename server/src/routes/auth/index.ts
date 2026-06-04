import type { FastifyInstance } from "fastify";
import * as arctic from "arctic";
import {
  callback,
  refresh,
  logout,
  login,
  me,
} from "@/shared/handlers/auth/index.js";

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
    async (request, reply) => {
      await login({ authentik, fastify, request, reply });
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
      await callback({ authentik, fastify, request, reply });
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
      await refresh({ authentik, fastify, request, reply });
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
      await me({ authentik, fastify, request, reply });
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
      await logout({ authentik, fastify, request, reply });
    },
  );
}
