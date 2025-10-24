import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getCol } from "@/lib/mongo";
import type { User } from "@/types/db";
import { setAuthCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json());
    const users = await getCol<User>("users");
    const u = await users.findOne({ email: email.toLowerCase() });
    if (!u) return Response.json({ error: "Credenciales inválidas" }, { status: 401 });

    const ok = await bcrypt.compare(password, u.passwordHash!);
    if (!ok) return Response.json({ error: "Credenciales inválidas" }, { status: 401 });

    await setAuthCookie({ uid: String(u._id), email: u.email, displayName: u.displayName || u.email });
    // devolvemos 200 simple
    return NextResponse.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
