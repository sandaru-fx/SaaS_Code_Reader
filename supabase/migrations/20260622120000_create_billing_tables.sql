create table if not exists public.user_subscriptions (
  user_id text primary key,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  event_type text not null check (event_type in ('analyze', 'chat', 'analyze_project')),
  created_at timestamptz not null default now()
);

create index if not exists usage_events_user_type_created_idx
  on public.usage_events (user_id, event_type, created_at desc);

alter table public.user_subscriptions enable row level security;
alter table public.usage_events enable row level security;
