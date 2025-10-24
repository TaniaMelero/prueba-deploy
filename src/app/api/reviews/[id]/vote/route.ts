import { NextRequest } from "next/server";
import { z } from "zod";
import { getCol, ObjectId } from "@/lib/mongo";
import { Review, Vote } from "@/types/db";
import { requireUser } from "@/lib/auth";

const bodySchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const me = await requireUser();
  if (!me) return Response.json({ error: "No autenticado" }, { status: 401 });

  try {
    const { value } = bodySchema.parse(await req.json());
    const reviewIdParam = params.id;

    const reviews = await getCol<Review>("reviews");

    // Buscar la reseña aceptando _id string u ObjectId
    const reviewObjectId = ObjectId.isValid(reviewIdParam)
      ? new ObjectId(reviewIdParam)
      : null;

    const review =
      (reviewObjectId
        ? await reviews.findOne({ _id: reviewObjectId })
        : null) ??
      (await reviews.findOne({ _id: reviewIdParam }));

    if (!review) {
      return Response.json({ error: "Reseña no encontrada" }, { status: 404 });
    }

    const votes = await getCol<Vote>("votes");
    const reviewIdStr = String(review._id);

    // Un voto por (userId, reviewIdStr)
    await votes.updateOne(
      { reviewId: reviewIdStr, userId: me.uid },
      { $set: { reviewId: reviewIdStr, userId: me.uid, value } },
      { upsert: true }
    );

    // Recomputar score tolerando ambos tipos en colecc. antigua
    const agg = await votes
      .aggregate<{ score: number }>([
        {
          $addFields: {
            reviewIdStr: {
              $cond: [
                { $eq: [{ $type: "$reviewId" }, "objectId"] },
                { $toString: "$reviewId" },
                "$reviewId",
              ],
            },
          },
        },
        { $match: { reviewIdStr: reviewIdStr } },
        { $group: { _id: null, score: { $sum: "$value" } } },
      ])
      .toArray();

    const score = agg[0]?.score ?? 0;
    return Response.json({ ...review, score });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}
