---
title: "6 · 기능 적용 ① 조직·업무·행사"
description: "2부의 지식을 조직·계정·Dashboard, Task Tracker, Event와 자료·일정·인수인계 기능에 연결합니다. 각 기능을 사용자 흐름 → 필요한 데이터 → 권한 → 실패·검증 순서로 다시 읽습니다."
order: 6
published: true
duration: 55
tags: [조직, Membership, Dashboard, Task, Event, Resource, Schedule, Handover]
objectives:
  - 국장·회장단의 구성원 관리 범위와 Membership 종료 시 책임 이관을 설명한다.
  - Task의 상태 전이와 역할별 변경 가능 필드를 구분한다.
  - Event 범위를 그대로 따르는 자료와 더 좁힐 수 있는 자료, 범위 축소 시 충돌 해결을 설명한다.
---

## 학습 경로

[← 5편 실시간 공동편집과 운영](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-05) · [7편 회의록·건의·기수 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-07)

3부는 기획서 v0.7의 기능을 **사용자 흐름 → 필요한 데이터 → 권한 → 실패·검증** 순서로 다시 설명한다. 세부 필드와 최종 정책은 기획서의 해당 절이 기준이다.

## 1. 조직과 계정

회장단이 새 Term의 부서와 직책을 준비하고 학생회 구성원 이메일을 승인 목록에 등록한다. 첫 로그인 때 승인 행과 Google 계정을 연결해 Membership을 만든다(3편 그림 3-2). 국장은 자기 국의 MEMBER 계정을 추가·제외할 수 있지만, ==red:다른 국을 관리하거나 Role을 승격할 수 없다.==

| 구분 | 내용 |
| --- | --- |
| 필요한 데이터 | `terms`, `profiles`, `departments`, `positions`, `approved_council_accounts`, `memberships` |
| 꼭 이해할 지식 | OAuth/ID Token, Auth Hook, Allowlist, Role과 Position 분리, UNIQUE 제약, 트랜잭션, 이력 보존 |

> [!CAUTION]
> **Membership을 종료해도 과거 기록은 남긴다.** 과거 Task의 담당자·회의록 작성자 기록은 지우지 않는다. 대신 권한 판정은 항상 활성 Membership을 요구하므로 종료된 사람은 아무 권한도 쓰지 못한다.
>
> - 종료 화면은 그 사람이 맡은 미완료 Task, 관리 중인 Event·RESTRICTED Task, 편집자로 지정된 진행 중 회의록을 보여 준다.
> - 관리 책임은 다른 활성 구성원에게 넘기고, 넘기지 않으면 소속 국의 활성 국장(없으면 회장단)에게 간다.
> - 비활성 담당자의 Task는 “담당자 비활성”으로 표시해 재배정하게 한다.

**허용·거부 테스트**

- 회장단은 전체 학생회 계정을 등록한다.
- 국장은 자기 국 MEMBER만 추가·제외한다.
- 국장이 자기 자신을 EXECUTIVE로 승격하려는 요청은 거부한다.
- 학교 외 계정은 Auth Hook에서 거부되고 사용자·Profile 행이 만들어지지 않는다.
- 승인 목록에 없는 학교 계정은 일반 학생으로 남는다.

## 2. Dashboard

학생회 구성원은 내 업무, 마감 임박 업무, 일정, 진행 행사, 최근 회의록을 본다. 각 영역은 ==현재 사용자가 열람할 수 있는 자료만== 보여 줘야 한다. 회장단이 관리하는 Quick Links는 외부 사이트 바로가기이며, 특정 서비스 이름을 코드에 고정하지 않는다(유일한 전역 설정).

| 구분 | 내용 |
| --- | --- |
| 필요한 데이터 | `tasks`, `schedules`, `events`, `meeting_minutes`, `dashboard_links`와 각 자원의 권한 함수 |
| 실패·검증 | 목록 하나에서 제한 공개 Task **제목**이 새면 상세 페이지가 막혀 있어도 정보가 노출된다. 다른 부서·다른 Term 계정에서 Dashboard 결과를 비교한다. |

### 직접 해보기

사용자 A의 Dashboard에 보일 업무·행사·회의록 세 가지를 정하고, 사용자 B에게는 그것들을 숨겨야 하는 이유를 권한 규칙으로 설명한다.

## 3. Task Tracker

Task는 업무 하나다. 제목, 설명, 담당 국·담당자, 시작·마감일, 우선순위, 상태, 공개 모드, 관리자, 관련 Event를 가진다.

[![TODO, IN_PROGRESS, REVIEW, DONE 네 상태를 위에서 아래로 놓고 DONE에서 IN_PROGRESS로 재개하는 고리, 어느 상태에서든 보관하고 복원하는 칸, 오른쪽에 MEMBER·DIRECTOR·공개 모드와 ACL을 누가 고치는지 정리한 상태 그림](/materials/diagrams/cpg-06a-task-lifecycle.svg)](/materials/diagrams/cpg-06a-task-lifecycle.svg)

*그림 6-1 · 업무의 상태와 되돌리기 — 누르면 원본 크기로 열린다.*

### 사용자가 보는 흐름

1. 국장이나 회장단이 Task를 만든다(==red:MEMBER는 만들지 않는다==).
2. `DEFAULT` 또는 `RESTRICTED` 공개 모드를 고른다.
3. 담당자를 지정하고 필요하면 ACL로 추가 열람자를 지정한다.
4. 국원은 자신이 담당한 Task의 상태와 허용된 내용만 바꾼다.
5. 완료 후에도 수정·재개할 수 있고, 잘못 만든 Task는 물리 삭제 대신 보관·복원한다.

### 볼 수 있다 ≠ 고칠 수 있다

열람 권한과 변경 권한은 따로 판정한다(기획서 4.6절).

| 행위 | MEMBER | DIRECTOR | EXECUTIVE |
| --- | --- | --- | --- |
| Task 생성 | X | 자기 국 또는 관리하는 Event | 같은 Term 전체 |
| 상태 변경 | 본인 담당 | 관리 가능한 Task | 같은 Term 전체 |
| 제목·담당자·마감일 | X | 관리 가능한 Task | 같은 Term 전체 |
| 설명·첨부자료 | 본인 담당 | 관리 가능한 Task | 같은 Term 전체 |
| ACL·공개 모드 | X | 관리 가능한 Task | 같은 Term 전체 |
| 보관 처리 | X | 관리 가능한 Task | 같은 Term 전체 |

Event에 연결된 Task의 담당자·관리자·ACL 대상은 그 Event를 볼 수 있어야 한다(4편 그림 4-2). 재개·담당자 변경·공개 모드와 ACL 변경·보관과 복원은 Activity Log에 남긴다.

| 구분 | 내용 |
| --- | --- |
| 필요한 데이터 | `tasks`, `task_access_rules`, `memberships`, `events`, `activity_logs` |
| 구현 지식 | 폼과 상태 관리, Foreign Key, Soft Delete, 변경 가능한 열 검증, RLS SELECT·UPDATE, Activity Log |
| 검증 예시 | 재무국 RESTRICTED Task가 담당자·생성자·회장단 외에 자동 공개되지 않는지. 타 부서 국원이 URL을 직접 입력해도 본문·첨부·활동 기록을 못 보는지. DONE 재개와 보관·복원 이력이 남는지. |

### 직접 해보기

`DEFAULT`와 `RESTRICTED` Task 각각에 대해 회장단·담당 국장·담당 국원·다른 국원의 **조회**와 **수정** 결과를 표로 적는다.

> [!QUIZ]
> 재무국 소속 국원 P(담당자 아님)는 재무국의 `DEFAULT` Task와 `RESTRICTED` Task를 각각 볼 수 있나?

> [!ANSWER]
> `DEFAULT`는 **볼 수 있다**. 담당 국 구성원이 기본 열람 대상이기 때문이다(단, 고칠 수는 없다).
>
> `RESTRICTED`는 **볼 수 없다**. 회장단·생성자·담당자·명시한 ACL 대상만 보며, 담당 국 전체에 자동 공개되지 않는다.

## 4. Event, 자료, 일정, 인수인계

Event는 행사 개요를 중심으로 Task, Schedule, Resource, Meeting, Handover를 묶는다. 예를 들어 “대동제” 행사 페이지에서 담당 업무와 행사 자료를 함께 찾는다.

[![Event 아래에 범위를 그대로 따르는 Resource, Schedule, Handover 묶음과 범위 안에서 더 좁힐 수 있는 Task, Meeting 묶음을 두고, 범위를 좁힐 때는 충돌 목록을 해결해야 저장된다는 그림](/materials/diagrams/cpg-06b-event-hub.svg)](/materials/diagrams/cpg-06b-event-hub.svg)

*그림 6-2 · 행사는 하위 자료의 상한이다 — 누르면 원본 크기로 열린다.*

### Event 범위와 변경

`ALL_COUNCIL` Event는 같은 Term의 활성 학생회 구성원 전체가, `RESTRICTED` Event는 회장단·생성자·관리자·담당 국·ACL 대상이 본다. 공개 모드의 자세한 규칙은 4편 2절에 있다.

Event 범위를 좁히면 기존 담당자나 회의록 편집자가 Event 밖으로 밀려날 수 있다. 변경 화면은 충돌 대상을 나열하고 ==blue:Event ACL에 남기기 · 담당자 바꾸기 · 하위 지정 제거하기== 중 하나를 고르게 한다. 관련 변경은 한 트랜잭션으로 적용한다.

### 자료(Resource)

- `UPLOAD`(Supabase Storage)와 `EXTERNAL_LINK`(외부 URL)를 모두 지원한다.
- 메타데이터: 제목, 설명, 행사 연결, 등록자, 저장 경로 또는 URL.
- 비공개 Storage 정책을 Event 접근에 연결하고, 외부 URL은 원본 서비스의 공유 권한을 확인한다(4편).

### 일정(Schedule)

- Term 공통 일정은 같은 Term의 활성 구성원 전체가, Event 일정은 Event 범위대로 본다.
- 시간 일정은 `timestamptz`, 종일 일정은 날짜 필드로 저장한다(4편).
- 반복 일정과 외부 Calendar 양방향 동기화는 **MVP에서 제외**한다.

### 인수인계(Handover)

- Event 또는 Department 중 ==정확히 하나==에 연결한다(CHECK 제약).
- `DRAFT`는 작성자와 관리 권한자만, `PUBLISHED`는 해당 Event·부서의 허용자가 읽는다. `ARCHIVED`는 읽기 전용.
- 본문은 BlockNote Block JSON으로 저장하지만 MVP에서는 실시간 공동편집을 쓰지 않는다. 동시 수정은 `updated_at`을 비교하는 **낙관적 잠금**으로 확인한다(내가 연 뒤 누가 먼저 저장했으면 저장을 거부하고 알린다).

| 구분 | 내용 |
| --- | --- |
| 필요한 데이터 | `events`, `event_access_rules`, `event_resources`, `schedules`, `handovers`, `term_archive_access` |
| 검증 예시 | Event 범위를 줄일 때 Task 담당자·Meeting 편집자 충돌이 표시되는지. Event를 못 보는 사람은 자료 URL을 알아도 다운로드하지 못하는지. 종일 일정 날짜가 시간대 변환으로 바뀌지 않는지. |

### 직접 해보기

행사를 하나 정해 Task 두 개, 일정 두 개, 파일 한 개, Handover 한 개를 종이에 연결한다. 각 항목이 Event 범위를 **그대로** 따르는지, **더 좁힐 수 있는지** 표시한다.

> [!QUIZ]
> `ALL_COUNCIL`이던 대동제 Event를 재무국만 보는 `RESTRICTED`로 바꾸려 한다. 홍보국원 Q가 이 Event 아래 Task의 담당자라면 어떤 일이 일어나야 하나?

> [!ANSWER]
> 저장 전에 **충돌 목록**에 “Task 담당자 Q (홍보국)”가 나타나야 한다. 변경하는 사람은 Q를 Event ACL에 남기거나, Task 담당자를 다른 사람으로 바꾸거나, 그 지정을 제거해야 저장할 수 있다. 선택한 해결과 범위 변경은 한 트랜잭션으로 함께 적용된다. 그냥 저장되어 Q가 “담당자인데 못 보는” 상태가 되면 안 된다.
