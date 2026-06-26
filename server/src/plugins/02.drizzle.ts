import fastifyPlugin from "fastify-plugin";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "@starter/shared/tables";

export default fastifyPlugin(async (fastify, options) => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS;

  if (!host || !port || !database || !user || !password) {
    throw new Error(
      "Missing database environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS",
    );
  }

  const pool = new Pool({
    host,
    port: Number(port),
    database,
    user,
    password,
    ssl: false,
  });

  const db = drizzle({ client: pool, schema: dbSchema });

  fastify.decorate("db", db);
});
