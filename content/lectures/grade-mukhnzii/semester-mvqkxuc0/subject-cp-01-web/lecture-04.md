---
title: "01-4 · TypeScript 읽기"
description: "TypeScript가 왜 필요한지부터 기본 타입 표기와 추론, 배열·객체 타입, type과 interface, 유니언과 좁히기, 함수·콜백·async 함수의 타입, 제네릭과 도우미 타입, React와 Supabase에서 보는 타입까지 읽는 법을 익히고, 타입 오류 메시지를 해석합니다."
order: 4
published: true
duration: 75
tags: [TypeScript, 타입, 유니언, 제네릭, Supabase 타입]
objectives:
  - TypeScript가 JavaScript와 어떻게 다르고, 왜 실행 전에 오류를 찾을 수 있는지 설명한다.
  - 변수·매개변수·반환값의 타입 표기와 타입 추론을 읽는다.
  - 배열·객체 타입을 type과 interface로 정의한 코드를 읽는다.
  - 유니언 타입으로 상태 값을 제한하고, if·switch로 타입을 좁히는 코드를 읽는다.
  - '선택 속성(?), null 허용(| null), 제네릭 꺾쇠(<T>), 도우미 타입을 읽는다.'
  - React props·state와 Supabase가 만든 DB 타입을 읽는다.
  - 타입 검사가 실행 중 보안을 대신하지 못하는 이유를 설명한다.
---

## 이 편의 목표

01-3편에서 읽은 JavaScript에 **타입**을 덧붙이는 법을 익힙니다. 이 프로젝트의 파일은 모두 `.ts`·`.tsx`이므로, 02편부터 나오는 코드에는 이 편의 표기가 계속 보입니다. 새로 배우는 것은 대부분 **`:` 뒤에 붙는 모양 설명**뿐이고, 나머지는 01-3편의 JavaScript 그대로입니다.

### 학습 흐름

| 순서 | 내용 | 한 줄 요약 |
| --- | --- | --- |
| 0 | 왜 TypeScript인가 | 실행하기 전에 실수를 찾는다 |
| 1–2 | 기본 타입·배열 | `이름: 타입`으로 값의 모양을 적는다 |
| 3 | 객체 타입 | type·interface로 업무 한 건의 모양을 정한다 |
| 4 | 유니언과 좁히기 | 허용하는 값만 나열하고, 경우를 나눠 확인한다 |
| 5 | 함수 타입 | 받는 값과 돌려주는 값의 모양을 적는다 |
| 6–8 | 제네릭·도우미 타입·합치기 | 있는 타입을 재료로 새 타입을 만든다 |
| 9–10 | React·Supabase의 타입 | 실제 프로젝트 코드에서 읽기 |
| 11–12 | 오류 메시지·한계 | 빨간 줄을 읽고, 타입이 못 하는 일을 안다 |

---

## 0. TypeScript는 "값의 모양"을 적어 둔 JavaScript

### 0-1. JavaScript만 쓰면 생기는 일

```js
// JavaScript
function dueLabel(task) {
  return task.dueDate.slice(5);   // "2026-10-28" → "10-28"
}

dueLabel({ title: "현수막", duedate: "2026-10-28" });
// 실행해 보면 ❌ TypeError: Cannot read properties of undefined (reading 'slice')
```

`dueDate`를 `duedate`로 잘못 쓴 오타인데, JavaScript는 **코드를 실제로 실행해서 그 줄에 도착해야** 오류를 알려 줍니다. 그 화면을 아무도 열어 보지 않으면 배포한 뒤 사용자가 먼저 발견합니다.

### 0-2. TypeScript를 쓰면

```ts
// TypeScript
type Task = { title: string; dueDate: string };

function dueLabel(task: Task) {
  return task.dueDate.slice(5);
}

dueLabel({ title: "현수막", duedate: "2026-10-28" });
//                          ~~~~~~~ ❌ 편집기에 빨간 줄:
// Object literal may only specify known properties, but 'duedate' does not exist in type 'Task'.
```

TypeScript(TS)는 JavaScript에 **타입**(값의 모양)을 덧붙인 언어입니다. "Task는 title과 dueDate를 가진다"고 적어 두면, 코드를 실행하기 **전에** 편집기가 "이 자리에 이 모양의 값이 오는가"를 검사해 실수를 찾아 줍니다.

> [!DEFINITION]
> **타입(type)** 은 값이 어떤 모양인지에 대한 설명입니다. "글자다", "숫자다", "title과 dueDate를 가진 객체다", "`"TODO"`나 `"DONE"` 중 하나다" 같은 것이 모두 타입입니다. TS는 이 설명과 실제 코드가 맞는지 **검사만** 하고, 실행 방식은 바꾸지 않습니다.

### 0-3. 실행될 때는 타입이 지워진다

```ts
// 내가 쓰는 코드 (task.ts)
const title: string = "현수막";
function double(n: number): number {
  return n * 2;
}
```

```js
// 브라우저·서버에서 실제로 실행되는 코드 (타입만 지워짐)
const title = "현수막";
function double(n) {
  return n * 2;
}
```

브라우저는 TS를 모릅니다. Next.js가 빌드할 때 `: string` 같은 타입 부분을 지워 평범한 JavaScript로 바꿔서 실행합니다. 그래서 **타입을 지우고 남은 부분은 01-3편에서 배운 JavaScript 그대로**입니다. 처음 보는 TS 코드가 어려우면 `:` 뒤 타입을 손으로 가리고 읽어 보세요.

| 확장자 | 뜻 |
| --- | --- |
| `.js` | JavaScript |
| `.ts` | TypeScript |
| `.tsx` | TypeScript + JSX (React 화면 코드) |
| `.d.ts` | 타입 설명만 담은 파일 (실행 코드 없음) |

---

## 1. 기본 타입 표기

### 1-1. `이름: 타입`

```ts
const title: string = "축제 부스 배치도";
let openCount: number = 3;
const isActive: boolean = true;
let assigneeId: string | null = null;   // 글자이거나 null (4절)

openCount = 4;        // ✅ 숫자 자리에 숫자
openCount = "세 개";   // ❌ Type 'string' is not assignable to type 'number'.
```

`이름: 타입`을 "이름은 이런 모양이다"로 읽습니다. 한 번 `number`로 정한 변수에는 계속 숫자만 넣을 수 있습니다.

| 타입 | 들어갈 수 있는 값 | 01-3편의 자료형 |
| --- | --- | --- |
| `string` | 모든 글자 | string |
| `number` | 모든 숫자 (정수·소수 구분 없음) | number |
| `boolean` | `true`, `false` | boolean |
| `null` | `null`만 | null |
| `undefined` | `undefined`만 | undefined |

> [!TRAP]
> 타입 이름은 **소문자**로 씁니다. `String`, `Number`처럼 대문자로 시작하는 것은 다른 뜻이라 쓰지 않습니다.

### 1-2. 타입 추론 — 안 써도 TS가 안다

```ts
const title = "축제 부스 배치도";   // TS가 string으로 추론
let openCount = 3;                  // number로 추론
openCount = "세 개";                 // ❌ 여전히 오류. 처음 넣은 값으로 타입이 정해짐

const doubled = openCount * 2;      // number로 추론
```

값을 바로 넣는 변수는 TS가 **알아서 타입을 정합니다(추론).** 그래서 실제 코드에서는 변수 옆 타입이 생략된 경우가 많고, 타입을 직접 적는 곳은 주로 **함수의 매개변수**와 **객체 모양**입니다. VS Code에서 변수 이름 위에 마우스를 올리면 추론된 타입이 보입니다.

> [!NOTE]
> `const`로 만든 글자는 조금 더 좁게 추론됩니다. `const s = "TODO";`의 타입은 `string`이 아니라 **`"TODO"` 그 자체**입니다. 바뀔 수 없으니 그 값 하나만 가능하다고 보는 것입니다. 이 성질은 4절의 유니언에서 다시 나옵니다.

### 1-3. any와 unknown — "아무거나"

```ts
let raw: any = JSON.parse('{"title":"현수막"}');
raw.titel.toUpperCase();   // 오타인데도 오류 없음 → 실행 중에 터짐

let safe: unknown = JSON.parse('{"title":"현수막"}');
safe.title;                // ❌ 'safe' is of type 'unknown'. 먼저 확인해야 쓸 수 있음
```

| 타입 | 뜻 | 쓰는 법 |
| --- | --- | --- |
| `any` | 검사를 **끈다** | 쓰지 않는다. 보이면 고칠 대상 |
| `unknown` | 무엇인지 **모른다** | 바깥에서 들어온 값. 확인한 뒤에 쓴다 |

`any`를 쓰면 TypeScript를 쓰는 의미가 사라집니다. 이 프로젝트는 코드 검사 도구(ESLint)가 `any`를 문제로 표시하도록 설정되어 있습니다.

---

## 2. 배열 타입

```ts
const tags: string[] = ["축제", "홍보"];          // 글자의 배열
const scores: number[] = [90, 85, 77];           // 숫자의 배열
const ids: Array<string> = ["t-1", "t-2"];       // string[]과 같은 뜻 (6절의 제네릭 표기)

tags.push("예산");   // ✅
tags.push(3);       // ❌ Argument of type 'number' is not assignable to parameter of type 'string'.

const first = tags[0];   // string으로 추론
```

`타입[]`을 "**타입의 배열**"로 읽습니다. 객체 배열은 3절에서 만들 `Task`를 써서 `Task[]`("Task의 배열")로 씁니다.

```ts
const tasks: Task[] = [];                 // 빈 배열이라도 "Task만 들어간다"고 알려 둠
const titles = tasks.map((t) => t.title); // string[]로 추론 — map이 돌려주는 모양까지 따라감
```

> [!TRAP]
> 빈 배열 `[]`을 타입 없이 만들면 TS가 무엇이 들어갈지 몰라 나중에 오류가 납니다. **빈 배열로 시작하는 변수에는 타입을 적어 두는 것**이 좋습니다. React의 `useState<Task[]>([])`가 이 경우입니다(9절).

### 2-1. 튜플 — 칸 수와 칸마다 타입이 정해진 배열

```ts
const range: [string, string] = ["2026-10-01", "2026-10-31"];   // 시작일, 종료일
const entry: [string, number] = ["TODO", 3];                    // 상태, 개수
```

`[A, B]`는 "첫 칸은 A, 둘째 칸은 B인 두 칸짜리 배열"입니다. React의 `useState`가 돌려주는 `[값, 바꾸는 함수]`도 튜플입니다.

---

## 3. 객체의 모양 — type과 interface

### 3-1. type으로 모양에 이름 붙이기

```ts
type Task = {
  id: string;
  title: string;
  status: TaskStatus;           // 4절에서 정의
  assigneeId: string | null;    // 담당자가 없을 수 있다
  dueDate?: string;             // 아예 없어도 되는 속성
  tags: string[];               // 글자 배열
};

interface Profile {
  id: string;
  email: string;
  displayName: string;
}
```

| 표기 | 읽는 법 |
| --- | --- |
| `type Task = { ... }` | Task라는 모양에 이름을 붙인다 |
| `interface Profile { ... }` | 거의 같은 기능. `=` 없이 바로 `{` |
| `id: string;` | id 속성은 글자다. 속성끼리는 `;`(또는 `,`)로 구분 |
| `assigneeId: string \| null` | 글자이거나 null. **속성은 반드시 있음** |
| `dueDate?: string` | 글자이거나 **속성 자체가 없음** |
| `string[]` | 글자의 배열. `Array<string>`과 같음 |

> [!NOTE]
> 타입 이름은 `Task`, `Profile`처럼 **대문자로 시작**합니다. 변수(`task`)와 타입(`Task`)을 한눈에 구분하기 위한 약속입니다. `type`과 `interface`는 이 강의에서 다루는 범위에서는 차이가 거의 없고, 이 프로젝트는 주로 `type`을 씁니다.

### 3-2. 타입을 붙이면 무엇을 검사하나

```ts
const ok: Task = {
  id: "t-1",
  title: "부스 배치도",
  status: "DONE",
  assigneeId: null,
  tags: [],
};   // ✅ dueDate는 선택이라 없어도 됨

const missing: Task = {
  id: "t-2",
  title: "간식 예산",
  status: "TODO",
  tags: [],
};   // ❌ Property 'assigneeId' is missing in type ... but required in type 'Task'.

const extra: Task = {
  id: "t-3",
  title: "포스터",
  status: "TODO",
  assigneeId: null,
  tags: [],
  priority: 1,
};   // ❌ Object literal may only specify known properties, and 'priority' does not exist in type 'Task'.

const wrong: Task = {
  id: 101,   // ❌ Type 'number' is not assignable to type 'string'.
  title: "현수막",
  status: "TODO",
  assigneeId: null,
  tags: [],
};
```

| 검사 | 오류가 나는 경우 |
| --- | --- |
| 꼭 있어야 할 속성 | `?` 없는 속성이 빠짐 |
| 모르는 속성 | 타입에 없는 속성을 새로 넣음 |
| 속성의 타입 | 글자 자리에 숫자 등 |

### 3-3. `| null`과 `?`의 차이

```ts
type A = { memo: string | null };   // memo 키는 꼭 있고, 값이 비어 있을 수 있음
type B = { memo?: string };         // memo 키가 없어도 됨

const a1: A = { memo: null };   // ✅
const a2: A = {};               // ❌ memo가 없음
const b1: B = {};               // ✅
const b2: B = { memo: null };   // ❌ null은 허용하지 않음 (string 또는 없음)
```

> [!NOTE]
> DB에서 가져온 행은 열이 항상 있고 값만 비어 있으므로 `| null`로 적습니다. 폼 입력처럼 키 자체가 없을 수 있는 경우에 `?`를 씁니다.

### 3-4. 타입 안에 타입 — 중첩

```ts
type Member = { id: string; name: string };

type TaskDetail = {
  id: string;
  title: string;
  assignee: Member | null;        // 다른 타입을 그대로 가져다 씀
  comments: { author: string; body: string }[];   // 이름 없이 바로 적은 객체 모양의 배열
};

const d: TaskDetail = {
  id: "t-1",
  title: "부스 배치도",
  assignee: { id: "u-7", name: "김국원" },
  comments: [{ author: "이하나", body: "B구역 확인했습니다" }],
};

d.assignee?.name;   // string | undefined
```

`{ author: string; body: string }[]`는 "author와 body를 가진 객체의 배열"입니다. 이름 없이 그 자리에 바로 모양을 적을 수도 있지만, 여러 번 쓰면 `type Comment = {...}`로 이름을 붙이는 편이 읽기 좋습니다.

### 3-5. readonly — 바꾸지 못하게

```ts
type Term = {
  readonly id: string;
  name: string;
};

const t: Term = { id: "term-38", name: "제38대" };
t.name = "제38대 학생회";   // ✅
t.id = "term-39";          // ❌ Cannot assign to 'id' because it is a read-only property.
```

---

## 4. 유니언 — 허용하는 값만 나열하기

### 4-1. `|`는 "또는"

```ts
let id: string | number;
id = "t-1";   // ✅
id = 101;     // ✅
id = true;    // ❌
```

`A | B`를 "A 또는 B"로 읽습니다. 이것을 **유니언(union) 타입**이라고 합니다.

### 4-2. 글자 값을 타입으로 — 리터럴 유니언

타입 자리에 `"TODO"` 같은 **글자 값 자체**를 쓸 수 있습니다. 그 글자만 허용한다는 뜻입니다. 기획서의 상태 값을 그대로 타입으로 옮깁니다.

```ts
type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type Role = "MEMBER" | "DIRECTOR" | "EXECUTIVE";
type TermStatus = "DRAFT" | "ACTIVE" | "CLOSED";
type MeetingStatus = "DRAFT" | "CONFIRMED" | "ARCHIVED";
type VisibilityMode = "DEFAULT" | "RESTRICTED";

const s: TaskStatus = "DOEN";   // ❌ Type '"DOEN"' is not assignable to type 'TaskStatus'.
```

네 글자 외의 값을 넣으면 코드를 실행하기도 전에 편집기에 빨간 줄이 생깁니다. `status: string`으로 두면 `"DOEN"` 같은 오타도 통과하므로, **정해진 값만 있는 칸은 유니언으로 적는 것**이 핵심입니다. 덤으로 VS Code가 `"`를 치는 순간 네 가지 값을 자동 완성으로 보여 줍니다.

### 4-3. 좁히기 — 확인한 만큼 타입이 줄어든다

유니언 타입의 값은 "무엇인지 확인한 뒤에" 그 타입에 맞는 일을 할 수 있습니다. if문으로 확인하면 TS가 그 블록 안에서 타입을 **좁혀(narrowing)** 줍니다.

```ts
function showAssignee(assigneeId: string | null) {
  assigneeId.toUpperCase();     // ❌ 'assigneeId' is possibly 'null'.

  if (assigneeId === null) {
    return "미배정";             // 여기서 assigneeId는 null
  }
  return assigneeId.toUpperCase();   // ✅ 여기까지 왔으면 string만 남음
}
```

```ts
function formatId(id: string | number) {
  if (typeof id === "number") {
    return `#${id.toFixed(0)}`;   // 이 안에서 id는 number
  }
  return id.trim();               // 여기서는 string
}
```

| 확인 방법 | 좁혀지는 것 |
| --- | --- |
| `if (x === null)`, `if (x)` | null·undefined를 걸러 냄 |
| `typeof x === "string"` | string·number·boolean 구분 |
| `x === "DONE"` | 리터럴 값 하나로 |
| `Array.isArray(x)` | 배열인지 |
| `"email" in x` | 그 속성이 있는 객체 타입으로 |

01-3편의 `?.`와 `??`도 결국 "비어 있으면 다르게 처리"하는 좁히기라서 TS가 그대로 이해합니다.

### 4-4. switch로 모든 경우 처리하기

```ts
function badge(status: TaskStatus): string {
  switch (status) {
    case "TODO": return "할 일";
    case "IN_PROGRESS": return "진행 중";
    case "REVIEW": return "검토 중";
    case "DONE": return "완료";
  }
}
```

네 경우를 다 처리했으므로 오류가 없습니다. 나중에 상태에 `"BLOCKED"`를 추가하면 이 함수에서 `Function lacks ending return statement`(끝까지 가면 돌려줄 값이 없다) 오류가 납니다. 상태 하나 추가가 화면 전체에 어떤 영향을 주는지 **컴파일러가 찾아 주는** 셈입니다.

### 4-5. 상태마다 모양이 다른 객체

```ts
type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done"; tasks: Task[] };

function render(state: LoadState) {
  if (state.kind === "loading") return "불러오는 중…";
  if (state.kind === "error") return `오류: ${state.message}`;   // message가 있는 모양으로 좁혀짐
  return `업무 ${state.tasks.length}개`;                           // tasks가 있는 모양만 남음
}
```

`kind` 같은 공통 속성의 값을 보고 어느 모양인지 알아내는 패턴입니다. 맨 앞의 `|`는 줄 맞춤용이라 없어도 같은 뜻입니다. `state.kind === "loading"`일 때 `state.message`를 쓰면 오류가 나므로, "불러오는 중인데 오류 메시지를 보여 주는" 실수를 막아 줍니다.

---

## 5. 함수의 타입

### 5-1. 매개변수와 반환값

```ts
function canEditTask(role: Role, isAssignee: boolean): boolean {
  if (role === "EXECUTIVE") return true;
  return isAssignee;
}

canEditTask("MEMBER", true);       // ✅ true
canEditTask("ADMIN", true);        // ❌ "ADMIN"은 Role이 아님
canEditTask("MEMBER");             // ❌ Expected 2 arguments, but got 1.
```

| 부분 | 읽는 법 |
| --- | --- |
| `(role: Role, isAssignee: boolean)` | Role 하나와 boolean 하나를 받는다 |
| `): boolean` | boolean을 돌려준다 |
| `void` | 돌려주는 값이 없음 |
| `Promise<Task[]>` | 나중에 Task 배열을 주는 약속 (async 함수의 반환 타입) |

**매개변수에는 타입을 꼭 적습니다.** TS는 함수를 누가 어떤 값으로 부를지 모르기 때문에 매개변수는 추론하지 못합니다. 반환 타입은 생략하면 return 값을 보고 추론합니다.

### 5-2. 화살표 함수, 선택 매개변수, 기본값

```ts
const formatDue = (date: string | null): string => date ?? "마감 없음";

function greet(name: string, suffix?: string) {   // suffix는 안 넘겨도 됨
  return suffix ? `${name} ${suffix}` : name;
}
greet("김국원");          // "김국원"
greet("김국원", "국장");   // "김국원 국장"

function paginate(page: number = 1, size = 20) {   // 기본값이 있으면 타입 추론
  return { from: (page - 1) * size, to: page * size - 1 };
}

function logTask(task: Task): void {
  console.log(task.title);   // 출력만 하고 돌려주지 않음
}
```

### 5-3. 함수 자체의 타입 — 콜백 받기

01-3편 7-4절의 콜백을 받는 함수는 "**어떤 모양의 함수를 받는지**"도 적습니다.

```ts
type TaskHandler = (task: Task) => void;

function forEachOpen(tasks: Task[], handle: TaskHandler) {
  for (const t of tasks) {
    if (t.status !== "DONE") handle(t);
  }
}

forEachOpen(tasks, (t) => console.log(t.title));   // t는 자동으로 Task
```

`(task: Task) => void`는 "Task 하나를 받고 아무것도 돌려주지 않는 함수"라는 **타입**입니다. 화살표 함수와 모양이 닮았지만 `=>` 오른쪽이 값이 아니라 **반환 타입**이라는 점이 다릅니다.

> [!EXAM]
> `onSelect: (id: string) => void`라는 props를 보면 "id 글자 하나를 넘겨 부르는 함수를 받는다, 결과는 쓰지 않는다"로 읽습니다. React 컴포넌트가 부모에게 "이 업무가 선택됐다"고 알릴 때 자주 쓰는 모양입니다.

### 5-4. async 함수의 반환 타입

```ts
async function loadTasks(): Promise<Task[]> {
  const { data } = await supabase.from("tasks").select("*");
  return data ?? [];
}

const list = await loadTasks();   // list는 Task[]
const p = loadTasks();            // p는 Promise<Task[]> — await를 빼먹으면 타입이 알려 줌
p.length;                         // ❌ Property 'length' does not exist on type 'Promise<Task[]>'.
```

01-3편에서 본 "`await`를 빼먹는 실수"를 TS는 실행 전에 잡아 줍니다.

---

## 6. 제네릭 — 꺾쇠 안은 "무엇의"

`<T>`는 "어떤 타입이든 끼울 수 있는 자리"입니다. 상자는 같고 내용물만 다른 경우에 씁니다. 읽을 때는 "**T의**"로 읽으면 됩니다.

```ts
const ids: Array<string> = ["t-1", "t-2"];       // string의 배열
const pending: Promise<Task> = loadOne("t-1");   // Task를 주는 약속
const byId: Record<string, Task> = {};           // 글자 키 → Task 값인 객체
const seen: Set<string> = new Set();             // 글자의 집합(중복 없음)
const cache: Map<string, Task> = new Map();      // 글자 키 → Task 값
```

### 6-1. 직접 만든 제네릭 타입

```ts
type Result<T> = { data: T | null; error: string | null };

const r1: Result<Task[]> = { data: [], error: null };            // Task 배열을 담는 결과
const r2: Result<Profile> = { data: null, error: "로그인 필요" };  // Profile을 담는 결과
```

`Result<Task[]>`라고 쓰는 순간 정의 안의 `T`가 모두 `Task[]`로 바뀐다고 생각하면 됩니다. 결과 모양 하나를 만들어 두고 내용물만 바꿔 끼우는 것입니다.

### 6-2. 제네릭 함수

```ts
function firstOrNull<T>(list: T[]): T | null {
  return list.length > 0 ? list[0] : null;
}

const t = firstOrNull(tasks);           // T가 Task로 추론 → Task | null
const s = firstOrNull(["축제", "홍보"]); // T가 string으로 추론 → string | null
```

함수 이름 뒤 `<T>`는 "이 함수는 T라는 빈칸을 쓴다"는 선언입니다. 호출할 때 넣은 값을 보고 TS가 빈칸을 채웁니다.

React에서는 이렇게 보입니다.

```tsx
const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL");
// filter는 TaskStatus이거나 "ALL"인 상태값
```

---

## 7. 자주 보는 도우미 타입

있는 타입을 재료로 조금 바꾼 새 타입을 만드는 도구입니다. 모두 6절의 제네릭 모양입니다.

| 표기 | 뜻 | 예 |
| --- | --- | --- |
| `Partial<Task>` | 모든 속성이 선택 | 일부만 고치는 수정 요청 |
| `Required<Task>` | 모든 속성이 필수 | `?`를 모두 없앰 |
| `Pick<Task, "id" \| "title">` | 일부 속성만 | 목록 카드에 필요한 것만 |
| `Omit<Task, "id">` | 일부 속성 빼고 | 새로 만들 때(아직 id 없음) |
| `Readonly<Task>` | 바꿀 수 없음 | 화면에 넘기는 값 |
| `Record<K, V>` | 키가 K, 값이 V인 객체 | 상태별 개수 |
| `as const` | 값을 글자 그대로 고정 | `["TODO", "DONE"] as const` |

```ts
// 수정: 바꿀 것만 보낸다
function updateTask(id: string, changes: Partial<Task>) { /* ... */ }
updateTask("t-1", { status: "DONE" });          // ✅ 나머지 속성은 없어도 됨

// 목록 카드: id와 title만 필요
type TaskSummary = Pick<Task, "id" | "title">;  // { id: string; title: string }

// 생성: id는 DB가 만들어 주므로 뺀다
type NewTask = Omit<Task, "id">;
const draft: NewTask = { title: "현수막", status: "TODO", assigneeId: null, tags: [] };

// 상태별 개수: 네 상태가 모두 키로 있어야 함
const counts: Record<TaskStatus, number> = { TODO: 2, IN_PROGRESS: 1, REVIEW: 0, DONE: 5 };
```

`Record<TaskStatus, number>`에 `REVIEW`를 빠뜨리면 오류가 나므로, 상태를 하나 추가했을 때 개수 표를 고쳐야 한다는 사실도 TS가 알려 줍니다.

### 7-1. 값에서 타입 뽑아내기 — as const와 typeof

```ts
const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const;
type TaskStatus2 = (typeof STATUSES)[number];
// "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
```

| 부분 | 읽는 법 |
| --- | --- |
| `as const` | 이 배열은 바뀌지 않고, 각 칸은 정확히 이 글자다 |
| `typeof STATUSES` | 값 STATUSES의 **타입**을 꺼냄 (타입 자리의 `typeof`) |
| `[number]` | 그 배열의 아무 칸의 타입 → 네 글자의 유니언 |

드롭다운 선택지(값 배열)와 타입을 따로 적지 않고 **한 곳에서만 관리**하려고 쓰는 패턴입니다.

---

## 8. 타입 합치기와 확장

```ts
type WithTimestamps = { createdAt: string; updatedAt: string };

type TaskRecord = Task & WithTimestamps;   // Task의 속성 + 시각 두 개

interface Member { id: string; name: string }
interface Director extends Member {        // Member의 속성 + department
  department: string;
}
```

| 표기 | 읽는 법 |
| --- | --- |
| `A & B` | A **그리고** B. 두 모양의 속성을 모두 가짐 |
| `interface B extends A` | A를 물려받아 속성을 더한 B |

> [!TRAP]
> `|`와 `&`를 헷갈리기 쉽습니다. `A | B`는 "둘 중 **하나의** 모양"이라 공통 속성만 바로 쓸 수 있고, `A & B`는 "둘을 **합친** 모양"이라 양쪽 속성을 모두 가져야 합니다.

---

## 9. 코드에서 자주 보는 TS 전용 표기

### 9-1. import type

```ts
import type { Task, TaskStatus } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
```

`import type`은 "**타입만** 가져온다"는 표시입니다. 실행 코드에서 지워지므로 실제 파일 크기에 영향이 없습니다. 읽을 때는 일반 import와 똑같이 읽으면 됩니다.

### 9-2. as — 타입 단언

```ts
const input = document.querySelector("#title") as HTMLInputElement;
input.value;   // 이제 input 요소로 취급
```

`값 as 타입`은 "TS야, 이건 내가 보장할게, 이 타입으로 봐"라는 뜻입니다. **검사를 하는 것이 아니라 끄는 것**이라 틀리면 실행 중에 오류가 납니다.

### 9-3. ! — null 아님 단언

```ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;   // string | undefined → string
```

끝의 `!`는 "이 값은 절대 null·undefined가 아니다"라고 단언합니다. 환경 변수처럼 반드시 설정해 두는 값에 가끔 쓰지만, `as`와 마찬가지로 틀리면 TS가 막아 주지 못합니다.

> [!CAUTION]
> `as`, `!`, `any`가 많은 코드는 타입 검사를 우회하고 있다는 신호입니다. 오류를 없애려고 습관적으로 붙이지 말고, 4-3절처럼 **if로 확인해서 좁히는 방법**을 먼저 씁니다.

---

## 10. React와 Supabase에서 보는 타입

### 10-1. 컴포넌트의 props

```tsx
type TaskCardProps = {
  task: Task;
  showAssignee?: boolean;
  onSelect: (id: string) => void;
};

export function TaskCard({ task, showAssignee = false, onSelect }: TaskCardProps) {
  return (
    <button onClick={() => onSelect(task.id)}>
      {task.title}
      {showAssignee && <span>{task.assigneeId ?? "미배정"}</span>}
    </button>
  );
}

<TaskCard task={t} onSelect={(id) => console.log(id)} />;   // ✅
<TaskCard task={t} />;                                        // ❌ onSelect가 빠짐
```

매개변수 `{ task, showAssignee = false, onSelect }`는 01-3편 11-3절의 구조 분해(기본값 포함)이고, 뒤의 `: TaskCardProps`가 그 객체의 타입입니다. 컴포넌트를 쓰는 쪽에서 props를 빠뜨리거나 잘못 넘기면 바로 빨간 줄이 생깁니다.

### 10-2. state와 이벤트

```tsx
const [tasks, setTasks] = useState<Task[]>([]);              // 빈 배열로 시작하므로 타입을 적음
const [selectedId, setSelectedId] = useState<string | null>(null);
const [keyword, setKeyword] = useState("");                   // string으로 추론

<input
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}                // e의 타입은 자동 추론
/>;

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {   // 따로 뺄 때는 직접 적음
  setKeyword(e.target.value);
}
```

`React.ChangeEvent<HTMLInputElement>`는 "input 요소에서 일어난 변경 이벤트"입니다. 길어 보이지만 제네릭(6절)을 "**HTMLInputElement의** 변경 이벤트"로 읽으면 됩니다.

### 10-3. Supabase가 만들어 주는 DB 타입

Supabase CLI는 DB 구조를 읽어 TypeScript 타입 파일을 만들어 줍니다.

```bash
npx supabase gen types typescript --project-id <프로젝트ID> > lib/database.types.ts
```

```ts
import type { Database } from "@/lib/database.types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];        // SELECT 결과 한 행
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];  // INSERT할 때 모양
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];  // UPDATE할 때 모양
```

`Database["public"]["Tables"]["tasks"]["Row"]`는 "Database 타입 안의 public 스키마 안의 tasks 테이블의 행 모양"이라고 대괄호를 하나씩 따라가며 읽습니다. 01-3편 5-1절에서 객체 속성을 `task["status"]`로 꺼낸 것과 같은 모양을 **타입에** 쓴 것입니다.

| 타입 | 특징 |
| --- | --- |
| `Row` | 모든 열이 있음. 비어 있을 수 있는 열은 `\| null` |
| `Insert` | 기본값이 있는 열(id, created_at 등)은 `?` (안 넣어도 됨) |
| `Update` | 모든 열이 `?` (바꿀 것만) — `Partial`과 비슷 |

```ts
const supabase = createClient<Database>(url, key);
const { data } = await supabase.from("tasks").select("id, title");
// data는 { id: string; title: string }[] | null 로 자동 추론
```

DB에 열을 추가하면 타입 파일을 다시 만들고, 그 열을 안 쓰는 코드나 이름이 바뀐 열을 쓰는 코드가 어디인지 TS가 알려 줍니다.

---

## 11. 타입 오류 메시지 읽기

```text
Type '"DOEN"' is not assignable to type 'TaskStatus'.
Property 'dueDate' does not exist on type 'Profile'.
Property 'assigneeId' is missing in type '{ ... }' but required in type 'Task'.
Object is possibly 'null'.
'task' is possibly 'undefined'.
Argument of type 'string | null' is not assignable to parameter of type 'string'.
Expected 2 arguments, but got 1.
Cannot find name 'Taks'. Did you mean 'Task'?
```

| 메시지 | 뜻 | 고치는 법 |
| --- | --- | --- |
| is not assignable to type | 그 자리에 올 수 없는 값 | 오타·값 확인 |
| does not exist on type | 그 모양에 없는 속성 | 속성 이름이나 타입 확인 |
| is missing ... but required | 꼭 있어야 할 속성이 빠짐 | 속성 추가, 또는 타입에서 `?`로 |
| possibly 'null' / 'undefined' | 비어 있을 수 있는데 바로 썼음 | `?.`, `??`, `if (x)`로 먼저 확인 |
| `string \| null` → `string` | 비어 있을 수 있는 값을 꼭 필요한 자리에 넣음 | null일 때 처리를 먼저 함 |
| Expected N arguments | 인자 개수가 다름 | 함수 정의와 호출 비교 |
| Cannot find name | 없는 이름 | 오타, import 누락 |

> [!EXAMPLE]
> 메시지가 길 때는 **마지막 줄부터** 읽습니다. 맨 아래가 가장 구체적인 원인인 경우가 많습니다. 그리고 메시지에 나온 두 타입을 "**왼쪽 값이 오른쪽 자리에 안 맞는다**"로 읽으면 됩니다. 예를 들어 `Type 'string | null' is not assignable to type 'string'`은 "null일 수도 있는 값을, 반드시 글자여야 하는 자리에 넣었다"입니다.

### 11-1. 고쳐 보기

```ts
function initials(task: Task) {
  return task.assigneeId.slice(0, 2);
  //     ~~~~~~~~~~~~~~~ 'task.assigneeId' is possibly 'null'.
}
```

고치는 방법은 상황에 따라 다릅니다.

```ts
// 1) 비어 있으면 다른 값
return task.assigneeId?.slice(0, 2) ?? "--";

// 2) 비어 있으면 일찍 돌려주기
if (task.assigneeId === null) return "--";
return task.assigneeId.slice(0, 2);
```

두 방법 모두 **null인 경우를 코드로 처리**했기 때문에 오류가 사라집니다. `task.assigneeId!.slice(0, 2)`처럼 `!`로 오류만 지우면, 담당자가 없는 업무에서 실행 중에 터집니다.

---

## 12. 타입이 할 수 없는 일

> [!CAUTION]
> ==red:TypeScript 검사는 개발할 때만 돕습니다.== 0-3절에서 본 것처럼 실행할 때는 타입이 지워집니다. 실행 중에 사용자가 보낸 값은 타입과 상관없이 무엇이든 될 수 있습니다. `status: TaskStatus`라고 적어 두어도 누군가 `"HACKED"`를 보낼 수 있으므로, 서버에서 값을 다시 검증하고(03-1편) DB에도 CHECK 제약을 둡니다(04-3편).

```ts
// 서버가 받은 요청 본문 — 타입을 적어도 실제 값은 보장되지 않는다
const body = (await request.json()) as { status: TaskStatus };
// 누군가 { "status": "HACKED" }를 보내도 이 줄은 그대로 통과

// 그래서 실행 중에 직접 확인한다
const allowed = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
if (!allowed.includes(body.status)) {
  return new Response("잘못된 상태 값", { status: 400 });
}
```

| | TypeScript 타입 | 실행 중 검증 |
| --- | --- | --- |
| 언제 | 코드를 쓰고 빌드할 때 | 요청이 들어올 때마다 |
| 막는 것 | **개발자의** 실수 | **사용자·공격자가 보낸** 잘못된 값 |
| 어디서 | 편집기, `npm run build` | 서버 코드, DB 제약 |

---

## 13. 직접 해보기

다음 설명을 TypeScript 타입으로 옮겨 보세요.

1. 회의록(`Meeting`): id(글자), 제목(글자), 상태(`MeetingStatus`), 회의 날짜(글자), 참석자 id 목록(글자 배열), 메모(없어도 됨)
2. 회의록을 새로 만들 때 보내는 모양(`NewMeeting`): Meeting에서 id만 뺀 것
3. 회의록 id를 받아 Meeting을 돌려주는 async 함수의 **타입 표기** (본문은 비워도 됨). 못 찾으면 null

> [!HINT 1]
> 1번은 3-1절, 2번은 7절의 `Omit`, 3번은 5-4절의 `Promise<...>`와 4절의 `| null`을 합치면 됩니다.

> [!SOLUTION]
> ```ts
> type MeetingStatus = "DRAFT" | "CONFIRMED" | "ARCHIVED";
>
> type Meeting = {
>   id: string;
>   title: string;
>   status: MeetingStatus;
>   meetingDate: string;
>   attendeeIds: string[];
>   memo?: string;
> };
>
> type NewMeeting = Omit<Meeting, "id">;
>
> async function loadMeeting(id: string): Promise<Meeting | null> {
>   // ...
>   return null;
> }
> ```

> [!QUIZ]
> 아래 타입에서 `assigneeId`와 `memo`의 차이를 말하고, `{ id: "t-1", title: "A", assigneeId: null }`이 이 타입에 맞는지 답하세요.
> `type T = { id: string; title: string; assigneeId: string | null; memo?: string };`

> [!ANSWER]
> `assigneeId`는 **반드시 있어야 하는** 속성이며 값으로 글자나 null을 허용합니다. `memo`는 **없어도 되는** 속성입니다. 주어진 객체는 assigneeId가 null로 있고 memo가 없으므로 이 타입에 맞습니다.

> [!QUIZ]
> `Promise<Pick<Task, "id" | "title">[]>`를 말로 풀어 보세요.

> [!ANSWER]
> "Task에서 id와 title만 뽑은 객체들의 배열을 나중에 돌려주는 약속". async 함수가 업무 목록의 id·제목만 돌려줄 때의 반환 타입입니다. 안쪽부터 읽으면 쉽습니다. `Pick<Task, ...>` → 그것의 배열 `[]` → 그것을 주는 약속 `Promise<...>`.

> [!QUIZ]
> 다음 코드에서 오류가 나는 줄을 모두 고르고 이유를 쓰세요.
> ```ts
> let count = 0;
> count = "1";
> const status: TaskStatus = "REVIEW";
> const role: Role = "ADMIN";
> const tags: string[] = ["축제", 2];
> ```

> [!ANSWER]
> 2번째 줄: `count`는 처음 넣은 0 때문에 number로 추론되어 글자 `"1"`을 넣을 수 없습니다. 4번째 줄: `"ADMIN"`은 Role 유니언에 없는 값입니다. 5번째 줄: 글자 배열에 숫자 2가 들어 있습니다. 3번째 줄 `"REVIEW"`는 TaskStatus에 있으므로 괜찮습니다.

> [!QUIZ]
> `function f(x: string | null) { return x.length; }`에서 나는 오류의 이름을 말하고, 오류가 없도록 두 가지 방법으로 고치세요.

> [!ANSWER]
> `'x' is possibly 'null'.` 오류입니다. 방법 1: `return x?.length ?? 0;` 방법 2: `if (x === null) return 0; return x.length;` 두 방법 모두 null인 경우를 직접 처리해서 TS가 타입을 좁힐 수 있게 합니다.

> [!QUIZ]
> 타입에 `status: TaskStatus`라고 적어 두었는데도 서버에서 값을 다시 확인해야 하는 이유는 무엇인가요?

> [!ANSWER]
> 타입은 빌드할 때만 검사되고 실행 코드에서는 지워지기 때문입니다. 사용자가 브라우저 개발자 도구나 다른 프로그램으로 직접 요청을 보내면 `"HACKED"` 같은 값도 그대로 서버에 도착합니다. 그래서 서버 코드에서 허용 값인지 확인하고, DB에도 CHECK 제약을 둡니다.

---

## 핵심 정리

| 주제 | 꼭 기억할 것 |
| --- | --- |
| TS란 | JavaScript + 타입. 실행 전에 검사하고, 실행할 때는 타입이 지워짐 |
| 기본 표기 | `이름: 타입`. 값을 바로 넣는 변수는 추론, 매개변수는 직접 적기 |
| any | 검사를 끄므로 쓰지 않는다. 모르는 값은 `unknown` |
| 배열·객체 | `Task[]`는 Task의 배열. `type Task = { ... }`로 모양에 이름 |
| `?` vs `\| null` | `?`는 속성이 없어도 됨, `\| null`은 속성은 있고 값이 비어도 됨 |
| 유니언 | `"TODO" \| "DONE"`처럼 허용 값만 나열. 오타를 실행 전에 잡음 |
| 좁히기 | if·typeof·switch로 확인하면 그 블록 안에서 타입이 줄어듦 |
| 함수 | `(a: A) => B`는 A를 받아 B를 돌려주는 함수. async는 `Promise<B>` |
| 제네릭 | `<T>`는 "T의". `Promise<Task[]>`는 Task 배열을 주는 약속 |
| 도우미 타입 | Partial(일부만), Pick(골라서), Omit(빼고), Record(키→값) |
| 우회 표기 | `as`, `!`, `any`는 검사를 끈다. 먼저 if로 좁히기 |
| 한계 | 타입은 개발자 실수만 막는다. 사용자 입력은 서버·DB에서 다시 검증 |

## 학습 경로

[← 01-3 JavaScript 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-03) · [01-5 프론트엔드·백엔드·DB 역할 분담 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-05)
