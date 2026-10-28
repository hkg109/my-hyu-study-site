---
title: "04-1 · 테이블과 관계"
description: "관계형 데이터베이스의 테이블·행·열·기본 키·외래 키와 1:1·1:N·N:M 관계를 학생회 테이블로 익히고, 기획서의 ERD를 기수(terms)를 뿌리로 읽는 법, ID로 가리키는 이유, 추가 결정으로 생긴 테이블까지 정리합니다."
order: 1
published: true
duration: 40
tags: [데이터베이스, PostgreSQL, 테이블, 기본 키, 외래 키, ERD, 관계]
objectives:
  - 테이블·행·열·기본 키·외래 키를 학생회 예로 설명한다.
  - 1:N과 N:M 관계를 구분하고, N:M에 연결 테이블이 필요한 이유를 말한다.
  - ERD에서 terms가 뿌리인 이유와 event_id가 선택인 테이블을 말한다.
  - 추가 결정으로 생긴 테이블 다섯 개의 역할을 말한다.
---

[![Supabase 층의 PostgreSQL이 강조된 세 층 지도](/materials/diagrams/cpg-14-stack-db.svg)](/materials/diagrams/cpg-14-stack-db.svg)

*그림 04-1 · 이 과목은 Supabase 층이다 — 누르면 원본 크기로 열린다.*

## 1. 데이터베이스가 하는 일

이 프로젝트의 DB는 Supabase가 운영하는 **PostgreSQL**입니다. DB의 일은 두 가지입니다.

1. **오래 보관한다.** 서버가 다시 시작돼도, 브라우저를 닫아도 남는다.
2. **잘못된 상태를 막는다.** 규칙(제약조건)과 권한(RLS)으로, 어떤 경로로 들어온 요청이든 마지막에 거른다.

두 번째가 이 프로젝트에서 특히 중요합니다. 기획서 원칙 "보안은 DB에서 강제"가 여기서 구현됩니다.

## 2. 테이블·행·열·키

```text
tasks 테이블
┌──────────┬─────────────────┬─────────────┬──────────┬─────────────┐
│ id (PK)  │ title           │ status      │ term_id  │ assignee_id │
├──────────┼─────────────────┼─────────────┼──────────┼─────────────┤
│ t-101    │ 부스 배치도      │ DONE        │ term-26  │ u-7         │  ← 행(Row) 하나 = 업무 하나
│ t-102    │ 간식 예산        │ TODO        │ term-26  │ null        │
└──────────┴─────────────────┴─────────────┴──────────┴─────────────┘
              ↑ 열(Column) 하나 = 업무의 한 가지 속성
```

| 용어 | 뜻 | 예 |
| --- | --- | --- |
| **테이블** | 같은 종류의 기록 모음 | `tasks`, `events` |
| **행(Row)** | 기록 하나 | 업무 하나 |
| **열(Column)** | 속성 하나, 정해진 자료형 | `title text`, `due_date date` |
| **기본 키(Primary Key, PK)** | 행마다 다른, 바뀌지 않는 ID | `tasks.id` |
| **외래 키(Foreign Key, FK)** | 다른 테이블의 PK를 가리키는 열 | `tasks.term_id → terms.id` |

이 프로젝트의 ID는 대부분 **UUID**(`6f1c2a90-1b2e-…` 같은 무작위 128비트 값)입니다. 순서 번호(1, 2, 3…)와 달리 다른 업무의 ID를 짐작할 수 없습니다.

### 이름 대신 ID로 가리키는 이유

업무에 담당자 **이름**("김국원")을 적어 두면:
- 이름이 바뀌면 그 사람의 모든 업무를 찾아 고쳐야 합니다.
- 동명이인을 구별할 수 없습니다.

대신 `assignee_id`로 `profiles` 행을 **가리키면**, 이름은 `profiles` 한 곳에만 있고 화면을 그릴 때 JOIN으로 가져옵니다(04-2편).

## 3. 관계의 종류

| 관계 | 뜻 | 학생회 예 | 구현 |
| --- | --- | --- | --- |
| 1:1 | 하나에 정확히 하나 | `auth.users` ↔ `profiles` | `profiles.id`가 곧 `auth.users.id` |
| 1:N | 하나에 여러 개 | 기수 하나 → 업무 여러 개 | N쪽(`tasks`)에 FK(`term_id`) |
| N:M | 여러 개 ↔ 여러 개 | 회의록 ↔ 편집자 | **연결 테이블** `meeting_editors(meeting_id, user_id)` |

N:M은 한쪽 테이블에 열 하나로 담을 수 없습니다. 회의록에 `editor_id` 열 하나를 두면 편집자를 한 명밖에 못 넣고, `editor_ids` 배열로 두면 FK 검사와 RLS가 어려워집니다. 그래서 "어느 회의록 — 어느 사용자" 짝을 한 행씩 저장하는 연결 테이블을 둡니다. ACL 테이블들(`task_access_rules` 등)도 같은 원리입니다.

## 4. ERD 읽기 — terms가 뿌리

[![전역 테이블 아래 terms를 뿌리로 부서·직책, 승인 명단과 Membership, 행사, 업무, 회의록, 일정·인수인계, 건의, Archive Grant가 가지처럼 연결된 그림](/materials/diagrams/cpg-03a-erd.svg)](/materials/diagrams/cpg-03a-erd.svg)

*그림 04-2 · 핵심 테이블의 관계 — 누르면 원본 크기로 열린다.*

| 읽는 순서 | 내용 |
| --- | --- |
| ① 전역 | `profiles`(사람), `dashboard_links`(바로가기), `activity_logs`(기록)는 기수와 무관 |
| ② 뿌리 | `terms`. 거의 모든 내부 기록에 `term_id`가 있음 |
| ③ 조직 | `departments`, `positions`, `approved_council_accounts` → `memberships` |
| ④ 업무 묶음 | `events`와 그 ACL·자료. `tasks`·`meeting_minutes`·`schedules`·`handovers`는 **Term에 직접 속하고 `event_id`는 선택** |
| ⑤ 건의 | `suggestions`, 그리고 신원을 떼어 둔 `suggestion_authors`, 답변 `suggestion_messages` |
| ⑥ 과거 열람 | `term_archive_access` |

> [!EXAM]
> **왜 모든 기록에 `term_id`가 있나?** 권한의 기준이 "**같은 Term의** 활성 Membership"이기 때문입니다. 2026 회장단이었던 사람이 2027 기록을 자동으로 보지 못하게 하려면, 모든 기록이 자기 기수를 알아야 합니다. `event_id`가 있는 업무는 그 Event와 같은 Term이어야 한다는 규칙도 DB가 검사합니다(04-3편의 복합 FK).

### 사람과 소속을 나누는 이유

```text
profiles (사람)            memberships (어느 기수에서 무슨 역할)
┌──────┬────────┐          ┌────────┬────────┬──────────┬───────────┐
│ u-7  │ 김OO   │ ◀─────── │ term-26│ u-7    │ MEMBER   │ 홍보국     │
│      │        │ ◀─────── │ term-27│ u-7    │ DIRECTOR │ 홍보국     │
└──────┴────────┘          └────────┴────────┴──────────┴───────────┘
```

한 사람이 2026년엔 국원, 2027년엔 국장일 수 있습니다. 그래서 `profiles`에는 사람 정보만, Role·부서는 기수마다 `memberships`에 둡니다.

## 5. 테이블 묶음 전체 (기획서 + 추가 결정)

| 묶음 | 테이블 | 핵심 관계 |
| --- | --- | --- |
| 사람·조직 | `profiles` · `terms` · `departments` · `positions` · `memberships` · `approved_council_accounts` | 부서·직책·Membership은 Term에 속함 |
| 행사 | `events` · `event_access_rules` · `event_resources` | Event 1 : N 자료·ACL |
| 업무 | `tasks` · `task_access_rules` | Task 1 : N ACL |
| 회의록 | `meeting_minutes` · `meeting_access_rules` · `meeting_editors` · `meeting_crdt_updates` · `meeting_crdt_snapshots` · `meeting_templates` | 회의록 N : M 편집자 |
| 일정·인수인계 | `schedules` · `handovers` | Event 또는 Term |
| 건의 | `suggestions` · `suggestion_authors` · `suggestion_messages` | 건의 1 : 1 작성자 (분리) |
| 기록·설정 | `term_archive_access` · `dashboard_links` · `activity_logs` | |
| **추가: 권한 이양** | `term_handover_requests` | ACTIVE Term → DRAFT Term |
| **추가: 회의 안건** | `meeting_agendas` · `meeting_agenda_items` · `meeting_agenda_access_rules` | 안건 1 : N 항목, 안건 1 : 1 회의록 (`meeting_minutes.agenda_id`) |

```text
meeting_agendas (term_id, title, meeting_at, status)
├── meeting_agenda_items (agenda_id, sort_order, title, …)     1:N
├── meeting_agenda_access_rules (agenda_id, …)                 1:N
└── meeting_minutes.agenda_id  ──▶ 안건 하나에 회의록 하나       1:1 (UNIQUE)

terms ─┬─ term_handover_requests.source_term_id  (요청한 ACTIVE 기수)
       └─ term_handover_requests.target_term_id  (넘겨받을 DRAFT 기수)
```

## 6. 직접 해보기

종이에 `terms`, `events`, `tasks`, `profiles`, `memberships` 다섯 상자를 그리고, 각 상자에 PK와 FK를 적은 뒤 화살표로 연결합니다. 그다음 "축제(event) 아래 업무 3개, 행사와 무관한 부서 업무 1개"를 행으로 적어 봅니다.

> [!QUIZ]
> 행사와 무관한 사무국 업무 "회의실 예약 정리"는 `event_id`에 무엇이 들어가나요? 이 업무가 어느 기수 것인지는 어떻게 아나요?

> [!ANSWER]
> `event_id`는 비워 둡니다(`null`). 업무는 Term에 직접 속하므로 `term_id`로 어느 기수 것인지 알고, `department_id`로 사무국 업무임을 압니다.

> [!QUIZ]
> 회의 안건 하나에서 회의록을 두 번 만들 수 없게 하려면 DB에 어떤 규칙을 두면 되나요?

> [!ANSWER]
> `meeting_minutes.agenda_id`에 **UNIQUE** 제약을 둡니다(값이 null인 행끼리는 겹쳐도 됨). 그러면 같은 `agenda_id`를 가진 두 번째 회의록은 저장이 거부됩니다. 화면에서 버튼을 숨기는 것과 별개로 DB가 막습니다.

## 학습 경로

[← 03-4 파일 업로드와 Activity Log](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-03-backend/lecture-04) · [04-2 SQL 읽기·쓰기 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-02)
