---
title: "02-1 · React 기초"
description: "Component·JSX·Props·State·이벤트·목록 렌더링과 key를 학생회 업무 카드와 업무 목록 필터로 익힙니다. React가 State 변화를 보고 화면을 다시 그리는 원리와, 원본을 직접 바꾸면 안 되는 이유를 코드로 확인합니다."
order: 1
published: true
duration: 50
tags: [React, Component, JSX, Props, State, useState]
objectives:
  - JSX를 HTML과 비교해 읽고, 중괄호 안에 JavaScript가 들어가는 규칙을 말한다.
  - Props와 State를 업무 화면의 예로 구분한다.
  - useState로 필터를 만들고, 상태가 바뀌면 화면이 다시 그려지는 순서를 설명한다.
  - 목록 렌더링에서 key가 필요한 이유를 말한다.
---

[![브라우저 층의 React 화면과 Tailwind CSS가 강조된 세 층 지도](/materials/diagrams/cpg-12-stack-front.svg)](/materials/diagrams/cpg-12-stack-front.svg)

*그림 02-1 · 이 과목은 브라우저 층이다 — 누르면 원본 크기로 열린다.*

## 1. 프론트엔드에서 React가 하는 일

React는 화면을 **Component**라는 작은 조각으로 나눠 만드는 라이브러리입니다. 개발자는 "데이터가 이럴 때 화면은 이렇게 생긴다"만 적고, 데이터가 바뀌면 React가 알아서 화면을 다시 그립니다.

```text
업무 목록 화면 (TaskListPage)
├─ FilterBar        ← 상태 필터 버튼들
└─ TaskList
   ├─ TaskCard      ← 업무 하나
   ├─ TaskCard
   └─ TaskCard
```

## 2. Component와 JSX

```tsx
// components/task-card.tsx
type TaskCardProps = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  assigneeName: string | null;
};

export function TaskCard({ title, status, assigneeName }: TaskCardProps) {
  const label = { TODO: "할 일", IN_PROGRESS: "진행 중", REVIEW: "검토 중", DONE: "완료" }[status];

  return (
    <li className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-stone-600">{assigneeName ?? "담당자 재배정 필요"}</p>
      </div>
      <span className="rounded bg-stone-900 px-2 text-sm text-white">{label}</span>
    </li>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `type TaskCardProps = {...}` | 이 Component가 받을 값의 모양 (01-4편) |
| `export function TaskCard(...)` | Component는 **대문자로 시작하는 함수** |
| `({ title, status, assigneeName }: TaskCardProps)` | 받은 Props를 구조 분해 (01-3편) |
| `return ( <li>...</li> )` | 화면 모양을 돌려줌. 이 HTML 같은 문법이 **JSX** |
| `className=` | HTML의 `class`. JSX에서는 `className`으로 씀 |
| `{title}` | 중괄호 안은 JavaScript 값. 글자가 화면에 들어감 |
| `{assigneeName ?? "..."}` | 담당자가 null이면 안내 문구 |

### JSX가 HTML과 다른 점

| HTML | JSX |
| --- | --- |
| `class="..."` | `className="..."` |
| `for="title"` | `htmlFor="title"` |
| `<input>` | `<input />` (스스로 닫아야 함) |
| `onclick="..."` | `onClick={함수}` |
| `style="color: red"` | `style={{ color: "red" }}` |
| 글자 그대로 | `{ }` 안에 JavaScript 식 |

## 3. Props — 부모가 넘겨주는 값

```tsx
<TaskCard title="축제 부스 배치도" status="IN_PROGRESS" assigneeName="김국원" />
```

- Props는 **부모 Component가 자식에게 넘기는 값**입니다.
- 자식은 Props를 **읽기만** 합니다. 바꾸고 싶으면 부모에게 "바꿔 달라"는 함수를 Props로 받아 부릅니다.

## 4. State — Component가 기억하는 바뀌는 값

```tsx
"use client";
import { useState } from "react";

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type Task = { id: string; title: string; status: Status; assigneeName: string | null };

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const visible = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <section>
      <div role="group" aria-label="상태 필터" className="flex gap-2">
        {(["ALL", "TODO", "IN_PROGRESS", "DONE"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === "ALL" ? "전체" : value}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p>조건에 맞는 업무가 없습니다.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((t) => (
            <TaskCard key={t.id} title={t.title} status={t.status} assigneeName={t.assigneeName} />
          ))}
        </ul>
      )}
    </section>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `"use client"` | 이 파일은 브라우저에서 실행 (State와 클릭이 있으므로) |
| `const [filter, setFilter] = useState(…)` | 현재 값 `filter`와 바꾸는 함수 `setFilter`. 꺾쇠 안은 허용하는 값의 타입, 괄호 안 `"ALL"`이 처음 값 |
| `const visible = ...` | State로부터 **계산한** 값. 따로 State로 두지 않음 |
| `onClick={() => setFilter(value)}` | 누르면 State를 바꿈 → 화면이 다시 그려짐 |
| `aria-pressed` | 화면 낭독기에 "눌린 버튼"임을 알려 줌 |
| `조건 ? A : B` | 빈 목록이면 안내, 아니면 목록 |
| `visible.map((t) => <TaskCard key={t.id} ... />)` | 배열을 Component 목록으로 바꿈 |

### 다시 그려지는 순서

1. 사용자가 "진행 중" 버튼을 누릅니다.
2. `setFilter("IN_PROGRESS")`가 실행됩니다.
3. React가 `TaskList` 함수를 **다시 실행**합니다. 이번에는 `filter`가 `"IN_PROGRESS"`입니다.
4. 새로 계산된 `visible`로 만든 JSX와 이전 화면을 비교해, **바뀐 부분만** 실제 화면에 반영합니다.

> [!EXAM]
> **Props vs State**
> - Props: 밖에서 받은 값. 읽기만 한다. 예: `TaskCard`가 받는 제목·상태.
> - State: 이 Component가 기억하는 바뀌는 값. `set함수`로만 바꾼다. 예: 필터 선택값, 입력 중인 글자, 열림/닫힘.

## 5. key — 목록의 각 항목에 붙이는 이름표

`map`으로 목록을 만들 때는 각 항목에 **변하지 않는 고유한** `key`를 붙입니다. React는 key로 "어느 카드가 그대로이고 어느 카드가 새로 생겼는지" 구별합니다.

| key로 쓰면 | 결과 |
| --- | --- |
| `t.id` (DB의 고유 ID) | ✅ 올바름 |
| 배열 번호 `index` | ⚠️ 필터나 정렬이 바뀌면 다른 카드의 입력 상태가 엉뚱한 카드에 붙음 |
| `Math.random()` | ❌ 그릴 때마다 바뀌어 모든 카드를 새로 만듦 |

## 6. State는 새 값으로 바꾼다

```tsx
const [tasks, setTasks] = useState<Task[]>(initialTasks);

// ❌ 원본을 직접 바꿈 → React가 바뀐 것을 모름
tasks[0].status = "DONE";
setTasks(tasks);

// ✅ 바뀐 항목만 새 객체로, 배열도 새 배열로
setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "DONE" } : t)));
```

`setTasks((prev) => ...)`처럼 함수를 넘기면 "가장 최신 값을 받아 새 값을 만든다"는 뜻입니다. 빠르게 여러 번 바뀔 때 안전합니다.

## 7. 이벤트와 Effect

```tsx
<input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
```

- `onChange`, `onClick`, `onSubmit`처럼 `on`으로 시작하는 Props가 이벤트입니다.
- `e.target.value`는 입력창의 현재 글자입니다.

`useEffect`는 "화면을 그린 **뒤에** 바깥 세계와 연결할 일"(Realtime 구독, 타이머 등)에 씁니다. 05-3편 회의록 채널 구독에서 다시 나옵니다. 데이터를 불러오는 일은 Next.js에서는 대부분 서버에서 하므로(02-3편) `useEffect`로 데이터를 불러오는 코드는 이 프로젝트에서 거의 쓰지 않습니다.

## 8. 직접 해보기

1. `TaskCard`에 마감일(`dueDate: string | null`)을 Props로 추가하고, 마감이 지났으면 "기한 초과" 글자를 붙여 보세요.
2. `TaskList`에 제목 검색 입력창을 추가해 보세요. 검색어는 State, 보이는 목록은 계산값입니다. (기획서: MVP 검색은 목록별 제목 필터만)

> [!QUIZ]
> 필터와 검색어가 있을 때 "보이는 업무 목록"을 State로 따로 두면 안 되는 이유는?

> [!ANSWER]
> 보이는 목록은 `tasks`, `filter`, `keyword`로부터 **언제든 계산할 수 있는 값**입니다. 따로 State로 두면 셋 중 하나가 바뀔 때마다 그것도 맞춰 바꿔야 하고, 하나라도 빼먹으면 화면이 실제 데이터와 어긋납니다. 계산할 수 있는 값은 그리는 중에 계산합니다.

> [!QUIZ]
> `TaskCard` 안에서 `title = "수정됨"`처럼 Props를 직접 바꾸려 하면 어떻게 해야 하나요?

> [!ANSWER]
> Props는 읽기 전용이라 직접 바꾸지 않습니다. 값을 가진 부모가 `onRename` 같은 함수를 Props로 내려 주고, 자식은 그 함수를 부릅니다. 부모가 자기 State를 바꾸면 새 Props로 자식이 다시 그려집니다. 실제 저장이 필요하면 그 함수가 Server Action을 부릅니다(02-4편).

## 학습 경로

[← 01-5 프론트엔드·백엔드·DB 역할 분담](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-05) · [02-2 Next.js App Router →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-02)
