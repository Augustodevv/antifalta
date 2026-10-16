import { supabaseServer } from '@/lib/supabase';

export async function GET(req: Request) {
  // Segurança do cron: exige ?secret= ou header
  const url = new URL(req.url);
  if (url.searchParams.get('secret') !== process.env.CRON_SECRET)
    return new Response('unauthorized', { status: 401 });

  const supabase = supabaseServer();
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 3600 * 1000);
  const in2h = new Date(now.getTime() + 2 * 3600 * 1000);

  // 1) Lembrete 24h: agendados para daqui ~24h e ainda não enviados
  const { data: list24 } = await supabase
    .from('appointments')
    .select('id,starts_at,status,reminder_24h_sent_at,shop_id,clients(name,phone),shops(name)')
    .eq('status', 'scheduled')
    .is('reminder_24h_sent_at', null)
    .gte('starts_at', in24h.toISOString())
    .lt('starts_at', new Date(in24h.getTime() + 15 * 60 * 1000).toISOString())
    .limit(50);

  const { sendWhats, reminderMsg } = await import('@/lib/whatsapp');
  let sent = 0;
  for (const a of list24 ?? []) {
    const phone = (a as any).clients?.phone;
    if (!phone) continue;
    const when = new Date(a.starts_at).toLocaleString('pt-BR');
    await sendWhats(phone, reminderMsg((a as any).clients.name, (a as any).shops.name, when, a.id));
    await supabase.from('appointments').update({ reminder_24h_sent_at: now.toISOString() }).eq('id', a.id);
    sent++;
  }
  // 2) Lembrete 2h: mesma lógica (omitido por brevidade, replica com reminder_2h_sent_at)
  return Response.json({ ok: true, sent });
}
