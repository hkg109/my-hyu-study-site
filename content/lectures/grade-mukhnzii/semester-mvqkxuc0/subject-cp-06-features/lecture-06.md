---
title: "06-6 · 새 기수 세팅 화면과 기수 전환"
description: "추가 결정 3을 구현합니다. 새 회장단이 DRAFT 기수 안에서 기수 정보·부서와 직책·구성원 일괄 등록·회의 양식을 단계별로 준비하고, 준비가 끝나면 activate_term() 한 번의 트랜잭션으로 이전 기수를 닫고 새 기수를 여는 과정, 전환 직후 Archive Grant로 이전 자료를 여는 과정까지 화면 → 서버 → DB로 따라갑니다."
order: 6
published: true
duration: 60
tags: [새 기수, 세팅 마법사, 일괄 등록, 기수 전환, 트랜잭션, Archive Grant]
objectives:
  - 세팅 화면의 일곱 단계와 각 단계의 완료 조건을 말한다.
  - 구성원 일괄 등록에서 미리보기와 줄별 오류를 보여 주는 이유를 말한다.
  - activate_term이 한 트랜잭션에서 하는 일을 순서대로 말한다.
  - Archive Grant를 전환 뒤에 주는 이유와 유효 조건을 말한다.
---

## 이 편의 지도

[![기수 정보, 회장단, 부서와 직책, 구성원 등록, 회의 양식, 확인과 전환, 전환 직후 이전 자료 열람의 일곱 단계](/materials/diagrams/cpg-17-term-setup.svg)](/materials/diagrams/cpg-17-term-setup.svg)

*그림 06-7 · 일곱 단계 세팅 마법사 — 누르면 원본 크기로 열린다.*

| 단계 | 화면 | DB 함수 | 완료 조건 |
| --- | --- | --- | --- |
| 1 기수 정보 | `/admin/term-setup/info` | `update_draft_term` | 이름·시작 예정일·건의 이월 정책 입력 |
| 2 회장단 | `/admin/handover` (06-5) | `request_handover`, `decide_handover` | EXECUTIVE 승인 행 1개 이상 **+ 그중 1명 이상 로그인(활성화)** |
| 3 부서·직책 | `/admin/term-setup/organization` | `save_departments`, `save_positions` | 부서 1개 이상 |
| 4 구성원 등록 | `/admin/term-setup/members` | `bulk_register_accounts` | 승인 명단 1명 이상 (회장단 제외) |
| 5 회의 양식 | `/admin/term-setup/templates` | `save_meeting_template` | 선택 |
| 6 확인·전환 | `/admin/term-setup/confirm` | `activate_term` | 1–4 완료 + 시작 예정일 도래 |
| 7 이전 자료 열람 | `/admin/archive-access` | `grant_archive_access` | 선택 · 전환 **후** |

> [!NOTE]
> 기획서 8절대로 새 기수는 **빈 상태**에서 시작합니다. 부서·직책·Template을 지난 기수에서 자동으로 복사하지 않습니다. 대신 3단계 화면에 "지난 기수 부서 이름 보기" 참고 목록을 띄워 손으로 다시 입력하기 쉽게만 합니다.

## 1. 진행 상황을 한 번에 — term_setup_status

```sql
create function public.term_setup_status(p_term_id uuid)
returns table (step text, done boolean, detail text)
language sql stable security definer set search_path = ''
as $$
  select 'info', t.name is not null and t.starts_on is not null, coalesce(t.name, '')
    from public.terms t where t.id = p_term_id and private.is_executive(p_term_id)
  union all
  select 'executives', exists (select 1 from public.memberships m
      where m.term_id = p_term_id and m.role = 'EXECUTIVE' and m.is_active),
    (select count(*)::text from public.approved_council_accounts a where a.term_id = p_term_id and a.role = 'EXECUTIVE' and a.is_active) || '명 승인'
    where private.is_executive(p_term_id)
  union all
  select 'organization', exists (select 1 from public.departments d where d.term_id = p_term_id and d.is_active),
    (select count(*)::text from public.departments d where d.term_id = p_term_id and d.is_active) || '개 부서'
    where private.is_executive(p_term_id)
  union all
  select 'members', exists (select 1 from public.approved_council_accounts a
      where a.term_id = p_term_id and a.role <> 'EXECUTIVE' and a.is_active),
    (select count(*)::text from public.approved_council_accounts a where a.term_id = p_term_id and a.role <> 'EXECUTIVE' and a.is_active) || '명'
    where private.is_executive(p_term_id);
$$;
```

```tsx
// app/(council)/admin/term-setup/page.tsx  · 서버
const { data: steps } = await supabase.rpc("term_setup_status", { p_term_id: draftTermId });
const ready = ["info", "executives", "organization", "members"].every((s) => steps?.find((x) => x.step === s)?.done);

return (
  <ol className="space-y-2">
    {STEP_LABELS.map(({ key, label, href, required }) => {
      const s = steps?.find((x) => x.step === key);
      return (
        <li key={key} className="flex items-center justify-between rounded border p-3">
          <Link href={href}>{label}</Link>
          <span>{s?.done ? "완료" : required ? "필수 · 미완료" : "선택"} {s?.detail && `· ${s.detail}`}</span>
        </li>
      );
    })}
    <li><Link href="/admin/term-setup/confirm" aria-disabled={!ready} className={ready ? "" : "pointer-events-none opacity-50"}>확인 · 전환</Link></li>
  </ol>
);
```

화면 버튼이 꺼져 있어도 `activate_term`이 같은 조건을 다시 검사합니다.

## 2. 구성원 일괄 등록 (4단계)

회장단이 스프레드시트에서 복사해 붙여 넣는 방식입니다.

```text
email,department,role,position
kim01@hanyang.ac.kr,사무국,DIRECTOR,사무국장
lee02@hanyang.ac.kr,사무국,MEMBER,국원
park03@hanyang.ac.kr,홍보국,MEMBER,국원
```

```ts
// app/(council)/admin/term-setup/members/actions.ts
"use server";
const Row = z.object({
  email: z.string().trim().toLowerCase().email().refine((e) => e.endsWith("@hanyang.ac.kr"), "학교 이메일이 아닙니다"),
  department: z.string().trim().min(1),
  role: z.enum(["MEMBER", "DIRECTOR"]),            // EXECUTIVE는 여기서 못 줌 → 06-5 두 사람 승인으로만
  position: z.string().trim().min(1),
});

export async function previewMembers(termId: string, pasted: string) {
  const lines = pasted.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const body = lines[0]?.toLowerCase().startsWith("email") ? lines.slice(1) : lines;   // 머리줄 건너뛰기
  return body.map((line, i) => {
    const [email, department, role, position] = line.split(",");
    const r = Row.safeParse({ email, department, role, position });
    return r.success ? { line: i + 1, ok: true, row: r.data } : { line: i + 1, ok: false, error: r.error.issues[0].message };
  });
}

export async function commitMembers(termId: string, rows: z.infer<typeof Row>[]) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("bulk_register_accounts", { p_term_id: termId, p_rows: rows });
  if (error) return { ok: false, message: toUserMessage(error) };
  revalidatePath("/admin/term-setup");
  return { ok: true, result: data };               // [{ email, status: 'added' | 'exists' | 'error', reason }]
}
```

| 설계 | 이유 |
| --- | --- |
| 미리보기 먼저, 확정은 따로 | 오타 한 줄 때문에 50명 등록이 엉키지 않게 줄별 오류를 보여 줌 |
| `role`에 EXECUTIVE 없음 | 회장단 권한은 두 사람 승인으로만 (06-5) |
| 부서는 **이름**으로 받고 DB 함수가 같은 기수의 부서 ID로 바꿈 | 없는 부서 이름이면 그 줄만 오류 |
| 국장 중복 | 한 부서에 DIRECTOR 둘이면 그 줄 오류 (기획서 1.2절: MVP 1명) |

기획서 1.5절대로 승인 행은 첫 로그인 때 Membership이 됩니다. 일괄 등록은 Membership을 **직접 만들지 않습니다.**

## 3. 기수 전환 — activate_term

```sql
create function public.activate_term(p_new_term_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_new  public.terms%rowtype;
  v_old  public.terms%rowtype;
  v_carry boolean;
begin
  -- 0) 두 기수를 잠그고 확인
  select * into v_new from public.terms where id = p_new_term_id for update;
  select * into v_old from public.terms where status = 'ACTIVE' for update;

  if v_new.status <> 'DRAFT' then
    raise exception 'USER:준비 중(DRAFT)인 기수만 시작할 수 있습니다.' using errcode = 'P0001';
  end if;
  if not private.is_executive(p_new_term_id) then
    raise exception 'USER:새 기수 회장단만 전환할 수 있습니다.' using errcode = 'P0001';
  end if;
  if v_new.starts_on is null or v_new.starts_on > current_date then
    raise exception 'USER:시작 예정일 이후에 전환할 수 있습니다.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.term_setup_status(p_new_term_id)
             where step in ('info', 'executives', 'organization', 'members') and not done) then
    raise exception 'USER:필수 준비 단계가 끝나지 않았습니다.' using errcode = 'P0001';
  end if;

  v_carry := coalesce(v_new.carry_over_suggestions, true);   -- 1단계에서 정한 운영값

  if v_old.id is not null then
    -- 1) 미처리 건의 (기획서 7.3절)
    if v_carry then
      update public.suggestions
      set term_id = p_new_term_id, assigned_department_id = null, assigned_user_id = null, updated_at = now()
      where term_id = v_old.id and status in ('RECEIVED', 'IN_REVIEW');
    elsif exists (select 1 from public.suggestions where term_id = v_old.id and status in ('RECEIVED', 'IN_REVIEW')) then
      raise exception 'USER:마감 정책입니다. 이전 회장단이 남은 건의를 먼저 마감해야 합니다.' using errcode = 'P0001';
    end if;

    -- 2) 이전 기수 닫기
    update public.terms set status = 'CLOSED', ends_on = current_date where id = v_old.id;
    update public.memberships set is_active = false, left_at = now() where term_id = v_old.id and is_active;
    update public.term_handover_requests set status = 'CANCELLED', decided_at = now()
      where source_term_id = v_old.id and status = 'PENDING';
  end if;

  -- 3) 새 기수 열기
  update public.terms set status = 'ACTIVE' where id = p_new_term_id;

  -- 4) 열린 회의록 채널에 재구독 신호 (커밋되면 전달됨)
  perform realtime.send('{}'::jsonb, 'resubscribe', 'meeting:' || m.id, true)
  from public.meeting_minutes m where m.term_id = v_old.id and m.status = 'DRAFT';

  perform private.log_activity(p_new_term_id, 'term', p_new_term_id, 'activate',
    jsonb_build_object('previous_term_id', v_old.id), jsonb_build_object('carry_over', v_carry));
end;
$$;
```

| 단계 | 내용 | 기획서 |
| --- | --- | --- |
| 0 | 두 기수 잠금, 권한·날짜·준비 확인 | 추가 결정 3 |
| 1 | 미처리 건의 이월 또는 마감 확인 | 7.3, 0.2 |
| 2 | 이전 기수 CLOSED, 모든 Membership 종료, 대기 중 이양 요청 취소 | 8.1 전환 절차 3 |
| 3 | 새 기수 ACTIVE (ACTIVE는 하나: 부분 UNIQUE) | 8.1 |
| 4 | 재구독 신호 | 8.1 전환 절차 4 |

> [!EXAM]
> 이 함수는 **전부 아니면 전무**입니다. 1단계에서 마감 정책 위반으로 예외가 나면 아무것도 바뀌지 않습니다. 3단계에서 실패하면 2단계에서 닫은 이전 기수도 다시 ACTIVE로 돌아갑니다. "ACTIVE 기수가 하나도 없는" 순간이 생기지 않습니다(04-3편).

### 전환 화면

```tsx
// confirm/page.tsx (일부)
<section className="space-y-3">
  <h2 className="text-xl font-bold">2026 → 2027 전환</h2>
  <ul>
    <li>이전 기수 구성원 {oldMemberCount}명의 권한이 끝납니다. 필요한 자료는 전환 후 Archive Grant로 엽니다.</li>
    <li>미처리 건의 {openSuggestions}건: {carry ? "새 기수로 이월" : "마감 정책 — 0건이어야 전환 가능"}</li>
    <li>진행 중인 회의록 {draftMeetings}건은 읽기 전용이 됩니다.</li>
  </ul>
  <label><input type="checkbox" required /> 위 내용을 확인했고, 되돌릴 수 없다는 것을 압니다.</label>
  <Button onClick={activate} disabled={!ready}>2027 기수 시작</Button>
</section>
```

## 4. 전환 직후 — Archive Grant (7단계)

```sql
create function public.grant_archive_access(
  p_source_term_id uuid, p_grantee uuid, p_scope_type text, p_scope_id uuid, p_expires_at timestamptz, p_confirm_term boolean
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_active uuid; v_id uuid;
begin
  select id into v_active from public.terms where status = 'ACTIVE';
  if not private.is_executive(v_active) then
    raise exception 'USER:현재 기수 회장단만 부여할 수 있습니다.' using errcode = 'P0001';
  end if;
  if (select status from public.terms where id = p_source_term_id) <> 'CLOSED' then
    raise exception 'USER:지난(CLOSED) 기수만 대상입니다.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.memberships where term_id = v_active and user_id = p_grantee and is_active) then
    raise exception 'USER:현재 기수 구성원에게만 부여할 수 있습니다.' using errcode = 'P0001';
  end if;
  if p_scope_type = 'TERM' and not p_confirm_term then
    raise exception 'USER:기수 전체 열람은 확인이 필요합니다.' using errcode = 'P0001';
  end if;
  if p_scope_type <> 'TERM' and not private.scope_belongs_to_term(p_scope_type, p_scope_id, p_source_term_id) then
    raise exception 'USER:선택한 범위가 그 기수의 자료가 아닙니다.' using errcode = 'P0001';
  end if;

  insert into public.term_archive_access (source_term_id, grantee_user_id, scope_type, scope_id, expires_at, granted_by)
  values (p_source_term_id, p_grantee, p_scope_type, p_scope_id, p_expires_at, (select auth.uid()))
  returning id into v_id;
  perform private.log_activity(v_active, 'archive_grant', v_id, 'grant', null,
    jsonb_build_object('scope_type', p_scope_type, 'expires_at', p_expires_at));
  return v_id;
end;
$$;
```

- 받는 사람이 **현재 ACTIVE 기수**의 활성 구성원이어야 하므로, 새 기수가 ACTIVE가 된 **뒤에만** 줄 수 있습니다. 그래서 7단계가 전환 다음입니다.
- 조회할 때마다 "만료 안 됨 + 회수 안 됨 + 받은 사람이 지금도 ACTIVE 구성원"을 모두 확인합니다(`private.has_archive_grant`, 04-4편).
- 건의 작성자 정보와 RESTRICTED 업무·회의록은 명시하지 않으면 대상에서 빠집니다(기획서 8.1절).
- 전환 전에 이전 회장단이 인수인계(Handover)를 **발행**해 두면, 새 회장단은 HANDOVER 범위 Grant 하나로 핵심 자료를 바로 볼 수 있습니다.

## 5. 이 기능의 테스트 목록

| 사례 | 기대 |
| --- | --- |
| 국장이 `activate_term` 호출 | 거부 |
| 새 회장단이 시작 예정일 전 전환 | 거부 |
| 부서 0개인 상태로 전환 | 거부 |
| 마감 정책 + 미처리 건의 1건 | 거부, 아무것도 안 바뀜 |
| 정상 전환 후 이전 기수 국원이 이전 업무 조회 | 0건 |
| 정상 전환 후 ACTIVE 기수 수 | 정확히 1 |
| Grant 없이 이전 기수 자료 조회 | 0건 / Grant 후 범위 안만 / 만료 후 0건 |
| 일괄 등록에 EXECUTIVE 줄 포함 | 그 줄만 오류 |

> [!QUIZ]
> 새 회장단이 전환 버튼을 누르는 순간, 이전 기수 회장단 G가 회의록을 편집 중이었습니다. G의 화면과 저장 요청은 어떻게 되나요?

> [!ANSWER]
> 전환이 커밋되면 G의 회의록 채널에 `resubscribe` 신호가 가고, G의 화면은 채널을 다시 연결하며 권한을 다시 판정받습니다. G의 이전 기수 Membership은 종료됐고 기수도 CLOSED라서 편집 권한이 없으므로 에디터가 읽기 전용으로 바뀌고, 그 사이 보낸 저장 요청은 `save_meeting_update`가 42501로 거부합니다. 미저장 내용이 있다는 안내가 뜹니다.

> [!QUIZ]
> Archive Grant를 세팅 화면 5단계쯤(전환 전)에 미리 주면 안 되는 이유는?

> [!ANSWER]
> Grant를 받는 사람은 "현재 ACTIVE 기수의 활성 구성원"이어야 하는데, 전환 전에는 새 회장단의 Membership이 DRAFT 기수에만 있습니다. 또 대상 기수(이전 기수)가 아직 CLOSED가 아니어서 Grant의 의미도 맞지 않습니다. 전환으로 새 기수가 ACTIVE, 이전 기수가 CLOSED가 된 뒤에 줍니다.

## 학습 경로

[← 06-5 회장단 권한 이양](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-05) · [07-1 계정과 서비스 소유권 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-01)
