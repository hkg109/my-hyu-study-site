---
title: "7 · 기능 적용 ② 회의록·건의·기수 전환"
description: "회의록의 열람 Preset·작성자·편집자와 상태, 공동편집의 가장 중요한 테스트, 건의사항의 익명성과 답변·내부 메모 분리, 새 기수로 넘어가는 Term 전환과 Archive Grant를 기능 단위로 정리합니다."
order: 7
published: true
duration: 55
tags: [회의록, Meeting Minutes, Suggestion, 익명성, Term 전환, Archive Grant, Activity Log]
objectives:
  - 회의록의 생성자·대표 작성자·편집자를 구분하고 상태별 편집 가능 여부를 말한다.
  - 건의 작성자·처리 담당자·회장단이 각각 무엇을 볼 수 있는지 표로 설명한다.
  - Term 전환 다섯 단계와 Archive Grant의 범위·만료·회수를 설명한다.
---

## 학습 경로

[← 6편 조직·업무·행사](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-06) · [8편 완성 경로 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-08)

## 1. Meeting Minutes와 공동편집

회의록은 기본적으로 학생회 구성원 전체가 본다. 만들 때 **전체 · 복수 국 · 국장단 · 회장단** 중 하나의 Preset을 고른다. 복수 국은 A+B처럼 둘만이 아니라 B+C+D처럼 몇 개든 고를 수 있다. 회장단·생성자·지정 편집자는 기본 열람에 더해지고, Event 회의록은 다시 Event 범위와의 교집합을 적용한다(4편).

국장과 회장단이 회의록을 만든다. 다음 셋은 ==red:서로 다른 개념==이다.

| 개념 | 뜻 |
| --- | --- |
| 생성자 | 회의록 행을 만든 사람 |
| 대표 작성자 | 화면에 보이는 작성자. 편집자에 포함된다 |
| 편집자 목록 | 실제 본문을 고칠 수 있는 사람들 (`meeting_editors`) |

Event 회의록의 작성자·편집자는 해당 Event 열람자 중에서만 지정한다.

### 편집기

BlockNote의 Heading, List, Todo, Quote, Code Block, Table, Divider 등을 쓴다. Callout은 커스텀 Block으로 구현한다. Link는 Block이 아니라 **Inline Content**이므로 Slash 메뉴에서 삽입 동작을 따로 만든다. 사용하는 버전의 기본 Block과 확장 패키지 라이선스는 Phase 0에서 확인한다.

### 상태

[![DRAFT에서는 편집자와 회장단이 편집하고, 확정하면 CONFIRMED가 되어 편집자도 저장할 수 없으며, 보관하면 ARCHIVED로 목록에서 숨고, CONFIRMED에서 DRAFT로 되돌리는 것은 회장단만 사유를 Activity Log에 남겨 할 수 있다는 상태 그림](/materials/diagrams/cpg-07a-meeting-states.svg)](/materials/diagrams/cpg-07a-meeting-states.svg)

*그림 7-1 · 회의록 상태와 편집 가능 여부 — 누르면 원본 크기로 열린다.*

- 확정(CONFIRMED)은 생성자 또는 회장단이 하고, 확정할 때 최종 Snapshot을 만든다.
- 상태가 바뀌면 Realtime 채널에 재구독 신호를 보내 편집기를 읽기 전용으로 바꾼다.
- Template은 새 회의록을 만들 때 **서버가 초기 Snapshot에 한 번만** 넣는다(5편).

| 구분 | 내용 |
| --- | --- |
| 필요한 데이터 | `meeting_minutes`, `meeting_access_rules`, `meeting_editors`, `meeting_templates`, `meeting_crdt_updates`, `meeting_crdt_snapshots` |

> [!EXAM]
> **가장 중요한 테스트 여덟 가지**
>
> 1. 열람자는 본문 조회와 허용된 수신만 가능하고, Update 저장·송신은 거부된다.
> 2. 두 사람이 같은 문장을 동시에 고쳐도 재접속 후 문서가 일치한다.
> 3. 저장 실패 후 미전송 변경이 남고 다시 시도할 수 있다.
> 4. 중복 `client_update_id`가 중복 저장을 만들지 않는다.
> 5. Broadcast를 놓쳐도 `sequence_no` 공백을 감지해 DB에서 복구한다.
> 6. 두 사람이 새 회의록을 동시에 열어도 Template은 한 번만 들어간다.
> 7. ==red:CONFIRMED 상태에서는 기존 편집자도 저장할 수 없다.==
> 8. ACL을 회수하면 DB는 즉시 거부하고, Realtime 수신 지연은 정한 최대 시간 이내다.

### 직접 해보기

“회의록 열기 → Snapshot·Update 읽기 → 편집 → RPC 저장 → Broadcast → 재접속”을 화살표로 그리고, 각 화살표에 필요한 권한(열람·수신·편집·저장)을 적는다. 5편 그림 5-1과 비교한다.

## 2. Suggestion과 익명성

일반 학생은 학교 계정으로 건의사항을 내고 본인이 쓴 건의의 상태와 공개 답변을 본다. 처리 담당 국원·국장은 배정된 건의의 내용과 내부 메모를 보지만 ==작성자 신원은 보지 못한다.== 회장단은 담당자를 배정하고 해당 Term의 작성자 신원을 확인할 수 있다.

[![건의 내용과 상태, 공개 답변, 내부 메모, 작성자 신원의 네 항목을 작성자, 처리 담당 국원·국장, 회장단이 볼 수 있는지 표시한 격자. 처리 담당자는 작성자 신원을 못 보는 것이 가장 중요한 차단으로 강조되어 있고, 작성자는 내부 메모를 못 본다.](/materials/diagrams/cpg-07b-suggestion-visibility.svg)](/materials/diagrams/cpg-07b-suggestion-visibility.svg)

*그림 7-2 · 건의는 누가 무엇을 보나 — 누르면 원본 크기로 열린다.*

| 테이블 | 담는 것 |
| --- | --- |
| `suggestions` | 건의 내용·상태·담당자 |
| `suggestion_authors` | 작성자 연결 (본인·회장단만 읽음) |
| `suggestion_messages` | `AUTHOR_VISIBLE`(공개 답변)과 `INTERNAL`(내부 메모) |

- 클라이언트가 다른 사람의 `author_user_id`를 지정할 수 없다.
- 같은 제출이 두 번 들어가지 않도록 요청별 고유 ID로 막는다.
- 도배 방지를 위한 빈도 제한은 운영값이다.

> [!CAUTION]
> 작성자 신원은 화면에만 숨기면 안 된다. 담당자 계정의 ==목록·상세·API 응답·네트워크 탭·검색·알림·Activity Log== 어디에도 작성자 ID나 이메일이 나타나지 않는지 확인한다.

### Term이 끝날 때의 건의

미처리 건의는 운영진이 정한 정책에 따라 **새 Term으로 이월**하거나 **이전 회장단이 공개 답변 후 마감**한다. 이월하면 새 회장단이 신원을 보게 되므로 작성자에게 그 사실을 안내한다. 작성자는 Term이 바뀐 뒤에도 자기 건의와 공개 답변을 볼 수 있다.

### 직접 해보기

“담당자에게 보낼 JSON 응답”에 어떤 항목을 넣고 뺄지 적는다. 작성자와 회장단에게 보낼 응답과 비교한다.

> [!QUIZ]
> 처리 담당자에게 보낼 건의 상세 응답에서 반드시 빠져야 할 항목은? 작성자에게 보낼 응답에서 빠져야 할 항목은?

> [!ANSWER]
> **담당자 응답:** `author_user_id`, 작성자 이메일·이름 등 신원을 짐작할 수 있는 모든 값. (내용·상태·공개 답변·내부 메모는 포함)
>
> **작성자 응답:** `INTERNAL` 유형의 내부 메모, 담당자가 남긴 내부 처리 기록. (내용·상태·공개 답변은 포함)

## 3. Term 전환, 이전 기록, Activity Log

Term은 학생회 한 기수다. 상태는 `DRAFT`, `ACTIVE`, `CLOSED`이고 ==한 시점에 ACTIVE는 하나==다. 새 Term은 **빈 상태**로 시작한다. 부서, 구성원, 행사, Task, Template, ACL을 자동 복제하지 않는다. Dashboard Quick Links만 전역 설정이다.

[![새 Term을 DRAFT로 만들고 첫 EXECUTIVE를 등록한 뒤, 새 회장단이 부서와 승인 계정을 준비하고, 한 트랜잭션에서 이전 Term을 CLOSED·새 Term을 ACTIVE로 바꾸며 이전 Membership을 종료하고 미처리 건의를 처리한 다음, Realtime 재구독 신호를 보내고, 필요한 과거 자료만 Archive Grant로 여는 다섯 단계](/materials/diagrams/cpg-07c-term-transition.svg)](/materials/diagrams/cpg-07c-term-transition.svg)

*그림 7-3 · 새 기수로 넘어가는 다섯 단계 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> 기획서 8.1절 기준으로 **미처리 건의 처리는 ③ 전환 트랜잭션 안**에서 일어나고, 재구독 신호(④)는 그다음이다. 이전 가이드는 둘을 한 단계로 묶어 적었다.

### 이전 기수 자료는 Archive Grant로만

CLOSED Term은 기본적으로 **읽기 전용**이고, 과거 Membership으로 자동 접근할 수 없다. 새 운영진이 과거 자료를 읽으려면:

1. 현재 ACTIVE Term의 활성 구성원이어야 하고,
2. 회장단이 발급한 **Archive Grant**의 범위(`TERM` · `EVENT` · `DEPARTMENT` · `HANDOVER`)와
3. 만료 시간 안에서만 읽는다.

Grant는 회수할 수 있고 이력이 남는다. ==red:제한 공개 Task·Meeting과 건의 작성자 정보는 따로 명시하지 않으면 Archive Grant 대상에서 빠진다.== `TERM` 범위는 그 기수의 비제한 자료 전체이므로 부여할 때 한 번 더 확인받는다.

### Activity Log

Task 재개, 공개 모드·ACL 변경, Handover 발행, Term 전환, Grant 부여·회수처럼 ==나중에 이유를 알아야 할 작업==을 기록한다. 일반 사용자는 내용을 바꾸거나 지우지 못하고, 기록에 민감한 본문이나 작성자 신원을 복사하지 않는다.

### 직접 해보기

2026 Term을 끝내고 2027 Term을 시작한다고 하자. 전환 전 준비, 한 트랜잭션에서 처리할 것, 전환 후 접근 테스트, 미처리 건의 처리, Archive Grant 발급 순서를 적는다.

> [!QUIZ]
> “작년 회장단이었으니 올해 자료도 볼 수 있다”와 “올해 회장단이니 작년 자료를 모두 자동으로 본다”는 왜 둘 다 틀렸나?

> [!ANSWER]
> **앞 문장:** 권한은 **자료와 같은 Term의 활성 Membership**으로만 생긴다. 작년 Membership은 전환 때 종료되었으므로 올해 자료에 아무 권한이 없다. 올해도 구성원이라면 올해 Membership으로만 권한을 얻는다.
>
> **뒷 문장:** CLOSED Term 자료는 자동으로 열리지 않는다. 올해 회장단이라도 범위와 만료가 있는 Archive Grant를 통해서만 읽고, 제한 공개 자료와 건의 작성자 정보는 기본적으로 빠진다.
