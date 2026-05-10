import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply } from "fastify";
import { accessExpiresIn, refreshExpiresIn } from "@starter/shared/constants";

export default fastifyPlugin(async (fastify, options) => {
  await fastify.register(fastifyJwt, {
    secret: "refreshsupersecret",
    namespace: "refresh",
    jwtSign: "refreshSign",
    jwtVerify: "refreshVerify",
    sign: {
      expiresIn: accessExpiresIn,
    },
  });

  await fastify.register(fastifyJwt, {
    secret: "accesssupersecret",
    namespace: "access",
    jwtSign: "accessSign",
    jwtVerify: "accessVerify",
    sign: {
      expiresIn: refreshExpiresIn,
    },
  });

  fastify.decorate(
    "generateTokens",
    async (payload: any, reply: FastifyReply) => {
      return {
        accessToken: await reply.accessSign(payload),
        refreshToken: await reply.refreshSign(payload),
      };
    },
  );
});
