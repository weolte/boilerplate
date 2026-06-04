import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import {
  selectUserSchema,
  insertUserSchema,
  updateUserSchema,
} from "@starter/shared/schemas";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "@/shared/handlers/users/index.js";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["users"];

  // GET ALL
  fastify.get(
    "",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectUserSchema),
        },
      },
    },
    async (request, reply) => {
      return await getUsers({ fastify, request, reply });
    },
  );

  // GET ONE
  fastify.get(
    "/:uuid",
    {
      schema: {
        tags,
        params: z.object({
          uuid: z.uuid(),
        }),
        response: {
          200: selectUserSchema,
          404: z.object({
            message: z.string("Not found"),
          }),
        },
      },
    },
    async (request, reply) => {
      return await getUser({ fastify, request, reply });
    },
  );

  // CREATE
  fastify.post(
    "",
    {
      schema: {
        tags,
        body: insertUserSchema,
        response: {
          201: selectUserSchema,
        },
      },
    },
    async (request, reply) => {
      return await createUser({ fastify, request, reply });
    },
  );

  // UPDATE (PUT)
  fastify.put(
    "/:uuid",
    {
      schema: {
        tags,
        params: z.object({
          uuid: z.uuid(),
        }),
        body: updateUserSchema.partial(),
      },
    },
    async (request, reply) => {
      return await updateUser({ fastify, request, reply });
    },
  );

  // DELETE
  fastify.delete(
    "/:uuid",
    {
      schema: {
        tags,
        params: z.object({
          uuid: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      return await deleteUser({ fastify, request, reply });
    },
  );
}
