create table if not exists public.family_state (
  id uuid primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.family_state enable row level security;

grant usage on schema public to anon;
grant select, insert, update on table public.family_state to anon;

drop policy if exists "family_shared" on public.family_state;
create policy "family_shared"
on public.family_state
for all
to anon
using (id = 'f2bd9f20-94f2-4b06-b580-33bd7fca0e4a'::uuid)
with check (id = 'f2bd9f20-94f2-4b06-b580-33bd7fca0e4a'::uuid);
