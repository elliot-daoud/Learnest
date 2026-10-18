-- À exécuter une fois dans Supabase > SQL Editor.

-- 1. Domaines autorisés : bloque toute inscription hors liste, même via l'API directe de Supabase.
create table public.allowed_email_domains (domain text primary key);
alter table public.allowed_email_domains enable row level security; -- aucune policy = inaccessible aux clients
insert into public.allowed_email_domains (domain) values ('unil.ch');
-- Pour ajouter une école plus tard : insert into public.allowed_email_domains values ('unige.ch');

create function public.enforce_allowed_email_domain() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email is null
     or lower(new.email) !~ '^[^@[:space:]]+@[^@[:space:]]+$'
     or not exists (
       select 1 from public.allowed_email_domains d
       where d.domain = split_part(lower(new.email), '@', 2)
     ) then
    raise exception 'Adresse e-mail non autorisée';
  end if;
  return new;
end $$;

create trigger enforce_allowed_email_domain
  before insert or update of email on auth.users
  for each row execute function public.enforce_allowed_email_domain();

-- 2. Tables (supprimées automatiquement avec le compte : on delete cascade)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  annee_etudes smallint check (annee_etudes between 1 and 6)
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.qcm_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  matiere text not null,
  chapitre text not null,
  score int not null check (score >= 0),
  total int not null check (total > 0),
  created_at timestamptz not null default now(),
  check (score <= total)
);
create index on public.qcm_attempts (user_id);
create index on public.qcm_attempts (created_at);

create table public.error_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  matiere text not null,
  chapitre text not null,
  question_id text not null, -- id de la question, ou 'fiche'
  message text not null check (char_length(message) between 1 and 500),
  statut text not null default 'nouveau' check (statut in ('nouveau', 'corrige', 'rejete')),
  created_at timestamptz not null default now()
);
create index on public.error_reports (statut, created_at);

-- 3. Row Level Security : chacun ne voit et n'écrit que ses propres lignes.
-- L'admin passe par la clé service (côté serveur uniquement), qui contourne RLS.
alter table public.profiles enable row level security;
alter table public.qcm_attempts enable row level security;
alter table public.error_reports enable row level security;

create policy "profil: lecture" on public.profiles for select using (id = auth.uid());
create policy "profil: modification" on public.profiles for update using (id = auth.uid());

create policy "tentatives: lecture" on public.qcm_attempts for select using (user_id = auth.uid());
create policy "tentatives: ajout" on public.qcm_attempts for insert with check (user_id = auth.uid());

create policy "signalements: lecture" on public.error_reports for select using (user_id = auth.uid());
create policy "signalements: ajout" on public.error_reports
  for insert with check (user_id = auth.uid() and statut = 'nouveau');
