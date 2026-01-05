import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
  role: string;
}

/* ---------------- PASSWORDS ---------------- */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/* ---------------- JWT ---------------- */

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

/* ---------------- COOKIES ---------------- */

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function getAuthCookie(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export function removeAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

/* ---------------- AUTH HELPERS ---------------- */

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = getAuthCookie();
  if (!token) return null;
  return await verifyToken(token);
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}
