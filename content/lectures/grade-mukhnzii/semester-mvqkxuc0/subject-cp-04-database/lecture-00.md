---
title: "06 · Supabase: 테이블·조회·저장·RPC"
description: "실제 migration·생성 타입·/me 조회·activate_membership RPC·pgTAP을 읽으며 데이터의 모양과 허용·거부를 판단합니다."
order: 0
published: true
duration: 60
tags: [Supabase, PostgreSQL, RLS, RPC, migration, seed, pgTAP, types]
objectives:
  - terms·departments·positions·memberships 관계를 키로 설명한다.
  - 생성된 Database 타입과 필요한 열만 선택하는 조회를 읽는다.
  - 직접 쓰기와 준비된 RPC를 사용하는 쓰기를 구분한다.
  - migration·seed·local/dev/prod·pgTAP의 역할을 설명한다.
---

## 1. 이 강의가 필요한 순간

“왜 조회 결과가 비어 있지?”, “어느 table에 insert해야 하지?”, “RPC가 왜 필요한가?”, “migration과 seed 중 무엇을 바꿔야 하지?”를 판단할 때 봅니다. [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01) 다음에 읽고, 누가 볼 수 있는지가 핵심이면 [인증·권한](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-00)으로 이어갑니다.

실제 근거는 [`org_structure migration`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/migrations/20261028055822_org_structure.sql), [`membership/auth migration`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/migrations/20261028075831_membership_auth.sql), [`activation migration`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/migrations/20261028080019_auth_hooks_activation.sql), [`database.types.ts`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/lib/supabase/database.types.ts)입니다.

> [!CONCEPT]
> **목표:** 화면 값이 어느 행·열에서 왔는지 찾고, 조회 성공 0건과 실패를 구별하며, 준비된 RPC의 성공·거부 조건을 타입과 테스트에서 확인한다.

## 2. 테이블·행·열·키를 실제 구조로 읽는다

테이블은 같은 모양의 행 집합이고, 열은 각 행의 속성입니다. 기본키는 한 행을 고유하게 찾고, 외래키는 다른 테이블의 행을 가리킵니다.

```text
terms (기수)
 ├─ departments (부서)  ─┐
 ├─ positions (표시 직책) ├─ memberships (사용자·기수 소속)
 └─ approved_council_accounts ── 첫 로그인 ──┘

auth.users ── 1:1 ── profiles
```

`departments.term_id`와 `positions.term_id`는 어느 기수에 속하는지를 나타냅니다. `memberships`는 사용자·기수·Role과 선택적인 부서·직책을 연결합니다. **position 이름은 화면 표시용이고 보안 권한에는 쓰지 않습니다.** 실제 권한 Role은 `MEMBER`, `DIRECTOR`, `EXECUTIVE`입니다. 일반 학생은 `STUDENT` Role 행으로 저장하지 않고 active Membership이 없는 로그인 사용자로 표현합니다.

| 제약 | 막는 잘못된 상태 | 예 |
| --- | --- | --- |
| 기본키 | 같은 행 ID 중복 | `terms.id` |
| 외래키 | 존재하지 않는 기수 참조 | `departments.term_id → terms.id` |
| `NOT NULL` | 필수 값 누락 | 기수 이름 |
| `UNIQUE` | 같은 기수에서 이름 중복 | `term_id + position.name` |
| 부분 unique index | ACTIVE 기수 여러 개 | ACTIVE는 항상 최대 1개 |

## 3. 화면 값과 생성 타입 연결

`npm run db:types`는 local DB 구조를 읽어 `src/lib/supabase/database.types.ts`를 생성합니다. 이 파일은 직접 고치지 않습니다. DB가 바뀌었는데 타입만 손으로 맞추면 실제 DB와 코드가 서로 다른 계약을 갖게 됩니다.

```ts
// 실제 생성 타입에서 꺼내 쓰는 모양
type MembershipRow = Database["public"]["Tables"]["memberships"]["Row"];
type MembershipInsert = Database["public"]["Tables"]["memberships"]["Insert"];
type MemberRole = Database["public"]["Enums"]["member_role"];
type ActivateResult = Database["public"]["Functions"]["activate_membership"]["Returns"];
```

`Row`는 조회 결과 한 행, `Insert`는 insert 가능한 입력 모양, `Update`는 변경 가능한 입력 모양입니다. 타입은 개발 중 실수를 찾지만 RLS를 대신하지 않습니다. 브라우저에서 값을 조작하면 TypeScript 검사는 이미 사라진 뒤이므로 서버와 DB 검증이 필요합니다.

## 4. 실제 `/me` 조회 읽기

플랫폼의 [`src/app/me/page.tsx`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/me/page.tsx)는 Server Component에서 서버용 client를 만들고 profile과 membership을 병렬 조회합니다.

```tsx
const [profileResult, membershipResult] = await Promise.all([
  supabase
    .from("profiles")
    .select("email, display_name")
    .eq("id", userId)
    .single(),
  supabase
    .from("memberships")
    .select(
      "id, role, term:terms(name), department:departments(name), position:positions(name)",
    )
    .eq("user_id", userId)
    .eq("is_active", true),
]);
```

`select`는 화면에 필요한 열만 요청합니다. `term:terms(name)`은 외래키 관계의 이름을 `term` 속성으로 받습니다. `eq`는 조건, `single()`은 반드시 한 행이어야 한다는 기대입니다.

| 결과 | 의미 | 화면 처리 |
| --- | --- | --- |
| `error === null`, 배열에 행 있음 | 조회 성공 | 목록/소속 표시 |
| `error === null`, `[]` | 조회 성공, 조건에 맞는 행 없음 | 일반 학생·빈 상태 안내 |
| `error` 존재 | 쿼리·연결·RLS 등 실패 | Alert. 빈 목록으로 바꾸지 않음 |
| `single()`인데 0개 또는 여러 개 | 데이터 기대 불일치 | error를 조사 |

`select("*")`는 편하지만 필요하지 않은 개인정보와 변경 영향을 넓힙니다. 화면이 요구하는 열을 먼저 적고 그 열만 선택합니다.

## 5. 저장은 왜 RPC를 통하는가

팀원 화면의 쓰기 규칙은 `Server Action → requireUser/requireMember → supabase.rpc() → refresh()`입니다. browser에서 table에 직접 insert/update/delete하지 않습니다. 여러 table 변경, 상태 전이, activity log가 하나의 업무라면 DB 함수 안의 한 transaction으로 처리해야 중간 상태가 남지 않습니다.

현재 실제 RPC인 `activate_membership()`은 로그인 사용자의 검증된 이메일을 승인 명단과 대조해 Membership을 만듭니다. 승인되지 않은 학교 계정은 오류가 아니라 빈 결과로 일반 학생 상태를 유지하고, 반복 호출해도 active Membership이 중복되지 않도록 설계했습니다.

```tsx
// 실제 callback의 핵심
const { error: activateError } = await supabase.rpc("activate_membership");
if (activateError) {
  console.error("activate_membership failed", { code: activateError.code });
}
```

RPC 안에서는 `auth.uid()`가 없으면 `42501`, 학교 Google 계정이 아니어도 `42501`을 냅니다. 함수 실행 권한은 `authenticated`에만 주고 `public`, `anon`에서는 회수합니다. 화면은 DB의 기술 메시지를 그대로 보여 주지 않고 사용자가 할 수 있는 다음 행동으로 번역합니다.

## 6. Migration·seed·환경의 차이

| 구분 | 내용 | 안전 규칙 |
| --- | --- | --- |
| Migration | table·constraint·RLS·function 변경 이력 | 리드 기반 작업, 순서대로 적용 |
| `seed.sql` | local 개발용 가짜 데이터 | 실제 학생 정보 금지 |
| local | 개인 PC의 Docker DB | `db reset --local` 허용 |
| dev | PR Preview가 연결되는 공유 DB | reset 금지, migration 적용 여부 확인 |
| prod | 운영 서비스 DB | reset 금지, 배포와 migration을 따로 확인 |

Vercel 배포가 성공해도 Supabase migration이 자동으로 적용됐다고 단정하지 않습니다. Preview 실패가 코드인지 dev DB의 migration 누락인지 분리합니다. `npx supabase db reset --local`은 local을 지우고 migration과 seed를 다시 적용하며, 공유 dev/prod에서는 실행하면 안 됩니다.

## 7. pgTAP에서 성공과 거부를 읽는다

실제 [`auth_membership_test.sql`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/tests/auth_membership_test.sql)은 모든 가짜 데이터를 transaction 안에 만들고 끝에 rollback합니다.

```sql
begin;
select plan(18);

-- 허용: 승인된 가짜 계정은 MEMBER로 활성화된다.
select results_eq(
  $$ select term_id, role from public.activate_membership() $$,
  $$ values ('00000000-0000-0000-0000-000000000001'::uuid,
             'MEMBER'::public.member_role) $$,
  '승인된 계정은 첫 로그인 때 MEMBER로 활성화된다'
);

-- 거부: 사용자는 자기 Role을 올릴 수 없다.
select throws_ok(
  $$ update public.memberships set role = 'EXECUTIVE'
     where user_id = 'aaaaaaaa-0000-0000-0000-00000000000a' $$,
  '42501',
  null,
  '사용자는 자기 Membership의 role을 EXECUTIVE로 바꿀 수 없다'
);

select * from finish();
rollback;
```

`results_eq`는 성공 결과의 값까지, `throws_ok`는 실패해야 하는 요청의 SQLSTATE까지 확인합니다. `42501`은 권한 부족, `23505`는 unique 위반입니다. 메시지만 비교하면 번역이나 문구 변경에 취약하므로 오류 code와 보안 결과를 함께 봅니다.

팀원의 초기 DB Issue는 허용된 새 테스트 파일만 추가합니다. Migration·RLS·seed·기존 테스트를 고쳐 실패를 없애는 것은 범위 밖입니다.

## 8. 흔한 실수와 해결

| 잘못된 접근 | 문제 | 올바른 접근 |
| --- | --- | --- |
| browser에서 직접 쓰기 | 권한·transaction 경로를 우회 | 준비된 Action과 RPC |
| `select("*")` 남용 | 과다 노출과 결합 증가 | 필요한 열만 선택 |
| `error`를 `[]`로 바꿈 | 장애를 빈 상태로 위장 | 성공 0건과 실패 분리 |
| 타입 파일 직접 수정 | DB와 TypeScript 계약 불일치 | migration 뒤 `npm run db:types` |
| 공유 DB reset | 팀 데이터 파괴 | local에서만 `--local` |
| 허용 테스트만 작성 | 보안 회귀를 놓침 | 허용·거부 사례를 짝으로 작성 |

## 9. AI 요청과 PR 설명

계획: “Issue의 화면 값이 어떤 table·열·관계에서 오는지 migration과 생성 타입에서 찾아라. 허용 파일 밖의 migration·RLS·seed·database.types는 수정하지 마라. 성공·0건·오류·권한 거부를 구분하고 실제 RPC 시그니처를 인용해라.”

구현: “Server Component는 필요한 열만 조회하고, 쓰기는 실제 준비된 RPC만 호출해라. browser 직접 쓰기, service_role, 실제 개인정보, 공유 DB reset은 금지한다. 없는 table·RPC는 만들지 말고 리드 질문으로 남겨라.”

리뷰: “타입과 DB 구조 불일치, 과도한 select, error 누락, local/dev/prod 혼동, 허용·거부 DB 테스트 누락을 검사해라.”

PR에는 화면 → select/RPC → RLS/constraint → 결과 UI의 연결, 사용한 가짜 데이터, `npx supabase test db` 결과 또는 미실행 이유를 적습니다.

공식 참고: [Supabase select](https://supabase.com/docs/reference/javascript/select), [Database functions](https://supabase.com/docs/guides/database/functions), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Local development](https://supabase.com/docs/guides/local-development).
