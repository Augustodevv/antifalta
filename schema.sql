-- Rode no SQL Editor do Supabase
create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  active boolean default true,
  created_at timestamptz default now()
);
create table services (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  price numeric(10,2) default 40,
  duration_min int default 40
);
create table clients (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  phone text not null -- 5511999999999
);
create table appointments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  service_id uuid references services(id) on delete set null,
  starts_at timestamptz not null,
  status text default 'scheduled' check (status in ('scheduled','confirmed','cancelled','done','no_show')),
  reminder_24h_sent_at timestamptz,
  reminder_2h_sent_at timestamptz,
  created_at timestamptz default now()
);

alter table shops enable row level security;
alter table services enable row level security;
alter table clients enable row level security;
alter table appointments enable row level security;

-- Dono só vê o próprio shop (MVP 1 shop por conta)
create policy "owner shops" on shops for all using (auth.uid() = owner_id);
create policy "shop data" on services for all using (
  shop_id in (select id from shops where owner_id = auth.uid())
);
create policy "client data" on clients for all using (
  shop_id in (select id from shops where owner_id = auth.uid())
);
create policy "appt data" on appointments for all using (
  shop_id in (select id from shops where owner_id = auth.uid())
);

create index idx_appt_shop_time on appointments(shop_id, starts_at);
