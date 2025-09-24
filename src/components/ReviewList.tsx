"use client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  displayName: string;
  score: number;
  rating: number;
  text: string;
}

export default function ReviewList({
  items,
  onVote,
}: {
  items: Review[];
  onVote: (id: string, v: 1 | -1) => Promise<void> | void;
}) {
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Cargar votos guardados del usuario
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bv:votes") || "{}");
      setMyVotes(saved);
    } catch {
      // ignore
    }
  }, []);

  function remember(id: string, v: 1 | -1) {
    const next = { ...myVotes, [id]: v };
    setMyVotes(next);
    localStorage.setItem("bv:votes", JSON.stringify(next));
  }

  async function vote(id: string, v: 1 | -1) {
    if (loadingId) return; // evita doble-click mientras hay request
    setLoadingId(id);
    try {
      await onVote(id, v);
      remember(id, v);
    } finally {
      setLoadingId(null);
    }
  }

  if (!items.length)
    return <p>Sin reseñas todavía. ¡Sé la primera persona en opinar!</p>;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((r) => {
        const safe = Math.max(0, Math.min(5, r.rating || 0));
        return (
          <article
            key={r.id}
            style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>{r.displayName}</strong>
              <div aria-label="score">Score: {r.score}</div>
            </div>

            {/* Estrellas (read-only) con color visible en fondo oscuro */}
            <div
              aria-label={`rating ${safe}/5`}
              style={{ fontSize: 18, letterSpacing: 1 }}
            >
              <span style={{ color: "#f5c518" }}>{"★".repeat(safe)}</span>
              <span style={{ color: "#8a8a8a" }}>{"☆".repeat(5 - safe)}</span>
            </div>

            <p>{r.text}</p>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => vote(r.id, 1)}
                disabled={loadingId === r.id}
                aria-pressed={myVotes[r.id] === 1}
                title="Me gusta"
                style={{
                  background: myVotes[r.id] === 1 ? "#e6ffea" : "transparent",
                  opacity: loadingId === r.id ? 0.6 : 1,
                  cursor: loadingId === r.id ? "not-allowed" : "pointer",
                }}
              >
                👍
              </button>
              <button
                onClick={() => vote(r.id, -1)}
                disabled={loadingId === r.id}
                aria-pressed={myVotes[r.id] === -1}
                title="No me gusta"
                style={{
                  background: myVotes[r.id] === -1 ? "#ffecec" : "transparent",
                  opacity: loadingId === r.id ? 0.6 : 1,
                  cursor: loadingId === r.id ? "not-allowed" : "pointer",
                }}
              >
                👎
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
