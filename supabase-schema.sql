-- Run this in your Supabase SQL editor to set up the database

-- Goals table
create table if not exists goals (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  type text not null check (type in ('binary', 'numeric', 'frequency', 'qualitative')),
  config jsonb default '{}',
  progress jsonb default '{}',
  steps jsonb default '[]',
  sub_goals jsonb default '[]',
  icon text default '🎯',
  color text default '#e8c170',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table goals enable row level security;

-- Users can only see their own goals
create policy "Users can view own goals"
  on goals for select
  using (auth.uid() = user_id);

-- Users can insert their own goals
create policy "Users can insert own goals"
  on goals for insert
  with check (auth.uid() = user_id);

-- Users can update their own goals
create policy "Users can update own goals"
  on goals for update
  using (auth.uid() = user_id);

-- Users can delete their own goals
create policy "Users can delete own goals"
  on goals for delete
  using (auth.uid() = user_id);

-- Index for fast user lookups
create index if not exists idx_goals_user_id on goals(user_id);
