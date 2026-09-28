---
title: "3주차: 조건문, 반복문과 함수"
description: "비교·논리 연산, 분기, 예외 처리, 반복문, 함수와 변수 범위를 코드로 익힙니다."
order: 2
published: true
---

# 3주차: 조건문, 반복문과 함수

## 이번 주 학습 목표

*1p~2p*

- 비교식과 논리식을 조합해 조건을 표현할 수 있다.
- `if`, `elif`, `else`로 실행 흐름을 나눌 수 있다.
- `for`, `while`, `break`, `continue`를 상황에 맞게 사용할 수 있다.
- 매개변수와 반환값이 있는 함수를 정의할 수 있다.
- 지역 변수와 전역 변수의 범위를 구분할 수 있다.

## 비교 연산자

*3p~4p*

비교 연산의 결과는 항상 `True` 또는 `False`이다.

| 연산자 | 의미 | 예시 |
|---|---|---|
| `<`, `>` | 작다, 크다 | `3 > 2` → `True` |
| `<=`, `>=` | 작거나 같다, 크거나 같다 | `3 >= 3` → `True` |
| `==` | 값이 같다 | `3 == 2` → `False` |
| `!=` | 값이 다르다 | `3 != 2` → `True` |

> [!CAUTION]
> `=`는 값을 할당하고 `==`는 두 값이 같은지 비교한다. 조건식에서는 두 기호를 혼동하지 않는다.

## 조건에 따라 분기하기

*5p~11p*

`if`는 조건이 참일 때 들여쓴 블록을 실행한다. 여러 조건은 위에서 아래로 검사하며, 처음 참이 된 블록 하나만 실행한다.

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

> [!TIP]
> 조건의 순서가 중요하다. 점수가 `90` 이상인지 확인하기 전에 `60` 이상인지 먼저 검사하면 90점도 먼저 만난 조건에 걸려 낮은 등급을 받는다.

## 예외 처리

*12p*

예외 처리는 실행 중 발생할 수 있는 오류를 예상하고 프로그램이 적절히 대응하게 한다.

```python
raw = input("화씨 온도를 입력하세요: ")

try:
    fahrenheit = float(raw)
    celsius = (fahrenheit - 32.0) * 5.0 / 9.0
except ValueError:
    print("숫자를 입력해야 합니다.")
else:
    print(f"섭씨 온도: {celsius:.1f}℃")
```

> [!CAUTION]
> 이유를 모른 채 모든 오류를 잡는 `except:`는 실제 버그까지 숨길 수 있다. 여기서는 숫자 변환 실패만 예상하므로 `except ValueError:`처럼 구체적으로 적는다.

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
    print("입장 가능")
```

`and`가 `or`보다 먼저 계산된다. 복잡한 조건은 괄호로 의도를 분명하게 표현한다.

## for 반복문과 range

*17p~20p*

`for`는 문자열, 리스트, 튜플처럼 반복 가능한 객체의 요소를 하나씩 꺼내 실행한다.

```python
numbers = [6, 5, 3, 8, 4, 2, 5, 4, 11]
total = 0

for number in numbers:
    total += number

print(total)  # 48
```

`range(start, stop, step)`은 정수의 흐름을 만든다. `stop`은 포함하지 않는다.

```python
print(list(range(10)))        # 0~9
print(list(range(2, 8)))      # 2~7
print(list(range(2, 20, 3)))  # 2, 5, 8, 11, 14, 17
```

인덱스와 값이 모두 필요하다면 `range(len(...))`보다 `enumerate()`가 명확하다.

```python
genres = ["pop", "rock", "jazz"]

for index, genre in enumerate(genres, start=1):
    print(index, genre)
```

## while, break와 continue

*21p~26p*

`while`은 조건이 참인 동안 반복한다. 반복을 끝낼 수 있도록 조건에 사용된 값이 반드시 변해야 한다.

```python
n = 10
total = 0
i = 1

while i <= n:
    total += i
    i += 1

print(total)  # 55
```

| 명령 | 동작 |
|---|---|
| `break` | 현재 반복문 전체를 즉시 종료 |
| `continue` | 현재 회차의 나머지만 건너뛰고 다음 회차로 이동 |

```python
for char in "string":
    if char == "i":
        continue
    print(char)
```

> [!EXAM]
> `break`는 `if`문이 아니라 자신을 감싸는 가장 가까운 **반복문**을 빠져나간다.

## 함수 정의와 반환값

*27p~30p*

함수는 반복되는 작업에 이름을 붙인 코드 단위이다. 매개변수로 입력을 받고 `return`으로 결과를 돌려줄 수 있다.

```python
def absolute_value(number):
    """숫자의 절댓값을 반환한다."""
    if number >= 0:
        return number
    return -number

print(absolute_value(-4))  # 4
```

`print()`는 화면에 값을 보여주고, `return`은 호출한 곳에 값을 전달한다. `return`이 없는 함수도 실제로는 `None`을 반환한다.

> [!DEFINITION]
> **매개변수(parameter)**는 함수를 정의할 때 쓰는 이름이고, **인자(argument)**는 함수를 호출할 때 전달하는 실제 값이다.

## 기본 인자, 키워드 인자와 가변 인자

*31p~35p*

```python
def greet(name, message="좋은 아침입니다!"):
    return f"안녕하세요, {name}. {message}"

print(greet("Kate"))
print(greet("Bruce", message="잘 지내세요?"))
print(greet(message="반갑습니다!", name="Monica"))
```

기본값이 있는 매개변수는 기본값이 없는 매개변수 뒤에 둔다. 호출할 때는 위치 인자를 키워드 인자보다 먼저 적는다.

```python
def greet_all(*names):
    for name in names:
        print(f"안녕하세요, {name}")

greet_all("Monica", "Luke", "Steve", "John")
```

`*names`는 전달된 여러 위치 인자를 하나의 튜플로 모은다.

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

print(calculate(8, 2, 4))  # 4.0
```

## 변수의 범위

*38p~40p*

함수 안에서 만든 변수는 기본적으로 **지역 변수**, 함수 밖에서 만든 변수는 **전역 변수**이다.

```python
x = 5

def show_scope():
    x = 10
    print("지역 x:", x)

show_scope()          # 지역 x: 10
print("전역 x:", x)  # 전역 x: 5
```

함수 내부에서 전역 변수를 읽는 것은 가능하지만, 대입하려면 `global` 선언이 필요하다. 그러나 전역 상태를 직접 수정하면 함수의 동작을 추적하기 어려워지므로 값을 인자로 받고 결과를 반환하는 설계를 우선한다.

```python
counter = 0

def increment(value, amount=2):
    return value + amount

counter = increment(counter)
```

## 핵심 점검

*3p~40p*

- 비교 연산의 결과 자료형은 {{bool}}이다.
- 여러 분기 중 처음 참이 된 블록 {{하나만}} 실행된다.
- `range(2, 8)`의 마지막 값은 {{7}}이다.
- `continue`는 현재 회차만 건너뛰고, `break`는 {{반복문 전체}}를 끝낸다.
- 함수 안에서 만든 변수는 기본적으로 {{지역 변수}}이다.

