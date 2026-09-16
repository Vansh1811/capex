
create policy "media staff read" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "media staff insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "media staff update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid())) with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "media staff delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid()));
