---
title: "02-0 · React와 Next.js 한눈에 보기"
description: "프론트엔드 과목을 시작하기 전에 React와 Next.js가 각각 무엇이고 왜 함께 쓰는지, 두 도구의 문법이 어떻게 나뉘는지를 지도 한 장으로 정리합니다. 작은 업무 화면 하나를 끝까지 읽으며 02-1~02-5편에서 배울 문법이 어디에 들어가는지 미리 봅니다."
order: 0
published: true
duration: 40
tags: [React, Next.js, JSX, App Router, 문법 지도, 프론트엔드 개요]
objectives:
  - React와 Next.js가 각각 맡는 일을 한 문장씩 말한다.
  - 라이브러리와 프레임워크의 차이를 예로 설명한다.
  - 코드 한 줄을 보고 HTML·JavaScript·TypeScript·React·Next.js 중 어느 문법인지 구분한다.
  - 02-1~02-5편에서 배울 문법이 업무 화면의 어디에 쓰이는지 지도에서 찾는다.
---

[![브라우저 층의 React 화면과 Tailwind CSS가 강조된 세 층 지도](/materials/diagrams/cpg-12-stack-front.svg)](/materials/diagrams/cpg-12-stack-front.svg)

*그림 02-0 · 프론트엔드 과목은 브라우저 층을 다룬다 — 누르면 원본 크기로 열린다.*

## 학습 흐름

```text
React는 무엇인가 → Next.js는 무엇인가 → 둘은 어떻게 나뉘나
        ↓
코드 한 줄이 어느 문법인지 구분하기 (다섯 겹)
        ↓
React 문법 기초 7가지 → Next.js 문법 기초 7가지
        ↓
작은 업무 화면 하나를 끝까지 읽기 → 02-1 ~ 02-5 지도
```

> [!NOTE]
> 이 편은 **요약 지도**입니다. 여기서 모든 것을 이해하려 하지 말고 "이런 문법이 있고, 몇 편에서 배운다"만 잡으세요. 각 문법은 해당 편에서 처음부터 다시 설명합니다.

---

## 1. React는 무엇인가

> [!DEFINITION]
> **React**는 웹 화면을 **Component**라는 작은 조각으로 나눠 만들게 해 주는 JavaScript **라이브러리**입니다. Meta(페이스북)가 만들었습니다.

React가 해 주는 일은 딱 하나입니다. ==데이터가 바뀌면 화면을 알아서 다시 그려 준다.==

React가 없을 때는 "버튼을 누르면 → 목록을 찾아서 → 3번째 줄을 지우고 → 숫자를 바꿔라"처럼 **화면을 바꾸는 순서**를 하나하나 적어야 했습니다. React에서는 "데이터가 이럴 때 화면은 이렇게 생겼다"만 적습니다.

```text
React 없이                         React로
─────────────────────────         ─────────────────────────
"진행 중" 버튼을 누르면             filter가 "진행 중"일 때
 1. 목록을 찾는다                   화면 = 진행 중인 업무만 보여 주는 목록
 2. 완료된 카드를 숨긴다
 3. 개수 글자를 바꾼다              (어떻게 바꿀지는 React가 계산)
 4. 버튼 색을 바꾼다
```

React의 핵심 단어는 네 개뿐입니다.

| 단어 | 한 줄 뜻 | 업무 화면 예 |
| --- | --- | --- |
| **Component** | 화면 조각. JSX를 돌려주는 함수 | `TaskCard`, `TaskList` |
| **JSX** | JavaScript 안에 쓰는 HTML 모양 문법 | `<li>{title}</li>` |
| **Props** | 부모가 넘겨주는 값 (읽기 전용) | 카드의 제목·상태 |
| **State** | Component가 기억하는 바뀌는 값 | 선택한 필터, 입력 중인 글자 |

---

## 2. Next.js는 무엇인가

> [!DEFINITION]
> **Next.js**는 React 위에 **주소(라우팅)·서버 실행·서버 함수·배포 최적화**를 얹은 **프레임워크**입니다. Vercel이 만들었고, 이 프로젝트는 **Next.js 16**의 **App Router**를 씁니다.

React만으로는 "화면 조각"밖에 만들 수 없습니다. 실제 웹사이트에는 더 많은 것이 필요합니다.

| 웹사이트에 필요한 것 | React만 | Next.js |
| --- | --- | --- |
| 화면 조각 만들기 | ✅ | ✅ (React를 그대로 씀) |
| `/tasks`, `/tasks/42` 같은 **주소** | ❌ 직접 만들어야 함 | ✅ **폴더 = 주소** (02-2편) |
| **서버에서** DB를 읽어 화면 만들기 | ❌ | ✅ **Server Component** (02-3편) |
| 폼 제출을 **서버에서** 처리 | ❌ | ✅ **Server Action** (02-4편) |
| 로딩·오류·없음 화면 | ❌ | ✅ `loading.tsx`·`error.tsx`·`not-found.tsx` |
| 빌드, 이미지·글꼴 최적화, 배포 | ❌ | ✅ Vercel과 바로 연결 |

### 라이브러리와 프레임워크

| | 라이브러리 (React) | 프레임워크 (Next.js) |
| --- | --- | --- |
| 비유 | 공구 상자. 필요할 때 꺼내 씀 | 집의 설계도. 정해진 자리에 맞춰 채움 |
| 누가 부르나 | **내 코드가** React를 부름 | **Next.js가** 내 코드를 부름 |
| 예 | `useState()`를 내가 원하는 곳에서 부름 | `app/tasks/page.tsx`라는 **정해진 이름**의 파일을 만들면 Next.js가 `/tasks` 주소에서 그것을 실행 |

> [!EXAM]
> 한 문장씩 기억하세요.
> - **React**: 화면을 조각(Component)으로 만들고, 데이터가 바뀌면 다시 그린다.
> - **Next.js**: 그 React 화면에 주소를 붙이고, 서버에서 실행하고, 배포까지 해 준다.

---

## 3. 코드 한 줄은 다섯 겹의 문법이 섞여 있다

`.tsx` 파일 한 장에는 여러 언어의 문법이 겹쳐 있습니다. 처음에는 "지금 이 줄이 어느 문법인지"만 구분해도 절반은 읽힙니다.

```tsx
"use client";                                              // ⑤ Next.js(React) 경계 표시
import { useState } from "react";                          // ② JavaScript 모듈 + ④ React 기능
import Link from "next/link";                              // ⑤ Next.js 기능

type Task = { id: string; title: string };                 // ③ TypeScript 타입

export function TaskList({ tasks }: { tasks: Task[] }) {   // ④ React Component (② 함수 + ③ 타입)
  const [keyword, setKeyword] = useState("");              // ④ React State
  const visible = tasks.filter((t) => t.title.includes(keyword)); // ② JavaScript 배열

  return (
    <section className="space-y-3">                        {/* ① HTML 모양 (JSX) + Tailwind */}
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <Link href={`/tasks/${t.id}`}>{t.title}</Link>  {/* ⑤ Next.js 링크 */}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

| 겹 | 문법 | 알아보는 법 | 어디서 배우나 |
| --- | --- | --- | --- |
| ① | **HTML** (JSX 안에서) | `<태그>`, `className=` | 01-2편, 02-1편 |
| ② | **JavaScript** | `const`, `=>`, `.map`, `.filter`, `import` | 01-3편 |
| ③ | **TypeScript** | `type`, 콜론 뒤 `: string`, `Task[]` | 01-4편 |
| ④ | **React** | 대문자 함수, `{ }`, `useState`, `key`, `onChange` | 02-1편 |
| ⑤ | **Next.js** | `"use client"`, `next/link`, `next/navigation`, `page.tsx`·`layout.tsx` 파일 이름 | 02-2 ~ 02-4편 |

> [!NOTE]
> import 줄을 보면 어느 도구의 기능인지 바로 알 수 있습니다. `from "react"`는 React, `from "next/…"`는 Next.js, `from "@/…"`는 이 프로젝트 안의 파일입니다.

---

## 4. React 문법 기초 7가지

자세한 설명은 [02-1 React 기초](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-01)에 있습니다. 여기서는 모양만 봅니다.

### ① JSX — HTML 모양으로 화면 적기

```tsx
<li className="rounded border p-4">축제 부스 배치도</li>
```

HTML과 거의 같지만 `class` 대신 `className`, `<input>` 대신 `<input />`처럼 몇 가지가 다릅니다.

### ② 중괄호 — JSX 안에 JavaScript 값 넣기

```tsx
<p>{title}</p>
<p>{count + 1}건</p>
<a href={`/tasks/${id}`}>상세</a>
```

### ③ Component — 화면 조각에 이름 붙이기

```tsx
function TaskCard() {
  return <li>업무 하나</li>;
}

<TaskCard />   // 태그처럼 씀
```

이름은 **대문자로 시작**하는 함수입니다.

### ④ Props — 부모가 넘기는 값

```tsx
function TaskCard({ title }: { title: string }) {
  return <li>{title}</li>;
}

<TaskCard title="축제 부스 배치도" />
```

### ⑤ State — 기억하는 바뀌는 값

```tsx
const [filter, setFilter] = useState("ALL");   // 현재 값, 바꾸는 함수 = useState(처음 값)
setFilter("DONE");                              // 바꾸면 화면이 다시 그려짐
```

`use`로 시작하는 React 함수를 **Hook**이라고 부릅니다. `useState`, `useEffect`, `useActionState`(02-4편)가 이 과목에 나옵니다.

### ⑥ 이벤트 — 사용자가 무엇을 했을 때

```tsx
<button onClick={() => setFilter("DONE")}>완료만</button>
<input onChange={(e) => setKeyword(e.target.value)} />
```

### ⑦ 조건과 목록

```tsx
{tasks.length === 0 ? <p>업무가 없습니다</p> : <ul>…</ul>}   // 둘 중 하나
{isOverdue && <span>기한 초과</span>}                         // 보이거나 말거나
{tasks.map((t) => <TaskCard key={t.id} title={t.title} />)}  // 배열 → 목록
```

---

## 5. Next.js 문법 기초 7가지

Next.js의 "문법"은 새 언어가 아니라 대부분 **정해진 파일 이름·폴더 이름·맨 위 표시·가져다 쓰는 함수**입니다.

### ① 폴더 = 주소, `page.tsx` = 그 주소의 화면

```text
app/page.tsx                     → /
app/tasks/page.tsx               → /tasks
app/tasks/new/page.tsx           → /tasks/new
```

```tsx
// app/tasks/page.tsx
export default function TasksPage() {
  return <h1>업무</h1>;
}
```

페이지 파일은 Component를 **`export default`** 로 내보냅니다. Next.js가 이 Component를 찾아서 `/tasks` 주소에 보여 줍니다. (02-2편)

### ② `layout.tsx` — 여러 페이지를 감싸는 틀

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <nav>메뉴</nav>
        {children}          {/* 이 자리에 각 page.tsx가 들어감 */}
      </body>
    </html>
  );
}
```

### ③ 특별한 파일 이름들

| 파일 | 언제 보이나 |
| --- | --- |
| `loading.tsx` | 페이지를 준비하는 동안 |
| `error.tsx` | 예상 못한 오류가 났을 때 |
| `not-found.tsx` | `notFound()`를 불렀을 때 |
| `route.ts` | 화면 대신 데이터를 돌려주는 주소 (03-1편) |

### ④ 대괄호 폴더와 `params` — 바뀌는 주소

```tsx
// app/tasks/[taskId]/page.tsx  →  /tasks/42, /tasks/abc …
export default async function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;    // Next.js 16: params는 await로 꺼냄
  return <h1>업무 {taskId}</h1>;
}
```

괄호 폴더 `(council)`은 묶기만 하고 주소에 나타나지 않습니다. (02-2편)

### ⑤ Server Component(기본)와 `"use client"`

```tsx
// 아무 표시가 없으면 Server Component — 서버에서 실행, async로 DB를 기다릴 수 있음
export default async function TasksPage() {
  const tasks = await getTasks();
  return <TaskList tasks={tasks} />;
}
```

```tsx
// 맨 위에 "use client" — 브라우저에서 실행, useState·onClick을 쓸 수 있음
"use client";
export function TaskList({ tasks }: { tasks: Task[] }) { /* … */ }
```

==데이터 준비는 서버에서, 사용자와 주고받는 일은 브라우저에서.== (02-3편)

### ⑥ `"use server"` — 폼을 서버 함수로 처리 (Server Action)

```tsx
// app/tasks/actions.ts
"use server";
export async function createTask(formData: FormData) {
  const title = formData.get("title");
  // 권한 확인 → DB 저장
}
```

```tsx
<form action={createTask}>
  <input name="title" />
  <button type="submit">저장</button>
</form>
```

버튼을 누르면 브라우저가 이 함수를 **서버에서** 실행해 달라고 요청합니다. 저장 중 표시와 오류는 `useActionState`로 다룹니다. (02-4편, 03-1편)

### ⑦ 이동과 화면 전환 함수

| 가져오는 곳 | 이름 | 하는 일 |
| --- | --- | --- |
| `next/link` | `<Link href="/tasks">` | 페이지 전체를 새로 받지 않고 이동하는 링크 |
| `next/navigation` | `redirect("/login")` | 서버에서 다른 주소로 보냄 |
| `next/navigation` | `notFound()` | `not-found.tsx` 화면을 보여 줌 |
| `next/cache` | `revalidatePath("/tasks")` | 저장 뒤 목록을 새로 읽게 함 (02-4편) |

> [!CAUTION]
> Next.js 16은 예전 버전과 다른 규칙이 있습니다. `params`·`searchParams`·`cookies()`는 **`await`해서** 꺼내고, 예전 `middleware.ts`는 **`proxy.ts`** 로 이름이 바뀌었습니다. 인터넷 예제가 예전 버전일 수 있으니, 코드를 쓸 때는 설치된 버전의 문서(`node_modules/next/dist/docs/`)를 먼저 확인합니다.

---

## 6. 작은 업무 화면 하나를 끝까지 읽기

`/tasks` 주소 하나에 지금까지 본 문법이 모두 들어 있습니다. 파일 세 개로 나뉩니다.

```text
app/
├─ layout.tsx               ← 틀 (Next.js ②)
└─ tasks/
   ├─ page.tsx              ← 서버에서 데이터 준비 (Next.js ① ⑤)
   └─ task-list.tsx         ← 브라우저에서 필터 (React ①~⑦, Next.js ⑤ ⑦)
```

```tsx
// app/tasks/page.tsx — Server Component
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "./task-list";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks } = await supabase.from("tasks").select("id, title, status");

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">업무</h1>
      <TaskList tasks={tasks ?? []} />
    </main>
  );
}
```

```tsx
// app/tasks/task-list.tsx — Client Component
"use client";
import { useState } from "react";
import Link from "next/link";

type Task = { id: string; title: string; status: string };

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [onlyDone, setOnlyDone] = useState(false);
  const visible = onlyDone ? tasks.filter((t) => t.status === "DONE") : tasks;

  return (
    <section className="mt-4 space-y-3">
      <button aria-pressed={onlyDone} onClick={() => setOnlyDone(!onlyDone)}>
        {onlyDone ? "전체 보기" : "완료만 보기"}
      </button>

      {visible.length === 0 ? (
        <p>업무가 없습니다.</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <li key={t.id}>
              <Link href={`/tasks/${t.id}`}>{t.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### 사용자가 `/tasks`에 들어왔을 때 일어나는 일

1. **Next.js**가 주소 `/tasks`를 보고 `app/tasks/page.tsx`를 찾습니다. (폴더 = 주소)
2. `TasksPage`는 Server Component이므로 **서버에서** 실행되어 DB에서 업무를 읽습니다.
3. 읽은 업무를 `TaskList`에 **Props**로 넘깁니다. `TaskList`는 `"use client"`라서 이 경계에서 데이터가 브라우저로 전달됩니다.
4. 서버가 완성된 HTML을 먼저 보내고, 브라우저는 `TaskList`의 JavaScript를 받아 버튼이 눌리도록 연결합니다.
5. 사용자가 "완료만 보기"를 누르면 **React**가 `onlyDone` **State**를 바꾸고 `TaskList`만 다시 그립니다. 서버에 다시 묻지 않습니다.
6. 업무 제목을 누르면 **Next.js** `Link`가 `/tasks/{id}`로 이동하고, `app/tasks/[taskId]/page.tsx`가 실행됩니다.

> [!EXAM]
> 1·2·3·6번은 **Next.js**가, 5번은 **React**가 하는 일입니다. 4번은 둘이 함께 합니다.

---

## 7. 02강 문법 지도

| 편 | 주제 | 새로 나오는 문법 | 도구 |
| --- | --- | --- | --- |
| [02-1](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-01) | React 기초 | HTML 태그, JSX 규칙, `{ }`, `? :`·`&&`, `map`·`key`, Component, Props, `useState`, `onClick`·`onChange` | React |
| [02-2](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-02) | App Router | `app/` 폴더, `page.tsx`·`layout.tsx`·`loading.tsx`·`error.tsx`·`not-found.tsx`, `[taskId]`, `(council)`, `await params`, `Link`, `redirect`, `notFound` | Next.js |
| [02-3](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-03) | Server / Client Component | `async` Component, `"use client"`, Props로 경계 넘기기, `server-only` | Next.js + React |
| [02-4](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-04) | 폼과 화면 상태 | `<form action={…}>`, `"use server"`, `FormData`, `useActionState`, `pending`, `revalidatePath` | Next.js + React |
| [02-5](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-05) | Tailwind·접근성·반응형 | `className` 유틸리티 클래스, `md:`·`hover:`·`focus-visible:` 접두어, `aria-*`, `label`·`htmlFor` | Tailwind + HTML |

### 낯선 코드를 만났을 때 읽는 순서

1. **파일 이름과 위치**를 봅니다. `app/…/page.tsx`면 어떤 주소의 화면인지 알 수 있습니다.
2. **맨 위 줄**을 봅니다. `"use client"`면 브라우저, `"use server"`면 서버 함수, 아무것도 없으면 Server Component입니다.
3. **import 줄**을 봅니다. `react`, `next/…`, `@/…` 중 어디서 무엇을 가져오는지 확인합니다.
4. **함수 이름과 Props**를 봅니다. 무엇을 받아서 그리는 Component인지 알 수 있습니다.
5. **`return ( … )` 안의 JSX**를 바깥 태그부터 안쪽으로 읽습니다. 중괄호를 만나면 "여기는 JavaScript 값"이라고 생각합니다.

---

## 8. 확인 문제

> [!QUIZ]
> 다음 중 React가 하는 일과 Next.js가 하는 일을 나누세요.
>
> 1. `app/events/page.tsx` 파일을 만들면 `/events` 주소가 생긴다.
> 2. `setFilter("DONE")`을 부르면 목록이 다시 그려진다.
> 3. 폼의 저장 버튼을 누르면 서버에서 `createTask` 함수가 실행된다.
> 4. `tasks.map`으로 업무 카드 목록을 만든다.

> [!ANSWER]
> - **Next.js**: 1(폴더 = 주소), 3(Server Action)
> - **React**: 2(State가 바뀌면 다시 그림), 4(JSX로 목록 그리기)

> [!QUIZ]
> 다음 각 줄은 어느 문법(HTML·JavaScript·TypeScript·React·Next.js)인가요?
>
> ```tsx
> type Status = "TODO" | "DONE";
> const [open, setOpen] = useState(false);
> import { redirect } from "next/navigation";
> <label htmlFor="title">제목</label>
> const done = tasks.filter((t) => t.status === "DONE");
> ```

> [!ANSWER]
> | 줄 | 문법 |
> | --- | --- |
> | `type Status = …` | TypeScript (타입) |
> | `useState(false)` | React (State Hook) |
> | `from "next/navigation"` | Next.js (서버에서 다른 주소로 보내는 함수) |
> | `<label htmlFor=…>` | HTML 모양의 JSX (HTML의 `for`가 JSX에서 `htmlFor`) |
> | `tasks.filter(…)` | JavaScript (배열 함수) |

> [!QUIZ]
> `app/tasks/page.tsx` 안에서 `useState`를 쓰려고 했더니 오류가 났습니다. 왜 그럴까요? 어떻게 고치나요?

> [!ANSWER]
> `page.tsx`는 표시가 없으므로 **Server Component**입니다. 서버에서 한 번 실행되고 끝나므로, 브라우저에서 바뀌는 값을 기억하는 `useState`를 쓸 수 없습니다. 버튼·입력처럼 State가 필요한 부분을 `task-list.tsx` 같은 별도 파일로 떼어 맨 위에 `"use client"`를 적고, `page.tsx`는 데이터를 준비해 Props로 넘깁니다. 6절의 구조가 이 모양입니다.

## 핵심 정리

| | React | Next.js |
| --- | --- | --- |
| 정체 | 화면 조각을 만드는 **라이브러리** | React 위에 얹은 **프레임워크** |
| 핵심 일 | 데이터가 바뀌면 화면을 다시 그림 | 주소, 서버 실행, 서버 함수, 배포 |
| 대표 문법 | JSX, `{ }`, Component, Props, `useState`, `onClick`, `map`·`key` | `app/` 폴더, `page.tsx`·`layout.tsx`, `[id]`, `"use client"`, `"use server"`, `Link`, `redirect` |
| 가져오는 곳 | `from "react"` | `from "next/…"`, 정해진 파일 이름 |
| 배우는 편 | 02-1 | 02-2 ~ 02-4 |

## 학습 경로

[← 01-5 프론트엔드·백엔드·DB 역할 분담](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-05) · [02-1 React 기초 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-01)
