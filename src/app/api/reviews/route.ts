import { NextRequest } from "next/server";
import { z } from "zod";
import { getCol } from "@/lib/mongo";
import { Review, Vote } from "@/types/db";
import { requireUser } from "@/lib/auth";

const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(3),
  displayName: z.string().trim().min(2).max(40),
});

// GET ?bookId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId")?.trim();
  if (!bookId) return Response.json({ error: "Falta bookId" }, { status: 400 });

  const reviewsCol = await getCol<Review>("reviews");
  const votesCol = await getCol<Vote>("votes");

  const list = await reviewsCol
    .find({ bookId })
    .sort({ createdAt: -1 })
    .toArray();

  // ids de reseñas como string (asumimos votes.reviewId guarda string)
  const reviewIds = list.map((r) => String(r._id));

  // sumar votos por reviewId (string)
  const agg = await votesCol
    .aggregate<{ _id: string; score: number }>([
      { $match: { reviewId: { $in: reviewIds } } },
      { $group: { _id: "$reviewId", score: { $sum: "$value" } } },
    ])
    .toArray();

  const scoreById = new Map(agg.map((x) => [x._id, x.score]));
  const withScore = list.map((r) => ({
    ...r,
    score: scoreById.get(String(r._id)) ?? 0,
  }));

  // ordenar por score desc, luego fecha desc
  withScore.sort(
    (a, b) =>
      b.score - a.score ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return Response.json(withScore);
}

// POST (autenticado)
export async function POST(req: NextRequest) {
  const me = await requireUser();
  if (!me) return Response.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    const reviews = await getCol<Review>("reviews");
    const doc: Review = {
      userId: me.uid,
      bookId: data.bookId,
      rating: data.rating,
      text: data.text,
      displayName: data.displayName,
      createdAt: new Date().toISOString(),
    };

    await reviews.insertOne(doc);
    return Response.json({ ...doc, _id: doc._id }, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}
