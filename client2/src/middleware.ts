import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/services/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/settings", "/organizations"];
const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];

export default async function middleware(req: NextRequest) {
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
}
