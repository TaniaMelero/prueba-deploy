"use client";

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
  onVote: (id: string, v: 1 | -1) => void;
}) {
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
            <button onClick={() => onVote(r.id, 1)}>👍</button>
            <button onClick={() => onVote(r.id, -1)}>👎</button>
          </div>
        </article>
      ))}
    </div>
  );
}
