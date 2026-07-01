-- GiftMate product catalog schema (run this in Supabase → SQL Editor).

create table if not exists products (
  id                 text primary key,
  name               text not null,
  category           text not null,
  price              integer not null,            -- price in LKR (whole rupees)
  image              text not null,
  description        text not null,
  occasions          text[] not null default '{}',
  recipients         text[] not null default '{}',
  cities             text[] not null default '{}',
  same_day_available boolean not null default false,
  in_stock           boolean not null default true,
  created_at         timestamptz not null default now()
);

-- Indexes for fast filtering.
create index if not exists products_category_idx   on products (category);
create index if not exists products_price_idx       on products (price);
create index if not exists products_occasions_idx   on products using gin (occasions);
create index if not exists products_recipients_idx  on products using gin (recipients);
create index if not exists products_cities_idx      on products using gin (cities);

-- The catalog is public, read-only data. Enable RLS and allow anyone to read.
alter table products enable row level security;

drop policy if exists "Public can read products" on products;
create policy "Public can read products"
  on products for select
  using (true);

-- Server-side search: case-insensitive, partial matches across the array columns,
-- with optional budget/category filters. Returns matching rows, cheapest first.
create or replace function search_products(
  p_occasion   text    default null,
  p_recipient  text    default null,
  p_city       text    default null,
  p_max_budget integer default null,
  p_category   text    default null,
  p_limit      integer default 6
)
returns setof products
language sql
stable
as $$
  select *
  from products
  where in_stock = true
    and (p_max_budget is null or price <= p_max_budget)
    and (p_category   is null or category = lower(p_category))
    and (p_occasion   is null or exists (select 1 from unnest(occasions)  o where o ilike '%' || p_occasion  || '%'))
    and (p_recipient  is null or exists (select 1 from unnest(recipients) r where r ilike '%' || p_recipient || '%'))
    and (p_city       is null or exists (select 1 from unnest(cities)     c where c ilike '%' || p_city      || '%'))
  order by price asc
  limit coalesce(p_limit, 6);
$$;
