---
title: "2장 의사코드와 알고리즘 설계"
description: "의사코드의 세 가지 연산, 순차 탐색·최댓값 찾기·패턴 매칭 알고리즘과 족보의 코드 판정 문제를 정리합니다."
order: 2
published: true
tags:
  - 의사코드
  - 순차 탐색
  - 패턴 매칭
objectives:
  - 교재 스타일 의사코드로 순차·조건·반복 연산을 쓸 수 있다.
  - Find Largest와 패턴 매칭 알고리즘을 추적하고, 비교 연산자를 바꿨을 때의 동작을 설명할 수 있다.
  - 주어진 알고리즘이 모든 입력에서 옳은지 반례로 판정할 수 있다.
---

# 2장 의사코드와 알고리즘 설계

## 학습 흐름

```text
자연어(장황·모호) ↔ 프로그래밍 언어(너무 엄격) → 절충안: pseudocode
        ↓
순차(Set / Get / Print) → 조건(If/Then/Else) → 반복(While, Do-While)
        ↓
예제 1 곱셈(반복 덧셈) → 예제 2 순차 탐색 → 예제 3 Find Largest → 예제 4 패턴 매칭
        ↓
top-down design · abstraction · "이 알고리즘은 정말 옳은가?"
```

> [!EXAM]
> 족보에서는 이 장이 **"코드/알고리즘이 모든 경우에 옳은가?"** 형태로 나옵니다(중간 족보 문제 7, Sample Q5). 정답은 거의 항상 **반례 하나**입니다. 같은 값(동점), 0, 경계(첫 칸·마지막 칸), 부분 일치 후 불일치를 먼저 넣어 보세요.

---

## 1. 알고리즘을 어떻게 표현할까

| 표현 방법 | 장점 | 단점 |
| --- | --- | --- |
| Natural language (Figure 2.1) | 누구나 읽음 | **verbose**, 구조가 없어 특정 부분을 찾기 어려움, 해석이 너무 **"rich"** (모호) |
| High-level programming language (Figure 2.2, Java) | 정확함 | 문법 세부사항(`Scanner`, `int[]`, `;`)이 설계를 방해 |
| **Pseudocode** | 두 극단의 **절충안(compromise)** | 정해진 문법이 없음 |

> [!CONCEPT]
> **Pseudocode** — 알고리즘을 설계하고 표현하는 데 쓰는, 자연어와 형식 언어(formal language)의 절충안. **외워서 엄격히 지켜야 하는 규칙 집합이 아니다**(not a precise set of notational rules). 읽기 쉽고, 모호하지 않고, 분석 가능하면 된다.

---

## 2. 세 가지 연산 (Figure 2.9 요약)

```text
COMPUTATION   Set the value of "variable" to "arithmetic expression"
INPUT/OUTPUT  Get a value for "variable", "variable", …
              Print the value of "variable", …
              Print the message 'message'
CONDITIONAL   If "a true/false condition" is true then
                  first set of algorithmic operations
              Else
                  second set of algorithmic operations
ITERATIVE     While ("a true/false condition") do step i through step j
              While ("a true/false condition") do
                  operations
              End of the loop
              Do
                  operations
              While ("a true/false condition")
```

| 용어 | 뜻 |
| --- | --- |
| Variable | 데이터 값을 담는 **저장 위치(storage location)** |
| Sequential algorithm | 위에서 아래로만 실행 = **straight-line algorithm** |
| Control operations | 조건·반복. 순차 흐름(flow of control)을 바꿈 |
| Continuation condition | 반복을 계속할지 정하는 조건 |
| **Pretest loop** | 조건을 **매 회차 시작**에 검사 (`While … do`) → 0번 실행될 수 있음 |
| **Posttest loop** | 조건을 **본문 끝**에 검사 (`Do … While`) → 최소 1번 실행 |
| Primitive | computing agent가 추가 설명 없이 수행할 수 있는 명령 |

> [!TRAP]
> - Pretest loop는 **본문이 한 번도 실행되지 않을 수 있습니다.** Posttest loop는 **최소 한 번** 실행됩니다. T/F 단골입니다.
> - 반복 조건이 절대 거짓이 되지 않으면 **infinite loop**입니다. 루프 본문 안에서 조건에 쓰인 변수가 바뀌는지 항상 확인하세요.

### 평균 연비 알고리즘 세 버전

```text
Version 1 (순차)              Version 2 (+ 조건)                  Version 3 (+ 반복)
1 Get gallons, start, end     … 4 Print average                   1 response = Yes
2 distance = end − start      5 If average > 25.0 then            2 While (response = Yes) do 3–11
3 average = distance ÷ gal    6   Print 'good gas mileage'         3–9  Version 2 의 1–7
4 Print average                 Else                              10   Print 'Do this again?'
5 Stop                        7   Print 'NOT good gas mileage'    11   Get response
                              8 Stop                              12 Stop
```

> [!QUIZ]
> 다음 의사코드가 출력하는 값의 개수와 마지막 줄을 쓰시오.
>
> ```text
> 1 Set the value of count to 1
> 2 While (count ≤ 100) do step 3 to step 5
> 3     Set square to (count × count)
> 4     Print the values of count and square
> 5     Add 1 to count
> ```

> [!ANSWER]
> 100줄을 출력하고 마지막 줄은 **100 10000**이다. count = 101이 되는 순간 조건이 거짓이 되어 끝난다. 만약 Step 5를 빼먹으면 count가 영원히 1이므로 무한 루프다.

---

## 3. 예제 1: 반복 덧셈으로 곱하기 (Figure 2.10)

```text
Get values for a and b
If (either a = 0 or b = 0) then
    Set the value of product to 0
Else
    Set the value of count to 0
    Set the value of product to 0
    While (count < b) do
        Set the value of product to (product + a)
        Set the value of count to (count + 1)
    End of loop
Print the value of product
Stop
```

> [!NOTE]
> `count < b`이므로 루프는 정확히 **b번** 돕니다(count = 0, 1, …, b − 1). `count ≤ b`로 쓰면 b + 1번 더해 a만큼 큰 답이 나옵니다. 반복 횟수는 시작값과 비교 연산자를 함께 보고 세세요.

---

## 4. 예제 2: 순차 탐색 (Sequential Search)

전화번호부(이름 N₁…N₁₀₀₀₀, 번호 T₁…T₁₀₀₀₀)에서 NAME의 번호를 찾습니다. 교재는 세 번의 시도로 완성합니다.

| 시도 | 문제점 |
| --- | --- |
| Figure 2.11 `If NAME = N₁ … If NAME = N₁₀₀₀₀` (10,002줄) | 너무 길고, n이 바뀌면 다시 써야 함. 찾은 뒤에도 계속 비교 |
| Figure 2.12 `While (Found = NO)` | 이름이 **없으면** i가 10,000을 넘어도 멈추지 않음 → **infinite loop** |
| Figure 2.13 `While both (Found = NO) and (i ≤ 10,000)` | 완성. 끝까지 없으면 'Sorry, this name is not in the directory' |

```text
1  Get values for NAME, N₁…N₁₀₀₀₀, T₁…T₁₀₀₀₀
2  Set i to 1 and set Found to NO
3  While both (Found = NO) and (i ≤ 10,000) do steps 4–7
4      If NAME = Nᵢ then
5          Print Tᵢ
6          Set Found to YES
       Else
7          Add 1 to i
8  If (Found = NO) then
9      Print 'Sorry, this name is not in the directory'
10 Stop
```

> [!QUIZ]
> 이름이 **중복될 수 있는** 전화번호부에서 NAME과 일치하는 **모든** 번호를 출력하고, 마지막에 일치한 개수를 출력하도록 순차 탐색을 고치시오.

> [!ANSWER]
> 찾아도 멈추면 안 되므로 `Found` 대신 **개수**를 셉니다.
>
> ```text
> Get values for NAME, n, N₁…Nₙ, T₁…Tₙ
> Set i to 1
> Set count to 0
> While (i ≤ n) do
>     If NAME = Nᵢ then
>         Print Tᵢ
>         Set count to count + 1
>     Set i to i + 1
> End of loop
> Print 'A total of', count, 'occurrences were located.'
> Stop
> ```
> 이제 i는 매 회차 무조건 증가하므로 유한 번(n번) 후 반드시 멈춘다.

---

## 5. 예제 3: 최댓값과 위치 찾기 (Find Largest, Figure 2.14)

```text
Get a value for n, the size of the list
Get values for A₁, A₂, …, Aₙ
Set largest so far to A₁
Set location to 1
Set i to 2
While (i ≤ n) do
    If Aᵢ > largest so far then
        Set largest so far to Aᵢ
        Set location to i
    Add 1 to i
End of the loop
Print largest so far and location
Stop
```

**Library** — 이렇게 검증된 유용한 알고리즘 모음. 다음 장의 선택 정렬은 Find Largest를 그대로 가져다 씁니다.

> [!QUIZ]
> Find Largest에서 한 줄만 바꾸었다. 각각 어떻게 동작하는가? (n ≥ 2)
>
> (1) `While (i ≥ n)`   (2) `While (i < n)`   (3) `While (i = n)`
>
> (4) `If Aᵢ ≥ largest so far`   (5) `If Aᵢ < largest so far`

> [!ANSWER]
> | 변경 | 동작 |
> | --- | --- |
> | (1) `i ≥ n` | i = 2에서 n = 2일 때만 시작해 i가 계속 커지며 조건이 영원히 참 → **무한 루프**(A₃, A₄…존재하지 않는 원소 접근). n > 2면 한 번도 안 돎 |
> | (2) `i < n` | **마지막 원소 Aₙ을 검사하지 않음** → 최댓값이 맨 끝에 있으면 틀림 |
> | (3) `i = n` | n = 2일 때만 한 번 돌고, n > 2면 루프를 아예 실행하지 않아 항상 A₁ 출력 |
> | (4) `≥` | 최댓값이 여러 개면 **마지막 위치**를 출력 (원래 `>`는 **첫 위치**) |
> | (5) `<` | "largest so far"가 계속 작은 값으로 바뀌어 **최솟값과 그 위치**를 출력 |
>
> 교훈: 반복·조건 연산에서 **관계 연산자(<, ≤, =, ≥, >, ≠) 하나**가 알고리즘의 의미를 완전히 바꾼다.

> [!QUIZ]
> 학생이 x, y, z 중 가장 큰 값을 출력하는 알고리즘을 다음처럼 썼다. 옳은가? 이유를 쓰시오. (Sample Question 5)
>
> ```text
> If (x > y) and (x > z), output x and stop. Otherwise continue.
> If (y > x) and (y > z), output y and stop. Otherwise continue.
> If (z > x) and (z > y), output z and stop.
> ```

> [!HINT 1]
> 세 값이 모두 다를 때는 잘 동작합니다. 같은 값이 있으면 어떻게 될까요?

> [!ANSWER]
> **옳지 않다.** 최댓값이 두 개 이상이면(동점) 세 조건이 모두 거짓이 되어 **아무것도 출력하지 않는다.**
>
> 반례: x = 5, y = 5, z = 1 → (5 > 5)가 거짓이라 1, 2행 모두 실패, 3행도 실패 → 출력 없음. x = y = z인 경우도 같다. "produces a result" 조건을 어긴다.
>
> 고친 버전: `>`를 `≥`로 바꾸거나, Find Largest처럼 `largest ← x; if y > largest …; if z > largest …; output largest`.

---

## 6. 예제 4: 패턴 매칭 (Pattern Matching)

텍스트 T₁…Tₙ 에서 패턴 P₁…Pₘ (m ≤ n)이 나타나는 **모든 시작 위치**를 출력합니다. 유전체(human genome) 분석에 쓰입니다.

```text
STEP 1 (matching)  T₁ T₂ T₃ T₄ T₅ …       STEP 2 (slide forward)  T₁ T₂ T₃ T₄ T₅ …
                   P₁ P₂ P₃                 1-character slide →        P₁ P₂ P₃
```

### top-down design과 abstraction

첫 초안(Figure 2.15)은 "Attempt to match every character in the pattern beginning at position k" 같은 **고수준 명령**을 그대로 씁니다.

| 용어 | 뜻 |
| --- | --- |
| **Abstraction** | 설계 중에 고수준 명령(예: "Sort the entire list")을 쓰는 것 |
| **Top-down design** | 먼저 높은 추상화 수준에서 전체를 보고, 각 고수준 명령을 나중에 primitive로 쪼갬 |

### 최종판 (Figure 2.16)

```text
Get values for n and m
Get values for T₁…Tₙ and P₁…Pₘ
Set k to 1
While (k ≤ (n − m + 1)) do
    Set i to 1
    Set Mismatch to NO
    While both (i ≤ m) and (Mismatch = NO) do
        If Pᵢ ≠ T(k + (i − 1)) then
            Set Mismatch to YES
        Else
            Increment i by 1
    End of the loop
    If Mismatch = NO then
        Print 'There is a match at position', k
    Increment k by 1
End of the loop
Stop
```

> [!TRAP]
> - 바깥 루프 조건은 `k ≤ n − m + 1`입니다. `k ≤ n`으로 쓰면 패턴이 텍스트 밖으로 삐져나와 존재하지 않는 Tₙ₊₁을 비교합니다.
> - 비교 위치는 `T(k + i − 1)`입니다. `T(k + i)`로 쓰면 한 칸씩 어긋납니다.
> - 마지막 `Increment k by 1`을 빠뜨리면 k가 그대로라 같은 위치를 영원히 비교하는 **무한 루프**가 되고, 그 위치가 일치한다면 같은 메시지를 끝없이 출력합니다.

> [!QUIZ]
> 텍스트 `We must band together and handle adversity`에서 패턴 `and`를 찾으면 무엇을 출력하는가? (공백도 한 문자, 첫 글자가 위치 1) 또 단어 `and`만 찾으려면 어떻게 고쳐야 하는가?

> [!ANSWER]
> **10, 23, 28** — `b`**and**(10), **and**(23), `h`**and**le(28)
>
> 단어만 찾으려면 일치했을 때 **앞뒤 문자도 검사**한다: (k = 1이거나 T(k−1)이 공백) **and** (k + m − 1 = n이거나 T(k+m)이 공백)일 때만 출력. 또는 패턴을 `␣and␣`로 바꿔 찾는 방법도 있다(단, 문장 맨 앞·끝은 따로 처리).

### 족보 유형: 이 코드는 항상 옳은가? (중간 족보 문제 7)

```python
def find(text, pattern):
    n, m = len(text), len(pattern)
    i = 0; j = 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1; j += 1
            if j == m:
                return i - m
        else:
            j = 0
            i += 1
    return -1
```

> [!QUIZ]
> `find("AABB", "AB")`의 반환값은? 이 코드는 모든 경우에 옳은가?

> [!HINT 1]
> 부분 일치(j > 0) 도중에 불일치가 나면 i가 어디로 가는지 보세요. 교재 알고리즘은 실패하면 **시작 위치 k를 한 칸만** 옮깁니다.

> [!ANSWER]
> 반환값 **-1** (정답은 1).
>
> | i | j | 비교 | 결과 |
> | ---: | ---: | --- | --- |
> | 0 | 0 | A = A | i = 1, j = 1 |
> | 1 | 1 | A ≠ B | j = 0, **i = 2** ← index 1의 A를 새 시작으로 다시 보지 않음 |
> | 2 | 0 | B ≠ A | i = 3 |
> | 3 | 0 | B ≠ A | i = 4 → return -1 |
>
> **옳지 않다.** 불일치가 나면 교재처럼 이번 시도의 다음 시작 위치로 돌아가야 한다.
>
> ```python
>         else:
>             i = i - j + 1
>             j = 0
> ```
> `find("AAAB", "AB")`는 우연히 2로 맞게 나오므로, **맞는 예 하나로 옳다고 판단하면 안 된다**는 것이 이 문제의 요점이다.

---

## 7. 과제 0.1 Question B: N번 넘게 나온 수 지우기

리스트(최대 100개)와 N이 주어지면 **N번보다 많이** 나온 수를 모두 지우고 순서는 유지합니다.

| 입력 | 출력 |
| --- | --- |
| [1, 2, 3], 0 | [] |
| [5, 10, 15, 10, 7], 1 | [5, 15, 7] |
| [1, 2, 2, 3, 3, 3, 4, 5, 5], 1 | [1, 4] |

```text
Get values for n, A₁…Aₙ and N
Set k to 0                              -- 결과 리스트 B 의 길이
Set i to 1
While (i ≤ n) do
    Set count to 0
    Set j to 1
    While (j ≤ n) do                    -- Aᵢ 가 몇 번 나오는지 센다
        If Aⱼ = Aᵢ then Set count to count + 1
        Set j to j + 1
    End of loop
    If count ≤ N then
        Set k to k + 1
        Set Bₖ to Aᵢ
    Set i to i + 1
End of loop
Print B₁…Bₖ
Stop
```

> [!NOTE]
> 이 방법은 각 원소마다 리스트 전체를 다시 훑으므로 **각 수를 최대 n번 방문**하고 전체 비교는 n² 번(Θ(n²))입니다. 수의 등장 횟수를 먼저 한 번 세어 표(dictionary)에 저장해 두면 리스트를 **두 번**만 훑어 Θ(n)으로 줄일 수 있습니다(과제 B-2의 답 방향).

---

## 8. 교재 연습: 짧은 알고리즘 쓰기

> [!QUIZ]
> 양의 정수 N이 소수(prime)인지 판정해, 소수가 아니면 'not prime'과 약수 하나를, 소수면 'prime'을 출력하는 알고리즘을 쓰시오.

> [!ANSWER]
> ```text
> Get a value for N
> If N < 2 then
>     Print 'not prime'
>     Stop
> Set d to 2
> Set Found to NO
> While (d × d ≤ N) and (Found = NO) do
>     If (N mod d = 0) then
>         Set Found to YES
>     Else
>         Set d to d + 1
> End of loop
> If Found = YES then Print 'not prime', d
> Else Print 'prime'
> Stop
> ```
> 약수는 반드시 √N 이하에 하나 있으므로 `d × d ≤ N`까지만 보면 된다. 1은 소수가 아니므로 첫 줄에서 따로 처리한다.

> [!QUIZ]
> k개의 수 N₁…Nₖ의 순서를 **제자리에서** 뒤집는 알고리즘을 쓰시오. (5, 13, 8, 27, 10 → 10, 27, 8, 13, 5)

> [!ANSWER]
> ```text
> Get values for k and N₁…Nₖ
> Set left to 1
> Set right to k
> While (left < right) do
>     Set temp to N(left)            -- 3장 Figure 3.9 의 교환
>     Set N(left) to N(right)
>     Set N(right) to temp
>     Set left to left + 1
>     Set right to right − 1
> End of loop
> Print N₁…Nₖ
> Stop
> ```
> k가 홀수면 가운데 원소(8)는 그대로 남는다. `temp` 없이 `N(left) ← N(right); N(right) ← N(left)`로 쓰면 두 칸이 같은 값이 된다.

---

## 정리 카드

> [!FLASHCARD]
> Q: 자연어로 알고리즘을 쓸 때의 세 가지 문제는?
> A: 너무 장황(verbose)하고, 구조가 없어 특정 부분을 찾기 어렵고, 해석이 너무 풍부(rich)해 모호하다.

> [!FLASHCARD]
> Q: pretest loop와 posttest loop의 차이는?
> A: pretest는 매 회차 시작에 조건을 검사해 0번 실행될 수 있고, posttest는 본문 끝에 검사해 최소 1번 실행된다.

> [!FLASHCARD]
> Q: 순차 탐색 두 번째 시도(Figure 2.12)의 결함은?
> A: 이름이 목록에 없으면 Found가 계속 NO라 끝나지 않는다. (i ≤ n) 조건을 함께 걸어야 한다.

> [!FLASHCARD]
> Q: abstraction과 top-down design이란?
> A: abstraction은 설계 중 고수준 명령을 쓰는 것, top-down design은 고수준에서 전체를 본 뒤 각 명령을 점점 primitive로 세분화하는 것.

> [!FLASHCARD]
> Q: 패턴 매칭 바깥 루프의 마지막 시작 위치는?
> A: k = n − m + 1. 그 뒤로는 패턴이 텍스트 끝을 넘어선다.
