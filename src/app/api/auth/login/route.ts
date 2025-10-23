import { NextRequest } from "next/server";
import { z } from "zod";
import { getCol } from "@/lib/mongo";
import { User } from "@/types/db";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = schema.parse(body);

  const users = await getCol<User>("users");
  const u = await users.findOne({ email: email.toLowerCase() });
  if (!u) return Response.json({ error: "Credenciales inválidas" }, { status: 401 });

  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return Response.json({ error: "Credenciales inválidas" }, { status: 401 });

  await setAuthCookie({ uid: String(u._id), email: u.email, displayName: u.displayName });
  return Response.json({ ok: true });
}
