import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import { authorize } from "@/lib/authorize";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["casbin"];

  // Sahifada qilinadigan zaproslarda ishtirok etadigan resurslar massivini tekshirish
  fastify.post(
    "/enforce",
    {
      schema: {
        tags,
        body: z.array(
          z.object({
            resource: z.string(),
            action: z.string(),
          }),
        ),
      },
    },
    async (request, reply) => {
      const user = request.user as any;
      const sub = user?.sub || user?.email || user?.preferred_username;
      if (!sub) return reply.status(401).send({ message: "Unauthorized" });

      const { resource, action } = request.body as any;
      const allowed = await fastify.casbin.enforce(sub, resource, action);
      return reply.send({ allowed });
    },
  );

  // Rollarni olish, qo'shish va o'chirish
  fastify.get(
    "/roles",
    {
      schema: {
        tags,
      },
      // preHandler: [authorize("casbin", "read")],
    },
    async (request, reply) => {
      const policies = await fastify.casbin.getPolicy();
      const roles = [...new Set(policies.map((p) => p[0]))];
      return reply.send(roles);
    },
  );

  // Casbin politikalarini olish, qo'shish va o'chirish
  fastify.get(
    "/policies",
    {
      schema: {
        tags,
      },
      // preHandler: [authorize("casbin", "read")],
    },
    async (request, reply) => {
      const policies = await fastify.casbin.getPolicy();
      const grouping1 = await fastify.casbin.getNamedGroupingPolicy("g");
      const grouping2 = await fastify.casbin.getNamedGroupingPolicy("g2");
      return reply.send({ policies, grouping1, grouping2 });
    },
  );

  fastify.post(
    "/policies",
    {
      schema: {
        tags,
        body: z.object({
          sub: z.string(),
          obj: z.string(),
          act: z.string(),
        }),
      },
      preHandler: [authorize("casbin", "write")],
    },
    async (request, reply) => {
      const { sub, obj, act } = request.body as any;
      const added = await fastify.casbin.addPolicy(sub, obj, act);
      if (!added)
        return reply.status(409).send({ message: "Policy already exists" });
      return reply.status(201).send();
    },
  );

  fastify.delete(
    "/policies",
    {
      schema: {
        tags,
        body: z.object({
          sub: z.string(),
          obj: z.string(),
          act: z.string(),
        }),
      },
      preHandler: [authorize("casbin", "write")],
    },
    async (request, reply) => {
      const { sub, obj, act } = request.body as any;
      const removed = await fastify.casbin.removePolicy(sub, obj, act);
      if (!removed)
        return reply.status(404).send({ message: "Policy not found" });
      return reply.status(204).send();
    },
  );
}
