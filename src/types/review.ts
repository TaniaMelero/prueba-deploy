// Tipos compartidos del dominio
export type Review = {
  id: string; // id interno de la reseña
  bookId: string; // Google Books volumeId
  userId: string; // autor
  displayName: string; // nombre visible
  rating: number; // 1..5
  text: string; // contenido
  createdAt: string; // ISO
};

export type Vote = {
  reviewId: string;
  userId: string;
  value: 1 | -1; // 👍 o 👎
};

export type ReviewWithScore = Review & { score: number };