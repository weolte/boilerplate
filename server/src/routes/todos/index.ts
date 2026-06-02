import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import {
  selectTodoSchema,
  insertTodoSchema,
  updateTodoSchema,
} from "@starter/shared/schemas";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@shared/handlers/todos/index.js";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["todos"];

  // GET ALL
  fastify.get(
    "/",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectTodoSchema),
        },
      },
    },
    async (request, reply) => {
      return await getTodos({ fastify, request, reply });
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
          200: selectTodoSchema,
          404: z.object({
            message: z.string("Not found"),
          }),
        },
      },
    },
    async (request, reply) => {
      return await getTodo({ fastify, request, reply });
    },
  );

  // CREATE
  fastify.post(
    "/",
    {
      schema: {
        tags,
        body: insertTodoSchema,
        response: {
          201: selectTodoSchema,
        },
      },
    },
    async (request, reply) => {
      return await createTodo({ fastify, request, reply });
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
        body: updateTodoSchema.partial(),
      },
    },
    async (request, reply) => {
      return await updateTodo({ fastify, request, reply });
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
      return await deleteTodo({ fastify, request, reply });
    },
  );
}
