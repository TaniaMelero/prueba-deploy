"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

type Book = {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  publisher?: string;
  description?: string;
  image?: string;
};

type Review = {
  _id?: string;
  id?: string;
  bookId: string;
  rating: number;
  displayName: string;
  score: number;
  text: string;
  createdAt: string;
};

type Me = { _id: string; email: string; displayName: string } | null;

async function fetchBook(id: string): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error cargando el libro");
  return res.json();
}

async function fetchReviews(id: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?bookId=${id}`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [me, setMe] = useState<Me>(null);
  const [isFav, setIsFav] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar libro + reseñas
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [b, r] = await Promise.all([
          fetchBook(params.id),
          fetchReviews(params.id),
        ]);
        setBook(b);
        setReviews(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  // Cargar usuario autenticado
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  // Chequear favoritos
  useEffect(() => {
    (async () => {
      if (!me || !book) {
        setIsFav(false);
        return;
      }
      try {
        const res = await fetch("/api/favorites", { cache: "no-store" });
        if (!res.ok) return setIsFav(false);
        const items: Array<{ bookId: string }> = await res.json();
        setIsFav(items.some((f) => f.bookId === book.id));
      } catch {
        setIsFav(false);
      }
    })();
  }, [me, book]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>No se encontró el libro.</p>;

  async function handleReviewSubmit(data: {
    rating: number;
    text: string;
    displayName: string;
  }) {
    const bookId = params.id; // ✅ usar el id de la URL
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, bookId }),
    });
    setReviews(await fetchReviews(bookId));
  }

  async function handleVote(reviewId: string, value: 1 | -1) {
    const bookId = params.id; // ✅ usar el id de la URL
    await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    setReviews(await fetchReviews(bookId));
  }

  async function addFavorite() {
    if (!me || !book) return;
    try {
      setFavBusy(true);
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          image: book.image,
        }),
      });
      setIsFav(true);
    } finally {
      setFavBusy(false);
    }
  }

  async function removeFavorite() {
    if (!me || !book) return;
    try {
      setFavBusy(true);
      await fetch(`/api/favorites?bookId=${book.id}`, { method: "DELETE" });
      setIsFav(false);
    } finally {
      setFavBusy(false);
    }
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 16 }}>
        {book.image && (
          <Image
            src={book.image}
            alt={book.title}
            width={160}
            height={220}
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div>
          <h1>{book.title}</h1>
          <div>{book.authors?.join(", ")}</div>
          <small>
            {book.publishedDate} · {book.publisher}
          </small>
          <p>{book.description}</p>

          {/* Botones de favoritos */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {me ? (
              isFav ? (
                <button onClick={removeFavorite} disabled={favBusy}>
                  {favBusy ? "Quitando..." : "✖ Quitar de favoritos"}
                </button>
              ) : (
                <button onClick={addFavorite} disabled={favBusy}>
                  {favBusy ? "Guardando..." : "⭐ Guardar en favoritos"}
                </button>
              )
            ) : (
              <small>Iniciá sesión para guardar en favoritos.</small>
            )}
          </div>
        </div>
      </div>

      {me ? (
        <ReviewForm onSubmit={handleReviewSubmit} />
      ) : (
        <p>Iniciá sesión para dejar una reseña y votar.</p>
      )}

      <ReviewList
        items={reviews.map((r) => ({
          id: r._id || r.id!,
          displayName: r.displayName,
          score: r.score,
          rating: r.rating,
          text: r.text,
        }))}
        onVote={handleVote}
      />
    </section>
  );
}
