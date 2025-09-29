"use client";
import { useState } from "react";
import StarRating from "./StarRating";

type ReviewPayload = {
  rating: number;
  text: string;
  displayName: string;
};

export default function ReviewForm({
  onSubmit,
}: {
  onSubmit: (r: ReviewPayload) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState("Anónimo");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim().length < 3) {
      setError("La reseña es muy corta");
      return;
    }
    setError("");
    await onSubmit({ rating, text, displayName });
    setText("");
  }

  return (
    <form
      onSubmit={handle}
      style={{
        border: "1px solid #eee",
        padding: 12,
        borderRadius: 8,
        display: "grid",
        gap: 8,
      }}
    >
      <label>
        Tu nombre visible
        <input
          aria-label="nombre visible"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </label>

      <label>
        Calificación
        <StarRating value={rating} onChange={setRating} />
      </label>

      <label>
        Reseña
        <textarea
          aria-label="reseña"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={3}
        />
      </label>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="submit">Enviar reseña</button>
    </form>
  );
}
