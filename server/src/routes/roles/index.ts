import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import { selectRoleSchema } from "@starter/shared/schemas";
import { getRoles } from "@/handlers/roles/index";
import { authorize } from "@/lib/authorize";

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
      preHandler: [authorize(fastify, ["admin"])],
    },
    async (request, reply) => {
      await getRoles({ fastify, request, reply });
    },
  );
}
