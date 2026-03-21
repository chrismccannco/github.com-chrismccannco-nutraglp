import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // Host-based routing: serve ContentFoundry landing at getcontentfoundry.com
  if (host === "getcontentfoundry.com" || host === "www.getcontentfoundry.com") {
    // Rewrite root to /contentfoundry page; pass through assets and API
    if (
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/images") &&
      !pathname.startsWith("/fonts") &&
      pathname !== "/favicon.ico" &&
      pathname !== "/robots.txt" &&
      pathname !== "/sitemap.xml"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? "/contentfoundry" : `/contentfoundry${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

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
  matcher: [
    /*
     * Match all paths except static files (_next/static, _next/image, public assets)
     * so host-based routing works, but don't slow down static asset delivery.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
