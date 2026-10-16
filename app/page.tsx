import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1>Anti-falta no WhatsApp para barbearias</h1>
      <p>Reduza 50% das faltas com confirmação automática. R$97/mês.</p>
      <p><Link href="/login">Entrar</Link> · <Link href="/agenda">Ver agenda</Link></p>
      <a href="https://wa.me/5500000000000?text=Quero%20testar%2014%20dias">Quero testar 14 dias grátis</a>
    </main>
  );
}
