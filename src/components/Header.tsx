// src/components/Header.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [me, setMe] = useState<{displayName: string} | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(setMe).catch(()=>setMe(null));
  }, []);

  return (
    <header style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",borderBottom:"1px solid #eee"}}>
      <Link href="/search"><strong>BookVerse</strong></Link>
      <nav style={{display:"flex",gap:12}}>
        {me ? (
          <>
            <span>Hola, {me.displayName}</span>
            <form action="/api/auth/logout" method="post">
              <button>Salir</button>
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
  );
}
