---
title: "중간고사 족보 지도와 시험 직전 정리"
description: "중간 족보·Sample Questions·교재 연습문제를 유형별로 묶어 해당 강의로 연결하고, 시험 직전에 볼 공식과 함정을 한 장에 정리합니다."
order: 0
published: true
tags:
  - 족보
  - 중간고사
  - 시험 직전
---

# 중간고사 족보 지도와 시험 직전 정리

전산학개론(CSE102, Invitation to Computer Science) 중간고사 범위는 **1장 ~ 6장 어셈블러**(수업 Lecture 0~7)입니다. 이 페이지는 족보 문제를 **유형별로** 묶어 어느 강의에서 공부하면 되는지 보여 주고, 시험장 들어가기 전에 볼 핵심만 모았습니다.

| 강의 | 교재 | 핵심 |
| --- | --- | --- |
| [01 컴퓨터 과학과 알고리즘](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-01) | Ch1 | 알고리즘 정의, 덧셈·유클리드 추적, GCD·LCM, 역사 |
| [02 의사코드와 알고리즘 설계](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-02) | Ch2 | 의사코드, 순차 탐색, Find Largest, 패턴 매칭, 반례 찾기 |
| [03 알고리즘의 효율](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-03) | Ch3 | Θ, 선택 정렬, 데이터 정리 3종, 이진 탐색, intractable |
| [04 이진수·불 논리·회로](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-04) | Ch4 | 진법, 2의 보수, 표현, 진리표, sum-of-products |
| [05 폰 노이만 구조](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-05) | Ch5 | MAR·MDR·PC·IR, fetch-decode-execute, RISC/CISC, RiSC-16 |
| [06 Python과 과제 풀이](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-06) | Lec 6 | 의사코드 → Python, 함수, OOP, 과제 0.1·0.2 |
| [07 시스템 소프트웨어와 어셈블리어](/lectures/grade-01/semester-01/subject-muhy8vqy/lecture-07) | Ch6 | 명령어 집합, 번역, 최댓값·최솟값, 2-pass 어셈블러 |

> [!EXAM]
> 시험 답안은 **영어**로 쓰라는 공지가 있었습니다. 정의형 문제는 교재 문장(예: *"a well-ordered collection of unambiguous and effectively computable operations…"*)을 그대로 쓸 수 있도록 각 강의의 **정리 카드**를 영어 키워드 위주로 외우세요.

---

## 1. 족보 유형 지도

### 중간 족보 (복원) → 강의

[중간고사 족보 풀기](/practice/grade-01/semester-01/subject-muhy8vqy/exam-01)

| 족보 문제 | 유형 | 공부할 곳 |
| --- | --- | --- |
| 1 | T/F: shuffle-left 최악 Θ(n²) | 03 · 4-1 |
| 2 | 빈칸: 지수 알고리즘 O(2ⁿ) | 03 · 7 |
| 3 | GCD 없이 LCM 의사코드 | 01 · 4 |
| 4 | 유클리드 GCD로 LCM | 01 · 4 |
| 5 | 세 수의 LCM | 01 · 4 |
| 6 | 최소공통분모(LCD) | 01 · 4 |
| 7 | 코드가 항상 옳은가(패턴 매칭 버그) | 02 · 6 |
| 8 | shuffle-left·converging-pointers 추적 | 03 · 4 |
| 9 | 진리표 + sum-of-products (even parity) | 04 · 10 |
| 10 | lg n, n lg n, n² 표 | 03 · 7 |
| 11 | RISC vs CISC 서술 | 05 · 6 |
| 12 | 두 수 중 큰 값 어셈블리 | 07 · 5 |

### Sample Questions (2026 중간) → 강의

| Sample | 유형 | 공부할 곳 |
| --- | --- | --- |
| Q1 | shuffle-left 결과 + 정확한 복사 횟수 [3 0 0 2 6 7 0 0 5 1] | 03 · 4-1 (답 3 2 6 7 5 1, 26번) |
| Q2 | 진리표 → sum-of-products 식 + 회로 | 04 · 10 |
| Q3 | Add 3 to K 어셈블리 | 07 · 4 |
| Q4 | 100개 최댓값·최솟값 어셈블리 | 07 · 5 |
| Q5 | x, y, z 최댓값 알고리즘의 정확성 | 02 · 5 (동점 반례) |
| Q6 | 8개 이름 이진 탐색 트리, 최악 횟수 | 03 · 5 (4번, Tracy) |
| Q7 | 342명 토너먼트 경기 수 | 03 · 8 (341) |
| Q8 | T/F 순차 탐색 평균 n/2 | 03 · 2 (True) |
| Q9 | T/F Θ(n²) vs Θ(n) | 03 · 3 (True) |
| Q10 | Python while 출력 | 06 · 5 |

### 유형별 출제 비중으로 본 우선순위

```text
① 추적·계산 (가장 많음)    데이터 정리 복사 횟수 · 이진 탐색 트리 · 진법/2의 보수 · 코드 출력
② 작성                     의사코드(GCD/LCM/탐색) · sum-of-products 회로 · 어셈블리 프로그램
③ 판정·서술                알고리즘/코드 정확성(반례) · RISC vs CISC · T/F
④ 정의                     algorithm · computer science · Von Neumann · system software
```

---

## 2. 시험 직전 공식 모음

> [!BOARD]
> **알고리즘 (1~2장)**
> - Algorithm = well-ordered · unambiguous · effectively computable · produces a result · halts
> - GCD(a, b) = GCD(b, a mod b), 나머지 0일 때의 나누는 수
> - LCM = a × b / GCD, 세 수는 LCM(LCM(a, b), c)
> - pretest loop: 0번 가능 / posttest loop: 최소 1번

> [!BOARD]
> **효율 (3장)**
> - lg n < n < n lg n < n² < 2ⁿ
> - 순차 탐색: best 1, worst n, avg ≈ n/2 → Θ(n)
> - 이진 탐색: 정렬 필수, worst ⌊lg n⌋ + 1 → Θ(lg n)
> - 선택 정렬: 비교 n(n−1)/2, 항상 Θ(n²), 교환 n
> - Shuffle-left: worst(모두 0) n(n−1) 복사, Θ(n²), 공간 n
> - Copy-over: Θ(n), 공간 worst 2n (0이 없을 때)
> - Converging-pointers: Θ(n), 공간 n, **순서 바뀜**, 끝나고 마지막 칸 검사
> - 패턴 매칭: best Θ(n), worst Θ(m × n)
> - 토너먼트 경기 수 = 참가자 − 1

> [!BOARD]
> **표현과 회로 (4장)**
> - 2의 보수 음수 = 비트 뒤집기 + 1, 범위 −2ᵏ⁻¹ ~ 2ᵏ⁻¹ − 1, 0은 하나
> - 부호-크기 범위 ±(2ᵏ⁻¹ − 1), 0이 두 개
> - 소리 = 초 × sampling rate × bit depth, RGB 이미지 = 가로 × 세로 × 24
> - SOP: 출력 1인 행 → (0이면 NOT) AND → 전체 OR
> - mux: 2ᴺ 입력 + N 선택선 → 1, decoder: N → 2ᴺ
> - transistor: NOT 1, AND 3, OR 3, NAND/NOR 2

> [!BOARD]
> **구조와 어셈블리 (5~6장)**
> - Von Neumann = 4 subsystems + stored program + sequential execution
> - MAR N비트 → 2ᴺ칸 / PC = 다음 명령 주소 / IR = 현재 명령
> - fetch: PC → MAR, FETCH, MDR → IR, PC + 1 → PC
> - RISC 30~50개 단순 명령, CISC 300~500개
> - COMPARE X: CON(X)와 R 비교 (CON(X) > R → GT)
> - .DATA는 HALT 뒤, 상수도 .DATA로
> - assembler pass 1 = symbol table, pass 2 = 번역

---

## 3. 자주 틀리는 함정 10개

> [!TRAP]
> 1. **Shuffle-left 복사는 n까지**: 0을 당길 때 legit이 아니라 리스트 끝(n)까지 복사합니다. [3 0 0 2 6 7 0 0 5 1]은 26번.
> 2. **Converging-pointers의 마지막 검사**: 루프가 끝난 칸이 0이면 legit을 한 번 더 줄입니다.
> 3. **Copy-over의 best/worst는 shuffle-left와 반대**: 모두 0이면 copy-over에겐 최선입니다.
> 4. **이진 탐색 가운데는 버림**: ⌊(beginning + end)/2⌋. 8개면 첫 비교는 4번째.
> 5. **"approximately n/2"는 True**, 정확한 평균은 (n + 1)/2.
> 6. **세 수의 LCM ≠ abc / GCD(a, b, c)**.
> 7. **2의 보수 −5 = 1011**(4비트), 1101은 부호-크기.
> 8. **COMPARE 방향**: `LOAD A; COMPARE B; JUMPGT` 는 B > A일 때 점프.
> 9. **ADD 3은 3번지의 내용을 더함**: 상수는 `THREE: .DATA 3`.
> 10. **예시 테스트를 통과해도 틀릴 수 있다**: 동점(x = y), 부분 일치 후 불일치(AABB/AB), 큰 K(알람 75분 전)처럼 경계값으로 반례를 찾으세요.

---

## 4. 교재 연습문제 중 시험형 문제 모음

족보와 같은 유형의 교재 연습문제(EXERCISES)는 각 강의 본문에 풀이를 넣었습니다.

| 교재 | 연습문제 | 강의 위치 |
| --- | --- | --- |
| Ch1 | 3 덧셈 추적, 4 앞자리 0 제거, 5 근의 공식, 6 샴푸, 7 유클리드(0 입력), 8 25도시, 9 반복 덧셈 곱셈, 13 CD 책장 | 01 |
| Ch2 | 13 중복 이름 탐색, 15–17 Find Largest 변형, 18–19 패턴 매칭, 20 소수, 22 뒤집기 | 02 |
| Ch3 | 1 가우스 합, 3 토너먼트, 5–7 탐색·선택 정렬, 11·27·28 차수 비교, 12 n×n 표, 13–16 데이터 정리, 17·18·21·24·25 이진 탐색, 31·32 차수 분석 | 03 |
| Ch4 | 1–11 진법·표현·크기, 12 RLE, 15–16 불 식, 17–20 회로, 22 multiplexor | 04 |
| Ch5 | 1 셀 크기, 2·3·5·6 메모리 크기, 8·14 I/O 속도, 15 명령 형식, 18 실행 단계, Challenge 1 병렬 합 (9 ALU 선택선은 04 · 12, 17 상수 19는 07 · 4) | 05 |
| Ch6 | 4·5 명령 효과, 6·7 기계어 해석, 8 label, 9 번역, 10 LOAD vs INCREMENT, 11·12 Figure 6.8, 13 최댓값·최솟값, 14 op code 탐색, 15–17 symbol table | 07 |

> [!NOTE]
> 모든 계산 답(복사 횟수, 이진 탐색 비교 순서, 토너먼트, 2진 변환, 2의 보수 등)은 스크립트로 다시 계산해 확인했고, 어셈블리 답안은 Figure 6.5 명령어 집합 시뮬레이터로 실행해 결과를 확인했습니다.
