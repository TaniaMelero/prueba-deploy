// Servicio simple para consultar Google Books y devolver datos normalizados
const BASE = "https://www.googleapis.com/books/v1";


type Volume = {
    id: string;
    volumeInfo: {
        title?: string;
        authors?: string[];
        description?: string;
        imageLinks?: { thumbnail?: string; small?: string; medium?: string; large?: string };
        pageCount?: number;
        categories?: string[];
        publishedDate?: string;
        publisher?: string;
        industryIdentifiers?: { type: string; identifier: string }[];
    };
};


export async function searchBooks(q: string) {
    const res = await fetch(`${BASE}/volumes?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error("Error en Google Books");
    const data = await res.json();
    const items: Volume[] = data.items ?? [];
    return items.map(normalize);
}


export async function getBook(id: string) {
    const res = await fetch(`${BASE}/volumes/${id}`);
    if (!res.ok) throw new Error("Libro no encontrado");
    const v: Volume = await res.json();
    return normalize(v);
}


function normalize(v: Volume) {
    const vi = v.volumeInfo ?? {};
    return {
        id: v.id,
        title: vi.title ?? "(Sin título)",
        authors: vi.authors ?? [],
        description: vi.description ?? "(Sin descripción)",
        image: vi.imageLinks?.medium || vi.imageLinks?.large || vi.imageLinks?.thumbnail || "",
        pageCount: vi.pageCount ?? null,
        categories: vi.categories ?? [],
        publishedDate: vi.publishedDate ?? null,
        publisher: vi.publisher ?? null,
        isbn: vi.industryIdentifiers?.find(i => i.type.includes("ISBN"))?.identifier ?? null
    };
}