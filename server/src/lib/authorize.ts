import type { FastifyReply, FastifyRequest } from "fastify";

export function authorize(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {};
}
