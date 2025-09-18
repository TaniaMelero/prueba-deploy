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

  // cargar votos guardados del usuario
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bv:votes") || "{}");
      setMyVotes(saved);
    } catch {}
  }, []);

  function remember(id: string, v: 1 | -1) {
    const next = { ...myVotes, [id]: v };
    setMyVotes(next);
    localStorage.setItem("bv:votes", JSON.stringify(next));
  }

  async function vote(id: string, v: 1 | -1) {
    await onVote(id, v);
    remember(id, v);
  }

  if (!items.length)
    return <p>Sin reseñas todavía. ¡Sé la primera persona en opinar!</p>;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((r) => (
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
          <div>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>
          <p>{r.text}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => vote(r.id, 1)}
              style={{
                background: myVotes[r.id] === 1 ? "#e6ffea" : "transparent",
              }}
            >
              👍
            </button>
            <button
              onClick={() => vote(r.id, -1)}
              style={{
                background: myVotes[r.id] === -1 ? "#ffecec" : "transparent",
              }}
            >
              👎
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
