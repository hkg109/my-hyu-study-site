---
title: "03-4 · 파일 업로드와 Activity Log"
description: "행사 자료 PDF가 비공개 Storage Bucket과 event_resources 메타데이터로 나뉘어 저장되는 과정, Storage 객체에 RLS 정책을 거는 법, 짧게 만료되는 서명 URL로 내려받는 법, 외부 링크 검증을 코드로 익히고, 누가 무엇을 바꿨는지 남기는 append-only Activity Log를 DB 함수로 기록하는 법을 배웁니다."
order: 4
published: true
duration: 45
tags: [Supabase Storage, 서명 URL, 파일 업로드, Activity Log, 감사 기록]
objectives:
  - 업로드 한 번이 Storage와 DB 두 곳에 나뉘어 저장되는 이유를 말한다.
  - storage.objects에 거는 RLS 정책을 읽고, 경로로 행사 ID를 꺼내는 방법을 설명한다.
  - 서명 URL의 만료 시간을 짧게 두는 이유를 말한다.
  - Activity Log에 넣으면 안 되는 값과 append-only로 만드는 방법을 말한다.
---

## 1. 업로드 하나, 저장소 둘

[![행사 PDF 업로드는 메타데이터가 DB의 event_resources에, 파일 본체는 비공개 Storage에 저장되고, 익명 건의는 내용이 suggestions에, 작성자 연결이 suggestion_authors에 분리되며, 둘 다 Activity Log에 민감값 없이 남는 그림](/materials/diagrams/cpg-04c-data-placement.svg)](/materials/diagrams/cpg-04c-data-placement.svg)

*그림 03-3 · 무엇을 어디에 저장하나 — 누르면 원본 크기로 열린다.*

| 저장소 | 무엇이 들어가나 | 왜 |
| --- | --- | --- |
| **Supabase Storage** (Bucket `event-resources`) | 파일 본체 (PDF·XLSX·PNG) | DB는 큰 파일을 담기에 맞지 않음 |
| **DB** (`event_resources`) | 제목·설명·행사 ID·저장 경로·올린 사람 | 목록 화면, 검색, 권한 판단 |
| **DB** (`activity_logs`) | "누가 언제 어느 행사에 자료를 올렸다" | 감사 기록 |

## 2. Bucket과 경로 규칙

```text
Bucket: event-resources   (Public 끔)
경로:   {term_id}/{event_id}/{uuid}-{원래파일명}
예:     6f1c…/a92b…/3e7d…-부스배치도.pdf
```

- Bucket을 **비공개**로 만들면 주소를 알아도 바로 열 수 없습니다.
- 경로 앞부분에 `term_id/event_id`를 넣어, 정책에서 "어느 행사의 파일인지"를 꺼낼 수 있게 합니다.
- 파일 이름 앞에 무작위 UUID를 붙여 같은 이름의 파일이 덮어쓰이지 않게 합니다.
- ==파일 이름만으로 권한을 판단하지 않습니다.== 경로의 행사 ID로 **DB의 행사 열람 함수**를 불러 판단합니다.

## 3. Storage에도 RLS

Supabase Storage의 파일 정보는 `storage.objects` 테이블에 있고, 여기에도 RLS 정책을 겁니다. 행사 열람 함수(04-4편)를 그대로 재사용합니다.

```sql
-- 읽기: 그 행사를 볼 수 있는 사람만
create policy "event resource read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'event-resources'
  and private.can_read_event(((storage.foldername(name))[2])::uuid)
);

-- 올리기: 그 행사를 볼 수 있는 사람만 (기획서 5.6: Resource 등록 = 열람 가능한 Event)
create policy "event resource upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-resources'
  and private.can_read_event(((storage.foldername(name))[2])::uuid)
  and private.event_is_writable(((storage.foldername(name))[2])::uuid)   -- ARCHIVED 행사는 읽기 전용
);
```

| 부분 | 읽는 법 |
| --- | --- |
| `on storage.objects for select` | 파일 내려받기·목록 조회에 적용 |
| `to authenticated` | 로그인한 사용자에게만 (anon 제외) |
| `storage.foldername(name)` | 경로를 폴더 배열로 나눔: `{term_id, event_id}` |
| `[2]` | 두 번째 폴더 = `event_id` (SQL 배열은 1부터) |
| `::uuid` | 글자를 UUID로 변환 |
| `using (...)` | 읽을 때 검사할 조건 |
| `with check (...)` | 새로 쓸 때 검사할 조건 |

삭제 정책은 "본인이 올린 자료 또는 관리하는 Event"(기획서 5.6절) 조건으로 따로 만듭니다.

## 4. 업로드 코드

파일은 Vercel 서버를 거치지 않고 **브라우저에서 Storage로 바로** 올립니다. 서버 함수의 요청 크기 한도를 피하고 비용도 줄이기 위해서입니다. 대신 Storage RLS가 권한을 막습니다.

```tsx
// app/(council)/events/[eventId]/resources/upload-form.tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerResource } from "./actions";

const MAX_BYTES = 20 * 1024 * 1024;                  // 운영값(기획서 0.2절)으로 정할 값
const ALLOWED = ["application/pdf", "image/png", "image/jpeg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

export function UploadForm({ termId, eventId }: { termId: string; eventId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("file") as File;
    if (!file || file.size === 0) return setMessage("파일을 고르세요.");
    if (file.size > MAX_BYTES) return setMessage("20MB 이하만 올릴 수 있습니다.");
    if (!ALLOWED.includes(file.type)) return setMessage("PDF·PNG·JPG·XLSX만 올릴 수 있습니다.");

    setBusy(true);
    const path = `${termId}/${eventId}/${crypto.randomUUID()}-${file.name}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("event-resources").upload(path, file);
    if (uploadError) { setBusy(false); return setMessage("올리지 못했습니다. 권한이나 파일을 확인하세요."); }

    const result = await registerResource({ eventId, path, title: String(form.get("title") ?? file.name) });
    setBusy(false);
    setMessage(result.ok ? "올렸습니다." : result.message);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label htmlFor="title">자료 제목</label>
      <input id="title" name="title" className="w-full rounded border p-2" />
      <label htmlFor="file">파일</label>
      <input id="file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx" />
      <button disabled={busy}>{busy ? "올리는 중…" : "올리기"}</button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}
```

```ts
// app/(council)/events/[eventId]/resources/actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";

export async function registerResource(input: { eventId: string; path: string; title: string }) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("register_event_resource", {
    p_event_id: input.eventId,
    p_storage_path: input.path,
    p_title: input.title.slice(0, 200),
  });
  if (error) {
    await supabase.storage.from("event-resources").remove([input.path]);   // 메타데이터 실패 시 파일 정리
    return { ok: false, message: "자료를 등록하지 못했습니다." };
  }
  return { ok: true, message: null };
}
```

| 단계 | 어디서 | 실패하면 |
| --- | --- | --- |
| 크기·형식 확인 | 브라우저 | 안내 문구 (편의) |
| 파일 올리기 | 브라우저 → Storage (RLS) | 권한 없으면 거부 |
| 메타데이터 등록 | 서버 → DB 함수 (권한·경로 재검증 + Activity Log) | 올린 파일을 지움 |

> [!CAUTION]
> 브라우저의 `file.type`과 확장자는 사용자가 속일 수 있습니다. Storage Bucket 설정에서 **허용 MIME 타입과 최대 크기**를 따로 걸고, `register_event_resource` 함수도 경로가 `{그 행사의 term_id}/{event_id}/`로 시작하는지 다시 확인합니다. 악성 파일 검사 방식은 기획서 0.2절의 운영값입니다.

## 5. 내려받기 — 짧게 만료되는 서명 URL

비공개 파일은 **서명 URL**로 엽니다. 서명 URL은 "이 파일을 이 시각까지 열어도 된다"는 서명이 붙은 임시 주소입니다.

```ts
// app/(council)/events/[eventId]/resources/[resourceId]/download/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const { resourceId } = await params;
  const supabase = await createClient();

  const { data: resource } = await supabase
    .from("event_resources").select("storage_path").eq("id", resourceId).maybeSingle();   // RLS 통과해야 보임
  if (!resource?.storage_path) return new NextResponse("Not found", { status: 404 });

  const { data } = await supabase.storage.from("event-resources").createSignedUrl(resource.storage_path, 60);
  if (!data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
```

- 만료를 **60초**처럼 짧게 둡니다. 서명 URL을 받은 사람은 권한 확인 없이 그 시간 동안 열 수 있으므로, 길면 링크를 공유했을 때 권한 없는 사람도 열 수 있습니다.
- 화면에는 서명 URL 대신 이 다운로드 주소(`/download`)를 링크합니다. 누를 때마다 권한을 다시 확인하고 새 URL을 발급합니다.
- 서명 URL은 Activity Log에 남기지 않습니다(기획서 10.3절).

## 6. 외부 링크 자료

```ts
const ExternalLink = z.object({
  url: z.string().url().refine((u) => new URL(u).protocol === "https:", "https 주소만 등록할 수 있습니다."),
  title: z.string().trim().min(1).max(200),
});
```

- `https`만 허용하고, 화면에서는 `<a href={url} target="_blank" rel="noopener noreferrer">`로 새 창에 엽니다.
- 외부 Drive 링크는 우리 ACL로 보호할 수 없으므로, 등록 화면에 "원본 서비스의 공유 범위를 확인하세요"를 표시합니다(기획서 5.3절).

## 7. Activity Log — 바꿀 수 없는 변경 기록

```sql
create table public.activity_logs (
  id             bigint generated always as identity primary key,
  term_id        uuid references public.terms(id),
  resource_type  text not null,            -- 'task', 'event', 'meeting', 'term_handover' ...
  resource_id    uuid,
  action         text not null,            -- 'create', 'reopen', 'acl.change', 'archive' ...
  actor_id       uuid,                     -- 건의 작성 행위는 null
  before_summary jsonb,
  after_summary  jsonb,
  request_id     text,
  created_at     timestamptz not null default now()
);

alter table public.activity_logs enable row level security;
revoke update, delete, truncate on public.activity_logs from authenticated, anon;   -- append-only

create function private.log_activity(
  p_term_id uuid, p_type text, p_id uuid, p_action text, p_before jsonb, p_after jsonb
) returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.activity_logs (term_id, resource_type, resource_id, action, actor_id, before_summary, after_summary)
  values (p_term_id, p_type, p_id, p_action, auth.uid(), p_before, p_after);
$$;
```

- 기록은 DB 함수(`create_task`, `register_event_resource` 등) **안에서** `private.log_activity(...)`를 불러 남깁니다. 변경과 기록이 같은 트랜잭션이라, 변경만 되고 기록이 빠지는 일이 없습니다.
- `actor_id`와 시각은 서버(DB)가 넣습니다. 클라이언트가 보낸 값을 믿지 않습니다.
- 일반 사용자는 UPDATE·DELETE 권한이 없어 기록을 고치거나 지울 수 없습니다.
- 조회 정책: 대상 자원을 볼 수 있는 사람만 그 기록을 보고, 전체 조회는 EXECUTIVE만(04-4편).

| 넣는 것 | 넣지 않는 것 |
| --- | --- |
| 바뀐 필드 이름과 요약 (`{"status": ["TODO", "DONE"]}`) | 본문 전문, 회의록 내용 |
| 공개 모드 변경 전후, ACL 대상 ID | 건의 작성자 ID |
| 행위자 ID, 시각, 요청 ID | CRDT 바이너리, 서명 URL, OAuth Token |

> [!QUIZ]
> 서명 URL 만료를 7일로 설정하면 어떤 문제가 생기나요?

> [!ANSWER]
> 그 URL을 받은 사람은 7일 동안 권한 확인 없이 파일을 열 수 있습니다. 링크를 단톡방에 공유하거나, 그 사이 Event 범위가 좁아지거나 Membership이 종료돼도 계속 열립니다. 짧게(예: 60초) 두고 열 때마다 권한을 다시 확인해 새로 발급해야 합니다.

> [!QUIZ]
> Activity Log를 Server Action에서 `supabase.from("activity_logs").insert(...)`로 따로 쓰지 않고 DB 함수 안에서 쓰는 이유 두 가지는?

> [!ANSWER]
> ① 변경과 기록이 한 트랜잭션이 되어, 변경은 됐는데 기록이 빠지거나 그 반대인 상태가 생기지 않습니다. ② 일반 사용자에게 `activity_logs` INSERT 권한을 줄 필요가 없어서, 사용자가 가짜 기록을 직접 넣을 수 없습니다. `actor_id`도 DB의 `auth.uid()`로 채우므로 위조할 수 없습니다.

## 학습 경로

[← 03-3 로그인 구현](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-03) · [04-1 테이블과 관계 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-01)
