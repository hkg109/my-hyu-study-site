---
title: "03-2 · Supabase 클라이언트와 환경변수"
description: "브라우저용·서버용·관리자용 Supabase 클라이언트 세 가지가 각각 어떤 키와 어떤 자격으로 DB에 접근하는지, proxy.ts가 매 요청 로그인 세션을 갱신하는 원리, .env 파일과 Vercel·GitHub에 비밀 값을 나눠 두는 법을 공개 저장소 기준으로 익힙니다."
order: 2
published: true
duration: 45
tags: [Supabase, 환경변수, proxy.ts, 쿠키, publishable key, secret key, 공개 저장소]
objectives:
  - 세 가지 Supabase 클라이언트의 차이(실행 장소, 키, RLS 적용 여부)를 표로 말한다.
  - proxy.ts가 하는 일과 getClaims를 쓰는 이유를 설명한다.
  - 공개 값과 비밀 값을 구분하고, 각각 어디에 저장하는지 말한다.
  - 공개 저장소에서 비밀 값이 새는 경로와 새었을 때의 대응을 말한다.
---

## 1. Supabase 클라이언트 세 가지

Supabase는 DB·로그인·파일·실시간을 **HTTP와 WebSocket으로** 쓰게 해 주는 서비스입니다. 코드에서는 `@supabase/supabase-js`와 `@supabase/ssr` 패키지의 **클라이언트** 객체로 접근합니다. 같은 Supabase 프로젝트라도 어떤 클라이언트를 쓰느냐에 따라 "누구의 자격으로" 접근하는지가 달라집니다.

| 클라이언트 | 파일 | 실행 장소 | 쓰는 키 | 누구의 자격 | RLS |
| --- | --- | --- | --- | --- | --- |
| 브라우저용 | `lib/supabase/client.ts` | 브라우저 | 공개 키 (publishable) | 로그인한 사용자 (쿠키의 JWT) | ✅ 적용 |
| 서버용 | `lib/supabase/server.ts` | Vercel 서버 | 공개 키 (publishable) | 로그인한 사용자 (요청 쿠키의 JWT) | ✅ 적용 |
| 관리자용 | `lib/supabase/admin.ts` | Vercel 서버 (신뢰된 작업만) | 비밀 키 (secret / service role) | 관리자 | ❌ **건너뜀** |

> [!EXAM]
> ==화면과 Server Action은 항상 서버용 클라이언트를 쓴다.== 그래야 DB가 "이 요청은 국원 A의 것"이라고 알고 RLS를 적용합니다. 관리자 클라이언트로 업무를 저장하면 RLS가 꺼진 상태라 권한 검사가 전부 사라집니다.

### 브라우저용

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

회의록 에디터처럼 브라우저가 Supabase와 직접 통신해야 할 때(RPC 호출, Realtime 구독)만 씁니다.

### 서버용

```ts
// lib/supabase/server.ts
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();                 // Next.js 16: cookies()는 await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();                 // 요청에 붙어 온 로그인 쿠키를 읽음
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component에서는 쿠키를 쓸 수 없다. 세션 갱신은 proxy.ts가 맡는다.
          }
        },
      },
    },
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `import "server-only"` | 브라우저 코드에서 import하면 빌드 실패 |
| `await cookies()` | 이번 요청의 쿠키 저장소 |
| `getAll()` | Supabase가 로그인 토큰을 찾을 때 부름 |
| `setAll(...)` | 토큰이 갱신되면 새 쿠키를 응답에 씀 |
| `try { } catch { }` | Server Component는 쿠키를 쓸 수 없어서 오류가 나는데, 그 경우는 무시 |

## 2. proxy.ts — 모든 요청 앞에서 세션 갱신

로그인 토큰(JWT)은 짧게 만료됩니다(기획서 0.2절: JWT 유효 시간은 운영값). 만료가 가까우면 새 토큰으로 바꿔 줘야 하는데, Server Component는 쿠키를 쓸 수 없으므로 **페이지를 그리기 전에** `proxy.ts`가 이 일을 합니다.

```ts
// proxy.ts  (프로젝트 최상위)
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  await supabase.auth.getClaims();          // 토큰 검증 + 만료가 가까우면 갱신

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
```

| 부분 | 읽는 법 |
| --- | --- |
| `export async function proxy` | Next.js 16의 규칙 이름 (예전 이름은 middleware) |
| `NextResponse.next({ request })` | "그대로 다음으로 진행"하는 응답 |
| `getClaims()` | JWT 서명을 검증하고 필요하면 갱신. 갱신되면 `setAll`이 새 쿠키를 응답에 씀 |
| `matcher` | 정적 파일(이미지 등)에는 실행하지 않음 |

> [!CAUTION]
> - 서버 코드에서 **`getSession()`의 사용자 정보를 권한 판단에 쓰지 않습니다.** 쿠키 값을 검증 없이 읽을 뿐이라 위조될 수 있습니다. 누구인지 확인할 때는 `getClaims()`(서명 검증) 또는 `getUser()`(Auth 서버에 확인)를 씁니다.
> - 이 코드는 Supabase 공식 Next.js 가이드의 구조를 따릅니다. 패키지 버전이 바뀌면 공식 문서의 최신 코드를 다시 확인합니다.

## 3. 환경변수 — 공개 값과 비밀 값

코드에 직접 쓰지 않고 실행 환경에서 넣어 주는 값을 **환경변수**라고 합니다. 코드에서는 `process.env.이름`으로 읽습니다.

| 이름 | 공개? | 쓰는 곳 | 설명 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 공개 | 브라우저·서버 | Supabase 프로젝트 주소 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개 | 브라우저·서버 | 공개 키 (예전 이름: anon key). RLS가 권한을 결정 |
| `SUPABASE_SECRET_KEY` | **비밀** | 서버의 신뢰된 작업만 | 관리자 키 (예전 이름: service role key). RLS 건너뜀 |
| `GOOGLE_CLIENT_SECRET` | **비밀** | Supabase 대시보드에만 | Google OAuth 비밀. 앱 코드에는 필요 없음 |
| `CRON_SECRET` | **비밀** | 서버 | 정기 작업 주소를 아무나 부르지 못하게 하는 값 |

> [!NOTE]
> Next.js는 `NEXT_PUBLIC_`으로 시작하는 환경변수만 **브라우저 코드에 넣어 줍니다.** 이름에 이 접두어를 붙이는 순간 "누구나 볼 수 있는 값"이 됩니다. 비밀 값에는 절대 붙이지 않습니다.

### 어디에 저장하나

| 장소 | 무엇을 | 저장소에 올라가나 |
| --- | --- | --- |
| `.env.local` (내 컴퓨터) | 개발용 Supabase 프로젝트의 값 | ❌ `.gitignore`에 포함 |
| `.env.example` | 이름만 적고 값은 비운 목록 | ✅ 커밋 (다음 사람이 무엇이 필요한지 알게) |
| Vercel 프로젝트 설정 → Environment Variables | 운영 Supabase 값 | ❌ |
| GitHub 저장소 설정 → Secrets | 배포용 토큰 (07-2) | ❌ |

```bash
# .env.example  ← 이 파일만 커밋한다
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
CRON_SECRET=
```

```gitignore
# .gitignore
.env*
!.env.example
```

## 4. 공개 저장소에서 특히 조심할 것

이 프로젝트의 저장소는 **공개**입니다(00-4 결정 1). 누구나 코드와 커밋 기록 전체를 볼 수 있습니다.

| 하면 안 되는 것 | 이유 |
| --- | --- |
| 비밀 키를 코드·주석·테스트에 붙여 넣기 | 한 번 커밋되면 **나중에 지워도 기록에 남음** |
| 실제 학생 이메일·이름으로 Seed·테스트 데이터 만들기 | 개인정보 공개 |
| Issue·PR 본문에 운영 화면 캡처 첨부 | 회의록·건의 내용 노출 |
| DB 백업 파일을 저장소나 Actions 산출물에 올리기 | 전체 데이터 공개 |

> [!CAUTION]
> ==red:비밀 키를 커밋했다면 지우는 것으로는 부족합니다.== 즉시 Supabase 대시보드에서 그 키를 **폐기하고 새로 발급**한 뒤, Vercel 환경변수를 새 값으로 바꾸고 다시 배포합니다. GitHub는 공개 저장소에서 알려진 키 형식을 감지해 경고하기도 하지만, 경고를 기다리지 않습니다. 이 대응 절차는 07-3편 점검표에도 있습니다.

## 5. 개발용과 운영용 프로젝트 나누기

Supabase 무료 요금제로 프로젝트 2개를 만듭니다.

| 프로젝트 | 용도 | 데이터 |
| --- | --- | --- |
| `council-dev` | 개발·테스트 | 가짜 데이터만 |
| `council-prod` | 실제 운영 | 실제 학생회 데이터 |

내 컴퓨터의 `.env.local`은 항상 `council-dev`를 가리킵니다. 운영 프로젝트의 키는 Vercel과 GitHub Secrets에만 있고, 개발자 개인 컴퓨터에는 두지 않습니다.

> [!QUIZ]
> 국원용 업무 저장 Server Action에서 "권한 검사가 귀찮으니" 관리자 클라이언트로 INSERT하면 어떤 일이 생기나요?

> [!ANSWER]
> 관리자 키는 RLS를 건너뛰므로, 그 Server Action을 호출할 수 있는 사람은 누구나(직접 요청 포함) 어느 국·어느 기수에든 업무를 넣을 수 있게 됩니다. `creator_id`도 서버가 넣는 값을 그대로 믿게 됩니다. 항상 서버용(사용자 자격) 클라이언트를 쓰고, 권한은 RLS·DB 함수가 판단하게 해야 합니다.

> [!QUIZ]
> 새로 들어온 개발자가 저장소를 받아 실행하려면 무엇을 해야 하나요?

> [!ANSWER]
> `.env.example`을 `.env.local`로 복사하고, 학생회 개발 담당에게 **개발용** Supabase 프로젝트의 URL과 공개 키를 받아 채웁니다. 운영 키는 받지 않습니다. 그다음 `npm install`, `npm run dev`로 실행합니다(07-4편).

## 학습 경로

[← 03-1 Server Action과 Route Handler](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-01) · [03-3 로그인 구현 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-03)
