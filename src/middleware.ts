import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SEED_COOKIE = "mp_seed";
const FLAG_COOKIE = "mp_flag";

function generateSeed(length = 12): string {
  const base = crypto.randomUUID();
  return base.replace(/-/g, "").slice(0, length);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const flagged = request.cookies.get(FLAG_COOKIE)?.value === "1";

  if (flagged && !pathname.startsWith("/honeypot")) {
    const url = request.nextUrl.clone();
    url.pathname = "/honeypot";
    url.search = "";
    return NextResponse.redirect(url);
  }

  let seed = request.cookies.get(SEED_COOKIE)?.value;
  const needsCookie = !seed;

  if (!seed) {
    seed = generateSeed();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-mp-seed", seed);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("x-mp-seed", seed);

  if (needsCookie) {
    response.cookies.set(SEED_COOKIE, seed, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
