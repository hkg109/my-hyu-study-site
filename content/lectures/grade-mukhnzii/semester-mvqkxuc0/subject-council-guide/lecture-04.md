---
title: "4 · 권한과 민감 정보"
description: "Role·Permission·ACL·RLS를 네 단계 판정으로 한 번에 이해하고, Event 범위가 하위 자료의 상한이 되는 교집합 규칙, 파일·날짜·건의 작성자 신원·Activity Log를 어디에 어떻게 저장하는지 배웁니다."
order: 4
published: true
duration: 60
tags: [권한, RBAC, ACL, RLS, Storage, Signed URL, 개인정보, Activity Log]
objectives:
  - 권한 판정의 네 단계와 Role·Position, RBAC·ACL의 차이를 설명한다.
  - 하위 자료의 유효 열람자가 Event 열람자와의 교집합이 되는 이유를 사례로 든다.
  - RLS가 행 단위라는 점 때문에 건의 작성자를 별도 테이블로 분리하는 이유를 말한다.
  - 파일 메타데이터와 파일 본체, 시간 일정과 종일 일정의 저장 방식을 구분한다.
---

## 학습 경로

[← 3편 데이터베이스와 로그인](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-03) · [5편 실시간 공동편집과 운영 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-05)

이 편은 플랫폼에서 **가장 실수하기 쉬운 부분**이다. 한 번 읽고 끝내지 말고, 기능을 만들 때마다 다시 펼친다.

## 1. 권한은 네 단계로 판정한다

[![현재 사용자의 활성 Membership, Role의 기본 Permission, 대상 자료의 소유 국·담당자·공개 모드·ACL, 서버·DB·Storage·Realtime의 실제 강제를 차례로 통과해야 허용된다는 네 단계 그림](/materials/diagrams/cpg-04a-permission-layers.svg)](/materials/diagrams/cpg-04a-permission-layers.svg)

*그림 4-1 · 권한은 네 단계로 판정한다 — 누르면 원본 크기로 열린다.*

1. **현재 사용자:** 어느 Term의 활성 Membership을 가진 누구인가?
2. **기본 능력:** Role이 어떤 Permission을 가지는가?
3. **대상 자료:** Task·Event·Meeting의 소유 국, 생성자, 담당자, 공개 범위가 무엇인가?
4. **실제 강제:** 서버·DB·Storage·Realtime이 **같은 결과**를 내는가?

### Role과 Position

==red:Role은 MEMBER·DIRECTOR·EXECUTIVE라는 고정 보안 등급, Position은 회장·부회장·국장 같은 표시 이름이다.== 다음 기수에서 “홍보국장”을 “콘텐츠국장”으로 바꿔도 보안 코드는 Position 문자열에 의존하지 않아야 한다.

**Permission**은 `event.create`, `task.access.manage`처럼 행동 하나의 이름이다. 기획서 v0.7은 Role별 기본 Permission을 마이그레이션으로 고정하고, MVP 운영 화면에서 임의로 편집하지 않는다. 화면은 Permission을 보고 버튼을 표시하고, DB 함수가 실제 수행 여부를 판정한다.

### RBAC와 ACL

| 방식 | 답하는 질문 | 예 |
| --- | --- | --- |
| **RBAC** (Role 기반) | “국장은 어떤 행동을 할 수 있는가?” | DIRECTOR는 자기 국 Task를 만든다 |
| **ACL** (접근 목록) | “**이 특정 업무**는 누가 볼 수 있는가?” | 이 RESTRICTED Task는 재무국과 김OO만 |

학생회 플랫폼은 둘을 함께 쓴다. ==국장 Role이 있어도 다른 국의 제한 업무가 자동으로 보이지는 않는다.==

ACL 대상 형식은 Event·Task·Meeting에서 똑같이 쓴다.

| 대상 형식 | 의미 | 예 |
| --- | --- | --- |
| `USER` | 같은 Term의 활성 구성원 한 명 | 홍보국 김OO |
| `DEPARTMENT` | 같은 Term 부서의 활성 구성원 전체(국장 포함) | 재무국 |
| `ROLE_GROUP` | 역할 묶음 | `ALL_COUNCIL`, `DIRECTORS`(국장+회장단), `EXECUTIVES` |

ACL에 **다른 Term**의 사용자·부서를 넣으면 저장을 거부한다. 같은 대상을 두 번 넣지 못하도록 UNIQUE 제약을 둔다.

## 2. 공개 모드와 상속

**Task의 공개 모드**

- `DEFAULT`: 회장단, 담당 국 구성원, 생성자, 담당자, 추가 ACL 대상이 본다.
- `RESTRICTED`: 회장단, 생성자, 담당자, 명시한 ACL 대상만 본다. ==red:담당 국 전체가 자동으로 보지 않는다.==

**Event의 열람 범위**

- `ALL_COUNCIL`: 같은 Term의 활성 학생회 구성원 전체가 본다.
- `RESTRICTED`: 회장단·생성자·관리자·담당 국·Event ACL 대상이 본다.

Event의 Overview·Resource·Schedule·Handover는 Event 범위를 **그대로** 따른다. Event 아래 Task와 Meeting은 그 범위 안에서 **더 좁힐 수만** 있다.

[![Event 열람자 원과 Task ACL 대상 원이 겹치는 부분만 Task를 실제로 보며, Task ACL에만 있는 홍보국원 B는 Task를 볼 수 없으므로 v0.7은 처음부터 Event 열람자 중에서만 담당자·편집자·ACL 대상을 고르게 한다는 교집합 그림](/materials/diagrams/cpg-04b-event-scope.svg)](/materials/diagrams/cpg-04b-event-scope.svg)

*그림 4-2 · 하위 자료는 교집합만 본다 — 누르면 원본 크기로 열린다.*

> [!EXAM]
> ==하위 자료의 유효 열람자 = Event를 볼 수 있는 사람 ∩ Task/Meeting을 볼 수 있는 사람==
>
> 재무국만 볼 수 있는 행사 아래 Task ACL에 홍보국원을 적어도, 그 홍보국원은 행사를 못 보므로 Task도 못 본다. v0.7은 이런 “지정했는데 안 보이는” 상태를 막으려고 ==blue:지정할 때부터 Event 열람자만 고를 수 있게== 했다.

Event 범위를 나중에 **좁힐** 때는 충돌하는 Task 담당자·Meeting 편집자·ACL 대상 목록을 보여 주고, 다음 중 하나를 골라야 저장된다. 변경은 한 트랜잭션으로 적용한다(6편).

- 그 사람을 Event ACL에 남기기
- 담당자 바꾸기
- 하위 지정 제거하기

## 3. RLS: DB가 행마다 검사한다

**RLS**(Row Level Security)는 PostgreSQL이 **행마다** 읽기·추가·수정·삭제 허용 여부를 검사하는 기능이다. 화면에서 버튼을 숨기는 것은 사용 편의이고, 서버·DB의 검사가 보안이다.

| 정책 | 행동 | 예 |
| --- | --- | --- |
| SELECT | 읽기 | 홍보국원이 열람 가능한 Task만 조회 |
| INSERT | 추가 | 국장이 자기 국 Task를 생성 |
| UPDATE | 수정 | 담당 국원이 자기 Task 상태 변경 |
| DELETE | 삭제 | 이 기획서에서는 대부분 보관 처리로 대체 |

> [!CAUTION]
> ==red:RLS는 행 단위다.== 같은 `suggestions` 행에서 작성자 ID 한 칸만 안전하게 숨기는 방식에 기대지 않는다. 대신 작성자 연결을 **`suggestion_authors`** 테이블로 분리해, 그 테이블의 행 자체를 처리자가 읽지 못하게 한다.

- 서버의 비밀 키나 관리자 권한으로 RLS를 우회하는 경로는 일반 브라우저에 노출하면 안 된다.
- 권한 확인 함수가 민감 테이블을 대신 조회할 때는 **SECURITY DEFINER** 함수를 쓸 수 있다. 이런 함수는 고정 `search_path`, 제한된 실행 권한, 입력 검증이 필요하다.
- RLS의 UPDATE 정책은 “이 행에 접근할 수 있나”만 본다. **어떤 열을 바꿀 수 있는지, 상태를 어떻게 바꿀 수 있는지**는 RPC나 Trigger에서 따로 검증한다(6편 Task 표).

자세한 SQL은 데이터·권한 담당자가 기획서 10.4절과 공식 문서를 기준으로 쓰고, 허용·거부 DB 테스트로 확인한다.

### 다섯 계정으로 하는 권한 실습

| 계정 | 조건 | 예상 결과 |
| --- | --- | --- |
| A | 현재 Term, Event와 Task ACL 모두 포함 | Task 조회 가능 |
| B | Task ACL에는 포함, Event 열람 불가 | Task 조회 **거부** |
| C | 학교 로그인만 하고 Membership 없음 | 내부 Task 조회 **거부** |
| D | 과거 학생회 구성원, 현재 Membership 종료 | 현재 자료 조회·수정 **거부** |
| E | Meeting 열람자, 편집자는 아님 | 본문 읽기 가능, 저장 **거부** |

### 직접 해보기

다섯 계정에 대해 **화면 메뉴, 상세 URL 직접 접근, DB 조회 요청, Realtime 채널 참여** 결과를 따로 적는다. 같은 자료라도 읽기와 수정 결과를 구분한다.

> [!QUIZ]
> 계정 B를 막는 것은 네 단계 중 어디인가? 계정 D는?

> [!ANSWER]
> **B**는 ③ 대상 자료 단계에서 막힌다. Task ACL은 통과하지만 상위 Event 범위와의 교집합에 들지 못한다(그리고 v0.7에서는 애초에 B를 Task ACL에 넣을 수 없다).
>
> **D**는 ① 현재 사용자 단계에서 막힌다. 과거 Membership은 종료되었고, 권한 판정은 항상 **현재 Term의 활성 Membership**을 요구한다.

> [!QUIZ]
> “로그인, Role, ACL, RLS 중 하나만으로 전체 권한을 설명할 수 없다”는 말을 사례로 설명하라.

> [!ANSWER]
> 예: 홍보국장은 로그인(인증)도 했고 DIRECTOR Role(국장 능력)도 있지만, 재무국 RESTRICTED Task는 ACL에 없어서 볼 수 없다. 반대로 화면이 ACL대로 버튼을 숨겨도 RLS가 없으면 URL 직접 요청으로 읽힐 수 있다. 네 단계가 모두 맞아야 실제 결과가 나온다.

## 4. 파일·날짜·개인정보를 안전하게 다루기

### 무엇을 어디에 저장하나

[![행사 PDF를 올리면 메타데이터는 DB의 event_resources에, 파일 본체는 비공개 Storage Bucket에 저장되고, 익명 건의를 내면 내용과 상태는 suggestions에, 작성자 연결은 suggestion_authors에 따로 저장되며, 두 경우 모두 activity_logs에는 민감값 없이 변경 사실만 남는 그림](/materials/diagrams/cpg-04c-data-placement.svg)](/materials/diagrams/cpg-04c-data-placement.svg)

*그림 4-3 · 무엇을 어디에 저장하나 — 누르면 원본 크기로 열린다.*

### 파일은 DB와 다른 저장소에 있다

DB에는 자료 제목·설명·행사 ID·저장 경로 같은 **메타데이터**를, Supabase Storage에는 **파일 자체**를 둔다. **Bucket**은 파일을 모으는 큰 공간이다. 행사 업로드 파일은 **비공개 Bucket**에 두고, Storage의 조회·업로드·삭제 정책을 Event 권한에 연결한다.

- **Signed URL**은 비공개 파일을 정해진 시간 동안만 열 수 있게 하는 임시 주소다. 만료 시간, 캐시, 다른 사람에게 전달될 가능성을 고려한다.
- 파일 크기, 확장자, MIME 타입, 악성 파일 검사 방식은 운영진이 배포 전에 정한다. ==red:확장자만 바꾸면 파일 형식을 속일 수 있으므로== 실제 형식 검사도 검토한다.

> [!CAUTION]
> Google Drive 같은 **외부 링크**는 플랫폼 ACL과 원본 Drive 권한이 별개다. 플랫폼에서 링크를 숨겨도 Drive에서 “링크가 있는 모든 사용자”에게 공개되어 있으면 원본 파일을 열 수 있다. 등록 화면에서 원본 공유 설정을 확인하게 한다.

### 시간 일정과 종일 일정은 저장 형식이 다르다

| 일정 | 성격 | 저장 | 표시 |
| --- | --- | --- | --- |
| 10월 30일 14:00 회의 | 실제 **순간** | `timestamptz` (시간대 포함) | `Asia/Seoul`로 변환 |
| 10월 30일 종일 행사 | **달력 날짜** | `start_date`, `end_date` (날짜) | 변환하지 않음 |

==red:두 방식을 섞으면 날짜가 하루 앞뒤로 밀릴 수 있다.== 종일 행사를 자정 시각으로 저장하면 시간대 변환 때 전날로 보일 수 있다.

### 건의 작성자 신원과 Activity Log

건의 내용·상태는 `suggestions`에, 작성자와 건의의 연결은 `suggestion_authors`에 둔다. ==작성자 본인과 그 건의가 속한 Term의 활성 EXECUTIVE만 신원 정보를 읽는다.== 국장이나 국원이 처리자로 배정되어도 신원은 전달하지 않는다.

**Activity Log**는 누가 언제 어떤 권한·업무를 바꿨는지 기록한다. 일반 사용자가 고치거나 지울 수 없는 **append-only**(덧붙이기만 가능) 구조다. 로그 자체가 정보가 새는 통로가 되지 않도록 다음은 넣지 않는다.

- 회의록 본문 전체
- 건의 작성자 ID
- CRDT 바이너리
- OAuth Token
- 파일 Signed URL

### 직접 해보기

행사 PDF 파일 하나와 익명 건의 하나가 저장될 때 “DB 메타데이터”, “Storage 파일”, “작성자 신원”, “Activity Log” 중 어디에 무엇이 들어가는지 네 칸으로 그린다. 그림 4-3을 보지 않고 먼저 그려 본 뒤 비교한다.

> [!QUIZ]
> 외부 Drive 링크의 권한이 플랫폼 Event ACL만으로 통제되지 않는 이유는?

> [!ANSWER]
> 플랫폼은 **링크 주소를 보여 줄지 말지**만 정한다. 실제 파일을 열 수 있는지는 Google Drive의 공유 설정이 정한다. 링크가 한 번 밖으로 나가거나 Drive에서 “링크가 있는 모든 사용자” 공개면, 플랫폼 ACL과 관계없이 열린다.

> [!QUIZ]
> 건의 작성자 정보를 같은 행의 열로 두지 않고 별도 테이블로 분리하는 이유는?

> [!ANSWER]
> RLS는 **행 단위**로 허용·거부한다. 처리자는 건의 행을 읽어야 일을 할 수 있으므로, 같은 행에 작성자 ID가 있으면 그 열도 함께 읽힐 위험이 크다. 작성자 연결을 별도 테이블로 두면 그 테이블의 행 자체를 본인과 회장단만 읽게 정책을 걸 수 있다.
