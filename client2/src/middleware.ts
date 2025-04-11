import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/services/auth";
import { logger } from "@/lib/axiom/server";
// 1. Specify protected and public routes
const protectedRoutes = ["/settings", "/organizations"];
const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  logger.info(...transformMiddlewareRequest(req));
  try {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = protectedRoutes.includes(path);

    // handle public routes
    if (isPublicRoute || !isProtectedRoute) {
      return NextResponse.next();
    }

    // handle protected routes

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
    }

    const isUserAuthenticated = isAuthenticated({ token: cookie });

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !isUserAuthenticated) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
    }
    // if user is authenticated, can go wherever
    return NextResponse.next();
  } finally {
    event.waitUntil(logger.flush());
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
