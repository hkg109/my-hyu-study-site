---
title: "함수·재귀·스코프"
description: "함수 정의와 호출, 값에 의한 호출, 함수 원형과 상호 재귀, 재귀의 기저 조건과 반복문 변환, math 라이브러리, 전역·지역·블록 스코프와 static 저장 클래스, 네임스페이스와 const를 Lecture 4 순서로 그림과 추적표로 설명합니다."
order: 3
published: true
duration: 80
---

# 함수·재귀·스코프

**슬라이드:** Lecture 4 (4주차) · Functions, Recursive Programming, Scopes and Storage Classes, Namespaces, const

함수는 **반복되는 코드를 이름 하나로 묶고**, **큰 문제를 작은 문제로 쪼개는** 도구입니다(다른 언어의 procedure, subroutine). 함수 오버로딩은 2026 슬라이드에서 Lecture 6에 있어 05강에서 다룹니다.

---

## 학습 흐름

```text
함수 정의(반환형·이름·매개변수·본문) → 호출과 값에 의한 전달
        ↓
함수 원형 → 재귀(기저 조건 + 재귀 단계) → 재귀를 반복문으로 → 상호 재귀
        ↓
라이브러리 함수(math.h) → 스코프(전역·지역·블록) → 저장 클래스(static, extern)
        ↓
네임스페이스와 using → const
```

---

## 1. 함수 정의와 호출

```cpp
반환형 함수이름(매개변수1, 매개변수2, …) {
    지역 변수 선언
    실행할 문장들
}

int max(int i, int j) {   // 반환형 int, 이름 max, 형식 매개변수 i, j
    int m;                // 지역 변수
    if (i > j) m = i;
    else       m = j;
    return m;             // 값 하나를 돌려줌
}

x = max(a, b);            // 호출: a, b는 실인수(actual argument)
```

- **형식 매개변수**(formal argument)는 함수 안에서 지역 변수처럼 동작하고, 호출할 때 넘긴 값으로 시작합니다.
- **지역 변수**는 그 함수 안에서만 존재하며, 함수가 끝나면 사라집니다. 다른 함수에 같은 이름이 있어도 서로 상관없습니다.
- 반환값이 없으면 반환형에 `void`를 씁니다.

```cpp
반환형 함수이름(매개변수 목록) {
    본문
    return 값;
}

int add(int a, int b) {     // a, b: 매개변수 (함수 정의 쪽)
    return a + b;
}

int r = add(3, 5);          // 3, 5: 인수 (호출 쪽)
```

| 용어 | 뜻 |
| --- | --- |
| 매개변수(parameter) | 함수 정의에서 값을 받는 변수. 함수의 지역 변수처럼 동작 |
| 인수(argument) | 호출할 때 실제로 넘기는 값. 리터럴, 변수, 식 모두 가능 |
| `void` | 반환값이 없음. `return;`으로 중간에 끝낼 수 있음 |

### 함수 원형(선언)

컴파일러는 **호출하는 시점에 함수의 이름과 매개변수 자료형을 알고 있어야** 합니다. 정의가 `main`보다 아래 있으면 위에 원형을 둡니다.

```cpp
int add(int, int);         // 원형: 본문 없음, 세미콜론, 매개변수 이름 생략 가능

int main() {
    cout << add(2, 3);     // OK
}

int add(int a, int b) { return a + b; }
```

> [!TRAP]
> - 원형도 정의도 호출보다 앞에 없으면 **컴파일 오류**(선언되지 않은 이름)입니다. 이름 오타(`somthing()`)도 마찬가지입니다.
> - 반환형이 `int`인데 `return`이 없으면 컴파일은 될 수 있지만 반환값을 쓰면 UB입니다.

---

## 2. 값에 의한 호출

[![main의 a 5와 b 2가 max의 i j로 복사되고 max의 지역 변수 m의 값 5가 return으로 main의 x에 돌아오는 그림](/materials/diagrams/cpp-03-call-by-value.svg)](/materials/diagrams/cpp-03-call-by-value.svg)

*그림 3-1 · 값에 의한 호출 — 누르면 원본 크기로 열린다.*


일반 매개변수에는 인수의 값이 **복사**됩니다. 함수 안에서 매개변수를 바꿔도 호출한 쪽 변수는 그대로입니다. 결과를 바깥에 반영하려면 **반환값을 받아서 대입**하거나 **참조 매개변수**(다음 단원)를 씁니다.

```cpp
int next(int k) {
    k = k + 1;      // 복사본만 바뀜
    return k;
}

int i = 0;
next(i);            // 반환값을 버림 → i는 그대로 0
i = next(i);        // 반환값을 대입 → i는 1
```

> [!TRAP]
> `while (i < 5) next(i);`는 `i`가 영원히 0이므로 **끝나지 않습니다**(컴파일 오류가 아닌 논리 오류). `i = next(i);`로 고쳐야 합니다.

---

## 3. 재귀 함수

[![factorial 4가 3 2 1을 차례로 호출하며 내려가고 기저 조건 factorial 1이 1을 돌려준 뒤 2 6 24를 돌려주며 올라오는 그림](/materials/diagrams/cpp-03-factorial-stack.svg)](/materials/diagrams/cpp-03-factorial-stack.svg)

*그림 3-2 · factorial(4)의 호출과 반환 — 누르면 원본 크기로 열린다.*

함수가 자기 자신을 부르는 것을 **(직접) 재귀**라고 합니다. 재귀 함수를 설계할 때는 두 가지를 정합니다.

1. **기저 조건(base case):** 자기 자신을 부르지 않고 답을 바로 돌려주는 경우. 없으면 재귀를 쓸 수 없습니다.
2. **재귀 단계(recursive step):** 더 작은 문제(다른 매개변수)로 자기 자신을 불러 답을 만든다. 매개변수가 같으면 답에 가까워지지 않습니다.

```cpp
int factorial(int x) {
    if (x <= 1) return 1;            // 기저 조건
    return x * factorial(x - 1);     // 재귀 단계
}
```

하노이 탑처럼 재귀로는 간단하지만 반복문으로는 어려운 문제도 있습니다.

재귀 함수는 자기 자신을 호출합니다. 반드시 두 부분이 있어야 합니다.

| 구성 | 역할 | 빠지면 |
| --- | --- | --- |
| **기저 조건** | 더 호출하지 않고 바로 값을 반환 | 무한 재귀 → 스택 넘침 |
| **재귀 단계** | 기저 조건에 **가까워지는** 인수로 다시 호출 | 기저에 도달 못 함 |

```cpp
long long factorial(int n) {
    if (n <= 1) return 1;              // 기저 조건 (0!도 1)
    return n * factorial(n - 1);       // 재귀 단계
}
```

```text
내려가며 호출:  factorial(4) → factorial(3) → factorial(2) → factorial(1)
올라오며 계산:  1 → 2×1=2 → 3×2=6 → 4×6=24
```

> [!TRAP]
> 기저 조건을 `n == 1`로 쓰면 `factorial(0)`은 0, −1, −2 …로 내려가 끝나지 않습니다. 기저 조건은 **도달할 수 있는 모든 값**을 막도록 `<=`를 쓰는 것이 안전합니다.

### 호출 추적: 재귀 호출 앞의 코드와 뒤의 코드

- 재귀 호출 **앞**의 문장은 **내려가면서** 실행됩니다.
- 재귀 호출 **뒤**의 문장은 호출이 반환된 뒤, **올라오면서**(역순으로) 실행됩니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> // (1)
> void p(int n) {
>     if (n == 0) return;
>     cout << n;
>     p(n - 1);
>     cout << n;
> }
> p(3);
>
> // (2) 호출 순서와 반환값, 총 호출 수
> int fib(int n) {
>     cout << "f(" << n << ") ";
>     if (n <= 1) return 1;
>     int a = fib(n - 1);
>     int b = fib(n - 2);
>     return a + b;
> }
> int v = fib(4);
> cout << "= " << v;
> ```

> [!ANSWER]
> **(1)** `321123` — 앞의 `cout`이 3, 2, 1을 내려가며 출력하고, 뒤의 `cout`이 1, 2, 3을 올라오며 출력합니다.
>
> **(2)**
>
> ```text
> f(4) f(3) f(2) f(1) f(0) f(1) f(2) f(1) f(0) = 5
> ```
>
> 왼쪽 호출 `fib(n - 1)`을 끝까지 내려간 뒤 오른쪽 `fib(n - 2)`를 처리합니다. 총 **9번** 호출되고 `fib(2)`가 두 번 계산됩니다.

### 재귀 함수의 값 구하기: 아래에서부터 표로

족보의 재귀 문제는 **작은 값부터 표를 채워 올라가면** 빠르고 정확합니다.

```cpp
int f(int x) {
    if (x <= 0) return 5;
    return f(x - 1) + f(x - 1);
}
```

1. 기저값: `f(0) = 5` (그리고 x ≤ 0이면 모두 5)
2. 점화식 정리: **같은 인수로 두 번** 호출하므로 `f(x) = 2 × f(x - 1)`
3. 표: f(0)=5, f(1)=10, f(2)=20, f(3)=40, f(4)=**80** → 일반식 `f(n) = 5 × 2ⁿ`

> [!TRAP]
> - **기저 조건의 위치**를 꼼꼼히 보세요. `int i = x - 1; if (i <= 0) return 5;`이면 기저는 `x <= 1`이므로 `f(1) = 5`, `f(2) = 10`, … 로 한 칸 밀립니다.
> - 기저 조건을 `x <= 0`에서 `x < 0`으로 바꾸면 `x = 0`도 재귀 단계로 들어갑니다. `return x + 1;`이 기저라면 `g(0) = 3 × g(-1) = 3 × 0 = 0`이 되어 **이후 모든 값이 0**입니다.
> - 같은 인수로 k번 호출하면 값은 `k × f(x-1)`이지만 **호출 횟수는 지수적으로** 늘어납니다(2번이면 약 2ˣ⁺¹).

---

## 4. 재귀를 반복문으로 바꾸기

재귀를 **펼쳐 보면(unrolling)** 반복되는 일이 보입니다.

```text
factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * 3 * 2 * 1          ← 곱을 쌓는 반복문과 같다
```

```cpp
int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) result *= i;
    return result;
}
```

슬라이드: “There will be a homework about this topic.” 족보에서도 재귀를 for/while로 바꾸는 문제가 나옵니다.

### 변환 순서 (4단계)

1. **기저값**을 찾는다 → 반복문의 **시작값**.
2. 재귀 단계를 `f(x) = (f(x-1)을 쓰는 식)` 꼴로 **한 번 호출**만 남게 정리한다.
   - 같은 인수로 k번 호출 → `k × f(x-1)`로 합친다.
3. 기저에서 시작해 **x까지 올라가며** 2의 식을 반복한다.
4. 기저 조건보다 작은 입력(예: x ≤ 0)은 반복문 **전에** 따로 처리한다.

### 예 1: 같은 인수로 두 번 호출

```cpp
// 재귀
int f(int x) {
    if (x <= 0) return 5;
    return f(x - 1) + f(x - 1);    // = 2 * f(x - 1)
}

// for
int fFor(int x) {
    int result = 5;                 // 기저값 f(0)
    for (int i = 1; i <= x; i++)    // f(1)부터 f(x)까지
        result = 2 * result;
    return result;                  // x <= 0이면 반복 0번 → 5
}

// while
int fWhile(int x) {
    int result = 5;
    int i = 1;
    while (i <= x) {
        result = 2 * result;
        i++;
    }
    return result;
}
```

### 예 2: 점화식에 x가 들어가는 경우

```cpp
int h(int x) {
    if (x <= 0) return 1;
    return 2 * h(x - 1) + x;        // 이번 단계의 x를 더함
}

int hFor(int x) {
    int r = 1;                      // h(0)
    for (int i = 1; i <= x; i++)
        r = 2 * r + i;              // 재귀의 x 자리에 반복 변수 i
    return r;
}
```

h(0)=1, h(1)=2·1+1=3, h(2)=2·3+2=8, h(3)=2·8+3=19, h(4)=2·19+4=**42**

> [!TRAP]
> 재귀식의 `x`를 반복문으로 옮길 때 **현재 단계 번호(i)**로 바꿔야 합니다. `r = 2 * r + x`로 쓰면 매 단계 같은 값을 더하게 되어 틀립니다.

### 예 3: 합 구하기 (재귀 호출 뒤에 연산)

```cpp
int sum(int n) {                    // 1 + 2 + … + n
    if (n <= 0) return 0;
    return n + sum(n - 1);
}

int sumWhile(int n) {
    int total = 0;
    while (n > 0) {                 // n부터 1까지 내려가며 더해도 결과는 같음
        total += n;
        n--;
    }
    return total;
}
```

### 예 4: 서로 다른 인수로 두 번 호출 (피보나치)

같은 인수가 아니므로 합칠 수 없습니다. **직전 두 값**을 변수 두 개로 들고 올라갑니다.

```cpp
int fibLoop(int n) {
    if (n <= 1) return 1;           // 위의 fib와 같은 기저
    int prev = 1, cur = 1;          // fib(0), fib(1)
    for (int i = 2; i <= n; i++) {
        int next = prev + cur;
        prev = cur;
        cur = next;
    }
    return cur;
}
```

> [!QUIZ]
> 다음 함수에 대해 답하시오.
>
> ```cpp
> int g(int x) {
>     if (x <= 0) return x + 1;
>     return g(x - 1) + g(x - 1) + g(x - 1);
> }
> ```
>
> 1. `g(0)`, `g(1)`, `g(2)`, `g(3)`, `g(-2)`를 구하시오.
> 2. 같은 값을 반환하는 `for` 반복문 함수와 `while` 반복문 함수를 작성하시오.
> 3. 기저 조건을 `x < 0`으로 바꾸면 `g(4)`는 얼마인가?

> [!ANSWER]
> **1.** `g(0) = 1`, `g(1) = 3`, `g(2) = 9`, `g(3) = 27`, `g(-2) = -1` (기저에서 `x + 1`).
>
> **2.** 같은 인수로 세 번 호출하므로 `g(x) = 3 × g(x - 1)`, `g(0) = 1`입니다.
>
> ```cpp
> int gFor(int x) {
>     if (x <= 0) return x + 1;       // 기저 범위는 따로 처리
>     int result = 1;                 // g(0)
>     for (int i = 1; i <= x; i++)
>         result *= 3;
>     return result;
> }
>
> int gWhile(int x) {
>     if (x <= 0) return x + 1;
>     int result = 1, i = 1;
>     while (i <= x) {
>         result *= 3;
>         i++;
>     }
>     return result;
> }
> ```
>
> **3.** **0**. `g(-1) = 0`이 새 기저값이 되고 `g(0) = 3 × 0 = 0`, 그 위도 모두 0입니다.

> [!QUIZ]
> `f(1)`, `f(2)`, `f(3)`, `f(4)`를 구하고, 재귀가 끝나는 x의 범위를 쓰시오.
>
> ```cpp
> int f(int x) {
>     int i = x - 1;
>     if (i <= 0) return 5;
>     return f(x - 1) + f(x - 1);
> }
> ```

> [!ANSWER]
> `f(1) = 5`, `f(2) = 10`, `f(3) = 20`, `f(4) = 40`. 기저 조건은 `x - 1 <= 0`, 즉 **x ≤ 1**입니다. x ≤ 0인 예제보다 한 칸 밀린 것에 주의하세요.

---

## 5. 함수 원형과 상호 재귀

함수 이름은 **정의된 뒤부터** 쓸 수 있습니다. 파일 아래에 정의한 함수를 위에서 부르거나, 두 함수가 서로를 부를 때는 **함수 원형(prototype)**으로 모양만 먼저 알려 줍니다. 원형에는 이름·반환형·매개변수 자료형만 있고 **본문은 없습니다.**

```cpp
const char* egg(int);          // 원형
const char* chicken(int);      // 원형

int main() {
    cout << chicken(3);        // 정의가 아래에 있어도 호출 가능 → "Egg!"
}
const char* chicken(int generation) {
    if (generation == 0) return "Chicken!";
    return egg(generation - 1);
}
const char* egg(int generation) {
    if (generation == 0) return "Egg!";
    return chicken(generation - 1);
}
```

chicken이 egg를, egg가 chicken을 부르는 **간접 재귀(상호 재귀)**입니다. 원형이 없으면 chicken을 컴파일할 때 egg를 모른다는 오류가 납니다. (슬라이드의 `char*` 반환은 표준 C++에서 문자열 리터럴을 `const char*`로 받아야 경고가 없습니다.)

두 함수가 서로를 호출합니다. 먼저 정의된 함수가 아래 함수를 호출하므로 **원형 선언이 필요**합니다.

```cpp
string egg(int g);                          // 원형
string chicken(int g) { return g == 0 ? "Chicken!" : egg(g - 1); }
string egg(int g)     { return g == 0 ? "Egg!" : chicken(g - 1); }
```

`chicken(3)` → `egg(2)` → `chicken(1)` → `egg(0)` → **`Egg!`**, `chicken(4)` → **`Chicken!`** (짝수 단계면 출발한 쪽).

---

## 6. 라이브러리 함수

C++에는 미리 만들어 둔 함수 라이브러리가 많습니다. 내부 동작은 몰라도 되지만 **무엇을 하고 무엇을 돌려주는지**는 알아야 합니다. `#include`로 포함합니다: `<math.h>`(또는 `<cmath>`), `<iostream>`, `<string>`, `<vector>`, `<time.h>` 등.

| 함수 | 하는 일 |
| --- | --- |
| `double ceil(double x)` | x보다 크거나 같은 가장 작은 정수 (올림) |
| `double floor(double x)` | x보다 작거나 같은 가장 큰 정수 (내림) |
| `double fabs(double x)` | 절댓값 |
| `double exp(double x)` | e의 x제곱 |
| `double log(double x)` | 자연로그 |
| `double log10(double x)` | 상용로그 |
| `double sqrt(double x)` | 제곱근 |

`ceil(2.1)` = 3, `floor(2.9)` = 2, `ceil(-2.1)` = -2, `floor(-2.1)` = -3입니다(음수에서 헷갈림).

---

## 7. 스코프와 저장 클래스

[![전역 스코프 안에 함수 스코프 안에 블록 스코프가 들어 있고 static 지역 변수는 함수 안에서만 보이지만 프로그램 끝까지 살아 있다는 그림](/materials/diagrams/cpp-03-scope.svg)](/materials/diagrams/cpp-03-scope.svg)

*그림 3-3 · 스코프와 static — 누르면 원본 크기로 열린다.*

**스코프**는 변수 이름을 쓸 수 있는 범위입니다. 스코프는 **선언한 곳에서 시작**하며, 선언 전에는 쓸 수 없습니다.

| 종류 | 선언 위치 | 보이는 범위 |
| --- | --- | --- |
| 전역 변수 | 모든 함수 밖 | 파일 끝까지, 어느 함수든 읽고 바꿀 수 있음 |
| 지역 변수 | 함수 안 | 함수 끝까지 |
| 블록 변수 | `{ }` 블록 안 | 그 블록 끝까지 |

```cpp
int main() {
    int y = 0;
    { int a = y; cout << a << endl; }
    cout << a << endl;      // 오류: a는 블록 밖에 없다
}
```

**저장 클래스**는 변수가 메모리에 **얼마 동안** 있는지를 정합니다. 전역 변수는 한 번만 만들어지고, 지역 변수는 함수가 호출될 때마다 새로 만들어집니다.

| 저장 클래스 | 뜻 |
| --- | --- |
| `static` | 지역 변수라도 **한 번만** 만들어져 마지막 값을 기억 |
| `extern` | 다른 곳(다른 파일)에 정의된 전역 변수를 쓴다는 선언 |
| `auto`, `register` | 옛 키워드 (deprecated). 지역 변수는 기본이 자동 |

| 종류 | 범위 |
| --- | --- |
| 블록 변수 | 선언한 곳부터 그 `{ }`의 끝까지 |
| `for (int i …)`의 `i` | 그 `for`문 안에서만 |
| 매개변수 | 함수 본문 전체 |
| 전역 변수 | 선언한 곳부터 파일 끝까지 |

### 이름 가리기와 `::`

안쪽 블록에 **같은 이름**을 선언하면 바깥 이름이 **가려집니다**. 가려진 **전역** 변수는 `::이름`으로 쓸 수 있습니다. (가려진 바깥 **지역** 변수는 꺼낼 방법이 없습니다.)

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> int x = 1;                              // 전역
> void show() { cout << x << ' '; }
>
> int main() {
>     int x = 2;
>     {
>         int x = 3;
>         cout << x << ' ' << ::x << ' ';
>     }
>     cout << x << ' ';
>     show();
>     for (int x = 9; x < 10; x++) cout << x << ' ';
>     cout << x;
> }
> ```

> [!ANSWER]
> ```text
> 3 1 2 1 9 2
> ```
>
> - 안쪽 블록의 `x`는 3, `::x`는 전역 1.
> - 블록이 끝나면 `main`의 `x`(2)가 다시 보입니다.
> - `show()`는 **자신이 정의된 위치**에서 보이는 전역 `x`(1)를 씁니다. 호출한 쪽의 지역 변수와 상관없습니다.
> - `for`의 `x`(9)는 반복문 안에서만 존재합니다.

| 구분 | 스코프(어디서 이름을 쓰나) | 저장 기간(언제 존재하나) | 초기화 |
| --- | --- | --- | --- |
| 일반 지역 변수 | 블록 안 | 블록에 들어올 때 생성, 나갈 때 소멸 | **매 호출마다** |
| `static` 지역 변수 | 블록 안 | **프로그램 끝까지** | **처음 한 번만** (값이 없으면 0) |
| 전역 변수 | 파일 전체 | 프로그램 끝까지 | 처음 한 번 (값이 없으면 0) |

> [!EXAM]
> `static int m = 0;`의 `= 0`은 **첫 호출 때 한 번만** 실행됩니다. 두 번째 호출부터는 이 줄을 건너뛰고 **이전 호출이 남긴 값**에서 시작합니다. 추적표에 "시작 m"과 "종료 m"을 함께 적으세요.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> // (1)
> int counter() {
>     static int s = 0;
>     int t = 0;
>     s++;
>     t++;
>     return s * 10 + t;
> }
> cout << counter() << ' ' << counter() << ' ' << counter() << '\n';
>
> // (2)
> int r(int n) {
>     static int c = 0;
>     c++;
>     if (n == 0) return c;
>     return r(n - 1);
> }
> cout << r(3) << ' ';
> cout << r(2) << '\n';
> ```

> [!ANSWER]
> **(1)** `11 21 31` — `s`는 1, 2, 3으로 이어지고 `t`는 매번 0에서 1이 됩니다.
>
> **(2)** `4 7` — `r(3)`은 r(3), r(2), r(1), r(0) 네 번 호출되어 c = 4. `r(2)`는 c가 4에서 이어져 세 번 더 호출되므로 7. **재귀 호출끼리도 static 변수 하나를 공유**합니다.

> [!QUIZ]
> 다음 프로그램의 최종 배열과 `step`의 총 호출 횟수를 쓰시오. 호출마다 시작 `k`, 시작 `flag`, 바뀐 원소, 반환 `k`를 추적하시오.
>
> ```cpp
> int step(int a[], int k) {
>     static int flag = 1;
>     a[k] = a[k] * 2 + flag;
>     if (flag) k++;
>     flag = 1 - flag;
>     return k;
> }
>
> int main() {
>     int a[4] = {1, 2, 3, 4};
>     int i = 0;
>     while (i < 4)
>         i = step(a, i);
>     for (int j = 0; j < 4; j++) cout << a[j] << ' ';
> }
> ```

> [!ANSWER]
> 출력: `3 9 13 17 `, 총 **7번** 호출.
>
> | 호출 | 시작 k | 시작 flag | 바뀐 원소 | 반환 k |
> | ---: | ---: | ---: | --- | ---: |
> | 1 | 0 | 1 | a[0] = 1·2+1 = 3 | 1 |
> | 2 | 1 | 0 | a[1] = 2·2+0 = 4 | 1 |
> | 3 | 1 | 1 | a[1] = 4·2+1 = 9 | 2 |
> | 4 | 2 | 0 | a[2] = 3·2+0 = 6 | 2 |
> | 5 | 2 | 1 | a[2] = 6·2+1 = 13 | 3 |
> | 6 | 3 | 0 | a[3] = 4·2+0 = 8 | 3 |
> | 7 | 3 | 1 | a[3] = 8·2+1 = 17 | 4 |
>
> `flag`가 `static`이 아니면 매 호출 1에서 시작하므로 4번만 호출되고 결과는 `3 5 7 9`입니다.

### extern

`extern int g;`는 "다른 파일 어딘가에 정의된 전역 변수 `g`를 쓴다"는 **선언**입니다. 실제 정의(`int g = 0;`)는 한 곳에만 있어야 합니다.

---

## 8. 네임스페이스와 const

`std::cout`의 `std::`는 **네임스페이스**입니다. 같은 이름을 여러 곳에서 쓰고 싶을 때(라이브러리 A의 `print`와 B의 `print`) 이름에 소속을 붙여 구분합니다.

```cpp
namespace myNamespace { int a, b; }
myNamespace::a = 1;           // 소속::이름

using namespace std;          // 이 줄 아래로는 std:: 생략 가능
cout << 5.0 << "\n";
```

**const**는 값을 바꿀 수 없는 변수를 만듭니다. 바꾸려 하면 컴파일 오류가 납니다. 코드 품질을 높이고, 컴파일러가 더 빠른 실행 파일을 만드는 데도 도움이 됩니다.

```cpp
const double factor = 5.0 / 9.0;
const double offset = 32.0;
celcius = (fahr - offset) * factor;
// factor = 1.0;  → 컴파일 오류
```

### const

```cpp
const int MAX = 30;      // 선언과 동시에 초기화해야 함
// MAX = 40;             // 컴파일 오류
// const int N;          // 컴파일 오류: 초기값 없음
```

### #define 매크로는 텍스트 치환

전처리기가 컴파일 **전에** 글자를 그대로 바꿔 넣습니다. 계산 순서를 지켜 주지 않습니다.

```cpp
#define SQ(x)  x * x          // 괄호 없음 (위험)
#define SQ2(x) ((x) * (x))    // 인자와 전체를 괄호로
```

> [!QUIZ]
> `int a = 3;`일 때 출력을 쓰시오.
>
> ```cpp
> cout << SQ(a + 1) << ' ' << SQ2(a + 1) << ' '
>      << 100 / SQ2(5) << ' ' << 100 / SQ(5) << '\n';
> ```

> [!ANSWER]
> ```text
> 7 16 4 100
> ```
>
> | 식 | 치환 결과 | 값 |
> | --- | --- | ---: |
> | `SQ(a + 1)` | `a + 1 * a + 1` = 3 + 3 + 1 | 7 |
> | `SQ2(a + 1)` | `((a + 1) * (a + 1))` | 16 |
> | `100 / SQ2(5)` | `100 / ((5) * (5))` | 4 |
> | `100 / SQ(5)` | `100 / 5 * 5` = 20 × 5 | 100 |
>
> 인자가 두 번 들어가므로 `SQ2(i++)`처럼 값을 바꾸는 식을 넣으면 안 됩니다.

| 헤더 | 주요 기능 |
| --- | --- |
| `<iostream>` | `cin`, `cout` |
| `<string>` | `string` |
| `<vector>` | `vector` |
| `<cmath>` | `sqrt`, `pow`, `fabs`, `ceil`, `floor`, `log`, `exp` |

`ceil(3.2)` = 4, `floor(3.8)` = 3, `floor(-3.2)` = −4 (정수 변환의 절단과 다름!), `sqrt(16.0)` = 4.

**네임스페이스**는 같은 이름을 구역으로 나눕니다. `game::score`처럼 `::`로 소속을 지정하고, `using namespace std;`는 `std::`를 생략하게 해 줍니다. 필요한 이름만 가져오려면 `using std::cout;`.

---

## 핵심 정리

1. 함수 = 반환형 + 이름 + 형식 매개변수 + 본문. 인수는 **복사**되어 전달된다(값에 의한 호출).
2. 지역 변수는 함수가 끝나면 사라진다. 반환값이 없으면 `void`.
3. 함수 원형은 본문 없이 모양만 알린다. 정의보다 먼저 부르거나 상호 재귀할 때 필요하다.
4. 재귀 = 기저 조건 + 더 작은 문제로의 재귀 단계. 펼쳐 보면 반복문으로 바꿀 수 있다.
5. 스코프: 전역(파일 끝) ⊃ 지역(함수 끝) ⊃ 블록(`}`까지). 선언 전에는 못 쓴다.
6. `static` 지역 변수는 한 번만 초기화되어 호출 사이에 값을 기억한다.
7. `std::`는 네임스페이스, `using namespace std;`로 생략. `const`는 바꾸면 컴파일 오류.

---

## 학습 경로

[← 02 형 변환과 제어 구조](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-02) · [04 참조·배열·vector →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-04)
