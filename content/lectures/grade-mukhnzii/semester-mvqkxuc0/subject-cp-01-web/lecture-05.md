---
title: "01-5 · 프론트엔드·백엔드·DB 역할 분담"
description: "이 프로젝트의 도구(Next.js·React·Tailwind·Vercel·Supabase Auth·PostgreSQL·RLS·Storage·Realtime·BlockNote·Yjs)가 각각 어느 층에서 무슨 일을 하는지 지도로 정리하고, '업무 저장' 버튼 하나가 브라우저→서버→DB→화면으로 지나가는 길을 실제 코드 조각으로 따라갑니다."
order: 5
published: true
duration: 40
tags: [프론트엔드, 백엔드, 데이터베이스, Next.js, Supabase, Vercel, 아키텍처]
objectives:
  - 프론트엔드·백엔드·DB가 각각 맡는 일을 한 문장으로 말한다.
  - 이 프로젝트의 도구 열한 가지가 어느 층에 속하는지 분류한다.
  - 업무 저장 요청이 지나가는 다섯 단계와 각 단계의 실패 안내를 설명한다.
  - 브라우저가 Next.js를 거치지 않고 Supabase와 직접 통신하는 두 경우를 말한다.
---

## 1. 세 층 한눈에 보기

[![브라우저(프론트엔드), Vercel의 Next.js 서버(백엔드), Supabase(데이터베이스와 Auth·Storage·Realtime)의 세 층과 각 층의 도구](/materials/diagrams/cpg-11-stack-all.svg)](/materials/diagrams/cpg-11-stack-all.svg)

*그림 01-2 · 세 층과 각 층의 도구 — 누르면 원본 크기로 열린다.*

| 층 | 어디서 실행되나 | 한 문장 역할 | 이 프로젝트의 도구 |
| --- | --- | --- | --- |
| **프론트엔드** | 사용자의 브라우저 | 화면을 그리고, 입력을 받고, 서버에 요청한다 | React, Next.js Client Component, Tailwind CSS, BlockNote, Yjs |
| **백엔드** | Vercel의 서버 | 요청을 검증하고, DB에 일을 시키고, 화면을 준비한다 | Next.js Server Component, Server Action, Route Handler, `proxy.ts` |
| **DB·플랫폼** | Supabase | 데이터를 저장하고, 누가 무엇을 할 수 있는지 마지막으로 막는다 | PostgreSQL, RLS, DB 함수, Auth, Storage, Realtime |

> [!EXAM]
> 세 층의 **신뢰 수준**이 다릅니다.
> - 프론트엔드: 사용자가 마음대로 바꿀 수 있다 → **믿지 않는다**
> - 백엔드: 우리가 통제한다 → 입력을 다시 검증한다
> - DB의 RLS: 어떤 경로로 들어와도 마지막에 막는다 → **최종 보안선**

## 2. 도구 사전 — 무엇이고 어떻게 작동하나

| 도구 | 층 | 무엇인가 | 어떻게 작동하나 | 배우는 곳 |
| --- | --- | --- | --- | --- |
| **React** | 프론트 | 화면을 Component 조각으로 나눠 만드는 라이브러리 | State가 바뀌면 그 Component를 다시 그린다 | 02-1 |
| **Next.js** | 프론트+백 | React 위에 주소·서버 실행·빌드를 얹은 프레임워크 | `app/` 폴더 구조가 주소가 되고, 각 Component를 서버나 브라우저 중 어디서 실행할지 나눈다 | 02-2, 02-3 |
| **TypeScript** | 전체 | 타입을 붙인 JavaScript | 개발 중 타입을 검사하고, 실행 땐 JavaScript로 바뀐다 | 01-4 |
| **Tailwind CSS** | 프론트 | 짧은 클래스로 스타일을 붙이는 CSS 도구 | 빌드할 때 실제로 쓴 클래스만 모아 CSS 파일을 만든다 | 02-5 |
| **Vercel** | 백 | Next.js를 실행해 주는 호스팅 서비스 | GitHub의 코드를 빌드해 전 세계 서버에 올리고, 요청이 오면 서버 함수를 실행한다 | 07-2 |
| **Supabase Auth** | DB·플랫폼 | 로그인 서비스 | Google OAuth로 사용자를 확인하고 JWT를 발급한다. Auth Hook으로 가입을 거를 수 있다 | 03-3 |
| **PostgreSQL** | DB | 관계형 데이터베이스 | 테이블에 행을 저장하고 SQL로 읽고 쓴다 | 04-1, 04-2 |
| **RLS** | DB | 행 단위 보안 정책 | 모든 SELECT·INSERT·UPDATE·DELETE마다 "이 사용자가 이 행에 접근해도 되나"를 SQL 조건으로 검사한다 | 04-4 |
| **Supabase Storage** | DB·플랫폼 | 파일 저장소 | 파일을 Bucket에 저장하고, 접근은 RLS 정책으로 막는다 | 03-4 |
| **Supabase Realtime** | DB·플랫폼 | 실시간 메시지 전달 | WebSocket 연결로 같은 채널의 브라우저들에 메시지를 즉시 보낸다 | 05-3 |
| **BlockNote** | 프론트 | Notion 같은 블록 편집기 | 문서를 블록 목록으로 다루고, Yjs와 연결하면 공동 편집이 된다 | 05-1 |
| **Yjs** | 프론트 | CRDT 라이브러리 | 각자의 변경을 작은 Update로 만들고, 순서가 달라도 같은 결과로 합친다 | 05-2 |

## 3. "업무 저장" 버튼 하나를 따라가기

[![국장이 업무를 입력하면 브라우저가 형식을 확인하고, 서버와 DB가 로그인·Term·권한을 확인한 뒤 저장하고, 화면이 결과를 다시 읽어 보여 주는 흐름](/materials/diagrams/cpg-01b-request-flow.svg)](/materials/diagrams/cpg-01b-request-flow.svg)

*그림 01-3 · 업무 하나가 저장되는 길 — 누르면 원본 크기로 열린다.*

### ① 브라우저 · 프론트엔드 — 입력 받기

```tsx
// app/tasks/new/task-form.tsx  · 브라우저에서 실행
"use client";
import { useActionState } from "react";
import { createTask } from "./actions";

export function TaskForm() {
  const [state, formAction, pending] = useActionState(createTask, { error: null });
  return (
    <form action={formAction}>
      <label htmlFor="title">제목</label>
      <input id="title" name="title" required maxLength={100} />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={pending}>{pending ? "저장 중…" : "저장"}</button>
    </form>
  );
}
```

- 하는 일: 입력창을 보여 주고, 빈 제목을 미리 막고(`required`), 저장 중에는 버튼을 잠가 **중복 제출을 막습니다.**
- 이 검사는 편의일 뿐입니다. 사용자는 이 코드를 우회할 수 있습니다.

### ② Vercel 서버 · 백엔드 — 다시 검증하고 DB에 시키기

```ts
// app/tasks/new/actions.ts  · 서버에서만 실행
"use server";
import { createClient } from "@/lib/supabase/server";

export async function createTask(_prev: { error: string | null }, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length === 0 || title.length > 100) {
    return { error: "제목은 1–100자로 입력하세요." };
  }

  const supabase = await createClient();          // 로그인 쿠키를 들고 있는 DB 클라이언트
  const { error } = await supabase.rpc("create_task", { p_title: title });
  if (error) return { error: "저장할 권한이 없거나 잘못된 요청입니다." };
  return { error: null };
}
```

- 하는 일: 사용자가 보낸 값을 **다시** 검증하고, 로그인한 사용자 자격으로 DB 함수를 부릅니다.
- 비밀 키는 이 층에만 둡니다(그러나 여기서도 관리자 키가 아닌 **사용자 자격**으로 DB를 부릅니다. 그래야 DB가 요청자를 알고 RLS와 권한 검사를 적용합니다).

### ③ Supabase · DB — 권한 확인과 저장

```sql
-- supabase/migrations/..._create_task.sql  · DB 안에서 실행
create function public.create_task(p_title text)
returns uuid
language plpgsql
security definer            -- 사용자는 tasks에 직접 못 씀. 이 함수만 씀
set search_path = ''
as $$
declare
  v_term uuid := private.active_term_id();
  v_dept uuid := private.my_department_id(v_term);
  v_id   uuid;
begin
  if not private.can_create_task(v_term, v_dept) then        -- 요청자가 이 국에 업무를 만들 수 있나
    raise exception 'USER:업무를 만들 권한이 없습니다.' using errcode = 'P0001';
  end if;

  insert into public.tasks (term_id, department_id, title, creator_id)
  values (v_term, v_dept, p_title, auth.uid())
  returning id into v_id;

  perform private.log_activity(v_term, 'task', v_id, 'create', null, jsonb_build_object('title', p_title));
  return v_id;
end;
$$;
```

- 하는 일: `auth.uid()`로 요청자를 알고, 권한 함수로 "이 사람이 이 국에 업무를 만들 수 있나"를 검사한 뒤 저장하고 기록을 남깁니다. 세 가지가 한 트랜잭션입니다.
- 권한이 없으면 여기서 거부되고, 그 사실이 ②로 돌아갑니다. 이 규칙(쓰기는 검사 함수로만)은 04-4편에서 자세히 봅니다.

### ④ 다시 서버 → ⑤ 브라우저 — 결과 보여 주기

저장에 성공하면 서버가 목록 화면을 다시 만들어 보내고(02-4편의 `revalidatePath`), 실패하면 ①의 `state.error`에 안내 문구가 들어가 화면에 나타납니다.

| 실패한 곳 | 사용자에게 보이는 것 |
| --- | --- |
| ① 브라우저 형식 검사 | 입력창 아래 "필수 항목입니다" |
| ② 서버 검증 | "제목은 1–100자로 입력하세요." |
| ③ DB 권한 거부 | "저장할 권한이 없거나 잘못된 요청입니다." |
| 네트워크 끊김 | "연결이 끊겼습니다. 다시 시도하세요." (입력값 유지) |

> [!NOTE]
> ==화면에 보임 ≠ DB에 저장됨.== 오류를 찾을 때도 ①→⑤ 순서대로 어디서 멈췄는지 확인합니다. 개발자 도구 Network 탭(01-1편)에서 ②의 응답을, Supabase 대시보드 로그에서 ③의 거부를 볼 수 있습니다.

## 4. Next.js를 거치지 않는 두 길

대부분의 요청은 ①→②→③을 지나지만, 두 경우는 브라우저가 Supabase와 **직접** 통신합니다(그림의 점선).

| 경우 | 왜 직접 가나 | 그래도 안전한 이유 |
| --- | --- | --- |
| **로그인** | Google OAuth 화면으로 이동했다가 Supabase가 결과를 받음 | Auth Hook이 학교 계정만 통과시킴 (03-3) |
| **회의록 공동 편집** | 키 입력마다 Vercel을 거치면 느리고 비쌈 | 브라우저는 사용자 JWT로 DB 함수를 부르고, 함수와 RLS가 매번 권한을 검사 (05-3) |

이때 브라우저가 쓰는 키는 **공개용 키**(publishable / anon key)입니다. 이 키는 "어느 Supabase 프로젝트인지"만 알려 주는 공개 값이고, 실제 권한은 로그인 JWT와 RLS가 결정합니다. 관리자 키(service role / secret key)는 절대 브라우저에 두지 않습니다.

## 5. 폴더로 보는 세 층

```text
council-platform/
├─ app/                      ← Next.js 화면과 서버 코드 (프론트+백)
│  ├─ tasks/
│  │  ├─ page.tsx            ← 서버에서 목록 준비 (Server Component)
│  │  ├─ task-list.tsx       ← 브라우저 상호작용 ("use client")
│  │  └─ actions.ts          ← 서버 함수 ("use server")
│  └─ layout.tsx
├─ components/               ← 여러 화면이 같이 쓰는 UI 조각
├─ lib/
│  └─ supabase/
│     ├─ client.ts           ← 브라우저용 Supabase 클라이언트
│     └─ server.ts           ← 서버용 Supabase 클라이언트
├─ proxy.ts                  ← 모든 요청 전에 로그인 세션 갱신
├─ supabase/
│  ├─ migrations/            ← DB 구조·RLS·함수 (DB)
│  └─ tests/                 ← 허용·거부 DB 테스트
└─ .github/workflows/        ← 자동 검사·배포 (07-2)
```

> [!QUIZ]
> 다음 코드는 각각 어느 층에서 실행되나요? ① `"use client"`가 붙은 `TaskForm` ② `"use server"`가 붙은 `createTask` ③ `create policy ... on tasks` ④ `proxy.ts`

> [!ANSWER]
> ① 브라우저(프론트엔드) ② Vercel 서버(백엔드) ③ Supabase PostgreSQL(DB) ④ Vercel 서버 — 페이지를 그리기 전에 모든 요청에서 먼저 실행됩니다.

> [!QUIZ]
> "버튼을 숨겼으니 국원은 다른 국 업무를 못 고친다"는 말이 틀린 이유를 세 층으로 설명하세요.

> [!ANSWER]
> 버튼 숨김은 프론트엔드에서만 일어나므로, 사용자는 개발자 도구나 직접 요청으로 ②를 부를 수 있습니다. ②의 서버 검증과 ③의 RLS가 같은 조건을 다시 검사해야 실제로 막힙니다. 특히 회의록처럼 브라우저가 DB를 직접 부르는 길에서는 ③만이 유일한 방어선입니다.

## 학습 경로

[← 01-4 TypeScript 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-04) · [02-1 React 기초 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-01)
