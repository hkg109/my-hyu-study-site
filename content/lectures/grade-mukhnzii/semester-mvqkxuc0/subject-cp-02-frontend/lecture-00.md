---
title: "04 · Next.js: 경로·서버·로딩"
description: "학생회 플랫폼의 실제 App Router 구조를 읽고, 업무 화면의 경로·Server/Client Component·Suspense·오류·저장 후 갱신을 판단합니다."
order: 0
published: true
duration: 55
tags: [Next.js, App Router, Server Component, Client Component, Suspense, Server Action]
objectives:
  - 실제 폴더와 특수 파일에서 URL과 화면 책임을 찾는다.
  - 조회는 서버에, 상호작용은 작은 Client Component에 둔다.
  - 로딩·빈 목록·오류·권한 없음·없는 자원을 구별한다.
  - 쓰기 뒤 RPC 결과와 화면 갱신을 설명한다.
---

## 1. 이 강의가 필요한 순간

`/tasks` 같은 화면 Issue를 받았는데 어느 폴더에 코드를 둘지, `useState`가 왜 안 되는지, 조회 실패를 빈 목록으로 보여도 되는지 막힐 때 읽습니다. [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01)에서 브라우저·서버·DB의 역할을, [AI 협업](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-01)에서 Issue 범위를 먼저 확인하세요.

학생회 플랫폼은 Next.js **16.4.3**·React **19.3.0**의 App Router를 사용합니다. 강의 사이트는 Next.js 16.3.4이므로 두 저장소의 명령과 파일을 섞지 않습니다. 실제 근거는 플랫폼의 [`src/app/me/page.tsx`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/me/page.tsx), [`src/lib/auth/session.ts`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/lib/auth/session.ts), [`src/app/error.tsx`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/error.tsx)입니다.

> [!CONCEPT]
> **목표:** URL에 맞는 화면을 고르고, 서버가 데이터를 읽어 작은 브라우저 부품에 넘기는 흐름과 각 화면 상태를 PR에서 설명한다.

## 2. 폴더가 URL이 되는 규칙

App Router에서는 폴더가 URL 구간이고 `page.tsx`가 그 주소의 화면입니다. `layout.tsx`는 하위 화면을 감싸는 공통 틀입니다. `(member)`처럼 괄호로 묶은 route group은 파일을 정리하지만 URL에는 나타나지 않습니다.

| 파일 | URL | 책임 |
| --- | --- | --- |
| `src/app/me/page.tsx` | `/me` | 로그인한 사용자의 계정·소속 조회 |
| `src/app/(member)/dashboard/page.tsx` | `/dashboard` | 학생회 구성원 전용 화면 |
| `src/app/login/page.tsx` | `/login` | Google 로그인 시작과 오류 안내 |
| `src/app/tasks/[taskId]/page.tsx` | `/tasks/:taskId` | 동적 업무 상세. 현재 기반이 준비된 뒤 만드는 경로 |

동적 경로에서 Next.js 16의 `params`는 Promise입니다. 아래는 **문법을 이해하기 위한 예시**이며 현재 플랫폼에 업무 상세 파일이 이미 있다는 뜻이 아닙니다.

```tsx
// 학습용 예시: src/app/(member)/tasks/[taskId]/page.tsx
export default async function TaskPage({
  params,
}: PageProps<"/tasks/[taskId]">) {
  const { taskId } = await params;
  return <h1>업무 {taskId}</h1>;
}
```

## 3. Server Component와 Client Component

`page.tsx`와 `layout.tsx`는 기본이 Server Component입니다. DB 가까이에서 데이터를 읽고, server-only helper와 비밀 값을 브라우저 번들 밖에 두며, 브라우저 JavaScript를 줄일 수 있습니다. `useState`, 이벤트 handler, `window`처럼 브라우저 상호작용이 필요한 파일만 `'use client'` 경계를 둡니다.

| 질문 | Server Component | Client Component |
| --- | --- | --- |
| 어디서 실행되는가 | 서버에서 렌더링 | 서버가 만든 초기 HTML 뒤 브라우저에서 hydration |
| 주로 맡는 일 | 인증, 조회, 화면 뼈대 | 입력, 선택, 열기·닫기, 브라우저 API |
| 사용할 수 없는 것 | `useState`, `onClick`, `window` | server-only module, secret |
| 데이터 전달 | 조회한 직렬화 가능한 값을 props로 전달 | props를 받아 상호작용 상태로 사용 |

`'use client'`가 붙은 파일이 import하는 module도 client graph에 들어갑니다. 그래서 page 전체에 지시문을 붙이기보다 `TaskFilter`, `TaskStatusButton`처럼 상호작용하는 가장 작은 경계에 둡니다. 플랫폼의 [`GoogleLoginButton`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/login/google-login-button.tsx)은 state와 `window.location.origin`이 필요하므로 Client Component이고, `/me`의 조회는 Server Component입니다.

```tsx
// 실제 /me 코드를 읽기 쉽게 축약함. 복사본이 아니라 구조 설명이다.
export default function MePage() {
  return (
    <main>
      <PageHeader title="내 계정" />
      <Suspense fallback={<p>계정 정보를 불러오는 중…</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}

async function AccountDetails() {
  const userId = await requireUser("/me");
  const supabase = await createClient();
  const [profileResult, membershipResult] = await Promise.all([
    supabase.from("profiles").select("email, display_name").eq("id", userId).single(),
    supabase.from("memberships").select("id, role").eq("user_id", userId).eq("is_active", true),
  ]);
  // 두 결과의 error와 성공 데이터를 구분해 렌더링한다.
}
```

`Promise.all`은 서로 의존하지 않는 조회를 함께 시작합니다. 첫 조회 결과로 두 번째 조건을 만들어야 한다면 병렬로 묶지 않습니다.

## 4. Suspense와 화면 상태를 같은 것으로 보지 않는다

`loading.tsx`는 route 구간 전체의 즉시 대기 UI를 만들고 자동으로 Suspense 경계를 제공합니다. 제목은 먼저 보여 주고 목록만 기다리려면 데이터에 가까운 곳에 `<Suspense>`를 둡니다. 이 경계가 해결하는 것은 **대기**입니다. 오류·빈 결과·권한 없음은 별도 판단입니다.

| 상태 | 판정 근거 | 플랫폼 표현 |
| --- | --- | --- |
| 로딩 | Promise가 아직 끝나지 않음 | `loading.tsx` 또는 Suspense fallback |
| 빈 목록 | 조회 성공, `data.length === 0` | 공용 `EmptyState`와 다음 행동 |
| 예상 가능한 조회 실패 | Supabase `error` 존재 | 공용 `Alert`와 재시도 문구 |
| 예상하지 못한 오류 | 렌더링 중 throw | `src/app/error.tsx`의 Alert·재시도 |
| 권한 없음/존재 비공개 | `requireMember` 거부 | `notFound()`와 공용 not-found 화면 |
| 실제 없는 자원 | ID 조회 결과 없음 | `notFound()` |

`catch { return [] }`는 장애를 “업무 없음”으로 거짓 안내합니다. 반대로 권한 없음과 실제 없는 자원을 같은 not-found 화면으로 보여 주는 것은 이 플랫폼이 자원 존재를 숨기기 위해 선택한 보안 정책입니다.

## 5. 쓰기 결과가 화면에 반영되는 위치

플랫폼 규칙은 같은 route의 `actions.ts`에 Server Action을 두고 `requireUser` 또는 `requireMember` → 준비된 `supabase.rpc()` → `refresh()` 순서로 처리하는 것입니다. 팀원은 browser에서 table을 직접 쓰거나 화면 전용 Route Handler를 만들지 않습니다.

```tsx
// 학습용 구조 예시. create_task RPC가 Issue의 기반으로 준비되기 전에는 복사하지 않는다.
"use server";
import { refresh } from "next/cache";

export async function createTask(formData: FormData) {
  await requireMember("/tasks/new", ["EXECUTIVE", "DIRECTOR"]);
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_task", {
    p_title: String(formData.get("title") ?? "").trim(),
  });
  if (error) return { message: "업무를 저장하지 못했습니다." };
  refresh();
  return { message: "업무를 저장했습니다." };
}
```

이 예시에서 클라이언트 `required`는 빠른 안내일 뿐입니다. Action은 입력과 로그인·Role을 다시 확인하고, RPC와 RLS가 데이터 규칙을 최종 강제해야 합니다. RPC 이름·인자·반환값은 Issue의 “준비된 것”과 생성 타입에서 확인합니다.

## 6. Issue에 적용할 판단 기준

| Issue 문장 | 먼저 확인할 것 | 완료 근거 |
| --- | --- | --- |
| “업무 목록을 보여 준다” | route, `requireMember`, 실제 조회 helper·타입 | 정상·0건·오류·직접 URL 거부 |
| “필터를 추가한다” | 서버 재조회가 필요한지, 받은 목록만 좁히는지 | filter state만 Client 경계에 있음 |
| “상태를 변경한다” | 준비된 RPC, 허용 Role, 실패 반환 | Action·RPC·화면 갱신이 이어짐 |
| “상세가 없으면 404” | 없음과 권한 없음의 정책 | `notFound()` 호출 위치 설명 |

공용 `layout.tsx`, `src/components/ui/**`, `src/lib/supabase/**`, DB 정책은 리드 관리입니다. 필요한 기반이 없으면 비슷한 helper를 만들지 않고 Issue 댓글로 요청합니다.

## 7. 흔한 실수와 해결

| 잘못된 접근 | 생기는 문제 | 올바른 접근 |
| --- | --- | --- |
| page 전체에 `'use client'` | 서버 경계와 browser bundle이 불필요하게 넓어짐 | 상호작용 부품만 분리 |
| 첫 데이터를 `useEffect`로 조회 | 빈 HTML·추가 왕복·깜박임 | Server Component에서 조회 |
| 오류를 빈 배열로 변환 | 장애가 빈 상태로 보임 | `error`와 성공 0건 분리 |
| 버튼 숨김만으로 권한 처리 | 직접 URL·Action 호출로 우회 | page·Action·RLS에서 확인 |
| 없는 RPC를 예시 이름으로 호출 | 문서와 실제 기반이 어긋남 | 생성 타입과 Issue에서 존재 확인 |

## 8. AI 요청과 PR 설명

계획 프롬프트: “목표는 업무 목록의 로딩·빈·오류·권한 없음 상태를 구분하는 것이다. 허용 파일은 Issue에 적힌 route뿐이다. `AGENTS.md`, 실제 route, 생성 타입을 참고하고 DB·공용 UI·패키지는 수정하지 마라. Server/Client 경계와 사용할 실제 helper/RPC를 먼저 근거 링크와 함께 제안해라.”

구현 프롬프트: “승인한 경계대로 구현해라. 조회는 Server Component, 상호작용만 Client Component, 쓰기는 `requireMember → rpc → refresh`를 따른다. 존재를 확인하지 못한 파일·함수는 만들지 말고 질문으로 남겨라.”

리뷰 프롬프트: “Server/Client 경계, 로딩과 오류 구분, 직접 URL 접근, 375px·키보드, 비밀 값 노출, Issue 밖 파일 변경을 검토해라. 로그의 이메일·토큰·쿠키는 가려라.”

PR에는 `주소 → page → 인증/조회 → 상태 UI`, 쓰기가 있으면 `form → Action → RPC/RLS → refresh`를 자기 말로 적습니다. 다음 강의는 [React UI](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-00)입니다.

공식 참고: [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data), [Forms](https://nextjs.org/docs/app/guides/forms).
