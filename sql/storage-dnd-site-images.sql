-- Supabase: public storage for static site images (run in SQL Editor after reviewing policies).
-- Create bucket if it does not exist (id must match STORAGE_PUBLIC_BUCKET in .env, default dnd-site-images).

insert into storage.buckets (id, name, public, file_size_limit)
values ('dnd-site-images', 'dnd-site-images', true, 52428800)
on conflict (id) do update set public = excluded.public;

-- Allow anonymous read of objects in this bucket
drop policy if exists "Public read dnd-site-images" on storage.objects;
create policy "Public read dnd-site-images"
on storage.objects for select
to public
using (bucket_id = 'dnd-site-images');

-- Optional: allow authenticated users to upload (tighten to your roles as needed)
-- drop policy if exists "Authenticated upload dnd-site-images" on storage.objects;
-- create policy "Authenticated upload dnd-site-images"
-- on storage.objects for insert to authenticated
-- with check (bucket_id = 'dnd-site-images');
