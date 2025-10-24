"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || "No se pudo registrar");
      return;
    }

    // Registro OK → voy a login
    window.location.href = "/auth/login";
  }

  return (
    <section style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Registrarse</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <label>Email
          <input type="email" value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 required />
        </label>

        <label>Nombre visible (opcional)
          <input value={displayName}
                 onChange={(e)=>setDisplayName(e.target.value)} />
        </label>

        <label>Contraseña (mín. 6)
          <input type="password" value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 required />
        </label>

        {error && <p style={{ color: "tomato" }}>{error}</p>}
        <button type="submit">Crear cuenta</button>
      </form>
    </section>
  );
}
