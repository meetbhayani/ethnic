-- =============================================================================
-- KHODAL FASHION — SUPABASE SCHEMA
-- Run once in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run: it uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ADMINS — who is allowed to edit products and read enquiries
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies on purpose: nobody can read/modify this table from the browser.

-- Helper used by every policy below.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- -----------------------------------------------------------------------------
-- 2. FABRICS — the product catalogue (mirrors FabricItem in src/types)
-- -----------------------------------------------------------------------------
create table if not exists public.fabrics (
  id                    text primary key,                 -- e.g. 'kf-901' (used in URLs)
  code                  text not null unique,             -- e.g. 'KF-ZAR-901'
  name                  text not null,
  category              text not null check (category in
                          ('sherwani','kurta','jodhpuri','indo-western','brocade','designer')),
  category_label        text not null,
  embroidery_type       text not null check (embroidery_type in
                          ('bead','zari','thread','sequin','cutdana','multi')),
  embroidery_type_label text not null,
  base_fabric           text not null,
  color                 text not null,
  color_family          text not null check (color_family in
                          ('ivory','gold','burgundy','emerald','navy','black','sandstone')),
  width                 text not null default '44 Inches',
  suitable_for          text[] not null default '{}',
  moq                   text not null default '25 Metres',
  ready_stock           boolean not null default true,
  featured              boolean not null default false,
  description           text not null default '',
  artisan_story         text not null default '',
  main_image            text not null default '',
  close_up_image        text not null default '',
  macro_image           text not null default '',
  backside_image        text not null default '',
  styled_model_image    text not null default '',
  images                text[] not null default '{}',
  swatch_tile           text not null default '',  -- seamless garment-preview tile (see migrations/20261125_swatch_tile.sql)
  available_colors      jsonb not null default '[]'::jsonb, -- [{ "name": "...", "hex": "#..." }]
  is_published          boolean not null default true,      -- hide without deleting
  sort_order            integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists fabrics_category_idx on public.fabrics (category);
create index if not exists fabrics_featured_idx on public.fabrics (featured) where featured;

alter table public.fabrics enable row level security;

drop policy if exists "Public can read published fabrics" on public.fabrics;
create policy "Public can read published fabrics"
  on public.fabrics for select
  using (is_published or public.is_admin());

drop policy if exists "Admins can insert fabrics" on public.fabrics;
create policy "Admins can insert fabrics"
  on public.fabrics for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update fabrics" on public.fabrics;
create policy "Admins can update fabrics"
  on public.fabrics for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete fabrics" on public.fabrics;
create policy "Admins can delete fabrics"
  on public.fabrics for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. ENQUIRIES — every form submission from the website
--    Inserts come ONLY from our Next.js API route using the secret key
--    (which bypasses RLS), so visitors can never read or spam the table directly.
-- -----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  business_name  text not null check (char_length(business_name) between 1 and 200),
  contact_person text not null check (char_length(contact_person) between 1 and 200),
  phone          text not null check (char_length(phone) between 5 and 30),
  email          text check (email is null or char_length(email) <= 200),
  product_code   text,
  product_name   text,
  quantity       text,
  enquiry_type   text not null check (enquiry_type in
                   ('fabric-price','custom-jobwork','wholesale-b2b','swatch-kit')),
  notes          text check (notes is null or char_length(notes) <= 4000),
  source_page    text,
  status         text not null default 'new' check (status in
                   ('new','contacted','sample-sent','quoted','closed')),
  admin_notes    text
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx  on public.enquiries (status);

alter table public.enquiries enable row level security;

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
  on public.enquiries for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
  on public.enquiries for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. updated_at trigger for fabrics
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fabrics_set_updated_at on public.fabrics;
create trigger fabrics_set_updated_at
  before update on public.fabrics
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 5. STORAGE — public bucket for fabric photos (admins upload, everyone views)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fabric-images', 'fabric-images', true, 5242880,  -- 5 MB per file
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No public SELECT policy: a public bucket already serves every file by its
-- public URL. A SELECT policy would only let anyone LIST all files. Only admins
-- may list (the admin panel needs it to manage photos).
drop policy if exists "Public can view fabric images" on storage.objects;
drop policy if exists "Admins can list fabric images" on storage.objects;
create policy "Admins can list fabric images"
  on storage.objects for select to authenticated
  using (bucket_id = 'fabric-images' and public.is_admin());

drop policy if exists "Admins can upload fabric images" on storage.objects;
create policy "Admins can upload fabric images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fabric-images' and public.is_admin());

drop policy if exists "Admins can update fabric images" on storage.objects;
create policy "Admins can update fabric images"
  on storage.objects for update to authenticated
  using (bucket_id = 'fabric-images' and public.is_admin());

drop policy if exists "Admins can delete fabric images" on storage.objects;
create policy "Admins can delete fabric images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'fabric-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. KEEP-ALIVE — tiny function a daily cron can call so the free project
--    is never paused for inactivity.
-- -----------------------------------------------------------------------------
create or replace function public.keep_alive()
returns text language sql stable as $$ select 'ok'::text; $$;

grant execute on function public.keep_alive() to anon, authenticated;
