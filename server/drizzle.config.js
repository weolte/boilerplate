import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("PG_DB_URL:", process.env.PG_DB_URL);

export default defineConfig({
  out: "./drizzle",
  schema: "../shared/tables",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PG_DB_URL,
    ssl: false,
  },
});
