import "./globals.css";
import Link from "next/link";
import { getUserFromRequest } from "@/lib/auth"; // server helper (lee cookie)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            borderBottom: "1px solid #333",
          }}
        >
          <Link href="/search" style={{ fontWeight: 700 }}>
            BookVerse
          </Link>

          <nav style={{ display: "flex", gap: 12 }}>
            {me ? (
              <>
                <span>Hola, {me.displayName}</span>
                {/* Si no vas a hacer /me, podés quitar este link */}
                <Link href="/me">Mi perfil</Link>
                <form action="/api/auth/logout" method="post" style={{ margin: 0 }}>
                  <button type="submit">Salir</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Iniciar sesión</Link>
                <Link href="/register">Registrarse</Link>
              </>
            )}
          </nav>
        </header>

        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
