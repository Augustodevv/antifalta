import { supabaseServer } from '@/lib/supabase';

export async function GET() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: 'login' }, { status: 401 });
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await sb.from('appointments')
    .select('id,starts_at,status,clients(name,phone),services(name)')
    .gte('starts_at', `${today}T00:00:00`).order('starts_at');
  return Response.json({ data });
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: 'login' }, { status: 401 });
  const body = await req.json();
  // body: { shop_id, client_name, phone, service_id, starts_at }
  const { data: shop } = await sb.from('shops').select('id').eq('owner_id', user.id).single();
  if (!shop) return Response.json({ error: 'crie seu shop' }, { status: 400 });
  const { data: client } = await sb.from('clients')
    .insert({ shop_id: shop.id, name: body.client_name, phone: body.phone.replace(/\D/g, '') })
    .select().single();
  const { data: appt, error } = await sb.from('appointments')
    .insert({ shop_id: shop.id, client_id: client!.id, service_id: body.service_id ?? null, starts_at: body.starts_at })
    .select().single();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true, appt });
}
