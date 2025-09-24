"use client";
import { useState } from "react";
import StarRating from "./StarRating";

type Props = {
  onSubmit: (r: { rating: number; text: string; displayName: string }) => Promise<void>;
};

export default function ReviewForm({ onSubmit }: Props) {
  const [displayName, setDisplayName] = useState("Anónimo");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handle(e: React.FormEvent) {
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
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </label>
      <label>
        Calificación
        <StarRating value={rating} onChange={setRating} />
      </label>
      <label>
        Reseña
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Enviar reseña</button>
    </form>
  );
}
