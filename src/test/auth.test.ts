// src/test/auth.test.ts
import { describe, it, expect, vi } from "vitest";

// Mock de next/headers.cookies() para que no haya cookie
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    set: () => {},
  }),
}));

import { getUserFromRequest } from "@/lib/auth";

describe("auth getUserFromRequest", () => {
  it("devuelve null si no hay cookie", async () => {
    const u = await getUserFromRequest();
    expect(u).toBeNull();
  });
});
