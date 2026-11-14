-- 강의 자료를 DB에 둔다(파일 → Supabase 이전 1단계).
--   분류: grades → semesters → subjects. id는 지금 주소에 쓰는 문자열(grade-01 …)을 그대로 쓴다.
--   문서: documents(목록·메타데이터)와 document_bodies(본문)를 나눈다.
--     강의 노트 본문은 공개된 것이면 누구나 읽는다.
--     족보 본문은 RLS로 아무에게도 열지 않는다. 서버가 비밀번호(쿠키)를 확인한 뒤 secret key로만 읽는다.
--   족보 비밀번호: practice_keys에 해시로 둔다. 평문은 어디에도 저장하지 않는다.
--   쓰기: admins에 있는 계정만.
--   그림 등 파일: Storage 버킷 materials(공개 읽기, 관리자만 쓰기). 족보 원본은 올리지 않는다.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- ---------------------------------------------------------------------
-- 관리자
-- ---------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- ---------------------------------------------------------------------
-- 분류
-- ---------------------------------------------------------------------
create domain public.slug_id as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(value) <= 64);

create table public.grades (
  id public.slug_id primary key,
  name text not null check (length(trim(name)) between 1 and 40),
  sort integer not null default 0
);

create table public.semesters (
  grade_id public.slug_id not null references public.grades (id) on update cascade on delete restrict,
  id public.slug_id not null,
  name text not null check (length(trim(name)) between 1 and 40),
  sort integer not null default 0,
  primary key (grade_id, id)
);

create table public.subjects (
  grade_id public.slug_id not null,
  semester_id public.slug_id not null,
  id public.slug_id not null,
  name text not null check (length(trim(name)) between 1 and 60),
  sort integer not null default 0,
  primary key (grade_id, semester_id, id),
  foreign key (grade_id, semester_id) references public.semesters (grade_id, id) on update cascade on delete restrict
);

-- ---------------------------------------------------------------------
-- 족보 비밀번호: key 하나에 비밀번호 하나. 'default'는 accessKey가 없는 족보가 쓴다.
-- ---------------------------------------------------------------------
create table public.practice_keys (
  key public.slug_id primary key,
  password_hash text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 문서
-- ---------------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('lectures', 'practice')),
  grade_id public.slug_id not null,
  semester_id public.slug_id not null,
  subject_id public.slug_id not null,
  slug public.slug_id not null,            -- lecture-07, exam-01 …
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null default '' check (length(description) <= 500),
  sort integer not null check (sort >= 0),
  meta jsonb not null default '{}' check (jsonb_typeof(meta) = 'object'),  -- duration, tags, objectives, difficulty
  format text not null default 'md' check (format in ('md', 'mdx')),
  access_key public.slug_id references public.practice_keys (key) on update cascade on delete restrict,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  foreign key (grade_id, semester_id, subject_id)
    references public.subjects (grade_id, semester_id, id) on update cascade on delete restrict,
  unique (kind, grade_id, semester_id, subject_id, slug),
  unique (kind, grade_id, semester_id, subject_id, sort),
  check (kind = 'practice' or access_key is null)
);

create index documents_subject on public.documents (grade_id, semester_id, subject_id, kind, sort);

create table public.document_bodies (
  document_id uuid primary key references public.documents (id) on delete cascade,
  body text not null default '' check (length(body) <= 500000)
);

-- 저장할 때마다 이전 본문을 남긴다(되돌리기용)
create table public.document_revisions (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.documents (id) on delete cascade,
  title text not null,
  body text not null,
  saved_at timestamptz not null default now(),
  saved_by uuid references auth.users (id) on delete set null
);

create index document_revisions_document on public.document_revisions (document_id, saved_at desc);

create function private.touch_document()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce((select auth.uid()), new.updated_by);
  return new;
end;
$$;

create trigger documents_touch before update on public.documents
  for each row execute function private.touch_document();

create function private.keep_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.body is distinct from new.body then
    insert into public.document_revisions (document_id, title, body, saved_by)
    select old.document_id, d.title, old.body, (select auth.uid())
    from public.documents d where d.id = old.document_id;
    update public.documents set updated_at = now() where id = old.document_id;
  end if;
  return new;
end;
$$;

create trigger document_bodies_revision before update on public.document_bodies
  for each row execute function private.keep_revision();

-- ---------------------------------------------------------------------
-- 족보 비밀번호 확인: 맞으면 true. 해시는 밖으로 나가지 않는다.
-- ---------------------------------------------------------------------
create function public.verify_practice_password(p_document_id uuid, p_password text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select k.password_hash = extensions.crypt(p_password, k.password_hash)
    from public.documents d
    join public.practice_keys k on k.key = coalesce(d.access_key, 'default')
    where d.id = p_document_id and d.kind = 'practice' and d.published
  ), false)
$$;

-- 관리자가 비밀번호를 정하거나 바꾼다
create function public.set_practice_password(p_key text, p_password text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  -- 가져오기 스크립트는 secret key(service_role)로 부른다
  if not (private.is_admin() or (select auth.role()) = 'service_role') then
    raise exception '관리자만 족보 비밀번호를 바꿀 수 있습니다.' using errcode = '42501';
  end if;
  if p_password is null or length(p_password) < 4 or length(p_password) > 100 then
    raise exception '비밀번호는 4~100자로 입력해 주세요.' using errcode = '22023';
  end if;
  insert into public.practice_keys (key, password_hash)
  values (p_key, extensions.crypt(p_password, extensions.gen_salt('bf')))
  on conflict (key) do update set password_hash = excluded.password_hash, updated_at = now();
end;
$$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.grades enable row level security;
alter table public.semesters enable row level security;
alter table public.subjects enable row level security;
alter table public.practice_keys enable row level security;
alter table public.documents enable row level security;
alter table public.document_bodies enable row level security;
alter table public.document_revisions enable row level security;

create policy "admins: self or admin" on public.admins for select to authenticated
  using (user_id = (select auth.uid()) or private.is_admin());

create policy "grades: read" on public.grades for select to anon, authenticated using (true);
create policy "semesters: read" on public.semesters for select to anon, authenticated using (true);
create policy "subjects: read" on public.subjects for select to anon, authenticated using (true);
create policy "grades: admin write" on public.grades for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "semesters: admin write" on public.semesters for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "subjects: admin write" on public.subjects for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- practice_keys: 정책 없음 = 아무도 직접 읽거나 쓰지 못한다(함수만)

create policy "documents: published or admin" on public.documents for select to anon, authenticated
  using (published or private.is_admin());
create policy "documents: admin write" on public.documents for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "bodies: published lectures or admin" on public.document_bodies for select to anon, authenticated
  using (
    private.is_admin()
    or exists (select 1 from public.documents d where d.id = document_id and d.published and d.kind = 'lectures')
  );
create policy "bodies: admin write" on public.document_bodies for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "revisions: admin read" on public.document_revisions for select to authenticated
  using (private.is_admin());

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;
revoke all on function public.verify_practice_password(uuid, text) from public;
grant execute on function public.verify_practice_password(uuid, text) to anon, authenticated;
revoke all on function public.set_practice_password(text, text) from public, anon;
grant execute on function public.set_practice_password(text, text) to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Storage: 강의 그림·슬라이드. 공개 읽기, 관리자만 쓰기
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('materials', 'materials', true, 20971520)
on conflict (id) do nothing;

create policy "materials: admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'materials' and private.is_admin());
create policy "materials: admin update" on storage.objects for update to authenticated
  using (bucket_id = 'materials' and private.is_admin());
create policy "materials: admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'materials' and private.is_admin());
