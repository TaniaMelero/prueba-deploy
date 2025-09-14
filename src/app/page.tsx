import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
          📚 BookVerse
        </Link>
      </header>
      {/* Aquí puedes renderizar componentes o contenido adicional */}
    </div>
  );
}