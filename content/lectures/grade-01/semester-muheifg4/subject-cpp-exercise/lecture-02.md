---
title: "Exercise 02 · 입출력과 정수 연산"
description: "C++ 입출력과 정수 연산 문제를 풀이합니다."
order: 2
published: true
---

Exercise 02의 개념, 문제 조건, 알고리즘, 정답 코드와 실행 흐름을 정리합니다.

[Exercise 02](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-02) · [Exercise 03](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-03) · [Exercise 04](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-04) · [Exercise 05](/lectures/grade-01/semester-muheifg4/subject-cpp-exercise/lecture-05)

> 출처: **CPP Programming Exercise 02.pdf**. 정답은 별도 Solution PDF가 제공되지 않아 기존 Exercise 풀이를 유지했습니다. 정답 코드는 접어서 확인할 수 있습니다.

## 핵심 개념

### 1. 소스 코드가 실행되기까지

~~~text
.cpp 소스 파일 → 전처리 → 컴파일 → 링크 → 실행 파일
~~~

| 코드의 구성 요소 | 하는 일 |
| --- | --- |
| `#include` | 필요한 헤더 포함 |
| `main` | 프로그램이 시작되는 진입점 |
| `std::cin` | 입력을 변수에 저장 |
| `std::cout` | 결과를 화면에 출력 |

> [!CAUTION]
> **편집기와 컴파일러는 별개입니다.** VS Code만 설치했다고 C++ 컴파일러까지 설치되는 것은 아닙니다.

### 2. 변수와 리터럴

> [!DEFINITION]
> **변수**는 자료형이 정해진 저장 공간이고, **리터럴**은 코드에 직접 쓴 값입니다.

~~~cpp
int score = 75;  // score: 변수, 75: 정수 리터럴
~~~

| 문법 | 의미 | 기억할 점 |
| --- | --- | --- |
| `=` | 값을 대입 | 변수에 저장 |
| `==` | 두 값을 비교 | 같은지 판단 |
| `bool` | 참 또는 거짓 | 기본 출력은 1 또는 0 |

> [!CAUTION]
> 지역 정수 변수는 ==red:값을 넣기 전에 읽으면 안 됩니다==. 초기화하거나 입력받은 뒤 사용하세요.

### 3. 정수 나눗셈과 나머지

| 표현식 | 결과 | 이유 |
| --- | --- | --- |
| `7 / 2` | `3` | 정수끼리 나누면 소수 부분을 버림 |
| `7 / 2.0` | `3.5` | 실수 나눗셈 |
| `7 % 2` | `1` | 정수 나눗셈의 나머지 |

> [!EXAM]
> ==yellow:계산할 때의 자료형이 중요합니다==. `double result = 7 / 2;`도 먼저 정수 나눗셈을 하므로 저장되는 값은 3입니다.

**연산자를 읽는 순서**

- 곱셈·나눗셈은 덧셈·뺄셈보다 먼저 묶입니다.
- 괄호를 사용하면 계산 의도를 분명하게 표현할 수 있습니다.
- 우선순위는 **식의 묶임**을 정하며, 피연산자의 실행 순서를 모두 정하는 규칙은 아닙니다.

### 4. 매크로와 오버플로 주의

~~~cpp
#define SQUARE(x) ((x) * (x))
~~~

매크로는 **텍스트 치환**입니다. 위 식에서는 인자와 전체 식을 괄호로 감싸 연산자 우선순위 문제를 줄입니다.

> [!CAUTION]
> 인자가 두 번 나타나므로 `SQUARE(i++)`처럼 값을 변경하는 표현식은 넣지 않습니다.
>
> 부호 있는 정수의 오버플로는 **정의되지 않은 동작**입니다. 입력값뿐 아니라 **중간 계산의 최대값**도 확인해야 합니다.

> [!EXAM]
> 이번 두 문제의 공통 흐름은 **입력 → 계산 → 출력**입니다. 반복문이나 배열 없이 정수 연산으로 해결할 수 있습니다.

## Exercise 02

### Quiz 1 - 쇼핑 금액 계산

> **난이도:** 중하

#### Problem (Original)

*CPP Programming Exercise 02.pdf, slide 14*

**Quiz 1: Shopping Total**

**Problem.** Read an item's price, quantity, and a discount. Calculate the total price and subtract the discount once. Store the result in `total` and print it.

**Input.** Three integers: `price quantity discount`

**Output.** Print the final total as an integer.

**Constraints.** `1 <= price <= 10000`, `1 <= quantity <= 100`, `0 <= discount <= price * quantity`

| Sample | Input | Output |
| --- | --- | --- |
| 1 | `1500 4 1000` | `5000` |

> [!TRANSLATION]
> **문제.** 상품 하나의 가격, 수량, 할인 금액을 입력받습니다. 총 가격을 계산한 뒤 할인 금액을 **한 번만** 뺍니다. 결과를 `total`에 저장하고 출력합니다.
>
> **입력.** 세 정수 `price quantity discount`
>
> **출력.** 최종 금액을 정수로 출력합니다.
>
> **제약 조건.** `1 <= price <= 10000`, `1 <= quantity <= 100`, `0 <= discount <= price * quantity`
>
> 예제 입력과 출력은 위 표와 같습니다.

#### 개념과 예제

> [!CONCEPT]
> **식의 순서가 곧 문제의 의미입니다.** "총액을 구한 뒤 할인을 한 번 뺀다"는 문장은 `total = price * quantity - discount`로 옮겨집니다. `*`가 `-`보다 우선순위가 높으므로 괄호 없이도 곱셈이 먼저 계산됩니다.
>
> 범위도 함께 확인합니다. 가장 큰 총액은 `10000 × 100 = 1,000,000`이므로 32비트 `int`(약 21억까지)로 충분합니다.

> [!PROBLEM]
> 가격 2000원, 수량 3개, 할인 500원이면 `2000 * 3 - 500 = 6000 - 500 = 5500`입니다.
>
> 입력 `2000 3 500` → 출력 `5500`

> [!TRAP]
> `(price - discount) * quantity`는 **상품마다** 할인하는 식입니다. 예제 `1500 4 1000`에 넣으면 `500 × 4 = 2000`이 되어 정답 5000과 다릅니다.

#### 접근 방법

- 가격은 1 이상 10,000 이하이고 수량은 1 이상 100 이하입니다.
- 할인 전 최대 금액은 10,000 × 100 = 1,000,000이므로 int 범위에 충분히 들어갑니다.
- discount는 전체 상품 금액 이하이므로 결과는 음수가 되지 않습니다.
- 할인은 상품 하나마다 적용하는 것이 아니라 전체 금액에서 정확히 한 번만 뺍니다.

계산식은 다음과 같습니다.

~~~text
total = price * quantity - discount
~~~

<Answer>

~~~cpp title="exercise02_quiz1.cpp" showLineNumbers
#include <iostream>
using namespace std;

int main() {
    int price;
    int quantity;
    int discount;

    // 상품 가격, 수량, 전체 주문 할인액을 차례로 입력받는다.
    cin >> price >> quantity >> discount;

    // 먼저 상품 가격에 수량을 곱하고, 할인액은 전체에서 한 번만 뺀다.
    const int total = price * quantity - discount;

    // 문제에서 요구한 최종 결제 금액만 출력한다.
    cout << total << '\n';

    return 0;
}
~~~

</Answer>

#### 코드 해설: 가격 계산의 순서

1. `cin >> price >> quantity >> discount`는 입력의 세 값을 왼쪽부터 차례로 저장합니다. 예시에서는 `price = 1500`, `quantity = 4`, `discount = 1000`입니다.
2. `price * quantity`로 할인 전 전체 가격을 계산합니다. 같은 가격의 상품을 네 개 사므로 1500을 네 번 더한 값입니다.
3. 전체 가격에서 `discount`를 **한 번만** 뺍니다. 할인액은 상품 한 개의 할인이 아니라 주문 전체의 할인입니다.
4. `const int total`에 결과를 저장합니다. `const`는 계산 후 `total`을 바꾸지 않겠다는 표시이며, 계산을 더 빠르게 만드는 특별한 명령은 아닙니다.
5. `cout`으로 정답과 줄바꿈만 출력합니다. 채점용 출력에 설명 문장을 추가하면 안 됩니다.

#### 수학 공식: 왜 가격 × 수량인가요?

~~~text
상품 4개의 가격 = 1500 + 1500 + 1500 + 1500
                = 1500 × 4

결제 금액 = 상품 한 개의 가격 × 수량 - 전체 할인액
          = 1500 × 4 - 1000
          = 6000 - 1000
          = 5000
~~~

곱셈은 같은 수를 여러 번 더하는 계산을 줄여 쓴 것입니다. C++에서도 `*`가 `-`보다 먼저 계산되므로 `price * quantity - discount`라고 쓰면 됩니다.

> [!CAUTION]
> `(price - discount) * quantity`는 다른 식입니다. 예시에서 `(1500 - 1000) * 4 = 2000`이 되어 할인액 1000을 네 번 적용하게 됩니다.

#### 실제 입력 추적

| 실행한 부분 | 저장되거나 계산된 값 | 의미 |
| --- | --- | --- |
| `cin >> price` | `1500` | 한 개의 가격 |
| `cin >> quantity` | `4` | 구매 개수 |
| `cin >> discount` | `1000` | 주문 전체 할인 |
| `price * quantity` | `6000` | 할인 전 가격 |
| `total` | `5000` | 최종 결제 금액 |
| 출력 | `5000` | 출력 예시와 일치 |

할인액이 0이면 원래 가격 그대로이고, 할인액이 전체 가격과 같으면 결과는 0입니다. 반복이나 배열이 필요 없는 계산이므로 이미 O(1) 풀이입니다.

#### 복잡도

- 시간 복잡도: O(1)
- 공간 복잡도: O(1)

---

### Quiz 2 - 경과 시간 변환

> **난이도:** 중

#### Problem (Original)

*CPP Programming Exercise 02.pdf, slide 15*

**Quiz 2: Timestamp Conversion**

**Problem.** The reference time is Day 0, 00:00:00. Given the elapsed time in seconds, calculate the day number and time. Each day has 24 hours.

**Input.** One integer `elapsedSeconds`, from 0 to 1,000,000,000.

**Output.** Print the values with the labels shown below. Use hours from 0 to 23, and minutes and seconds from 0 to 59. Keep the labels unchanged for all values.

| Sample | Input | Output |
| --- | --- | --- |
| 1 | `93605` | `Days: 1 Hours: 2 Minutes: 0 Seconds: 5` |

> [!TRANSLATION]
> **문제.** 기준 시각은 0일 00:00:00입니다. 경과 시간이 초 단위로 주어질 때 며칠째인지와 그날의 시각을 계산합니다. 하루는 24시간입니다.
>
> **입력.** 정수 하나 `elapsedSeconds`가 주어지며 범위는 0 이상 1,000,000,000 이하입니다.
>
> **출력.** 아래 예시와 같은 라벨을 붙여 출력합니다. 시는 0~23, 분과 초는 0~59 범위로 나타냅니다. 어떤 값이 들어와도 라벨 형식은 바꾸지 않습니다.
>
> 예제 입력과 출력은 위 표와 같습니다.

#### 개념과 예제

> [!CONCEPT]
> **큰 단위부터 몫(`/`)으로 떼어 내고, 남은 양은 나머지(`%`)로 넘깁니다.**
>
> - 하루 = `24 × 60 × 60 = 86400`초 → `days = s / 86400`
> - 그날 남은 초 = `s % 86400` → 여기서 `/ 3600`이 시, `% 3600`이 남은 초
> - 남은 초에서 `/ 60`이 분, `% 60`이 초
>
> 입력 최댓값 10억은 `int` 최댓값(2,147,483,647)보다 작으므로 `int`로 저장할 수 있습니다.

> [!PROBLEM]
> `3725`초를 변환해 봅시다.
>
> - `3725 / 86400 = 0`일, 남은 초 `3725`
> - `3725 / 3600 = 1`시간, 남은 초 `3725 % 3600 = 125`
> - `125 / 60 = 2`분, `125 % 60 = 5`초
>
> 출력: `Days: 0 Hours: 1 Minutes: 2 Seconds: 5`

> [!TRAP]
> `hours = s / 3600`처럼 **하루를 빼지 않고** 시간을 구하면 93605초에서 26시간이 나옵니다. 시는 반드시 `s % 86400`에서 계산해야 0~23 범위가 됩니다.

#### 접근 방법

- 하루는 24 × 60 × 60 = 86,400초입니다.
- 전체 초를 86,400으로 나눈 몫이 날짜이고, 나머지는 그날 안에서 흐른 초입니다.
- 남은 초를 3,600으로 나눈 몫이 시간입니다.
- 다시 남은 초를 60으로 나눈 몫과 나머지가 각각 분과 초입니다.
- 입력과 모든 중간 계산값이 1,000,000,000을 넘지 않으므로 int로 안전하게 표현할 수 있습니다.
- 시는 0에서 23, 분과 초는 0에서 59 사이가 되도록 매 단계에서 나머지를 갱신합니다.

<Answer>

~~~cpp title="exercise02_quiz2.cpp" showLineNumbers
#include <iostream>
using namespace std;

int main() {
    int elapsedSeconds;
    cin >> elapsedSeconds;

    // 시간 단위는 변하지 않는 정수이므로 const int로 선언한다.
    const int secondsPerMinute = 60;
    const int secondsPerHour = 60 * secondsPerMinute;
    const int secondsPerDay = 24 * secondsPerHour;

    // 원래 입력은 보존하고, 아직 단위로 분리하지 않은 초만 줄여 간다.
    int remainingSeconds = elapsedSeconds;
    const int days = remainingSeconds / secondsPerDay;
    remainingSeconds %= secondsPerDay;

    // 하루를 제외하고 남은 초에서 시간을 구한다.
    const int hours = remainingSeconds / secondsPerHour;
    remainingSeconds %= secondsPerHour;

    // 한 시간을 제외하고 남은 초에서 분을 구한다.
    const int minutes = remainingSeconds / secondsPerMinute;

    // 60으로 나눈 나머지가 마지막 초가 된다.
    const int seconds = remainingSeconds % secondsPerMinute;

    // PDF에 제시된 라벨과 순서를 그대로 사용한다.
    cout << "Days: " << days
         << " Hours: " << hours
         << " Minutes: " << minutes
         << " Seconds: " << seconds << '\n';

    return 0;
}
~~~

</Answer>

#### 코드 해설: 큰 단위부터 떼어 내기

`elapsedSeconds`는 처음 입력받은 총 초이고, `remainingSeconds`는 아직 일·시·분으로 분리하지 않은 초입니다. 원본 입력과 남은 양을 구분하면 변수의 의미를 따라가기 쉽습니다.

1. `secondsPerMinute = 60`에서 시작해 한 시간은 `60 * 60 = 3600`초, 하루는 `24 * 3600 = 86400`초로 정합니다.
2. `remainingSeconds / secondsPerDay`로 완전히 지난 일수를 구합니다.
3. `remainingSeconds %= secondsPerDay`로 이미 날짜에 포함한 초를 제외합니다. `x %= y`는 `x = x % y`와 같습니다.
4. 남은 초를 3600으로 나누어 시간을 구하고, 다시 3600으로 나눈 나머지만 남깁니다.
5. 마지막 남은 초를 60으로 나눈 몫은 분, 나머지는 초입니다.

#### 수학 공식: 몫과 나머지의 역할

0 이상의 정수 `N`을 양의 정수 `D`로 나누면 다음처럼 나타낼 수 있습니다.

~~~text
N = D × q + r       (0 ≤ r < D)
q = N / D           완전히 들어가는 묶음 수: 몫
r = N % D           묶고 남은 양: 나머지
~~~

정수끼리의 `/`는 이 문제에서 소수 부분을 버린 몫을 구합니다. 예를 들어 `7205 / 3600`은 약 2.001시간을 출력하는 것이 아니라, 완전한 한 시간이 두 번 들어가므로 `2`가 됩니다. `%`는 남은 5초를 구합니다.

#### 실제 입력 93605 추적

| 단계 | 계산 전 남은 초 | 나눌 단위 | 몫으로 저장한 값 | 나머지 |
| --- | --- | --- | --- | --- |
| 일 | 93605 | 86400 | `days = 1` | `93605 - 86400 = 7205` |
| 시 | 7205 | 3600 | `hours = 2` | `7205 - 7200 = 5` |
| 분 | 5 | 60 | `minutes = 0` | `seconds = 5` |

따라서 출력은 `Days: 1 Hours: 2 Minutes: 0 Seconds: 5`입니다. 반대로 초로 복원해 보면 계산을 검산할 수 있습니다.

~~~text
총 초 = 일 × 86400 + 시 × 3600 + 분 × 60 + 초
      = 1 × 86400 + 2 × 3600 + 0 × 60 + 5
      = 93605
~~~

하루를 먼저 제외했기 때문에 `hours`는 24보다 작습니다. 한 시간을 먼저 제외했기 때문에 `minutes`는 60보다 작습니다. 같은 이유로 `seconds`도 60보다 작습니다.

입력이 `0`이면 모두 0이고, `86400`이면 1일 0시 0분 0초입니다. 초를 하나씩 빼는 반복문 대신 나눗셈과 나머지 연산으로 한 번에 단위를 분리하는 것이 핵심입니다.

#### 복잡도

- 시간 복잡도: O(1)
- 공간 복잡도: O(1)

---

