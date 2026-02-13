import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for") ??
    headerList.get("x-real-ip") ??
    "unknown";

  console.log(`[bhoolbhulaiya] bait link visited from ${ip}`);

  const url = new URL(request.url);
  url.pathname = "/honeypot";
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set("mp_flag", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60,
  });

  return response;
}
