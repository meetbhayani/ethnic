-- Admin-managed website images.
--   site_images   : replaceable fixed spots (About photo, Craftsmanship photos, AI Try-On presets).
--   gallery_items : the public Gallery page.
-- Image files go in the existing 'fabric-images' bucket (admins can already upload there).
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. SITE IMAGES — one row per replaced spot; a missing row means "use the default"
-- ---------------------------------------------------------------------------
create table if not exists public.site_images (
  key         text primary key,                 -- e.g. 'about.hero', 'craft.zari-dabka'
  url         text not null,
  updated_at  timestamptz not null default now()
);

alter table public.site_images enable row level security;

drop policy if exists "Public can read site images" on public.site_images;
create policy "Public can read site images"
  on public.site_images for select using (true);

drop policy if exists "Admins can insert site images" on public.site_images;
create policy "Admins can insert site images"
  on public.site_images for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update site images" on public.site_images;
create policy "Admins can update site images"
  on public.site_images for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete site images" on public.site_images;
create policy "Admins can delete site images"
  on public.site_images for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. GALLERY
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null default '',
  tag           text not null default '',
  category      text not null default 'embroidery'
                check (category in ('embroidery', 'craft', 'styled', 'swatch', 'workshop')),
  image         text not null,
  caption       text not null default '',
  aspect        text not null default 'square' check (aspect in ('tall', 'wide', 'square')),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists gallery_items_order_idx on public.gallery_items (sort_order, created_at);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
  on public.gallery_items for select using (is_published or public.is_admin());

drop policy if exists "Admins can insert gallery items" on public.gallery_items;
create policy "Admins can insert gallery items"
  on public.gallery_items for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update gallery items" on public.gallery_items;
create policy "Admins can update gallery items"
  on public.gallery_items for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete gallery items" on public.gallery_items;
create policy "Admins can delete gallery items"
  on public.gallery_items for delete to authenticated using (public.is_admin());
