import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewForm from "@/components/ReviewForm";

describe("ReviewForm", () => {
  it("selecciona estrellas y envía rating/text correctos", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ReviewForm bookId="b1" onSubmit={onSubmit} />);

    const stars = screen.getAllByRole("radio");
    await user.click(stars[2]);

    const textarea = screen.getByLabelText(/reseña/i);
    await user.type(textarea, "Muy bueno");
    await user.click(screen.getByRole("button", { name: /enviar reseña/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ rating: 3, text: "Muy bueno" })
    );
  });

  it("valida: reseña demasiado corta", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ReviewForm bookId="b1" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/reseña/i), "no");
    await user.click(screen.getByRole("button", { name: /enviar reseña/i }));

    expect(await screen.findByText(/muy corta/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
