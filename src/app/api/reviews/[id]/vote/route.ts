import { ReviewService } from "@/services/reviewService";
import { repoInstance } from "@/services/reviewRepoInstance";
import { NextRequest } from "next/server";

const service = new ReviewService(repoInstance);

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const userId = req.headers.get("x-user-id") || "anon";
  const { value } = await req.json();

  if (value !== 1 && value !== -1) {
    return Response.json({ error: "value debe ser 1 o -1" }, { status: 400 });
  }

  try {
    const updated = await service.vote(id, userId as string, value);
    return Response.json(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const code = msg.includes("no encontrada") ? 404 : 400;
    return Response.json({ error: msg }, { status: code });
  }
}
