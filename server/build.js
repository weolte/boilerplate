import * as esbuild from "esbuild";
import { rmSync } from "node:fs";

rmSync("./dist", { recursive: true, force: true });

await esbuild.build({
  entryPoints: ["./src/index.ts", "./src/plugins/**/*", "./src/routes/**/*"],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: "./dist",
  outbase: "./src",
  minify: true,
  splitting: true,
  chunkNames: "chunks/[name]-[hash]",
  alias: {
    "@/handlers": "./src/handlers",
    "@/lib": "./src/lib",
  },
  tsconfig: "tsconfig.json",
  external: [
    "@fastify/autoload",
    "@fastify/cookie",
    "@fastify/jwt",
    "@fastify/rate-limit",
    "@fastify/redis",
    "@fastify/routes",
    "@fastify/swagger",
    "@graphql-tools/graphql-file-loader",
    "@graphql-tools/load",
    "@graphql-tools/schema",
    "@scalar/fastify-api-reference",
    "bcrypt",
    "dotenv",
    "drizzle-adapter",
    "drizzle-graphql",
    "drizzle-orm",
    "fastify",
    "fastify-plugin",
    "fastify-type-provider-zod",
    "graphql",
    "mercurius",
    "pg",
  ],
});
