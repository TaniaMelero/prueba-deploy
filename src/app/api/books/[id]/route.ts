import { getBook } from "@/services/googleBooks";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getBook(params.id);
    return Response.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 404 });
    }
    return Response.json({ error: "Error desconocido" }, { status: 404 });
  }
}
