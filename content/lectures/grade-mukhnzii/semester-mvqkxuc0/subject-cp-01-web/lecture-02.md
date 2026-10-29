---
title: "01-2 · HTML·CSS 읽기"
description: "태그·속성·중첩으로 이루어진 HTML의 구조, 폼과 label, 의미 있는 태그를 업무 등록 폼으로 읽고, CSS 선택자·박스 모델·Flexbox와 Tailwind 클래스를 같은 폼에 입혀 보며 화면이 어떻게 만들어지는지 익힙니다."
order: 2
published: false
duration: 40
tags: [HTML, CSS, 폼, label, Flexbox, Tailwind]
objectives:
  - 태그·속성·내용·중첩을 구분해 HTML 한 덩어리를 읽는다.
  - form·label·input·select·button이 업무 등록 폼에서 맡는 역할을 말한다.
  - CSS 선택자·속성·값을 읽고, 박스 모델의 margin·padding·border를 구분한다.
  - 같은 스타일을 일반 CSS와 Tailwind 클래스로 각각 읽는다.
---

## 1. HTML은 "무엇이 있는가"를 적는다

HTML은 화면에 **무엇이** 있는지를 적는 언어입니다. 모양(색·크기·배치)은 CSS가 맡습니다.

```html
<h1 class="page-title">내 업무</h1>
```

| 부분 | 이름 | 뜻 |
| --- | --- | --- |
| `<h1>` | 여는 태그 | "여기부터 가장 큰 제목" |
| `class="page-title"` | 속성 | 태그에 붙는 추가 정보. `이름="값"` |
| `내 업무` | 내용 | 화면에 보이는 글자 |
| `</h1>` | 닫는 태그 | "제목 끝" |

태그 안에 태그를 넣는 것을 **중첩**이라고 합니다. 들여쓰기는 사람이 읽기 쉽게 하는 것일 뿐 의미는 없습니다.

```html
<ul>
  <li>축제 부스 배치도</li>
  <li>간식 행사 예산</li>
</ul>
```

`<ul>`(목록) 안에 `<li>`(항목) 두 개가 들어 있습니다.

## 2. 자주 보는 태그

| 태그 | 의미 | 학생회 화면에서 |
| --- | --- | --- |
| `<h1>`–`<h3>` | 제목 단계 | 페이지 제목, 섹션 제목 |
| `<p>` | 문단 | 설명 글 |
| `<a href="/tasks">` | 링크 | 메뉴, 업무 상세로 이동 |
| `<ul>` `<ol>` `<li>` | 목록 | 업무 목록 |
| `<table>` `<tr>` `<td>` | 표 | 권한 표 |
| `<button>` | 버튼 | 저장, 보관 |
| `<form>` | 입력 묶음 | 업무 등록 |
| `<input>` `<textarea>` `<select>` | 입력창 | 제목, 설명, 상태 선택 |
| `<label>` | 입력창 이름 | "제목", "마감일" |
| `<nav>` `<main>` `<section>` `<header>` | 영역의 의미 | 메뉴, 본문, 묶음 |
| `<div>` `<span>` | 의미 없는 묶음 | 배치용 |

> [!NOTE]
> `<div>`만으로도 화면은 만들 수 있지만, `<nav>`·`<main>`·`<button>`처럼 **의미 있는 태그**를 써야 화면 낭독기와 키보드 사용자가 화면을 이해할 수 있습니다. 기획서 12.1절의 접근성 요구사항입니다.

## 3. 업무 등록 폼을 뜯어보기

```html
<form action="/tasks/new" method="post">
  <label for="title">제목</label>
  <input id="title" name="title" type="text" required maxlength="100">

  <label for="due">마감일</label>
  <input id="due" name="due_date" type="date">

  <label for="mode">공개 모드</label>
  <select id="mode" name="visibility_mode">
    <option value="DEFAULT" selected>기본 공개</option>
    <option value="RESTRICTED">제한 공개</option>
  </select>

  <p id="title-error" role="alert"></p>
  <button type="submit">저장</button>
</form>
```

| 줄 | 하는 일 |
| --- | --- |
| `<form action=... method="post">` | 이 안의 값을 POST 요청으로 보낸다 |
| `<label for="title">` | `id="title"`인 입력창의 이름표. 이름표를 눌러도 입력창에 커서가 감 |
| `name="title"` | 서버로 보낼 때 쓰는 **값의 이름**. 서버는 `title=...`로 받음 |
| `type="text"` / `type="date"` | 입력 종류. date면 달력이 뜸 |
| `required` | 비어 있으면 브라우저가 제출을 막음 |
| `maxlength="100"` | 100자까지만 입력 |
| `<select>` `<option value=...>` | 선택지. 화면 글자(`기본 공개`)와 보내는 값(`DEFAULT`)이 다름 |
| `role="alert"` | 오류 문구가 생기면 화면 낭독기가 바로 읽어 줌 |
| `type="submit"` | 누르면 폼 제출 |

> [!CAUTION]
> ==red:required와 maxlength 속성은 편의 기능이지 보안이 아닙니다.== 사용자는 개발자 도구로 이 속성을 지우거나, 아예 폼 없이 요청을 직접 보낼 수 있습니다. 서버(03-1편)와 DB(04-3편)에서 같은 조건을 다시 검사합니다.

`id`와 `name`의 차이도 기억해 둡니다.

| 속성 | 누가 쓰나 | 규칙 |
| --- | --- | --- |
| `id` | 같은 페이지 안의 HTML·CSS·JavaScript | 페이지 안에서 하나뿐 |
| `name` | 서버로 보내는 폼 데이터 | 서버가 받을 이름 |

## 4. CSS는 "어떻게 보이는가"를 적는다

```css
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1a;
}
```

| 부분 | 이름 | 뜻 |
| --- | --- | --- |
| `.page-title` | 선택자 | 어떤 요소에 적용할지 (`class="page-title"`인 요소) |
| `font-size` | 속성 | 무엇을 바꿀지 |
| `24px` | 값 | 얼마로 |

### 선택자 읽기

| 선택자 | 고르는 대상 |
| --- | --- |
| `p` | 모든 `<p>` |
| `.card` | `class="card"`인 요소 |
| `#title` | `id="title"`인 요소 |
| `.card h2` | `.card` **안에 있는** `<h2>` |
| `button:hover` | 마우스를 올린 버튼 |
| `input:focus` | 키보드 포커스가 있는 입력창 |

### 박스 모델

모든 요소는 상자입니다. 안쪽부터 내용 → `padding`(안쪽 여백) → `border`(테두리) → `margin`(바깥 여백)입니다.

```css
.task-card {
  padding: 16px;              /* 글자와 테두리 사이 */
  border: 1px solid #b9b6ac;  /* 테두리 */
  border-radius: 8px;         /* 모서리 둥글게 */
  margin-bottom: 12px;        /* 다음 카드와의 간격 */
}
```

### Flexbox — 가로·세로 배치

```css
.task-card {
  display: flex;                   /* 자식들을 한 줄로 */
  justify-content: space-between;  /* 양 끝으로 벌림 */
  align-items: center;             /* 세로 가운데 */
  gap: 8px;                        /* 자식 사이 간격 */
}
```

업무 카드에서 왼쪽에 제목, 오른쪽에 상태 배지를 두는 전형적인 배치입니다.

### 반응형

```css
.task-list { display: grid; grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .task-list { grid-template-columns: 1fr 1fr; }
}
```

화면 폭이 768px 이상이면 두 칸, 휴대폰에서는 한 칸입니다. 기획서는 조회·상태 변경·건의 제출을 모바일에서도 할 수 있어야 한다고 정합니다.

## 5. Tailwind CSS로 같은 것 읽기

이 프로젝트는 **Tailwind CSS**를 씁니다. CSS 파일에 규칙을 따로 쓰지 않고, 미리 만들어진 짧은 클래스를 HTML에 바로 붙입니다.

```html
<li class="flex items-center justify-between gap-2 rounded-lg border border-stone-300 p-4 mb-3">
  <span class="font-semibold text-stone-900">축제 부스 배치도</span>
  <span class="rounded bg-stone-900 px-2 py-0.5 text-sm text-white">진행 중</span>
</li>
```

| Tailwind 클래스 | 같은 뜻의 CSS |
| --- | --- |
| `flex` | `display: flex` |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `gap-2` | `gap: 0.5rem` (8px) |
| `rounded-lg` | `border-radius: 0.5rem` |
| `border border-stone-300` | 1px 테두리, 회색 |
| `p-4` / `px-2` / `py-0.5` | padding 16px / 좌우 8px / 위아래 2px |
| `mb-3` | margin-bottom 12px |
| `font-semibold` | `font-weight: 600` |
| `text-sm` / `text-white` | 작은 글자 / 흰 글자 |
| `md:grid-cols-2` | 768px 이상에서 두 칸 |

숫자 1칸은 0.25rem(4px)입니다. `p-4`는 4×4px = 16px입니다.

> [!NOTE]
> 상태 배지는 **색만으로** 구분하지 않고 "진행 중"처럼 글자를 함께 씁니다(기획서 접근성 기준). 색을 구분하기 어려운 사람도 상태를 알 수 있습니다.

## 6. 직접 해보기

1. 위 업무 등록 폼을 `test.html`로 저장하고 브라우저로 엽니다.
2. 제목을 비운 채 저장을 눌러 `required`가 막는 것을 확인합니다.
3. 개발자 도구 Elements 탭에서 `required`를 지우고 다시 눌러 봅니다. 이번에는 막히지 않습니다. 이것이 "브라우저 검사는 보안이 아니다"의 실제 모습입니다.

> [!QUIZ]
> `<label>마감일</label><input type="date" name="due_date">`에는 무엇이 빠졌고, 그 결과 누가 불편해지나요?

> [!ANSWER]
> label의 `for`와 input의 `id`가 빠져서 두 요소가 연결되지 않았습니다. 화면 낭독기 사용자는 그 입력창이 "마감일"인지 알 수 없고, 이름표를 눌러도 입력창으로 이동하지 않습니다. `<label for="due">` + `<input id="due" ...>`로 연결해야 합니다.

> [!QUIZ]
> Tailwind 클래스 `flex justify-between p-2 md:p-6`을 말로 풀어 보세요.

> [!ANSWER]
> 자식들을 한 줄로 놓고(`flex`) 양 끝으로 벌리며(`justify-between`), 안쪽 여백은 8px(`p-2`)이지만 화면 폭이 768px 이상이면 24px(`md:p-6`)로 늘린다.

## 학습 경로

[← 01-1 웹은 어떻게 동작하나](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01) · [01-3 JavaScript 읽기 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-03)
