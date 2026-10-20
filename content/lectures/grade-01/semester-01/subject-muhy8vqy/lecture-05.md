---
title: "5장 컴퓨터 구조: 폰 노이만 구조"
description: "메모리(MAR·MDR), ALU, 제어 장치(PC·IR), fetch-decode-execute, RISC와 CISC, 병렬 구조, RiSC-16 명령어 집합을 정리합니다."
order: 5
published: true
tags:
  - 폰 노이만 구조
  - MAR MDR
  - RISC CISC
  - RiSC-16
objectives:
  - 폰 노이만 구조의 세 가지 특징과 네 가지 서브시스템을 설명할 수 있다.
  - MAR 비트 수와 메모리 크기, 명령어 형식의 필드 크기를 계산할 수 있다.
  - fetch-decode-execute 사이클을 레지스터 이동으로 쓰고, RISC와 CISC를 비교할 수 있다.
---

# 5장 컴퓨터 구조: 폰 노이만 구조

## 학습 흐름

```text
4장의 게이트·회로 ─(abstraction)→ 기능 단위로 본 컴퓨터 = computer organization
        ↓
폰 노이만 구조: 4 subsystems + stored program + sequential execution
        ↓
Memory(MAR·MDR·decoder) → I/O(controller·interrupt) → ALU(register·bus·multiplexor) → Control unit(PC·IR·decoder)
        ↓
기계어 명령: op code + address → RISC vs CISC → fetch / decode / execute
        ↓
Von Neumann bottleneck → 병렬 처리 SIMD · MIMD      (부록) RiSC-16 명령어 집합
```

> [!EXAM]
> 중간 족보에서는 **RISC vs CISC 비교 서술**(문제 11)이 나왔습니다. 그 밖에 MAR 비트 수 ↔ 메모리 크기, **PC·IR·MAR·MDR 역할 구분**, fetch 단계 순서는 서술·단답으로 나오기 좋습니다. 숫자 계산은 모두 2의 거듭제곱입니다.

---

## 1. 추상화와 computer organization

> [!CONCEPT]
> **Computer organization** — 컴퓨터를 주요 **기능 단위(functional units)** 와 그것들이 어떻게 함께 일하는지의 관점에서 연구하는 분야.
>
> **Abstraction** — 수십억 개의 게이트를 일일이 보지 않고 "메모리", "ALU" 같은 덩어리로 보는 것. 추상화 없이는 큰 시스템을 공부하는 것이 사실상 불가능하다.

## 2. 폰 노이만 구조의 세 가지 특징

> [!DEFINITION]
> **Von Neumann architecture**
> 1. 네 개의 서브시스템: **memory**, **input/output**, **arithmetic/logic unit (ALU)**, **control unit**
> 2. **Stored program concept** — 프로그램(명령어)도 데이터와 똑같이 2진수로 **메모리에 저장**한다
> 3. **Sequential execution of instructions** — 명령어를 메모리에서 **한 번에 하나씩 순서대로** 가져와 실행한다

```text
 ═══════════════════════ bus ═══════════════════════
      │                 │                    │
 ┌────┴────┐   ┌────────┴─────────┐   ┌──────┴──────┐
 │ Memory  │   │ Processor        │   │ Input-Output│
 │         │   │ ┌──────────────┐ │   │             │
 │         │   │ │ Control unit │ │   │             │
 │         │   │ ├──────────────┤ │   │             │
 │         │   │ │     ALU      │ │   │             │
 │         │   │ └──────────────┘ │   │             │
 └─────────┘   └──────────────────┘   └─────────────┘
```

**Processor(CPU) = control unit + ALU**입니다.

## 3. 메모리

| 용어 | 뜻 |
| --- | --- |
| **Memory** | 실행 중인 명령어와 데이터를 저장·인출하는 기능 단위 |
| **RAM** (random access memory) | 모든 칸에 **같은 시간**에 접근(주소로 바로 감). 읽기·쓰기 가능 |
| **ROM** (read-only memory) | 제조할 때 정보가 미리 기록됨. 부팅 프로그램 등 바뀌면 안 되는 것 |
| **Cell** | 주소 하나가 가리키는 최소 단위. 크기 W(보통 8비트 = 1바이트) |
| **Address** vs **contents** | 주소(위치)와 그 안의 값을 반드시 구별 |
| **Fetch / Store** | 기본 연산 두 가지. 접근 시간 약 5~10 nsec |
| **MAR** (memory address register) | 가져오거나 저장할 칸의 **주소** |
| **MDR** (memory data register) | 가져온/저장할 **데이터 값** |

> [!CONCEPT]
> - 셀 크기 8비트 → 한 칸에 넣을 수 있는 가장 큰 부호 없는 정수 **11111111 = 255**
> - MAR이 **N비트**면 주소 범위 **0 ~ 2ᴺ − 1**, 즉 최대 메모리 크기 **2ᴺ**칸
> - MAR 크기는 메모리 **칸의 개수**를, MDR 크기는 **칸의 폭(W 또는 그 배수)** 을 결정

| N (MAR 비트) | 최대 메모리 2ᴺ |
| ---: | ---: |
| 16 | 65,536 (64K) |
| 20 | 1,048,576 (1M) |
| 24 | 16,777,216 (16M) |
| 32 | 4,294,967,296 (4G) |

### Fetch와 Store의 순서

```text
Fetch(address)                       Store(address, value)
1 Load the address into MAR          1 Load the address into MAR
2 Decode the address in MAR          2 Load the value into MDR
3 Copy the contents of that cell     3 Decode the address in MAR
  into MDR                           4 Store the contents of MDR into that cell
```

메모리는 **2차원(정사각형)** 으로 배치합니다(row major order). MAR의 앞 절반 비트는 **row decoder**, 뒤 절반은 **column decoder**로 보내 행선·열선 하나씩을 켜고, 둘이 만나는 칸을 고릅니다(Figure 5.7). decoder는 4장의 그 회로입니다.

> [!QUIZ]
> (1) 메모리가 각각 1백만, 1천만, 1억, 10억 바이트일 때 MAR은 최소 몇 비트여야 하는가?
>
> (2) 640 KB, 512 MB, 2 GB 메모리는 실제로 몇 칸인가? (1 K = 2¹⁰)

> [!ANSWER]
> (1) 2ᴺ ≥ 크기가 되는 가장 작은 N
>
> | 크기 | 2ᴺ | N |
> | --- | --- | ---: |
> | 1,000,000 | 2²⁰ = 1,048,576 | **20** |
> | 10,000,000 | 2²⁴ = 16,777,216 | **24** |
> | 100,000,000 | 2²⁷ = 134,217,728 | **27** |
> | 1,000,000,000 | 2³⁰ = 1,073,741,824 | **30** |
>
> (2) 640 × 2¹⁰ = **655,360**, 512 × 2²⁰ = **536,870,912**, 2 × 2³⁰ = **2,147,483,648**

> [!QUIZ]
> (1) 1 MB(2²⁰ 바이트)를 정사각형으로 배치하면 몇 × 몇이고, MAR은 몇 비트이며, 각 decoder는 몇 비트를 받아 몇 개의 출력선을 내는가?
>
> (2) MAR이 24비트이고 행 12비트·열 12비트로 나뉠 때 최대 메모리와 배치는?

> [!ANSWER]
> (1) 2²⁰ = 2¹⁰ × 2¹⁰ → **1,024 × 1,024**, MAR **20비트**, row·column decoder가 각각 **10비트**를 받아 **1,024개**의 출력선
>
> (2) 2²⁴ = **16,777,216칸**, **4,096 × 4,096**

> [!TRAP]
> 셀 폭 W = 64처럼 크게 하면 큰 정수를 한 칸에 담을 수 있지만(부호-크기면 ±(2⁶³ − 1)), 문자 하나(8비트)를 저장할 때도 64비트 칸을 통째로 써서 **공간이 낭비**됩니다. 셀이 작으면 반대로 큰 값을 여러 칸에 나눠 담아야 합니다.

### 캐시 (cache)

프로세서는 메모리보다 훨씬 빠릅니다. 최근에 쓴 데이터를 프로세서 가까이의 작고 빠른 **cache memory**에 두면, 프로그램은 같은 곳을 반복해서 쓰는 경향(**principle of locality**)이 있어 대부분의 접근이 cache에서 끝납니다.

## 4. 입출력 (I/O)

- I/O 장치는 메모리보다 수백만 배 느립니다. 프로세서가 기다리지 않도록 **I/O controller**(I/O buffer + control/logic)가 전송을 맡습니다.
- 전송이 끝나면 controller가 프로세서에게 **interrupt signal**을 보냅니다(Figure 5.9). 그동안 프로세서는 다른 일을 합니다.
- 저장 장치: **direct access**(디스크 — 위치로 바로 가지만 접근 시간이 위치마다 다름) vs **sequential access**(테이프 — 앞에서부터 차례로. 백업처럼 통째로 읽고 쓰는 용도에 적합)

## 5. ALU

| 구성 요소 | 뜻 |
| --- | --- |
| **Register** | 연산의 피연산자와 결과를 담는 고속 저장 칸 (주소가 없음) |
| **Bus** | 전기 신호가 지나가는 경로(선 묶음) |
| ALU circuitry | 덧셈·뺄셈·비교 등 회로 |

**Three-register ALU** (Figure 5.10): 레지스터 A, B → ALU → 레지스터 C. 실제 ALU는 모든 연산 회로를 동시에 돌리고, **multiplexor**가 op code에 맞는 결과 하나만 골라 출력합니다(4장 multiplexor의 쓰임).

비교 결과는 **condition code register**의 GT, EQ, LT 비트에 기록됩니다.

## 6. 제어 장치와 기계어

> [!CONCEPT]
> **Stored program** — 메모리에 2진수로 저장된 기계어 명령의 나열.
> **Control unit**의 일 — 명령을 **fetch**(가져오기), **decode**(해석), **execute**(실행)

### 기계어 명령 형식 (Figure 5.14)

```text
┌──────────────┬─────────────────┬─────────────────┬─────┐
│ Operation    │ Address field 1 │ Address field 2 │ ... │
│ code         │                 │                 │     │
└──────────────┴─────────────────┴─────────────────┴─────┘
```

- **Op code**: 연산마다 붙인 고유한 부호 없는 정수
- **Address field**: 연산이 사용할 값의 메모리 주소
- **Instruction set**: 프로세서가 실행할 수 있는 모든 연산의 집합

> [!QUIZ]
> IR이 op code 6비트, address-1 18비트, address-2 18비트로 되어 있다. (1) 구별할 수 있는 op code 수 (2) 최대 메모리 크기 (3) 명령어 하나의 바이트 수를 구하시오.

> [!ANSWER]
> (1) 2⁶ = **64개** (2) 주소 18비트 → 2¹⁸ = **262,144칸** (3) 6 + 18 + 18 = 42비트 → 바이트 단위로 올림하면 **6바이트**(5.25 → 6)

### 명령어의 네 가지 종류

| 종류 | 예 | 하는 일 |
| --- | --- | --- |
| Data transfer | LOAD, STORE, MOVE | 메모리 ↔ 레지스터 이동 |
| Arithmetic | ADD, SUBTRACT, AND, OR | ALU 연산 |
| Compare | COMPARE | 두 값을 비교해 GT/EQ/LT 설정 |
| Branch | JUMP, JUMPGT, JUMPEQ, JUMPLT | 다음에 실행할 명령 주소 변경 (조건·반복 구현) |

### RISC vs CISC — 족보 문제 11

> [!CONCEPT]
> | 구분 | **RISC** (Reduced Instruction Set Computer) | **CISC** (Complex Instruction Set Computer) |
> | --- | --- | --- |
> | 명령어 수 | 적음, **30~50개** | 많음, **300~500개** |
> | 명령어 | 단순, 고정 길이 | 강력·복잡, 가변 길이 |
> | 실행 | 대부분 **1 클럭**, 하드웨어 단순·빠름 | 명령마다 실행 시간이 다름 |
> | 프로그램 | 같은 일에 **명령어가 더 많이** 필요 | 프로그램이 **짧음** |
> | 예 | ARM(스마트폰), SPARC, RiSC-16 | Intel x86 |
>
> 핵심 아이디어: 자주 쓰는 단순한 명령을 아주 빠르게 실행하면, 명령어 개수가 늘어도 **전체 실행 시간은 더 짧아질 수 있다.** 현대 프로세서는 두 방식을 섞어 쓴다(x86도 내부적으로 RISC 형태 마이크로 연산으로 쪼개 실행).

> [!TRAP]
> "RISC는 명령어가 적으니 프로그램도 짧다"는 **반대**입니다. 명령어가 단순하니 같은 일을 하려면 **더 많은** 명령어가 필요합니다.

### 제어 장치의 레지스터와 회로

| 이름 | 하는 일 |
| --- | --- |
| **PC** (program counter) | **다음에** 실행할 명령의 주소 |
| **IR** (instruction register) | 메모리에서 가져온 **현재 명령의 복사본** |
| **Instruction decoder** | IR의 op code를 해석해 해당 연산 회로 하나를 켬 (= 4장 decoder) |

op code가 3비트(000 ADD, 001 LOAD, 010 JUMP, …, 111 HALT)면 3-to-8 decoder가 8개 선 중 하나를 켭니다(Figure 5.17).

> [!TRAP]
> - **PC는 "현재"가 아니라 "다음" 명령의 주소**입니다. fetch 직후 PC + 1을 하기 때문입니다.
> - MAR은 메모리 주소, PC는 명령 주소입니다. fetch 단계에서 PC 값을 MAR로 **복사**할 뿐 둘은 다른 레지스터입니다.

### 기계어 예 (Figure 5.15)

a, b, c가 주소 100, 101, 102에 있을 때

```text
1. Set a to b + c                 2. If a > b then set c to a else set c to b
50  LOAD 101    -- R ← b          50  COMPARE 100, 101   -- a 와 b 비교, 조건 코드 설정
51  ADD 102     -- R ← b + c      51  JUMPGT 54          -- a > b 면 54 로
52  STORE 100   -- a ← R          52  MOVE 101, 102      -- c ← b
                                  53  JUMP 55            -- 다음 명령 건너뛰기
                                  54  MOVE 100, 102      -- c ← a
                                  55  …
```

> [!NOTE]
> 이 그림은 주소 필드가 **두 개**인 COMPARE·MOVE를 씁니다. 6장의 어셈블리 명령어 집합(Figure 6.5)은 주소 필드가 **하나**이고 레지스터 R과 비교합니다. 문제에서 어느 명령어 집합을 주는지 꼭 확인하세요.

## 7. 전체 조립: fetch-decode-execute 사이클

> [!DEFINITION]
> **Von Neumann cycle** — fetch → decode → execute 를 HALT까지 반복하는 것

```text
FETCH 단계
1  PC → MAR          다음 명령의 주소를 메모리로 보냄
2  FETCH             메모리 → MDR
3  MDR → IR          명령을 IR에 복사
4  PC + 1 → PC       다음 명령을 가리키도록 증가

DECODE 단계
   IR의 op code → instruction decoder → 해당 연산의 선 하나가 켜짐

EXECUTE 단계 (예)
LOAD X     IR_addr → MAR,  FETCH,  MDR → R
STORE X    IR_addr → MAR,  R → MDR,  STORE
ADD X      IR_addr → MAR,  FETCH,  MDR → ALU,  R → ALU,  ADD,  ALU → R
JUMP X     IR_addr → PC
JUMPGT X   If GT = 1 then IR_addr → PC
COMPARE X  IR_addr → MAR,  FETCH,  MDR → ALU,  R → ALU,  SUBTRACT,  결과로 GT/EQ/LT 설정
```

> [!QUIZ]
> 다음 두 명령의 **execute 단계**를 위 표기법으로 쓰시오.
>
> (1) `MOVE X, Y` — 메모리 X의 내용을 메모리 Y로 복사
>
> (2) `ADD X, Y` — X와 Y의 내용을 더해 Y에 저장

> [!ANSWER]
> (1)
> ```text
> IR_addr1 → MAR, FETCH          -- X의 값이 MDR에
> IR_addr2 → MAR, STORE          -- MDR 값을 Y에 저장
> ```
> (2)
> ```text
> IR_addr1 → MAR, FETCH, MDR → ALU      -- X의 값
> IR_addr2 → MAR, FETCH, MDR → ALU      -- Y의 값
> ADD, ALU → MDR
> IR_addr2 → MAR, STORE                  -- 결과를 Y에
> ```
> (MAR에 이미 Y 주소가 있으면 마지막 IR_addr2 → MAR은 생략 가능)

> [!QUIZ]
> 1 gigaflop(초당 10⁹ 부동소수점 연산) 컴퓨터가 초당 780자를 인쇄하는 프린터에 한 쪽(60자 × 65줄)을 보낸다. 한 쪽을 인쇄하는 동안 몇 번의 연산을 할 수 있는가? 또 56,000 bit/s 모뎀으로 메시지를 받는 500 MIPS 컴퓨터는 비트 하나를 받는 사이 몇 개의 명령을 실행하는가?

> [!ANSWER]
> - 3,900자 / 780 = 5초 → 5 × 10⁹ = **50억 번**
> - 500 × 10⁶ / 56,000 ≈ **8,929개**
>
> I/O가 이렇게 느리기 때문에 I/O controller와 interrupt로 프로세서가 기다리지 않게 한다.

## 8. 폰 노이만이 아닌 구조

> [!CONCEPT]
> **Von Neumann bottleneck** — 한 번에 명령 하나를 순서대로 실행하는 폰 노이만 모델이 오늘날의 대규모 문제를 감당하지 못하는 것. 게이트를 칩 위에 더 가깝게 놓는 데 물리적 한계가 있어 프로세서 속도 증가율이 **둔화**되었다(Figure 5.20: 지수 성장 → 실제 곡선은 꺾임).

| 구조 | 뜻 | 그림 |
| --- | --- | --- |
| **Parallel processing** | 프로세서를 1개가 아니라 수십~수천 개로 | |
| **SIMD** (Single Instruction, Multiple Data) | 제어 장치 **1개**, **ALU만 여러 개** 복제, 각 ALU에 local memory. 모두 **같은 명령**을 **다른 데이터**에 동시 실행 | 벡터·이미지 처리, GPU |
| **MIMD** (Multiple Instruction, Multiple Data) | **프로세서 전체**를 복제, 각자 **자기 프로그램** 실행 | 멀티코어, 클러스터, grid computing |

> [!QUIZ]
> 100개 수의 합을 프로세서 1개로 구하면 약 100단위 시간이 걸린다. 프로세서 100개가 있다면 어떻게 더 빨리 구할 수 있는가?

> [!ANSWER]
> 짝지어 더하기(트리 방식):
> 1. 50개 프로세서가 동시에 (a₁+a₂), (a₃+a₄), … → 50개
> 2. 25개 프로세서가 동시에 → 25개
> 3. → 13 → 7 → 4 → 2 → 1
>
> 약 **⌈lg 100⌉ = 7단계**면 끝나 약 14배 빠르다. 첫 단계에도 프로세서가 **50개**면 충분하고, 그 이상은 놀게 된다. 3장의 Θ(lg n)이 여기서도 나온다.

---

## 부록: RiSC-16 명령어 집합

수업 보충 자료로 나온 **RiSC-16**(Ridiculously Simple Computer)은 교육용 **RISC** 구조입니다.

| 특징 | 값 |
| --- | --- |
| 워드 / 레지스터 | 16비트, 레지스터 **8개** (r0~r7) |
| r0 | **항상 0** (써도 0으로 읽힘, MIPS와 같은 관례) |
| 주소 | 워드(2바이트) 단위 |
| 명령어 | **8개**, 형식 3가지 |

```text
비트       15‒13    12‒10   9‒7    6‒0
RRR-type   opcode   reg A   reg B  0000 | reg C(3)
RRI-type   opcode   reg A   reg B  signed immediate (−64 ~ 63, 7비트)
RI-type    opcode   reg A   immediate (0 ~ 0x3FF, 10비트)
```

| 명령 | opcode | 형식 | 동작 |
| --- | :-: | --- | --- |
| add rA, rB, rC | 000 | RRR | R[A] ← R[B] + R[C] |
| addi rA, rB, imm | 001 | RRI | R[A] ← R[B] + imm |
| nand rA, rB, rC | 010 | RRR | R[A] ← ~(R[B] & R[C]) |
| lui rA, imm | 011 | RI | R[A] ← imm의 상위 10비트, 하위 6비트는 0 |
| sw rA, rB, imm | 100 | RRI | Mem[R[B] + imm] ← R[A] |
| lw rA, rB, imm | 101 | RRI | R[A] ← Mem[R[B] + imm] |
| beq rA, rB, imm | 110 | RRI | R[A] = R[B]이면 PC ← PC + 1 + imm |
| jalr rA, rB | 111 | RRI | R[A] ← PC + 1, PC ← R[B] (함수 호출·복귀) |

> [!TRAP]
> 자료의 그림(1쪽)은 **sw = 100, lw = 101**인데 2쪽 표에는 lw 100, sw 101로 반대로 적혀 있습니다. 원 설계(그림)를 기준으로 기억하고, 시험에서 표를 주면 그 표를 따르세요.

**Pseudo-instruction**(어셈블러가 바꿔 주는 가짜 명령): `nop`(= add 0,0,0), `halt`, `lli`(하위 6비트 채우기), `movi`(= lui + lli **두 개**의 명령), `.fill`(데이터 값), `.space n`(0으로 채운 n워드)

```text
        lw      1,0,count      # r1 ← 5
        lw      2,1,2          # r2 ← Mem[r1 + 2] = Mem[7] = −1
start:  add     1,1,2          # r1 ← r1 − 1
        beq     0,1,1          # r1 = 0 이면 한 칸 건너뛰어 done 으로
        beq     0,0,start      # 무조건 start 로 (r0 = r0 은 항상 참)
done:   halt
count:  .fill   5              # 주소 6
neg1:   .fill   −1             # 주소 7
```

> [!NOTE]
> 8개 명령만으로도 모든 계산이 가능합니다.
> - **상수 넣기**: 0은 `add rX, r0, r0`, −64~63은 `addi rX, r0, n`, 16비트 아무 값은 `lui` + `lli`
> - **뺄셈**: 부호 바꾸기 = 비트 뒤집기(`nand rX, rX, rX`) + 1(`addi`) → 4장 **2의 보수**! 그다음 더하기 → 명령 3개
> - **무조건 점프**: `beq 0,0,label` (r0 = r0은 항상 참)
> - **곱셈**: 반복 덧셈·비트 검사·왼쪽 시프트(자기 자신과 더하기)
>
> 명령어 수는 적고 프로그램은 길어지는 RISC의 특징이 그대로 보입니다.

---

## 정리 카드

> [!FLASHCARD]
> Q: 폰 노이만 구조의 세 가지 특징은?
> A: 네 서브시스템(memory, I/O, ALU, control unit), stored program concept, sequential execution of instructions.

> [!FLASHCARD]
> Q: MAR과 MDR의 역할은?
> A: MAR은 접근할 메모리 칸의 주소, MDR은 그 칸에서 가져오거나 저장할 데이터 값을 담는다.

> [!FLASHCARD]
> Q: MAR이 N비트일 때 최대 메모리 크기는?
> A: 2ᴺ칸(주소 0 ~ 2ᴺ − 1).

> [!FLASHCARD]
> Q: PC와 IR의 역할은?
> A: PC는 다음에 실행할 명령의 주소, IR은 메모리에서 가져온 현재 명령의 복사본.

> [!FLASHCARD]
> Q: fetch 단계의 네 동작은?
> A: PC → MAR, FETCH, MDR → IR, PC + 1 → PC.

> [!FLASHCARD]
> Q: RISC와 CISC의 핵심 차이는?
> A: RISC는 30~50개의 단순·고정 길이 명령을 1클럭에 실행하고 프로그램이 길다. CISC는 300~500개의 복잡한 명령으로 프로그램이 짧지만 명령마다 실행 시간이 다르다.

> [!FLASHCARD]
> Q: SIMD와 MIMD의 차이는?
> A: SIMD는 제어 장치 하나가 여러 ALU에 같은 명령을 내려 다른 데이터를 처리하고, MIMD는 프로세서 전체를 복제해 각자 다른 프로그램을 실행한다.
