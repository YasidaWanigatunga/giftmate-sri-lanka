-- Orders table for kapruka_create_order (run in Supabase → SQL Editor).

create table if not exists orders (
  id           text primary key,
  items        jsonb   not null default '[]'::jsonb, -- [{productId, name, price, quantity}]
  total_amount integer not null,
  city         text,
  status       text    not null default 'pending',   -- pending | confirmed | delivered
  created_at   timestamptz not null default now()
);

alter table orders enable row level security;

-- The anon key may INSERT orders (place them) but not read others' orders.
drop policy if exists "Public can create orders" on orders;
create policy "Public can create orders"
  on orders for insert
  with check (true);
