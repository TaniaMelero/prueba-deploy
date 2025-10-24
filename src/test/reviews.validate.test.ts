import { describe, it, expect } from "vitest";
import { reviewSchema } from "@/app/api/reviews/schema"; // 👈 ya no toca la DB

describe("reviewSchema", () => {
  it("rechaza reseña demasiado corta", () => {
    const bad = { bookId: "x", rating: 3, text: "no", displayName: "Ana" };
    expect(() => reviewSchema.parse(bad)).toThrow();
  });

  it("acepta reseña válida", () => {
    const ok = { bookId: "x", rating: 4, text: "Muy buen libro", displayName: "Ana" };
    expect(() => reviewSchema.parse(ok)).not.toThrow();
  });
});
