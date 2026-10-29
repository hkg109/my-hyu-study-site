---
title: "06-5 · 회장단 권한 이양"
description: "추가 결정 2를 구현합니다. 현 회장이 다음 기수(DRAFT)를 만들고 다음 회장단 이메일을 지정하면, 요청자가 아닌 다른 회장단이 승인해야 다음 기수 승인 명단에 EXECUTIVE로 등록되는 흐름을 화면 → 서버 → DB로 따라가고, 거절·취소·만료와 회장단이 아무도 없을 때의 비상 절차까지 다룹니다."
order: 5
published: false
duration: 50
tags: [권한 이양, 다음 회장단, 두 사람 승인, DRAFT 기수, 비상 절차]
objectives:
  - 권한 이양이 두 사람 승인으로 설계된 이유를 말한다.
  - request_handover와 decide_handover가 각각 검사하는 조건을 말한다.
  - 승인된 다음 회장이 실제 권한을 얻는 시점을 설명한다.
  - 비상 절차를 써야 하는 경우와 그때 남길 기록을 말한다.
---

## 1. 왜 이 기능이 필요한가

기획서 2.2절은 "첫 EXECUTIVE는 운영자가 신뢰된 서버 절차로 한 번만 등록"하게 했습니다. 하지만 학생회는 **매년** 회장단이 바뀝니다. 매년 개발자가 SQL로 DB를 직접 고치면:

- 그해 개발자가 없으면 다음 기수를 시작할 수 없고,
- 누가 언제 왜 권한을 줬는지 기록이 흩어지고,
- DB 관리자 권한을 가진 사람이 늘어납니다.

그래서 **현 회장단이 화면에서** 다음 회장단을 지정하되, **혼자서는 못 하도록** 두 사람 승인으로 만듭니다.

[![현 회장이 새 기수를 DRAFT로 만들고 다음 회장단 이메일을 지정하면 PENDING 요청이 생기고, 요청자가 아닌 다른 회장단이 승인하면 DRAFT 기수 승인 명단에 EXECUTIVE로 등록되며, 다음 회장이 첫 로그인하면 DRAFT 기수 Membership이 생기는 흐름](/materials/diagrams/cpg-16-handover.svg)](/materials/diagrams/cpg-16-handover.svg)

*그림 06-6 · 다음 회장단을 지정하는 길 — 누르면 원본 크기로 열린다.*

## 2. 화면 — `/admin/handover`

ACTIVE 기수의 EXECUTIVE에게만 메뉴가 보입니다.

```text
┌ 다음 기수 준비 ───────────────────────────────────────────┐
│ 다음 기수: 2027 제39대 학생회 (DRAFT · 시작 예정 2027-03-01) │
│                                                              │
│ 다음 회장단 지정                                             │
│  [ nextpres@hanyang.ac.kr        ] [지정 요청]               │
│                                                              │
│ 승인 대기                                                    │
│  nextpres@…   요청: 김회장   기한: 11/07   [승인] [거절]     │ ← 요청자 본인 화면엔 [취소]만
│                                                              │
│ 처리됨                                                       │
│  vp@…   APPROVED   승인: 이부회장   11/01                    │
└──────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> MVP에는 알림 기능이 없으므로(기획서 13.2절), 승인 대기 요청은 **회장단 Dashboard 맨 위**에 표시합니다. 요청한 사람이 다른 회장단에게 직접 연락해 승인을 부탁합니다.

```tsx
// app/(council)/admin/handover/request-form.tsx
"use client";
export function RequestForm({ targetTermId }: { targetTermId: string }) {
  const [state, action, pending] = useActionState(requestHandover, { ok: false, message: null });
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="targetTermId" value={targetTermId} />
      <div>
        <label htmlFor="email">다음 회장단 학교 이메일</label>
        <input id="email" name="email" type="email" required pattern=".+@hanyang\.ac\.kr" className="rounded border p-2" />
      </div>
      <button disabled={pending}>지정 요청</button>
      <p className="w-full text-sm text-muted">
        다른 회장단 1명이 승인해야 등록됩니다. 등록된 사람은 건의 작성자 신원을 볼 수 있는 EXECUTIVE 권한을 받습니다.
      </p>
      {state.message && <p role="status" className="w-full">{state.message}</p>}
    </form>
  );
}
```

기획서 7.1절대로 EXECUTIVE를 부여하는 화면에는 "이 사람도 건의 작성자 신원을 볼 수 있다"는 경고를 둡니다.

## 3. 서버

```ts
// app/(council)/admin/handover/actions.ts
"use server";
const RequestInput = z.object({
  targetTermId: z.string().uuid(),
  email: z.string().trim().toLowerCase().email().refine((e) => e.endsWith("@hanyang.ac.kr"), "학교 이메일만 지정할 수 있습니다."),
});

export async function requestHandover(_: unknown, fd: FormData) {
  const parsed = RequestInput.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.rpc("request_handover", {
    p_target_term_id: parsed.data.targetTermId, p_email: parsed.data.email,
  });
  if (error) return { ok: false, message: toUserMessage(error) };
  revalidatePath("/admin/handover");
  return { ok: true, message: "요청했습니다. 다른 회장단의 승인을 받으세요." };
}

export async function decideHandover(requestId: string, approve: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_handover", { p_request_id: requestId, p_approve: approve });
  if (error) return { ok: false, message: toUserMessage(error) };
  revalidatePath("/admin/handover");
  return { ok: true, message: approve ? "승인했습니다." : "거절했습니다." };
}
```

## 4. DB — 요청

```sql
create function public.request_handover(p_target_term_id uuid, p_email text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_active uuid;
  v_id     uuid;
begin
  select id into v_active from public.terms where status = 'ACTIVE';
  if not private.is_executive(v_active) then
    raise exception 'USER:현재 기수 회장단만 다음 회장단을 지정할 수 있습니다.' using errcode = 'P0001';
  end if;
  if (select status from public.terms where id = p_target_term_id) is distinct from 'DRAFT' then
    raise exception 'USER:준비 중(DRAFT)인 다음 기수에만 지정할 수 있습니다.' using errcode = 'P0001';
  end if;

  insert into public.term_handover_requests (source_term_id, target_term_id, nominee_email, requested_by)
  values (v_active, p_target_term_id, lower(trim(p_email)), (select auth.uid()))
  returning id into v_id;                             -- 같은 사람 PENDING 중복은 부분 UNIQUE가 거부

  perform private.log_activity(v_active, 'term_handover', v_id, 'request', null,
    jsonb_build_object('target_term_id', p_target_term_id));     -- 이메일은 로그에 넣지 않음
  return v_id;
end;
$$;
```

## 5. DB — 승인·거절

```sql
create function public.decide_handover(p_request_id uuid, p_approve boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  r   public.term_handover_requests%rowtype;
  uid uuid := (select auth.uid());
begin
  select * into r from public.term_handover_requests where id = p_request_id for update;
  if not found or r.status <> 'PENDING' then
    raise exception 'USER:처리할 수 없는 요청입니다.' using errcode = 'P0001';
  end if;

  -- 기한 지남 → 거부. (여기서 status를 EXPIRED로 바꾼 뒤 예외를 던지면 그 UPDATE도 함께 취소된다.
  --  만료 표시는 매일 도는 정기 작업 expire_handover_requests()가 따로 한다)
  if r.expires_at < now() then
    raise exception 'USER:기한이 지난 요청입니다. 다시 요청하세요.' using errcode = 'P0001';
  end if;

  -- 결정하는 사람: 요청한 기수가 아직 ACTIVE이고, 그 기수 회장단이며, 요청자 본인이 아님
  if (select status from public.terms where id = r.source_term_id) <> 'ACTIVE'
     or not private.is_executive(r.source_term_id)
     or uid = r.requested_by then
    raise exception 'USER:요청자가 아닌 현재 회장단만 결정할 수 있습니다.' using errcode = 'P0001';
  end if;

  -- 요청자도 아직 현재 회장단인가 (그사이 Membership이 끝났다면 무효)
  if not exists (select 1 from public.memberships
                 where term_id = r.source_term_id and user_id = r.requested_by and is_active and role = 'EXECUTIVE') then
    raise exception 'USER:요청한 사람이 더 이상 회장단이 아닙니다.' using errcode = 'P0001';
  end if;

  update public.term_handover_requests
  set status = case when p_approve then 'APPROVED' else 'REJECTED' end,
      decided_by = uid, decided_at = now()
  where id = r.id;                                  -- 테이블 CHECK도 decided_by <> requested_by를 강제

  if p_approve then
    insert into public.approved_council_accounts (term_id, email, role, registered_by)
    values (r.target_term_id, r.nominee_email, 'EXECUTIVE', r.requested_by)
    on conflict (term_id, email) do update
      set role = 'EXECUTIVE', department_id = null, is_active = true
      where public.approved_council_accounts.activated_user_id is null;    -- 이미 활성화된 행은 건드리지 않음
  end if;

  perform private.log_activity(r.source_term_id, 'term_handover', r.id,
    case when p_approve then 'approve' else 'reject' end, null, null);
end;
$$;
```

| 검사 | 막는 것 |
| --- | --- |
| `status <> 'PENDING'` | 이미 처리된 요청 재처리 |
| `expires_at < now()` | 오래 묵은 요청이 뒤늦게 승인되는 것 |
| 결정자가 현재 ACTIVE 기수 회장단 | 지난 기수·국장의 승인 |
| `uid = requested_by` → 거부 | **혼자 요청하고 혼자 승인** (테이블 CHECK와 이중) |
| 요청자가 아직 회장단 | 그사이 물러난 사람의 요청이 살아 있는 것 |
| `for update` | 두 회장단이 동시에 승인·거절을 누르는 경합 |

## 6. 다음 회장이 권한을 얻는 순간

1. 승인되면 DRAFT 기수의 `approved_council_accounts`에 EXECUTIVE 행이 생깁니다. **아직 Membership은 없습니다.**
2. 다음 회장이 로그인하면 03-3편의 `activate_membership()`이 ACTIVE·DRAFT 기수의 승인 행을 찾아 **DRAFT 기수 Membership**을 만듭니다. 이미 로그인 중이면 화면의 "권한 새로고침" 버튼이 같은 함수를 부릅니다.
3. 이 Membership으로는 **DRAFT 기수의 준비 화면만** 씁니다(기획서 8.1절: DRAFT는 EXECUTIVE만 조직·승인 계정·Template 준비). 지금 ACTIVE 기수의 자료는 그 사람이 ACTIVE 기수에서도 구성원일 때만, 그 Membership의 권한으로 봅니다.
4. 화면 상단에 기수 전환 메뉴("2026 운영 중 / 2027 준비 중")를 두어 어느 기수로 일하는지 분명히 합니다.

## 7. 다음 기수(DRAFT) 만들기

```sql
create function public.create_draft_term(p_name text, p_starts_on date)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_id uuid;
begin
  if not private.is_executive((select id from public.terms where status = 'ACTIVE')) then
    raise exception 'USER:현재 기수 회장단만 다음 기수를 만들 수 있습니다.' using errcode = 'P0001';
  end if;
  insert into public.terms (name, status, starts_on) values (p_name, 'DRAFT', p_starts_on)
  returning id into v_id;                         -- DRAFT는 하나만: 부분 UNIQUE가 두 번째를 거부
  perform private.log_activity(v_id, 'term', v_id, 'create.draft', null, jsonb_build_object('name', p_name));
  return v_id;
end;
$$;
```

## 8. 비상 절차 — 회장단이 아무도 없을 때

두 사람 승인은 ACTIVE 기수에 회장단이 **두 명 이상** 있어야 합니다. 평소에는 회장·부회장을 모두 EXECUTIVE로 두어 이 조건을 지킵니다. 그래도 다음 경우에는 화면으로 할 수 없습니다.

| 상황 | 예 |
| --- | --- |
| 맨 처음 기수 | 시스템을 처음 켤 때 (기획서 2.2절의 원래 절차) |
| 활성 회장단 0명 | 회장단 전원 사퇴·졸업 후 공백 |
| 활성 회장단 1명 | 다른 회장단이 없어 승인 불가 |

이때는 **학생회 공용 계정으로** Supabase SQL Editor에서 정해 둔 스크립트(`docs/emergency/first-executive.sql`)를 실행합니다.

- 실행 전: 학생회 공식 결정(회의록·공지)을 확인하고, 대상자의 학교 계정을 확인합니다.
- 실행 후: `activity_logs`에 `action = 'emergency.grant'`, 사유, 근거 문서를 남기고, `docs/emergency/LOG.md`에 날짜·실행자·근거를 적습니다(개인정보 제외).
- 스크립트는 저장소에 있지만 **공용 계정의 DB 접근 권한이 있어야만** 실행할 수 있습니다. 공개 저장소에 스크립트가 있어도 위험하지 않은 이유입니다.

> [!QUIZ]
> 회장 E가 지정 요청을 한 뒤, 자기 두 번째 계정으로 부회장이 되어 승인하려 합니다. 어디서 막을 수 있고, 어디서는 막지 못하나요?

> [!ANSWER]
> DB는 `decided_by <> requested_by`로 **같은 계정**만 막습니다. E가 다른 계정을 쓰려면 그 계정이 이미 ACTIVE 기수의 EXECUTIVE여야 하는데, EXECUTIVE 부여는 승인 명단 등록(회장단)과 Activity Log를 거치므로 기록이 남습니다. 즉 기술적으로 완전히 막지는 못하고, **두 사람 승인 + 기록 + 회장단 구성의 공식 결정**이 함께 지키는 구조입니다. 그래서 EXECUTIVE 부여 이력은 기수 교대 점검표(07-3)에서 확인합니다.

> [!QUIZ]
> 승인된 다음 회장 F가 아직 로그인하지 않았는데 현 회장단이 마음을 바꿨습니다. 무엇을 해야 하나요?

> [!ANSWER]
> DRAFT 기수의 승인 명단에서 F의 행을 비활성화(`is_active = false`)하는 함수를 회장단이 실행합니다. F가 아직 로그인하지 않아 `activated_user_id`가 비어 있으므로 Membership은 생기지 않습니다. 이미 로그인해 Membership이 생겼다면 DRAFT 기수 Membership을 종료하는 함수를 씁니다. 두 경우 모두 Activity Log에 남습니다.

## 학습 경로

[← 06-4 건의](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-04) · [06-6 새 기수 세팅 화면 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-06)
