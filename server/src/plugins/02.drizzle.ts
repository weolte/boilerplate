import fastifyPlugin from "fastify-plugin";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "@starter/shared/tables";

export default fastifyPlugin(async (fastify, options) => {
  const pgUrl = process.env.PG_DB_URL;

  if (!pgUrl) {
    throw new Error("Missing database URL environment variable: PG_DB_URL");
  }

  const pool = new Pool({
    connectionString: pgUrl,
  });

  const db = drizzle({ client: pool, schema: dbSchema });

  fastify.decorate("db", db);
});
