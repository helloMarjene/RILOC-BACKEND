create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.page_content (
  id text primary key,
  route text not null unique,
  name text not null,
  title text not null,
  description text not null default '',
  markup text not null,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

alter table public.profiles enable row level security;
alter table public.page_content enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "Published pages are public" on public.page_content;
create policy "Published pages are public" on public.page_content for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "Editors can manage page content" on public.page_content;
create policy "Editors can manage page content" on public.page_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published settings are public" on public.site_settings;
create policy "Published settings are public" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can manage settings" on public.site_settings;
create policy "Admins can manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('riloc-media', 'riloc-media', true)
on conflict (id) do update set public = true;

drop policy if exists "RILOC media is public" on storage.objects;
create policy "RILOC media is public" on storage.objects for select using (bucket_id = 'riloc-media');
drop policy if exists "Admins can upload RILOC media" on storage.objects;
create policy "Admins can upload RILOC media" on storage.objects for insert to authenticated with check (bucket_id = 'riloc-media' and public.is_admin());
drop policy if exists "Admins can update RILOC media" on storage.objects;
create policy "Admins can update RILOC media" on storage.objects for update to authenticated using (bucket_id = 'riloc-media' and public.is_admin()) with check (bucket_id = 'riloc-media' and public.is_admin());
drop policy if exists "Admins can delete RILOC media" on storage.objects;
create policy "Admins can delete RILOC media" on storage.objects for delete to authenticated using (bucket_id = 'riloc-media' and public.is_admin());
