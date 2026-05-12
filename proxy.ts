import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("auth_session")?.value;

  const publicPaths = ["/auth/login", "/auth/signup"];
  const protectedPaths = ["/", "/api/destinations"];

  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthApi = pathname.startsWith("/api/auth/");

  if (isAuthApi) {
    return NextResponse.next();
  }

  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL("/auth/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicPath && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};
