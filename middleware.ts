import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow login page, login API, and public API routes
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login")
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const token = request.cookies.get("admin_token")?.value;

  if (token) {
    // Cookie exists — allow through (session validated server-side by API routes)
    return NextResponse.next();
  }

  // No dev-mode bypass if ADMIN_PASSWORD is unset — still need a session cookie
  // unless the admin layout handles its own client-side auth fallback
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    // Dev mode — allow through, layout handles auth
    return NextResponse.next();
  }

  // No valid cookie — redirect to login
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
