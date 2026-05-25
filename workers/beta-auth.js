const REALM = "Beta Preview";

export default {
  async fetch(request, env) {
    const authorization = request.headers.get("Authorization");

    if (!authorization || !authorization.startsWith("Basic ")) {
      return unauthorized();
    }

    const decoded = atob(authorization.slice(6));
    const colon = decoded.indexOf(":");
    const user = decoded.slice(0, colon);
    const pass = decoded.slice(colon + 1);

    if (user !== env.BETA_USER || pass !== env.BETA_PASS) {
      return unauthorized();
    }

    const url = new URL(request.url);
    url.hostname = env.PAGES_HOSTNAME;

    const proxied = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow",
    });

    return fetch(proxied);
  },
};

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}
