---
title: "3 · 데이터베이스와 로그인"
description: "테이블·행·키와 핵심 테이블의 관계, 먼저 익힐 SQL 명령과 DB 제약, 마이그레이션·Seed·Soft Delete를 배우고, OAuth·ID Token·JWT와 Auth Hook·승인 명단으로 학생회 계정이 만들어지는 흐름을 따라갑니다."
order: 3
published: true
duration: 55
tags: [데이터베이스, SQL, 마이그레이션, OAuth, JWT, Auth Hook, Allowlist]
objectives:
  - Primary Key·Foreign Key·1:N·N:M 관계를 학생회 테이블로 설명한다.
  - NOT NULL·UNIQUE·CHECK·Transaction이 어떤 잘못된 상태를 막는지 예를 든다.
  - 마이그레이션과 Seed, Soft Delete가 왜 필요한지 말한다.
  - 인증과 인가를 구분하고, 로그인 결과가 세 갈래로 나뉘는 조건을 설명한다.
---

## 학습 경로

[← 2편 Git과 화면 기술](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-02) · [4편 권한과 민감 정보 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-04)

## 1. 테이블, 행, 키

관계형 DB의 **테이블**은 같은 종류의 기록을 담는다. 한 줄은 **행(Row)**, 항목 하나는 **열**(Column)이다.

- **Primary Key:** 한 행의 고유 ID. 예: `tasks.id`
- **Foreign Key:** 다른 테이블의 행을 가리키는 ID. 예: `tasks.event_id`

Task에 담당자 **이름**을 반복 저장하면 이름이 바뀔 때 과거 업무마다 고쳐야 한다. 대신 `assignee_id`로 사용자 기록을 **가리킨다**.

- 한 Event에 여러 Task가 연결되면 **1:N** 관계다.
- 한 회의록에 여러 편집자가 있고 한 사람이 여러 회의록을 편집하면 **N:M** 관계다. 이때는 `meeting_editors` 같은 **연결 테이블**을 둔다.

### 핵심 테이블의 관계

[![전역 테이블 profiles, dashboard_links, activity_logs 아래에 terms를 두고, terms에 속하는 departments와 positions, approved_council_accounts에서 memberships로, events, tasks, meeting_minutes, schedules와 handovers, suggestions, term_archive_access가 가지처럼 연결된 데이터 모델 그림](/materials/diagrams/cpg-03a-erd.svg)](/materials/diagrams/cpg-03a-erd.svg)

*그림 3-1 · 핵심 테이블의 관계(기획서 9절 요약) — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **terms(기수)가 뿌리다.** 부서·직책·Membership·행사·업무·회의록·건의가 모두 어느 Term의 것인지 안다.
> - ==red:업무·회의록·일정·인수인계는 Event 아래에만 있는 것이 아니다.== Term에 직접 속하고 Event 연결(`event_id`)은 **선택**이다. `event_id`가 있으면 그 Event와 같은 Term이어야 한다.
> - `profiles`는 기수와 무관한 사람 기록이고, 기수별 소속·Role은 `memberships`가 맡는다. 그래서 같은 사람이 2026년엔 국원, 2027년엔 국장일 수 있다.
> - `suggestion_authors`는 건의 작성자 신원을 따로 떼어 둔 테이블이다(4편).

## 2. SQL에서 먼저 익힐 것

| 명령 | 뜻 | 학생회 예 |
| --- | --- | --- |
| SELECT | 읽기 | 이번 기수의 내 업무 목록 |
| INSERT | 추가 | 새 업무 등록 |
| UPDATE | 수정 | 상태를 DONE으로 변경 |
| DELETE | 삭제 | 실제 물리 삭제가 꼭 필요할 때만 |
| WHERE | 대상 제한 | 특정 Term과 담당자의 업무만 |
| JOIN | 다른 테이블 연결 | 업무와 담당자 표시명 함께 조회 |

```sql
SELECT id, title, status
FROM tasks
WHERE term_id = '예시-기수-ID'
ORDER BY due_date;
```

위 SQL은 문법을 읽기 위한 예시다. 실제 ID 형식과 RLS를 반영한 쿼리는 따로 작성한다.

## 3. DB가 잘못된 상태를 막는 장치

| 장치 | 막는 것 | 학생회 예 |
| --- | --- | --- |
| **NOT NULL** | 값이 비는 것 | 업무 제목 |
| **UNIQUE** | 중복 | 한 Term의 같은 승인 이메일 |
| **부분 UNIQUE** | 조건이 맞는 행끼리의 중복 | ACTIVE Term은 하나만 |
| **CHECK** | 잘못된 값 조합 | Handover는 Event 또는 Department 중 **정확히 하나**에 연결 |
| **Foreign Key** | 없는 행 참조 | 존재하지 않는 부서·행사 ID |
| **Transaction** | 반쯤만 된 변경 | 이전 Term 종료와 새 Term 활성화를 함께 |
| **Index** | 느린 검색 | 목록과 권한 검사에 자주 쓰는 열 |
| **Trigger** | 빠뜨린 후속 작업 | 상태 변경 때 기록 남기기 |

> [!DEFINITION]
> - **Migration:** 테이블·열·정책 변경을 파일로 남긴 버전 기록. ==red:팀원마다 Supabase 화면에서 즉흥적으로 구조를 고치면 환경이 서로 달라진다.==
> - **Seed:** 처음 시작할 때 넣는 기본 데이터. 기획서의 사무국·재무국·홍보국·생활복지국은 초기 Seed이지 영원히 고정된 부서명이 아니다.
> - **Soft Delete:** 기록을 바로 지우지 않고 보관 표시를 남기는 방식. 예: `tasks.archived_at`, `memberships.left_at`

### 직접 해보기

Term·Event·Task 세 상자를 그리고 각 상자에 ID와 연결 ID를 적는다. 한 Event에 Task 세 개를 연결한 뒤 왜 이름 대신 ID를 저장하는지 설명한다.

> [!QUIZ]
> 새 기수를 시작할 때 “이전 Term 종료”와 “새 Term 활성화”를 Transaction으로 묶지 않으면 어떤 일이 생길 수 있나?

> [!ANSWER]
> 첫 번째만 성공하고 두 번째가 실패하면 **ACTIVE Term이 하나도 없는** 상태가 된다(반대 순서면 둘이 동시에 ACTIVE가 되려다 부분 UNIQUE에 막힌다). 그 사이 모든 구성원이 내부 자료에 접근하지 못한다. Transaction은 둘 다 성공하거나 둘 다 취소되게 해 중간 상태를 없앤다.

## 4. 로그인: OAuth, ID Token, JWT, 승인 명단

> [!DEFINITION]
> - **인증(Authentication):** “누구인가?”를 확인한다.
> - **인가(Authorization):** “이 자료에 이 행동을 해도 되는가?”를 판단한다.
>
> ==학교 Google 로그인에 성공한 일반 학생은 인증되었지만, 학생회 내부 자료 열람은 인가되지 않았다.==

- **OAuth / OpenID Connect:** 서비스가 Google 비밀번호를 직접 받지 않고 로그인 결과를 확인하는 방식이다.
- **ID Token:** 로그인 결과에 담긴 정보. `email`, `email_verified`, 학교 Google Workspace 여부를 판단하는 데 쓸 수 있는 `hd` 같은 클레임이 있다. 실제 학교 계정 운영 방식과 필요한 클레임은 배포 전에 확인한다.
- **JWT:** 유효기간과 서명이 있는 디지털 출입증. 로그인 사용자를 식별하는 데 도움을 주지만 ==red:Role과 자료 접근을 보장하지는 않는다.== 권한을 회수하면 DB는 다음 요청부터 현재 Membership을 다시 확인한다.

### 계정이 만들어지는 흐름

[![학교 Google 계정을 고르면 Auth Hook이 이메일 검증과 학교 계정 여부를 확인해 아니면 생성을 거부하고, 통과하면 Profile 경로가 다시 검사한 뒤 같은 Term 승인 행이 있으면 Membership을 만들고 없으면 일반 학생으로 남는 세 갈래 흐름](/materials/diagrams/cpg-03b-login-flow.svg)](/materials/diagrams/cpg-03b-login-flow.svg)

*그림 3-2 · 로그인 결과는 세 갈래 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - 로그인 화면의 학교 계정 안내나 OAuth 요청의 `hd` 값은 사용자가 계정을 **고르도록 돕는 힌트**다. 실제 차단은 **Before User Created Auth Hook**과 Profile/Membership 활성화 절차에서 한다.
> - 승인 행이 있으면 같은 Term의 Membership을 **원자적으로**(한 번에, 반쯤 만들어지는 일 없이) 만든다.
> - 첫 EXECUTIVE는 자기 자신에게 관리자 권한을 주는 화면을 만들지 않고, 검증된 운영 절차로 초기화한다.

- **Allowlist(승인 명단):** 미리 승인한 계정만 내부 구성원으로 받아들이는 명단. 테이블 이름은 `approved_council_accounts`.
- **STUDENT:** 저장된 Role이 아니다. **유효한 내부 Membership이 없는 로그인 사용자의 상태**를 부르는 이름이다.

### 직접 해보기

학교 계정으로 로그인한 학생 A, 승인 목록에 있는 학생 B, 학교 외 계정 C의 결과를 그린다. 각 경우에 `auth.users`, `profiles`, `memberships`에 무엇이 생기거나 생기지 않아야 하는지 적는다.

> [!QUIZ]
> 위의 A, B, C 각각에 대해 세 테이블에 행이 생기는지 답하라.

> [!ANSWER]
> | 계정 | auth.users | profiles | memberships |
> | --- | :---: | :---: | :---: |
> | A 학교 계정, 승인 없음 | 생김 | 생김 | **없음** → 일반 학생 |
> | B 학교 계정, 승인 있음 | 생김 | 생김 | 같은 Term에 생김 |
> | C 학교 외 계정 | **없음** | **없음** | 없음 (Auth Hook에서 거부) |

> [!QUIZ]
> “학교 계정으로 로그인 가능”과 “학생회 구성원 권한 보유”의 차이를 한 문장으로 말하라.

> [!ANSWER]
> 앞은 **인증**(학교 사람임이 확인됨)이고, 뒤는 **인가**(승인 명단을 거쳐 현재 Term의 활성 Membership이 생김)다. 앞만으로는 건의 작성 외에 아무 내부 자료도 볼 수 없다.
