---
title: "02-5 · Tailwind·접근성·반응형"
description: "Tailwind CSS가 빌드 때 어떻게 CSS를 만드는지, 클래스 이름 규칙과 반응형·상태 접두어, 색 토큰을 한 곳에서 관리하는 법을 익히고, 기획서 12.1절의 접근성(키보드·포커스·label·명도 대비·색 외 표시)과 모바일 기준을 업무 화면에 적용하는 점검표를 만듭니다."
order: 5
published: true
duration: 40
tags: [Tailwind CSS, 접근성, 반응형, 키보드, 명도 대비]
objectives:
  - Tailwind 클래스를 속성·값·접두어로 나눠 읽는다.
  - md:·hover:·focus-visible:·disabled: 접두어가 언제 적용되는지 말한다.
  - 키보드만으로 업무를 등록·상태 변경할 수 있는지 점검하는 항목을 말한다.
  - 상태를 색으로만 구분하면 안 되는 이유와 대안을 말한다.
---

## 1. Tailwind는 어떻게 작동하나

Tailwind CSS는 `p-4`, `text-sm` 같은 **작은 클래스** 수천 개를 미리 정해 둔 도구입니다. 빌드할 때 프로젝트 파일을 훑어 **실제로 쓴 클래스만** 골라 CSS 파일을 만듭니다. 그래서 CSS 파일이 작게 유지됩니다.

```css
/* app/globals.css  (Tailwind v4) */
@import "tailwindcss";

@theme {
  --color-ink: #1d1d1a;
  --color-paper: #f7f6f2;
  --color-muted: #65645e;
  --color-danger: #b42318;
}
```

`@theme`에 색을 정해 두면 `text-ink`, `bg-paper`, `text-danger` 같은 클래스가 생깁니다. 학생회 색을 바꾸고 싶을 때 이 한 곳만 고치면 됩니다.

> [!CAUTION]
> 클래스 이름을 **조립하면** Tailwind가 찾지 못합니다. 빌드는 파일의 글자를 그대로 훑기 때문입니다.
> ```tsx
> // ❌ "bg-" + color 는 빌드 때 보이지 않음
> <span className={`bg-${color}-600`} />
> // ✅ 완성된 이름을 표로 둠
> const badge = { TODO: "bg-stone-200 text-ink", DONE: "bg-ink text-paper" } as const;
> <span className={badge[status]} />
> ```

## 2. 클래스 읽는 법

`md:px-6` = **접두어** `md:` + **속성** `px` + **값** `6`

| 속성 묶음 | 예 | 뜻 |
| --- | --- | --- |
| 여백 | `p-4` `px-2` `mt-3` `gap-2` | padding 16px, 좌우 8px, 위 margin 12px, 간격 8px |
| 크기 | `w-full` `max-w-2xl` `h-10` | 폭 100%, 최대 폭, 높이 40px |
| 배치 | `flex` `grid` `items-center` `justify-between` `grid-cols-2` | Flexbox·Grid |
| 글자 | `text-sm` `font-semibold` `leading-6` `truncate` | 크기, 굵기, 줄 높이, 말줄임 |
| 색 | `text-ink` `bg-paper` `border-stone-300` | 글자·배경·테두리 색 |
| 테두리 | `border` `rounded-lg` | 1px 테두리, 둥근 모서리 |
| 숨김 | `hidden` `sr-only` | 숨김, **화면엔 안 보이지만 낭독기는 읽음** |

| 접두어 | 적용되는 때 |
| --- | --- |
| `sm:` `md:` `lg:` | 화면 폭이 640·768·1024px **이상**일 때 |
| `hover:` | 마우스를 올렸을 때 |
| `focus-visible:` | 키보드로 포커스가 왔을 때 |
| `disabled:` | 비활성화됐을 때 |
| `aria-[invalid=true]:` | 그 aria 속성이 있을 때 |
| `dark:` | 다크 모드일 때 |

Tailwind는 **모바일 먼저**입니다. 접두어 없는 클래스가 휴대폰 기준이고, `md:`부터 넓은 화면을 덧붙입니다.

```tsx
<ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
```

휴대폰 1칸 → 태블릿 2칸 → 데스크톱 3칸.

## 3. 반복되는 모양은 Component로

긴 클래스 목록을 여러 곳에 복사하지 않고, 작은 Component로 묶습니다.

```tsx
// components/ui/button.tsx
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };

const styles = {
  primary: "bg-ink text-paper hover:bg-stone-700",
  ghost: "border border-stone-300 text-ink hover:bg-stone-100",
} as const;

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  return (
    <button
      className={`rounded px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `React.ButtonHTMLAttributes<HTMLButtonElement>` | 일반 `<button>`이 받는 모든 속성(onClick, disabled, type…) |
| `& { variant?: ... }` | 거기에 variant를 더함 |
| `...rest` / `{...rest}` | 나머지 속성을 그대로 `<button>`에 전달 |
| `focus-visible:outline-2` | 키보드 포커스가 오면 테두리 표시 |

## 4. 접근성 — 기획서 12.1절을 화면으로

기획서 기준: ==키보드로 주요 흐름을 완료하고, Form Label·Focus 표시·명도 대비를 확인한다. Editor의 Block 조작에도 키보드 대안을 제공한다.==

| 항목 | 하는 법 | 확인하는 법 |
| --- | --- | --- |
| 키보드 이동 | 진짜 `<button>`·`<a>`·`<input>`을 씀. `<div onClick>` 금지 | Tab으로 모든 조작에 도달하는지 |
| 포커스 표시 | `focus-visible:` 스타일을 지우지 않음 | Tab을 눌렀을 때 위치가 보이는지 |
| label | 모든 입력에 `<label htmlFor>` 또는 `aria-label` | 이름표를 누르면 입력창으로 가는지 |
| 오류 안내 | `role="alert"`, `aria-invalid`, `aria-describedby` | 낭독기가 오류를 읽는지 |
| 명도 대비 | 본문 글자 대비 4.5:1 이상 | 브라우저 개발자 도구의 대비 검사 |
| 색 외 표시 | 상태는 색 + **글자**("진행 중")로 | 흑백 화면에서도 구분되는지 |
| 아이콘 버튼 | `<button aria-label="업무 보관">` | 낭독기가 버튼 이름을 읽는지 |
| 대화상자 | 열리면 포커스를 안으로, Esc로 닫기, 닫으면 원래 버튼으로 | 키보드만으로 열고 닫기 |

```tsx
// 아이콘만 있는 버튼
<button aria-label="업무 보관" className="rounded p-2 hover:bg-stone-100">
  <ArchiveIcon aria-hidden="true" />
</button>

// 눈에는 안 보이지만 낭독기에는 읽히는 설명
<span className="sr-only">마감까지 2일 남음</span>
```

## 5. 반응형 — 무엇을 모바일에서 할 수 있어야 하나

| 기능 | 모바일 | 이유 |
| --- | --- | --- |
| Dashboard·업무 조회 | 필수 | 이동 중 확인 |
| 업무 상태 변경 | 필수 | 행사 현장에서 바로 처리 |
| 건의 제출 | 필수 | 일반 학생 대부분이 휴대폰 |
| 회의록 읽기 | 필수 | |
| 회의록 편집·관리자 설정·새 기수 세팅 | 데스크톱 우선 | 복잡한 편집 |

표가 많은 관리 화면은 휴대폰에서 가로 스크롤 대신 **카드 목록**으로 바꿔 보여 줍니다.

```tsx
<table className="hidden md:table">…</table>        {/* 넓은 화면: 표 */}
<ul className="space-y-2 md:hidden">…</ul>           {/* 휴대폰: 카드 */}
```

## 6. 점검표 (PR마다)

- [ ] Tab만으로 이 화면의 모든 버튼·입력에 도달한다
- [ ] 포커스 위치가 항상 보인다
- [ ] 모든 입력에 label이 있다
- [ ] 오류는 글자로 안내되고 낭독기가 읽는다
- [ ] 상태·필수 표시가 색에만 의존하지 않는다
- [ ] 375px 폭(휴대폰)에서 가로 스크롤이 생기지 않는다
- [ ] 로딩·빈 목록·오류·권한 없음 화면이 있다

> [!QUIZ]
> `<div className="cursor-pointer" onClick={archive}>보관</div>`의 문제 두 가지와 고친 코드를 쓰세요.

> [!ANSWER]
> ① `div`는 Tab으로 포커스가 가지 않아 키보드 사용자가 누를 수 없습니다. ② 낭독기가 버튼으로 인식하지 못합니다. 고친 코드: `<button type="button" onClick={archive} className="rounded px-3 py-1 focus-visible:outline-2">보관</button>`

> [!QUIZ]
> 업무 상태 배지를 빨강(기한 초과)·초록(완료)으로만 구분하면 누가 불편한가요? 어떻게 바꾸나요?

> [!ANSWER]
> 색을 구분하기 어려운 사람, 흑백 인쇄·화면 밝기가 낮은 환경의 사용자가 상태를 알 수 없습니다. 배지 안에 "기한 초과", "완료" 같은 글자를 넣고(필요하면 아이콘도), 색은 보조로만 씁니다.

## 학습 경로

[← 02-4 폼과 화면 상태](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-04) · [03-1 Server Action과 Route Handler →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-01)
