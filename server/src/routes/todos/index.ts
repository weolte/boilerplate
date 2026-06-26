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
} from "@/handlers/todos/index";
import { authorize } from "@/lib/authorize";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["todos"];

  // GET ALL
  fastify.get(
    "",
    {
      schema: {
        tags,
        response: {
          200: z.array(selectTodoSchema),
        },
      },
      preHandler: [authorize("todos", "read")],
    },
    async (request, reply) => {
      await getTodos({ fastify, request, reply });
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
      preHandler: [authorize("todos", "read")],
    },
    async (request, reply) => {
      await getTodo({ fastify, request, reply });
    },
  );

  // CREATE
  fastify.post(
    "",
    {
      schema: {
        tags,
        body: insertTodoSchema,
        response: {
          201: selectTodoSchema,
        },
      },
      preHandler: [authorize("todos", "create")],
    },
    async (request, reply) => {
      await createTodo({ fastify, request, reply });
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
      preHandler: [authorize("todos", "update")],
    },
    async (request, reply) => {
      await updateTodo({ fastify, request, reply });
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
      preHandler: [authorize("todos", "delete")],
    },
    async (request, reply) => {
      await deleteTodo({ fastify, request, reply });
    },
  );
}
