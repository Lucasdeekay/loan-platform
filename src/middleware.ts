import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing in middleware");
}

const secret = new TextEncoder().encode(JWT_SECRET);

async function verifyEdgeToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isLoginRoute = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/apply");
  
  if (request.nextUrl.pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // 1️⃣ No token → block protected routes
  if (!token && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2️⃣ Token exists → verify it ONCE
  if (token) {
    const payload = await verifyEdgeToken(token);

    // ❌ Invalid token → clear cookie & go login
    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("auth-token");
      return res;
    }

    // 3️⃣ Logged-in user should not see login/register
    if (isLoginRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4️⃣ Admin route protection
    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
