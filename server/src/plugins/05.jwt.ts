import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import buildGetJwks from "get-jwks";

const getJwks = buildGetJwks({
  issuersWhitelist: ["auth.shukrullojondev.uz"],
  jwksPath: "/application/o/ish/jwks/",
  providerDiscovery: true,
});

export default fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    decode: {
      complete: true,
    },

    secret: async (_request: any, token: any) => {
      console.log(token);

      const {
        header: { kid, alg },
        payload: { iss },
      } = token;

      const domain = new URL(iss).hostname;

      return getJwks.getPublicKey({
        kid,
        domain,
        alg,
      });
    },

    verify: {
      algorithms: ["RS256"],
      allowedIss: ["https://auth.shukrullojondev.uz/application/o/ish/"],
      allowedAud: "UNCMdATwwTtuW6jIIx9L9oIVrPCdI36U4kDKTv4F",
    },
  });
});
