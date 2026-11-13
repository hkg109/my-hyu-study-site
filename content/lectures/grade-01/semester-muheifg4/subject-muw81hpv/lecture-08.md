---
title: "예외 처리"
description: "예외와 예외 처리기의 뜻, try·catch·throw, 여러 catch와 형식 매개변수, 처리되지 않은 예외의 전파, 중첩 try-catch와 재던지기, 예외 클래스를 값·참조·new로 던지고 받는 법, 스택 풀기, Java와의 차이를 Lecture 11 순서로 설명합니다. 클래스·상속·소멸자 같은 선수 개념을 강의 안에서 다시 짚고, 모든 예제를 실행 결과가 붙은 완전한 프로그램으로 보여 주며, 화재 경보·비상구 비유로 흐름을 잡습니다."
order: 8
published: true
duration: 80
---

# 예외 처리

**슬라이드:** Lecture 11 (12주차) · Exception Handling, Try-Catch-Blocks

**예외**(exception)는 하드웨어나 소프트웨어가 감지할 수 있는 특별한 사건(오류든 아니든)으로, 특별한 처리가 필요할 수 있는 것입니다. 그 처리를 **예외 처리**, 처리하는 코드 단위를 **예외 처리기**(exception handler)라고 합니다.

> [!NOTE]
> **비유로 이해하기 — 화재 경보와 비상구**
>
> 건물(프로그램) 안에서 불이 나면(문제 발생) 누군가 **화재 경보를 울립니다**(`throw`). 그 순간 하던 일을 멈추고, 미리 정해 둔 **대피 구역**(`try`)의 **비상구**(`catch`)로 나갑니다. 비상구 앞에는 "이런 경보면 이쪽으로"라는 **표지판**(catch의 자료형)이 붙어 있습니다. 이 층에 맞는 비상구가 없으면 **아래층으로 내려가며**(호출한 함수로 전파) 맞는 비상구를 찾고, 내려가면서 지나온 방의 **문을 하나씩 닫습니다**(스택 풀기 — 지역 객체의 소멸자 호출). 끝까지 비상구가 없으면 건물 전체가 **강제 폐쇄**됩니다(프로그램 종료).
>
> 비유가 어긋나는 점: 실제 대피와 달리, 경보가 해결된 뒤에도 **원래 있던 방(throw 지점)으로 돌아가지 않습니다.** 비상구를 나온 그 자리(catch 다음 문장)에서 계속 진행합니다.

> [!CONCEPT]
> **먼저 짚고 가기 — 이 강의에서 쓰는 선수 개념**
>
> - **함수 호출과 스택**: `main`이 `foo`를 부르고 `foo`가 `bar`를 부르면, 함수들이 접시처럼 차곡차곡 쌓입니다(호출 스택). 정상이라면 맨 위 함수부터 끝나며 한 장씩 치워집니다. 예외는 이 접시 더미를 **여러 장 한꺼번에** 거슬러 내려갈 수 있습니다.
> - **클래스·상속**: 예외로 "객체"를 던질 때 필요합니다. 5절 앞에서 완전한 예제로 다시 설명합니다.
> - **소멸자**: 스택 풀기를 이해하려면 필요합니다. 6절 앞에서 완전한 예제로 다시 설명합니다.
>
> 이 강의의 프로그램은 모두 `#include <iostream>`과 `using namespace std;`로 시작하는 완전한 프로그램이며, 바로 아래 **실행 결과**는 g++ 13(`-std=c++17`)에서 실제로 실행한 출력입니다.

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

예외가 없으면 "실패"를 **특별한 반환값**으로 알려야 합니다. 그런데 그 특별한 값이 정상 결과와 겹칠 수 있습니다.

```cpp
#include <iostream>
using namespace std;

// 예외 없이: 실패를 특별한 반환값 -1로 알리는 방식
int divide(int a, int b) {
    if (b == 0) return -1;    // "실패"라는 뜻으로 -1을 돌려줌
    return a / b;
}

int main() {
    cout << divide(10, 0) << endl;   // 실패라서 -1
    cout << divide(-5, 5) << endl;   // 정상 결과인데도 -1
    return 0;
}
```

실행 결과

```text
-1
-1
```

두 줄이 똑같이 `-1`이라 호출한 쪽은 **실패인지 정상인지 구별할 수 없습니다.** 예외는 반환값과 완전히 다른 통로로 "정상 결과를 줄 수 없음"을 알립니다.

---

## 2. try · throw · catch

[![main이 foo를 foo가 foo_1을 호출한 상태에서 foo_1의 throw 1이 try가 없어 빠져나가고 foo의 catch int가 받아 처리하는 흐름](/materials/diagrams/cpp-08-exception-flow.svg)](/materials/diagrams/cpp-08-exception-flow.svg)

*그림 8-1 · 예외는 맞는 catch까지 올라간다 — 누르면 원본 크기로 열린다.*

문법 모양(이것만으로는 실행되는 프로그램이 아닙니다. 아래 2-1, 2-2의 완전한 프로그램에서 실제로 씁니다):

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

나눗셈 함수에 0이 들어오면 무엇을 돌려줘야 할까요? 1절에서 보았듯 -1을 돌려주자니 실제 결과가 -1일 수도 있습니다. 함수가 "정상 결과를 줄 수 없다"는 사실을 **확실하게** 알리는 방법이 예외입니다.

```cpp
#include <iostream>
using namespace std;

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
    cout << "끝" << endl;
    return 0;
}
```

실행 결과

```text
5 0으로 나눔 끝
```

`divide(1, 0)` 안의 `throw 0;`이 울리는 순간 `return a / b;`도, main의 `cout << "안 나옴";`도 건너뛰고 곧장 `catch (int e)`로 갑니다. catch가 끝나면 try-catch **다음 문장**인 `cout << "끝"`으로 이어집니다.

### 2-2. 세 키워드

문법 모양:

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

이 문법 모양을 그대로 쓰는 완전한 프로그램입니다. 형식 매개변수의 세 가지 꼴(자료형+이름, 자료형만, `...`)이 모두 들어 있습니다.

```cpp
#include <iostream>
using namespace std;

void test(int kind) {
    try {
        cout << "[" << kind << "] ";
        if (kind == 1) throw 7;          // int
        if (kind == 2) throw 2.5;        // double
        if (kind == 3) throw 'x';        // char
        cout << "예외 없음 ";
    }
    catch (int i)    { cout << "int 받음: " << i << ' '; }   // ② 자료형 + 이름
    catch (double)   { cout << "double 받음 "; }              // ① 자료형만
    catch (...)      { cout << "그 밖의 예외 "; }             // ③ 줄임표: 모든 예외
    cout << "→ 다음 문장" << endl;
}

int main() {
    test(0);
    test(1);
    test(2);
    test(3);
    return 0;
}
```

실행 결과

```text
[0] 예외 없음 → 다음 문장
[1] int 받음: 7 → 다음 문장
[2] double 받음 → 다음 문장
[3] 그 밖의 예외 → 다음 문장
```

- `test(0)`: 예외가 없으니 catch는 **하나도 실행되지 않습니다.**
- `test(3)`: `'x'`는 `char`인데 `char` catch가 없으므로, 모든 것을 받는 `...`가 받습니다. `int`로 바뀌어 `catch (int i)`에 걸리지 **않습니다**.
- 어느 경우든 처리 후에는 try-catch 다음 문장(`→ 다음 문장`)으로 갑니다.

> [!NOTE]
> **비유로 이해하기 — 택배 보관함의 칸**
>
> catch들은 **택배 보관함의 칸**처럼 위에서부터 늘어서 있고, 칸마다 "int 전용", "double 전용", "아무거나(`...`)" 이름표가 붙어 있습니다. 던져진 예외(택배)는 위에서부터 **이름표가 정확히 같은 첫 칸**에 들어갑니다. 평소 대입에서는 `char`가 `int`로 슬쩍 바뀌지만, 보관함은 **규격이 정확히 같아야** 받아 줍니다. 단 하나의 예외는 상속 관계(5절): "전자제품" 칸은 "노트북" 택배도 받아 줍니다.

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

### 2-3. 처리되지 않은 예외의 전파

그림 8-1의 상황을 그대로 옮긴 완전한 프로그램입니다. `foo_1`에는 try가 없으므로 예외가 `foo_1`을 즉시 빠져나가 호출한 `foo`의 catch에서 처리됩니다.

```cpp
#include <iostream>
using namespace std;

void foo_1() {
    cout << "foo_1 시작 ";
    throw 1;                         // foo_1에는 try가 없음 → 즉시 빠져나감
    cout << "foo_1 끝 ";             // 실행 안 됨
}

void foo() {
    try {
        cout << "foo 시작 ";
        foo_1();
        cout << "foo_1 다음 ";       // 실행 안 됨
    }
    catch (int e) {
        cout << "foo의 catch(int): " << e << ' ';
    }
    cout << "foo 끝 ";
}

int main() {
    foo();
    cout << "main 끝" << endl;
    return 0;
}
```

실행 결과

```text
foo 시작 foo_1 시작 foo의 catch(int): 1 foo 끝 main 끝
```

`foo`에서 처리가 끝났으므로 `foo`는 **정상 종료**하고, main은 예외가 있었다는 사실조차 모른 채 `main 끝`을 출력합니다.

끝까지 받아 줄 catch가 없으면 어떻게 될까요?

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "시작" << endl;
    throw 1;                // 받아 줄 catch가 어디에도 없음
    cout << "끝" << endl;   // 실행 안 됨
    return 0;
}
```

실행 결과 (g++/Linux)

```text
시작
terminate called after throwing an instance of 'int'
```

기본 처리기 `terminate`가 불려 프로그램이 **비정상 종료**합니다(`끝`은 출력되지 않음). 두 번째 줄은 g++ 런타임이 오류 출력으로 내보내는 메시지입니다. 그 뒤 셸이 `Aborted`나 `Aborted (core dumped)` 같은 비정상 종료 표시를 덧붙이는데, 이 부분은 셸과 환경마다 모양이 다릅니다.

### 2-4. 처리 후 어디로 가는가

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
> 아래 완전한 프로그램에서 `fun`의 `throw` 줄의 값만 바꿔 실행한다. ① `(double)5.0`, ② `3`, ③ `'c'`, ④ `true`, ⑤ `"K"`일 때 각각 전체 출력을 쓰시오. (출력은 한 줄로 쓴다.)
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> void fun() {
>     try {
>         cout << "FA ";
>         throw (double)5.0;      // ← 이 값만 ①~⑤로 바꾼다
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
>     cout << "F" << endl;
>     return 0;
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
> 다섯 경우 모두 실제로 실행해 확인한 출력입니다. 모든 경우 BA는 출력되지 않습니다(throw 아래). 재던지기된 char는 main의 `catch (int)`로도 바뀌지 않습니다. double `5.0`은 `cout`이 `5`로 출력합니다.

> [!QUIZ]
> 다음 완전한 프로그램의 출력을 쓰고, `throw;` 이후 예외가 전달되는 경로를 설명하시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
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
>     return 0;
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
#include <iostream>
using namespace std;

void foo() {
    try {                                   // 바깥 try
        try {                               // 안쪽 try
            throw (double)1;
        }
        catch (int i) { cout << "inner catch. i = " << i << endl; }   // double이라 못 받음
    }
    catch (double d) { cout << "outer catch. d = " << d << endl; }     // 여기서 받음
}

int main() {
    foo();
    return 0;
}
```

실행 결과

```text
outer catch. d = 1
```

**재던지기** — 처리기 안에서 피연산자 없는 `throw;`를 쓰면 **같은 예외를 다시 일으켜** 다른 곳(바깥 블록이나 호출한 쪽)에서 처리하게 합니다.

> [!NOTE]
> **비유로 이해하기 — 재던지기는 "윗선에 보고 올리기"**
>
> 현장 직원(안쪽 catch)이 사고를 접수해 기록은 남기지만(`cout`), 자기 선에서 끝낼 수 없어 **같은 사고 보고서를 그대로** 윗선(바깥 try나 호출한 함수)에 올립니다(`throw;`). 보고서 내용(예외 객체와 자료형)은 바뀌지 않으며, 옆자리 동료(같은 try의 다른 catch)에게 넘기는 것이 아니라 **한 단계 위**로 올라간다는 점이 핵심입니다.

```cpp
#include <iostream>
using namespace std;

// (1) 안쪽 catch → throw; → 바깥 catch
void foo() {
    try {
        try { throw (double)1; }
        catch (double d) { cout << "inner catch. d = " << d << endl; throw; }
    }
    catch (double d) { cout << "outer catch. d = " << d << endl; }
}

// (2) 함수의 catch → throw; → 호출한 main의 catch
void foo2() {
    try { throw (double)1; }
    catch (double d) { cout << "catch 1 d = " << d << endl; throw; }   // main으로 다시 던짐
}

int main() {
    foo();
    try { foo2(); }
    catch (double d) { cout << "catch 2 d = " << d << endl; }
    return 0;
}
```

실행 결과

```text
inner catch. d = 1
outer catch. d = 1
catch 1 d = 1
catch 2 d = 1
```

(슬라이드 원본은 줄바꿈 없이 `inner catch. d = 1outer catch. d = 1`처럼 붙어서 출력됩니다. 여기서는 읽기 쉽게 `endl`을 붙였습니다.)

---

## 4. try와 catch의 문법 규칙

| 규칙 | 어기면 |
| --- | --- |
| try 블록 **바로 뒤**에 catch가 와야 함 (사이에 일반 문장 불가) | 컴파일 오류 |
| `catch (...)`는 **마지막** catch여야 함 | 컴파일 오류 |
| 기반 클래스 catch를 파생 클래스 catch보다 **앞에** 두면 파생 catch에 도달할 수 없음 | 컴파일은 됨(경고) |
| catch를 **값**으로 받으면 예외 객체가 **복사**됨 (복사 생성자 호출, 슬라이싱) | 보통 `const 참조`로 받음 |

**컴파일 오류 예시 1** — try와 catch 사이에 문장을 넣음:

```cpp
#include <iostream>
using namespace std;

int main() {
    try {
        throw 1;
    }
    cout << "사이에 끼운 문장";      // try와 catch 사이에 일반 문장
    catch (int e) {
        cout << e;
    }
    return 0;
}
```

g++의 핵심 오류 줄:

```text
error: expected 'catch' before 'cout'
```

**컴파일 오류 예시 2** — `catch (...)` 뒤에 다른 catch를 둠:

```cpp
#include <iostream>
using namespace std;

int main() {
    try {
        throw 1;
    }
    catch (...)   { cout << "모든 예외"; }
    catch (int e) { cout << "int " << e; }   // ... 뒤에 다른 catch
    return 0;
}
```

g++의 핵심 오류 줄:

```text
error: '...' handler must be the last handler for its try block [-fpermissive]
```

> [!NOTE]
> 기반·파생 예외를 함께 받을 때는 **구체적인 것(파생)을 위에, 넓은 것(기반)을 아래에** 둡니다. 위에서부터 처음 맞는 하나만 실행되므로, 넓은 그물을 먼저 치면 아래의 촘촘한 그물에는 아무것도 걸리지 않습니다. `catch (...)`가 가장 넓은 그물이라 맨 마지막인 것도 같은 이유입니다.

기반·파생 클래스 예외는 아래 5절의 "먼저 짚고 가기"에서 상속을 다시 설명한 뒤 완전한 프로그램으로 확인합니다(5-3절 퀴즈).

---

## 5. 예외 클래스

지금까지는 `int`, `double` 같은 기본 값을 던졌습니다. 더 좋은 방법은 **예외 전용 클래스**를 만들어 문제에 대한 정보를 객체에 담는 것입니다. 그 전에 필요한 클래스 지식을 짧게 다시 봅니다.

> [!CONCEPT]
> **먼저 짚고 가기 — 클래스, 생성자, 상속, virtual**
>
> - **클래스**는 데이터(멤버 변수)와 동작(멤버 함수)을 묶은 새 자료형이고, **객체**는 그 자료형의 실제 값입니다. 붕어빵 틀(클래스)과 붕어빵(객체)의 관계입니다.
> - **생성자**는 객체가 만들어질 때 자동으로 실행되는 함수로, 클래스와 이름이 같고 반환형이 없습니다. `Problem(string m) : msg(m) {}`의 `: msg(m)`은 멤버를 초기화하는 **초기화 목록**입니다.
> - **상속**(`class FileProblem : public Problem`)은 기반 클래스의 멤버를 물려받아 확장하는 것입니다. 파생 클래스 생성자는 `: Problem(m)`처럼 기반 생성자를 먼저 부릅니다. `protected` 멤버는 파생 클래스 안에서 쓸 수 있습니다.
> - **파생 객체는 기반 클래스 참조로 받을 수 있습니다.** `FileProblem`은 일종의 `Problem`이기 때문입니다. 예외에서 `catch (const exception& e)` 하나로 여러 예외를 받는 근거가 이것입니다.
> - **virtual 함수**는 기반 참조로 불러도 **실제 객체의 함수**가 실행됩니다(동적 바인딩). 리모컨 버튼은 같은데 TV마다 다르게 동작하는 것과 같습니다. 표준 예외의 `what()`이 이렇게 동작합니다.

선수 개념을 한 프로그램에 모았습니다.

```cpp
#include <iostream>
#include <string>
using namespace std;

// 기반 클래스: 모든 "문제 보고서"가 공통으로 가진 것
class Problem {
protected:
    string msg;                                   // 파생 클래스에서도 쓸 수 있음
public:
    Problem(string m) : msg(m) {}                 // 생성자: 객체가 만들어질 때 실행
    virtual string what() const { return "문제: " + msg; }
    virtual ~Problem() {}
};

// 파생 클래스: Problem을 물려받고 what()을 다시 정의(오버라이딩)
class FileProblem : public Problem {
public:
    FileProblem(string m) : Problem(m) {}         // 기반 생성자에 메시지 전달
    string what() const override { return "파일 문제: " + msg; }
};

void report(const Problem& p) {                   // 기반 클래스 참조로 받음
    cout << p.what() << endl;                     // virtual → 실제 객체의 what()
}

int main() {
    Problem a("알 수 없음");
    FileProblem b("data.txt 없음");
    report(a);
    report(b);                                    // 파생 객체도 기반 참조로 받을 수 있음
    return 0;
}
```

실행 결과

```text
문제: 알 수 없음
파일 문제: data.txt 없음
```

`report`는 `Problem&` 하나로 받지만 `b`에 대해서는 `FileProblem`의 `what()`이 실행되었습니다. 예외 처리의 "기반 클래스 catch로 파생 예외 받기"가 정확히 이 원리입니다.

> [!NOTE]
> **비유로 이해하기 — 예외 클래스는 "사고 보고서 양식"**
>
> `throw 0;`은 경보 버튼만 누르는 것이고, 예외 객체를 던지는 것은 **사고 보고서**(무슨 일이, 어떤 코드로)를 함께 보내는 것입니다. 보고서 양식을 상속으로 세분화하면(일반 사고 → 파일 사고) "모든 사고" 창구에서도 받을 수 있고, "파일 사고" 전용 창구에서 더 자세히 처리할 수도 있습니다.

### 5-1. 예외 클래스를 던지고 받는 세 가지 방법

슬라이드의 `Exception` 클래스는 정수 `code` 하나를 담습니다. 받는 방법에 따라 **복사가 일어나는지** 보이도록, 복사 생성자(객체가 복사될 때 불리는 생성자)에 `(복사)`를 출력하게 했습니다.

```cpp
#include <iostream>
using namespace std;

class Exception {
public:
    int code;
    Exception(int i) { code = i; }
    Exception(const Exception& other) {          // 복사 생성자: 복사될 때마다 표시
        code = other.code;
        cout << "(복사) ";
    }
};

int main() {
    // ① 참조로 받기
    try { throw Exception(1); }
    catch (Exception& e) { cout << "참조: " << e.code << endl; }

    // ② 값으로 받기
    try { throw Exception(1); }
    catch (Exception e) { cout << "값: " << e.code << endl; }

    // ③ new로 던지고 포인터로 받기
    try { throw new Exception(1); }
    catch (Exception* e) { cout << "포인터: " << e->code << endl; delete e; }

    return 0;
}
```

실행 결과

```text
참조: 1
(복사) 값: 1
포인터: 1
```

| 받는 방법 | 코드 | 특징 |
| --- | --- | --- |
| **참조로** | `catch (Exception &e) { cout << e.code; }` | 예외 객체를 **복사하지 않음** (권장) |
| **값으로** | `catch (Exception e) { cout << e.code; }` | 예외 객체의 **복사본**을 만듦 (위 출력의 `(복사)`) |
| **new로 던지고 포인터로** | `throw new Exception(1);` … `catch (Exception *e) { cout << e->code; delete e; }` | 다 쓰면 **delete를 잊지 말 것** |

세 경우 모두 `code` 값은 `1`입니다. 차이는 **복사 여부와 메모리 정리 책임**입니다.

> [!NOTE]
> **비유로 이해하기 — 보고서 원본, 사본, 창고 보관증**
>
> - 참조로 받기 = **원본 보고서를 직접 읽음**. 종이를 더 쓰지 않습니다.
> - 값으로 받기 = 받자마자 **복사기로 사본을 떠서** 사본을 읽음. 복사 비용이 들고, 파생 보고서를 기반 양식 크기로 복사하면 뒷장이 잘려 나갑니다(슬라이싱).
> - new로 던지기 = 보고서를 **창고(힙)에 맡기고 보관증(포인터)만** 건넴. 받은 사람이 다 읽고 **창고를 반납**(delete)하지 않으면 창고가 계속 묶입니다(메모리 누수).
>
> 비유가 어긋나는 점: `throw Exception(1);`로 던진 객체 자체는 컴파일러가 따로 마련한 안전한 곳에 보관되며, 우리가 delete할 필요가 없습니다. delete가 필요한 것은 우리가 `new`로 만든 ③뿐입니다.

### 5-2. 확인 문제

> [!QUIZ]
> 다음 완전한 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
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
>
> int main() {
>     foo();
>     cout << endl;
>     return 0;
> }
> ```

> [!ANSWER]
> `1`. 클래스 객체도 던질 수 있습니다. `catch (Exception e)`는 값으로 받으므로 예외 객체가 복사되지만(이 클래스는 복사 생성자를 직접 쓰지 않았으므로 컴파일러가 만든 복사 생성자가 `code`를 그대로 복사) `code`는 그대로 1입니다.

### 5-3. 기반·파생 예외와 catch 순서

표준 라이브러리 `<stdexcept>`의 `runtime_error`는 `exception`을 상속한 클래스이고, 생성자에 메시지를 받아 `what()`으로 돌려줍니다. 이를 다시 상속해 나만의 예외를 만들 수 있습니다.

> [!QUIZ]
> 1. "try 블록과 바로 뒤의 catch 블록 사이에는 일반 실행문을 넣을 수 없다." 참인가 거짓인가?
> 2. `MyErr`가 `runtime_error`의 파생 클래스일 때 다음 완전한 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> #include <stdexcept>
> #include <string>
> using namespace std;
>
> class MyErr : public runtime_error {              // runtime_error를 상속
> public:
>     MyErr(const string& m) : runtime_error(m) {}  // 메시지를 기반 생성자에 전달
> };
>
> int main() {
>     try { throw MyErr("boom"); }
>     catch (const runtime_error& e) { cout << "RE:" << e.what() << ' '; }
>     catch (const exception& e)     { cout << "EX "; }
>
>     try { throw MyErr("boom"); }
>     catch (const exception& e)     { cout << "EX:" << e.what() << ' '; }
>     catch (const runtime_error& e) { cout << "RE "; }
>
>     cout << endl;
>     return 0;
> }
> ```

> [!ANSWER]
> **1.** 참. try 블록 바로 뒤에는 catch가 와야 하며, 사이에 문장을 넣으면 컴파일 오류입니다(4절 컴파일 오류 예시 1).
>
> **2.** `RE:boom EX:boom`. 위에서부터 **처음 맞는** catch 하나만 실행됩니다. 두 번째 try에서는 `exception&`이 먼저 받으므로 아래 `runtime_error&`는 실행될 수 없습니다. 실제로 g++는 이 줄에 `warning: exception of type 'std::runtime_error' will be caught by earlier handler [-Wexceptions]` 경고를 냅니다(오류가 아니라 경고라 실행은 됨). `what()`이 virtual이라 `exception&`로 받아도 실제 메시지 `boom`이 나옵니다.

---

## 6. 스택 풀기와 주의점

스택 풀기를 이해하려면 소멸자를 알아야 합니다.

> [!CONCEPT]
> **먼저 짚고 가기 — 소멸자와 지역 객체의 수명**
>
> - **소멸자**는 객체가 사라질 때 자동으로 불리는 함수로, `~클래스이름()` 모양이고 매개변수와 반환형이 없습니다. 파일 닫기, 메모리 반납 같은 **뒷정리**를 맡습니다.
> - **지역 객체**는 자신이 선언된 블록 `{ }`(함수 본문 포함)을 벗어날 때 소멸하며, 한 블록 안에서는 **생성의 역순**으로 소멸합니다(먼저 만든 것이 나중에 사라짐).
> - 비유하면 생성자는 **개업 준비**, 소멸자는 **폐업 정리**입니다. 가게(블록)가 문을 닫을 때 마지막에 들인 물건부터 차례로 뺍니다.

```cpp
#include <iostream>
#include <string>
using namespace std;

class G {
    string name;
public:
    G(string n) : name(n) { cout << name << "+ "; }   // 생성자
    ~G() { cout << name << "- "; }                   // 소멸자: 객체가 사라질 때 자동 실행
};

int main() {
    G a("a");
    {
        G b("b");
        G c("c");
        cout << "| 블록 끝 | ";
    }                       // 여기서 c, b 순서로 소멸 (생성의 역순)
    cout << "| main 끝 | ";
    return 0;
}                           // 여기서 a 소멸
```

실행 결과

```text
a+ b+ c+ | 블록 끝 | c- b- | main 끝 | a-
```

이 `G` 클래스(생성 시 `이름+`, 소멸 시 `이름-` 출력)를 이 절의 나머지 프로그램에서 그대로 씁니다.

### 6-1. 스택 풀기

[![inner outer main의 지역 객체가 쌓인 상태에서 inner가 throw 하면 in out main 순서로 소멸자가 불린 뒤 catch가 실행되는 그림](/materials/diagrams/cpp-08-stack-unwinding.svg)](/materials/diagrams/cpp-08-stack-unwinding.svg)

*그림 8-2 · 스택 풀기 — 누르면 원본 크기로 열린다.*

예외가 함수와 블록을 거슬러 올라가면서 그 함수·블록을 **끝내고**, 그 안 **지역 객체의 소멸자**를 부릅니다. 이것을 **스택 풀기**(stack unwinding)라고 합니다.

함수를 부르면 그 함수의 지역 변수가 **스택**에 쌓이고, 함수가 끝나면 치워집니다. 예외가 함수를 빠져나갈 때도 마찬가지로, 빠져나가는 함수마다 **지역 객체가 생성 역순으로 소멸**합니다. try 블록 안의 지역 객체도 **catch가 실행되기 전에** 소멸합니다.

> [!NOTE]
> **비유로 이해하기 — 계단을 내려오며 문 닫기**
>
> 3층(`inner`)에서 화재 경보가 울렸는데 비상구는 1층(`main`의 catch)에만 있습니다. 대피하는 사람은 3층 방 문을 닫고, 2층(`outer`) 방 문을 닫고, 1층 방 문까지 닫은 **뒤에야** 비상구를 나섭니다. 각 층의 "문 닫기"가 그 함수 지역 객체의 소멸자입니다. 덕분에 예외가 나도 파일·메모리 같은 자원이 **정리되지 않은 채 버려지지 않습니다.**
>
> 비유가 어긋나는 점: 소멸자가 불리는 것은 **스택에 있는 지역 객체**뿐입니다. `new`로 힙에 만든 객체는 포인터 변수만 사라지고 객체는 남으므로(누수), 예외가 지나가도 자동으로 delete되지 않습니다.

먼저 try 블록 하나 안에서:

```cpp
#include <iostream>
#include <string>
using namespace std;

class G {
    string name;
public:
    G(string n) : name(n) { cout << name << "+ "; }
    ~G() { cout << name << "- "; }
};

int main() {
    try {
        G a("a");
        G b("b");
        throw 1;
    }
    catch (int e) { cout << "catch" << e << ' '; }
    cout << endl;
    return 0;
}
```

실행 결과

```text
a+ b+ b- a- catch1
```

`b`, `a`가 역순으로 소멸한 **뒤에** catch가 실행됩니다. catch 안에서는 이미 `a`, `b`를 쓸 수 없습니다.

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
> `G`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다. 다음 완전한 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> #include <string>
> using namespace std;
>
> class G {
>     string name;
> public:
>     G(string n) : name(n) { cout << name << "+ "; }
>     ~G() { cout << name << "- "; }
> };
>
> void inner() { G g("in");  throw 1; cout << "X"; }
> void outer() { G g("out"); inner(); cout << "Y"; }
>
> int main() {
>     try {
>         G g("main");
>         outer();
>     }
>     catch (int e) { cout << "catch" << e << ' '; }
>     cout << "end" << endl;
>     return 0;
> }
> ```

> [!ANSWER]
> ```text
> main+ out+ in+ in- out- main- catch1 end
> ```
>
> `X`, `Y`는 실행되지 않습니다. `in`, `out`, `main` 객체가 차례로 소멸한 **뒤에** catch가 실행됩니다.

> [!QUIZ]
> 다음 완전한 프로그램의 출력으로 옳은 것은?
>
> ```cpp
> #include <iostream>
> #include <string>
> using namespace std;
>
> class G {
>     string name;
> public:
>     G(string n) : name(n) { cout << name << "+ "; }
>     ~G() { cout << name << "- "; }
> };
>
> void f() {
>     G g("f");
>     throw 'A';
> }
>
> int main() {
>     try { f(); }
>     catch (int)    { cout << "int "; }
>     catch (char c) { cout << "char " << c << ' '; }
>     catch (...)    { cout << "all "; }
>     cout << "end" << endl;
>     return 0;
> }
> ```
>
> **A.** `f+ int f- end`
>
> **B.** `f+ f- char A end`
>
> **C.** `f+ char A f- end`
>
> **D.** `f+ f- int all end`

> [!ANSWER]
> B. `f+ f- char A end`
>
> **해설**: 예외가 `f`를 빠져나가며 지역 객체 `g`가 먼저 소멸하고(`f-`), 그 **뒤에** catch가 실행되므로 C는 틀립니다. `'A'`는 `char`라서 `catch (int)`로 바뀌어 받히지 않으므로 A, D도 틀립니다. 처음 맞는 catch 하나만 실행되므로 `all`은 나오지 않습니다.

### 6-2. 주의점과 Java와의 차이

**주의점(슬라이드 22)** — 예외 처리는 호출 스택을 되감고, 오류를 호출한 메서드로 전파하고, 추가 메모리를 임시로 잡아야 해서 **시간과 자원이 더 듭니다.** 평범한 분기 대신 예외를 남발하지 마세요. 화재 경보를 "점심시간 알림"으로 쓰지 않는 것과 같습니다.

**Java와의 차이(슬라이드 23)**

| C++ | Java |
| --- | --- |
| 널 포인터, 0으로 나누기 같은 **시스템 오류를 catch로 잡을 수 없음** | NullPointerException, ArithmeticException으로 잡힘 |
| `finally` 절 없음 | `finally` 있음 |
| `throws`(예외 선언) 키워드 없음 | 메서드에 `throws` 선언 |
| 아무 값이나 던질 수 있음 | 예외는 `Exception` 클래스의 인스턴스여야 함, 예외 클래스 계층이 명세에 있음 |

> [!TRAP]
> C++에서 정수를 0으로 나누는 `10 / 0`은 예외를 **던지지 않습니다.** 정의되지 않은 동작(undefined behaviour)이라 프로그램이 죽을 수도, 이상한 값이 나올 수도 있습니다. 그래서 2-1절의 `divide`처럼 **직접 검사해서 `throw`해야** catch로 잡을 수 있습니다. (정의되지 않은 동작이라 여기서는 "실행 결과"를 싣지 않습니다.)

### 6-3. 표준 예외 클래스

`#include <stdexcept>`의 예외는 모두 `exception`을 상속하고, `what()`으로 메시지를 얻습니다. 직접 `throw 0;`처럼 숫자를 던지는 것보다 **무슨 문제인지 이름과 메시지로** 알려 줄 수 있습니다.

| 예외 | 대표 상황 |
| --- | --- |
| `invalid_argument` | 잘못된 인수 |
| `out_of_range` | `vector::at()`의 범위 초과 |
| `runtime_error` | 실행 중 일반 오류 |

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>
using namespace std;

int safeDiv(int a, int b) {
    if (b == 0) throw invalid_argument("div by zero");
    return a / b;
}

int main() {
    for (int b : {2, 0}) {
        try { cout << safeDiv(10, b) << ' '; }
        catch (const invalid_argument& e) { cout << e.what() << ' '; }
    }
    cout << endl;

    vector<int> v = {1, 2, 3};
    try {
        cout << v.at(1) << ' ';
        cout << v.at(10) << ' ';                  // 범위 초과 → out_of_range
    }
    catch (const exception& e) {                  // 기반 클래스 하나로 받음
        cout << "exception으로 받음" << endl;
    }
    return 0;
}
```

실행 결과

```text
5 div by zero 
2 exception으로 받음
```

`v.at(10)`이 던진 `out_of_range`는 `exception`의 파생 클래스이므로 `catch (const exception& e)` 하나로 받혔습니다(2-2절 규칙 3). 이처럼 표준 예외는 모두 `catch (const exception& e)` 하나로 전부 받을 수도 있습니다.

---

## 핵심 정리

1. `try { … } catch (형식 매개변수) { … }` — catch는 try 바로 뒤, 문제가 생겼을 때만 실행, 끝나면 catch 다음 문장으로.
2. `throw 식;`의 **자료형**이 처리기를 고른다. catch는 위에서부터 **정확히 같은 자료형** 하나만(파생→기반은 허용, `"K"`는 `const char*`).
3. `catch (...)`는 모든 예외, 반드시 마지막.
4. 맞는 처리기가 없으면 호출한 쪽(또는 바깥 블록)으로 전파, 끝까지 없으면 기본 처리기가 종료.
5. `throw;`는 같은 예외를 다시 던진다. 같은 try의 다른 catch로 가지 않는다.
6. 예외 클래스는 참조로 받으면 복사 없음, 값으로 받으면 복사, new로 던지면 delete 필요.
7. 예외가 지나가는 함수의 지역 객체는 역순으로 소멸(스택 풀기). C++은 시스템 오류를 못 잡고 finally·throws가 없다.

| 개념 | 비유 |
| --- | --- |
| `throw` | 화재 경보 울리기 |
| `try` / `catch` | 대피 구역 / 표지판 붙은 비상구 |
| catch 자료형 일치 | 택배 보관함 칸의 이름표 |
| 전파 | 아래층으로 내려가며 비상구 찾기 |
| `throw;` | 같은 보고서를 윗선에 올리기 |
| 예외 클래스 | 사고 보고서 양식 |
| 스택 풀기 | 계단을 내려오며 문 닫기 |

---

## 학습 경로

[← 07 상속·다형성·연산자 오버로딩](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-07) · [09 템플릿과 STL →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-09)
