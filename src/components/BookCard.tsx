import Link from "next/link";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  publisher?: string;
  image?: string;
}

export default function BookCard({ b }: { b: Book }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 8,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      {b.image ? (
        <Image
          src={b.image}
          alt={b.title}
          width={80}
          height={120}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div style={{ width: 80, height: 120, background: "#ddd" }} />
      )}
      <div>
        <Link href={`/books/${b.id}`} style={{ fontWeight: "bold" }}>
          {b.title}
        </Link>
        <div>{b.authors?.join(", ")}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {b.publishedDate} · {b.publisher}
        </div>
      </div>
    </div>
  );
}
