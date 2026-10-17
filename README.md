# Anti-falta WhatsApp — Micro-SaaS barbearias

> **Status:** MVP em desenvolvimento. O uso real depende de contratar as integrações externas (Evolution API para WhatsApp e Asaas para cobrança).
MVP: agenda + lembrete 24h/2h + painel faltas. Stack: Next.js 14 + Supabase + Evolution API + Vercel.

## 1. Rodar local (5 min)
```bash
npm install
cp .env.example .env.local # preencha
npm run dev
```

## 2. Banco (Supabase Free)
1. Crie projeto em supabase.com
2. SQL Editor > rode `schema.sql`
3. Auth > ative Email login. RLS já ativado no schema.

## 3. WhatsApp (R$35/mês)
1. Suba VPS Hostinger + instale Evolution API (docker)
2. Crie instância, escaneie QR em `/config`
3. Preencha `EVOLUTION_API_URL` e `EVOLUTION_API_KEY`

Substitua pelo provedor oficial (Meta/Uazapi) quando tiver 10+ clientes para evitar ban.

## 4. Cobrança MVP (sem código)
Use Asaas: crie Assinatura R$97/mês, cole link no onboarding. Webhook `/api/billing/webhook` já valida e ativa `shops.active=true`.
Pix manual aceito nos 3 primeiros.

## 5. Deploy Vercel (grátis)
```
vercel --prod
```
Env vars: todas do `.env.example`. Cron: Vercel Cron chama `GET /api/cron/reminders` a cada 15min (ver `vercel.json`).

## Estrutura
- `app/agenda` — agenda do dia
- `app/api/appointments` — CRUD com RLS por shop
- `app/api/cron/reminders` — busca agendamentos D+1 e -2h, dispara via Evolution
