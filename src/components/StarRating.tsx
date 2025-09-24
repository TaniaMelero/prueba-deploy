"use client";
export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div
      role="radiogroup"
      aria-label="calificación"
      style={{ display: "inline-flex", gap: 4 }}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button" // evita submit
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            color: n <= value ? "#f5c518" : "#8a8a8a", // 💛 dorado / gris
          }}
        >
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
