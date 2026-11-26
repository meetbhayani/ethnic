-- Daily AI Try-On usage, so admins are told when the free Cloudflare allowance is running out or used up.
-- Cloudflare's free allowance (10,000 Neurons) resets every day at 00:00 UTC, so days are UTC dates.
-- Written only by the website server (secret key); admins can read it in Admin → Dashboard.
--
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run. Safe to re-run.

create table if not exists public.tryon_usage (
  day              date primary key,            -- UTC date
  previews         integer not null default 0,  -- successful previews
  failures         integer not null default 0,  -- other failed attempts
  warned_at        timestamptz,                 -- "running low" alert sent
  limit_hit_at     timestamptz,                 -- Cloudflare refused: allowance used up
  updated_at       timestamptz not null default now()
);

alter table public.tryon_usage enable row level security;

drop policy if exists "Admins can read try-on usage" on public.tryon_usage;
create policy "Admins can read try-on usage"
  on public.tryon_usage for select to authenticated using (public.is_admin());

-- Records one try-on outcome atomically and says whether an admin alert should go out now.
-- p_outcome: 'success' | 'limit' | 'failure'. Each alert is returned true at most once per day.
create or replace function public.tryon_record(p_outcome text, p_warn_at integer)
returns table (previews integer, send_warning boolean, send_limit boolean)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  d date := (now() at time zone 'utc')::date;
  r public.tryon_usage;
  warn boolean := false;
  lim boolean := false;
begin
  insert into public.tryon_usage (day) values (d) on conflict (day) do nothing;

  select * into r from public.tryon_usage where day = d for update;

  if p_outcome = 'success' then
    r.previews := r.previews + 1;
    if r.warned_at is null and r.previews >= p_warn_at then
      r.warned_at := now(); warn := true;
    end if;
  elsif p_outcome = 'limit' then
    if r.limit_hit_at is null then
      r.limit_hit_at := now(); lim := true;
    end if;
  else
    r.failures := r.failures + 1;
  end if;

  update public.tryon_usage
     set previews = r.previews, failures = r.failures, warned_at = r.warned_at,
         limit_hit_at = r.limit_hit_at, updated_at = now()
   where day = d;

  return query select r.previews, warn, lim;
end;
$$;

-- Only the server (secret key) may call it.
revoke all on function public.tryon_record(text, integer) from public, anon, authenticated;
