import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Protected routes (dashboard, apply)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/apply");

  // If no token and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login/register, redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verify token for protected routes
  if (token && (isProtectedRoute || isAdminRoute)) {
    const payload = verifyToken(token);

    // If token is invalid, clear cookie and redirect to login
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }

    // Check admin access
    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
