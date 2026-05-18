import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import buildGetJwks from "get-jwks";

const getJwks = buildGetJwks({
  issuersWhitelist: ["https://auth.shukrullojondev.uz/application/o/ish/"],
  jwksPath: "jwks/",
  providerDiscovery: true,
});

export default fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    decode: {
      complete: true,
    },
    secret: (request: any, token: any) => {
      const {
        header: { kid, alg },
        payload: { iss },
      } = token;

      return getJwks.getPublicKey({ kid, domain: iss, alg });
    },
  });
});
