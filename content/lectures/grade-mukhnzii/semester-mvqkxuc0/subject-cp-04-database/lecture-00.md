---
title: "06 · Supabase: 테이블·조회·저장·RPC"
description: "실제 migration·seed·생성 타입을 기준으로 테이블 관계, Server Component 조회, Server Action의 RPC 저장과 로컬 DB 검증 범위를 익힙니다."
order: 0
published: true
duration: 55
tags: [Supabase, PostgreSQL, RLS, RPC, migration, seed, types]
objectives:
  - 행·열·키와 terms·memberships·positions 관계를 읽는다.
  - 서버용 client와 생성된 Database 타입으로 안전하게 조회한다.
  - 화면 → Action → RPC → RLS 흐름에서 팀원의 범위를 안다.
  - local·dev·prod와 migration·seed·DB 테스트를 구별한다.
---

## 1. 이 강의가 필요한 순간

“왜 내 조회가 빈 결과인가”, “어디에 insert해야 하나”, “테이블을 바꿔도 되는가”를 판단할 때 봅니다. [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01) 다음에 읽고, 권한이 의심되면 [인증·권한](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-00)으로 갑니다.

> [!CONCEPT]
> **목표:** 실제 migration·seed·타입을 읽어 조회 결과 0건과 실패를 구분하고, 팀원이 준비된 RPC를 호출하는 이유를 설명한다.

## 2. 테이블과 관계

테이블은 같은 모양의 행 모음, 열은 행의 속성, 기본키는 한 행의 고유 ID, 외래키는 다른 행을 가리키는 ID입니다. `20261028055822_org_structure.sql`에서 `terms`는 기수의 뿌리이고 `departments`, `positions`는 `term_id`로 기수에 속합니다. **positions는 표시용 직책이며 권한 판정에는 쓰지 않습니다.** 권한은 `memberships.role`의 `EXECUTIVE`·`DIRECTOR`·`MEMBER`가 맡습니다.

| 자료 | 쓰는 이유 | 팀원이 해도 되는가 |
| --- | --- | --- |
| `supabase/migrations/` | DB 구조·제약·RLS 변경 이력 | 리드 기반 작업 |
| `supabase/seed.sql` | 로컬 가짜 데이터 | 읽고 조회 검증 |
| `database.types.ts` | 현재 DB의 TypeScript 모양 | 직접 수정 금지 |
| `supabase/tests/` | 허용·거부 pgTAP 검증 | Issue가 허용한 새 테스트만 |

Migration은 구조 변경 기록, seed는 로컬의 가짜 시작 데이터, 실제 dev/prod 데이터는 별개입니다. 공유 DB를 초기화하거나 실제 학생 정보를 seed에 넣지 않습니다.

## 3. 실제 조회와 저장 흐름

Server Component는 `src/lib/supabase/server.ts`의 `createClient()`를 쓰고, `Database` 타입이 붙은 client로 필요한 열만 select합니다. 실제 `/me` 화면은 `profiles`에서 이메일·표시 이름을, `memberships`에서 role과 `terms`·부서·직책 관계를 select합니다.

```tsx
// 실제 /me 조회 패턴의 핵심
const supabase = await createClient();
const { data, error } = await supabase
  .from("memberships")
  .select("id, role, term:terms(name), department:departments(name), position:positions(name)")
  .eq("user_id", userId)
  .eq("is_active", true);
if (error) return <Alert>계정 정보를 불러오지 못했습니다.</Alert>;
```

결과 `data`가 빈 배열이면 성공했지만 조건에 맞는 행이 없는 것입니다. `error`가 있으면 실패이며 빈 목록으로 바꾸지 않습니다. 쓰기는 브라우저에서 table에 직접 insert/update/delete하지 않습니다. 실제 규칙은 같은 route `actions.ts`에서 `requireUser`/`requireMember` → `supabase.rpc("함수명", 인자)` → `refresh()` 순서입니다. RPC 이름과 인자·반환값은 리드가 준비한 기반 및 생성 타입에서 확인하고 추측하지 않습니다.

## 4. 따라 하기: 로컬 조회와 RPC 확인

1. Docker를 실행하고 `npx supabase start`, `npx supabase status`로 **local** DB만 준비합니다.
2. Studio 또는 허용된 화면에서 seed의 가짜 기수·직책을 조회하고, 0건과 오류를 각각 기록합니다.
3. Issue가 준비했다고 명시한 RPC만 가짜 입력으로 성공·실패 조건을 확인합니다. Migration·RLS·기존 테스트는 바꾸지 않습니다.
4. DB 변경 Issue라면 `npx supabase test db`와 `npm run db:types`의 책임자를 구분합니다. 팀원은 타입 파일을 손으로 고치지 않습니다.

Preview는 `council-dev`, 운영은 `council-prod`를 쓰며 migration 적용은 배포와 별개입니다. `db reset`은 `--local`에서만, 공유 dev/prod에서는 절대 실행하지 않습니다.

## 5. 직접 해보기와 흔한 실수

`/me`의 membership 결과를 가짜 seed 계정으로 읽고, 일반 학생이면 빈 소속 안내가 나오는지 확인해 보세요. 완료 기준은 필요한 열만 고르고, “결과 없음”과 “RLS/네트워크 오류”가 다르며, 실제 이메일·프로젝트 키를 출력하지 않는 것입니다.

| 잘못된 예 | 문제 | 올바른 접근 |
| --- | --- | --- |
| 클라이언트에서 직접 임의 insert | 권한·트랜잭션 규칙을 우회 | 준비된 Server Action과 RPC |
| `select("*")`를 습관처럼 사용 | 필요 이상 데이터·변경 영향 확대 | 화면에 필요한 열만 선택 |
| 공유 DB에서 reset | 팀 데이터와 환경을 파괴 | local에서만 가짜 seed로 검증 |

## 6. AI 요청과 완료 체크

계획: “`/me`와 해당 Issue의 준비된 DB 기반을 읽어 조회 결과를 점검한다. 허용 파일 외, `supabase/**`, migration, RLS, `database.types.ts`는 수정하지 마라. local seed만 쓰고 성공·0건·거부 결과를 구분해라.”

구현: “실제 생성 타입과 RPC 시그니처만 사용해라. 없는 테이블·RPC·열은 추가하지 말고 리드 확인 항목으로 남겨라.”

리뷰: “필요 열 선택, error 처리, browser 직접 쓰기, local/dev/prod 혼동, 키·실제 개인정보 노출을 검토해라.”

PR에는 조회한 가짜 데이터, RPC 성공·실패, 실행한 DB 검사를 남깁니다. 공식 참고: [Supabase JavaScript query](https://supabase.com/docs/reference/javascript/select), [Database functions](https://supabase.com/docs/guides/database/functions), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
