-- AI Study Buddy core data schema and row-level security.
-- This migration intentionally excludes Storage policies, uploads, AI, and API logic.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id)
);

create table public.summaries (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (document_id, user_id)
    references public.documents (id, user_id) on delete cascade
);

create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  document_id uuid,
  role text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (document_id, user_id)
    references public.documents (id, user_id) on delete cascade
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question text not null,
  answer text not null,
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (document_id, user_id)
    references public.documents (id, user_id) on delete cascade
);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  front text not null,
  back text not null,
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (document_id, user_id)
    references public.documents (id, user_id) on delete cascade
);

create index documents_user_id_created_at_idx on public.documents (user_id, created_at desc);
create index summaries_user_id_document_id_idx on public.summaries (user_id, document_id);
create index chats_user_id_document_id_created_at_idx on public.chats (user_id, document_id, created_at);
create index quizzes_user_id_document_id_idx on public.quizzes (user_id, document_id);
create index flashcards_user_id_document_id_idx on public.flashcards (user_id, document_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

insert into public.profiles (id, display_name)
select
  id,
  coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.summaries enable row level security;
alter table public.chats enable row level security;
alter table public.quizzes enable row level security;
alter table public.flashcards enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update, delete on public.summaries to authenticated;
grant select, insert, update, delete on public.chats to authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;
grant select, insert, update, delete on public.flashcards to authenticated;

create policy "Users can select their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can insert their own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Users can delete their own profile" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy "Users can select their own documents" on public.documents for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own documents" on public.documents for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own documents" on public.documents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own documents" on public.documents for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can select their own summaries" on public.summaries for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own summaries" on public.summaries for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own summaries" on public.summaries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own summaries" on public.summaries for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can select their own chats" on public.chats for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own chats" on public.chats for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own chats" on public.chats for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own chats" on public.chats for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can select their own quizzes" on public.quizzes for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own quizzes" on public.quizzes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own quizzes" on public.quizzes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own quizzes" on public.quizzes for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can select their own flashcards" on public.flashcards for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert their own flashcards" on public.flashcards for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own flashcards" on public.flashcards for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own flashcards" on public.flashcards for delete to authenticated using ((select auth.uid()) = user_id);

revoke execute on function public.handle_new_user() from public;
