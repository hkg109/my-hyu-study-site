---
title: "C++ 기말고사 족보 (2025)"
description: "2025 C++ 기말고사 5문항: 포인터와 static 지역변수 추적, Book 클래스 작성, 가상 함수와 바인딩, 예외 재전파, try–catch 문법 T/F. 모든 출력은 직접 컴파일해 확인했습니다."
week: 0
order: 4
published: true
accessKey: cpp-2025-final
---

**응시 안내**

- 각 문항의 조건에 따라 출력값, 코드 또는 답을 작성하시오.
- 답안을 먼저 작성한 뒤 힌트를 하나씩 열고, 정답은 마지막에 확인하시오.
- 별도 언급이 없으면 C++17 컴파일러를 기준으로 한다.

> [!CAUTION]
> 제공된 2025 기말고사 족보의 문제와 답을 연습 시험 형식으로 옮긴 자료입니다. 실제 시험의 문항 순서나 배점과 다를 수 있습니다. 해설의 모든 출력은 g++로 직접 컴파일·실행해 확인했으며, 문제 3 답안의 `funA in C1` 오타는 실제 출력인 `funcA in C1`으로 바로잡았습니다.

| 문항 | 유형 | 주제 |
| --- | --- | --- |
| 문제 1 | 출력 추적 | 포인터 산술, `static` 지역변수 |
| 문제 2 | 코드 작성 | 클래스, 접근 지정자, 기본 생성자 |
| 문제 3 | 출력 추적 | 가상 함수, 정적·동적 바인딩 |
| 문제 4 | 출력 추적 | 예외 처리, `throw;` 재전파, `catch (...)` |
| 문제 5 | True / False | `try`–`catch` 문법 |

## 문제 1 · 포인터와 static 지역변수

> [!QUIZ]
> 다음의 물음에 답하시오.
>
> ```cpp
> #include <iostream>
>
> using namespace std;
>
> int fun(int k, int *p)
> {
>     int m = 1;
>     *(p + k) = k + p[k];
>     if (m != 0)
>         k = k + 1;
>     m = (m + 1) % 2;
>     return k;
> }
>
> int main()
> {
>     int s[5] = {1, 4, 4, 4, 4};
>     *s += 4;
>     int j = 0;
>     while (j < 5)
>     {
>         j = fun(j, s);
>     }
>     return 0;
> }
> ```
>
> a) 프로그램이 끝났을 때 `s[0]`, `s[1]`, `s[2]`, `s[3]`, `s[4]`의 값은?
>
> b) `int m`을 `static int m`으로 바꾸었을 때 `s[0]`, `s[1]`, `s[2]`, `s[3]`, `s[4]`의 값은?

> [!HINT 1]
> `*s`는 `s[0]`, `*(p + k)`와 `p[k]`는 같은 원소다. 따라서 `*(p + k) = k + p[k];`는 `s[k] += k`와 같다. `while`에 들어가기 전 `s`는 `{5, 4, 4, 4, 4}`다.

> [!HINT 2]
> 일반 지역변수 `m`은 호출될 때마다 1로 다시 초기화된다. `static` 지역변수는 첫 호출에서 한 번만 초기화되고, 함수가 끝나도 값이 남아 다음 호출로 이어진다.

> [!HINT 3]
> b)에서 `m`은 호출마다 1 → 0 → 1 → 0 …으로 바뀐다. `m`이 0인 호출에서는 `k`가 증가하지 않으므로, 같은 원소가 한 번 더 갱신된다.

> [!ANSWER]
> **a)** `5 5 6 7 8`
>
> 매 호출마다 `m = 1`로 시작하므로 `m != 0`이 항상 참이고, `k`는 매번 1씩 증가한다. 마지막 줄 `m = (m + 1) % 2;`는 다음 호출에 아무 영향이 없다. 따라서 `fun`은 5번 호출되고 각 원소는 한 번씩 `s[k] += k`가 된다.
>
> | 호출 | `k` | 갱신 | 반환값 |
> | ---: | ---: | --- | ---: |
> | 1 | 0 | `s[0] = 0 + 5 = 5` | 1 |
> | 2 | 1 | `s[1] = 1 + 4 = 5` | 2 |
> | 3 | 2 | `s[2] = 2 + 4 = 6` | 3 |
> | 4 | 3 | `s[3] = 3 + 4 = 7` | 4 |
> | 5 | 4 | `s[4] = 4 + 4 = 8` | 5 |
>
> **b)** `5 6 8 10 12`
>
> `static int m = 1;`은 첫 호출에서만 실행된다. 이후 `m`은 1과 0을 번갈아 가지며, `m`이 0인 호출에서는 같은 `k`를 그대로 반환한다. 그래서 `fun`은 9번 호출되고, `s[0]`만 한 번, 나머지는 두 번씩 갱신된다.
>
> | 호출 | `k` | 시작 `m` | 갱신 | 반환값 | 끝 `m` |
> | ---: | ---: | ---: | --- | ---: | ---: |
> | 1 | 0 | 1 | `s[0] = 0 + 5 = 5` | 1 | 0 |
> | 2 | 1 | 0 | `s[1] = 1 + 4 = 5` | 1 | 1 |
> | 3 | 1 | 1 | `s[1] = 1 + 5 = 6` | 2 | 0 |
> | 4 | 2 | 0 | `s[2] = 2 + 4 = 6` | 2 | 1 |
> | 5 | 2 | 1 | `s[2] = 2 + 6 = 8` | 3 | 0 |
> | 6 | 3 | 0 | `s[3] = 3 + 4 = 7` | 3 | 1 |
> | 7 | 3 | 1 | `s[3] = 3 + 7 = 10` | 4 | 0 |
> | 8 | 4 | 0 | `s[4] = 4 + 4 = 8` | 4 | 1 |
> | 9 | 4 | 1 | `s[4] = 4 + 8 = 12` | 5 | 0 |
>
> 두 번 갱신된 원소는 `s[k] = 4 + k + k = 2k + 4`이므로 `s[1]`부터 차례로 6, 8, 10, 12가 된다.

## 문제 2 · Book 클래스 작성

> [!QUIZ]
> 다음의 지시를 따르시오.
>
> 1. Class `Book`에는 접근 제한자가 public인 크기 50의 `char`형 변수 `title`과 접근 제한자가 private인 `float`형 변수 `price`가 있다.
> 2. Class `Book`에는 `price`의 값을 리턴하는 public method인 `get_price`와 `price`의 값을 설정하는 public method인 `set_price`가 있다.
> 3. Class `Book`에는 `price`를 0으로 초기화하고 `title`을 empty string으로 초기화하는 default constructor가 있다.
> 4. Class `Book`에는 `title`과 `price`를 print하는 멤버 함수가 있다.
> 5. `main` 함수에서 `Book` 객체를 선언하고, `price`를 10.0으로 설정한 다음, 멤버 함수를 통해 출력하라.

> [!HINT 1]
> `price`는 private이라 `main`에서 `b.price = 10.0;`처럼 직접 바꿀 수 없다. 그래서 `set_price`·`get_price` 같은 public 멤버 함수가 필요하다.

> [!HINT 2]
> C 문자열은 `'\0'`에서 끝난다. `char title[50]`을 empty string으로 만들려면 첫 글자만 `'\0'`으로 두면 된다.

> [!HINT 3]
> default constructor는 매개변수가 없고, 이름이 클래스와 같으며, 반환형을 쓰지 않는다.

> [!ANSWER]
> ```cpp
> #include <iostream>
>
> using namespace std;
>
> class Book
> {
> private:
>     float price;
>
> public:
>     char title[50];
>
>     float get_price()
>     {
>         return price;
>     }
>
>     void set_price(float x)
>     {
>         price = x;
>     }
>
>     Book()
>     {
>         price = 0.0;
>         title[0] = '\0';
>     }
>
>     void display()
>     {
>         cout << "Title: " << title << endl;
>         cout << "Price: " << price << endl;
>     }
> };
>
> int main()
> {
>     Book b;
>     b.set_price(10.0);
>     b.display();
>     return 0;
> }
> ```
>
> 출력:
>
> ```text
> Title: 
> Price: 10
> ```
>
> - `title`은 빈 문자열이므로 `Title: ` 뒤에 아무것도 출력되지 않는다.
> - `cout`은 기본 설정에서 소수부가 0인 실수를 `10`으로 출력한다. `10.0`으로 보이게 하려면 `<iomanip>`를 포함하고 `cout << fixed << setprecision(1) << price`처럼 쓴다.
> - 생성자는 멤버 초기화 리스트로 `Book() : price(0.0f) { title[0] = '\0'; }`처럼 써도 된다. `title[0] = '\0';` 대신 `<cstring>`의 `strcpy(title, "");`를 써도 같은 결과다.

## 문제 3 · 가상 함수와 바인딩

> [!QUIZ]
> 다음 프로그램의 출력문을 작성하시오.
>
> ```cpp
> #include <iostream>
>
> using namespace std;
>
> class C1
> {
> public:
>     void funcA() { cout << "funcA in C1\n"; }
>     virtual void funcB() { cout << "funcB in C1\n"; }
> };
>
> class C2 : public C1
> {
> public:
>     void funcA() { cout << "funcA in C2\n"; }
>     virtual void funcB() { cout << "funcB in C2\n"; }
> };
>
> int main()
> {
>     C1 *o1 = new C1;
>     C1 *o2 = new C2;
>     C2 *o3 = new C2;
>
>     o1->funcA();
>     o1->funcB();
>     o3->funcA();
>     o3->funcB();
>     o2->funcA();
>     o2->funcB();
>
>     return 0;
> }
> ```

> [!HINT 1]
> 각 포인터의 **선언된 타입**과 **실제로 가리키는 객체의 타입**을 따로 적어 보자. 둘이 다른 것은 `o2` 하나뿐이다.

> [!HINT 2]
> virtual이 아닌 함수는 포인터의 선언된 타입으로 컴파일할 때 결정된다(정적 바인딩). virtual 함수는 실제 객체의 타입으로 실행할 때 결정된다(동적 바인딩).

> [!ANSWER]
> ```text
> funcA in C1
> funcB in C1
> funcA in C2
> funcB in C2
> funcA in C1
> funcB in C2
> ```
>
> | 호출 | 포인터 타입 | 실제 객체 | 결정 기준 | 출력 |
> | --- | --- | --- | --- | --- |
> | `o1->funcA()` | `C1*` | `C1` | 포인터 타입 | `funcA in C1` |
> | `o1->funcB()` | `C1*` | `C1` | 실제 객체 | `funcB in C1` |
> | `o3->funcA()` | `C2*` | `C2` | 포인터 타입 | `funcA in C2` |
> | `o3->funcB()` | `C2*` | `C2` | 실제 객체 | `funcB in C2` |
> | `o2->funcA()` | `C1*` | `C2` | 포인터 타입 | `funcA in C1` |
> | `o2->funcB()` | `C1*` | `C2` | 실제 객체 | `funcB in C2` |
>
> 핵심은 마지막 두 줄이다. `o2`는 `C1*`이지만 `C2` 객체를 가리킨다. virtual이 아닌 `funcA`는 `C1`의 것이 호출되고, virtual인 `funcB`는 `C2`의 것이 호출된다.
>
> `C2::funcB`의 `virtual`은 생략해도 결과가 같다. 기반 클래스에서 virtual인 함수를 같은 시그니처로 재정의하면 자동으로 virtual이 된다.

## 문제 4 · 예외 처리와 재전파

> [!QUIZ]
> 다음 프로그램의 출력문을 작성하시오.
>
> ```cpp
> #include <iostream>
>
> using namespace std;
>
> void fun()
> {
>     try
>     {
>         cout << "fun pos A\n";
>         throw (int)4;
>         cout << "fun pos B\n";
>     }
>     catch (int i)
>     {
>         cout << "in catch CA with i:" << i << "\n";
>         throw;
>     }
>     cout << "fun pos C\n";
> }
>
> int main()
> {
>     try
>     {
>         cout << "main pos A\n";
>         fun();
>         throw (double)2.0;
>         cout << "main pos B\n";
>     }
>     catch (double j)
>     {
>         cout << "in catch CB with j:" << j << "\n";
>     }
>     catch (...)
>     {
>         cout << "in catch CC\n";
>     }
>     cout << "main pos C\n";
>
>     return 0;
> }
> ```

> [!HINT 1]
> 피연산자 없이 쓴 `throw;`는 지금 처리 중인 예외를 그대로 다시 던진다. 이 예외는 `fun`을 빠져나가 호출한 쪽으로 전달된다.

> [!HINT 2]
> `catch`는 위에서부터 차례로 비교하며, `int` → `double` 같은 산술 변환은 하지 않는다. 다시 던져진 예외는 `int`다.

> [!ANSWER]
> ```text
> main pos A
> fun pos A
> in catch CA with i:4
> in catch CC
> main pos C
> ```
>
> 1. `main pos A`를 출력하고 `fun()`을 호출한다.
> 2. `fun pos A`를 출력한 뒤 `int` 4를 던진다. `fun pos B`는 실행되지 않는다.
> 3. `catch (int i)`가 받아 `in catch CA with i:4`를 출력하고, `throw;`로 같은 `int` 예외를 다시 던진다. 예외가 `fun` 밖으로 나가므로 `fun pos C`도 실행되지 않는다.
> 4. `main`의 `try` 블록에서 `fun()` 다음 줄 `throw (double)2.0;`과 `main pos B`는 실행되지 않는다.
> 5. 예외 타입이 `int`이므로 `catch (double j)`와 맞지 않고, 모든 예외를 받는 `catch (...)`가 `in catch CC`를 출력한다.
> 6. 예외 처리가 끝났으므로 `try`–`catch` 다음 문장인 `main pos C`가 출력된다.
>
> `catch (...)`는 모든 타입을 받으므로 항상 마지막 handler로 둔다.

## 문제 5 · try–catch 문법 (T/F)

> [!QUIZ]
> (T/F) A catch-block must immediately follow in correspond to try-block, no statements are allowed between these blocks.

> [!HINT 1]
> `try { ... }`와 `catch (...) { ... }` 사이에 `int x = 0;` 같은 문장을 넣으면 컴파일될지 생각해 보자.

> [!ANSWER]
> **T**
>
> 문법상 `try` 블록 바로 뒤에는 하나 이상의 handler(`catch` 블록)가 와야 하고, 그 사이에 다른 문장을 둘 수 없다. 여러 `catch` 블록을 연달아 쓰는 것은 모두 같은 `try`의 handler라서 허용된다.
>
> ```cpp
> try { throw 1; }
> int x = 0;        // 컴파일 오류
> catch (int) { }
> ```
>
> g++는 `expected 'catch' before 'x'` 오류를 낸다.
