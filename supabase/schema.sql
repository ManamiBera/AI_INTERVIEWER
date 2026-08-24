-- ============================================================================
-- AI Interviewer — Supabase database schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- to provision a fresh project. Enables per-user data isolation via RLS.
-- ============================================================================

-- ---------------- PROFILES ----------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------- ANALYSES ----------------
create table if not exists public.analyses (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text,
  target_role text,
  ats_score int,
  job_match int,
  ai_source text,
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists analyses_user_created_idx on public.analyses(user_id, created_at desc);

-- ---------------- INTERVIEW SESSIONS ----------------
create table if not exists public.interview_sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text,
  company text,
  overall_score int,
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_user_created_idx on public.interview_sessions(user_id, created_at desc);

-- ---------------- QUESTION PROGRESS ----------------
create table if not exists public.question_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  status text not null check (status in ('learned','practice')),
  created_at timestamptz not null default now(),
  primary key (user_id, question_id, status)
);

-- ---------------- NOTIFICATIONS ----------------
create table if not exists public.notifications (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  detail text,
  kind text not null default 'info',
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

-- ============================ ROW-LEVEL SECURITY ============================
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.question_progress enable row level security;
alter table public.notifications enable row level security;

-- profiles: owner is the row id
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- other tables: owner is user_id
create policy "analyses_all_own"      on public.analyses           for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_all_own"      on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "qprogress_all_own"     on public.question_progress  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notifications_all_own" on public.notifications      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==================== AUTO-CREATE PROFILE ON SIGNUP ====================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Only the trigger should call this — not exposed via the REST API.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- After running this, in the Dashboard go to:
--   Authentication → Sign In / Providers → Email → turn OFF "Confirm email"
-- so signups log in instantly (recommended for local/dev).
-- ============================================================================
