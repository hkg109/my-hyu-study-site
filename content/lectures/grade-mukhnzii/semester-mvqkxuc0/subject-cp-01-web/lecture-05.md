---
title: "01-5 · 프론트엔드·백엔드·DB 역할 분담"
description: "언어·라이브러리·프레임워크·패키지·API·SDK·서비스 같은 도구 분류 용어를 구분하고, 이 프로젝트의 도구(Next.js·React·Tailwind·Vercel·Supabase Auth·PostgreSQL·RLS·Storage·Realtime·BlockNote·Yjs)가 각각 어느 층에서 무슨 일을 하는지 지도로 정리하고, '업무 저장' 버튼 하나가 브라우저→서버→DB→화면으로 지나가는 길을 실제 코드 조각으로 따라갑니다."
order: 5
published: true
duration: 60
tags: [프론트엔드, 백엔드, 데이터베이스, Next.js, Supabase, Vercel, 아키텍처]
objectives:
  - 프론트엔드·백엔드·DB가 각각 맡는 일을 한 문장으로 말한다.
  - 언어·런타임·라이브러리·프레임워크·패키지·API·SDK·서비스를 구분하고, 이 프로젝트의 도구를 그 기준으로 분류한다.
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

## 2. 도구를 부르는 말 구분하기 — 언어·라이브러리·프레임워크·서비스

강의 자료와 공식 문서에는 "React는 **라이브러리**", "Next.js는 **프레임워크**", "Supabase는 **플랫폼**", "npm으로 **패키지**를 설치"처럼 도구를 부르는 말이 계속 나옵니다. 이 말들은 **그 도구가 어떤 종류이고, 내 코드와 어떻게 연결되는지**를 알려 줍니다. 3절의 도구 사전을 읽기 전에 이 말부터 구분해 둡니다.

### 2-1. 한 문장 정의

| 용어 | 한 문장 정의 | 비유 | 이 프로젝트의 예 |
| --- | --- | --- | --- |
| **프로그래밍 언어** | 코드를 쓰는 문법 자체 | 한국어·영어 같은 말 | JavaScript, TypeScript, SQL, HTML·CSS(엄밀히는 표시 언어) |
| **런타임** | 코드를 실제로 실행해 주는 환경 | 말을 알아듣고 움직이는 사람 | 브라우저, Node.js |
| **라이브러리** | 내가 필요할 때 **불러 쓰는** 코드 묶음 | 공구함 | React, Yjs, supabase-js, zod |
| **프레임워크** | 정해진 구조에 내 코드를 넣으면 **프레임워크가 내 코드를 불러 주는** 뼈대 | 골조가 다 세워진 건물 | Next.js |
| **패키지** | 설치할 수 있게 포장된 코드 한 묶음 (라이브러리·프레임워크·도구 모두 패키지로 배포됨) | 택배 상자 | `react`, `next`, `@supabase/supabase-js` |
| **패키지 관리자** | 패키지를 내려받고 버전을 관리하는 프로그램 | 택배 회사 | npm (`npm install`) |
| **모듈** | `import`·`export`로 주고받는 **파일 하나** 단위 | 책의 한 장(章) | `lib/task-labels.ts` |
| **API** | 다른 프로그램이 쓰라고 열어 둔 **사용 방법(창구)** | 식당의 메뉴판과 주문 창구 | Supabase REST API, 브라우저의 `fetch` |
| **SDK** | 어떤 서비스의 API를 쉽게 쓰도록 만든 라이브러리 묶음 | 메뉴판을 대신 읽어 주는 직원 | supabase-js (Supabase의 JavaScript SDK) |
| **서비스·플랫폼** | 설치하지 않고 **계정을 만들어 인터넷으로 쓰는** 남의 서버 | 임대 건물 | Vercel(호스팅), Supabase(DB·로그인·파일 등 백엔드 서비스) |
| **개발 도구** | 코드를 쓰고 검사하고 빌드하는 걸 돕는 프로그램. 완성된 서비스에는 들어가지 않음 | 작업장의 기계 | VS Code(편집기), ESLint(코드 검사), TypeScript 컴파일러, Supabase CLI |

> [!DEFINITION]
> **라이브러리와 프레임워크의 차이는 "누가 누구를 부르는가"** 입니다.
> - 라이브러리: **내 코드가** 라이브러리를 부른다. 언제, 어디서, 어떻게 쓸지 내가 정한다.
> - 프레임워크: **프레임워크가** 내 코드를 부른다. 나는 정해진 자리에 정해진 이름으로 코드를 넣는다.
>
> 이렇게 실행 흐름의 주도권이 프레임워크로 넘어가는 것을 **제어의 역전**(Inversion of Control)이라고 부릅니다.

### 2-2. 코드로 보는 라이브러리와 프레임워크

```ts
// 라이브러리: 내가 필요할 때 함수를 불러 쓴다
import { useState } from "react";
import { z } from "zod";

const TitleSchema = z.string().min(1);       // 내가 zod를 부름
const result = TitleSchema.safeParse("");    // 언제 검사할지도 내가 정함
```

```tsx
// 프레임워크: 정해진 위치·이름에 코드를 두면 Next.js가 불러 준다
// 파일 위치: app/tasks/page.tsx  ← 이 경로 자체가 "/tasks 주소의 화면"이라는 약속
export default async function TasksPage() {
  return <h1>업무 목록</h1>;
}
// 이 함수를 부르는 코드는 내 프로젝트 어디에도 없다.
// 사용자가 /tasks에 들어오면 Next.js가 이 파일을 찾아 TasksPage()를 호출한다.
```

| | 라이브러리 | 프레임워크 |
| --- | --- | --- |
| 누가 부르나 | 내 코드 → 라이브러리 | 프레임워크 → 내 코드 |
| 내가 지킬 규칙 | 함수 사용법 정도 | 폴더 구조, 파일 이름, export 방식까지 |
| 갈아 끼우기 | 쉬움 (다른 공구로 바꾸기) | 어려움 (건물 골조를 바꾸는 일) |
| 이 프로젝트 | React, zod, Yjs, supabase-js | Next.js |
| 규칙을 어기면 | 그 함수가 오류 | 화면이 아예 안 나옴 (예: `page.tsx`를 `pages.tsx`로 쓰면 그 주소가 404) |

> [!NOTE]
> Next.js는 React **위에** 얹은 프레임워크입니다. 화면 조각은 React 문법으로 만들고, 그 조각을 어느 주소에서, 서버와 브라우저 중 어디서 실행할지는 Next.js가 정합니다. 02-0편에서 두 도구를 더 자세히 비교합니다.

### 2-3. 패키지·모듈·라이브러리는 무엇이 다른가

셋 다 "남이 만든 코드"처럼 들려서 섞어 쓰기 쉽습니다. **관점이 다릅니다.**

| 말 | 관점 | 질문 |
| --- | --- | --- |
| 라이브러리·프레임워크 | **역할** | 이 코드가 무슨 일을 하고, 누가 누구를 부르나? |
| 패키지 | **배포 형태** | 어떻게 설치하고 버전을 관리하나? |
| 모듈 | **파일 단위** | 어느 파일에서 무엇을 가져오나? |

예를 들어 React는 역할로는 **라이브러리**, 배포 형태로는 npm의 **`react` 패키지**, 코드에서는 `import { useState } from "react"`로 가져오는 **모듈**입니다. 같은 것을 다른 각도에서 부르는 말입니다.

프로젝트에 설치된 패키지 목록은 `package.json`에 있습니다.

```json
{
  "dependencies": {
    "next": "16.3.4",
    "react": "19.2.8",
    "@supabase/supabase-js": "2.x",
    "yjs": "13.x"
  },
  "devDependencies": {
    "typescript": "5.x",
    "eslint": "9.x",
    "tailwindcss": "4.x"
  }
}
```

| 칸 | 뜻 |
| --- | --- |
| `dependencies` | 서비스가 **실행될 때** 필요한 패키지 (라이브러리·프레임워크) |
| `devDependencies` | **개발할 때만** 필요한 패키지 (개발 도구) |
| `"16.3.4"` | 버전 번호. `주.부.수` — 앞자리가 바뀌면 사용법이 크게 달라질 수 있음 |
| `node_modules/` 폴더 | `npm install`로 실제 코드가 내려받아지는 곳 (Git에는 올리지 않음) |

> [!TRAP]
> Tailwind CSS는 이름에 "CSS"가 붙어 있지만 실행 중에 쓰는 라이브러리가 아니라 **빌드할 때 CSS 파일을 만들어 주는 도구**에 가깝습니다. TypeScript도 언어이면서 동시에 `.ts`를 `.js`로 바꿔 주는 **개발 도구(컴파일러)** 패키지로 설치됩니다. 이처럼 한 도구가 두 분류에 걸칠 수 있으므로, "무엇인가"보다 "**언제, 어디서, 누가 쓰는가**"로 구분하면 헷갈리지 않습니다.

### 2-4. API와 SDK

```ts
// API를 직접 부르기: 주소와 요청 형식을 내가 다 맞춘다
const res = await fetch("https://<프로젝트>.supabase.co/rest/v1/tasks?select=id,title", {
  headers: { apikey: "<공개 키>", Authorization: "Bearer <로그인 토큰>" },
});
const tasks = await res.json();

// SDK로 부르기: 같은 요청을 supabase-js가 대신 만들어 준다
const { data } = await supabase.from("tasks").select("id, title");
```

두 코드는 같은 요청을 보냅니다. **API**는 "이 주소로 이런 형식으로 요청하면 이렇게 응답한다"는 **약속(창구)** 이고, **SDK**는 그 약속을 지키는 코드를 미리 만들어 둔 **라이브러리**입니다. 그래서 supabase-js는 "Supabase의 SDK"이면서 동시에 "라이브러리"입니다.

> [!NOTE]
> "API"는 넓게 쓰이는 말입니다. 서버가 열어 둔 주소(REST API)뿐 아니라, 라이브러리가 제공하는 함수 목록("React API", "`useState` API")이나 브라우저가 제공하는 기능("`fetch` API", "Clipboard API")도 모두 API라고 부릅니다. 공통점은 **"이렇게 쓰면 이렇게 동작한다"는 사용 약속**이라는 것입니다.

### 2-5. 설치하는 것과 가입하는 것

| | 라이브러리·프레임워크 | 서비스·플랫폼 |
| --- | --- | --- |
| 얻는 법 | `npm install`로 **내 프로젝트에 설치** | 웹사이트에서 **계정·프로젝트를 만들어** 사용 |
| 코드가 있는 곳 | 내 `node_modules/` 안 | 그 회사의 서버 |
| 돈 | 대부분 무료 오픈소스 | 무료 한도를 넘으면 요금 |
| 설정하는 곳 | 내 코드·설정 파일 | 그 서비스의 대시보드, 환경 변수 |
| 이 프로젝트 | Next.js, React, supabase-js | Vercel, Supabase |

Supabase는 둘 다 걸쳐 있습니다. **Supabase(서비스)** 는 DB·로그인·파일 저장소를 운영해 주고, **supabase-js(라이브러리)** 는 내 코드에서 그 서비스에 요청을 보내는 SDK입니다. 강의에서 "Supabase에 저장한다"는 서비스를, "`supabase.from(...)`을 부른다"는 라이브러리를 말합니다.

### 2-6. 한 장으로 보기

위에서부터 아래로, 위층이 아래층에 기대어 동작합니다.

| 층 | 무엇 | 이 프로젝트 | 관계 |
| --- | --- | --- | --- |
| 내 코드 | 우리가 직접 쓰는 파일 | `app/`, `lib/`의 `page.tsx`, `actions.ts` … | |
| 프레임워크 | 내 코드를 불러 주는 뼈대 | Next.js | 내 코드를 **부른다** |
| 라이브러리 | 내 코드가 불러 쓰는 기능 | React, supabase-js, zod, Yjs | 내 코드가 **부른다** |
| 언어 | 코드를 쓰는 문법 | TypeScript → JavaScript, HTML, CSS, SQL | 모든 층이 이 문법으로 쓰임 |
| 런타임 | 코드를 실행하는 환경 | 브라우저(화면), Node.js(서버) | 위의 코드를 **실행한다** |
| 서비스·플랫폼 | 남이 운영하는 서버 | Vercel(서버 실행), Supabase(DB·Auth·Storage) | 런타임과 데이터를 **빌려준다** |
| 개발 도구 | 만들 때만 돕는 프로그램 | VS Code, ESLint, TypeScript 컴파일러, npm, Supabase CLI | 완성된 서비스에는 **안 들어간다** |

> [!CHECK]
> 다음 도구를 언어 / 라이브러리 / 프레임워크 / 서비스 / 개발 도구 중 하나로 분류해 보세요.
>
> `Next.js`, `React`, `TypeScript`, `Vercel`, `ESLint`, `supabase-js`, `Supabase`, `SQL`, `npm`, `Yjs`
>
> 정답: 프레임워크 — Next.js / 라이브러리 — React, supabase-js(SDK), Yjs / 언어 — TypeScript, SQL / 서비스 — Vercel, Supabase / 개발 도구 — ESLint, npm(패키지 관리자). TypeScript는 컴파일러로 보면 개발 도구이기도 합니다.

> [!QUIZ]
> "React는 라이브러리, Next.js는 프레임워크"라고 부르는 이유를 "누가 누구를 부르는가"로 설명하세요.

> [!ANSWER]
> React는 내 코드가 `useState`, 컴포넌트 같은 기능을 **필요할 때 불러 씁니다.** Next.js는 `app/tasks/page.tsx`처럼 정해진 위치·이름에 코드를 두면, 사용자가 주소에 들어왔을 때 **Next.js가 내 함수를 찾아 호출합니다.** 실행 흐름을 내가 쥐면 라이브러리, 프레임워크가 쥐면 프레임워크입니다.

> [!QUIZ]
> "supabase-js를 지우면 Supabase에 저장된 데이터도 사라지나요?"에 답하세요.

> [!ANSWER]
> 사라지지 않습니다. supabase-js는 내 프로젝트에 설치된 **라이브러리(SDK)** 일 뿐이고, 데이터는 **Supabase 서비스**의 서버에 저장되어 있습니다. 라이브러리를 지우면 내 코드에서 요청을 보내는 수단이 없어질 뿐입니다.

### 2-7. 이 사이트의 실제 코드로 연습하기

지금 보고 있는 이 강의 사이트도 Next.js로 만들었습니다. 실제 파일 두 개로 2절의 구분을 연습해 봅니다.

#### import 줄만 보고 분류하기

화면 맨 위 머리말(로고·메뉴·검색 버튼)을 그리는 `components/layout/Header.tsx`의 첫 부분입니다.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, FileArchive, Menu, Moon, RotateCcw, Sun, X, Search, ShieldCheck } from "lucide-react";
import type { AcademicCatalog, LectureMeta, SearchEntry } from "@/types/content";
import { Sidebar } from "./Sidebar";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { useAdmin } from "@/components/admin/AdminContext";
import { isNavActive, PRIMARY_NAV, type PrimaryNavItem } from "@/lib/navigation";
```

`from` 뒤의 경로만 보면 어디서 온 코드인지 알 수 있습니다.

| 경로 모양 | 어디서 왔나 | 이 파일의 예 |
| --- | --- | --- |
| `"next/…"` | **프레임워크** Next.js가 제공하는 기능 | `next/link`(페이지 이동 링크), `next/navigation`(지금 주소 읽기) |
| `"react"` | **라이브러리** React | `useState` |
| 그 밖의 패키지 이름 | **라이브러리** (npm으로 설치한 남의 패키지) | `next-themes`(라이트·다크 테마), `@radix-ui/react-dialog`(모바일 메뉴 창), `lucide-react`(아이콘) |
| `"@/…"` | **내 모듈** (프로젝트 최상위 기준) | `@/types/content`, `@/lib/navigation` |
| `"./…"` | **내 모듈** (같은 폴더) | `./Sidebar` |

> [!TRAP]
> `next-themes`는 이름이 `next`로 시작하지만 Next.js가 아니라 **다른 사람이 만든 별도 라이브러리**입니다. `next/link`처럼 `next/` 뒤에 경로가 붙어야 Next.js 자체 기능입니다. 마찬가지로 `@radix-ui/…`의 `@`는 "radix-ui라는 단체가 낸 패키지"라는 뜻(스코프)이고, `@/…`의 `@/`는 우리 프로젝트 폴더를 가리키는 별칭입니다. 둘을 구분하는 기준은 `@` 바로 뒤에 `/`가 오는지입니다.

#### 프레임워크가 불러 주는 파일

`/lectures` 주소(강의 정리 페이지)를 그리는 `app/lectures/page.tsx`입니다. 원래 한 줄로 붙어 있는 화면 부분을 줄 나눠 정리하고, 설명 문구와 빈 목록 처리는 줄였습니다.

```tsx
import type { Metadata } from "next";
import { getAllLectures } from "@/lib/lectures";
import { AcademicCurriculum } from "@/components/lecture/AcademicCurriculum";
import { Footer } from "@/components/layout/Footer";
import { readCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "강의 정리",
  description: "학년, 학기, 과목별로 정리한 강의 노트를 살펴보세요.",
};

export default function LecturesPage() {
  const lectures = getAllLectures();   // 내 함수: content/ 폴더의 강의 파일을 모두 읽는다
  const catalog = readCatalog();       // 내 함수: 학년·학기·과목 목록을 읽는다
  return (
    <div className="index-page">
      <header className="page-title">
        <h1>강의 정리</h1>
        <span className="meta">{catalog.grades.length}개 학년 · {lectures.length}개 강의</span>
      </header>
      <AcademicCurriculum catalog={catalog} lectures={lectures} />
      <Footer />
    </div>
  );
}
```

| 줄 | 누가 정한 규칙인가 | 누가 부르나 |
| --- | --- | --- |
| 파일 위치 `app/lectures/page.tsx` | Next.js: `app/` 아래 폴더 이름이 주소, `page.tsx`가 그 주소의 화면 | Next.js |
| `export default function LecturesPage()` | Next.js: page 파일은 화면 함수를 `export default`로 내보낸다 | **Next.js가** 사용자가 `/lectures`에 들어올 때 호출 |
| `export const metadata` | Next.js: 이 이름으로 내보내면 브라우저 탭 제목·검색 설명에 쓰인다 | **Next.js가** 읽어 감 |
| `getAllLectures()`, `readCatalog()` | 내가 만든 함수 | **내 코드가** 호출 |
| `<div>`, `<h1>`, `{lectures.length}` | React(JSX) 문법 | React가 화면으로 그림 |

프로젝트 전체를 검색해도 `LecturesPage()`를 부르는 코드는 없습니다. 정해진 자리에 정해진 이름으로 두었기 때문에 **Next.js가 찾아서 불러 줍니다.** 이것이 2-1절의 "프레임워크가 내 코드를 부른다"입니다. 반대로 `getAllLectures()`는 내가 필요할 때 직접 부릅니다. 함수 이름을 `LecturesPage`에서 다른 이름으로 바꿔도 그대로 동작합니다. 하지만 파일 이름을 `pages.tsx`로 바꾸면 이 주소는 404가 되고, `export default`를 빼면 Next.js가 화면 함수를 찾지 못해 오류가 납니다. **이름이 중요한 것은 함수가 아니라 파일과 내보내기 방식**이라는 뜻입니다.

> [!NOTE]
> `Header.tsx`는 첫 줄이 `"use client"`이고 `page.tsx`에는 없습니다. Header는 메뉴 열기·테마 바꾸기처럼 **브라우저에서 클릭에 반응**해야 하므로 브라우저에서 실행되는 Client Component로 표시한 것입니다. page.tsx는 서버에서 강의 파일을 읽어 화면을 미리 만드는 Server Component입니다. 이 구분은 02-0편과 02-3편에서 자세히 다룹니다.

> [!CHECK]
> 다음 import 줄을 프레임워크 / 라이브러리 / 내 모듈로 분류하세요.
>
> ```tsx
> import { notFound } from "next/navigation";
> import Fuse from "fuse.js";
> import { useProgress } from "./ProgressProvider";
> import type { LectureMeta } from "@/types/content";
> import { ThemeProvider } from "next-themes";
> ```
>
> 정답: 프레임워크 — `next/navigation` / 라이브러리 — `fuse.js`(이 사이트의 검색 기능에 쓰는 패키지), `next-themes` / 내 모듈 — `./ProgressProvider`, `@/types/content`

## 3. 도구 사전 — 무엇이고 어떻게 작동하나

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

## 4. "업무 저장" 버튼 하나를 따라가기

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

## 5. Next.js를 거치지 않는 두 길

대부분의 요청은 ①→②→③을 지나지만, 두 경우는 브라우저가 Supabase와 **직접** 통신합니다(그림의 점선).

| 경우 | 왜 직접 가나 | 그래도 안전한 이유 |
| --- | --- | --- |
| **로그인** | Google OAuth 화면으로 이동했다가 Supabase가 결과를 받음 | Auth Hook이 학교 계정만 통과시킴 (03-3) |
| **회의록 공동 편집** | 키 입력마다 Vercel을 거치면 느리고 비쌈 | 브라우저는 사용자 JWT로 DB 함수를 부르고, 함수와 RLS가 매번 권한을 검사 (05-3) |

이때 브라우저가 쓰는 키는 **공개용 키**(publishable / anon key)입니다. 이 키는 "어느 Supabase 프로젝트인지"만 알려 주는 공개 값이고, 실제 권한은 로그인 JWT와 RLS가 결정합니다. 관리자 키(service role / secret key)는 절대 브라우저에 두지 않습니다.

## 6. 폴더로 보는 세 층

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

[← 01-4 TypeScript 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-04) · [02-0 React와 Next.js 한눈에 보기 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00)
