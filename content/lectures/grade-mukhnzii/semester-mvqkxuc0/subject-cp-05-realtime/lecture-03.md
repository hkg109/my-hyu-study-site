---
title: "05-3 · 저장·전파·복구"
description: "회의록 Update가 save_meeting_update DB 함수에서 권한 검사·순번 발급·저장·realtime.send 발행까지 한 트랜잭션으로 처리되는 SQL, Private Channel 권한 정책, 브라우저 provider의 묶음 전송·재시도·권한 거부 처리, 순번 공백 감지와 재접속 복구, Snapshot 압축까지 회의록 공동편집의 전체 코드를 따라갑니다."
order: 3
published: true
duration: 60
tags: [Supabase Realtime, realtime.send, Private Channel, CRDT 저장, 재시도, Snapshot]
objectives:
  - save_meeting_update가 한 트랜잭션에서 하는 일 다섯 가지를 순서대로 말한다.
  - 회의록별 순번(crdt_seq)을 쓰는 이유를 설명한다.
  - realtime.messages 정책으로 수신·송신 권한을 나누는 코드를 읽는다.
  - 브라우저 provider가 저장 실패·권한 거부·순번 공백·재접속을 각각 어떻게 처리하는지 말한다.
---

## 1. 전체 순서

[![편집자 A가 Update를 묶어 RPC를 호출하면 DB 함수가 권한을 검사하고 순번을 발급해 저장한 뒤 Realtime으로 발행하고 A에게 Ack를 돌려주며 B가 Update를 적용하는 순서도](/materials/diagrams/cpg-05a-crdt-save.svg)](/materials/diagrams/cpg-05a-crdt-save.svg)

*그림 05-2 · 회의록 변경이 저장되는 순서 — 누르면 원본 크기로 열린다.*

| 단계 | 어디서 | 하는 일 |
| --- | --- | --- |
| ① | A의 브라우저 | Yjs Update를 300ms 묶어 `client_update_id`를 붙이고 IndexedDB에 보관 |
| ② | A → Supabase (RPC, 사용자 JWT) | `save_meeting_update(meeting_id, client_update_id, update)` 호출 |
| ③ | DB 함수 | 편집 권한·회의록 상태 검사 → 순번 발급 → 저장 → `realtime.send()` |
| ④ | DB → A | 순번(Ack) 응답. A는 IndexedDB에서 지우고 "저장됨" 표시 |
| ⑤ | Realtime → B | 커밋된 경우에만 Broadcast. B는 순번 확인 후 `applyUpdate` |

> [!EXAM]
> ==Realtime으로 보였다 ≠ 저장됐다.== "저장됨" 표시는 ④의 응답을 받은 뒤에만 합니다. 이 경로에는 Vercel 함수가 없습니다(키 입력마다 서버 함수를 부르는 지연·비용을 피함). 브라우저가 Supabase를 직접 부르므로 **DB 함수가 유일한 보안 검사 지점**입니다.

## 2. 테이블

```sql
create table public.meeting_crdt_updates (
  id               bigint generated always as identity primary key,
  meeting_id       uuid not null references public.meeting_minutes(id),
  client_update_id uuid not null,
  sequence_no      bigint not null,
  update_bytes     bytea not null,
  actor_id         uuid not null references public.profiles(id),
  created_at       timestamptz not null default now(),
  unique (meeting_id, client_update_id),        -- 재시도 중복 방지
  unique (meeting_id, sequence_no)              -- 순번 중복 방지
);

create table public.meeting_crdt_snapshots (
  id               bigint generated always as identity primary key,
  meeting_id       uuid not null references public.meeting_minutes(id),
  state_bytes      bytea not null,
  state_vector     bytea not null,
  snapshot_version int not null,
  last_sequence_no bigint not null,             -- 이 Snapshot이 포함한 마지막 Update
  created_at       timestamptz not null default now(),
  unique (meeting_id, snapshot_version)
);

alter table public.meeting_crdt_updates enable row level security;
alter table public.meeting_crdt_snapshots enable row level security;
revoke insert, update, delete on public.meeting_crdt_updates, public.meeting_crdt_snapshots from authenticated, anon;

create policy "updates: read if can read meeting" on public.meeting_crdt_updates
  for select to authenticated using (private.can_read_meeting(meeting_id));
create policy "snapshots: read if can read meeting" on public.meeting_crdt_snapshots
  for select to authenticated using (private.can_read_meeting(meeting_id));
```

## 3. save_meeting_update — 저장의 심장

```sql
create function public.save_meeting_update(
  p_meeting_id       uuid,
  p_client_update_id uuid,
  p_update_b64       text                            -- 브라우저는 base64 글자로 보냄
) returns bigint                                     -- 발급된 순번
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing bigint;
  v_status   text;
  v_seq      bigint;
  v_bytes    bytea := decode(p_update_b64, 'base64');
begin
  -- (1) 같은 묶음의 재시도면 이미 받은 순번을 그대로 돌려준다 (멱등)
  select sequence_no into v_existing
  from public.meeting_crdt_updates
  where meeting_id = p_meeting_id and client_update_id = p_client_update_id;
  if found then return v_existing; end if;

  -- (2) 지금 이 순간의 편집 권한과 상태
  if not private.can_edit_meeting(p_meeting_id) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  -- (3) 회의록 행을 잠그고 순번 발급 (회의록 하나 단위로 줄 세우기)
  update public.meeting_minutes
  set crdt_seq = crdt_seq + 1, updated_at = now()
  where id = p_meeting_id
  returning crdt_seq, status into v_seq, v_status;

  if v_status <> 'DRAFT' then
    raise exception 'FORBIDDEN' using errcode = '42501';   -- CONFIRMED·ARCHIVED는 편집 불가
  end if;

  -- (4) 저장
  insert into public.meeting_crdt_updates (meeting_id, client_update_id, sequence_no, update_bytes, actor_id)
  values (p_meeting_id, p_client_update_id, v_seq, v_bytes, auth.uid());

  -- (5) 발행: 이 트랜잭션이 커밋될 때만 실제로 전달된다
  if length(v_bytes) <= 200000 then                -- 메시지 크기 한도는 Phase 0에서 확인
    perform realtime.send(
      jsonb_build_object('seq', v_seq, 'update', p_update_b64),
      'crdt-update',
      'meeting:' || p_meeting_id,
      true);                                        -- private 채널
  else
    perform realtime.send(jsonb_build_object('seq', v_seq), 'crdt-pull', 'meeting:' || p_meeting_id, true);
  end if;

  return v_seq;
end;
$$;

grant execute on function public.save_meeting_update to authenticated;
```

| 단계 | 코드 | 왜 (기획서 6.5절) |
| --- | --- | --- |
| (1) | `client_update_id`로 기존 행 찾기 | 응답을 못 받은 재시도가 중복 저장되지 않게. 같은 ID면 같은 순번 |
| (2) | `can_edit_meeting` | 지정 편집자·회장단인지, 권한이 방금 회수되지 않았는지 **매 요청** 확인 |
| (3) | `update … set crdt_seq = crdt_seq + 1 returning` | 행 잠금으로 같은 회의록의 저장을 한 줄로 세움 → 순번이 커밋 순서와 일치 |
| (3) | `status <> 'DRAFT'` → 거부 | 확정된 회의록은 편집자도 저장 불가 |
| (4) | INSERT | 원본은 DB에 |
| (5) | `realtime.send(payload, event, topic, private)` | 커밋된 것만 전달. 너무 크면 "새 Update 있음" 신호만 보내고 받는 쪽이 DB에서 읽음 |

> [!NOTE]
> **왜 전역 자동 번호(identity)를 순번으로 쓰지 않나?** 두 저장이 동시에 진행되면 번호는 101, 102 순으로 받았는데 커밋은 102가 먼저 될 수 있습니다. 그 사이 "100 이후를 달라"고 조회한 사람은 102만 받고, 나중에 커밋된 101을 영영 놓칩니다. 회의록 행을 잠그고 순번을 올리면 순번 순서 = 커밋 순서가 됩니다.

## 4. 채널 권한 — 누가 듣고 누가 말하나

Supabase Realtime의 Private Channel 권한은 `realtime.messages` 테이블의 RLS 정책으로 정합니다.

```sql
-- 듣기: 회의록을 읽을 수 있는 사람만 meeting:{id} 채널의 Broadcast·Presence를 받는다
create policy "meeting channel: receive"
on realtime.messages for select to authenticated
using (
  realtime.topic() like 'meeting:%'
  and private.can_read_meeting(split_part(realtime.topic(), ':', 2)::uuid)
);

-- 말하기: 편집자는 awareness(커서)만 보낼 수 있다. crdt-update는 DB 함수만 보낸다
create policy "meeting channel: send awareness"
on realtime.messages for insert to authenticated
with check (
  realtime.topic() like 'meeting:%'
  and realtime.messages.extension = 'broadcast'
  and realtime.messages.event = 'awareness'
  and private.can_edit_meeting(split_part(realtime.topic(), ':', 2)::uuid)
);

-- Presence(접속자 목록) 게시: 읽을 수 있는 사람
create policy "meeting channel: presence"
on realtime.messages for insert to authenticated
with check (
  realtime.topic() like 'meeting:%'
  and realtime.messages.extension = 'presence'
  and private.can_read_meeting(split_part(realtime.topic(), ':', 2)::uuid)
);
```

| 정책 | 결과 |
| --- | --- |
| 듣기 = `can_read_meeting` | 열람 권한이 없으면 채널 이름을 알아도 구독 실패 |
| 말하기 = `awareness`만 | 브라우저가 `crdt-update`를 직접 보내면 거부 (기획서 완료 기준 32) |
| 대시보드 설정 | Realtime 설정에서 **공개 채널 허용을 끔** |

> [!CAUTION]
> Realtime은 연결할 때 판정한 권한을 **캐시**합니다. 편집자에서 빠진 사람이 이미 연결돼 있으면 잠시 더 메시지를 받을 수 있습니다. 대책: ① 짧은 JWT 유효 시간 ② 권한·상태가 바뀌면 DB 함수가 `realtime.send(…, 'resubscribe', …)`로 재구독 신호 → 클라이언트가 채널을 다시 연결하면 그때 권한이 다시 판정됨 ③ 저장(`save_meeting_update`)은 연결과 무관하게 매번 최신 권한 검사 ④ "회수 후 최대 수신 가능 시간"을 운영값으로 정해 테스트(기획서 6.6절).

## 5. 브라우저 쪽 provider

provider는 "Yjs와 Supabase 사이의 배달원"입니다. 핵심 부분만 보입니다.

```ts
// lib/meetings/supabase-provider.ts
"use client";
import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";
import { toBase64, fromBase64, pendingStore } from "./encoding";   // IndexedDB 보관함

export function connectMeeting(meetingId: string, doc: Y.Doc, onReadonly: (reason: string) => void) {
  const supabase = createClient();
  let lastSeq = 0;
  let sending = false;
  let buffer: Uint8Array[] = [];

  // ── 내 변경 모으기 ─────────────────────────
  doc.on("update", (update: Uint8Array, origin: unknown) => {
    if (origin !== "remote") buffer.push(update);
  });

  // ── 한 번에 한 묶음만 보내기 ────────────────
  async function flush(attempt = 0) {
    if (sending || buffer.length === 0) return;
    sending = true;
    const merged = Y.mergeUpdates(buffer.splice(0));
    const item = { id: crypto.randomUUID(), bytes: merged };
    await pendingStore.put(meetingId, item);                    // 응답 전엔 로컬에 보관

    const { data: seq, error } = await supabase.rpc("save_meeting_update", {
      p_meeting_id: meetingId, p_client_update_id: item.id, p_update_b64: toBase64(item.bytes),
    });

    if (error?.code === "42501") {                              // 권한 거부: 재시도 금지
      sending = false;
      onReadonly("편집 권한이 없거나 회의록이 확정되었습니다. 저장되지 않은 내용이 있습니다.");
      return;
    }
    if (error) {                                                 // 네트워크 등: 같은 ID로 재시도
      sending = false;
      buffer.unshift(item.bytes);
      setTimeout(() => flush(attempt + 1), Math.min(30_000, 500 * 2 ** attempt));   // 지수 백오프
      return;
    }
    await pendingStore.remove(meetingId, item.id);              // Ack 받음 → 보관함에서 삭제
    sending = false;
    markSaved(seq);
    flush();                                                     // 그사이 쌓인 다음 묶음
  }
  const timer = setInterval(() => flush(), 300);

  // ── 남의 변경 받기 ─────────────────────────
  const channel = supabase.channel(`meeting:${meetingId}`, { config: { private: true } });
  channel
    .on("broadcast", { event: "crdt-update" }, ({ payload }) => {
      if (payload.seq <= lastSeq) return;                        // 이미 적용한 순번
      if (payload.seq > lastSeq + 1) return pullFrom(lastSeq);   // 공백 발견 → DB에서 채움
      Y.applyUpdate(doc, fromBase64(payload.update), "remote");
      lastSeq = payload.seq;
    })
    .on("broadcast", { event: "crdt-pull" }, () => pullFrom(lastSeq))
    .on("broadcast", { event: "resubscribe" }, () => reconnect())
    .subscribe();

  // ── 빠진 구간을 DB에서 읽기 ─────────────────
  async function pullFrom(after: number) {
    const { data } = await supabase
      .from("meeting_crdt_updates")
      .select("sequence_no, update_bytes")
      .eq("meeting_id", meetingId)
      .gt("sequence_no", after)
      .order("sequence_no");
    for (const row of data ?? []) {
      Y.applyUpdate(doc, decodeBytea(row.update_bytes), "remote");
      lastSeq = row.sequence_no;
    }
  }

  return { setInitialSeq: (n: number) => (lastSeq = n), destroy: () => { clearInterval(timer); supabase.removeChannel(channel); } };
}
```

| 상황 | 처리 | 기획서 6.5절 |
| --- | --- | --- |
| 저장 성공 | Ack 순번 받으면 IndexedDB에서 지우고 "저장됨" | 1, 4단계 |
| 네트워크 실패 | **같은 ID**(`client_update_id`)로 지수 백오프 재시도 → DB가 중복 저장 안 함 | 4단계 |
| 권한 거부 (42501) | 재시도하지 않고 읽기 전용 + 미저장 안내 | 4단계 |
| 순번 5 다음 7 | 6이 빠짐 → DB에서 5 이후를 읽어 채움 | 3단계 |
| 큰 붙여넣기 | `crdt-pull` 신호만 옴 → DB에서 읽음 | Phase 0 항목 |
| 상태 변경·권한 회수 | `resubscribe` → 다시 연결하며 권한 재판정 | 6.6, 6.8절 |

> [!NOTE]
> 위 코드에서 실패한 묶음을 다시 보낼 때 새 ID를 만들지 않도록, 실제 구현은 IndexedDB에 보관한 `item.id`를 그대로 재사용합니다(설명을 위해 줄였습니다). ID가 바뀌면 "응답만 못 받았고 실제로는 저장된" 묶음이 두 번 저장됩니다. Yjs가 멱등이라 문서는 깨지지 않지만 저장 공간이 낭비됩니다.

## 6. 처음 열기와 재접속

[![재접속하면 최신 Snapshot과 그 뒤 Update로 문서를 복원하고, 순번 공백을 감지해 DB에서 다시 읽으며, 같은 ID 재시도는 한 번만 저장되는 세 가지 복구 장면](/materials/diagrams/cpg-05b-recovery.svg)](/materials/diagrams/cpg-05b-recovery.svg)

*그림 05-3 · 순번과 Snapshot으로 복구하기 — 누르면 원본 크기로 열린다.*

```ts
async function openMeeting(meetingId: string, doc: Y.Doc) {
  const supabase = createClient();
  const { data: snap } = await supabase
    .from("meeting_crdt_snapshots")
    .select("state_bytes, last_sequence_no")
    .eq("meeting_id", meetingId)
    .order("snapshot_version", { ascending: false })
    .limit(1)
    .single();                                               // 회의록 생성 때 version 1이 반드시 있음

  Y.applyUpdate(doc, decodeBytea(snap.state_bytes), "remote");   // ① Snapshot
  const conn = connectMeeting(meetingId, doc, showReadonly);
  conn.setInitialSeq(snap.last_sequence_no);
  await pullFrom(snap.last_sequence_no);                          // ② 그 뒤 Update
  await replayPending(meetingId);                                  // ③ 지난번 못 보낸 내 변경
  return conn;
}
```

1. 최신 Snapshot을 적용합니다. 회의록 생성 때 서버가 Template(+안건)으로 만든 **version 1**이 항상 있으므로, 클라이언트는 Template을 직접 넣지 않습니다(기획서 6.7절).
2. Snapshot의 `last_sequence_no` 이후 Update만 읽어 적용합니다.
3. IndexedDB에 남은 미전송 묶음을 같은 ID로 다시 보냅니다.
4. 채널 구독 중 받은 Broadcast 중 이미 적용한 순번은 무시합니다.

## 7. Snapshot 압축 — 신뢰된 서버 작업

Update가 계속 쌓이면 열 때 읽을 양이 늘어납니다. 주기적으로 서버가 전체를 합쳐 새 Snapshot을 만들고 오래된 Update를 정리합니다.

```ts
// app/api/jobs/compact-meetings/route.ts  · 서버에서만, 관리자 키 사용
import "server-only";
import * as Y from "yjs";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const admin = createAdminClient();
  // 1. Update가 많이 쌓인 DRAFT 회의록 고르기
  // 2. 최신 Snapshot + 이후 Update로 Y.Doc 복원
  // 3. Y.encodeStateAsUpdate(doc), Y.encodeStateVector(doc)로 새 Snapshot 만들기
  // 4. DB 함수 compact_meeting(meeting_id, state, vector, last_seq)를 호출
  //    → 회의록 행을 잠그고 새 version 저장 + last_seq 이하 Update만 삭제 (한 트랜잭션)
  return Response.json({ ok: true });
}
```

- 회의록 행 잠금으로 동시 저장과 충돌하지 않게 합니다.
- 지우는 Update는 **새 Snapshot의 `last_sequence_no` 이하만**입니다.
- 회의록을 CONFIRMED로 확정할 때도 최종 Snapshot을 만듭니다(기획서 6.8절).
- 이 주소는 GitHub Actions 정기 작업이 `CRON_SECRET`을 붙여 부릅니다(07-2편). Vercel Hobby의 Cron은 하루 한 번 수준으로 제한되므로, 필요한 빈도는 운영값으로 정해 Actions 일정으로 맞춥니다.

## 8. 완료 기준으로 점검

| 기획서 완료 기준 | 테스트 방법 |
| --- | --- |
| 16 저장 실패 후 재시도·중복·재접속·동시 편집·Snapshot에서 유실 없음 | 개발자 도구에서 네트워크를 끊고 입력 → 다시 연결 → 두 브라우저 내용 비교 |
| 17 권한 회수 후 DB 즉시 차단, Realtime은 정한 시간 안에 종료 | 편집자 제거 직후 저장 시도 → 42501, 수신 종료까지 시간 측정 |
| 32 클라이언트의 `crdt-update` 송신 거부 | Console에서 `channel.send({ type: "broadcast", event: "crdt-update", … })` → 거부 확인 |
| 33 순번 공백·중복 없음, 공백 감지 시 복구 | 동시 저장 스크립트 후 `sequence_no` 연속성 SQL 확인 |
| 34 동시에 열어도 Template 한 번 | 새 회의록을 두 창에서 동시에 열기 |
| 35 CONFIRMED는 편집자도 저장 불가 | 확정 후 입력 → 읽기 전용 전환 확인 |

> [!QUIZ]
> 편집자 A가 입력 직후 와이파이가 끊겨 `save_meeting_update` 응답을 못 받았습니다. 사실 DB에는 저장됐습니다. 다시 연결되면 무슨 일이 일어나나요?

> [!ANSWER]
> provider는 IndexedDB에 남은 그 묶음을 **같은 ID**(`client_update_id`)로 다시 보냅니다. DB 함수의 (1)단계가 그 ID의 기존 행을 찾아 이미 발급한 순번을 그대로 돌려주므로 중복 저장되지 않고, A는 Ack를 받아 "저장됨"으로 표시합니다.

> [!QUIZ]
> 회장단이 회의록을 CONFIRMED로 확정한 순간, 편집 중이던 B의 화면에서는 어떤 일이 일어나야 하나요?

> [!ANSWER]
> 확정 함수가 `resubscribe` 신호를 보내고, B의 provider는 채널을 다시 연결하며 회의록 상태를 다시 읽어 에디터를 읽기 전용으로 바꿉니다. 그 사이 B가 보낸 저장 요청은 `save_meeting_update`가 상태 `CONFIRMED`를 보고 42501로 거부하고, provider는 재시도 없이 "저장되지 않은 내용이 있음"을 알립니다.

## 학습 경로

[← 05-2 Yjs와 CRDT](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-02) · [06-1 업무 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-01)
