// src/services/googleBooks.ts
const BASE =
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_URL ??
  "https://www.googleapis.com/books/v1";

type Volume = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    pageCount?: number;
    categories?: string[];
    publishedDate?: string;
    publisher?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
};

export async function searchBooks(q: string) {
  if (!q?.trim()) return [];
  const res = await fetch(
    `${BASE}/volumes?q=${encodeURIComponent(q)}&maxResults=10`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Error en Google Books");
  const data = await res.json();
  const items: Volume[] = data.items ?? [];
  return items.map(normalize);
}

export async function getBook(id: string) {
  const res = await fetch(`${BASE}/volumes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Libro no encontrado");
  const v: Volume = await res.json();
  return normalize(v);
}

function normalize(v: Volume) {
  const vi = v.volumeInfo ?? {};
  const rawImg =
    vi.imageLinks?.medium ||
    vi.imageLinks?.large ||
    vi.imageLinks?.thumbnail ||
    vi.imageLinks?.smallThumbnail ||
    "";
  // fuerza https por si viene con http://
  const image = rawImg ? rawImg.replace(/^http:\/\//, "https://") : "";

  return {
    id: v.id,
    title: vi.title ?? "(Sin título)",
    authors: vi.authors ?? [],
    description: vi.description ?? "(Sin descripción)",
    image,
    pageCount: vi.pageCount ?? 0,
    categories: vi.categories ?? [],
    publishedDate: vi.publishedDate ?? "-",
    publisher: vi.publisher ?? "-",
    isbn:
      vi.industryIdentifiers?.find((i) => i.type.includes("ISBN"))
        ?.identifier ?? "-",
  };
}
