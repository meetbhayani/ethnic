-- Craftsmanship page managed from Admin → Craftsmanship.
--   craft_techniques : one row per embroidery technique section on the page
--   site_content     : editable page text, one JSON value per key (key 'craftsmanship')
-- Images go in the existing 'fabric-images' bucket (admins can already upload there).
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. TECHNIQUES
-- ---------------------------------------------------------------------------
create table if not exists public.craft_techniques (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default '',
  subtitle      text not null default '',
  description   text not null default '',
  best_for      text not null default '',
  machine_work  text not null default '',
  hand_work     text not null default '',
  features      text[] not null default '{}',
  image         text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists craft_techniques_order_idx on public.craft_techniques (sort_order, created_at);

alter table public.craft_techniques enable row level security;

drop policy if exists "Public can read published craft techniques" on public.craft_techniques;
create policy "Public can read published craft techniques"
  on public.craft_techniques for select using (is_published or public.is_admin());

drop policy if exists "Admins can insert craft techniques" on public.craft_techniques;
create policy "Admins can insert craft techniques"
  on public.craft_techniques for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update craft techniques" on public.craft_techniques;
create policy "Admins can update craft techniques"
  on public.craft_techniques for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete craft techniques" on public.craft_techniques;
create policy "Admins can delete craft techniques"
  on public.craft_techniques for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. EDITABLE PAGE TEXT
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key         text primary key,               -- e.g. 'craftsmanship'
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
  on public.site_content for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
  on public.site_content for delete to authenticated using (public.is_admin());

-- Make new tables visible to the API immediately.
notify pgrst, 'reload schema';
