import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPage from "@/app/search/page";

type MockFetchResponse = { ok: boolean; json: () => Promise<unknown> };
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<MockFetchResponse>;
const mockFetch = vi.fn<FetchLike>();
vi.stubGlobal("fetch", mockFetch as unknown as typeof fetch);

beforeEach(() => mockFetch.mockReset());

describe("SearchPage", () => {
  it("busca y muestra resultados", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "x1", title: "Libro X", authors: ["Autor A"], publishedDate: "2000", publisher: "Pub" },
      ],
    });

    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText("Libro X")).toBeInTheDocument());

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "y1", title: "Otro Libro", authors: ["Autor B"], publishedDate: "1999", publisher: "X" },
      ],
    });

    await user.clear(screen.getByLabelText(/buscar/i));
    await user.type(screen.getByLabelText(/buscar/i), "asimov");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => expect(screen.getByText("Otro Libro")).toBeInTheDocument());
  });

  it("muestra error si la API falla", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    render(<SearchPage />);

    await waitFor(() =>
      expect(screen.getByText(/error buscando libros/i)).toBeInTheDocument()
    );
  });
});
