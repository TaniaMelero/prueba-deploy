# BookVerse – Next.js + CI/CD

Plataforma de **descubrimiento y reseñas de libros**: buscá por título/autor/ISBN (Google Books), mirá detalles y dejá reseñas con votación 👍/👎.

**Demo producción:** https://TU-APP.vercel.app  
**Repositorio:** https://github.com/TU_USUARIO/TU_REPO

---

## 🧰 Stack

- **Next.js 15 (App Router)** + **React 19**
- **Zod** para validación
- **Vitest + Testing Library** (unit tests)
- **Vercel** (deploy)
- **GitHub Actions** (CI)
- **Docker (multi-stage)** + **GitHub Container Registry (GHCR)**

---

## ▶️ Correr local

Requisitos: **Node.js 20+**

```bash
# instalar dependencias
npm ci

# desarrollo
npm run dev         # abre en http://localhost:3000

# chequeo de tipos y build de producción
npm run typecheck
npm run build
npm start           # sirve la app en http://localhost:3000
