import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchBooks, getBook } from "@/services/googleBooks";

type MockFetchResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<MockFetchResponse>;

const mockFetch = vi.fn<FetchLike>();
vi.stubGlobal("fetch", mockFetch as unknown as typeof fetch);

beforeEach(() => mockFetch.mockReset());

describe("GoogleBooks service", () => {
  it("searchBooks mapea resultados y fuerza https en imágenes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "id1",
            volumeInfo: {
              title: "Libro X",
              authors: ["Autor A"],
              imageLinks: { thumbnail: "http://books.google.com/some-thumb.jpg" },
              publishedDate: "2001",
              publisher: "Pub",
              description: "Desc",
            },
          },
        ],
      }),
    });

    const res = await searchBooks("harry");
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe("Libro X");
    expect(res[0].authors).toEqual(["Autor A"]);
    expect(res[0].image.startsWith("https://")).toBe(true);
  });

  it("getBook maneja faltantes con defaults", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "id2", volumeInfo: {} }),
    });

    const book = await getBook("id2");
    expect(book.title).toBe("(Sin título)");
    expect(book.description).toBe("(Sin descripción)");
    expect(book.image).toBe("");
    expect(book.publishedDate).toBe("-"); // default esperado
  });
});
