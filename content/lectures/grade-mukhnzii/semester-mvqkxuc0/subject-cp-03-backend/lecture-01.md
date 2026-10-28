---
title: "03-1 · Server Action과 Route Handler"
description: "백엔드가 요청을 받는 두 가지 방법인 Server Action과 Route Handler를 비교하고, 업무 생성 Server Action을 '입력 검증 → 로그인 확인 → DB 함수 호출 → 오류 번역 → 캐시 갱신' 다섯 단계로 끝까지 읽습니다. zod로 입력 모양을 검증하는 법과 오류를 사용자에게 안전하게 전하는 법을 익힙니다."
order: 1
published: true
duration: 50
tags: [백엔드, Server Action, Route Handler, 입력 검증, zod, 오류 처리]
objectives:
  - Server Action과 Route Handler를 언제 쓰는지 구분한다.
  - Server Action이 반드시 해야 하는 다섯 단계를 순서대로 말한다.
  - zod 스키마로 폼 입력을 검증하는 코드를 읽는다.
  - DB 오류를 사용자용 문구로 바꾸고 내부 정보는 로그에만 남기는 이유를 설명한다.
---

[![서버 층의 Server Action이 강조된 세 층 지도](/materials/diagrams/cpg-13-stack-back.svg)](/materials/diagrams/cpg-13-stack-back.svg)

*그림 03-1 · 이 과목은 서버 층이다 — 누르면 원본 크기로 열린다.*

## 1. 백엔드가 하는 일

이 프로젝트의 백엔드는 **Vercel에서 실행되는 Next.js 서버 코드**입니다. 따로 Express 같은 서버를 두지 않습니다. 백엔드의 일은 다섯 가지입니다.

1. 사용자가 보낸 값을 **다시 검증**한다 (브라우저 검사는 우회할 수 있으므로)
2. 요청한 사람이 **누구인지** 확인한다 (로그인 쿠키 → JWT)
3. DB에 **일을 시킨다** (그 사람의 자격으로 → RLS 적용)
4. 실패를 **사용자가 이해할 문구로** 바꾼다
5. 화면이 새 데이터를 보도록 **캐시를 갱신**한다

> [!NOTE]
> 권한 판단 자체는 DB의 RLS와 DB 함수가 최종적으로 합니다(04 과목). 백엔드는 그 앞에서 입력을 거르고, 사용자에게 친절한 결과를 돌려주는 역할입니다. 둘 다 같은 규칙을 써야 합니다.

## 2. 요청을 받는 두 가지 방법

| | Server Action | Route Handler |
| --- | --- | --- |
| 파일 | `"use server"`가 붙은 함수 (`actions.ts`) | `app/.../route.ts`의 `GET`·`POST` 함수 |
| 부르는 쪽 | 우리 화면의 폼·버튼 | 누구든 주소로 (외부 서비스, 브라우저 이동) |
| 주고받는 것 | 함수 인자·반환값 (Next.js가 알아서 직렬화) | HTTP 요청·응답을 직접 다룸 |
| 이 프로젝트의 용도 | 업무 저장, 상태 변경, 안건 공개, 회장단 지정 등 **거의 모든 저장** | 로그인 콜백, 상태 확인용 주소, 파일 다운로드 리다이렉트 |

> [!CAUTION]
> Server Action은 **공개된 주소처럼 동작합니다.** 화면에서 버튼을 숨겨도 누구든 그 함수를 직접 호출할 수 있습니다. 그래서 Next.js 문서도 "각 Server Action 안에서 인증과 인가를 확인하라"고 경고합니다.

## 3. 업무 생성 Server Action 끝까지 읽기

```ts
// app/(council)/tasks/new/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toUserMessage } from "@/lib/errors";
import type { TaskFormState } from "./state";

// ① 입력 모양 정의
const TaskInput = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요.").max(100, "제목은 100자 이하입니다."),
  description: z.string().max(5000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식이 올바르지 않습니다.").or(z.literal("")),
  assigneeId: z.string().uuid().or(z.literal("")),
  eventId: z.string().uuid().or(z.literal("")),
  visibilityMode: z.enum(["DEFAULT", "RESTRICTED"]),
});

export async function createTask(prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const raw = {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? undefined,
    dueDate: formData.get("dueDate") ?? "",
    assigneeId: formData.get("assigneeId") ?? "",
    eventId: formData.get("eventId") ?? "",
    visibilityMode: formData.get("visibilityMode") ?? "DEFAULT",
  };

  // ① 검증
  const parsed = TaskInput.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      parsed.error.issues.map((issue) => [issue.path[0], issue.message]),
    );
    return { ok: false, message: null, fieldErrors, values: raw as TaskFormState["values"] };
  }
  const input = parsed.data;

  // ② 로그인 확인
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) redirect("/login");

  // ③ DB 함수 호출 (권한 검사와 저장은 DB가 한 트랜잭션으로)
  const { data: taskId, error } = await supabase.rpc("create_task", {
    p_title: input.title,
    p_description: input.description ?? null,
    p_due_date: input.dueDate || null,
    p_assignee_id: input.assigneeId || null,
    p_event_id: input.eventId || null,
    p_visibility_mode: input.visibilityMode,
  });

  // ④ 오류 번역
  if (error) {
    console.error("create_task failed", { code: error.code, hint: error.hint });   // 서버 로그에만
    return { ok: false, message: toUserMessage(error), fieldErrors: {}, values: raw as TaskFormState["values"] };
  }

  // ⑤ 캐시 갱신과 이동
  revalidatePath("/tasks");
  redirect(`/tasks/${taskId}`);
}
```

### 단계별로 읽기

| 단계 | 코드 | 왜 |
| --- | --- | --- |
| ① 검증 | `TaskInput.safeParse(raw)` | 길이·형식·허용값을 서버에서 다시 확인. 실패하면 칸별 오류를 돌려줌 |
| ② 로그인 확인 | `supabase.auth.getClaims()` | 쿠키 속 JWT의 서명을 검증해 누구인지 확인. 없으면 로그인 화면으로 |
| ③ DB 호출 | `supabase.rpc("create_task", {...})` | 로그인 사용자 자격으로 DB 함수를 부름 → 함수 안에서 RLS와 권한 검사 |
| ④ 오류 번역 | `toUserMessage(error)` | DB 오류 원문 대신 사용자용 문구. 원문은 서버 로그에 |
| ⑤ 갱신 | `revalidatePath`, `redirect` | 목록이 새 업무를 보이게 하고 상세로 이동 |

### zod 읽는 법

| 코드 | 뜻 |
| --- | --- |
| `z.object({...})` | 이런 속성을 가진 객체 |
| `z.string().trim().min(1, "…")` | 글자, 앞뒤 공백 제거, 최소 1자 (아니면 이 문구) |
| `z.enum(["DEFAULT", "RESTRICTED"])` | 이 두 값 중 하나 |
| `.uuid()` | UUID 형식 |
| `.or(z.literal(""))` | 또는 빈 글자 (선택 입력) |
| `.optional()` | 없어도 됨 |
| `safeParse(x)` | 검사해서 `{ success, data }` 또는 `{ success: false, error }` |

> [!NOTE]
> **왜 Server Action이 여러 테이블을 직접 INSERT하지 않고 DB 함수(`rpc`)를 부르나?** 업무 생성은 "Event 열람 가능한 담당자인지 확인 → tasks INSERT → Activity Log 기록"이 **한 번에** 성공하거나 실패해야 합니다. 서버 코드에서 쿼리를 여러 번 보내면 중간에 실패했을 때 반쯤 저장된 상태가 남습니다. DB 함수 안에서 하면 하나의 트랜잭션이 됩니다(04-3편). 기획서도 "변경 가능한 열과 상태 전이는 RPC 또는 Trigger에서 검증"하라고 정합니다.

## 4. 오류를 안전하게 번역하기

```ts
// lib/errors.ts
import type { PostgrestError } from "@supabase/supabase-js";

const messages: Record<string, string> = {
  "42501": "이 작업을 할 권한이 없습니다.",                 // RLS·권한 거부
  "23505": "이미 같은 항목이 있습니다.",                    // UNIQUE 위반
  "23514": "입력값이 규칙에 맞지 않습니다.",                // CHECK 위반
  "P0001": "요청을 처리할 수 없습니다.",                    // DB 함수가 raise exception
};

export function toUserMessage(error: PostgrestError): string {
  if (error.code === "P0001" && error.message.startsWith("USER:")) {
    return error.message.slice(5);                        // DB 함수가 사용자용으로 만든 문구만 그대로
  }
  return messages[error.code] ?? "잠시 후 다시 시도하세요.";
}
```

- DB 함수는 사용자에게 보여 줘도 되는 이유를 `raise exception 'USER:담당자가 이 행사를 볼 수 없습니다.'`처럼 접두어를 붙여 던집니다(04-4편).
- 그 외 오류 원문(테이블 이름, 정책 이름, SQL)은 화면에 보내지 않고 서버 로그에만 남깁니다.
- 기획서 12.1절: Auth 실패, RLS 거부, 저장 실패를 **민감 정보 없이 구조화해** 기록합니다. 로그에 이메일·본문·토큰을 넣지 않습니다.

## 5. Route Handler 예 — 상태 확인 주소

```ts
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  const { error } = await supabase.from("terms").select("id", { head: true, count: "exact" }).limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 503 : 200 });
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `export async function GET()` | 이 주소로 GET 요청이 오면 실행 |
| `{ head: true }` | 행 내용은 받지 않고 요청만 (가벼움) |
| `NextResponse.json(값, { status })` | JSON 응답과 상태 코드 |

로그인하지 않은 공개 키 요청이라 RLS 때문에 `terms` 내용은 보이지 않지만, DB가 응답하는지는 알 수 있습니다. 07-3편에서 Supabase 무료 요금제의 **1주일 비활성 일시 중지**를 막는 정기 요청에 이 주소를 씁니다. 로그인 콜백 Route Handler는 03-3편에서 봅니다.

## 6. 직접 해보기

1. 업무 상태 변경 Server Action `updateTaskStatus(taskId, status)`를 써 보세요. `status`는 `z.enum`으로 네 값만 허용합니다.
2. 국원이 자기 담당이 아닌 업무의 상태를 바꾸려 할 때, ① 화면 ② Server Action ③ DB 중 어디서 막혀야 하는지 적어 보세요.

> [!QUIZ]
> 직접 해보기 2번의 답은? 그리고 ③만 있고 ①②가 없으면 무슨 문제가 있나요?

> [!ANSWER]
> ① 화면은 그 버튼을 보여 주지 않고(편의), ② Server Action은 입력 형식을 검증하고 DB 함수를 부르며, ③ DB 함수와 RLS가 "본인 담당 업무인지"를 최종 판정해 거부합니다. 보안은 ③만으로도 지켜지지만, ①②가 없으면 사용자가 누를 수 없는 버튼을 누르고 이해하기 어려운 오류를 보게 됩니다. 반대로 ①②만 있고 ③이 없으면 직접 요청으로 우회됩니다.

> [!QUIZ]
> `console.error("create_task failed", { title: input.title, email: claims.email })`처럼 로그를 남기면 무엇이 문제인가요?

> [!ANSWER]
> 업무 제목(민감한 계약 업무일 수 있음)과 이메일(개인정보)이 로그에 남습니다. Vercel 로그는 프로젝트 관리자가 볼 수 있고 오래 보관될 수 있습니다. 오류 코드, 요청 ID, 자원 ID처럼 문제를 찾는 데 필요한 최소 정보만 남깁니다.

## 학습 경로

[← 02-5 Tailwind·접근성·반응형](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-05) · [03-2 Supabase 클라이언트와 환경변수 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-02)
