import { getBook } from "@/services/googleBooks";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params es Promise
) {
  try {
    const { id } = await context.params;      // 👈 hay que await
    const result = await getBook(id);
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 404 }
    );
  }
}
