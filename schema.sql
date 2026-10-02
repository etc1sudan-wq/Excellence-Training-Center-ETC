-- ETC production database
-- Run this in Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  course text,
  description text,
  video_url text,
  pdf_url text,
  thumbnail_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  program text,
  level text,
  goal text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;
alter table public.registrations enable row level security;
alter table public.profiles enable row level security;

-- Public visitors can see published lessons.
create policy "published lessons are public"
on public.lessons for select
using (published = true);

-- Public registration is allowed.
create policy "public can submit registration"
on public.registrations for insert
with check (true);

-- IMPORTANT:
-- For production, add admin policies based on profiles.role.
-- Do not expose service_role credentials in frontend code.

-- Storage buckets to create in the Supabase dashboard:
-- 1. etc-images
-- 2. etc-videos
-- 3. etc-pdfs
-- Then add Storage RLS policies appropriate to your desired public/private access.
