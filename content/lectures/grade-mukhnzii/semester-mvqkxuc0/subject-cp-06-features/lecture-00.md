---
title: "08 · 디버깅: 콘솔·Network·오류·테스트"
description: "문제를 재현해 브라우저·서버·DB·배포 중 위치를 좁히고, 증거·가설·수정·재검증을 Issue와 PR에 남기는 방법을 익힙니다."
order: 0
published: true
duration: 50
tags: [debugging, console, network, testing, lint, typecheck, Supabase]
objectives:
  - 기대 결과와 실제 결과로 최소 재현 절차를 쓴다.
  - 콘솔·서버 터미널·Network의 증거를 구별한다.
  - lint·typecheck·test·build·DB test의 목적을 구분한다.
  - 최소 수정 뒤 같은 실패 조건을 재검증해 PR에 설명한다.
---

## 1. 이 강의가 필요한 순간

“버튼을 눌러도 안 된다”, “Preview에서만 실패한다”, “RLS가 막는다”처럼 원인이 섞여 보일 때 읽습니다. 30분 이상 혼자 막히면 이 강의의 증거 양식으로 Issue 댓글을 쓰고 `blocked` 라벨과 링크를 공유하는 것이 실제 TF 규칙입니다.

> [!CONCEPT]
> **목표:** 문제를 재현하고 요청이 나가지 않은 것·요청 뒤 실패한 것·DB 거부를 구분한 뒤, 수정 전후 증거를 다른 팀원이 재현할 수 있게 남긴다.

## 2. 먼저 재현하고 위치를 좁힌다

기대 결과, 실제 결과, 최소 단계, 계정 종류, 주소를 한 번에 적습니다. 동시에 화면·Action·RLS를 바꾸면 원인을 잃습니다.

| 증상 | 먼저 볼 곳 | 구분 기준 |
| --- | --- | --- |
| 클릭해도 변화 없음 | 브라우저 Console·Event | 요청 자체가 없음 |
| 요청 뒤 4xx/5xx | Network | URL·상태 코드·안전한 응답 요약 |
| 화면 렌더링 실패 | 개발 서버 터미널 | Next.js/Server Component 오류 |
| 데이터가 안 보임 | Network + local DB/RLS test | 0건, 42501 거부, 실제 오류를 분리 |

브라우저 콘솔은 Client Component와 요청 시작을, 서버 터미널은 Server Component·Action·Route Handler를 봅니다. Network 탭에서는 method, URL, status, redirect를 확인하지만 Authorization header, cookie, 실제 이메일·건의 내용은 캡처에서 가립니다.

## 3. 검사 도구는 서로 다른 실패를 찾는다

플랫폼 `package.json`의 현재 명령은 아래와 같습니다. 이 강의 사이트의 검사 명령과 섞지 않습니다.

```text
npm run lint       # ESLint 규칙
npm run typecheck  # next typegen + TypeScript
npm test           # Vitest
npm run build      # 배포 빌드
npx supabase test db  # DB 변경이 있는 경우 pgTAP
```

타입 오류는 실행 전 모양 불일치, 빌드 실패는 route·server/client 경계 등 배포 묶음 문제, 런타임 오류는 실제 요청 조건에서의 문제입니다. local 성공·Preview 실패면 환경변수 이름·Preview 연결 DB·redirect URL·로그인 provider 설정을 **리드에게 확인할 항목**으로 분리합니다. 팀원이 대시보드 설정을 임의로 바꾸지 않습니다.

## 4. 따라 하기: 안전한 학습용 실패 하나

운영 환경에는 일부러 오류를 만들지 않습니다. local branch에서 Issue 범위 안의 학습용 예로, 로그인 화면의 알려진 `?error=access_denied`를 열어 `role="alert"` 문구가 보이는지 점검하세요.

1. 기대: 학교 외 계정 거부 안내가 보인다. 실제: 문구가 보이지 않거나 잘린다를 기록합니다.
2. 주소의 query string과 `LoginError`의 `MESSAGES` 매핑을 확인합니다. Network에서 redirect가 있다면 status·location만 기록합니다.
3. 최소 수정이 Issue 범위에 있을 때만 적용하고, 같은 URL·키보드·375px에서 재검증합니다.
4. `lint`, `typecheck`, `test`, `build`의 실행 결과와 미실행 이유를 기록합니다.

DB 거부 테스트 Issue라면 가짜 seed와 새 허용 테스트 파일만 사용합니다. 운영 DB 초기화, migration 수정, 실제 계정 로그는 범위 밖입니다.

## 5. 흔한 실수와 재발 방지

| 잘못된 접근 | 문제 | 올바른 접근 |
| --- | --- | --- |
| 오류 문구만 보고 추측 | 요청·서버·DB 위치를 혼동 | 재현 단계와 Console/Network/터미널 증거 수집 |
| 여러 파일을 한 번에 고침 | 원인을 알 수 없음 | 가설 하나, 최소 수정 하나 |
| 0건과 error를 같은 처리 | 사용자에게 잘못된 안내 | 결과 없음·권한 거부·실패를 분리 |
| 로그 전체를 붙여 넣음 | 키·쿠키·개인정보 노출 | 민감 값 가리고 필요한 code만 공유 |

직접 해보기의 완료 기준은 실패를 다시 재현할 수 있고, 수정 뒤 동일 단계가 통과하며, 한 개 이상의 회귀 검사 또는 UI 확인이 남는 것입니다. PR에는 원인, 수정, 재검증, 남은 가설을 짧게 적습니다.

## 6. AI 요청과 완료 체크

계획: “다음 재현 절차의 실패 위치를 좁혀라. 허용 파일과 Issue 범위만 분석하고, 수정 전에는 원인 가설·확인 명령·추가로 필요한 증거를 제시해라. 로그의 키·쿠키·실제 이메일은 가린다.”

구현: “가설을 검증하는 최소 변경만 제안해라. RLS 우회, 테스트 삭제, service_role 사용, 운영 DB 초기화는 금지한다.”

리뷰: “실패 조건이 다시 검사됐는지, local/Preview/운영을 혼동하지 않았는지, 화면 네 상태와 권한 없는 직접 접근을 확인했는지 검토해라.”

30분을 넘겼다면 Issue 댓글에 **하려던 것·시도한 것·오류(민감 값 가림)·기대 결과·필요한 결정/기반/리뷰·마감 영향**을 쓰고 `blocked`로 공유합니다. 다음에는 해당 기능의 [Next.js](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-02-frontend/lecture-00) 또는 [인증·권한](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-05-realtime/lecture-00)을 다시 참조합니다. 공식 참고: [Next.js debugging](https://nextjs.org/docs/app/guides/debugging), [Supabase testing](https://supabase.com/docs/guides/local-development/cli/getting-started).
