---
title: "03-3 · 로그인 구현"
description: "Google OAuth가 동작하는 순서, 로그인 버튼과 /auth/callback Route Handler, 학교 계정만 통과시키는 Before User Created Auth Hook, profiles 자동 생성 트리거, 승인 명단을 Membership으로 바꾸는 activate_membership 함수까지 로그인 전체를 코드로 따라갑니다."
order: 3
published: true
duration: 55
tags: [로그인, OAuth, Google, Auth Hook, Membership, Supabase Auth]
objectives:
  - OAuth 로그인이 브라우저·Google·Supabase·우리 서버 사이를 오가는 순서를 말한다.
  - Auth Hook 함수가 어떤 값을 받아 무엇을 돌려주는지 읽는다.
  - 로그인 결과가 거부·일반 학생·구성원 세 갈래로 나뉘는 조건을 말한다.
  - activate_membership 함수가 원자적이어야 하는 이유를 설명한다.
---

## 1. OAuth 로그인의 순서

**OAuth**는 우리 서비스가 Google 비밀번호를 직접 받지 않고, Google이 "이 사람이 맞다"고 확인해 준 결과만 받는 방식입니다.

```text
① 브라우저: "Google로 로그인" 클릭
② Supabase Auth → Google 로그인 화면으로 이동 (계정 선택)
③ Google → Supabase: "이 사람은 a@hanyang.ac.kr, 이메일 검증됨"
④ Supabase: 처음 보는 사람이면 Auth Hook 실행 → 통과해야 auth.users 생성
⑤ Supabase → 우리 사이트 /auth/callback?code=...
⑥ 우리 서버: code를 세션(JWT 쿠키)으로 교환 → 승인 명단 확인 → Membership 활성화
⑦ 브라우저: Dashboard 또는 건의 화면으로 이동
```

[![학교 Google 계정을 고르면 Auth Hook이 확인해 아니면 거부하고, 통과하면 Profile을 만들고 같은 Term 승인 행이 있으면 Membership을 만들고 없으면 일반 학생으로 남는 세 갈래 흐름](/materials/diagrams/cpg-03b-login-flow.svg)](/materials/diagrams/cpg-03b-login-flow.svg)

*그림 03-2 · 로그인 결과는 세 갈래 — 누르면 원본 크기로 열린다.*

## 2. 한 번만 하는 설정 (대시보드)

| 어디서 | 무엇을 |
| --- | --- |
| Google Cloud Console | OAuth 클라이언트 생성. 승인된 리디렉션 URI에 Supabase의 콜백 주소(`https://<프로젝트>.supabase.co/auth/v1/callback`) 등록 |
| Supabase → Authentication → Providers | Google 켜고 클라이언트 ID·비밀 입력. **Email·Magic Link 등 다른 방식은 끔** (기획서 2.1절) |
| Supabase → Authentication → URL Configuration | 사이트 주소와 `/auth/callback` 허용 |
| Supabase → Authentication → Hooks | Before User Created에 아래 함수 연결 |

> [!NOTE]
> 이 설정들은 **공용 학생회 계정**으로 로그인한 대시보드에서 합니다(07-1편). 어떤 설정을 했는지 저장소의 `docs/setup.md`에 적어 두어 다음 기수가 다시 할 수 있게 합니다. 비밀 값 자체는 적지 않습니다.

## 3. 로그인 버튼

```tsx
// app/login/login-button.tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: "hanyang.ac.kr", prompt: "select_account" },
      },
    });
  }
  return <button onClick={signIn} className="rounded bg-ink px-4 py-2 text-paper">학교 Google 계정으로 로그인</button>;
}
```

| 부분 | 뜻 |
| --- | --- |
| `signInWithOAuth({ provider: "google" })` | Google 로그인 화면으로 이동 |
| `redirectTo` | 로그인이 끝나면 돌아올 우리 주소 |
| `hd: "hanyang.ac.kr"` | Google에 "학교 계정을 먼저 보여 달라"는 **힌트**. 보안 검사가 아님 |
| `prompt: "select_account"` | 여러 계정이 있으면 고르게 함 |

## 4. 콜백 — code를 세션으로 바꾸기

```ts
// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);   // 세션 쿠키 저장
  if (error) return NextResponse.redirect(`${origin}/login?error=auth`);

  // 승인 명단 확인 → Membership 활성화 (아래 6절)
  const { data: activated } = await supabase.rpc("activate_membership");

  return NextResponse.redirect(`${origin}${activated ? "/dashboard" : "/suggestions"}`);
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `searchParams.get("code")` | Supabase가 붙여 준 일회용 코드 |
| `exchangeCodeForSession(code)` | 코드를 진짜 세션(JWT)으로 바꾸고 쿠키에 저장 |
| `rpc("activate_membership")` | DB 함수가 이 사람의 승인 행을 찾아 Membership을 만듦 |
| 결과에 따라 이동 | 구성원이면 Dashboard, 아니면 건의 화면 |

> [!CAUTION]
> `?error=...`처럼 쿼리에는 오류 **종류**만 넣고 이메일이나 원인 상세는 넣지 않습니다. 쿼리는 주소창과 로그에 남습니다(01-1편).

## 5. Auth Hook — 학교 계정만 통과

기획서 핵심: ==학교 외 계정은 auth.users 행이 만들어지기 전에 거부한다.== Supabase의 **Before User Created Hook**은 새 사용자를 만들기 직전에 우리 DB 함수를 부르고, 함수가 오류를 돌려주면 생성을 취소합니다.

```sql
-- supabase/migrations/20261101000000_auth_hook.sql
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_email    text := lower(event -> 'user' ->> 'email');
  v_verified text := event -> 'user' -> 'user_metadata' ->> 'email_verified';
begin
  if v_email is null or split_part(v_email, '@', 2) <> 'hanyang.ac.kr' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', '학교 Google 계정(@hanyang.ac.kr)으로만 가입할 수 있습니다.'));
  end if;

  if coalesce(v_verified, 'false') <> 'true' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', '이메일이 검증된 계정만 가입할 수 있습니다.'));
  end if;

  return '{}'::jsonb;          -- 빈 객체 = 통과
end;
$$;

grant execute on function public.hook_before_user_created to supabase_auth_admin;
revoke execute on function public.hook_before_user_created from authenticated, anon, public;
```

| 부분 | 읽는 법 |
| --- | --- |
| `(event jsonb) returns jsonb` | Supabase가 JSON을 넘기고, 함수가 JSON을 돌려줌 |
| `event -> 'user' ->> 'email'` | `->`는 JSON 안으로 들어가기, `->>`는 글자로 꺼내기 |
| `split_part(v_email, '@', 2)` | `@` 뒤 부분 (도메인) |
| `{ "error": { "http_code": 403, "message": ... } }` | 이 모양을 돌려주면 가입 거부 |
| `'{}'::jsonb` | 빈 객체를 돌려주면 통과 |
| `grant ... to supabase_auth_admin` | Auth 서비스만 이 함수를 부를 수 있게 |
| `revoke ... from authenticated, anon, public` | 일반 사용자가 API로 부르지 못하게 |

> [!CAUTION]
> Hook이 받는 `event`에 Google의 `email_verified`와 `hd` 값이 **정확히 어느 경로로** 들어오는지는 Supabase 버전과 설정에 따라 다를 수 있습니다. Phase 0에서 개발 프로젝트로 학교 계정·개인 Gmail 각각 로그인해 보고, 임시로 `event`를 기록해 실제 모양을 확인한 뒤 위 경로를 맞춥니다. 확인이 끝나면 그 기록 코드는 지웁니다(이메일이 남으므로). 학교가 Google Workspace로 계정을 운영하면 `hd` 검사도 추가합니다.

## 6. 로그인 뒤: Profile과 Membership

### profiles 자동 생성

`auth.users`에 행이 생기면 트리거가 `profiles`를 만듭니다.

```sql
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
```

| 부분 | 읽는 법 |
| --- | --- |
| `returns trigger` | 행이 바뀔 때 자동으로 실행되는 함수 |
| `security definer` | 함수를 만든 사람(관리자) 권한으로 실행. 사용자가 직접 profiles에 쓸 수 없어도 생성 가능 |
| `set search_path = ''` | 테이블 이름을 반드시 `public.profiles`처럼 스키마까지 적게 함 → 이름 바꿔치기 공격 방지 |
| `new` | 방금 추가된 `auth.users` 행 |

### 승인 명단 → Membership

```sql
create function public.activate_membership()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
  v_row   public.approved_council_accounts%rowtype;
  v_found boolean := false;
begin
  select email into v_email from public.profiles where id = v_uid;
  if v_email is null or split_part(v_email, '@', 2) <> 'hanyang.ac.kr' then
    return false;                                   -- Hook 우회 대비: 같은 검사를 한 번 더
  end if;

  for v_row in
    select a.* from public.approved_council_accounts a
    join public.terms t on t.id = a.term_id
    where lower(a.email) = v_email
      and a.is_active
      and a.activated_user_id is null
      and t.status in ('ACTIVE', 'DRAFT')            -- DRAFT: 다음 기수로 지정된 사람
    for update of a                                  -- 동시 로그인 두 번에도 한 번만
  loop
    insert into public.memberships (term_id, user_id, role, department_id, position_id, approved_account_id, is_active, joined_at)
    values (v_row.term_id, v_uid, v_row.role, v_row.department_id, v_row.position_id, v_row.id, true, now());

    update public.approved_council_accounts set activated_user_id = v_uid where id = v_row.id;
    v_found := true;
  end loop;

  return v_found or exists (
    select 1 from public.memberships m join public.terms t on t.id = m.term_id
    where m.user_id = v_uid and m.is_active and t.status in ('ACTIVE', 'DRAFT'));
end;
$$;

revoke execute on function public.activate_membership from anon, public;
grant execute on function public.activate_membership to authenticated;
```

| 부분 | 읽는 법 |
| --- | --- |
| `auth.uid()` | 지금 요청한 로그인 사용자의 ID (JWT에서) |
| `%rowtype` | 그 테이블 한 행과 같은 모양의 변수 |
| `for v_row in select ... loop` | 찾은 승인 행마다 반복 (ACTIVE 기수와 DRAFT 기수에 하나씩 있을 수 있음) |
| `for update of a` | 이 행들을 잠가서, 같은 사람이 동시에 두 번 로그인해도 Membership이 두 번 생기지 않음 |
| `activated_user_id is null` | 이미 다른 계정에 연결된 승인 행은 다시 연결하지 않음 (기획서 2.2절) |
| 함수 전체 | 하나의 트랜잭션. Membership 생성과 승인 행 연결이 **함께** 성공하거나 함께 취소됨 |

> [!EXAM]
> **세 갈래 결과 정리**
> | 계정 | `auth.users` | `profiles` | `memberships` | 이동 |
> | --- | :---: | :---: | :---: | --- |
> | 학교 외 계정 | 안 생김 (Hook 거부) | 안 생김 | 없음 | 로그인 화면 + 안내 |
> | 학교 계정, 승인 없음 | 생김 | 생김 | 없음 → STUDENT | 건의 화면 |
> | 학교 계정, 승인 있음 | 생김 | 생김 | 생김 | Dashboard |

## 7. 직접 해보기 (개발 프로젝트에서)

1. 개인 Gmail로 로그인해 보고, Supabase 대시보드의 `auth.users`에 행이 **없는지** 확인합니다.
2. 학교 계정으로 로그인해 `profiles`만 생기고 `memberships`는 없는지 확인합니다.
3. SQL 편집기에서 그 이메일로 `approved_council_accounts` 행을 넣고 다시 로그인해 Membership이 생기는지 확인합니다.

> [!QUIZ]
> 로그인 화면에서 `hd: "hanyang.ac.kr"`를 넘기니까 Auth Hook은 필요 없다는 주장이 틀린 이유는?

> [!ANSWER]
> `hd` 파라미터는 Google 계정 선택 화면에 보내는 힌트일 뿐이고, 사용자가 요청을 조작하거나 다른 계정을 고르는 것을 막지 못합니다. 실제 차단은 Supabase 서버 안에서 실행되는 Auth Hook이 하고, `activate_membership`이 같은 검사를 한 번 더 합니다.

> [!QUIZ]
> `activate_membership`이 Membership INSERT와 승인 행 UPDATE를 한 함수 안에서 하지 않고, Server Action에서 두 번의 요청으로 나눠 하면 어떤 문제가 생길 수 있나요?

> [!ANSWER]
> 첫 요청(INSERT)만 성공하고 두 번째(UPDATE)가 실패하면, Membership은 생겼는데 승인 행은 "아직 연결 안 됨"으로 남습니다. 그러면 다음 로그인 때 같은 승인 행으로 Membership이 또 만들어지거나, 그 승인 행이 다른 계정에 연결될 위험이 생깁니다. 한 함수(한 트랜잭션)로 묶어야 둘 다 성공하거나 둘 다 취소됩니다.

## 학습 경로

[← 03-2 Supabase 클라이언트와 환경변수](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-02) · [03-4 파일 업로드와 Activity Log →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-04)
