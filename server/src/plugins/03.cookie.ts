import fastifyPlugin from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyCookie, {
    secret: "my-secret",
    hook: "onRequest",
    parseOptions: {},
  });
});
