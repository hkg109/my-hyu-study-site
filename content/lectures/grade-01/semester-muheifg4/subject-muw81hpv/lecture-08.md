---
title: "예외 처리"
description: "예외와 예외 처리기의 뜻, try·catch·throw, 여러 catch와 형식 매개변수, 처리되지 않은 예외의 전파, 중첩 try-catch와 재던지기, 예외 클래스를 값·참조·new로 던지고 받는 법, 스택 풀기, Java와의 차이를 Lecture 11 순서로 흐름 그림과 족보 출력 추적으로 설명합니다."
order: 8
published: true
duration: 80
---

# 예외 처리

**슬라이드:** Lecture 11 (12주차) · Exception Handling, Try-Catch-Blocks

**예외(exception)**는 하드웨어나 소프트웨어가 감지할 수 있는 특별한 사건(오류든 아니든)으로, 특별한 처리가 필요할 수 있는 것입니다. 그 처리를 **예외 처리**, 처리하는 코드 단위를 **예외 처리기(exception handler)**라고 합니다.

---

## 학습 흐름

```text
왜 예외 처리인가 → try / throw / catch → catch의 형식 매개변수
        ↓
여러 catch → 처리되지 않은 예외의 전파 → 중첩 try-catch → 재던지기 throw;
        ↓
예외 클래스: 값으로 / 참조로 / new로 → 스택 풀기 → 주의점과 Java와의 차이
```

> [!EXAM]
> 기말 족보에서 예외 문제가 **6문항**입니다. 같은 코드에 `throw`하는 값의 자료형만 바꿔(`double`, `int`, `char`, `bool`, `"K"`) 출력을 묻습니다. **catch는 자료형이 정확히 맞아야 받는다**는 규칙 하나로 모두 풀립니다.

---

## 1. 왜 예외 처리인가

| 예외 처리가 없는 언어 | 예외 처리가 있는 언어 |
| --- | --- |
| 프로그래머가 오류 감지·복구 방법을 직접 만들어야 함 | 특정 오류를 예외로 **잡아(trap)** 문제를 고치고 계속 진행할 수 있음 |
| 오류 처리 코드가 본래 코드와 뒤섞임 | 오류 처리 코드가 **분리**되어 읽고 고치기 쉬움 |

---

## 2. try · throw · catch

[![main이 foo를 foo가 foo_1을 호출한 상태에서 foo_1의 throw 1이 try가 없어 빠져나가고 foo의 catch int가 받아 처리하는 흐름](/materials/diagrams/cpp-08-exception-flow.svg)](/materials/diagrams/cpp-08-exception-flow.svg)

*그림 8-1 · 예외는 맞는 catch까지 올라간다 — 누르면 원본 크기로 열린다.*

```cpp
try {
    문장들;
}
catch (형식 매개변수) {
    예외 처리기
}
```

- catch 블록은 try 블록 **바로 뒤**에 와야 합니다.
- catch 블록은 try 블록에서 **문제가 생겼을 때만** 실행됩니다.
- catch 처리가 끝나면 **catch 블록 다음 문장**으로 갑니다. **try 블록으로 돌아가지 않습니다.**
- 예외는 `throw 식;`으로 명시적으로 일으키고, **식의 자료형**이 어느 처리기로 갈지 정합니다.

**catch의 형식 매개변수**는 ① 자료형 이름만(`catch (int)`), ② 자료형 + 변수 이름(`catch (int i)` — 처리기에 정보를 전달), ③ 줄임표 `...`(모든 예외)일 수 있습니다.

**여러 catch** — C++은 처리기를 **형식 매개변수의 자료형으로 구분**합니다(함수 오버로딩과 같은 방식). 그래서 각 catch의 자료형은 서로 달라야 합니다.

**처리되지 않은 예외** — 예외가 난 함수에 맞는 처리기가 없으면 **호출한 함수로 전파**되고, main까지 계속 올라갑니다. 끝까지 없으면 **기본 처리기**가 불립니다(보통 프로그램 종료).

### 2-1. 왜 필요한가

나눗셈 함수에 0이 들어오면 무엇을 돌려줘야 할까요? -1을 돌려주자니 실제 결과가 -1일 수도 있습니다. 함수가 **"정상 결과를 줄 수 없다"**는 사실을 확실하게 알리는 방법이 예외입니다.

```cpp
int divide(int a, int b) {
    if (b == 0) throw 0;      // 비상벨: 더 진행하지 않고 즉시 빠져나감
    return a / b;
}

int main() {
    try {
        cout << divide(10, 2) << ' ';   // 5
        cout << divide(1, 0) << ' ';    // 여기서 throw → 아래 줄은 건너뜀
        cout << "안 나옴";
    }
    catch (int e) {
        cout << "0으로 나눔 ";
    }
    cout << "끝";
}
// 출력: 5 0으로 나눔 끝
```

### 2-2. 세 키워드

```cpp
try {
    // 예외가 날 수 있는 코드
    throw 값;              // 여기서 즉시 중단 → 맞는 catch로 점프
    // throw 아래 문장은 실행되지 않음
}
catch (int e)    { … }     // 위에서부터 차례로 자료형 검사
catch (double e) { … }
catch (...)      { … }     // 모든 예외 (반드시 마지막)
// catch가 처리하면 try-catch 전체의 "다음 문장"부터 계속
```

| 키워드 | 하는 일 |
| --- | --- |
| `try { }` | "이 안에서 예외가 날 수 있다"고 감시하는 구역 |
| `throw 값;` | 예외를 던짐. **값의 자료형**이 예외의 종류가 됨 |
| `catch (자료형 이름) { }` | 그 자료형의 예외를 받아 처리 |

> [!EXAM]
> **catch 선택 규칙**
>
> 1. catch를 **위에서부터** 검사해 **처음 맞는 것 하나만** 실행합니다.
> 2. 자료형이 **정확히 같아야** 합니다. `int`↔`double`, `char`→`int`, `bool`→`int` 같은 **일반 변환은 일어나지 않습니다**.
> 3. 예외: 파생 클래스 예외는 **기반 클래스 catch**(`catch (const exception& e)`)로 받을 수 있습니다.
> 4. `"K"` 같은 문자열 리터럴은 `const char*` 자료형입니다. `char`, `int`로는 받지 못합니다.
> 5. 이 함수에 맞는 catch가 없으면 함수를 즉시 빠져나가 **호출한 곳의 try**에서 다시 찾습니다(전파). 끝까지 없으면 프로그램이 종료됩니다(`terminate`).

> [!TRAP]
> 평소에는 `int x = 'c';`나 `double d = 3;`처럼 자료형이 자동으로 바뀌지만, **catch에서는 바뀌지 않습니다.** `throw 'c'`는 `catch (int)`로 받지 못하고, `throw 3`은 `catch (double)`로 받지 못합니다. 족보 문제의 절반이 이 함정입니다.

### 2-3. 처리 후 어디로 가는가

- catch 블록이 끝나면 그 **try-catch 다음 문장**으로 갑니다. throw 지점으로 돌아가지 않습니다.
- catch 안에서 `throw;`(재던지기)를 하면 **같은 예외를 그대로** 바깥(호출한 쪽)으로 다시 던집니다. 같은 try의 다른 catch로 가지 않습니다.

```text
흐름 그림 (main → fun 호출, fun에서 throw)

main: try { A → fun() ──────────────┐  → B }  catch들  → F
                                     │
fun:  try { FA → throw ─┐ → BA }      │
               ┌────────┘             │
              fun의 catch 중 맞는 것?   │
               ├ 있음 → 처리 → BC → fun 정상 종료 → main의 B로 돌아감
               └ 없음 → fun을 즉시 빠져나감 ─┘ → main의 catch에서 다시 찾음 (B는 건너뜀)
```

> [!QUIZ]
> 아래 `fun`에서 `throw` 줄의 값만 바꿔 실행한다. ① `(double)5.0`, ② `3`, ③ `'c'`, ④ `true`, ⑤ `"K"`일 때 각각 전체 출력을 쓰시오. (출력은 한 줄로 쓴다.)
>
> ```cpp
> void fun() {
>     try {
>         cout << "FA ";
>         throw /* 값 */;
>         cout << "BA ";
>     }
>     catch (int i)  { cout << "FCA " << i << ' '; }
>     catch (char c) { cout << "FCB " << c << ' '; throw; }
>     cout << "BC ";
> }
>
> int main() {
>     try {
>         cout << "A ";
>         fun();
>         cout << "B ";
>     }
>     catch (int i)    { cout << "C " << i << ' '; }
>     catch (double d) { cout << "D " << d << ' '; }
>     catch (...)      { cout << "E "; }
>     cout << "F";
> }
> ```

> [!HINT 1]
> 각 경우마다 두 가지만 물으세요. ① **fun의 catch 중에 자료형이 정확히 같은 것이 있나?** 있으면 fun 안에서 처리되고 `BC`, `B`가 출력됩니다. ② 없거나 `throw;`로 다시 던지면, **main의 catch 중 정확히 같은 것**을 위에서부터 찾고, 없으면 `...`가 받습니다.

> [!ANSWER]
> | throw 값 | 출력 | 흐름 |
> | --- | --- | --- |
> | ① `5.0` (double) | `A FA D 5 F` | fun에 double catch 없음 → 전파(BC, B 건너뜀) → main의 double |
> | ② `3` (int) | `A FA FCA 3 BC B F` | fun에서 처리 → fun의 다음 문장 BC → 정상 반환 → B |
> | ③ `'c'` (char) | `A FA FCB c E F` | fun의 char가 받고 `throw;`로 char를 다시 던짐 → main에 char catch 없음 → `...` |
> | ④ `true` (bool) | `A FA E F` | bool은 int로 바뀌지 않음 → 전파 → `...` |
> | ⑤ `"K"` | `A FA E F` | `const char*` → 맞는 catch 없음 → `...` |
>
> 모든 경우 BA는 출력되지 않습니다(throw 아래). 재던지기된 char는 main의 `catch (int)`로도 바뀌지 않습니다.

> [!QUIZ]
> 다음 출력을 쓰고, `throw;` 이후 예외가 전달되는 경로를 설명하시오.
>
> ```cpp
> void fun() {
>     try {
>         cout << "fun pos A\n";
>         throw (int)4;
>         cout << "fun pos B\n";
>     }
>     catch (int i) {
>         cout << "in catch CA with i:" << i << "\n";
>         throw;
>     }
>     cout << "fun pos C\n";
> }
>
> int main() {
>     try {
>         cout << "main pos A\n";
>         fun();
>         throw (double)2.0;
>         cout << "main pos B\n";
>     }
>     catch (double j) { cout << "in catch CB with j:" << j << "\n"; }
>     catch (...)      { cout << "in catch CC\n"; }
>     cout << "main pos C\n";
> }
> ```

> [!ANSWER]
> ```text
> main pos A
> fun pos A
> in catch CA with i:4
> in catch CC
> main pos C
> ```
>
> `throw;`가 int 4를 main으로 다시 던집니다. 그래서 `fun()` 다음 줄의 `throw (double)2.0`은 **실행되지 않습니다**. main에는 int catch가 없으므로 `catch (...)`가 받고, 처리 후 `main pos C`로 갑니다.

---

## 3. 중첩 try-catch와 재던지기

try-catch는 if문이나 반복문처럼 **중첩**할 수 있습니다. 안쪽 catch 중 맞는 것이 없으면 **바깥 블록**에서 계속 찾습니다.

```cpp
void foo() {
    try {
        try {
            throw (double)1;
        }
        catch (int i) { std::cout << "inner catch. i = " << i; }    // double이라 못 받음
    }
    catch (double d) { std::cout << "outer catch. d = " << d; }      // 여기서 받음
}
// 출력: outer catch. d = 1
```

**재던지기** — 처리기 안에서 피연산자 없는 `throw;`를 쓰면 **같은 예외를 다시 일으켜** 다른 곳(바깥 블록이나 호출한 쪽)에서 처리하게 합니다.

```cpp
void foo() {
    try {
        try { throw (double)1; }
        catch (double d) { std::cout << "inner catch. d = " << d; throw; }
    }
    catch (double d) { std::cout << "outer catch. d = " << d; }
}
// 출력: inner catch. d = 1outer catch. d = 1

void foo2() {
    try { throw (double)1; }
    catch (double d) { std::cout << "catch 1 d = " << d; throw; }   // main으로 다시 던짐
}
int main() {
    try { foo2(); }
    catch (double d) { std::cout << "catch 2 d = " << d; }
}
// 출력: catch 1 d = 1catch 2 d = 1
```

---

## 4. try와 catch의 문법 규칙

| 규칙 | 어기면 |
| --- | --- |
| try 블록 **바로 뒤**에 catch가 와야 함 (사이에 일반 문장 불가) | 컴파일 오류 |
| `catch (...)`는 **마지막** catch여야 함 | 컴파일 오류 |
| 기반 클래스 catch를 파생 클래스 catch보다 **앞에** 두면 파생 catch에 도달할 수 없음 | 컴파일은 됨(경고) |
| catch를 **값**으로 받으면 예외 객체가 **복사**됨 (복사 생성자 호출, 슬라이싱) | 보통 `const 참조`로 받음 |

> [!NOTE]
> 기반·파생 예외를 함께 받을 때는 **구체적인 것(파생)을 위에, 넓은 것(기반)을 아래에** 둡니다. 위에서부터 처음 맞는 하나만 실행되므로, 넓은 그물을 먼저 치면 아래의 촘촘한 그물에는 아무것도 걸리지 않습니다. `catch (...)`가 가장 넓은 그물이라 맨 마지막인 것도 같은 이유입니다.

> [!QUIZ]
> 1. "try 블록과 바로 뒤의 catch 블록 사이에는 일반 실행문을 넣을 수 없다." 참인가 거짓인가?
> 2. `MyErr`가 `runtime_error`의 파생 클래스일 때 출력을 쓰시오.
>
> ```cpp
> try { throw MyErr("boom"); }
> catch (const runtime_error& e) { cout << "RE:" << e.what() << ' '; }
> catch (const exception& e)     { cout << "EX "; }
>
> try { throw MyErr("boom"); }
> catch (const exception& e)     { cout << "EX:" << e.what() << ' '; }
> catch (const runtime_error& e) { cout << "RE "; }
> ```

> [!ANSWER]
> **1.** 참. try 블록 바로 뒤에는 catch가 와야 하며, 사이에 문장을 넣으면 컴파일 오류입니다.
>
> **2.** `RE:boom EX:boom`. 위에서부터 **처음 맞는** catch 하나만 실행됩니다. 두 번째 try에서는 `exception&`이 먼저 받으므로 아래 `runtime_error&`는 실행될 수 없습니다.

---

## 5. 예외 클래스

지금까지는 `int`, `double` 같은 기본 값을 던졌습니다. 더 좋은 방법은 **예외 전용 클래스**를 만들어 문제에 대한 정보를 객체에 담는 것입니다.

```cpp
class Exception {
public:
    int code;
    Exception(int i) { code = i; }
};
```

| 받는 방법 | 코드 | 특징 |
| --- | --- | --- |
| **참조로** | `catch (Exception &e) { cout << e.code; }` | 예외 객체를 **복사하지 않음** (권장) |
| **값으로** | `catch (Exception e) { cout << e.code; }` | 예외 객체의 **복사본**을 만듦 |
| **new로 던지고 포인터로** | `throw new Exception(1);` … `catch (Exception *e) { cout << e->code; delete e; }` | 다 쓰면 **delete를 잊지 말 것** |

세 경우 모두 출력은 `1`입니다.

---

## 6. 스택 풀기와 주의점

[![inner outer main의 지역 객체가 쌓인 상태에서 inner가 throw 하면 in out main 순서로 소멸자가 불린 뒤 catch가 실행되는 그림](/materials/diagrams/cpp-08-stack-unwinding.svg)](/materials/diagrams/cpp-08-stack-unwinding.svg)

*그림 8-2 · 스택 풀기 — 누르면 원본 크기로 열린다.*

예외가 함수와 블록을 거슬러 올라가면서 그 함수·블록을 **끝내고**, 그 안 **지역 객체의 소멸자**를 부릅니다. 이것을 **스택 풀기(stack unwinding)**라고 합니다.

함수를 부르면 그 함수의 지역 변수가 **스택**에 쌓이고, 함수가 끝나면 치워집니다. 예외가 함수를 빠져나갈 때도 마찬가지로, 빠져나가는 함수마다 **지역 객체가 생성 역순으로 소멸**합니다. 이것을 **스택 풀기**라고 합니다. try 블록 안의 지역 객체도 **catch가 실행되기 전에** 소멸합니다.

```text
호출 스택 (아래가 먼저)          throw 1 발생 후 풀리는 순서
┌──────────────┐
│ inner: g(in) │  ← throw     ① in- (inner 빠져나감)
├──────────────┤
│ outer: g(out)│              ② out- (outer 빠져나감)
├──────────────┤
│ main try:    │              ③ main- (try 블록 빠져나감)
│   g(main)    │              ④ catch 실행
└──────────────┘
```

> [!QUIZ]
> `G`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다. 출력을 쓰시오.
>
> ```cpp
> void inner() { G g("in");  throw 1; cout << "X"; }
> void outer() { G g("out"); inner(); cout << "Y"; }
>
> int main() {
>     try {
>         G g("main");
>         outer();
>     }
>     catch (int e) { cout << "catch" << e << ' '; }
>     cout << "end";
> }
> ```

> [!ANSWER]
> ```text
> main+ out+ in+ in- out- main- catch1 end
> ```
>
> `X`, `Y`는 실행되지 않습니다. `in`, `out`, `main` 객체가 차례로 소멸한 **뒤에** catch가 실행됩니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class Exception {
> public:
>     int code;
>     Exception(int i) { code = i; }
> };
>
> void foo() {
>     try { throw Exception(1); }
>     catch (Exception e) { cout << e.code; }
> }
> int main() { foo(); }
> ```

> [!ANSWER]
> `1`. 클래스 객체도 던질 수 있습니다. `catch (Exception e)`는 값으로 받으므로 예외 객체가 복사되지만 `code`는 그대로 1입니다.

**주의점(슬라이드 22)** — 예외 처리는 호출 스택을 되감고, 오류를 호출한 메서드로 전파하고, 추가 메모리를 임시로 잡아야 해서 **시간과 자원이 더 듭니다.** 평범한 분기 대신 예외를 남발하지 마세요.

**Java와의 차이(슬라이드 23)**

| C++ | Java |
| --- | --- |
| 널 포인터, 0으로 나누기 같은 **시스템 오류를 catch로 잡을 수 없음** | NullPointerException, ArithmeticException으로 잡힘 |
| `finally` 절 없음 | `finally` 있음 |
| `throws`(예외 선언) 키워드 없음 | 메서드에 `throws` 선언 |
| 아무 값이나 던질 수 있음 | 예외는 `Exception` 클래스의 인스턴스여야 함, 예외 클래스 계층이 명세에 있음 |

`#include <stdexcept>`의 예외는 모두 `exception`을 상속하고, `what()`으로 메시지를 얻습니다. 직접 `throw 0;`처럼 숫자를 던지는 것보다 **무슨 문제인지 이름과 메시지로** 알려 줄 수 있습니다.

| 예외 | 대표 상황 |
| --- | --- |
| `invalid_argument` | 잘못된 인수 |
| `out_of_range` | `vector::at()`의 범위 초과 |
| `runtime_error` | 실행 중 일반 오류 |

```cpp
int safeDiv(int a, int b) {
    if (b == 0) throw invalid_argument("div by zero");
    return a / b;
}
for (int b : {2, 0}) {
    try { cout << safeDiv(10, b) << ' '; }
    catch (const invalid_argument& e) { cout << e.what() << ' '; }
}
// 출력: 5 div by zero
```

모두 `exception`의 파생 클래스이므로 `catch (const exception& e)` 하나로 전부 받을 수도 있습니다(2-2절 규칙 3).

---

## 핵심 정리

1. `try { … } catch (형식 매개변수) { … }` — catch는 try 바로 뒤, 문제가 생겼을 때만 실행, 끝나면 catch 다음 문장으로.
2. `throw 식;`의 **자료형**이 처리기를 고른다. catch는 위에서부터 **정확히 같은 자료형** 하나만(파생→기반은 허용, `"K"`는 `const char*`).
3. `catch (...)`는 모든 예외, 반드시 마지막.
4. 맞는 처리기가 없으면 호출한 쪽(또는 바깥 블록)으로 전파, 끝까지 없으면 기본 처리기가 종료.
5. `throw;`는 같은 예외를 다시 던진다. 같은 try의 다른 catch로 가지 않는다.
6. 예외 클래스는 참조로 받으면 복사 없음, 값으로 받으면 복사, new로 던지면 delete 필요.
7. 예외가 지나가는 함수의 지역 객체는 역순으로 소멸(스택 풀기). C++은 시스템 오류를 못 잡고 finally·throws가 없다.

---

## 학습 경로

[← 07 상속·다형성·연산자 오버로딩](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-07) · [09 템플릿과 STL →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-09)
