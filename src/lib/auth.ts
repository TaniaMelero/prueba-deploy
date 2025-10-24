import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "auth_token";
const JWT_SECRET = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(JWT_SECRET);

export async function setAuthCookie(payload: { uid: string; email: string; displayName: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const c = await cookies();
  c.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getUserFromRequest():
  Promise<{ uid: string; email: string; displayName: string } | null> {
  const c = await cookies();
  const cookie = c.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  try {
    const { payload } = await jwtVerify(cookie.value, key);
    return {
      uid: String(payload.uid),
      email: String(payload.email),
      displayName: String(payload.displayName),
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  return await getUserFromRequest();
}
