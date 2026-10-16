import { supabaseServer } from '@/lib/supabase';

export default async function Agenda() {
  const sb = supabaseServer();
  const { data: appts } = await sb.from('appointments')
    .select('id,starts_at,status,clients(name,phone)')
    .order('starts_at').limit(30);
  const noShow = (appts ?? []).filter((a: any) => a.status === 'no_show').length;
  return (
    <main>
      <h1>Agenda de hoje</h1>
      <p>Faltas no mês: {noShow} · Estimado salvo: R$ {(noShow * 40).toFixed(0)}</p>
      <ul>
        {(appts ?? []).map((a: any) => (
          <li key={a.id}>{new Date(a.starts_at).toLocaleString('pt-BR')} — {a.clients?.name} ({a.status})</li>
        ))}
      </ul>
      <p>Para agendar, use a API POST /api/appointments.</p>
    </main>
  );
}
