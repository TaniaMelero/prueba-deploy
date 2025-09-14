'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('harry potter');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSearch(q.trim());
      }}
      style={{ display: 'flex', gap: 8 }}
    >
      <input
        aria-label="buscar"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Título, autor o ISBN"
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}