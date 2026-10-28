---
title: "04-5 · DB 테스트와 성능"
description: "RLS와 권한 함수를 사람이 눈으로 확인하지 않고 pgTAP 테스트로 자동 검증하는 법을 '허용·거부' 사례 짝으로 익히고, 기획서가 요구하는 필수 사례(다른 기수·종료된 Membership·RESTRICTED 밖·회수 직후)를 테스트로 옮깁니다. RLS가 느려지지 않게 Index와 EXPLAIN을 쓰는 법도 다룹니다."
order: 5
published: true
duration: 45
tags: [DB 테스트, pgTAP, RLS 테스트, Index, EXPLAIN, 성능]
objectives:
  - 테스트 안에서 특정 사용자로 로그인한 것처럼 바꾸는 방법을 읽는다.
  - 허용 사례와 거부 사례를 짝으로 쓰는 이유를 말한다.
  - 기획서가 요구하는 필수 거부 사례 네 가지를 테스트로 옮긴다.
  - RLS 성능을 위해 Index를 둘 열을 말한다.
---

## 1. 왜 DB 테스트인가

RLS 정책은 **틀려도 오류가 나지 않습니다.** 정책이 너무 넓으면 조용히 더 많은 행이 보이고, 너무 좁으면 조용히 빈 목록이 나옵니다. 화면에서 직접 확인하는 것은 한두 사례뿐이고, 정책을 고칠 때마다 다시 확인하기 어렵습니다.

그래서 기획서 10.4절과 완료 기준 38번은 ==허용·거부 RLS 사례가 DB 테스트로 자동 실행==되도록 요구합니다. 테스트는 PR마다 GitHub Actions에서 돌아갑니다(07-2편).

## 2. pgTAP 기본

**pgTAP**은 PostgreSQL 안에서 SQL로 테스트를 쓰는 도구입니다. Supabase CLI의 `supabase test db`가 `supabase/tests/` 폴더의 파일을 실행합니다.

```sql
-- supabase/tests/tasks_rls.test.sql
begin;
select plan(6);                                   -- 이 파일의 검사 개수

-- 준비: 가짜 기수·부서·사용자·업무 (테스트가 끝나면 rollback으로 사라짐)
insert into auth.users (id, email) values
  ('11111111-0000-0000-0000-000000000001', 'exec@hanyang.ac.kr'),
  ('11111111-0000-0000-0000-000000000002', 'finance-member@hanyang.ac.kr'),
  ('11111111-0000-0000-0000-000000000003', 'pr-member@hanyang.ac.kr');
-- … terms, departments, memberships, tasks(재무국 DEFAULT 1건, 재무국 RESTRICTED 1건) …

-- 사용자 바꾸기 도우미
create function pg_temp.login_as(p_uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  select set_config('role', 'authenticated', true);
$$;
```

| 줄 | 읽는 법 |
| --- | --- |
| `begin; … rollback;` | 테스트 전체를 트랜잭션으로 감싸 끝나면 모두 되돌림 |
| `select plan(6)` | 검사 6개를 할 예정 |
| `set_config('request.jwt.claims', …)` | `auth.uid()`가 이 ID를 돌려주게 함 (로그인 흉내) |
| `set_config('role', 'authenticated', true)` | 관리자가 아니라 **로그인 사용자 권한**으로 바꿈 → RLS 적용. `reset role`로 관리자로 돌아옴 |

## 3. 허용과 거부를 짝으로

```sql
-- 재무국원: 자기 국 DEFAULT 업무는 보인다 (허용)
select pg_temp.login_as('11111111-0000-0000-0000-000000000002');
select is(
  (select count(*) from public.tasks where title = '축제 예산 정리')::int, 1,
  '재무국원은 재무국 DEFAULT 업무를 본다');

-- 재무국원: 자기 국이라도 RESTRICTED 업무는 안 보인다 (거부)
select is(
  (select count(*) from public.tasks where title = '협찬 계약 검토')::int, 0,
  '재무국원은 지정되지 않은 RESTRICTED 업무를 못 본다');

-- 홍보국원: 다른 국 DEFAULT 업무는 안 보인다 (거부)
reset role;
select pg_temp.login_as('11111111-0000-0000-0000-000000000003');
select is(
  (select count(*) from public.tasks where title = '축제 예산 정리')::int, 0,
  '홍보국원은 재무국 업무를 못 본다');

-- 홍보국원: 직접 UPDATE는 권한 자체가 없다 (거부)
select throws_ok(
  $$ update public.tasks set status = 'DONE' where title = '축제 예산 정리' $$,
  '42501', null,
  '사용자는 tasks를 직접 수정할 수 없다');

-- 회장단: 모두 보인다 (허용)
reset role;
select pg_temp.login_as('11111111-0000-0000-0000-000000000001');
select is((select count(*) from public.tasks)::int, 2, '회장단은 같은 기수 업무를 모두 본다');

-- 요청자 본인 승인은 테이블 CHECK가 거부 (관리자 권한으로도)
reset role;
select throws_ok(
  $$ update public.term_handover_requests set decided_by = requested_by, status = 'APPROVED' $$,
  '23514', null, '요청자 본인은 권한 이양을 승인할 수 없다');

select * from finish();
rollback;
```

| 검사 함수 | 뜻 |
| --- | --- |
| `is(실제, 기대, 설명)` | 두 값이 같은가 |
| `throws_ok(SQL, 오류코드, 메시지, 설명)` | 그 SQL이 오류를 내는가 (`42501` = 권한 없음) |
| `lives_ok(SQL, 설명)` | 오류 없이 실행되는가 |
| `results_eq(SQL, SQL, 설명)` | 두 쿼리 결과가 같은가 |

> [!EXAM]
> **왜 짝으로?** 거부 테스트만 있으면 "모두 거부하는" 잘못된 정책도 통과합니다. 허용 테스트만 있으면 "모두 허용하는" 정책도 통과합니다. 같은 사용자·같은 자료에 대해 **보여야 할 것은 보이고, 안 보여야 할 것은 안 보이는지**를 함께 확인해야 정책이 맞다고 할 수 있습니다.

## 4. 기획서가 요구하는 필수 사례

기획서 10.4절: 사례에는 **다른 Term 사용자, 종료된 Membership, RESTRICTED Event 밖 사용자, 회수 직후 사용자**를 포함한다.

| 사례 | 준비 | 기대 |
| --- | --- | --- |
| 다른 Term 사용자 | 2026 CLOSED 기수의 회장단이었고 2027엔 Membership 없음 | 2027 업무 0건, 2026 업무도 Grant 없으면 0건 |
| 종료된 Membership | `is_active = false, left_at = now()` | 업무·회의록 0건, 쓰기 함수 거부 |
| RESTRICTED Event 밖 | Event ACL에 없는 다른 국 국원 | 그 Event의 업무·자료·회의록 0건, 담당자로 지정하는 함수 거부 |
| 회수 직후 | Task ACL에서 방금 삭제된 사용자 | 바로 다음 쿼리에서 0건 |
| (추가) 건의 담당자 | 건의가 배정된 국장 | `suggestions` 1건, `suggestion_authors` 0건 |
| (추가) 권한 이양 | 요청자 = 승인자 | 거부 |
| (추가) 안건 | 국원이 안건 생성 함수 호출 | 거부 |

> [!NOTE]
> 테스트에 쓰는 이메일·이름은 모두 가짜입니다. 공개 저장소에 올라가므로 실제 구성원 정보로 테스트 데이터를 만들지 않습니다.

## 5. 성능 — RLS가 느려지지 않게

RLS 조건은 **모든 행 접근마다** 실행됩니다. 업무 1,000건 목록이면 권한 함수가 1,000번 불릴 수 있습니다. 기획서 10.4절의 규칙을 다시 정리합니다.

| 규칙 | 이유 |
| --- | --- |
| `auth.uid()`를 `(select auth.uid())`로 감싼다 | 행마다가 아니라 한 번만 계산 |
| 권한 함수는 `stable` | 같은 요청 안에서 결과 재사용 가능 |
| 목록은 페이지네이션 (`.range(0, 49)`) | 한 번에 확인할 행 수를 제한 |
| 조회 조건을 쿼리에도 명시 (`.eq("term_id", …)`) | DB가 Index로 범위를 먼저 좁힌 뒤 권한을 검사 |
| 아래 열에 Index | RLS 함수가 자주 찾는 값 |

```sql
create index on public.memberships (term_id, user_id) where is_active;
create index on public.task_access_rules (task_id, subject_type);
create index on public.event_access_rules (event_id, subject_type);
create index on public.meeting_editors (meeting_id, user_id);
create unique index on public.meeting_crdt_updates (meeting_id, sequence_no);
create index on public.tasks (term_id, department_id) where archived_at is null;
```

### EXPLAIN으로 확인하기

```sql
explain analyze
select id, title from public.tasks
where term_id = '…' and archived_at is null
order by due_date limit 50;
```

결과에 `Seq Scan on tasks`(테이블 전체 훑기)가 보이고 시간이 길면 Index가 필요하다는 신호입니다. `Index Scan using tasks_term_dept`처럼 Index를 쓰면 좋습니다. 실행 시간은 결과 마지막 줄 `Execution Time`에서 봅니다.

> [!QUIZ]
> "회수 직후 사용자" 테스트를 SQL 순서로 써 보세요. (Task ACL에 `USER`로 있던 사용자 C를 지운 뒤)

> [!ANSWER]
> ① 회장단으로 로그인해 C를 `task_access_rules`에 넣는 함수 실행 → ② C로 로그인해 그 업무가 **1건** 보이는지 `is(...)` → ③ 회장단으로 돌아가 C의 ACL 행을 지우는 함수 실행 → ④ 다시 C로 로그인해 **0건**인지 `is(...)`. ②가 허용, ④가 거부 짝입니다. DB 조회는 매 요청 최신 권한을 보므로 ④는 즉시 0건이어야 합니다(Realtime 수신 지연은 05-3편에서 따로 테스트).

> [!QUIZ]
> 테스트 안에서 역할을 `authenticated`로 바꾸는 줄을 빼먹으면 어떻게 되나요?

> [!ANSWER]
> 테스트가 관리자(postgres) 권한으로 실행되어 RLS가 적용되지 않습니다. 그러면 모든 행이 보여 거부 테스트가 실패하거나, 반대로 허용 테스트만 보고 "정책이 맞다"고 착각할 수 있습니다. 로그인 흉내(`request.jwt.claims`)와 역할 전환을 반드시 함께 해야 합니다.

## 학습 경로

[← 04-4 RLS와 권한 함수](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-04) · [05-1 BlockNote 에디터 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-01)
