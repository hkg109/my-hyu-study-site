---
title: "00-3 · 회의록·건의·기수"
description: "기획서 v0.7의 6–8절. BlockNote 에디터 사양, 회의록 생성·편집 권한과 열람 Preset, Yjs CRDT 저장 방식과 Realtime 보안, Template·회의록 상태, 건의 작성자 신원 분리와 답변·내부 메모, Term 상태와 전환 절차, Archive Grant를 정리합니다."
order: 3
published: false
duration: 50
tags: [기획서, 회의록, BlockNote, Yjs, CRDT, 건의, Term, Archive Grant]
objectives:
  - 회의록의 생성자·대표 작성자·편집자가 어떻게 다른지 말한다.
  - 회의록 열람 Preset 네 가지와 항상 포함되는 사람을 말한다.
  - CRDT Update가 저장되고 전파되는 순서를 여섯 단계로 설명한다.
  - 건의 작성자 신원이 DB 구조에서 어떻게 분리되는지 설명한다.
  - Term 상태 세 가지와 전환 절차, Archive Grant의 유효 조건을 말한다.
---

## 1. 회의록 에디터 사양 (6.1절)

회의록은 **BlockNote 기반 Notion형 블록 에디터**를 씁니다.

| 입력 | 동작 |
| --- | --- |
| `# 제목` · `## 제목` · `### 제목` | Heading 1 · 2 · 3 |
| `- 항목` | 글머리 목록 |
| `1. 항목` | 번호 목록 |
| `- [ ] 할 일` · `/할일` | Todo |
| `> 내용` · `/인용` | Quote |
| `/콜아웃` | Callout |
| `/구분선` | Divider |
| `/코드` | Code Block |
| `/표` | Table |
| `/링크` | Link |

Slash 명령에는 한국어 별칭을 둘 수 있습니다. 예: `/콜아웃`, `/강조`, `/callout` → 모두 같은 기능.

| 항목 | 구현 방식 |
| --- | --- |
| Heading, List, Todo, Quote, Code Block, Table, Divider | BlockNote 기본 Block. 쓰는 버전에서 지원 여부를 Phase 0에 확인 |
| Callout | 기본 Block이 아니므로 **커스텀 Block**으로 구현 (아이콘·색상 속성) |
| Link | Block이 아니라 글 안의 Inline Content. `/링크`는 URL을 받아 현재 위치에 Link를 넣는 Slash 항목 |
| 한국어 별칭 | Slash Menu 항목의 `aliases`에 한국어·영어 키워드 등록 |
| Markdown·JSON 내보내기 | BlockNote core 변환 기능. 커스텀 Callout은 Markdown에서 Quote로 바뀌는 손실 허용 |

- BlockNote의 일부 확장 패키지(XL 계열 등)는 별도 라이선스 조건이 있어, MVP는 MPL-2.0 core 패키지 범위에서 만듭니다.
- 원본은 Markdown 문자열이 아니라 **Block 구조**로 보존합니다. CRDT를 쓰는 동안에는 Yjs 문서 상태가 원본이고, 필요하면 Markdown·JSON으로 내보냅니다.

## 2. 생성·작성 권한 (6.2절)

| 행위 | 권한 |
| --- | --- |
| 회의록 생성 | 회장단, 국장 |
| 제목·일시·Template 설정 | 생성자 또는 회장단 |
| 대표 작성자 지정 | 생성자 또는 회장단 |
| 지정 가능한 작성자 | 같은 Term 활성 구성원 (Event 회의록은 Event 열람자만) |
| 본문 편집 | 같은 Term의 지정 편집자와 회장단 |
| 편집자 추가·제외 | 생성자 또는 회장단 (생성자인 국장은 자기가 만든 회의록만) |
| 열람 범위 설정 | 생성자 또는 회장단 |
| Template 관리 | 회장단 |

> [!DEFINITION]
> - **생성자(`created_by`):** 회의록을 만든 사람.
> - **대표 작성자(`author_id`):** 화면에 "작성자"로 표시되는 사람. 자동으로 편집자에 포함됩니다.
> - **편집자(`meeting_editors`):** 실제로 본문을 고칠 수 있는 사람들. 여러 명 가능.
>
> 예: 국장이 회의록을 만들고(생성자), 국원 A를 대표 작성자로, 국원 B를 추가 편집자로 지정합니다.

- 편집자는 회의록 열람 범위에 **항상** 포함됩니다.
- Event 회의록이면 편집자는 Event를 열람할 수 있는 사람 중에서만 고릅니다(00-1의 1.7절).
- `CONFIRMED` 회의록은 편집자도 본문을 고칠 수 없습니다.

> [!NOTE]
> 기획서 이후 추가된 결정: 회의록은 **국장 이상이 먼저 작성한 회의 안건**을 바탕으로 만들 수 있습니다. 안건 항목이 회의록의 제목 블록으로 들어갑니다. → [00-4](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-04), [06-3](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-03)

## 3. 회의록 열람 범위 (6.3절)

기본값은 **국원 이상 학생회 구성원 전체**입니다. 일반 학생(`STUDENT`)은 기본 회의록을 볼 수 없습니다.

회의록을 만들 때 열람 범위를 반드시 확인합니다. 아래 Preset 네 개 중 **하나만** 고릅니다(조합하지 않음).

1. **전체** — 활성 구성원(MEMBER 이상) 전체
2. **특정 국** — 한 개 이상의 국을 여러 개 선택 (A+B뿐 아니라 B+C+D처럼 몇 개든)
3. **국장단** — 모든 DIRECTOR + EXECUTIVE
4. **회장단** — EXECUTIVE

```text
열람 범위: 특정 국
□ 사무국
✓ 재무국
✓ 홍보국
✓ 생활복지국
```

화면에는 Preset을 보여 주지만 DB는 범용 ACL인 `meeting_access_rules`(`meeting_id`, `subject_type`, `role_group`, `department_id`, `granted_by`, `created_at`)로 저장합니다.

==Preset과 별개로 그 Term의 회장단·생성자·지정 편집자는 항상 볼 수 있습니다.== 그래서 국장이 만든 "회장단" 범위 회의록도 그 국장은 볼 수 있습니다. 이 기본 접근은 테이블에 저장하지 않고 권한 함수가 계산합니다. Event 회의록은 Event 범위와 교집합을 적용합니다.

나중에 특정 개인만 추가 공개하는 기능(`USER` 규칙)을 넣을 때는 `user_id` 필드·제약·RLS 정책·UI를 함께 추가합니다.

## 4. 문자 단위 공동 편집 (6.4절)

회의록은 단순 실시간 동기화가 아니라 **문자 단위 CRDT 공동 편집**까지 구현합니다.

```text
BlockNote Editor
      ↓ binding
Yjs Y.Doc
      ↓ 변경분(Update)을 클라이언트에서 묶어 하나로
Supabase RPC: save_meeting_update()  ← 편집 권한 검사 + 저장 + 순번 발급
      ↓ 같은 트랜잭션 안에서 realtime.send()
Supabase Realtime Private Broadcast
      ↓
다른 편집자의 Y.Doc에 Y.applyUpdate()
```

- 본문 Update 경로에 **Vercel 함수를 두지 않습니다.** 브라우저가 사용자 JWT로 Supabase RPC를 직접 부르고, DB 함수가 권한 검사·저장·발행을 함께 합니다. 키 입력마다 서버 함수를 부르는 지연과 비용을 피하면서 "저장 확인 후 전파"를 지키기 위해서입니다.
- Yjs가 동시 입력을 자동으로 합치므로, 충돌 해결 로직을 직접 짤 필요가 없습니다.

| 구성 요소 | 역할 |
| --- | --- |
| BlockNote | 블록 UI와 Markdown·Slash 입력 |
| Yjs | 문자·블록 단위 CRDT 상태와 병합 |
| Realtime Broadcast | 저장된 Update 전달(DB가 발행), 커서 정보(Awareness) 전달(클라이언트가 발행) |
| Realtime Presence | 접속자 목록처럼 자주 안 바뀌는 상태 |
| PostgreSQL | 메타데이터, ACL, Update 저장·순번·발행, Snapshot |
| Vercel 서버 작업 | 회의록 생성 시 초기 Snapshot, 주기적 Snapshot 압축 |

커서 위치처럼 자주 바뀌는 정보는 Presence에 넣지 않고 Broadcast·Yjs Awareness로 보냅니다.

## 5. 저장 방식 (6.5절)

Broadcast는 **전달 수단일 뿐**이라 문서 원본을 거기에만 맡기지 않습니다.

- **`meeting_crdt_updates`:** `id`, `meeting_id`, `client_update_id`(재시도 중복 방지, `meeting_id`와 함께 유일), `sequence_no`(회의록별 저장 순서, 유일), `update_bytes`, `actor_id`, `created_at`
- **`meeting_crdt_snapshots`:** `meeting_id`, `state_bytes`, `state_vector`, `snapshot_version`, `last_sequence_no`(이 Snapshot에 포함된 마지막 Update), `created_at`

`sequence_no`는 전역 자동 번호를 쓰지 않습니다. 동시에 저장하면 번호 발급 순서와 실제 저장(커밋) 순서가 달라져, "마지막으로 본 번호 이후"를 조회할 때 늦게 커밋된 Update를 놓칠 수 있기 때문입니다. 대신 `meeting_minutes.crdt_seq`를 `UPDATE … SET crdt_seq = crdt_seq + 1 RETURNING`으로 올려 **회의록 하나 단위로 줄을 세웁니다.**

[![편집자 A가 Update를 묶어 RPC를 호출하면 DB 함수가 권한을 검사하고 순번을 발급해 저장한 뒤 Realtime으로 발행하고 A에게 Ack를 돌려주며 B가 Update를 적용하는 순서도](/materials/diagrams/cpg-05a-crdt-save.svg)](/materials/diagrams/cpg-05a-crdt-save.svg)

*그림 00-4 · 회의록 변경이 저장되는 순서 — 누르면 원본 크기로 열린다.*

동작 여섯 단계:

1. 클라이언트는 짧은 간격 동안 Update를 모아 `Y.mergeUpdates()`로 하나로 합치고 `client_update_id`를 붙입니다. 저장 확인 전에는 로컬 미전송 목록(IndexedDB 권장)에 둡니다. 한 번에 한 묶음만 보내고, 응답을 받은 뒤 다음 묶음을 보냅니다.
2. `save_meeting_update()`가 **현재 편집 권한**과 회의록 상태(`CONFIRMED` 여부)를 다시 검사하고, 순번을 발급해 저장합니다. 같은 `client_update_id` 재요청은 중복 저장하지 않고 기존 순번을 돌려줍니다.
3. 같은 함수가 저장 트랜잭션 안에서 `realtime.send()`로 `meeting:{meeting_id}` 채널에 `{sequence_no, update}`를 발행합니다. 메시지는 **커밋된 경우에만** 전달됩니다. 수신 측은 순번 공백을 발견하면 DB에서 빠진 구간을 다시 읽습니다.
4. 저장에 실패하면 지수 백오프로 재시도하고, 확인 전에는 "저장 완료"로 표시하지 않습니다. **권한 거부** 응답이면 재시도하지 않고 편집기를 읽기 전용으로 바꾼 뒤 미저장 내용을 알립니다.
5. 새로 들어오거나 재접속한 사용자는 최신 Snapshot + `last_sequence_no` 이후 Update를 가져오고, Yjs 상태 벡터로 빠진 부분을 맞춥니다. 이미 적용한 순번의 Broadcast는 무시합니다.
6. Snapshot 생성·오래된 Update 정리는 회의록 행 잠금으로 동시 저장과 충돌하지 않게 합니다. 운영값 주기마다 신뢰된 서버 작업이 Y.Doc을 로드해 전체 Snapshot을 만들고, 새 Snapshot의 `last_sequence_no` 이하 Update만 정리합니다.

Phase 0에서 확인할 것: `realtime.send()`의 Private Channel 발행과 메시지 크기 한도, 한도를 넘는 큰 붙여넣기는 "새 Update 있음" 신호만 보내고 수신 측이 DB에서 읽게 하는 처리, 묶음 간격별 체감 지연과 메시지 사용량.

## 6. Realtime 채널 보안 (6.6절)

- 회의록 채널은 `meeting:{meeting_id}` 형태의 **Private Channel**입니다(`private: true`, 공개 채널 허용 설정은 끔).
- 채널 **수신** 권한은 회의록 열람 함수로 검사합니다.
- CRDT Update는 DB 함수만 발행합니다. 클라이언트의 Broadcast 송신은 편집 권한이 있는 사람의 Awareness 이벤트만 허용하고, `crdt-update` 이벤트 이름의 클라이언트 송신은 거부합니다.
- Update INSERT는 테이블에 직접 허용하지 않고 `save_meeting_update()`로만 합니다. Snapshot 생성·교체·정리는 신뢰된 서버 작업만 합니다.

열람 권한이 없는 사용자는 DB에서 읽을 수 없고, Broadcast를 받을 수 없고, Presence도 받을 수 없습니다.

> [!CAUTION]
> Supabase Realtime은 접속 중 권한 판정을 **캐시**합니다. ACL을 회수해도 기존 연결의 수신이 즉시 끊긴다고 가정하지 않습니다. 짧은 JWT 유효 기간과 권한 변경 시 재구독 신호를 함께 쓰고, 회수 후 최대 수신 가능 시간을 운영값으로 정해 테스트합니다. 저장 API는 매 요청에서 최신 권한을 검사합니다.

## 7. Template과 회의록 상태 (6.7–6.8절)

회장단이 회의록 Template(전체회의, 국장단 회의, 국별회의, 행사 TF 회의 등)을 만들고 고칩니다. Template은 BlockNote 초기 Block 구조로 저장하고, Term에 속하며 새 Term으로 자동 복제하지 않습니다.

> [!EXAM]
> **Template은 서버가 넣는다.** 각 클라이언트가 처음 열 때 Template을 넣으면, 두 사람이 새 회의록을 동시에 열었을 때 Template이 **두 번** 들어갑니다. 그래서 회의록 생성 요청을 처리하는 서버 작업이 Template으로 Y.Doc을 만들고 `snapshot_version = 1`인 초기 Snapshot을 회의록 행과 같은 트랜잭션에서 저장합니다. 클라이언트는 항상 Snapshot에서 시작합니다.

| 상태 | 본문 편집 | 전환 권한 |
| --- | --- | --- |
| `DRAFT` | 편집자·회장단 | 생성 시 기본값 |
| `CONFIRMED` | 불가(읽기 전용) | 생성자 또는 회장단이 확정. 확정 때 최종 Snapshot 생성 |
| `ARCHIVED` | 불가, 목록에서 숨김 | 생성자 또는 회장단 |

`CONFIRMED`를 `DRAFT`로 되돌리는 것은 회장단만 가능하고, 사유와 함께 Activity Log에 남깁니다. 상태가 바뀌면 Realtime 채널에 재구독 신호를 보내 편집기를 읽기 전용으로 바꿉니다.

## 8. 건의 (7절)

일반 학생은 건의를 작성하고 본인 건의의 처리 상태를 봅니다.

`suggestions` 필드: `term_id`, `title`, `content`, `status`(RECEIVED / IN_REVIEW / RESOLVED / CLOSED), `assigned_department_id`, `assigned_user_id`, `client_request_id`, `created_at`, `updated_at`, `resolved_at`

[![건의 내용·상태, 공개 답변, 내부 메모, 작성자 신원을 작성자, 처리 담당, 회장단이 각각 볼 수 있는지 표시한 격자](/materials/diagrams/cpg-07b-suggestion-visibility.svg)](/materials/diagrams/cpg-07b-suggestion-visibility.svg)

*그림 00-5 · 건의는 누가 무엇을 보나 — 누르면 원본 크기로 열린다.*

### 작성자 신원 (7.1절)

건의 작성자의 이름·이메일은 **작성자 본인**과 **그 Term의 활성 EXECUTIVE**만 봅니다. Position 이름이 아니라 Role로 판정하므로, EXECUTIVE 부여 화면에 "이 사람도 신원을 볼 수 있다"는 경고를 띄웁니다.

UI에서 이름을 가리는 수준이 아니라 **DB 구조에서 분리**합니다.

- `suggestions`에는 내용·상태·처리 정보만 둡니다.
- `suggestion_authors(suggestion_id, author_user_id)`는 작성자 본인과 그 Term의 EXECUTIVE만 SELECT할 수 있습니다.
- 처리 담당 국장·국원은 `suggestions`만 조회합니다.
- 공개 View를 쓴다면 `security_invoker` 등으로 RLS 우회를 막습니다.
- Activity Log·알림·검색 결과·Realtime 메시지에도 신원이 섞이지 않는지 확인합니다.
- 작성자 본인의 조회는 `suggestion_authors`를 확인하는 `SECURITY DEFINER` 함수로 판정하며, 이 함수는 참/거짓만 돌려주고 작성자 ID는 돌려주지 않습니다.

### 답변과 내부 메모 (7.2절)

`suggestion_messages`로 분리합니다.

| 유형 | 볼 수 있는 사람 |
| --- | --- |
| `AUTHOR_VISIBLE` | 작성자, 배정된 처리자, 회장단 |
| `INTERNAL` | 배정된 처리자와 회장단 |

- 건의 작성 API는 로그인한 학교 계정만 부를 수 있고, **서버**가 작성자 연결을 만듭니다. 클라이언트가 남의 ID를 `author_user_id`로 보낼 수 없습니다.
- 제출 중복을 막기 위해 요청마다 고유 ID(`client_request_id`)를 받고, 빈도 제한을 둡니다.
- 메시지 작성·유형 변경·담당자·상태 변경은 Activity Log에 남기되, 작성자 ID나 건의 본문은 복사하지 않습니다.

### 기수 전환과 건의 (7.3절)

새 건의는 작성 시점의 ACTIVE Term에 속합니다. Term이 CLOSED로 바뀔 때 `RECEIVED`·`IN_REVIEW` 건의는 이월 정책에 따라 처리합니다.

- **이월:** `term_id`를 새 Term으로 옮기고 담당 배정을 비웁니다. 새 회장단이 신원과 내용을 보게 되므로 작성자에게 이월 사실을 안내합니다. 답변·메모는 함께 옮기되 이전 처리자의 이름은 표시하지 않습니다.
- **마감:** 이전 회장단이 Term 종료 전에 `CLOSED`로 처리하고 공개 답변을 남깁니다.

작성자는 Term과 무관하게 자신이 쓴 모든 건의와 공개 답변을 계속 봅니다.

## 9. Term과 다음 기수 (8절)

새 Term은 **빈 상태로** 만듭니다. 이전 부서·구성원·Event·Task·Template·ACL은 자동 복제하지 않습니다. 모든 Membership·부서·ACL 대상은 자원의 `term_id`와 같은 Term인지 검증하고, 다른 Term에서 회장단이었던 사람도 현재 Term 자료에 자동으로 접근하지 못합니다.

### Term 상태 (8.1절)

Term 상태는 `DRAFT / ACTIVE / CLOSED`이고, ACTIVE는 한 시점에 **하나만**(부분 유일 제약) 있습니다.

| Term 상태 | 그 Term Membership 보유자 | 다른 사용자 |
| --- | --- | --- |
| `DRAFT` | EXECUTIVE만 조직·승인 계정·Template 준비 | 접근 불가 |
| `ACTIVE` | 정상 권한 적용 | 접근 불가 |
| `CLOSED` | 접근 불가 (Term 종료 시 모든 Membership에 `left_at` 기록) | 유효한 Archive Grant 범위만 읽기 |

- CLOSED Term은 기본적으로 **읽기 전용**입니다. 과거 기록을 고쳐야 하면 현재 ACTIVE Term의 회장단이 사유를 입력해 제한된 절차로 처리하고 Activity Log에 남깁니다.
- 이전 기수 구성원이 새 Term에도 있으면 **새 Term Membership으로만** 권한을 얻습니다.
- `departments`, `positions`, `meeting_templates`는 Term에 속하고 새 Term에서 빈 상태로 시작합니다. `dashboard_links`만 전역입니다.

### 전환 절차

[![현 회장단이 새 Term을 DRAFT로 만들고 다음 회장단을 지정·승인한 뒤, 새 회장단이 준비하고, 한 트랜잭션에서 전환하고, 재구독 신호를 보내고, 필요한 과거 자료만 Archive Grant로 여는 다섯 단계](/materials/diagrams/cpg-07c-term-transition.svg)](/materials/diagrams/cpg-07c-term-transition.svg)

*그림 00-6 · 새 기수로 넘어가는 다섯 단계 (추가 결정 반영) — 누르면 원본 크기로 열린다.*

1. 새 Term을 `DRAFT`로 만들고 첫 EXECUTIVE를 등록합니다. (기획서: 운영자 절차 → **추가 결정: 현 회장단이 지정하고 다른 회장단이 승인**)
2. 새 회장단이 부서·직책·승인 계정을 준비합니다.
3. 전환 시점에 **단일 트랜잭션**으로 이전 Term을 `CLOSED`, 새 Term을 `ACTIVE`로 바꾸고 이전 Term Membership을 종료합니다. 미처리 건의는 이월 정책대로 처리합니다.
4. 열린 Realtime 연결에 재구독 신호를 보냅니다.

### Archive Grant

새 운영진이 이전 자료를 인수인계받도록 `term_archive_access`를 둡니다.

| 필드 | 설명 |
| --- | --- |
| `source_term_id` | 읽을 과거 Term |
| `grantee_user_id` | 현재 활성 Membership을 가진 사용자 |
| `scope_type` | TERM / EVENT / DEPARTMENT / HANDOVER |
| `scope_id` | 범위에 해당하는 자원 ID (`TERM`이면 비움) |
| `expires_at` | 열람 만료 시각 |
| `granted_by` | 부여한 회장단 |
| `revoked_at`, `revoked_by` | 회수 시각과 회수자 |

- **읽기만** 허용하고 자동으로 만들지 않습니다. 현재 회장단이 범위와 기간을 지정합니다.
- 건의 작성자 정보와 제한 공개 Task·회의록은 별도 명시가 없으면 대상에서 뺍니다.
- 조회 시점마다 세 조건을 **모두** 만족해야 유효합니다: 만료되지 않음, 회수되지 않음, 받은 사람이 현재 ACTIVE Term의 활성 Membership을 가짐.
- `scope_id`는 여러 테이블을 가리키므로 FK 대신, 저장할 때 대상이 `source_term_id`에 속하는지 검증하는 함수를 둡니다.
- `scope_type = TERM`은 그 Term의 비제한 자료 전체이므로 부여 화면에서 한 번 더 확인받습니다.

> [!QUIZ]
> 2026 기수에서 재무국장이었던 D가 2027 기수에서 홍보국원이 됐습니다. D는 2026 재무국 자료를 볼 수 있나요?

> [!ANSWER]
> 기본적으로 **못 봅니다.** 2026 Term은 CLOSED라 D의 2026 Membership은 종료됐고, D는 2027 Membership으로만 권한을 얻습니다. 2027 회장단이 D에게 2026 재무국 범위(`DEPARTMENT`)의 Archive Grant를 기간을 정해 주면, 그 기간 동안 읽기만 할 수 있습니다.

## 학습 경로

[← 00-2 로그인·Dashboard·업무·행사](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-02) · [00-4 데이터·기술·범위와 추가 결정 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-00-plan/lecture-04)
