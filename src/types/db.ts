export type User = {
  _id?: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
};

export type Review = {
  _id?: string;
  userId: string;       // ObjectId string del autor
  bookId: string;       // Google Books volumeId
  rating: number;       // 1..5
  text: string;
  displayName: string;  // nombre visible
  createdAt: string;    // ISO
};

export type Vote = {
  _id?: string;
  reviewId: string;     // id de la reseña (string)
  userId: string;       // id de usuario (string)
  value: 1 | -1;
};

export type Favorite = {
  _id?: string;
  userId: string;
  bookId: string;
  title: string;
  image?: string;
  createdAt: string;
};

