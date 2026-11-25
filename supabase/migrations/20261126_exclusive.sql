-- Adds an "Exclusive" flag to products (Admin → Products → Exclusive switch).
-- Exclusive products get a gold "Exclusive" badge on the website and an "Exclusive Only" filter.
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.
alter table public.fabrics
  add column if not exists is_exclusive boolean not null default false;
