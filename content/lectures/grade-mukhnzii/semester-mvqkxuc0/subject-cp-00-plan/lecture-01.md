---
title: "00-1 · 목표·원칙·조직과 권한"
description: "기획서 v0.7의 0–1절. 학생회 운영 플랫폼이 무엇을 위한 서비스인지, 지켜야 할 설계 원칙과 배포 전에 정할 운영값, 국·직책 구조와 Role·Position의 차이, 권한 매트릭스와 ACL 대상까지 정리합니다."
order: 1
published: true
duration: 40
tags: [기획서, 설계 원칙, Role, Position, 권한 매트릭스, ACL]
objectives:
  - 이 서비스가 "학생회 운영 OS"를 목표로 하는 이유와 핵심 영역 아홉 가지를 말한다.
  - 설계 원칙 열 가지가 각각 무엇을 막으려는 것인지 설명한다.
  - Role·Position·Department를 구분하고, 권한 판정에 Role만 쓰는 이유를 말한다.
  - 권한 매트릭스에서 국원·국장·회장단이 할 수 있는 일을 구분한다.
---

## 이 과목을 읽는 법

00 과목은 기획서 v0.7을 **빠짐없이** 옮긴 요약본입니다. 여기서는 "무엇을 만드는가"만 다루고, "어떻게 만드는가"는 01–07 과목에서 코드로 설명합니다.

[![기획서 총정리, 웹 기초, 프론트엔드·백엔드·데이터베이스·실시간 공동편집, 기능별 구현, n년 운영의 여덟 과목을 다섯 단계로 묶은 지도](/materials/diagrams/cpg-00-course-map.svg)](/materials/diagrams/cpg-00-course-map.svg)

*그림 00-1 · 학생회 프로젝트 과목 지도 — 누르면 원본 크기로 열린다.*

| 과목 | 무엇을 배우나 | 이런 사람부터 |
| --- | --- | --- |
| 00 기획서 총정리 | 만들 서비스의 규칙 전부 | 모두 |
| 01 웹 기초와 코드 읽기 | 웹 동작 원리, HTML·CSS·JavaScript·TypeScript 읽는 법 | 코딩이 처음인 사람 |
| 02 프론트엔드 | React·Next.js 화면, Tailwind, 접근성 | 화면 담당 |
| 03 백엔드 | Server Action, Supabase 클라이언트, 로그인, 파일 | 서버 담당 |
| 04 데이터베이스 | 테이블, SQL, 마이그레이션, RLS, DB 테스트 | DB·보안 담당 |
| 05 실시간 공동편집 | BlockNote, Yjs, Realtime | 회의록 담당 |
| 06 기능별 구현 | 기능 하나를 화면→서버→DB로 따라가기 | 02–05를 읽은 뒤 |
| 07 n년 운영 | 계정 소유권, 배포, 기수 교대, 문서화 | 회장단·개발 담당 |

> [!NOTE]
> 기획서 이후에 새로 정한 내용(계정 구조, 회장단 권한 이양, 새 기수 세팅 화면, 회의 안건)은 [00-4편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-04)의 **추가 결정사항**에 따로 모았습니다.

## 1. 3줄 요약 (기획서 머리말)

1. **로그인과 권한:** 학생회 내부 계정은 검증된 학교 Google 계정과 사전 승인 명단을 서버에서 연결합니다. 학교 도메인 검사는 Supabase Auth Hook에서 강제하고, Role과 Permission은 고정된 보안 규칙으로 계산합니다.
2. **행사와 하위 자료:** Event(행사)의 열람 범위를 기준으로 자료·일정·인수인계 권한을 상속합니다. Task(업무)와 회의록은 그 범위 안에서 더 좁은 ACL을 적용합니다. 담당자·편집자·ACL 대상은 Event를 열람할 수 있는 사용자만 지정할 수 있습니다.
3. **회의록:** 회의록은 **BlockNote + Yjs CRDT**로 공동 편집합니다. 묶음 단위 Update를 DB 함수가 저장한 뒤 DB에서 Broadcast해서, Vercel을 거치지 않고도 저장 확인·재시도·재접속 동기화를 보장합니다.

> [!DEFINITION]
> - **ACL(Access Control List):** "이 자료를 누가 볼 수 있나"를 적은 명단.
> - **CRDT:** 여러 사람이 동시에 고쳐도 자동으로 하나로 합쳐지는 데이터 구조. 05 과목에서 자세히 다룹니다.
> - **Term:** 학생회 기수. 예: 2026 제N대 학생회.

### v0.7에서 바뀐 것

| 구분 | 변경 내용 | 관련 절 |
| --- | --- | --- |
| 권한 상속 | 담당자·편집자·ACL 대상 지정 시 Event 열람 가능 여부 검증, Event 범위 축소 시 충돌 처리 | 4.3, 5.2, 6.2 |
| 인증 | 도메인·`hd` 검사를 Auth Hook에서 수행해 비학교 계정의 `auth.users` 생성 차단 | 2.1 |
| CRDT | 클라이언트 묶음 전송, DB 함수 저장 + DB Broadcast, 회의록별 순번 잠금, 서버 초기 Snapshot | 6.4–6.7 |
| 스키마 | `terms`, `profiles`, `departments`, `positions`, `memberships` 등 누락 필드와 Term 소속 정의 | 9.2, 부록 B |
| 권한 표 | Event·Resource·Schedule·Handover·Suggestion·Archive 권한 추가, ROLE_GROUP 값 통일 | 1.3, 1.6, 5.6 |
| Term 전환 | CLOSED Term 접근, 미처리 건의 이월, 종료된 Membership 참조 처리 | 1.5, 7.3, 8.1 |
| Editor·운영 | BlockNote 커스텀 Block 범위, 회의록 상태, 알림·검색 범위, 요금제 제약, RLS 성능 규칙 | 0.2, 6.1, 6.8, 10.4, 13.2 |

## 2. 서비스 목표 (0절)

이 플랫폼은 단순한 학생회 홈페이지가 아닙니다. 학생회 구성원이 **업무를 수행하고, 기록을 다음 운영진에게 남기는** "학생회 운영 OS"가 목표입니다.

핵심 영역은 아홉 가지입니다.

| 영역 | 한 줄 설명 | 자세히 |
| --- | --- | --- |
| 조직/구성원 관리 | 국·직책·구성원·승인 명단 | 00-1, 06-6 |
| Dashboard | 내 업무, 마감 임박, 일정, 바로가기 | 00-2 |
| Task Tracker | 업무 등록·상태·담당자·공개 범위 | 00-2, 06-1 |
| Event 및 행사 자료 | 행사와 그 아래 자료·일정·인수인계 | 00-2, 06-2 |
| Meeting Minutes | 회의록 공동 편집 | 00-3, 06-3 |
| Schedule | 기수 공통 일정과 행사 일정 | 00-2 |
| Suggestion | 학생 건의와 처리 | 00-3, 06-4 |
| Handover | 다음 기수에 남기는 인수인계 | 00-2 |
| Activity Log | 누가 언제 무엇을 바꿨는지 | 00-4 |

## 3. 설계 원칙 (0.1절)

| 원칙 | 적용 방식 | 막으려는 것 |
| --- | --- | --- |
| 운영 데이터 비하드코딩 | 부서, 직책, 구성원, Dashboard 링크, 회의 Template, 열람 대상 등을 DB에서 관리 | 국 이름이 바뀔 때마다 코드를 고치는 일 |
| 보안은 DB에서 강제 | 화면 숨김만 쓰지 않고 Supabase RLS에서 SELECT/INSERT/UPDATE/DELETE 제한 | 주소를 직접 쳐서 들어오는 우회 |
| ACL 기반 열람 제어 | 회의록과 Task에 부서·개인·역할 그룹 단위 접근 규칙. Task는 기본 공개/제한 공개 구분 | 볼 필요 없는 사람이 민감 자료를 보는 일 |
| 읽기와 쓰기 분리 | 회의록 열람, 본문 편집, Realtime 수신·송신, CRDT 저장 권한을 따로 검증 | 읽기만 해야 할 사람이 고치는 일 |
| 저장 확인 후 동기화 | CRDT 업데이트는 저장 성공을 확인하고 전파, 실패 시 재시도·재동기화 | "보였는데 사라진" 회의록 |
| 상위 자원 권한 상속 | Event 자료·일정·인수인계는 Event 열람 범위를 상속, 하위 ACL은 상위 범위를 넓히지 못함 | 행사는 못 보는데 그 자료는 보이는 모순 |
| 권한 규칙 단일화 | Role별 Permission과 범위를 DB 함수에서 계산하고 Frontend·RLS·Realtime이 같은 규칙 사용 | 화면과 DB의 판단이 서로 다른 버그 |
| 기록 보존 | 구성원 삭제는 계정 삭제가 아니라 Membership 종료 | 과거 업무의 담당자 기록이 사라지는 일 |
| 완료 Task 수정 허용 | DONE 상태도 수정·재오픈 가능, 변경은 Activity Log에 기록 | 완료 후 실수를 못 고치는 일 |
| 다음 기수 자동 복제 제외 | Term 개념은 유지하되 이전 기수 데이터 복제는 개발하지 않음 | 지난 기수의 권한·자료가 그대로 넘어오는 일 |

> [!EXAM]
> ==보안은 DB에서 강제한다==가 이 기획서 전체를 관통하는 원칙입니다. 버튼을 숨기는 것은 "편의"일 뿐이고, 실제로 막는 곳은 DB의 RLS입니다. 04 과목 전체가 이 원칙을 구현하는 방법입니다.

## 4. 개발 전 확정할 운영값 (0.2절)

아래 값은 코드에 임의로 넣지 않고, 운영진이 **배포 전에** 결정해 환경 설정이나 관리자 설정으로 관리합니다. 정하지 못한 값은 개발 티켓에 `TBD`로 남기고 배포 조건에서 확인합니다.

| 항목 | 결정할 값 |
| --- | --- |
| Realtime 권한 회수 | ACL 회수 후 기존 연결이 끊겨야 하는 최대 시간, JWT 유효 시간 |
| 업로드 정책 | 파일 1개 크기, 허용 확장자·MIME, 총 보관 용량, 악성 파일 검사 방식 |
| 기록 보존 | 탈퇴·졸업 사용자 Profile, 건의 작성자 정보, Activity Log, CRDT Update의 보존 기간 |
| 이전 기수 열람 | 새 운영진에게 공개할 Term·Event·Handover 범위와 열람 종료 시점 |
| 건의 처리 시간 | 상태별 목표 처리 시간과 작성자 안내 문구 |
| CRDT 전송 | Update 묶음 간격(제안 200–500ms), Snapshot 생성 주기 |
| 인프라 요금제 | Supabase·Vercel 요금제와 그 한도 (→ 00-4에서 **무료 요금제로 확정**) |
| 이월 정책 | Term 종료 시 미처리 건의를 새 Term으로 넘길지, 이전 회장단이 마감할지 |

## 5. 학생회 조직 구조 (1.1절)

```text
학생회
├─ 회장
├─ 부회장
├─ 사무국      ── 사무국장 · 국원 N명
├─ 재무국      ── 재무국장 · 국원 N명
├─ 홍보국      ── 홍보국장 · 국원 N명
└─ 생활복지국  ── 생활복지국장 · 국원 N명
```

위 구조는 **초기 Seed**(처음 넣어 두는 예시 데이터)입니다. `사무국`, `재무국` 같은 이름을 코드에 고정하지 않습니다. 회장단은 관리 화면에서 부서를 추가·수정·정렬·비활성화할 수 있습니다.

## 6. Role과 Position은 다르다 (1.2절)

| 구분 | 값 예시 | 의미 |
| --- | --- | --- |
| **Role** | `MEMBER`, `DIRECTOR`, `EXECUTIVE` | Membership에 저장하는 **보안 권한 레벨** |
| **Position** | 회장, 부회장, 사무국장, 국원 | 화면에 보이는 **직책 이름** |
| **Department** | 사무국, 재무국, 홍보국 | 소속 조직 |

- 문서에서 **회장단 = EXECUTIVE**, **국장 = DIRECTOR**, **국원 = MEMBER**입니다.
- `STUDENT`는 저장된 Role이 아닙니다. **활성 Membership이 없는 로그인 사용자**를 부르는 이름입니다.
- Role은 보안 경계라서 고정된 세 값만 씁니다. Position과 Department는 운영진이 DB에서 관리합니다.

[![학교 외 계정은 거부되고, 학교 계정 로그인 사용자는 일반 학생이며, 승인 명단과 활성 Membership이 있는 사람만 MEMBER·DIRECTOR·EXECUTIVE로 내부 자료를 쓰는 포함 관계](/materials/diagrams/cpg-01a-user-scope.svg)](/materials/diagrams/cpg-01a-user-scope.svg)

*그림 00-2 · 로그인과 학생회 권한은 다르다 — 누르면 원본 크기로 열린다.*

### Membership 규칙

- 한 사용자는 한 Term에 **활성 Membership을 하나만** 가집니다. (`term_id + user_id`, `is_active = true` 조건의 부분 유일 제약)
- `EXECUTIVE`는 부서가 없어도 됩니다. `DIRECTOR`와 `MEMBER`는 반드시 같은 Term의 부서에 속합니다.
- 한 부서의 활성 `DIRECTOR`는 MVP에서 **1명**입니다. 공동 국장이 필요하면 운영값으로 다시 정합니다.

> [!QUIZ]
> 회장이 "홍보 담당 부회장"이라는 Position을 새로 만들었습니다. 이 사람이 건의 작성자 신원을 볼 수 있는지는 무엇으로 결정되나요?

> [!ANSWER]
> Position 이름이 아니라 **Role**로 결정됩니다. 그 사람의 Membership Role이 `EXECUTIVE`면 볼 수 있고, `DIRECTOR`나 `MEMBER`면 볼 수 없습니다. 그래서 EXECUTIVE를 부여하는 화면에는 "이 사람도 건의 작성자 신원을 볼 수 있다"는 경고를 띄웁니다.

## 7. 권한 매트릭스 (1.3절)

| 기능 | 일반 학생 | 국원 | 국장 | 회장단 |
| --- | :---: | :---: | :---: | :---: |
| 건의사항 작성 | O | O | O | O |
| 건의 작성자 신원 확인 | 본인 | X | X | O |
| 내부 Dashboard | X | O | O | O |
| 본인 Task 수정 | X | O | O | O |
| DONE Task 수정/재오픈 | X | 권한 범위 | 권한 범위 | O |
| 국 구성원 추가/제외 | X | X | 자기 국 | 전체 |
| Task 열람 ACL 설정 | X | X | 관리 가능한 Task | 전체 |
| 회의 안건 작성 (추가 결정) | X | X | O | O |
| 회의록 생성 | X | X | O | O |
| 회의록 작성자 지정 | X | X | O | O |
| 회의록 본문 편집 | X | 지정된 편집자 | 지정된 편집자 | 관리 권한 범위 |
| 회의록 열람 범위 설정 | X | X | 자신이 만든 회의록 | 전체 |
| Event 생성 | X | X | 자기 국 Event | 전체 |
| Event 수정·열람 범위 변경 | X | X | 관리하는 Event | 전체 |
| Event 자료 등록 | X | 열람 가능한 Event | 열람 가능한 Event | 전체 |
| Event 자료 수정·삭제 | X | 본인 등록 자료 | 관리하는 Event | 전체 |
| Term 공통 일정 관리 | X | X | X | O |
| Event 일정 관리 | X | X | 관리하는 Event | 전체 |
| Handover 작성 | X | 열람 가능한 Event·자기 국 | 관리하는 Event·자기 국 | 전체 |
| Handover 발행 | X | X | 관리하는 Event·자기 국 | 전체 |
| 건의 담당 지정 | X | X | X | O |
| 건의 답변·내부 메모 | X | 배정된 건 | 배정된 건 | 전체 |
| Archive Grant 부여 | X | X | X | O |
| 조직/부서/직책 설정 | X | X | X | O |
| Dashboard Quick Links 관리 | X | X | X | O |
| 다음 회장단 지정·승인 (추가 결정) | X | X | X | O |

"관리하는 Event"는 `events.manager_id`가 본인이거나 `owner_department_id`가 자기 국인 Event입니다.

## 8. Permission 계산 방식 (1.4절)

Permission Key 목록과 Role별 기본 매핑은 **마이그레이션 파일**로 관리합니다. MVP에서는 관리 화면에서 Role의 보안 권한을 바꾸지 않고, `권한` 메뉴는 조회만 합니다.

권한 계산의 입력은 네 가지입니다.

1. 요청한 사용자의 **같은 Term 활성 Membership과 Role**
2. 그 Membership의 Department
3. 대상 자원의 Term, 소유 Department, 생성자, 담당자, 관리자
4. 대상 자원의 공개 모드와 ACL

Frontend는 계산된 Permission으로 **버튼만** 보여 주고, DB 함수가 같은 규칙으로 RLS와 RPC를 판정합니다. 보안 함수는 고정 `search_path`를 쓰고 일반 사용자가 고칠 수 없는 스키마에 둡니다.

## 9. 국장의 구성원 관리 (1.5절)

국장은 **자기 국에 한해** 구성원을 추가하거나 제외합니다.

- **추가:** `@hanyang.ac.kr` 이메일을 등록하고 `MEMBER` Role로 자기 국에 배정합니다. 이때 `approved_council_accounts`에 승인 행이 생기고, 그 사람이 처음 로그인할 때 Membership이 활성화됩니다.
- **제외:** `memberships.left_at` 또는 `is_active = false`로 Membership을 종료합니다. Profile과 과거 Task·Event·회의록 기록은 지우지 않습니다.
- 다른 국 구성원을 고치거나 `DIRECTOR`·`EXECUTIVE`로 승격하는 것은 **불가**합니다.
- 서버가 권한을 검사한 뒤 처리하며, 클라이언트가 Role·Term·Department를 임의로 지정해 우회할 수 없습니다.

### 종료된 Membership이 남긴 흔적

Membership을 종료해도 과거 기록의 `assignee_id`, `manager_id`, `author_id`, `meeting_editors`는 지우지 않습니다. 대신 권한 판정은 항상 **활성** Membership을 요구하므로, 종료된 사용자는 아무 권한도 쓰지 못합니다.

- 종료 화면은 그 사람이 담당·관리 중인 미완료 Task, 관리 중인 Event·RESTRICTED Task, 편집자인 진행 중 회의록 수를 보여 줍니다.
- 관리 책임은 다른 활성 구성원에게 넘기거나, 넘기지 않으면 소속 국의 활성 국장(없으면 회장단)에게 자동으로 갑니다.
- Dashboard와 목록에는 "담당자 비활성" 표시로 재배정이 필요한 Task를 보여 줍니다.

## 10. ACL 대상 값 (1.6절)

Event·Task·Meeting의 ACL은 모두 같은 형식을 씁니다.

| `subject_type` | 사용하는 필드 | 의미 |
| --- | --- | --- |
| `ROLE_GROUP` | `role_group` | 아래 역할 그룹 |
| `DEPARTMENT` | `department_id` | 같은 Term 그 부서의 활성 구성원 전체(국장 포함) |
| `USER` | `user_id` | 같은 Term에 활성 Membership이 있는 특정 사용자 |

| `role_group` | 포함 대상 |
| --- | --- |
| `ALL_COUNCIL` | 같은 Term의 활성 MEMBER·DIRECTOR·EXECUTIVE 전체 |
| `DIRECTORS` | 같은 Term의 활성 DIRECTOR와 EXECUTIVE |
| `EXECUTIVES` | 같은 Term의 활성 EXECUTIVE |

ACL 테이블에는 `subject_type`에 맞는 필드 **하나만** 채워지도록 CHECK 제약을 두고, 같은 대상의 중복은 유일 제약으로 막습니다. 대상 부서·사용자의 Term이 자원의 `term_id`와 다르면 저장을 거부합니다.

## 11. 상위 범위 밖 지정 금지 (1.7절)

Event에 속한 Task·회의록에서 아래 지정은 **대상이 그 Event를 열람할 수 있을 때만** 허용합니다.

- Task: `assignee_id`, `manager_id`, `task_access_rules`의 `USER`·`DEPARTMENT` 대상
- 회의록: `author_id`, `meeting_editors`, `meeting_access_rules`의 `DEPARTMENT` 대상

지정 화면은 Event를 열람할 수 없는 사용자·부서를 선택 목록에서 비활성화하고 이유를 보여 줍니다. Event 관리 권한이 있으면 같은 화면에서 Event ACL에 대상을 먼저 추가할 수 있습니다. 서버 RPC도 같은 검사를 하고, 실패하면 저장하지 않습니다.

이 규칙이 막는 두 가지 모순 상태:
- "편집 권한은 있는데 열람할 수 없는" 상태
- "ACL에 넣었는데 실제로는 보이지 않는" 상태

회장단, Event 생성자, Event 관리자는 Event 열람자에 항상 포함되므로 별도 검사 없이 지정할 수 있습니다.

> [!QUIZ]
> 재무국만 볼 수 있는 RESTRICTED 행사 "협찬 계약"이 있습니다. 재무국장이 이 행사의 Task 담당자로 홍보국원 B를 지정하려고 하면 어떻게 되나요?

> [!ANSWER]
> B는 그 행사를 열람할 수 없으므로 선택 목록에서 비활성화되고, 서버 RPC도 저장을 거부합니다. 재무국장이 행사 관리자라면 먼저 Event ACL에 B를 `USER`로 추가한 다음 담당자로 지정할 수 있습니다.

## 학습 경로

[00-2 로그인과 핵심 기능 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-02)
