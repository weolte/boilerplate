import {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import { usersRoles, roles } from "@starter/shared/tables";
import { and, eq, inArray } from "drizzle-orm";

export function authorize(
  fastify: FastifyInstance,
  rolesString: string[],
  additional: boolean = false,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;

    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        code: "FST_JWT_NO_AUTHORIZATION_IN_HEADER",
        error: "Unauthorized",
        message: "No Authorization was found in request.headers",
      });
    }

    const [userRole] = await fastify.db
      .select()
      .from(usersRoles)
      .leftJoin(roles, eq(usersRoles.roleUuid, roles.uuid))
      .where(
        and(
          eq(usersRoles.userUuid, user.sub),
          inArray(roles.name, rolesString),
        ),
      );

    if (!userRole) {
      if (additional) {
        request.additional = true;
        return;
      }

      return reply.code(403).send({
        statusCode: 403,
        error: "Forbidden",
        message:
          "Access denied. You do not have permission to access this resource.",
      });
    }
  };
}
