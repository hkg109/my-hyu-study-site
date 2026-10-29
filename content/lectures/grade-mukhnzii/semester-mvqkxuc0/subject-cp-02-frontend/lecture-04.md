---
title: "02-4 · 폼과 화면 상태"
description: "업무 등록 폼을 useActionState와 Server Action으로 연결해 저장 중 표시·중복 제출 방지·필드별 오류·입력값 유지를 구현하고, 로딩·빈 목록·오류·권한 없음·성공의 다섯 화면 상태를 loading.tsx·error.tsx·not-found.tsx와 함께 만드는 법을 익힙니다."
order: 4
published: false
duration: 50
tags: [폼, useActionState, Server Action, revalidatePath, loading, error, 화면 상태]
objectives:
  - useActionState가 돌려주는 세 값(state, action, pending)을 설명한다.
  - Server Action이 돌려준 필드별 오류를 폼에 보여 주는 코드를 읽는다.
  - 저장 뒤 revalidatePath와 redirect가 하는 일을 말한다.
  - 목록 화면의 다섯 상태를 각각 어떤 파일·코드로 처리하는지 말한다.
---

## 1. 폼이 지나가는 길 (복습)

01-5편에서 본 것처럼 폼 제출은 브라우저(입력·형식 확인) → 서버(재검증·DB 호출) → DB(RLS) → 서버(결과) → 브라우저(안내)로 지나갑니다. 이 편은 그중 **브라우저 쪽 화면**을 만듭니다. 서버 쪽 검증 코드는 03-1편에서 자세히 봅니다.

## 2. 업무 등록 폼 전체 코드

```ts
// app/(council)/tasks/new/state.ts  · 폼과 서버가 같이 쓰는 모양
export type TaskFormState = {
  ok: boolean;
  message: string | null;
  fieldErrors: Partial<Record<"title" | "dueDate" | "assigneeId", string>>;
  values: { title: string; dueDate: string; assigneeId: string; visibilityMode: string };
};

export const initialState: TaskFormState = {
  ok: false,
  message: null,
  fieldErrors: {},
  values: { title: "", dueDate: "", assigneeId: "", visibilityMode: "DEFAULT" },
};
```

```tsx
// app/(council)/tasks/new/task-form.tsx
"use client";
import { useActionState } from "react";
import { createTask } from "./actions";
import { initialState } from "./state";

type Option = { id: string; name: string };

export function TaskForm({ assignees }: { assignees: Option[] }) {
  const [state, formAction, pending] = useActionState(createTask, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="title" className="block font-semibold">제목</label>
        <input
          id="title" name="title" defaultValue={state.values.title}
          required maxLength={100}
          aria-invalid={!!state.fieldErrors.title}
          aria-describedby={state.fieldErrors.title ? "title-error" : undefined}
          className="w-full rounded border p-2"
        />
        {state.fieldErrors.title && <p id="title-error" className="text-sm text-red-700">{state.fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="assigneeId" className="block font-semibold">담당자</label>
        <select id="assigneeId" name="assigneeId" defaultValue={state.values.assigneeId} className="w-full rounded border p-2">
          <option value="">나중에 지정</option>
          {assignees.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className="font-semibold">공개 모드</legend>
        <label><input type="radio" name="visibilityMode" value="DEFAULT" defaultChecked={state.values.visibilityMode === "DEFAULT"} /> 기본 공개</label>
        <label><input type="radio" name="visibilityMode" value="RESTRICTED" defaultChecked={state.values.visibilityMode === "RESTRICTED"} /> 제한 공개</label>
        <p className="text-sm text-stone-600">제한 공개는 회장단·생성자·담당자·지정한 사람만 봅니다.</p>
      </fieldset>

      {state.message && <p role="alert" className="rounded bg-red-50 p-2 text-red-800">{state.message}</p>}

      <button type="submit" disabled={pending} className="rounded bg-stone-900 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}
```

| 부분 | 읽는 법 |
| --- | --- |
| `useActionState(createTask, initialState)` | 서버 함수 `createTask`를 폼에 연결. 결과를 `state`로 받음 |
| `state` | 마지막으로 서버가 돌려준 값 (오류, 입력값) |
| `formAction` | `<form action>`에 넣을 함수 |
| `pending` | 서버 응답을 기다리는 중인지 |
| `defaultValue={state.values.title}` | 오류로 돌아왔을 때 **입력한 값을 잃지 않게** |
| `aria-invalid`, `aria-describedby` | 오류가 있는 칸과 그 오류 문구를 화면 낭독기에 연결 |
| `<fieldset>` `<legend>` | 라디오 버튼 묶음과 그 제목 |
| `disabled={pending}` | 저장 중 다시 누르지 못하게 → **중복 제출 방지** |
| `noValidate` | 브라우저 기본 말풍선 대신 우리가 만든 오류 문구를 쓰겠다는 뜻 |

> [!NOTE]
> 담당자 선택 목록(`assignees`)은 서버에서 준비해 Props로 넘깁니다. Event에 속한 업무라면 **그 Event를 열람할 수 있는 사람만** 목록에 넣고, 나머지는 비활성화하고 이유를 보여 줍니다(기획서 1.7절). 서버와 DB도 같은 검사를 다시 합니다.

## 3. 서버 함수가 돌려주는 것

```ts
// app/(council)/tasks/new/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TaskFormState } from "./state";

export async function createTask(prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const values = {
    title: String(formData.get("title") ?? "").trim(),
    dueDate: String(formData.get("dueDate") ?? ""),
    assigneeId: String(formData.get("assigneeId") ?? ""),
    visibilityMode: String(formData.get("visibilityMode") ?? "DEFAULT"),
  };

  const fieldErrors: TaskFormState["fieldErrors"] = {};
  if (!values.title) fieldErrors.title = "제목을 입력하세요.";
  else if (values.title.length > 100) fieldErrors.title = "제목은 100자 이하로 입력하세요.";
  if (Object.keys(fieldErrors).length > 0) return { ok: false, message: null, fieldErrors, values };

  // ... 03-1편: 권한 확인 + DB 저장
  const newId = "…";

  revalidatePath("/tasks");          // 업무 목록 캐시를 버려 다음 방문 때 새로 읽게 함
  redirect(`/tasks/${newId}`);       // 새 업무 상세로 이동
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `prev` | 직전 `state` (useActionState가 넘겨줌) |
| `formData.get("title")` | `<input name="title">`의 값 |
| `return { ..., values }` | 오류일 때 입력값을 그대로 돌려줘 폼이 유지됨 |
| `revalidatePath("/tasks")` | 목록 화면의 저장된 결과를 버림 |
| `redirect(...)` | 성공하면 다른 주소로 이동 (이 뒤 코드는 실행 안 됨) |

## 4. 다섯 가지 화면 상태

기획서와 이전 가이드가 강조한 목록 화면의 다섯 상태를 Next.js 파일로 나눕니다.

| 상태 | 어디서 처리 | 사용자에게 보일 것 |
| --- | --- | --- |
| 로딩 | `loading.tsx` | 뼈대 모양과 "불러오는 중" |
| 목록 | `page.tsx` | 권한 있는 업무와 할 수 있는 조작 |
| 빈 목록 | `page.tsx` 안의 조건 | 아직 업무가 없다는 안내와 다음 행동 |
| 오류 | `error.tsx` | 실패 이유와 다시 시도 버튼 |
| 권한 없음·없음 | `not-found.tsx` 또는 안내 화면 | 접근할 수 없다는 분명한 안내 |

```tsx
// app/(council)/tasks/loading.tsx
export default function Loading() {
  return <p aria-busy="true" className="p-4 text-stone-600">업무를 불러오는 중입니다…</p>;
}
```

```tsx
// app/(council)/tasks/error.tsx
"use client";                                     // error.tsx는 반드시 Client Component
export default function TasksError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div role="alert" className="space-y-2 p-4">
      <p>업무 목록을 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도하세요.</p>
      <button onClick={() => retry()} className="rounded border px-3 py-1">다시 시도</button>
    </div>
  );
}
```

```tsx
// page.tsx 안의 빈 목록
{rows.length === 0 && (
  <div className="rounded border border-dashed p-6 text-center">
    <p>아직 등록된 업무가 없습니다.</p>
    {canCreate && <Link href="/tasks/new" className="underline">첫 업무 만들기</Link>}
  </div>
)}
```

> [!CAUTION]
> 오류 화면에 DB 오류 메시지를 그대로 보여 주지 않습니다. 테이블 이름이나 정책 이름 같은 내부 정보가 새기 때문입니다. 사용자에게는 할 수 있는 행동을, 자세한 내용은 서버 로그에 남깁니다(기획서 12.1절 관측 가능성).

## 5. 저장 중·완료·실패를 정직하게

| 상황 | 하면 안 되는 것 | 해야 하는 것 |
| --- | --- | --- |
| 저장 요청 중 | 버튼을 그대로 둠 | 버튼 잠금, "저장 중…" |
| 서버가 거부 | 입력값 지우기 | 입력값 유지, 이유 안내 |
| 네트워크 끊김 | "저장됨" 표시 | 실패 안내와 다시 시도 |
| 권한 거부 | 무한 재시도 | 재시도 없이 "권한이 없습니다" |

마지막 줄은 회의록 저장에서 특히 중요합니다. 권한이 회수된 사용자의 저장 요청을 계속 재시도하면 안 되고, 편집기를 읽기 전용으로 바꿔야 합니다(05-3편).

> [!QUIZ]
> 사용자가 제목 없이 저장을 눌렀다가 오류를 보고 제목을 넣고 다시 눌렀습니다. 그 사이 담당자 선택이 초기화되지 않으려면 코드의 어느 부분이 필요한가요?

> [!ANSWER]
> 서버 함수가 오류를 돌려줄 때 `values`에 입력값(assigneeId 포함)을 담아 돌려주고, 폼의 `<select>`가 `defaultValue={state.values.assigneeId}`로 그 값을 다시 채우는 부분입니다.

> [!QUIZ]
> `error.tsx`에 `"use client"`가 꼭 필요한 이유는?

> [!ANSWER]
> 오류 화면은 "다시 시도" 버튼(`onClick={() => retry()}`. Next.js 16에서 이름이 `reset`에서 `retry`로 바뀜)처럼 브라우저에서 반응해야 하고, 서버 렌더링 자체가 실패했을 때도 브라우저에서 보여 줘야 하기 때문입니다. Next.js 규칙상 `error.tsx`는 Client Component여야 합니다.

## 학습 경로

[← 02-3 Server/Client Component](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-03) · [02-5 Tailwind·접근성·반응형 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-05)
