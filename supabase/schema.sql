-- PointBlank wholesale portal schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('retailer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type retailer_status as enum ('pending', 'approved', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type product_status as enum ('active', 'draft', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('draft', 'submitted', 'processing', 'shipped', 'delivered');
exception when duplicate_object then null; end $$;

-- ─── profiles ───────────────────────────────────────────────────────────
-- One row per auth.users row. Created automatically by the trigger below
-- whenever a new user signs up.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role user_role not null default 'retailer',
  retailer_status retailer_status not null default 'pending',
  business_name text,
  contact_first_name text,
  contact_last_name text,
  phone text,
  business_type text,
  resale_number text,
  pricing_tier text default 'standard',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── retailer_applications ─────────────────────────────────────────────
create table if not exists retailer_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  business_name text not null,
  contact_first_name text not null,
  contact_last_name text not null,
  business_email text not null,
  phone text,
  website text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  business_type text,
  resale_number text,
  business_registration_number text,
  estimated_monthly_volume text,
  notes text,
  status retailer_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ─── collections ────────────────────────────────────────────────────────
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  subtitle text,
  hero_image text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── products ───────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  slug text unique not null,
  description text,
  collection_id uuid references collections(id),
  wholesale_price numeric(10,2) not null,
  msrp numeric(10,2) not null,
  moq int not null default 1,
  pack_quantity int not null default 1,
  dimensions text,
  paper_spec text,
  inventory int not null default 0,
  status product_status not null default 'active',
  image_url text,
  gallery jsonb not null default '[]',
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  is_limited boolean not null default false,
  is_range_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── orders / order_items ───────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid not null references profiles(id),
  order_number text unique not null,
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status order_status not null default 'draft',
  tracking_number text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null,
  unit_price numeric(10,2) not null
);

-- ─── retailer_pricing ───────────────────────────────────────────────────
-- Named pricing tiers for future volume-discount support.
create table if not exists retailer_pricing (
  id uuid primary key default gen_random_uuid(),
  tier_name text unique not null,
  discount_percent numeric(5,2) not null default 0
);

insert into retailer_pricing (tier_name, discount_percent)
values ('standard', 0), ('volume', 8), ('strategic', 15)
on conflict (tier_name) do nothing;

-- ─── leads ──────────────────────────────────────────────────────────────
-- Prospective retailers/distributors found via outreach research — not the
-- same as retailer_applications, which are self-submitted by a real user
-- with a password. Admin-only (RLS policy added further down, once
-- public.is_admin() exists).
do $$ begin
  create type lead_status as enum ('new', 'contacted', 'responded', 'converted', 'not_interested');
exception when duplicate_object then null; end $$;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_type text,
  contact_name text,
  email text,
  phone text,
  website text,
  address text,
  city text,
  region text,
  country text,
  source text,
  notes text,
  status lead_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ─── Helper: is the current user an admin? ─────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

create or replace function public.is_approved_retailer()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and (role = 'admin' or retailer_status = 'approved')
  );
$$ language sql security definer stable set search_path = public;

-- ─── Row Level Security ─────────────────────────────────────────────────
alter table profiles enable row level security;
alter table retailer_applications enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table retailer_pricing enable row level security;

-- profiles: owners can read/update their own row; admins can read/update all
drop policy if exists "profiles_select_own_or_admin" on profiles;
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin" on profiles
  for update using (public.is_admin());

-- retailer_applications: anyone can submit; owner + admin can read
drop policy if exists "applications_insert_anyone" on retailer_applications;
create policy "applications_insert_anyone" on retailer_applications
  for insert with check (true);
drop policy if exists "applications_select_own_or_admin" on retailer_applications;
create policy "applications_select_own_or_admin" on retailer_applications
  for select using (profile_id = auth.uid() or public.is_admin());
drop policy if exists "applications_update_admin" on retailer_applications;
create policy "applications_update_admin" on retailer_applications
  for update using (public.is_admin());

-- collections: publicly readable when active (marketing pages); admin full access
drop policy if exists "collections_select_public" on collections;
create policy "collections_select_public" on collections
  for select using (active = true or public.is_admin());
drop policy if exists "collections_write_admin" on collections;
create policy "collections_write_admin" on collections
  for all using (public.is_admin()) with check (public.is_admin());

-- products: full row (incl. wholesale pricing) only to approved retailers/admins.
-- Public marketing pages should query the `public_products_preview` view instead,
-- which intentionally omits pricing and inventory.
drop policy if exists "products_select_approved" on products;
create policy "products_select_approved" on products
  for select using (public.is_approved_retailer());
drop policy if exists "products_write_admin" on products;
create policy "products_write_admin" on products
  for all using (public.is_admin()) with check (public.is_admin());

-- orders / order_items: retailer sees only their own; admin sees all
drop policy if exists "orders_select_own_or_admin" on orders;
create policy "orders_select_own_or_admin" on orders
  for select using (retailer_id = auth.uid() or public.is_admin());
drop policy if exists "orders_insert_own" on orders;
create policy "orders_insert_own" on orders
  for insert with check (retailer_id = auth.uid());
drop policy if exists "orders_update_own_or_admin" on orders;
create policy "orders_update_own_or_admin" on orders
  for update using (retailer_id = auth.uid() or public.is_admin());

drop policy if exists "order_items_select_own_or_admin" on order_items;
create policy "order_items_select_own_or_admin" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and (o.retailer_id = auth.uid() or public.is_admin()))
  );
drop policy if exists "order_items_insert_own" on order_items;
create policy "order_items_insert_own" on order_items
  for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.retailer_id = auth.uid())
  );

drop policy if exists "retailer_pricing_select_all" on retailer_pricing;
create policy "retailer_pricing_select_all" on retailer_pricing
  for select using (true);

alter table leads enable row level security;
drop policy if exists "leads_admin_only" on leads;
create policy "leads_admin_only" on leads
  for all using (public.is_admin()) with check (public.is_admin());

-- ─── Public preview view (no pricing / inventory) ──────────────────────
-- Used by the public marketing pages so unauthenticated visitors can see
-- collection artwork/descriptions without wholesale pricing ever leaving
-- the database.
create or replace view public_products_preview as
  select p.id, p.name, p.slug, p.image_url, p.collection_id, p.is_new,
         p.is_bestseller, p.is_limited, p.is_range_favorite,
         c.name as collection_name, c.slug as collection_slug
  from products p
  join collections c on c.id = p.collection_id
  where p.status = 'active' and c.active = true;

grant select on public_products_preview to anon, authenticated;
