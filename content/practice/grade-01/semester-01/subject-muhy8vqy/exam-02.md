---
title: 전산학개론 기말고사 족보
description: 개념 T/F, 디버깅, 튜링 머신, 중복 제거, 행렬, BNF, 암호, Dijkstra, XOR을 다루는 CSE102 기말고사 복원 문제(55점 만점)와 정답·해설입니다.
week: 0
order: 2
published: true
password: "071009"
---

**응시 안내**

| 항목 | 내용 |
|---|---|
| 만점 | 55점 |
| 문항 | 문제 1 ~ 문제 11 |
| 배점 구조 | 8점 1문항 · 7점 1문항 · 6점 2문항 · 4점 7문항 |

- 각 문항의 조건에 따라 답, 코드, 그림 또는 이유를 작성하시오.
- 답안을 작성한 뒤 정답을 펼쳐 확인하고, 맞음·헷갈림·틀림을 기록할 수 있다.

> [!CAUTION]
> 수강생 기억을 바탕으로 복원한 족보를 최대한 비슷한 형식으로 재구성한 자료입니다. 문제 3(Knight move)의 소문항, 문제 6의 입력, 문제 10의 edge weight, 문제 11의 비트열은 원본이 남아 있지 않아 새로 구성했습니다. 배점은 연습용 설정입니다.

[중간고사 족보](/practice/grade-01/semester-01/subject-muhy8vqy/exam-01)

## 문제 1 · Concept Questions `7점`

### 1-1) Time Complexity `1점`

> [!QUIZ]
> *If a Θ(n²) algorithm and a Θ(n) algorithm exist for the same task, then for large enough n, the Θ(n²) algorithm does more work and takes longer to execute, regardless of constant factors for peripheral work.*
>
> **A.** True
>
> **B.** False

> [!ANSWER]
> **A. True**
>
> 상수 계수(peripheral work)는 n이 충분히 커지면 차수(order of magnitude)의 차이를 이길 수 없다. 예를 들어 `0.001n²`과 `1000n`도 n > 10⁶이면 `0.001n²`이 더 크다. 다만 **작은 n에서는** Θ(n) 알고리즘이 더 느릴 수도 있다는 점을 구분해야 한다.

### 1-2) Hash Function `2점`

> [!QUIZ]
> Which one takes the password the user originally chooses, chops it up, and stirs it around according to a given formula?
>
> **A.** hash function
>
> **B.** encryption function
>
> **C.** mash function
>
> **D.** stash function

> [!ANSWER]
> **A. hash function**
>
> 시스템은 비밀번호 원문 대신 **해시값**을 저장한다. 로그인 시 입력한 비밀번호를 같은 해시 함수에 넣어 저장된 값과 비교한다. 해시는 단방향이라 해시값에서 원문을 되돌릴 수 없다는 점이 암호화(encryption, 복호화 가능)와의 차이이다. 나머지 둘은 존재하지 않는 용어로 만든 오답이다.

### 1-3) Turing Machine `1점`

> [!QUIZ]
> *튜링 머신은 항상 일반적인 알고리즘보다 효율적이다.*
>
> **A.** True
>
> **B.** False

> [!ANSWER]
> **B. False**
>
> 튜링 머신은 **계산 가능성(computability)** 을 정의하기 위한 모델이지 효율적인 실행 장치가 아니다. Church–Turing thesis에 따르면 알고리즘으로 풀 수 있는 문제는 튜링 머신으로도 풀 수 있지만, 테이프를 한 칸씩 이동하므로 실제 컴퓨터보다 대개 훨씬 많은 단계가 필요하다.

### 1-4) Compiler Stage `2점`

> [!QUIZ]
> 다음 설명에 해당하는 compiler의 단계를 고르시오.
>
> *This stage improves the program without changing its meaning. It may reduce running time, memory usage, or unnecessary operations.*
>
> **A.** Lexical Analysis
>
> **B.** Syntax Analysis (Parsing)
>
> **C.** Optimization
>
> **D.** Linking

> [!ANSWER]
> **C. Optimization**
>
> 컴파일 단계: **Lexical analysis**(토큰으로 분리) → **Parsing**(문법 검사, parse tree) → **Semantic analysis & code generation**(의미 검사, 기계어 생성) → **Code optimization**(의미는 유지하며 더 빠르고 작게). Linking은 컴파일 이후 여러 object 파일과 라이브러리를 합치는 단계라 컴파일러 단계가 아니다.
>
> 대표적 최적화: 상수 계산 미리 하기(`x = 2 * 3` → `x = 6`), 불필요한 LOAD/STORE 제거, 반복문 밖으로 불변 계산 빼기.

### 1-5) BNF `1점`

> [!QUIZ]
> *The syntax of C++ can be described using BNF or a BNF-like grammar.*
>
> **A.** True
>
> **B.** False

> [!ANSWER]
> **A. True**
>
> BNF(Backus–Naur Form)는 프로그래밍 언어의 **문법(syntax)** 을 형식적으로 정의하는 표기법이며, C++ 표준 문서도 BNF 계열 문법으로 기술되어 있다. 단, 변수 선언 여부나 타입 일치 같은 **의미(semantics)** 규칙은 BNF만으로 표현할 수 없다.

## 문제 2 · Solitaire Debugging `4점`

> [!QUIZ]
> 다음 코드는 Solitaire 게임에서 카드를 `top pile`에 올릴 수 있는지 확인하는 함수이다. 현재 코드는 top pile의 카드보다 **2만큼 큰 카드**만 올라가도록 작성되어 있다.
>
> 새로운 조건: *A card can be placed on the top pile only if its value is exactly 1 greater than the current top card.*
>
> ```python
> def can_move_to_top_pile(held_card, top_card):
>     held_value = held_card.value
>     top_value = top_card.value
>
>     if held_value == top_value + 2:
>         return True
>     else:
>         return False
> ```
>
> (1) 조건에 맞지 않는 부분을 찾아 쓰시오. `2점`
>
> (2) 새로운 조건에 맞게 코드를 수정하시오. `2점`

> [!ANSWER]
> **(1)** `if held_value == top_value + 2:` — 2만큼 큰 카드만 허용하므로 조건과 다르다. (예: top이 5일 때 6은 거부되고 7이 허용됨)
>
> **(2)**
>
> ```python
> def can_move_to_top_pile(held_card, top_card):
>     held_value = held_card.value
>     top_value = top_card.value
>
>     if held_value == top_value + 1:
>         return True
>     else:
>         return False
> ```
>
> 더 간단히 `return held_value == top_value + 1`로 써도 된다. `>=`나 `>`로 바꾸면 "exactly 1 greater"를 만족하지 못하므로 오답이다.

## 문제 3 · Knight Move `4점`

8 × 8 체스판의 각 칸은 `0`부터 `63`까지 index로 표현된다.

```text
 0   1   2   3   4   5   6   7
 8   9  10  11  12  13  14  15
16  17  18  19  20  21  22  23
24  25  26  27  28  29  30  31
32  33  34  35  36  37  38  39
40  41  42  43  44  45  46  47
48  49  50  51  52  53  54  55
56  57  58  59  60  61  62  63
```

```c
row = index / 8;
col = index % 8;

int row_moves[8] = {-2, -2, -1, -1,  1, 1,  2, 2};
int col_moves[8] = {-1,  1, -2,  2, -2, 2, -1, 1};
```

> [!QUIZ]
> (1) 나이트가 index `27`에 있을 때 한 번에 이동할 수 있는 모든 index를 쓰시오. `2점`
>
> (2) 나이트가 index `6`에 있을 때 이동할 수 있는 모든 index를 쓰시오. 또한 index에 고정된 값(+6, +10, +15, +17 등)만 더해서 이동 위치를 구하면 어떤 문제가 생기는지 설명하시오. `2점`

> [!HINT 1]
> index를 (row, col)로 바꾼 뒤 8가지 이동을 더하고, `0 ≤ row < 8`, `0 ≤ col < 8`인지 확인한 다음 `row × 8 + col`로 되돌리세요.

> [!ANSWER]
> **(1)** 27 → (row 3, col 3). 8방향 모두 판 안에 있다.
>
> | 이동 (dr, dc) | 새 위치 | index |
> |---|---|---:|
> | (−2, −1) | (1, 2) | 10 |
> | (−2, +1) | (1, 4) | 12 |
> | (−1, −2) | (2, 1) | 17 |
> | (−1, +2) | (2, 5) | 21 |
> | (+1, −2) | (4, 1) | 33 |
> | (+1, +2) | (4, 5) | 37 |
> | (+2, −1) | (5, 2) | 42 |
> | (+2, +1) | (5, 4) | 44 |
>
> 답: **10, 12, 17, 21, 33, 37, 42, 44**
>
> **(2)** 6 → (row 0, col 6). row가 음수가 되는 4방향과 col이 8이 되는 (+1, +2)는 판 밖이다.
>
> 답: **12** (1, 4), **21** (2, 5), **23** (2, 7)
>
> index에 고정값만 더하면 **열 경계를 넘어 다음 줄로 넘어가는(wrap-around)** 오류가 생긴다. 예를 들어 (+1, +2)는 index +10인데 `6 + 10 = 16`은 (2, 0)으로, 실제로는 갈 수 없는 왼쪽 끝 칸이다. 따라서 row와 col을 **따로** 계산하고 각각 범위를 검사해야 한다.

## 문제 4 · Taxi Geometry `4점`

> [!QUIZ]
> Taxi geometry에서는 두 점 사이의 거리를 직선거리로 계산하지 않고, 가로 이동 거리와 세로 이동 거리를 더해 계산한다.
>
> 두 점 `A = (x1, y1)`, `B = (x2, y2)`가 주어졌을 때 taxi distance를 어떻게 계산하는지 식과 알고리즘으로 설명하시오. 그리고 `A = (1, 2)`, `B = (4, −2)`의 taxi distance와 일반(Euclidean) 거리를 각각 구하시오.

> [!HINT 1]
> 좌표 차이가 음수일 수 있으므로 절댓값이 필요합니다.

> [!ANSWER]
> ```text
> d_taxi(A, B) = |x1 − x2| + |y1 − y2|
> ```
>
> ```text
> Get values for x1, y1, x2, y2
> Set dx to x1 − x2
> If dx < 0 then Set dx to −dx
> Set dy to y1 − y2
> If dy < 0 then Set dy to −dy
> Print dx + dy
> Stop
> ```
>
> 예: `|1 − 4| + |2 − (−2)| = 3 + 4 =` **7**
>
> Euclidean 거리는 `√(3² + 4²) =` **5**. 택시는 격자 도로를 따라 가로·세로로만 움직이므로 항상 직선거리 이상이다.

## 문제 5 · Turing Machine `6점`

Instruction 형식: `(current state, current symbol, next symbol, next state, direction)` — 적용할 instruction이 없으면 기계는 멈춘다(halt). `b`는 blank.

### 5-1) Pattern Output `2점`

> [!QUIZ]
> 입력 tape에 `1`로만 이루어진 문자열이 주어진다. 왼쪽부터 홀수 번째 `1`은 그대로 두고, 짝수 번째 `1`은 `0`으로 바꾸는 튜링 머신을 작성하시오. 헤드는 가장 왼쪽 `1`에서 시작한다.
>
> ```text
> 입력: 111111
> 출력: 101010
> ```

> [!HINT 1]
> "지금이 홀수 번째인가, 짝수 번째인가"만 기억하면 됩니다. 상태 두 개를 번갈아 쓰세요.

> [!ANSWER]
> ```text
> (1, 1, 1, 2, R)    -- 홀수 번째: 그대로 두고 상태 2로
> (2, 1, 0, 1, R)    -- 짝수 번째: 0으로 바꾸고 상태 1로
> ```
>
> blank를 만나면 해당하는 instruction이 없으므로 자동으로 halt한다. (명시적으로 `(1, b, b, 3, R)`, `(2, b, b, 3, R)`처럼 halt 상태를 둬도 된다.)
>
> `111111` 추적: 상태 1→2→1→2→1→2 순으로 1, 0, 1, 0, 1, 0을 쓴다 → `101010`. 입력이 홀수 길이(`11111`)여도 `10101`로 올바르게 동작한다.

### 5-2) State Diagram `2점`

> [!QUIZ]
> 다음 instruction들로 이루어진 튜링 머신의 state diagram을 그리고, 이 기계가 무엇을 하는지 설명하시오. 헤드는 unary 수의 가장 왼쪽 `1`에서 시작한다.
>
> ```text
> (1, 1, 1, 1, R)
> (1, b, 1, 2, L)
> (2, 1, 1, 2, L)
> (2, b, b, 3, R)
> ```

> [!HINT 1]
> 각 상태를 원으로, 각 instruction을 `읽은 기호 / 쓸 기호, 방향` 라벨이 붙은 화살표로 그립니다. 같은 상태로 돌아오는 instruction은 자기 자신으로 가는 고리(loop)입니다.

> [!ANSWER]
> ```text
>           1/1,R             1/1,L
>            ↺                 ↺
> start ──▶ (1) ───b/1,L───▶ (2) ───b/b,R───▶ ((3))
> ```
>
> | 화살표 | 의미 |
> |---|---|
> | 1 → 1 (loop) `1/1,R` | 1을 읽는 동안 오른쪽으로 이동 |
> | 1 → 2 `b/1,L` | 끝의 blank에 1을 쓰고 왼쪽으로 |
> | 2 → 2 (loop) `1/1,L` | 1을 읽는 동안 왼쪽으로 되돌아감 |
> | 2 → 3 `b/b,R` | 왼쪽 blank에 도착하면 첫 1로 돌아와 멈춤 |
>
> 기능: unary 수 끝에 `1`을 하나 붙인다 → **n을 n + 1로 만드는 증가(increment) 기계**. 예: `111`(3) → `1111`(4). 마지막에 헤드는 다시 가장 왼쪽 1에 놓인다.

### 5-3) Unary Addition `2점`

> [!QUIZ]
> Unary 표현에서 숫자는 `1`의 개수로 나타낸다 (`111` = 3, `11` = 2). 다음 입력을 받아 출력을 만드는 튜링 머신의 핵심 아이디어를 설명하고 instruction을 작성하시오.
>
> ```text
> 입력: 111#11
> 출력: 11111
> ```

> [!HINT 1]
> 3 + 2 = 5입니다. `#`을 `1`로 바꾸면 1이 몇 개가 되나요?

> [!ANSWER]
> **아이디어:** `#`을 `1`로 바꿔 두 수를 이어 붙이면 1이 (m + n + 1)개가 되므로, 오른쪽 끝의 `1` 하나를 지운다.
>
> ```text
> (1, 1, 1, 1, R)    -- 첫 번째 수를 지나감
> (1, #, 1, 2, R)    -- #을 1로 바꿈
> (2, 1, 1, 2, R)    -- 두 번째 수를 지나감
> (2, b, b, 3, L)    -- 끝의 blank에서 한 칸 왼쪽으로
> (3, 1, b, 4, L)    -- 마지막 1을 지우고 halt (상태 4에는 instruction 없음)
> ```
>
> `111#11` → `111111` → 마지막 1 삭제 → `11111` (= 5)

## 문제 6 · Remove Duplicates from Array `6점`

> [!QUIZ]
> 다음 함수 `solution(data, n)`은 길이가 `n`인 배열 `data`에서 두 번 이상 나온 값의 중복을 제거하여, 각 값이 한 번씩만 남도록 하려고 한다.
>
> ```c
> void solution(int data[], int n) {
>     for (int i = 0; i < n; i++) {
>         for (int j = i + 1; j < n; j++) {
>             if (data[i] == data[j]) {
>                 for (int k = j; k < n - 1; k++) {
>                     data[k] = data[k + 1];
>                 }
>             }
>         }
>     }
> }
> ```
>
> (1) 다음 호출 후 배열 `data`의 n개 값을 쓰고, 모든 중복이 제거되었는지 판단하시오. 제거되지 않았다면 코드의 문제점을 모두 쓰시오. `3점`
>
> ```c
> int data[] = {1, 2, 2, 3, 3, 4, 5, 5, 5};
> solution(data, 9);
> ```
>
> (2) 중복을 더 효율적으로 제거할 수 있는 아이디어를 제시하고 시간복잡도를 비교하시오. 수도코드가 아니어도 된다. `3점`

> [!HINT 1]
> 원소를 왼쪽으로 한 칸 당긴 뒤 `n`은 바뀌나요? 그리고 당겨진 새 `data[j]`는 다시 검사되나요?

> [!HINT 2]
> 입력이 이미 정렬되어 있다면, 같은 값은 항상 붙어 있습니다.

> [!ANSWER]
> **(1)** 실행 후 배열: **`{1, 2, 3, 4, 5, 5, 5, 5, 5}`** → 중복이 제거되지 **않았다**.
>
> | i (값) | 동작 | 배열 |
> |---|---|---|
> | 1 (2) | j=2에서 일치 → 왼쪽으로 당김 | 1 2 3 3 4 5 5 5 **5** |
> | 2 (3) | j=3에서 일치 → 왼쪽으로 당김 | 1 2 3 4 5 5 5 **5 5** |
> | 4 (5) | j=5,6,7에서 당겨도 뒤가 전부 5라 변화 없음 | 1 2 3 4 5 5 5 5 5 |
>
> 문제점:
>
> 1. **`n`(유효 길이)을 줄이지 않는다.** 당긴 뒤 마지막 칸은 원래 값이 복사되어 남아 있으므로, 배열 끝이 마지막 값(5)으로 계속 채워진다. 호출한 쪽은 새 길이를 알 수 없다.
> 2. **당긴 뒤 `j`를 다시 검사하지 않는다.** 원소를 당기면 새 값이 `data[j]`에 들어오는데 바로 `j++`가 되어 건너뛴다. `n--`만 추가해도 `{5, 5, 5}`는 `{5, 5}`로 남는다.
>
> 수정: 일치하면 당긴 뒤 `n--; j--;`를 하고, 새 길이 `n`을 반환한다. 그래도 최악 시간복잡도는 **O(n³)** 이다.
>
> **(2)** 효율적인 아이디어
>
> - **정렬된 배열 → two pointers, O(n):** `write = 1`로 두고 `read`를 1부터 끝까지 이동하며 `data[read] ≠ data[write − 1]`일 때만 `data[write++] = data[read]`. 원소 이동이 없이 한 번에 끝나며 새 길이는 `write`이다. (copy-over / converging pointers처럼 이동 횟수를 줄이는 발상)
> - **정렬되지 않은 배열:** 먼저 정렬(O(n log n)) 후 위 방법을 쓰거나, 이미 본 값을 **해시 집합**에 기록하며 처음 보는 값만 남기기(평균 O(n)).
>
> | 방법 | 시간복잡도 |
> |---|---|
> | 주어진 코드(수정 후) | O(n³) |
> | 정렬 + two pointers | O(n log n) (이미 정렬이면 O(n)) |
> | 해시 집합 | 평균 O(n), 추가 메모리 O(n) |

## 문제 7 · 2D Matrix Transform `4점`

> [!QUIZ]
> 다음 함수와 배열 `A`를 보고 답하시오.
>
> ```c
> void transform(int A[4][4], int B[4][4]) {
>     for (int i = 0; i < 4; i++) {
>         for (int j = 0; j < 4; j++) {
>             B[j][i] = A[i][j];
>         }
>     }
> }
> ```
>
> ```text
> A =
>  1   2   3   4
>  5   6   7   8
>  9  10  11  12
> 13  14  15  16
> ```
>
> (1) 함수 실행 후 배열 `B`의 값을 쓰시오. `2점`
>
> (2) 이 함수가 어떤 기능을 수행하는지 설명하시오. `1점`
>
> (3) 배열 크기가 n × n일 때 시간복잡도를 쓰시오. `1점`

> [!ANSWER]
> **(1)**
>
> ```text
> B =
> 1   5   9  13
> 2   6  10  14
> 3   7  11  15
> 4   8  12  16
> ```
>
> **(2)** `A`의 i행 j열 값을 `B`의 j행 i열에 넣으므로 행과 열을 맞바꾸는 **전치 행렬(transpose)** 을 만든다. `A`의 각 행이 `B`의 각 열이 된다.
>
> **(3)** 이중 반복문이 n × n번 대입하므로 **Θ(n²)** (4 × 4에서는 16번).

## 문제 8 · BNF and Parse Tree `4점`

> [!QUIZ]
> 다음 BNF 문법을 보고 답하시오.
>
> ```text
> <identifier>     ::= <letter> <identifierbody>
> <identifierbody> ::= <symbol> <identifierbody> | <symbol>
> <symbol>         ::= <letter> | <number>
> <letter>         ::= a | b | c | ... | z        (소문자만, 대문자 없음)
> <number>         ::= 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
> ```
>
> (1) 이 문법이 어떤 문자열을 표현하는지 설명하고, 가능한 예와 불가능한 예를 각각 하나 이상 쓰시오. `2점`
>
> (2) 문자열 `BC4AD`가 이 문법으로 parsing 가능한지 판단하시오. 가능하면 parse tree를 그리고, 불가능하면 이유를 쓰시오. `2점`

> [!HINT 1]
> `<identifierbody>`는 비어 있을 수 없습니다. 최소 몇 글자가 필요할까요?

> [!HINT 2]
> `<letter>`와 `<number>`에 포함되지 않은 문자를 확인하세요.

> [!ANSWER]
> **(1)** **소문자로 시작**하고, 그 뒤에 소문자 또는 숫자(1~9)가 **한 개 이상** 오는 identifier, 즉 길이 2 이상의 문자열이다.
>
> | 가능 | 불가능 | 이유 |
> |---|---|---|
> | `ab`, `x1`, `bc4ad` | `a` | identifierbody가 최소 1개의 symbol을 요구하므로 길이 1은 안 됨 |
> | | `1ab` | 숫자로 시작할 수 없음 |
> | | `a0` | `0`은 `<number>`에 없음 |
> | | `Ab` | 대문자 없음 |
>
> **(2)** **parsing 불가능.** 첫 글자 `B`는 대문자인데 `<letter>`는 소문자만 포함하므로 `<identifier> ::= <letter> …`의 첫 단계부터 실패한다. (`C`, `A`, `D`도 마찬가지)
>
> 참고로 소문자 `bc4ad`였다면 다음과 같이 parsing된다.
>
> ```text
> <identifier>
> ├── <letter> ── b
> └── <identifierbody>
>     ├── <symbol> ── <letter> ── c
>     └── <identifierbody>
>         ├── <symbol> ── <number> ── 4
>         └── <identifierbody>
>             ├── <symbol> ── <letter> ── a
>             └── <identifierbody>
>                 └── <symbol> ── <letter> ── d
> ```

## 문제 9 · Matrix Cipher `4점`

> [!QUIZ]
> 행렬 기반 block cipher에서 encryption matrix `A`와 decryption matrix `B`를 다음과 같이 사용하려고 한다.
>
> ```text
> A = | 2  3 |        B = | 4  3 |
>     | 1  4 |            | 1  2 |
> ```
>
> 두 행렬이 encryption / decryption에 적합한지 판단하고, 이유를 계산과 함께 설명하시오.

> [!HINT 1]
> 평문 벡터 `P`를 `C = A·P`로 암호화했다면, `B·C = P`가 되려면 `B·A`가 무엇이어야 할까요?

> [!ANSWER]
> **적합하지 않다.** 복호화 행렬은 암호화 행렬의 **역행렬**이어야 한다. 즉 `A·B = B·A = I`(단위행렬)이어야 한다.
>
> ```text
> A·B = | 2·4 + 3·1   2·3 + 3·2 |  =  | 11  12 |  ≠  I
>       | 1·4 + 4·1   1·3 + 4·2 |     |  8  11 |
> ```
>
> 올바른 역행렬: `det(A) = 2·4 − 3·1 = 5 ≠ 0`이므로 역행렬이 존재한다.
>
> ```text
> A⁻¹ = (1/5) · |  4  −3 |
>               | −1   2 |
> ```
>
> 주어진 `B`는 원소 위치는 비슷하지만 **부호(−)와 1/det을 빠뜨린** 형태이다.
>
> 알파벳 26자를 쓰는 mod 26 Hill cipher라면 `5⁻¹ ≡ 21 (mod 26)`이므로 `A⁻¹ ≡ | 6 15 ; 5 16 | (mod 26)`이고, 이때도 `A·B ≡ | 11 12 ; 8 11 | ≢ I`라 적합하지 않다. 암호화 행렬은 `det(A)`가 26과 서로소여야 역행렬을 가진다.

## 문제 10 · Dijkstra Algorithm `8점`

다음 무방향 weighted graph에서 시작 노드는 `u`이다.

| Edge | u–x | u–w | x–w | x–y | w–y | w–z | y–z | z–i | y–i |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Weight | 2 | 5 | 1 | 3 | 2 | 4 | 1 | 2 | 6 |

> [!QUIZ]
> (1) Dijkstra algorithm의 초기 distance table을 작성하시오. `1점`
>
> (2) 각 단계에서 선택되는 노드와 distance 값을 표로 작성하시오. `5점`
>
> | Step | Selected | u | x | w | y | z | i |
> |---|---|---|---|---|---|---|---|
> | 0 | (초기) | | | | | | |
> | 1 | | | | | | | |
> | 2 | | | | | | | |
> | 3 | | | | | | | |
> | 4 | | | | | | | |
> | 5 | | | | | | | |
> | 6 | | | | | | | |
>
> (3) 시작 노드 `u`에서 각 노드까지의 최단거리와 경로를 쓰시오. `2점`

> [!HINT 1]
> 매 단계마다 **아직 확정되지 않은 노드 중 distance가 가장 작은 노드**를 선택하고, 그 이웃의 distance를 `min(기존 값, 선택 노드 distance + edge weight)`로 갱신합니다.

> [!HINT 2]
> `u → w`는 직접 가면 5지만 `x`를 거치면 2 + 1 = 3입니다.

> [!ANSWER]
> **(1)** `u = 0`, 나머지 `x, w, y, z, i = ∞`
>
> **(2)** (굵은 값 = 이번 단계에서 확정)
>
> | Step | Selected | u | x | w | y | z | i |
> |---|---|---|---|---|---|---|---|
> | 0 | (초기) | 0 | ∞ | ∞ | ∞ | ∞ | ∞ |
> | 1 | u | **0** | 2 | 5 | ∞ | ∞ | ∞ |
> | 2 | x | 0 | **2** | 3 | 5 | ∞ | ∞ |
> | 3 | w | 0 | 2 | **3** | 5 | 7 | ∞ |
> | 4 | y | 0 | 2 | 3 | **5** | 6 | 11 |
> | 5 | z | 0 | 2 | 3 | 5 | **6** | 8 |
> | 6 | i | 0 | 2 | 3 | 5 | 6 | **8** |
>
> - Step 2: w = min(5, 2+1) = 3, y = 2+3 = 5
> - Step 3: y = min(5, 3+2) = 5 (변화 없음), z = 3+4 = 7
> - Step 4: z = min(7, 5+1) = 6, i = 5+6 = 11
> - Step 5: i = min(11, 6+2) = 8
>
> **(3)**
>
> | Node | Distance | 경로 |
> |---|---:|---|
> | u | 0 | u |
> | x | 2 | u → x |
> | w | 3 | u → x → w |
> | y | 5 | u → x → y (u → x → w → y도 5) |
> | z | 6 | u → x → y → z |
> | i | 8 | u → x → y → z → i |

## 문제 11 · XOR in DES `4점`

> [!QUIZ]
> DES에서는 각 round마다 데이터 비트와 key 비트를 XOR 연산으로 섞는다.
>
> (1) 다음 두 6-bit string에 XOR을 적용한 결과를 쓰시오. `2점`
>
> ```text
>   101101
> ⊕ 110011
> ```
>
> (2) (1)의 결과에 다시 `110011`을 XOR하면 무엇이 나오는지 쓰고, 이 성질이 암호화·복호화에서 왜 유용한지 설명하시오. `2점`

> [!HINT 1]
> XOR은 두 비트가 **다르면 1, 같으면 0**입니다.

> [!ANSWER]
> **(1)**
>
> ```text
>   101101
> ⊕ 110011
> --------
>   011110
> ```
>
> **(2)**
>
> ```text
>   011110
> ⊕ 110011
> --------
>   101101   ← 원래 값으로 복원
> ```
>
> `(P ⊕ K) ⊕ K = P ⊕ (K ⊕ K) = P ⊕ 0 = P`이므로, **같은 key로 한 번 더 XOR하면 원문이 복원**된다. 그래서 암호화와 복호화에 같은 연산과 같은 key를 쓸 수 있고(대칭 키 암호), 하드웨어로 매우 빠르게 계산할 수 있다.
