---
title: "1장 컴퓨터 과학과 알고리즘"
description: "컴퓨터 과학의 정의, 알고리즘의 조건, 덧셈·유클리드 알고리즘 추적, 컴퓨팅의 역사를 족보 유형과 함께 정리합니다."
order: 1
published: true
tags:
  - 알고리즘
  - 유클리드
  - 컴퓨팅 역사
objectives:
  - 알고리즘의 정의를 이루는 네 가지 조건을 말하고, 주어진 절차가 알고리즘인지 판정할 수 있다.
  - m자리 덧셈 알고리즘과 유클리드 알고리즘을 표로 추적할 수 있다.
  - GCD를 이용해 LCM·최소공통분모 알고리즘을 의사코드로 쓸 수 있다.
---

# 1장 컴퓨터 과학과 알고리즘

## 학습 흐름

```text
"컴퓨터 과학 = 컴퓨터 공부"라는 오해 → 정의: 알고리즘에 대한 학문
        ↓
알고리즘의 4가지 조건 (well-ordered · unambiguous · effectively computable · halts)
        ↓
덧셈 알고리즘(Figure 1.2) 추적 → 유클리드 GCD → LCM·LCD (족보 단골)
        ↓
컴퓨팅의 역사: 기계식 계산기 → 전자식 → 1~5세대
```

> [!EXAM]
> 이 장에서 족보에 나온 유형은 **① GCD·LCM 의사코드 작성**(중간 족보 문제 3~6)과 **② 알고리즘 조건 판정**입니다. 역사 문항은 "누가 무엇을 만들었나"를 짝짓는 정도로만 준비하세요. 교수님은 시험 답안을 **영어**로 쓰라고 했으므로 핵심 용어는 영어 그대로 외워 두세요.

---

## 1. 컴퓨터 과학이란?

### 흔한 오해 세 가지

| 오해 | 왜 틀렸나 |
| --- | --- |
| The study of **computers** | 컴퓨터는 도구일 뿐. 천문학이 망원경 학문이 아닌 것과 같다 |
| The study of how to write **programs** | 프로그래밍은 알고리즘을 표현하는 한 방법 |
| The study of the **uses and applications** of computers and software | 응용은 결과물이지 학문의 중심이 아니다 |

> [!CONCEPT]
> **Computer science is the study of algorithms**, including
> 1. their **formal and mathematical properties** (정확성·효율 분석)
> 2. their **hardware realizations** (회로·컴퓨터 구조)
> 3. their **linguistic realizations** (프로그래밍 언어)
> 4. their **applications** (응용)

이 네 항목이 그대로 이 과목의 목차입니다. 2~3장은 1번(수학적 성질), 4~5장은 2번(하드웨어), 6~7장은 3번(언어)입니다.

> [!NOTE]
> 왜 알고리즘이 그렇게 중요할까요? **알고리즘을 명시할 수 있으면 그 문제의 해결을 자동화할 수 있기 때문**입니다(If we can specify an algorithm to solve a problem, then we can automate its solution). 알고리즘을 실제로 수행하는 주체를 **computing agent**라고 하며, 기계·로봇·사람 모두 될 수 있습니다.

---

## 2. 알고리즘의 정의와 세 가지 연산

> [!DEFINITION]
> **Algorithm** — A **well-ordered** collection of **unambiguous** and **effectively computable** operations that, when executed, **produces a result** and **halts in a finite amount of time**.

| 조건 | 뜻 | 위반 예 |
| --- | --- | --- |
| Well-ordered | 다음에 무엇을 할지 순서가 분명 | "아무 단계나 먼저 하세요" |
| Unambiguous | computing agent가 추가 설명 없이 이해 (= **primitive operation**) | "Go back and do it again"(무엇을?), "Start over"(어디서부터?) |
| Effectively computable | 이해할 뿐 아니라 **실제로 수행 가능** | "가장 큰 소수를 출력하라", 0으로 나누기, 음수의 실수 제곱근 |
| Produces a result & halts | 유한 번의 연산 후 결과를 내고 끝남 | **infinite loop** (무한 반복) |

알고리즘은 세 종류의 연산만으로 만들어집니다.

| 연산 | 영어 | 예 |
| --- | --- | --- |
| 순차 | Sequential | Set the value of carry to 0 |
| 조건 | Conditional | If cᵢ ≥ 10 then … |
| 반복 | Iterative | While i ≤ m − 1, repeat steps 4–6 |

> [!TRAP]
> - "이해할 수 있다(unambiguous)"와 "실행할 수 있다(effectively computable)"는 **다른 조건**입니다. "모든 정수의 합을 구하라"는 뜻은 분명하지만 끝나지 않으므로 수행 불가입니다.
> - 무한 루프가 있는 절차는 아무리 정확해도 **알고리즘이 아닙니다**(halts 조건 위반).

### 샴푸 알고리즘 두 개 (Figure 1.3)

```text
(a) 반복 버전                              (b) 나열 버전
1 Wet your hair                            1 Wet your hair
2 Set WashCount to 0                       2 Lather   3 Rinse
3 Repeat 4–6 until WashCount = 2           4 Lather   5 Rinse
4   Lather   5 Rinse                       6 Stop
6   Add 1 to WashCount
7 Stop
```

> [!QUIZ]
> 위 두 샴푸 알고리즘 중 일반적인 해법으로 더 좋은 것은 무엇이고, 왜 그런가? (머리를 1,000번 감아야 한다면?)

> [!ANSWER]
> **(a) 반복 버전**이 더 좋다. 감는 횟수가 바뀌어도 숫자 `2`만 `1000`으로 고치면 되지만, (b)는 Lather/Rinse를 2,000줄 써야 한다. 반복(iteration)은 알고리즘의 길이를 입력 크기와 무관하게 유지해 준다.

> [!QUIZ]
> 근의 공식 x = (−b ± √(b² − 4ac)) / 2a 가 실수 범위에서 **effectively computable하지 않은** 경우 두 가지를 쓰시오.

> [!ANSWER]
> 1. **a = 0** → 0으로 나누기
> 2. **b² − 4ac < 0** → 음수의 실수 제곱근이 존재하지 않음
>
> 두 경우 모두 "뜻은 분명하지만 수행할 수 없는" 연산이다.

---

## 3. m자리 덧셈 알고리즘 (Figure 1.2)

두 m자리 수 a(m−1)…a₀ 와 b(m−1)…b₀ 를 더해 c(m)…c₀ 를 구합니다. 인덱스 0이 **가장 오른쪽(일의 자리)** 입니다.

```text
Step 1  Set carry to 0
Step 2  Set i to 0
Step 3  While i ≤ m − 1, repeat steps 4–6
Step 4      cᵢ ← aᵢ + bᵢ + carry
Step 5      If cᵢ ≥ 10 then cᵢ ← cᵢ − 10, carry ← 1
            Otherwise carry ← 0
Step 6      i ← i + 1
Step 7  Set cₘ to carry
Step 8  Print cₘ cₘ₋₁ … c₀
Step 9  Stop
```

수업에서 배포한 Python 코드(`cse102-lec-01-add-2026.py`)가 바로 이 알고리즘입니다. 리스트를 **일의 자리부터** 저장한다는 점에 주목하세요.

```python
m = 3
a = [3, 2, 1]        # 123 을 거꾸로 저장 (a[0] = 일의 자리)
b = [6, 5, 4]        # 456
c = [0, 0, 0, 0]
carry = 0
i = 0
while i <= m - 1:
    c[i] = a[i] + b[i] + carry
    if c[i] >= 10:
        c[i] = c[i] - 10
        carry = 1
    else:
        carry = 0
    i = i + 1
c[m] = carry
c.reverse()
print(c)             # [0, 5, 7, 9]
```

> [!PROBLEM]
> m = 3, a = 149, b = 029 를 추적합니다(교재 연습문제 3).
>
> | 단계 | i | aᵢ + bᵢ + carry | cᵢ | carry |
> | --- | ---: | --- | ---: | ---: |
> | 시작 | 0 | | | 0 |
> | 1회 | 0 | 9 + 9 + 0 = 18 | c₀ = 8 | 1 |
> | 2회 | 1 | 4 + 2 + 1 = 7 | c₁ = 7 | 0 |
> | 3회 | 2 | 1 + 0 + 0 = 1 | c₂ = 1 | 0 |
> | Step 7 | 3 | | c₃ = carry = 0 | |
>
> 출력: **0178**

> [!QUIZ]
> 위 알고리즘이 `0178`처럼 앞자리 0을 출력하지 않도록(즉 `178`) Step 8을 고치시오.

> [!ANSWER]
> ```text
> Step 8  Set k to m
>         While (k > 0) and (cₖ = 0) do
>             k ← k − 1
>         End of loop
>         Print cₖ cₖ₋₁ … c₀
> ```
> 맨 왼쪽부터 0인 자리를 건너뛰되, **c₀ 하나는 남겨야** 0 + 0 = 0 같은 경우에 아무것도 출력하지 않는 문제가 없다. 그래서 조건이 `k > 0`이다.

---

## 4. 유클리드 알고리즘과 GCD·LCM (족보 단골)

> [!CONCEPT]
> **GCD(a, b) = GCD(b, a mod b)**, 그리고 나머지가 0이 되는 순간의 **나누는 수**가 GCD다.
> 이유: a와 b를 모두 나누는 수는 a − q·b = a mod b 도 나눈다. 그래서 (a, b)를 (b, a mod b)로 바꿔도 공약수 집합은 그대로이고, 두 번째 값은 계속 작아져 반드시 0에 도달한다(halts).

교재 버전(연습문제 7)은 다음과 같습니다.

```text
1  Get two positive integers; call the larger I, the smaller J
2  Divide I by J, and call the remainder R
3  If R is not 0, then set I to J, set J to R, and go back to step 2
4  Print J
5  Stop
```

> [!PROBLEM]
> 입력 20, 32 (I = 32, J = 20)
>
> | 회차 | I | J | R = I mod J |
> | ---: | ---: | ---: | ---: |
> | 1 | 32 | 20 | 12 |
> | 2 | 20 | 12 | 8 |
> | 3 | 12 | 8 | 4 |
> | 4 | 8 | 4 | **0** |
>
> 출력: **J = 4**

> [!TRAP]
> 입력이 **0과 32**이면 I = 32, J = 0이 되어 Step 2에서 **0으로 나누기**가 일어납니다. effectively computable 조건 위반이므로 Step 1 뒤에 다음을 넣어야 합니다.
>
> ```text
> If J = 0 then Print 'Error: inputs must be positive' and Stop
> ```

### 족보 유형: GCD 없이 LCM 구하기

LCM은 "a의 배수 중 b로도 나누어떨어지는 가장 작은 수"입니다.

```text
Get values for a and b
Set multiple to a
While (multiple mod b ≠ 0) do
    Set multiple to multiple + a
End of loop
Print multiple
Stop
```

반복 횟수가 최악 b번이라 **입력 값의 크기에 비례**합니다(느림).

### 족보 유형: GCD로 LCM 구하기

> [!CONCEPT]
> **a × b = GCD(a, b) × LCM(a, b)** → LCM = a × b / GCD = (a / GCD) × b

```text
Get values for a and b
Set x to a
Set y to b
While (y ≠ 0) do            -- Euclid
    Set r to x mod y
    Set x to y
    Set y to r
End of loop
Set lcm to (a / x) × b      -- x 가 GCD
Print lcm
Stop
```

> [!TRAP]
> - **세 수의 LCM**은 `LCM(LCM(a, b), c)`로 두 번 나눠 구합니다. `a × b × c / GCD(a, b, c)`는 **틀린 공식**입니다. 4, 6, 10 → 정답 60, 틀린 공식 240 / 2 = 120.
> - `a × b`를 먼저 곱하면 큰 수에서 오버플로가 날 수 있으니 `(a / gcd) × b` 순서가 안전합니다.
> - 루프 안에서 `x`와 `y`를 바꾸는 **순서**를 틀리면(먼저 `x ← y`를 해 버리면) 나머지를 잃습니다. 임시 변수 `r`이 필요한 이유입니다.

> [!QUIZ]
> 분수 a/b + c/d 를 계산하기 위해 두 분모의 **최소공통분모(LCD)** 와 통분된 두 분자를 출력하는 의사코드를 쓰시오. (족보 문제 6 유형)

> [!HINT 1]
> LCD = LCM(b, d)입니다. 통분한 분자는 a × (LCD / b), c × (LCD / d)입니다.

> [!ANSWER]
> ```text
> Get values for a, b, c and d
> Set x to b
> Set y to d
> While (y ≠ 0) do
>     Set r to x mod y
>     Set x to y
>     Set y to r
> End of loop
> Set lcd to (b / x) × d
> Set newA to a × (lcd / b)
> Set newC to c × (lcd / d)
> Print lcd, newA, newC
> Stop
> ```
> 예: 1/4 + 5/6 → GCD(4, 6) = 2, LCD = 12 → 3/12 + 10/12

---

## 5. 컴퓨팅의 역사

### 초기 (~1940): 기계식 계산

| 인물 / 기계 | 기억할 점 |
| --- | --- |
| John Napier | **logarithms** 발명 → 곱셈을 덧셈으로 단순화 |
| Slide rule | 1622년경 첫 계산자 |
| Blaise Pascal — **Pascaline** | 초기 **mechanical calculator**. 톱니가 10칸 돌면 다음 자리로 **carry**를 넘기는 장치 (7 + 4 = 11) |
| Gottfried Leibnitz — **Leibnitz's Wheel** | 사칙연산 기계식 계산기 |
| Charles Babbage — **Difference Engine** | 6자리 사칙연산, 다항식 계산 |
| Babbage — **Analytic Engine** | 현대 컴퓨터와 놀랍도록 비슷한 설계 (실제로 완성 못 함) |
| Herman Hollerith | **punched card** 집계 기계 → Computer Tabulating Recording Company → **1924년 IBM** |

> [!NOTE]
> Pascaline의 자리 올림 장치는 3절의 `carry`와 똑같은 일을 톱니로 합니다. "알고리즘을 하드웨어로 구현한다(hardware realization)"의 가장 오래된 예입니다.

### 컴퓨터의 탄생 (1940–1950)

| 기계 | 특징 |
| --- | --- |
| **Mark I** | 범용, **electromechanical**(릴레이·자석·기어) |
| **ENIAC** (1946) | 최초의 **fully electronic** general-purpose programmable computer |
| **John Von Neumann** | **stored program computer** 제안 → 프로그램도 데이터처럼 메모리에 저장 |
| **EDVAC** (1951) | 펜실베이니아 대학의 초기 stored program 컴퓨터 |

### 현대 (1950~): 세대 구분

| 세대 | 기간 | 핵심 키워드 |
| --- | --- | --- |
| 1세대 | 1950–1957 | 최초 상업용 컴퓨터, **vacuum tubes**, punched card I/O |
| 2세대 | 1957–1965 | **transistors**, core memory, **FORTRAN·COBOL**, 직업 **programmer** 탄생, 최초 OS |
| 3세대 | 1965–1975 | **integrated circuit**, **minicomputer**, **software industry**, time-sharing OS |
| 4세대 | 1975–1985 | LSI/VLSI, **microcomputer**, **computer network**, **e-mail**, GUI |
| 5세대 | 1985– | massively parallel(10¹⁵ ops/s), handheld, 고해상도 그래픽·VR, 무선·유비쿼터스 |

> [!TRAP]
> - **ENIAC = 최초의 완전 전자식**, **Mark I = 전기기계식**. 둘을 바꿔 쓰는 실수가 잦습니다.
> - stored program 개념은 **Von Neumann**, 그것을 구현한 기계는 **EDVAC**입니다.
> - 프로그래머라는 직업은 **2세대**(고급 언어 등장), 소프트웨어 산업은 **3세대**입니다.

### Ariane 5 (첫 수업 이야기)

1996년 Ariane 5 로켓은 64비트 실수 속도 값을 16비트 정수로 변환하다 **overflow**가 나 발사 37초 만에 폭발했습니다. 알고리즘의 정확성(correctness)과 수의 내부 표현(4장)이 왜 중요한지 보여 주는 사례입니다.

---

## 6. 알고리즘 문제 해결 연습

> [!QUIZ]
> 25개 도시를 한 번씩 방문하는 모든 경로를 나열해 최단 경로를 찾으려 한다. 컴퓨터가 1초에 10,000,000개의 경로를 검사할 수 있다면 얼마나 걸리는가? 이 알고리즘은 실용적인가?

> [!ANSWER]
> 경로의 수는 25! ≈ 1.55 × 10²⁵ 개.
>
> 1.55 × 10²⁵ / 10⁷ ≈ 1.55 × 10¹⁸ 초 ≈ **약 490억 년**
>
> 결과는 나오지만(유한 시간) 현실적으로 쓸 수 없다. 이런 문제는 3장의 **intractable problem**이며, 정답 대신 "가장 가까운 아직 안 간 도시로 가기" 같은 **approximation algorithm**을 쓴다.

> [!QUIZ]
> 두 양의 정수 a, b의 곱을 **반복 덧셈**으로 구하는 알고리즘을 의사코드로 쓰시오. (예: 47 × 25 = 47 + 47 + … + 47, 25번)

> [!ANSWER]
> ```text
> Get values for a and b
> Set product to 0
> Set count to 0
> While (count < b) do
>     Set product to product + a
>     Set count to count + 1
> End of loop
> Print product
> Stop
> ```
> 2장 Figure 2.10과 같은 알고리즘이다. a 또는 b가 0이면 루프를 0번 돌고 0을 출력하므로 따로 처리하지 않아도 결과는 맞다.

> [!QUIZ]
> CD 한 장에는 약 7억(700,000,000) 개의 문자가 들어간다. 이것을 책으로 인쇄하면 책장이 몇 피트 필요한가? (1단어 = 5문자, 1쪽 = 300단어, 1인치 = 300쪽)

> [!ANSWER]
> 700,000,000 / 5 = 140,000,000 단어 → / 300 = 466,667 쪽 → / 300 = 1,555.6 인치 → / 12 ≈ **129.6 피트(약 40 m)**

---

## 7. 슬라이드 마지막 질문: 트리에서 두 노드 사이의 거리

```text
            1
         /     \
        2       3
       / \     / \
      4   5   6   7
               \
                8
```

Dist(4, 5) = 2, Dist(4, 6) = 4, Dist(3, 4) = 3, Dist(2, 4) = 1, Dist(8, 5) = 5

> [!NOTE]
> 단계로 쪼개면 알고리즘이 됩니다.
> 1. 두 노드의 **공통 조상 중 가장 깊은 노드(LCA)** 를 찾는다.
> 2. 거리 = depth(u) + depth(v) − 2 × depth(LCA)
>
> 예: Dist(8, 5) → depth(8) = 3, depth(5) = 2, LCA = 1 (depth 0) → 3 + 2 − 0 = 5
>
> "Claude Code에게 물어볼 수 있다"는 슬라이드 메모처럼, AI에게 맡기더라도 **이렇게 단계를 나눠 설명할 수 있어야** 결과가 맞는지 검증할 수 있습니다.

---

## 정리 카드

> [!FLASHCARD]
> Q: 컴퓨터 과학의 정의(영어)와 네 가지 측면은?
> A: The study of algorithms — formal and mathematical properties, hardware realizations, linguistic realizations, applications.

> [!FLASHCARD]
> Q: 알고리즘 정의의 다섯 키워드는?
> A: well-ordered, unambiguous, effectively computable, produces a result, halts in a finite amount of time.

> [!FLASHCARD]
> Q: primitive operation이란?
> A: computing agent가 더 이상의 설명이나 단순화 없이 바로 이해하고 수행할 수 있는 연산(= unambiguous operation).

> [!FLASHCARD]
> Q: LCM을 GCD로 구하는 공식은?
> A: LCM(a, b) = a × b / GCD(a, b). 세 수는 LCM(LCM(a, b), c).

> [!FLASHCARD]
> Q: ENIAC과 Mark I의 차이는?
> A: Mark I은 릴레이·기어를 쓴 electromechanical, ENIAC(1946)은 최초의 fully electronic general-purpose programmable computer.

> [!FLASHCARD]
> Q: stored program computer를 제안한 사람과 그 첫 구현 중 하나는?
> A: John Von Neumann, EDVAC(1951).
