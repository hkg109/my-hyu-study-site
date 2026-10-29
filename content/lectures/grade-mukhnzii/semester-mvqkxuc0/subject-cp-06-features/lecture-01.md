---
title: "06-1 · 업무(Task) 따라가기"
description: "업무 목록·상세·상태 변경·공개 모드 전환·열람자 지정·보관과 복원을 화면 → Server Action → DB 함수·RLS 순서로 처음부터 끝까지 따라갑니다. 역할별로 바꿀 수 있는 필드, DONE 재오픈, RESTRICTED 전환 미리보기, Event 범위 안에서만 담당자를 고르는 규칙을 한 기능 위에서 묶습니다."
order: 1
published: false
duration: 50
tags: [Task, 기능 구현, 공개 모드, ACL, 보관, 상태 전이]
objectives:
  - 업무 기능의 화면·서버·DB 파일 구성을 말한다.
  - 역할별로 바꿀 수 있는 필드를 DB 함수에서 검사하는 코드를 읽는다.
  - RESTRICTED로 바꿀 때 미리보기를 보여 주는 이유와 방법을 말한다.
  - 담당자 선택 목록을 Event 열람자로 제한하는 세 지점을 말한다.
---

## 이 편의 지도

| 층 | 파일 | 하는 일 |
| --- | --- | --- |
| 화면 | `app/(council)/tasks/page.tsx`, `task-list.tsx` | 목록·필터 (02-1, 02-3) |
| 화면 | `app/(council)/tasks/[taskId]/page.tsx`, `status-buttons.tsx`, `access-editor.tsx` | 상세·상태 버튼·열람자 지정 |
| 서버 | `app/(council)/tasks/actions.ts` | 입력 검증 → DB 함수 호출 → 갱신 |
| DB | `create_task`, `update_task_status`, `update_task_fields`, `set_task_access`, `archive_task` | 권한·필드·상태 검사 + 기록 |
| DB | `private.can_read_task`, `private.can_manage_task` | 읽기·관리 판정 (04-4) |

## 1. 상태 흐름

[![TODO, IN_PROGRESS, REVIEW, DONE 네 상태와 DONE에서 재개하는 고리, 어느 상태에서든 보관·복원, 역할별로 고칠 수 있는 필드](/materials/diagrams/cpg-06a-task-lifecycle.svg)](/materials/diagrams/cpg-06a-task-lifecycle.svg)

*그림 06-1 · 업무의 상태와 되돌리기 — 누르면 원본 크기로 열린다.*

- DONE은 잠금이 아닙니다. 권한자는 IN_PROGRESS로 **재개**할 수 있고 Activity Log에 `reopen`으로 남습니다.
- 지우지 않고 `archived_at`으로 **보관**합니다. 복원도 가능합니다.

## 2. 상세 화면 — 할 수 있는 것만 보여 주기

```tsx
// app/(council)/tasks/[taskId]/page.tsx  · 서버
export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const supabase = await createClient();

  const [{ data: task }, { data: perms }] = await Promise.all([
    supabase.from("tasks").select("id, title, description, status, visibility_mode, due_date, event_id, department_id, assignee:profiles!assignee_id(display_name)").eq("id", taskId).maybeSingle(),
    supabase.rpc("task_permissions", { p_task_id: taskId }),     // { can_change_status, can_edit_fields, can_manage_access, can_archive }
  ]);
  if (!task) notFound();

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p>담당: {task.assignee?.display_name ?? "재배정 필요"} · 공개: {task.visibility_mode === "RESTRICTED" ? "제한 공개" : "기본 공개"}</p>
      {perms?.can_change_status && <StatusButtons taskId={task.id} current={task.status} />}
      {perms?.can_manage_access && <AccessEditor taskId={task.id} mode={task.visibility_mode} />}
    </article>
  );
}
```

| 코드 | 읽는 법 |
| --- | --- |
| `Promise.all([...])` | 두 요청을 동시에 보내고 둘 다 기다림 |
| `rpc("task_permissions")` | DB가 **같은 권한 함수**로 계산한 "이 사람이 이 업무에서 할 수 있는 일" (기획서 1.4절: Frontend는 계산된 Permission으로 버튼 표시) |
| `perms.can_change_status && <StatusButtons/>` | 할 수 없는 버튼은 아예 그리지 않음 (편의) |

## 3. 상태 버튼 → Server Action → DB

```tsx
// status-buttons.tsx
"use client";
import { useTransition } from "react";
import { changeStatus } from "../actions";

const NEXT: Record<string, { to: string; label: string }[]> = {
  TODO:        [{ to: "IN_PROGRESS", label: "시작" }],
  IN_PROGRESS: [{ to: "REVIEW", label: "검토 요청" }, { to: "DONE", label: "완료" }],
  REVIEW:      [{ to: "IN_PROGRESS", label: "다시 작업" }, { to: "DONE", label: "완료" }],
  DONE:        [{ to: "IN_PROGRESS", label: "재개" }],
};

export function StatusButtons({ taskId, current }: { taskId: string; current: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      {NEXT[current].map((n) => (
        <button key={n.to} disabled={pending} onClick={() => start(() => changeStatus(taskId, n.to))}>
          {n.label}
        </button>
      ))}
    </div>
  );
}
```

```ts
// actions.ts
"use server";
const Status = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]);

export async function changeStatus(taskId: string, status: string) {
  const parsed = z.object({ taskId: z.string().uuid(), status: Status }).safeParse({ taskId, status });
  if (!parsed.success) return { ok: false, message: "잘못된 요청입니다." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_task_status", { p_task_id: taskId, p_status: status });
  if (error) return { ok: false, message: toUserMessage(error) };

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  return { ok: true, message: null };
}
```

DB의 `update_task_status`는 04-4편에서 본 그대로입니다: 행 잠금 → 열람 가능 확인 → ACTIVE 기수 확인 → **MEMBER는 본인 담당만, DIRECTOR는 관리 가능한 업무, EXECUTIVE는 전체** → 변경 → `reopen` 또는 `status.change` 기록.

`useTransition`은 서버 요청을 기다리는 동안 `pending`을 true로 만들어 버튼을 잠급니다(중복 클릭 방지).

## 4. 필드별 권한 — 제목·담당자·마감일

기획서 4.6절의 표를 DB 함수가 그대로 검사합니다.

```sql
create function public.update_task_fields(
  p_task_id uuid, p_title text, p_description text, p_assignee_id uuid, p_due_date date
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  t public.tasks%rowtype;
  can_manage boolean;
  is_assignee boolean;
begin
  select * into t from public.tasks where id = p_task_id for update;
  if not found or not private.can_read_task(p_task_id) then
    raise exception 'USER:업무를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;

  can_manage  := private.can_manage_task(p_task_id);          -- 국장(관리 가능) 또는 회장단
  is_assignee := t.assignee_id = (select auth.uid());

  -- 제목·담당자·마감일: 관리자만
  if (p_title is distinct from t.title or p_assignee_id is distinct from t.assignee_id
      or p_due_date is distinct from t.due_date) and not can_manage then
    raise exception 'USER:제목·담당자·마감일은 국장 이상만 바꿀 수 있습니다.' using errcode = 'P0001';
  end if;

  -- 설명: 관리자 또는 본인 담당
  if p_description is distinct from t.description and not (can_manage or is_assignee) then
    raise exception 'USER:설명을 바꿀 권한이 없습니다.' using errcode = 'P0001';
  end if;

  -- 담당자는 Event를 볼 수 있는 같은 기수 구성원만 (기획서 1.7절)
  if p_assignee_id is distinct from t.assignee_id and p_assignee_id is not null
     and not private.user_can_read_task_scope(p_assignee_id, t.term_id, t.event_id) then
    raise exception 'USER:담당자가 이 행사를 볼 수 없습니다. 행사 열람 대상에 먼저 추가하세요.' using errcode = 'P0001';
  end if;

  update public.tasks set title = p_title, description = p_description, assignee_id = p_assignee_id,
         due_date = p_due_date, updated_at = now()
  where id = p_task_id;

  perform private.log_activity(t.term_id, 'task', t.id, 'fields.change',
    jsonb_build_object('assignee_id', t.assignee_id, 'due_date', t.due_date),
    jsonb_build_object('assignee_id', p_assignee_id, 'due_date', p_due_date));
end;
$$;
```

| 부분 | 읽는 법 |
| --- | --- |
| `a is distinct from b` | null까지 고려한 "다르다" (`<>`는 null과 비교하면 알 수 없음이 됨) |
| 바뀐 필드만 권한 검사 | 국원이 설명만 고친 요청에 같은 제목이 들어 있어도 거부되지 않음 |
| `user_can_read_task_scope` | **지정받는 사람** 기준으로 Event 열람 가능 여부 판단 |
| Activity Log에 본문 대신 바뀐 ID·날짜만 | 기획서 10.3절 |

### 담당자 목록은 세 곳에서 걸러진다

| 지점 | 하는 일 |
| --- | --- |
| 화면 | Event를 볼 수 없는 사람은 목록에서 비활성화 + "행사 열람 대상이 아님" 표시 |
| 서버 | 선택 값이 UUID인지 검증 |
| DB 함수 | 실제로 Event를 볼 수 있는지 판정, 아니면 거부 |

## 5. 공개 모드와 열람자 지정

```ts
// actions.ts — RESTRICTED로 바꾸기 전에 미리보기
export async function previewRestrict(taskId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("preview_task_access", { p_task_id: taskId, p_mode: "RESTRICTED" });
  return data;   // { keeps: [{name, reason}], loses: [{name, reason}] }
}
```

```tsx
// access-editor.tsx (일부)
{preview && (
  <div role="dialog" aria-labelledby="restrict-title" className="rounded border p-4">
    <h2 id="restrict-title" className="font-bold">제한 공개로 바꾸면</h2>
    <p>계속 볼 수 있는 사람: 회장단, 생성자, 담당자{preview.keeps.length > 0 && `, ${preview.keeps.map((k) => k.name).join(", ")}`}</p>
    <p className="text-danger">더 이상 볼 수 없는 사람: {preview.loses.map((l) => l.name).join(", ") || "없음"}</p>
    <Button onClick={confirmRestrict}>제한 공개로 바꾸기</Button>
  </div>
)}
```

기획서 4.2절: ==제한 공개로 바꿀 때 기존 ACL과 담당자 목록을 미리 보여 주어 의도하지 않은 공개가 남지 않게 한다.== 미리보기와 실제 변경은 **같은 권한 함수**로 계산하므로, 미리보기에서 본 결과와 실제 결과가 다르지 않습니다.

열람자 지정(`set_task_access`)은 기획서 4.5절대로 EXECUTIVE는 전체, DIRECTOR는 DEFAULT 자기 국 업무 또는 자신이 `manager_id`인 RESTRICTED 업무만 할 수 있고, 대상은 Event 열람자 중에서만 고를 수 있습니다. 변경 전후 대상 목록은 Activity Log에 남깁니다.

## 6. 보관과 복원

```ts
export async function archiveTask(taskId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("archive_task", { p_task_id: taskId, p_archive: true });
  if (error) return { ok: false, message: toUserMessage(error) };
  revalidatePath("/tasks");
  redirect("/tasks");
}
```

- 보관된 업무는 일반 목록에서 숨고(`archived_at is null` 조건), 회장단은 "보관함"에서 보고 복원할 수 있습니다.
- 물리 삭제 함수는 만들지 않습니다(기획서 4.6절 MVP).

## 7. 이 기능의 테스트 목록

| 사례 | 기대 |
| --- | --- |
| 국원 A가 자기 담당 업무 상태 변경 | 성공 |
| 국원 A가 자기 담당 업무 마감일 변경 | 거부 ("국장 이상만") |
| 국원 A가 다른 국 DEFAULT 업무 조회 | 0건 |
| 국장이 RESTRICTED로 전환 후 같은 국 국원 조회 | 0건 (ACL에 없으면) |
| 국장이 Event를 못 보는 사람을 담당자로 지정 | 거부 |
| DONE → IN_PROGRESS 재개 | 성공 + Activity Log `reopen` |
| CLOSED 기수의 업무 상태 변경 | 거부 |

> [!QUIZ]
> 국원이 개발자 도구로 `update_task_fields`를 직접 불러 자기 담당 업무의 마감일을 바꾸려 합니다. 어디서 어떻게 막히나요?

> [!ANSWER]
> DB 함수 안에서 막힙니다. 마감일이 기존 값과 다르므로(`is distinct from`) 관리 권한(`can_manage_task`)을 확인하는데, 국원은 관리자가 아니므로 `USER:제목·담당자·마감일은 국장 이상만…` 예외가 납니다. 화면 버튼 숨김이나 Server Action을 거치지 않아도 결과는 같습니다.

> [!QUIZ]
> 미리보기(`preview_task_access`)와 실제 변경(`set_task_visibility`)이 각자 다른 계산 로직을 가지면 어떤 사고가 날 수 있나요?

> [!ANSWER]
> 미리보기에서는 "홍보국원 B는 더 이상 못 봄"이라고 나왔는데 실제 규칙은 B를 계속 보게 하는 식으로 어긋날 수 있습니다. 관리자는 민감 업무가 닫혔다고 믿지만 실제로는 열려 있게 됩니다. 그래서 둘 다 같은 `private.can_read_task` 계열 함수로 계산합니다(기획서 원칙: 권한 규칙 단일화).

## 학습 경로

[← 05-3 저장·전파·복구](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-03) · [06-2 행사 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-02)
