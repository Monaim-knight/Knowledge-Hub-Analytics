import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/profile", "/posts/new", "/discussions/new", "/dashboards/new"];
const adminPaths = ["/admin"];

function isProtectedPath(pathname: string): boolean {
  if (protectedPaths.some((p) => pathname.startsWith(p))) return true;
  if (/^\/posts\/[^/]+\/edit$/.test(pathname)) return true;
  if (/^\/dashboards\/[^/]+\/edit$/.test(pathname)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected = isProtectedPath(pathname);
  const isAdminOnly = adminPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnly && (!token || token.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/posts/new",
    "/posts/new/:path*",
    "/posts/:path*/edit",
    "/discussions/new",
    "/dashboards/new",
    "/dashboards/:path*/edit",
    "/admin",
    "/admin/:path*",
  ],
};
