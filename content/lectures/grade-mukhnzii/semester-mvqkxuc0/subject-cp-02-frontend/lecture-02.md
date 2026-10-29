---
title: "02-2 · Next.js App Router"
description: "폴더가 주소가 되는 App Router의 규칙, page·layout·loading·error·not-found 파일의 역할, 동적 주소 [taskId]와 params, 라우트 그룹으로 로그인 영역을 나누는 법, Link로 이동하는 법을 기획서 12절의 화면 구조에 맞춰 익힙니다."
order: 2
published: true
duration: 45
tags: [Next.js, App Router, layout, 동적 라우트, Link, 화면 구조]
objectives:
  - app 폴더 구조를 보고 실제 주소를 말한다.
  - page·layout·loading·error·not-found 파일이 각각 언제 쓰이는지 설명한다.
  - 동적 주소에서 params를 await해 ID를 꺼내는 코드를 읽는다.
  - 기획서 12절 화면 구조를 App Router 폴더로 옮긴다.
---

## 1. Next.js가 React 위에 얹는 것

React는 "화면 조각을 만드는 법"만 알려 줍니다. **Next.js**는 그 위에 다음을 얹은 프레임워크입니다.

| 기능 | 뜻 |
| --- | --- |
| 라우팅 | 폴더 구조가 곧 주소 |
| 서버 실행 | Component를 서버에서 먼저 그려 HTML로 보냄 (02-3편) |
| 서버 함수 | 폼 제출을 서버에서 처리 (02-4편, 03-1편) |
| 빌드·최적화 | 이미지·글꼴·코드 분할 |

> [!NOTE]
> React와 Next.js가 각각 무엇이고 어떤 문법이 어느 쪽 것인지는 [02-0 React와 Next.js 한눈에 보기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00)에 지도로 정리했습니다. 이 편은 그중 **주소와 파일 규칙**을 자세히 봅니다.

### Next.js의 "문법"은 대부분 이름 규칙이다

Next.js는 새 언어가 아닙니다. 코드는 그대로 React(JSX)와 TypeScript이고, Next.js가 정한 것은 주로 **이름**입니다.

| 종류 | 예 | 뜻 |
| --- | --- | --- |
| 폴더 이름 | `app/tasks/`, `[taskId]`, `(council)` | 주소를 만든다 |
| 파일 이름 | `page.tsx`, `layout.tsx`, `loading.tsx` | 그 주소에서 맡는 역할 |
| 내보내기 | `export default function …` | Next.js가 찾아서 실행할 Component |
| 가져오는 함수 | `Link`, `redirect`, `notFound` | 이동과 화면 전환 |

가장 작은 페이지는 이렇게 생겼습니다.

```tsx
// app/tasks/page.tsx  →  주소 /tasks
export default function TasksPage() {
  return <h1>업무</h1>;
}
```

`export default`가 중요합니다. 페이지 파일마다 **기본으로 내보내는 Component 하나**가 있어야 Next.js가 그 주소에서 그것을 그립니다. 함수 이름(`TasksPage`)은 자유입니다.

> [!CAUTION]
> 이 프로젝트가 쓰는 Next.js 16은 예전 버전과 규칙이 다른 곳이 있습니다. 예: `middleware.ts`가 **`proxy.ts`로** 이름이 바뀌었고, `params`·`cookies()`는 `await`해서 꺼냅니다. 코드를 쓸 때는 설치된 버전의 공식 문서(`node_modules/next/dist/docs/`)를 먼저 확인합니다.

## 2. 폴더 = 주소

```text
app/
├─ layout.tsx                    → 모든 페이지를 감싸는 틀
├─ page.tsx                      → /
├─ login/page.tsx                → /login
├─ suggestions/page.tsx          → /suggestions  (일반 학생도 접근)
└─ (council)/                    → 괄호 폴더는 주소에 안 나타남 (라우트 그룹)
   ├─ layout.tsx                 → 내부 메뉴가 있는 틀 + 구성원 확인
   ├─ dashboard/page.tsx         → /dashboard
   ├─ tasks/
   │  ├─ page.tsx                → /tasks
   │  ├─ loading.tsx             → /tasks 불러오는 동안
   │  ├─ new/page.tsx            → /tasks/new
   │  └─ [taskId]/
   │     ├─ page.tsx             → /tasks/123
   │     └─ not-found.tsx        → 없거나 볼 수 없는 업무
   ├─ events/[eventId]/page.tsx  → /events/456
   ├─ meetings/
   │  ├─ agendas/page.tsx        → /meetings/agendas (안건)
   │  └─ [meetingId]/page.tsx    → /meetings/789
   └─ admin/
      ├─ members/page.tsx        → /admin/members
      └─ term-setup/page.tsx     → /admin/term-setup (새 기수 세팅)
```

| 규칙 | 뜻 |
| --- | --- |
| `page.tsx`가 있어야 주소가 생김 | 폴더만 있으면 주소 없음 |
| `[taskId]` | 대괄호 = 그 자리에 무엇이든 들어오는 **동적 주소** |
| `(council)` | 괄호 = 묶기만 하고 주소에는 안 나타남 |
| 같은 폴더의 다른 파일 | 주소가 생기지 않으므로 Component를 같이 둬도 됨 |

## 3. 특별한 파일들

| 파일 | 역할 | 학생회 예 |
| --- | --- | --- |
| `page.tsx` | 그 주소의 본문 | 업무 목록 |
| `layout.tsx` | 하위 페이지를 감싸는 틀. 이동해도 다시 그려지지 않음 | 왼쪽 메뉴, 상단 기수 표시 |
| `loading.tsx` | 페이지가 준비되는 동안 보여 줄 화면 | "업무를 불러오는 중" |
| `error.tsx` | 예상 못한 오류가 났을 때 화면 (Client Component) | "문제가 생겼습니다. 다시 시도" |
| `not-found.tsx` | `notFound()`를 불렀을 때 화면 | "업무를 찾을 수 없습니다" |
| `route.ts` | 화면 대신 데이터를 돌려주는 주소 (Route Handler, 03-1편) | 로그인 콜백 |

### layout 예시

```tsx
// app/(council)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentMembership } from "@/lib/auth/membership";

export default async function CouncilLayout({ children }: { children: React.ReactNode }) {
  const membership = await getCurrentMembership();   // 서버에서 실행
  if (!membership) redirect("/suggestions");         // 구성원이 아니면 건의 화면으로

  return (
    <div className="md:grid md:grid-cols-[220px_1fr]">
      <nav aria-label="학생회 메뉴" className="p-4">
        <p className="text-sm text-stone-600">{membership.termName}</p>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/tasks">업무</Link></li>
          <li><Link href="/events">행사</Link></li>
          <li><Link href="/meetings">회의록</Link></li>
          {membership.role === "EXECUTIVE" && <li><Link href="/admin/members">관리</Link></li>}
        </ul>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `async function` | 서버 Component는 async로 데이터를 기다릴 수 있음 |
| `{ children }` | 이 틀 안에 들어갈 하위 페이지 |
| `redirect("/suggestions")` | 다른 주소로 보냄 (응답 307) |
| `<Link href=...>` | 페이지 전체를 새로 받지 않고 필요한 부분만 바꾸는 링크 |
| `membership.role === "EXECUTIVE" && <li>` | 회장단에게만 "관리" 메뉴 표시 |

> [!CAUTION]
> layout의 `redirect`와 메뉴 숨김은 **화면 편의**입니다. layout은 하위 페이지로 이동할 때 다시 실행되지 않을 수 있고, Server Action은 layout을 거치지 않고 직접 호출될 수 있습니다. 그래서 각 페이지의 데이터 조회와 각 Server Action에서 권한을 다시 확인하고, 최종적으로는 RLS가 막습니다.

## 4. 동적 주소에서 ID 꺼내기

```tsx
// app/(council)/tasks/[taskId]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;              // Next.js 16: params는 Promise

  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("id, title, description, status, due_date")
    .eq("id", taskId)
    .maybeSingle();                              // 없으면 null

  if (!task) notFound();                         // 없거나 RLS가 막았으면 404 화면

  return (
    <article>
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p>{task.description}</p>
    </article>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `params: Promise<{ taskId: string }>` | 주소의 `[taskId]` 자리에 들어온 글자를 나중에 주는 약속 |
| `const { taskId } = await params` | 기다렸다가 꺼냄. `/tasks/abc`면 `"abc"` |
| `.maybeSingle()` | 한 행 또는 null |
| `if (!task) notFound()` | 볼 수 없는 업무는 "없음"으로 처리 |

> [!NOTE]
> RLS 때문에 권한이 없는 업무는 DB가 **행을 아예 돌려주지 않습니다.** 그래서 "없는 업무"와 "볼 수 없는 업무"가 똑같이 404로 보입니다. 이렇게 하면 업무가 존재한다는 사실 자체도 새지 않습니다.

## 5. 쿼리 값 꺼내기

```tsx
// /tasks?status=TODO
export default async function TasksPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  // status가 정해진 값인지 확인한 뒤 사용
}
```

`searchParams`도 사용자가 마음대로 바꿀 수 있는 값이므로, 허용하는 값인지 확인한 뒤 씁니다.

## 6. 기획서 화면 구조를 폴더로

| 기획서 12절 | 주소 | 누가 |
| --- | --- | --- |
| Dashboard | `/dashboard` | 구성원 |
| 업무 (내 업무·소속 국·권한 받은 다른 국) | `/tasks`, `/tasks/[taskId]` | 구성원 |
| 행사 (Overview·Task·일정·자료·회의록·인수인계) | `/events/[eventId]` + 탭 | 열람 권한자 |
| 회의록 (목록·Editor·작성자·열람 권한) | `/meetings`, `/meetings/[meetingId]` | 열람 권한자 |
| 회의 안건 (추가 결정) | `/meetings/agendas`, `/meetings/agendas/[agendaId]` | 국장 이상 작성 |
| 건의사항 | `/suggestions` | 모든 로그인 학생 |
| 관리 (구성원·부서·직책·권한·Links·Templates) | `/admin/...` | 회장단 (국장은 자기 국 구성원만) |
| 새 기수 세팅·회장단 이양 (추가 결정) | `/admin/term-setup`, `/admin/handover` | 회장단 |

> [!QUIZ]
> `app/(council)/events/[eventId]/resources/page.tsx` 파일은 어떤 주소가 되나요? `eventId`는 어떻게 꺼내나요?

> [!ANSWER]
> `/events/{eventId}/resources`입니다. `(council)`은 주소에 나타나지 않습니다. 페이지 함수의 `params`를 `await`해서 `const { eventId } = await params;`로 꺼냅니다.

> [!QUIZ]
> `(council)/layout.tsx`에서 구성원이 아니면 redirect하는데, 왜 각 페이지와 Server Action에서도 권한을 다시 확인하나요?

> [!ANSWER]
> layout은 화면 이동 중 다시 실행되지 않을 수 있고, Server Action은 화면을 거치지 않고 직접 호출될 수 있습니다. layout의 검사는 "일반 학생에게 내부 메뉴를 보여 주지 않는" 편의이고, 실제 데이터 보호는 각 조회·저장 지점과 DB의 RLS가 맡습니다.

## 학습 경로

[← 02-1 React 기초](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-01) · [02-3 Server/Client Component →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-03)
