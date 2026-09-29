-- Conecta + Supabase
-- Ejecutar en Supabase > SQL Editor.
-- Las contraseñas las administra Supabase Auth; NO se almacenan en esta tabla.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('instagram','whatsapp','tiktok','facebook')),
  external_account_id text,
  account_name text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  expires_at timestamptz,
  capabilities jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.connected_accounts enable row level security;

drop policy if exists "Users can view own connected accounts" on public.connected_accounts;
create policy "Users can view own connected accounts"
on public.connected_accounts for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own connected accounts" on public.connected_accounts;
create policy "Users can insert own connected accounts"
on public.connected_accounts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own connected accounts" on public.connected_accounts;
create policy "Users can update own connected accounts"
on public.connected_accounts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own connected accounts" on public.connected_accounts;
create policy "Users can delete own connected accounts"
on public.connected_accounts for delete
using (auth.uid() = user_id);

-- Instagram OAuth state and account uniqueness
create table if not exists public.oauth_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider = 'instagram'),
  state_hash text not null unique,
  redirect_uri text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists oauth_states_user_id_idx on public.oauth_states(user_id);
create index if not exists oauth_states_expires_at_idx on public.oauth_states(expires_at);
create index if not exists oauth_states_provider_idx on public.oauth_states(provider);
alter table public.oauth_states enable row level security;
drop policy if exists "Users can view own OAuth states" on public.oauth_states;
create policy "Users can view own OAuth states" on public.oauth_states for select to authenticated using ((select auth.uid()) = user_id);
revoke insert, update, delete on public.oauth_states from anon, authenticated;
grant select on public.oauth_states to authenticated;
create or replace function public.consume_instagram_oauth_state(p_state_hash text,p_user_id uuid,p_redirect_uri text)
returns table (state_id uuid, valid boolean, reason text)
language plpgsql security definer set search_path = '' as $$
declare v_state public.oauth_states%rowtype;
begin
 select * into v_state from public.oauth_states where state_hash=p_state_hash and provider='instagram' limit 1;
 if not found then return query select null::uuid,false,'missing'::text; return; end if;
 if v_state.consumed_at is not null then return query select v_state.id,false,'already_consumed'::text; return; end if;
 if v_state.expires_at <= now() then return query select v_state.id,false,'expired'::text; return; end if;
 if v_state.user_id <> p_user_id then return query select v_state.id,false,'wrong_user'::text; return; end if;
 if v_state.redirect_uri <> p_redirect_uri then return query select v_state.id,false,'redirect_uri_mismatch'::text; return; end if;
 update public.oauth_states set consumed_at=now() where id=v_state.id and consumed_at is null and expires_at>now() and user_id=p_user_id and redirect_uri=p_redirect_uri;
 if found then return query select v_state.id,true,'valid'::text; return; end if;
 return query select v_state.id,false,'already_consumed'::text;
end; $$;
revoke all on function public.consume_instagram_oauth_state(text,uuid,text) from public,anon,authenticated;
create unique index if not exists connected_accounts_user_platform_uidx on public.connected_accounts(user_id, platform);
