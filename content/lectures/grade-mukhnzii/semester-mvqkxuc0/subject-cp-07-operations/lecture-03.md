---
title: "07-3 · 기수 교대 점검표"
description: "매년 회장단이 바뀔 때 서비스 안(권한 이양·기수 전환)과 서비스 밖(GitHub·Vercel·Supabase 계정, 비밀번호·토큰, 백업, 비용·한도)에서 해야 할 일을 시기별 점검표로 정리하고, DB 백업·Supabase 일시 중지 복구·비밀 값 노출 대응 절차를 명령어 수준으로 기록합니다."
order: 3
published: false
duration: 45
tags: [운영, 기수 교대, 점검표, 백업, 복구, 토큰 교체, 사고 대응]
objectives:
  - 기수 교대 점검표를 전환 전·전환 당일·전환 후로 나눠 말한다.
  - DB와 Storage 백업을 만들고 보관하는 절차를 말한다.
  - Supabase 일시 중지와 비밀 값 노출이 생겼을 때의 대응 순서를 말한다.
  - 복구 절차를 실제로 한 번 점검해야 하는 이유를 말한다.
---

## 1. 왜 점검표인가

서비스를 몇 년씩 이어 가다 끊기는 순간은 대개 코드가 아니라 **사람이 바뀌는 때**입니다. 비밀번호를 아는 사람이 졸업하고, 토큰이 개인 계정에 묶여 있고, 백업이 어디 있는지 아무도 모르는 상황입니다. 그래서 매년 같은 순서로 확인할 **점검표**를 둡니다. 이 편의 표를 저장소 `docs/handover-checklist.md`로 그대로 옮겨 쓰고, 매년 체크한 결과를 Issue로 남깁니다.

## 2. 전환 4주 전 — 준비

| ✓ | 할 일 | 누가 | 참고 |
| --- | --- | --- | --- |
| ☐ | 다음 기수 이름·시작일 결정, 세팅 화면에서 DRAFT 기수 생성 | 현 회장 | 06-5 7절 |
| ☐ | 다음 회장단 지정 요청 → 다른 회장단 승인 | 현 회장단 2명 | 06-5 |
| ☐ | 미처리 건의 정책 결정(이월/마감). 마감이면 남은 건의 처리 시작 | 현 회장단 | 06-4 5절 |
| ☐ | 부서별 **인수인계(Handover) 발행** | 각 국장 | 00-2 5-6 |
| ☐ | 다음 기수 개발 담당 정하기 | 다음 회장단 | |
| ☐ | **DB·Storage 백업** (아래 4절) | 현 개발 담당 | |
| ☐ | Vercel·Supabase 사용량이 한도에 가까운지 확인, 공식 가격 페이지 다시 확인 | 현 개발 담당 | 07-1 |

## 3. 전환 당일과 직후

### 서비스 안

| ✓ | 할 일 | 누가 |
| --- | --- | --- |
| ☐ | 세팅 화면 1–4단계 완료 확인 → **기수 전환** | 새 회장단 |
| ☐ | 전환 직후 이전 기수 국원 계정으로 이전 업무가 0건인지 확인 | 새 개발 담당 |
| ☐ | 필요한 사람에게 **Archive Grant** (범위·만료일 지정) | 새 회장단 |
| ☐ | Dashboard Quick Links 점검 (전역 설정이라 그대로 넘어옴) | 새 회장단 |
| ☐ | 회의 Template 새로 만들기 (자동 복제 없음) | 새 회장단 |

### 서비스 밖 — 계정과 비밀

| ✓ | 할 일 | 어디서 |
| --- | --- | --- |
| ☐ | 공용 Google 계정 **비밀번호 변경**, 2단계 인증 복구 코드 재발급, 로그인 기기 정리 | Google 계정 |
| ☐ | GitHub Organization: 졸업한 개발자 **제거**, 새 개발자 초대, Owner 2명 이상 확인, `db-reviewers` 팀 갱신 | GitHub |
| ☐ | **VERCEL_TOKEN 재발급** → GitHub Secrets 교체 → 이전 토큰 폐기 | Vercel, GitHub |
| ☐ | **SUPABASE_ACCESS_TOKEN 재발급** → Secrets 교체 → 이전 토큰 폐기 | Supabase, GitHub |
| ☐ | 이전 기수 개발자가 개인적으로 받은 키가 있었다면 **재발급** (Secret key, DB 비밀번호) → Vercel 환경변수·Secrets 교체 → 재배포 | Supabase, Vercel |
| ☐ | Supabase 대시보드 팀원 목록 정리 (공용 계정 외 개인 초대가 있다면) | Supabase |
| ☐ | 예약 워크플로(`scheduled`)가 켜져 있는지 확인 (60일 비활성 시 자동 꺼짐) | GitHub Actions |
| ☐ | 최근 1년 EXECUTIVE 부여·권한 이양·비상 절차 기록 검토 | `activity_logs`, `docs/emergency/LOG.md` |

> [!EXAM]
> 토큰과 키를 **매년 바꾸는 이유**: 누가 그 값을 알고 있는지 추적할 수 없기 때문입니다. 졸업생의 노트북, 메신저 대화, 오래된 `.env.local`에 남아 있을 수 있습니다. 바꾸고 나면 "지금 이 값을 아는 사람"이 현 기수로 좁혀집니다.

## 4. 백업 — 직접 만들고 공용 Drive에

Supabase Free는 자동 백업에 기댈 수 없으므로 직접 만듭니다. **매달 1회 + 기수 전환 직전 + 큰 마이그레이션 직전.**

```bash
# 공용 계정으로 로그인된 개발 담당 컴퓨터에서 (운영 프로젝트에 link된 폴더)
npx supabase db dump --linked -f backup/2027-02-20_schema.sql            # 테이블·함수·정책
npx supabase db dump --linked --data-only -f backup/2027-02-20_data.sql  # 데이터
npx supabase db dump --linked --role-only -f backup/2027-02-20_roles.sql # 역할
```

| 규칙 | 이유 |
| --- | --- |
| `backup/` 폴더는 `.gitignore`에 | 공개 저장소에 데이터가 올라가면 전체 유출 |
| 압축 + 암호 설정 후 **학생회 공용 Google Drive**(비공개 폴더)에 | 공용 계정과 함께 넘겨짐 |
| 파일 이름에 날짜 | 어느 시점으로 되돌릴지 고를 수 있게 |
| 최근 12개 보관, 오래된 것 삭제 | 보존 기간은 기획서 0.2절 운영값 |
| Storage 파일도 | 행사 자료는 DB가 아니라 Storage에 있음. 대시보드나 스크립트로 Bucket을 내려받아 같이 보관 |

> [!CAUTION]
> 백업은 **복구해 봐야** 백업입니다. 기획서 12.1절과 완료 기준 28: "DB·Storage 복구 절차를 최소 1회 점검한 뒤 배포". 학기마다 한 번, 개발용 프로젝트를 비우고 최신 백업을 넣어 로그인·업무 조회가 되는지 확인합니다.

```bash
# 복구 연습: 개발 프로젝트에 link한 뒤
psql "$DEV_DB_URL" -f backup/2027-02-20_roles.sql
psql "$DEV_DB_URL" -f backup/2027-02-20_schema.sql
psql "$DEV_DB_URL" -f backup/2027-02-20_data.sql
```

복구 연습에 쓴 개발 프로젝트에는 실제 데이터가 들어가므로, 연습이 끝나면 비우고 다시 가짜 Seed로 되돌립니다.

## 5. 사고 대응

### Supabase가 일시 중지됐을 때

1. 증상: 사이트가 오류를 내고 `/api/health`가 503.
2. 공용 계정으로 Supabase 대시보드 → 해당 프로젝트 → **Restore/Resume**.
3. 복구가 끝나면 로그인·업무 조회 확인.
4. 왜 멈췄는지 확인: 예약 워크플로가 꺼졌나? 실패했나? → 다시 켜고 Issue로 기록.

### 비밀 값이 노출됐을 때

| 순서 | 할 일 |
| --- | --- |
| 1 | **폐기·재발급**: 노출된 키(Supabase Secret key, DB 비밀번호, Vercel 토큰 등)를 해당 대시보드에서 즉시 교체 |
| 2 | 새 값을 Vercel 환경변수·GitHub Secrets에 넣고 **재배포** |
| 3 | 노출 기간의 이상 접근 확인 (Supabase 로그, Activity Log) |
| 4 | 커밋에서 값 제거 (기록에는 남으므로 1번이 핵심) |
| 5 | 회장단에 보고, 개인정보가 노출됐다면 학교 절차 확인 |
| 6 | 재발 방지 Issue (어떻게 들어갔나 → PR 점검표 보강) |

### 권한을 잘못 줬을 때

- Membership 종료, 승인 행 비활성화, Archive Grant 회수(`revoked_at`) 모두 화면·함수로 가능하고 Activity Log에 남습니다.
- 회의록 Realtime은 회수 후 최대 수신 시간(운영값) 안에 끊깁니다(05-3).

## 6. 1년 달력

| 시기 | 할 일 |
| --- | --- |
| 매달 첫 주 | DB·Storage 백업, 사용량 확인 |
| 학기 시작 | 예약 워크플로 확인, 새 구성원 일괄 등록(국장) |
| 방학 시작 | 예약 워크플로 확인 (긴 비활성 대비), 백업 |
| 학기마다 1회 | 백업 복구 연습 |
| 기수 전환 4주 전 | 2절 |
| 기수 전환 | 3절 |

> [!QUIZ]
> 2026 개발 담당 I가 졸업했습니다. I는 개인 노트북의 `.env.local`에 운영 Supabase Secret key를 넣어 쓴 적이 있습니다. 2027 개발 담당이 해야 할 일을 순서대로 말하세요.

> [!ANSWER]
> ① 공용 계정으로 Supabase에서 Secret key를 재발급하고 이전 키를 폐기 ② 새 키를 Vercel 환경변수에 넣고 재배포 ③ GitHub Organization에서 I를 제거 ④ 같은 기회에 Vercel·Supabase 액세스 토큰도 재발급해 Secrets 교체 ⑤ 앞으로는 운영 키를 개인 컴퓨터에 두지 않는 규칙(03-2)을 README에 다시 명시.

> [!QUIZ]
> "백업 파일이 Drive에 있으니 안전하다"는 말에 빠진 것은?

> [!ANSWER]
> 그 백업으로 **실제로 복구가 되는지** 확인한 적이 있어야 합니다. 역할(roles) 파일을 빼먹었거나, 확장 기능·Storage 파일이 빠져 있으면 복구가 실패할 수 있습니다. 학기마다 개발 프로젝트로 복구 연습을 해야 백업을 믿을 수 있습니다.

## 학습 경로

[← 07-2 Git 협업과 배포](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-02) · [07-4 다음 기수에게 남기는 문서 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-04)
