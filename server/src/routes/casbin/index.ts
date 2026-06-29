import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";
import { authorize } from "@/lib/authorize";

export default async function (
  fastify: FastifyInstance,
  options: Record<string, any>,
) {
  const tags = ["casbin"];

  fastify.get(
    "/role-users/:role",
    {
      schema: {
        tags,
        params: z.object({
          role: z.string(),
        }),
      },
      preHandler: [authorize("casbin", "read")],
    },
    async (request, reply) => {
      const { role } = request.params as { role: string };
      const userRoles = await fastify.casbin.getUsersForRole(role);
      return reply.send(userRoles);
    },
  );

  fastify.get(
    "/user-roles",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      const user = request.user as any;
      const sub = user?.sub || user?.email || user?.preferred_username;
      if (!sub) return reply.status(401).send({ message: "Unauthorized" });
      const roles = await fastify.casbin.getRolesForUser(sub);
      return reply.send(roles);
    },
  );

  fastify.get(
    "/all-roles",
    {
      schema: {
        tags,
      },
    },
    async (request, reply) => {
      const roles = await fastify.casbin.getAllRoles();
      return roles;
    },
  );

  // Attach role to user
  fastify.post(
    "/attach-role",
    {
      schema: {
        tags,
        body: z.object({
          user: z.uuid(),
          role: z.string(),
        }),
      },
      preHandler: [authorize("casbin", "write")],
    },
    async (request, reply) => {
      const { user, role } = request.body as any;
      if (!user || !role)
        return reply.status(400).send({ message: "Bad request" });

      const existed = await fastify.casbin.hasRoleForUser(user, role);
      if (existed)
        return reply
          .status(409)
          .send({ message: "This role already attached" });

      const created = await fastify.casbin.addRoleForUser(user, role);
      if (!created)
        return reply.status(500).send({ message: "Error to attach role" });

      return reply.status(204).send();
    },
  );

  // Unattach role to user
  fastify.post(
    "/unattach-role",
    {
      schema: {
        tags,
        body: z.object({
          user: z.uuid(),
          role: z.string(),
        }),
      },
      preHandler: [authorize("casbin", "write")],
    },
    async (request, reply) => {
      const { user, role } = request.body as any;
      if (!user || !role)
        return reply.status(400).send({ message: "Bad request" });

      const removed = await fastify.casbin.deleteRoleForUser(user, role);
      if (!removed)
        return reply.status(500).send({ message: "Error to unattach role" });

      return reply.status(204).send();
    },
  );

  // Enforce — check if current user can perform action on resource
  fastify.post(
    "/enforce",
    {
      schema: {
        tags,
        body: z.object({
          resource: z.string(),
          action: z.string(),
        }),
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

  // --- Policy management ---

  fastify.get(
    "/policies",
    {
      schema: {
        tags,
      },
      preHandler: [authorize("casbin", "read")],
    },
    async (request, reply) => {
      const policies = await fastify.casbin.getPolicy();
      const grouping = await fastify.casbin.getGroupingPolicy();
      return reply.send({ policies, grouping });
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
