import { NextRequest } from "next/server";
import { z } from "zod";
import { getCol } from "@/lib/mongo";
import { User } from "@/types/db";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(40).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName } = schema.parse(body);

    const users = await getCol<User>("users");

    const exists = await users.findOne({ email: email.toLowerCase() });
    if (exists) {
      return Response.json({ error: "El email ya está registrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doc: User = {
      email: email.toLowerCase(),
      displayName: displayName || email.split("@")[0],
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await users.insertOne(doc); // sin any
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}
