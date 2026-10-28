---
title: "01-3 · JavaScript 읽기"
description: "코드 한 줄을 읽는 기본 규칙부터 자료형·변수·연산자, 문자열·객체·배열, 함수와 화살표 함수, 조건문과 반복문, map·filter·find·reduce, 구조 분해와 전개, import·export, Promise와 async/await까지 학생회 업무 데이터로 한 줄씩 읽는 법을 익힙니다."
order: 3
published: true
duration: 90
tags: [JavaScript, 자료형, 함수, 배열, 객체, 반복문, async/await, 모듈]
objectives:
  - 문·주석·세미콜론·이름 규칙 등 코드 한 줄을 읽는 기본 규칙을 안다.
  - 자료형 다섯 가지와 const·let, 연산자를 읽는다.
  - 문자열·객체·배열을 만들고, 꺼내고, 바꾸는 코드를 읽는다.
  - 일반 함수와 화살표 함수가 같은 일을 하는 것을 알아보고, 함수를 값으로 넘기는 코드를 읽는다.
  - if·삼항·switch 조건문과 for·for...of 반복문을 읽는다.
  - map·filter·find·some·reduce로 업무 목록을 바꾸는 코드를 읽는다.
  - 구조 분해·전개·옵셔널 체이닝·?? 연산자를 읽는다.
  - async/await와 try/catch로 DB 요청을 기다리고 실패를 처리하는 코드를 읽는다.
---

## 이 편의 목표

JavaScript를 **처음부터 쓰는 법**보다 **남이 쓴 코드를 읽는 법**을 먼저 익힙니다. 02–06 과목의 예제 코드에 나오는 문법을 골랐고, 프로그래밍을 처음 하는 사람도 따라올 수 있도록 가장 기초적인 규칙부터 시작합니다.

> [!NOTE]
> 이 편에서는 학생회 업무 관리 서비스의 데이터를 예로 씁니다. **업무(task)** 는 제목·상태·담당자·마감일을 가진 일 하나이고, 상태는 `"TODO"`(할 일), `"IN_PROGRESS"`(진행 중), `"REVIEW"`(검토 중), `"DONE"`(완료) 중 하나입니다.

### 학습 흐름

| 순서 | 내용 | 한 줄 요약 |
| --- | --- | --- |
| 0 | 실습 준비와 읽는 규칙 | 코드는 위에서 아래로, 한 문장씩 실행된다 |
| 1–3 | 값·변수·연산자 | 값에 이름을 붙이고 계산한다 |
| 4–6 | 문자열·객체·배열 | 값을 묶어서 다룬다 |
| 7 | 함수 | 동작에 이름을 붙인다 |
| 8–9 | 조건문·반복문 | 경우를 나누고 되풀이한다 |
| 10 | 배열 메서드 | React 화면 코드의 핵심 |
| 11–12 | 구조 분해·전개·빈 값 처리 | 짧게 꺼내고, 안전하게 꺼낸다 |
| 13–14 | 모듈·비동기 | 파일을 나누고, DB를 기다린다 |
| 15 | 직접 해보기 | 배운 문법을 섞어 쓴다 |

---

## 0. 실습 준비와 코드를 읽는 기본 규칙

### 0-1. 브라우저 Console 열기

설치할 것은 없습니다. 크롬이나 엣지에서 아무 페이지나 열고 **F12**(맥은 `⌥ ⌘ I`)를 누른 뒤 **Console** 탭을 고릅니다. `>` 표시 옆에 코드를 쓰고 Enter를 누르면 바로 실행됩니다.

```js
console.log("안녕하세요");   // Console에 "안녕하세요"가 찍힌다
1 + 2                       // 3
```

`console.log(값)`은 **괄호 안의 값을 Console에 출력**하는 명령입니다. 코드가 어떻게 돌아가는지 볼 때 가장 많이 쓰므로, 아래 예제에서 결과가 궁금하면 언제든 `console.log(...)`로 감싸 보세요.

> [!CAUTION]
> Console에서 `const`로 만든 이름을 **같은 이름으로 다시 만들면** "has already been declared" 오류가 납니다. 예제를 여러 번 붙여 넣을 때는 페이지를 새로고침(F5)하고 다시 시작하세요.

### 0-2. 한 줄을 읽는 규칙

```js
// 학생회 이름을 저장하고 출력한다
const termName = "2026 제38대 학생회";
console.log(termName);
```

| 규칙 | 설명 |
| --- | --- |
| **위에서 아래로** | 코드는 첫 줄부터 차례대로 한 문장씩 실행됩니다. |
| **문(statement)** | 실행되는 한 단위. 보통 한 줄에 하나씩 쓰고 끝에 `;`를 붙입니다. `;`는 생략해도 대부분 동작하지만, 이 프로젝트는 붙이는 쪽으로 씁니다. |
| **주석** | `//` 뒤는 그 줄 끝까지, `/* ... */` 사이는 여러 줄이 실행되지 않는 설명입니다. |
| **대소문자 구분** | `termName`과 `termname`은 서로 다른 이름입니다. |
| **들여쓰기** | 실행에는 영향이 없지만, `{ }` 안쪽을 한 단계 들여 써서 "이 안에 속한다"를 보여 줍니다. |
| **이름 짓기** | 변수·함수 이름은 `openCount`처럼 첫 단어는 소문자, 다음 단어부터 첫 글자만 대문자(camelCase)로 씁니다. 숫자로 시작할 수 없고, 공백·`-`를 쓸 수 없습니다. |

### 0-3. 괄호 세 종류

처음 코드를 보면 괄호가 많아 어지럽습니다. 모양마다 하는 일이 정해져 있습니다.

| 괄호 | 이름 | 주로 하는 일 | 예 |
| --- | --- | --- | --- |
| `( )` | 소괄호 | 함수 호출·매개변수, 조건, 계산 순서 | `console.log(x)`, `if (x > 0)`, `(1 + 2) * 3` |
| `{ }` | 중괄호 | 코드 묶음(블록), 객체 | `if (...) { ... }`, `{ id: "t-1" }` |
| `[ ]` | 대괄호 | 배열, 번호나 이름으로 꺼내기 | `["축제", "홍보"]`, `tags[0]` |

괄호는 항상 **여는 것과 닫는 것이 짝**을 이룹니다. 편집기(VS Code)는 커서를 괄호 옆에 두면 짝을 표시해 주므로, 긴 코드는 짝부터 찾으면 구조가 보입니다.

---

## 1. 값과 자료형

프로그램은 **값**을 다룹니다. 값마다 종류(자료형)가 있고, 종류에 따라 할 수 있는 일이 다릅니다.

```js
"축제 부스 배치도"   // string  — 글자
3                   // number  — 숫자
true                // boolean — 참/거짓
null                // null    — "없음"이라고 정해 둔 값
undefined           // undefined — 아직 아무것도 넣지 않은 상태
```

| 자료형 | 모양 | 예 | 쓰는 곳 |
| --- | --- | --- | --- |
| string | 따옴표로 감싼 글자 | `"할 일"`, `'t-101'`, `` `안녕` `` | 제목, 이메일, 상태 값 |
| number | 숫자 그대로 | `3`, `-1`, `3.14` | 개수, 예산, 순서 |
| boolean | `true` 또는 `false` | `true` | 완료 여부, 권한 여부 |
| null | `null` | `null` | 담당자가 없음 |
| undefined | `undefined` | `undefined` | 값을 넣지 않았거나 없는 속성 |

### 1-1. 글자(string)는 따옴표로 감싼다

```js
"큰따옴표"
'작은따옴표'
`백틱(템플릿 문자열)`
```

세 가지 모두 글자입니다. 큰따옴표와 작은따옴표는 똑같고, 백틱은 4절에서 볼 **끼워 넣기**가 됩니다.

> [!TRAP]
> 따옴표가 있는지 없는지가 자료형을 바꿉니다.
>
> ```js
> 3      // 숫자 3
> "3"    // 글자 "3"
> "3" + 1   // "31"  ← 글자에 더하면 이어 붙이기
> 3 + 1     // 4
> ```
>
> 폼 입력값은 숫자를 써도 **항상 글자**로 들어옵니다. 계산하기 전에 `Number("3")`으로 숫자로 바꿔야 합니다.

### 1-2. 자료형 확인하기 — typeof

```js
typeof "축제"      // "string"
typeof 3           // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"   ← JavaScript의 오래된 실수. null은 따로 기억
typeof [1, 2]      // "object"   ← 배열은 Array.isArray([1, 2])로 확인
```

### 1-3. 숫자가 아닌 숫자 — NaN

```js
Number("3")        // 3
Number("세 개")     // NaN  (Not a Number, 숫자로 바꿀 수 없음)
Number("")         // 0    ← 빈 글자는 0이 된다. 주의
```

---

## 2. 변수 — 값에 이름표 붙이기

**변수**는 값에 붙인 이름표입니다. 이름을 한 번 붙여 두면 그 뒤로는 이름으로 값을 부릅니다.

```js
const termName = "2026 제38대 학생회";   // 글자
let openCount = 3;                        // 숫자
const isActive = true;                    // 참/거짓
let assigneeId = null;                    // 일부러 비워 둔 값
let memo;                                 // 아무것도 안 넣음 → undefined

openCount = openCount + 1;   // let은 다시 넣을 수 있음 → 4
// termName = "다른 이름";   // const는 다시 넣으면 오류
```

| 줄 | 읽는 법 |
| --- | --- |
| `const 이름 = 값;` | 이름표를 붙인다. 다시 바꾸지 않음 |
| `let 이름 = 값;` | 나중에 바꿀 수 있는 이름표 |
| `=` | "같다"가 아니라 **오른쪽 값을 왼쪽 이름에 넣는다** |
| `null` | "없음"이라고 **정해 둔** 값 |
| `undefined` | 아직 아무것도 넣지 않은 상태 |

> [!DEFINITION]
> `=`는 **대입**입니다. `openCount = openCount + 1`은 수학식으로 보면 말이 안 되지만, "지금 openCount 값(3)에 1을 더한 결과(4)를 다시 openCount에 넣는다"로 읽으면 됩니다. 오른쪽을 먼저 계산하고, 그 결과를 왼쪽에 넣습니다.

> [!NOTE]
> 실무 코드는 대부분 `const`를 씁니다. 값이 바뀌어야 할 때만 `let`을 씁니다. `var`는 옛날 문법이라 이 프로젝트에서는 쓰지 않습니다.

### 2-1. 변수는 만든 블록 안에서만 보인다

```js
const today = "2026-10-28";

if (true) {
  const message = "마감 확인";
  console.log(today);     // ✅ 바깥 변수는 안에서 보임
  console.log(message);   // ✅
}

console.log(message);     // ❌ 오류: message is not defined
```

`{ }` 안에서 만든 `const`·`let`은 그 중괄호 안에서만 쓸 수 있습니다. 이 범위를 **스코프(scope)** 라고 합니다. "is not defined" 오류가 나면 이름 오타이거나, 다른 블록에서 만든 변수를 쓰고 있는 경우입니다.

---

## 3. 연산자 — 값으로 계산하기

### 3-1. 산술 연산자

```js
10 + 3    // 13
10 - 3    // 7
10 * 3    // 30
10 / 3    // 3.3333...
10 % 3    // 1     ← 나눈 나머지
2 ** 3    // 8     ← 거듭제곱
```

`%`(나머지)는 "짝수인가"(`n % 2 === 0`)나 "n개마다 한 번"을 셀 때 자주 봅니다.

### 3-2. 줄여 쓰는 대입

```js
let count = 0;
count += 5;   // count = count + 5  → 5
count -= 2;   // count = count - 2  → 3
count++;      // count = count + 1  → 4
count--;      // count = count - 1  → 3
```

### 3-3. 비교 연산자 — 결과는 항상 true/false

```js
3 > 2              // true
3 >= 3             // true
"TODO" === "TODO"  // true   같다
"TODO" !== "DONE"  // true   다르다
"2026-10-20" < "2026-10-25"   // true  ← 글자도 사전 순서로 비교된다
```

| 연산자 | 뜻 |
| --- | --- |
| `===` / `!==` | 같다 / 다르다 (자료형까지 비교) |
| `>` `<` `>=` `<=` | 크다 / 작다 / 크거나 같다 / 작거나 같다 |

> [!TRAP]
> `==`(등호 두 개)는 자료형이 달라도 억지로 맞춰서 비교합니다.
>
> ```js
> 3 == "3"    // true   ← 숫자와 글자인데 같다고 나옴
> 3 === "3"   // false  ← 자료형이 다르므로 다름
> 0 == ""     // true   ← 이런 결과 때문에 쓰지 않는다
> ```
>
> 이 프로젝트에서는 항상 `===`와 `!==`만 씁니다. `=`(대입), `===`(비교)를 헷갈려 `if (status = "DONE")`처럼 쓰면 비교가 아니라 대입이 되어 항상 참이 되므로 주의합니다.

> [!NOTE]
> 날짜를 `"2026-10-20"`처럼 **연-월-일, 두 자리 숫자**로 쓰면 글자 비교만으로 날짜 앞뒤를 알 수 있습니다. DB에서 오는 날짜도 이 모양이라 예제에서 자주 씁니다. `"2026-9-5"`처럼 자리 수가 다르면 순서가 틀어집니다.

### 3-4. 논리 연산자 — 조건 여러 개 묶기

```js
const isDone = false;
const isOverdue = true;

isOverdue && !isDone   // true   "마감이 지났고 그리고 완료가 아니다"
isDone || isOverdue    // true   "완료이거나 또는 마감이 지났다"
!isDone                // true   "완료가 아니다"
```

| 연산자 | 뜻 | 참이 되는 때 |
| --- | --- | --- |
| `A && B` | 그리고 | 둘 다 참 |
| `A \|\| B` | 또는 | 하나라도 참 |
| `!A` | 아니다 | A가 거짓 |

---

## 4. 문자열 다루기

### 4-1. 템플릿 문자열 — 글자에 값 끼워 넣기

```js
const title = "포스터 시안";
const days = 3;

"업무 " + title + "의 마감까지 " + days + "일"   // 옛날 방식: + 로 이어 붙이기
`업무 ${title}의 마감까지 ${days}일`             // 템플릿 문자열
// 둘 다 "업무 포스터 시안의 마감까지 3일"
```

**백틱**(`` ` ``, 키보드 숫자 1 왼쪽) 안에서 `${ }` 사이에 변수나 계산식을 넣으면 그 값이 글자에 끼워집니다. `${days + 1}`처럼 계산도 됩니다.

### 4-2. 자주 쓰는 문자열 기능

글자 뒤에 `.`을 찍고 기능 이름을 쓰면 그 글자로 할 수 있는 일을 부릅니다. 이렇게 값에 딸린 함수를 **메서드**라고 부릅니다.

```js
const email = "  Kim@HANYANG.ac.kr ";

email.length                 // 20   글자 수 (공백 포함)
email.trim()                 // "Kim@HANYANG.ac.kr"  앞뒤 공백 제거
email.trim().toLowerCase()   // "kim@hanyang.ac.kr"  소문자로
email.includes("@")          // true  들어 있는가
"축제,홍보,예산".split(",")    // ["축제", "홍보", "예산"]  잘라서 배열로
"2026-10-28".slice(0, 4)     // "2026"  0번째부터 4번째 앞까지
"t-101".startsWith("t-")     // true
```

> [!EXAMPLE]
> 회원가입 폼에서 이메일을 받으면 보통 `email.trim().toLowerCase()`로 정리한 뒤 저장합니다. 사용자가 실수로 넣은 공백이나 대문자 때문에 같은 사람이 두 번 가입되는 일을 막습니다. 메서드는 이렇게 `.`으로 **이어서** 부를 수 있고, 왼쪽부터 차례로 실행됩니다.

---

## 5. 객체 — 이름 붙은 값의 묶음

업무 하나에는 제목, 상태, 담당자 같은 정보가 여러 개 있습니다. 이것을 한 덩어리로 묶은 것이 **객체**입니다.

```js
const task = {
  id: "t-101",
  title: "축제 부스 배치도",
  status: "IN_PROGRESS",
  assignee: { id: "u-7", name: "김국원" },
  tags: ["축제", "홍보"],
};
```

| 부분 | 이름 | 뜻 |
| --- | --- | --- |
| `{ ... }` | 객체 | 묶음 전체 |
| `id`, `title` | 키(key) 또는 속성 이름 | 값에 붙은 이름 |
| `"t-101"` | 값(value) | 그 이름에 들어 있는 값 |
| `id: "t-101"` | 속성(property) | 키와 값 한 쌍. 쌍끼리는 `,`로 구분 |

값에는 글자·숫자뿐 아니라 **객체(assignee)나 배열(tags)도** 들어갈 수 있습니다.

### 5-1. 꺼내기

```js
task.title;            // "축제 부스 배치도"
task.assignee.name;    // "김국원"   ← 객체 안의 객체: 점을 이어서
task.tags[0];          // "축제"     ← 배열은 번호로, 0번부터
task["status"];        // "IN_PROGRESS"  ← 대괄호와 글자로도 꺼낼 수 있음
task.memo;             // undefined  ← 없는 속성은 오류 대신 undefined

const key = "title";
task[key];             // "축제 부스 배치도"  ← 키가 변수에 들어 있을 때는 대괄호
```

`task.assignee.name`은 **왼쪽부터 한 단계씩** 읽습니다. "task의 assignee의 name".

### 5-2. 추가·수정·삭제

```js
task.status = "DONE";          // 있는 속성 수정
task.dueDate = "2026-10-30";   // 없는 속성은 새로 생김
delete task.dueDate;           // 속성 삭제
```

> [!NOTE]
> `task`를 `const`로 만들었는데 안쪽 값을 바꿀 수 있는 이유: `const`가 막는 것은 **이름표를 다른 객체에 다시 붙이는 것**(`task = {...}`)뿐입니다. 이름표가 가리키는 객체의 안쪽은 바꿀 수 있습니다. 하지만 React에서는 안쪽을 직접 바꾸지 않고 **새 객체를 만드는 방식**(11절)을 씁니다.

### 5-3. 줄여 쓰는 속성

```js
const title = "현수막";
const status = "TODO";

const a = { title: title, status: status };
const b = { title, status };   // 키와 변수 이름이 같으면 한 번만 써도 됨
// a와 b는 같은 모양
```

### 5-4. 객체 안을 한꺼번에 보기

```js
Object.keys(task);     // ["id", "title", "status", "assignee", "tags"]
Object.values(task);   // ["t-101", "축제 부스 배치도", ...]
Object.entries({ TODO: 2, DONE: 5 });   // [["TODO", 2], ["DONE", 5]]
```

---

## 6. 배열 — 순서가 있는 값의 목록

```js
const tags = ["축제", "홍보", "예산"];

tags[0];                 // "축제"   ← 첫 번째는 0번
tags[2];                 // "예산"
tags[3];                 // undefined  ← 없는 번호
tags.length;             // 3        개수
tags[tags.length - 1];   // "예산"   마지막 항목 (개수 - 1)
tags.includes("홍보");    // true     들어 있는가
tags.indexOf("예산");     // 2        몇 번째인가 (없으면 -1)
tags.join(" / ");        // "축제 / 홍보 / 예산"  하나의 글자로 합치기
```

> [!DEFINITION]
> 배열의 번호를 **인덱스(index)** 라고 합니다. 사람은 1부터 세지만 JavaScript는 **0부터** 셉니다. 그래서 항목이 3개인 배열의 마지막 인덱스는 2이고, 항상 `length - 1`입니다.

### 6-1. 원본을 바꾸는 메서드

```js
const list = ["축제"];
list.push("홍보");      // 끝에 추가 → ["축제", "홍보"]
list.pop();            // 끝에서 꺼냄 → ["축제"]
list.unshift("예산");   // 앞에 추가 → ["예산", "축제"]
```

이 메서드들은 **원래 배열 자체를 바꿉니다.** 평범한 JavaScript에서는 괜찮지만, React 화면 데이터(state)에는 쓰지 않습니다. React에서는 11절의 전개 문법으로 **새 배열**을 만듭니다.

### 6-2. 객체가 들어 있는 배열

DB에서 가져온 업무 목록은 거의 항상 **객체의 배열**입니다. 10절부터 계속 이 배열을 씁니다.

```js
const tasks = [
  { id: "t-1", title: "부스 배치도", status: "DONE",        due: "2026-10-20", budget: 0 },
  { id: "t-2", title: "간식 예산",   status: "TODO",        due: "2026-10-25", budget: 150000 },
  { id: "t-3", title: "포스터 시안", status: "IN_PROGRESS", due: "2026-11-02", budget: 30000 },
];

tasks[1].title;    // "간식 예산"   ← 1번 항목(객체)의 title
tasks.length;      // 3
```

`tasks[1].title`도 왼쪽부터 읽습니다. "tasks의 1번 항목의 title".

---

## 7. 함수 — 반복할 동작에 이름 붙이기

같은 계산을 여러 곳에서 해야 하면, 그 동작을 묶어서 이름을 붙입니다. 이것이 **함수**입니다.

```js
// 1) 함수를 만든다 (정의)
function isOverdue(dueDate, today) {
  return dueDate < today;
}

// 2) 함수를 쓴다 (호출)
isOverdue("2026-10-01", "2026-10-28");   // true
isOverdue("2026-11-05", "2026-10-28");   // false
```

| 부분 | 뜻 |
| --- | --- |
| `function isOverdue` | 함수 이름 |
| `(dueDate, today)` | 받을 값의 이름(**매개변수**) |
| `{ ... }` | 실행할 내용(함수 본문) |
| `return` | 돌려줄 결과. 여기서 함수가 끝남 |
| `isOverdue("2026-10-01", "2026-10-28")` | 호출. 괄호 안 값(**인자**)이 매개변수에 차례로 들어감 |

호출하는 순간 `dueDate`에 `"2026-10-01"`이, `today`에 `"2026-10-28"`이 들어가고, 본문이 실행되어 `true`가 돌아옵니다. **호출식 전체가 돌려받은 값으로 바뀐다**고 생각하면 됩니다.

```js
const late = isOverdue("2026-10-01", "2026-10-28");   // late === true
```

### 7-1. return이 없으면 undefined

```js
function logTitle(task) {
  console.log(task.title);   // 출력만 하고 돌려주지 않음
}

const result = logTitle({ title: "현수막" });   // Console에 "현수막"
result;                                         // undefined
```

> [!TRAP]
> `console.log`는 **화면에 보여 줄 뿐** 값을 돌려주지 않습니다. 함수 결과를 다른 곳에서 써야 한다면 반드시 `return`해야 합니다. 또 `return` 아래에 있는 줄은 실행되지 않습니다.

### 7-2. 매개변수 기본값

```js
function greet(name = "학생회원") {
  return `${name}님, 안녕하세요`;
}

greet("김국원");   // "김국원님, 안녕하세요"
greet();          // "학생회원님, 안녕하세요"  ← 인자가 없으면 기본값
```

### 7-3. 화살표 함수

같은 함수를 더 짧게 쓰는 문법입니다. React 코드에서 아주 많이 나옵니다.

```js
const isOverdue = (dueDate, today) => {
  return dueDate < today;
};

// 본문이 한 줄이면 중괄호와 return을 생략할 수 있다
const isOverdue2 = (dueDate, today) => dueDate < today;

// 매개변수가 하나면 괄호도 생략 가능
const shout = text => text + "!";

// 매개변수가 없으면 빈 괄호
const now = () => "2026-10-28";
```

| 모양 | 읽는 법 |
| --- | --- |
| `(a, b) => { return a + b; }` | a, b를 받아 본문을 실행하고 return한 값을 돌려줌 |
| `(a, b) => a + b` | a, b를 받아 `a + b`를 바로 돌려줌 |
| `a => a * 2` | a 하나를 받아 두 배를 돌려줌 |
| `() => ...` | 아무것도 받지 않음 |

> [!EXAM]
> `(값들) => 결과` 를 보면 "이 값들을 받아서 결과를 돌려주는 함수"라고 읽습니다. `=>`를 "이면"이 아니라 "~를 받아 ~를 돌려준다"로 읽는 것이 요령입니다.

> [!TRAP]
> 화살표 함수가 **객체를 바로 돌려줄 때**는 소괄호로 감싸야 합니다.
>
> ```js
> const make = (title) => { title: title };     // ❌ { }를 함수 본문으로 읽어 undefined
> const make2 = (title) => ({ title: title });  // ✅ { title: "..." }을 돌려줌
> ```

### 7-4. 함수를 값으로 넘기기 — 콜백

JavaScript에서는 함수도 값이라서 **다른 함수에 인자로 넘길 수** 있습니다. 넘겨진 함수를 **콜백(callback)** 이라고 부릅니다. 10절의 `map`, `filter`가 모두 이 방식이라 꼭 알아야 합니다.

```js
function runForEach(list, action) {
  for (const item of list) {
    action(item);           // 넘겨받은 함수를 항목마다 호출
  }
}

runForEach(["축제", "홍보"], (tag) => console.log(`#${tag}`));
// #축제
// #홍보
```

`(tag) => console.log(...)`라는 함수를 **만들어서 그대로 넘겼습니다.** `runForEach`가 그 함수를 항목마다 대신 불러 줍니다. 버튼 클릭 처리 `onClick={() => ...}`(02-1편)도 같은 원리입니다. "눌리면 이 함수를 불러 줘"라고 함수를 맡겨 두는 것입니다.

---

## 8. 조건문 — 경우에 따라 다르게

### 8-1. if / else if / else

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

statusLabel("DONE");     // "완료"
statusLabel("REVIEW");   // "검토 중"  ← 위 조건에 다 안 맞아서 마지막 줄
```

위에서부터 조건을 하나씩 확인하고, **처음으로 참인 블록 하나만** 실행합니다. 하나도 참이 아니면 `else` 블록(또는 그 아래 줄)으로 갑니다.

### 8-2. 일찍 돌려주기 (early return)

실무 코드에서는 예외 상황을 먼저 걸러 내고 `return`하는 모양을 자주 봅니다.

```js
function canEdit(user, task) {
  if (!user) return false;                         // 로그인 안 함 → 바로 끝
  if (user.role === "EXECUTIVE") return true;      // 집행부는 무조건 가능
  return task.assigneeId === user.id;              // 나머지는 담당자만
}
```

중괄호 없이 `if (조건) return 값;` 한 줄로 쓰는 것도 같은 뜻입니다. 위에서부터 "이 경우는 여기서 끝"을 하나씩 지우며 읽으면 됩니다.

### 8-3. 삼항 연산자 — 한 줄짜리 if

```js
const label = task.status === "DONE" ? "완료" : "미완료";
```

`조건 ? 참일 때 값 : 거짓일 때 값`. if문과 달리 **값 하나를 만들어 내는 식**이라서 변수에 바로 넣거나 JSX 안에 쓸 수 있습니다.

```js
// 같은 뜻의 if문
let label2;
if (task.status === "DONE") {
  label2 = "완료";
} else {
  label2 = "미완료";
}
```

### 8-4. switch — 값 하나를 여러 경우와 비교

```js
function statusColor(status) {
  switch (status) {
    case "TODO":        return "gray";
    case "IN_PROGRESS": return "blue";
    case "REVIEW":      return "orange";
    case "DONE":        return "green";
    default:            return "black";   // 어느 case에도 안 맞을 때
  }
}
```

`return` 대신 다른 일을 할 때는 각 case 끝에 `break;`를 써서 멈춰야 합니다. 빠뜨리면 다음 case까지 이어서 실행됩니다.

### 8-5. 참·거짓으로 취급되는 값

`if (값)`처럼 true/false가 아닌 값을 조건에 넣으면, 아래 여섯 가지는 **거짓**으로, 나머지는 모두 **참**으로 취급됩니다.

| 거짓으로 취급 (falsy) | 참으로 취급 (truthy) 예 |
| --- | --- |
| `false`, `0`, `""`(빈 글자), `null`, `undefined`, `NaN` | `true`, `1`, `"0"`, `" "`, `[]`, `{}` |

```js
if (!task.assignee) {
  console.log("담당자 재배정 필요");   // assignee가 null이면 실행
}

const keyword = "";
if (keyword) {
  console.log("검색");   // 빈 글자는 거짓이라 실행되지 않음
}
```

> [!TRAP]
> 빈 배열 `[]`과 빈 객체 `{}`는 **참**입니다. "목록이 비었는가"는 `if (tasks.length === 0)`으로 확인해야 합니다.

---

## 9. 반복문 — 같은 일을 여러 번

### 9-1. for — 번호를 세며 반복

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// 0
// 1
// 2
```

| 부분 | 뜻 |
| --- | --- |
| `let i = 0` | 시작: i를 0으로 |
| `i < 3` | 이 조건이 참인 동안 반복 |
| `i++` | 한 바퀴 끝날 때마다 i를 1 늘림 |

순서: `i = 0` → 조건 확인(0 < 3 참) → 본문 → `i++`(1) → 조건 확인 → … → `i`가 3이 되면 조건이 거짓이라 끝.

배열의 모든 항목을 번호로 돌 때는 이렇게 씁니다.

```js
for (let i = 0; i < tasks.length; i++) {
  console.log(`${i + 1}번: ${tasks[i].title}`);
}
// 1번: 부스 배치도
// 2번: 간식 예산
// 3번: 포스터 시안
```

### 9-2. for...of — 항목을 하나씩 꺼내며 반복

번호가 필요 없으면 이쪽이 더 읽기 쉽습니다.

```js
for (const task of tasks) {
  console.log(task.title);
}
```

"tasks의 항목을 하나씩 `task`라는 이름으로 꺼내서 본문을 실행한다"로 읽습니다.

### 9-3. 반복하며 값 모으기

```js
let total = 0;
for (const task of tasks) {
  total += task.budget;
}
total;   // 180000

const urgent = [];
for (const task of tasks) {
  if (task.status !== "DONE" && task.due < "2026-10-28") {
    urgent.push(task.title);
  }
}
urgent;   // ["간식 예산"]
```

### 9-4. break와 continue

```js
for (const task of tasks) {
  if (task.status === "DONE") continue;   // 이번 바퀴는 건너뛰고 다음으로
  if (task.budget > 100000) {
    console.log("고액 예산 발견:", task.title);
    break;                                // 반복 자체를 끝냄
  }
}
```

### 9-5. forEach — 배열의 반복 메서드

```js
tasks.forEach((task, index) => {
  console.log(index, task.title);
});
```

`forEach`는 콜백(7-4절)을 항목마다 불러 줍니다. 콜백의 두 번째 매개변수에는 인덱스가 들어옵니다. 돌려주는 값은 없습니다.

> [!NOTE]
> React 화면 코드에서는 `for`문보다 다음 절의 `map`·`filter`를 훨씬 많이 씁니다. `for`문은 값을 모으려면 빈 배열을 만들고 `push`해야 하지만, `map`·`filter`는 **새 배열을 바로 돌려주는 식**이라 JSX 안에 그대로 쓸 수 있기 때문입니다. 위 `urgent` 계산을 10절의 방식으로 쓰면 한 줄이 됩니다.

---

## 10. 배열 다루기 — map, filter, find

React 화면 코드의 절반은 배열을 바꾸는 코드입니다. 6-2절의 `tasks` 배열을 그대로 씁니다.

```js
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

// every: 모두 조건에 맞는가
const allDone = tasks.every((t) => t.status === "DONE");
// → false
```

| 메서드 | 돌려주는 것 | 읽는 법 |
| --- | --- | --- |
| `filter(조건)` | 새 배열 (일부) | "~인 것만" |
| `map(변환)` | 새 배열 (같은 개수) | "각각을 ~로 바꿔서" |
| `find(조건)` | 항목 하나 또는 undefined | "~인 첫 번째" |
| `findIndex(조건)` | 번호 또는 -1 | "~인 첫 번째가 몇 번인가" |
| `some(조건)` | true/false | "하나라도 ~인가" |
| `every(조건)` | true/false | "모두 ~인가" |
| `reduce(합치기, 시작값)` | 값 하나 | "모두 합쳐서 하나로" |

### 10-1. 한 단계씩 따라가 보기

`tasks.filter((t) => t.status !== "DONE")`이 실제로 하는 일을 펼쳐 보면 이렇습니다.

| 차례 | `t`에 들어온 항목 | `t.status !== "DONE"` | 결과 배열에 |
| --- | --- | --- | --- |
| 1 | t-1 부스 배치도 | `"DONE" !== "DONE"` → false | 넣지 않음 |
| 2 | t-2 간식 예산 | `"TODO" !== "DONE"` → true | 넣음 |
| 3 | t-3 포스터 시안 | `"IN_PROGRESS" !== "DONE"` → true | 넣음 |

`filter`는 콜백을 항목마다 한 번씩 불러서 **true를 돌려준 항목만** 새 배열에 담습니다. `t`라는 이름은 마음대로 지은 매개변수 이름이고, `task`로 써도 똑같습니다.

`map`은 콜백이 **돌려준 값을 그대로** 새 배열에 담습니다.

```js
tasks.map((t) => t.budget * 2);              // [0, 300000, 60000]
tasks.map((t) => `${t.title} (${t.due})`);   // ["부스 배치도 (2026-10-20)", ...]
tasks.map((t) => ({ id: t.id, label: t.title }));   // 모양을 바꾼 객체 배열
```

### 10-2. 이어 붙이기 (체이닝)

```js
const openTitles = tasks
  .filter((t) => t.status !== "DONE")   // 1단계: [t-2, t-3]
  .map((t) => t.title);                 // 2단계: ["간식 예산", "포스터 시안"]
```

메서드가 배열을 돌려주므로 그 뒤에 바로 다음 메서드를 붙일 수 있습니다. **위에서 아래로, 단계마다 배열이 어떻게 바뀌는지** 주석을 달며 읽으면 길어도 어렵지 않습니다.

### 10-3. 정렬 — sort

```js
const byDue = [...tasks].sort((a, b) => a.due.localeCompare(b.due));
// 마감일 빠른 순: t-1, t-2, t-3

const byBudget = [...tasks].sort((a, b) => b.budget - a.budget);
// 예산 큰 순: t-2, t-3, t-1
```

`sort`의 콜백은 두 항목 `a`, `b`를 받아 **음수면 a를 앞에, 양수면 b를 앞에** 둡니다. 숫자는 `a - b`(작은 순)·`b - a`(큰 순), 글자는 `a.localeCompare(b)`로 씁니다.

> [!CAUTION]
> `sort`는 다른 메서드와 달리 **원본 배열을 바꿉니다.** 그래서 `[...tasks]`로 복사본을 먼저 만든 뒤 정렬합니다(복사는 11절). 최신 브라우저에서는 원본을 두고 새 배열을 돌려주는 `tasks.toSorted(...)`도 쓸 수 있습니다.

### 10-4. reduce — 모두 합쳐 값 하나로

```js
const total = tasks.reduce((sum, t) => sum + t.budget, 0);
// 180000
```

| 차례 | `sum`(지금까지 합) | `t.budget` | 돌려준 값 → 다음 `sum` |
| --- | --- | --- | --- |
| 시작 | 0 (두 번째 인자) | | |
| 1 | 0 | 0 | 0 |
| 2 | 0 | 150000 | 150000 |
| 3 | 150000 | 30000 | 180000 |

상태별 개수 세기처럼 객체로 모을 수도 있습니다.

```js
const counts = tasks.reduce((acc, t) => {
  acc[t.status] = (acc[t.status] ?? 0) + 1;
  return acc;
}, {});
// { DONE: 1, TODO: 1, IN_PROGRESS: 1 }
```

`reduce`는 처음엔 어렵게 보이므로, 표처럼 **매 차례 첫 번째 매개변수가 어떻게 바뀌는지** 적어 보는 것이 가장 빠릅니다.

### 10-5. 원본은 그대로, 새 배열이 생긴다

`map`·`filter`·`find`·`some`·`every`·`reduce`는 원본 `tasks`를 바꾸지 않고 **새 값**을 돌려줍니다. React는 "새 값이 생겼다"를 보고 화면을 다시 그리므로(02-1편) 이 성질이 중요합니다.

```js
const open = tasks.filter((t) => t.status !== "DONE");
tasks.length;   // 여전히 3
open.length;    // 2
```

---

## 11. 구조 분해와 전개

### 11-1. 객체 구조 분해 — 필요한 값만 꺼내기

```js
const { title, status } = task;
// 아래 두 줄과 같다
// const title = task.title;
// const status = task.status;
```

`{ }` 안에 쓴 이름과 **같은 키**의 값을 꺼내 같은 이름의 변수로 만듭니다. 순서는 상관없습니다.

```js
const { title: taskTitle } = task;          // 다른 이름으로 받기 → taskTitle
const { dueDate = "마감 없음" } = task;      // 없으면 기본값
const { assignee: { name } } = task;        // 안쪽 객체에서 바로 꺼내기 → name === "김국원"
```

### 11-2. 배열 구조 분해 — 순서대로 꺼내기

```js
const [first, second] = tasks;     // first === tasks[0], second === tasks[1]
const [, , third] = tasks;         // 쉼표로 건너뛰기 → tasks[2]
```

배열은 이름이 아니라 **순서**로 꺼냅니다. React의 `const [count, setCount] = useState(0);`가 바로 이 문법입니다(02-1편).

### 11-3. 함수 매개변수에서 바로 구조 분해

```js
function TaskCard({ title, status }) {
  return `${title} (${status})`;
}

TaskCard(task);   // "축제 부스 배치도 (IN_PROGRESS)"
```

객체 하나를 받아 그 안에서 `title`, `status`만 꺼내 쓰겠다는 뜻입니다. React 컴포넌트는 props를 거의 항상 이렇게 받습니다.

### 11-4. 전개(...) — 펼쳐서 새로 만들기

```js
// 객체 복사 후 일부만 바꾸기
const reopened = { ...task, status: "IN_PROGRESS" };
// task의 모든 속성을 펼쳐 놓고, status만 덮어쓴 새 객체

// 배열 복사
const copy = [...tasks];

// 하나 추가한 새 배열
const withNew = [...tasks, { id: "t-4", title: "현수막", status: "TODO", due: "2026-11-10", budget: 50000 }];

// 두 배열 합치기
const merged = [...open, ...tasks];
```

> [!TRAP]
> 순서가 중요합니다. `{ ...task, status: "DONE" }`은 status가 `"DONE"`이 되지만, `{ status: "DONE", ...task }`는 뒤에서 펼친 task의 원래 status가 덮어써서 바뀌지 않습니다. **뒤에 쓴 것이 이긴다**고 기억합니다.

### 11-5. React에서 매일 보는 세 가지 패턴

state 배열을 바꿀 때는 원본을 건드리지 않고 아래 세 모양으로 새 배열을 만듭니다.

```js
// 추가
const added = [...tasks, newTask];

// 삭제: 그 id만 빼고 남기기
const removed = tasks.filter((t) => t.id !== "t-2");

// 수정: 그 id만 바꾼 새 객체로, 나머지는 그대로
const updated = tasks.map((t) =>
  t.id === "t-2" ? { ...t, status: "DONE" } : t
);
```

수정 패턴은 "각 항목을 보고(map), id가 t-2면(?) 복사해서 status만 바꾼 새 객체, 아니면(:) 원래 항목 그대로"로 읽습니다. 7·8·10·11절 문법이 한 줄에 모두 들어 있으니 천천히 나눠 읽어 보세요.

### 11-6. 나머지 모으기(...rest)

```js
const { id, ...rest } = task;
// id === "t-101", rest === id를 뺀 나머지 속성이 담긴 객체
```

같은 `...`이지만 **= 왼쪽(꺼내는 쪽)** 에 있으면 "나머지를 모은다", **오른쪽(만드는 쪽)** 에 있으면 "펼친다"입니다.

---

## 12. 없을지도 모르는 값 다루기

DB에서 온 데이터는 담당자가 없거나(null) 속성이 빠져 있을(undefined) 수 있습니다. 그대로 안쪽을 꺼내면 오류가 납니다.

```js
const task2 = { id: "t-9", title: "회의록", assignee: null };

task2.assignee.name;
// ❌ TypeError: Cannot read properties of null (reading 'name')
```

이 오류는 초보자가 가장 많이 만나는 오류입니다. "null의 name을 읽을 수 없다", 즉 **점 왼쪽이 비어 있다**는 뜻입니다.

```js
const name = task2.assignee?.name;              // assignee가 null이면 오류 대신 undefined
const shown = task2.assignee?.name ?? "미배정";  // 왼쪽이 null/undefined면 오른쪽
```

| 문법 | 뜻 |
| --- | --- |
| `a?.b` | a가 없으면 멈추고 undefined. 있으면 a.b |
| `a?.[0]`, `a?.()` | 배열·함수에도 쓸 수 있음 |
| `a ?? b` | a가 null·undefined면 b, 아니면 a |
| `a \|\| b` | a가 거짓으로 취급되는 값이면 b (0이나 ""도 b로 바뀌는 점이 ??와 다름) |

```js
const budget = 0;
budget ?? 10000   // 0       ← 0은 null이 아니므로 그대로
budget || 10000   // 10000   ← 0은 거짓으로 취급되어 바뀜
```

예산이 0원인 업무를 "값 없음"으로 잘못 처리하지 않으려면 `??`를 씁니다.

---

## 13. 모듈 — import와 export

코드가 길어지면 여러 파일로 나눕니다. 한 파일에서 만든 것을 다른 파일에서 쓰려면 **내보내고(export) 가져와야(import)** 합니다.

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

statusLabel("DONE");   // 다른 파일의 함수를 내 파일에서 사용
```

| 줄 | 읽는 법 |
| --- | --- |
| `export function ...` | 이 함수를 다른 파일에서 쓸 수 있게 내보냄 (이름 있는 내보내기) |
| `export default` | 파일의 대표 하나. 가져올 때 이름을 마음대로 붙임 |
| `import X, { a, b } from "경로"` | 대표는 X로, 나머지는 `{ }` 안에 이름 그대로 가져옴 |
| `import { a as b }` | a를 b라는 이름으로 가져옴 |
| `"@/lib/..."` | 프로젝트 최상위를 뜻하는 별칭 경로 |
| `"./utils"`, `"../lib/x"` | 지금 파일 기준 상대 경로 (`.`은 같은 폴더, `..`은 위 폴더) |
| `"@supabase/supabase-js"` | 설치한 외부 패키지 (경로 기호 없이 이름만) |

> [!TRAP]
> 이름 있는 내보내기는 `{ }`로, default는 `{ }` 없이 가져옵니다. `import { formatDue } from ...`처럼 default를 중괄호로 가져오면 "does not provide an export named" 오류가 납니다. 거꾸로도 마찬가지입니다.

---

## 14. 기다려야 하는 일 — Promise와 async/await

### 14-1. 왜 기다려야 하나

DB 요청은 인터넷을 거쳐 다녀오므로 시간이 걸립니다. JavaScript는 그동안 멈춰 있지 않고, 일단 "**나중에 결과를 주겠다는 약속**(Promise)"을 받아 둡니다.

> [!EXAMPLE]
> 카페에서 주문하면 커피 대신 **진동벨**을 먼저 받습니다. 진동벨이 Promise이고, 벨이 울릴 때까지 기다렸다가 커피를 받는 것이 `await`입니다. 진동벨을 커피라고 생각하고 마시려 하면(= await를 빼먹으면) 문제가 생깁니다.

Console에서 직접 확인해 볼 수 있습니다.

```js
// 1초 뒤에 업무 목록을 돌려주는 가짜 DB 요청
function fakeLoad() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["부스 배치도", "간식 예산"]), 1000);
  });
}

const p = fakeLoad();
p;   // Promise {<pending>}  ← 아직 진동벨 상태

const list = await fakeLoad();   // 1초 기다림
list;   // ["부스 배치도", "간식 예산"]
```

(`await`는 원래 `async` 함수 안에서만 쓰지만, Console에서는 예외로 바로 쓸 수 있습니다.)

### 14-2. async 함수와 try/catch

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
| `const { data, error } = ...` | 결과 객체를 구조 분해 (11절) |
| `throw error` | 오류를 던져 catch로 보냄 |
| `try { } catch (err) { }` | try 안에서 오류가 나면 catch 블록 실행 |
| `finally { }` | 항상 실행 |

`supabase.from(...).select(...).eq(...)`도 10-2절처럼 **줄마다 조건을 하나씩 덧붙이는 체이닝**입니다. 문장으로 읽으면 "tasks 테이블에서, 이 열들을, 담당자가 나인 것만, 마감일 순으로"입니다.

### 14-3. try / catch를 따로 보기

```js
try {
  console.log("1. 시작");
  null.name;                       // 여기서 오류 → 아래 줄은 건너뜀
  console.log("2. 실행되지 않음");
} catch (err) {
  console.log("3. 오류 처리:", err.message);
} finally {
  console.log("4. 정리");
}
// 1. 시작
// 3. 오류 처리: Cannot read properties of null (reading 'name')
// 4. 정리
```

try가 없으면 오류가 난 지점에서 프로그램이 멈춥니다. try/catch는 "실패해도 멈추지 말고 여기서 처리하라"는 안전망입니다.

### 14-4. 여러 요청을 동시에

```js
const [tasksResult, membersResult] = await Promise.all([
  supabase.from("tasks").select("*"),
  supabase.from("memberships").select("*"),
]);
```

두 요청을 **동시에** 보내고 둘 다 끝날 때까지 기다립니다. 결과는 보낸 순서대로 배열에 담기므로 배열 구조 분해(11-2절)로 받습니다. 하나씩 `await`하면 두 배로 오래 걸립니다.

> [!CAUTION]
> `await`를 빼먹으면 `data` 대신 **아직 끝나지 않은 Promise**가 들어갑니다. 화면에 `[object Promise]`가 보이거나 `data`가 undefined라면 가장 먼저 `await` 누락을 의심합니다.

---

## 15. 직접 해보기

Console에 6-2절의 `tasks` 배열을 붙여 넣고 다음을 한 줄로 써 봅니다.

1. 마감일이 `"2026-11-01"`보다 이른 업무의 제목 배열
2. `status`가 `"TODO"`인 업무가 있는지 (true/false)
3. 모든 업무의 `status`를 `"DONE"`으로 바꾼 **새** 배열 (원본은 그대로)
4. 완료되지 않은 업무의 예산 합계
5. `"t-3"` 업무의 제목. 없는 id `"t-99"`를 넣었을 때도 오류 없이 `"없음"`이 나오게

> [!HINT 1]
> 1번은 `filter`로 고른 뒤 `map`으로 제목만 꺼냅니다. 4번은 `filter` 뒤에 `reduce`를 붙입니다. 5번은 `find`가 못 찾으면 `undefined`를 돌려준다는 점을 떠올리세요.

> [!SOLUTION]
> ```js
> // 1
> tasks.filter((t) => t.due < "2026-11-01").map((t) => t.title);
> // ["부스 배치도", "간식 예산"]
>
> // 2
> tasks.some((t) => t.status === "TODO");   // true
>
> // 3
> tasks.map((t) => ({ ...t, status: "DONE" }));
>
> // 4
> tasks.filter((t) => t.status !== "DONE").reduce((sum, t) => sum + t.budget, 0);
> // 180000
>
> // 5
> tasks.find((t) => t.id === "t-3")?.title ?? "없음";    // "포스터 시안"
> tasks.find((t) => t.id === "t-99")?.title ?? "없음";   // "없음"
> ```

> [!QUIZ]
> 3번을 한 줄로 쓰고, 왜 `tasks.forEach((t) => { t.status = "DONE"; })`가 React에서 문제가 되는지 말하세요.

> [!ANSWER]
> `const allDone = tasks.map((t) => ({ ...t, status: "DONE" }));`
> `forEach`로 안쪽 값을 직접 바꾸면 **원본 객체가 바뀌고 새 배열이 생기지 않습니다.** React는 이전 값과 새 값이 다른 객체인지로 변화를 알아채므로, 원본을 바꾸면 화면이 갱신되지 않는 버그가 생깁니다. 화살표 함수가 객체를 돌려줄 때는 `({ ... })`처럼 괄호로 감싸야 한다는 점도 함께 기억합니다.

> [!QUIZ]
> `const label = task.assignee?.name ?? "미배정";`에서 `task.assignee`가 `null`이면 `label`은 무엇인가요?

> [!ANSWER]
> `"미배정"`입니다. `task.assignee?.name`이 오류 없이 `undefined`가 되고, `??`가 그 자리를 `"미배정"`으로 채웁니다.

> [!QUIZ]
> 다음 코드의 출력 결과를 순서대로 쓰세요.
> ```js
> const a = "5" + 1;
> const b = "5" - 1;
> const c = 5 === "5";
> console.log(a, b, c);
> ```

> [!ANSWER]
> `"51" 4 false`. `+`는 한쪽이 글자면 이어 붙이기가 되어 `"51"`, `-`는 이어 붙이기가 없으므로 글자를 숫자로 바꿔 계산해 `4`, `===`는 자료형까지 비교하므로 숫자 5와 글자 "5"는 `false`입니다.

> [!QUIZ]
> 다음 함수를 화살표 함수 한 줄로 바꾸세요.
> ```js
> function toLabel(task) {
>   return task.title + " - " + task.status;
> }
> ```

> [!ANSWER]
> ```js
> const toLabel = (task) => `${task.title} - ${task.status}`;
> // 구조 분해를 쓰면
> const toLabel2 = ({ title, status }) => `${title} - ${status}`;
> ```
>
> 본문이 return 한 줄뿐이므로 중괄호와 return을 지우고, `+` 이어 붙이기는 템플릿 문자열로 바꿨습니다.

> [!QUIZ]
> 아래 코드가 화면에 `[object Promise]`를 보여 줍니다. 무엇이 빠졌나요?
> ```js
> async function show() {
>   const tasks = loadMyTasks(supabase, userId);
>   console.log(`업무 ${tasks.length}개`);
> }
> ```

> [!ANSWER]
> `loadMyTasks(...)` 앞에 `await`가 빠졌습니다. `await`가 없으면 `tasks`에 배열이 아니라 Promise가 들어가므로 `length`가 없어 `undefined`가 됩니다. `const tasks = await loadMyTasks(supabase, userId);`로 고칩니다.

---

## 핵심 정리

| 주제 | 꼭 기억할 것 |
| --- | --- |
| 읽는 규칙 | 위에서 아래로, `=`는 대입, `===`는 비교, `//`는 주석 |
| 자료형 | string·number·boolean·null·undefined. 따옴표가 있으면 글자 |
| 변수 | 기본은 `const`, 바뀌어야 하면 `let`. `{ }` 안에서 만든 변수는 그 안에서만 |
| 객체·배열 | 객체는 `.이름`, 배열은 `[번호]`(0부터). 왼쪽부터 한 단계씩 읽기 |
| 함수 | `(받을 값) => 돌려줄 값`. 함수도 값이라 다른 함수에 넘길 수 있음(콜백) |
| 조건·반복 | 위부터 처음 참인 블록 하나만. `[]`, `{}`는 참. 반복은 `for...of` |
| 배열 메서드 | filter=골라내기, map=바꾸기, find=하나 찾기, reduce=합치기. 원본은 그대로 |
| 전개 | 추가 `[...a, x]`, 삭제 `filter`, 수정 `map` + `{ ...t, 바꿀 값 }` |
| 빈 값 | `?.`로 안전하게 꺼내고 `??`로 기본값. 0을 지키려면 `\|\|` 대신 `??` |
| 비동기 | DB 요청 앞에는 `await`, 실패는 `try/catch` |

## 학습 경로

[← 01-2 HTML·CSS 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-02) · [01-4 TypeScript 읽기 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-04)
