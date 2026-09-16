
-- ===== roles =====
create type public.app_role as enum ('admin','editor','viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  -- first ever user becomes admin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ===== media =====
create table public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text not null,
  filename text not null,
  folder text not null default 'general',
  mime_type text,
  kind text not null default 'image',
  size_bytes bigint,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.media to anon;
grant select, insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "media public read" on public.media for select using (true);
create policy "media staff write" on public.media for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_media_updated before update on public.media for each row execute function public.touch_updated_at();

-- ===== settings =====
create table public.site_settings (
  key text primary key,
  value text,
  group_name text not null default 'general',
  label text,
  input_type text not null default 'text',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings staff write" on public.site_settings for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_settings_updated before update on public.site_settings for each row execute function public.touch_updated_at();

-- ===== navigation =====
create table public.nav_items (
  id uuid primary key default gen_random_uuid(),
  location text not null default 'header',
  label text not null,
  url text not null default '#',
  sort_order int not null default 0,
  is_active boolean not null default true,
  open_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.nav_items to anon;
grant select, insert, update, delete on public.nav_items to authenticated;
grant all on public.nav_items to service_role;
alter table public.nav_items enable row level security;
create policy "nav public read" on public.nav_items for select using (is_active or public.is_staff(auth.uid()));
create policy "nav staff write" on public.nav_items for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_nav_updated before update on public.nav_items for each row execute function public.touch_updated_at();

-- ===== sections =====
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  eyebrow text,
  title text,
  subtitle text,
  body text,
  image_url text,
  video_url text,
  background_url text,
  cta_label text,
  cta_url text,
  cta2_label text,
  cta2_url text,
  extra jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
grant select on public.sections to anon;
grant select, insert, update, delete on public.sections to authenticated;
grant all on public.sections to service_role;
alter table public.sections enable row level security;
create policy "sections public read" on public.sections for select using (true);
create policy "sections staff write" on public.sections for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_sections_updated before update on public.sections for each row execute function public.touch_updated_at();

-- ===== categories =====
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  collection text not null default 'products',
  name text not null,
  slug text not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection, slug)
);
grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (is_active or public.is_staff(auth.uid()));
create policy "categories staff write" on public.categories for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_categories_updated before update on public.categories for each row execute function public.touch_updated_at();

-- ===== content items (generic collections) =====
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  category_id uuid references public.categories(id) on delete set null,
  slug text,
  title text not null,
  subtitle text,
  tag text,
  excerpt text,
  body text,
  icon text,
  image_url text,
  images jsonb not null default '[]'::jsonb,
  bullet_points jsonb not null default '[]'::jsonb,
  link_url text,
  meta jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection, slug)
);
create index idx_content_collection on public.content_items (collection, sort_order);
grant select on public.content_items to anon;
grant select, insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;
alter table public.content_items enable row level security;
create policy "content public read" on public.content_items for select using (is_active or public.is_staff(auth.uid()));
create policy "content staff write" on public.content_items for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_content_updated before update on public.content_items for each row execute function public.touch_updated_at();

-- ===== pages =====
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon;
grant select, insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "pages public read" on public.pages for select using (is_active or public.is_staff(auth.uid()));
create policy "pages staff write" on public.pages for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_pages_updated before update on public.pages for each row execute function public.touch_updated_at();

-- ===== submissions =====
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null default 'contact',
  name text,
  email text,
  phone text,
  subject text,
  message text,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.form_submissions to anon;
grant select, insert, update, delete on public.form_submissions to authenticated;
grant all on public.form_submissions to service_role;
alter table public.form_submissions enable row level security;
create policy "anyone can submit" on public.form_submissions for insert with check (true);
create policy "staff read submissions" on public.form_submissions for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff update submissions" on public.form_submissions for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff delete submissions" on public.form_submissions for delete to authenticated using (public.is_staff(auth.uid()));

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "staff read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage subscribers" on public.newsletter_subscribers for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff delete subscribers" on public.newsletter_subscribers for delete to authenticated using (public.is_staff(auth.uid()));
