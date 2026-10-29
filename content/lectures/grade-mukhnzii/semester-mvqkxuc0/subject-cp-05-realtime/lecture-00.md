---
title: "07 · 인증·권한: 로그인·Role·RLS"
description: "Google 로그인부터 세션·승인 명단·Membership·Role·RLS까지 실제 플랫폼의 세 계층 검증을 따라가며 허용과 거부를 함께 테스트합니다."
order: 0
published: true
duration: 55
tags: [authentication, authorization, Google OAuth, Role, RLS, Supabase]
objectives:
  - 인증과 인가, 로그인 사용자와 학생회 구성원을 구분한다.
  - 실제 Google callback과 activate_membership 흐름을 설명한다.
  - 화면·서버·DB가 각각 확인하는 것을 구분한다.
  - 허용과 거부 사례를 가짜 계정·데이터로 검증한다.
---

## 1. 이 강의가 필요한 순간

로그인 뒤 어디로 가는지, 어떤 구성원만 화면을 볼 수 있는지, 버튼을 숨겼는데 왜 RLS도 필요한지 궁금할 때 읽습니다. [Supabase](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-04-database/lecture-00)를 먼저 읽고, 막힌 증거를 정리할 때 [디버깅](/lectures/grade-mukhnzii/semester-mvqkxuc0/subject-cp-06-features/lecture-00)을 봅니다.

> [!CONCEPT]
> **목표:** 로그인(인증)과 접근 허용(인가)을 구분하고, `requireMember`와 RLS가 왜 함께 필요한지 허용·거부 사례로 설명한다.

## 2. 실제 로그인·세션 흐름

인증은 “누구인가”, 인가는 “무엇을 해도 되는가”입니다. 플랫폼의 `GoogleLoginButton`은 Google OAuth를 시작하고, `src/app/auth/callback/route.ts`가 code를 세션으로 교환한 뒤 `activate_membership` RPC를 호출합니다. Auth Hook은 Google·이메일 인증·`@hanyang.ac.kr`·`hd`를 검사합니다. 승인 명단에 있으면 active Membership이 생기고, 없으면 **로그인한 일반 학생**으로 남습니다.

| 확인 위치 | 실제 책임 |
| --- | --- |
| 로그인 UI | 계정 선택을 시작하고 실패를 안내. `hd`는 힌트일 뿐 |
| Auth Hook·callback | 학교 계정 검증, 세션 교환, 승인 명단으로 Membership 활성화 |
| `requireUser` / `requireMember` | page와 Server Action의 로그인·Role gate |
| RLS | DB의 행 읽기·쓰기를 최종 제한 |

`session.ts`의 `requireUser(path)`는 미로그인 사용자를 `/login?next=...`로 보냅니다. `requireMember(path, roles?)`는 ACTIVE 기수의 active Membership과 Role을 확인해 없거나 불일치하면 `notFound()`를 호출합니다. 권한 없는 화면이 존재한다는 사실도 감추는 정책입니다.

```tsx
// 실제 helper의 사용 의도
const member = await requireMember("/dashboard", ["EXECUTIVE", "DIRECTOR"]);
// 이 뒤의 조회도 RLS가 사용자 JWT를 기준으로 다시 제한한다.
```

Role은 `EXECUTIVE`·`DIRECTOR`·`MEMBER`로 정해져 있습니다. `positions`의 직책 이름은 화면 표시용이며 권한 판정에 쓰지 않습니다. 기수·부서·자원 범위의 세부 정책은 기획서에서 확정된 것만 Issue에 옮기며, 제안 상태 항목은 리드에게 확인합니다.

## 3. 세 계층은 서로 대체하지 않는다

화면에서 버튼을 숨기는 것은 실수를 줄이는 UX입니다. URL을 직접 열거나 Server Action을 호출하면 우회할 수 있으므로 page·Action의 `requireUser`/`requireMember`가 필요합니다. 서버 gate도 DB client의 RLS를 대체하지 않습니다. RLS는 `auth.uid()`와 정책으로 실제 행을 제한합니다. 예를 들어 migration은 positions를 같은 기수 구성원에게만 읽히게 하고, profile은 본인 또는 같은 기수 구성원에게만 읽히게 합니다.

프런트엔드에는 publishable key만 둘 수 있습니다. secret/service_role은 어떤 오류 화면·로그·AI 프롬프트에도 넣지 않습니다. DB 정책을 잠시 끄거나 service role로 테스트를 통과시키는 것은 해결이 아닙니다.

## 4. 따라 하기: 허용 1개·거부 1개

1. local DB와 가짜 seed 계정으로 로그인합니다. 실제 학생 계정·이메일은 사용하지 않습니다.
2. 허용 사례: 로그인한 사용자가 `/me`에서 자기 profile과 active membership을 읽는지 확인합니다.
3. 거부 사례: Role이 맞지 않는 구성원 또는 일반 학생이 구성원 전용 URL을 직접 열어 not-found UI를 받는지 확인합니다.
4. 같은 사례가 화면, `requireMember`, RLS 중 어디에서 제한되는지 PR에 적습니다. DB 정책 변경은 팀원 실습 범위가 아닙니다.

권한 회수와 기수 전환은 현재 Issue와 기획서의 확정 정책을 따라야 합니다. 확정되지 않은 Role 이름이나 “모든 국장이 모든 부서 자료를 본다” 같은 규칙을 임의로 만들지 않습니다.

## 5. 직접 해보기와 흔한 실수

일반 학생과 active member의 `/me` 표시가 다름을 가짜 계정으로 캡처해 보세요. 완료 기준은 로그인 성공과 구성원 인가를 혼동하지 않고, 거부 사례에 기술 오류나 개인정보가 보이지 않으며, 직접 URL도 막히는 것입니다.

| 잘못된 예 | 문제 | 올바른 접근 |
| --- | --- | --- |
| 화면에서만 버튼 숨김 | 직접 URL/요청으로 우회 | page·Action gate + RLS |
| 직책 이름으로 권한 판단 | 표시 정보가 보안 규칙처럼 변함 | `memberships.role`과 확정 정책 |
| `hd` 힌트만 믿음 | 선택 화면 값은 강제가 아님 | Auth Hook의 서버 검증 |

## 6. AI 요청과 완료 체크

계획: “로그인·권한 Issue의 허용/거부 경로를 확인한다. `AGENTS.md`, `session.ts`, callback, 기획서의 확정 절만 참고해라. Auth Hook·RLS·migration·공용 auth 파일은 리드 범위이므로 수정하지 마라.”

구현: “page와 Action에서 실제 `requireUser`/`requireMember`를 사용하고, 준비된 RPC만 호출해라. 정책이 미정이면 확정 규칙처럼 쓰지 말고 질문으로 남겨라.”

리뷰: “로그인과 구성원 상태 혼동, Role/직책 혼동, URL 우회, RLS 우회, key·이메일·쿠키 노출을 검사해라.”

PR에는 허용·거부 계정 유형, 화면/서버/DB의 제한 위치, 확인하지 못한 대시보드 설정을 구분해 남깁니다. 공식 참고: [Supabase Auth](https://supabase.com/docs/guides/auth), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
