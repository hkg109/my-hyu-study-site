---
title: "07-1 · 계정과 서비스 소유권"
description: "기획서에 없는 운영 결정을 정리합니다. 학생회 공용 Google 계정이 GitHub Organization·Vercel·Supabase를 소유하는 구조, 공개 저장소·Vercel Hobby·Supabase Free를 쓸 때 지켜야 할 규칙과 한도, 1주일 비활성 일시 중지와 백업을 어떻게 다룰지, 처음 한 번 하는 설정 순서를 확정안으로 기록합니다."
order: 1
published: true
duration: 45
tags: [운영, 계정 구조, GitHub Organization, Vercel Hobby, Supabase Free, 공개 저장소, 백업]
objectives:
  - 서비스의 주인이 개인이 아니라 학생회 공용 계정이어야 하는 이유를 말한다.
  - GitHub Organization의 소유자·멤버 구성을 정한다.
  - 공개 저장소·Vercel Hobby·Supabase Free 각각의 제약과 대응을 말한다.
  - 처음 한 번 하는 설정 순서를 말한다.
---

## 1. 결정 요약

[![학생회 공용 Google 계정이 GitHub Organization, Vercel Hobby, Supabase Free의 소유자가 되고, GitHub에는 소유자 두 명 이상과 Member 개발자, 배포 토큰은 GitHub Secrets에, DB 키는 Vercel 환경변수에 넣는 구조](/materials/diagrams/cpg-19-accounts.svg)](/materials/diagrams/cpg-19-accounts.svg)

*그림 07-1 · 서비스의 주인은 학생회 계정 — 누르면 원본 크기로 열린다.*

| 항목 | 확정 |
| --- | --- |
| 주인 | **학생회 공용 Google 계정** 하나 (예: 학생회 이름의 Gmail). 2단계 인증 필수 |
| 코드 | GitHub **Organization**(무료) 안의 **공개 저장소** |
| 배포 | **Vercel Hobby**(무료). 배포는 GitHub Actions가 공용 계정 토큰으로 |
| DB·로그인·파일 | **Supabase Free**. 운영용 1개 + 개발용 1개 |
| 비밀 값 | Vercel 환경변수, GitHub Secrets. 저장소에는 절대 없음 |
| 백업 | 직접 내려받아 학생회 공용 Google Drive에 |

> [!EXAM]
> **왜 공용 계정이 주인인가?** 개인 계정이 GitHub 저장소·Vercel·Supabase의 주인이면, 그 사람이 졸업하거나 연락이 끊기는 순간 다음 기수는 서비스를 고칠 수도, 옮길 수도, 결제를 바꿀 수도 없습니다. 주인 계정은 **기수와 함께 넘겨지는 물건**이어야 합니다.

## 2. GitHub Organization

| 역할 | 누구 | 권한 |
| --- | --- | --- |
| Owner | 학생회 공용 계정 + 현 기수 개발 담당 1명 (최소 2명) | 저장소·멤버·설정 전부 |
| Member | 현 기수 개발자 | 저장소 Write (브랜치·PR), main 직접 push 불가 (07-2) |
| Outside collaborator | 쓰지 않음 | — |

- Organization 설정에서 **2단계 인증 필수**를 켭니다.
- Owner가 한 명뿐이면 그 계정을 잃는 순간 조직 전체가 잠깁니다. 공용 계정 + 사람 1명 이상을 항상 유지합니다.
- 기수가 바뀌면 졸업한 개발자를 Member에서 빼고, 새 개발자를 초대합니다(07-3 점검표).

## 3. 공개 저장소의 규칙

공개 저장소는 누구나 코드와 **모든 커밋 기록**, Issue, PR, Actions 로그를 볼 수 있습니다.

| 하지 않는 것 | 대신 |
| --- | --- |
| 비밀 키·토큰·DB 비밀번호 커밋 | Vercel 환경변수, GitHub Secrets (03-2) |
| 실제 학생 이메일·이름·학번으로 Seed·테스트 | `test-xxx@hanyang.ac.kr` 같은 가짜 값 (04-3, 04-5) |
| Issue·PR에 운영 화면 캡처, 회의록·건의 내용 | 개발 프로젝트의 가짜 데이터 화면 |
| DB 백업을 저장소·Release·Actions 산출물에 | 학생회 공용 Drive (비공개) |
| Actions 로그에 비밀 값 출력 (`echo $TOKEN`) | Secrets는 로그에서 가려지지만 가공한 값은 안 가려짐 → 출력 금지 |

> [!CAUTION]
> 공개 저장소에 비밀을 커밋하면 **지워도 늦습니다.** 커밋 기록과 복제본에 남습니다. 즉시 그 키를 폐기·재발급하고 환경변수를 교체합니다(03-2편, 07-3편).

보안을 "코드를 숨기는 것"에 기대지 않는다는 점에서 공개 저장소는 기획서 원칙과 잘 맞습니다. 보안은 RLS와 DB 함수에 있고, 코드를 알아도 권한 없는 데이터는 읽을 수 없어야 합니다.

## 4. Vercel Hobby의 제약과 대응

| 제약 (공식 문서 기준) | 영향 | 대응 |
| --- | --- | --- |
| 개인·비상업 용도 | 학생회 운영이 정확히 맞는지는 회색지대 | 기록해 두고, 문제가 되면 Pro로 이전 |
| 팀 협업 기능 없음, 계정 주인의 배포만 보장 | 후배가 올린 커밋이 자동 배포되지 않을 수 있음 | Vercel의 Git 자동 배포를 쓰지 않고, **GitHub Actions가 공용 계정 토큰으로 배포** (07-2) |
| 함수 실행 시간·횟수, 전송량 한도 | 학생회 규모에서는 대체로 충분 | 대시보드의 사용량을 기수 교대 때 확인 |
| Cron 작업 빈도 제한 | 자주 도는 정기 작업 불가 | 정기 작업은 GitHub Actions `schedule`로 |

## 5. Supabase Free의 제약과 대응

| 제약 | 영향 | 대응 |
| --- | --- | --- |
| 계정당 무료 프로젝트 2개 | 운영·개발 외 실험용 프로젝트 불가 | 실험은 개발 프로젝트나 로컬(`supabase start`)에서 |
| **1주일 동안 요청이 없으면 일시 중지** | 방학에 접속이 없으면 서비스가 멈춤 | ① GitHub Actions가 매일 `/api/health`(03-1) 호출 ② 멈췄다면 공용 계정으로 대시보드에서 복구 (07-3 절차) |
| 일시 중지 후 오래 방치하면 복구 불가 | 데이터 영구 손실 위험 | 멈춘 것을 알게 되면 바로 복구. 정기 백업 |
| 자동 백업을 기대할 수 없음 | 사고 시 되돌릴 시점 없음 | **매달 + 기수 전환 직전** 직접 백업 (07-3) |
| Realtime 동시 접속·메시지 한도 | 회의록 동시 편집 인원 제한 | 묶음 간격(300ms)으로 메시지 절약, Phase 0에서 측정 |
| DB·Storage 용량 한도 | 큰 파일 누적 | 업로드 크기 제한(운영값), 오래된 CRDT Update 정리(05-3) |

> [!CAUTION]
> GitHub는 **공개 저장소에서 60일 동안 활동이 없으면 예약(schedule) 워크플로를 자동으로 끕니다.** 방학이 길면 health 호출도 멈출 수 있습니다. 07-3 점검표에 "학기 시작·방학 시작 때 Actions의 예약 작업이 켜져 있는지 확인"을 넣습니다.

정확한 한도 숫자는 요금제 정책에 따라 바뀌므로, 숫자를 문서에 박지 않고 **기수 교대 때 공식 가격 페이지를 다시 확인**합니다.

## 6. 처음 한 번 하는 설정 순서

1. **공용 Google 계정** 만들기 → 2단계 인증, 복구 이메일·전화는 학생회 공용 수단으로.
2. 그 계정으로 **GitHub** 가입 → Organization 생성 → 2단계 인증 필수 설정 → 개발 담당을 Owner로 초대.
3. Organization에 **공개 저장소** 생성 → 브랜치 보호 규칙(07-2) → `.gitignore`, `.env.example`, `README.md`.
4. 같은 계정으로 **Supabase** 가입 → `council-prod`, `council-dev` 프로젝트 생성 → Google 로그인·Auth Hook 설정(03-3) → Realtime 공개 채널 허용 끄기(05-3).
5. 같은 계정으로 **Vercel** 가입(Hobby) → 프로젝트 생성 → 환경변수 입력 → Git 자동 배포는 끄고 토큰 발급.
6. GitHub 저장소 Secrets에 `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_REF`, `CRON_SECRET` 저장.
7. 운영 프로젝트에 첫 회장단을 **비상 절차 스크립트**로 한 번 등록(06-5 8절) → 이후로는 화면으로 이양.
8. 이 순서와 각 설정 위치를 `docs/setup.md`에 적습니다(비밀 값은 적지 않음).

## 7. 공용 계정 관리

| 항목 | 규칙 |
| --- | --- |
| 비밀번호·2단계 인증 복구 코드 | 회장단 **인수인계 항목**. 회장과 개발 담당 2명만 앎 |
| 기수 교대 | 비밀번호 변경, 복구 코드 재발급, 로그인 기기 정리 |
| 개인 용도 사용 | 금지 (이 계정으로 다른 서비스 가입하지 않음) |
| 접근 기록 | Google 계정의 보안 활동을 기수 교대 때 확인 |

> [!QUIZ]
> 2026 기수 개발 담당 H가 자기 개인 GitHub 계정에 저장소를 만들고 Vercel·Supabase도 개인 계정으로 연결했습니다. H가 졸업한 뒤 2028 기수가 겪을 문제 세 가지는?

> [!ANSWER]
> ① 저장소 설정·브랜치 보호·Secrets를 바꿀 수 없고 H가 저장소를 지우면 코드가 사라짐 ② Vercel 배포 설정·도메인·환경변수를 바꿀 수 없어 키가 새어도 교체 불가 ③ Supabase 대시보드에 들어갈 수 없어 일시 중지 복구·백업·Auth 설정 변경이 불가. 그래서 처음부터 공용 계정이 주인이어야 합니다.

> [!QUIZ]
> 여름방학 6주 동안 아무도 접속하지 않았습니다. 서비스가 멈추지 않으려면 무엇이 동작하고 있어야 하나요?

> [!ANSWER]
> GitHub Actions의 예약 워크플로가 매일 `/api/health`를 불러 Supabase에 요청이 생기게 해야 합니다. 그리고 그 예약 워크플로 자체가 60일 비활성으로 꺼지지 않았는지 방학 전에 확인해야 합니다. 그래도 멈췄다면 공용 계정으로 대시보드에서 바로 복구합니다.

## 학습 경로

[← 06-6 새 기수 세팅 화면과 기수 전환](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-06) · [07-2 Git 협업과 배포 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-07-operations/lecture-02)
