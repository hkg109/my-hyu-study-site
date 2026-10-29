---
title: "04 · Next.js: 경로·서버·로딩"
description: "학생회 플랫폼의 실제 App Router 구조를 읽고, 업무 목록 화면을 Server/Client Component·Suspense·화면 상태까지 연결합니다."
order: 0
published: true
duration: 55
tags: [Next.js, App Router, Server Component, Client Component, Suspense, Server Action]
objectives:
  - 실제 폴더와 page·layout 파일에서 URL과 실행 위치를 찾는다.
  - 조회는 서버에, 상호작용은 작은 Client Component에 둔다.
  - 로딩·빈 목록·오류·권한 없음 상태를 구별해 검증한다.
  - 쓰기 뒤 Server Action·RPC·refresh 흐름을 설명한다.
---

## 1. 이 강의가 필요한 순간

`/tasks` 같은 화면 Issue를 받았는데 어느 파일을 고를지, `useState`가 왜 안 되는지, 조회 실패를 빈 목록처럼 보여도 되는지 막힐 때 읽습니다. 선행은 [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01)와 [AI 협업](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-01)입니다.

플랫폼은 Next.js **16.4.3**·React **19.3.0**의 App Router를 사용합니다. 다음 파일·규칙은 제공된 플랫폼 저장소에서 확인했습니다. 이 강의 사이트 자체는 Next.js 16.3.4이므로, 코드를 이 사이트에 복사하는 예제가 아닙니다.

> [!CONCEPT]
> **목표:** URL에 맞는 화면을 고르고, 서버가 데이터를 읽어 작은 브라우저 부품에 넘기는 흐름과 네 가지 화면 상태를 PR에서 설명한다.

## 2. 폴더·URL·실행 위치

플랫폼에서 `src/app/me/page.tsx`는 `/me`, `src/app/(member)/dashboard/page.tsx`는 `/dashboard`입니다. 괄호의 `(member)`는 URL에는 들어가지 않는 route group입니다. `page.tsx`가 주소의 화면이고, `layout.tsx`는 하위 화면의 공통 틀입니다. 동적 경로라면 Next.js 16의 `params`는 Promise이므로 `await params` 뒤에 사용합니다.

| 단계 | 실제 위치 | 맡은 일 |
| --- | --- | --- |
| 로그인 사용자 확인 | `src/lib/auth/session.ts` | `requireUser(path)` 또는 `requireMember(path, roles)` |
| 첫 데이터 조회 | Server Component | `createClient()`로 RLS가 적용된 select |
| 버튼·입력 상호작용 | 같은 route의 Client Component | `useState`, 이벤트, 브라우저 API |
| 저장 | 같은 route의 `actions.ts` | 권한 확인 → `supabase.rpc()` → `refresh()` |

`src/app/me/page.tsx`는 `<Suspense>` 안의 `AccountDetails`에서 `requireUser("/me")`를 부르고 `Promise.all`로 profile·membership을 읽습니다. 쿠키를 읽는 helper를 Suspense 안에 둔 실제 패턴입니다.

```tsx
// 실제 패턴을 축약한 읽기 예시 — 새 API를 만들라는 뜻이 아닙니다.
async function AccountDetails() {
  const userId = await requireUser("/me");
  const supabase = await createClient();
  const [profile, membership] = await Promise.all([
    supabase.from("profiles").select("email, display_name").eq("id", userId).single(),
    supabase.from("memberships").select("id, role").eq("user_id", userId).eq("is_active", true),
  ]);
  if (profile.error || membership.error) return <Alert>계정 정보를 불러오지 못했습니다. 새로고침해 주세요.</Alert>;
  return <AccountView profile={profile.data} memberships={membership.data} />;
}
```

## 3. Server/Client 경계와 대기 상태

기본 Component는 서버에서 실행됩니다. 클릭·입력·`useState`·`window`가 필요한 파일만 맨 위에 `'use client'`를 둡니다. 그 파일의 import도 브라우저 묶음에 들어가므로 `@/lib/supabase/server`나 secret은 넣지 않습니다. 실제 `GoogleLoginButton`은 Client Component로 브라우저용 Supabase client와 `window.location.origin`만 씁니다.

`loading.tsx`는 경로 구간 전체의 대기 UI, 가까운 `<Suspense>`는 목록처럼 일부만 늦게 보낼 때, `error.tsx`는 예상 못 한 오류의 재시도 UI입니다. 플랫폼의 `src/app/error.tsx`는 기술 메시지 대신 Alert와 재시도 버튼을 보이고, `requireMember`의 거부는 `notFound()`로 보내 자원 존재를 드러내지 않습니다. 성공한 조회 결과가 0건일 때만 공용 `EmptyState`를 씁니다.

공식 참고: [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Fetching Data와 Streaming](https://nextjs.org/docs/app/getting-started/fetching-data), [loading](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

## 4. 따라 하기: 업무 목록 Issue를 읽기 전 점검

1. Issue의 수정 가능 파일·준비된 RPC·완료 기준을 먼저 읽습니다. 팀원은 `supabase/**`, 공용 UI, `layout.tsx`를 바꾸지 않습니다.
2. `src/app/(member)/tasks/page.tsx`가 존재하는지와 `requireMember("/tasks")`가 필요한지 확인합니다. 아직 기반이 없으면 만들어 내지 말고 리드에게 요청합니다.
3. 정상 가짜 seed 데이터, 0건, 조회 오류, 권한 없는 계정의 URL 직접 접근을 각기 적습니다.
4. 목록 조회는 Server Component에서, 필터·모달만 Client Component에서 처리합니다. 독립 조회는 `Promise.all`로 묶고 쿠키 조회는 Suspense 안에 둡니다.

기대 결과는 제목과 fallback이 먼저 보이고, 결과에 따라 목록·빈 안내·오류·not-found가 바뀌는 것입니다. 실패하면 브라우저 콘솔과 `npm run dev` 터미널을 모두 확인합니다.

## 5. 직접 해보기와 흔한 실수

완료 기준은 “내 업무만 보이기” 같은 화면 필터가 RLS 권한 판단을 대신하지 않고, 오류가 빈 목록으로 위장되지 않으며, 375px에서도 fallback·긴 제목이 잘리지 않는 것입니다. 필터 하나를 바꿔 빈 결과 문구와 필터 해제 행동을 추가해 보되, 공용 부품 변경은 Issue 밖입니다.

| 잘못된 예 | 문제 | 올바른 접근 |
| --- | --- | --- |
| page 전체에 `'use client'` | 서버 조회·비밀 경계가 브라우저로 넓어짐 | 상호작용 부품만 Client Component |
| `catch { return [] }` | 장애가 “업무 없음”처럼 보임 | Alert/오류 경계와 빈 목록을 분리 |
| 버튼 숨김만으로 보호 | URL·요청으로 우회 가능 | `requireMember`와 RLS도 확인 |

## 6. AI 요청과 완료 체크

계획 프롬프트: “목표는 업무 목록의 로딩·빈·오류·권한 없음 상태를 확인하는 것이다. 허용 파일은 Issue에 적힌 route뿐이다. `AGENTS.md`, `src/app/me/page.tsx`, 해당 Issue를 참고하고 DB·공용 UI·패키지는 건드리지 마라. 실제 준비된 helper/RPC만 사용하고, 완료 기준과 직접 URL 검증을 표로 제시해라.”

구현 프롬프트: “승인한 계획대로 작은 Client Component만 추가해라. 조회는 Server Component, 쓰기는 `requireMember → rpc → refresh` 순서를 지켜라. 없는 함수는 발명하지 말고 질문으로 남겨라.”

리뷰 프롬프트: “Server/Client 경계, 네 화면 상태, 직접 URL 접근, 375px·키보드, 비밀 값이 콘솔·오류에 없는지를 점검해라.” 오류 캡처의 이메일·토큰·쿠키는 가립니다.

PR에는 실행 위치, 정상/빈/오류/거부 결과, 다음 읽을 [React UI](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-00)를 적습니다.
