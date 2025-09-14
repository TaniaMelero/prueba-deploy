"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

interface Book {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  publisher?: string;
  description?: string;
  image?: string;
}

interface Review {
  id: string;
  bookId: string;
  rating: number;
  comment: string;
  displayName: string;
  score: number;
  text: string;
  // Agrega más campos si tu API los devuelve
}

async function fetchBook(id: string): Promise<Book> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Error cargando el libro");
  return res.json();
}

async function fetchReviews(id: string): Promise<Review[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?bookId=${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const b = await fetchBook(params.id);
        setBook(b);
        const r = await fetchReviews(params.id);
        setReviews(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>No se encontró el libro.</p>;

  async function handleReviewSubmit(data: {
    rating: number;
    text: string;
    displayName: string;
  }) {
    if (!book) return;
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, bookId: book.id }),
    });
    // Recargar reseñas después de enviar
    const updated = await fetchReviews(book.id);
    setReviews(updated);
  }

  async function handleVote(reviewId: string, value: 1 | -1) {
    if (!book) return;
    await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    // Recargar reseñas después de votar
    const updated = await fetchReviews(book.id);
    setReviews(updated);
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
      <ReviewForm bookId={book.id} onSubmit={handleReviewSubmit} />
      <ReviewList items={reviews} onVote={handleVote} />
    </section>
  );
}
