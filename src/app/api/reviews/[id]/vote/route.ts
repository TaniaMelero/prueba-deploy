import { ReviewService } from "@/services/reviewService";
import { repoInstance } from "@/services/reviewRepoInstance";
import { NextRequest } from "next/server";

const service = new ReviewService(repoInstance);

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  // Simulación de userId, en producción deberías obtenerlo de la sesión o header
  const userId = req.headers.get("x-user-id") || "anon";
  const { value } = await req.json();
  if (value !== 1 && value !== -1)
    return Response.json({ error: "value debe ser 1 o -1" }, { status: 400 });
  try {
    const updated = await service.vote(params.id, userId as string, value);
    return Response.json(updated);
  } catch (e) {
    let msg = "Error";
    if (e instanceof Error) {
      msg = e.message;
    }
    const code = msg.includes("no encontrada") ? 404 : 400;
    return Response.json({ error: msg }, { status: code });
  }
}
