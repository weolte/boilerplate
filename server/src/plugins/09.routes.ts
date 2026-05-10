import fastifyPlugin from "fastify-plugin";
import fastifyRoutes from "@fastify/routes";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyRoutes);
});
