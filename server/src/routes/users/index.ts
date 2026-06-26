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
} from "@/handlers/users/index";
import { authorize } from "@/lib/authorize";

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
      preHandler: [authorize("users", "read")],
    },
    async (request, reply) => {
      await getUsers({ fastify, request, reply });
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
      preHandler: [authorize("users", "read")],
    },
    async (request, reply) => {
      await getUser({ fastify, request, reply });
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
      preHandler: [authorize("users", "create")],
    },
    async (request, reply) => {
      await createUser({ fastify, request, reply });
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
      preHandler: [authorize("users", "update")],
    },
    async (request, reply) => {
      await updateUser({ fastify, request, reply });
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
      preHandler: [authorize("users", "delete")],
    },
    async (request, reply) => {
      await deleteUser({ fastify, request, reply });
    },
  );
}
