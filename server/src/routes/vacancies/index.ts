import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import {
  selectVacancySchema,
  insertVacancySchema,
  updateVacancySchema,
} from "@starter/shared/schemas";
import {
  getVacancies,
  getVacancy,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  getPublicVacancies,
} from "@/handlers/vacancies/index";
import { authorize } from "@/lib/authorize";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["vacancies"];

  // GET ALL
  fastify.get(
    "",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectVacancySchema),
        },
      },
      preHandler: [authorize("vacancies", "read")],
    },
    async (request, reply) => {
      await getVacancies({ fastify, request, reply });
    },
  );

  // GET ALL
  fastify.get(
    "/public",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectVacancySchema),
        },
      },
      preHandler: [authorize("public_vacancies", "read")],
    },
    async (request, reply) => {
      await getPublicVacancies({ fastify, request, reply });
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
          200: selectVacancySchema,
          404: z.object({
            message: z.string("Not found"),
          }),
        },
      },
      preHandler: [authorize("vacancies", "read")],
    },
    async (request, reply) => {
      await getVacancy({ fastify, request, reply });
    },
  );

  // CREATE
  fastify.post(
    "",
    {
      schema: {
        tags,
        body: insertVacancySchema,
        response: {
          201: selectVacancySchema,
        },
      },
      preHandler: [authorize("vacancies", "create")],
    },
    async (request, reply) => {
      await createVacancy({ fastify, request, reply });
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
        body: updateVacancySchema.partial(),
      },
      preHandler: [authorize("vacancies", "update")],
    },
    async (request, reply) => {
      await updateVacancy({ fastify, request, reply });
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
      preHandler: [authorize("vacancies", "delete")],
    },
    async (request, reply) => {
      await deleteVacancy({ fastify, request, reply });
    },
  );
}
