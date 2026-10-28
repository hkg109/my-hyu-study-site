---
title: "02-3 · Server Component와 Client Component"
description: "Next.js에서 같은 React Component가 서버에서 실행되느냐 브라우저에서 실행되느냐에 따라 할 수 있는 일과 비밀 값의 경계가 어떻게 달라지는지, 'use client' 경계와 Props로 데이터를 넘기는 법, server-only로 실수를 막는 법을 업무 목록 화면으로 익힙니다."
order: 3
published: true
duration: 45
tags: [Next.js, Server Component, Client Component, use client, server-only, 보안 경계]
objectives:
  - Server Component와 Client Component가 각각 할 수 있는 일을 표로 구분한다.
  - "'use client' 경계 아래의 코드가 브라우저로 전송된다는 것을 설명한다."
  - 서버에서 데이터를 불러와 Client Component에 Props로 넘기는 구조를 읽는다.
  - 비밀 값이 브라우저로 새는 세 가지 경로와 막는 법을 말한다.
---

## 1. 같은 React, 다른 실행 장소

Next.js App Router에서 Component는 **기본이 Server Component**입니다. 파일 맨 위에 `"use client"`를 적은 파일과 그 파일이 import하는 것만 **Client Component**가 됩니다.

[![위쪽 브라우저 영역의 Client Component와 아래쪽 서버 영역의 Server Component·Server Action, 그 아래 RLS가 걸린 Supabase DB, 네트워크 경계](/materials/diagrams/cpg-02b-server-client.svg)](/materials/diagrams/cpg-02b-server-client.svg)

*그림 02-2 · 브라우저와 서버의 경계 — 누르면 원본 크기로 열린다.*

| | Server Component | Client Component |
| --- | --- | --- |
| 실행 장소 | Vercel 서버 (요청이 올 때 또는 빌드할 때) | 사용자 브라우저 (서버에서 첫 HTML도 미리 그림) |
| 선언 | 기본값 | 파일 맨 위 `"use client"` |
| DB·비밀 키 접근 | ✅ 가능 | ❌ 코드가 사용자에게 전송됨 |
| `async`/`await`로 데이터 기다리기 | ✅ | ❌ (Component 자체는 async 불가) |
| `useState`, `onClick` | ❌ | ✅ |
| 브라우저 기능 (`localStorage`, `window`) | ❌ | ✅ |
| 브라우저로 보내는 JavaScript 양 | 0 | 그 Component의 코드만큼 |

> [!EXAM]
> 한 문장으로: ==데이터를 준비하는 일은 서버에서, 사용자와 주고받는 일은 브라우저에서.==

## 2. 업무 목록 화면을 둘로 나누기

```tsx
// app/(council)/tasks/page.tsx  · Server Component (기본값)
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "./task-list";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, title, status, due_date, assignee:profiles!assignee_id(display_name)")
    .is("archived_at", null)
    .order("due_date", { ascending: true })
    .range(0, 49);                                  // 50개씩 (기획서: 목록은 페이지네이션)

  if (error) throw error;                           // error.tsx가 받아서 보여 줌

  const rows = (tasks ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    dueDate: t.due_date,
    assigneeName: t.assignee?.display_name ?? null,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold">업무</h1>
      <TaskList tasks={rows} />
    </>
  );
}
```

```tsx
// app/(council)/tasks/task-list.tsx  · Client Component
"use client";
import { useState } from "react";
// ... 02-1편의 필터·검색 코드
export function TaskList({ tasks }: { tasks: TaskRow[] }) { /* useState, onClick */ }
```

| 위치 | 하는 일 | 이유 |
| --- | --- | --- |
| `page.tsx` (서버) | 로그인 쿠키로 DB를 조회하고 필요한 열만 골라 가공 | DB 연결과 쿠키는 서버에만 있음 |
| `task-list.tsx` (브라우저) | 필터 버튼, 검색 입력 | 클릭과 State가 필요 |
| `tasks={rows}` | 서버가 만든 **데이터**를 Props로 넘김 | 경계를 넘는 것은 데이터뿐 |

### select 문자열 읽기

`"id, title, status, due_date, assignee:profiles!assignee_id(display_name)"`

- 앞의 네 개: `tasks` 테이블의 열
- `assignee:profiles!assignee_id(display_name)`: `assignee_id` 외래 키를 따라 `profiles` 테이블에서 `display_name`을 가져와 `assignee`라는 이름으로 붙임 (SQL의 JOIN, 04-2편)

## 3. 경계를 넘는 값은 사용자에게 보인다

Server Component가 Client Component에 넘긴 Props는 **HTML과 함께 브라우저로 전송**됩니다. 화면에 안 그려도 페이지 소스와 네트워크 응답에 들어 있습니다.

```tsx
// ❌ 건의 담당자 화면에 행 전체를 넘김 → 화면에 안 써도 응답에 포함됨
<SuggestionList suggestions={rows} />

// ✅ 화면에 필요한 열만 골라서 넘김
<SuggestionList suggestions={rows.map(({ id, title, status }) => ({ id, title, status }))} />
```

> [!NOTE]
> 건의 작성자 신원은 애초에 `suggestions` 테이블에 없고 `suggestion_authors`에 분리되어 있어서(00-3편) 이 실수로도 새지 않습니다. 그래도 "필요한 열만 select하고, 필요한 값만 넘긴다"를 습관으로 둡니다.

## 4. 비밀 값이 새는 세 가지 길

| 길 | 예 | 막는 법 |
| --- | --- | --- |
| Client Component 파일에 비밀 키를 씀 | `"use client"` 파일에서 `process.env.SUPABASE_SECRET_KEY` 사용 | Next.js는 `NEXT_PUBLIC_`로 시작하지 않는 환경변수를 브라우저 코드에 넣지 않음. 그래도 서버 전용 파일에 `import "server-only"`를 적어 실수로 import하면 빌드가 실패하게 함 |
| 공개 환경변수에 비밀을 넣음 | `NEXT_PUBLIC_SUPABASE_SECRET_KEY=...` | `NEXT_PUBLIC_`가 붙은 값은 **전부 공개**라고 생각함. 공개 키(publishable/anon)와 URL만 붙임 |
| Props로 민감 데이터를 넘김 | 위 3절 | 필요한 열만 select·전달 |

```ts
// lib/supabase/admin.ts  · 관리자 키를 쓰는 드문 서버 작업 전용
import "server-only";                      // 브라우저 코드에서 import하면 빌드 오류
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });
}
```

> [!CAUTION]
> ==red:관리자 키(secret / service role)는 RLS를 건너뜁니다.== 이 프로젝트에서 관리자 키를 쓰는 곳은 회의록 Snapshot 압축 같은 **신뢰된 서버 작업**뿐입니다. 일반 화면과 Server Action은 항상 로그인 사용자 자격의 클라이언트(`lib/supabase/server.ts`)를 써서 RLS가 적용되게 합니다(03-2편).

## 5. 경계를 어디에 둘까

`"use client"`는 **필요한 가장 작은 조각**에만 붙입니다.

```text
TasksPage (서버)               ← 데이터 조회
├─ h1 (서버)
└─ TaskList (클라이언트)        ← 필터·검색
   └─ TaskCard (클라이언트 안이라 같이 브라우저로)
```

페이지 전체에 `"use client"`를 붙이면 DB 조회를 서버에서 할 수 없고, 브라우저로 보내는 코드도 늘어납니다.

### Client Component 안에 서버에서 만든 것을 넣는 법

Client Component가 Server Component를 직접 import할 수는 없지만, **`children`으로 받아서** 끼워 넣을 수는 있습니다.

```tsx
// 탭 전환은 브라우저, 탭 내용은 서버에서 준비
<EventTabs overview={<EventOverview eventId={id} />} resources={<ResourceList eventId={id} />} />
```

## 6. 직접 해보기

1. 업무 상세 페이지를 서버(본문 조회)와 클라이언트(상태 변경 버튼) 두 파일로 나눠 보세요.
2. 클라이언트 파일에서 `process.env.SUPABASE_SECRET_KEY`를 `console.log`해 보고 브라우저 Console에 `undefined`가 찍히는 것을 확인하세요. 그다음 서버 전용 파일에 `import "server-only"`를 넣고, 그 파일을 클라이언트 파일에서 import하면 빌드가 어떻게 실패하는지 보세요.

> [!QUIZ]
> 회의록 에디터(BlockNote)는 Server Component와 Client Component 중 어디에 둬야 하나요? 회의록 제목과 열람 권한 확인은요?

> [!ANSWER]
> 에디터는 키 입력·커서·Yjs 연결이 필요하므로 **Client Component**입니다. 회의록 메타데이터 조회와 "이 사람이 열람할 수 있는가"의 확인은 **Server Component**에서 하고, 에디터에는 회의록 ID와 초기 데이터만 Props로 넘깁니다. 실제 편집 권한은 저장할 때마다 DB 함수가 다시 검사합니다.

> [!QUIZ]
> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`는 브라우저에 공개돼도 괜찮은데, 왜 괜찮은가요?

> [!ANSWER]
> 공개 키는 "어느 Supabase 프로젝트인지"만 알려 주고, 그 키로 할 수 있는 일은 RLS 정책이 허용한 범위뿐이기 때문입니다. 로그인하지 않았거나 권한이 없는 사용자는 이 키를 가져도 내부 데이터를 읽을 수 없습니다. 그래서 RLS가 빠진 테이블이 하나라도 있으면 그 테이블은 공개 키로 누구나 읽게 됩니다. RLS를 모든 테이블에 켜는 이유입니다.

## 학습 경로

[← 02-2 Next.js App Router](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-02) · [02-4 폼과 화면 상태 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-04)
