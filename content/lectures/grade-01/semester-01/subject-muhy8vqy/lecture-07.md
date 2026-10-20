---
title: "7강 시스템 소프트웨어와 어셈블리어"
description: "virtual machine, 교재 어셈블리 명령어 집합(Figure 6.5), 조건·반복 번역, 최댓값·최솟값 프로그램, 2-pass 어셈블러와 symbol table을 족보 유형 중심으로 정리합니다."
order: 7
published: true
tags:
  - 어셈블리어
  - 어셈블러
  - symbol table
objectives:
  - 교재 명령어 집합으로 대입·조건·반복 의사코드를 어셈블리어로 번역할 수 있다.
  - COMPARE의 비교 방향과 JUMPGT·JUMPEQ·JUMPLT의 의미를 정확히 쓸 수 있다.
  - 2-pass 어셈블러가 symbol table을 만드는 과정을 추적하고 기계어를 해석할 수 있다.
---

# 7강 시스템 소프트웨어와 어셈블리어

## 학습 흐름

```text
naked machine(2진수로만 대화) → system software가 만든 virtual machine
        ↓
assembly language: 기계어와 1:1, symbolic op code · symbolic address · pseudo-op
        ↓
명령어 집합(Figure 6.5) → 대입 · 조건 · 반복 번역 → 완성 프로그램(최댓값·최솟값)
        ↓
assembler: op code 표 검색 · pass 1(symbol table) · pass 2(object file) → loader
        ↓
실제 x86 어셈블리와 C 코드, 메모리 속 2진수
```

> [!EXAM]
> 중간 족보 문제 12(A, B 중 큰 값 출력)와 Sample Q3·Q4(K에 3 더하기, 100개 중 최댓값·최솟값)가 모두 이 강의입니다. 채점 포인트는 세 가지입니다.
> 1. **COMPARE X는 CON(X)와 R을 비교**한다 — 방향을 반대로 쓰면 분기가 뒤집힌다.
> 2. **.DATA는 HALT 뒤에** 둔다 — 앞에 두면 데이터가 명령으로 실행된다.
> 3. 상수(3, 1, 100…)도 **.DATA로 메모리에 만들어야** 쓸 수 있다.

---

## 1. naked machine과 virtual machine

| Naked machine (맨 하드웨어) | Virtual machine (시스템 소프트웨어 위) |
| --- | --- |
| 1 프로그램을 2진수로 작성 | 1 텍스트 편집기로 고급 언어 작성 |
| 2 명령을 한 칸씩 메모리에 넣음 | 2 폴더에 저장 |
| 3 시작 주소를 넣고 "go" 버튼 | 3 번역기로 2진수 변환 |
| 4 결과를 메모리에서 한 칸씩 2진수로 읽음 | 4 scheduler가 적재·실행, 5 I/O 시스템이 결과 출력 |

> [!CONCEPT]
> **System software** — 컴퓨터 자원을 관리하고 사용자와 하드웨어 사이에서 **중개자(intermediary)** 역할을 하는 프로그램들. 사용자가 보는 **virtual machine(virtual environment)** 을 만들어 하드웨어의 복잡함을 숨긴다.

| 구성 요소 | 하는 일 |
| --- | --- |
| **Operating system** | 중심 시스템 소프트웨어. 사용자와 대화하고 다른 프로그램을 시작 |
| **GUI** ("gooey") | OS 등에 대한 시각적 인터페이스 |
| I/O systems | 여러 장치와 통신 |
| Language services | 고급 언어 지원(assembler, compiler, interpreter) |
| Memory managers | 프로그램에 메모리 할당 |
| Information managers | 대용량 저장 장치(파일) 조직 |
| **Scheduler** | 실행을 기다리는 프로그램 관리 |
| Utilities | 도구, 프로그램 라이브러리 |

## 2. 어셈블리어 (assembly language)

> [!CONCEPT]
> - 명령이 기계어와 **1:1 대응** (고급 언어 한 줄은 기계어 여러 줄)
> - **Symbolic op code**: `0000` 대신 `LOAD`
> - **Symbolic address**: `000000001001` 대신 `X`
> - **Pseudo-op**: 어셈블러에게 주는 지시(기계어로 바뀌지 않음) — `.BEGIN`, `.END`, `.DATA`
> - **low-level** 언어. Java, C, Python은 **high-level** 언어
>
> 장점: **명확성·가독성·유지보수성**, 메모리의 다른 위치에 놓을 수 있음(주소를 기호로 쓰므로), 데이터를 사람이 읽는 형태로 씀

```text
source program ─(assembler)→ object program ─(loader)→ memory ─→ hardware 실행
 (어셈블리어)                    (기계어)
```

한 줄의 형식:

```text
label:    op code   address field   -- comment
NEXTSTEP: LOAD      X               -- Put X into register R
```

- **label**: 이 명령 위치의 이름(선택)
- **comment**: `--` 뒤. 어셈블러가 무시

## 3. 명령어 집합 (Figure 6.5) — 시험지에 주어짐

레지스터는 **R 하나**, 조건 코드는 **GT, EQ, LT**. CON(X) = 메모리 X의 내용.

| op code | 명령 | 의미 |
| --- | --- | --- |
| 0000 | LOAD X | CON(X) → R |
| 0001 | STORE X | R → CON(X) |
| 0010 | CLEAR X | 0 → CON(X) |
| 0011 | ADD X | R + CON(X) → R |
| 0100 | INCREMENT X | CON(X) + 1 → CON(X) |
| 0101 | SUBTRACT X | R − CON(X) → R |
| 0110 | DECREMENT X | CON(X) − 1 → CON(X) |
| 0111 | COMPARE X | CON(X) > R 이면 GT = 1, = 이면 EQ = 1, < 이면 LT = 1 |
| 1000 | JUMP X | 다음 명령을 X에서 가져옴 |
| 1001 | JUMPGT X | GT = 1이면 X로 |
| 1010 | JUMPEQ X | EQ = 1이면 X로 |
| 1011 | JUMPLT X | LT = 1이면 X로 |
| 1100 | JUMPNEQ X | EQ = 0이면 X로 |
| 1101 | IN X | 정수를 입력받아 X에 저장 |
| 1110 | OUT X | X의 값을 10진수로 출력 |
| 1111 | HALT | 실행 중지 |

> [!TRAP]
> **COMPARE의 방향**이 가장 많이 틀리는 곳입니다.
> - `LOAD A` 후 `COMPARE B` → **B와 A를 비교**: B > A이면 GT, B = A이면 EQ, B < A이면 LT
> - 즉 GT는 "**COMPARE 뒤에 쓴 쪽이 더 크다**"입니다.
>
> 또한 `ADD`, `SUBTRACT`는 결과가 **R**에 남고, `INCREMENT`, `DECREMENT`, `CLEAR`는 **메모리**를 바로 바꾸며 R은 그대로입니다.

### 프로그램 구조 (Figure 6.6)

```text
.BEGIN          -- 첫 줄
   …            -- 명령어들
   HALT         -- 실행 종료
   …            -- .DATA 들은 HALT 뒤에
.END            -- 마지막 줄
```

```text
COUNTER:  .DATA  0       -- 이름이 COUNTER 인 칸에 0
X:        .DATA  12
```

## 4. 기본 번역 패턴

### 대입: x = y + 3 (슬라이드 예제)

```text
        LOAD    Y          -- R ← y
        ADD     THREE      -- R ← y + 3
        STORE   X          -- x ← R
        …
X:      .DATA   0
Y:      .DATA   5
THREE:  .DATA   3          -- 상수 3 도 메모리에 만든다
```

> [!QUIZ]
> "Add 3 to the value of K"를 어셈블리어로 번역하시오. 필요한 .DATA를 모두 쓰시오. (Sample Q3)

> [!ANSWER]
> ```text
>         LOAD    K
>         ADD     THREE
>         STORE   K
>         HALT
> K:      .DATA   0
> THREE:  .DATA   3
> ```
> `ADD 3`이라고 쓰면 **숫자 3이 아니라 메모리 3번지의 내용**을 더한다. 이 명령어 집합에는 즉시값(immediate)이 없으므로 상수도 `.DATA`로 만들어야 한다. `INCREMENT K`를 세 번 써도 같은 결과다.

> [!QUIZ]
> 다음 두 코드는 무엇이 다른가?
>
> ```text
> (1) LOAD X        (2) INCREMENT X
>     ADD  TWO          INCREMENT X
> ```

> [!ANSWER]
> (1)은 **R = X + 2**가 되지만 X 자체는 그대로다(STORE가 없음). (2)는 **메모리의 X가 X + 2**가 되고 R은 바뀌지 않는다.

### 조건문: If K > 10 then output K

```text
        LOAD    TEN        -- R ← 10
        COMPARE K          -- K 와 10 비교: K > 10 이면 GT
        JUMPGT  PRINTK
        JUMP    ENDIF
PRINTK: OUT     K
ENDIF:  HALT
K:      .DATA   0
TEN:    .DATA   10
```

### If/Else: If K > L then (output K, K++) else (output L, L++)

```text
        LOAD    L          -- R ← L
        COMPARE K          -- K > L 이면 GT
        JUMPGT  THEN
        OUT     L          -- else 부분
        INCREMENT L
        JUMP    ENDIF      -- then 부분을 건너뜀
THEN:   OUT     K
        INCREMENT K
ENDIF:  HALT
K:      .DATA   0
L:      .DATA   0
```

> [!TRAP]
> else 부분 끝의 `JUMP ENDIF`를 빼면 else를 실행한 뒤 **then 부분까지** 실행됩니다. 고급 언어의 if/else는 어셈블리에서 "조건 점프 + 무조건 점프" 두 개로 만들어집니다.

### 반복: Set K to 1, 반복해서 K를 출력하고 K++, K > 100이면 끝

```text
        LOAD    ONE
        STORE   K          -- K ← 1
LOOP:   LOAD    HUNDRED    -- R ← 100
        COMPARE K          -- K > 100 이면 GT
        JUMPGT  DONE
        OUT     K
        INCREMENT K
        JUMP    LOOP
DONE:   HALT
K:      .DATA   0
ONE:    .DATA   1
HUNDRED: .DATA  100
```

### 반복: while a > b do (print a, a = a − 2)

```text
        IN      A
        IN      B
LOOP:   LOAD    A          -- R ← a
        COMPARE B          -- b 와 a 비교
        JUMPGT  ENDLOOP    -- b > a 이면 끝
        JUMPEQ  ENDLOOP    -- b = a 이면 끝   (즉 a ≤ b 이면 끝)
        OUT     A
        LOAD    A
        SUBTRACT TWO
        STORE   A
        JUMP    LOOP
ENDLOOP: HALT
A:      .DATA   0
B:      .DATA   0
TWO:    .DATA   2
```

입력 10, 3 → 출력 10 8 6 4

> [!NOTE]
> 슬라이드에는 같은 자리에 `JUMPLT`/`JUMPEQ`로 적혀 있는데, Figure 6.5의 정의(CON(X)와 R 비교)를 그대로 적용하면 `LOAD A; COMPARE B; JUMPLT`는 **b < a일 때** 빠져나가므로 반복 조건이 뒤집힙니다. 시험에서는 주어진 명령어 표의 정의를 그대로 적용해 위처럼 쓰세요. **"while 조건이 거짓일 때 루프 밖으로 점프"** 가 기본 틀입니다.

> [!QUIZ]
> Set K to (L + 1) − (M + N) 을 번역하시오.

> [!ANSWER]
> ```text
>         LOAD    M
>         ADD     N          -- R ← M + N
>         STORE   TEMP       -- 잠시 보관
>         LOAD    L
>         ADD     ONE        -- R ← L + 1
>         SUBTRACT TEMP      -- R ← (L + 1) − (M + N)
>         STORE   K
>         HALT
> K:      .DATA   0
> L:      .DATA   0
> M:      .DATA   0
> N:      .DATA   0
> TEMP:   .DATA   0
> ONE:    .DATA   1
> ```
> 레지스터가 R 하나뿐이라 중간 결과를 **임시 메모리(TEMP)** 에 저장해야 한다. 5장 연습 17 "x = y + 19가 왜 번거로운가"의 답도 같다: 상수 19를 담은 칸을 따로 만들어야 하기 때문.

## 5. 족보 유형: 완성 프로그램 쓰기

### 두 수 중 큰 값 출력 (중간 족보 문제 12)

```text
         IN      A
         IN      B
         LOAD    A          -- R ← A
         COMPARE B          -- B > A 이면 GT
         JUMPGT  PRINTB
         OUT     A          -- 아니면 A 출력
         JUMP    DONE
PRINTB:  OUT     B
DONE:    HALT
A:       .DATA   0
B:       .DATA   0
```

### 100개 정수의 최댓값과 최솟값 (Sample Q4 = 교재 연습 13)

> [!QUIZ]
> 정수 100개를 하나씩 입력받아 가장 큰 값과 가장 작은 값을 출력하는 완전한 어셈블리 프로그램을 쓰시오(필요한 pseudo-op 모두 포함).

> [!HINT 1]
> 첫 번째 수로 MAX와 MIN을 모두 초기화하고, 나머지 99개를 루프에서 처리합니다. 개수를 세는 COUNT와 상수 100, 1이 필요합니다.

> [!HINT 2]
> `STORE`는 R을 바꾸지 않습니다. MAX를 갱신한 뒤에도 R에는 방금 읽은 수가 남아 있으니 바로 `COMPARE MIN`을 할 수 있습니다.

> [!ANSWER]
> ```text
>         .BEGIN
>         IN      NUM            -- 첫 번째 수
>         LOAD    NUM
>         STORE   MAX            -- MAX ← 첫 수
>         STORE   MIN            -- MIN ← 첫 수
>         LOAD    ONE
>         STORE   COUNT          -- 읽은 개수 = 1
> LOOP:   LOAD    COUNT
>         COMPARE HUNDRED        -- 100 과 COUNT 비교
>         JUMPEQ  DONE           -- 100개 다 읽었으면 끝
>         IN      NUM
>         INCREMENT COUNT
>         LOAD    NUM            -- R ← NUM
>         COMPARE MAX            -- MAX > NUM 이면 GT
>         JUMPGT  CHKMIN         -- 최댓값 갱신 불필요
>         STORE   MAX            -- MAX ← NUM
> CHKMIN: COMPARE MIN            -- MIN < NUM 이면 LT  (R 은 여전히 NUM)
>         JUMPLT  LOOP           -- 최솟값 갱신 불필요
>         STORE   MIN            -- MIN ← NUM
>         JUMP    LOOP
> DONE:   OUT     MAX
>         OUT     MIN
>         HALT
> NUM:    .DATA   0
> MAX:    .DATA   0
> MIN:    .DATA   0
> COUNT:  .DATA   0
> ONE:    .DATA   1
> HUNDRED: .DATA  100
>         .END
> ```
> 체크 포인트
> - MAX·MIN을 0으로 시작하면 모든 입력이 음수(또는 양수)일 때 틀린다 → **첫 입력으로 초기화**
> - 루프는 99번 돈다(COUNT 1 → 100). 처음에 COUNT = 0으로 두고 100번 읽으면 첫 수를 중복 처리하게 된다.
> - 무작위 정수 100개로 200번 시뮬레이션해 결과가 실제 max·min과 같음을 확인한 코드다.

### 음이 아닌 수의 합 (Figure 6.8)과 그 변형

```text
        .BEGIN
        CLEAR   SUM            -- (0) sum ← 0
        IN      N              -- (1) 첫 입력
AGAIN:  LOAD    ZERO           -- (2) R ← 0
        COMPARE N              -- (3) N < 0 이면 LT
        JUMPLT  NEG            -- (4)
        LOAD    SUM            -- (5)
        ADD     N              -- (6)
        STORE   SUM            -- (7) sum ← sum + N
        IN      N              -- (8) 다음 입력
        JUMP    AGAIN          -- (9)
NEG:    OUT     SUM            -- (10) 음수(sentinel)를 만나면 출력
        HALT                   -- (11)
SUM:    .DATA   0              -- (12)
N:      .DATA   0              -- (13)
ZERO:   .DATA   0              -- (14)
        .END
```

> [!QUIZ]
> (1) Figure 6.8의 `CLEAR SUM`과 `LOAD ZERO`는 꼭 필요한가?
>
> (2) 이 프로그램을 0에서 멈추고, 양수의 합과 음수의 합을 따로 출력하도록 고치시오. (입력 12, −2, 14, 1, −7, 0 → 27, −9)

> [!ANSWER]
> (1) `CLEAR SUM`: `SUM: .DATA 0`이 이미 0으로 초기화하므로 **한 번만 실행할 때는 없어도 된다.** 하지만 메모리를 다시 적재하지 않고 재실행하면 이전 합이 남으므로 두는 것이 안전하다. `LOAD ZERO`: COMPARE는 **R과** 비교하므로 매 회차 R을 0으로 만들어야 한다. 루프 안에서 R이 SUM으로 바뀌므로 **반드시 필요**하다.
>
> (2)
> ```text
>         CLEAR   POS
>         CLEAR   NEGS
> LOOP:   IN      N
>         LOAD    ZERO
>         COMPARE N              -- N 과 0 비교
>         JUMPEQ  DONE           -- N = 0 → 끝
>         JUMPLT  ISNEG          -- N < 0
>         LOAD    POS
>         ADD     N
>         STORE   POS
>         JUMP    LOOP
> ISNEG:  LOAD    NEGS
>         ADD     N
>         STORE   NEGS
>         JUMP    LOOP
> DONE:   OUT     POS
>         OUT     NEGS
>         HALT
> POS:    .DATA   0
> NEGS:   .DATA   0
> N:      .DATA   0
> ZERO:   .DATA   0
> ```

## 6. 명령 하나하나의 효과

> [!QUIZ]
> 레지스터 R = 13, 메모리 60 = 472, 61 = −1일 때, 각 명령을 **처음 상태에서 하나씩** 실행한 결과를 쓰시오.
>
> (1) LOAD 60 (2) STORE 60 (3) ADD 60 (4) COMPARE 61 (5) IN 61 (사용자가 50 입력) (6) OUT 61

> [!ANSWER]
> | 명령 | R | 60 | 61 | 비고 |
> | --- | ---: | ---: | ---: | --- |
> | LOAD 60 | **472** | 472 | −1 | |
> | STORE 60 | 13 | **13** | −1 | |
> | ADD 60 | **485** | 472 | −1 | |
> | COMPARE 61 | 13 | 472 | −1 | −1 < 13 → **LT = 1**, GT = EQ = 0 |
> | IN 61 | 13 | 472 | **50** | |
> | OUT 61 | 13 | 472 | −1 | 화면에 **−1** 출력 |

> [!QUIZ]
> 메모리 79에 +6이 있고 기호 Z가 79번지를 뜻한다. 각 명령 뒤 R의 값은? (1) LOAD 79 (2) LOAD 6 (3) LOAD Z (4) LOAD Z + 1

> [!ANSWER]
> (1) **6** (2) 숫자 6이 아니라 **메모리 6번지의 내용** (3) **6** (Z = 79) (4) **80번지의 내용**
>
> 주소 필드는 항상 **주소**다. LOAD 6은 6을 넣는 명령이 아니다.

## 7. 어셈블러: 번역과 적재

어셈블러가 하는 일

1. **symbolic op code → 2진 op code** — op code 표를 찾아 바꿈. 표를 정렬해 두고 **이진 탐색**(3장)으로 찾음
2. **symbolic label → 메모리 주소**
3. pseudo-op 처리 (.DATA → 2진 값)
4. 기계어를 담은 **object file** 작성

**Loader**는 object file의 명령을 메모리에 놓고 하드웨어가 실행하게 합니다.

### 왜 두 번 읽는가 (two passes)

`JUMPGT DONE`을 만났을 때 DONE은 아직 **아래에 나오지 않아** 주소를 모릅니다(forward reference). 그래서

| Pass | 하는 일 |
| --- | --- |
| **Pass 1** | **location counter**로 각 줄이 몇 번지인지 세며, label을 만나면 (label, 주소)를 **symbol table**에 추가 |
| **Pass 2** | op code를 2진수로 바꾸고, 주소 필드의 label을 symbol table에서 찾아 바꿈. .DATA 값을 2진수로. object file에 기록. 표에 없는 op code·label은 오류 |

> [!PROBLEM]
> Figure 6.10 프로그램의 pass 1
>
> | location | label | 코드 |
> | ---: | --- | --- |
> | 0 | LOOP | IN X |
> | 1 | | IN Y |
> | 2 | | LOAD X |
> | 3 | | COMPARE Y |
> | 4 | | JUMPGT DONE |
> | 5 | | OUT X |
> | 6 | | JUMP LOOP |
> | 7 | DONE | OUT Y |
> | 8 | | HALT |
> | 9 | X | .DATA 0 |
> | 10 | Y | .DATA 0 |
>
> Symbol table: **LOOP 0, DONE 7, X 9, Y 10**
>
> Pass 2 결과(op code 4비트 + 주소 12비트 = 16비트):
>
> | 주소 | 기계어 | 원래 명령 |
> | ---: | --- | --- |
> | 0 | 1101 000000001001 | IN X |
> | 2 | 0000 000000001001 | LOAD X |
> | 4 | 1001 000000000111 | JUMPGT DONE |
> | 6 | 1000 000000000000 | JUMP LOOP |
> | 8 | 1111 000000000000 | HALT |
>
> 이 프로그램은 두 수를 읽어 Y > X이면 Y를 출력하고 멈추고, 아니면 X를 출력하고 다시 두 수를 읽는다.

> [!QUIZ]
> 프로그램이 0번지부터 적재될 때 symbol table에 들어가는 AGAIN, ANS, X, ONE의 값은?
>
> ```text
>         .BEGIN
>         IN       X
>         LOAD     X
> AGAIN:  ADD      ANS
>         SUBTRACT ONE
>         STORE    ANS
>         OUT      ANS
>         JUMP     AGAIN
> ANS:    .DATA    0
> X:      .DATA    0
> ONE:    .DATA    1
>         .END
> ```

> [!ANSWER]
> .BEGIN은 pseudo-op이라 칸을 차지하지 않는다. IN(0), LOAD(1), **AGAIN = 2**, SUBTRACT(3), STORE(4), OUT(5), JUMP(6), **ANS = 7**, **X = 8**, **ONE = 9**.
>
> (참고: 이 프로그램에는 HALT가 없어 무한히 반복한다.)

> [!TRAP]
> - `LABEL: .DATA 3`과 `LABEL: .DATA 4`처럼 **같은 label을 두 번** 정의하면 오류이고, symbol table에 넣는 **pass 1**에서 발견됩니다.
> - `THREE: .DATA 2`는 이상해 보여도 **합법**입니다. label은 그냥 이름일 뿐 값과 관계가 없습니다.
> - Figure 6.8의 label 주소: AGAIN 2, NEG 10, SUM 12, N 13, ZERO 14.

### 기계어 해석과 데이터를 실행하는 사고

> [!QUIZ]
> (1) 0101001100001100 과 0011000000000111 을 어셈블리어로 바꾸시오.
>
> (2) 실수로 `.DATA 16387`이 명령으로 실행되면 무슨 일이 일어나는가?

> [!ANSWER]
> (1) `0101 | 001100001100` → **SUBTRACT 780**, `0011 | 000000000111` → **ADD 7**
>
> (2) 16387 = 16384 + 3 = `0100 000000000011` → **INCREMENT 3**. 메모리 3번지의 값(아마 어떤 명령)이 1 증가해 프로그램이 망가지고, 실행은 다음 칸으로 계속된다. 폰 노이만 구조에서는 **명령과 데이터가 같은 메모리에 같은 2진수로** 있어 구별되지 않기 때문이다(stored program). 그래서 .DATA는 HALT 뒤에 둔다.

> [!QUIZ]
> op code가 16개이고 프로그램이 100줄일 때, 1초에 50,000번 비교하는 어셈블러가 op code를 찾는 데 쓰는 최대 시간을 (1) 순차 탐색 (2) 이진 탐색으로 구하시오.

> [!ANSWER]
> (1) 줄당 최악 16번 × 100 = 1,600번 → **0.032초** (2) 줄당 최악 ⌊lg 16⌋ + 1 = 5번 × 100 = 500번 → **0.01초**
>
> op code가 300개, 프로그램이 50,000줄이면 차이가 훨씬 커진다(순차 300 vs 이진 9번/줄). 3장의 Θ(n) vs Θ(lg n)이 실제 시스템 소프트웨어에서 쓰이는 예.

## 8. 실제 어셈블리와 메모리 속 2진수 (슬라이드 부록)

C 코드와 x86 어셈블리의 대응(슬라이드 28쪽)도 같은 틀입니다.

| C | x86 | 교재 어셈블리로 보면 |
| --- | --- | --- |
| `while (i < 10) { … }` | `cmpl $10, %ecx` / `jge endwhile` / … / `jmp whileloop` | COMPARE + 조건 점프로 탈출 + JUMP로 복귀 |
| `if (i == 2) {…} else {…}` | `cmpl $2, %ecx` / `jne elsetrue` / … / `jmp endif` | 조건 점프 + 무조건 점프 |
| `i++` | `incl %eax` | INCREMENT |

자료형마다 메모리 크기가 정해져 있습니다: `bool` 1, `char` 1, `int` 4, `float` 4, `long` 8, `double` 8바이트(`string`은 길이에 따라 다름).

```c
int score1 = 72;   // 00000000 00000000 00000000 01001000
int score2 = 73;   // 00000000 00000000 00000000 01001001
int score3 = 33;   // 00000000 00000000 00000000 00100001
```

`hello, %s` 같은 C 프로그램도 컴파일러 → 어셈블리 → 기계어(0과 1)로 내려가고, 반대로 기계어에서 원래 의미를 추측하는 것이 **reverse engineering**입니다.

---

## 정리 카드

> [!FLASHCARD]
> Q: system software가 하는 두 가지 일은?
> A: 컴퓨터 자원을 관리하고, 사용자와 하드웨어 사이의 중개자로서 virtual machine을 만든다.

> [!FLASHCARD]
> Q: 어셈블리어가 기계어보다 나은 점 세 가지는?
> A: symbolic op code, symbolic address(label), pseudo-op으로 데이터를 사람 형태로 표현 → 명확성·가독성·유지보수성, 재배치 가능.

> [!FLASHCARD]
> Q: LOAD A 후 COMPARE B에서 GT = 1이 되는 조건은?
> A: B > A. COMPARE X는 CON(X)를 R과 비교한다.

> [!FLASHCARD]
> Q: 어셈블러가 두 번(two passes) 읽는 이유는?
> A: label이 정의되기 전에 쓰일 수 있어서(forward reference). pass 1에서 symbol table을 만들고 pass 2에서 번역한다.

> [!FLASHCARD]
> Q: .DATA를 HALT 뒤에 두는 이유는?
> A: 명령과 데이터가 같은 메모리에 같은 2진수로 저장되어, 앞에 두면 데이터가 명령으로 실행되기 때문이다.

> [!FLASHCARD]
> Q: source program, object program, assembler, loader의 관계는?
> A: assembler가 source(어셈블리어)를 object(기계어)로 번역하고, loader가 object를 메모리에 적재해 실행을 시작시킨다.
