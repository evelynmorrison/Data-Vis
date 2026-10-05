-- Vote storage for the "How would you quantify happiness?" page.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
--
-- Visitors (the public "anon" role, used by the website's publishable key) can ADD a vote and READ the
-- totals. They cannot edit or delete anything — only you can, from the Supabase dashboard.

create table if not exists public.votes (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  choices    text[] not null,   -- the six measures lit, e.g. {quality-of-close-relationships, ...}
  shown      text[],            -- the order the options were shown in (to check for position bias)
  write_in   text               -- optional "propose another metric"
);

-- basic sanity checks on what the website can send
alter table public.votes drop constraint if exists votes_six_choices;
alter table public.votes add constraint votes_six_choices check (cardinality(choices) = 6);
alter table public.votes drop constraint if exists votes_write_in_length;
alter table public.votes add constraint votes_write_in_length check (write_in is null or char_length(write_in) <= 120);

-- row level security: on, with only two permissions for the public
alter table public.votes enable row level security;

drop policy if exists "anyone can add a vote" on public.votes;
create policy "anyone can add a vote" on public.votes for insert to anon with check (true);

drop policy if exists "anyone can read votes" on public.votes;
create policy "anyone can read votes" on public.votes for select to anon using (true);

grant insert, select on public.votes to anon;
revoke update, delete on public.votes from anon;

-- totals per measure, computed in the database so the results page doesn't download every vote
create or replace view public.vote_tally with (security_invoker = on) as
  select c as id, count(*)::int as n
  from public.votes, unnest(choices) as c
  group by c;

grant select on public.vote_tally to anon;
