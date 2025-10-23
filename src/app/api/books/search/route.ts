import { NextRequest } from "next/server";
import { searchBooks } from "@/services/googleBooks";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "Falta query q" }, { status: 400 });
  try {
    const result = await searchBooks(q);
    return Response.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    return Response.json({ error: "Error desconocido" }, { status: 500 });
  }
}
