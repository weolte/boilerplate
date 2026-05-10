import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";

const tags = ["casbin"];

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  // Get object policies
  fastify.get(
    "/policy/:obj",
    {
      schema: {
        tags,
        params: z.object({
          obj: z.string().default("analyzes"),
        }),
      },
    },
    async (request, reply) => {
      const { obj } = request.params as { obj: string };
      if (obj === "*")
        return reply.status(400).send({ message: "Bad request" });
      const object = "/" + obj.split("-").join("/");
      const policies = await fastify.casbin.getFilteredPolicy(1, object);
      return reply.send(policies);
    },
  );

  // Create policy
  fastify.post(
    "/policies",
    {
      schema: {
        tags,
        body: z
          .array(z.string())
          .min(3)
          .max(3)
          .default(["operator", "/analyzes", "GET"]),
      },
    },
    async (request, reply) => {
      const [sub, obj, act] = request.body as string[];
      if (!sub || !obj || !act)
        return reply
          .send(400)
          .send({ message: "Bad request to create policy" });

      const existed = await fastify.casbin.hasPolicy(sub, obj, act);
      if (existed)
        return reply.status(409).send({ message: "This policy already exist" });

      const created = await fastify.casbin.addPolicy(sub, obj, act);
      if (!created)
        return reply.status(500).send({ message: "Error to create policy" });

      return reply.status(204).send();
    },
  );

  // Delete policy
  fastify.delete(
    "/policies",
    {
      schema: {
        tags,
        body: z
          .array(z.string())
          .min(3)
          .max(3)
          .default(["operator", "/analyzes", "GET"]),
      },
    },
    async (request, reply) => {
      const [sub, obj, act] = request.body as string[];
      if (!sub || !obj || !act)
        return reply
          .send(400)
          .send({ message: "Bad request to create policy" });

      const removed = await fastify.casbin.removePolicy(sub, obj, act);
      if (!removed)
        return reply.status(500).send({ message: "Error to delete policy" });

      return reply.status(204).send();
    },
  );
}
