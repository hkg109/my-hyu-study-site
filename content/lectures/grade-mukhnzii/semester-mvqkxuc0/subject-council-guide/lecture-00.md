---
title: "0 · 학습 가이드 길잡이"
description: "정보시스템학과 학생회 운영 플랫폼(기획서 v0.7)을 처음 만드는 팀을 위한 통합 학습 가이드의 지도. 누가 어디부터 읽을지, 기획서 v0.7에서 꼭 기억할 결정, 이전 입문 PDF(v0.6)와 달라진 점을 정리합니다."
order: 0
published: true
duration: 20
tags: [학생회 플랫폼, 기획서 v0.7, 학습 지도, 길잡이]
objectives:
  - 가이드 1~9편이 기획·배경지식·실습 중 무엇을 다루는지 말한다.
  - 내 역할(화면·데이터·기획·품질)에 맞는 읽기 순서를 정한다.
  - 기획서 v0.7의 핵심 결정 일곱 가지와 v0.6에서 바뀐 규칙을 구분한다.
---

## 이 가이드는 무엇인가

[1편 · 서비스 전체 그림 →](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-01)

이 가이드는 **무엇을 만들지(기획)**, **왜 그런 기술이 필요한지(배경지식)**, **처음 배우는 팀이 어떤 순서로 연습할지**(학습·협업)를 한 흐름으로 잇는다. 대상은 코딩 경험이 거의 없는 학생회 프로젝트 팀이다.

> [!CAUTION]
> 기능의 정확한 권한과 완료 조건은 **학생회 운영 플랫폼 기획서 v0.7**이 기준이다. 이전 *개발 입문 학습가이드 PDF*는 v0.6을 바탕으로 썼으므로, 자료끼리 설명이 다르면 기획서 v0.7을 따른다. 라이브러리 API·요금제·BlockNote에서 쓸 수 있는 Block 종류는 구현 시점의 공식 문서와 Phase 0 기술 검증에서 다시 확인한다.

이 가이드는 구현 코드의 완성본이 아니다. 작은 기능을 **설계 → 구현 → 검증**할 수 있도록 돕는 학습 지도이자 실습 교재다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 자주 헷갈리는 구분·함정 · ==blue:파랑== 순서·목록

## 전체 지도

[![서비스 이해, 개발 기초, 기능 적용, 완성 경로의 네 부분 아래에 1편부터 9편까지의 강의를 위에서 아래로 놓은 학습 지도. 1편이 시작점으로 강조되어 있다.](/materials/diagrams/cpg-00-course-map.svg)](/materials/diagrams/cpg-00-course-map.svg)

*그림 0-1 · 학습 가이드 전체 지도 — 누르면 원본 크기로 열린다.*

| 편 | 다루는 내용 | 원래 가이드의 절 |
| --- | --- | --- |
| [1편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-01) | 사용자와 경계, 요청 흐름, 기획서 문장을 작업으로 바꾸기 | 1–3 |
| [2편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-02) | Git·GitHub, HTML·CSS·JS·TS, React·Next.js | 4–6 |
| [3편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-03) | 데이터베이스·SQL·마이그레이션, OAuth 로그인과 승인 명단 | 7–8 |
| [4편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-04) | Role·Permission·ACL·RLS, 파일·날짜·개인정보 | 9–10 |
| [5편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-05) | WebSocket·CRDT·Yjs·BlockNote, 테스트·배포·운영 | 11–12 |
| [6편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-06) | 조직·계정·Dashboard, Task, Event와 하위 자료 | 13–15 |
| [7편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-07) | 회의록 공동편집, 건의 익명성, Term 전환 | 16–18 |
| [8편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-08) | 작은 실습 서비스, 역할·협업, AI 도구, 작업 양식, 배포 점검 | 19–23 |
| [9편](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-council-guide/lecture-09) | 용어 사전과 공식 학습 자료 | 부록 A·D |

## 누가 어디부터 읽나

| 독자 | 먼저 읽을 편 | 다음에 깊게 볼 편 |
| --- | --- | --- |
| 팀 전원 | 1편, 2편의 Git, 3편의 테이블 관계 | 8편의 실습 경로와 점검표 |
| 화면 담당 | 2편 (HTML·CSS·TypeScript·React·Next.js) | 6편의 화면 상태, 5편의 접근성 |
| 데이터·권한 담당 | 3편, 4편 | 7편의 기수 전환, 4편의 파일 권한, 5편의 공동편집 저장 |
| 기획·품질 담당 | 1편의 기능 분해와 완료 기준 | 8편의 허용·거부 테스트, Issue·PR 양식 |

각 편은 **쉬운 설명 → 학생회 플랫폼 사례 → 직접 해보기 → 확인 문제** 순서다. 한 번에 전부 외우지 말고, 기능 하나를 만들 때마다 관련 편을 다시 펼친다.

## 기획서 v0.7에서 꼭 기억할 결정

> [!EXAM]
> 1. 학생회 계정은 ==학교 Google 계정 검증 + 사전 승인 목록==을 함께 쓴다. 학교 계정이라는 이유만으로 내부 권한이 생기지 않는다. → 3편
> 2. ==red:Role ≠ Position.== Role(MEMBER·DIRECTOR·EXECUTIVE)은 고정 보안 등급, Position(회장·국장)은 화면에 보이는 직책이다. → 4편
> 3. ==Event의 열람 범위는 하위 자료의 상한==이다. Task와 Meeting은 그 안에서 더 좁게만 공개할 수 있다. → 4·6편
> 4. 회의록은 BlockNote + Yjs로 공동 편집하고, ==blue:DB 함수가 저장을 확인한 뒤 Realtime으로 알린다==. → 5·7편
> 5. 건의 작성자 정보는 **별도 테이블**에 두고 처리자에게 전달하지 않는다. → 4·7편
> 6. 새 기수에는 과거 기록을 자동 복사하지 않는다. 이전 기수 열람은 **기간과 범위가 있는 Archive Grant**로만 허용한다. → 7편
> 7. 개발 전에 실시간 권한 회수 시간, 파일 한도, 보존 기간, 요금제, 건의 이월 정책 같은 **운영값**을 정해야 한다. → 8편

## v0.6 입문 PDF에서 바뀐 설명

이전 개발 입문 PDF를 함께 읽는다면 다음은 **v0.7의 결정**으로 바꿔 이해한다.

| 주제 | v0.7에서 읽어야 할 내용 |
| --- | --- |
| Task 생성·수정 | ==red:MEMBER는 Task를 직접 만들지 않는다.== DIRECTOR는 자기 국 또는 자신이 관리하는 Event, EXECUTIVE는 같은 Term 전체에서 만든다. 필드별 수정 권한은 기획서 4.6절(→ 6편 표). |
| 학교 계정 차단 | 화면 안내가 아니라 **Before User Created Auth Hook**에서 비학교 계정 생성을 거부하고, Profile/Membership 경로에서 다시 검사한다. |
| Event 밖 지정 | Event를 볼 수 없는 사용자는 하위 Task 담당자·관리자, 회의록 작성자·편집자, ACL 대상으로 지정할 수 없다. |
| Event 범위 축소 | 충돌하는 하위 지정 목록과 해결 방법 선택을 요구하고, 한 트랜잭션으로 적용한다. |
| 공동편집 전송 | 클라이언트가 Update를 묶어 DB RPC에 저장하고 **DB가 Broadcast**한다. 클라이언트의 임의 CRDT Broadcast는 금지한다. |
| 회의록 Template·상태 | 서버가 초기 Snapshot에 Template을 한 번만 넣고, DRAFT/CONFIRMED/ARCHIVED 상태에 따라 편집을 막는다. |
| Term 종료 | 이전 Membership을 종료하고 Archive Grant로만 과거 자료를 읽는다. 미처리 건의는 정한 이월/마감 정책을 따른다. |

## 기획서 절과 이 가이드의 연결

| 기획서 v0.7 | 먼저 볼 편 | 다음 작업 |
| --- | --- | --- |
| 0 서비스 목표·운영값 | 1, 8편 | 확정하지 않은 운영값을 Issue로 기록 |
| 1 조직·Role·ACL | 3, 4, 6편 | Membership과 권한 표 작성 |
| 2 로그인 | 3, 6편 | Auth Hook·승인 목록 PoC |
| 3 Dashboard | 2, 6편 | 권한 있는 목록의 로딩·빈 상태 화면 |
| 4 Task | 1, 3, 4, 6편 | Task 작업 카드와 허용·거부 테스트 |
| 5 Event | 4, 6편 | 상속·범위 축소·Storage 테스트 |
| 6 Meeting | 5, 7편 | 단일 저장 후 CRDT PoC |
| 7 Suggestion | 4, 7편 | 작성자 신원 분리 검증 |
| 8 Term | 3, 7편 | 전환 트랜잭션과 Grant 정책 |
| 9–10 DB·RLS | 3, 4, 5편 | ERD·마이그레이션·DB 테스트 |
| 11–12 아키텍처·품질 | 1, 2, 5편 | Preview·접근성·백업 점검 |
| 13–14 개발 순서·완료 기준 | 8편 | 단계별 증거와 배포 점검표 |

## 첫 학습 행동

1. 팀원 전원이 1편과 2편의 Git 부분을 읽고 연습 Pull Request를 하나씩 만든다.
2. 함께 “업무 저장”의 **화면·데이터·권한·테스트** 네 칸을 채운다(1편).
3. 이 한 장을 기준으로 첫 구현 Issue를 나눈다.
