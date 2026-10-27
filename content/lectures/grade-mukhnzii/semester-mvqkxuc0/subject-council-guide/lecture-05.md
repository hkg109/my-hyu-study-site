---
title: "5 · 실시간 공동편집과 운영"
description: "회의록 공동편집에 필요한 WebSocket·Broadcast·Presence, CRDT와 Yjs, BlockNote의 역할을 나누고, v0.7의 '저장 후 전파' 경로와 순번·Snapshot 복구를 따라갑니다. 이어서 테스트 문장, 접근성, 세 환경과 비밀 정보, 백업·복구를 다룹니다."
order: 5
published: true
duration: 65
tags: [실시간, WebSocket, CRDT, Yjs, BlockNote, Supabase Realtime, 테스트, 배포, 백업]
objectives:
  - Broadcast·Presence·Awareness의 쓰임과 “전달 ≠ 저장”을 설명한다.
  - CRDT가 덮어쓰기 문제를 어떻게 피하는지, Yjs·BlockNote·Realtime·PostgreSQL이 각각 무엇을 맡는지 말한다.
  - save_meeting_update() 저장 경로와 Ack·멱등성·sequence_no·Snapshot 복구를 순서대로 설명한다.
  - 전제→행동→기대 결과 형식의 테스트 문장과 배포 전 운영 점검을 작성한다.
---

## 학습 경로

[← 4편 권한과 민감 정보](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-04) · [6편 조직·업무·행사 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-06)

> [!CAUTION]
> 이 프로젝트에서 기술적으로 가장 어려운 기능은 **회의록 공동편집**이다. ==blue:① 한 사람이 쓰고 저장·다시 열기 → ② 읽기·편집 권한 분리 → ③ 여러 사람의 동시 편집== 순서로 쌓는다. 처음부터 ③을 만들지 않는다.

## 1. 일반 요청과 실시간 연결

- 일반 **HTTP 요청**은 편지처럼, 보낼 때마다 응답을 받는다.
- **WebSocket** 같은 실시간 연결은 전화 통화처럼 연결을 유지해 상대방의 변경을 바로 전달한다.

Supabase Realtime에서 쓰는 세 가지:

| 기능 | 무엇을 나르나 | 빈도 |
| --- | --- | --- |
| **Broadcast** | 채널 참여자에게 보내는 메시지 (저장된 Yjs Update) | 높음 |
| **Presence** | 누가 접속 중인지 같은 상태 | 낮음 |
| **Awareness** | 다른 사람의 커서·선택 영역 (Broadcast/Yjs 계층으로 전달) | 매우 높음 |

회의록마다 `meeting:{회의록 ID}` 형태의 **Private Channel**을 쓴다.

> [!EXAM]
> ==red:Realtime에서 변경이 보였다는 것은 저장됐다는 뜻이 아니다.== 전달(Realtime)과 보관(DB)은 다른 역할이다.

## 2. 왜 Yjs가 필요한가

원문이 “예산 100만원”일 때 한 사람은 “100”을 “120”으로 바꾸고, 다른 사람은 끝에 “ 확정”을 붙인다. 마지막에 저장한 사람이 **문서 전체를 덮어쓰면** 한쪽 변경이 사라진다.

> [!DEFINITION]
> **CRDT**는 여러 사본이 각자 만든 변경을 합쳐 결국 같은 결과에 이르도록 설계한 데이터 구조다. **Yjs**는 이 구조를 제공하는 라이브러리다.
>
> - **Y.Doc:** 공유 문서
> - **Update:** 변경 정보(바이너리)
> - **Provider:** Update를 전달하는 연결 장치
> - **State Vector:** 어디까지 받았는지 요약한 정보

| 구성 | 역할 | 처음 확인할 질문 |
| --- | --- | --- |
| BlockNote | 편집 화면과 Block 입력 | 글을 쓰고 읽기 전용으로 바꿀 수 있나? |
| Yjs | 동시 변경 병합 | 두 사람이 동시에 고쳐도 같은 문서가 되나? |
| Realtime | 변경 전달 | 허용된 사용자만 받고 보내나? |
| PostgreSQL | Update·Snapshot 저장 | 새로고침·재접속 후에도 남나? |

BlockNote(화면)와 Yjs(병합)는 맡는 일이 다르다.

## 3. v0.7의 저장 경로

[![편집자 A의 브라우저가 Yjs Update를 묶어 RPC로 보내면 DB 함수가 편집 권한과 회의록 상태를 검사해 순번을 발급하고 저장한 뒤 Realtime으로 발행하고 A에게 Ack와 순번을 돌려주며, Realtime이 편집자 B에게 Broadcast해 B가 Update를 적용하는 순서도](/materials/diagrams/cpg-05a-crdt-save.svg)](/materials/diagrams/cpg-05a-crdt-save.svg)

*그림 5-1 · 회의록 변경이 저장되는 순서 — 누르면 원본 크기로 열린다.*

1. BlockNote에서 입력하면 Yjs Update가 생긴다.
2. 브라우저가 짧은 간격 동안 Update를 묶는다(간격은 운영값).
3. 사용자 JWT로 `save_meeting_update()` RPC를 호출한다.
4. DB 함수가 ==현재 편집 권한과 회의록 상태==를 검사한다.
5. 회의록별 순번(`sequence_no`)을 발급하고 Update를 저장한다.
6. ==blue:같은 트랜잭션에서== DB가 `realtime.send()`로 Private Broadcast를 발행한다. 커밋된 경우에만 전달된다.
7. 다른 편집자가 Update를 적용한다.

키 입력마다 Vercel 함수를 거치지 않게 한 설계다. 이 경로의 실제 사용 가능성, Broadcast 페이로드 한도, 비용과 지연은 **Phase 0 PoC**에서 확인한다. 큰 붙여넣기처럼 한도를 넘는 Update는 Broadcast 대신 “새 Update 있음” 신호만 보내고, 받는 쪽이 DB에서 읽게 하는 처리도 함께 검증한다.

### Ack, 재시도, 멱등성

- **저장 확인**(Ack)이 오기 전에는 ==red:“저장 완료”라고 표시하지 않는다.==
- 브라우저는 확인받지 못한 변경을 IndexedDB 같은 로컬 저장소에 유지한다.
- 실패하면 **같은 ID**(`client_update_id`)로 다시 보낸다. 같은 ID가 두 번 와도 DB에는 한 번만 기록된다. 이 성질을 **멱등성**(Idempotency)이라고 한다.
- 단, **권한 거부** 응답이면 재시도하지 않는다. 편집기를 읽기 전용으로 바꾸고 저장되지 않은 내용이 있음을 알린다.

### 순번과 Snapshot으로 복구하기

[![재접속하면 최신 Snapshot과 그 뒤 Update로 문서를 복원하고, 받은 순번이 5 다음 7이면 6이 빠진 것을 감지해 DB에서 다시 읽으며, 같은 client_update_id로 재시도해도 DB에는 한 번만 기록된다는 세 가지 복구 장면](/materials/diagrams/cpg-05b-recovery.svg)](/materials/diagrams/cpg-05b-recovery.svg)

*그림 5-2 · 순번과 Snapshot으로 복구하기 — 누르면 원본 크기로 열린다.*

- 받은 순번이 5 다음 7이면 6이 빠진 것을 알아차리고 DB에서 다시 읽는다.
- 새로 접속한 사용자는 **최신 Snapshot + 그 뒤의 Update**로 문서를 복원한다.
- 오래된 Update를 정리할 때도 새 Snapshot이 어디까지 포함했는지(`last_sequence_no`) 기록하고, 그 이하만 정리한다.

## 4. 상태와 권한을 함께 확인한다

회의록 상태는 `DRAFT`, `CONFIRMED`, `ARCHIVED`다(7편 그림). DRAFT에서만 지정 편집자와 회장단이 편집한다.

회의록에는 권한이 네 개 있고, 각각 **따로** 확인한다.

| 권한 | 누가 | 확인 위치 |
| --- | --- | --- |
| 열람 | 회의록 열람자 | DB SELECT |
| Realtime 수신 | 열람자 | Private Channel 가입 |
| Awareness 송신 | 편집자 | 클라이언트 Broadcast(커서 등만) |
| CRDT Update 저장 | 편집자 + DRAFT 상태 | `save_meeting_update()` |

열람자가 편집 Update를 보내면 거부된다. 저장 함수는 **연결 상태와 관계없이 요청마다** 최신 권한을 확인한다.

> [!CAUTION]
> 기존 Realtime 연결은 권한을 회수한 직후에도 잠시 메시지를 받을 수 있다(접속 중 권한 판정을 캐시하기 때문). 그래서 운영진이 ==허용 가능한 최대 지연 시간==을 정하고 실제로 측정한다. 클라이언트 재구독 신호와 짧은 토큰 유효기간도 설계에 넣는다.

### 두 사람이 동시에 새 회의록을 열 때

각 브라우저가 “문서가 비어 있다”고 보고 Template을 넣으면 내용이 **두 번** 들어간다. v0.7은 신뢰된 서버 작업이 회의록을 만들 때 ==초기 Snapshot을 한 번만== 만들고, 브라우저는 항상 그 Snapshot에서 시작하게 했다.

### 직접 해보기

두 사용자가 같은 회의록을 열고, 한 명이 연결이 끊긴 상태로 문장을 고친다고 하자. “내 화면에 보임”, “상대에게 전달”, “DB에 안전하게 저장”, “재접속 후 복구”를 시간 순서로 나눠 적는다.

> [!QUIZ]
> Broadcast 성공과 DB 저장 성공은 어떻게 다른가? v0.7 경로에서는 둘 중 무엇이 먼저인가?

> [!ANSWER]
> Broadcast는 **지금 접속한 사람에게 전달**한 것이고, DB 저장은 **나중에 다시 열어도 남는다**는 뜻이다. v0.7은 DB 함수가 저장을 커밋한 뒤 같은 트랜잭션에서 발행하므로 ==저장이 먼저==다. 그래서 클라이언트가 직접 `crdt-update`를 Broadcast하는 것은 금지된다.

> [!QUIZ]
> Snapshot과 Update는 어떤 관계인가?

> [!ANSWER]
> Snapshot은 어느 순번까지의 문서 **전체 상태**이고, Update는 그 뒤의 **변경 조각**이다. 문서 = 최신 Snapshot + `last_sequence_no` 이후 Update. Update가 너무 쌓이면 서버가 새 Snapshot을 만들고, 그 Snapshot에 포함된 Update만 정리한다.

## 5. 테스트, 접근성, 배포와 운영

### 개발 전에 테스트 문장을 적는다

테스트는 “동작하는 것 같다”를 확인하는 일이 아니다. ==blue:전제 → 행동 → 기대 결과==를 적고 실제 결과와 비교한다.

```text
전제: 현재 Term의 홍보국장 계정으로 로그인
행동: 자기 국 Event에 새 Task를 등록
기대: 등록 성공, Event 페이지에 표시

반대 사례: 다른 국의 국장 계정으로 같은 요청
기대: 화면과 서버·DB에서 모두 거부
```

한 기능에 정상 입력, 잘못된 입력, 로그아웃, 권한 없는 계정, 다른 Term, 네트워크 실패 사례를 넣는다. 권한이 중요한 기능은 버튼뿐 아니라 ==상세 URL 직접 접근, API 요청, Storage 다운로드, Realtime 채널 가입==까지 확인한다.

반복되는 규칙은 테스트 코드로 남긴다.

- SQL 권한 규칙: **pgTAP** 또는 같은 역할의 DB 테스트로 허용·거부 계정을 자동 검증하고 CI에서 실행한다.
- 핵심 사용자 흐름: 브라우저에서 로그인부터 결과까지 따라가는 **E2E 테스트**.

### 접근성과 반응형

- 키보드만으로 주요 흐름을 끝낼 수 있다.
- 입력창에 label이 있고, 현재 Focus 위치가 보이며, 오류를 색만으로 전달하지 않는다.
- 모바일에서는 조회·상태 변경·건의 제출이 가능해야 한다. 복잡한 관리자 편집은 데스크톱 우선.

### 세 환경과 비밀 정보

| 환경 | 뜻 | 데이터 |
| --- | --- | --- |
| 로컬 | 각자의 컴퓨터 | 가짜 데이터 |
| Preview | 팀이 변경을 확인하는 환경 (PR별 주소) | 가짜 데이터 |
| Production | 실제 사용자에게 공개된 환경 | 실제 데이터 |

==red:브라우저에 전달한 값은 사용자에게 보인다고 생각한다.== 비밀 키, OAuth secret, DB 비밀번호는 브라우저 코드나 GitHub에 넣지 않는다. Supabase의 공개 가능한 연결 키를 쓰더라도 RLS 없이 민감 테이블을 열어 두면 안 된다. 현재 키 이름과 권한은 배포 시점의 공식 문서로 확인한다.

### 백업, 복구, 관측

- ==백업 파일이 있다는 것과 실제로 복구된다는 것은 다르다.== DB와 Storage의 백업 범위·보존 기간·책임자를 정하고 테스트 자료로 **최소 한 번 복구**한다.
- 운영 로그에는 Auth 실패, RLS 거부, CRDT 저장 실패, Realtime 재연결, Storage 실패를 남기되 민감한 본문·신원·토큰은 넣지 않는다.
- Dashboard와 목록은 자료가 많아지면 페이지 단위로 불러오고, 권한 함수가 자주 참조하는 Term·사용자·부서·자원 ID에 Index를 둔다.

### 직접 해보기

Preview 배포 전 점검표에 로그인, 업무 생성, 권한 거부, 모바일 화면, 회의록 재접속, DB·Storage 복구를 적는다. 각 항목의 담당자와 확인 기록을 남길 곳을 정한다.

> [!QUIZ]
> 점검표가 잘 만들어졌는지 확인하는 방법은?

> [!ANSWER]
> 점검표를 쓰지 않은 다른 팀원이 **문서만 보고** Preview를 검사하고, 가짜 자료로 복구 절차를 처음부터 끝까지 재현할 수 있으면 된다.
