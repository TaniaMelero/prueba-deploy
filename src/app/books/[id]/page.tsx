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
  _id?: string; // viene de Mongo
  id?: string; // compat viejos datos
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>No se encontró el libro.</p>;

  async function handleReviewSubmit(data: {
    rating: number;
    text: string;
    displayName: string;
  }) {
    if (!book) return; // ← narrowing
    const bookId = book.id; // ← ya no es null aquí

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, bookId }),
    });

    setReviews(await fetchReviews(bookId));
  }

  async function handleVote(reviewId: string, value: 1 | -1) {
    if (!book) return; // ← narrowing
    const bookId = book.id;

    await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    setReviews(await fetchReviews(bookId));
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
        </div>
      </div>

      {me ? (
        <ReviewForm onSubmit={handleReviewSubmit} />
      ) : (
        <p>Iniciá sesión para dejar una reseña y votar.</p>
      )}

      <ReviewList
        items={reviews.map((r) => ({
          id: r._id || r.id!, // compat
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
