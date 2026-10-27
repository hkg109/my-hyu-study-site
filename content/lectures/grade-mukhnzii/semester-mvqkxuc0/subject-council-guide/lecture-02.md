---
title: "2 · Git 협업과 화면 기술"
description: "Issue부터 Merge까지 GitHub로 변경을 합치는 흐름, HTML·CSS·JavaScript·TypeScript의 역할 분담, React Component와 Next.js App Router에서 서버와 브라우저의 경계를 학생회 업무 화면으로 익힙니다."
order: 2
published: true
duration: 50
tags: [Git, GitHub, Pull Request, TypeScript, React, Next.js, 접근성]
objectives:
  - Issue → Branch → Commit → Pull Request → 리뷰 → Merge 흐름과 팀 규칙을 설명한다.
  - HTML·CSS·JavaScript·TypeScript가 각각 무엇을 맡는지 구분한다.
  - Props와 State, 목록 화면의 다섯 상태를 업무 목록으로 설명한다.
  - Server Component·Client Component·Server Action 중 어디에 비밀 값이 들어가면 안 되는지 말한다.
---

## 학습 경로

[← 1편 서비스 전체 그림](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-01) · [3편 데이터베이스와 로그인 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-03)

2부는 개발을 시작하기 위한 공통 지식이다. 이 편은 **함께 일하는 법**(Git)과 **사용자가 보는 화면**을 다룬다.

## 1. Git과 GitHub로 변경을 합치는 법

**Git**은 파일 변경 이력을 기록하고, **GitHub**는 그 기록을 팀과 공유하며 검토하는 장소다. 처음에는 GitHub Desktop 화면으로 흐름을 익혀도 된다.

| 용어 | 쉬운 뜻 | 팀에서 쓰는 순간 |
| --- | --- | --- |
| Repository | 프로젝트 전체 저장소 | 코드와 문서를 함께 보관 |
| Issue | 할 일·오류·결정 기록 | 기능의 목적과 완료 기준 작성 |
| Branch | 다른 작업과 분리한 변경 줄기 | 한 작업을 독립적으로 수정 |
| Commit | 의미 있는 변경 한 번의 기록 | 바꾼 이유를 메시지로 남김 |
| Pull Request | 변경을 검토받아 합치자는 요청 | 코드 차이와 테스트 결과 공유 |
| Merge Conflict | 같은 부분을 다르게 고쳐 선택이 필요한 상태 | 두 변경의 목적을 읽고 함께 해결 |

[![Issue, Branch, Commit, Pull Request, 리뷰, Merge의 여섯 단계를 위에서 아래로 놓고, 리뷰에서 수정 요청이 나오면 Commit으로 되돌아가는 고리를 그린 흐름. Pull Request가 검토의 중심으로 강조되어 있다.](/materials/diagrams/cpg-02a-git-flow.svg)](/materials/diagrams/cpg-02a-git-flow.svg)

*그림 2-1 · 변경 하나가 main에 들어가는 길 — 누르면 원본 크기로 열린다.*

> [!EXAM]
> **팀 최소 규칙 다섯 가지**
>
> 1. ==main Branch는 항상 실행 가능한 상태==로 둔다.
> 2. 한 Pull Request에는 검토할 수 있는 **작은 변경**을 담는다.
> 3. DB 마이그레이션과 RLS 정책은 **작성자 외 한 명**이 검토한다.
> 4. ==red:비밀 키와 실제 학생 개인정보는 Commit하지 않는다.==
> 5. Pull Request에는 실행 방법, 화면 결과, 허용·거부 테스트 결과를 남긴다.

두 사람이 같은 파일의 같은 부분을 다르게 고치면 **충돌**(Merge Conflict)이 난다. Git이 어느 쪽이 옳은지 스스로 결정하지 못한다는 뜻이다. 두 작업의 목적을 확인하고 필요한 내용을 합친 뒤, 기능을 다시 실행해 본다.

### 직접 해보기

연습 Repository에 README를 만든다. 각자 Branch에서 한 문단을 추가하고 Pull Request를 만든 뒤, 다른 팀원이 변경 내용을 읽고 댓글을 남긴다. 일부러 두 사람이 같은 줄을 고쳐 충돌도 한 번 해결해 본다.

> [!QUIZ]
> 이 절을 끝냈다고 말할 수 있는 기준은?

> [!ANSWER]
> 팀원 **모두**가 Issue·Branch·Commit·Pull Request·리뷰·Merge를 한 번씩 직접 해 봤고, 충돌이 났을 때 “두 변경의 목적을 읽고 합친 뒤 다시 실행한다”는 순서를 말할 수 있다.

## 2. HTML·CSS·JavaScript·TypeScript

네 가지 역할을 먼저 구분한다.

| 기술 | 맡는 것 | 업무 생성 폼에서 |
| --- | --- | --- |
| **HTML** | 화면 내용의 의미와 구조 | 제목 입력창, 저장 버튼, label |
| **CSS** | 글자 크기·여백·색·배치·모바일 대응 | 폼 배치, 오류 문구 색 (Tailwind CSS는 미리 만든 스타일 클래스를 조합) |
| **JavaScript** | 클릭과 입력에 반응하고 값 처리 | 빈 제목이면 저장 막기 |
| **TypeScript** | 데이터의 예상 형태를 적어 실수를 일찍 발견 | Task의 필드와 상태 값 정의 |

JavaScript에서 **변수**는 값을 담는 이름, **배열**은 여러 값의 순서 있는 묶음, **객체**는 이름이 붙은 값의 묶음, **함수**는 반복할 동작이다. **조건문**은 “제목이 비었으면 저장을 막는다” 같은 분기를 만든다.

```ts
type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId: string | null; // 담당자가 아직 없을 수 있다
};
```

위 코드는 Task 데이터의 예상 형태다. `status`에는 네 값 외에 다른 글자가 들어가면 개발 중에 오류가 난다.

> [!CAUTION]
> ==red:TypeScript가 오류를 잡아도 사용자가 실제로 보낸 값은 서버에서 다시 검증해야 한다.== TypeScript 검사는 개발할 때만 돌고, 사용자는 브라우저의 검사를 우회해 아무 값이나 보낼 수 있다.

**async/await**는 DB 요청처럼 시간이 걸리는 일을 기다릴 때 쓰는 문법이다. 저장 중에는 진행 상태를 보여 주고 **중복 제출을 막는다**. 실패하면 사용자가 입력한 값을 잃지 않고 다시 시도할 수 있게 한다.

### 접근성은 처음부터

- 입력창의 제목은 글자만 옆에 놓지 않고 실제 입력창에 연결된 **label**로 표시한다.
- 키보드 Tab으로 이동하고 Enter로 제출할 수 있어야 한다.
- 상태는 색만으로 구분하지 않고 “진행 중”, “완료”라는 **글자**를 함께 보여 준다.

### 직접 해보기

업무 생성 폼을 종이에 그리고 필수 항목, 선택 항목, 각 값의 종류(글자·날짜·선택지), 빈 제목과 연결 실패 때의 오류 문구를 적는다.

## 3. React와 Next.js로 화면을 나누기

React는 큰 화면을 작은 **Component**로 나눈다. `TaskCard`는 업무 하나를 표시하는 화면 조각이다.

- 카드에 **전달하는** 제목·상태는 **Props**다.
- 화면에서 고른 필터처럼 **바뀌는** 값은 **State**다.

업무 목록에는 적어도 다섯 상태가 있다. 다섯 가지 모두 화면을 미리 만든다.

| 상태 | 사용자에게 보여 줄 것 |
| --- | --- |
| 로딩 | 데이터를 불러오는 중이라는 안내 |
| 목록 | 권한이 있는 업무와 필요한 조작 |
| 빈 목록 | 아직 업무가 없다는 안내와 다음 행동 |
| 오류 | 실패 이유와 다시 시도하는 방법 |
| 권한 없음 | 접근할 수 없다는 분명한 안내 |

Next.js **App Router**는 폴더와 `page.tsx`로 주소를 만든다.

```text
app/
  dashboard/page.tsx         → /dashboard
  tasks/page.tsx             → /tasks
  tasks/[taskId]/page.tsx    → /tasks/123
  events/[eventId]/page.tsx  → /events/456
```

대괄호 폴더 `[taskId]`는 주소의 그 자리에 어떤 ID든 들어올 수 있다는 뜻이다.

### 서버와 브라우저의 경계

[![위쪽 브라우저 영역의 Client Component와 아래쪽 서버 영역의 Server Component·Server Action, 그 아래 RLS가 걸린 Supabase DB를 놓고, 네트워크 경계 위로 넘어간 값은 사용자가 볼 수 있으므로 비밀 키는 서버에만 둔다는 그림](/materials/diagrams/cpg-02b-server-client.svg)](/materials/diagrams/cpg-02b-server-client.svg)

*그림 2-2 · 브라우저와 서버의 경계 — 누르면 원본 크기로 열린다.*

- **Server Component:** 서버에서 데이터를 준비해 화면을 만든다.
- **Client Component:** 버튼·입력·편집기처럼 브라우저에서 즉시 반응해야 할 때 쓴다.
- **Server Action(서버 함수):** 폼 제출 등을 서버에서 처리한다. 여기서 입력값을 다시 검증한다.

==red:비밀 값이 어디서 실행되는 코드에 들어가는지 늘 구분한다.== Client Component에 넣은 값은 사용자에게 그대로 전달된다.

> [!CAUTION]
> Next.js는 버전마다 API와 규칙이 바뀐다. 실제 코드를 쓸 때는 설치된 버전의 공식 문서(9편의 링크)를 먼저 확인한다.

### 작게 쌓아 올리기

1. 가짜 업무 목록을 화면에 표시한다.
2. 실제 DB 조회로 바꾼다.
3. 업무 저장 폼을 연결한다.

화면·DB·복잡한 권한을 한꺼번에 붙이면 오류가 어디서 났는지 찾기 어렵다.

### 직접 해보기

`TaskCard`, `TaskList`, `FilterBar`를 종이에 그린다. 업무가 0개·3개일 때와 로딩·오류일 때의 화면을 각각 만든다.

> [!QUIZ]
> 업무 목록 화면에서 Props와 State의 예를 하나씩 들어 보라.

> [!ANSWER]
> **Props:** `TaskList`가 `TaskCard`에 넘기는 업무 제목·상태·담당자 이름. 카드는 받은 값을 보여 주기만 한다.
>
> **State:** `FilterBar`에서 사용자가 고른 “진행 중만 보기” 같은 필터 값. 사용자가 바꾸면 목록이 다시 그려진다.

> [!QUIZ]
> Supabase의 Service Role Key를 Client Component에서 쓰면 왜 안 되나?

> [!ANSWER]
> Client Component의 코드와 값은 브라우저로 전달되므로 사용자가 키를 볼 수 있다. Service Role Key는 RLS를 우회하는 관리자 권한이라, 노출되면 누구나 모든 테이블을 읽고 쓸 수 있다. 이런 키는 서버(Server Action·서버 작업)에만 둔다.
