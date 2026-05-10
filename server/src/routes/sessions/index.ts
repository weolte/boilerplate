import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import { selectSessionSchema } from "@starter/shared/schemas";
import { getSessions, deleteSession } from "@handlers/sessions/index.js";

const tags = ["sessions"];

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  // GET USER SESSIONS
  fastify.get(
    "/:userUuid",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectSessionSchema),
        },
      },
    },
    async (request, reply) => {
      return await getSessions({ fastify, request, reply });
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
      return await deleteSession({ fastify, request, reply });
    },
  );
}
