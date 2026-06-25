import { z } from "zod/v4";
import type { FastifyInstance } from "fastify";

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
}
