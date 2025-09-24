import { describe, it, expect, vi, beforeEach } from "vitest";
import { InMemoryReviewRepo } from "@/services/reviewRepo";
import { ReviewService } from "@/services/reviewService";

describe("ReviewService (negocio)", () => {
  beforeEach(() => {
    vi.useRealTimers(); // por si algún test anterior tocó timers
  });

  it("crea reseña válida con score inicial 0", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    const r = await svc.create(
      { bookId: "b1", rating: 5, text: "Excelente", displayName: "Tania" },
      "u1"
    );
    expect(r.bookId).toBe("b1");
    expect(r.score).toBe(0);
  });

  it("valida: rating fuera de 1..5, texto corto y displayName corto", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    await expect(
      svc.create({ bookId: "b1", rating: 0, text: "ok", displayName: "AB" }, "u")
    ).rejects.toBeTruthy();
    await expect(
      svc.create({ bookId: "b1", rating: 3, text: "x", displayName: "Ana" }, "u")
    ).rejects.toBeTruthy();
    await expect(
      svc.create({ bookId: "b1", rating: 3, text: "bien", displayName: "A" }, "u")
    ).rejects.toBeTruthy();
  });

  it("votos: se acumulan por distintos usuarios y cambiar 👍→👎 mueve ±2", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    const r = await svc.create(
      { bookId: "bx", rating: 4, text: "bueno", displayName: "Ana" },
      "author"
    );

    let after = await svc.vote(r.id, "u1", 1); // +1
    expect(after.score).toBe(1);

    after = await svc.vote(r.id, "u1", -1); // cambia de +1 a -1 → -1
    expect(after.score).toBe(-1);

    after = await svc.vote(r.id, "u2", 1); // otro user compensa → 0
    expect(after.score).toBe(0);
  });

  it("vote: reseña inexistente lanza error", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    await expect(svc.vote("nope", "u1", 1)).rejects.toBeTruthy();
  });

  it("orden: por score desc y, si empatan, por fecha (más nueva primero)", async () => {
    const repo = new InMemoryReviewRepo();
    const svc = new ReviewService(repo);

    // controlamos el tiempo de creación
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T10:00:00Z"));
    const r1 = await svc.create({ bookId: "b", rating: 3, text: "uno", displayName: "A1" }, "a1");

    vi.setSystemTime(new Date("2025-01-01T10:00:01Z"));
    const r2 = await svc.create({ bookId: "b", rating: 4, text: "dos", displayName: "A2" }, "a2");

    // Misma puntuación: r1 +1, r2 +1
    await svc.vote(r1.id, "u1", 1);
    await svc.vote(r2.id, "u1", 1);

    const list = await svc.listForBook("b");
    // score empata (1 y 1), el más nuevo primero → r2, luego r1
    expect(list.map((x) => x.id)).toEqual([r2.id, r1.id]);
  });
});
