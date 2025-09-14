import { ReviewService } from "@/services/reviewService";
import { repoInstance } from "@/services/reviewRepoInstance";
import { NextRequest } from "next/server";

const service = new ReviewService(repoInstance);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId")?.trim();
  if (!bookId) return Response.json({ error: "Falta bookId" }, { status: 400 });
  try {
    const items = await service.listForBook(bookId);
    return Response.json(items);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Simulación de userId, en producción deberías obtenerlo de la sesión o header
  const userId = req.headers.get("x-user-id") || "anon";
  const body = await req.json();
  try {
    const created = await service.create(body, userId as string);
    return Response.json(created, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}
