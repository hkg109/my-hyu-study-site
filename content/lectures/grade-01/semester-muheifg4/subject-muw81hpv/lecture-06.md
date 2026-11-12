---
title: "클래스 고급 기능과 예외 처리"
description: "모든 객체가 함께 쓰는 static 멤버, 나 자신을 가리키는 this, friend, 파일 분리, 연산자 오버로딩, 그리고 오류를 던지고 받는 예외 처리(catch 선택 규칙·재던지기·스택 풀기)를 흐름 그림과 출력 추적으로 처음부터 설명합니다."
order: 6
published: true
---

# 클래스 고급 기능과 예외 처리

이 강의는 두 부분입니다. 앞부분(1–5절)은 5단원 클래스에 **편의 기능**을 더하고, 뒷부분(6–9절)은 프로그램 실행 중 문제가 생겼을 때 **정상 흐름에서 빠져나와 처리하는 방법(예외)**을 다룹니다. 기말 족보는 뒷부분 비중이 큽니다.

## 학습 흐름

```text
static 멤버 (클래스가 공유) → this 포인터와 *this 반환
        ↓
friend → 파일 분리 → 연산자 오버로딩 (멤버 / 비멤버, 전위 / 후위 ++)
        ↓
try / throw / catch → catch 선택 규칙 → 재던지기 throw;
        ↓
예외 전파와 스택 풀기 → 표준 예외
```

> [!EXAM]
> 기말 족보에서 예외 문제가 **6문항**입니다. 같은 코드에 `throw`하는 값의 자료형만 바꿔(`double`, `int`, `char`, `bool`, `"K"`) 출력을 묻습니다. **catch는 자료형이 정확히 맞아야 받는다**는 규칙 하나로 모두 풀립니다.

### 이 강의에서 쓰는 말

| 말 | 뜻 | 비유 |
| --- | --- | --- |
| static 멤버 | 객체마다가 아니라 **클래스에 하나** 있는 멤버 | 반 전체가 함께 쓰는 칠판 |
| `this` | 지금 멤버 함수를 부른 **객체의 주소** | "나" |
| friend | private에 접근하도록 허락받은 외부 함수·클래스 | 집 열쇠를 받은 친구 |
| 연산자 오버로딩 | `+`, `<<` 같은 연산자를 내 클래스에 맞게 정의 | 내 자료형에도 `+`를 쓰게 함 |
| 예외(exception) | 정상 흐름으로 처리할 수 없는 문제 상황 | 비상벨 |
| `throw` / `catch` | 예외를 던짐 / 받아서 처리함 | 비상벨을 울림 / 대응팀이 받음 |
| 스택 풀기 | 예외가 함수를 빠져나가며 지역 객체를 정리하는 것 | 비상구로 나가며 불을 끄고 나감 |

---

## 1. static 멤버

### 1-1. 객체마다 vs 클래스에 하나

보통 멤버 변수는 **객체마다 따로** 있습니다. 그런데 "지금까지 만들어진 플레이어 수"처럼 **모든 객체가 함께 봐야 하는 값**은 객체마다 따로 있으면 안 됩니다. 이럴 때 `static`을 붙이면 그 멤버는 **클래스 전체에 하나**만 생깁니다.

```text
일반 멤버 hp                        static 멤버 count
a: [hp:100]  b: [hp:80]            Player 클래스: [count: 2]  ← a, b가 함께 씀
```

| | 일반 멤버 | static 멤버 |
| --- | --- | --- |
| 데이터 | 객체마다 하나씩 | **클래스 전체에 하나** (모든 객체가 공유) |
| 정의 | 클래스 안 | 클래스 안에 선언 + **클래스 밖에 정의** `int Player::count = 0;` |
| 함수 호출 | `obj.f()` | `Player::f()` (객체 없이도 가능) |
| `this` | 있음 | **없음** → 일반 멤버를 직접 쓸 수 없음 |

```cpp
class Player {
    static int count;
public:
    Player()  { count++; }
    ~Player() { count--; }
    static int getCount() { return count; }
};
int Player::count = 0;          // 빠뜨리면 링크 오류
```

생성자가 `count`를 1 늘리고 소멸자가 1 줄이므로, `count`는 **지금 살아 있는 Player 객체 수**가 됩니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> cout << Player::getCount() << ' ';
> Player a;
> {
>     Player b, c;
>     cout << Player::getCount() << ' ';
> }
> cout << Player::getCount() << ' ';
> Player* p = new Player;
> cout << Player::getCount() << ' ';
> delete p;
> cout << Player::getCount();
> ```

> [!ANSWER]
> `0 3 1 2 1` — 블록이 끝나면 `b`, `c`의 소멸자가 `count`를 줄입니다. `new`로 만든 객체도 생성자·소멸자에서 똑같이 세어집니다.

> [!TRAP]
> static 멤버 함수 안에서 일반 멤버 `v`를 쓰면 **컴파일 오류**입니다. 어느 객체의 `v`인지 알 수 없기 때문입니다(this가 없음). `Player::getCount()`처럼 객체 없이 부를 수 있다는 것 자체가 "특정 객체와 상관없다"는 뜻입니다.

---

## 2. this 포인터

### 2-1. "나"를 가리키는 포인터

`a.add(3)`과 `b.add(3)`은 같은 함수 코드를 실행합니다. 그런데 함수 안의 `v`가 어떻게 한 번은 `a.v`, 한 번은 `b.v`가 될까요? 컴파일러가 몰래 **호출한 객체의 주소**를 함수에 넘겨주기 때문입니다. 그 주소가 `this`입니다.

- 일반 멤버 함수 안의 `this`는 **함수를 호출한 객체의 주소**입니다(`a.add()`면 `&a`).
- `*this`는 그 객체 자체입니다.
- 함수 안의 `v`는 사실 `this->v`를 줄여 쓴 것입니다.

```cpp
class Counter {
    int v;
public:
    Counter(int v) { this->v = v; }                    // 매개변수와 멤버 이름 구분
    Counter& add(int a)    { v += a; return *this; }   // 참조 반환 → 같은 객체로 연결
    Counter addCopy(int a) { v += a; return *this; }   // 값 반환 → 복사본 반환
    int get() const { return v; }
};
```

생성자의 `this->v = v;`에서 왼쪽 `this->v`는 **멤버**, 오른쪽 `v`는 **매개변수**입니다. 이름이 같을 때 둘을 구분하는 용도입니다.

### 2-2. 연결 호출: 참조 반환 vs 값 반환

`c.add(3).add(5)`는 `c.add(3)`이 돌려준 것에 다시 `.add(5)`를 부릅니다. 그래서 **무엇을 돌려주느냐**가 중요합니다.

```text
add (참조 반환):      c.add(3)  → c 자신 → .add(5) → 다시 c에 더함
addCopy (값 반환):    c.addCopy(1) → c의 복사본(임시) → .addCopy(1) → 복사본에 더함 (c는 모름)
```

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> Counter c(0);
> c.add(3).add(5);
> cout << c.get() << ' ';
> c.addCopy(1).addCopy(1);
> cout << c.get();
> ```

> [!ANSWER]
> `8 9` — `add`는 `c` 자신을 참조로 반환하므로 두 번 모두 `c`에 더합니다. `addCopy`는 첫 호출에서 `c`를 9로 만들고 **복사본**을 반환하므로, 두 번째 `addCopy(1)`은 복사본에 더해져 `c`에는 반영되지 않습니다.

---

## 3. friend

`friend`로 지정한 함수(또는 클래스)는 그 클래스의 private·protected 멤버에 접근할 수 있습니다. 클래스가 "이 함수는 믿으니 내 private을 봐도 된다"고 **스스로** 허락하는 것입니다.

```cpp
class Wallet {
    int money = 500;
    friend void peek(const Wallet& w);   // 이 함수에게 허락
};
void peek(const Wallet& w) { cout << w.money; }   // OK: friend라서 private 접근

Wallet w;
peek(w);      // 500  — w.peek()이 아니라 peek(w)
```

- friend 함수는 **멤버 함수가 아닙니다**. `this`가 없고, `obj.f()`가 아니라 `f(obj)`로 호출합니다.
- friend 관계는 **상속되지 않고**, **한쪽 방향**입니다(A가 B를 friend로 지정해도 B가 A를 지정한 것은 아님).

friend가 가장 많이 쓰이는 곳은 5절의 `cout << p` 연산자 오버로딩입니다.

---

## 4. 클래스 파일 분리

프로그램이 커지면 클래스를 **선언(.h)**과 **구현(.cpp)**으로 나눕니다. 다른 파일은 `.h`만 `#include`해서 클래스를 씁니다. 책의 목차(.h)와 본문(.cpp)으로 생각하면 됩니다.

```cpp
// Counter.h — 선언
#ifndef COUNTER_H          // 헤더 가드: 여러 번 포함되는 것을 막음
#define COUNTER_H
class Counter {
    int value;
public:
    Counter(int initial);
    void increase();
    int getValue() const;
};
#endif

// Counter.cpp — 구현 (클래스이름:: 으로 소속 표시)
#include "Counter.h"
Counter::Counter(int initial) : value(initial) {}
void Counter::increase() { value++; }
int Counter::getValue() const { return value; }
```

- 클래스 밖에서 멤버 함수를 정의할 때는 `Counter::`를 붙여 **어느 클래스의 함수인지** 밝힙니다.
- 헤더 가드(`#ifndef … #define … #endif`)가 없으면 같은 헤더가 두 번 포함될 때 "클래스 재정의" 오류가 납니다.
- 내가 만든 헤더는 `"Counter.h"`(큰따옴표), 표준 헤더는 `<iostream>`(꺾쇠)로 포함합니다.

---

## 5. 연산자 오버로딩

### 5-1. 왜 필요한가

`int`끼리는 `a + b`가 되지만, 내가 만든 `Point`끼리는 `p + q`를 쓰면 컴파일러가 무엇을 해야 할지 모릅니다. 연산자 오버로딩은 `operator+`라는 **이름의 함수**를 정의해서 `p + q`를 쓸 수 있게 합니다. `p + q`는 사실 `p.operator+(q)` 호출입니다.

```cpp
class Point {
    int x, y;
public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    Point operator+(const Point& o) const { return Point(x + o.x, y + o.y); }  // p + q
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }

    friend Point operator*(int k, const Point& p);                  // 2 * p
    friend ostream& operator<<(ostream& out, const Point& p);       // cout << p
};
Point operator*(int k, const Point& p) { return Point(k * p.x, k * p.y); }
ostream& operator<<(ostream& out, const Point& p) {
    out << '(' << p.x << ", " << p.y << ')';
    return out;                                     // 참조 반환 → cout << a << b 연결
}
```

### 5-2. 멤버로 만들까, 밖에 만들까

규칙은 하나입니다. **멤버 연산자는 "왼쪽 피연산자"가 내 클래스일 때만** 만들 수 있습니다. `p + q`는 `p.operator+(q)`이므로 왼쪽 `p`가 Point여야 합니다.

| 연산 | 형태 | 이유 |
| --- | --- | --- |
| `p + q` | 멤버 `p.operator+(q)` | 왼쪽이 Point |
| `2 * p` | **비멤버** `operator*(2, p)` | 왼쪽이 int라서 멤버로 만들 수 없음 |
| `cout << p` | **비멤버** (보통 friend) | 왼쪽이 `ostream` |

`cout << p`의 왼쪽 `cout`은 `ostream` 클래스이고, 그 클래스는 우리가 고칠 수 없습니다. 그래서 바깥 함수 `operator<<(cout, p)`로 만들고, private `x`, `y`를 읽어야 하니 friend로 지정합니다.

`operator<<`가 `out`을 **참조로 돌려주는** 이유: `cout << a << b`는 `(cout << a) << b`입니다. 앞 결과가 다시 `cout`이어야 `<< b`를 이어서 쓸 수 있습니다(2-2절의 연결 호출과 같은 원리).

### 5-3. 전위 ++와 후위 ++

`++n`과 `n++`는 둘 다 `operator++`인데, 이름이 같으니 구분이 필요합니다. 그래서 C++는 **후위 버전에 쓰지 않는 `int` 매개변수**를 하나 붙이기로 약속했습니다.

```cpp
Num& operator++()    { ++v; return *this; }                     // 전위 ++n: 증가 후 자기 자신
Num  operator++(int) { Num old = *this; ++v; return old; }      // 후위 n++: int는 구분용 더미
```

```text
n = 5에서
전위 ++n:  v를 6으로 → n 자신을 돌려줌        → 식의 값 6
후위 n++:  old에 5를 저장 → v를 6으로 → old 반환 → 식의 값 5
```

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> Num n(5);
> Num a = n++;
> Num b = ++n;
> cout << a.get() << ' ' << b.get() << ' ' << n.get() << '\n';
>
> Point p(1, 2), q(3, 4);
> cout << p + q << ' ' << (p + q == Point(4, 6)) << ' ' << 2 * p;
> ```

> [!ANSWER]
> ```text
> 5 7 7
> (4, 6) 1 (2, 4)
> ```
>
> 후위는 증가 **전** 복사본(5)을, 전위는 증가 **후** 값(7)을 돌려줍니다.

> [!TRAP]
> 연산자 오버로딩으로 **우선순위, 결합 방향, 피연산자 개수는 바꿀 수 없습니다**. 새 연산자를 만들 수도 없고, `::`, `.`, `?:`, `sizeof`는 오버로딩할 수 없습니다.

---

## 6. 예외 처리의 기본

### 6-1. 왜 필요한가

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

### 6-2. 세 키워드

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

### 6-3. 처리 후 어디로 가는가

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

## 7. try와 catch의 문법 규칙

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

## 8. 예외 전파와 스택 풀기

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

---

## 9. 표준 예외

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

모두 `exception`의 파생 클래스이므로 `catch (const exception& e)` 하나로 전부 받을 수도 있습니다(6-2절 규칙 3).

---

## 핵심 정리

1. static 데이터 멤버는 클래스에 하나이고 클래스 밖에서 정의한다. static 함수에는 this가 없다.
2. `this`는 호출한 객체의 주소. `*this`를 **참조로** 반환해야 같은 객체에 연결 호출이 된다. 값으로 반환하면 복사본이다.
3. friend는 멤버가 아니며 상속되지 않는다. `f(obj)`로 호출한다.
4. 선언은 `.h`(헤더 가드), 구현은 `.cpp`(`클래스::함수`).
5. 왼쪽 피연산자가 내 클래스가 아니면(`2 * p`, `cout << p`) 비멤버로 오버로딩한다. 후위 ++는 `operator++(int)`.
6. catch는 위에서부터 **처음 맞는 하나**만, 자료형이 정확히 같아야 한다(파생→기반만 허용). `"K"`는 `const char*`.
7. 처리 후에는 try-catch 다음 문장으로 간다. `throw;`는 같은 예외를 호출한 쪽으로 다시 던진다.
8. 맞는 catch가 없으면 호출한 쪽으로 전파되고, 빠져나가는 함수의 지역 객체는 역순으로 소멸한다.
9. try와 catch 사이에는 문장을 넣을 수 없고, `catch (...)`는 마지막에 둔다. 파생 예외 catch를 기반보다 위에 둔다.
