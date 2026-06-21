create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text,
  file_name text,
  language text not null,
  code text not null,
  explanation text not null,
  mermaid text not null,
  created_at timestamptz not null default now(),
  constraint analyses_owner_check check (user_id is not null or session_id is not null)
);

create index if not exists analyses_user_id_created_at_idx
  on public.analyses (user_id, created_at desc)
  where user_id is not null;

create index if not exists analyses_session_id_created_at_idx
  on public.analyses (session_id, created_at desc)
  where session_id is not null;

alter table public.analyses enable row level security;
