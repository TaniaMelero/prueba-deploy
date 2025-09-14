import { Review, Vote } from "../domain/types.js";


export interface IReviewRepo {
addReview(r: Review): Promise<void>;
listByBook(bookId: string): Promise<Review[]>;
getById(id: string): Promise<Review | undefined>;
upsertVote(v: Vote): Promise<void>; // un voto por (userId, reviewId)
sumVotes(reviewId: string): Promise<number>;
}


// Implementación en memoria (Map) – simple para TP
export class InMemoryReviewRepo implements IReviewRepo {
private reviews = new Map<string, Review>();
private votes = new Map<string, Vote>(); // key: `${userId}:${reviewId}`


async addReview(r: Review) { this.reviews.set(r.id, r); }


async listByBook(bookId: string) {
return [...this.reviews.values()].filter(r => r.bookId === bookId);
}


async getById(id: string) { return this.reviews.get(id); }


async upsertVote(v: Vote) {
const key = `${v.userId}:${v.reviewId}`;
this.votes.set(key, v); // re‑escribe si el usuario cambia su voto
}


async sumVotes(reviewId: string) {
let sum = 0;
for (const v of this.votes.values()) if (v.reviewId === reviewId) sum += v.value;
return sum;
}
}