import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "auth_token";
const JWT_SECRET = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(JWT_SECRET);

type AuthPayload = { uid: string; email: string; displayName: string };

// Guarda JWT en cookie (httpOnly)
export async function setAuthCookie(payload: AuthPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
}

export async function getUserFromRequest(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE_NAME);
  if (!c?.value) return null;

  try {
    const { payload } = await jwtVerify(c.value, key);
    return {
      uid: String(payload.uid),
      email: String(payload.email),
      displayName: String(payload.displayName),
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<AuthPayload | null> {
  return getUserFromRequest();
}
