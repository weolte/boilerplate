import "fastify";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type fastifyJwt from "@fastify/jwt";
import type { Enforcer } from "casbin";
import * as dbSchema from "@tables/index.js";

declare module "fastify" {
  interface FastifyInstance {
    db: NodePgDatabase<typeof dbSchema>;
    generateTokens: (
      payload: any,
      reply: FastifyReply,
    ) => Promise<{
      accessToken: string;
      refreshToken: string;
    }>;
    casbin: Enforcer;
  }

  interface FastifyReply {
    accessSign: fastifyJwt.FastifyJWT["sign"];
    refreshSign: fastifyJwt.FastifyJWT["sign"];
  }

  interface FastifyRequest {
    accessVerify: fastifyJwt.FastifyJWT["verify"];
    refreshVerify: fastifyJwt.FastifyJWT["verify"];
  }
}
