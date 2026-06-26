import type { FastifyInstance } from "fastify";
import {
  refresh,
  logout,
  login,
  register,
  me,
  listDevices,
} from "@/handlers/auth/index";

export default async function (fastify: FastifyInstance) {
  const tags = ["auth"];

  fastify.post(
    "/login",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await login({ fastify, request, reply });
    },
  );

  fastify.post(
    "/register",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await register({ fastify, request, reply });
    },
  );

  fastify.post(
    "/refresh",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await refresh({ fastify, request, reply });
    },
  );

  fastify.get(
    "/me",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await me({ fastify, request, reply });
    },
  );

  fastify.get(
    "/devices",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await listDevices({ fastify, request, reply });
    },
  );

  fastify.post(
    "/logout",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      return await logout({ fastify, request, reply });
    },
  );
}
