---
title: "02 · GitHub 협업"
description: "Organization과 Team의 권한부터 Issue·브랜치·커밋·PR·리뷰·CI·충돌·Squash merge까지, 학생회 플랫폼의 실제 규칙으로 Issue 하나를 Merge 직전까지 진행하는 법을 익힙니다."
order: 1
published: true
duration: 50
tags: [Git, GitHub, Organization, Team, Issue, Branch, Commit, Pull Request, Review, CI, CODEOWNERS]
objectives:
  - Organization·Team·저장소 권한의 관계를 설명한다.
  - Issue 하나를 브랜치·커밋·push·PR로 연결한다.
  - PR에서 Suggest changes를 포함한 리뷰를 주고받고 충돌을 처리한다.
  - CI·브랜치 보호·CODEOWNERS를 확인하고 Squash merge 조건을 판단한다.
---

## 1. 이 강의를 읽으면

> [!CONCEPT]
> **한 문장 목표:** 배정받은 Issue 하나를 브랜치에서 작업하고, PR과 리뷰·CI를 거쳐 리드가 Merge할 수 있는 상태까지 혼자 만든다.

다 읽고 나면 GitHub 화면에서 내 Issue를 찾고, 정해진 이름으로 브랜치를 만들고, 커밋과 push를 한 뒤 PR을 올릴 수 있습니다. 리뷰를 주고받고 최신 `main`을 반영하는 과정도 설명할 수 있습니다.

이 강의의 GitHub 화면 이름과 저장소 설정은 **2026년 10월 29일 기준**입니다. GitHub 화면의 버튼 위치는 바뀔 수 있지만 Issue → Branch → Commit → PR → Review → Merge 순서는 같습니다.

## 2. 개념 설명

### 2-1. Git과 GitHub

**Git**은 내 컴퓨터에서 파일 변경 이력을 기록하는 프로그램입니다. 게임의 저장 지점을 만드는 것과 비슷합니다.

**GitHub**는 Git 저장소를 인터넷에서 공유하고, Issue·리뷰·자동 검사를 함께 관리하는 서비스입니다.

| 단어 | 뜻 | 기억할 점 |
| --- | --- | --- |
| Repository | 프로젝트 파일과 변경 이력 전체 | 우리 저장소는 `council-platform` |
| clone | GitHub 저장소를 처음 내려받기 | 처음 한 번 |
| pull | GitHub의 최신 변경을 받기 | 작업 시작 전에 실행 |
| commit | 내 컴퓨터에 변경 기록 남기기 | 아직 다른 사람에게 보이지 않음 |
| push | 내 커밋을 GitHub에 올리기 | push 뒤에 다른 사람이 볼 수 있음 |
| origin | GitHub에 있는 원격 저장소의 기본 이름 | `git push origin ...`에서 사용 |

`commit`만 하고 `push`하지 않으면 변경은 내 컴퓨터에만 있습니다.

### 2-2. Organization·Team·권한

**Organization**은 개인이 아니라 단체가 저장소를 소유하는 공간입니다. 우리 조직은 `INFOSYS-COUNCIL`입니다.

**Team**은 Organization 안에서 사람을 묶어 권한을 주는 단위입니다. 우리 개발 팀은 `@INFOSYS-COUNCIL/developers`입니다.

조직의 기본 권한은 Read입니다. Organization에 가입한 것만으로는 코드를 올릴 수 없고, `developers` Team이 `council-platform` 저장소의 Write 권한을 줍니다.

| 권한 | 할 수 있는 것 | 우리 사용 방식 |
| --- | --- | --- |
| Read | 코드 보기, Issue·PR 댓글 | 조직 기본값 |
| Write | 브랜치·push·PR·리뷰 | `developers` Team |
| Maintain | 일부 저장소 설정 | 사용하지 않음 |
| Admin | 모든 설정과 멤버 관리 | Owner만 사용 |

Write 권한이 있어도 `main`에 직접 push할 수는 없습니다. 브랜치 보호가 반드시 PR을 거치게 막습니다.

### 2-3. Issue·라벨·Milestone

**Issue**는 할 일 하나를 적은 카드입니다. 우리에게는 작업 지시서이면서 AI에게 줄 설명서입니다.

Issue에서 먼저 읽을 것은 다음 다섯 가지입니다.

| Issue 항목 | 확인할 질문 |
| --- | --- |
| 목표 | 사용자에게 무엇이 가능해져야 하나? |
| 수정 가능한 파일 | 어느 파일까지만 바꿀 수 있나? |
| 이미 준비된 것 | 어떤 테이블·함수·타입·공용 부품을 쓰나? |
| 완료 기준 | 화면에서 무엇을 직접 확인해야 하나? |
| 이번에 하지 않는 것 | 다음 Issue로 미룰 범위는 무엇인가? |

**라벨(Label)**은 Issue의 성격과 상태를 표시합니다.

| 라벨 | 뜻 |
| --- | --- |
| `frontend` | 화면·컴포넌트·스타일 |
| `database` | 테이블·Migration·RLS·DB 테스트 |
| `auth` | 로그인·권한, 리드 리뷰 필수 |
| `infra` | CI·배포·환경 설정 |
| `accessibility` | 키보드·스크린리더·명도 대비 |
| `documentation` | README·가이드·문서 |
| `good first issue` | 처음 하기 좋은 작은 작업 |
| `blocked` | 30분 넘게 막혀 도움 필요 |
| `needs decision` | 리드나 회장단의 결정 필요 |

**Milestone**은 같은 마감에 속한 Issue 묶음입니다. 우리는 주차 단위로 만들며, 이번 주 진행률을 한눈에 볼 때 사용합니다.

작업을 시작하면 Issue에 시작 댓글을 남깁니다. 질문과 진행 상황도 Issue 댓글에 기록하고, 단톡에는 Issue 링크만 공유합니다.

### 2-4. Branch·Commit·Push

**Branch**는 `main`에서 갈라져 나온 내 작업 공간입니다. Issue 하나에는 브랜치 하나만 사용합니다.

[![Issue에서 Branch를 만들고 Commit과 Pull Request, 리뷰를 거쳐 Merge하는 여섯 단계](/materials/diagrams/cpg-02a-git-flow.svg)](/materials/diagrams/cpg-02a-git-flow.svg)

*그림 1 · Issue 하나가 main에 들어가는 길 — 리뷰 수정이 생기면 같은 브랜치에서 다시 Commit합니다.*

브랜치 이름은 다음 형식입니다.

```text
<종류>/<Issue 번호>-<짧은 영어 설명>
```

```text
feat/12-task-list
fix/18-login-error
test/7-positions-deny
```

브랜치는 Issue 화면의 **Development → Create a branch**에서 만드는 것을 권장합니다. 그러면 Issue와 브랜치가 자동으로 연결됩니다.

작업을 시작할 때는 최신 `main`을 받고 내 브랜치로 이동합니다.

```bash
git switch main
git pull
git fetch origin
git switch feat/12-task-list
```

커밋 메시지는 다음 형식입니다.

```text
<종류>(<영역>): <무엇을 했는지, 한국어> (#Issue 번호)
```

```text
feat(tasks): 업무 목록 화면 추가 (#12)
fix(auth): 로그인 오류 문구 수정 (#18)
test(db): 직책 중복 거부 테스트 추가 (#7)
```

파일을 저장한 뒤에는 변경 파일을 확인하고 필요한 파일만 커밋합니다.

```bash
git status
git add src/app/tasks/
git commit -m "feat(tasks): 업무 목록 화면 추가 (#12)"
git push -u origin feat/12-task-list
```

`git add .`은 엉뚱한 파일까지 포함할 수 있습니다. 먼저 `git status`로 바뀐 파일을 보고 경로를 지정합니다.

### 2-5. Pull Request와 리뷰

**Pull Request(PR)**는 "내 브랜치의 변경을 `main`에 합쳐 주세요"라고 요청하는 공간입니다.

PR 제목은 커밋 메시지와 같은 형식을 사용합니다.

```text
feat(tasks): 업무 목록 화면 추가 (#12)
```

PR 본문 첫 줄에는 다음처럼 씁니다.

```text
Closes #12
```

그냥 `#12`만 쓰면 Issue가 연결만 됩니다. `Closes #12`라고 써야 PR이 Merge될 때 Issue가 자동으로 닫힙니다.

작업 중이라면 **Draft PR**로 먼저 올릴 수 있습니다. Draft는 진행 상황과 CI 결과를 공유하면서 아직 최종 리뷰 대상은 아니라는 뜻입니다.

PR을 만들면 다음 탭을 확인합니다.

| 탭 | 확인할 것 |
| --- | --- |
| Conversation | 설명, 댓글, 검사 결과, Merge 조건 |
| Commits | 이 PR에 들어간 커밋 |
| Checks | `app`, `db` CI의 성공·실패와 오류 로그 |
| Files changed | 실제 바뀐 파일과 줄, 리뷰 댓글 |

리뷰어는 Files changed에서 줄 번호 옆 `+`를 눌러 댓글을 답니다. 한 줄 수정은 **Suggest changes**로 고칠 코드를 직접 제안할 수 있습니다.

리뷰를 마칠 때는 **Review changes**에서 하나를 고릅니다.

| 선택 | 뜻 |
| --- | --- |
| Comment | 의견만 남김 |
| Approve | 통과 |
| Request changes | 수정해야 통과 |

리뷰 지적을 받으면 새 PR을 만들지 않습니다. 같은 브랜치에서 수정하고 commit·push하면 기존 PR에 자동으로 반영됩니다. 해결한 댓글은 **Resolve conversation**으로 닫습니다.

### 2-6. 리뷰 짝

1단계 리뷰는 같은 팀의 짝이 아니라 **다른 팀의 같은 역할 담당자**가 합니다.

| 변경 성격 | 서로 리뷰하는 사람 |
| --- | --- |
| 화면 | 강주원 `@joowon0130` ↔ 정재헌 `@jaehjung0102` |
| 데이터 연결·테스트 | 이은규 `@elee7coder` ↔ 조수빈 `@goms1107` |
| 리드의 `supabase/`·CI·공용 파일 | 이은규 또는 조수빈이 학습 겸 1단계 확인 |
| 모든 변경의 최종 리뷰 | 한지석 `@hkg109` |

리뷰는 세 단계입니다.

1. 작성자가 AI 리뷰를 먼저 받고 지적을 반영합니다.
2. 1단계 리뷰어가 체크리스트와 Preview로 직접 확인합니다.
3. 리드가 보안·범위·설명 가능성을 최종 확인하고 Merge합니다.

리뷰 댓글은 "이상해요"로 끝내지 않습니다. 무엇이 문제인지와 어떻게 고치면 좋을지를 같이 씁니다. 선택 사항이면 댓글 앞에 `(선택)`을 붙입니다.

### 2-7. Update branch와 충돌

내가 작업하는 동안 다른 PR이 먼저 Merge되면 내 브랜치가 최신 `main`보다 뒤처질 수 있습니다.

PR에 **This branch is out-of-date with the base branch**가 표시되면 **Update branch**를 누릅니다. 그러면 최신 `main`을 반영한 상태로 CI가 다시 실행됩니다.

Update 뒤에는 내 컴퓨터에서도 `git pull`로 맞춥니다.

**충돌(Conflict)**은 두 사람이 같은 파일의 같은 부분을 다르게 고쳐 Git이 어느 쪽을 남길지 정하지 못하는 상태입니다.

```text
(시작 표시) <<<<<<< feat/12-task-list
<h1>업무 목록</h1>
(구분 표시) =======
<h1>내 업무</h1>
(끝 표시) >>>>>>> main
```

충돌이 나면 내 브랜치에서 최신 `main`을 받습니다.

```bash
git switch feat/12-task-list
git pull origin main
```

두 변경의 목적을 확인해 남길 내용을 고른 뒤 `<<<<<<<`, `=======`, `>>>>>>>` 표시가 모두 사라졌는지 봅니다. 그리고 다시 검사하고 commit·push합니다.

### 2-8. CI·브랜치 보호·CODEOWNERS

**CI(Continuous Integration)**는 PR을 올리거나 push할 때 자동으로 코드를 검사하는 장치입니다.

| 검사 | 하는 일 | 빨간색이면 |
| --- | --- | --- |
| `app` | lint → typecheck → 단위 테스트 → build | Checks에서 실패한 명령과 오류 확인 |
| `db` | 새 DB에 Migration·Seed 적용 → pgTAP 테스트 | DB 테스트 로그 확인, 보통 리드 영역 |

**브랜치 보호**는 `main`을 지키는 GitHub 설정입니다.

- `main` 직접 push 금지
- `app`, `db` 검사가 초록색이어야 Merge 가능
- 필요한 리뷰 승인이 있어야 Merge 가능
- 해결하지 않은 리뷰 대화가 있으면 Merge 불가
- 최신 `main`을 반영한 상태로 다시 검사

**CODEOWNERS**는 특정 파일의 최종 리뷰 담당자를 저장소에 기록한 파일입니다. 우리 저장소는 모든 파일에 리드의 승인이 필요합니다.

팀원의 1단계 리뷰가 끝나도 CODEOWNERS의 리드 승인 전에는 Merge할 수 없습니다.

### 2-9. Squash merge와 순차 Merge

**Squash and merge**는 브랜치의 여러 커밋을 `main`의 커밋 하나로 합치는 방식입니다.

Squash 뒤에는 PR 제목이 `main`의 커밋 메시지가 됩니다. 그래서 브랜치 안의 중간 커밋보다 PR 제목을 정확히 쓰는 것이 중요합니다.

Merge는 리드만 합니다. 여러 PR이 준비되어 있어도 동시에 합치지 않습니다.

1. 영향이 적은 PR 하나를 Merge합니다.
2. 남은 PR은 Update branch로 최신 `main`을 받습니다.
3. CI가 다시 초록색이 되면 다음 PR을 Merge합니다.
4. Merge된 브랜치는 삭제합니다.

팀원은 Merge 뒤 `git switch main`과 `git pull`로 최신 상태를 받고 다음 Issue를 시작합니다.

### 2-10. 우리 주간 리듬

| 시점 | 하는 일 |
| --- | --- |
| 목요일 모임 | 지난 결과 시연, 이번 주 Issue 배정 |
| 금요일–월요일 | 기능 작업, 막히면 Issue에 질문 |
| **화요일 23:59** | **PR 마감** |
| 수요일 | 상호 리뷰, 수정, 리드 최종 리뷰, 순서대로 Merge |
| 수요일 밤 | 운영 확인, 다음 주 Issue 준비 |

30분 넘게 막히면 혼자 붙잡지 않습니다. Issue 댓글에 시도한 것, 오류, 기대 결과를 남기고 `blocked` 라벨을 붙입니다.

## 3. 우리 저장소에서 보기

### 3-1. Issue가 작업 범위를 정한다

`.github/ISSUE_TEMPLATE/task.md`는 리드가 Issue를 만들 때 사용하는 양식입니다.

```text
.github/ISSUE_TEMPLATE/task.md
├─ 목표
├─ 담당 · 리뷰
├─ 수정 가능한 파일
├─ 이미 준비된 것
├─ 완료 기준
├─ 이번에 하지 않는 것
└─ 읽을 강의
```

AI에게 Issue를 줄 때도 이 내용을 기준으로 합니다. 특히 "수정 가능한 파일"과 "이번에 하지 않는 것"이 AI의 작업 경계입니다.

### 3-2. PR은 설명과 확인 결과를 남긴다

`.github/pull_request_template.md`에는 다음 항목이 있습니다.

- `Closes #`
- 무엇을 바꿨나
- AI에 준 핵심 요청
- 직접 실행한 검사
- Preview 확인 결과
- 권한 없는 계정으로 확인한 결과
- 잘 모르는 부분
- 리뷰어 체크리스트

모르는 부분을 비워 두거나 감추지 않습니다. 리뷰어가 어디를 자세히 봐야 하는지 알려 주는 정보입니다.

### 3-3. 최종 리뷰 담당

`.github/CODEOWNERS`는 `*` 규칙으로 모든 변경에 리드의 승인을 요청합니다.

파일이 존재한다고 규칙이 자동으로 강제되는 것은 아닙니다. 저장소의 브랜치 보호에서 Code Owner 리뷰 요구 설정도 켜져 있어야 합니다.

### 3-4. 자동 검사

`.github/workflows/ci.yml`에는 `app`과 `db` 두 작업이 있습니다.

`app`은 `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`를 실행합니다.

`db`는 새 Supabase DB를 시작하고 `npx supabase test db`를 실행합니다. 운영 DB에서 테스트하는 것이 아니라 Actions 안의 깨끗한 DB를 사용합니다.

### 3-5. AI가 먼저 읽는 규칙

`AGENTS.md`와 `CLAUDE.md`에는 브랜치·검사·공용 파일·보안·주간 리듬 규칙이 들어 있습니다.

매 프롬프트에 규칙 전체를 복사할 필요는 없습니다. 이번 Issue의 목표와 범위처럼 AI가 스스로 알 수 없는 정보만 추가합니다.

## 4. 프롬프트에 쓰는 법

### 4-1. Issue 시작

**나쁜 예**

```text
업무 기능 전부 만들어 줘.
```

**좋은 예**

```text
Issue #12를 구현해 줘. 아래 Issue 본문을 기준으로 먼저 변경할 파일과 방법만 계획해 줘.
내가 확인하기 전에는 코드를 바꾸지 마.
```

Issue 번호와 본문을 주면 목표·허용 파일·완료 기준이 함께 전달됩니다.

### 4-2. 작업 전 Git 상태 확인

**나쁜 예**

```text
바로 코드부터 고쳐 줘.
```

**좋은 예**

```text
작업 전에 현재 브랜치와 변경 파일을 확인해 줘.
feat/12-task-list가 아니거나 기존 변경이 있으면 코드를 수정하기 전에 알려 줘.
```

AI가 `main`이나 다른 사람의 변경 위에서 작업하는 것을 막기 위한 요청입니다.

### 4-3. 커밋 준비

**나쁜 예**

```text
알아서 커밋해 줘.
```

**좋은 예**

```text
변경 파일과 검사 결과를 먼저 요약하고, 커밋 메시지를 feat(tasks): 업무 목록 화면 추가 (#12) 형식으로 제안해 줘.
내 확인 전에는 커밋하지 마.
```

커밋 전에 엉뚱한 파일과 실행하지 않은 검사를 찾을 수 있습니다.

### 4-4. 오류 전달

**나쁜 예**

```text
CI가 안 돼요. 고쳐 줘.
```

**좋은 예**

```text
PR Checks의 app 작업에서 npm run typecheck가 실패했어.
아래 오류의 원인과 관련 파일을 먼저 설명하고, Issue 범위 안에서 고쳐 줘. (오류 메시지 붙여 넣기)
```

실패한 검사 이름과 오류 원문을 주면 AI가 추측하는 시간을 줄일 수 있습니다.

### 4-5. AI 리뷰

**나쁜 예**

```text
코드 괜찮지?
```

**좋은 예**

```text
Issue #12의 완료 기준과 현재 diff를 비교해 리뷰해 줘.
화면 상태 4가지, 권한 없는 직접 접근, 수정 허용 파일 밖의 변경을 우선 확인해 줘.
```

리뷰 기준을 주면 단순한 칭찬이 아니라 누락과 범위 이탈을 찾게 할 수 있습니다.

### 4-6. 충돌 해결

**나쁜 예**

```text
충돌 아무렇게나 해결해 줘.
```

**좋은 예**

```text
src/app/tasks/page.tsx의 충돌에서 내 목록 화면 변경과 main의 EmptyState 변경 목적을 모두 설명해 줘.
두 목적을 살리는 결과를 제안하고, 다른 파일은 바꾸지 마.
```

충돌은 최신 코드와 내 코드 중 하나를 무조건 고르는 일이 아닙니다. 두 변경의 목적을 이해하고 합치는 일입니다.

## 5. AI 결과 확인하기

### 5-1. AI가 GitHub 작업에서 자주 틀리는 것

| 실수 | 확인 방법 |
| --- | --- |
| `main`에서 바로 수정함 | `git status`로 현재 브랜치 확인 |
| Issue에 없는 파일까지 바꿈 | PR Files changed와 Issue의 수정 가능 파일 비교 |
| `git add .`로 엉뚱한 파일을 포함함 | commit 전 `git status`, `git diff --staged` 확인 |
| 패키지를 임의로 추가함 | `package.json`, lock 파일 변경 확인 |
| 실행하지 않은 검사를 통과했다고 말함 | 실제 명령 출력과 PR Checks 확인 |
| 오류를 테스트 삭제나 RLS 우회로 숨김 | 테스트·정책 diff와 거부 사례 확인 |
| force push나 기록 삭제를 제안함 | 실행하지 말고 리드에게 상황 공유 |
| 새 리뷰 수정에 새 PR을 만듦 | 같은 브랜치에 commit·push했는지 확인 |
| `Closes #12`를 빠뜨림 | PR 본문 첫 줄 확인 |
| PR 제목 형식이 다름 | Squash 뒤 main에 남을 제목인지 확인 |

### 5-2. Issue에서 Merge 직전까지 체크리스트

1. Issues의 **Assigned to me**에서 내 Issue를 엽니다.
2. 목표·허용 파일·준비된 것·완료 기준·제외 범위를 읽습니다.
3. 시작 댓글을 남기고 Development에서 브랜치를 만듭니다.
4. 최신 `main`을 받은 뒤 내 브랜치로 이동합니다.
5. AI에 계획을 먼저 요청하고 범위를 확인합니다.
6. 구현 뒤 화면과 검사 명령을 직접 확인합니다.
7. 변경 파일을 확인하고 커밋·push합니다.
8. PR 제목과 템플릿을 채우고 `Closes #번호`를 넣습니다.
9. 작성자 AI 리뷰를 반영하고 CI가 초록색인지 봅니다.
10. Preview 링크에서 완료 기준과 권한 없는 계정을 확인합니다.
11. 1단계 리뷰어를 지정하고 리뷰 지적을 같은 브랜치에서 수정합니다.
12. Update branch 뒤 CI가 다시 초록색이고 모든 대화가 해결됐는지 봅니다.
13. 리드의 최종 승인과 Squash merge를 기다립니다.

팀원의 완료 지점은 Merge 버튼을 누르는 것이 아니라 **리드가 안전하게 Merge할 수 있는 상태를 만드는 것**입니다.

## 6. 확인 질문

> [!QUIZ]
> commit과 push는 무엇이 다르며, 다른 팀원이 내 변경을 보려면 어디까지 해야 하나요?

> [!ANSWER]
> commit은 내 컴퓨터에 변경 이력을 저장하는 것이고, push는 그 커밋을 GitHub에 올리는 것입니다. 다른 팀원이 보려면 commit 뒤 push까지 해야 합니다.

> [!QUIZ]
> PR 본문에 `#12`만 쓰는 것과 `Closes #12`를 쓰는 것은 무엇이 다른가요?

> [!ANSWER]
> `#12`는 PR과 Issue를 연결만 합니다. `Closes #12`는 PR이 main에 Merge될 때 Issue #12도 자동으로 닫습니다.

> [!QUIZ]
> 다른 PR이 먼저 Merge되어 내 PR에 Update branch가 나타났습니다. Merge 직전까지 무엇을 다시 확인해야 하나요?

> [!ANSWER]
> Update branch로 최신 main을 반영하고, 충돌이 있으면 두 변경의 목적을 살려 해결합니다. 그 뒤 app·db CI가 다시 초록색인지, Preview가 정상인지, 리뷰 대화가 모두 해결됐는지 확인하고 리드의 최종 승인을 기다립니다.
