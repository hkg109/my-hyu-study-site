---
title: "객체지향과 클래스"
description: "객체지향의 개념(추상화·캡슐화·정보 은닉·상속·다형성), 클래스와 객체, 멤버 접근과 범위 연산자 ::, public·private과 getter·setter, 생성자·소멸자·기본 생성자, 복사 생성자와 얕은/깊은 복사, const 멤버 함수를 Lecture 9 순서로 그림과 출력 추적으로 설명합니다."
order: 6
published: true
duration: 90
---

# 객체지향과 클래스

**슬라이드:** Lecture 9 (9주차) · Foundations of OO-Programming, Class Definitions, Encapsulation, Constructors

중간고사 이후는 **객체지향**입니다. 지금까지는 `int`, `double` 같은 C++이 준 자료형만 썼다면, 이제 **내가 새 자료형(클래스)**을 만듭니다.

---

## 학습 흐름

```text
객체지향의 개념 → 클래스와 객체(Circle) → 멤버 접근 . 과 범위 연산자 ::
        ↓
정보 은닉: public / private → getter · setter
        ↓
생성자 · 소멸자 · 기본 생성자 → 호출 순서
        ↓
복사 생성자와 얕은/깊은 복사 → const 멤버 함수
```

> [!EXAM]
> 기말 족보의 클래스 문제는 세 가지입니다. ① **접근 가능 여부 O/X 표**, ② **virtual 유무에 따른 출력**(07강), ③ **조건에 맞는 클래스 작성**(07강 끝).

---

## 1. 객체지향이란

**객체지향(Object Orientation)**은 코드의 **신뢰성**과 **재사용성**을 높이기 위한 프로그래밍 패러다임입니다. 프로그래머는 현실의 대상을 본떠 **객체의 속성(attribute)과 동작(behavior)**을 정의합니다.

| 개념 | 뜻 | 이 과목에서 |
| --- | --- | --- |
| 추상화 (Abstraction) | 필요한 특징만 골라 모델로 만들기 | 원 → 반지름과 넓이 |
| 캡슐화 (Encapsulation) | 데이터와 그 데이터를 다루는 함수를 클래스로 묶기 | 클래스 정의 |
| 정보 은닉 (Information hiding) | 바깥에서 안을 못 보게 숨기기 | private / public |
| 상속 (Inheritance) | 기존 클래스를 물려받아 확장 | 07강 |
| 다형성 (Polymorphism) | 같은 호출이 실제 객체에 따라 다르게 동작 | 07강 |

이 다섯 개념이 **신뢰성(Reliability)**과 **재사용(Reuse)**이라는 두 목표로 이어집니다.

학생 세 명의 학번과 이름을 관리한다고 해 봅시다. 클래스 없이 쓰면 이렇게 됩니다.

```cpp
int number1 = 1;  char name1[20] = "Kim";
int number2 = 2;  char name2[20] = "Lee";
// 학생이 늘 때마다 변수가 두 개씩 늘고, 학번과 이름이 따로 논다
```

학번과 이름은 **한 학생에 속한 한 묶음**인데, 코드에서는 서로 아무 관계가 없습니다. 클래스는 이 묶음을 **하나의 자료형**으로 만듭니다.

```cpp
class Student {
public:
    int number;
    char name[20];
};

Student s1, s2;      // 학생 두 명. 각자 number와 name을 하나씩 가짐
s1.number = 1;
```

> [!NOTE]
> 클래스는 붕어빵 틀이고 객체는 붕어빵입니다. 틀(`Student`)은 하나지만 붕어빵(`s1`, `s2`)은 여러 개 찍을 수 있고, 붕어빵마다 속(`number`, `name`)이 따로 있습니다. `s1.number`를 바꿔도 `s2.number`는 그대로입니다.

---

## 2. 클래스와 객체

[![Circle 클래스가 속성 radius와 메서드 area를 정의하고 그 클래스로 만든 네 객체가 각자 다른 radius를 가지는 그림](/materials/diagrams/cpp-06-class-objects.svg)](/materials/diagrams/cpp-06-class-objects.svg)

*그림 6-1 · 클래스와 객체 — 누르면 원본 크기로 열린다.*

C++의 **클래스**는 객체의 자료형입니다. 기술적으로는 C 구조체를 확장한 것이고, **데이터 멤버(속성)**와 **클래스 관련 함수(메서드)**로 이루어집니다. **객체**는 클래스의 인스턴스이고 실행 중에 메모리를 차지합니다.

```cpp
class Circle {
public:
    double radius;
    double area() { return radius * radius * 3.141; }
};

int main() {
    Circle c;              // 객체 생성 = 인스턴스화
    c.radius = 3.0;        // 멤버 접근 연산자 .
    double a = c.area();
    Circle d = {5.0};      // C 구조체식 초기화 (public 속성일 때만)
}
```

클래스를 **정의만** 해서는 객체가 생기지 않습니다. 그 자료형의 **변수를 만들 때** 생깁니다.

**범위 연산자 `::`** — 클래스 안에는 원형만 두고, 메서드 본문을 클래스 밖에 쓸 때 소속을 밝힙니다(03강 네임스페이스와 같은 기호).

```cpp
class Circle {
public:
    double radius;
    double area();                    // 원형 — 공개 인터페이스
};
double Circle::area() { return radius * radius * 3.14159; }
```

> [!QUIZ]
> 슬라이드 13: 아래 `sum`의 `for (i = 0; i < i; i++)`에서 두 `i`는 각각 무엇이고, 어떻게 고치나?
> ```cpp
> class foo {
>     int i;          // 배열 원소 개수
>     int a[10];
>     int sum() { int i, x = 0; for (i = 0; i < i; i++) x += a[i]; return x; }
> };
> ```

> [!ANSWER]
> 함수 안에서 선언한 지역 변수 `i`가 멤버 `i`를 **가립니다**. 그래서 `i < i`는 지역 변수끼리 비교라 항상 거짓이고 합은 0입니다. 멤버를 쓰려면 `i < foo::i`(또는 `this->i`)라고 씁니다.

```cpp
class Student {               // 설계도 (새 자료형)
public:
    int number;               // 멤버 변수
    char name[20];

    void print() const {      // 멤버 함수(메서드)
        cout << number << ' ' << name << '\n';
    }
};                            // 세미콜론 필수

Student s;                    // 객체
s.number = 1;                 // 점 연산자로 멤버 접근
Student* p = &s;
p->print();                   // 포인터는 -> 사용 ((*p).print()와 같음)
```

- 객체의 멤버는 **점(`.`)**으로, 객체를 가리키는 포인터에서는 **화살표(`->`)**로 씁니다. `p->print()`는 `(*p).print()`를 줄여 쓴 것입니다.
- 멤버 함수 안에서는 같은 객체의 다른 멤버를 **이름만으로** 씁니다. `print()` 안의 `number`는 "이 함수를 부른 객체의 `number`"입니다.
- `class`의 기본 접근은 **private**, `struct`의 기본 접근은 **public**입니다. 그 밖에는 둘이 같습니다.

> [!TRAP]
> 클래스 정의 끝의 `};`에서 **세미콜론을 빠뜨리면** 엉뚱한 줄에서 컴파일 오류가 납니다. 함수 정의 `}` 뒤에는 세미콜론이 없지만 클래스 정의 뒤에는 꼭 필요합니다.

---

## 3. 정보 은닉: public과 private

[![Circle 클래스의 private radius는 main에서 직접 접근할 수 없고 public 메서드 set_radius get_radius area를 통해서만 다루며 생성자와 소멸자가 함께 있는 그림](/materials/diagrams/cpp-06-encapsulation.svg)](/materials/diagrams/cpp-06-encapsulation.svg)

*그림 6-2 · private 속성은 public 메서드로 — 누르면 원본 크기로 열린다.*

`public`, `private`, `protected`는 속성과 메서드가 **어디서 보이는지**를 정합니다.

- **public:** 클래스 밖에서도 제한 없이 접근.
- **private:** 클래스 내부에서만. 밖에서는 보이지 않으며, C 구조체식 초기화(`{5.0}`)도 안 됩니다.
- **protected:** 07강 상속에서.

```cpp
class Circle {
private:
    double radius;
public:
    double area();
    void set_radius(double r) { radius = r; }   // setter
    double get_radius() { return radius; }      // getter (accessor)
};
```

### 3-1. 왜 숨기나 (캡슐화)

통장 잔액을 `public`으로 두면 누구나 `acc.balance = -100000;`처럼 말이 안 되는 값을 넣을 수 있습니다. 데이터는 `private`으로 숨기고, 값을 바꿀 때는 **검사하는 함수**를 거치게 하면 실수를 막을 수 있습니다. 이렇게 데이터를 숨기고 함수로만 다루게 하는 것을 **캡슐화**라고 합니다.

```cpp
class Account {
private:
    int balance = 0;                  // 밖에서 직접 못 건드림
public:
    int getBalance() const { return balance; }   // getter: 읽기
    void deposit(int amount) {                   // 검사 후 변경
        if (amount > 0) balance += amount;
    }
};

Account acc;
acc.deposit(1000);
// acc.balance = -5;     // 컴파일 오류: private
cout << acc.getBalance();   // 1000
```

값을 읽는 함수를 **getter**, 바꾸는 함수를 **setter**라고 부릅니다. 족보의 클래스 작성 문제에 꼭 나옵니다(07강 끝).

### 3-2. 세 가지 접근 지정자

| 지정자 | 같은 클래스 멤버 함수 | 파생 클래스 멤버 함수 | 클래스 밖(main 등) |
| --- | :---: | :---: | :---: |
| `public` | O | O | O |
| `protected` | O | O (조건 있음) | X |
| `private` | O | **X** | X |

- `public`: 누구나
- `protected`: 나와 **나를 물려받은 자식**까지
- `private`: **나만**

### 3-3. 다른 객체를 통한 접근 (O/X 표의 함정)

접근 권한은 **객체 단위가 아니라 클래스 단위**입니다. 같은 클래스의 멤버 함수라면 **다른 객체의 private 멤버**에도 접근할 수 있습니다. 반면 `protected`는 파생 클래스에서 **자기 클래스(또는 그 파생) 객체를 통할 때만** 접근할 수 있습니다.

```cpp
class A {
public:    int x; A* pa;
protected: int y;
private:   int z;
};
class B : public A { public: A objA; };
class C : public B { public: C* pc; B objB; };
```

```text
상속 관계:  A  ◀── B  ◀── C        (B는 A를, C는 B를 물려받음)
멤버:      x(public) y(protected) z(private) pa   objA(B에만)   pc, objB(C에만)
```

각 클래스의 **멤버 함수 안에서** 쓸 수 있는지:

| 표현 | in A | in B | in C | 이유 |
| --- | :---: | :---: | :---: | --- |
| `x` | O | O | O | public 상속된 public |
| `y` | O | O | O | 자기(상속받은) protected |
| `z` | O | X | X | private는 A만 |
| `objA.x` | X | O | O | A에는 `objA` 멤버가 없음 |
| `objA.y` | X | **X** | **X** | 다른 A 객체의 protected는 파생 클래스에서 불가 |
| `objA.z` | X | X | X | private |
| `pa->y` | O | **X** | **X** | A 안에서는 다른 A 객체의 protected·private도 OK |
| `pa->z` | **O** | X | X | 같은 클래스면 다른 객체의 private도 OK |
| `objB.y` | X | X | **X** | C 안이라도 B 객체를 통한 protected는 불가 |
| `pc->y` | X | X | **O** | C 안에서 C 객체를 통하면 가능 |
| `pc->z` | X | X | X | private |

> [!NOTE]
> **O/X 표를 푸는 3단계**
>
> 1. 그 이름(`objA`, `pc` 등)이 **그 클래스에 선언되어 있나?** 없으면 X.
> 2. 마지막 멤버(`x`/`y`/`z`)가 **public이면 O, private이면 자기 클래스(A) 안에서만 O.**
> 3. **protected**라면: A 안에서는 O. 파생 클래스 안에서는 **"나 자신(그냥 `y`)"이거나 "내 클래스 자료형의 객체(`pc->y`)"를 통할 때만** O, 부모 자료형 객체(`objA.y`, `objB.y`)를 통하면 X.

> [!TRAP]
> - "멤버가 그 클래스에 **선언되어 있는가**"를 먼저 보세요. `objA`는 B의 멤버이므로 A의 멤버 함수에서는 쓸 수 없습니다(X).
> - 파생 클래스에서 `y`(자신이 물려받은 것)는 O지만, `objA.y`(별도 A 객체의 것)는 X입니다.

> [!QUIZ]
> 위 A, B, C 정의에서 아래 표현을 각 클래스의 멤버 함수 안에서 쓸 수 있으면 O, 없으면 X를 쓰시오.
>
> | 표현 | in A | in B | in C |
> | --- | :---: | :---: | :---: |
> | `y` | | | |
> | `z` | | | |
> | `objA.x` | | | |
> | `objA.y` | | | |
> | `pa->z` | | | |
> | `objB.x` | | | |
> | `pc->y` | | | |

> [!ANSWER]
> | 표현 | in A | in B | in C |
> | --- | :---: | :---: | :---: |
> | `y` | O | O | O |
> | `z` | O | X | X |
> | `objA.x` | X | O | O |
> | `objA.y` | X | X | X |
> | `pa->z` | O | X | X |
> | `objB.x` | X | X | O |
> | `pc->y` | X | X | O |
>
> 모든 칸은 컴파일러로 확인한 결과입니다.

---

## 4. 생성자와 소멸자

**생성자**는 새 객체가 만들어질 때 불리는 특별한 멤버 함수입니다. 인수가 다른 생성자를 여러 개 둘 수 있습니다. **소멸자**는 객체가 사라질 때 불리며 **하나뿐이고 인수가 없습니다**.

```cpp
class Circle {
public:
    double radius;
    double area();
    Circle(double r);   // 생성자 원형
    Circle();           // 기본 생성자 (초기값 없이 만들 때)
    ~Circle();          // 소멸자
};
Circle::Circle(double r) { radius = r; }
Circle::Circle()         { radius = 0; }
Circle::~Circle()        { std::cout << "Goodbye Object\n"; }

int main() {
    Circle c = Circle(5.0);    // 또는 Circle c(5.0);
    std::cout << c.area();
}   // main이 끝날 때 "Goodbye Object"
```

### 4-1. 객체가 태어날 때와 죽을 때

객체를 만들면서 바로 값을 채우고 싶을 때가 많습니다. 생성자는 **객체가 만들어지는 순간 자동으로 불리는 함수**, 소멸자는 **사라지는 순간 자동으로 불리는 함수**입니다.

```cpp
class Lamp {
    int watt;
public:
    Lamp(int w) {                 // 생성자: 이름 = 클래스 이름, 반환형 없음
        watt = w;
        cout << "켜짐(" << watt << "W) ";
    }
    ~Lamp() {                     // 소멸자: ~클래스이름, 매개변수 없음
        cout << "꺼짐(" << watt << "W) ";
    }
};

int main() {
    Lamp a(60);                   // 생성자 호출
    {
        Lamp b(100);
    }                             // 블록 끝 → b 소멸
    cout << "| ";
}                                 // main 끝 → a 소멸
// 출력: 켜짐(60W) 켜짐(100W) 꺼짐(100W) | 꺼짐(60W)
```

| | 생성자 | 소멸자 |
| --- | --- | --- |
| 이름 | 클래스 이름 | `~클래스이름` |
| 반환형 | 없음 (`void`도 안 씀) | 없음 |
| 매개변수 | 가질 수 있음, 오버로딩 가능 | **없음**, 하나만 |
| 호출 시점 | 객체가 만들어질 때 자동 | 객체가 사라질 때 자동 |

### 4-2. 기본 생성자 규칙

매개변수가 없는 생성자를 **기본 생성자**라고 합니다. `P a;`처럼 괄호 없이 만들거나 `P arr[3];`처럼 배열을 만들 때 불립니다.

- 생성자를 **하나도 안 만들면** 컴파일러가 기본 생성자를 만들어 줍니다.
- 매개변수 있는 생성자를 **하나라도 만들면** 기본 생성자는 자동으로 생기지 않습니다. 그러면 `P a;`와 `P arr[3];`은 **컴파일 오류**입니다.

```cpp
class P {
    int x;
public:
    P(int v) : x(v) {}
};
P a;          // 컴파일 오류: P() 없음
P b(3);       // OK
```

고치려면 기본 생성자를 직접 추가하거나 기본값을 줍니다: `P(int v = 0) : x(v) {}`.

### 4-3. 멤버 초기화 목록

생성자 이름 뒤 `:`부터 `{` 앞까지를 **멤버 초기화 목록**이라고 합니다. 멤버가 만들어지는 **그 순간에** 값을 넣습니다.

```cpp
class Player {
    string name;
    int hp;
    const int id;          // const 멤버와 참조 멤버는 초기화 목록에서만 초기화 가능
public:
    Player(string n, int h, int i) : name(n), hp(h), id(i) {}
};
```

본문 `{ }` 안에서 `id = i;`라고 쓰면 이미 만들어진 `const` 멤버에 **대입**하는 것이 되어 오류입니다. "만들면서 넣기(초기화)"와 "만든 뒤에 넣기(대입)"가 다르다는 점이 핵심입니다.

> [!TRAP]
> 멤버는 초기화 목록에 **적힌 순서가 아니라 클래스에 선언된 순서**대로 초기화됩니다.

### 4-4. 호출 순서 (시험 최빈출)

```text
생성: 기반 클래스 → 멤버 객체(선언 순서) → 자기 생성자 본문
소멸: 정확히 반대  (자기 소멸자 본문 → 멤버(선언 역순) → 기반)
```

> [!NOTE]
> 집을 짓는 순서로 생각하세요. **기초(기반 클래스)**를 먼저 놓고, **방(멤버 객체)**을 들이고, 마지막에 **입주(자기 생성자 본문)**합니다. 철거는 정반대로, 이사 나가고 → 방을 빼고 → 기초를 허뭅니다.

- 지역 객체는 블록을 벗어날 때, **생성의 역순**으로 소멸합니다(먼저 만든 것이 나중에 사라짐).
- `new`로 만든 객체는 `delete`할 때 소멸합니다. `delete`하지 않으면 소멸자가 불리지 않습니다.
- 전역 객체는 `main` 전에 생성되고 `main`이 끝난 뒤 소멸합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class Part {
>     string n;
> public:
>     Part(string s) : n(s) { cout << "P(" << n << ") "; }
>     ~Part() { cout << "~P(" << n << ") "; }
> };
> class Base {
> public:
>     Base() { cout << "B "; }
>     ~Base() { cout << "~B "; }
> };
> class Derived : public Base {
>     Part p1;
>     Part p2;
> public:
>     Derived() : p2("2"), p1("1") { cout << "D "; }
>     ~Derived() { cout << "~D "; }
> };
>
> int main() {
>     {
>         Derived d;
>         cout << "| ";
>     }
>     cout << "end";
> }
> ```

> [!ANSWER]
> ```text
> B P(1) P(2) D | ~D ~P(2) ~P(1) ~B end
> ```
>
> 기반(B) → 멤버 선언 순서(p1, p2) → 자기 본문(D). 초기화 목록에 `p2`를 먼저 적어도 선언 순서를 따릅니다. 소멸은 정확히 반대입니다.

> [!QUIZ]
> 다음 출력을 쓰시오. (`Trace`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다.)
>
> ```cpp
> Trace g("g");                      // 전역
>
> int main() {
>     cout << "main ";
>     Trace a("a");
>     Trace* p = new Trace("p");
>     {
>         Trace b("b");
>     }
>     delete p;
>     Trace c("c");
>     cout << "end ";
> }
> ```

> [!ANSWER]
> ```text
> g+ main a+ p+ b+ b- p- c+ end c- a- g-
> ```
>
> 전역 `g`는 `main` 전에 생성, 맨 마지막에 소멸합니다. `b`는 블록 끝에서, `p`는 `delete`할 때 소멸합니다. `main`이 끝나면 지역 객체가 생성 역순(c → a)으로 소멸합니다.

---

## 5. 복사 생성자와 얕은 / 깊은 복사

### 5-1. 복사 생성자가 불리는 때

복사 생성자 `T(const T& other)`는 **새 객체를 기존 객체로 초기화할 때** 호출됩니다. 직접 만들지 않으면 컴파일러가 "멤버를 하나씩 그대로 복사하는" 복사 생성자를 만들어 줍니다.

구분의 핵심은 **새 객체가 태어나는가**입니다.

| 코드 | 호출되는 것 | 새 객체가 태어나나 |
| --- | --- | :---: |
| `T b = a;` | 복사 생성자 (`=`가 있어도 **초기화**) | O |
| `T c(a);` | 복사 생성자 | O |
| `c = b;` (이미 있는 객체) | **대입 연산자** `operator=` | X |
| `void f(T t)`에 `f(a)` | 복사 생성자 (값 전달) | O (매개변수 t) |
| `void f(T& t)`에 `f(a)` | 아무것도 안 불림 (참조) | X |
| `catch (T e)` | 복사 생성자 | O |

> [!TRAP]
> `T b = a;`에 `=`가 보인다고 대입 연산자를 고르면 틀립니다. **선언과 동시에 쓰는 `=`는 초기화**이고, 이미 있는 변수에 쓰는 `=`만 대입입니다.

> [!QUIZ]
> 생성자는 `D `, 복사 생성자는 `C `, 대입 연산자는 `A `를 출력한다. 출력을 쓰시오.
>
> ```cpp
> void byVal(T t) {}
> void byRef(T& t) {}
>
> T a;
> T b = a;
> T c(a);
> c = b;
> byVal(a);
> byRef(a);
> ```

> [!ANSWER]
> `D C C A C` — `T b = a`는 대입이 아니라 복사 **초기화**입니다. `byRef`는 복사하지 않습니다.

### 5-2. 얕은 복사의 문제

컴파일러가 만든 기본 복사 생성자는 멤버를 **그대로 복사**합니다. 멤버가 포인터면 **주소만** 복사되어 두 객체가 같은 메모리를 공유합니다(얕은 복사). 한쪽을 바꾸면 다른 쪽도 바뀌고, 둘 다 소멸자에서 `delete`하면 **이중 해제**가 됩니다.

```text
얕은 복사 (기본)                    깊은 복사 (직접 작성)
a.v ──┐                            a.v ──▶ [ 1 ]
      ├──▶ [ 1 ]                   b.v ──▶ [ 1 ]   ← 새로 빌린 칸
b.v ──┘                            
같은 칸을 공유 → b를 바꾸면 a도 바뀜   따로따로 → 서로 영향 없음
```

```cpp
class Box {
public:
    int* v;
    Box(int x) { v = new int(x); }
    Box(const Box& o) { v = new int(*o.v); }   // 깊은 복사: 새 메모리에 값 복사
    ~Box() { delete v; }
};
```

`new int(*o.v)`는 "**새 칸을 빌리고**, 원본이 가리키는 **값**을 넣어라"입니다. 주소가 아니라 값을 복사하므로 두 객체가 각자의 칸을 갖습니다.

> [!QUIZ]
> 복사 생성자를 직접 만들지 **않은** `Box`(소멸자도 없음)와 위의 깊은 복사 `Box`에서 각각 출력을 쓰시오.
>
> ```cpp
> Box a(1);
> Box b = a;
> *b.v = 5;
> cout << *a.v << ' ' << (a.v == b.v);
> ```

> [!ANSWER]
> - 기본(얕은) 복사: `5 1` — `a.v`와 `b.v`가 같은 주소입니다.
> - 깊은 복사: `1 0` — `b`는 자기 메모리를 따로 가집니다.

---

## 6. const 멤버 함수

멤버 함수 뒤의 `const`는 "이 함수는 객체를 바꾸지 않는다"는 약속입니다. **const 객체는 const 멤버 함수만** 호출할 수 있습니다.

```cpp
class Cnt {
    int v;
public:
    Cnt(int x = 0) : v(x) {}
    int get() const { return v; }   // OK: 읽기만
    void inc() { v++; }
};
const Cnt k(5);
k.get();      // OK
k.inc();      // 컴파일 오류
```

> [!NOTE]
> getter처럼 **읽기만 하는 함수에는 습관적으로 `const`를 붙이세요.** 그래야 `const` 객체나 `const T&` 매개변수로 받은 객체에서도 그 함수를 부를 수 있습니다. const 멤버 함수 안에서 멤버를 바꾸려 하면(`v++`) 컴파일 오류가 나서 실수를 막아 줍니다.

---

## 핵심 정리

1. 객체지향 = 추상화·캡슐화·정보 은닉·상속·다형성 → 신뢰성과 재사용.
2. 클래스는 속성(데이터 멤버)과 메서드를 묶은 자료형, 객체는 그 인스턴스. 변수를 만들 때 생긴다.
3. 멤버는 `.`(포인터면 `->`)으로, 클래스 밖 정의는 `클래스::메서드`로.
4. private은 클래스 안에서만, public은 어디서나. 데이터는 private, getter·setter는 public.
5. 생성자는 여러 개 가능, 소멸자는 하나·인수 없음. 생성자를 하나라도 만들면 기본 생성자는 자동으로 생기지 않는다.
6. 생성: 기반 → 멤버(선언 순서) → 자신, 소멸은 반대. 지역 객체는 생성 역순으로 소멸.
7. `T b = a;`는 복사 생성자, 포인터 멤버의 기본 복사는 얕은 복사. 읽기 전용 메서드에는 `const`.

---

## 학습 경로

[← 05 오버로딩·포인터·동적 메모리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-05) · [07 상속·다형성·연산자 오버로딩 →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-07)
