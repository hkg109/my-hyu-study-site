---
title: "02-1 · React 기초"
description: "코드를 처음 보는 사람을 위해 HTML 기본 문법(태그·속성·중첩)부터 시작해, JSX가 HTML과 무엇이 다른지, 중괄호 안에 JavaScript를 넣는 규칙, 조건·목록 그리기를 익힌 뒤 Component·Props·State·key를 학생회 업무 카드와 업무 목록 필터로 차근차근 쌓아 올립니다."
order: 1
published: false
duration: 70
tags: [HTML, JSX, React, Component, Props, State, useState]
objectives:
  - HTML 한 줄을 여는 태그·속성·내용·닫는 태그로 나눠 읽는다.
  - JSX가 HTML과 다른 규칙(className, 스스로 닫기, 하나로 감싸기, camelCase 이벤트)을 말한다.
  - 중괄호 { } 안에 JavaScript 값을 넣고, 조건과 목록을 JSX로 그린다.
  - Component·Props·State를 업무 화면의 예로 구분하고, 상태가 바뀌면 화면이 다시 그려지는 순서를 설명한다.
  - 목록 렌더링에서 key가 필요한 이유를 말한다.
---

[![브라우저 층의 React 화면과 Tailwind CSS가 강조된 세 층 지도](/materials/diagrams/cpg-12-stack-front.svg)](/materials/diagrams/cpg-12-stack-front.svg)

*그림 02-1 · 이 과목은 브라우저 층이다 — 누르면 원본 크기로 열린다.*

## 학습 흐름

```text
HTML 기본 문법 (태그 · 속성 · 중첩)
        ↓
JSX = JavaScript 안에 쓰는 HTML 모양 문법
        ↓
중괄호 { } 로 값 넣기 → 조건 그리기 → 목록 그리기
        ↓
Component (화면 조각) → Props (받는 값) → State (기억하는 값)
        ↓
key와 "State는 새 값으로 바꾼다"
```

> [!NOTE]
> 이 편은 **코드를 한 번도 안 써 봤다**고 가정하고 처음부터 설명합니다. React와 Next.js의 전체 그림은 [02-0 React와 Next.js 한눈에 보기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00)에 있습니다. HTML을 더 자세히 보고 싶으면 [01-2 HTML·CSS 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-02), JavaScript 문법이 낯설면 [01-3 JavaScript 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-03)를 옆에 펴 두세요.

---

## 1. 웹 화면은 무엇으로 만드나

브라우저에 보이는 웹 화면은 세 가지가 함께 만듭니다.

| 언어 | 맡는 일 | 비유 |
| --- | --- | --- |
| **HTML** | 화면에 **무엇이** 있는지 (제목, 버튼, 입력창) | 집의 뼈대 |
| **CSS** | 그것이 **어떻게 보이는지** (색, 크기, 배치) | 페인트와 가구 배치 |
| **JavaScript** | 눌렀을 때 **무엇을 하는지** (필터 바꾸기, 저장) | 전기와 스위치 |

**React**는 JavaScript로 HTML을 편하게 만들게 도와주는 도구입니다. 그래서 React를 배우려면 HTML 모양부터 읽을 줄 알아야 합니다.

---

## 2. HTML 기본 문법

### 2-1. 태그 하나 뜯어보기

```html
<h1 class="page-title">내 업무</h1>
```

| 부분 | 이름 | 뜻 |
| --- | --- | --- |
| `<h1>` | 여는 태그 | "여기부터 가장 큰 제목이 시작된다" |
| `class="page-title"` | 속성 | 태그에 붙이는 추가 정보. 항상 `이름="값"` 모양 |
| `내 업무` | 내용 | 화면에 실제로 보이는 글자 |
| `</h1>` | 닫는 태그 | `/`가 붙으면 "제목 끝" |

> [!DEFINITION]
> **태그(tag)** 는 `< >`로 감싼 이름표입니다. 대부분 **여는 태그와 닫는 태그가 짝**을 이루고, 그 사이에 내용이 들어갑니다. 여는 태그와 닫는 태그를 합친 한 덩어리를 **요소(element)** 라고 부릅니다.

### 2-2. 태그 안에 태그 — 중첩

태그 안에 다른 태그를 넣을 수 있습니다. 이것을 **중첩**이라고 합니다.

```html
<ul>
  <li>축제 부스 배치도</li>
  <li>간식 행사 예산</li>
</ul>
```

화면에는 이렇게 보입니다.

```text
• 축제 부스 배치도
• 간식 행사 예산
```

- `<ul>`은 "점 찍힌 목록", `<li>`는 "목록의 항목 하나"입니다.
- 안쪽 태그는 바깥 태그보다 **먼저 닫아야** 합니다. `<ul><li>…</ul></li>`처럼 엇갈리면 안 됩니다.
- 들여쓰기(앞의 빈칸)는 사람이 읽기 쉽게 하려는 것이고 화면에는 영향이 없습니다.

### 2-3. 닫는 태그가 없는 태그

내용을 담지 않는 태그는 닫는 태그가 없습니다.

```html
<input type="text" placeholder="업무 제목">
<br>
<img src="/logo.png" alt="학생회 로고">
```

| 태그 | 뜻 |
| --- | --- |
| `<input>` | 글자를 입력하는 칸 |
| `<br>` | 줄바꿈 |
| `<img>` | 그림. `src`는 그림 주소, `alt`는 그림을 못 볼 때 읽어 줄 설명 |

### 2-4. 이 프로젝트에서 자주 보는 태그

| 태그 | 의미 | 학생회 화면에서 |
| --- | --- | --- |
| `<h1>` `<h2>` `<h3>` | 제목 (숫자가 작을수록 큰 제목) | 페이지 제목, 섹션 제목 |
| `<p>` | 문단 | 설명 글, 담당자 이름 |
| `<a href="/tasks">` | 링크. `href`가 이동할 주소 | 메뉴, 업무 상세로 이동 |
| `<ul>` `<li>` | 목록과 항목 | 업무 목록 |
| `<button>` | 버튼 | 저장, 필터 |
| `<form>` | 입력 칸 묶음 | 업무 등록 |
| `<label>` | 입력 칸의 이름 | "제목", "마감일" |
| `<section>` `<main>` `<nav>` | 영역의 의미 | 본문, 메뉴 |
| `<div>` `<span>` | 의미 없는 묶음 (배치용) | 카드 안쪽 묶음 |

### 2-5. 속성 더 보기

```html
<label for="title">제목</label>
<input id="title" type="text" required>
<button type="submit" disabled>저장</button>
```

| 속성 | 뜻 |
| --- | --- |
| `id="title"` | 이 요소의 고유한 이름 |
| `for="title"` | 이 label이 `id="title"`인 입력 칸의 이름이라는 뜻. label을 누르면 그 칸으로 커서가 감 |
| `type="text"` | 입력 칸의 종류 (글자, 날짜, 비밀번호 등) |
| `required` | 값 없이 쓰는 속성. "반드시 입력해야 함" |
| `disabled` | "지금은 누를 수 없음" |

> [!CHECK]
> 다음 HTML에서 여는 태그, 속성, 내용, 닫는 태그를 각각 찾아보세요.
>
> ```html
> <a href="/tasks/42">축제 부스 배치도</a>
> ```
>
> 정답: 여는 태그 `<a …>`, 속성 `href="/tasks/42"`, 내용 `축제 부스 배치도`, 닫는 태그 `</a>`. 누르면 `/tasks/42` 주소로 이동하는 링크입니다.

---

## 3. JSX — JavaScript 안에 쓰는 HTML

### 3-1. 왜 JSX가 필요한가

HTML 파일은 **항상 같은 내용**만 보여 줍니다. 그런데 업무 목록은 사람마다, 시간마다 다릅니다. 데이터에 따라 화면을 바꾸려면 JavaScript가 필요합니다.

**JSX**는 JavaScript 코드 안에 HTML과 거의 같은 모양을 바로 쓸 수 있게 한 문법입니다.

```tsx
const title = "축제 부스 배치도";

const card = <p>{title}</p>;
```

- 첫 줄은 평범한 JavaScript입니다. `title`이라는 이름에 글자를 담았습니다.
- 둘째 줄의 `<p>…</p>`가 JSX입니다. HTML처럼 보이지만 JavaScript 코드 안에 있습니다.
- `{title}`의 **중괄호**는 "여기에 JavaScript 값을 넣어라"는 표시입니다. 화면에는 `축제 부스 배치도`가 보입니다.

> [!NOTE]
> JSX가 들어 있는 파일은 확장자가 `.jsx`, TypeScript를 쓰면 **`.tsx`** 입니다. 이 프로젝트의 화면 파일은 모두 `.tsx`입니다. 브라우저는 JSX를 직접 읽지 못하므로, Next.js가 실행 전에 평범한 JavaScript로 바꿔 줍니다.

### 3-2. JSX가 HTML과 다른 규칙

JSX는 HTML과 **거의** 같지만, JavaScript 안에 있기 때문에 몇 가지가 다릅니다. 처음에 가장 많이 틀리는 부분입니다.

| HTML | JSX | 이유 |
| --- | --- | --- |
| `class="card"` | `className="card"` | `class`는 JavaScript에서 이미 쓰는 단어 |
| `for="title"` | `htmlFor="title"` | `for`도 JavaScript의 반복문 단어 |
| `<input>` | `<input />` | 닫는 태그가 없는 태그는 **`/>`로 스스로 닫아야** 함 |
| `<br>` | `<br />` | 위와 같음 |
| `onclick="…"` | `onClick={함수}` | 이벤트 이름은 **낙타 표기(camelCase)**, 값은 글자가 아닌 함수 |
| `style="color: red"` | `style={{ color: "red" }}` | style은 글자가 아닌 JavaScript 객체 |
| `<!-- 주석 -->` | `{/* 주석 */}` | 주석도 중괄호 안 JavaScript 주석 |

### 3-3. 반드시 하나로 감싼다

JSX 덩어리는 **바깥에 요소가 하나**만 있어야 합니다.

```tsx
// ❌ 바깥에 <h2>와 <p> 두 개가 나란히 있음 → 오류
const bad = (
  <h2>내 업무</h2>
  <p>3건</p>
);

// ✅ <section> 하나로 감쌈
const good = (
  <section>
    <h2>내 업무</h2>
    <p>3건</p>
  </section>
);

// ✅ 감쌀 태그가 필요 없으면 빈 태그 <>…</> (Fragment)
const alsoGood = (
  <>
    <h2>내 업무</h2>
    <p>3건</p>
  </>
);
```

여러 줄짜리 JSX는 위처럼 **소괄호 `( )`로 감싸서** 쓰는 것이 관례입니다.

> [!TRAP]
> JSX에서 자주 나는 오류 세 가지:
> - `class=`를 그대로 써서 경고가 나옴 → `className=`
> - `<input>`을 닫지 않아 오류 → `<input />`
> - 바깥에 요소가 두 개 → `<section>`이나 `<>…</>`로 감싸기

---

## 4. 중괄호 { } — JSX 안에 JavaScript 넣기

### 4-1. 값 넣기

중괄호 안에는 **값이 나오는 JavaScript 식**을 넣습니다.

```tsx
const count = 3;
const name = "김국원";

const header = (
  <div>
    <p>{name}님의 업무</p>          {/* 김국원님의 업무 */}
    <p>{count}건</p>                {/* 3건 */}
    <p>{count + 2}건 예정</p>        {/* 5건 예정 — 계산도 됨 */}
    <p>{name.length}글자</p>         {/* 3글자 */}
  </div>
);
```

속성 값에도 중괄호를 씁니다.

```tsx
const taskId = 42;
const link = <a href={`/tasks/${taskId}`}>상세 보기</a>;   // href="/tasks/42"
```

`` `/tasks/${taskId}` ``는 글자 안에 값을 끼워 넣는 **템플릿 문자열**입니다(01-3편).

| 쓰는 법 | 뜻 |
| --- | --- |
| `title="축제"` | 글자를 그대로 넣음 |
| `title={변수}` | JavaScript 값을 넣음 |
| `count={3}` | 숫자는 중괄호 (따옴표로 쓰면 글자 `"3"`이 됨) |

> [!CAUTION]
> 중괄호 안에는 **값이 나오는 식**만 들어갑니다. `if`문이나 `for`문은 값이 아니라 "명령"이라서 넣을 수 없습니다. 그래서 조건과 반복은 아래처럼 다른 방법으로 씁니다.

### 4-2. 조건에 따라 그리기

**둘 중 하나**를 보여 줄 때는 삼항 연산자 `조건 ? A : B`를 씁니다.

```tsx
const assigneeName: string | null = null;

const who = <p>{assigneeName ? assigneeName : "담당자 재배정 필요"}</p>;
// 담당자가 없으므로 화면에는 "담당자 재배정 필요"
```

"담당자가 없으면 안내 문구"는 자주 쓰므로 `??`로 줄여 씁니다. `A ?? B`는 "A가 `null`이나 `undefined`면 B"라는 뜻입니다.

```tsx
<p>{assigneeName ?? "담당자 재배정 필요"}</p>
```

**보여 주거나 말거나**일 때는 `조건 && A`를 씁니다. 조건이 참일 때만 A가 그려집니다.

```tsx
const isOverdue = true;

const badge = <p>축제 부스 배치도 {isOverdue && <span>기한 초과</span>}</p>;
```

> [!TRAP]
> `&&` 왼쪽에 **숫자**를 두면 0일 때 화면에 `0`이 찍힙니다.
>
> ```tsx
> {tasks.length && <p>업무가 있습니다</p>}       // ❌ 업무가 0개면 "0"이 보임
> {tasks.length > 0 && <p>업무가 있습니다</p>}   // ✅ 참/거짓으로 비교
> ```

### 4-3. 목록 그리기 — map

배열의 항목마다 JSX를 하나씩 만들 때는 배열의 `map`을 씁니다(01-3편). `map`은 "각 항목을 다른 것으로 바꾼 새 배열"을 돌려줍니다.

```tsx
const titles = ["축제 부스 배치도", "간식 행사 예산", "회의실 예약"];

const list = (
  <ul>
    {titles.map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);
```

결과는 HTML로 이렇게 쓴 것과 같습니다.

```html
<ul>
  <li>축제 부스 배치도</li>
  <li>간식 행사 예산</li>
  <li>회의실 예약</li>
</ul>
```

`key={t}`는 각 항목의 이름표입니다. 왜 필요한지는 8절에서 봅니다.

---

## 5. Component — 화면 조각에 이름 붙이기

### 5-1. Component는 JSX를 돌려주는 함수

업무 카드가 화면에 10번 나온다면 같은 JSX를 10번 쓰기 싫겠죠. 그래서 화면 조각에 이름을 붙여 **Component**로 만듭니다.

```tsx
function Greeting() {
  return <h1>안녕하세요, 학생회!</h1>;
}
```

- `function Greeting() { … }`은 JavaScript 함수입니다.
- 이 함수는 JSX를 `return`(돌려줌)합니다. **JSX를 돌려주는 함수 = Component**입니다.
- Component 이름은 **반드시 대문자로 시작**합니다. 소문자로 쓰면 React가 `<greeting>`이라는 HTML 태그로 착각합니다.

만든 Component는 **태그처럼** 씁니다.

```tsx
function Page() {
  return (
    <main>
      <Greeting />
      <Greeting />
    </main>
  );
}
```

화면에는 "안녕하세요, 학생회!"가 두 번 보입니다.

### 5-2. 화면을 Component로 나누기

React로 만든 화면은 Component 안에 Component가 들어 있는 **나무 모양**입니다. 업무 목록 화면은 이렇게 나눌 수 있습니다.

```text
업무 목록 화면 (TaskListPage)
├─ FilterBar        ← 상태 필터 버튼들
└─ TaskList
   ├─ TaskCard      ← 업무 하나
   ├─ TaskCard
   └─ TaskCard
```

> [!NOTE]
> `export function TaskCard…`처럼 앞에 `export`가 붙으면 다른 파일에서 `import { TaskCard } from "@/components/task-card";`로 가져다 쓸 수 있습니다(01-3편 모듈).

---

## 6. Props — 부모가 넘겨주는 값

### 6-1. HTML 속성처럼 값을 넘긴다

`Greeting`은 늘 같은 말만 합니다. 카드마다 제목이 달라야 하므로, Component에 **값을 넘겨** 줍니다. 이 값을 **Props**라고 합니다.

```tsx
// 받는 쪽: props라는 상자로 받아서 꺼내 씀
function TaskCard(props) {
  return <li>{props.title}</li>;
}

// 넘기는 쪽: HTML 속성처럼 씀
<TaskCard title="축제 부스 배치도" />
<TaskCard title="간식 행사 예산" />
```

`<TaskCard title="…" />`에 적은 `title`이 `props.title`로 들어갑니다. HTML에서 `<a href="…">`에 속성을 적던 것과 같은 모양입니다.

매번 `props.`을 쓰기 번거로우므로 보통 **구조 분해**로 바로 꺼냅니다(01-3편).

```tsx
function TaskCard({ title }) {
  return <li>{title}</li>;
}
```

### 6-2. 실제 프로젝트 모양 — 타입 붙이기

이 프로젝트는 TypeScript를 쓰므로, Props가 어떤 모양인지 **타입**으로 먼저 적습니다(01-4편). 앞에서 배운 것을 모두 합친 실제 업무 카드입니다.

```tsx
// components/task-card.tsx
type TaskCardProps = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  assigneeName: string | null;
};

export function TaskCard({ title, status, assigneeName }: TaskCardProps) {
  const label = { TODO: "할 일", IN_PROGRESS: "진행 중", REVIEW: "검토 중", DONE: "완료" }[status];

  return (
    <li className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-stone-600">{assigneeName ?? "담당자 재배정 필요"}</p>
      </div>
      <span className="rounded bg-stone-900 px-2 text-sm text-white">{label}</span>
    </li>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `type TaskCardProps = {...}` | 이 Component가 받을 값의 모양. 제목은 글자, 상태는 네 가지 중 하나, 담당자는 글자 또는 없음(`null`) |
| `export function TaskCard(...)` | 대문자로 시작하는 함수 = Component. `export`로 다른 파일에서 씀 |
| `({ title, status, assigneeName }: TaskCardProps)` | 받은 Props를 구조 분해로 꺼냄. 콜론 뒤는 그 모양의 타입 |
| `const label = {...}[status]` | 영어 상태값을 한글로 바꿈. `status`가 `"DONE"`이면 `"완료"` |
| `return ( <li>...</li> )` | 화면 모양을 돌려줌 (3절의 소괄호 관례) |
| `className="flex …"` | HTML의 `class`. 값은 Tailwind 클래스(02-5편) |
| `{title}` | 중괄호 안 JavaScript 값이 글자로 들어감 |
| `{assigneeName ?? "..."}` | 담당자가 `null`이면 안내 문구 (4-2절) |

쓰는 쪽은 이렇습니다.

```tsx
<TaskCard title="축제 부스 배치도" status="IN_PROGRESS" assigneeName="김국원" />
<TaskCard title="간식 행사 예산" status="TODO" assigneeName={null} />
```

두 번째 카드는 담당자 자리에 "담당자 재배정 필요"가 보입니다. `null`은 글자가 아닌 JavaScript 값이라 중괄호에 넣었습니다.

> [!EXAM]
> **Props는 읽기 전용입니다.** 자식 Component는 받은 Props를 바꾸지 않습니다. 바꾸고 싶으면 값을 가진 부모가 "바꿔 달라"는 함수를 Props로 내려 주고, 자식은 그 함수를 부릅니다.

---

## 7. State — Component가 기억하는 바뀌는 값

### 7-1. 그냥 변수로는 화면이 안 바뀐다

버튼을 누를 때마다 숫자가 올라가는 화면을 만들어 봅시다. 먼저 **틀린** 방법입니다.

```tsx
function Counter() {
  let count = 0;
  return <button onClick={() => { count = count + 1; }}>{count}번 누름</button>;
}
```

눌러도 화면은 계속 `0번 누름`입니다. `count`는 바뀌었지만 React는 그 사실을 모르기 때문에 화면을 다시 그리지 않습니다.

### 7-2. useState로 기억하게 하기

React에게 "이 값이 바뀌면 화면을 다시 그려라"라고 알려 주는 것이 **State**이고, `useState`로 만듭니다.

```tsx
"use client";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}번 누름</button>;
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `"use client"` | 이 파일은 브라우저에서 실행된다는 표시. 클릭과 State가 있는 Component에 필요 (02-3편) |
| `import { useState } from "react"` | React에서 `useState` 기능을 가져옴 |
| `useState(0)` | 처음 값이 0인 State를 만듦 |
| `const [count, setCount] = …` | `count`는 **현재 값**, `setCount`는 **값을 바꾸는 함수**. 이름은 자유지만 `값, set값` 짝으로 짓는 것이 관례 |
| `onClick={() => setCount(count + 1)}` | 누르면 `setCount`로 1 큰 값을 넣음 → React가 화면을 다시 그림 |

> [!CAUTION]
> `onClick={setCount(count + 1)}`처럼 쓰면 안 됩니다. 이것은 "누를 때 실행할 함수"가 아니라 **그리는 순간 바로 실행**하는 코드입니다. 반드시 `() => …`로 감싸서 "나중에 실행할 함수"를 넘깁니다.

### 7-3. 실제 프로젝트 모양 — 업무 목록 필터

이제 업무 목록에 "전체 / 할 일 / 진행 중 / 완료" 필터를 붙입니다. 지금까지 배운 중괄호·조건·`map`·Props·State가 모두 들어 있습니다.

```tsx
"use client";
import { useState } from "react";
import { TaskCard } from "@/components/task-card";

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type Task = { id: string; title: string; status: Status; assigneeName: string | null };

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const visible = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <section>
      <div role="group" aria-label="상태 필터" className="flex gap-2">
        {(["ALL", "TODO", "IN_PROGRESS", "DONE"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === "ALL" ? "전체" : value}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p>조건에 맞는 업무가 없습니다.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((t) => (
            <TaskCard key={t.id} title={t.title} status={t.status} assigneeName={t.assigneeName} />
          ))}
        </ul>
      )}
    </section>
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `{ tasks }: { tasks: Task[] }` | 부모에게서 업무 배열을 Props로 받음 |
| `useState<Status \| "ALL">("ALL")` | 필터 State. 꺾쇠 `< >` 안은 허용하는 값의 타입, 괄호 안 `"ALL"`이 처음 값 |
| `const visible = …` | State로부터 **계산한** 값. "전체"면 그대로, 아니면 그 상태인 업무만 거름. 따로 State로 두지 않음 |
| `[…].map((value) => <button …>)` | 필터 버튼 4개를 배열에서 만듦 (4-3절) |
| `onClick={() => setFilter(value)}` | 누르면 State를 바꿈 → 화면이 다시 그려짐 |
| `aria-pressed={filter === value}` | 화면 낭독기에 "지금 눌린 버튼"임을 알려 줌 (02-5편 접근성) |
| `visible.length === 0 ? A : B` | 빈 목록이면 안내 글, 아니면 목록 (4-2절) |
| `visible.map((t) => <TaskCard key={t.id} … />)` | 업무 배열을 카드 목록으로 바꿈 |

### 7-4. 다시 그려지는 순서

1. 사용자가 "진행 중"(`IN_PROGRESS`) 버튼을 누릅니다.
2. `setFilter("IN_PROGRESS")`가 실행됩니다.
3. React가 `TaskList` 함수를 **처음부터 다시 실행**합니다. 이번에는 `filter`가 `"IN_PROGRESS"`입니다.
4. 새로 계산된 `visible`로 만든 JSX를 이전 화면과 비교해, **바뀐 부분만** 실제 화면에 반영합니다.

> [!EXAM]
> **Props vs State**
> - **Props**: 밖(부모)에서 받은 값. 읽기만 한다. 예: `TaskCard`가 받는 제목·상태.
> - **State**: 이 Component가 기억하는 바뀌는 값. `set함수`로만 바꾼다. 예: 필터 선택값, 입력 중인 글자, 열림/닫힘.
> - **계산값**: Props와 State로 언제든 계산할 수 있는 값은 State로 두지 않는다. 예: `visible`.

---

## 8. key — 목록의 각 항목에 붙이는 이름표

`map`으로 목록을 만들 때는 각 항목에 **변하지 않는 고유한** `key`를 붙입니다. React는 key로 "어느 카드가 그대로이고 어느 카드가 새로 생겼는지" 구별합니다.

| key로 쓰면 | 결과 |
| --- | --- |
| `t.id` (DB의 고유 ID) | ✅ 올바름 |
| 배열 번호 `index` | ⚠️ 필터나 정렬이 바뀌면 다른 카드의 입력 상태가 엉뚱한 카드에 붙음 |
| `Math.random()` | ❌ 그릴 때마다 바뀌어 모든 카드를 새로 만듦 |

> [!NOTE]
> 4-3절에서 `key={t}`로 제목을 쓴 것은 제목이 겹치지 않는 연습용 예라서입니다. 실제 업무는 제목이 같을 수 있으므로 반드시 `t.id`를 씁니다.

---

## 9. State는 새 값으로 바꾼다

```tsx
const [tasks, setTasks] = useState<Task[]>(initialTasks);

// ❌ 원본을 직접 바꿈 → React가 바뀐 것을 모름
tasks[0].status = "DONE";
setTasks(tasks);

// ✅ 바뀐 항목만 새 객체로, 배열도 새 배열로
setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "DONE" } : t)));
```

- React는 "**이전 값과 같은 상자인가**"로 바뀌었는지 판단합니다. 원본 배열을 고쳐서 다시 넣으면 같은 상자라서 바뀐 줄 모릅니다.
- `{ ...t, status: "DONE" }`은 "`t`의 내용을 복사하고 `status`만 바꾼 **새 객체**"입니다(01-3편 전개).
- `setTasks((prev) => ...)`처럼 함수를 넘기면 "가장 최신 값을 받아 새 값을 만든다"는 뜻입니다. 빠르게 여러 번 바뀔 때 안전합니다.

---

## 10. 이벤트와 Effect

```tsx
const [keyword, setKeyword] = useState("");

<input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
```

- `onChange`, `onClick`, `onSubmit`처럼 `on`으로 시작하는 Props가 **이벤트**입니다. "이 일이 일어나면 이 함수를 실행해라"는 뜻입니다.
- `e`는 일어난 일의 정보이고, `e.target.value`는 입력 칸의 현재 글자입니다.
- `value={keyword}`로 입력 칸에 State를 보여 주고, 글자가 바뀔 때마다 State를 바꿉니다. 이렇게 하면 입력 칸의 글자가 항상 State와 같습니다.

`useEffect`는 "화면을 그린 **뒤에** 바깥 세계와 연결할 일"(Realtime 구독, 타이머 등)에 씁니다. 05-3편 회의록 채널 구독에서 다시 나옵니다. 데이터를 불러오는 일은 Next.js에서는 대부분 서버에서 하므로(02-3편) `useEffect`로 데이터를 불러오는 코드는 이 프로젝트에서 거의 쓰지 않습니다.

---

## 11. 직접 해보기

1. 아래 HTML을 JSX로 바꿔 보세요. (힌트: 바꿀 곳이 세 군데)

   ```html
   <label for="title" class="font-semibold">제목</label>
   <input id="title" type="text">
   ```

2. `TaskCard`에 마감일(`dueDate: string | null`)을 Props로 추가하고, 마감이 지났으면 "기한 초과" 글자를 `&&`로 붙여 보세요.
3. `TaskList`에 제목 검색 입력 칸을 추가해 보세요. 검색어는 State, 보이는 목록은 계산값입니다. (기획서: MVP 검색은 목록별 제목 필터만)

> [!QUIZ]
> 1번 HTML을 JSX로 바꾸면?

> [!ANSWER]
> ```tsx
> <>
>   <label htmlFor="title" className="font-semibold">제목</label>
>   <input id="title" type="text" />
> </>
> ```
>
> `for` → `htmlFor`, `class` → `className`, `<input>` → `<input />`. 바깥에 요소가 두 개이므로 `<>…</>`로 감쌌습니다.

> [!QUIZ]
> 다음 Component를 쓰면 화면에 무엇이 보이나요?
>
> ```tsx
> function Summary({ count }: { count: number }) {
>   return <p>{count > 0 ? `${count}건 남음` : "모두 완료"}</p>;
> }
>
> <Summary count={0} />
> ```

> [!ANSWER]
> `모두 완료`. `count`가 0이라 `count > 0`이 거짓이므로 `:` 뒤의 글자가 보입니다. `count={3}`이면 `3건 남음`이 보입니다.

> [!QUIZ]
> 필터와 검색어가 있을 때 "보이는 업무 목록"을 State로 따로 두면 안 되는 이유는?

> [!ANSWER]
> 보이는 목록은 `tasks`, `filter`, `keyword`로부터 **언제든 계산할 수 있는 값**입니다. 따로 State로 두면 셋 중 하나가 바뀔 때마다 그것도 맞춰 바꿔야 하고, 하나라도 빼먹으면 화면이 실제 데이터와 어긋납니다. 계산할 수 있는 값은 그리는 중에 계산합니다.

> [!QUIZ]
> `TaskCard` 안에서 `title = "수정됨"`처럼 Props를 직접 바꾸려 하면 어떻게 해야 하나요?

> [!ANSWER]
> Props는 읽기 전용이라 직접 바꾸지 않습니다. 값을 가진 부모가 `onRename` 같은 함수를 Props로 내려 주고, 자식은 그 함수를 부릅니다. 부모가 자기 State를 바꾸면 새 Props로 자식이 다시 그려집니다. 실제 저장이 필요하면 그 함수가 Server Action을 부릅니다(02-4편).

## 핵심 정리

| 개념 | 한 줄 정리 |
| --- | --- |
| HTML 태그 | `<여는 태그 속성="값">내용</닫는 태그>`. 안쪽 태그를 먼저 닫음 |
| JSX | JavaScript 안에 쓰는 HTML 모양. `className`, `htmlFor`, `<input />`, 바깥은 하나 |
| `{ }` | JSX 안에 JavaScript 값을 넣는 자리. `if`·`for`는 못 넣음 |
| 조건 | 둘 중 하나는 `? :`, 보이거나 말거나는 `&&`, 없으면 대체는 `??` |
| 목록 | `배열.map((x) => <li key={x.id}>…</li>)` |
| Component | JSX를 돌려주는, 대문자로 시작하는 함수 |
| Props | 부모가 넘기는 값. 읽기 전용 |
| State | `useState`로 만든 기억하는 값. `set함수`로 **새 값**을 넣으면 화면이 다시 그려짐 |
| key | 목록 항목의 변하지 않는 고유 이름표. 보통 DB의 `id` |

## 학습 경로

[← 02-0 React와 Next.js 한눈에 보기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00) · [02-2 Next.js App Router →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-02)
