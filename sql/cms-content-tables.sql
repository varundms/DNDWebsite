-- CMS tables for dnd-cms.html / events.html / dnd-blog-reader.html (PostgREST + anon key).
-- Applied via Supabase migration to project ref qfeuxyuyxjkmqjpiknes (Dahotre Group Websites).
-- WARNING: anon policies allow full read/write. Replace with authenticated policies before public launch if needed.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  excerpt text,
  status text not null default 'draft',
  category text,
  author text,
  author_role text,
  read_time integer default 5,
  date date,
  cover_url text,
  created_at timestamptz,
  updated_at timestamptz
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  tab text,
  date date,
  cover_url text,
  gallery jsonb default '[]'::jsonb,
  created_at timestamptz,
  updated_at timestamptz
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  type text,
  experience text,
  description text,
  email text,
  status text default 'active',
  created_at timestamptz,
  updated_at timestamptz
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organisation text,
  tag text,
  year text,
  file_type text,
  image_url text,
  created_at timestamptz,
  updated_at timestamptz
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.posts to anon, authenticated;
grant select, insert, update, delete on public.events to anon, authenticated;
grant select, insert, update, delete on public.jobs to anon, authenticated;
grant select, insert, update, delete on public.awards to anon, authenticated;

alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.jobs enable row level security;
alter table public.awards enable row level security;

drop policy if exists cms_anon_posts_all on public.posts;
create policy cms_anon_posts_all on public.posts for all to anon using (true) with check (true);
drop policy if exists cms_anon_events_all on public.events;
create policy cms_anon_events_all on public.events for all to anon using (true) with check (true);
drop policy if exists cms_anon_jobs_all on public.jobs;
create policy cms_anon_jobs_all on public.jobs for all to anon using (true) with check (true);
drop policy if exists cms_anon_awards_all on public.awards;
create policy cms_anon_awards_all on public.awards for all to anon using (true) with check (true);
