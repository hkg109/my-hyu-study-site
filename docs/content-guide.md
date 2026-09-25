# 콘텐츠 관리 안내

## 관리자 화면에서 관리하기

로컬에서 `npm run dev`를 실행한 뒤 헤더의 `관리자` 버튼으로 관리자 모드를 켭니다.

왼쪽 메뉴에서 다음 작업을 할 수 있습니다.

- `COURSE NOTES` 옆 `+`: 학년 추가
- 학년 옆 `+`: 해당 학년에 학기 추가
- 학기 옆 `+`: 해당 학기에 과목 추가
- 과목 옆 `+`: 해당 과목에 강의 노트 추가
- 각 분류 옆 연필: 화면에 표시되는 이름 수정

새 강의 노트를 만들면 Markdown 파일과 필수 frontmatter가 자동 생성되고 해당 편집 화면으로 이동합니다.

## 강의 노트 파일

새 파일은 다음 위치에 생성됩니다.

```text
content/lectures/<gradeId>/<semesterId>/<subjectId>/lecture-01.md
```

예시:

```md
---
title: 행렬의 기본 연산
description: 행렬의 덧셈과 곱셈을 정리합니다.
order: 1
published: true
tags:
  - 선형대수
objectives:
  - 행렬의 기본 연산을 설명할 수 있다.
---

# 행렬의 기본 연산

여기에 학습 내용을 작성합니다.
```

- `order`: 같은 과목 안의 강의 순서
- `published`: `true`인 문서만 사이트에 표시
- `description`, `tags`, `objectives`, `duration`: 선택 항목
- 분류 이름은 파일에 복사하지 않고 `catalog.json`의 안정적인 ID로 연결되므로 이름을 수정해도 기존 URL이 유지됩니다.

## 족보 파일

족보 탭도 강의 정리와 같은 학년·학기·과목 카테고리를 사용합니다. 관리자 모드에서 원하는 과목의 `+` 버튼을 누르면 `content/practice/<gradeId>/<semesterId>/<subjectId>/exam-01.md` 형식으로 생성됩니다. `.mdx` 파일은 족보로 불러오지 않으며, 제목, 설명과 본문은 관리자 화면에서 수정할 수 있습니다. 일반 Markdown 파일은 MD로 처리하고, 기존 `<Answer>` 같은 확장 컴포넌트가 포함된 `.md`만 호환을 위해 자동으로 확장 문법을 해석합니다.

```md
---
title: 과목 중간고사 족보
description: 중간고사 문제와 해설입니다.
week: 1
order: 1
published: true
---

## 문제 1

문제 내용을 작성합니다.

<Answer>

해설을 작성합니다.

</Answer>
```

내부 호환성을 위해 족보 파일명과 `week` 값은 기존 형식을 유지하지만, 사이트 화면에는 주차 표현이 표시되지 않습니다.

## 작성 시 주의사항

- ID와 파일명은 소문자 영문, 숫자, 하이픈만 사용합니다.
- 같은 과목 안에서 `order`를 중복해서 사용하지 않습니다.
- 새 분류와 노트 생성은 로컬 관리자 모드에서 수행합니다.
- `catalog.json`의 `id`를 직접 바꾸면 기존 URL과 파일 연결이 끊어질 수 있으므로 화면에서는 이름만 수정합니다.
- `lib/weeks.generated.json`은 기존 노트 호환용 자동 생성 파일이므로 직접 수정하지 않습니다.
