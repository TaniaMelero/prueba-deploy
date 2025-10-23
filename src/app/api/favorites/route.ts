import { NextRequest } from "next/server";
import { z } from "zod";
import { getCol } from "@/lib/mongo";
import { Favorite } from "@/types/db";
import { requireUser } from "@/lib/auth";

const bodySchema = z.object({
  bookId: z.string().min(1),
  title: z.string().min(1),
  image: z.string().url().optional(),
});

// GET: lista mis favoritos
export async function GET() {
  const me = await requireUser();
  if (!me) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const col = await getCol<Favorite>("favorites");
  const items = await col.find({ userId: me.uid }).sort({ createdAt: -1 }).toArray();
  return Response.json(items);
}

// POST: agregar favorito
export async function POST(req: NextRequest) {
  const me = await requireUser();
  if (!me) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const data = bodySchema.parse(await req.json());
  const col = await getCol<Favorite>("favorites");

  // Evitar duplicados por (userId, bookId)
  const exists = await col.findOne({ userId: me.uid, bookId: data.bookId });
  if (exists) {
    return Response.json({ ok: true, message: "Ya estaba en favoritos" });
  }

  const doc: Favorite = {
    userId: me.uid,
    bookId: data.bookId,
    title: data.title,
    image: data.image,
    createdAt: new Date().toISOString(),
  };

  await col.insertOne(doc);
  return Response.json({ ok: true }, { status: 201 });
}

// DELETE: ?bookId=...
export async function DELETE(req: NextRequest) {
  const me = await requireUser();
  if (!me) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId")?.trim();
  if (!bookId) {
    return Response.json({ error: "Falta bookId" }, { status: 400 });
  }

  const col = await getCol<Favorite>("favorites");
  await col.deleteOne({ userId: me.uid, bookId });
  return new Response(null, { status: 204 });
}
