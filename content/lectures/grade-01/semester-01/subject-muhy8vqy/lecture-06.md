---
title: "6강 Python 프로그래밍 맛보기와 과제 풀이"
description: "의사코드를 Python으로 옮기는 법(입출력·대입·조건·반복·함수·클래스)과 과제 0.1·0.2의 알람 시각, 3-6-9 게임, 학번 계산 버그를 정리합니다."
order: 6
published: true
tags:
  - Python
  - 함수
  - 과제
objectives:
  - 의사코드의 Set/Get/Print/If/While을 Python 문장으로 옮길 수 있다.
  - 지역 변수와 전역 변수, 인자와 매개변수를 구분할 수 있다.
  - 과제 코드의 버그를 테스트 케이스로 찾아내고 고칠 수 있다.
---

# 6강 Python 프로그래밍 맛보기와 과제 풀이

## 학습 흐름

```text
2장 의사코드 ─(linguistic realization)→ 고급 언어 Python
        ↓
프로그램 구조: 주석 · 문법(case-sensitive) · IDE
        ↓
데이터: identifier · constant · variable · 자료형 · list
        ↓
문장: input · output · assignment · control(if / while)
        ↓
함수(def, parameter, return, local/global) → 객체지향(class, encapsulation, inheritance, polymorphism)
        ↓
과제 0.1 · 0.2 를 Python으로 → 테스트 케이스로 버그 찾기
```

> [!EXAM]
> 중간 Sample Q10처럼 **짧은 Python 코드의 출력**을 묻습니다. 반복 변수의 **시작값·종료 조건·변화량** 세 가지만 정확히 추적하면 됩니다. 이 강의 범위의 용어(sentinel value, local/global variable, argument/parameter, encapsulation·inheritance·polymorphism)는 정의형 단답으로도 나오기 좋습니다.

---

## 1. 의사코드 → Python 대응표

| 의사코드 (2장) | Python |
| --- | --- |
| Get a value for x | `x = int(input("Enter x: "))` |
| Print the value of x | `print(x)` |
| Print the message 'Hello' | `print("Hello")` |
| Set the value of x to a + b | `x = a + b` |
| If cond then … Else … | `if cond:` / `else:` (들여쓰기로 블록) |
| While (cond) do … End of loop | `while cond:` |
| A₁, A₂, …, Aₙ | 리스트 `A = [ ... ]`, `A[0]` 부터 |

> [!TRAP]
> - 교재 의사코드의 리스트는 **1부터**, Python 리스트는 **0부터** 셉니다. 2장·3장 알고리즘을 옮길 때 `i = 1`, `i <= n`을 `i = 0`, `i < n`으로 함께 바꿔야 합니다.
> - `input()`은 항상 **문자열**을 돌려줍니다. 숫자로 쓰려면 `int()`·`float()`로 바꿉니다. `"3" + "4"`는 `"34"`입니다.

## 2. 간단한 Python 프로그램의 구성

| 용어 | 뜻 |
| --- | --- |
| **Comment** | `#` 뒤의 내용. 번역기가 무시함 |
| **Prologue comment** | 프로그램 맨 앞의 소개 주석(목적·작성자·날짜) |
| Blank line | 무시되며 주석처럼 가독성을 위해 씀 |
| **Syntax** | 언어 구성 요소의 올바른 형식 |
| **Case-sensitive** | 대소문자를 구별. `print`는 되고 `Print`는 오류 |
| **IDE** | 편집·실행·디버깅을 한 프로그램(보통 GUI) 안에서 하는 통합 개발 환경 |

```python
# TravelPlanner: 거리와 속도로 여행 시간을 계산한다   ← prologue comment
speed = int(input("Enter your speed in mph: "))
distance = float(input("Enter your distance in miles: "))
time = distance / speed
print("At", speed, "mph, it will take")
print(time, "hours to travel", distance, "miles.")
```

## 3. 데이터 저장

| 용어 | 뜻 |
| --- | --- |
| **Identifier** | 이름. `while`, `if` 같은 **예약어(keyword)는 쓸 수 없음** |
| **Constant** | 값이 미리 정해져 바뀌지 않음 |
| **Variable** | 실행 중 값이 바뀜 |

| 자료형 | 예 | 메모 |
| --- | --- | --- |
| `int` | `42` | 정수 |
| `float` | `3.14` | 실수 |
| `str` | `"pb & j"` | 문자열 |
| `bool` | `True`, `False` | 참/거짓 |
| `list` | `roster = ["Martin", "Susan", "Chaika", "Ted"]` | 순서 있는 모음, `roster[0]`은 `"Martin"` |

## 4. 문장의 종류

| 문장 | 하는 일 |
| --- | --- |
| **Input statement** | 사용자에게서 값을 받아 변수에 넣음 |
| **Output statement** | 메시지나 변수 값을 화면에 씀 |
| **Assignment statement** | 변수에 값을 대입 `variable = expression` |
| **Control statement** | 실행 순서(**flow of control**)를 바꿈 |

입출력 관련 용어:

- **User prompt** — 프로그램이 입력을 기다린다고 알려 주는 메시지 (`input("Enter x: ")`의 문자열)
- **Escape sequence** — 백슬래시 + 한 문자: `\n`(줄바꿈), `\t`(탭), `\"`(따옴표)
- **Concatenation operator** — 문자열을 잇는 `+`

### 산술 연산

| 식 | 결과 | 메모 |
| --- | --- | --- |
| `7 / 2` | `3.5` | Python 3의 `/`는 항상 실수 나눗셈 |
| `7 // 2` | `3` | 정수 몫 |
| `7 % 2` | `1` | 나머지 (1장 유클리드의 `mod`) |
| `2 ** 10` | `1024` | 거듭제곱 |

### 비교·불 연산 (4장 불 논리)

| 비교 | `==` `!=` `<` `<=` `>` `>=` |
| --- | --- |
| 불 연산 | `and` `or` `not` |

> [!TRAP]
> `=`는 **대입**, `==`는 **비교**입니다. `if x = 3:`은 문법 오류입니다.

## 5. 제어문

세 가지 흐름: **sequential**(순서대로), **conditional**(조건에 따라), **looping**(여러 번 반복). 조건은 **Boolean condition**(참 또는 거짓).

### 블록과 들여쓰기

```python
snack = "pizza"
if snack == "pb & j":
    print("yummy")
    print("sticky")
    print("gooey")
else:
    print("Must be pizza")
print("That's All, Folks")
```

출력:
```text
Must be pizza
That's All, Folks
```

**Compound statement**(블록)는 단일 문장이 올 수 있는 곳 어디에나 올 수 있습니다. Python은 중괄호 대신 **들여쓰기**로 블록을 구분하므로, 마지막 `print`를 들여쓰면 `else` 안으로 들어가 결과가 달라집니다.

### 반복과 sentinel

> [!CONCEPT]
> **Sentinel value** — 진짜 데이터가 아니라 "더 이상 데이터가 없다"는 **신호로 쓰는 값**. 예: 음수 입력 시 종료(6장 어셈블리 Figure 6.8도 같은 구조).
>
> **Infinite loop** — 조건이 한 번 참이 되면 영원히 참이라 본문이 끝없이 실행되는 것.

```python
total = 0
value = int(input("Enter a number (-1 to stop): "))
while value != -1:          # -1 이 sentinel
    total = total + value
    value = int(input("Enter a number (-1 to stop): "))
print("Total:", total)
```

> [!QUIZ]
> 다음 코드의 출력을 쓰시오. (Sample Q10)
>
> ```python
> low = 1
> high = 20
> while low < high:
>     print(low, " ", high)
>     low = low + 1
>     high = high - 1
> ```

> [!HINT 1]
> 매 회차 low는 1 커지고 high는 1 작아집니다. 둘의 차이가 2씩 줄어듭니다.

> [!ANSWER]
> ```text
> 1   20
> 2   19
> 3   18
> 4   17
> 5   16
> 6   15
> 7   14
> 8   13
> 9   12
> 10   11
> ```
> 10줄. low = 11, high = 10이 되면 `11 < 10`이 거짓이라 끝난다. `print(low, " ", high)`는 쉼표마다 공백을 하나씩 넣으므로 숫자 사이에 공백이 **3개**(공백 + `" "` + 공백) 들어간다.

## 6. 모듈과 함수

**Module** — 유용한 코드 모음. `import math`처럼 가져와 씁니다.

> [!CONCEPT]
> **함수는 하나의 하위 작업(subtask)만** 하도록 만든다.
>
> ```python
> def function_identifier():
>     body of the function
> ```
>
> | 용어 | 뜻 |
> | --- | --- |
> | **Argument list** | 함수를 **호출할 때** 넘기는 값 `area(3, 4)`의 `3, 4` |
> | **Parameter list** | 함수 **정의에서** 값을 받는 지역 변수 `def area(w, h)`의 `w, h` |
> | **return** | 값을 돌려주고 함수를 끝냄. 값 없는 `return`은 그냥 함수를 빠져나옴 |
> | **Local variable** | 함수 안에서 만들어져 **그 함수 밖에서는 모름** |
> | **Global variable** | 프로그램 전체에서 알려짐 |

> [!QUIZ]
> 출력을 쓰시오.
>
> ```python
> x = 10
> def f():
>     x = 5
>     print("in f:", x)
> f()
> print("global:", x)
> ```

> [!ANSWER]
> ```text
> in f: 5
> global: 10
> ```
> f 안의 `x = 5`는 **새 지역 변수**를 만든다. 전역 x를 바꾸려면 함수 안에 `global x`를 선언해야 한다.

교재의 SportsWorld 프로그램(원 둘레·넓이 계산)은 version 1 → 4로 가며 하나의 긴 프로그램을 **getInput, doPerimeter, doArea** 같은 함수로 나누고, 전역 변수 대신 **인자와 return**으로 값을 주고받도록 고쳐 갑니다. 함수가 서로 몰래 전역 변수를 바꾸지 않아야 유지보수가 쉽습니다.

## 7. 객체지향 프로그래밍 (OOP)

프로그램을 세계의 일부를 **시뮬레이션**하는 것으로 보고, 그 세계를 **객체(object)** 로 채웁니다. 실제 세계에서 일은 개체가 하므로 더 "자연스러운" 관점입니다.

| 용어 | 뜻 |
| --- | --- |
| **Class** | 객체의 설계도. `class Circle:` |
| **Object** | 클래스의 **인스턴스** |
| **Method** | 클래스에 속한 함수 |
| **Encapsulation** | 데이터와 그 데이터를 다루는 함수를 **한 클래스에 묶음** |
| **Inheritance** | 기존 클래스(superclass)를 **확장**해 새 클래스(subclass)를 만듦. "ExperimentRobot extends Robot" |
| **Polymorphism** | 같은 이름의 메서드가 클래스마다 **다르게 동작** (`paintComponent`가 JButton, JPanel마다 다름) |

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius
    def area(self):
        return 3.14159 * self.radius ** 2

c = Circle(2)
print(c.area())      # 12.56636
```

---

## 8. 과제 0.1 Question A: 알람 시각 계산

수업 시작 시각 H시 M분, 스누즈 횟수 K가 주어질 때 알람 시각 = 시작 시각 − 25분 − 5K분.

| 입력 | 출력 |
| --- | --- |
| 9 0 0 | 8 35 |
| 10 0 3 | 9 20 |
| 8 30 2 | 7 55 |
| 8 5 1 | 7 35 |
| 7 20 4 | 6 35 |

> [!CONCEPT]
> **모두 분으로 바꿔 빼고, 다시 시·분으로 나눈다.** 시·분을 따로 빌려 오는(borrow) 방식은 빼는 양이 60분을 넘을 때 틀리기 쉽다.
>
> ```text
> For each of the five days do
>     Get H, M, K
>     Set total to H × 60 + M − 25 − 5 × K
>     If total < 0 then Set total to total + 1440     -- 자정 이전으로 넘어감
>     Print total ÷ 60 (quotient) and total mod 60
> ```
>
> ```python
> for _ in range(5):
>     H, M, K = map(int, input().split())
>     total = H * 60 + M - 25 - 5 * K
>     if total < 0:
>         total += 24 * 60
>     print(total // 60, total % 60)
> ```

> [!TRAP]
> 다음처럼 "분이 모자라면 시간을 빌리는" 코드는 주어진 테스트 케이스 5개를 모두 통과하지만 **틀렸습니다.**
>
> ```c
> if ((m - 25 - k*5) < 0) {
>     m = m + 35 - k*5;      // 60을 더하고 25+5k 를 뺌
>     if (m < 0) { h -= 2; m += 60; }
>     h -= 1;
>     if (h < 0) h += 24;
> } else {
>     m = m - 25 - k*5;
> }
> ```
>
> 입력 `9 0 10`(75분 전): 정답 **7 45**, 이 코드 **6 45**. 두 번째로 모자랄 때 이미 1시간을 빌렸는데 `h -= 2`를 하고 아래에서 또 `h -= 1`을 해서 **3시간**을 빼기 때문입니다. `h -= 1`로 고치거나, 위의 "분으로 바꾸기" 방식을 쓰세요. 교훈: **예시 테스트 케이스 통과 ≠ 정확성(correctness)**. 경계값(K = 10, M = 0, H = 0)을 직접 넣어 보세요.

## 9. 과제 0.2 Question A: 3-6-9 게임

1부터 N까지, 숫자에 3·6·9가 나오는 **횟수만큼** `*`로 바꿉니다. 35 → `*`, 36 → `**`.

```python
n = int(input())
out = []
for i in range(1, n + 1):
    s = str(i)
    cnt = s.count('3') + s.count('6') + s.count('9')
    out.append('*' * cnt if cnt > 0 else s)
print(' '.join(out))
```

입력 33 → `1 2 * 4 5 * 7 8 * 10 11 12 * 14 15 * 17 18 * 20 21 22 * 24 25 * 27 28 * * * * **`

> [!NOTE]
> - **시간**: 1~N 각 수의 자릿수(약 log₁₀ N)를 검사 → Θ(N log N). 자릿수를 상수로 보면 **Θ(N)**.
> - **공간**: 출력 리스트에 N개 → Θ(N). 바로바로 출력하면 Θ(1) 추가 공간.
> - 30(`*`), 33(`**`)처럼 0이 있거나 같은 숫자가 두 번 나오는 경우를 꼭 테스트하세요.

## 10. 과제 0.2 Question B: 학번 계산기의 버그

규칙: 국어 > 영어면 (국 − 영) × 508, 아니면 (영 − 국) × 108 / 수학 > 과학이면 (수 − 과) × 212, 아니면 (과 − 수) × 305 / 제2외국어를 봤으면 점수 × 707 / 세 값을 더해 × 4763.

과제에 주어진 샘플 코드의 일부:

```python
if korean > english:
    val1 = (korean - english) * 508
else:
    val1 = (korean - english) * 108      # ← ?
if math > science:
    val2 = (math - science) * 212
else:
    val2 = (math - science) * 305        # ← ?
```

> [!QUIZ]
> 테스트 케이스 #2 (T = 5, 점수 88 92 90 90 35)의 기대 출력은 120908755이다. 샘플 코드의 출력은 무엇이고 어디를 고쳐야 하는가? 고친 코드로 테스트 케이스 #3 (T = 4, 70 80 90 60)의 출력은?

> [!HINT 1]
> 국어 88 < 영어 90이므로 else 쪽을 탑니다. (88 − 90)의 부호를 보세요.

> [!ANSWER]
> 샘플 코드: val1 = (88 − 90) × 108 = **−216**, val2 = 424, val3 = 24,745 → 24,953 × 4,763 = **118851139** → **틀림**
>
> else 쪽은 **차이를 양수로** 만들어야 하므로 빼는 순서를 바꾼다.
>
> ```python
> else:
>     val1 = (english - korean) * 108
> ...
> else:
>     val2 = (science - math) * 305
> ```
> 고친 뒤 #2: 216 + 424 + 24,745 = 25,385 × 4,763 = **120908755** ✓
>
> #3 (제2외국어 안 봄 → val3 = 0): (90 − 70) × 108 = 2,160, (80 − 60) × 212 = 4,240 → 6,400 × 4,763 = **30483200**
> (고치지 않은 코드라면 (−2,160 + 4,240) × 4,763 = 9,907,040)
>
> 시간 복잡도: 과목이 최대 5개로 고정이라 입력 크기와 무관하게 일정 → **Θ(1)**.

## 11. 과제 0.3: Next.js 웹앱 (참고)

Next.js 튜토리얼 1~5장(Getting Started ~ Navigating Between Pages)을 따라 대시보드 앱을 만들고, 로고·그림·메뉴(Profile)를 바꾸는 과제입니다. 시험 범위의 개념과 연결하면:

- 우리가 쓰는 웹 화면은 수많은 **system software와 라이브러리 위에 만들어진 virtual machine**(다음 강의)입니다.
- `pnpm dev`로 띄우는 개발 서버, 파일 경로(`/app/page.tsx`)가 곧 페이지 주소가 되는 규칙 모두 **abstraction**의 예입니다.

---

## 정리 카드

> [!FLASHCARD]
> Q: sentinel value란?
> A: 정당한 데이터가 아니라 "더 이상 데이터가 없음"을 알리는 신호로 쓰는 특별한 값.

> [!FLASHCARD]
> Q: argument와 parameter의 차이는?
> A: argument는 호출할 때 넘기는 값, parameter는 함수 정의에서 그 값을 받는 지역 변수.

> [!FLASHCARD]
> Q: local variable과 global variable의 차이는?
> A: local은 함수 안에서 만들어져 그 함수 안에서만 알려지고, global은 프로그램 전체에서 알려진다.

> [!FLASHCARD]
> Q: OOP의 세 핵심 요소는?
> A: encapsulation(데이터+메서드 묶기), inheritance(superclass를 확장한 subclass), polymorphism(같은 메서드 이름이 클래스마다 다르게 동작).

> [!FLASHCARD]
> Q: Python의 7 / 2, 7 // 2, 7 % 2 결과는?
> A: 3.5, 3, 1.
