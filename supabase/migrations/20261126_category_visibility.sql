-- Show or hide whole product categories on the public website (Admin → Products → "Categories on website").
-- A hidden category keeps its products in Admin, but the website shows no filter tab, menu/footer link,
-- home page card or product pages for it. A missing row means "shown".
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.

create table if not exists public.category_settings (
  category      text primary key,               -- e.g. 'designer'
  show_on_site  boolean not null default true,
  updated_at    timestamptz not null default now()
);

alter table public.category_settings enable row level security;

drop policy if exists "Public can read category settings" on public.category_settings;
create policy "Public can read category settings"
  on public.category_settings for select using (true);

drop policy if exists "Admins can insert category settings" on public.category_settings;
create policy "Admins can insert category settings"
  on public.category_settings for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update category settings" on public.category_settings;
create policy "Admins can update category settings"
  on public.category_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete category settings" on public.category_settings;
create policy "Admins can delete category settings"
  on public.category_settings for delete to authenticated using (public.is_admin());

-- Designer Ethnic starts hidden. Re-running does not override a choice made later in Admin.
insert into public.category_settings (category, show_on_site)
values ('designer', false)
on conflict (category) do nothing;
