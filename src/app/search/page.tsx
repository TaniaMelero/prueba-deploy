"use client";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  // Agrega más campos si tu API los devuelve
}

export default function SearchPage() {
  const [q, setQ] = useState("harry potter");
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(query: string) {
    setQ(query);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/books/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Error buscando libros");
      const result: Book[] = await res.json();
      setData(result);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("Error desconocido");
    }
    setLoading(false);
  }

  useEffect(() => {
    handleSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <SearchBar onSearch={handleSearch} />
      <div aria-live="polite">
        {loading && <p>Cargando…</p>}
        {error && <p>{error}</p>}
      </div>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {data.map((b) => (
          <BookCard key={b.id} b={b} />
        ))}
      </div>
    </section>
  );
}
