---
title: "07-2 · Git 협업과 배포"
description: "Issue → Branch → Commit → Pull Request → 리뷰 → Merge 흐름과 팀 규칙, main 브랜치 보호와 CODEOWNERS, PR 양식을 정하고, GitHub Actions로 PR마다 lint·test·build·DB 테스트를 돌리고 main에 합쳐지면 Supabase 마이그레이션과 Vercel 배포를 학생회 계정 토큰으로 실행하는 워크플로 파일을 한 줄씩 읽습니다."
order: 2
published: true
duration: 55
tags: [Git, GitHub, Pull Request, 브랜치 보호, GitHub Actions, CI/CD, 배포, 롤백]
objectives:
  - 변경 하나가 main에 들어가는 여섯 단계와 각 단계의 기록을 말한다.
  - 브랜치 보호 규칙과 CODEOWNERS가 강제하는 것을 말한다.
  - CI 워크플로와 배포 워크플로가 각각 언제 무엇을 실행하는지 읽는다.
  - 배포가 잘못됐을 때 되돌리는 방법을 말한다.
---

## 1. 변경 하나가 main에 들어가는 길

[![Issue, Branch, Commit, Pull Request, 리뷰, Merge의 여섯 단계와 리뷰에서 수정 요청이 나오면 Commit으로 돌아가는 고리](/materials/diagrams/cpg-02a-git-flow.svg)](/materials/diagrams/cpg-02a-git-flow.svg)

*그림 07-2 · 변경 하나가 main에 들어가는 길 — 누르면 원본 크기로 열린다.*

| 단계 | 하는 일 | 남는 기록 |
| --- | --- | --- |
| Issue | 목적과 완료 기준을 먼저 적음 | 왜 이 변경이 필요한가 |
| Branch | `feat/agenda-publish`처럼 main에서 분리 | 작업 단위 |
| Commit | 의미 있는 변경마다 이유를 적음 | 무엇을 왜 바꿨나 |
| Pull Request | 변경 설명·실행 방법·화면·테스트 결과 | 리뷰 가능한 묶음 |
| 리뷰 | 다른 팀원이 읽고 Preview에서 실행 | 누가 확인했나 |
| Merge | main에 합침 → 자동 배포 | 언제 운영에 들어갔나 |

```bash
git switch main && git pull                 # 최신 main에서
git switch -c feat/agenda-publish           # 새 브랜치
# … 코드 수정 …
git add "app/(council)/meetings" supabase/migrations   # 괄호가 있는 경로는 따옴표로
git commit -m "Let directors publish meeting agendas"
git push -u origin feat/agenda-publish      # GitHub에 올리고 PR 생성
```

### 커밋 메시지

- 첫 줄: **무엇을 하게 됐는지** 동사로 시작하는 한 문장 (예: "Let directors publish meeting agendas", "Block self-approval of council handover").
- 필요하면 빈 줄 뒤에 **왜** 바꿨는지.
- "수정", "update", "fix bug"처럼 내용 없는 메시지는 쓰지 않습니다. 다음 기수가 `git log`로 이력을 읽기 때문입니다.

### 충돌(Merge Conflict)

두 사람이 같은 파일의 같은 부분을 다르게 고치면 Git이 어느 쪽이 맞는지 정하지 못합니다. 두 변경의 **목적**을 읽고 필요한 내용을 합친 뒤, 반드시 다시 실행하고 테스트합니다. 마이그레이션 파일은 시각이 이름에 들어 있어 충돌은 드물지만, **같은 테이블을 고치는 두 마이그레이션**은 적용 순서를 리뷰에서 확인합니다.

## 2. 팀 규칙을 GitHub가 강제하게

Organization 저장소 설정 → Branches → `main` 보호 규칙:

| 설정 | 효과 |
| --- | --- |
| Require a pull request before merging | main에 직접 push 금지 |
| Require approvals: 1 | 작성자 외 1명 승인 필요 |
| Require review from Code Owners | 아래 CODEOWNERS 경로는 지정된 사람이 승인해야 |
| Require status checks to pass: `ci` | CI가 통과해야 Merge 버튼이 켜짐 |
| Require branches to be up to date | 최신 main과 합친 상태로 검사 |
| Do not allow bypassing | Owner도 규칙을 건너뛰지 않음 |

```text
# .github/CODEOWNERS
supabase/migrations/   @council-org/db-reviewers
supabase/tests/        @council-org/db-reviewers
.github/workflows/     @council-org/maintainers
```

기획서·이전 가이드의 규칙 "**DB 마이그레이션과 RLS 정책은 작성자 외 한 명이 검토한다**"를 CODEOWNERS로 강제합니다. `db-reviewers` 팀은 기수마다 갱신합니다.

### PR 양식

```markdown
<!-- .github/pull_request_template.md -->
## 무엇을 바꿨나
## 왜 (관련 Issue)
## 실행·확인 방법
## 화면 (개발 프로젝트의 가짜 데이터로)
## 권한 테스트
- [ ] 허용 사례:
- [ ] 거부 사례:
## 공개 저장소 점검
- [ ] 비밀 값·실제 개인정보가 없다
```

## 3. CI — PR마다 자동 검사

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: http://127.0.0.1:54321
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: build-placeholder

      - uses: supabase/setup-cli@v1
      - run: supabase start              # Actions 안에 임시 DB를 띄움 (Docker)
      - run: supabase db reset           # 마이그레이션 + seed.sql 적용
      - run: supabase test db            # supabase/tests/*.sql 실행 (04-5)
```

| 줄 | 읽는 법 |
| --- | --- |
| `on: pull_request` | PR을 열거나 커밋을 추가할 때마다 실행 |
| `runs-on: ubuntu-latest` | GitHub가 빌려주는 리눅스 컴퓨터에서 |
| `npm ci` | `package-lock.json` 그대로 설치 |
| `lint` / `test` / `build` | 코드 규칙 검사 / 단위 테스트 / 실제 빌드 |
| `supabase start` → `db reset` → `test db` | 깨끗한 DB에 마이그레이션을 처음부터 적용하고 RLS 허용·거부 테스트 실행 |

이 CI는 **비밀 값을 쓰지 않습니다.** 그래서 외부 사람이 fork로 보낸 PR에서도 안전하게 돌아갑니다.

## 4. 배포 — main에 합쳐지면

[![개발자가 PR을 열면 Actions가 검사하고, 리뷰와 검사 통과 뒤 Merge되면 Actions가 Supabase 마이그레이션 적용과 Vercel 빌드·배포를 학생회 계정 토큰으로 실행하는 흐름](/materials/diagrams/cpg-20-deploy.svg)](/materials/diagrams/cpg-20-deploy.svg)

*그림 07-3 · PR이 운영 사이트가 되기까지 — 누르면 원본 크기로 열린다.*

```yaml
# .github/workflows/deploy.yml
name: deploy
on:
  push:
    branches: [main]

concurrency: production              # 배포는 한 번에 하나씩

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production          # GitHub Environment: 승인자 지정 가능
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }

      # 1) DB 구조 먼저 (새 코드가 새 열을 쓸 수 있도록)
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}

      # 2) 앱 빌드·배포 (학생회 계정 토큰)
      - run: npm i -g vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

| 부분 | 읽는 법 |
| --- | --- |
| `on: push: branches: [main]` | main에 합쳐질 때만 |
| `concurrency: production` | 두 Merge가 연달아 와도 배포가 겹치지 않게 |
| `environment: production` | 원하면 "회장단 개발 담당 승인 후 배포"를 걸 수 있음 |
| `${{ secrets.X }}` | GitHub Secrets 값. 로그에는 `***`로 가려짐 |
| `supabase db push` | 운영 DB에 아직 적용 안 된 마이그레이션만 적용 |
| `vercel pull` | Vercel에 저장된 운영 환경변수를 받아옴 |
| `vercel build --prod` → `deploy --prebuilt --prod` | Actions에서 빌드하고 결과물만 Vercel에 올림 |

> [!NOTE]
> 배포를 사람이 아니라 Actions가 공용 계정 토큰으로 하므로, **Vercel Hobby에서도 누가 PR을 만들었든** main에 들어간 코드는 배포됩니다(07-1). 대신 Vercel 프로젝트의 Git 자동 배포는 꺼서 두 번 배포되지 않게 합니다.

> [!CAUTION]
> **DB를 먼저, 앱을 나중에** 배포합니다. 새 앱이 아직 없는 열을 읽으면 오류가 나기 때문입니다. 그래서 마이그레이션은 **옛 앱도 계속 동작하는 방식**(열 추가는 OK, 열 삭제·이름 변경은 두 번에 나눠서)으로 씁니다.

## 5. 정기 작업

```yaml
# .github/workflows/scheduled.yml
name: scheduled
on:
  schedule:
    - cron: "0 18 * * *"          # 매일 18:00 UTC = 한국 새벽 3시
  workflow_dispatch:              # 손으로도 실행 가능

jobs:
  daily:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS https://council.example.com/api/health                      # Supabase 일시 중지 방지 (07-1)
      - run: curl -fsS -X POST -H "authorization: Bearer ${{ secrets.CRON_SECRET }}" https://council.example.com/api/jobs/compact-meetings   # 05-3
      - run: curl -fsS -X POST -H "authorization: Bearer ${{ secrets.CRON_SECRET }}" https://council.example.com/api/jobs/expire-handovers  # 06-5
```

## 6. 잘못 배포했을 때

| 상황 | 되돌리기 |
| --- | --- |
| 화면·서버 코드 문제 | Vercel 대시보드(공용 계정)에서 이전 배포를 **Promote**, 또는 `vercel rollback`. 그다음 원인을 고친 PR |
| DB 마이그레이션 문제 | 이미 적용된 파일을 고치지 않고 **되돌리는 새 마이그레이션**을 PR로. 데이터가 망가졌다면 백업에서 복구(07-3) |
| 비밀 값 노출 | 즉시 키 폐기·재발급 → Secrets·환경변수 교체 → 재배포 (07-3) |

`git revert <커밋>`은 그 커밋을 되돌리는 **새 커밋**을 만듭니다. 기록을 지우지 않으므로 공개 저장소에서도 안전한 되돌리기입니다.

> [!QUIZ]
> 국원 개발자가 브랜치 보호를 무시하고 `git push origin main`을 시도하면 어떻게 되나요? Owner인 개발 담당이 하면요?

> [!ANSWER]
> 둘 다 거부됩니다. "Require a pull request before merging"과 "Do not allow bypassing"이 켜져 있으면 Owner도 PR·리뷰·CI를 거쳐야 합니다. 급한 수정도 PR을 만들어 다른 사람의 승인을 받습니다.

> [!QUIZ]
> CI 워크플로에 `SUPABASE_DB_PASSWORD`를 넣어 운영 DB에서 테스트를 돌리면 안 되는 이유 두 가지는?

> [!ANSWER]
> ① 테스트가 운영 데이터에 가짜 행을 넣거나 지울 수 있습니다. ② CI는 fork PR에서도 돌아가는데, 공개 저장소에서 비밀 값을 쓰는 워크플로는 노출 위험이 커집니다. 그래서 CI는 Actions 안에 임시 DB(`supabase start`)를 띄워 비밀 없이 테스트하고, 운영 비밀은 main 배포 워크플로에서만 씁니다.

## 학습 경로

[← 07-1 계정과 서비스 소유권](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-01) · [07-3 기수 교대 점검표 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-03)
