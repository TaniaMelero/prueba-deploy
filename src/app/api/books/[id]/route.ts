import { getBook } from "@/services/googleBooks";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const result = await getBook(id);
    return Response.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 404 });
    }
    return Response.json({ error: "Error desconocido" }, { status: 404 });
  }
}
