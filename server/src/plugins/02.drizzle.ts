import fastifyPlugin from "fastify-plugin";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "@/shared/tables/index";

export default fastifyPlugin(async (fastify, options) => {
  const pool = new Pool({
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    database: String(process.env.DB_NAME),
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASS),
    ssl: false,
  });

  const db = drizzle({ client: pool, schema: dbSchema });

  fastify.decorate("db", db);
});
