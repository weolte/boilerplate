import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import {
  selectRoleSchema,
  insertRoleSchema,
  updateRoleSchema,
} from "@starter/shared/schemas";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from "@shared/handlers/roles/index.js";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["roles"];

  // GET ALL
  fastify.get(
    "",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectRoleSchema),
        },
      },
    },
    async (request, reply) => {
      return await getRoles({ fastify, request, reply });
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
          200: selectRoleSchema,
          404: z.object({
            message: z.string("Not found"),
          }),
        },
      },
    },
    async (request, reply) => {
      return await getRole({ fastify, request, reply });
    },
  );

  // CREATE
  fastify.post(
    "",
    {
      schema: {
        tags,
        body: insertRoleSchema,
        response: {
          201: selectRoleSchema,
        },
      },
    },
    async (request, reply) => {
      return await createRole({ fastify, request, reply });
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
        body: updateRoleSchema.partial(),
      },
    },
    async (request, reply) => {
      return await updateRole({ fastify, request, reply });
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
      return await deleteRole({ fastify, request, reply });
    },
  );
}
