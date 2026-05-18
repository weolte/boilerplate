import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import buildGetJwks from "get-jwks";

const getJwks = buildGetJwks({
  issuersWhitelist: [
    `${String(process.env.OIDC_BASE_URL)}${process.env.OIDC_PROVIDER_PATH}`,
  ],
  jwksPath: String(process.env.OIDC_JWKS_PATH),
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
