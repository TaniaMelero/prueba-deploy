"use client";
import { useState, useEffect } from "react";
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
  id: string;
  bookId: string;
  rating: number;
  displayName: string;
  score: number;
  text: string;
};

function getUserId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("bv:uid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("bv:uid", id);
  }
  return id;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const b = await fetchBook(params.id);
        setBook(b);
        setReviews(await fetchReviews(params.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
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
    const bookId = book.id;

    await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": getUserId(),
      },
      body: JSON.stringify({ ...data, bookId }),
    });

    setReviews(await fetchReviews(bookId));
  }

  async function handleVote(reviewId: string, value: 1 | -1) {
    if (!book) return;
    const bookId = book.id;

    await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": getUserId(),
      },
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

      {/* SIN bookId en el form */}
      <ReviewForm onSubmit={handleReviewSubmit} />
      <ReviewList items={reviews} onVote={handleVote} />
    </section>
  );
}
