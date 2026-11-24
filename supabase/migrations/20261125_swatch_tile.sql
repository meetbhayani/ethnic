-- Adds a seamless "flat swatch" tile to each fabric.
-- The admin panel creates the tile (a mirrored, evenly lit repeat cut from a flat
-- area of a product photo) and stores its public URL here. The website uses it to
-- cover garment previews evenly (Fabric Applications, AI Try-On teaser, etc.).
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.
alter table public.fabrics
  add column if not exists swatch_tile text not null default '';
