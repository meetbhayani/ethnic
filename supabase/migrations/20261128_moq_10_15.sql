-- Sets the minimum order quantity (MOQ) to 10–15 metres for every product,
-- and makes it the default for new products added in Admin → Products.
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.
alter table public.fabrics
  alter column moq set default '10–15 Metres';

update public.fabrics
set moq = case
  when moq ilike '%sample cut%' then '10–15 Metres (Sample Cuts Available on Request)'
  else '10–15 Metres'
end;
