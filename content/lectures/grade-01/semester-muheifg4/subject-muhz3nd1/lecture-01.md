---
title: "2주차: 파이썬 자료형과 컬렉션"
description: "자료형, 연산과 변수, 문자열, 튜플, 리스트, 딕셔너리의 핵심을 코드로 익힙니다."
order: 1
published: true
---

# 2주차: 파이썬 자료형과 컬렉션

## 이번 주 학습 목표

*1p~2p*

- 파이썬의 기본 자료형을 구분하고 `type()`으로 확인할 수 있다.
- 연산자와 변수를 사용해 값을 계산하고 저장할 수 있다.
- 문자열과 순차 자료형을 인덱싱·슬라이싱할 수 있다.
- 리스트의 변경 가능성과 참조·복사의 차이를 설명할 수 있다.
- 딕셔너리의 키와 값을 이용해 데이터를 조회·수정할 수 있다.

## 기본 자료형과 형 변환

*3p~5p*

파이썬에서 값은 저마다 **자료형(type)**을 가진다. 자료형은 저장 방식과 사용할 수 있는 연산을 결정한다.

| 자료형 | 의미 | 예시 | 확인 결과 |
|---|---|---|---|
| `int` | 정수 | `15`, `-2` | `<class 'int'>` |
| `float` | 실수 | `20.21`, `3.0` | `<class 'float'>` |
| `str` | 문자열 | `"R-Py Computing"` | `<class 'str'>` |
| `bool` | 참·거짓 | `True`, `False` | `<class 'bool'>` |

```python
values = [15, 20.21, "R-Py Computing", True]

for value in values:
    print(value, type(value))
```

형 변환 함수는 값을 다른 자료형으로 바꾸어 새 값을 만든다.

```python
float(3)       # 3.0
int(1.9)       # 1: 소수점 아래를 버림
int("1")       # 1
str(3.5)       # "3.5"
int(True)      # 1
bool(0)        # False
```

> [!CAUTION]
> `int("A")`처럼 숫자로 해석할 수 없는 문자열을 정수로 바꾸면 `ValueError`가 발생한다. 또한 `bool("False")`는 빈 문자열이 아니므로 `True`이다.

## 표현식, 연산자와 변수

*6p~12p*

**표현식(expression)**은 값과 연산자를 조합해 새로운 값을 만드는 코드이다. 연산 대상은 **피연산자**, 계산 규칙을 나타내는 기호는 **연산자**라고 한다.

| 연산 | 연산자 | 예시 | 결과 |
|---|---:|---:|---:|
| 덧셈 | `+` | `50 + 10` | `60` |
| 뺄셈 | `-` | `50 - 10` | `40` |
| 곱셈 | `*` | `50 * 10` | `500` |
| 나눗셈 | `/` | `50 / 12` | `4.166...` |
| 몫 | `//` | `50 // 12` | `4` |
| 나머지 | `%` | `50 % 12` | `2` |
| 거듭제곱 | `**` | `5 ** 2` | `25` |

괄호가 가장 먼저 계산되며, 그다음은 거듭제곱, 곱셈·나눗셈, 덧셈·뺄셈 순서이다.

```python
hour = 3
minute = 50

total_minutes = hour * 60 + minute
print(total_minutes)  # 230
```

변수는 값을 가리키는 이름이다. `=`는 같음을 비교하는 기호가 아니라 오른쪽 값을 왼쪽 이름에 **할당**하는 연산자다.

> [!CAUTION]
> 변수 이름은 숫자로 시작할 수 없고, `if`, `for`, `class` 같은 파이썬 키워드를 사용할 수 없다. 의미가 드러나는 `total_minutes` 같은 이름을 쓰는 것이 좋다.

## 문자열: 인덱싱과 슬라이싱

*13p~20p*

문자열은 문자가 순서대로 놓인 **불변 시퀀스**이다. 인덱스는 `0`부터 시작하고, 음수 인덱스는 뒤에서부터 센다.

```python
name = "MICHAEL JACKSON"

print(name[0])      # M
print(name[-1])     # N
print(name[0:4])    # MICH
print(name[8:12])   # JACK
print(len(name))    # 15
```

슬라이스 `문자열[시작:끝]`은 시작 위치를 포함하지만 끝 위치는 포함하지 않는다.

| 표현 | 뜻 |
|---|---|
| `text[:3]` | 처음부터 인덱스 3 직전까지 |
| `text[3:]` | 인덱스 3부터 끝까지 |
| `text[::2]` | 처음부터 두 칸씩 건너뛰기 |
| `text[::-1]` | 문자열 뒤집기 |

```python
statement = "Michael Jordan is the best basketball player"
print(statement[18:37])  # the best basketball
```

> [!CAUTION]
> 문자열은 불변(immutable)이므로 `greeting[0] = "J"`처럼 일부 문자만 바꿀 수 없다. `"J" + greeting[1:]`처럼 새 문자열을 만들어야 한다.

## 문자열 메서드

*21p~23p*

메서드는 특정 자료형의 값에 연결된 기능이다. 원본 문자열을 직접 바꾸지 않고 결과 문자열을 새로 반환한다.

```python
word = "banana"

print(word.upper())        # BANANA
print(word.capitalize())   # Banana
print(word.find("na"))     # 2
print(word.find("na", 3))  # 4
print(word.replace("a", "o"))  # bonono
```

`dir(word)`는 사용할 수 있는 속성과 메서드를, `help(str.find)`는 사용법을 확인할 때 유용하다.

## 튜플과 리스트의 공통점·차이점

*24p~30p*

튜플과 리스트는 여러 값을 순서대로 저장한다. 서로 다른 자료형도 함께 담을 수 있지만, **변경 가능성**이 다르다.

| 구분 | 튜플 `tuple` | 리스트 `list` |
|---|---|---|
| 표기 | `(10, 9, 6)` | `[10, 9, 6]` |
| 순서 | 있음 | 있음 |
| 인덱싱·슬라이싱 | 가능 | 가능 |
| 생성 후 요소 변경 | 불가능 | 가능 |
| 주 용도 | 바뀌지 않을 값의 묶음 | 계속 추가·수정할 데이터 |

```python
ratings = (10, 9, 6, 5)
scores = [10, 9, 6, 5]

print(ratings[1:3])  # (9, 6)
scores[1] = 8
print(scores)        # [10, 8, 6, 5]
```

요소가 하나뿐인 튜플은 쉼표가 필요하다.

```python
single_tuple = ("A",)
not_a_tuple = ("A")  # 문자열
```

## 리스트 메서드와 집계

*31p~33p*

```python
letters = ["a", "b", "c"]
letters.append("d")             # 한 요소를 끝에 추가
letters.extend(["e", "f"])     # 여러 요소를 펼쳐서 추가
letters.remove("b")             # 값으로 삭제
last = letters.pop()             # 마지막 요소를 꺼내며 삭제
letters.sort()                   # 리스트 자체를 정렬

print(letters, last)
```

| 함수·메서드 | 역할 | 원본 변경 여부 |
|---|---|---|
| `append(x)` | `x`를 요소 하나로 추가 | 변경 |
| `extend(xs)` | 반복 가능한 값의 요소들을 추가 | 변경 |
| `pop(i)` | `i` 위치 요소를 반환하며 삭제 | 변경 |
| `remove(x)` | 첫 번째 `x`를 삭제 | 변경 |
| `sorted(xs)` | 정렬된 새 리스트 반환 | 변경 안 함 |
| `len`, `min`, `max`, `sum` | 길이·최솟값·최댓값·합계 계산 | 변경 안 함 |

```python
numbers = [3, 41, 12, 9, 74, 15]
average = sum(numbers) / len(numbers)
print(min(numbers), max(numbers), average)
```

## 리스트 참조와 복사

*34p~38p*

리스트 변수에는 리스트 자체가 아니라 그 객체를 찾는 **참조**가 저장된다.

```python
a = ["Banana", 3, 1.5]
b = a
b[0] = "Apple"

print(a)  # ['Apple', 3, 1.5]
```

`a`와 `b`가 같은 리스트를 가리키므로 한쪽의 수정이 다른 쪽에서도 보인다. 독립적인 얕은 복사본은 슬라이싱이나 `copy()`로 만든다.

```python
a = ["Apple", 3, 1.5]
b = a.copy()
a[0] = "Peach"

print(a)  # ['Peach', 3, 1.5]
print(b)  # ['Apple', 3, 1.5]
```

> [!CAUTION]
> 얕은 복사는 내부에 중첩 리스트가 있으면 그 내부 객체까지 복제하지 않는다. 완전히 독립된 중첩 구조가 필요하면 `copy.deepcopy()`를 사용한다.

## 딕셔너리: 키로 값을 찾는 자료형

*39p~43p*

딕셔너리는 **키(key)와 값(value)의 쌍**을 저장한다. 키는 중복될 수 없고, 문자열·숫자·튜플처럼 변경 불가능한 값을 사용한다.

```python
student = {
    "name": "Jack",
    "age": 26,
}

print(student["name"])       # Jack
print(student.get("age"))    # 26

student["age"] = 27          # 수정
student["address"] = "Seoul" # 추가
del student["address"]       # 삭제
```

| 표현 | 동작 | 키가 없을 때 |
|---|---|---|
| `d[key]` | 값 조회 | `KeyError` |
| `d.get(key)` | 값 조회 | `None` |
| `d.get(key, default)` | 값 조회 | 지정한 기본값 |
| `key in d` | 키 존재 여부 | `False` |
| `d.values()` | 모든 값 보기 | 빈 뷰 |
| `d.items()` | 모든 키·값 쌍 보기 | 빈 뷰 |

> [!EXAMPLE]
> `"one" in eng2sp`는 키를 검사한다. 값에 `"uno"`가 있는지 확인하려면 `"uno" in eng2sp.values()`라고 쓴다.

## 핵심 점검

*3p~43p*

- 문자열과 튜플은 {{변경 불가능한 자료형}}이고, 리스트와 딕셔너리는 {{변경 가능한 자료형}}이다.
- 슬라이스의 끝 인덱스는 결과에 {{포함되지 않는다}}.
- `b = a`는 리스트 복사가 아니라 같은 객체에 대한 {{참조 공유}}이다.
- 딕셔너리는 위치가 아니라 {{키}}로 값을 찾는다.

> [!EXAM]
> `append([3, 4])`는 리스트 `[3, 4]`를 요소 하나로 넣지만, `extend([3, 4])`는 `3`, `4`를 각각 추가한다.

