---
title: "04-4 · RLS와 권한 함수"
description: "Row Level Security가 모든 쿼리에 조건을 덧붙이는 원리, 읽기는 RLS 정책·쓰기는 검사 함수(RPC)로 나누는 이 프로젝트의 규칙, private 스키마의 SECURITY DEFINER 권한 함수(current_membership·can_read_event·can_read_task)를 실제 SQL로 읽고, Event→Task 권한 상속과 공개 모드·ACL·Archive Grant가 한 함수 안에서 어떻게 계산되는지 따라갑니다."
order: 4
published: false
duration: 60
tags: [RLS, 권한, SECURITY DEFINER, 정책, ACL, 권한 상속, PostgreSQL 함수]
objectives:
  - RLS를 켜면 정책이 없는 동작은 모두 거부된다는 것을 설명한다.
  - using과 with check의 차이를 말한다.
  - 읽기는 정책, 쓰기는 검사 함수로 나누는 이유를 말한다.
  - can_read_task가 Event 범위·공개 모드·기본 접근자·ACL을 어떤 순서로 검사하는지 읽는다.
  - 권한 함수를 private 스키마·고정 search_path·(select …) 감싸기로 작성하는 이유를 말한다.
---

## 1. RLS — 모든 쿼리에 붙는 보이지 않는 WHERE

**Row Level Security**(RLS)를 켜면, 그 테이블에 대한 모든 요청에 DB가 정책 조건을 **자동으로 덧붙입니다.**

```sql
alter table public.tasks enable row level security;

create policy "tasks: read if allowed"
on public.tasks for select
to authenticated
using ( private.can_read_task(id) );
```

이제 국원이 `select * from tasks`를 보내면 DB는 실제로 이렇게 실행합니다.

```sql
select * from tasks where private.can_read_task(id);    -- 정책이 덧붙인 조건
```

| 규칙 | 뜻 |
| --- | --- |
| RLS를 켜고 정책이 없으면 | **모두 거부** (행이 하나도 안 보임) |
| 정책이 여러 개면 | 하나라도 통과하면 허용 (OR) |
| `for select / insert / update / delete` | 정책이 적용되는 동작 |
| `to authenticated` | 로그인한 사용자에게만. `anon`(비로그인)은 해당 없음 |
| `using (조건)` | 이미 있는 행을 **읽거나 고르거나 지울 때** 검사 |
| `with check (조건)` | 새로 쓰거나 바꾼 **결과 행**이 만족해야 할 조건 |

[![현재 사용자, Role 기본 능력, 대상 자료의 ACL, 실제 강제의 네 단계를 차례로 통과해야 허용되는 그림](/materials/diagrams/cpg-04a-permission-layers.svg)](/materials/diagrams/cpg-04a-permission-layers.svg)

*그림 04-3 · 권한은 네 단계로 판정한다 — 누르면 원본 크기로 열린다.*

## 2. 이 프로젝트의 규칙: 읽기는 정책, 쓰기는 함수

| 동작 | 방법 | 이유 |
| --- | --- | --- |
| **읽기** | 테이블마다 SELECT 정책 + 열람 함수 | 화면 어디서 어떻게 조회하든 같은 조건이 붙음 |
| **쓰기** | 직접 INSERT·UPDATE·DELETE 권한을 빼고, 검사 함수(RPC)로만 | RLS는 "이 행에 쓸 수 있나"만 보고 "**어느 열을** 어떻게 바꾸나"는 못 봄 (국원은 상태만, 국장은 담당자도…) |

```sql
-- 사용자는 tasks를 직접 바꿀 수 없다. 함수만 바꾼다.
revoke insert, update, delete on public.tasks from authenticated, anon;
```

기획서 4.6절 "RLS UPDATE 정책은 행 접근만 확인하지 않고 **변경 가능한 열과 상태 전이를 RPC 또는 Trigger에서 검증**"과 9.2절 "`memberships`·`approved_council_accounts`·`terms`는 RPC로만 변경"을 이렇게 구현합니다.

## 3. 권한 함수를 두는 곳과 쓰는 법

```sql
create schema if not exists private;
grant usage on schema private to authenticated;
-- private 스키마는 Supabase API(PostgREST)에 노출하지 않는다 → 브라우저가 직접 부를 수 없음
```

### ① 내 Membership

```sql
create function private.current_membership(p_term_id uuid)
returns table (role public.member_role, department_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select m.role, m.department_id
  from public.memberships m
  where m.term_id = p_term_id
    and m.user_id = (select auth.uid())
    and m.is_active;
$$;

create function private.is_executive(p_term_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from private.current_membership(p_term_id) where role = 'EXECUTIVE');
$$;
```

| 선언 | 뜻 | 왜 |
| --- | --- | --- |
| `language sql` | SQL 한 문장짜리 함수 | 간단하고 빠름 |
| `stable` | 같은 요청 안에서는 같은 결과 | DB가 결과를 재사용해 빠름 |
| `security definer` | 함수 **주인**의 권한으로 실행 | 함수 안에서 `memberships`를 읽을 때 다시 RLS에 걸려 무한 반복되는 것을 피함 |
| `set search_path = ''` | 테이블을 반드시 `public.memberships`처럼 적게 함 | 누군가 같은 이름의 가짜 테이블을 만들어 바꿔치기하는 공격 방지 |
| `(select auth.uid())` | 괄호로 감싼 하위 쿼리 | 행마다가 아니라 **요청당 한 번** 계산 (기획서 10.4절 성능 규칙) |

> [!CAUTION]
> `security definer` 함수는 RLS를 건너뛰는 강한 도구입니다. 그래서 ① `private` 스키마에 두어 API로 직접 못 부르게 하고, ② 돌려주는 값을 **참/거짓이나 최소 정보**로 제한하고, ③ 입력 ID를 그대로 믿지 않고 함수 안에서 사용자 기준으로 판단합니다.

### ② 행사를 볼 수 있나

```sql
create function private.can_read_event(p_event_id uuid)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare
  e public.events%rowtype;
  me record;
begin
  select * into e from public.events where id = p_event_id;
  if not found then return false; end if;

  -- 지난 기수: 유효한 Archive Grant로만 읽기 (기획서 8.1절)
  if (select status from public.terms where id = e.term_id) = 'CLOSED' then
    return private.has_archive_grant(e.term_id, 'EVENT', e.id)
        or private.has_archive_grant(e.term_id, 'TERM', null);
  end if;

  select * into me from private.current_membership(e.term_id) limit 1;
  if me is null then return false; end if;                       -- 같은 기수 활성 구성원이 아님

  if me.role = 'EXECUTIVE' then return true; end if;             -- 회장단
  if e.visibility_mode = 'ALL_COUNCIL' then return true; end if; -- 전체 공개 행사
  if e.created_by = (select auth.uid()) or e.manager_id = (select auth.uid()) then return true; end if;
  if e.owner_department_id = me.department_id then return true; end if;   -- 주관 국

  return exists (                                                 -- RESTRICTED: ACL 대상인가
    select 1 from public.event_access_rules r
    where r.event_id = e.id and (
         (r.subject_type = 'USER'       and r.user_id = (select auth.uid()))
      or (r.subject_type = 'DEPARTMENT' and r.department_id = me.department_id)
      or (r.subject_type = 'ROLE_GROUP' and (
              r.role_group = 'ALL_COUNCIL'
           or (r.role_group = 'DIRECTORS' and me.role in ('DIRECTOR', 'EXECUTIVE')))))
  );
end;
$$;
```

이 함수 하나를 `events` SELECT 정책, `event_resources`·`schedules`·`handovers` 정책, **Storage 정책**(03-4편)이 모두 씁니다. 기획서 10.4절 "열람 함수 하나를 여러 정책이 공유"의 실제 모습입니다.

### ③ 업무를 볼 수 있나 — 상속과 교집합

[![Event 열람자 원과 Task ACL 대상 원이 겹치는 부분만 Task를 실제로 볼 수 있다는 교집합 그림](/materials/diagrams/cpg-04b-event-scope.svg)](/materials/diagrams/cpg-04b-event-scope.svg)

*그림 04-4 · 하위 자료는 교집합만 본다 — 누르면 원본 크기로 열린다.*

```sql
create function private.can_read_task(p_task_id uuid)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare
  t public.tasks%rowtype;
  me record;
  uid uuid := (select auth.uid());
begin
  select * into t from public.tasks where id = p_task_id;
  if not found or t.archived_at is not null and not private.is_executive(t.term_id) then return false; end if;

  -- ① 상위 Event 범위를 먼저 (교집합)
  if t.event_id is not null and not private.can_read_event(t.event_id) then return false; end if;

  select * into me from private.current_membership(t.term_id) limit 1;
  if me is null then return false; end if;                 -- (지난 기수 Grant 처리는 생략)

  -- ② 항상 볼 수 있는 사람
  if me.role = 'EXECUTIVE' or uid in (t.creator_id, t.assignee_id, t.manager_id) then return true; end if;

  -- ③ 공개 모드
  if t.visibility_mode = 'DEFAULT' and me.department_id = t.department_id then return true; end if;

  -- ④ ACL
  return exists (
    select 1 from public.task_access_rules r
    where r.task_id = t.id and (
         (r.subject_type = 'USER'       and r.user_id = uid)
      or (r.subject_type = 'DEPARTMENT' and r.department_id = me.department_id)
      or (r.subject_type = 'ROLE_GROUP' and (
              r.role_group = 'ALL_COUNCIL'
           or (r.role_group = 'DIRECTORS'  and me.role in ('DIRECTOR', 'EXECUTIVE'))
           or (r.role_group = 'EXECUTIVES' and me.role = 'EXECUTIVE'))))
  );
end;
$$;
```

| 순서 | 검사 | 기획서 |
| --- | --- | --- |
| ① | 행사에 속하면 행사를 볼 수 있어야 함 (못 보면 즉시 거부) | 5.2 교집합 |
| ② | 회장단·생성자·담당자·관리자는 항상 | 4.2 |
| ③ | DEFAULT면 담당 국 구성원 | 4.2 |
| ④ | ACL에 지정된 사용자·부서·역할 그룹 | 4.3–4.4 |

RESTRICTED 업무는 ③을 건너뛰므로 담당 국의 다른 구성원은 ④에 이름이 없으면 못 봅니다. 업무의 댓글·첨부·Activity Log 정책도 `private.can_read_task(task_id)`를 그대로 씁니다.

## 4. 쓰기 함수의 모양

```sql
create function public.update_task_status(p_task_id uuid, p_status public.task_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.tasks%rowtype;
  me record;
  uid uuid := (select auth.uid());
begin
  select * into t from public.tasks where id = p_task_id for update;     -- 행 잠금
  if not found or not private.can_read_task(p_task_id) then
    raise exception 'USER:업무를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;
  if (select status from public.terms where id = t.term_id) <> 'ACTIVE' then
    raise exception 'USER:지난 기수의 업무는 바꿀 수 없습니다.' using errcode = 'P0001';
  end if;

  select * into me from private.current_membership(t.term_id) limit 1;
  -- 기획서 4.6: 상태 변경 = MEMBER는 본인 담당, DIRECTOR는 관리 가능한 Task, EXECUTIVE는 전체
  if not (me.role = 'EXECUTIVE'
       or (me.role = 'DIRECTOR' and private.can_manage_task(t.id))
       or t.assignee_id = uid) then
    raise exception 'USER:이 업무의 상태를 바꿀 권한이 없습니다.' using errcode = 'P0001';
  end if;

  update public.tasks
  set status = p_status,
      completed_at = case when p_status = 'DONE' then coalesce(completed_at, now()) else null end,
      updated_at = now()
  where id = p_task_id;

  perform private.log_activity(t.term_id, 'task', t.id,
    case when t.status = 'DONE' and p_status <> 'DONE' then 'reopen' else 'status.change' end,
    jsonb_build_object('status', t.status), jsonb_build_object('status', p_status));
end;
$$;

grant execute on function public.update_task_status to authenticated;
```

| 줄 | 읽는 법 |
| --- | --- |
| `for update` | 이 행을 잠가 동시 변경과 섞이지 않게 |
| `raise exception 'USER:…' using errcode = 'P0001'` | 사용자에게 보여도 되는 이유를 던짐 → 03-1편 `toUserMessage`가 그대로 표시 |
| 권한 분기 | 기획서 4.6 표를 그대로 옮김 |
| `perform private.log_activity(...)` | 같은 트랜잭션 안에서 기록 (03-4편) |
| `grant execute … to authenticated` | 로그인 사용자는 이 함수만 부를 수 있음 |

> [!NOTE]
> 01-5편의 `create_task`도 같은 모양입니다. 쓰기 함수는 모두 위처럼 `security definer` + 함수 안의 명시적 권한 검사 + Activity Log 기록으로 만듭니다. 지정 대상 검사(담당자가 Event를 볼 수 있는가, 기획서 1.7절)도 이 함수들 안에 들어갑니다.

## 5. 민감한 열은 테이블을 나눈다

RLS는 **행** 단위입니다. "건의 내용은 담당자도 보지만 작성자 열은 회장단만" 같은 **열** 단위 구분은 RLS로 할 수 없습니다. 그래서 기획서는 작성자를 `suggestion_authors`라는 **다른 테이블**로 떼어 냅니다.

```sql
alter table public.suggestion_authors enable row level security;

create policy "author identity: self or executive"
on public.suggestion_authors for select to authenticated
using (
  author_user_id = (select auth.uid())
  or private.is_executive((select term_id from public.suggestions s where s.id = suggestion_id))
);
```

## 6. 점검 질문

| 질문 | 확인 방법 |
| --- | --- |
| 모든 테이블에 RLS가 켜져 있나? | `select tablename from pg_tables where schemaname='public' and not rowsecurity;` 결과가 비어야 함 |
| 쓰기 권한을 함수로만 열었나? | 직접 `update` 시도가 거부되는지 테스트 (04-5편) |
| 권한 함수가 `private`에 있고 `search_path`가 고정됐나? | 마이그레이션 리뷰 |
| 정책의 `auth.uid()`를 `(select …)`로 감쌌나? | 마이그레이션 리뷰 |

> [!QUIZ]
> 홍보국원 B가 재무국의 DEFAULT 업무를 보려고 합니다. 행사와 무관한 업무이고 ACL은 비어 있습니다. `can_read_task`는 어느 단계에서 무엇을 돌려주나요?

> [!ANSWER]
> ① 행사가 없으니 건너뜀 → B는 같은 기수 구성원이라 계속 → ② 회장단·생성자·담당자·관리자가 아님 → ③ DEFAULT지만 B의 부서(홍보국)가 업무 부서(재무국)와 다름 → ④ ACL에 해당 없음 → **false**. 그래서 RLS가 그 행을 돌려주지 않고, 화면에서는 "찾을 수 없음"이 됩니다.

> [!QUIZ]
> `tasks`에 "로그인 사용자는 UPDATE 가능"이라는 정책 하나만 두면 어떤 일이 생기나요?

> [!ANSWER]
> 볼 수 있는 업무라면 어떤 열이든 바꿀 수 있게 됩니다. 국원이 자기 담당 업무의 `visibility_mode`를 바꾸거나, `assignee_id`를 다른 사람으로, `term_id`를 다른 기수로 바꾸는 것도 막지 못합니다. 그래서 직접 UPDATE 권한을 빼고, 역할별로 바꿀 수 있는 열을 검사하는 함수로만 쓰게 합니다.

## 학습 경로

[← 04-3 마이그레이션과 제약조건](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-03) · [04-5 DB 테스트와 성능 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-05)
