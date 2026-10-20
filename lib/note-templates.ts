// Every note template lives here. The admin dialog previews these bodies and the create API
// accepts only these ids, so adding or editing a template is a change to this file alone.
// Bodies use the site's existing study syntax (see docs/content-guide.md) so the usual
// quiz, hint and answer renderers handle them.

export type TemplateKind = "lectures" | "practice";

export interface NoteTemplate {
  id: string;
  label: string;
  description: string;
  kinds: TemplateKind[];
  /** The sections the body starts with, shown before creating. */
  outline: string[];
  body: (kind: TemplateKind) => string;
}

const examInfo = `## 시험 정보

| 항목 | 내용 |
| --- | --- |
| 출처 | 예: 2025학년도 1학기 중간고사 (복원) |
| 연도 | 2025 |
| 시험 범위 | 예: 1~4장 |
`;

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "blank",
    label: "빈 노트",
    description: "필수 정보와 최소한의 본문만 만듭니다. 구조를 직접 잡을 때 고르세요.",
    kinds: ["lectures", "practice"],
    outline: ["필수 메타데이터", "본문 시작 문단"],
    body: kind => kind === "practice" ? "## 문제 1\n\n여기에 문제를 작성하세요.\n" : "## 개요\n\n여기에 학습 내용을 작성하세요.\n",
  },
  {
    id: "lecture-summary",
    label: "강의 정리",
    description: "수업 한 회차를 목표 → 개념 → 예제 → 확인 문제 → 요약 순서로 정리합니다.",
    kinds: ["lectures"],
    outline: ["학습 목표", "핵심 개념", "예제", "헷갈리는 점", "확인 문제", "요약"],
    body: () => `## 학습 목표

- 이 단원을 마치면 무엇을 설명할 수 있는지 적습니다.
- 두 번째 목표를 적습니다.

## 핵심 개념

> [!DEFINITION]
> **용어**: 정의를 한 문장으로 적습니다.

설명을 이어서 적습니다. 꼭 기억할 부분은 ==형광펜==으로 표시합니다.

## 예제

> [!EXAMPLE]
> 예제 상황이나 문제를 적습니다.

> [!SOLUTION]
> 풀이 과정을 단계별로 적습니다.

## 헷갈리는 점

> [!TRAP]
> 자주 틀리는 부분과 그 이유를 적습니다.

## 확인 문제

> [!QUIZ]
> 배운 내용을 확인하는 질문을 적습니다.

> [!ANSWER]
> 정답과 짧은 해설을 적습니다.

## 요약

- 핵심 내용 1
- 핵심 내용 2
`,
  },
  {
    id: "coding-assignment",
    label: "코딩 과제",
    description: "문제 설명부터 코드, 복잡도, 주의할 점까지 과제 풀이를 한 문서로 남깁니다.",
    kinds: ["lectures"],
    outline: ["문제 설명", "입력·출력 예시", "접근 방법", "코드", "시간·공간 복잡도", "주의할 점"],
    body: () => `## 문제 설명

무엇을 입력받아 무엇을 출력해야 하는지 적습니다.

## 입력·출력 예시

**입력**

\`\`\`text
3 5
\`\`\`

**출력**

\`\`\`text
8
\`\`\`

## 접근 방법

> [!HINT 1]
> 처음 떠올릴 수 있는 방향을 적습니다.

> [!HINT 2]
> 핵심 아이디어를 조금 더 구체적으로 적습니다.

## 코드

\`\`\`cpp
#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << a + b << '\\n';
}
\`\`\`

## 시간·공간 복잡도

- 시간: O(1)
- 공간: O(1)

## 주의할 점

> [!CAUTION]
> 경계값, 자료형 범위처럼 놓치기 쉬운 부분을 적습니다.
`,
  },
  {
    id: "exam-multiple-choice",
    label: "객관식 족보",
    description: "보기를 고르고 ‘정답 확인’으로 채점하는 객관식 문제 세트입니다. 정답·해설은 접혀 있습니다.",
    kinds: ["practice"],
    outline: ["출처·연도·시험 범위", "문제와 보기", "선택형 정답 확인", "접힌 정답·해설"],
    body: () => `${examInfo}
## 문제 1

> [!QUIZ]
> 질문을 적습니다.
>
> **A.** 첫 번째 보기
>
> **B.** 두 번째 보기
>
> **C.** 세 번째 보기
>
> **D.** 네 번째 보기

> [!ANSWER]
> B. 정답 보기의 기호를 맨 앞에 적으면 선택형 정답 확인이 켜집니다.
>
> **해설**: 왜 정답인지, 다른 보기는 왜 틀렸는지 적습니다.

## 문제 2

> [!QUIZ]
> 다음 질문을 적습니다.
>
> **A.** 첫 번째 보기
>
> **B.** 두 번째 보기
>
> **C.** 세 번째 보기
>
> **D.** 네 번째 보기

> [!ANSWER]
> A. 정답 보기
>
> **해설**: 해설을 적습니다.
`,
  },
  {
    id: "exam-essay",
    label: "서술형 족보",
    description: "단계별 힌트를 거쳐 모범 답안과 채점 기준을 확인하는 서술형 문제입니다. 답안은 접혀 있습니다.",
    kinds: ["practice"],
    outline: ["출처·연도·시험 범위", "문제", "단계별 힌트", "접힌 모범 답안·해설", "채점 기준"],
    body: () => `${examInfo}
## 문제 1

> [!QUIZ]
> 서술형 질문을 적습니다. (배점: 10점)

> [!HINT 1]
> 어디서부터 생각하면 되는지 적습니다.

> [!HINT 2]
> 답안에 들어가야 할 핵심 개념을 적습니다.

> [!ANSWER]
> **모범 답안**
>
> 모범 답안을 적습니다.
>
> **해설**
>
> 답안의 근거와 자주 하는 실수를 적습니다.
>
> **채점 기준**
>
> | 기준 | 배점 |
> | --- | --- |
> | 핵심 개념을 정확히 설명함 | 6점 |
> | 예시나 근거를 제시함 | 4점 |
`,
  },
];

export const templatesFor = (kind: TemplateKind) => NOTE_TEMPLATES.filter(template => template.kinds.includes(kind));
export const findTemplate = (kind: TemplateKind, id: unknown) => templatesFor(kind).find(template => template.id === id);
export const defaultTemplateId = (kind: TemplateKind) => kind === "practice" ? "exam-multiple-choice" : "lecture-summary";
