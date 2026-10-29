---
title: "05 · React UI: 컴포넌트·state·폼"
description: "실제 로그인 화면과 공용 UI를 읽으며 컴포넌트·props·state·폼, 네 가지 화면 상태와 접근성 점검을 익힙니다."
order: 0
published: true
duration: 50
tags: [React, Component, props, state, form, accessibility]
objectives:
  - 화면 전용 Component와 공용 UI의 경계를 설명한다.
  - 입력·제출 중·실패 상태를 안전하게 갱신한다.
  - 브라우저 검증과 서버·DB 검증의 역할을 구별한다.
  - 키보드와 375px에서 폼의 다음 행동을 점검한다.
---

## 1. 이 강의가 필요한 순간

로그인·업무 생성·상태 변경 화면 Issue에서 state를 어디에 둘지, 저장 중 중복 클릭을 어떻게 막을지, 오류를 어떻게 읽히게 할지 판단할 때 봅니다. [웹앱 지도](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01)와 [Next.js](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00)를 먼저 읽습니다.

> [!CONCEPT]
> **목표:** 실제 `src/app/login/google-login-button.tsx`를 읽고, 입력·제출 중·실패·성공 상태와 서버 검증의 경계를 설명한다.

## 2. Component·props·state의 경계

Component는 화면 조각, props는 부모가 준 읽기 전용 값, state는 사용자 행동 뒤 다시 그릴 값입니다. `tasks.length`처럼 이미 받은 값에서 계산할 수 있는 것은 state로 중복 저장하지 않습니다. 목록에는 배열 index가 아니라 안정적인 ID를 `key`로 씁니다.

플랫폼은 여러 화면에서 쓰는 `Button`, `Alert`, `EmptyState`, `PageHeader`를 `src/components/ui/`에 둡니다. 이는 리드 관리 공용 파일이므로 팀원은 비슷한 것을 새로 만들거나 고치지 않고 Issue 댓글로 요청합니다. 화면 하나만 쓰는 부품은 해당 `src/app/<route>/`에 둡니다.

```tsx
// 실제 GoogleLoginButton의 핵심 흐름을 축약한 코드
"use client";
const [pending, setPending] = useState(false);
const [failed, setFailed] = useState(false);

async function handleClick() {
  setPending(true); setFailed(false);
  const { error } = await createClient().auth.signInWithOAuth({ provider: "google" });
  if (error) { setPending(false); setFailed(true); }
}
// disabled={pending}, 실패 문구는 <p role="alert">로 렌더링
```

성공하면 Google로 이동하므로 state를 되돌리지 않습니다. 실패했을 때만 버튼을 다시 쓸 수 있게 하고 오류를 텍스트로 알립니다. 로그인 selector의 `hd`는 계정 선택 힌트이며 실제 학교 계정 검사는 Auth Hook이 합니다.

## 3. 폼과 화면 상태 네 가지

`label`은 `htmlFor`로 input과 연결하고, 필수 입력·형식은 브라우저에서 빠르게 알려 줍니다. 그러나 Server Action과 RPC·RLS는 클라이언트 값을 신뢰하지 않으므로 길이·권한·상태를 다시 검사합니다. 화면 상태는 다음처럼 분리합니다.

| 상태 | 실제 표현/다음 행동 |
| --- | --- |
| 로딩 | `disabled`, “Google로 이동하는 중…” 또는 route fallback |
| 빈 목록 | 공용 `EmptyState`와 만들기/필터 해제 행동 |
| 오류 | `Alert` 또는 `role="alert"`와 재시도 안내 |
| 권한 없음 | `notFound()`의 “찾을 수 없거나 볼 권한이 없습니다” |

색만으로 오류를 전하지 않습니다. 다른 주소로 이동하면 `Link`, 현재 상태를 바꾸면 `<button>`입니다. 로그인 화면 `LoginError`는 URL의 `?error=`를 읽어 `role="alert"`로 안내합니다.

## 4. 따라 하기

1. Issue에서 허용한 form 파일과 기존 `Button`·`Alert` 사용 사례를 찾습니다.
2. 가짜 값으로 정상 제출, 빈 값, 서버 거부, 권한 없는 계정 결과를 분리해 적습니다.
3. 제출 중 버튼이 비활성화되고 같은 요청을 두 번 보내지 않는지 확인합니다.
4. Tab·Shift+Tab·Enter로 모든 행동에 도달하고, 375px에서 focus 표시·오류 문구·긴 버튼이 보이는지 확인합니다.

성공은 “클라이언트 검증을 지나도 서버가 재검증한다”, “실패 뒤 재시도 가능”, “권한 없음은 오류와 다른 경로”를 Preview에서 보인 것입니다.

## 5. 직접 해보기와 흔한 실수

허용된 폼에서 “필수 입력이 비어 있음” 상태를 추가로 점검해 보세요. 성공 기준은 label·키보드 focus·`role="alert"`·pending 표시가 있고, 실제 계정·비밀 키·학생 정보가 테스트와 로그에 없는 것입니다.

| 잘못된 예 | 문제 | 올바른 접근 |
| --- | --- | --- |
| props 객체를 직접 변경 | React가 갱신을 놓치거나 부모 값을 훼손 | 새 값으로 setter 호출 |
| placeholder만 사용 | 입력 이름이 사라짐 | 보이는 label 연결 |
| 브라우저 검증만 둠 | 직접 요청으로 우회 가능 | Action·RPC·RLS에서 재검증 |

## 6. AI 요청과 완료 체크

계획: “로그인/업무 form의 상태를 점검한다. Issue 허용 파일과 `AGENTS.md`, 공용 UI 사용법만 참고하고 공용 부품·DB·패키지는 수정하지 마라. 완료 기준은 키보드, 375px, pending, 성공·실패·권한 없음이다.”

구현: “실제 props·Action만 사용하고 없는 API는 만들지 마라. 오류와 캡처에서 이메일·토큰·쿠키를 가려라.”

리뷰: “label, focus, button/link 구분, 중복 제출, 서버 검증 누락, 화면 상태 네 가지를 검토해라.”

PR에는 바꾼 state, 정상/실패 결과, 다음으로 읽을 [Supabase](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-00)를 남깁니다. 공식 참고: [React state](https://react.dev/learn/managing-state), [Next.js forms](https://nextjs.org/docs/app/guides/forms).
