---
title: "00-2 · 로그인·Dashboard·업무·행사"
description: "기획서 v0.7의 2–5절. 학교 Google 계정 로그인과 승인 명단, Dashboard와 Quick Links, Task의 필드·공개 모드·ACL·변경 권한, Event의 열람 범위 상속·행사 자료·일정·인수인계를 정리합니다."
order: 2
published: true
duration: 45
tags: [기획서, 로그인, Auth Hook, Dashboard, Task, Event, ACL]
objectives:
  - 학교 도메인 검사를 어디서 강제하는지, 일반 학생과 구성원의 차이가 무엇인지 말한다.
  - Task의 DEFAULT·RESTRICTED 모드가 각각 누구에게 보이는지 설명한다.
  - Event 하위 자료의 유효 열람자가 교집합으로 계산되는 이유를 말한다.
  - Event 범위를 좁힐 때 생기는 충돌과 세 가지 해결 방법을 말한다.
---

## 1. 학교 계정 로그인 (2.1절)

모든 로그인은 **Google OAuth**를 씁니다. 서버는 Google이 검증한 이메일(`email_verified`)이 `@hanyang.ac.kr`인지 확인합니다. 학교 계정이 Google Workspace에 속한다면 Google ID Token의 `hd` 클레임도 확인합니다. 이메일 끝부분만으로 Workspace 소속을 단정하지 않으며, 학교의 실제 Google 계정 운영 방식은 배포 전에 확인합니다.

### 검사는 두 곳에서 강제한다

OAuth 요청의 `hd` 파라미터와 로그인 화면 안내는 **계정을 고르기 쉽게 돕는 힌트**일 뿐 보안 검사가 아닙니다.

1. **Supabase Auth Hook (Before User Created):** 검증되지 않은 이메일, 학교 외 도메인, 기대한 `hd`가 없는 계정은 `auth.users` 행이 만들어지기 **전에** 거부합니다. Postgres 함수 또는 서명을 검증하는 HTTP Hook으로 구현합니다.
2. **Profile 생성·Membership 활성화 함수:** 같은 조건을 한 번 더 검사합니다. Hook 설정을 빠뜨리거나 다른 로그인 방식이 추가돼도 우회되지 않게 하기 위해서입니다.

Supabase에서는 Google 외 로그인 방식(이메일·Magic Link 등)을 끕니다. 배포 전에 학교 외 Google 계정으로 로그인했을 때 `auth.users`와 `profiles`에 행이 생기지 않는지 확인합니다.

> [!NOTE]
> - "일반 학생"은 검증된 `@hanyang.ac.kr` 계정을 뜻하며 **학과 소속은 확인하지 않습니다.** 학과 학생으로 건의를 제한하려면 별도 명단 대조를 운영값으로 정합니다.
> - 일반 학생과 학생회 구성원의 차이는 **로그인 가능 여부가 아니라 내부 Membership 보유 여부**입니다.
> - 이메일은 사전 승인 대조에만 쓰고, 활성화 후 계정 연결의 기준 키는 `auth.users.id`입니다.

```text
@hanyang.ac.kr Google 로그인
        ↓
Supabase Auth
        ↓
profiles 생성/조회
        ↓
approved_council_accounts 확인
        ├─ 등록 없음 → STUDENT
        └─ 등록 있음 → 서버에서 승인 상태·기수·이메일 검증 → Membership 활성화
```

## 2. 회장단의 일괄 등록 (2.2절)

기수 시작 전에 회장단이 구성원의 학교 계정을 일괄 입력합니다. 이 명단(`approved_council_accounts`)이 학생회 내부 권한의 **Allowlist**입니다. 학교 이메일이 있다는 이유만으로 내부 권한을 주지 않습니다.

| 필드 | 설명 |
| --- | --- |
| `term_id` | 적용 기수 |
| `email` | 학교 이메일 |
| `department_id` | 배정 국 |
| `role` | MEMBER / DIRECTOR / EXECUTIVE |
| `position_id` | 표시 직책 |
| `registered_by` | 등록한 회장단 사용자 |
| `activated_user_id` | 첫 로그인 후 연결된 auth user |
| `is_active` | 승인 상태 |

활성화 규칙:

- `term_id + 정규화된 email`을 유일하게 관리합니다. 이미 연결된 승인 행을 다른 사용자에게 다시 연결하지 않습니다.
- 첫 로그인 때 서버의 **단일 절차**가 검증된 계정과 승인 행을 대조하고, `activated_user_id` 연결과 Membership 생성을 원자적으로 처리합니다. 클라이언트는 Role·Department·Position을 직접 쓰지 못합니다.
- 승인 취소나 Membership 종료 뒤에는 DB 쓰기·조회 권한이 즉시 사라지도록 매 요청에서 활성 Membership을 검사합니다.
- 첫 EXECUTIVE는 운영자가 검증된 학교 계정을 확인한 뒤 신뢰된 서버 절차로 **한 번만** 등록합니다. 첫 계정이 자기 Role을 직접 부여하는 화면은 만들지 않습니다.

> [!CAUTION]
> 마지막 규칙은 기획서 이후 바뀌었습니다. 이제 **두 번째 기수부터는 전임 회장단이 화면에서 다음 회장단을 지정하고, 다른 회장단 1명이 승인**합니다. 운영자 절차는 맨 처음 한 번과 비상 복구에만 씁니다. → [00-4](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-04), [06-5](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-05)

### 운영 중 구성원 변경 (2.3절)

- 회장단: 전체 구성원·국장·회장단 권한 관리
- 국장: 자기 국 MEMBER 계정 추가·제외
- 권한 승격(국원→국장, 국장→회장단): 회장단만 가능

## 3. Dashboard (3절)

내부 사용자가 로그인하면 처음 보는 화면입니다.

- 내 Task
- 마감 임박·기한 초과 Task
- 이번 주 일정
- 진행 중 Event
- 최근 회의록
- Quick Links

### Quick Links (3.2절)

회장단이 학생회 Instagram, 미리캔버스, 공용 Google Drive, Google Form, 학교 홈페이지 같은 외부 링크를 등록·수정·삭제·정렬합니다. 특정 서비스 이름을 코드에 고정하지 않습니다.

| `dashboard_links` 필드 | 설명 |
| --- | --- |
| `name` | 표시 이름 |
| `url` | 외부 URL (`https`만 허용) |
| `description` | 선택 설명 |
| `icon_key` | 선택 아이콘 |
| `sort_order` | 표시 순서 |
| `is_active` | 활성 여부 |

`dashboard_links`는 Term에 속하지 않는 **전역 설정**입니다. 기수가 바뀌어도 유지되는 링크라 새 Term에서 다시 만들 필요가 없습니다. 관리는 ACTIVE Term의 EXECUTIVE만, 열람은 ACTIVE Term의 활성 구성원만 할 수 있습니다.

## 4. Task Tracker (4절)

### 4-1. Task 필드 (4.1절)

| 필드 | 뜻 |
| --- | --- |
| `term_id` | 기수 |
| `event_id` | 행사 (선택 · 행사와 무관한 부서 업무는 비움) |
| `department_id` | 담당 국 |
| `title`, `description` | 제목, 설명 |
| `creator_id`, `assignee_id` | 만든 사람, 담당자 |
| `status` | TODO / IN_PROGRESS / REVIEW / DONE |
| `priority` | 우선순위 |
| `start_date`, `due_date`, `completed_at` | 시작일, 마감일, 완료 시각 |
| `visibility_mode` | DEFAULT / RESTRICTED |
| `manager_id` | 이 Task의 ACL 관리 책임자 |
| `archived_at`, `archived_by` | 보관 처리 (부록 B) |
| `created_at`, `updated_at` | 생성·수정 시각 |

==DONE은 잠금 상태가 아닙니다.== 권한이 있으면 완료 뒤에도 제목·설명·담당자·마감일·자료를 고치거나 IN_PROGRESS로 되돌릴 수 있습니다.

### 4-2. 공개 모드 (4.2절)

| 모드 | 볼 수 있는 사람 |
| --- | --- |
| `DEFAULT` (기본값) | 그 기수 회장단, 담당 국 활성 구성원, 생성자, 담당자, ACL에 추가된 대상 |
| `RESTRICTED` | 그 기수 회장단, 생성자, 담당자, ACL에 명시된 대상**만** |

- `RESTRICTED`는 계약·개인정보 같은 민감 업무에 씁니다. 담당 국의 다른 구성원과 국장도 자동으로는 못 봅니다.
- 제한 공개로 바꿀 때는 기존 ACL과 담당자 목록을 미리 보여 줘서 의도치 않은 공개가 남지 않게 합니다.
- 국원은 두 모드 모두에서 권한이 없는 다른 국 Task를 못 봅니다.
- ACL 판단에는 반드시 **Task가 속한 Term의 활성 Membership**만 씁니다.

### 4-3. 열람자 특별 지정 (4.3–4.4절)

회장단과 권한 있는 국장은 Task마다 열람자를 지정할 수 있습니다. `DEFAULT`에서는 기본 대상에 **추가**하고, `RESTRICTED`에서는 회장단·생성자·담당자 외의 열람자를 **명시**합니다. 대상은 국 하나·여러 개, 국원 한 명·여러 명, 국과 무관한 구성원 N명 모두 가능합니다.

```text
Task: 협찬사 민감 계약안
공개 모드: RESTRICTED
열람: 회장 · 부회장 · 재무국장 · 사무국장 · 홍보국 김OO 국원
```

열람 범위는 `task_access_rules`라는 별도 테이블로 저장합니다(필드: `task_id`, `subject_type`, `department_id`, `user_id`, `role_group`, `granted_by`, `created_at`). 화면의 체크박스가 아니라 **RLS SELECT 정책**이 공개 모드와 ACL을 함께 검사합니다. Task의 댓글·첨부·Activity Log처럼 본문을 간접적으로 드러낼 수 있는 하위 데이터도 **같은 Task 열람 함수**를 씁니다.

### 4-4. ACL 수정 권한 (4.5절)

- EXECUTIVE: 같은 Term의 모든 Task ACL
- DIRECTOR: `DEFAULT` 모드의 자기 국 Task, 또는 자신이 `manager_id`인 `RESTRICTED` Task
- MEMBER: 변경 불가
- `manager_id` 변경: EXECUTIVE, 또는 현 관리 국장이 승인한 같은 Term의 DIRECTOR

### 4-5. 변경 권한과 삭제 정책 (4.6절)

열람 권한과 변경 권한은 **따로** 판정합니다.

| 행위 | MEMBER | DIRECTOR | EXECUTIVE |
| --- | --- | --- | --- |
| Task 생성 | X | 자기 국 또는 관리하는 Event | 같은 Term 전체 |
| 상태 변경 | 본인 담당 Task | 관리 가능한 Task | 같은 Term 전체 |
| 제목·담당자·마감일 변경 | X | 관리 가능한 Task | 같은 Term 전체 |
| 설명·첨부자료 변경 | 본인 담당 Task | 관리 가능한 Task | 같은 Term 전체 |
| ACL·공개 모드 변경 | X | 4.5절 범위 | 같은 Term 전체 |
| 보관 처리 | X | 관리 가능한 Task | 같은 Term 전체 |

MVP에서는 Task를 **물리 삭제하지 않고** `archived_at`, `archived_by`를 기록해 목록에서 숨깁니다. 재오픈·담당자 변경·공개 모드 변경·ACL 변경·보관·복원은 Activity Log에 남깁니다. RLS UPDATE 정책은 행 접근만 확인하므로, **어떤 열을 바꿀 수 있는지와 상태 전이**는 RPC나 Trigger에서 따로 검증합니다.

> [!QUIZ]
> 국원 A가 담당인 DEFAULT Task에서 A가 할 수 있는 일과 없는 일을 하나씩 들어 보세요.

> [!ANSWER]
> **할 수 있음:** 상태 변경(TODO→IN_PROGRESS 등), 설명·첨부자료 수정.
> **할 수 없음:** 제목·담당자·마감일 변경, ACL·공개 모드 변경, 보관 처리. 이것들은 국장(관리 가능한 Task)이나 회장단 권한입니다.

## 5. Event와 행사 자료 (5절)

### 5-1. Event 구성 (5.1절)

```text
Event
├─ Overview
├─ Task
├─ Schedule
├─ Resources
├─ Meeting Minutes
└─ Handover
```

| `events` 필드 | 뜻 |
| --- | --- |
| `term_id` | 기수 |
| `name`, `description` | 이름, 설명 |
| `status` | PLANNING / ACTIVE / COMPLETED / ARCHIVED |
| `owner_department_id` | 주관 국 |
| `manager_id` | 관리자 |
| `visibility_mode` | ALL_COUNCIL / RESTRICTED |
| `starts_at`, `ends_at` | 기간 |
| `created_by`, `created_at`, `updated_at` | 생성 정보 |

### 5-2. 열람 범위와 상속 (5.2절)

- `ALL_COUNCIL` Event는 같은 Term의 활성 구성원 전체가 봅니다.
- `RESTRICTED` Event는 회장단, 생성자, 관리자, 주관 국, `event_access_rules`에 지정된 부서·사용자·역할 그룹만 봅니다.
- Overview·Resources·Schedule·Handover는 Event 범위를 **그대로 상속**합니다.
- Task와 회의록은 자체 ACL로 **더 좁힐 수만** 있고 Event 범위를 넘을 수 없습니다.

```text
하위 자원 유효 열람자 = Event 열람자 ∩ Task 또는 Meeting 열람자
```

[![Event 아래에 범위를 그대로 따르는 Resource·Schedule·Handover와, 그 안에서 더 좁힐 수 있는 Task·Meeting이 놓인 그림](/materials/diagrams/cpg-06b-event-hub.svg)](/materials/diagrams/cpg-06b-event-hub.svg)

*그림 00-3 · 행사는 하위 자료의 상한이다 — 누르면 원본 크기로 열린다.*

Event를 `ALL_COUNCIL`에서 `RESTRICTED`로 바꾸거나 ACL에서 대상을 빼면, 하위 자료의 유효 접근도 **즉시** 좁아집니다. 변경 화면은 영향받는 Task·회의록·Resource 수를 보여 주고, Activity Log에 변경 전후 모드와 ACL을 남깁니다.

### 5-3. 범위를 좁힐 때 생기는 충돌

범위를 좁히면 "Event를 볼 수 없게 되는 Task 담당자나 회의록 편집자"가 생길 수 있습니다. 변경 화면은 그런 사용자·부서와 연결된 자원을 목록으로 보여 주고, 관리자는 셋 중 하나를 골라야 저장할 수 있습니다.

1. 그 사용자·부서를 Event ACL에 `USER`·`DEPARTMENT`로 **남긴다**.
2. 담당자·관리자·편집자를 **다른 사람으로 바꾼다**. 바꾸지 않은 미완료 Task 담당자는 비워 두고 "재배정 필요"로 표시합니다.
3. 하위 ACL과 편집자 지정을 **제거한다**.

선택 결과는 하나의 트랜잭션으로 적용하고 Activity Log에 남깁니다.

### 5-4. 행사 자료 (5.3절)

| 유형 | 저장 방식 | 예 |
| --- | --- | --- |
| UPLOAD | Supabase Storage + 메타데이터 | PDF, XLSX, PNG |
| EXTERNAL_LINK | URL + 제목 + 설명 | Google Drive, OneDrive, 미리캔버스 |

- `event_resources`에는 `resource_type`, `storage_path`, `external_url`, `title`, `description`, `uploaded_by`를 둡니다.
- 업로드 자료는 **비공개 Storage Bucket**에 둡니다. 다운로드·업로드·삭제 권한은 Event 열람·관리 권한과 연결하고, 필요하면 짧게 만료되는 서명 URL을 발급합니다.
- 저장 경로에 `term_id/event_id`를 넣되, **파일 이름만으로 권한을 판단하지 않습니다.**
- 외부 URL은 `https`만 허용하고 새 창으로 엽니다. 외부 Drive는 이 플랫폼의 ACL로 보호할 수 없으므로, 등록·수정할 때 원본 서비스의 공유 권한을 확인합니다.

### 5-5. 일정 (5.4절)

| 구분 | 열람 범위 |
| --- | --- |
| Term 공통 일정 | 같은 Term 활성 구성원 전체 |
| Event 일정 | 그 Event 범위를 상속 |

시간 일정은 `timestamptz`로 저장하고 화면에는 `Asia/Seoul`로 보여 줍니다. **종일 일정**은 시간대 변환 때문에 날짜가 하루 밀리지 않도록 `start_date`, `end_date`를 따로 씁니다. 반복 일정과 Google Calendar 동기화는 MVP에서 뺍니다.

### 5-6. 인수인계 (5.5절)

Handover는 Event **또는** Department 중 정확히 하나에 연결합니다(CHECK 제약).

- 필드: `term_id`, `event_id` 또는 `department_id`, `title`, `content`, `status`(DRAFT / PUBLISHED / ARCHIVED), `owner_id`, `published_at`, `created_at`, `updated_at`
- 초안은 작성자와 관리 권한자만, 발행본은 그 Event 열람자 또는 그 부서 활성 구성원과 회장단이 읽습니다.
- 본문은 BlockNote Block JSON으로 저장하고 **실시간 공동 편집은 하지 않습니다.** 동시 수정은 `updated_at` 기반 낙관적 잠금으로 막습니다.
- 이전 기수 자료를 새 운영진에게 넘길 때는 읽기 전용 **Archive Grant**를 씁니다(00-3).

### 5-7. Event 하위 자원 변경 권한 (5.6절)

| 행위 | MEMBER | DIRECTOR | EXECUTIVE |
| --- | --- | --- | --- |
| Event 생성 | X | 주관 국이 자기 국 | 같은 Term 전체 |
| 기본 정보·상태 변경 | X | 관리하는 Event | 같은 Term 전체 |
| 공개 모드·ACL 변경 | X | 관리하는 Event | 같은 Term 전체 |
| `manager_id` 변경 | X | 관리하는 Event에서 같은 Term 구성원으로 | 같은 Term 전체 |
| Resource 등록 | 열람 가능한 Event | 열람 가능한 Event | 같은 Term 전체 |
| Resource 수정·삭제 | 본인 등록 자료 | 관리하는 Event | 같은 Term 전체 |
| Event 일정 생성·수정·삭제 | X | 관리하는 Event | 같은 Term 전체 |
| Term 공통 일정 생성·수정·삭제 | X | X | 같은 Term 전체 |
| Handover 초안 작성 | 열람 가능한 Event·자기 국 | 관리하는 Event·자기 국 | 같은 Term 전체 |
| Handover 발행·보관 | X | 관리하는 Event·자기 국 | 같은 Term 전체 |

Resource 삭제는 Storage 객체와 메타데이터를 함께 지우고 Activity Log에 남깁니다. `ARCHIVED` Event와 그 하위 자원은 읽기 전용입니다.

> [!QUIZ]
> ALL_COUNCIL이던 축제 행사를 RESTRICTED(재무국만)로 바꿨습니다. 홍보국원 C가 이 행사의 미완료 Task 담당자였습니다. 저장하려면 무엇을 골라야 하나요?

> [!ANSWER]
> 충돌 목록에 C와 그 Task가 표시되고, 셋 중 하나를 골라야 저장됩니다: ① C를 Event ACL에 `USER`로 남긴다, ② 담당자를 재무국 사람으로 바꾼다(안 바꾸면 담당자를 비우고 "재배정 필요" 표시), ③ 하위 ACL·지정을 제거한다. 선택은 한 트랜잭션으로 적용됩니다.

## 학습 경로

[← 00-1 목표·원칙·조직과 권한](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-01) · [00-3 회의록·건의·기수 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-03)
