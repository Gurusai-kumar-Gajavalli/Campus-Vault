-- ============================================================================
-- CampusVault - Supabase Schema
-- Run this entire script in your Supabase SQL Editor.
-- ============================================================================

-- ── 1. PROFILES ────────────────────────────────────────────────────────────
-- Automatically created upon user signup via handle_new_user trigger.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  year text not null check (year in ('1st Year','2nd Year','3rd Year','4th Year','Alumni')),
  branch text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, year, branch)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Student'),
    coalesce(new.raw_user_meta_data->>'year', '2nd Year'),
    coalesce(new.raw_user_meta_data->>'branch', 'CSE')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow re-running
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. VAULTS ──────────────────────────────────────────────────────────────
create table if not exists vaults (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Placement','Course Notes','Project','General')),
  description text not null
);

alter table vaults enable row level security;

create policy "Vaults are publicly readable"
  on vaults for select using (true);

insert into vaults (slug, name, category, description) values
  ('placements', 'Placements & Interviews', 'Placement', 'Real interview questions, coding round debriefs, and on-campus placement strategy.'),
  ('course-notes', 'Course Notes & Academics', 'Course Notes', 'High-yield subject notes, lab manuals, professor insights, and elective recommendations.'),
  ('projects', 'Project Lessons & Architecture', 'Project', 'Capstone retrospectives, architecture decisions, bug fixes, and open-source starter repos.'),
  ('general', 'Campus Wisdom & Life', 'General', 'Hostel hacks, scholarship guidance, club insights, and everything you wish you knew earlier.')
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description;


-- ── 3. ENTRIES ─────────────────────────────────────────────────────────────
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references vaults(id) on delete cascade,
  author_id uuid not null references auth.users(id) default auth.uid(),
  title text not null,
  content text not null,
  resource_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table entries enable row level security;

create policy "Entries are publicly readable"
  on entries for select using (true);

create policy "Authenticated users can post entries"
  on entries for insert with check (auth.uid() is not null);

create policy "Authors can edit their own entries"
  on entries for update using (auth.uid() = author_id);

create policy "Authors can delete their own entries"
  on entries for delete using (auth.uid() = author_id);


-- ── 4. VOTES ───────────────────────────────────────────────────────────────
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  user_id uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now(),
  unique (entry_id, user_id)
);

alter table votes enable row level security;

create policy "Votes are publicly readable"
  on votes for select using (true);

create policy "Authenticated users can vote"
  on votes for insert with check (auth.uid() = user_id);

create policy "Users can remove their own vote"
  on votes for delete using (auth.uid() = user_id);


-- ── 5. COMMENTS ────────────────────────────────────────────────────────────
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  author_id uuid not null references auth.users(id) default auth.uid(),
  content text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create policy "Comments are publicly readable"
  on comments for select using (true);

create policy "Authenticated users can comment"
  on comments for insert with check (auth.uid() is not null);

create policy "Authors can delete their own comments"
  on comments for delete using (auth.uid() = author_id);


-- ── 6. VIEWS ───────────────────────────────────────────────────────────────
-- View: entries with author profiles and live aggregated vote counts
create or replace view entries_with_votes as
select
  e.id,
  e.vault_id,
  e.author_id,
  e.title,
  e.content,
  e.resource_url,
  e.created_at,
  e.updated_at,
  coalesce(p.name, 'Campus Contributor') as author_name,
  coalesce(p.year, '3rd Year') as author_year,
  coalesce(p.branch, 'CSE') as author_branch,
  coalesce(v.vote_count, 0) as vote_count
from entries e
left join profiles p on p.id = e.author_id
left join (
  select entry_id, count(*) as vote_count
  from votes
  group by entry_id
) v on v.entry_id = e.id;

-- View: comments with author profile information
create or replace view comments_with_author as
select
  c.id,
  c.entry_id,
  c.author_id,
  c.content,
  c.created_at,
  coalesce(p.name, 'Student') as author_name,
  coalesce(p.year, '2nd Year') as author_year,
  coalesce(p.branch, 'CSE') as author_branch
from comments c
left join profiles p on p.id = c.author_id;
