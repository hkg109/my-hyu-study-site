---
title: "00-4 · 데이터·기술·범위와 추가 결정"
description: "기획서 v0.7의 9–14절과 부록. 핵심 테이블과 RLS 원칙, Permission Key와 Activity Log, 기술 구조와 화면 구조, 개발 순서·MVP 범위·완료 기준 38개를 정리하고, 기획서 이후 정한 계정 구조·회장단 권한 이양·새 기수 세팅 화면·회의 안건을 확정안으로 기록합니다."
order: 4
published: false
duration: 55
tags: [기획서, ERD, RLS, Activity Log, 기술 스택, MVP, 추가 결정]
objectives:
  - 핵심 테이블 25개가 어떤 묶음으로 나뉘는지 말한다.
  - RLS 핵심 원칙 12개와 RLS 구현 규칙을 설명한다.
  - 개발 Phase 0–10과 MVP 포함·제외 범위를 말한다.
  - 추가 결정 네 가지(계정 구조, 권한 이양, 기수 세팅, 회의 안건)의 내용과 새 테이블을 말한다.
---

## 1. 핵심 데이터 모델 (9절)

```text
auth.users
    ↓
profiles

dashboard_links (전역)
activity_logs

terms
    ├── departments
    ├── positions
    ├── approved_council_accounts ──(첫 로그인)──▶ memberships
    ├── memberships ── profiles · departments · positions
    ├── events
    │    ├── event_access_rules
    │    ├── event_resources
    │    ├── tasks (event_id 선택)
    │    ├── meeting_minutes (event_id 선택)
    │    ├── schedules (event_id 선택)
    │    └── handovers (event_id 또는 department_id)
    ├── tasks
    │    └── task_access_rules
    ├── meeting_minutes
    │    ├── meeting_access_rules
    │    ├── meeting_editors
    │    ├── meeting_crdt_updates
    │    └── meeting_crdt_snapshots
    ├── meeting_templates
    ├── suggestions
    │    ├── suggestion_authors
    │    └── suggestion_messages
    └── term_archive_access (source_term_id)
```

[![전역 테이블 아래 terms를 뿌리로 부서·직책, 승인 명단과 Membership, 행사, 업무, 회의록, 일정·인수인계, 건의, Archive Grant가 가지처럼 연결된 그림](/materials/diagrams/cpg-03a-erd.svg)](/materials/diagrams/cpg-03a-erd.svg)

*그림 00-7 · 핵심 테이블의 관계 — 누르면 원본 크기로 열린다.*

`tasks`, `meeting_minutes`, `schedules`, `handovers`는 **Term에 직접 속하고** Event 연결은 선택입니다. `event_id`가 있으면 `term_id`가 Event의 Term과 같아야 합니다(복합 FK 또는 Trigger).

### 테이블 목록 (9.1절)

| 묶음 | 테이블 | 목적 |
| --- | --- | --- |
| 사람·조직 | `profiles` | 사용자 기본 Profile |
| | `approved_council_accounts` | 회장단·국장이 사전 승인한 학생회 계정 |
| | `terms` | 학생회 기수 |
| | `departments` · `positions` | 부서 · 표시 직책 |
| | `memberships` | 기수별 사용자 소속·Role |
| 행사 | `events` · `event_access_rules` · `event_resources` | 행사, 제한 공개 ACL, 업로드·외부 링크 자료 |
| 업무 | `tasks` · `task_access_rules` | 업무, 추가 열람 ACL |
| 회의록 | `meeting_minutes` · `meeting_access_rules` · `meeting_editors` | 메타데이터, 열람 ACL, 공동 편집 권한 |
| | `meeting_crdt_updates` · `meeting_crdt_snapshots` · `meeting_templates` | Yjs 증분 Update, Snapshot, Template |
| 일정·인수인계 | `schedules` · `handovers` | 일정, 행사·부서 인수인계 |
| 건의 | `suggestions` · `suggestion_authors` · `suggestion_messages` | 본문·상태, 접근 제한된 작성자 연결, 답변·내부 메모 |
| 기록·설정 | `term_archive_access` · `dashboard_links` · `activity_logs` | 이전 기수 읽기 권한, 외부 링크, 변경 이력 |

### 권한 계산의 기반 테이블 (9.2절)

RLS 함수가 매 요청 참조하므로 필드와 제약을 먼저 확정합니다.

| 테이블 | 핵심 필드 | 제약 |
| --- | --- | --- |
| `terms` | `name`, `status`(DRAFT/ACTIVE/CLOSED), `starts_on`, `ends_on` | ACTIVE 행은 하나만 (부분 유일 Index) |
| `profiles` | `id`(= `auth.users.id`), `email`, `display_name`, `student_no`(선택) | 이메일 소문자 정규화. 사용자가 직접 고칠 수 있는 열은 `display_name`뿐 |
| `departments` | `term_id`, `name`, `sort_order`, `is_active` | `term_id + name` 유일 |
| `positions` | `term_id`, `name`, `sort_order`, `is_active` | `term_id + name` 유일. 권한 판정에 안 씀 |
| `memberships` | `term_id`, `user_id`, `role`, `department_id`, `position_id`, `is_active`, `joined_at`, `left_at`, `approved_account_id` | 활성 행 기준 `term_id + user_id` 유일. EXECUTIVE가 아니면 `department_id` 필수. 부서·직책은 같은 Term |
| `approved_council_accounts` | 00-2의 필드 | `term_id + lower(email)` 유일 |

`memberships`, `approved_council_accounts`, `terms`에는 클라이언트의 직접 INSERT/UPDATE/DELETE를 허용하지 않고, 권한 검사가 들어간 **RPC로만** 바꿉니다.

## 2. RLS와 Permission (10절)

### 핵심 원칙 (10.1절)

1. 일반 학생은 학생회 내부 데이터에 접근하지 않는다.
2. 현재 Term 내부 접근은 같은 Term의 활성 `memberships`가 있는 계정만. CLOSED Term은 유효한 Archive Grant로만 읽는다.
3. Event 하위 자료의 SELECT는 Event 열람 범위를 먼저 검사한다.
4. Task SELECT는 Event 범위 안에서 공개 모드·기본 접근자·`task_access_rules`를 함께 검사한다.
5. 회의록 SELECT와 Realtime 수신은 Event 범위와 회의록 열람 함수를 검사한다. CRDT Update 저장은 `save_meeting_update()`만 하고, 편집 함수와 회의록 상태를 검사한다.
6. 회의록 ACL 변경은 생성자 DIRECTOR 또는 그 Term의 EXECUTIVE만.
7. 건의 작성자 신원은 작성자 본인과 그 Term의 EXECUTIVE만.
8. Secret·Service Role Key는 브라우저에 노출하지 않는다.
9. Task·회의록 하위 데이터, Storage 객체, Activity Log도 상위 자원의 열람 경계를 따른다. 나중에 검색·알림을 넣을 때도 같은 열람 함수를 쓴다.
10. 권한 판단에 쓰는 Membership은 자원과 같은 Term의 활성 행이어야 한다.
11. 담당자·편집자·ACL 대상 지정은 상위 Event 열람 범위 안에서만.
12. RLS와 Realtime 정책은 기능 개발 단계마다 허용·거부 사례로 검증한다.

[![현재 사용자, Role 기본 능력, 대상 자료의 ACL, 실제 강제의 네 단계를 차례로 통과해야 허용되는 그림](/materials/diagrams/cpg-04a-permission-layers.svg)](/materials/diagrams/cpg-04a-permission-layers.svg)

*그림 00-8 · 권한은 네 단계로 판정한다 — 누르면 원본 크기로 열린다.*

### Permission Key (10.2절)

화면은 Position 이름이 아니라 Permission을 기준으로 기능을 보여 줍니다.

```text
member.manage.department   member.manage.all      role.promote
task.create.department     task.update.completed  task.access.manage
event.create   event.manage   event.access.manage
event.resource.create      event.resource.manage
schedule.term.manage       schedule.event.manage
handover.create            handover.publish
meeting.read   meeting.edit   meeting.create   meeting.confirm
meeting.author.assign      meeting.access.manage  meeting.template.manage
suggestion.author.read     suggestion.assign      suggestion.reply
term.archive.read          term.archive.grant
dashboard.link.manage
```

추가 결정으로 늘어나는 키: `meeting.agenda.create`, `term.handover.request`, `term.handover.approve`, `term.setup.manage`, `term.activate`.

### Activity Log (10.3절)

`activity_logs`는 감사 기록이라 일반 사용자가 UPDATE·DELETE할 수 없는 **append-only**입니다.

- 필드: `term_id`, `resource_type`, `resource_id`, `action`, `actor_id`, `before_summary`, `after_summary`, `request_id`, `created_at`
- 행위자와 시각은 **서버가** 기록하고 클라이언트 입력을 믿지 않습니다.
- 본문 전문, 건의 작성자 ID, CRDT 바이너리, 파일 서명 URL, OAuth Token은 넣지 않습니다. 건의 작성 행위는 `actor_id` 없이 기록합니다.
- 로그 조회 권한은 대상 자원의 열람 권한을 넘지 않고, 전체 조회는 EXECUTIVE만.
- CRDT Update 저장은 행 단위로 로그에 남기지 않습니다(`meeting_crdt_updates.actor_id`로 충분).

### RLS 구현 규칙 (10.4절)

- 권한 함수는 `private` 같은 비공개 스키마에 두고 `SECURITY DEFINER`, `STABLE`, 고정 `search_path`로 선언합니다. `public`에 두지 않아 API로 직접 호출되지 않게 합니다.
- 정책에서 `auth.uid()`와 사용자 단위 함수 호출은 `(select auth.uid())`처럼 감싸 **행마다 다시 계산되지 않게** 합니다.
- 열람 함수 하나(`can_read_task`, `can_read_meeting`, `can_read_event` 등)를 SELECT 정책·하위 테이블·Storage·Realtime 정책이 공유합니다.
- `memberships(term_id, user_id) where is_active`, ACL 테이블의 `(자원 ID, subject_type)`, `meeting_editors(meeting_id, user_id)`, `meeting_crdt_updates(meeting_id, sequence_no)`에 Index를 둡니다.
- 허용·거부 사례를 `pgTAP` 같은 DB 테스트로 작성해 CI에서 돌립니다. 다른 Term 사용자, 종료된 Membership, RESTRICTED Event 밖 사용자, 회수 직후 사용자를 꼭 포함합니다.

## 3. 기술 구조 (11절)

```text
Browser
  │
  ▼
Vercel · Next.js
  ├─ Server Components / Server Actions
  ├─ Client Components
  ▼
Supabase
  ├─ Auth (Google 전용 + Before User Created Hook)
  ├─ PostgreSQL + RLS
  │    └─ save_meeting_update() → realtime.send()
  ├─ Storage
  └─ Realtime
       ├─ Private Broadcast
       └─ Presence

Browser ──(사용자 JWT, RPC 직접 호출)──▶ save_meeting_update()

Meeting Editor
  ├─ BlockNote
  └─ Yjs CRDT
```

[![브라우저(프론트엔드), Vercel의 Next.js 서버(백엔드), Supabase(데이터베이스와 Auth·Storage·Realtime)의 세 층과 각 층의 도구](/materials/diagrams/cpg-11-stack-all.svg)](/materials/diagrams/cpg-11-stack-all.svg)

*그림 00-9 · 세 층과 각 층의 도구 — 누르면 원본 크기로 열린다.*

| 영역 | 기술 | 용도 |
| --- | --- | --- |
| Application | Next.js + TypeScript | UI, SSR, Server Actions, API |
| Deployment | Vercel | 배포와 Preview |
| Styling | Tailwind CSS | UI |
| Auth/DB | Supabase | OAuth, PostgreSQL, RLS |
| Storage | Supabase Storage | 업로드 파일 |
| Realtime | Supabase Realtime | CRDT Update 전달, Presence |
| Editor | BlockNote | Notion형 블록 에디터 |
| CRDT | Yjs | 문자 단위 공동 편집 |

## 4. 화면 구조 (12절)

```text
Dashboard   ── 내 업무 · 마감 임박 · 일정 · 진행 행사 · 최근 회의록 · Quick Links
업무        ── 내 업무 · 소속 국 업무 · 접근 권한이 부여된 다른 국 업무
행사        ── Overview · Task · 일정 · 자료 · 회의록 · 인수인계
회의록      ── 목록 · Editor · 작성자 · 열람 권한   (+ 안건: 추가 결정)
건의사항
관리        ── 구성원/승인 계정 · 부서 · 직책 · 권한 · Dashboard Links · Meeting Templates
             (+ 새 기수 세팅 · 회장단 이양: 추가 결정)
```

### 운영 품질 요구사항 (12.1절)

| 영역 | MVP 기준 |
| --- | --- |
| 접근성 | 키보드로 주요 흐름 완료. Form Label·Focus 표시·명도 대비 확인. Editor 블록 조작에도 키보드 대안 |
| 반응형 | 데스크톱과 모바일에서 조회·상태 변경·건의 제출 가능. 복잡한 관리자 편집은 데스크톱 우선 |
| 관측 가능성 | Auth 실패, RLS 거부, CRDT 저장 실패, Realtime 재연결, Storage 실패를 민감 정보 없이 구조화해 기록 |
| 백업과 복구 | DB·Storage 백업 방식, 보존 기간, 복구 책임자를 배포 전에 정하고 최소 1회 복구 점검 |
| 성능 | Dashboard와 목록은 페이지네이션. RLS가 쓰는 `term_id`, `department_id`, `user_id`, 자원 ID, 상태 필드에 Index |
| 호환성 | 최신 Chrome, Edge, Safari 모바일에서 핵심 흐름 검증 |

## 5. 개발 범위와 순서 (13절)

| Phase | 핵심 개발 |
| --- | --- |
| 0. 설계 | ERD, Event 권한 상속, Task 공개 모드, 회의록 읽기·편집 Permission, Archive Grant, RLS·Realtime 허용·거부 테스트 확정. `realtime.send()`·BlockNote Block 지원 범위 PoC, 요금제 결정 |
| 1. 기반 | Next.js, Vercel, Supabase, Google OAuth, Auth Hook 도메인 차단, DB 테스트 CI |
| 2. 계정·조직 | 승인 명단, Membership, Department, Position, 고정 Permission 매핑 |
| 3. Dashboard | 개인 업무·일정·Quick Links |
| 4. Task | Tracker, DONE 수정, 기본·제한 공개, Task ACL과 RLS 테스트 |
| 5. Event | Event ACL, 업로드·링크 자료, Schedule, Handover |
| 6. Meeting | BlockNote(커스텀 Callout), Template 초기 Snapshot, 회의록 상태, 열람 ACL·편집자 관리와 RLS 테스트 (+ 안건) |
| 7. CRDT | Yjs, 묶음 전송 + DB 저장·발행, 순번 공백 복구, 재시도·재동기화, Snapshot 압축, Awareness, 권한 회수 테스트 |
| 8. Suggestion | 작성자 테이블 분리, 답변·내부 메모, Term 이월, API·로그 비공개 테스트 |
| 9. 기록 | Term 전환 절차, Archive Grant, Activity Log (+ 권한 이양, 세팅 화면) |
| 10. QA | 전체 흐름 E2E, 동시 편집·실패 복구·권한 회수·복구 절차 회귀 테스트 |

**MVP 포함:** 회장단 사전 계정 일괄 등록, 국장의 자기 국 MEMBER 추가·제외, Dashboard Quick Links, Task Tracker + DONE 수정, Task 기본·제한 공개 + 열람 ACL, Event ACL + 권한을 상속하는 업로드·외부 링크·Schedule·Handover, 회의록, 회의록별 열람 범위와 복수 편집자, BlockNote, Yjs 문자 단위 CRDT와 저장 확인·재시도·재접속 동기화, Realtime Private Channel, 회의록 상태, 건의 작성자 신원 분리·답변·내부 메모·이월, Term 전환과 Archive Grant, Activity Log.

**MVP 제외:** 다음 기수 데이터 자동 복제, Google Drive·Calendar 양방향 동기화, 전자결재·회계 시스템, 네이티브 앱, AI 요약·추천, 반복 일정과 외부 캘린더 알림, Role별 Permission을 UI에서 편집, 알림(이메일·푸시·알림 센터 — 마감 임박·담당 지정은 Dashboard에만), 통합 전문 검색(목록별 제목 필터만), Handover 실시간 공동 편집.

## 6. 완료 기준 38개 (14절)

| 분야 | 번호 | 완료 기준 |
| --- | --- | --- |
| 계정·조직 | 1 | 회장단이 계정을 일괄 등록하고 Role·부서·직책을 미리 설정 |
| | 2 | 국장은 자기 국 MEMBER를 추가·제외 |
| | 20 | 새 Term의 첫 회장단 초기화와 기존·다른 Term 계정 접근 차단 검증 |
| | 22 | Role별 Permission은 고정 매핑. Position 이름·화면 표시만으로 권한을 주지 않음 |
| | 29 | 학교 외·이메일 미검증 계정은 Auth Hook에서 거부되어 `auth.users`·`profiles`에 행이 안 생김 |
| | 37 | Membership 종료 시 관리 책임이 넘어가고 담당자 비활성 Task가 표시됨 |
| 회의록 | 3–4 | 기본 열람 범위는 국원 이상 전체. 생성 시 전체·복수 국(임의 개수)·국장단·회장단 중 선택 |
| | 5 | DB 조회 권한과 Realtime 채널 가입 권한이 같은 ACL 사용 |
| | 6–7 | BlockNote Markdown·Slash 사양 구현, Yjs 문자 단위 공동 편집 |
| | 15 | 열람자와 편집자 구분, 열람자에게 CRDT 저장·Broadcast 송신 권한 없음 |
| | 16 | 저장 실패 후 재시도, 중복 Update, 재접속, 동시 편집·Snapshot에서 데이터 유실 없음 |
| | 17 | 권한 회수 사용자는 DB에 즉시 쓰거나 읽지 못하고, Realtime 수신은 정한 시간 안에 끝남 |
| | 32–33 | Update는 `save_meeting_update()`로만 저장, 커밋된 것만 Broadcast. 클라이언트의 `crdt-update` 송신 거부. 순번은 공백·중복 없이 발급, 공백 감지 시 DB 복구 |
| | 34–35 | 동시에 열어도 Template은 한 번만. `CONFIRMED`는 편집자도 저장 불가 |
| 업무·행사 | 8–9 | Task 기본·제한 공개, 특정 부서·N명 지정. 제한 공개는 담당 국에 자동 공개 안 됨. 국원은 권한 없는 타 부서 Task와 하위 자료를 못 봄 |
| | 11, 19 | Event 자료는 업로드와 외부 URL 모두 지원. 업로드는 비공개 Storage 정책, 외부 링크는 원본 공유 권한 확인 |
| | 12, 23 | 완료 Task 수정·재오픈과 이력. 변경 가능 필드·상태 전이를 서버에서 검사, 삭제 대신 보관·복원 |
| | 21, 30, 31 | Event 범위가 하위 자료에 상속되고 Task·회의록 ACL이 넘지 못함. Event를 못 보는 사람은 담당자·편집자·ACL 대상이 될 수 없음(UI·RPC 모두). 범위 축소 충돌을 목록으로 보여 주고 해결해야 저장 |
| | 27 | 시간 일정과 종일 일정 저장 방식 구분, `Asia/Seoul` 표시 검증 |
| 건의 | 10, 18, 24 | 작성자 신원은 본인과 회장단만. 담당자는 API·로그·검색·알림 어디서도 신원을 못 봄. 공개 답변과 내부 메모 분리 |
| 기수·기록 | 13 | 다음 기수 자동 복제 없음 |
| | 25, 36 | CLOSED Term은 읽기 전용, Archive Grant 범위에서만 읽음. 이전 구성원은 Grant 없이 못 읽고, 미처리 건의는 정책대로 처리 |
| | 26 | Activity Log는 수정·삭제 불가, 민감 본문·신원·Token·서명 URL 미저장 |
| 운영 | 14 | 부서명·링크·회의 범위를 코드에 박지 않고 관리자 UI + DB로 |
| | 28 | 운영값 `TBD` 해소, DB·Storage 복구 절차 1회 이상 점검 후 배포 |
| | 38 | 허용·거부 RLS 사례가 DB 테스트로 자동 실행 |

## 7. 부록

**부록 A 기술 근거:**
- [BlockNote Collaboration](https://www.blocknotejs.org/docs/features/collaboration)
- [Yjs](https://docs.yjs.dev/), [Yjs Document Updates](https://docs.yjs.dev/api/document-updates)
- [Supabase Broadcast](https://supabase.com/docs/guides/realtime/broadcast), [Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization), [Presence](https://supabase.com/docs/guides/realtime/presence)
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/reference)
- [Supabase Column Level Security](https://supabase.com/docs/guides/database/postgres/column-level-security), [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)

**부록 B 필드 초안:** 테이블별 전체 필드는 [04-3 마이그레이션과 제약조건](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-03)에서 실제 SQL로 옮기며 설명합니다.

---

## 8. 추가 결정사항 (기획서 v0.7 이후)

> [!EXAM]
> 아래 네 가지는 기획서 원본에는 없고 이후에 확정한 내용입니다. 원본 기획서와 다른 부분은 이 절이 우선합니다.

### 결정 1 · 계정과 배포 구조

| 항목 | 결정 |
| --- | --- |
| 공용 계정 | 학생회 전용 Google 계정 하나가 GitHub·Vercel·Supabase를 **모두 소유** |
| GitHub | Organization(무료) + **공개 저장소**. 소유자 2명 이상, 2단계 인증 필수. 개발자는 Member |
| Vercel | **Hobby(무료)**. main에 합쳐지면 GitHub Actions가 공용 계정 토큰으로 배포 |
| Supabase | **Free**. 운영용 1개 + 개발용 1개 (계정당 무료 프로젝트 2개 한도) |
| 비밀 값 | 저장소에 절대 커밋하지 않음. Vercel 환경변수와 GitHub Secrets에만 |
| 백업 | 무료 요금제는 자동 백업이 없으므로 매달·기수 전환 직전에 직접 내려받아 학생회 공용 Drive에 보관 |

이 결정이 생기는 제약(공개 저장소에 넣으면 안 되는 것, 1주일 비활성 시 Supabase 일시 중지 등)은 [07-1](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-01)에서 다룹니다.

### 결정 2 · 회장단 권한 이양

기획서는 매 기수의 첫 EXECUTIVE를 "운영자"가 서버 절차로 등록하게 했습니다. 이러면 매년 개발자가 DB를 직접 만져야 합니다. 그래서 **현 회장단이 화면에서 다음 회장단을 지정**하도록 바꿉니다.

1. 현 회장(ACTIVE Term의 EXECUTIVE)이 새 Term을 `DRAFT`로 만들고, 다음 회장단의 학교 이메일을 지정합니다 → `term_handover_requests`에 `PENDING` 요청.
2. **요청자가 아닌** 다른 ACTIVE EXECUTIVE 1명이 승인합니다. 승인과 동시에 DRAFT Term의 `approved_council_accounts`에 `role = EXECUTIVE` 행이 생깁니다.
3. 다음 회장이 로그인하면 DRAFT Term의 Membership이 생기고 세팅 화면을 쓰기 시작합니다.
4. 거절·취소·만료(7일)된 요청은 권한 없이 기록만 남습니다.
5. 운영자 서버 절차는 **맨 처음 기수**와 **활성 회장단이 한 명도 없는 비상시**에만 씁니다.

| `term_handover_requests` 필드 | 설명 |
| --- | --- |
| `id` | 요청 ID |
| `source_term_id` | 요청한 쪽 (ACTIVE Term) |
| `target_term_id` | 넘겨받을 쪽 (DRAFT Term) |
| `nominee_email` | 다음 회장단 학교 이메일 (소문자 정규화) |
| `requested_by` · `decided_by` | 요청자 · 승인·거절한 사람 (서로 달라야 함) |
| `status` | PENDING / APPROVED / REJECTED / CANCELLED / EXPIRED |
| `expires_at`, `decided_at`, `created_at` | 기한, 결정 시각, 생성 시각 |

### 결정 3 · 새 기수 세팅 화면

DRAFT Term 안에서 새 회장단이 단계별로 준비하는 화면입니다.

[![기수 정보, 회장단, 부서와 직책, 구성원 등록, 회의 양식, 확인과 전환, 전환 직후 이전 자료 열람의 일곱 단계](/materials/diagrams/cpg-17-term-setup.svg)](/materials/diagrams/cpg-17-term-setup.svg)

*그림 00-10 · 일곱 단계 세팅 마법사 — 누르면 원본 크기로 열린다.*

- 1–4단계(기수 정보, 회장단, 부서·직책, 구성원 등록)가 끝나야 전환 버튼이 켜집니다.
- 전환은 새 Term의 EXECUTIVE가 시작 예정일 이후에 실행하는 `activate_term()` 한 번의 트랜잭션입니다. 기획서 8.1절 전환 절차 3–4단계를 그대로 수행합니다.
- DRAFT Term은 한 번에 **하나만** 있습니다(부분 유일 제약).
- Archive Grant는 새 Term이 ACTIVE가 된 **뒤에** 줍니다(받는 사람이 ACTIVE Membership을 가져야 하므로).

### 결정 4 · 회의 안건 먼저

회의 전에 **국장 이상이 안건을 먼저 작성**하고, 회의록은 그 안건을 바탕으로 만듭니다.

[![국장 이상이 안건을 작성해 공개하면, 회의록을 만들 때 서버가 Template과 안건 항목을 합친 초기 Snapshot을 만들고 공동 편집이 시작되는 흐름](/materials/diagrams/cpg-18-agenda-minutes.svg)](/materials/diagrams/cpg-18-agenda-minutes.svg)

*그림 00-11 · 안건이 먼저, 회의록은 그 위에 — 누르면 원본 크기로 열린다.*

| 테이블 | 핵심 필드 |
| --- | --- |
| `meeting_agendas` | `term_id`, `event_id`(선택), `title`, `meeting_at`, `status`(DRAFT / PUBLISHED / CLOSED), `created_by` |
| `meeting_agenda_items` | `agenda_id`, `sort_order`, `title`, `description`, `presenter_department_id`(선택) |
| `meeting_agenda_access_rules` | `meeting_access_rules`와 같은 형식 (Preset 저장) |
| `meeting_minutes.agenda_id` | 이 회의록의 바탕이 된 안건 (선택, 안건 하나에 회의록 하나) |

- 안건 작성·수정: DIRECTOR(자기가 만든 안건) 이상. 열람 범위는 회의록과 같은 Preset 네 가지 중 하나.
- `PUBLISHED` 안건은 열람 범위 안 구성원이 미리 읽습니다.
- 안건에서 회의록을 만들면 서버가 **Template + 안건 항목**으로 초기 Snapshot을 만들고(안건마다 "안건 n. 제목" 블록과 논의·결정·할 일 칸), 안건은 `CLOSED`가 됩니다. 회의록의 열람 범위는 안건의 범위를 기본값으로 가져옵니다.
- 안건 내용은 이 시점에 회의록으로 **복사**되므로, 이후 안건을 고쳐도 회의록은 바뀌지 않습니다.
- 긴급 회의처럼 안건 없이 회의록을 바로 만드는 길도 남겨 둡니다(`agenda_id`가 비어 있음).

> [!QUIZ]
> 회장 E가 혼자서 친구 F를 다음 회장으로 지정하고 바로 권한을 줄 수 있나요?

> [!ANSWER]
> 없습니다. E의 요청은 `PENDING`으로만 남고, **E가 아닌** 다른 ACTIVE EXECUTIVE가 승인해야 F의 승인 명단 행이 생깁니다. 계정 하나가 탈취되거나 한 사람이 독단으로 권한을 넘기는 것을 막는 장치입니다. 승인 전까지 F는 아무 권한이 없습니다.

## 학습 경로

[← 00-3 회의록·건의·기수](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-03) · [01-1 웹은 어떻게 동작하나 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-01-web/lecture-01)
