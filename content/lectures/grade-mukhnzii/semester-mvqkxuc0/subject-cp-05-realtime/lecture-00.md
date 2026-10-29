---
title: "07 · 인증·권한: 로그인·Role·RLS"
description: "실제 Google 로그인과 Membership 활성화 코드를 읽고, 화면·서버·DB가 권한을 나누어 검증하는 이유를 허용·거부 사례로 판단합니다."
order: 0
published: true
duration: 60
tags: [authentication, authorization, Google OAuth, Role, RLS, Supabase]
objectives:
  - 인증과 인가, 로그인 사용자와 학생회 구성원을 구분한다.
  - Google OAuth부터 activate_membership까지의 실제 흐름을 설명한다.
  - Role·직책·기수 범위를 혼동하지 않는다.
  - 허용·거부 사례가 화면·서버·DB 중 어디에서 통제되는지 판단한다.
---

## 1. 이 강의가 필요한 순간

로그인은 됐는데 대시보드에 들어갈 수 없거나, 버튼을 숨겼는데도 RLS가 필요한 이유가 궁금할 때 읽습니다. 데이터 구조가 낯설다면 [Supabase](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-00)를 먼저 읽고, 실패 증거를 정리해야 한다면 [디버깅](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-00)을 함께 봅니다.

이 강의는 다음 실제 코드를 기준으로 합니다.

- [Google 로그인 버튼](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/login/google-login-button.tsx)
- [OAuth callback](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/auth/callback/route.ts)
- [세션·Membership helper](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/lib/auth/session.ts)
- [Auth Hook·Membership 활성화 migration](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/migrations/20261028080019_auth_hooks_activation.sql)
- [Membership·RLS migration](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/migrations/20261028075831_membership_auth.sql)
- [인증·권한 pgTAP](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/tests/auth_membership_test.sql)

> [!CONCEPT]
> **핵심 질문:** “로그인했는가?”와 “이 자원에 접근해도 되는가?”는 서로 다른 질문이다. 전자는 인증, 후자는 인가다.

## 2. 실제 로그인 흐름을 한 줄씩 연결하기

플랫폼의 로그인은 단순히 Google 버튼을 누르고 끝나지 않습니다.

```text
GoogleLoginButton
  → Google OAuth
  → Auth Hook의 학교 계정 검사
  → auth.users 생성과 profiles 동기화
  → /auth/callback에서 code를 session으로 교환
  → activate_membership() 호출
  → 승인 명단과 일치하면 active Membership 반환
  → 안전한 next 경로로 이동
```

`GoogleLoginButton`이 전달하는 `hd: "hanyang.ac.kr"`는 계정 선택 화면의 **힌트**입니다. 보안 검증은 서버의 Auth Hook이 Google provider, 이메일 인증 여부, 학교 도메인과 `hd`를 다시 확인합니다. UI 값만 믿으면 요청을 직접 만든 사용자를 막을 수 없습니다.

callback은 query의 `code`를 세션으로 교환한 뒤 RPC를 호출합니다.

```ts
const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

if (!exchangeError) {
  const { error: membershipError } = await supabase.rpc("activate_membership");
  // 실제 코드는 민감한 값 대신 안전한 오류 code만 기록한다.
}
```

`activate_membership()`은 로그인 사용자의 검증된 이메일을 승인 명단과 비교합니다. 승인된 계정이면 현재 기수의 Membership을 활성화하고, 승인되지 않은 학교 계정이면 빈 결과를 반환합니다. 같은 사용자가 다시 로그인해도 중복 Membership을 만들지 않도록 설계되어 있습니다.

따라서 다음 두 상태는 모두 정상입니다.

| 사용자 상태 | 인증 | active Membership | 의미 |
| --- | --- | --- | --- |
| 승인된 학생회 구성원 | 성공 | 있음 | 구성원 화면 접근 후보 |
| 승인 명단에 없는 학교 계정 | 성공 | 없음 | 로그인한 일반 학생 |

로그인 성공을 곧바로 학생회 구성원 승인으로 해석하면 안 됩니다.

## 3. Role, 직책, 범위를 분리하기

실제 `member_role` enum은 세 값입니다.

```sql
create type public.member_role as enum (
  'MEMBER',
  'DIRECTOR',
  'EXECUTIVE'
);
```

일반 학생을 뜻하는 `STUDENT` Role은 없습니다. 현재 기수의 active Membership이 없다는 상태로 표현합니다. `positions`의 “회장”, “국장”, “부원” 같은 직책 이름은 화면 표시와 조직 설명에 쓰이며, 그 문자열 자체로 권한을 판정하지 않습니다.

| 질문 | 확인할 값 | 임의로 정하면 안 되는 것 |
| --- | --- | --- |
| 로그인했는가? | Auth user·session | 이메일 문자열만 보고 추정 |
| 학생회 구성원인가? | 현재 기수 active Membership | profile이 있다는 이유로 승인 |
| 넓은 운영 권한이 있는가? | `memberships.role` | 직책 이름으로 Role 추정 |
| 특정 부서 자료를 볼 수 있는가? | 확정된 scope 정책과 RLS | “국장이니 모두 가능” 같은 가정 |

기수 전환, 부서별 자원 범위, 권한 회수 시점은 기획서와 Issue에서 **확정된 규칙만** 사용합니다. 아직 결정되지 않은 정책은 AI에게 채우게 하지 않고 리드에게 질문으로 남깁니다.

## 4. 화면·서버·DB의 세 겹 방어

권한은 한 곳에서만 검사하지 않습니다.

| 계층 | 책임 | 실패 시 기대 동작 |
| --- | --- | --- |
| 화면 | 사용할 수 없는 동작을 숨기거나 비활성화 | 혼란과 실수 감소 |
| page·Server Action | `requireUser`·`requireMember`로 진입과 동작 검사 | login redirect 또는 not-found |
| DB | JWT의 `auth.uid()`와 RLS·grant로 행 접근 제한 | 빈 결과 또는 `42501` 거부 |

화면에서 버튼을 숨기는 것은 보안 경계가 아닙니다. URL을 직접 열거나 요청을 직접 보내면 우회할 수 있습니다. 반대로 서버 helper만 있어도 다른 코드 경로가 DB를 호출할 수 있으므로 RLS가 최종 경계를 맡아야 합니다.

실제 helper의 의도는 다음처럼 읽을 수 있습니다.

```tsx
const member = await requireMember("/dashboard", ["EXECUTIVE", "DIRECTOR"]);
// 여기까지 왔어도 뒤의 DB 조회·RPC는 RLS와 grant를 다시 통과해야 한다.
```

`requireUser(path)`는 미로그인 사용자를 `next`가 포함된 로그인 화면으로 보냅니다. `requireMember(path, roles?)`는 현재 기수의 active Membership과 허용 Role을 확인하고, 조건이 맞지 않으면 `notFound()`를 사용합니다. 권한 없는 화면의 존재 자체를 노출하지 않는 정책입니다.

프런트엔드에는 publishable key만 둘 수 있습니다. secret 또는 service-role key로 RLS를 우회하거나, 오류 화면·로그·AI 프롬프트에 key·cookie·실제 이메일을 넣는 것은 해결책이 아닙니다.

## 5. 허용·거부 사례를 판정하기

아래 표는 절차가 아니라, 구현과 리뷰 때 기대 결과를 비교하는 기준입니다.

| 사례 | 인증 결과 | Membership 결과 | 구성원 전용 URL | DB에서 확인할 결과 |
| --- | --- | --- | --- | --- |
| 승인된 학교 계정 | 성공 | 현재 기수 active | Role이 맞으면 허용 | 정책 범위 행만 조회 |
| 미승인 학교 계정 | 성공 | 없음 | not-found | 구성원 전용 행 접근 불가 |
| 학교 외 Google 계정 | Auth Hook에서 거부 | 생성 안 됨 | 로그인 불가 | 사용자 권한 요청 없음 |
| 익명 사용자의 `activate_membership` | 세션 없음 | 실행 안 됨 | 로그인 필요 | `42501` |
| 구성원의 직접 Role 상승 | 로그인됨 | 기존 Role 유지 | 기존 권한만 허용 | `42501` |
| Role 불일치 직접 URL | 로그인됨 | 있음 | not-found | RLS 범위 밖 접근 불가 |

pgTAP은 “정상 사용자는 된다”뿐 아니라 “공격에 가까운 직접 요청은 거부된다”도 계약으로 고정합니다.

```sql
select throws_ok(
  $$ update public.memberships
     set role = 'EXECUTIVE'
     where user_id = 'aaaaaaaa-0000-0000-0000-00000000000a' $$,
  '42501',
  null,
  'A는 자기 Membership의 role을 EXECUTIVE로 바꿀 수 없다'
);
```

승인 계정 활성화는 `results_eq`, 미승인 계정의 빈 결과는 `is_empty`, 익명 RPC와 직접 Membership 추가는 `throws_ok(..., '42501', ...)`로 읽습니다. 거부 테스트가 실패했다면 기능이 편리해진 것이 아니라 보안 경계가 깨진 것입니다.

## 6. 코드 리뷰에서 확인할 것

| 아쉬운 구현 | 위험 | 판단 기준 |
| --- | --- | --- |
| 버튼만 숨김 | 직접 URL·요청 우회 | page·Action gate와 RLS가 함께 있는가 |
| 로그인 성공을 구성원 승인으로 취급 | 일반 학생에게 내부 화면 노출 | active Membership을 별도로 확인하는가 |
| 직책 이름으로 권한 판정 | 표시 문구 변경이 보안 변경이 됨 | enum Role과 확정 scope를 사용하는가 |
| `hd` 힌트만 신뢰 | 학교 외 계정 검증 우회 | 서버 Auth Hook이 재검증하는가 |
| service role로 오류 해결 | 실제 사용자 RLS 검증 사라짐 | 사용자 JWT로 허용·거부가 모두 확인되는가 |
| 거부 화면에 원본 오류 출력 | 구조·개인정보 노출 | 안전한 안내와 내부 로그가 분리되는가 |

AI에게 계획을 요청할 때는 “`session.ts`, callback, Auth Hook, Membership RLS의 실제 코드만 근거로 로그인·인가 흐름을 설명하고, 미확정 scope는 질문으로 남겨라”라고 범위를 줍니다. 구현 요청에는 “page와 Action에서 기존 helper를 쓰고 준비된 RPC만 호출하며, 공용 auth·migration·RLS 파일은 리드 범위로 유지하라”를 포함합니다.

PR에는 다음이 설명되어야 합니다.

- 어떤 계정 상태와 Role을 허용하는가
- 일반 학생·익명·Role 불일치 요청은 어디에서 거부되는가
- 화면, 서버, DB 중 변경된 계층은 어디인가
- 가짜 데이터로 확인한 허용·거부 결과는 무엇인가
- 대시보드 설정처럼 코드에서 확인하지 못한 항목은 무엇인가

공식 참고: [Supabase Auth](https://supabase.com/docs/guides/auth), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks).
