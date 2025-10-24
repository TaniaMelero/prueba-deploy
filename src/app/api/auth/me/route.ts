import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const me = await getUserFromRequest();
  if (!me) return Response.json(null, { status: 200 });
  return Response.json(me);
}
