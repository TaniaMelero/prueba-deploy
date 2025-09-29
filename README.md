# BookVerse – Next.js + CI/CD

Plataforma de descubrimiento y reseñas de libros: buscá por título/autor/ISBN (Google Books), mirá detalles y dejá reseñas con votación 👍/👎.

**Demo producción:** <https://<tu-app>.vercel.app>  
**Repositorio:** <https://github.com/<TU_USUARIO>/<TU_REPO>>

---

## 🧰 Stack

- Next.js 15 (App Router) · React 19
- Zod (validación)
- Vitest + Testing Library (tests)
- Vercel (deploy)
- GitHub Actions (CI)
- Docker (multi-stage) + GHCR

---

## ▶️ Ejecutar local

Requisitos: Node.js 20+

```bash
# instalar deps
npm ci

# desarrollo
npm run dev   # http://localhost:3000

# type-check y build prod
npm run typecheck
npm run build
npm start     # http://localhost:3000
