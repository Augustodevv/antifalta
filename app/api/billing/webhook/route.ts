import { createClient } from '@supabase/supabase-js';

// Webhook Asaas: configure para chamar POST /api/billing/webhook com token
export async function POST(req: Request) {
  if (req.headers.get('x-webhook-token') !== process.env.ASAAS_WEBHOOK_TOKEN)
    return new Response('unauthorized', { status: 401 });
  const body = await req.json(); // { shop_id, status: 'paid'|'overdue' }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  if (body.status === 'paid') await sb.from('shops').update({ active: true }).eq('id', body.shop_id);
  if (body.status === 'overdue') await sb.from('shops').update({ active: false }).eq('id', body.shop_id);
  return Response.json({ ok: true });
}
