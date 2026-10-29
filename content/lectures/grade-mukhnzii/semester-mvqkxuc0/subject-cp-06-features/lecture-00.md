---
title: "08 · 디버깅: 콘솔·Network·오류·테스트"
description: "실제 로그인·권한 오류 사례를 읽으며 브라우저·서버·DB·배포 중 실패 위치를 좁히고, 수정 전후 증거를 Issue와 PR에 남기는 법을 익힙니다."
order: 0
published: true
duration: 55
tags: [debugging, console, network, testing, lint, typecheck, Supabase]
objectives:
  - 기대 결과와 실제 결과를 분리해 최소 재현 조건을 쓴다.
  - Console·서버 터미널·Network·DB test의 증거를 구별한다.
  - lint·typecheck·test·build·pgTAP이 찾는 실패를 구분한다.
  - 사례의 증거에서 원인 가설과 최소 수정 범위를 판단한다.
---

## 1. 이 강의가 필요한 순간

“버튼을 눌러도 안 된다”, “Preview에서만 실패한다”, “RLS가 막는 것 같다”처럼 증상과 원인이 섞여 보일 때 읽습니다. 디버깅의 목적은 빨리 아무 코드나 바꾸는 것이 아니라, 실패가 시작된 경계를 찾고 같은 조건에서 수정 전후를 비교하는 것입니다.

이 강의는 다음 실제 자료를 기준으로 합니다.

- [플랫폼 검사 명령](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/package.json)
- [로그인 오류 매핑](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/login/login-error.tsx)
- [OAuth callback](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/auth/callback/route.ts)
- [인증·권한 DB test](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/tests/auth_membership_test.sql)
- [조직 구조 DB test](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/supabase/tests/org_structure_test.sql)

> [!CONCEPT]
> **좋은 오류 기록 = 기대 결과 + 실제 결과 + 최소 재현 조건 + 관찰한 계층 + 민감 값을 가린 증거.** “안 돼요”에는 원인을 좁힐 정보가 없다.

## 2. 증상보다 먼저 경계를 찾기

화면, Client Component, Server Component·Action, Supabase, Preview 설정은 서로 다른 실행 환경입니다. 한 번에 모두 바꾸면 무엇이 원인이었는지 증명할 수 없습니다.

| 관찰한 현상 | 먼저 볼 증거 | 구분 기준 |
| --- | --- | --- |
| 클릭해도 변화가 없음 | 브라우저 Console·이벤트 상태 | 요청이 생성됐는가 |
| 요청 뒤 4xx·5xx | Network | method·URL·status·redirect가 무엇인가 |
| Server Component 렌더링 실패 | 개발 서버 터미널 | 어느 route와 server stack에서 실패했는가 |
| 데이터가 0건 | 응답의 `data`와 `error` | 정상 empty인가, RLS 범위 밖인가 |
| DB가 요청을 거부 | Supabase error code·pgTAP | `42501`, constraint code 등 계약된 거부인가 |
| local은 되고 Preview만 실패 | 배포 로그·환경 차이 목록 | 코드가 아니라 연결·설정 차이인가 |

브라우저 Console은 Client Component와 이벤트 오류를, 서버 터미널은 Server Component·Action·Route Handler의 오류를 봅니다. Network에서는 요청 순서, status, redirect location을 읽습니다. Authorization header, cookie, 실제 이메일, 제보 내용은 캡처와 AI 프롬프트에서 가립니다.

`data: []`와 `error`는 같은 상태가 아닙니다. 0건은 검색 결과 없음이나 미승인 사용자의 정상 결과일 수 있고, `42501`은 권한 거부입니다. UI도 loading·empty·error·unauthorized를 섞지 않아야 합니다.

## 3. 사례 A — 버튼을 눌렀는데 요청이 없다

Google 로그인 버튼은 `pending`, `failed` 상태를 가지며 `signInWithOAuth`를 호출합니다. 이때 Network에 OAuth 요청이 없다면 Supabase나 RLS부터 고칠 이유가 없습니다.

```tsx
const [pending, setPending] = useState(false);

async function handleLogin() {
  setPending(true);
  setFailed(false);
  const { error } = await supabase.auth.signInWithOAuth(/* ... */);
  if (error) {
    setPending(false);
    setFailed(true);
  }
}
```

판단할 증거는 세 가지입니다.

- 클릭 이벤트가 실제로 실행됐는가
- `pending` 때문에 버튼이 이미 비활성화된 것은 아닌가
- 요청 전 JavaScript 오류가 Console에 남았는가

요청이 생성된 뒤라면 다음 경계로 이동합니다. 요청 자체가 없는데 callback, migration, RLS를 바꾸는 것은 증거와 무관한 수정입니다.

## 4. 사례 B — OAuth 뒤 `access_denied`가 보인다

실제 로그인 화면은 query의 오류 code를 사용자용 문장으로 바꿉니다. callback도 원본 세부 정보를 화면에 그대로 내보내지 않고 정해진 code로 이동시킵니다.

```ts
const MESSAGES = {
  access_denied: "학교 Google 계정으로만 로그인할 수 있습니다. 다른 계정을 선택해 주세요.",
  exchange_failed: "로그인 처리 중 문제가 생겼습니다. 다시 시도해 주세요.",
  missing_code: "로그인 정보가 올바르지 않습니다. 다시 시도해 주세요.",
};
```

이 사례의 증거 사슬은 다음처럼 읽습니다.

```text
Google redirect
  → /auth/callback의 query와 status
  → session 교환 성공 여부
  → activate_membership 오류 code
  → /login?error=... 이동
  → LoginError의 안전한 안내
```

`access_denied`라면 학교 외 계정 거부라는 정상 보안 결과일 수 있습니다. `exchange_failed`라면 redirect URL, provider 설정, code 교환, 환경변수 차이를 살펴야 합니다. `missing_code`는 callback에 필요한 query가 없다는 뜻입니다. 이 경우들을 “로그인이 안 됨” 하나로 묶으면 정상 거부와 시스템 장애를 구분할 수 없습니다.

## 5. 사례 C — DB가 `42501`을 반환한다

구성원이 자신의 Role을 직접 `EXECUTIVE`로 올리거나 Membership을 직접 추가하려 할 때 `42501`은 고쳐야 할 버그가 아니라 기대한 거부입니다. 실제 pgTAP은 이 계약을 `throws_ok`로 고정합니다.

```sql
select throws_ok(
  $$ insert into public.memberships (user_id, term_id, role)
     values ('aaaaaaaa-0000-0000-0000-00000000000a',
             '00000000-0000-0000-0000-000000000001',
             'EXECUTIVE') $$,
  '42501',
  null,
  'A는 memberships에 직접 INSERT할 수 없다'
);
```

오류를 없애려고 RLS를 끄거나 service role을 브라우저에 넣으면 테스트의 목적을 뒤집게 됩니다. 먼저 이 요청이 허용 사례인지 거부 사례인지 확인하고, 허용되어야 하는 쓰기라면 준비된 RPC와 올바른 사용자 JWT를 사용했는지 봅니다. 정책 변경은 Issue와 리드 합의가 있는 DB 작업일 때만 검토합니다.

constraint 오류도 같은 방식으로 읽습니다. 예를 들어 두 번째 ACTIVE 기수를 만드는 요청의 `23505`는 데이터 무결성을 지킨 결과입니다. error code를 보기 전에 “실패했다”는 문장만 읽으면 정상 방어를 장애로 오해합니다.

## 6. 사례 D — local은 성공하고 Preview만 실패한다

같은 commit이 local에서는 성공하고 Preview에서만 실패하면 코드 외의 차이를 표로 분리합니다.

| 비교 항목 | 확인할 내용 | 담당 경계 |
| --- | --- | --- |
| 환경변수 | 이름·등록 환경·빈 값 여부 | 배포 설정, 실제 값은 공유 금지 |
| 연결 DB | local/Preview가 어느 project를 보는가 | 리드 확인 |
| migration | Preview DB에 필요한 schema가 적용됐는가 | DB 배포 상태 |
| OAuth redirect | Preview URL이 provider에 등록됐는가 | Auth dashboard |
| provider 설정 | Google provider·hook 설정이 같은가 | Auth dashboard |

팀원이 대시보드를 추측으로 바꾸지 않습니다. 코드에서 확인된 사실, Preview 로그, 확인이 필요한 설정을 분리해 리드에게 전달합니다. “환경변수 문제 같다” 대신 “Preview의 callback에서 `exchange_failed`, local은 동일 commit에서 성공, 변수 이름은 존재 여부만 확인 필요”처럼 증거를 씁니다.

## 7. 검사 명령이 찾는 실패

플랫폼 `package.json`의 현재 계약은 다음과 같습니다. 강의 사이트의 명령과 섞지 않습니다.

```text
npm run lint          # ESLint 규칙과 위험한 코드 패턴
npm run typecheck     # next typegen 뒤 TypeScript 계약
npm test              # Vitest 단위·통합 테스트
npm run build         # 배포용 route·server/client 경계와 번들
npx supabase test db  # migration·RLS·grant의 pgTAP 계약
```

| 검사 | 잘 찾는 문제 | 통과해도 보장하지 않는 것 |
| --- | --- | --- |
| lint | 규칙 위반, 일부 접근성·위험 패턴 | 실제 사용자 흐름 |
| typecheck | props·DB type·함수 계약 불일치 | 런타임 환경과 RLS |
| test | 코드로 고정한 동작의 회귀 | 테스트하지 않은 화면 |
| build | 배포 번들, route 경계, 정적 생성 문제 | Preview 외부 설정 |
| DB test | schema·constraint·RLS의 허용·거부 | 브라우저 UX |

검사를 생략했다면 “통과”처럼 쓰지 않고, 실행하지 못한 이유와 남은 위험을 PR에 적습니다. 실패한 테스트를 삭제하거나 assertion을 약하게 바꾸는 것은 수정이 아닙니다.

## 8. 30분 차단 보고와 PR 설명

30분 이상 같은 문제에 막히면 혼자 추측을 늘리지 않고 Issue 댓글에 다음을 남기고 `blocked`를 공유합니다.

```text
하려던 것:
기대 결과 / 실제 결과:
최소 재현 조건:
확인한 Console·Network·server·DB 증거:
시도한 가설과 결과:
필요한 결정·기반 작업·리뷰:
마감 영향:
```

좋은 PR 설명은 원인과 수정의 연결을 보여 줍니다.

| 항목 | 설명 예시 |
| --- | --- |
| 원인 | callback 오류 code가 UI 매핑에 없어 일반 문구만 표시됨 |
| 최소 수정 | 알려진 code의 안전한 안내 문구만 추가 |
| 재검증 | 동일 query, 키보드, 375px에서 alert 확인 |
| 자동 검사 | lint·typecheck·관련 test 결과 |
| 남은 위험 | Preview provider 설정은 리드 확인 필요 |

AI에게는 “수정 전 원인 가설, 각 가설을 구분할 증거, 최소 확인 명령을 먼저 제시하고 key·cookie·이메일을 가려라”라고 요청합니다. 구현을 맡길 때는 “확인된 가설을 검증하는 최소 변경만 하고 RLS 우회, 테스트 삭제, service role 사용, 운영 DB 초기화는 금지한다”를 포함합니다.

공식 참고: [Next.js debugging](https://nextjs.org/docs/app/guides/debugging), [Supabase local development](https://supabase.com/docs/guides/local-development), [Supabase database testing](https://supabase.com/docs/guides/database/testing).
