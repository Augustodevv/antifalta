export const metadata = { title: 'Anti-falta', description: 'Reduza faltas no WhatsApp' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui', maxWidth: 900, margin: '0 auto', padding: 24 }}>{children}</body>
    </html>
  );
}
