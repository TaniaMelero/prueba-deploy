// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookVerse",
  description: "Descubrí libros, leé y votá reseñas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
          <header
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Link
              href="/search"
              style={{ textDecoration: "none", fontWeight: "bold" }}
            >
              📚 BookVerse
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
