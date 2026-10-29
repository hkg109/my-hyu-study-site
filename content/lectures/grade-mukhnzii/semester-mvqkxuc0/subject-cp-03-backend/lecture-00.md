---
title: "05 · React UI: 컴포넌트·state·폼"
description: "실제 로그인 UI와 완성된 학습용 업무 폼을 읽으며 컴포넌트·props·state·폼, 화면 상태와 접근성 판단을 익힙니다."
order: 0
published: true
duration: 55
tags: [React, Component, props, state, form, accessibility]
objectives:
  - 화면 전용 Component와 공용 UI의 경계를 설명한다.
  - state와 렌더링 중 계산값을 구분한다.
  - useActionState 폼의 입력·제출 중·실패·성공 상태를 읽는다.
  - 키보드·focus·375px·오류 안내를 PR 기준으로 판단한다.
---

## 1. 이 강의가 필요한 순간

로그인·업무 생성·상태 변경 화면 Issue에서 Component를 어디까지 나눌지, state를 어디에 둘지, 저장 중 중복 클릭과 오류를 어떻게 표현할지 판단할 때 봅니다. [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01)와 [Next.js](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00)를 먼저 읽습니다.

실제 근거는 플랫폼의 [`GoogleLoginButton`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/login/google-login-button.tsx), [`LoginError`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/app/login/login-error.tsx), [`Button`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/components/ui/button.tsx), [`Alert`](https://github.com/INFOSYS-COUNCIL/council-platform/blob/8ea98f2bcddab6db3fda80e0f74881f9917da62f/src/components/ui/alert.tsx)입니다.

> [!CONCEPT]
> **목표:** 사용자의 입력부터 Server Action 결과까지 UI가 어떻게 바뀌는지 읽고, 정상·제출 중·실패·성공·권한 없음을 구분해 설명한다.

## 2. Component·props·state를 구분한다

Component는 화면 조각, props는 부모가 넘기는 읽기 전용 값, state는 사용자 행동 뒤 다음 렌더링에도 기억할 값입니다. 모든 변수를 state로 만들지는 않습니다.

| 값 | state인가 | 이유 |
| --- | --- | --- |
| 로그인 요청 진행 여부 | 예 | 비동기 요청 전후 버튼 문구가 달라짐 |
| 선택한 업무 filter | 예 | 클릭 뒤 다음 렌더링에도 유지 |
| `visibleTasks = tasks.filter(...)` | 아니오 | props와 filter로 매 렌더링 때 계산 가능 |
| `tasks.length === 0` | 아니오 | 이미 있는 배열에서 바로 판단 |
| 서버가 반환한 field error | `useActionState`의 state | 제출 결과를 다음 렌더링에서 보여 줌 |

props나 배열 원소를 직접 바꾸면 React가 변경을 안정적으로 추적하기 어렵고 부모가 소유한 값을 훼손합니다.

```tsx
// 잘못된 변경
task.status = "DONE";

// 기존 배열에서 새 객체와 새 배열을 만든다.
setTasks((current) =>
  current.map((task) =>
    task.id === taskId ? { ...task, status: "DONE" } : task,
  ),
);
```

목록 `key`에는 렌더링 순서가 아니라 DB의 안정적인 `id`를 씁니다. index를 key로 쓰면 정렬·삭제 뒤 다른 행의 입력 state가 붙을 수 있습니다.

## 3. 화면 전용 부품과 공용 부품

플랫폼에서 두 화면 이상이 쓰는 `Button`, `Alert`, `EmptyState`, `PageHeader`는 `src/components/ui/`에 있습니다. 공용 UI는 리드 관리이므로 팀원이 수정하거나 비슷한 사본을 만들지 않습니다. 화면 하나에서만 쓰는 `TaskForm`, `TaskFilter`, `LoginError`는 해당 route 폴더에 둡니다.

분리 기준은 “파일을 짧게 만들기”가 아니라 책임입니다.

| 책임 | 적절한 위치 |
| --- | --- |
| 업무 생성 폼의 label·오류 연결 | `src/app/(member)/tasks/new/task-form.tsx` |
| 업무 생성의 권한·입력 재검증·RPC | 같은 폴더 `actions.ts` |
| 모든 화면이 쓰는 버튼 모양 | `src/components/ui/button.tsx` — 리드 관리 |
| 업무 카드 한 곳에서만 쓰는 상태 badge | 해당 업무 route 폴더 |

## 4. 실제 로그인 UI에서 state와 이벤트 읽기

실제 `GoogleLoginButton`은 `pending`과 `failed` 두 state를 가집니다. 클릭하면 먼저 진행 중 상태로 바꾸고, Supabase OAuth 시작이 실패했을 때만 버튼을 다시 활성화합니다. 성공하면 Google로 페이지가 이동하므로 성공 state를 따로 저장할 필요가 없습니다.

```tsx
// 실제 코드를 읽기 쉽게 축약함.
"use client";

const [pending, setPending] = useState(false);
const [failed, setFailed] = useState(false);

async function handleClick() {
  setPending(true);
  setFailed(false);
  const { error } = await createClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) {
    setPending(false);
    setFailed(true);
  }
}
```

버튼은 `disabled={pending}`이고 문구는 “Google로 이동하는 중…”으로 바뀝니다. 실패 문구는 `role="alert"`로 읽힙니다. 색·spinner만 바꾸는 것보다 현재 상황과 다음 행동이 명확합니다.

## 5. 완성된 폼 구조 읽기

현재 플랫폼에는 업무 생성 RPC가 아직 준비되지 않았습니다. 아래 두 파일은 React 19와 Next.js 16.4.3의 실제 API를 사용하는 **학습용 완성 예시**입니다. Issue가 실제 `create_task` RPC와 허용 파일을 제공했을 때 이름·인자·Role을 생성 타입과 맞춘 뒤 사용할 수 있습니다. 지금 저장소에 이미 존재하는 코드로 오해하면 안 됩니다.

```tsx
// 학습용 예시: src/app/(member)/tasks/new/actions.ts
"use server";

import { refresh } from "next/cache";
import { requireMember } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type TaskFormState = {
  message: string;
  errors?: { title?: string[] };
};

export async function createTask(
  _previous: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  await requireMember("/tasks/new", ["EXECUTIVE", "DIRECTOR"]);
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { message: "입력값을 확인해 주세요.", errors: { title: ["업무 제목을 입력해 주세요."] } };
  }
  if (title.length > 100) {
    return { message: "입력값을 확인해 주세요.", errors: { title: ["업무 제목은 100자 이하여야 합니다."] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_task", { p_title: title });
  if (error) {
    console.error("create_task failed", { code: error.code });
    return { message: "업무를 저장하지 못했습니다. 다시 시도해 주세요." };
  }

  refresh();
  return { message: "업무를 저장했습니다." };
}
```

```tsx
// 학습용 예시: src/app/(member)/tasks/new/task-form.tsx
"use client";

import { useActionState } from "react";
import { createTask, type TaskFormState } from "./actions";

const initialState: TaskFormState = { message: "" };

export function TaskForm() {
  const [state, formAction, pending] = useActionState(createTask, initialState);
  const titleError = state.errors?.title?.[0];

  return (
    <form action={formAction} aria-describedby="form-message">
      <label htmlFor="task-title">업무 제목</label>
      <input
        id="task-title"
        name="title"
        required
        maxLength={100}
        aria-invalid={Boolean(titleError)}
        aria-describedby={titleError ? "task-title-error" : undefined}
        disabled={pending}
      />
      {titleError && <p id="task-title-error">{titleError}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "저장 중…" : "업무 저장"}
      </button>
      <p id="form-message" aria-live="polite">{state.message}</p>
    </form>
  );
}
```

브라우저의 `required`·`maxLength`는 빠른 안내입니다. Server Action은 FormData를 신뢰하지 않고 같은 규칙을 다시 확인합니다. Action은 화면이 구성원 전용이어도 `requireMember`를 다시 호출합니다. DB 함수는 허용 Role·상태 전이·저장 가능한 열을 최종 확인해야 합니다.

## 6. 화면 상태와 접근성 판단표

| 상태 | 사용자가 알아야 할 것 | 적절한 표현 |
| --- | --- | --- |
| 입력 전 | 무엇을 입력하는가 | 보이는 `label`, 도움말 |
| 입력 오류 | 어느 field가 왜 잘못됐는가 | field 가까운 문구, `aria-invalid`, 연결된 설명 |
| 제출 중 | 요청이 진행 중이고 재클릭할 필요 없음 | 버튼 비활성화와 “저장 중…” |
| 저장 실패 | 데이터가 저장되지 않았고 재시도 가능 | Alert/문구, 입력 유지 |
| 저장 성공 | 결과가 반영됨 | `aria-live` 메시지 또는 상세 화면 이동 |
| 권한 없음 | 이 계정으로 접근 불가 | 공용 not-found 정책 |
| 빈 목록 | 정상 조회 결과가 없음 | 공용 EmptyState와 만들기/필터 해제 행동 |

키보드 사용자는 Tab 순서로 모든 입력과 버튼에 도달하고 `focus-visible` 표시를 확인할 수 있어야 합니다. 링크는 주소 이동, 버튼은 현재 화면의 행동에 씁니다. 375px에서는 label·input·button이 한 열로 읽히고 긴 오류가 잘리거나 가로로 화면을 밀지 않아야 합니다.

## 7. 흔한 실수와 해결

| 잘못된 접근 | 문제 | 올바른 접근 |
| --- | --- | --- |
| props·state 객체 직접 변경 | 렌더링 누락과 소유권 혼란 | setter에 새 객체 전달 |
| 계산 가능한 값을 state로 중복 저장 | 두 값이 어긋남 | 렌더링 중 계산 |
| placeholder만 사용 | 입력 후 이름이 사라지고 보조기기 연결이 약함 | 보이는 label |
| 성공·오류를 색으로만 표시 | 색을 구분하지 못하면 의미 소실 | 문구와 의미 있는 속성 |
| client validation만 신뢰 | 직접 Action 호출로 우회 | Action·RPC·RLS 재검증 |
| pending 중 버튼 활성 | 중복 RPC 가능 | `disabled={pending}`와 진행 문구 |

## 8. AI 요청과 PR 설명

계획: “업무 폼의 Component·props·state 경계를 검토해라. 허용 파일은 Issue의 route 폴더뿐이다. 실제 공용 Button·Alert와 준비된 Action/RPC를 먼저 찾고, 공용 UI·DB·패키지는 수정하지 마라. 입력·pending·field error·성공·권한 없음의 표현을 제안해라.”

구현: “React 19의 `useActionState`를 쓰고 label과 error 설명을 연결해라. Server Action에서 입력·로그인·Role을 재검증하고 실제 생성 타입에 있는 RPC만 호출해라. 없는 API는 질문으로 남겨라.”

리뷰: “props 직접 변경, 중복 state, key, label·focus, button/link, 중복 제출, 375px overflow, 서버 검증 누락을 검토해라. 실제 학생 정보와 secret은 출력하지 마라.”

PR에는 state가 필요한 이유, 브라우저와 서버 검증의 차이, 제출 중·실패·성공 결과, 키보드·375px 확인을 적습니다. 다음 강의는 [Supabase](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-00)입니다.

공식 참고: [React state](https://react.dev/learn/managing-state), [React input](https://react.dev/reference/react-dom/components/input), [Next.js forms](https://nextjs.org/docs/app/guides/forms).
