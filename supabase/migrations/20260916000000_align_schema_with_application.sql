-- Reconciles the tracked schema with the database the application actually
-- runs against. Much of this was applied through the Supabase dashboard, so
-- the repository could no longer describe reality.
--
-- Ownership model in the live database: `summaries` and `quizzes` have NO
-- user_id column. They belong to a user through their parent document, and
-- every policy on those tables tests documents.user_id through a subquery.
-- The initial migration assumed a user_id column instead, so a deployment
-- created from these migrations alone would reject every insert the
-- application makes. This migration converts that shape into the live one.
--
-- Every statement is guarded, so it runs cleanly against the live database
-- (where most of it is already true) and against a fresh one.

-- ── profiles ───────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;

-- ── documents ──────────────────────────────────────────────────────────────
alter table public.documents add column if not exists extracted_text text;
alter table public.documents add column if not exists file_size bigint;
alter table public.documents add column if not exists page_count integer;

-- ── summaries ──────────────────────────────────────────────────────────────
alter table public.summaries add column if not exists summary_type text;

-- ── quizzes ────────────────────────────────────────────────────────────────
-- A generated quiz is stored as one JSON document ({ questions: [...] }),
-- not one row per question as the initial schema assumed.
alter table public.quizzes add column if not exists content jsonb;
alter table public.quizzes add column if not exists difficulty text;
alter table public.quizzes add column if not exists score integer;
alter table public.quizzes add column if not exists total integer;

-- ── relax columns the application never writes ─────────────────────────────
-- These exist only in a database built from the initial migration. Leaving
-- them NOT NULL makes every insert from the application fail.
do $$
declare
  target record;
begin
  for target in
    select * from (values
      ('documents', 'title'),
      ('summaries', 'user_id'),
      ('quizzes',   'user_id'),
      ('quizzes',   'question'),
      ('quizzes',   'answer')
    ) as t(table_name, column_name)
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = target.table_name
        and column_name = target.column_name
        and is_nullable = 'NO'
    ) then
      execute format(
        'alter table public.%I alter column %I drop not null',
        target.table_name, target.column_name
      );
    end if;
  end loop;
end $$;

-- A score must stay in range even if a row is written outside the API.
alter table public.quizzes drop constraint if exists quizzes_score_within_total;

alter table public.quizzes
  add constraint quizzes_score_within_total
  check (
    score is null
    or total is null
    or (score >= 0 and score <= total)
  );

-- ── row level security ─────────────────────────────────────────────────────
-- Replace the user_id-based policies from the initial migration. Those names
-- do not exist in the live database, so these drops are a no-op there.
drop policy if exists "Users can select their own summaries" on public.summaries;
drop policy if exists "Users can insert their own summaries" on public.summaries;
drop policy if exists "Users can update their own summaries" on public.summaries;
drop policy if exists "Users can delete their own summaries" on public.summaries;

drop policy if exists "Users can select their own quizzes" on public.quizzes;
drop policy if exists "Users can insert their own quizzes" on public.quizzes;
drop policy if exists "Users can update their own quizzes" on public.quizzes;
drop policy if exists "Users can delete their own quizzes" on public.quizzes;

-- Recreate them scoped through the parent document, matching the live
-- database. Created per command only when that command has no policy yet,
-- because Postgres has no CREATE POLICY IF NOT EXISTS.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'summaries' and cmd = 'SELECT'
  ) then
    create policy "Users can view own summaries"
      on public.summaries for select to authenticated
      using (
        exists (
          select 1 from public.documents
          where documents.id = summaries.document_id
            and documents.user_id = (select auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'summaries' and cmd = 'INSERT'
  ) then
    create policy "Users can insert own summaries"
      on public.summaries for insert to authenticated
      with check (
        exists (
          select 1 from public.documents
          where documents.id = summaries.document_id
            and documents.user_id = (select auth.uid())
        )
      );
  end if;
end $$;

-- summaries needs no DELETE policy: removing a document cascades to its
-- summaries through the foreign key, which is not subject to RLS.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quizzes' and cmd = 'SELECT'
  ) then
    create policy "Users can view their own quizzes"
      on public.quizzes for select to authenticated
      using (
        document_id in (
          select id from public.documents
          where user_id = (select auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quizzes' and cmd = 'INSERT'
  ) then
    create policy "Users can insert their own quizzes"
      on public.quizzes for insert to authenticated
      with check (
        document_id in (
          select id from public.documents
          where user_id = (select auth.uid())
        )
      );
  end if;

  -- Saving a quiz score is an UPDATE, so this policy has to exist.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quizzes' and cmd = 'UPDATE'
  ) then
    create policy "Users can update their own quizzes"
      on public.quizzes for update to authenticated
      using (
        document_id in (
          select id from public.documents
          where user_id = (select auth.uid())
        )
      )
      with check (
        document_id in (
          select id from public.documents
          where user_id = (select auth.uid())
        )
      );
  end if;
end $$;
