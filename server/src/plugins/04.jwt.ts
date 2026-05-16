import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import buildGetJwks from "get-jwks";

const getJwks = buildGetJwks();

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyJwt, {
    decode: { complete: true },
    secret: (request: any, token: any) => {
      const {
        header: { kid, alg },
        payload: { iss },
      } = token;
      return getJwks.getPublicKey({ kid, domain: iss, alg });
    },
  });
});
