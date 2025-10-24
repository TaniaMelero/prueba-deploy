"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error || "Error al iniciar sesión");
      return;
    }

    // Login OK → voy a la búsqueda
    window.location.href = "/search";
  }

  return (
    <section style={{ maxWidth: 380, margin: "40px auto" }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <label>Email
          <input type="email" value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 required />
        </label>
        <label>Contraseña
          <input type="password" value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 required />
        </label>
        {error && <p style={{ color: "tomato" }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}
