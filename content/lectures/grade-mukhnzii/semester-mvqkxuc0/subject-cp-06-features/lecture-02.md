---
title: "06-2 · 행사(Event) 따라가기"
description: "행사 생성과 탭 화면, ALL_COUNCIL·RESTRICTED 열람 범위, 자료·일정·인수인계로의 권한 상속, 범위를 좁힐 때의 충돌 목록과 세 가지 해결 방법을 한 트랜잭션으로 적용하는 DB 함수, 종일 일정 저장, 인수인계의 낙관적 잠금을 화면 → 서버 → DB 순서로 따라갑니다."
order: 2
published: true
duration: 50
tags: [Event, 권한 상속, 범위 축소, 충돌 처리, 일정, 인수인계, 낙관적 잠금]
objectives:
  - 행사 상세의 탭이 각각 어떤 테이블·권한 함수와 연결되는지 말한다.
  - 범위 축소 충돌을 찾는 쿼리와 세 가지 해결 방법을 설명한다.
  - 해결 선택을 한 트랜잭션으로 적용해야 하는 이유를 말한다.
  - 종일 일정과 시간 일정을 다르게 저장하는 이유, 인수인계의 낙관적 잠금을 설명한다.
---

## 이 편의 지도

[![Event 아래에 범위를 그대로 따르는 Resource·Schedule·Handover와, 그 안에서 더 좁힐 수 있는 Task·Meeting이 놓인 그림](/materials/diagrams/cpg-06b-event-hub.svg)](/materials/diagrams/cpg-06b-event-hub.svg)

*그림 06-2 · 행사는 하위 자료의 상한이다 — 누르면 원본 크기로 열린다.*

| 탭 | 테이블 | 읽기 권한 | 쓰기 권한 (기획서 5.6절) |
| --- | --- | --- | --- |
| Overview | `events` | `can_read_event` | 관리하는 Event (국장) / 전체 (회장단) |
| Task | `tasks` (`event_id`) | `can_read_event` ∩ `can_read_task` | 06-1편 |
| 일정 | `schedules` (`event_id`) | `can_read_event` 상속 | 관리하는 Event |
| 자료 | `event_resources` + Storage | `can_read_event` 상속 | 등록: 열람 가능자 / 수정·삭제: 본인 등록 또는 관리자 |
| 회의록 | `meeting_minutes` (`event_id`) | `can_read_event` ∩ `can_read_meeting` | 06-3편 |
| 인수인계 | `handovers` (`event_id`) | 초안: 작성자·관리자 / 발행본: `can_read_event` | 초안 작성: 열람 가능자 / 발행: 관리자 |

```text
app/(council)/events/[eventId]/
├─ layout.tsx          ← 행사 이름·상태 + 탭 메뉴. can_read_event 실패면 notFound()
├─ page.tsx            ← Overview
├─ tasks/page.tsx
├─ schedule/page.tsx
├─ resources/page.tsx  ← 03-4편 업로드
├─ meetings/page.tsx
├─ handovers/page.tsx
└─ settings/page.tsx   ← 열람 범위·관리자 (관리 권한자만)
```

## 1. 행사 만들기

```ts
// app/(council)/events/actions.ts
const EventInput = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().max(2000).optional(),
  ownerDepartmentId: z.string().uuid(),
  visibilityMode: z.enum(["ALL_COUNCIL", "RESTRICTED"]),
  startsAt: z.string().datetime({ offset: true }).optional(),
  endsAt: z.string().datetime({ offset: true }).optional(),
});

export async function createEvent(input: unknown) {
  const parsed = EventInput.safeParse(input);
  if (!parsed.success) return { ok: false, message: "입력을 확인하세요." };
  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_event", {
    p_name: parsed.data.name,
    p_description: parsed.data.description ?? null,
    p_owner_department_id: parsed.data.ownerDepartmentId,
    p_visibility_mode: parsed.data.visibilityMode,
    p_starts_at: parsed.data.startsAt ?? null,
    p_ends_at: parsed.data.endsAt ?? null,
  });
  if (error) return { ok: false, message: toUserMessage(error) };
  redirect(`/events/${id}`);
}
```

`create_event` DB 함수는 "국장은 주관 국이 자기 국일 때만, 회장단은 전체"(기획서 5.6절)를 검사하고 `created_by`와 `term_id`를 서버에서 채웁니다.

## 2. 범위를 좁힐 때 — 충돌 찾기

행사를 ALL_COUNCIL → RESTRICTED(재무국만)로 바꾸면, 지금 지정된 사람 중 일부가 행사를 볼 수 없게 됩니다. 기획서 5.2절은 이 **충돌을 목록으로 보여 주고 해결 방법을 골라야 저장**되게 합니다.

```sql
-- 새 범위를 가정했을 때 행사를 볼 수 없게 되는 지정들
create function public.preview_event_scope_change(
  p_event_id uuid, p_mode text, p_rules jsonb      -- 새 ACL 규칙 목록
) returns table (kind text, resource_id uuid, resource_title text, user_id uuid, user_name text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not private.can_manage_event(p_event_id) then
    raise exception 'USER:행사 범위를 바꿀 권한이 없습니다.' using errcode = 'P0001';
  end if;

  return query
  -- 업무 담당자·관리자
  select 'task_assignee', t.id, t.title, t.assignee_id, p.display_name
  from public.tasks t join public.profiles p on p.id = t.assignee_id
  where t.event_id = p_event_id and t.status <> 'DONE' and t.archived_at is null
    and not private.would_read_event(t.assignee_id, p_event_id, p_mode, p_rules)
  union all
  -- 회의록 편집자
  select 'meeting_editor', m.id, m.title, e.user_id, p.display_name
  from public.meeting_minutes m
  join public.meeting_editors e on e.meeting_id = m.id
  join public.profiles p on p.id = e.user_id
  where m.event_id = p_event_id and m.status = 'DRAFT'
    and not private.would_read_event(e.user_id, p_event_id, p_mode, p_rules);
  -- (업무·회의록 ACL의 USER·DEPARTMENT 대상도 같은 방식)
end;
$$;
```

`private.would_read_event(사람, 행사, 새 모드, 새 규칙)`은 `can_read_event`와 **같은 판단**을 "새 범위가 적용됐다면"으로 계산하는 함수입니다. 판단 로직을 한 곳에 두고 두 함수가 공유합니다.

### 화면

```tsx
{conflicts.length > 0 && (
  <section aria-labelledby="conflict-title" className="rounded border border-danger p-4">
    <h2 id="conflict-title" className="font-bold">범위를 좁히면 행사를 볼 수 없게 되는 지정 {conflicts.length}건</h2>
    <ul>
      {conflicts.map((c) => (
        <li key={`${c.kind}-${c.resource_id}-${c.user_id}`}>
          {c.user_name} — {c.kind === "task_assignee" ? "업무 담당" : "회의록 편집"}: {c.resource_title}
        </li>
      ))}
    </ul>
    <fieldset>
      <legend>어떻게 할까요?</legend>
      <label><input type="radio" name="resolution" value="KEEP_IN_ACL" /> 이 사람들을 행사 열람 대상에 남긴다</label>
      <label><input type="radio" name="resolution" value="REASSIGN" /> 담당·편집을 다른 사람으로 바꾼다 (안 바꾼 업무는 "재배정 필요")</label>
      <label><input type="radio" name="resolution" value="REMOVE" /> 하위 지정을 제거한다</label>
    </fieldset>
  </section>
)}
```

## 3. 해결을 한 번에 적용하기

```sql
create function public.apply_event_scope_change(
  p_event_id uuid, p_mode text, p_rules jsonb, p_resolution text, p_reassign jsonb
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  e public.events%rowtype;
begin
  select * into e from public.events where id = p_event_id for update;   -- 행사 잠금
  if not private.can_manage_event(p_event_id) then
    raise exception 'USER:행사 범위를 바꿀 권한이 없습니다.' using errcode = 'P0001';
  end if;

  -- 1) 새 범위 저장
  update public.events set visibility_mode = p_mode, updated_at = now() where id = p_event_id;
  delete from public.event_access_rules where event_id = p_event_id;
  insert into public.event_access_rules (event_id, subject_type, department_id, user_id, role_group, granted_by)
  select p_event_id, r->>'subject_type', (r->>'department_id')::uuid, (r->>'user_id')::uuid, r->>'role_group', auth.uid()
  from jsonb_array_elements(p_rules) r;

  -- 2) 고른 해결 방법 적용
  if p_resolution = 'KEEP_IN_ACL' then
    insert into public.event_access_rules (event_id, subject_type, user_id, granted_by)
    select distinct p_event_id, 'USER', c.user_id, auth.uid()
    from public.preview_event_scope_change(p_event_id, p_mode, p_rules) c
    on conflict do nothing;
  elsif p_resolution = 'REASSIGN' then
    perform private.reassign_conflicts(p_event_id, p_reassign);       -- 안 고른 미완료 업무는 assignee_id = null
  elsif p_resolution = 'REMOVE' then
    perform private.remove_conflicting_assignments(p_event_id);
  end if;

  -- 3) 남은 충돌이 있으면 전체 취소
  if exists (select 1 from public.preview_event_scope_change(p_event_id, p_mode, p_rules)) then
    raise exception 'USER:아직 해결되지 않은 지정이 있습니다.' using errcode = 'P0001';
  end if;

  perform private.log_activity(e.term_id, 'event', e.id, 'scope.change',
    jsonb_build_object('mode', e.visibility_mode), jsonb_build_object('mode', p_mode, 'resolution', p_resolution));
end;
$$;
```

| 단계 | 왜 한 트랜잭션인가 |
| --- | --- |
| 범위 저장 + 해결 적용 + 남은 충돌 검사 | 범위만 좁혀지고 해결이 실패하면 "편집자인데 못 보는" 상태가 남음. 마지막 검사에서 하나라도 남으면 **전부 취소** |

기획서 5.2절: "선택 결과는 하나의 트랜잭션으로 적용하고 Activity Log에 남긴다."

> [!NOTE]
> 범위를 좁히면 하위 자료의 유효 접근도 **즉시** 좁아집니다. 별도 복사 작업이 없는 이유는, 하위 테이블의 정책이 매번 `can_read_event`를 부르기 때문입니다. 저장된 것은 "규칙"이고, 접근 여부는 매 요청 계산됩니다.

## 4. 일정 — 종일과 시간을 다르게

```ts
const ScheduleInput = z.discriminatedUnion("isAllDay", [
  z.object({ isAllDay: z.literal(true),  startDate: z.string().date(), endDate: z.string().date(), title: z.string().min(1) }),
  z.object({ isAllDay: z.literal(false), startsAt: z.string().datetime({ offset: true }), endsAt: z.string().datetime({ offset: true }), title: z.string().min(1) }),
]);
```

| 일정 | 저장 열 | 이유 |
| --- | --- | --- |
| 시간 일정 (19:00–21:00) | `starts_at`, `ends_at` (`timestamptz`) | 시각은 시간대 정보와 함께 저장하고 화면에서 `Asia/Seoul`로 표시 |
| 종일 일정 (11/20) | `start_date`, `end_date` (`date`) | 날짜를 시각으로 저장하면 시간대 변환 때 **하루 밀려** 11/19로 보일 수 있음 |

```ts
// 화면 표시
new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" }).format(new Date(s.starts_at));
```

DB에는 `check ((is_all_day and start_date is not null and starts_at is null) or (not is_all_day and starts_at is not null and start_date is null))`로 둘이 섞이지 않게 합니다.

## 5. 인수인계 — 낙관적 잠금

인수인계는 실시간 공동 편집을 하지 않으므로(기획서 5.5절), 두 사람이 동시에 고치면 나중 저장이 앞사람 것을 덮어쓸 수 있습니다. **낙관적 잠금**으로 막습니다.

```sql
update public.handovers
set content = p_content, updated_at = now()
where id = p_id
  and updated_at = p_expected_updated_at        -- 내가 열었을 때의 시각과 같을 때만
returning id;
-- 0행이 바뀌었다면 그 사이 누군가 저장한 것 → 'USER:다른 사람이 먼저 수정했습니다. 새로고침 후 다시 시도하세요.'
```

"충돌은 드물 것이라 낙관하고, 저장 순간에만 확인한다"는 뜻입니다. 충돌하면 HTTP 409(01-1편)에 해당하는 안내를 보여 줍니다.

> [!QUIZ]
> `apply_event_scope_change`에서 마지막의 "남은 충돌 검사"를 빼면 어떤 상황이 생길 수 있나요?

> [!ANSWER]
> REASSIGN을 골랐는데 일부 회의록 편집자를 바꾸지 않았거나, 처리 함수에 빠진 종류(예: 업무 ACL의 DEPARTMENT 대상)가 있으면, 범위는 좁혀졌는데 행사를 못 보는 편집자·지정이 남습니다. 기획서가 막으려는 "편집 권한은 있는데 열람할 수 없는" 상태입니다. 마지막 검사가 있으면 그 경우 전체를 취소하고 사용자에게 다시 고르게 합니다.

> [!QUIZ]
> 종일 일정 "11월 20일 축제"를 `starts_at = '2026-11-20T00:00:00Z'`로 저장하면 한국 화면에 어떻게 보이나요? 반대로 미국 서버 시간대에서 날짜만 잘라 쓰면요?

> [!ANSWER]
> UTC 자정은 한국 시각으로 11월 20일 오전 9시라서 "9:00 시작"처럼 시간이 붙어 보입니다. 반대로 한국 자정(`2026-11-20T00:00+09:00`)을 UTC로 바꾸면 11월 19일 15:00이 되어 날짜만 잘라 쓰면 **11월 19일**로 하루 밀립니다. 종일 일정은 시각이 아닌 `date` 열에 저장해야 이런 문제가 없습니다.

## 학습 경로

[← 06-1 업무](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-01) · [06-3 안건과 회의록 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-03)
