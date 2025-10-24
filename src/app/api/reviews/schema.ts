import { z } from "zod";

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5), // 👈 convierte "5" -> 5
  text: z.string().trim().min(3),
  displayName: z.string().trim().min(2).max(40),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
