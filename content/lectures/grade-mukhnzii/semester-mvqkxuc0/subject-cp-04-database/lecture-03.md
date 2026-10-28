---
title: "04-3 · 마이그레이션과 제약조건"
description: "DB 구조를 파일로 기록하는 마이그레이션과 Supabase CLI 작업 순서, 가짜 데이터로만 만드는 Seed를 익히고, 기획서 부록 B의 핵심 테이블을 실제 CREATE TABLE로 옮기며 NOT NULL·UNIQUE·부분 UNIQUE·CHECK·외래 키·복합 외래 키·트랜잭션이 각각 어떤 잘못된 상태를 막는지 배웁니다."
order: 3
published: true
duration: 55
tags: [마이그레이션, Supabase CLI, 제약조건, CHECK, UNIQUE, 외래 키, 트랜잭션, Seed]
objectives:
  - 마이그레이션 파일을 만들고 개발 DB에 적용하는 순서를 말한다.
  - 부분 UNIQUE로 "ACTIVE 기수는 하나"를 강제하는 코드를 읽는다.
  - 복합 외래 키로 "업무의 행사는 같은 기수"를 강제하는 원리를 설명한다.
  - 트랜잭션이 기수 전환에서 막는 중간 상태를 말한다.
---

## 1. 마이그레이션 — DB 구조의 버전 기록

테이블·열·정책·함수를 바꾼 내용을 **SQL 파일로 남기는 것**을 마이그레이션이라고 합니다.

```text
supabase/
├─ config.toml
├─ migrations/
│  ├─ 20261101000000_core_tables.sql
│  ├─ 20261101000100_auth_hook.sql
│  ├─ 20261102000000_tasks.sql
│  └─ 20261105000000_meeting_agendas.sql
├─ seed.sql                ← 가짜 데이터
└─ tests/                  ← DB 테스트 (04-5편)
```

| 왜 파일로 | 설명 |
| --- | --- |
| 누구나 같은 DB를 만든다 | 새 팀원·새 기수가 파일만 적용하면 같은 구조 |
| 리뷰할 수 있다 | PR에서 RLS 정책 변경을 다른 사람이 읽음 (07-2편 규칙: 작성자 외 1명 검토) |
| 운영에 똑같이 적용된다 | 개발 DB에서 확인한 파일을 운영에 그대로 |

> [!CAUTION]
> ==red:Supabase 대시보드에서 테이블을 클릭으로 고치지 않습니다.== 그 변경은 파일에 남지 않아 개발·운영 DB가 서로 달라지고, 다음 기수는 무엇이 바뀌었는지 알 수 없습니다. 이미 적용된 마이그레이션 파일도 고치지 않고, 고칠 내용은 **새 파일**로 추가합니다.

### Supabase CLI 작업 순서

```bash
npx supabase login                                  # 공용 계정 토큰 또는 개인 초대 계정
npx supabase link --project-ref <개발 프로젝트 ref>  # 이 폴더를 개발 프로젝트에 연결
npx supabase migration new tasks                    # 빈 파일 생성: migrations/<시각>_tasks.sql
# … 파일에 SQL 작성 …
npx supabase db push                                # 연결된 프로젝트에 아직 안 적용된 파일 적용
npx supabase gen types typescript --linked > lib/database.types.ts   # 타입 갱신 (01-4편)
```

Docker를 설치할 수 있으면 `npx supabase start`로 내 컴퓨터에 DB를 띄워 `npx supabase db reset`(전부 지우고 마이그레이션+Seed 다시 적용)으로 더 자유롭게 실험할 수 있습니다. 운영 프로젝트 적용은 사람이 하지 않고 main에 합쳐질 때 GitHub Actions가 합니다(07-2편).

## 2. 제약조건 — DB가 막는 잘못된 상태

| 장치 | 막는 것 | 학생회 예 |
| --- | --- | --- |
| `NOT NULL` | 값이 비는 것 | 업무 제목 |
| `UNIQUE` | 중복 | 같은 기수의 같은 부서 이름 |
| 부분 `UNIQUE` | 조건이 맞는 행끼리의 중복 | ACTIVE 기수는 하나만 |
| `CHECK` | 잘못된 값·조합 | 상태는 네 값 중 하나, 인수인계는 Event 또는 부서 중 **정확히 하나** |
| `FOREIGN KEY` | 없는 행 참조 | 존재하지 않는 기수 ID |
| 복합 `FOREIGN KEY` | 다른 기수의 행 참조 | 2027 업무가 2026 행사에 연결 |
| 트랜잭션 | 반쯤 된 변경 | 이전 기수 종료 + 새 기수 활성화 |
| Index | 느린 검색 | RLS가 자주 쓰는 `term_id`, `user_id` |

## 3. 핵심 테이블을 SQL로

### 기수와 상태 값

```sql
create type public.term_status as enum ('DRAFT', 'ACTIVE', 'CLOSED');
create type public.member_role as enum ('MEMBER', 'DIRECTOR', 'EXECUTIVE');
create type public.task_status as enum ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
create type public.task_visibility as enum ('DEFAULT', 'RESTRICTED');

create table public.terms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 50),
  status     public.term_status not null default 'DRAFT',
  starts_on  date,
  ends_on    date,
  created_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or starts_on <= ends_on)
);

-- ACTIVE 기수는 한 번에 하나, DRAFT 기수도 하나 (추가 결정 3)
create unique index terms_one_active on public.terms ((true)) where status = 'ACTIVE';
create unique index terms_one_draft  on public.terms ((true)) where status = 'DRAFT';
```

| 부분 | 읽는 법 |
| --- | --- |
| `create type … as enum (…)` | 허용 값 목록을 가진 자료형 (TypeScript의 유니언과 같은 역할) |
| `uuid primary key default gen_random_uuid()` | 기본 키, 값을 안 주면 무작위 UUID |
| `check (char_length(name) between 1 and 50)` | 이름은 1–50자 |
| `create unique index … ((true)) where status = 'ACTIVE'` | **부분 UNIQUE**: ACTIVE인 행들끼리는 `true`라는 같은 값을 가지므로 둘째 ACTIVE 행은 중복으로 거부됨 |

### 부서·직책·Membership

```sql
create table public.departments (
  id         uuid primary key default gen_random_uuid(),
  term_id    uuid not null references public.terms(id),
  name       text not null,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  unique (term_id, name),
  unique (id, term_id)                      -- 복합 FK의 대상이 되기 위해
);

create table public.memberships (
  id                  uuid primary key default gen_random_uuid(),
  term_id             uuid not null references public.terms(id),
  user_id             uuid not null references public.profiles(id),
  role                public.member_role not null,
  department_id       uuid,
  position_id         uuid,
  approved_account_id uuid references public.approved_council_accounts(id),
  is_active           boolean not null default true,
  joined_at           timestamptz not null default now(),
  left_at             timestamptz,
  -- EXECUTIVE가 아니면 부서 필수 (기획서 1.2절)
  check (role = 'EXECUTIVE' or department_id is not null),
  -- 부서는 반드시 같은 기수의 부서
  foreign key (department_id, term_id) references public.departments (id, term_id)
);

-- 한 기수에 활성 Membership은 하나
create unique index memberships_one_active on public.memberships (term_id, user_id) where is_active;
-- 한 부서의 활성 국장은 한 명 (MVP)
create unique index memberships_one_director on public.memberships (department_id) where is_active and role = 'DIRECTOR';
```

> [!EXAM]
> **복합 외래 키 읽기** — `foreign key (department_id, term_id) references departments (id, term_id)`
> "이 Membership의 (부서 ID, 기수 ID) **짝**이 departments에 실제로 있는 짝이어야 한다." 그래서 2027 Membership에 2026 부서 ID를 넣으면, 그 부서 ID는 있어도 `(그 부서, 2027)` 짝은 없으므로 거부됩니다. 대상 테이블에 `unique (id, term_id)`가 있어야 이렇게 참조할 수 있습니다. `department_id`가 null이면(EXECUTIVE) 검사하지 않습니다.

### 승인 명단

```sql
create table public.approved_council_accounts (
  id                uuid primary key default gen_random_uuid(),
  term_id           uuid not null references public.terms(id),
  email             text not null check (email = lower(email) and email like '%@hanyang.ac.kr'),
  role              public.member_role not null,
  department_id     uuid,
  position_id       uuid,
  registered_by     uuid references public.profiles(id),
  activated_user_id uuid references public.profiles(id),
  is_active         boolean not null default true,
  unique (term_id, email),
  check (role = 'EXECUTIVE' or department_id is not null),
  foreign key (department_id, term_id) references public.departments (id, term_id)
);
```

### 업무 — 같은 기수의 행사만

```sql
create table public.tasks (
  id              uuid primary key default gen_random_uuid(),
  term_id         uuid not null references public.terms(id),
  event_id        uuid,
  department_id   uuid not null,
  title           text not null check (char_length(title) between 1 and 100),
  description     text check (char_length(description) <= 5000),
  creator_id      uuid not null references public.profiles(id),
  assignee_id     uuid references public.profiles(id),
  manager_id      uuid references public.profiles(id),
  status          public.task_status not null default 'TODO',
  priority        smallint not null default 0,
  visibility_mode public.task_visibility not null default 'DEFAULT',
  start_date      date,
  due_date        date,
  completed_at    timestamptz,
  archived_at     timestamptz,
  archived_by     uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  foreign key (event_id, term_id)      references public.events (id, term_id),
  foreign key (department_id, term_id) references public.departments (id, term_id),
  check ((status = 'DONE') = (completed_at is not null))     -- 완료면 완료 시각이 있고, 아니면 없다
);

create index tasks_term_dept on public.tasks (term_id, department_id) where archived_at is null;
create index tasks_assignee  on public.tasks (assignee_id) where archived_at is null;
```

기획서 9절 "`event_id`가 있으면 `term_id`가 Event의 Term과 같아야 한다"를 복합 FK 한 줄로 해결했습니다.

### 인수인계 — 정확히 하나에 연결

```sql
create table public.handovers (
  id            uuid primary key default gen_random_uuid(),
  term_id       uuid not null references public.terms(id),
  event_id      uuid,
  department_id uuid,
  title         text not null,
  content       jsonb not null default '[]',         -- BlockNote Block JSON
  status        text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  owner_id      uuid not null references public.profiles(id),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (num_nonnulls(event_id, department_id) = 1),  -- 둘 중 정확히 하나
  foreign key (event_id, term_id)      references public.events (id, term_id),
  foreign key (department_id, term_id) references public.departments (id, term_id)
);
```

### 추가 결정 테이블

```sql
create table public.meeting_agendas (
  id         uuid primary key default gen_random_uuid(),
  term_id    uuid not null references public.terms(id),
  event_id   uuid,
  title      text not null check (char_length(title) between 1 and 100),
  meeting_at timestamptz not null,
  status     text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'CLOSED')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (id, term_id),
  foreign key (event_id, term_id) references public.events (id, term_id)
);

create table public.meeting_agenda_items (
  id                      uuid primary key default gen_random_uuid(),
  agenda_id               uuid not null references public.meeting_agendas(id) on delete cascade,
  sort_order              int not null,
  title                   text not null check (char_length(title) between 1 and 200),
  description             text,
  presenter_department_id uuid references public.departments(id),
  unique (agenda_id, sort_order)
);

-- meeting_minutes에 추가: 안건 하나에 회의록 하나, 같은 기수
alter table public.meeting_minutes add column agenda_id uuid unique;
alter table public.meeting_minutes add foreign key (agenda_id, term_id) references public.meeting_agendas (id, term_id);

create table public.term_handover_requests (
  id             uuid primary key default gen_random_uuid(),
  source_term_id uuid not null references public.terms(id),
  target_term_id uuid not null references public.terms(id),
  nominee_email  text not null check (nominee_email = lower(nominee_email) and nominee_email like '%@hanyang.ac.kr'),
  requested_by   uuid not null references public.profiles(id),
  decided_by     uuid references public.profiles(id),
  status         text not null default 'PENDING'
                 check (status in ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED')),
  expires_at     timestamptz not null default now() + interval '7 days',
  decided_at     timestamptz,
  created_at     timestamptz not null default now(),
  check (source_term_id <> target_term_id),
  check (decided_by is null or decided_by <> requested_by)   -- 요청자 본인은 승인할 수 없다
);

create unique index handover_one_pending on public.term_handover_requests (target_term_id, nominee_email)
  where status = 'PENDING';
```

> [!NOTE]
> `check (decided_by <> requested_by)`는 화면·Server Action·DB 함수의 검사와 별개로 **테이블 자체가** "혼자 요청하고 혼자 승인"을 거부하게 합니다. 함수에 버그가 있어도 이 규칙은 깨지지 않습니다.

## 4. 트랜잭션 — 전부 아니면 전무

여러 변경을 **하나로 묶어** 모두 성공하거나 모두 취소되게 하는 것이 트랜잭션입니다. DB 함수(`create function … language plpgsql`) 하나는 그 자체로 하나의 트랜잭션 안에서 실행됩니다.

```sql
-- 기수 전환의 뼈대 (전체 코드는 06-6편)
update public.terms set status = 'CLOSED', ends_on = current_date where status = 'ACTIVE';
update public.memberships set is_active = false, left_at = now() where term_id = v_old and is_active;
update public.terms set status = 'ACTIVE' where id = v_new;
```

이 셋 중 두 번째에서 실패하면? 함수 안이라면 **첫 번째도 취소**되어 이전 기수가 그대로 ACTIVE입니다. 함수 밖에서 하나씩 보냈다면 "ACTIVE 기수가 하나도 없는" 상태가 남고, 그동안 모든 구성원이 내부 자료에 접근하지 못합니다.

## 5. Seed — 가짜 데이터만

```sql
-- supabase/seed.sql  ← 공개 저장소에 올라가므로 실제 학생 정보 금지
insert into public.terms (id, name, status, starts_on)
values ('00000000-0000-0000-0000-000000000026', '연습 제1기', 'ACTIVE', '2026-03-01');

insert into public.departments (term_id, name, sort_order) values
  ('00000000-0000-0000-0000-000000000026', '사무국', 1),
  ('00000000-0000-0000-0000-000000000026', '재무국', 2),
  ('00000000-0000-0000-0000-000000000026', '홍보국', 3),
  ('00000000-0000-0000-0000-000000000026', '생활복지국', 4);

insert into public.approved_council_accounts (term_id, email, role)
values ('00000000-0000-0000-0000-000000000026', 'test-executive@hanyang.ac.kr', 'EXECUTIVE');
```

기획서 1.1절대로 사무국·재무국·홍보국·생활복지국은 **초기 Seed**일 뿐 코드에 고정된 이름이 아닙니다. 이메일은 실제로 존재하지 않는 테스트용 주소만 씁니다.

> [!QUIZ]
> 2027 기수 업무를 만들면서 `event_id`에 2026 기수 행사의 ID를 넣었습니다. 어떤 제약이 거부하나요?

> [!ANSWER]
> `foreign key (event_id, term_id) references events (id, term_id)`입니다. events에 `(그 행사 ID, 2027 기수 ID)` 짝이 없으므로 저장이 거부됩니다. 행사 ID 자체는 존재해도 짝이 맞지 않으면 안 됩니다.

> [!QUIZ]
> 대시보드에서 `tasks` 테이블에 `memo` 열을 클릭으로 추가했습니다. 무엇이 문제이고 어떻게 바로잡나요?

> [!ANSWER]
> 변경이 마이그레이션 파일에 없어서, 다른 개발자의 DB와 운영 DB에는 그 열이 없고 다음 기수도 이유를 알 수 없습니다. `npx supabase migration new add_task_memo`로 파일을 만들어 `alter table public.tasks add column memo text;`를 적고, PR 리뷰를 거쳐 적용합니다(이미 손으로 추가한 개발 DB에는 `add column if not exists`로 충돌을 피함).

## 학습 경로

[← 04-2 SQL 읽기·쓰기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-02) · [04-4 RLS와 권한 함수 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-04)
