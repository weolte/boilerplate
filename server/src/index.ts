import path from "path";
import Fastify from "fastify";
import fastifyAutoload from "@fastify/autoload";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import "dotenv/config";

(async () => {
  const fastify = Fastify({
    logger: true,
    trustProxy: true,
  });

  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins"),
  });

  fastify.withTypeProvider<ZodTypeProvider>();
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    options: {},
  });

  fastify.listen({ port: 3002, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
})();
