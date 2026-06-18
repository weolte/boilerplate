import "fastify";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type fastifyJwt from "@fastify/jwt";
import type { Enforcer } from "casbin";
import * as dbSchema from "@/shared/tables/index";

declare module "fastify" {
  interface FastifyInstance {
    db: NodePgDatabase<typeof dbSchema>;
    casbin: Enforcer;
  }
}
