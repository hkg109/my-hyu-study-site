---
title: "3주차: 조건문, 반복문과 함수"
description: "비교·논리 연산, if·elif·else 분기, try·except 예외 처리, for·range·enumerate와 while·break·continue 반복, 함수의 매개변수·반환값·기본 인자·가변 인자와 변수 범위를 코드와 실행 결과로 정리합니다."
order: 2
published: true
duration: 90
tags: [AI-R-PY, Python, 조건문, 반복문, 함수, 예외처리]
objectives:
  - 비교식과 논리식을 조합해 조건을 표현할 수 있다.
  - if, elif, else로 실행 흐름을 나눌 수 있다.
  - try, except로 예상되는 오류에 대응할 수 있다.
  - for, while, break, continue를 상황에 맞게 사용할 수 있다.
  - 매개변수와 반환값이 있는 함수를 정의할 수 있다.
  - 지역 변수와 전역 변수의 범위를 구분할 수 있다.
---

## 학습 경로

[이전: 2주차 · 자료형과 컬렉션](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-01) · [다음: 4주차 · 파일 입출력과 Pandas](/lectures/grade-01/semester-muheifg4/subject-muhz3nd1/lecture-03)

**범위:** 3주차 슬라이드 3–40

## 단원 도입

> [!BOARD]
> **이번 주의 흐름**
> - **PART 1** 조건 → 비교 연산 → `if`·`elif`·`else` → 예외 처리 → 논리 연산
> - **PART 2** 반복 → `for`와 `range`·`enumerate` → `while` → `break`·`continue`
> - **PART 3** 함수 → 정의와 `return` → 기본·키워드·가변 인자 → 변수의 범위

| 핵심 포인트 | 중요도 | 이렇게 확인한다 |
|---|:---:|---|
| `if`·`elif`는 처음 참이 된 블록 하나만 실행 | ★★★ | 조건 순서를 바꿨을 때 결과 예측하기 |
| `range(start, stop, step)`은 stop을 포함하지 않음 | ★★★ | `list(range(2, 20, 3))` 쓰기 |
| `break` vs `continue` | ★★★ | 반복문 출력 결과 쓰기 |
| `print` vs `return`, `return` 없으면 `None` | ★★ | 함수 결과를 변수에 넣었을 때의 값 |
| 지역 변수 vs 전역 변수 | ★★ | 함수 안팎의 `x` 출력 결과 |
| `=`(할당) vs `==`(비교) | ★ | 조건식 오류 찾기 |

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 헷갈리기 쉬운 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!PAGEBREAK]

## PART 1 · 조건

## 비교 연산자

*3p~4p*

비교 연산의 결과는 항상 `True` 또는 `False`(자료형 `bool`)다.

| 연산자 | 의미 | 예시 |
|---|---|---|
| `<`, `>` | 작다, 크다 | `3 > 2` → `True` |
| `<=`, `>=` | 작거나 같다, 크거나 같다 | `3 >= 3` → `True` |
| `==` | 값이 같다 | `3 == 2` → `False` |
| `!=` | 값이 다르다 | `3 != 2` → `True` |

> [!TRAP]
> `=`는 값을 ==red:할당==하고 `==`는 두 값이 같은지 ==red:비교==한다. `if x = 3:`은 `SyntaxError`다. 또 문자열 비교는 대소문자를 구분해 `"A" == "a"`는 `False`이고, `"10" == 10`도 자료형이 달라 `False`다.

> [!NOTE]
> 파이썬은 비교를 이어 쓸 수 있다. `0 <= score <= 100`은 `0 <= score and score <= 100`과 같다.

## 조건에 따라 분기하기

*5p~11p*

`if`는 조건이 참일 때 들여쓴 블록을 실행한다. 여러 조건은 위에서 아래로 검사하며, ==yellow:처음 참이 된 블록 하나만== 실행한다.

```python
number = float(input("숫자를 입력하세요: "))

if number > 0:
    print("양수")
elif number == 0:
    print("0")
else:
    print("음수")
```

| 구조 | 적합한 상황 |
|---|---|
| `if` | 조건이 참일 때만 작업 |
| `if ... else` | 두 경우 중 하나를 반드시 선택 |
| `if ... elif ... else` | 서로 배타적인 여러 경우 중 하나를 선택 |
| 중첩 `if` | 바깥 조건이 참일 때 세부 조건을 다시 검사 |

> [!TRAP]
> 조건의 ==red:순서가 중요==하다. 점수가 `90` 이상인지 확인하기 전에 `60` 이상인지 먼저 검사하면 90점도 먼저 만난 조건에 걸려 낮은 등급을 받는다.
> ```python
> score = 95
> if score >= 60:      # 95도 여기서 걸림 → "D"
>     grade = "D"
> elif score >= 90:    # 영영 실행되지 않음
>     grade = "A"
> ```
> 범위 조건은 ==큰 값(좁은 조건)부터== 검사한다.

> [!NOTE]
> `elif` 여러 개와 `if` 여러 개는 다르다. `if`를 따로따로 쓰면 ==참인 조건마다 모두 실행==되고, `elif`로 이으면 ==처음 참인 것 하나만== 실행된다. 들여쓰기(보통 공백 4칸)로 블록을 구분하므로, 들여쓰기가 어긋나면 `IndentationError`가 나거나 의도와 다른 블록에 들어간다.

## 예외 처리

*12p*

예외 처리는 실행 중 발생할 수 있는 오류를 예상하고 프로그램이 적절히 대응하게 한다.

```python
raw = input("화씨 온도를 입력하세요: ")

try:
    fahrenheit = float(raw)                       # 실패할 수 있는 코드
    celsius = (fahrenheit - 32.0) * 5.0 / 9.0
except ValueError:                                # 숫자로 못 바꿨을 때
    print("숫자를 입력해야 합니다.")
else:                                             # 오류 없이 끝났을 때만
    print(f"섭씨 온도: {celsius:.1f}℃")
```

> [!BOARD]
> **try 블록의 흐름**
> - ==blue:try== → 오류가 날 수 있는 코드를 실행
> - 오류 발생 → 남은 try 코드를 건너뛰고 ==blue:except==로
> - 오류 없음 → ==blue:else== 실행 (있을 때)
> - `finally`를 쓰면 오류 여부와 상관없이 마지막에 항상 실행

> [!CAUTION]
> 이유를 모른 채 모든 오류를 잡는 `except:`는 실제 버그까지 숨길 수 있다. 여기서는 숫자 변환 실패만 예상하므로 `except ValueError:`처럼 구체적으로 적는다. 7주차 Drill 707은 이 원리를 거꾸로 써서, `int()` 변환이 ==성공하는지 여부로 이상값을 찾는다==.

## 논리 연산자

*13p~16p*

| 연산자 | 참이 되는 경우 | 핵심 |
|---|---|---|
| `and` | 양쪽이 모두 참 | 조건을 좁힌다 |
| `or` | 하나 이상 참 | 조건을 넓힌다 |
| `not` | 원래 조건이 거짓 | 결과를 뒤집는다 |

```python
age = 21
has_id = True

if age >= 19 and has_id:
    print("입장 가능")      # → 입장 가능
```

`not` → `and` → `or` 순서로 계산된다. 복잡한 조건은 괄호로 의도를 분명하게 표현한다.

> [!TRAP]
> `if x == 1 or 2:`는 “x가 1 또는 2”가 ==red:아니다==. `(x == 1) or 2`로 해석되고, `2`는 항상 참이라 조건이 늘 참이 된다. `if x == 1 or x == 2:` 또는 `if x in (1, 2):`로 쓴다. 4주차 Pandas 조건에서는 `and`, `or`, `not` 대신 `&`, `|`, `~`를 쓴다는 점도 기억해 둔다.

> [!CHECK]
> **1.** `score = 75`일 때 다음 코드의 출력은?
> ```python
> if score >= 70:
>     print("B")
> if score >= 60:
>     print("C")
> ```
>
> **2.** `int("3.5")`를 `try`로 감싸고 `except ValueError:`에서 `"변환 실패"`를 출력하면 결과는?

> [!PAGEBREAK]

## PART 2 · 반복

## for 반복문과 range

*17p~20p*

`for`는 문자열, 리스트, 튜플처럼 반복 가능한 객체의 요소를 하나씩 꺼내 실행한다.

```python
numbers = [6, 5, 3, 8, 4, 2, 5, 4, 11]
total = 0

for number in numbers:
    total += number          # total = total + number

print(total)  # → 48
```

`range(start, stop, step)`은 정수의 흐름을 만든다. ==stop은 포함하지 않는다==.

```python
print(list(range(10)))        # → [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(list(range(2, 8)))      # → [2, 3, 4, 5, 6, 7]
print(list(range(2, 20, 3)))  # → [2, 5, 8, 11, 14, 17]
print(list(range(5, 0, -1)))  # → [5, 4, 3, 2, 1]
```

인덱스와 값이 모두 필요하다면 `range(len(...))`보다 `enumerate()`가 명확하다.

```python
genres = ["pop", "rock", "jazz"]

for index, genre in enumerate(genres, start=1):
    print(index, genre)
# → 1 pop
# → 2 rock
# → 3 jazz
```

> [!NOTE]
> **누적 패턴.** `total = 0`처럼 반복 ==전에== 초기값을 두고, 반복 ==안에서== 하나씩 더한 뒤, 반복 ==밖에서== 결과를 쓴다. 초기화를 반복문 안에 넣으면 매번 0으로 돌아가 마지막 값만 남는다. 평균은 `total / len(numbers)`, 최댓값은 `max(numbers)`처럼 내장 함수로도 구할 수 있다.

## while, break와 continue

*21p~26p*

`while`은 조건이 참인 동안 반복한다. 반복을 끝낼 수 있도록 ==조건에 쓰인 값이 반드시 변해야== 한다.

```python
n = 10
total = 0
i = 1

while i <= n:
    total += i
    i += 1        # 이 줄이 없으면 무한 반복

print(total)  # → 55
```

| 명령 | 동작 |
|---|---|
| `break` | 현재 반복문 ==전체를 즉시 종료== |
| `continue` | 현재 회차의 ==나머지만 건너뛰고== 다음 회차로 이동 |

```python
for char in "string":
    if char == "i":
        continue
    print(char, end=" ")
# → s t r n g        ("i"만 건너뜀)

for char in "string":
    if char == "i":
        break
    print(char, end=" ")
# → s t r            ("i"에서 반복 자체가 끝남)
```

> [!TRAP]
> `break`는 `if`문이 아니라 자신을 감싸는 ==red:가장 가까운 반복문==을 빠져나간다. 반복문이 두 겹이면 안쪽 반복문만 끝나고 바깥 반복은 계속된다.

> [!BOARD]
> **for와 while 고르기**
> - 반복 ==blue:횟수나 대상이 정해져 있다== → `for` (리스트의 각 원소, `range(10)`)
> - 반복 ==blue:끝나는 조건만 안다== → `while` (사용자가 "q"를 입력할 때까지, 합이 100을 넘을 때까지)

> [!PROBLEM]
> **예제 1.** 1부터 시작해 수를 더해 갈 때, 합이 처음으로 100을 넘는 순간의 수와 합을 구하시오.
>
> **풀이.**
> 1. 끝나는 조건만 알므로 `while`을 쓴다.
> 2. 코드:
>    ```python
>    total, i = 0, 0
>    while total <= 100:
>        i += 1
>        total += i
>    print(i, total)
>    ```
> 3. 1+2+…+13 = 91, 1+2+…+14 = 105 → 출력 `14 105`

> [!PAGEBREAK]

## PART 3 · 함수

## 함수 정의와 반환값

*27p~30p*

함수는 반복되는 작업에 이름을 붙인 코드 단위다. 매개변수로 입력을 받고 `return`으로 결과를 돌려줄 수 있다.

```python
def absolute_value(number):
    """숫자의 절댓값을 반환한다."""
    if number >= 0:
        return number
    return -number

print(absolute_value(-4))  # → 4
```

> [!BOARD]
> **print와 return**
> - `print()` → 값을 ==blue:화면에 보여 줄 뿐== → 결과를 다른 계산에 쓸 수 없음
> - `return` → 값을 ==blue:호출한 곳에 돌려줌== → 변수에 저장하고 이어서 계산 가능
> - `return`을 만나면 함수는 ==즉시 끝난다== → 위의 `absolute_value`에서 `else`가 없어도 되는 이유
> - `return`이 없는 함수도 실제로는 `None`을 반환

```python
def show(x):
    print(x * 2)

result = show(3)   # 화면에 6이 찍힘
print(result)      # → None
```

> [!DEFINITION]
> **매개변수**(parameter)는 함수를 정의할 때 쓰는 이름이고, **인자**(argument)는 함수를 호출할 때 전달하는 실제 값이다. `def absolute_value(number):`의 `number`가 매개변수, `absolute_value(-4)`의 `-4`가 인자다.

## 기본 인자, 키워드 인자와 가변 인자

*31p~35p*

```python
def greet(name, message="좋은 아침입니다!"):
    return f"안녕하세요, {name}. {message}"

print(greet("Kate"))                              # → 안녕하세요, Kate. 좋은 아침입니다!
print(greet("Bruce", message="잘 지내세요?"))       # → 안녕하세요, Bruce. 잘 지내세요?
print(greet(message="반갑습니다!", name="Monica"))  # → 안녕하세요, Monica. 반갑습니다!
```

| 종류 | 정의 | 호출 | 특징 |
|---|---|---|---|
| 위치 인자 | `def f(a, b)` | `f(1, 2)` | 순서대로 대응 |
| 키워드 인자 | | `f(b=2, a=1)` | 이름으로 대응, 순서 무관 |
| 기본 인자 | `def f(a, b=10)` | `f(1)` | 생략하면 기본값 |
| 가변 인자 | `def f(*args)` | `f(1, 2, 3)` | 여러 값을 ==튜플==로 모음 |

> [!TRAP]
> - 기본값이 있는 매개변수는 ==red:기본값이 없는 매개변수 뒤에== 둔다. `def greet(message="hi", name):`은 `SyntaxError`다.
> - 호출할 때는 ==red:위치 인자를 키워드 인자보다 먼저== 적는다. `greet(message="hi", "Kate")`는 `SyntaxError`다.

```python
def greet_all(*names):
    for name in names:
        print(f"안녕하세요, {name}")

greet_all("Monica", "Luke", "Steve", "John")
```

`*names`는 전달된 여러 위치 인자를 하나의 튜플 `("Monica", "Luke", "Steve", "John")`로 모은다.

## 함수 연습: 사칙연산 계산기

*36p~37p*

```python
def calculate(left, right, operation):
    if operation == 1:
        return left + right
    if operation == 2:
        return left - right
    if operation == 3:
        return left * right
    if operation == 4:
        if right == 0:
            raise ValueError("0으로 나눌 수 없습니다.")
        return left / right
    raise ValueError("operation은 1~4여야 합니다.")

print(calculate(8, 2, 4))  # → 4.0
```

> [!NOTE]
> `raise`는 오류를 ==직접 일으키는== 문장이다. 잘못된 입력을 조용히 넘기지 않고 호출한 쪽에 알리며, 호출한 쪽은 앞에서 배운 `try`/`except`로 받아 처리한다. 각 `if`가 `return`으로 끝나므로 `elif`를 쓰지 않아도 하나만 실행된다.

## 변수의 범위

*38p~40p*

함수 안에서 만든 변수는 기본적으로 **지역 변수**, 함수 밖에서 만든 변수는 **전역 변수**다.

```python
x = 5

def show_scope():
    x = 10                 # 새 지역 변수 x (전역 x와 다른 것)
    print("지역 x:", x)

show_scope()          # → 지역 x: 10
print("전역 x:", x)  # → 전역 x: 5
```

> [!CONCEPT]
> **변수 범위(scope)** — 이름이 통하는 영역. 함수 안에서 값을 ==yellow:대입하는 순간 그 이름은 지역 변수==가 되고, 함수가 끝나면 사라진다. 함수 안에서 전역 변수를 ==읽기만== 하는 것은 가능하다.

> [!TRAP]
> 함수 안에서 전역 변수를 고치려고 `count += 1`처럼 쓰면, 대입이 있으므로 `count`를 지역 변수로 보는데 아직 값이 없어 `UnboundLocalError`가 ==red:난다==. `global count` 선언이 필요하지만, 전역 상태를 직접 수정하면 함수의 동작을 추적하기 어려워진다.

값을 인자로 받고 결과를 반환하는 설계를 우선한다.

```python
counter = 0

def increment(value, amount=2):
    return value + amount

counter = increment(counter)   # → counter는 2
```

> [!CHECK]
> **3.** `list(range(10, 0, -3))`의 결과는?
>
> **4.** 다음 코드의 출력은?
> ```python
> for n in [1, 2, 3, 4, 5]:
>     if n % 2 == 0:
>         continue
>     if n == 5:
>         break
>     print(n)
> ```
>
> **5.** `def f(a, b=3): return a * b`일 때 `f(2)`, `f(2, 5)`, `f(b=1, a=4)`의 값은?

---

## 정답과 해설

**1.** `B`와 `C`가 ==모두== 출력된다. `if`를 두 번 따로 썼으므로 두 조건을 각각 검사한다. `elif`였다면 `B`만 출력된다.

**2.** `변환 실패`. `int("3.5")`는 소수점이 있는 문자열이라 `ValueError`가 난다.

**3.** `[10, 7, 4, 1]`. step이 음수면 줄어들며, stop인 0은 포함하지 않는다.

**4.** `1`, `3`. 2와 4는 `continue`로 건너뛰고, 5에서 `break`로 반복이 끝나 출력되지 않는다.

**5.** `6`, `10`, `4`.

## 플래시카드

> [!FLASHCARD]
> Q: 3주차 — `if`·`elif`·`else`에서 실행되는 블록은 몇 개인가?
> A: 처음 참이 된 블록 하나만. 그래서 범위 조건은 좁은 조건(큰 값)부터 검사한다. `if`를 여러 번 따로 쓰면 참인 것이 모두 실행된다.

> [!FLASHCARD]
> Q: 3주차 — try / except / else / finally의 실행 순서는?
> A: try 실행 → 오류가 나면 except, 없으면 else → finally는 항상 마지막에 실행.

> [!FLASHCARD]
> Q: 3주차 — `if x == 1 or 2:`가 항상 참인 이유는?
> A: `(x == 1) or 2`로 해석되고 2는 참이기 때문. `x == 1 or x == 2` 또는 `x in (1, 2)`로 쓴다.

> [!FLASHCARD]
> Q: 3주차 — `range(2, 20, 3)`의 값은?
> A: 2, 5, 8, 11, 14, 17. stop(20)은 포함하지 않는다.

> [!FLASHCARD]
> Q: 3주차 — `break`와 `continue`의 차이는?
> A: break는 가장 가까운 반복문 전체를 끝내고, continue는 현재 회차의 나머지만 건너뛰고 다음 회차로 간다.

> [!FLASHCARD]
> Q: 3주차 — `print`와 `return`의 차이는?
> A: print는 화면에 보여 줄 뿐이고, return은 호출한 곳에 값을 돌려준다. return이 없는 함수는 None을 반환한다.

> [!FLASHCARD]
> Q: 3주차 — 매개변수와 인자의 차이는?
> A: 매개변수는 함수 정의의 이름, 인자는 호출할 때 넘기는 실제 값.

> [!FLASHCARD]
> Q: 3주차 — `*names`로 받은 값의 자료형은?
> A: 튜플. 전달된 여러 위치 인자를 하나로 모은다.

> [!FLASHCARD]
> Q: 3주차 — 함수 안에서 `x = 10`을 하면 전역 `x`가 바뀌는가?
> A: 아니다. 대입하는 순간 새 지역 변수가 생긴다. 전역을 바꾸려면 global 선언이 필요하지만, 인자와 반환값을 쓰는 설계가 낫다.

## 핵심 점검

- 비교 연산의 결과 자료형은 {{bool}}이다.
- 여러 분기 중 처음 참이 된 블록 {{하나만}} 실행된다.
- `range(2, 8)`의 마지막 값은 {{7}}이다.
- `continue`는 현재 회차만 건너뛰고, `break`는 {{반복문 전체}}를 끝낸다.
- `return`이 없는 함수는 {{None}}을 반환한다.
- 기본값이 있는 매개변수는 기본값이 없는 매개변수 {{뒤}}에 둔다.
- 함수 안에서 만든 변수는 기본적으로 {{지역 변수}}이다.
