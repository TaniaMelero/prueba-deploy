import { z } from "zod";
import { IReviewRepo } from "@/services/reviewRepo";
import { repoInstance } from "@/services/reviewRepoInstance";
import { Review, ReviewWithScore } from "@/types/review";

// Esquema de validación con Zod
const reviewInput = z.object({
  bookId: z.string().min(1, "bookId requerido"),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(3, "La reseña es muy corta"),
  displayName: z.string().trim().min(2).max(40),
});

export class ReviewService {
  constructor(private repo: IReviewRepo = repoInstance) {}

  // Crear reseña validando entrada
  async create(input: unknown, userId: string): Promise<ReviewWithScore> {
    const parsed = reviewInput.parse(input);

    const review: Review = {
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      ...parsed,
    };

    await this.repo.addReview(review);
    return { ...review, score: 0 };
  }

  // Listar reseñas ordenadas por score y fecha
  async listForBook(bookId: string): Promise<ReviewWithScore[]> {
    const items = await this.repo.listByBook(bookId);
    const withScore = await Promise.all(
      items.map(async (r) => ({ ...r, score: await this.repo.sumVotes(r.id) }))
    );
    return withScore.sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Votar reseña (idempotente por usuario)
  async vote(
    reviewId: string,
    userId: string,
    value: 1 | -1
  ): Promise<ReviewWithScore> {
    const found = await this.repo.getById(reviewId);
    if (!found) throw new Error("Reseña no encontrada");
    await this.repo.upsertVote({ reviewId, userId, value });
    const score = await this.repo.sumVotes(reviewId);
    return { ...found, score };
  }
}
