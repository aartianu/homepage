function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Aarti homepage", charset="UTF-8"'
    }
  });
}

function getExpectedCredentials() {
  const combined = process.env.HOMEPAGE_BASIC_AUTH;
  if (combined) return combined;

  const user = process.env.HOMEPAGE_BASIC_AUTH_USER || "aarti";
  const password = process.env.HOMEPAGE_BASIC_AUTH_PASSWORD;
  return password ? `${user}:${password}` : "";
}

export default function middleware(request: Request) {
  const expected = getExpectedCredentials();
  if (!expected) return;

  const authorization = request.headers.get("authorization") || "";
  const expectedHeader = `Basic ${btoa(expected)}`;
  if (authorization === expectedHeader) return;

  return unauthorized();
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"]
};
