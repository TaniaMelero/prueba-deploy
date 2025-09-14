'use client';
export default function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div role="radiogroup" aria-label="calificación">
      {stars.map(n => (
        <button
          key={n}
          aria-checked={value === n}
          role="radio"
          onClick={() => onChange(n)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}