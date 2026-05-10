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
    "@share": "./src/share",
  },
  tsconfig: "tsconfig.json",
  external: [
    "@fastify/autoload",
    "@fastify/cors",
    "@fastify/rate-limit",
    "@fastify/swagger",
    "@fastify/swagger-ui",
    "@fastify/vite",
    "dotenv",
    "drizzle-orm",
    "drizzle-zod",
    "fastify",
    "fastify-plugin",
    "fastify-type-provider-zod",
    "pg",
    "zod",
  ],
});
