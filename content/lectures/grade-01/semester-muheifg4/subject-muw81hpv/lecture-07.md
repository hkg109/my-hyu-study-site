---
title: "템플릿"
description: "자료형만 다른 함수를 하나의 틀로 쓰는 함수 템플릿부터 자료형 추론과 명시적 지정, 클래스 템플릿과 비자료형 매개변수, 템플릿 특수화, Factorial<N> 같은 템플릿 재귀까지 '컴파일러가 대신 만들어 주는 코드'를 펼쳐 보며 처음부터 설명합니다."
order: 7
published: true
---

# 템플릿

템플릿은 **"자료형 자리를 비워 둔 코드 틀"**입니다. 우리가 틀을 쓰면, 컴파일러가 필요한 자료형마다 실제 코드를 찍어 냅니다. 이 강의는 "왜 틀이 필요한가"에서 출발해, 컴파일러가 실제로 만들어 내는 코드를 펼쳐 보면서 족보의 `change`와 `Factorial<N>` 문제까지 올라갑니다.

## 학습 흐름

```text
왜 템플릿인가 → 함수 템플릿 → 자료형 추론과 명시적 지정 → 일반 함수와의 우선순위
        ↓
클래스 템플릿 → 비자료형 매개변수 (int N)
        ↓
템플릿 특수화 template<> → 템플릿 재귀 Factorial<N>, Factorial<0>
```

> [!EXAM]
> 기말 족보에는 ① **원본 값을 바꾸는 함수 템플릿 `change` 작성**, ② **`Factorial<5>`의 출력과 `Factorial<0>`의 역할 설명**이 나옵니다.

### 이 강의에서 쓰는 말

| 말 | 뜻 | 비유 |
| --- | --- | --- |
| 템플릿 | 자료형을 `T` 같은 이름으로 비워 둔 코드 틀 | 빈칸 있는 서식 |
| 템플릿 매개변수 | 틀의 빈칸 이름(`T`, `N`) | 서식의 "이름: ___" |
| 인스턴스화 | 컴파일러가 빈칸을 채워 실제 코드를 만드는 것 | 서식에 이름을 써 넣어 완성본 만들기 |
| 자료형 추론 | 호출한 인수를 보고 `T`를 알아서 정하는 것 | 서류를 보고 빈칸 자동 채우기 |
| 특수화 | 특정 자료형에서만 다른 코드를 쓰도록 따로 정의 | "외국인은 이 서식을 쓰세요" |

---

## 0. 왜 템플릿이 필요한가

두 값을 바꾸는 함수를 생각해 봅시다.

```cpp
void change(int& a, int& b)       { int t = a;    a = b; b = t; }
void change(double& a, double& b) { double t = a; a = b; b = t; }
void change(string& a, string& b) { string t = a; a = b; b = t; }
// char용, float용, … 끝이 없다
```

세 함수는 **자료형만 다르고 나머지 코드가 완전히 같습니다.** 자료형이 하나 늘 때마다 복사·붙여넣기를 하면, 나중에 로직을 고칠 때 모든 복사본을 다 고쳐야 합니다. 템플릿은 자료형 자리를 `T`로 비워 두고 **한 번만** 씁니다.

> [!NOTE]
> 템플릿은 붕어빵 틀(클래스)보다 한 단계 위인 **"틀을 만드는 틀"**입니다. "팥 붕어빵 틀", "크림 붕어빵 틀"을 따로 만들지 않고, "○○ 붕어빵 틀"을 하나 만들어 두면 컴파일러가 필요한 맛마다 틀을 찍어 냅니다.

---

## 1. 함수 템플릿

### 1-1. 쓰는 법

자료형만 다르고 코드가 같은 함수를 **하나의 틀**로 씁니다. 컴파일러가 호출할 때의 자료형으로 실제 함수를 **만들어 냅니다(인스턴스화)**.

```cpp
template <typename T>          // "아래 코드에서 T는 아직 정하지 않은 자료형이다"
void change(T& a, T& b) {      // 원본을 바꾸려면 참조 매개변수
    T temp = a;
    a = b;
    b = temp;
}

int a = 1, b = 2;
change(a, b);                  // T = int
double x = 1.5, y = 2.5;
change(x, y);                  // T = double
string s = "hi", t = "yo";
change(s, t);                  // T = string
```

- `template <typename T>`는 바로 다음에 오는 함수(또는 클래스) **하나**에 붙는 머리말입니다.
- `typename` 대신 `class`라고 써도 같은 뜻입니다: `template <class T>`.
- `T`는 관례상 쓰는 이름일 뿐, `Type`, `U` 등 아무 이름이나 됩니다.

### 1-2. 컴파일러가 실제로 만드는 것

`change(a, b)`를 만나면 컴파일러는 `a`, `b`가 `int`인 것을 보고 `T` 자리에 `int`를 채운 함수를 **새로 만들어** 호출합니다.

```cpp
// change(a, b) 를 보고 컴파일러가 만든 함수 (눈에 보이지 않음)
void change(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
// change(x, y) 를 보고 또 하나 만든 함수
void change(double& a, double& b) { double temp = a; a = b; b = temp; }
```

템플릿 자체는 **실행되는 코드가 아니라 설계도**입니다. 실제로 실행되는 것은 이렇게 찍혀 나온 함수들입니다.

> [!TRAP]
> - 매개변수를 `T a, T b`(값)로 쓰면 **복사본만 바뀌어** 원본이 그대로입니다. 족보 문제의 "원본 값이 바뀌도록"은 `T&`를 쓰라는 뜻입니다.
> - `T&`로 받으면 리터럴은 넘길 수 없습니다: `change(1, 2)`는 컴파일 오류입니다.

> [!QUIZ]
> 두 변수의 원본 값을 서로 바꾸는 함수 템플릿 `change`를 작성하고, `int`와 `char` 변수로 각각 호출해 바뀐 결과를 출력하는 `main`을 작성하시오.

> [!ANSWER]
> ```cpp
> #include <iostream>
> using namespace std;
>
> template <typename T>
> void change(T& a, T& b) {
>     T temp = a;
>     a = b;
>     b = temp;
> }
>
> int main() {
>     int i1 = 1, i2 = 2;
>     char c1 = 'x', c2 = 'y';
>     change(i1, i2);
>     change(c1, c2);
>     cout << i1 << ' ' << i2 << ' ' << c1 << ' ' << c2;   // 2 1 y x
> }
> ```
>
> 채점 포인트: ① `template <typename T>` 머리말 ② 매개변수 `T&`(참조) ③ 임시 변수도 `T` 자료형 ④ 두 인수가 **같은 자료형**인 변수.

### 1-3. 자료형 추론과 명시적 지정

```cpp
template <typename T>
T maximum(T a, T b) { return a > b ? a : b; }
```

컴파일러는 **두 인수의 자료형을 보고** `T`를 정합니다. 그런데 `T`는 하나뿐이므로 두 인수가 **같은 자료형**이어야 정할 수 있습니다. 다를 때는 `<자료형>`을 직접 적어 줍니다.

| 호출 | T | 결과 |
| --- | --- | --- |
| `maximum(3, 7)` | int | 7 |
| `maximum('a', 'b')` | char | b |
| `maximum(3, 4.5)` | int? double? | **컴파일 오류** (T 하나에 서로 다른 자료형) |
| `maximum<double>(3, 4.5)` | double (명시) | 4.5 |
| `maximum<int>(3, 4.9)` | int (명시) | **4** (4.9가 int로 잘림) |
| `maximum(string("apple"), string("banana"))` | string | banana (사전순) |

`<double>`처럼 명시하면 `T`가 정해진 상태라 인수가 `double`로 **변환**되어 들어갑니다. `<int>`로 명시하면 4.9가 int로 바뀌며 소수점이 잘려 4가 됩니다.

> [!TRAP]
> 템플릿 자료형 추론은 **변환을 하지 않습니다**. `int`와 `double`을 섞으면 T를 정할 수 없어 오류입니다. `change(i, d)`(int와 double)도 마찬가지입니다.

### 1-4. 일반 함수가 있으면 일반 함수가 먼저

같은 이름의 **일반 함수와 템플릿**이 함께 있으면, 인수가 **정확히 맞는 일반 함수**가 우선입니다. 이미 완성된 함수가 딱 맞으면 굳이 틀로 새로 찍지 않는다고 생각하면 됩니다.

```cpp
template <typename T> void show(T) { cout << "T "; }
void show(int) { cout << "int "; }

show(1);        // int  ← 정확히 맞는 일반 함수 우선
show(1.0);      // T
show('a');      // T    ← char는 템플릿이 정확히 맞음
show<int>(1);   // T    ← <>를 쓰면 템플릿을 강제
```

`show('a')`가 `T`인 이유: 일반 함수 `show(int)`로 가려면 char → int 변환이 필요하지만, 템플릿은 `T = char`로 **변환 없이 정확히** 맞출 수 있으므로 템플릿이 이깁니다.

### 1-5. 자료형마다 다른 함수가 만들어진다

```cpp
template <typename T>
int counter(T) { static int c = 0; return ++c; }

cout << counter(1) << counter(2) << counter(1.0) << counter('a') << counter(3);
// 출력: 12113
```

`counter<int>`, `counter<double>`, `counter<char>`는 **서로 다른 함수**이므로 static 변수도 각각 따로 있습니다(1-2절에서 본 것처럼 함수가 자료형마다 따로 찍히기 때문).

```text
counter(1)   → counter<int>    의 c: 1
counter(2)   → counter<int>    의 c: 2
counter(1.0) → counter<double> 의 c: 1   ← 다른 함수, 다른 c
counter('a') → counter<char>   의 c: 1
counter(3)   → counter<int>    의 c: 3
```

> [!QUIZ]
> 위 `maximum`, `show`, `counter`를 사용할 때 출력을 쓰고, 컴파일 오류인 줄을 고르시오.
>
> ```cpp
> cout << maximum(3, 7) << ' ' << maximum<int>(3, 4.9) << ' '
>      << maximum<double>(3, 4.5) << '\n';               // (1)
> cout << maximum(3, 4.5);                                 // (2)
> show(1); show(1.0); show<int>(1);                        // (3)
> cout << '\n' << counter(5) << counter(5.0) << counter(6);  // (4)
> ```

> [!ANSWER]
> (2)는 컴파일 오류입니다(T를 정할 수 없음). 나머지 출력:
>
> ```text
> 7 4 4.5
> int T T 
> 112
> ```
>
> (4)는 왼쪽부터 `counter(5)` → `counter<int>`의 첫 호출 1, `counter(5.0)` → `counter<double>`의 첫 호출 1, `counter(6)` → 다시 `counter<int>`이므로 2입니다. 이 줄이 프로그램에서 `counter`를 처음 부른다고 가정합니다.

---

## 2. 클래스 템플릿

### 2-1. 쓰는 법

클래스도 자료형 자리를 비워 둘 수 있습니다. `vector<int>`, `vector<string>`이 바로 표준 라이브러리의 클래스 템플릿입니다.

```cpp
template <typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
    void set(T v) { value = v; }
};

Box<int> bi(3);              // 자료형을 <>로 지정
Box<string> bs("cpp");
cout << bi.get() + 1 << ' ' << bs.get();   // 4 cpp

template <typename T1, typename T2>
class Pair {
public:
    T1 first;
    T2 second;
    Pair(T1 a, T2 b) : first(a), second(b) {}
};
Pair<string, int> p("age", 20);
cout << p.first << '=' << p.second;        // age=20
```

- `Box<int>`와 `Box<double>`은 **서로 다른 클래스**입니다.
- 클래스 밖에서 멤버 함수를 정의할 때는 `template <typename T> T Box<T>::get() const { … }`처럼 다시 템플릿 머리를 씁니다.
- C++14까지는 `Box<int>`처럼 자료형을 반드시 써야 합니다. (C++17부터는 `Box b(3);`처럼 생략도 가능)

> [!NOTE]
> 함수 템플릿은 인수를 보고 `T`를 추론하지만, 클래스 템플릿은 객체를 만들 때 **`<int>`처럼 직접 적는 것**이 기본입니다. `vector<int> v;`에서 `<int>`를 쓰는 것과 같습니다.

### 2-2. 비자료형 매개변수

템플릿 매개변수로 자료형뿐 아니라 **정수 상수**도 받을 수 있습니다. 컴파일할 때 정해지므로 배열 크기로도 쓸 수 있습니다.

```cpp
template <typename T, int N>
class Stack {
    T data[N];
    int top = 0;
public:
    bool push(T v) { if (top == N) return false; data[top++] = v; return true; }
    T pop() { return data[--top]; }
    int size() const { return top; }
};

Stack<int, 3> st;
cout << st.push(1) << st.push(2) << st.push(3) << st.push(4);   // 1110
cout << ' ' << st.pop() << st.pop() << ' ' << st.size();        // 32 1
```

```text
Stack<int, 3>:  data[3]
push(1) push(2) push(3)  →  [1][2][3]  top=3   (모두 성공: 1 1 1)
push(4)                  →  가득 참 → false   (0)
pop() → 3, pop() → 2     →  [1]        top=1
```

`Stack<int, 3>`과 `Stack<int, 5>`도 **서로 다른 클래스**입니다. `N`은 실행 중이 아니라 **컴파일할 때** 정해지는 값이라서 `int n; cin >> n; Stack<int, n> s;`는 컴파일 오류입니다.

---

## 3. 템플릿 특수화

일반 틀로는 대부분 잘 되지만 **특정 자료형만 다르게** 처리하고 싶을 때가 있습니다. 예를 들어 `bool`을 `1`/`0` 대신 `yes`/`no`로 출력하고 싶다면, `bool` 전용 버전을 따로 정의합니다. 이것을 **특수화**라 하고 `template <>`로 시작합니다.

```cpp
template <typename T>
class Printer {
public:
    void print(T v) { cout << "value " << v << '\n'; }
};

template <>                     // bool일 때만 따로
class Printer<bool> {
public:
    void print(bool v) { cout << (v ? "yes" : "no") << '\n'; }
};

Printer<int>().print(5);        // value 5
Printer<bool>().print(true);    // yes
```

- `template <>`의 빈 꺾쇠는 "**빈칸이 더 이상 없다**(자료형이 이미 정해졌다)"는 뜻입니다.
- 컴파일러는 `Printer<bool>`을 만들 때 일반 틀 대신 **특수화 버전을 먼저** 씁니다.

> [!NOTE]
> 특수화는 4절 템플릿 재귀의 열쇠입니다. 재귀 함수에 "멈추는 조건"이 필요하듯, 템플릿 재귀에는 "**이 값에서는 다른 코드를 써라**"라는 특수화가 멈추는 조건 역할을 합니다.

---

## 4. 템플릿 재귀: Factorial<N>

### 4-1. 먼저 보통 재귀 함수 떠올리기

```cpp
long fact(long n) {
    if (n == 0) return 1;         // 기저 조건: 여기서 멈춘다
    return n * fact(n - 1);       // 한 단계 작은 문제를 부른다
}
```

`fact(5)` → `5 * fact(4)` → … → `fact(0)` = 1에서 멈춥니다. 기저 조건이 없으면 `fact(-1)`, `fact(-2)`, …로 끝없이 내려갑니다.

### 4-2. 같은 구조를 템플릿으로

```cpp
template <long N>
class Factorial {
public:
    long Value(void) { return N * fn_1.Value(); }
private:
    Factorial<N - 1> fn_1;           // 한 단계 작은 클래스를 멤버로 가짐
};

template <>
class Factorial<0> {                 // 특수화 = 재귀의 기저 조건
public:
    long Value(void) { return 1; }
};

Factorial<5> f;
cout << f.Value();                   // 120
```

| 보통 재귀 함수 | 템플릿 재귀 |
| --- | --- |
| `fact(n)`이 `fact(n - 1)`을 **호출** | `Factorial<N>`이 `Factorial<N - 1>`을 **멤버로 가짐** |
| `if (n == 0) return 1;` | `template <> class Factorial<0>` 특수화 |
| 실행 중에 함수가 쌓임 | **컴파일 중에** 클래스가 차례로 만들어짐 |

컴파일러는 `Factorial<5>`를 만들려다 멤버 `Factorial<4>`가 필요해 그것을 만들고, 또 `Factorial<3>`이 필요해 만들고 … `Factorial<0>`에서 **특수화 버전**을 쓰므로 더 이상 멤버를 요구하지 않아 멈춥니다.

```text
Factorial<5> 안에 Factorial<4> 안에 … Factorial<1> 안에 Factorial<0>
Value: 5 × 4 × 3 × 2 × 1 × 1 = 120
```

```text
f.Value()
= 5 * (Factorial<4>).Value()
= 5 * 4 * (Factorial<3>).Value()
= 5 * 4 * 3 * (Factorial<2>).Value()
= 5 * 4 * 3 * 2 * (Factorial<1>).Value()
= 5 * 4 * 3 * 2 * 1 * (Factorial<0>).Value()     ← 특수화: 1을 돌려줌
= 120
```

> [!EXAM]
> **`Factorial<0>`의 역할**: 재귀 함수의 **기저 조건**과 같습니다. `Factorial<N>`이 `Factorial<N-1>`을 계속 요구하는데, `N = 0`에서 멈추게 하는 **특수화**입니다. 이것이 없으면 컴파일러가 `Factorial<-1>`, `Factorial<-2>`, …를 끝없이 만들려 해서 **컴파일 오류**(템플릿 인스턴스화 깊이 초과)가 납니다. 실행 중이 아니라 **컴파일 중에** 일어나는 문제입니다.

> [!QUIZ]
> 같은 방식으로 정의한 다음 템플릿의 값을 구하시오.
>
> ```cpp
> template <int N> struct Fib { static const int value = Fib<N - 1>::value + Fib<N - 2>::value; };
> template <> struct Fib<0> { static const int value = 0; };
> template <> struct Fib<1> { static const int value = 1; };
>
> template <int N> struct Pow2 { static const int value = 2 * Pow2<N - 1>::value; };
> template <> struct Pow2<0> { static const int value = 1; };
>
> cout << Fib<6>::value << ' ' << Fib<10>::value << ' ' << Pow2<10>::value;
> ```
>
> `Fib`에서 `Fib<1>` 특수화를 지우면 어떻게 되는가?

> [!HINT 1]
> `Fib<N>`은 피보나치 수입니다: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 (N = 0부터). `Pow2<N>`은 2를 N번 곱한 값입니다.

> [!ANSWER]
> `8 55 1024`.
>
> `Fib<1>`이 없으면 `Fib<1>`이 일반 템플릿으로 만들어져 `Fib<0> + Fib<-1>`을 요구하고, `Fib<-1>`, `Fib<-2>`, …로 끝없이 내려가 **컴파일 오류**가 납니다. 두 칸 전을 쓰는 재귀는 기저 조건이 두 개 필요합니다.

---

## 핵심 정리

1. 템플릿은 자료형 자리를 `T`로 비워 둔 틀이다. 컴파일러가 호출한 자료형마다 별도의 함수·클래스를 만든다(static 변수도 따로).
2. 원본을 바꾸는 템플릿은 `T&` 매개변수. 리터럴은 넘길 수 없다.
3. 자료형 추론은 변환하지 않는다. 서로 다른 자료형을 섞으면 `<double>`처럼 명시한다(명시하면 변환됨).
4. 정확히 맞는 일반 함수가 템플릿보다 우선한다. `f<int>()`는 템플릿을 강제한다.
5. 클래스 템플릿은 `Box<int>`처럼 자료형을 지정한다. `int N` 같은 상수 매개변수도 가능하며 컴파일 때 정해진다.
6. `template <>` 특수화로 특정 자료형(또는 값)만 다르게 구현한다.
7. `Factorial<0>`은 템플릿 재귀의 기저 조건이다. 없으면 컴파일 오류(인스턴스화 깊이 초과).
