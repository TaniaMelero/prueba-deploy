---

## ✅ CI/CD

![CI](https://github.com/TaniaMelero/prueba-deploy/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/TaniaMelero/prueba-deploy/actions/workflows/docker.yml/badge.svg)

- **CI (PR)**: en cada Pull Request a `main` corre `npm ci`, `npm run typecheck`, `npm test` y `npm run build`. Si falla algo, el PR queda ❌.
- **Docker (main)**: en cada push a `main` construye y publica la imagen en GHCR:
  - `ghcr.io/taniamelero/prueba-deploy:latest`
  - `ghcr.io/taniamelero/prueba-deploy:<versión>`
  - `ghcr.io/taniamelero/prueba-deploy:<commit-sha>`

## 🔧 Variables de entorno

- `NEXT_PUBLIC_GOOGLE_BOOKS_API_URL` (opcional) – default: `https://www.googleapis.com/books/v1`.

## ▶️ Correr local

```bash
npm ci
npm run dev         # http://localhost:3000

npm run typecheck
npm run build
npm start           # http://localhost:3000
