-- supabase_schema.sql
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- to initialize the relational and vector tables for your Evosan AI platform.

-- 1. Enable the pgvector extension for high-performance neural embeddings
create extension if not exists vector;

-- 2. Create the Journal Entries table with a 384-dimensional vector column
-- matching the SentenceTransformers 'all-MiniLM-L6-v2' model dimensions
create table if not exists public.journal_entries (
    id uuid default gen_random_uuid() primary key,
    user_id text not null default 'santosh_sah',
    title text,
    content text not null,
    mood int check (mood >= 0 and mood <= 10),
    embedding vector(384), -- stores 384-dim SentenceTransformer vectors
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable index for fast Cosine Distance vector similarity search
create index on public.journal_entries using hnsw (embedding vector_cosine_ops);

-- 3. Create the Habit Logs table
create table if not exists public.habit_logs (
    id uuid default gen_random_uuid() primary key,
    user_id text not null default 'santosh_sah',
    name text not null,
    completed boolean not null default false,
    date date not null default current_date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index dates for high-performance query fetching
create index on public.habit_logs (user_id, date);

-- 4. Create the Weekly Insights table
create table if not exists public.weekly_insights (
    id uuid default gen_random_uuid() primary key,
    user_id text not null default 'santosh_sah',
    score int check (score >= 0 and score <= 100),
    pattern text,
    friction text,
    directive text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index on public.weekly_insights (user_id, created_at desc);

-- 5. Helper function for Cosine Similarity Vector searches
-- Call this via REST API RPC or Postgrest client:
-- await supabase_db.client.rpc("match_journals", { query_embedding: [...], match_threshold: 0.7, match_count: 3 })
create or replace function match_journals (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  mood int,
  similarity float
)
language sql stable
as $$
  select
    journal_entries.id,
    journal_entries.content,
    journal_entries.mood,
    1 - (journal_entries.embedding <=> query_embedding) as similarity
  from journal_entries
  where 1 - (journal_entries.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
