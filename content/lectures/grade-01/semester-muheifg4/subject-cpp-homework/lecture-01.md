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
