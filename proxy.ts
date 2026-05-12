import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("auth_session")?.value;

  // Public paths that do not require authentication and should never receive a 'from' parameter
  const publicPaths = ["/auth/login", "/auth/signup"];
  // Protected paths that require authentication
  const protectedPaths = ["/", "/api/destinations"];

  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthApi = pathname.startsWith("/api/auth/");

  // Auth API routes are always accessible
  if (isAuthApi) {
    return NextResponse.next();
  }

  // Protected routes require a valid session
  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL("/auth/login", request.url);
    // Only add 'from' parameter if the original path is not a public auth path
    if (pathname !== "/" && !publicPaths.some((p) => pathname.startsWith(p))) {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users accessing public auth pages should not be redirected;
  // allow them to stay on the page (they may want to use the from parameter to return elsewhere)
  if (isPublicPath && sessionToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};
