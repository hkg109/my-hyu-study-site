---
title: 전산학개론 중간고사 족보
description: 알고리즘 효율, GCD·LCM, 데이터 정리 알고리즘, 진리표, 어셈블리를 다루는 CSE102 중간고사 복원 문제와 정답·해설입니다.
week: 0
order: 1
published: true
password: "071009"
---

**응시 안내**

- 각 문항의 조건에 따라 답, 수도코드 또는 이유를 작성하시오.
- 수도코드는 교재(Schneider & Gersting) 스타일을 따르되, 의미가 분명하면 형식은 자유롭게 써도 된다.
- 답안을 작성한 뒤 정답을 펼쳐 확인하고, 맞음·헷갈림·틀림을 기록할 수 있다.

> [!CAUTION]
> 수강생 기억을 바탕으로 복원한 족보를 연습 시험 형식으로 재구성한 자료입니다. 원 문제의 숫자·코드·배점은 정확히 남아 있지 않아 일부 문항(특히 문제 6, 7, 10, 12)은 출제 의도에 맞게 새로 구성했습니다. 실제 시험의 문항 순서나 배점과 다를 수 있습니다.

[기말고사 족보](/practice/grade-01/semester-01/subject-muhy8vqy/exam-02)

## Part A · True / False & 빈칸

### 문제 1

> [!QUIZ]
> 다음 문장이 참인지 거짓인지 고르시오.
>
> *The worst case of the shuffle-left algorithm (data cleanup) is Θ(n²).*
>
> **A.** True
>
> **B.** False

> [!HINT 1]
> 리스트 전체가 0으로 채워진 경우를 떠올리세요. 0을 하나 발견할 때마다 몇 개의 원소를 왼쪽으로 복사하나요?

> [!ANSWER]
> **A. True**
>
> 모든 원소가 0이면 0을 발견할 때마다 오른쪽 원소들을 전부 한 칸씩 왼쪽으로 복사한다. 복사 횟수는 대략 `(n−1) + (n−2) + … + 1 = n(n−1)/2`이므로 **Θ(n²)**이다.
>
> | 알고리즘 | Best case | Worst case | 추가 공간 |
> |---|---|---|---|
> | Shuffle-left | Θ(n) (0이 없음) | Θ(n²) (모두 0) | 없음 |
> | Copy-over | Θ(n) | Θ(n) | 최대 n칸 |
> | Converging pointers | Θ(n) | Θ(n) | 없음 (순서는 바뀜) |

### 문제 2

> [!QUIZ]
> 빈칸을 채우시오.
>
> *지수(exponential) 알고리즘의 대표적인 시간복잡도는* **O( ________ )** *이다.*

> [!ANSWER]
> **O(2ⁿ)**
>
> 입력이 하나 늘 때마다 작업량이 두 배가 된다. 예: n개 원소의 모든 부분집합 검사(2ⁿ개), 해밀턴 회로 brute-force 탐색. 이런 문제는 **intractable**하다고 하며, 실제로는 근사 알고리즘(approximation algorithm)을 사용한다.
>
> 크기 순서: `lg n < n < n lg n < n² < 2ⁿ`

## Part B · GCD와 LCM 알고리즘

### 문제 3

> [!QUIZ]
> 두 양의 정수 `a`, `b`의 최소공배수(LCM)를 구하는 알고리즘을 수도코드로 작성하시오. 이 문항에서는 GCD를 사용하지 말고, LCM의 정의만 이용하시오.

> [!HINT 1]
> LCM은 `a`의 배수 중 `b`로도 나누어떨어지는 가장 작은 수입니다.

> [!ANSWER]
> `a`의 배수를 작은 것부터 차례로 만들어 보며 `b`로 나누어떨어지는 첫 값을 찾는다.
>
> ```text
> Get values for a and b
> Set multiple to a
> While (multiple mod b ≠ 0) do
>     Set multiple to multiple + a
> End of loop
> Print multiple
> Stop
> ```
>
> 예: `a = 4, b = 6` → 4, 8, **12** → LCM = 12
>
> 최악의 경우 반복 횟수는 `b`번(배수가 `a × b`가 될 때까지)이므로 입력값 크기에 비례한다. 다음 문항의 GCD 방식이 훨씬 빠르다.

### 문제 4

> [!QUIZ]
> GCD(최대공약수)를 이용하여 두 수의 LCM을 구하는 알고리즘을 작성하시오. GCD는 유클리드 알고리즘으로 직접 구현하시오.

> [!HINT 1]
> `a × b = GCD(a, b) × LCM(a, b)`가 항상 성립합니다.

> [!HINT 2]
> 유클리드 알고리즘: `GCD(a, b) = GCD(b, a mod b)`, 나머지가 0이 되면 그때의 나누는 수가 GCD입니다.

> [!ANSWER]
> ```text
> Get values for a and b
> Set x to a
> Set y to b
> While (y ≠ 0) do          // 유클리드 알고리즘
>     Set r to x mod y
>     Set x to y
>     Set y to r
> End of loop
> Set gcd to x
> Set lcm to (a × b) / gcd
> Print lcm
> Stop
> ```
>
> 예: `a = 12, b = 18`
>
> | x | y | r = x mod y |
> |---:|---:|---:|
> | 12 | 18 | 12 |
> | 18 | 12 | 6 |
> | 12 | 6 | 0 |
> | 6 | 0 | — |
>
> GCD = 6, LCM = 12 × 18 / 6 = **36**
>
> 오버플로를 피하려면 `(a / gcd) × b` 순서로 계산하는 것이 더 안전하다.

### 문제 5

> [!QUIZ]
> 세 양의 정수 `a`, `b`, `c`의 LCM을 구하는 알고리즘을 작성하시오. 문제 4의 알고리즘을 재사용해도 된다.

> [!HINT 1]
> LCM은 결합법칙이 성립합니다. 두 개씩 묶어서 차례로 구할 수 있습니다.

> [!ANSWER]
> `LCM(a, b, c) = LCM(LCM(a, b), c)`
>
> ```text
> Get values for a, b and c
> Set t to LCM(a, b)        // 문제 4의 알고리즘
> Set result to LCM(t, c)
> Print result
> Stop
> ```
>
> 예: `a = 4, b = 6, c = 10` → LCM(4, 6) = 12 → LCM(12, 10) = 120 / GCD(12, 10) = 120 / 2 = **60**
>
> 주의: `a × b × c / GCD(a, b, c)`는 **틀린 공식**이다. 예를 들어 4, 6, 10에 대입하면 240 / 2 = 120이 되어 정답 60과 다르다.

### 문제 6

> [!QUIZ]
> 분수 `a/b`와 `c/d`를 더하기 위해 두 분모의 최소공통분모(LCD, Least Common Denominator)를 구하고, 통분한 두 분자를 출력하는 알고리즘을 수도코드로 작성하시오.

> [!HINT 1]
> 최소공통분모는 두 분모의 최소공배수입니다.

> [!ANSWER]
> LCD = LCM(b, d)이므로 문제 4의 GCD 알고리즘을 그대로 쓴다.
>
> ```text
> Get values for a, b, c and d
> Set x to b
> Set y to d
> While (y ≠ 0) do
>     Set r to x mod y
>     Set x to y
>     Set y to r
> End of loop
> Set lcd to (b × d) / x
> Set newA to a × (lcd / b)
> Set newC to c × (lcd / d)
> Print lcd, newA, newC
> Stop
> ```
>
> 예: `1/4 + 5/6` → LCD = 12 → `3/12 + 10/12`
>
> 족보 원문에는 "LCD0 알고리즘"이라고만 적혀 있어 최소공통분모 문제로 해석해 정리했다.

## Part C · 코드 판정과 데이터 정리

### 문제 7

> [!QUIZ]
> 다음은 문자열 `text`(길이 n) 안에서 패턴 `pattern`(길이 m)이 처음 나타나는 위치를 찾으려는 코드이다. 찾지 못하면 -1을 반환한다.
>
> ```python
> def find(text, pattern):
>     n, m = len(text), len(pattern)
>     i = 0   # text 위치
>     j = 0   # pattern 위치
>     while i < n:
>         if text[i] == pattern[j]:
>             i += 1
>             j += 1
>             if j == m:
>                 return i - m
>         else:
>             j = 0
>             i += 1
>     return -1
> ```
>
> (1) `find("AAAB", "AB")`와 `find("AABB", "AB")`의 반환값을 각각 쓰고, 올바른 답과 비교하시오.
>
> (2) 이 코드는 모든 경우에 올바르게 동작하는가? 그렇지 않다면 이유를 설명하고 수정하시오.

> [!HINT 1]
> 두 입력을 `i`, `j`, 비교 결과로 한 줄씩 추적해 보세요.

> [!HINT 2]
> 부분 일치(`j > 0`) 도중에 불일치가 나면 `i`가 어디로 이동하는지 보세요. 불일치를 일으킨 문자가 다시 검사되나요?

> [!ANSWER]
> **(1)**
>
> `find("AAAB", "AB")` → **2** (정답 2, 우연히 맞음)
>
> | i | j | text[i] vs pattern[j] | 결과 |
> |---:|---:|---|---|
> | 0 | 0 | A = A | i=1, j=1 |
> | 1 | 1 | A ≠ B | j=0, i=2 |
> | 2 | 0 | A = A | i=3, j=1 |
> | 3 | 1 | B = B | j=2 → return 2 |
>
> `find("AABB", "AB")` → **-1** (정답은 1, 틀림)
>
> | i | j | text[i] vs pattern[j] | 결과 |
> |---:|---:|---|---|
> | 0 | 0 | A = A | i=1, j=1 |
> | 1 | 1 | A ≠ B | j=0, **i=2** ← index 1의 A를 다시 보지 않음 |
> | 2 | 0 | B ≠ A | i=3 |
> | 3 | 0 | B ≠ A | i=4 → return -1 |
>
> **(2)** 모든 경우에 동작하지 **않는다**. 부분 일치 후 불일치가 나면 `j`만 0으로 되돌리고 `i`는 계속 전진하므로, 불일치를 일으킨 문자가 새 매칭의 시작이 될 수 있는 경우를 건너뛴다. 교재의 pattern matching처럼 **다음 시작 위치(`i − j + 1`)로 되돌아가야** 한다.
>
> ```python
>         else:
>             i = i - j + 1   # 이번 시도의 시작 위치 다음 칸으로
>             j = 0
> ```

### 문제 8

> [!QUIZ]
> 다음 리스트에서 0을 제거하는 data cleanup 문제를 푸시오. (index는 1부터 시작)
>
> ```text
> [0, 7, 0, 3, 5, 0]   (n = 6)
> ```
>
> (1) **Shuffle-left** 알고리즘을 적용할 때 각 단계의 리스트와 `legit`, `left` 값을 쓰고 최종 결과를 쓰시오.
>
> (2) **Converging pointers** 알고리즘을 적용할 때 각 단계의 리스트와 `legit`, `left`, `right` 값을 쓰고 최종 결과를 쓰시오.
>
> (3) 두 결과의 차이를 한 문장으로 설명하시오.

> [!HINT 1]
> Shuffle-left: 0을 만나면 `legit`을 1 줄이고 오른쪽 원소들을 전부 한 칸 왼쪽으로 복사한 뒤, **`left`는 그대로** 두고 다시 검사합니다.

> [!HINT 2]
> Converging pointers: 0을 만나면 `legit`을 1 줄이고 `A[left] ← A[right]` 복사 후 `right`만 1 줄입니다. `left = right`가 되면 멈추고 마지막 칸을 한 번 더 검사합니다.

> [!ANSWER]
> **(1) Shuffle-left**
>
> | 단계 | left | 동작 | 리스트 | legit |
> |---:|---:|---|---|---:|
> | 0 | 1 | 시작 | [0, 7, 0, 3, 5, 0] | 6 |
> | 1 | 1 | A[1]=0 → 2~6을 왼쪽으로 | [7, 0, 3, 5, 0, 0] | 5 |
> | 2 | 1 | A[1]=7 → left++ | 〃 | 5 |
> | 3 | 2 | A[2]=0 → 3~6을 왼쪽으로 | [7, 3, 5, 0, 0, 0] | 4 |
> | 4 | 2→3→4 | 3, 5 확인 → left++ 두 번 | 〃 | 4 |
> | 5 | 4 | A[4]=0 → 5~6을 왼쪽으로 | [7, 3, 5, 0, 0, 0] | 3 |
> | 끝 | 4 | left > legit | | |
>
> 결과: **[7, 3, 5]** (legit = 3), 원래 순서 유지. 복사 횟수 5 + 4 + 2 = 11.
>
> **(2) Converging pointers**
>
> | 단계 | left | right | 동작 | 리스트 | legit |
> |---:|---:|---:|---|---|---:|
> | 0 | 1 | 6 | 시작 | [0, 7, 0, 3, 5, 0] | 6 |
> | 1 | 1 | 6→5 | A[1]=0 → A[1]←A[6]=0 | [0, 7, 0, 3, 5, 0] | 5 |
> | 2 | 1 | 5→4 | A[1]=0 → A[1]←A[5]=5 | [5, 7, 0, 3, 5, 0] | 4 |
> | 3 | 1→2→3 | 4 | 5, 7 확인 → left++ 두 번 | 〃 | 4 |
> | 4 | 3 | 4→3 | A[3]=0 → A[3]←A[4]=3 | [5, 7, 3, 3, 5, 0] | 3 |
> | 끝 | 3 | 3 | left = right, A[3]=3 ≠ 0 이므로 legit 유지 | | 3 |
>
> 결과: **[5, 7, 3]** (legit = 3)
>
> **(3)** Shuffle-left는 원래 순서를 유지하지만 최악 Θ(n²)이고, converging pointers는 Θ(n)으로 빠르지만 오른쪽 끝 원소를 앞으로 가져오므로 **순서가 바뀐다**.

## Part D · 논리 회로와 효율 비교

### 문제 9

> [!QUIZ]
> 입력이 `a`, `b`, `c` 세 개인 회로가 있다. 입력 중 **1의 개수가 0개 또는 2개일 때만** 출력이 1이다.
>
> (1) 진리표를 작성하시오.
>
> (2) sum-of-products 방식으로 불 표현식을 쓰시오.

> [!HINT 1]
> 2³ = 8행입니다. 각 행에서 1의 개수를 먼저 세세요.

> [!HINT 2]
> Sum-of-products: 출력이 1인 행마다, 입력이 0이면 NOT을 붙인 AND 항을 만들고 그 항들을 OR로 연결합니다.

> [!ANSWER]
> **(1) 진리표**
>
> | a | b | c | 1의 개수 | output |
> |:-:|:-:|:-:|:-:|:-:|
> | 0 | 0 | 0 | 0 | **1** |
> | 0 | 0 | 1 | 1 | 0 |
> | 0 | 1 | 0 | 1 | 0 |
> | 0 | 1 | 1 | 2 | **1** |
> | 1 | 0 | 0 | 1 | 0 |
> | 1 | 0 | 1 | 2 | **1** |
> | 1 | 1 | 0 | 2 | **1** |
> | 1 | 1 | 1 | 3 | 0 |
>
> **(2) Sum-of-products**
>
> ```text
> output = (ā · b̄ · c̄) + (ā · b · c) + (a · b̄ · c) + (a · b · c̄)
> ```
>
> 즉 1의 개수가 짝수일 때 1을 내는 **even parity** 회로이며, `NOT(a XOR b XOR c)`와 같다.

### 문제 10

> [!QUIZ]
> 입력 크기 `n = 10, 20, 50`일 때 다음 표를 완성하고(소수 첫째 자리까지), n이 커질수록 어떤 차이가 생기는지 설명하시오. (`lg`는 밑이 2인 로그, `lg 10 ≈ 3.32`)
>
> | n | lg n | n lg n | n² |
> |---:|---:|---:|---:|
> | 10 | | | |
> | 20 | | | |
> | 50 | | | |

> [!HINT 1]
> `lg 20 = lg 10 + 1`, `lg 50 = lg 100 − 1 = 2·lg 10 − 1`을 이용하세요.

> [!ANSWER]
> | n | lg n | n lg n | n² |
> |---:|---:|---:|---:|
> | 10 | 3.3 | 33.2 | 100 |
> | 20 | 4.3 | 86.4 | 400 |
> | 50 | 5.6 | 282.2 | 2,500 |
>
> n이 5배(10→50) 커질 때 n lg n은 약 8.5배, n²는 25배 늘어난다. n이 커질수록 Θ(n lg n) 알고리즘(merge sort 등)이 Θ(n²) 알고리즘(selection sort 등)보다 압도적으로 유리해진다.
>
> 족보 메모 "N log n (5 2 1)*10"을 n = 50, 20, 10에 대한 계산 문제로 해석해 정리했다.

## Part E · 컴퓨터 구조와 어셈블리

### 문제 11

> [!QUIZ]
> RISC와 CISC를 비교하여 설명하시오. 명령어 수, 명령어 길이·실행 시간, 프로그램 길이 관점을 포함하시오.

> [!ANSWER]
> | 구분 | RISC (Reduced Instruction Set Computer) | CISC (Complex Instruction Set Computer) |
> |---|---|---|
> | 명령어 수 | 적음 (보통 30~50개 수준의 단순 명령) | 많음 (수백 개의 복잡한 명령) |
> | 명령어 형식 | 고정 길이, 단순 | 가변 길이, 복잡 |
> | 명령어 실행 | 대부분 1 clock cycle, 빠름 | 명령마다 실행 시간이 다름 |
> | 프로그램 | 같은 작업에 더 많은 명령어 필요 | 더 짧은 프로그램 |
> | 예 | ARM, SPARC (스마트폰 등) | Intel x86 |
>
> 핵심: RISC는 "단순한 명령을 아주 빠르게" 실행하여, 명령어 수가 늘어나도 전체 실행 시간은 더 짧아질 수 있다는 설계 철학이다. 현대 프로세서는 두 방식을 혼합해 사용한다.

### 문제 12

> [!QUIZ]
> 교재의 어셈블리 언어를 사용하여 다음 알고리즘을 작성하시오.
>
> ```text
> Get values for A and B
> If B > A then
>     Print B
> Else
>     Print A
> Stop
> ```
>
> 사용 가능한 명령: `LOAD X`, `STORE X`, `ADD X`, `COMPARE X`, `JUMP X`, `JUMPGT X`, `JUMPEQ X`, `JUMPLT X`, `IN X`, `OUT X`, `HALT`, `.DATA`
>
> (`COMPARE X`는 `CON(X)`와 레지스터 `R`을 비교한다. `CON(X) > R`이면 GT, `CON(X) = R`이면 EQ, `CON(X) < R`이면 LT가 1이 된다.)

> [!HINT 1]
> `LOAD A` 후 `COMPARE B`를 실행하면 `B > A`일 때 GT 비트가 켜집니다.

> [!HINT 2]
> 데이터 선언(`.DATA`)은 `HALT` 뒤에 두어 명령어로 실행되지 않게 하세요.

> [!ANSWER]
> ```text
>          IN      A
>          IN      B
>          LOAD    A          -- R ← A
>          COMPARE B          -- B와 R(A) 비교
>          JUMPGT  PRINTB     -- B > A 이면 PRINTB로
>          OUT     A          -- 아니면 A 출력
>          JUMP    DONE
> PRINTB:  OUT     B
> DONE:    HALT
> A:       .DATA   0
> B:       .DATA   0
> ```
>
> - `COMPARE`의 비교 방향(`CON(X)` vs `R`)을 반대로 쓰면 결과가 뒤바뀌므로 주의한다.
> - `JUMP DONE`이 없으면 A를 출력한 뒤 B까지 출력하게 된다.
> - 레이블(`PRINTB:`, `DONE:`)은 assembler가 메모리 주소로 바꾼다.
