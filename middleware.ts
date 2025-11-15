import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("Authorization")?.value;

  const token = authCookie?.startsWith("Bearer ")
    ? authCookie.split(" ")[1]
    : null;

  const protectedRoutes = ["/cart", "/account", "/checkout"];
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");

      const payloadBase64 = parts[1];

      const jsonPayload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf8")
      );

      // const isExpired = jsonPayload.exp * 1000 < Date.now();

      // if (isExpired) {
      //   return NextResponse.redirect(new URL("/login?expired=1", req.url));
      // }

    } catch (err) {
      console.error("JWT decode failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
