---
title: "Homework 2 · 재귀, 백트래킹, 반복 변환"
description: "이항계수, 순열 생성, 재귀 함수의 반복형 변환을 통해 호출 구조와 상태 복원을 학습합니다."
order: 2
published: true
objectives:
  - "재귀 함수의 기저 조건과 재귀 호출이 하는 일을 설명할 수 있다."
  - "교환과 복원을 이용해 모든 순열을 생성할 수 있다."
  - "재귀식을 단일 호출 형태로 바꾸고 반복문으로 변환할 수 있다."
---

Homework 2의 공통 주제는 **함수 호출을 따라가며 반복되는 구조를 발견하는 것**입니다. 답을 외우기보다 기저 조건, 한 단계의 작업, 호출 후 상태가 어떻게 복원되는지에 집중하세요.

[Homework 1](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-01) · [Homework 2](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-02) · [Homework 3](/lectures/grade-01/semester-muheifg4/subject-cpp-homework/lecture-03)

> 출처: **Solutions-Homework 2.doc**와 `Code_Exercise_1.cpp`~`Code_Exercise_3.cpp`. Exercise 3의 코드는 표준 C++에서 실행되도록 `void main()`을 `int main()`으로 고치고, 출력 비교 항목의 명백한 함수명 오타를 바로잡았습니다.

## 재귀를 읽는 세 가지 질문

1. **언제 멈추는가?** — 기저 조건
2. **호출할 때 입력이 어떻게 작아지는가?** — 진행 조건
3. **호출이 돌아온 뒤 무엇을 하는가?** — 결합 단계

> [!CAUTION]
> 재귀 호출은 자동으로 빠른 풀이가 되지 않습니다. 같은 입력을 여러 번 호출하면 중복 계산이 생기고, 기저 조건에 가까워지지 않으면 종료되지 않습니다.

## Exercise 1 · 이항계수 계산

### Problem (Original)

*Homework 2.doc (Handout 2), Exercise 1*

**Exercise 1**

**Problem.** 1) Write a function that computes the value of the binomial coefficient

~~~text
C(n, r) = n! / ((n - r)! · r!)
~~~

2) Embed your function into a little program that reads two integers `n` and `r` from `std::cin` and writes the value of the binomial coefficient to `std::cout`.

> [!TRANSLATION]
> **문제.** 1) 이항계수 `C(n, r) = n! / ((n - r)! · r!)`의 값을 계산하는 함수를 작성하세요.
>
> 2) 이 함수를 작은 프로그램에 넣어, `std::cin`으로 두 정수 `n`, `r`을 읽고 이항계수 값을 `std::cout`으로 출력하세요.

### 개념과 예제

> [!CONCEPT]
> **함수로 나누어 생각하기**: 팩토리얼 `fac(n)`을 먼저 만들고, 이항계수는 그 함수를 세 번 불러 조합합니다. `fac`의 재귀는 `fac(n) = n × fac(n - 1)`, 기저 조건은 `n <= 1`일 때 `1`입니다. 이항계수 `C(n, r)`은 "n개 중 순서 없이 r개를 고르는 방법의 수"입니다.

> [!PROBLEM]
> `n = 5, r = 2`
>
> `fac(5) / (fac(3) × fac(2)) = 120 / (6 × 2) = 10`
>
> 실제로 {1,2,3,4,5}에서 두 개를 고르는 경우는 12, 13, 14, 15, 23, 24, 25, 34, 35, 45로 10가지입니다.

> [!TRAP]
> `int` 팩토리얼은 `13! = 6,227,020,800`부터 범위를 넘습니다. 그래서 `n = 13, r = 1`처럼 답이 작아도 중간 계산이 넘쳐 틀린 값이 나옵니다.

### 문제와 공식

정수 `n`, `r`을 입력받아 이항계수 `C(n, r)`을 출력합니다.

~~~text
n! = n × (n-1) × ... × 2 × 1
C(n, r) = n! / ((n-r)! × r!)
~~~

팩토리얼 함수는 `n <= 1`에서 1을 반환하고, 그보다 크면 `n * fac(n - 1)`을 반환합니다. 따라서 호출할 때마다 인자가 1씩 줄어 기저 조건에 도달합니다.

<Answer>

~~~cpp title="homework2_exercise1.cpp" showLineNumbers
#include <iostream>

int fac(int n) {
    if (n <= 1)
        return 1;
    else
        return n * fac(n - 1);
}

int binomial_coefficient(int n, int r) {
    return fac(n) / (fac(n - r) * fac(r));
}

int main() {
    int n, r;
    std::cout << "Enter your value for n:";
    std::cin >> n;
    std::cout << "\nEnter your value for r:";
    std::cin >> r;
    std::cout << "The binomial coefficient of n:" << n << " and r:" << r
              << " is " << binomial_coefficient(n, r) << std::endl;
}
~~~

</Answer>

`n = 5`, `r = 2`이면 `5! / (3! × 2!) = 120 / 12 = 10`입니다.

이 정답은 과제에서 제시한 팩토리얼 공식을 직접 구현한 것입니다. `0 <= r <= n`이고 팩토리얼 결과가 `int` 범위에 들어간다는 전제가 필요합니다. 일반적인 32비트 `int`에서는 `13!`부터 범위를 넘으므로 큰 입력에는 곱하면서 나누는 방식이나 더 큰 정수 표현이 필요합니다.

## Exercise 2 · 백트래킹으로 모든 순열 출력

### Problem (Original)

*Homework 2.doc (Handout 2), Exercise 2*

**Exercise 2**

**Problem.** Write a function `permutNumbers` that prints all `n!` many permutations of the numbers 1 to `n` on `std::out`.

Example: the output for `permutNumbers(3)` shall be:

~~~text
123, 132, 213, 231, 312, 321
~~~

> [!TRANSLATION]
> **문제.** 1부터 `n`까지의 수로 만들 수 있는 `n!`개의 순열을 모두 출력하는 함수 `permutNumbers`를 작성하세요.
>
> 예: `permutNumbers(3)`의 출력은 `123, 132, 213, 231, 312, 321`이어야 합니다.

### 개념과 예제

> [!CONCEPT]
> **백트래킹 = 선택 → 재귀 → 되돌리기.** 위치 `i`에 올 값을 하나 고르고(교환), 나머지 위치는 재귀 호출에 맡긴 뒤, 돌아오면 교환을 원래대로 되돌립니다. 되돌리기 때문에 다음 선택이 항상 같은 상태에서 시작합니다.
>
> 경우의 수: 첫 자리 n가지 × 둘째 자리 n-1가지 × … = `n!`.

> [!PROBLEM]
> `n = 3`의 선택 트리
>
> ~~~text
> 첫 자리 1 ─ 둘째 2 ─ 123
>          └ 둘째 3 ─ 132
> 첫 자리 2 ─ 둘째 1 ─ 213
>          └ 둘째 3 ─ 231
> 첫 자리 3 ─ 둘째 2 ─ 321
>          └ 둘째 1 ─ 312
> ~~~
>
> 리프가 3! = 6개이므로 순열도 6개입니다.

> [!TRAP]
> 교환 방식은 첫 자리가 3인 분기에서 배열이 `321`부터 시작하므로 `321`, `312` 순서로 출력됩니다. 원문 예시처럼 **사전순**이 꼭 필요하면 "사용하지 않은 수 중 작은 것부터 고르기"(used 배열) 방식으로 구현해야 합니다.

### 핵심 아이디어

배열의 위치 `i`에 들어갈 값을 `i`부터 마지막 위치까지 하나씩 골라 교환합니다. 나머지 위치는 재귀 호출에 맡기고, 호출이 끝나면 같은 두 원소를 다시 교환해 원래 상태로 되돌립니다.

~~~text
선택: a[i]와 a[j] 교환
탐색: i + 1 위치의 순열 생성
복원: a[i]와 a[j] 다시 교환
~~~

이 **선택 → 탐색 → 복원** 구조가 백트래킹입니다. 복원을 빼면 한 분기에서 바뀐 배열이 다음 분기에 남아 올바른 후보를 탐색하기 어렵습니다.

<Answer>

~~~cpp title="homework2_exercise2.cpp" showLineNumbers
#include <iostream>

void swap(int& x, int& y) {
    int temp = x;
    x = y;
    y = temp;
}

void print_array(int a[], int n) {
    for (int j = 0; j <= n; j++)
        std::cout << a[j];
    std::cout << std::endl;
}

void permute(int a[], int i, int n) {
    std::cout << "Start Call i: " << i << " array: ";
    print_array(a, n);

    if (i == n) {
        print_array(a, n);
    } else {
        for (int j = i; j <= n; j++) {
            std::cout << "swap to   i:" << i << " j: " << j
                      << " with a[i]: " << a[i] << " and a[j]: " << a[j] << std::endl;
            swap(a[i], a[j]);
            permute(a, i + 1, n);
            std::cout << "swap back i:" << i << " j: " << j
                      << " with a[i]: " << a[i] << " and a[j]: " << a[j] << std::endl;
            swap(a[i], a[j]);
        }
    }

    std::cout << "End  Call i: " << i << " array: " << std::endl;
}

void permutNumbers(int n) {
    int a[30];
    for (int i = 1; i <= n; i++)
        a[i - 1] = i;

    permute(a, 0, n - 1);
}

int main() {
    permutNumbers(3);
    return 0;
}
~~~

</Answer>

제공 코드는 재귀 흐름을 관찰하도록 `Start Call`, `swap to`, `swap back`, `End Call` 진단 메시지도 출력합니다. 순열만 필요하다면 이 메시지를 지우고 기저 조건의 `print_array`만 남기면 됩니다.

`permutNumbers(3)`에서 첫 위치를 1로 고정한 분기는 `123`, `132`를 만들고, 복원한 뒤 첫 위치를 2로 바꾸어 `213`, `231`을 만듭니다. 마지막으로 첫 위치를 3으로 바꾸어 `321`, `312`를 만듭니다. 모든 순열 n개를 실제로 출력하므로 시간은 최소 Ω(n · n!)이고, 재귀 깊이와 배열을 제외한 호출 스택은 O(n)입니다.

> [!CAUTION]
> 제공 배열의 크기는 30이므로 `n > 30`이면 범위를 벗어납니다. 또한 순열 수는 매우 빠르게 증가하므로 훨씬 작은 n에서도 출력량이 커집니다.

## Exercise 3 · 이중 재귀를 반복문으로 바꾸기

### Problem (Original)

*Homework 2.doc (Handout 2), Exercise 3*

**Exercise 3**

**Problem.** Given the following function definition:

~~~cpp
int sum_down(int x) {
    if (x >= 0) {
        x = x - 1;
        int y = x + sum_down(x);
        return y + sum_down(x);
    } else {
        return 1;
    }
}
~~~

- (a) What is the smallest integer value of the parameter `x`, so that the returned value is greater than 1.000.000?
- (b) Rewrite the function, so that it is free of recursion, i.e. give an iterative definition on the foundation of a loop-construct. *TIP: First transform the recursive definition, so that you have just a single recursive call.*
- (c) Is it OK to switch the type of the parameter `x` to `double`? Discuss your decision / give an argumentation.
- (d) Is it OK to switch the type of the parameter `x` to `unsigned int`? Discuss your decision / give an argumentation.
- (e) Is it OK to switch the function head to `int sum_down(const int x)`? Discuss your decision / give an argumentation.

> [!TRANSLATION]
> **문제.** 다음 함수 정의가 주어져 있습니다(위 코드).
>
> - (a) 반환값이 1,000,000보다 커지게 하는 매개변수 `x`의 가장 작은 정수값은?
> - (b) 재귀가 없도록 함수를 다시 작성하세요. 즉 반복문을 바탕으로 한 반복적 정의를 제시하세요. *팁: 먼저 재귀 호출이 하나만 남도록 재귀 정의를 변형하세요.*
> - (c) 매개변수 `x`의 자료형을 `double`로 바꿔도 될까요? 판단과 근거를 제시하세요.
> - (d) 매개변수 `x`의 자료형을 `unsigned int`로 바꿔도 될까요? 판단과 근거를 제시하세요.
> - (e) 함수 머리를 `int sum_down(const int x)`로 바꿔도 될까요? 판단과 근거를 제시하세요.

### 개념과 예제

> [!CONCEPT]
> **같은 호출이 두 번이면 한 번만 계산해 두 배 하면 됩니다.** 두 `sum_down(x)` 호출은 같은 인자(이미 1 줄어든 x)를 받으므로 결과도 같습니다. 그래서
>
> `sum_down(x) = (x - 1) + 2 × sum_down(x - 1)`, `sum_down(-1) = 1`
>
> 로 바꿀 수 있고, 호출이 하나뿐인 재귀는 아래(-1)에서 위로 올라가는 반복문으로 바로 옮길 수 있습니다. 원래 함수는 호출이 매 단계 두 배로 늘어 약 `2^(x+2)`번 호출되지만, 반복문은 `x + 1`번이면 끝납니다.

> [!PROBLEM]
> 작은 값부터 표로 채워 보면 규칙이 보입니다.
>
> | x | 계산 | sum_down(x) |
> | --- | --- | --- |
> | -1 | 기저 조건 | 1 |
> | 0 | -1 + 2 × 1 | 1 |
> | 1 | 0 + 2 × 1 | 2 |
> | 2 | 1 + 2 × 2 | 5 |
> | 3 | 2 + 2 × 5 | 12 |
>
> 반복문은 `sum = 1`에서 시작해 카운터 `i = -1, 0, 1, …, x - 1`마다 `sum = i + 2 * sum`을 하면 같은 값이 나옵니다.

### 원래 함수 단순화

원래 함수는 같은 `sum_down(x)`를 두 번 호출합니다.

~~~cpp
int sum_down(int x) {
    if (x >= 0) {
        x = x - 1;
        int y = x + sum_down(x);
        return y + sum_down(x);
    }
    return 1;
}
~~~

두 호출은 같은 인자와 같은 결과를 가지므로 한 번 계산한 값을 두 배 하는 식으로 바꿀 수 있습니다.

~~~text
f(-1) = 1
f(x) = (x - 1) + 2 × f(x - 1)    (x >= 0)
~~~

이제 `x = -1`에서 시작해 `sum = 1`을 유지하고, 카운터를 1씩 증가시키며 `sum = i + 2 * sum`을 계산하면 재귀 호출이 필요 없습니다.

### 1,000,000을 처음 넘는 입력

반복 값을 계산하면 `f(18) = 524269`, `f(19) = 1048556`입니다. 따라서 반환값이 1,000,000보다 커지는 가장 작은 정수 입력은 **19**입니다.

<Answer>

~~~cpp title="homework2_exercise3.cpp" showLineNumbers
#include <iostream>

int sum_down(int x) {
    if (x >= 0) {
        x = x - 1;
        int y = x + sum_down(x);
        return y + sum_down(x);
    }
    return 1;
}

int sum_down_small(int x) {
    if (x >= 0)
        return (x - 1) + 2 * sum_down_small(x - 1);
    return 1;
}

int sum_down_while(int x) {
    int sum = 1;
    int i = -1;
    while (i < x) {
        sum = i + 2 * sum;
        i = i + 1;
    }
    return sum;
}

int sum_down_for(int x) {
    int sum = 1;
    for (int i = -1; i < x; i++)
        sum = i + 2 * sum;
    return sum;
}

int main() {
    for (int x = 0; x < 20; x++) {
        std::cout << "x: " << x
                  << " original: " << sum_down(x)
                  << " transformed: " << sum_down_small(x)
                  << " iterative: " << sum_down_for(x) << std::endl;
    }
    return 0;
}
~~~

</Answer>

원래 이중 재귀는 `T(x) = 2T(x-1) + O(1)`이라 호출 수가 지수적으로 증가합니다. 단일 재귀와 반복형은 x에 비례하는 시간 O(x)를 사용합니다. 반복형은 호출 스택이 없어 추가 공간도 O(1)입니다.

### 자료형 변경 질문

| 변경 | 판단 | 이유 |
| --- | --- | --- |
| `double x` | 정수 입력만 준다는 전제에서는 가능 | IEEE 754 double은 일반적인 32비트 정수를 정확히 표현하지만, 비정수 입력까지 허용하면 원래 정수 함수와 의미가 달라짐 |
| `unsigned int x` | 부적절 | `x = 0`에서 `x - 1`이 음수가 되지 않고 매우 큰 양수로 언더플로하여 종료 조건이 깨짐 |
| `const int x` | 원래 본문 그대로는 불가능 | 함수 안의 `x = x - 1`이 const 매개변수를 변경하려 하므로 컴파일 오류 |

`const int x`를 꼭 사용하고 싶다면 `x`를 바꾸지 않고 `sum_down(x - 1)`을 호출하도록 함수를 다시 작성할 수 있습니다. 질문의 핵심은 자료형 이름만 바꿀 때 기존 함수 본문이 그대로 유효한지 판단하는 것입니다.

## 마무리 점검

- 재귀는 기저 조건과 입력 감소가 함께 있어야 종료됩니다.
- 백트래킹은 다음 선택 전에 상태를 복원합니다.
- 같은 재귀 호출을 두 번 수행한다면 결과를 한 번 계산해 재사용할 수 있는지 확인합니다.
- `unsigned`의 0 아래 연산은 음수가 아니라 큰 양수로 돌아갑니다.
