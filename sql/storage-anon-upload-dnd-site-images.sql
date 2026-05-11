-- Optional: allow anon role to upload to dnd-site-images (for local bulk import with publishable key only).
-- SECURITY: anyone with your anon key can write/delete objects in this bucket. Prefer service_role + remove these policies after import.

drop policy if exists "Anon insert dnd-site-images" on storage.objects;
create policy "Anon insert dnd-site-images"
on storage.objects for insert
to anon
with check (bucket_id = 'dnd-site-images');

drop policy if exists "Anon update dnd-site-images" on storage.objects;
create policy "Anon update dnd-site-images"
on storage.objects for update
to anon
using (bucket_id = 'dnd-site-images')
with check (bucket_id = 'dnd-site-images');

drop policy if exists "Anon delete dnd-site-images" on storage.objects;
create policy "Anon delete dnd-site-images"
on storage.objects for delete
to anon
using (bucket_id = 'dnd-site-images');
