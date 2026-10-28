---
title: "01-3 · JavaScript 읽기"
description: "변수·자료형·객체·배열, 함수와 화살표 함수, 조건문과 반복, map·filter·find, 구조 분해와 전개, 템플릿 문자열, import·export, Promise와 async/await를 학생회 업무 데이터로 한 줄씩 읽는 법을 익힙니다."
order: 3
published: true
duration: 55
tags: [JavaScript, 함수, 배열, 객체, async/await, 모듈]
objectives:
  - const·let, 객체·배열, 점 표기법을 읽는다.
  - 일반 함수와 화살표 함수가 같은 일을 하는 것을 알아본다.
  - map·filter·find·some으로 업무 목록을 바꾸는 코드를 읽는다.
  - 구조 분해·전개·옵셔널 체이닝·?? 연산자를 읽는다.
  - async/await와 try/catch로 DB 요청을 기다리고 실패를 처리하는 코드를 읽는다.
---

## 이 편의 목표

JavaScript를 **처음부터 쓰는 법**이 아니라 **남이 쓴 코드를 읽는 법**을 익힙니다. 02–06 과목의 예제 코드에 나오는 문법만 골랐습니다. 모든 예제는 브라우저 개발자 도구의 Console 탭에 붙여 넣어 바로 실행해 볼 수 있습니다.

## 1. 값과 변수

```js
const termName = "2026 제38대 학생회";   // 글자(string)
let openCount = 3;                        // 숫자(number)
const isActive = true;                    // 참/거짓(boolean)
let assigneeId = null;                    // 일부러 비워 둔 값
let memo;                                 // 아직 아무것도 안 넣음 → undefined

openCount = openCount + 1;   // let은 다시 넣을 수 있음 → 4
// termName = "다른 이름";   // const는 다시 넣으면 오류
```

| 줄 | 읽는 법 |
| --- | --- |
| `const 이름 = 값;` | 이름표를 붙인다. 다시 바꾸지 않음 |
| `let 이름 = 값;` | 나중에 바꿀 수 있는 이름표 |
| `// ...` | 주석. 실행되지 않는 설명 |
| `null` | "없음"이라고 **정해 둔** 값 |
| `undefined` | 아직 아무것도 넣지 않은 상태 |

> [!NOTE]
> 실무 코드는 대부분 `const`를 씁니다. 값이 바뀌어야 할 때만 `let`을 씁니다. `var`는 옛날 문법이라 이 프로젝트에서는 쓰지 않습니다.

## 2. 객체와 배열

```js
const task = {
  id: "t-101",
  title: "축제 부스 배치도",
  status: "IN_PROGRESS",
  assignee: { id: "u-7", name: "김국원" },
  tags: ["축제", "홍보"],
};

task.title;            // "축제 부스 배치도"
task.assignee.name;    // "김국원"   ← 객체 안의 객체
task.tags[0];          // "축제"     ← 배열은 0번부터
task.tags.length;      // 2
task["status"];        // "IN_PROGRESS"  ← 대괄호로도 꺼낼 수 있음
task.status = "DONE";  // const여도 안쪽 값은 바꿀 수 있음
```

- **객체** `{ }`: 이름이 붙은 값의 묶음. `task.title`처럼 **점**(.)으로 꺼냅니다.
- **배열** `[ ]`: 순서가 있는 값의 목록. `tags[0]`처럼 **번호**로 꺼내고, 번호는 0부터 셉니다.

## 3. 함수 — 반복할 동작에 이름 붙이기

```js
function isOverdue(dueDate, today) {
  return dueDate < today;
}

isOverdue("2026-10-01", "2026-10-28");   // true
```

| 부분 | 뜻 |
| --- | --- |
| `function isOverdue` | 함수 이름 |
| `(dueDate, today)` | 받을 값(매개변수) |
| `{ ... }` | 실행할 내용 |
| `return` | 돌려줄 결과. 여기서 함수가 끝남 |

### 화살표 함수

같은 함수를 더 짧게 쓰는 문법입니다. React 코드에서 아주 많이 나옵니다.

```js
const isOverdue = (dueDate, today) => {
  return dueDate < today;
};

// 한 줄이면 중괄호와 return을 생략할 수 있다
const isOverdue2 = (dueDate, today) => dueDate < today;

// 매개변수가 하나면 괄호도 생략 가능
const shout = (text) => text + "!";
```

> [!EXAM]
> `(값들) => 결과` 를 보면 "이 값들을 받아서 결과를 돌려주는 함수"라고 읽습니다. `=>`를 "이면"이 아니라 "~를 받아 ~를 돌려준다"로 읽는 것이 요령입니다.

## 4. 조건문

```js
function statusLabel(status) {
  if (status === "TODO") {
    return "할 일";
  } else if (status === "IN_PROGRESS") {
    return "진행 중";
  } else if (status === "DONE") {
    return "완료";
  }
  return "검토 중";
}

const label = task.status === "DONE" ? "완료" : "미완료";  // 삼항 연산자
```

| 연산자 | 뜻 |
| --- | --- |
| `===` / `!==` | 같다 / 다르다 (자료형까지 비교. `==`는 쓰지 않음) |
| `&&` | 그리고 |
| `\|\|` | 또는 |
| `!` | 아니다 |
| `조건 ? A : B` | 조건이 참이면 A, 아니면 B |

### 참·거짓으로 취급되는 값

`if (값)`에서 `false`, `0`, `""`(빈 글자), `null`, `undefined`, `NaN`은 **거짓**으로 취급되고 나머지는 참입니다.

```js
if (!task.assignee) {
  console.log("담당자 재배정 필요");
}
```

## 5. 배열 다루기 — map, filter, find

React 화면 코드의 절반은 배열을 바꾸는 코드입니다.

```js
const tasks = [
  { id: "t-1", title: "부스 배치도", status: "DONE",        due: "2026-10-20" },
  { id: "t-2", title: "간식 예산",   status: "TODO",        due: "2026-10-25" },
  { id: "t-3", title: "포스터 시안", status: "IN_PROGRESS", due: "2026-11-02" },
];

// filter: 조건에 맞는 것만 남긴 새 배열
const open = tasks.filter((t) => t.status !== "DONE");
// → t-2, t-3

// map: 각 항목을 바꾼 새 배열
const titles = tasks.map((t) => t.title);
// → ["부스 배치도", "간식 예산", "포스터 시안"]

// find: 조건에 맞는 첫 번째 하나 (없으면 undefined)
const poster = tasks.find((t) => t.id === "t-3");

// some: 하나라도 조건에 맞는가
const anyOverdue = tasks.some((t) => t.status !== "DONE" && t.due < "2026-10-28");
// → true (t-2)

// 이어 붙이기: 미완료 업무의 제목만
const openTitles = tasks.filter((t) => t.status !== "DONE").map((t) => t.title);
```

| 메서드 | 돌려주는 것 | 읽는 법 |
| --- | --- | --- |
| `filter(조건)` | 새 배열 (일부) | "~인 것만" |
| `map(변환)` | 새 배열 (같은 개수) | "각각을 ~로 바꿔서" |
| `find(조건)` | 항목 하나 또는 undefined | "~인 첫 번째" |
| `some(조건)` | true/false | "하나라도 ~인가" |
| `every(조건)` | true/false | "모두 ~인가" |
| `length` | 숫자 | 개수 |

원본 `tasks`는 바뀌지 않고 **새 배열**이 만들어진다는 점이 중요합니다. React는 "새 값이 생겼다"를 보고 화면을 다시 그립니다(02-1편).

## 6. 구조 분해와 전개

```js
// 객체 구조 분해: 필요한 값만 꺼내 같은 이름의 변수로
const { title, status } = task;
// title === task.title, status === task.status

// 배열 구조 분해: 순서대로 꺼내기
const [first, second] = tasks;

// 함수 매개변수에서 바로 구조 분해 (React 컴포넌트에서 매일 봄)
function TaskCard({ title, status }) {
  return `${title} (${status})`;
}

// 전개(...): 기존 객체를 펼쳐 놓고 일부만 바꾼 새 객체
const reopened = { ...task, status: "IN_PROGRESS" };

// 배열에 하나 추가한 새 배열
const withNew = [...tasks, { id: "t-4", title: "현수막", status: "TODO", due: "2026-11-10" }];
```

`` `${title} (${status})` ``는 **템플릿 문자열**입니다. 백틱(`` ` ``) 안에서 `${ }` 사이에 변수를 넣으면 그 값이 글자에 끼워집니다.

## 7. 없을지도 모르는 값 다루기

```js
const name = task.assignee?.name;           // assignee가 null이면 오류 대신 undefined
const shown = task.assignee?.name ?? "미배정";  // 왼쪽이 null/undefined면 오른쪽
```

| 문법 | 뜻 |
| --- | --- |
| `a?.b` | a가 없으면 멈추고 undefined. 있으면 a.b |
| `a ?? b` | a가 null·undefined면 b, 아니면 a |
| `a \|\| b` | a가 거짓으로 취급되는 값이면 b (0이나 ""도 b로 바뀌는 점이 ??와 다름) |

## 8. 모듈 — import와 export

코드를 여러 파일로 나눌 때 씁니다.

```js
// lib/task-labels.js
export function statusLabel(status) { /* ... */ }
export const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
export default function formatDue(date) { /* ... */ }
```

```js
// app/tasks/page.js
import formatDue, { statusLabel, STATUSES } from "@/lib/task-labels";
import { createClient } from "@supabase/supabase-js";
```

| 줄 | 읽는 법 |
| --- | --- |
| `export function ...` | 이 함수를 다른 파일에서 쓸 수 있게 내보냄 |
| `export default` | 파일의 대표 하나. 가져올 때 이름을 마음대로 붙임 |
| `import X, { a, b } from "경로"` | 대표는 X로, 나머지는 이름 그대로 가져옴 |
| `"@/lib/..."` | 프로젝트 최상위를 뜻하는 별칭 경로 |
| `"@supabase/supabase-js"` | 설치한 외부 패키지 |

## 9. 기다려야 하는 일 — Promise와 async/await

DB 요청은 시간이 걸립니다. JavaScript는 기다리는 동안 멈추지 않고 "**나중에 결과를 주겠다는 약속**(Promise)"을 먼저 받습니다. `await`는 그 약속이 끝날 때까지 기다리라는 뜻입니다.

```js
async function loadMyTasks(supabase, userId) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, status, due_date")
      .eq("assignee_id", userId)
      .order("due_date");

    if (error) throw error;          // Supabase는 실패를 error에 담아 돌려줌
    return data;                     // 업무 배열
  } catch (err) {
    console.error("업무를 불러오지 못했습니다", err);
    return [];                       // 화면이 깨지지 않게 빈 배열
  } finally {
    console.log("요청 끝");           // 성공·실패와 상관없이 실행
  }
}
```

| 줄 | 읽는 법 |
| --- | --- |
| `async function` | 안에서 `await`를 쓸 수 있는 함수. 이 함수도 Promise를 돌려줌 |
| `await supabase.from(...)...` | DB 결과가 올 때까지 기다림 |
| `.from("tasks")` | tasks 테이블에서 |
| `.select("id, title, ...")` | 이 열들만 |
| `.eq("assignee_id", userId)` | assignee_id가 userId와 같은 행만 |
| `.order("due_date")` | 마감일 순으로 |
| `const { data, error } = ...` | 결과 객체를 구조 분해 |
| `throw error` | 오류를 던져 catch로 보냄 |
| `try { } catch (err) { }` | 실패하면 catch 블록 실행 |
| `finally { }` | 항상 실행 |

> [!CAUTION]
> `await`를 빼먹으면 `data` 대신 **아직 끝나지 않은 Promise**가 들어갑니다. 화면에 `[object Promise]`가 보이거나 `data`가 undefined라면 가장 먼저 `await` 누락을 의심합니다.

## 10. 직접 해보기

Console에 5절의 `tasks` 배열을 붙여 넣고 다음을 한 줄로 써 봅니다.

1. 마감일이 `"2026-11-01"`보다 이른 업무의 제목 배열
2. `status`가 `"TODO"`인 업무가 있는지 (true/false)
3. 모든 업무의 `status`를 `"DONE"`으로 바꾼 **새** 배열 (원본은 그대로)

> [!QUIZ]
> 3번을 한 줄로 쓰고, 왜 `tasks.forEach((t) => { t.status = "DONE"; })`가 React에서 문제가 되는지 말하세요.

> [!ANSWER]
> `const allDone = tasks.map((t) => ({ ...t, status: "DONE" }));`
> `forEach`로 안쪽 값을 직접 바꾸면 **원본 객체가 바뀌고 새 배열이 생기지 않습니다.** React는 이전 값과 새 값이 다른 객체인지로 변화를 알아채므로, 원본을 바꾸면 화면이 갱신되지 않는 버그가 생깁니다. 화살표 함수가 객체를 돌려줄 때는 `({ ... })`처럼 괄호로 감싸야 한다는 점도 함께 기억합니다.

> [!QUIZ]
> `const label = task.assignee?.name ?? "미배정";`에서 `task.assignee`가 `null`이면 `label`은 무엇인가요?

> [!ANSWER]
> `"미배정"`입니다. `task.assignee?.name`이 오류 없이 `undefined`가 되고, `??`가 그 자리를 `"미배정"`으로 채웁니다.

## 학습 경로

[← 01-2 HTML·CSS 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-02) · [01-4 TypeScript 읽기 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-04)
