---
title: "06-3 · 안건과 회의록 따라가기"
description: "추가 결정 4(국장 이상이 안건을 먼저 쓰고, 회의록은 그 안건 위에서 시작)를 화면 → 서버 → DB로 구현합니다. 안건 작성·공개, 안건에서 회의록 만들기(서버가 Template+안건으로 초기 Snapshot 생성), 열람 Preset과 편집자 지정, 확정·되돌리기까지 회의록의 한살이를 따라갑니다."
order: 3
published: false
duration: 55
tags: [회의 안건, 회의록, 초기 Snapshot, 열람 Preset, 편집자, 회의록 상태]
objectives:
  - 안건의 세 상태(DRAFT·PUBLISHED·CLOSED)와 각 상태에서 할 수 있는 일을 말한다.
  - 안건에서 회의록을 만들 때 한 트랜잭션에서 일어나는 일을 순서대로 말한다.
  - 초기 Snapshot을 서버가 만들어야 하는 이유를 설명한다.
  - 회의록 열람 Preset 네 가지와 항상 포함되는 사람, 확정·되돌리기 규칙을 말한다.
---

## 이 편의 지도

[![국장 이상이 안건을 작성해 공개하면, 회의록을 만들 때 서버가 Template과 안건 항목을 합친 초기 Snapshot을 만들고 공동 편집이 시작되는 흐름](/materials/diagrams/cpg-18-agenda-minutes.svg)](/materials/diagrams/cpg-18-agenda-minutes.svg)

*그림 06-3 · 안건이 먼저, 회의록은 그 위에 — 누르면 원본 크기로 열린다.*

| 층 | 파일·함수 | 하는 일 |
| --- | --- | --- |
| 화면 | `/meetings/agendas`, `/meetings/agendas/new`, `/meetings/agendas/[agendaId]` | 안건 목록·작성·공개·회의록 만들기 |
| 화면 | `/meetings/[meetingId]` | 회의록 에디터 (05 과목) |
| 서버 | `meetings/actions.ts` | 검증, Template+안건 → 초기 Snapshot 바이트 생성 |
| DB | `save_agenda`, `publish_agenda`, `create_meeting_from_agenda`, `confirm_meeting`, `reopen_meeting` | 권한·상태 검사, 한 트랜잭션 처리, 기록 |

## 1. 안건의 상태

| 상태 | 누가 보나 | 누가 고치나 | 다음 |
| --- | --- | --- | --- |
| `DRAFT` | 작성자, 회장단 | 작성자, 회장단 | 공개 |
| `PUBLISHED` | 고른 Preset 범위 + 작성자 + 회장단 | 작성자, 회장단 (회의 전 수정) | 회의록 만들기 |
| `CLOSED` | 위와 같음 (읽기 전용) | 아무도 | — |

작성 권한: **국장(DIRECTOR) 이상**. 국원은 안건을 만들 수 없고, PUBLISHED 안건을 읽을 수만 있습니다.

## 2. 안건 작성 화면

```tsx
// app/(council)/meetings/agendas/new/agenda-form.tsx
"use client";
import { useState } from "react";
import { saveAgenda } from "../../actions";

type Item = { key: string; title: string; description: string };

export function AgendaForm({ departments }: { departments: { id: string; name: string }[] }) {
  const [items, setItems] = useState<Item[]>([{ key: crypto.randomUUID(), title: "", description: "" }]);

  const update = (key: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  const move = (index: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];   // 자리 바꾸기
      return next;
    });

  return (
    <form action={(fd) => saveAgenda(fd, items)} className="space-y-4">
      <label htmlFor="title">회의 이름</label>
      <input id="title" name="title" required className="w-full rounded border p-2" />
      <label htmlFor="meetingAt">회의 일시</label>
      <input id="meetingAt" name="meetingAt" type="datetime-local" required />

      <fieldset>
        <legend className="font-semibold">안건</legend>
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={it.key} className="rounded border p-3">
              <label htmlFor={`t-${it.key}`}>안건 {i + 1} 제목</label>
              <input id={`t-${it.key}`} value={it.title} onChange={(e) => update(it.key, { title: e.target.value })} />
              <label htmlFor={`d-${it.key}`}>설명 (선택)</label>
              <textarea id={`d-${it.key}`} value={it.description} onChange={(e) => update(it.key, { description: e.target.value })} />
              <div className="flex gap-2">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`안건 ${i + 1} 위로`}>↑</button>
                <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`안건 ${i + 1} 아래로`}>↓</button>
                <button type="button" onClick={() => setItems((p) => p.filter((x) => x.key !== it.key))}>삭제</button>
              </div>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setItems((p) => [...p, { key: crypto.randomUUID(), title: "", description: "" }])}>
          안건 추가
        </button>
      </fieldset>

      <AccessPresetPicker departments={departments} />   {/* 전체 · 특정 국(여러 개) · 국장단 · 회장단 */}
      <button type="submit">임시 저장</button>
    </form>
  );
}
```

| 코드 | 읽는 법 |
| --- | --- |
| `useState<Item[]>` | 안건 항목 목록을 화면 State로 (02-1) |
| `key: crypto.randomUUID()` | 순서를 바꿔도 각 항목을 구별하는 key (배열 번호를 쓰면 입력이 엉뚱한 칸으로 감) |
| `[a, b] = [b, a]` | 구조 분해로 두 자리 바꾸기 (01-3) |
| `↑` `↓` 버튼에 `aria-label` | 아이콘 버튼도 낭독기가 읽게 (02-5). 끌어 놓기 대신 버튼으로 순서를 바꿔 키보드만으로 가능 |
| `action={(fd) => saveAgenda(fd, items)}` | 폼 값과 항목 목록을 함께 Server Action으로 |

```ts
// actions.ts
const AgendaInput = z.object({
  title: z.string().trim().min(1).max(100),
  meetingAt: z.string().min(1),
  items: z.array(z.object({ title: z.string().trim().min(1).max(200), description: z.string().max(2000) })).min(1).max(30),
  preset: z.enum(["ALL", "DEPARTMENTS", "DIRECTORS", "EXECUTIVES"]),
  departmentIds: z.array(z.string().uuid()).default([]),
}).refine((v) => v.preset !== "DEPARTMENTS" || v.departmentIds.length > 0, { message: "국을 하나 이상 고르세요.", path: ["departmentIds"] });
```

`save_agenda` DB 함수는 DIRECTOR 이상인지, 수정이면 작성자 또는 회장단인지, 상태가 CLOSED가 아닌지 검사하고 안건·항목·열람 규칙을 한 번에 저장합니다. 열람 Preset은 회의록과 같은 규칙으로 `meeting_agenda_access_rules`에 저장합니다.

## 3. 안건에서 회의록 만들기

안건 상세의 "회의록 만들기" 버튼은 **안건 작성자 또는 회장단**에게만 보입니다.

```ts
// actions.ts
import * as Y from "yjs";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import { meetingSchema } from "@/components/editor/schema";
import { agendaToBlocks } from "@/lib/meetings/agenda-blocks";

export async function createMeetingFromAgenda(agendaId: string, templateId: string | null) {
  const supabase = await createClient();

  // 1) 안건과 Template 읽기 (RLS 통과해야 보임)
  const { data: agenda } = await supabase
    .from("meeting_agendas")
    .select("id, title, meeting_at, status, items:meeting_agenda_items(title, description, sort_order)")
    .eq("id", agendaId).maybeSingle();
  if (!agenda || agenda.status !== "PUBLISHED") return { ok: false, message: "공개된 안건에서만 만들 수 있습니다." };

  const template = templateId
    ? (await supabase.from("meeting_templates").select("blocks").eq("id", templateId).single()).data?.blocks ?? []
    : [];

  // 2) Template + 안건 → 블록 → Y.Doc → 바이트 (서버에서 단 한 번)
  const items = [...agenda.items].sort((a, b) => a.sort_order - b.sort_order);
  const blocks = [...template, ...agendaToBlocks(items)];
  const editor = ServerBlockNoteEditor.create({ schema: meetingSchema });
  const doc: Y.Doc = editor.blocksToYDoc(blocks, "document-store");
  const state = Buffer.from(Y.encodeStateAsUpdate(doc)).toString("base64");
  const vector = Buffer.from(Y.encodeStateVector(doc)).toString("base64");

  // 3) DB에서 한 트랜잭션으로 생성
  const { data: meetingId, error } = await supabase.rpc("create_meeting_from_agenda", {
    p_agenda_id: agendaId, p_template_id: templateId, p_state_b64: state, p_vector_b64: vector,
  });
  if (error) return { ok: false, message: toUserMessage(error) };
  redirect(`/meetings/${meetingId}`);
}
```

| 단계 | 읽는 법 |
| --- | --- |
| `ServerBlockNoteEditor.create(...)` | 브라우저 없이 서버에서 BlockNote 블록을 다루는 도구 (`@blocknote/server-util`, 버전별 API 확인) |
| `blocksToYDoc(blocks, "document-store")` | 블록 배열 → Yjs 문서. 이름은 브라우저 에디터의 `getXmlFragment("document-store")`와 **같아야** 함 (05-2) |
| `encodeStateAsUpdate` / `encodeStateVector` | Snapshot 바이트와 상태 벡터 |
| base64 | 바이트를 글자로 바꿔 RPC로 전달 |

```sql
create function public.create_meeting_from_agenda(
  p_agenda_id uuid, p_template_id uuid, p_state_b64 text, p_vector_b64 text
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  a public.meeting_agendas%rowtype;
  v_id uuid;
begin
  select * into a from public.meeting_agendas where id = p_agenda_id for update;   -- 동시에 두 번 누르기 방지
  if not found or a.status <> 'PUBLISHED' then
    raise exception 'USER:공개된 안건에서만 회의록을 만들 수 있습니다.' using errcode = 'P0001';
  end if;
  if not (a.created_by = (select auth.uid()) or private.is_executive(a.term_id)) then
    raise exception 'USER:안건 작성자나 회장단만 회의록을 만들 수 있습니다.' using errcode = 'P0001';
  end if;

  -- 회의록 (agenda_id UNIQUE라 두 번째는 여기서도 거부됨)
  insert into public.meeting_minutes (term_id, event_id, agenda_id, template_id, title, meeting_at, created_by, author_id, status, crdt_seq)
  values (a.term_id, a.event_id, a.id, p_template_id, a.title, a.meeting_at, auth.uid(), auth.uid(), 'DRAFT', 0)
  returning id into v_id;

  -- 열람 범위: 안건의 Preset을 기본값으로 복사
  insert into public.meeting_access_rules (meeting_id, subject_type, role_group, department_id, granted_by)
  select v_id, r.subject_type, r.role_group, r.department_id, auth.uid()
  from public.meeting_agenda_access_rules r where r.agenda_id = a.id;

  -- 만든 사람은 편집자
  insert into public.meeting_editors (meeting_id, user_id, granted_by) values (v_id, auth.uid(), auth.uid());

  -- 초기 Snapshot = version 1, 아직 Update 없음
  insert into public.meeting_crdt_snapshots (meeting_id, state_bytes, state_vector, snapshot_version, last_sequence_no)
  values (v_id, decode(p_state_b64, 'base64'), decode(p_vector_b64, 'base64'), 1, 0);

  -- 안건 닫기 (내용은 이미 회의록에 복사됨)
  update public.meeting_agendas set status = 'CLOSED' where id = a.id;

  perform private.log_activity(a.term_id, 'meeting', v_id, 'create.from_agenda', null, jsonb_build_object('agenda_id', a.id));
  return v_id;
end;
$$;
```

> [!EXAM]
> **왜 서버가 초기 Snapshot을 만드나?** 회의록을 처음 연 두 사람의 브라우저가 각자 Template과 안건 블록을 넣으면, Yjs는 두 삽입을 **둘 다 살려서** 합칩니다(05-2의 CRDT 성질). 결과는 안건이 두 번 들어간 회의록입니다. 서버가 생성 순간 **한 번만** 넣어 `snapshot_version = 1`로 저장하고, 브라우저는 항상 그 Snapshot에서 시작하면 이 문제가 없습니다(기획서 6.7절, 완료 기준 34).

안건 없이 회의록을 바로 만드는 `create_meeting` 함수도 같은 구조(안건 부분만 빠짐)로 둡니다. 긴급 회의를 위해서입니다.

## 4. 열람 범위와 편집자

| Preset | 저장되는 규칙 | 항상 추가로 볼 수 있는 사람 |
| --- | --- | --- |
| 전체 | `ROLE_GROUP = ALL_COUNCIL` | 그 기수 회장단 · 생성자 · 지정 편집자 |
| 특정 국 (여러 개) | `DEPARTMENT` 행 여러 개 | 〃 |
| 국장단 | `ROLE_GROUP = DIRECTORS` | 〃 |
| 회장단 | `ROLE_GROUP = EXECUTIVES` | 〃 |

- 편집자 추가·제외는 생성자 또는 회장단(생성자인 국장은 자기가 만든 회의록만).
- 대표 작성자(`author_id`)는 자동으로 편집자에 포함.
- Event 회의록이면 편집자는 Event를 볼 수 있는 사람 중에서만(06-2와 같은 검사).
- 편집자를 빼면 DB 함수가 `realtime.send(…, 'resubscribe', …)`로 신호를 보내 그 사람의 연결이 권한을 다시 판정받게 합니다(05-3).

## 5. 확정과 되돌리기

[![DRAFT에서는 편집자와 회장단이 편집하고, CONFIRMED로 확정하면 읽기 전용이 되며, ARCHIVED는 목록에서 숨고, CONFIRMED를 DRAFT로 되돌리는 것은 회장단만 사유를 남겨 할 수 있는 상태 그림](/materials/diagrams/cpg-07a-meeting-states.svg)](/materials/diagrams/cpg-07a-meeting-states.svg)

*그림 06-4 · 회의록 상태와 편집 가능 여부 — 누르면 원본 크기로 열린다.*

| 동작 | 누가 | DB 함수가 하는 일 |
| --- | --- | --- |
| 확정 (`DRAFT → CONFIRMED`) | 생성자 또는 회장단 | 상태 변경 + `confirmed_at/by` + 최종 Snapshot 요청 + `resubscribe` 신호 |
| 보관 (`→ ARCHIVED`) | 생성자 또는 회장단 | 목록에서 숨김, 읽기 전용 |
| 되돌리기 (`CONFIRMED → DRAFT`) | **회장단만** | 사유 필수, Activity Log에 사유 기록 |

확정 직후 편집 중이던 사람의 저장 요청은 `save_meeting_update`가 상태를 보고 거부하므로, 확정 이후 내용이 바뀌는 일은 없습니다.

## 6. 이 기능의 테스트 목록

| 사례 | 기대 |
| --- | --- |
| 국원이 안건 생성 | 거부 |
| 국장이 DRAFT 안건 작성 → 같은 국 국원 조회 | 0건 (공개 전) |
| PUBLISHED 안건, Preset "재무국" → 홍보국원 조회 | 0건 |
| 같은 안건으로 회의록 두 번 만들기 (동시 클릭) | 하나만 성공 (`for update` + UNIQUE) |
| 두 창에서 새 회의록 동시 열기 | 안건 블록이 한 번만 보임 |
| 안건을 회의록 생성 후 수정 시도 | 거부 (CLOSED) |
| 편집자가 CONFIRMED 회의록 저장 | 거부 |
| 국장이 CONFIRMED → DRAFT 되돌리기 | 거부 (회장단만) |

> [!QUIZ]
> 회의록을 만든 뒤 국장이 "안건 3을 빼야겠다"며 안건을 고치려 합니다. 안 되는 이유와, 대신 어떻게 해야 하나요?

> [!ANSWER]
> 회의록을 만드는 순간 안건 내용이 회의록 초기 Snapshot으로 **복사**되고 안건은 CLOSED가 되어 수정할 수 없습니다. 안건을 고쳐도 회의록에는 반영되지 않으므로, 회의록(DRAFT)에서 안건 3 블록을 직접 지우거나 "보류"라고 적으면 됩니다. 이렇게 해야 "회의 전에 공개된 안건"의 기록이 남습니다.

> [!QUIZ]
> 안건의 Preset은 "국장단"인데, 회의록을 만든 뒤 회의록의 열람 범위를 "전체"로 바꿀 수 있나요?

> [!ANSWER]
> 바꿀 수 있습니다. 안건의 Preset은 회의록 생성 때 **기본값으로 복사**될 뿐이고, 이후 회의록 열람 범위는 생성자 또는 회장단이 기획서 6.3절 규칙대로 따로 설정합니다. Event 회의록이라면 Event 범위와의 교집합은 그대로 적용됩니다.

## 학습 경로

[← 06-2 행사](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-02) · [06-4 건의 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-04)
