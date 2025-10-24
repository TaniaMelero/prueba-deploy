import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { getUserFromRequest } from "@/lib/auth"; // server helper (lee cookie JWT)

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server Component: podemos leer la cookie acá
  const me = await getUserFromRequest(); // null si no hay sesión

  return (
    <html lang="es">
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <Link href="/search" style={{ fontWeight: 700 }}>
            BookVerse
          </Link>

          <nav style={{ display: "flex", gap: 12 }}>
            {me ? (
              <>
                <span>Hola, {me.displayName}</span>
                {/* Si agregás la página de perfil, habilitá el link de abajo */}
                {/* <Link href="/me">Mi perfil</Link> */}
                <form action="/api/auth/logout" method="post" style={{ margin: 0 }}>
                  <button type="submit">Salir</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">Iniciar sesión</Link>
                <Link href="/auth/register">Registrarse</Link>
              </>
            )}
          </nav>
        </header>

        <main id="app-main" style={{ padding: 16 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
