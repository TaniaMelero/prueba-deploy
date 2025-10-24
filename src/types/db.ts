import type { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId | string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
};

export type Review = {
  _id?: ObjectId | string;
  userId: string;
  bookId: string;
  rating: number;
  text: string;
  displayName: string;
  createdAt: string;
};

export type Vote = {
  _id?: ObjectId | string;
  reviewId: string;      // guardado como string
  userId: string;
  value: 1 | -1;
};

export type Favorite = {
  _id?: ObjectId | string;
  userId: string;
  bookId: string;
  title: string;         // 👈 agregado (requerido)
  image?: string;        // 👈 agregado (opcional)
  createdAt: string;
};
