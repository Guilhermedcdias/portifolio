import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Página não encontrada</p>
      <Link href="/" style={{ marginTop: '2rem', color: '#a30000', textDecoration: 'underline' }}>
        Voltar para o início
      </Link>
    </div>
  );
}
