import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as arctic from "arctic";

export async function callback({
  authentik,
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
        "https://devhr.navoiyuran.uz"
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
