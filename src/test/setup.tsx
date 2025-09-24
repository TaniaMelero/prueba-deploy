import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";
import { webcrypto } from "node:crypto";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

type LinkProps = React.PropsWithChildren<
  { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>;
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: LinkProps) => (
    <a href={href ?? "#"} {...rest}>
      {children}
    </a>
  ),
}));

const g = globalThis as unknown as { crypto?: Crypto };
if (!g.crypto) {
  g.crypto = webcrypto as unknown as Crypto;
}
if (!g.crypto.randomUUID) {
  (g.crypto as unknown as { randomUUID: () => string }).randomUUID = () =>
    "00000000-0000-4000-8000-000000000000";
}
