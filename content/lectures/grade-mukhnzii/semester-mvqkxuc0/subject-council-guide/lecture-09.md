---
title: "9 · 용어 사전과 공식 자료"
description: "가이드 전체에 나오는 개발 용어를 쉬운 뜻과 학생회 플랫폼의 예로 정리하고, 처음 실습할 때 열어 볼 공식 학습 자료를 모았습니다."
order: 9
published: true
duration: 25
tags: [용어 사전, 공식 문서, Supabase, Next.js, Yjs, BlockNote]
objectives:
  - 가이드에 나오는 핵심 용어를 쉬운 말과 학생회 예로 설명한다.
  - 실습 전에 확인할 공식 문서를 찾는다.
---

## 학습 경로

[← 8편 완성 경로](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-08) · [0편 길잡이로 돌아가기](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-00)

용어마다 처음 자세히 나오는 편을 적었다. 모르는 말이 나오면 이 표에서 찾고, 해당 편으로 돌아가 사례를 다시 읽는다.

## 용어 사전

| 용어 | 쉬운 뜻 | 이 프로젝트의 예 | 편 |
| --- | --- | --- | :---: |
| ACL | 자료 하나에 붙는 접근 허용 목록 | Event·Task·Meeting 열람자 | 4 |
| Ack | 요청을 받거나 저장했다는 확인 신호 | CRDT Update 저장 확인 | 5 |
| Activity Log | 누가 언제 무엇을 바꿨는지 남기는 기록 | Task ACL 변경 이력 | 4·7 |
| Allowlist | 명단에 있는 사람만 허용 | `approved_council_accounts` | 3 |
| API | 프로그램끼리 요청과 결과를 주고받는 통로 | Task 목록 조회 | 1 |
| Archive Grant | 지난 기수 자료를 범위·기간을 정해 읽게 하는 권한 | `term_archive_access` | 7 |
| Auth Hook | 가입·로그인 과정의 검사 지점 | 학교 외 계정 생성 차단 | 3 |
| Awareness | 다른 사람의 커서·선택 영역 같은 협업 상태 | 회의록 편집 위치 | 5 |
| BlockNote | 문서를 Block으로 편집하는 화면 도구 | 회의록 Editor | 5·7 |
| Broadcast | 채널 참여자에게 메시지 전달 | 저장된 Yjs Update 전파 | 5 |
| Bucket | 파일을 묶어 보관하는 Storage 공간 | 비공개 행사 자료 | 4 |
| CI | 코드 변경 때 검사를 자동 실행하는 체계 | RLS DB 테스트 | 5 |
| Component | 다시 쓸 수 있는 React 화면 조각 | `TaskCard` | 2 |
| CRDT | 동시 변경을 병합하는 데이터 구조 | 공동 회의록 | 5 |
| E2E 테스트 | 실제 사용자 흐름을 처음부터 끝까지 시험 | 로그인 후 업무 저장 | 5 |
| Enum | 정해진 값 중에서만 고르게 하는 타입 | Task 상태 | 2 |
| Foreign Key | 다른 테이블 기록을 가리키는 ID | `tasks.event_id` | 3 |
| Idempotency (멱등성) | 같은 요청을 반복해도 한 번만 처리되는 성질 | `client_update_id` | 5 |
| Index | 빠른 검색을 위한 색인 | Term·사용자별 Task 조회 | 3 |
| JWT | 서명과 유효기간이 있는 로그인 토큰 | Supabase 세션 | 3 |
| Membership | 한 사용자의 특정 Term 소속·Role·부서 | 2027 홍보국 국원 | 3 |
| Migration | DB 구조·정책의 변경 기록 | 새 ACL 테이블 추가 | 3 |
| MVP | 실제 사용 가치를 확인할 첫 제품 범위 | 기획서 13.1절 | 8 |
| 낙관적 잠금 | 저장할 때 그사이 남이 바꿨는지 확인하는 방식 | Handover `updated_at` 비교 | 6 |
| OAuth/OIDC | Google 같은 제공자를 통해 로그인 신원을 확인 | 학교 Google 로그인 | 3 |
| Permission | 특정 행동을 할 수 있는 능력의 이름 | `event.create` | 4 |
| Position | 화면에 보이는 직책명 | 홍보국장 | 4 |
| Presence | 채널에 접속한 사람 정보 | 회의록 접속자 목록 | 5 |
| Preview | 운영 전 변경을 함께 시험하는 배포 환경 | PR별 확인 주소 | 5 |
| Primary Key | 테이블 한 행의 고유 ID | `tasks.id` | 3 |
| Private Channel | 권한 검사를 통과한 사람만 들어오는 Realtime 채널 | `meeting:{id}` | 5 |
| Props / State | 전달받는 값 / 화면 안에서 바뀌는 값 | 카드 제목 / 필터 | 2 |
| RBAC | Role에 기본 권한을 묶는 방식 | DIRECTOR의 국 관리 | 4 |
| RLS | DB가 행마다 접근 여부를 검사 | 다른 국 Task 차단 | 4 |
| Role | 권한 계산에 쓰는 보안 등급 | MEMBER·DIRECTOR·EXECUTIVE | 4 |
| RPC | 서버·DB의 함수를 이름으로 호출 | `save_meeting_update()` | 1·5 |
| SECURITY DEFINER | 만든 사람 권한으로 실행되는 DB 함수 | 권한 확인 함수 | 4 |
| Seed | 처음 시작할 때 넣는 기본 데이터 | 초기 부서 네 개 | 3 |
| Server Action | 폼 제출 등을 서버에서 처리하는 Next.js 함수 | 업무 저장 | 2 |
| Signed URL | 비공개 파일의 기간 한정 접근 주소 | 행사 자료 다운로드 | 4 |
| Snapshot | 한 시점의 문서 전체 상태 | 회의록 재접속 시작점 | 5 |
| Soft Delete | 지우지 않고 보관 표시 | Task `archived_at` | 3 |
| State Vector | Yjs가 받은 변경 범위를 요약한 정보 | 누락 Update 동기화 | 5 |
| Term | 학생회 운영 기수 | 2027년 학생회 | 1·7 |
| Transaction | 여러 DB 변경을 전부 성공 또는 전부 취소 | Term 전환 | 3 |
| Trigger | DB 변경 때 자동 실행되는 규칙 | Task 변경 이력 기록 | 3 |
| WebSocket | 연결을 유지하며 실시간으로 주고받는 방식 | Realtime | 5 |
| Yjs | CRDT 공동편집 라이브러리 | 회의록 Y.Doc | 5 |

## 헷갈리는 짝 개념

> [!FLASHCARD]
> Q: 인증과 인가의 차이는? A: 인증은 “누구인가”(학교 Google 로그인 성공), 인가는 “이걸 해도 되는가”(현재 Term 활성 Membership과 권한). 인증만으로는 내부 자료를 못 본다.

> [!FLASHCARD]
> Q: Role과 Position의 차이는? A: Role(MEMBER·DIRECTOR·EXECUTIVE)은 권한 계산에 쓰는 고정 보안 등급이고, Position(회장·홍보국장)은 화면에 보이는 이름일 뿐 권한 판정에 쓰지 않는다.

> [!FLASHCARD]
> Q: RBAC와 ACL의 차이는? A: RBAC는 “이 역할은 무엇을 할 수 있나”, ACL은 “이 특정 자료는 누가 볼 수 있나”에 답한다. 플랫폼은 둘을 함께 쓴다.

> [!FLASHCARD]
> Q: Broadcast 성공과 DB 저장 성공의 차이는? A: Broadcast는 지금 접속한 사람에게 전달한 것, DB 저장은 다시 열어도 남는다는 뜻. v0.7은 저장을 커밋한 뒤 DB가 발행한다.

> [!FLASHCARD]
> Q: Snapshot과 Update의 관계는? A: 문서 = 최신 Snapshot(어느 순번까지의 전체 상태) + 그 뒤의 Update(변경 조각).

> [!FLASHCARD]
> Q: 시간 일정과 종일 일정의 저장 차이는? A: 시간 일정은 순간이라 timestamptz로 저장하고 Asia/Seoul로 보여 준다. 종일 일정은 달력 날짜라 date로 저장해 변환하지 않는다.

## 공식 학습 자료

도구의 화면과 API는 바뀔 수 있다. 처음 실습할 때 공식 자료를 열어 현재 예제를 확인한다.

| 주제 | 자료 | 관련 편 |
| --- | --- | :---: |
| Git·GitHub | [GitHub Hello World – Repository와 Pull Request](https://docs.github.com/en/get-started/using-github/hello-world) | 2 |
| React | [React Learn – Component와 화면 상태](https://react.dev/learn/describing-the-ui) | 2 |
| TypeScript | [TypeScript Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) | 2 |
| Next.js | [Next.js Learn – App Router](https://nextjs.org/learn/dashboard-app) | 2 |
| Next.js | [Next.js Forms – 폼과 서버 처리](https://nextjs.org/docs/app/guides/forms) | 2 |
| Supabase | [Supabase Database 개요](https://supabase.com/docs/guides/database/overview) | 3 |
| Supabase | [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) | 4 |
| Supabase | [Supabase Google Login](https://supabase.com/docs/guides/auth/social-login/auth-google) | 3 |
| Supabase | [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control) | 4 |
| Supabase | [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization) | 5 |
| BlockNote | [BlockNote Collaboration](https://www.blocknotejs.org/docs/features/collaboration) | 5 |
| Yjs | [Yjs Collaborative Editor](https://docs.yjs.dev/getting-started/a-collaborative-editor) | 5 |
| Vercel | [Vercel Deployments](https://vercel.com/docs/deployments/overview) | 5 |
