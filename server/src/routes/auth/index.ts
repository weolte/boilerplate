import { signup, signin } from "@handlers/auth/index.js";
import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  // Signup
  fastify.post(
    "/signup",
    {
      schema: {
        tags: ["auth"],
        body: z.object({
          username: z.string(),
          email: z.email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      return await signup({ fastify, request, reply });
    },
  );

  // Signin
  fastify.post(
    "/signin",
    {
      schema: {
        tags: ["auth"],
        body: z.object({
          identifier: z.string().default("test"),
          password: z.string().default("testpass"),
        }),
      },
    },
    async (request, reply) => {
      return await signin({ fastify, request, reply });
    },
  );

  // Refresh token
  fastify.get(
    "/refresh",
    {
      schema: {
        tags: ["auth"],
        headers: z.object({
          Authorization: z.string().default("Bearer token"),
        }),
      },
      preHandler: async (request, reply) => {
        try {
          await request.refreshVerify();
        } catch (err) {
          return reply.send(err);
        }
      },
    },
    async (request, reply) => {
      return reply.send("refreshed");
    },
  );
}
