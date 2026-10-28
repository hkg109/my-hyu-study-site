---
title: "06-4 · 건의(Suggestion) 따라가기"
description: "일반 학생의 건의 제출부터 회장단의 담당 배정, 담당자의 공개 답변·내부 메모, 작성자의 상태 확인, 기수 전환 때의 이월까지를 화면 → 서버 → DB로 따라가며, 작성자 신원이 어떤 경로로도 담당자에게 새지 않도록 테이블·함수·로그를 설계하는 법을 익힙니다."
order: 4
published: true
duration: 45
tags: [건의, 작성자 신원, 개인정보, 내부 메모, 중복 제출, 이월]
objectives:
  - 건의 제출 함수가 작성자 연결을 서버에서 만드는 이유를 말한다.
  - 작성자 본인 확인 함수가 참/거짓만 돌려주는 이유를 설명한다.
  - 공개 답변과 내부 메모를 누가 보는지 정책으로 읽는다.
  - 신원이 새는 다섯 경로와 각각의 점검 방법을 말한다.
---

## 이 편의 지도

[![건의 내용·상태, 공개 답변, 내부 메모, 작성자 신원을 작성자, 처리 담당, 회장단이 각각 볼 수 있는지 표시한 격자](/materials/diagrams/cpg-07b-suggestion-visibility.svg)](/materials/diagrams/cpg-07b-suggestion-visibility.svg)

*그림 06-5 · 건의는 누가 무엇을 보나 — 누르면 원본 크기로 열린다.*

| 층 | 파일·함수 | 하는 일 |
| --- | --- | --- |
| 화면 | `/suggestions` (모든 로그인 학생), `/suggestions/mine`, `/council/suggestions` (구성원) | 제출, 내 건의, 처리 목록 |
| 서버 | `suggestions/actions.ts` | 검증, 요청 ID, 함수 호출 |
| DB | `submit_suggestion`, `assign_suggestion`, `post_suggestion_message`, `set_suggestion_status` | 권한·신원 분리·기록 |
| DB | `private.is_suggestion_author`, `private.can_handle_suggestion` | 판정 (참/거짓만) |

## 1. 제출 — 작성자 연결은 서버가

```tsx
// app/suggestions/suggestion-form.tsx
"use client";
import { useActionState, useRef } from "react";
import { submitSuggestion } from "./actions";

export function SuggestionForm() {
  const requestId = useRef(crypto.randomUUID());          // 이 폼 한 번에 하나의 요청 ID
  const [state, action, pending] = useActionState(submitSuggestion, { ok: false, message: null });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId.current} />
      <label htmlFor="title">제목</label>
      <input id="title" name="title" required maxLength={100} />
      <label htmlFor="content">내용</label>
      <textarea id="content" name="content" required maxLength={3000} rows={6} />
      <p className="text-sm text-muted">작성자 이름은 회장단과 본인만 볼 수 있습니다. 처리 담당자에게는 전달되지 않습니다.</p>
      {state.message && <p role="status">{state.message}</p>}
      <button disabled={pending}>{pending ? "제출 중…" : "제출"}</button>
    </form>
  );
}
```

```ts
// app/suggestions/actions.ts
"use server";
const Input = z.object({
  requestId: z.string().uuid(),
  title: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(3000),
});

export async function submitSuggestion(_: unknown, fd: FormData) {
  const parsed = Input.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: "제목과 내용을 확인하세요." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_suggestion", {
    p_client_request_id: parsed.data.requestId,
    p_title: parsed.data.title,
    p_content: parsed.data.content,
  });
  if (error) return { ok: false, message: toUserMessage(error) };
  redirect("/suggestions/mine");
}
```

```sql
create function public.submit_suggestion(p_client_request_id uuid, p_title text, p_content text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_term uuid;
  v_id   uuid;
begin
  if v_uid is null then raise exception 'USER:로그인이 필요합니다.' using errcode = 'P0001'; end if;

  -- 같은 요청의 재전송이면 기존 건 (중복 제출 방지)
  select s.id into v_id from public.suggestions s
  join public.suggestion_authors a on a.suggestion_id = s.id
  where s.client_request_id = p_client_request_id and a.author_user_id = v_uid;
  if found then return v_id; end if;

  -- 빈도 제한 (운영값): 최근 10분 3건
  if (select count(*) from public.suggestion_authors a join public.suggestions s on s.id = a.suggestion_id
      where a.author_user_id = v_uid and s.created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'USER:잠시 후 다시 제출하세요.' using errcode = 'P0001';
  end if;

  select id into v_term from public.terms where status = 'ACTIVE';

  insert into public.suggestions (term_id, title, content, status, client_request_id)
  values (v_term, p_title, p_content, 'RECEIVED', p_client_request_id)
  returning id into v_id;

  insert into public.suggestion_authors (suggestion_id, author_user_id) values (v_id, v_uid);   -- 신원은 여기에만

  perform private.log_activity_without_actor(v_term, 'suggestion', v_id, 'submit');   -- actor_id = null
  return v_id;
end;
$$;
```

| 설계 | 이유 |
| --- | --- |
| 작성자 ID를 **인자로 받지 않음** | 클라이언트가 남의 ID를 넣어 대신 쓸 수 없음 (기획서 7.2절) |
| `client_request_id`로 재전송 확인 | 더블클릭·네트워크 재시도에도 한 건만 |
| `suggestions`에 작성자 열 없음 | 담당자가 이 테이블을 읽어도 신원이 없음 |
| 로그는 actor 없이 | 기획서 10.3절: "건의 작성 행위 자체는 `actor_id` 없이 기록". 그래서 03-4편의 `log_activity` 대신 actor를 비우는 전용 함수를 씀 |

## 2. 누가 무엇을 보나 — 정책

```sql
-- 건의 본문: 작성자 본인, 배정된 처리자, 그 기수 회장단
create policy "suggestions: read"
on public.suggestions for select to authenticated
using (
  private.is_suggestion_author(id)
  or private.can_handle_suggestion(id)
  or private.is_executive(term_id)
);

-- 작성자 본인인가 (참/거짓만 돌려줌)
create function private.is_suggestion_author(p_suggestion_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.suggestion_authors
                 where suggestion_id = p_suggestion_id and author_user_id = (select auth.uid()));
$$;

-- 메시지: AUTHOR_VISIBLE은 작성자도, INTERNAL은 처리자·회장단만
create policy "suggestion messages: read"
on public.suggestion_messages for select to authenticated
using (
  private.can_handle_suggestion(suggestion_id)
  or private.is_executive((select term_id from public.suggestions where id = suggestion_id))
  or (message_type = 'AUTHOR_VISIBLE' and private.is_suggestion_author(suggestion_id))
);
```

> [!EXAM]
> `is_suggestion_author`는 `security definer`로 `suggestion_authors`를 읽지만 **"맞다/아니다"만** 돌려줍니다. 작성자 ID를 돌려주는 함수를 만들면, 담당자가 그 함수를 불러 신원을 알아낼 수 있습니다(기획서 7.2절).

## 3. 담당자 화면 — 신원 없이

```tsx
// app/(council)/council/suggestions/[id]/page.tsx  · 서버
const { data: s } = await supabase
  .from("suggestions")
  .select("id, title, content, status, created_at, messages:suggestion_messages(id, message_type, content, created_at)")
  .eq("id", id).maybeSingle();
// suggestion_authors는 select하지 않는다. 회장단 화면에서만 별도 컴포넌트가 따로 조회
```

- 메시지 작성 화면은 "작성자에게 공개 답변"과 "내부 메모" 두 칸을 **따로** 둡니다. 같은 입력창에 체크박스 하나로 바꾸면 실수로 내부 메모가 공개되기 쉽습니다.
- 메시지 작성자의 이름도 작성자 화면에는 "학생회"로만 보여 줍니다(이월 시 이전 처리자 이름 비표시, 기획서 7.3절).

## 4. 신원이 새는 다섯 경로

| 경로 | 점검 |
| --- | --- |
| API 응답 | 담당자 계정으로 상세를 열고 Network 탭의 JSON에 작성자 ID·이메일이 없는지 |
| 화면 Props | Client Component로 넘기는 값에 작성자 필드가 없는지 (02-3) |
| Activity Log | 건의 관련 행에 `actor_id`·본문이 없는지 |
| Realtime | 건의 변경을 채널로 보낸다면 payload에 작성자가 없는지 (MVP는 보내지 않음) |
| 오류 메시지·서버 로그 | 예외 문구나 `console.error`에 이메일이 섞이지 않는지 |

기획서 완료 기준 18: "건의 처리 담당자는 API·로그·검색·알림에서 작성자 신원을 볼 수 없다."

## 5. 기수 전환 때

전환 트랜잭션(06-6편)이 `RECEIVED`·`IN_REVIEW` 건의를 운영값에 따라 처리합니다.

```sql
-- 이월 정책일 때 (전환 함수 안)
update public.suggestions
set term_id = v_new_term, assigned_department_id = null, assigned_user_id = null, updated_at = now()
where term_id = v_old_term and status in ('RECEIVED', 'IN_REVIEW');
```

- 이월되면 새 회장단이 신원을 보게 되므로, 작성자 화면에 "새 기수 학생회로 이월되었습니다" 안내를 보여 줍니다.
- 마감 정책이면 이전 회장단이 전환 **전에** 공개 답변과 함께 `CLOSED` 처리해야 하고, 세팅 화면의 확인 단계가 남은 건수를 보여 줍니다.
- 작성자는 기수와 무관하게 자기 건의를 계속 봅니다(`is_suggestion_author`는 기수를 보지 않음).

> [!QUIZ]
> 담당 국장이 개발자 도구로 `supabase.from("suggestion_authors").select("*")`를 실행하면 어떻게 되나요?

> [!ANSWER]
> RLS 정책이 "작성자 본인 또는 그 기수 EXECUTIVE"만 허용하므로, 국장 자신이 쓴 건의가 아니라면 **빈 배열**이 돌아옵니다. 오류도 아니고 행 수도 알려 주지 않습니다.

> [!QUIZ]
> 건의 제출 버튼을 빠르게 두 번 눌렀습니다. 두 번째 요청은 DB에서 어떻게 처리되나요?

> [!ANSWER]
> 두 요청 모두 같은 `requestId`(폼을 열 때 한 번 만든 값)를 들고 갑니다. 두 번째 요청이 함수에 들어오면 같은 `client_request_id`와 작성자로 이미 저장된 건을 찾아 그 ID를 돌려주므로 새 건이 생기지 않습니다. 버튼의 `pending` 잠금은 화면 편의이고, 이 검사가 실제 방지입니다. (동시에 정확히 같은 순간 도착하는 경우까지 막으려면 `suggestions(client_request_id)`에 UNIQUE를 둡니다.)

## 학습 경로

[← 06-3 안건과 회의록](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-03) · [06-5 회장단 권한 이양 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-05)
