---
title: "Homework 1 · 조건식, 반복문, 최대공약수"
description: "논리식 계산부터 최댓값, 누적 합, 유클리드 호제법까지 Homework 1의 네 문제를 풀이합니다."
order: 1
published: true
objectives:
  - "C++의 참·거짓 변환과 논리 연산자의 실행 순서를 설명할 수 있다."
  - "조건문과 반복문으로 입력값의 최댓값과 누적 합을 구할 수 있다."
  - "유클리드 호제법의 상태 변화를 추적해 최대공약수를 계산할 수 있다."
---

Homework 1은 **조건식 읽기 → 선택 → 반복 → 알고리즘 구현**으로 이어지는 기초 문제 묶음입니다. 먼저 손으로 결과를 예측한 뒤 정답 코드를 열어 확인해 보세요.

[Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> 출처: **Solutions - Homework 1.doc**와 `Code_Exercise_1.c`~`Code_Exercise_4.c`. 파일 확장자는 `.c`이지만 코드는 `iostream`, `std::cin`, 참조를 사용하는 C++ 코드입니다.

## 한눈에 보는 핵심 개념

| 문제 | 핵심 개념 | 스스로 확인할 질문 |
| --- | --- | --- |
| Exercise 1 | 비교·논리 연산, 0과 참·거짓 | 0이 아닌 정수는 조건식에서 무엇이 되는가? |
| Exercise 2 | 순차 비교, 현재 최댓값 | 새 값이 더 클 때 무엇을 갱신해야 하는가? |
| Exercise 3 | 센티널, 누적 상태 | 종료값 0을 합에 넣기 전에 검사하는가? |
| Exercise 4 | 나머지, 유클리드 호제법 | 한 반복이 끝난 뒤 `a`, `b`는 무엇을 뜻하는가? |

> [!DEFINITION]
> C++ 조건식에서 정수 `0`은 거짓, 0이 아닌 정수는 참으로 변환됩니다. 논리 연산의 결과는 `bool`이며 기본 출력에서는 거짓이 `0`, 참이 `1`로 표시됩니다.

## Exercise 1 · 논리식의 결과 계산

### Problem (Original)

*Homework 1.doc (Handout 1), Exercise 1*

**Exercise 1**

**Problem.** Given the following assignment of variables to values, fill in the result values of the conditions in the table below.

~~~cpp
int x = -5;  int power = 1024;  int y = 7;
double item = 1.5;  double MIN = -12.0;  char DAY = 'M';
int num = 12;  int MAX = 1024;  int Sens = 12;
~~~

| Condition | Result |
| --- | --- |
| `(x>y) && !y` | ? |
| `(item>MIN) \|\| (DAY!='M')` | ? |
| `((num*128)<power) && y` | ? |
| `(!(power!=MAX)) && (Sens==num)` | ? |
| `((y+x)<num) \|\| (DAY=='M')` | ? |
| `(Sens*(!y)) != 0` | ? |
| `(!x\|\|y) && (!y\|\|x)` | ? |

변수 값은 함께 제공된 `Code_Exercise_1.c` 기준입니다.

> [!TRANSLATION]
> **문제.** 변수에 아래와 같은 값이 대입되어 있을 때, 표에 있는 각 조건식의 결과 값을 채우세요.

### 개념과 예제

> [!CONCEPT]
> **정수 ↔ 참/거짓 변환과 단락 평가**
>
> - 조건식에서 `0`은 거짓, 0이 아닌 값(음수 포함)은 참입니다. 그래서 `!7`은 `0`, `!(-5)`도 `0`입니다.
> - 비교·논리 연산의 결과는 `bool`이고, `cout`으로 출력하면 `1`(참) 또는 `0`(거짓)입니다.
> - `A && B`는 A가 거짓이면 B를 보지 않고, `A || B`는 A가 참이면 B를 보지 않습니다.

> [!PROBLEM]
> `int a = 0, b = 3;`일 때 `(a != 0) && (b / a > 1)`은?
>
> 왼쪽 `a != 0`이 거짓이므로 오른쪽은 **실행되지 않습니다**. 0으로 나누는 오류 없이 결과는 `0`입니다. 반대로 `(a == 0) || (b / a > 1)`도 왼쪽이 참이라 결과는 `1`이고 나눗셈은 일어나지 않습니다.

### 문제 이해

다음 값이 주어졌을 때 일곱 조건식의 결과를 계산합니다.

~~~cpp
int x = -5;
int power = 1024;
int y = 7;
double item = 1.5;
double MIN = -12.0;
char DAY = 'M';
int num = 12;
int MAX = 1024;
int Sens = 12;
~~~

논리식은 안쪽 괄호와 비교식을 먼저 계산한 뒤 `!`, `&&`, `||` 순으로 읽습니다. `&&`는 왼쪽이 거짓이면 오른쪽을 실행하지 않고, `||`는 왼쪽이 참이면 오른쪽을 실행하지 않는 **단락 평가**를 사용합니다.

<Answer>

| 조건식 | 핵심 계산 | 결과 |
| --- | --- | --- |
| `(x > y) && !y` | `-5 > 7`이 거짓 | `0` (False) |
| `(item > MIN) || (DAY != 'M')` | `1.5 > -12.0`이 참 | `1` (True) |
| `((num * 128) < power) && y` | `1536 < 1024`가 거짓 | `0` (False) |
| `(!(power != MAX)) && (Sens == num)` | `!(1024 != 1024)`와 `12 == 12`가 모두 참 | `1` (True) |
| `((y + x) < num) || (DAY == 'M')` | `2 < 12`가 참 | `1` (True) |
| `(Sens * (!y)) != 0` | `!7`은 0, 따라서 `12 * 0`은 0 | `0` (False) |
| `(!x || y) && (!y || x)` | 두 괄호 모두 0이 아닌 피연산자 때문에 참 | `1` (True) |

~~~cpp title="homework1_exercise1.cpp" showLineNumbers
#include <iostream>

int main() {
    int x = -5;
    int power = 1024;
    int y = 7;
    double item = 1.5;
    double MIN = -12.0;
    char DAY = 'M';
    int num = 12;
    int MAX = 1024;
    int Sens = 12;

    std::cout << "(x > y) && !y: " << ((x > y) && !y) << std::endl;
    std::cout << "(item>MIN)||(DAY!='M'): " << ((item > MIN) || (DAY != 'M')) << std::endl;
    std::cout << "((num*128)<power)&&y: " << (((num * 128) < power) && y) << std::endl;
    std::cout << "(!(power!=MAX))&&(Sens==num): " << ((!(power != MAX)) && (Sens == num)) << std::endl;
    std::cout << "(((y+x)<num)||(DAY=='M')): " << (((y + x) < num) || (DAY == 'M')) << std::endl;
    std::cout << "(Sens*(!y))!=0: " << ((Sens * (!y)) != 0) << std::endl;
    std::cout << "(!x||y)&&(!y||x): " << ((!x || y) && (!y || x)) << std::endl;

    return 0;
}
~~~

</Answer>

> [!CAUTION]
> `!y`는 `y`의 부호를 바꾸는 연산이 아닙니다. `y`가 0인지 판단해 논리값을 반전하므로, `y = 7`일 때 `!y`는 `false`입니다.

## Exercise 2 · 세 정수 중 최댓값

### Problem (Original)

*Homework 1.doc (Handout 1), Exercise 2*

**Exercise 2**

**Problem.** Write a program in C++ that performs the following tasks:

- Read three integer values using `cin`.
- Determine the maximum of the three values entered by the user.
- Print the maximum of this three values using `cout`.

> [!TRANSLATION]
> **문제.** 다음 작업을 수행하는 C++ 프로그램을 작성하세요.
>
> - `cin`으로 정수 세 개를 입력받습니다.
> - 사용자가 입력한 세 값 중 최댓값을 구합니다.
> - 그 최댓값을 `cout`으로 출력합니다.

### 개념과 예제

> [!CONCEPT]
> **"현재 최댓값" 패턴**: 첫 값을 일단 최댓값으로 두고, 나머지 값을 하나씩 비교해 더 크면 바꿉니다. 비교 횟수는 항상 2번이고, 값이 늘어나도 반복문으로 그대로 확장됩니다.

> [!PROBLEM]
> 입력 `4 9 7`
>
> 1. `max = 4`
> 2. `9 > 4` → `max = 9`
> 3. `7 > 9`는 거짓 → 그대로
>
> 출력 `9`

> [!TRAP]
> `if (a > b && a > c) ... else if (b > a && b > c) ... else c` 처럼 엄격한 `>`만 쓰면 `5 5 3`에서 두 조건이 모두 거짓이 되어 `3`을 출력합니다. 같은 값이 있어도 동작하는지 꼭 확인하세요.

### 문제 이해와 풀이 흐름

정수 세 개를 입력받아 가장 큰 값을 출력합니다. 첫 값을 현재 최댓값으로 정한 뒤 나머지 두 값을 차례로 비교하면 됩니다.

~~~text
max = 첫 번째 값
두 번째 값이 max보다 크면 max 갱신
세 번째 값이 max보다 크면 max 갱신
~~~

이 방식은 음수만 입력되어도 동작합니다. `max = 0`으로 시작하면 `-8 -3 -5` 같은 입력에서 존재하지 않는 0을 답으로 내므로 첫 입력값으로 초기화해야 합니다.

<Answer>

~~~cpp title="homework1_exercise2.cpp" showLineNumbers
#include <iostream>

int main() {
    int input1, input2, input3, max;

    std::cout << "Enter first value:" << std::endl;
    std::cin >> input1;
    std::cout << "Enter second value:" << std::endl;
    std::cin >> input2;
    std::cout << "Enter third value:" << std::endl;
    std::cin >> input3;

    max = input1;
    if (input2 > max)
        max = input2;
    if (input3 > max)
        max = input3;

    std::cout << "The maximum of " << input1 << ", " << input2 << ", " << input3
              << " is " << max << std::endl;

    return 0;
}
~~~

</Answer>

입력이 `4 9 6`이면 `max`는 `4 → 9 → 9`로 변합니다. 두 `if`는 서로 독립적으로 모든 후보를 검사합니다. 시간과 추가 공간은 모두 O(1)입니다.

## Exercise 3 · 0이 입력될 때까지 누적 합

### Problem (Original)

*Homework 1.doc (Handout 1), Exercise 3*

**Exercise 3**

**Problem.** Write a program that asks the user to type numbers. After each entry, the program should report the cumulative sum of the entries. The program should terminate when the user enters 0.

> [!TRANSLATION]
> **문제.** 사용자에게 숫자를 입력하도록 요청하는 프로그램을 작성하세요. 숫자가 하나 입력될 때마다 지금까지 입력한 값의 누적 합을 알려 줍니다. 사용자가 0을 입력하면 프로그램을 종료합니다.

### 개념과 예제

> [!CONCEPT]
> **센티널(종료 표시) 반복**: 몇 번 입력할지 미리 알 수 없을 때, 특별한 값(여기서는 0)이 들어오면 멈춥니다. 반복마다 "읽기 → 종료 검사 → 누적 → 출력" 순서를 지키는 것이 핵심이고, 반복 사이에 유지할 상태는 `sum` 하나입니다.

> [!PROBLEM]
> 입력 순서 `3`, `-1`, `5`, `0`
>
> | 입력 | 종료? | sum | 출력 |
> | --- | --- | --- | --- |
> | 3 | 아니오 | 3 | 3 |
> | -1 | 아니오 | 2 | 2 |
> | 5 | 아니오 | 7 | 7 |
> | 0 | 예 | 7 | (종료) |

### 문제 이해와 상태 설계

사용자가 숫자를 입력할 때마다 지금까지의 합을 출력하고, `0`을 입력하면 종료합니다. 여기서 0은 실제 데이터가 아니라 반복 종료를 알리는 **센티널 값**입니다.

반복 중 유지해야 하는 상태는 `sum` 하나입니다. 새 값을 읽은 직후 0인지 먼저 검사하고, 0이 아닐 때만 합에 더해 출력합니다.

<Answer>

~~~cpp title="homework1_exercise3.cpp" showLineNumbers
#include <iostream>

int main() {
    double sum = 0;

    while (1) {
        double input;
        std::cout << "Enter a value:" << std::endl;
        std::cin >> input;
        if (input == 0.0)
            break;
        sum += input;
        std::cout << "Your cumulative sum so far is: " << sum << std::endl;
    }

    return 0;
}
~~~

</Answer>

입력이 `3.5`, `-1`, `2.5`, `0`이면 출력되는 누적 합은 `3.5`, `2.5`, `5.0`입니다. 입력이 k개라면 시간은 O(k), 추가 공간은 O(1)입니다.

> [!CAUTION]
> 일반적인 계산에서는 부동소수점 값을 `==`로 비교할 때 오차를 고려해야 합니다. 이 문제처럼 사용자가 종료값 `0` 자체를 입력하는 센티널 비교는 의도가 분명하지만, 계산 결과가 0에 가까운지를 검사하는 문제라면 오차 범위를 사용해야 합니다.

## Exercise 4 · 유클리드 호제법으로 최대공약수 구하기

### Problem (Original)

*Homework 1.doc (Handout 1), Exercise 4*

**Exercise 4**

**Problem.** Create a program to determine the GCD (Greatest Common Divisor) of two integers `x` and `y` using a **while loop**.

Formal description of the Euclidean algorithm:

- **Input:** Two positive integers, `a` and `b`.
- **Output:** The greatest common divisor, `g`, of `a` and `b`.
- **Internal computation:**
  1. If `a < b`, exchange `a` and `b`.
  2. Divide `a` by `b` and get the remainder, `r`. If `r = 0`, report `b` as the GCD of `a` and `b`.
  3. Replace `a` by `b` and replace `b` by `r`. Return to the previous step.

> [!TRANSLATION]
> **문제.** **while 반복문**을 사용해 두 정수 `x`, `y`의 최대공약수(GCD)를 구하는 프로그램을 작성하세요.
>
> 유클리드 호제법의 형식적 설명:
>
> - **입력:** 두 양의 정수 `a`, `b`
> - **출력:** `a`와 `b`의 최대공약수 `g`
> - **내부 계산:**
>   1. `a < b`이면 `a`와 `b`를 바꿉니다.
>   2. `a`를 `b`로 나눈 나머지 `r`을 구합니다. `r = 0`이면 `b`를 최대공약수로 보고합니다.
>   3. `a`를 `b`로, `b`를 `r`로 바꾸고 이전 단계로 돌아갑니다.

### 개념과 예제

> [!CONCEPT]
> **반복 한 번 = (a, b) → (b, a % b)**. 반복문 안에서는 나머지 `r`을 먼저 임시 변수에 저장한 뒤 `a = b; b = r;` 순서로 옮겨야 값이 사라지지 않습니다. 사실 `a < b`일 때도 `a % b = a`이므로 첫 반복이 자동으로 두 값을 바꿔 줍니다.

> [!PROBLEM]
> `12 30`
>
> | 단계 | a | b | r = a % b |
> | --- | --- | --- | --- |
> | 교환 | 30 | 12 | 6 |
> | 이동 | 12 | 6 | 0 |
>
> `r = 0`이므로 `b = 6`이 최대공약수입니다.

> [!TRAP]
> `a = b; b = a % b;`처럼 임시 변수 없이 쓰면 두 번째 줄에서 이미 바뀐 `a`를 사용해 `b % b = 0`이 됩니다.

### 알고리즘

두 양의 정수 `a`, `b`에 대해 `gcd(a, b) = gcd(b, a % b)`입니다. 나머지가 0이 될 때의 나누는 수가 최대공약수입니다.

| 단계 | `a` | `b` | `a % b` |
| --- | ---: | ---: | ---: |
| 시작 | 48 | 18 | 12 |
| 1회 후 | 18 | 12 | 6 |
| 2회 후 | 12 | 6 | 0 |

따라서 `gcd(48, 18) = 6`입니다. 처음에 큰 수를 `a`로 두면 설명과 같은 순서로 진행되므로 제공 코드는 필요할 때 두 값을 교환합니다.

<Answer>

~~~cpp title="homework1_exercise4.cpp" showLineNumbers
#include <iostream>

void swap(int& i, int& j) {
    int tmp = i;
    i = j;
    j = tmp;
}

int main() {
    int input_a, input_b;
    int g;

    std::cout << "Enter first value:" << std::endl;
    std::cin >> input_a;
    std::cout << "Enter second value:" << std::endl;
    std::cin >> input_b;

    int a = input_a;
    int b = input_b;
    if (a < b)
        swap(a, b);

    while (1) {
        int r = a % b;
        if (r == 0) {
            g = b;
            break;
        }
        a = b;
        b = r;
    }

    std::cout << "The greatest common divisor of " << input_a
              << " and " << input_b << " is: " << g << std::endl;

    return 0;
}
~~~

</Answer>

참조 매개변수 `int&`를 사용했기 때문에 `swap(a, b)`는 복사본이 아니라 `main`의 두 변수 자체를 바꿉니다. 입력 조건은 양의 정수이므로 `b`는 처음부터 0이 아니며 나머지 연산이 안전합니다. 시간 복잡도는 O(log(min(a, b))), 추가 공간은 O(1)입니다.

## 마무리 점검

- 0이 아닌 음수도 조건식에서는 참입니다.
- 최댓값은 첫 입력값으로 초기화해야 음수 입력을 안전하게 처리합니다.
- 센티널은 누적 처리 전에 검사합니다.
- 유클리드 호제법은 최대공약수를 유지하면서 두 번째 값을 더 작은 나머지로 바꿉니다.
