---
title: "3장 알고리즘의 효율"
description: "Θ 표기, 순차·이진 탐색, 선택 정렬, 세 가지 데이터 정리 알고리즘을 족보의 추적·복사 횟수 문제 중심으로 정리합니다."
order: 3
published: true
tags:
  - 시간 복잡도
  - 데이터 정리
  - 이진 탐색
objectives:
  - 순차 탐색·이진 탐색·선택 정렬·패턴 매칭의 최선/최악/평균 Θ를 말할 수 있다.
  - shuffle-left, copy-over, converging-pointers를 표로 추적하고 정확한 복사 횟수를 셀 수 있다.
  - 이진 탐색 트리를 그리고 최악 비교 횟수와 그 예를 찾을 수 있다.
---

# 3장 알고리즘의 효율

## 학습 흐름

```text
좋은 알고리즘의 조건: correctness · ease of understanding · elegance · efficiency
        ↓
일의 단위(unit of work)를 정하고 센다 → order of magnitude Θ(…)
        ↓
Θ(n): 순차 탐색 · copy-over · converging-pointers      Θ(lg n): 이진 탐색
Θ(n²): 선택 정렬 · shuffle-left(최악)                    Θ(m×n): 패턴 매칭(최악)
        ↓
Θ(2ⁿ): 해밀턴 회로 brute force → intractable → approximation
```

> [!EXAM]
> 중간고사 범위에서 **가장 많이 나오는 장**입니다.
> - **데이터 정리 추적 + 정확한 복사 횟수** (중간 족보 문제 8, Sample Q1)
> - **이진 탐색 트리 그리기 + 최악 비교 횟수** (Sample Q6)
> - **T/F**: 순차 탐색 평균 n/2, Θ(n²) vs Θ(n), shuffle-left 최악 Θ(n²), 지수 O(2ⁿ) (족보 문제 1·2, Sample Q8·9)
> - **lg n, n lg n, n² 표 채우기** (족보 문제 10)
> - **토너먼트 경기 수** (Sample Q7)

---

## 1. 좋은 알고리즘의 조건

| 속성 | 뜻 |
| --- | --- |
| **Correctness** | 기본 전제. 모든 입력에 올바른 결과 |
| **Ease of understanding** (clarity) | **program maintenance**(오류 수정, 새 요구사항 반영)를 쉽게 함 |
| **Elegance** | 알고리즘의 "스타일". 예: 1부터 100까지 합을 루프 대신 가우스 공식 100·101/2 = 5050으로 |
| **Efficiency** | 자원(시간·공간)을 신중하게 쓰는 정도 |

> [!NOTE]
> **Benchmark**는 실제 기계에서 실행 시간을 재는 것입니다. 기계끼리 비교하거나, 한 기계에서 입력 변화에 알고리즘이 얼마나 민감한지 볼 때 유용합니다. 하지만 기계·입력에 따라 달라지므로, 알고리즘 자체를 비교할 때는 **일의 단위를 세는 분석(analysis of algorithms)** 을 씁니다.

> [!QUIZ]
> 가우스 방식(elegance)으로 2 + 4 + 6 + … + 100 과 2 + 4 + … + 2n 을 구하시오.

> [!ANSWER]
> 2 + 4 + … + 2n = 2(1 + 2 + … + n) = 2 · n(n + 1)/2 = **n(n + 1)**
>
> n = 50이면 50 · 51 = **2550**

---

## 2. 순차 탐색과 Θ(n)

일의 단위: **NAME과 목록 이름의 비교 횟수**

| Best case | Worst case | Average case |
| :-: | :-: | :-: |
| 1 (맨 앞) | n (맨 끝 또는 없음) | 약 n/2 |

> [!CONCEPT]
> **Order of magnitude n, Θ(n)** — 일의 양이 상수 × n 처럼 변하는 것(그래프 모양이 직선). 2n, n/2, 100n 모두 Θ(n)이다. 순차 탐색은 **최악과 평균 모두 Θ(n)** 이다.

> [!TRAP]
> 평균이 정확히 n/2는 아닙니다. 위치 1~n에 있을 확률이 같다면 평균은 (1 + 2 + … + n)/n = **(n + 1)/2** 로 n/2보다 **약간 큽니다**. 그래도 "approximately n/2"라는 문장은 **True**입니다(Sample Q8).
>
> 7개 이름(Sherman, Jane, Ted, Elise, Raul, Maki, John)을 하나씩 찾으면 비교 횟수 1~7, 평균 **4** = (7 + 1)/2.

---

## 3. 선택 정렬과 Θ(n²)

```text
1 Get values for n and the n list items
2 Set the marker for the unsorted section at the end of the list
3 While the unsorted section is not empty, do steps 4–6
4     Select the largest number in the unsorted section       ← Find Largest
5     Exchange it with the last number in the unsorted section
6     Move the marker left one position
7 Stop
```

> [!PROBLEM]
> 7, 4, 2, 9, 6 을 선택 정렬합니다(교재 연습 6). `|` 오른쪽이 정렬된 부분입니다.
>
> | 회차 | 정렬 안 된 부분에서 최댓값 | 교환 후 |
> | ---: | --- | --- |
> | 1 | 9 (4번째) ↔ 5번째 6 | 7, 4, 2, 6 \| 9 |
> | 2 | 7 (1번째) ↔ 4번째 6 | 6, 4, 2 \| 7, 9 |
> | 3 | 6 (1번째) ↔ 3번째 2 | 2, 4 \| 6, 7, 9 |
> | 4 | 4 (2번째) ↔ 자기 자신 | 2 \| 4, 6, 7, 9 (변화 없음) |
>
> 비교 횟수 4 + 3 + 2 + 1 = 10 = 5·4/2

| n | n² | 비교 횟수 n(n − 1)/2 |
| ---: | ---: | ---: |
| 10 | 100 | 45 |
| 100 | 10,000 | 4,950 |
| 1,000 | 1,000,000 | 499,500 |

> [!CONCEPT]
> - 비교: (n − 1) + (n − 2) + … + 1 = **n(n − 1)/2 = ½n² − ½n → Θ(n²)**, 입력과 무관하게 **항상**(best = worst = average).
> - 교환: 위치마다 1번씩 **n번**(교재 기준).
> - 공간: 원래 리스트 n칸 + marker, largest-so-far 값과 위치 정도 → 추가 공간 거의 없음.

### 두 값 바꾸기 (Figure 3.8, 3.9)

```text
틀린 방법                     맞는 방법
X ← Y   (X=5, Y=5)          T ← X   (T=3)
Y ← X   (X=5, Y=5)  ✗       X ← Y   (X=5)
                            Y ← T   (Y=3)  ✓
```

> [!TRAP]
> 마지막 원소 하나만 남았을 때 멈추도록 고쳐도 **비교 횟수는 그대로**입니다. 원소 1개짜리 구간에서 최댓값을 찾는 데는 비교가 0번이기 때문입니다(교재 연습 7).

### Θ(n²)과 Θ(n)의 비교

| n | 알고리즘 A: 0.0001n² | 알고리즘 B: 100n |
| ---: | ---: | ---: |
| 1,000 | 100 | 100,000 |
| 100,000 | 1,000,000 | 10,000,000 |
| 1,000,000 | 100,000,000 | 100,000,000 |
| 10,000,000 | 10,000,000,000 | 1,000,000,000 |

> [!CONCEPT]
> 상수(peripheral work)가 아무리 유리해도 **n이 충분히 크면 Θ(n²)이 Θ(n)보다 반드시 더 많은 일을 한다.** 0.25n²와 10n은 n = 40에서, 0.0001n²와 100n은 n = 1,000,000에서 역전된다. → Sample Q9 / 기말 족보 문제 1-1 정답 **True**.
>
> 단, **작은 n에서는** Θ(n²) 알고리즘이 더 빠를 수 있다. 그래서 프로그램 문서(program documentation)에 "이 프로그램이 다루도록 설계된 입력 크기"를 적는다.

> [!QUIZ]
> 같은 일을 하는 알고리즘 A는 0.003n², B는 243n 개의 명령을 실행한다. n이 얼마보다 크면 B가 더 효율적인가?

> [!ANSWER]
> 0.003n² > 243n ⟺ n > 243 / 0.003 = **81,000**

> [!QUIZ]
> n = 100에서 10초 걸리는 알고리즘이 n = 500에서 몇 초 걸릴까? (1) Θ(n)일 때 (2) Θ(n²)일 때

> [!ANSWER]
> n이 5배 → (1) Θ(n): 5배 = **50초**, (2) Θ(n²): 5² = 25배 = **250초**

---

## 4. 데이터 정리 (Data Cleanup) — 족보 최다 출제

0은 "빈 칸(측정 실패)"입니다. 0을 지우고 유효한 값(legit)만 앞에 모읍니다. 일의 단위는 **검사(examination)와 복사(copy)** 이고, 시험은 **복사 횟수**를 묻습니다.

### 4-1. Shuffle-left (Figure 3.14)

```text
1  Get values for n and the n data items
2  Set legit to n
3  Set left to 1
4  Set right to 2
5  While left ≤ legit do steps 6–14
6      If the item at left is not 0 then
7          Increase left by 1
8          Increase right by 1
9      Else (the item at left is 0)
10         Reduce legit by 1
11         While right ≤ n do steps 12–13
12             Copy the item at right into position (right − 1)
13             Increase right by 1
14         Set right to (left + 1)
15 Stop
```

> [!PROBLEM]
> **[3 0 0 2 6 7 0 0 5 1]** (Sample Q1 = 교재 연습 13). 0을 만날 때마다 **right부터 n(= 10)까지 전부** 한 칸씩 당깁니다. 0을 당긴 뒤에는 **left를 그대로 두고** 같은 칸을 다시 검사합니다.
>
> | 0을 만난 위치 left | 당긴 범위 (right..n) | 복사 수 | 결과 리스트 | legit |
> | ---: | --- | ---: | --- | ---: |
> | 2 | 3..10 | 8 | 3 0 2 6 7 0 0 5 1 **1** | 9 |
> | 2 | 3..10 | 8 | 3 2 6 7 0 0 5 1 **1 1** | 8 |
> | 5 | 6..10 | 5 | 3 2 6 7 0 5 1 **1 1 1** | 7 |
> | 5 | 6..10 | 5 | 3 2 6 7 5 1 **1 1 1 1** | 6 |
>
> 결과: **3 2 6 7 5 1** (legit = 6), 원래 순서 유지. 복사 횟수 **8 + 8 + 5 + 5 = 26**

> [!TRAP]
> - 당길 때 마지막 원소가 **복제되어 꼬리에 남습니다**(굵은 1). legit 뒤는 쓰레기 값이므로 답에는 앞의 legit개만 씁니다.
> - 복사는 **n까지** 합니다(legit까지가 아님). 그래서 0이 연속으로 있어도 매번 같은 개수를 다시 복사합니다.
> - 교재 힌트처럼 "꼬리는 어차피 쓰레기니 legit까지만 복사"하도록 고치면 8 + 7 + 3 + 2 = **20번**으로 줄어듭니다(교재 연습 15).

| 경우 | 언제 | 복사 | Θ |
| --- | --- | --- | --- |
| Best | 0이 하나도 없음 | 0 (검사 n번) | Θ(n) |
| Worst | **모두 0** | 0마다 n − 1개씩, n번 → **n(n − 1)** | **Θ(n²)** |
| 공간 | n, legit, left, right 4칸만 추가 | | 공간 효율적 |

> [!QUIZ]
> 0 0 0 0 0 0 (n = 6)에 shuffle-left를 실행하면 복사가 정확히 몇 번인가?

> [!ANSWER]
> left는 계속 1에 머물고, 0을 만날 때마다 2..6의 **5개**를 복사한다. legit이 6 → 0이 될 때까지 6번 반복하므로 6 × 5 = **30 = n(n − 1)**.

### 4-2. Copy-over (Figure 3.15)

```text
1  Get values for n and the n data items
2  Set left to 1
3  Set newposition to 1
4  While left ≤ n do steps 5–9
5      If the item at left is not 0 then
6          Copy the item at left into position newposition in the new list
7          Increase left by 1
8          Increase newposition by 1
9      Else increase left by 1
10 Stop
```

[3 0 0 2 6 7 0 0 5 1] → 새 리스트 **3 2 6 7 5 1**, 복사 **6번**(0이 아닌 원소 수), 순서 유지.

> [!TRAP]
> Copy-over의 best/worst는 shuffle-left와 **반대**입니다.
> - **Best: 모두 0** → 복사 0번, 추가 공간 없음
> - **Worst: 0이 하나도 없음** → n개 모두 복사, 공간 **2n**
> - 시간은 항상 Θ(n). 시간을 얻고 공간을 내주는 **time/space tradeoff**의 대표 예입니다.

### 4-3. Converging-pointers (Figure 3.16)

```text
1  Get values for n and the n data items
2  Set legit to n
3  Set left to 1
4  Set right to n
5  While left < right do steps 6–10
6      If the item at left is not 0 then increase left by 1
7      Else (the item at left is 0) do steps 8–10
8          Reduce legit by 1
9          Copy the item at right into position left
10         Reduce right by 1
11 If the item at left is 0, then reduce legit by 1
12 Stop
```

> [!PROBLEM]
> 같은 데이터 **[3 0 0 2 6 7 0 0 5 1]** (교재 연습 14)
>
> | left | right | 동작 | 리스트 | legit |
> | ---: | ---: | --- | --- | ---: |
> | 1 | 10 | 3 → left++ | 3 0 0 2 6 7 0 0 5 1 | 10 |
> | 2 | 10 | 0 → A[2] ← A[10] = 1, right-- | 3 **1** 0 2 6 7 0 0 5 1 | 9 |
> | 2→3 | 9 | 1 → left++, 0 → A[3] ← A[9] = 5, right-- | 3 1 **5** 2 6 7 0 0 5 1 | 8 |
> | 3→7 | 8 | 5, 2, 6, 7 → left++ ×4, A[7] = 0 → A[7] ← A[8] = 0, right-- | 3 1 5 2 6 7 **0** 0 5 1 | 7 |
> | 7 | 7 | left = right → 루프 종료. Step 11: A[7] = 0 → legit-- | | **6** |
>
> 결과: **3 1 5 2 6 7** (legit = 6), 복사 **3번**. 순서가 **바뀜**.

> [!TRAP]
> - **Step 11을 잊지 마세요.** 루프가 끝난 칸(left = right)은 한 번도 검사되지 않았으므로 마지막에 0인지 따로 확인합니다. 위 예에서 빠뜨리면 legit = 7로 틀립니다.
> - 0을 오른쪽 값으로 덮은 뒤 **left는 그대로** 둡니다. 가져온 값이 또 0일 수 있기 때문입니다.
> - 복사 횟수 = 루프 안에서 만난 0의 개수입니다. 최악(모두 0)에도 n − 1번 → **Θ(n)**.

### 4-4. 세 알고리즘 비교 (Figure 3.17)

| | Shuffle-left 시간 | 공간 | Copy-over 시간 | 공간 | Converging 시간 | 공간 |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| Best | Θ(n) | n | Θ(n) | n | Θ(n) | n |
| Worst | **Θ(n²)** | n | Θ(n) | **2n** | Θ(n) | n |
| Average | Θ(n²) | n | Θ(n) | n ≤ x ≤ 2n | Θ(n) | n |
| 순서 유지 | O | | O | | **X** | |

> [!QUIZ]
> 다음 리스트에 세 알고리즘을 각각 적용한 결과와 복사 횟수를 쓰시오. (index는 1부터)
>
> **[0, 7, 0, 3, 5, 0]**

> [!HINT 1]
> Shuffle-left: 첫 칸이 0이면 left는 1에 머문 채로 5개를 당깁니다.

> [!ANSWER]
> | 알고리즘 | 결과 | 복사 횟수 |
> | --- | --- | ---: |
> | Shuffle-left | **7 3 5** | 5 + 4 + 2 = **11** |
> | Copy-over | **7 3 5** | **3** |
> | Converging-pointers | **5 7 3** | **3** |
>
> Converging-pointers 추적: A[1] = 0 ← A[6] = 0 (right 5), 여전히 0 → A[1] ← A[5] = 5 (right 4), 5·7 통과 후 A[3] = 0 ← A[4] = 3 (right 3), left = right = 3, A[3] = 3 ≠ 0 → legit = 3.

---

## 5. 이진 탐색 (Binary Search)과 Θ(lg n)

**정렬된 목록**에서만 쓸 수 있습니다. 가운데와 비교해 절반을 버립니다.

```text
1  Get values for NAME, n, N₁…Nₙ and T₁…Tₙ
2  Set beginning to 1 and set Found to NO
3  Set end to n
4  While Found = NO and beginning ≤ end do steps 5–10
5      Set m to the middle value between beginning and end
6      If NAME = Nₘ then
7          Print Tₘ
8          Set Found to YES
9      Else if NAME precedes Nₘ alphabetically, set end = m − 1
10     Else set beginning = m + 1
11 If (Found = NO) print 'I am sorry but that name is not in the directory'
12 Stop
```

가운데 m = ⌊(beginning + end) / 2⌋ (나머지 버림)로 계산합니다.

> [!CONCEPT]
> - **lg n** = n을 반으로 나눠 1 밑으로 내려가지 않는 횟수 (밑이 2인 로그). n이 **두 배**가 되어도 lg n은 **1만** 증가한다.
> - 최악·평균 비교 횟수 **Θ(lg n)**, 정확한 최악은 **⌊lg n⌋ + 1**.
> - 최선은 1번(첫 가운데에서 발견).

| n | 8 | 16 | 32 | 64 | 128 | 1,000 | 1,000,000 |
| --- | --: | --: | --: | --: | --: | --: | --: |
| lg n | 3 | 4 | 5 | 6 | 7 | ≈ 10 | ≈ 20 |

### 족보 유형: 이진 탐색 트리 그리기 (Sample Q6)

Arturo(1), Elsa(2), JoAnn(3), John(4), Jose(5), Lee(6), Snyder(7), Tracy(8)

```text
                    John (4)                 ← 1번째 비교: ⌊(1+8)/2⌋ = 4
               /              \
         Elsa (2)            Lee (6)         ← 2번째: ⌊(1+3)/2⌋ = 2, ⌊(5+8)/2⌋ = 6
         /      \            /     \
   Arturo (1) JoAnn (3)  Jose (5)  Snyder (7)   ← 3번째: ⌊(7+8)/2⌋ = 7
                                       \
                                      Tracy (8)  ← 4번째
```

> [!PROBLEM]
> 최악 비교 횟수 = 트리의 높이 = **4번**, 예: **Tracy** (John → Lee → Snyder → Tracy). ⌊lg 8⌋ + 1 = 4와 일치합니다.
>
> | 찾는 이름 | 비교하는 이름 | 결과 |
> | --- | --- | --- |
> | Elsa | John, Elsa | 2번, 찾음 |
> | Tracy | John, Lee, Snyder, Tracy | 4번, 찾음 |
> | Emile | John, Elsa, JoAnn | 3번, **없음** (Elsa < Emile < JoAnn) |

> [!TRAP]
> - 짝수 개일 때 가운데를 **올림**으로 잡으면 다른 트리가 나옵니다. 교재처럼 **버림**으로 통일하세요.
> - 이진 탐색은 **정렬된 목록에서만** 동작합니다. 정렬 비용(선택 정렬 Θ(n²))까지 생각하면, 검색을 몇 번만 할 때는 순차 탐색이 더 쌀 수 있습니다. n = 100,000이면 정렬에 약 5 × 10⁹번 비교, 탐색 1번당 100,000 대 17번이므로 **약 50,009번 이상** 검색할 때부터 "정렬 + 이진 탐색"이 이득입니다.

> [!QUIZ]
> 3, 6, 7, 9, 12, 14, 18, 21, 22, 31, 43 에서 이진 탐색으로 35를 찾을 때 비교하는 수를 순서대로 쓰시오.

> [!ANSWER]
> **14 → 22 → 31 → 43**, 그다음 beginning(11) > end(10)이 되어 "없음".
>
> (1..11) m = 6 → 14 < 35 → (7..11) m = 9 → 22 → (10..11) m = 10 → 31 → (11..11) m = 11 → 43 > 35 → end = 10

> [!QUIZ]
> 7개 원소의 이진 탐색 트리(Figure 3.19)에서 각 원소를 찾는 비교 횟수의 평균과 최악을 구하시오.

> [!ANSWER]
> 4는 1번, 2·6은 2번, 1·3·5·7은 3번 → 합 1 + 4 + 12 = 17, 평균 17/7 ≈ **2.43**, 최악 **3**. 평균이 최악과 거의 같다(원소의 절반이 맨 아래 층에 있기 때문).

---

## 6. 패턴 매칭의 효율

일의 단위: **패턴 문자와 텍스트 문자의 비교**

| 경우 | 예 | 비교 횟수 | Θ |
| --- | --- | --- | --- |
| Best | 매 시작 위치에서 **첫 글자부터** 불일치 (text = ABCDEFGH, pattern = XYZ) | n − m + 1 | **Θ(n)** |
| Worst | 매번 **마지막 글자에서** 불일치 (text = AAAAAAAA, pattern = AAB) | (n − m + 1) × m | **Θ(m × n)** |

보통 m ≪ n이므로 실제로는 거의 Θ(n)입니다.

---

## 7. 감당할 수 없을 때 (When Things Get Out of Hand)

| 용어 | 뜻 |
| --- | --- |
| **Polynomially bounded** | 일의 양이 n²(더 일반적으로 n의 다항식)의 상수배를 넘지 않음 |
| **Graph** | 노드(node)와 이를 잇는 간선(edge)의 모음 |
| **Hamiltonian circuit** | 한 노드에서 출발해 다른 모든 노드를 **정확히 한 번씩** 지나 출발점으로 돌아오는 경로 |
| **Exponential algorithm** | Θ(2ⁿ). 입력이 하나 늘 때마다 일이 **두 배** |
| **Brute force** | 모든 가능성을 다 시도해 "문제를 두들겨 패서" 푸는 방법 |
| **Intractable problem** | 다항식 시간 알고리즘이 존재하지 않는 문제 |
| **Approximation algorithm** | 정확한 해 대신 **가까운 해**를 빠르게 구함 (예: bin packing에서 first-fit) |

> [!CONCEPT]
> 크기 순서: **lg n < n < n lg n < n² < 2ⁿ**
>
> | 차수 | n = 10 | 50 | 100 | 1,000 |
> | --- | --- | --- | --- | --- |
> | lg n | 0.0003 s | 0.0006 s | 0.0007 s | 0.001 s |
> | n | 0.001 s | 0.005 s | 0.01 s | 0.1 s |
> | n² | 0.01 s | 0.25 s | 1 s | 1.67 min |
> | 2ⁿ | 0.1024 s | **3,570년** | 4 × 10¹⁶ 세기 | 계산 불가 |

> [!QUIZ]
> n = 10, 20, 50일 때 lg n, n lg n, n² 표를 채우시오 (lg 10 ≈ 3.32). (중간 족보 문제 10)

> [!HINT 1]
> lg 20 = lg 10 + 1, lg 50 = lg 100 − 1 = 2·lg 10 − 1

> [!ANSWER]
> | n | lg n | n lg n | n² |
> | ---: | ---: | ---: | ---: |
> | 10 | 3.3 | 33.2 | 100 |
> | 20 | 4.3 | 86.4 | 400 |
> | 50 | 5.6 | 282.2 | 2,500 |
>
> n이 5배일 때 n lg n은 약 8.5배, n²은 25배 늘어난다.

> [!QUIZ]
> 100n² 명령을 실행하는 알고리즘이 0.01·2ⁿ 명령을 실행하는 알고리즘보다 효율적이 되는 n은 대략 얼마인가?

> [!ANSWER]
> n = 22: 100 · 484 = 48,400 > 0.01 · 4,194,304 ≈ 41,943
>
> n = 23: 100 · 529 = 52,900 < 0.01 · 8,388,608 ≈ 83,886
>
> 따라서 **n ≥ 23**부터 Θ(n²) 쪽이 더 효율적이다. 지수 알고리즘의 작은 상수(0.01)도 금방 따라잡힌다.

### 효율 요약 (Figure 3.22)

| 문제 | 일의 단위 | 알고리즘 | Best | Worst | Average |
| --- | --- | --- | --- | --- | --- |
| Searching | 비교 | Sequential search | 1 | Θ(n) | Θ(n) |
| | | Binary search | 1 | Θ(lg n) | Θ(lg n) |
| Sorting | 비교·교환 | Selection sort | Θ(n²) | Θ(n²) | Θ(n²) |
| Data cleanup | 검사·복사 | Shuffle-left | Θ(n) | Θ(n²) | Θ(n²) |
| | | Copy-over | Θ(n) | Θ(n) | Θ(n) |
| | | Converging-pointers | Θ(n) | Θ(n) | Θ(n) |
| Pattern matching | 문자 비교 | Forward march | Θ(n) | Θ(m × n) | |

---

## 8. 족보·교재 연습

> [!QUIZ]
> 342명이 참가하는 테니스 토너먼트(한 경기 2명, 진 사람 탈락)에서 우승자를 정하려면 몇 경기가 필요한가? 라운드별 계산으로 구하고, 더 우아한 방법도 쓰시오. (Sample Q7)

> [!ANSWER]
> | 라운드 | 남은 인원 | 경기 수 | 부전승 |
> | ---: | ---: | ---: | ---: |
> | 1 | 342 | 171 | 0 |
> | 2 | 171 | 85 | 1 |
> | 3 | 86 | 43 | 0 |
> | 4 | 43 | 21 | 1 |
> | 5 | 22 | 11 | 0 |
> | 6 | 11 | 5 | 1 |
> | 7 | 6 | 3 | 0 |
> | 8 | 3 | 1 | 1 |
> | 9 | 2 | 1 | 0 |
>
> 합계 171 + 85 + 43 + 21 + 11 + 5 + 3 + 1 + 1 = **341경기**
>
> 우아한 방법: 경기마다 정확히 1명이 탈락하고 우승자 1명만 남으므로 경기 수 = 탈락자 수 = **342 − 1 = 341**. 계산이 필요 없어 더 명확(clarity)하고 우아(elegance)하며 효율적이다.

> [!QUIZ]
> 다음 T/F를 판정하시오.
>
> (1) 순차 탐색을 무작위 입력으로 여러 번 돌리면 평균 비교 횟수는 대략 n/2이다.
>
> (2) 같은 일을 하는 Θ(n²)와 Θ(n) 알고리즘이 있으면, n이 충분히 클 때 Θ(n²) 쪽이 상수와 관계없이 더 많은 일을 한다.
>
> (3) Shuffle-left의 최악 경우는 Θ(n²)이다.
>
> (4) 이진 탐색은 정렬되지 않은 목록에도 쓸 수 있다.
>
> (5) Copy-over의 최악 경우는 리스트가 모두 0일 때이다.

> [!ANSWER]
> (1) **T** (정확히는 (n+1)/2) (2) **T** (3) **T** (모두 0일 때) (4) **F** (5) **F** — 모두 0이면 copy-over의 **최선**(복사 0, 추가 공간 0). 최악은 0이 하나도 없을 때.

> [!QUIZ]
> 다음 알고리즘에서 n = 4, n = 8일 때 출력되는 값을 쓰고, 출력 횟수의 Θ를 구하시오. n = 16이면 몇 번 출력하는가?
>
> ```text
> Get value for n
> Set k to 1
> While k ≤ n do
>     Set j to n / 2
>     While j ≥ 1 do
>         Print j
>         Set j to j / 2
>     End of loop
>     Increase k by 1
> End of loop
> ```

> [!ANSWER]
> - n = 4: `2 1`을 4번 → 2 1 2 1 2 1 2 1
> - n = 8: `4 2 1`을 8번
> - 안쪽 루프는 j를 반씩 줄이므로 lg n번, 바깥은 n번 → **Θ(n lg n)**
> - n = 16: 안쪽 8, 4, 2, 1 = 4번 × 16 = **64번**

> [!QUIZ]
> 리스트에서 두 번째로 큰 값을 찾는 두 방법의 차수를 비교하시오. (a) 선택 정렬 후 뒤에서 두 번째를 꺼냄 (b) Find Largest를 두 번 실행(첫 번째 최댓값을 지우고 다시)

> [!ANSWER]
> (a) 선택 정렬 Θ(n²) (b) Find Largest는 Θ(n)이고 두 번 해도 2·Θ(n) = **Θ(n)**. 정렬은 필요한 것보다 훨씬 많은 일을 한다.

> [!QUIZ]
> 전화국이 n개 구역 사이의 통화량을 n × n 표로 관리한다. (a) 표를 한 번 출력할 때 출력 명령 수 (b) 구역장 n명에게 한 부씩 n부 출력할 때 출력 명령 수와 Θ를 구하시오.

> [!ANSWER]
> (a) 이중 반복으로 n²개 → Θ(n²) (b) 그것을 n번 → **n³**, **Θ(n³)**

---

## 9. 맨해튼 거리 (슬라이드 마지막)

격자 도로에서 (x₁, y₁)에서 (x₂, y₂)로 가는 최단 경로의 길이는 경로 모양과 관계없이 **|x₁ − x₂| + |y₁ − y₂|** 입니다(빨강·파랑·노랑 경로 모두 같은 길이, 초록 직선만 짧음). 모든 경로를 나열(brute force)하지 않고 공식 하나로 끝내는 것이 elegance의 예입니다.

---

## 정리 카드

> [!FLASHCARD]
> Q: 좋은 알고리즘의 네 가지 속성은?
> A: correctness, ease of understanding(clarity), elegance, efficiency.

> [!FLASHCARD]
> Q: 선택 정렬의 비교 횟수와 Θ는?
> A: n(n − 1)/2, 모든 경우 Θ(n²). 교환은 n번.

> [!FLASHCARD]
> Q: shuffle-left / copy-over / converging-pointers의 최악 시간·공간은?
> A: Θ(n²)·n / Θ(n)·2n / Θ(n)·n. converging-pointers만 순서가 바뀐다.

> [!FLASHCARD]
> Q: shuffle-left가 n개의 0에 대해 하는 복사 횟수는?
> A: n(n − 1). 0마다 n − 1개를 당기고 그것을 n번 반복한다.

> [!FLASHCARD]
> Q: 이진 탐색의 전제조건과 최악 비교 횟수는?
> A: 목록이 정렬되어 있어야 한다. 최악 ⌊lg n⌋ + 1번, Θ(lg n).

> [!FLASHCARD]
> Q: intractable problem과 대처 방법은?
> A: 다항식 시간 알고리즘이 없는 문제(예: 해밀턴 회로). brute force는 Θ(2ⁿ)이라 approximation algorithm을 쓴다.
