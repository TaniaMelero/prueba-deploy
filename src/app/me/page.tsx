// src/app/me/page.tsx
import { redirect } from "next/navigation";
import { getUserFromRequest } from "@/lib/auth";

type Review = {
  _id: string;
  bookId: string;
  rating: number;
  text: string;
  displayName: string;
  createdAt: string;
  score?: number;
};

export default async function MePage() {
  // Si no hay sesión, mandamos a login
  const me = await getUserFromRequest();
  if (!me) redirect("/auth/login?next=/me");

  // Pedimos mis reseñas (el endpoint ya soporta ?userId=me)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/reviews?userId=me`, {
    cache: "no-store",
    // En SSR Next incluye cookies automáticamente; este fetch funciona en local y en Vercel
  });

  const reviews: Review[] = res.ok ? await res.json() : [];

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h1>Mi perfil</h1>
      <div>
        <strong>Usuario:</strong> {me.displayName} <br />
        <small>{me.email}</small>
      </div>

      <h2>Mis reseñas</h2>
      {!reviews.length ? (
        <p>Todavía no escribiste reseñas.</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {reviews.map((r) => (
            <article
              key={r._id}
              style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Libro: {r.bookId}</strong>
                <span>⭐ {r.rating} · Score: {r.score ?? 0}</span>
              </div>
              <small>{new Date(r.createdAt).toLocaleString()}</small>
              <p style={{ marginTop: 8 }}>{r.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
