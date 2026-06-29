import fastifyPlugin from "fastify-plugin";
import casbin from "casbin";
import DrizzleAdapterImport from "drizzle-adapter";
import { casbinRule } from "@starter/shared/tables";

export default fastifyPlugin(async (fastify) => {
  const { newEnforcer, newModelFromString } = casbin;
  const model = newModelFromString(`
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = sub, obj, act

  [role_definition]
  g = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, p.sub) && (p.obj == "*" || keyMatch(r.obj, p.obj)) && (p.act == "*" || r.act == p.act)
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
