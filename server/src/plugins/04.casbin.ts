import fastifyPlugin from "fastify-plugin";
import * as casbin from "casbin";
import DrizzleAdapterImport from "drizzle-adapter";
import { casbinRule } from "@starter/shared/tables";

export default fastifyPlugin(async (fastify) => {
  const { newEnforcer, newModelFromString } = casbin;
  const model = newModelFromString(`
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = role, obj_type, act

  [role_definition]
  g = _, _, _
  g2 = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, r.obj, p.role) && g2(r.obj, p.obj_type) && r.act == p.act
  `);

  const DrizzleAdapter =
    (DrizzleAdapterImport as any).default || DrizzleAdapterImport;

  const adapter = await DrizzleAdapter.newAdapter({
    db: fastify.db,
    table: casbinRule,
  });

  const enforcer = await newEnforcer(model, adapter);

  await enforcer.loadPolicy();

  fastify.decorate("casbin", enforcer);
});
