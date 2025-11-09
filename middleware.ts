import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware called")

  const token = req.cookies.get("Authorization")?.value;

  const protectedRoutes = ["/cart", "/account", "/checkout"];

  const pathname = req.nextUrl.pathname;

  console.log(pathname)

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart",
    "/cart/:path*",
    "/account",
    "/account/:path*",
    "/checkout",
    "/checkout/:path*",
  ],
};


