"use client";
import { useEffect, useState } from "react";

type Me = { _id: string; email: string; displayName: string } | null;
type Review = {
  _id: string;
  bookId: string;
  rating: number;
  text: string;
  displayName: string;
  score: number;
  createdAt: string;
};

type Book = { id: string; title: string };

async function fetchMine(): Promise<Review[]> {
  const res = await fetch("/api/reviews?userId=me", { cache: "no-store" });
  return res.ok ? res.json() : [];
}

async function fetchBookTitle(id: string): Promise<string> {
  const res = await fetch(`/api/books/${id}`, { cache: "no-store" });
  if (!res.ok) return id;
  const b: Book = await res.json();
  return b.title || id;
}

export default function ProfilePage() {
  const [me, setMe] = useState<Me>(null);
  const [items, setItems] = useState<Review[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await fetch("/api/auth/me").then(r => (r.ok ? r.json() : null)).catch(() => null);
      setMe(u);
      if (u) {
        const r = await fetchMine();
        setItems(r);
        // titles
        const uniqueBookIds = Array.from(new Set(r.map(x => x.bookId)));
        const pairs = await Promise.all(
          uniqueBookIds.map(async id => [id, await fetchBookTitle(id)] as const)
        );
        setTitles(Object.fromEntries(pairs));
      }
      setLoading(false);
    })();
  }, []);

  async function removeReview(id: string) {
    const ok = confirm("¿Eliminar reseña?");
    if (!ok) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(x => x._id !== id));
    } else {
      alert("No se pudo eliminar");
    }
  }

  async function editReview(id: string, oldText: string) {
    const t = prompt("Nuevo texto de la reseña:", oldText);
    if (!t || t.trim().length < 3) return;
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t.trim() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(prev => prev.map(x => (x._id === id ? { ...x, text: updated.text } : x)));
    } else {
      alert("No se pudo editar");
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (!me) return <p>Iniciá sesión para ver tu perfil.</p>;

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h1>Mi perfil</h1>
      <div><strong>{me.displayName}</strong> · {me.email}</div>

      <h2>Mis reseñas</h2>
      {!items.length ? (
        <p>No tenés reseñas aún.</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map(r => (
            <article key={r._id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{titles[r.bookId] ?? r.bookId}</div>
                  <small>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} · {new Date(r.createdAt).toLocaleString()}
                  </small>
                </div>
                <div>Score: {r.score}</div>
              </div>
              <p>{r.text}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => editReview(r._id, r.text)}>Editar</button>
                <button onClick={() => removeReview(r._id)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
