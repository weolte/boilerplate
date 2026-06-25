import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";
import { sessions, users } from "@starter/shared/tables";
import { eq } from "drizzle-orm";

export async function callback({
  authentik,
  fastify,
  request,
  reply,
}: {
  authentik: arctic.Authentik;
  fastify: FastifyInstance;
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  const code = (request.query as any).code;
  const state = (request.query as any).state;

  const storedState = request.cookies.oauth_state;
  const storedVerifier = request.cookies.oauth_verifier;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedVerifier ||
    state !== storedState
  ) {
    return reply.code(400).send("Invalid OAuth state");
  }

  try {
    const tokens = await authentik.validateAuthorizationCode(
      code,
      storedVerifier,
    );

    const accessToken = tokens.accessToken();
    const refreshToken = tokens.refreshToken();
    const idToken = tokens.idToken();

    const claims = JSON.parse(
      Buffer.from(idToken.split(".")[1]!, "base64").toString(),
    );

    const sub = claims.sub || claims.preferred_username || claims.email;
    const email = claims.email;
    const username = claims.preferred_username || claims.nickname || claims.email;

    const [existing] = await fastify.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    const record = existing
      ? existing
      : (
          await fastify.db
            .insert(users)
            .values({
              username,
              email,
              password: "",
              verified: true,
            })
            .returning()
        )[0]!;

    const ip = request.ip;
    const agent = request.headers["user-agent"] || "";

    await fastify.db
      .insert(sessions)
      .values({
        userUuid: record.uuid,
        userIp: ip,
        userAgent: agent,
        userToken: accessToken,
      })
      .returning();

    const origin = request.cookies.oauth_origin || "http://localhost:5555";

    return reply.type("text/html").send(`
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Complete</title>
</head>
<body>
  <script>
    if (window.opener) {
      window.opener.postMessage(
        {
          accessToken: ${JSON.stringify(accessToken)},
          refreshToken: ${JSON.stringify(refreshToken)}
        },
        ${JSON.stringify(origin)}
      );

      window.close();
    }
  </script>
</body>
</html>
`);
  } catch {

    return reply.code(500).send("OAuth failed");
  }
}
