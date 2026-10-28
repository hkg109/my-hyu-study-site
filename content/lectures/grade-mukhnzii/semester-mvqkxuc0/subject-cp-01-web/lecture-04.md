---
title: "01-4 · TypeScript 읽기"
description: "타입 표기, type과 interface, 유니언 타입, 선택 속성과 null, 배열·함수·제네릭 타입 읽는 법을 익히고, 기획서의 Task·Membership·회의록 상태를 TypeScript 타입으로 옮겨 보며 타입 오류 메시지를 해석합니다."
order: 4
published: true
duration: 45
tags: [TypeScript, 타입, 유니언, 제네릭, Supabase 타입]
objectives:
  - 변수·매개변수·반환값의 타입 표기를 읽는다.
  - 유니언 타입으로 상태 값을 제한하는 이유를 말한다.
  - '선택 속성(?), null 허용(| null), 제네릭 꺾쇠(<T>)를 읽는다.'
  - 타입 검사가 실행 중 보안을 대신하지 못하는 이유를 설명한다.
---

## 1. TypeScript는 "값의 모양"을 적어 둔 JavaScript

TypeScript(TS)는 JavaScript에 **타입**(값의 모양)을 덧붙인 언어입니다. 실행 전에 "이 자리에 이 모양의 값이 오는가"를 검사해서 실수를 일찍 찾습니다. 브라우저에서 실행될 때는 타입 부분이 지워진 평범한 JavaScript가 됩니다.

```ts
const title: string = "축제 부스 배치도";
let openCount: number = 3;
const isActive: boolean = true;

openCount = "세 개";   // ❌ 오류: string을 number 자리에 넣을 수 없음
```

`이름: 타입`을 "이름은 이런 모양이다"로 읽습니다. 대부분은 TS가 알아서 추론하므로 실제 코드에서는 생략되는 경우가 많습니다.

```ts
const title = "축제 부스 배치도";   // 자동으로 string
```

## 2. 객체의 모양 — type과 interface

```ts
type Task = {
  id: string;
  title: string;
  status: TaskStatus;
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
| `interface Profile { ... }` | 거의 같은 기능. 이 프로젝트는 주로 `type`을 씀 |
| `assigneeId: string \| null` | 글자이거나 null. **속성은 반드시 있음** |
| `dueDate?: string` | 글자이거나 **속성 자체가 없음** |
| `string[]` | 글자의 배열. `Array<string>`과 같음 |

> [!NOTE]
> `| null`과 `?`의 차이: DB에서 가져온 행은 열이 항상 있고 값만 비어 있으므로 `| null`로 적습니다. 폼 입력처럼 키 자체가 없을 수 있는 경우에 `?`를 씁니다.

## 3. 유니언 — 허용하는 값만 나열하기

기획서의 상태 값을 그대로 타입으로 옮깁니다.

```ts
type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
type Role = "MEMBER" | "DIRECTOR" | "EXECUTIVE";
type TermStatus = "DRAFT" | "ACTIVE" | "CLOSED";
type MeetingStatus = "DRAFT" | "CONFIRMED" | "ARCHIVED";
type VisibilityMode = "DEFAULT" | "RESTRICTED";

const s: TaskStatus = "DOEN";   // ❌ 오타를 바로 잡아 준다
```

`|`는 "또는"입니다. 네 글자 외의 값을 넣으면 코드를 실행하기도 전에 편집기에 빨간 줄이 생깁니다.

### 유니언을 좁혀 가며 읽기

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

나중에 상태에 `"BLOCKED"`를 추가하면, TS가 이 `switch`에 빠진 경우가 있다고 알려 줍니다. 상태 하나 추가가 화면 전체에 어떤 영향을 주는지 **컴파일러가 찾아 주는** 셈입니다.

## 4. 함수의 타입

```ts
function canEditTask(role: Role, isAssignee: boolean): boolean {
  if (role === "EXECUTIVE") return true;
  return isAssignee;
}

const formatDue = (date: string | null): string => date ?? "마감 없음";
```

| 부분 | 읽는 법 |
| --- | --- |
| `(role: Role, isAssignee: boolean)` | Role 하나와 boolean 하나를 받는다 |
| `): boolean` | boolean을 돌려준다 |
| `Promise<Task[]>` | 나중에 Task 배열을 주는 약속 (async 함수의 반환 타입) |
| `void` | 돌려주는 값이 없음 |

```ts
async function loadTasks(): Promise<Task[]> { /* ... */ }
```

## 5. 제네릭 — 꺾쇠 안은 "무엇의"

`<T>`는 "어떤 타입이든 끼울 수 있는 자리"입니다. 읽을 때는 "**T의**"로 읽으면 됩니다.

```ts
const ids: Array<string> = ["t-1", "t-2"];       // string의 배열
const pending: Promise<Task> = loadOne("t-1");   // Task를 주는 약속
const byId: Record<string, Task> = {};           // 글자 키 → Task 값인 객체

type Result<T> = { data: T | null; error: string | null };
const r: Result<Task[]> = { data: [], error: null };   // Task 배열을 담는 결과
```

React에서는 이렇게 보입니다.

```tsx
const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL");
// filter는 TaskStatus이거나 "ALL"인 상태값
```

## 6. 자주 보는 도우미 타입

| 표기 | 뜻 | 예 |
| --- | --- | --- |
| `Partial<Task>` | 모든 속성이 선택 | 일부만 고치는 수정 요청 |
| `Pick<Task, "id" \| "title">` | 일부 속성만 | 목록 카드에 필요한 것만 |
| `Omit<Task, "id">` | 일부 속성 빼고 | 새로 만들 때(아직 id 없음) |
| `Readonly<Task>` | 바꿀 수 없음 | 화면에 넘기는 값 |
| `as const` | 값을 글자 그대로 고정 | `["TODO", "DONE"] as const` |

## 7. Supabase가 만들어 주는 DB 타입

Supabase CLI는 DB 구조를 읽어 TypeScript 타입 파일을 만들어 줍니다.

```bash
npx supabase gen types typescript --project-id <프로젝트ID> > lib/database.types.ts
```

```ts
import type { Database } from "@/lib/database.types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];        // SELECT 결과 한 행
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];  // INSERT할 때 모양
```

`Database["public"]["Tables"]["tasks"]["Row"]`는 "Database 타입 안의 public 스키마 안의 tasks 테이블의 행 모양"이라고 대괄호를 하나씩 따라가며 읽습니다. DB에 열을 추가하면 타입 파일을 다시 만들고, 그 열을 안 쓰는 코드가 어디인지 TS가 알려 줍니다.

## 8. 타입 오류 메시지 읽기

```text
Type '"DOEN"' is not assignable to type 'TaskStatus'.
Property 'dueDate' does not exist on type 'Profile'.
Object is possibly 'null'.
Argument of type 'string | null' is not assignable to parameter of type 'string'.
```

| 메시지 | 뜻 | 고치는 법 |
| --- | --- | --- |
| is not assignable to type | 그 자리에 올 수 없는 값 | 오타·값 확인 |
| does not exist on type | 그 모양에 없는 속성 | 속성 이름이나 타입 확인 |
| possibly 'null' | null일 수 있는데 바로 썼음 | `?.`, `??`, `if (x)`로 먼저 확인 |
| `string \| null` → `string` | 비어 있을 수 있는 값을 꼭 필요한 자리에 넣음 | null일 때 처리를 먼저 함 |

> [!CAUTION]
> ==red:TypeScript 검사는 개발할 때만 돕습니다.== 실행 중에 사용자가 보낸 값은 타입과 상관없이 무엇이든 될 수 있습니다. `status: TaskStatus`라고 적어 두어도 누군가 `"HACKED"`를 보낼 수 있으므로, 서버에서 값을 다시 검증하고(03-1편) DB에도 CHECK 제약을 둡니다(04-3편).

> [!QUIZ]
> 아래 타입에서 `assigneeId`와 `memo`의 차이를 말하고, `{ id: "t-1", title: "A", assigneeId: null }`이 이 타입에 맞는지 답하세요.
> `type T = { id: string; title: string; assigneeId: string | null; memo?: string };`

> [!ANSWER]
> `assigneeId`는 **반드시 있어야 하는** 속성이며 값으로 글자나 null을 허용합니다. `memo`는 **없어도 되는** 속성입니다. 주어진 객체는 assigneeId가 null로 있고 memo가 없으므로 이 타입에 맞습니다.

> [!QUIZ]
> `Promise<Pick<Task, "id" | "title">[]>`를 말로 풀어 보세요.

> [!ANSWER]
> "Task에서 id와 title만 뽑은 객체들의 배열을 나중에 돌려주는 약속". async 함수가 업무 목록의 id·제목만 돌려줄 때의 반환 타입입니다.

## 학습 경로

[← 01-3 JavaScript 읽기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-03) · [01-5 프론트엔드·백엔드·DB 역할 분담 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-05)
