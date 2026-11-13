---
title: "객체지향과 클래스"
description: "객체지향의 개념(추상화·캡슐화·정보 은닉·상속·다형성), 클래스와 객체, 멤버 접근과 범위 연산자 ::, public·private과 getter·setter, 생성자·소멸자·기본 생성자, 복사 생성자와 얕은/깊은 복사, const 멤버 함수를 Lecture 9 순서로 설명합니다. 모든 예제는 그대로 컴파일되는 완전한 프로그램과 실제 실행 결과, 그리고 붕어빵 틀·금고·열쇠 복사 같은 비유로 이 강의 하나만 보고도 이해할 수 있게 구성했습니다."
order: 6
published: true
duration: 90
---

# 객체지향과 클래스

**슬라이드:** Lecture 9 (9주차) · Foundations of OO-Programming, Class Definitions, Encapsulation, Constructors

중간고사 이후는 **객체지향**입니다. 지금까지는 `int`, `double` 같은 C++이 준 자료형만 썼다면, 이제 **새 자료형(클래스)을 직접** 만듭니다.

이 강의의 예제는 모두 **그대로 복사해 컴파일하면 돌아가는 완전한 프로그램**이고, 바로 아래의 **실행 결과**는 g++ 13(`-std=c++17`)으로 실제로 돌린 출력입니다. 일부러 오류를 보여 주는 코드는 **컴파일 오류 예시**라고 따로 표시했습니다.

---

## 학습 흐름

```text
객체지향의 개념 → 클래스와 객체(Circle) → 멤버 접근 . 과 범위 연산자 ::
        ↓
정보 은닉: public / private → getter · setter
        ↓
생성자 · 소멸자 · 기본 생성자 → 호출 순서
        ↓
(포인터·new/delete 복습) → 복사 생성자와 얕은/깊은 복사 → const 멤버 함수
```

> [!EXAM]
> 기말 족보의 클래스 문제는 세 가지입니다. ① **접근 가능 여부 O/X 표**(이 강의 3-3), ② **virtual 유무에 따른 출력**(07강), ③ **조건에 맞는 클래스 작성**(07강 끝). ①과 생성·소멸 **순서 추적**(4-4)은 이 강의만으로 풀 수 있어야 합니다.

> [!NOTE]
> **먼저 짚고 가기 — 이 강의에서 계속 쓰는 기초**
>
> - `#include <iostream>`과 `using namespace std;`를 쓰면 `cout << 값;`으로 화면에 출력합니다. `'\n'`은 줄바꿈입니다.
> - **함수**는 이름·매개변수·반환형을 가진 코드 묶음입니다. `double area() { return ...; }`는 "`double`을 돌려주는 매개변수 없는 함수 `area`"입니다.
> - **참조** `T&`는 기존 변수의 **별명**입니다. `void f(T& t)`로 받으면 복사본이 아니라 원본 그 자체를 다룹니다. `const T&`는 "원본을 별명으로 받되 바꾸지 않겠다"는 뜻입니다.
> - 포인터와 `new`/`delete`는 5장 복사 생성자에서 필요하므로 그 앞(5-0)에서 다시 설명합니다.

---

## 1. 객체지향이란

**객체지향**(Object Orientation)은 코드의 **신뢰성**과 **재사용성**을 높이기 위한 프로그래밍 패러다임입니다. 프로그래머는 현실의 대상을 본떠 객체의 **속성**(attribute)과 **동작**(behavior)을 정의합니다.

| 개념 | 뜻 | 이 과목에서 |
| --- | --- | --- |
| 추상화 (Abstraction) | 필요한 특징만 골라 모델로 만들기 | 원 → 반지름과 넓이 |
| 캡슐화 (Encapsulation) | 데이터와 그 데이터를 다루는 함수를 클래스로 묶기 | 클래스 정의 |
| 정보 은닉 (Information hiding) | 바깥에서 안을 못 보게 숨기기 | private / public |
| 상속 (Inheritance) | 기존 클래스를 물려받아 확장 | 07강 (3-3에서 맛보기) |
| 다형성 (Polymorphism) | 같은 호출이 실제 객체에 따라 다르게 동작 | 07강 |

이 다섯 개념이 **신뢰성**(Reliability)과 **재사용**(Reuse)이라는 두 목표로 이어집니다.

> [!NOTE]
> **비유로 이해하기 — 다섯 개념을 자동차로**
>
> - **추상화:** 운전 연수용 자동차 모델에는 "속도·연료·핸들"만 있으면 됩니다. 페인트 성분은 빼 버립니다. 필요한 것만 남기는 것이 추상화입니다.
> - **캡슐화:** 엔진과 그 엔진을 움직이는 장치를 **한 차체 안에** 묶어 둡니다.
> - **정보 은닉:** 운전자는 보닛을 열지 않고 **페달과 핸들**(공개 인터페이스)만 씁니다.
> - **상속:** "트럭"은 "자동차"의 모든 것을 물려받고 짐칸만 더합니다.
> - **다형성:** 같은 "시동" 버튼이라도 휘발유차와 전기차가 내부에서 하는 일은 다릅니다.

학생 두 명의 학번과 이름을 관리한다고 해 봅시다. 클래스 없이 쓰면 학생이 늘 때마다 변수가 두 개씩 늘고, 학번과 이름이 따로 놉니다. 클래스는 이 묶음을 **하나의 자료형**으로 만듭니다. 두 방식을 한 프로그램에 나란히 놓았습니다.

```cpp
#include <iostream>
using namespace std;

class Student {
public:
    int number;
    char name[20];
};

int main() {
    // 클래스 없이: 학번과 이름이 따로 논다
    int number1 = 1;  char name1[20] = "Kim";
    int number2 = 2;  char name2[20] = "Lee";
    cout << number1 << ' ' << name1 << '\n';
    cout << number2 << ' ' << name2 << '\n';

    // 클래스로: 한 학생 = 한 묶음
    Student s1 = {1, "Kim"};
    Student s2 = {2, "Lee"};
    s1.number = 10;                 // s1만 바뀐다
    cout << s1.number << ' ' << s1.name << '\n';
    cout << s2.number << ' ' << s2.name << '\n';
}
```

실행 결과

```text
1 Kim
2 Lee
10 Kim
2 Lee
```

`number1`과 `name1`은 이름만 비슷할 뿐 컴파일러가 보기엔 아무 관계가 없습니다. 반면 `s1`은 **학번과 이름을 함께 가진 하나의 값**이고, `s1.number`를 바꿔도 `s2.number`는 그대로입니다.

> [!NOTE]
> **비유로 이해하기 — 클래스는 붕어빵 틀, 객체는 붕어빵**
>
> 틀(`Student`)은 하나지만 붕어빵(`s1`, `s2`)은 여러 개 찍을 수 있고, 붕어빵마다 속(`number`, `name`)이 따로 있습니다. 틀만 있으면 먹을 것이 없듯이, **클래스를 정의만 해서는 객체가 생기지 않습니다.** `Student s1;`처럼 변수를 만들 때 비로소 메모리를 차지하는 객체가 생깁니다.
>
> 비유가 어긋나는 곳: 붕어빵은 구운 뒤 속을 못 바꾸지만, 객체는 만든 뒤에도 멤버 값을 바꿀 수 있습니다(`s1.number = 10`).

---

## 2. 클래스와 객체

[![Circle 클래스가 속성 radius와 메서드 area를 정의하고 그 클래스로 만든 네 객체가 각자 다른 radius를 가지는 그림](/materials/diagrams/cpp-06-class-objects.svg)](/materials/diagrams/cpp-06-class-objects.svg)

*그림 6-1 · 클래스와 객체 — 누르면 원본 크기로 열린다.*

C++의 **클래스**는 객체의 자료형입니다. 기술적으로는 C 구조체를 확장한 것이고, **데이터 멤버**(속성)와 **클래스 관련 함수**(메서드, 멤버 함수)로 이루어집니다. **객체**는 클래스의 인스턴스이고 실행 중에 메모리를 차지합니다.

```cpp
#include <iostream>
using namespace std;

class Circle {
public:
    double radius;                                   // 속성(데이터 멤버)
    double area() { return radius * radius * 3.141; } // 메서드(멤버 함수)
};

int main() {
    Circle c;              // 객체 생성 = 인스턴스화
    c.radius = 3.0;        // 멤버 접근 연산자 .
    double a = c.area();
    cout << "c: r=" << c.radius << " area=" << a << '\n';

    Circle d = {5.0};      // C 구조체식 초기화 (public 속성일 때만)
    cout << "d: r=" << d.radius << " area=" << d.area() << '\n';
}
```

실행 결과

```text
c: r=3 area=28.269
d: r=5 area=78.525
```

`c.area()`와 `d.area()`는 **같은 함수**지만, 안에서 쓰는 `radius`는 각각 **그 함수를 부른 객체의 것**(3과 5)입니다. 멤버 함수 안에서는 같은 객체의 다른 멤버를 이름만으로 씁니다.

### 2-1. 범위 연산자 `::`

클래스 안에는 원형(선언)만 두고, 메서드 본문을 **클래스 밖에** 쓸 수도 있습니다. 그때는 `클래스이름::함수이름`으로 **소속을 밝힙니다**(03강 네임스페이스의 `std::cout`과 같은 기호).

```cpp
#include <iostream>
using namespace std;

class Circle {
public:
    double radius;
    double area();                    // 원형만 — 공개 인터페이스
};

double Circle::area() {               // "Circle 소속의 area"라고 밝힘
    return radius * radius * 3.14159;
}

int main() {
    Circle c;
    c.radius = 2.0;
    cout << c.area() << '\n';
}
```

실행 결과

```text
12.5664
```

> [!NOTE]
> **비유로 이해하기 — `::`는 소속 표시**
>
> "김철수"만 쓰면 어느 김철수인지 모릅니다. "컴공과::김철수"라고 써야 누군지 정해집니다. `Circle::area`는 "**Circle 반의** area"이고, `Circle::area` 안에서 `radius`라고만 써도 Circle의 멤버를 뜻하게 됩니다. 소속을 빼고 `double area() { ... }`라고 쓰면 Circle과 아무 관계없는 **전역 함수**가 되어 `radius`를 찾지 못합니다.

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
> 함수 안에서 선언한 지역 변수 `i`가 멤버 `i`를 **가립니다**. 그래서 `i < i`는 지역 변수끼리 비교라 항상 거짓이고 합은 0입니다. 멤버를 쓰려면 `i < foo::i`(또는 `this->i`)라고 씁니다. `this`는 "이 함수를 부른 **나 자신** 객체의 주소"이고, `this->i`는 "내 멤버 i"라는 뜻입니다.
>
> 확인용 완전한 프로그램(바깥에서 값을 넣으려고 `public:`을 붙였습니다):
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class foo {
> public:
>     int i;          // 배열 원소 개수
>     int a[10];
>     int sum() {     // 슬라이드의 잘못된 버전
>         int i, x = 0;
>         for (i = 0; i < i; i++) x += a[i];   // 두 i 모두 지역 변수
>         return x;
>     }
>     int sum2() {    // 고친 버전
>         int i, x = 0;
>         for (i = 0; i < foo::i; i++) x += a[i];   // 오른쪽은 멤버 i
>         return x;
>     }
> };
>
> int main() {
>     foo f;
>     f.i = 3;
>     f.a[0] = 10; f.a[1] = 20; f.a[2] = 30;
>     cout << f.sum() << ' ' << f.sum2() << '\n';
> }
> ```
>
> 실행 결과
>
> ```text
> 0 60
> ```
>
> g++은 `-Wall`에서 `self-comparison always evaluates to false`(자기 자신과 비교하면 항상 거짓) 경고까지 띄워 줍니다.

### 2-2. 점(`.`)과 화살표(`->`)

객체의 멤버는 **점**(`.`)으로, 객체를 **가리키는 포인터**에서는 **화살표**(`->`)로 씁니다. 포인터는 "다른 변수의 **주소**를 담는 변수"입니다(`&s`는 s의 주소, `*p`는 p가 가리키는 그 객체).

```cpp
#include <iostream>
using namespace std;

class Student {               // 설계도 (새 자료형)
public:
    int number;               // 멤버 변수
    char name[20];

    void print() const {      // 멤버 함수(메서드)
        cout << number << ' ' << name << '\n';
    }
};                            // 세미콜론 필수

int main() {
    Student s = {1, "Kim"};   // 객체
    s.number = 7;             // 점 연산자로 멤버 접근
    s.print();

    Student* p = &s;          // p에는 s의 주소가 들어 있다
    p->number = 8;            // 포인터는 -> 사용
    (*p).print();             // p->print()와 같음
    p->print();
}
```

실행 결과

```text
7 Kim
8 Kim
8 Kim
```

- `p->print()`는 `(*p).print()`를 줄여 쓴 것입니다. `*p.print()`라고 쓰면 `.`이 `*`보다 먼저 묶여 `*(p.print())`가 되므로 오류입니다. 그래서 괄호가 필요하고, 그게 번거로워 `->`가 생겼습니다.
- `p->number = 8`로 바꾼 것은 `s` 자신입니다. `p`는 `s`의 복사본이 아니라 `s`를 **가리키기만** 하기 때문입니다.
- `print()` 뒤의 `const`는 6장에서 설명합니다("이 함수는 객체를 바꾸지 않는다").
- `class`의 기본 접근은 **private**, `struct`의 기본 접근은 **public**입니다. 그 밖에는 둘이 같습니다.

> [!NOTE]
> **비유로 이해하기 — `.`은 직접, `->`는 주소 쪽지를 들고**
>
> `s.number`는 집에 **직접 가서** 방을 여는 것이고, `p->number`는 **집 주소가 적힌 쪽지**(`p`)를 들고 찾아가 그 집의 방을 여는 것입니다. 쪽지를 아무리 복사해도 집은 하나라서, 어느 쪽지로 찾아가 고쳐도 같은 집이 바뀝니다.

> [!TRAP]
> 클래스 정의 끝의 `};`에서 **세미콜론을 빠뜨리면** 엉뚱한 줄에서 컴파일 오류가 납니다. 함수 정의 `}` 뒤에는 세미콜론이 없지만 클래스 정의 뒤에는 꼭 필요합니다.

---

## 3. 정보 은닉: public과 private

[![Circle 클래스의 private radius는 main에서 직접 접근할 수 없고 public 메서드 set_radius get_radius area를 통해서만 다루며 생성자와 소멸자가 함께 있는 그림](/materials/diagrams/cpp-06-encapsulation.svg)](/materials/diagrams/cpp-06-encapsulation.svg)

*그림 6-2 · private 속성은 public 메서드로 — 누르면 원본 크기로 열린다.*

`public`, `private`, `protected`는 속성과 메서드가 **어디서 보이는지**를 정합니다.

- **public:** 클래스 밖에서도 제한 없이 접근.
- **private:** 클래스 내부(그 클래스의 멤버 함수)에서만. 밖에서는 보이지 않으며, C 구조체식 초기화(`{5.0}`)도 안 됩니다.
- **protected:** 나와 나를 물려받은 클래스까지. 3-3에서 다룹니다.

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double radius;                              // 금고 안
public:
    double area() { return radius * radius * 3.14159; }
    void set_radius(double r) { radius = r; }   // setter
    double get_radius() { return radius; }      // getter (accessor)
};

int main() {
    Circle c;
    c.set_radius(2.0);
    cout << c.get_radius() << ' ' << c.area() << '\n';
}
```

실행 결과

```text
2 12.5664
```

`main`에서 `radius`를 직접 건드리면 어떻게 되는지 보겠습니다.

**컴파일 오류 예시**

```cpp
#include <iostream>
using namespace std;

class Circle {
private:
    double radius;
public:
    void set_radius(double r) { radius = r; }
    double get_radius() { return radius; }
};

int main() {
    Circle c;
    c.radius = 2.0;         // private에 직접 접근
    Circle d = {5.0};       // private이면 구조체식 초기화도 불가
    cout << c.get_radius() << d.get_radius() << '\n';
}
```

```text
error: 'double Circle::radius' is private within this context
error: could not convert '{5.0e+0}' from '<brace-enclosed initializer list>' to 'Circle'
```

> [!NOTE]
> **비유로 이해하기 — private은 금고, public 함수는 은행 창구**
>
> `private` 멤버는 은행 **금고** 안의 돈입니다. 손님(`main`)은 금고 문을 직접 열 수 없고, **창구 직원**(public 멤버 함수 `set_radius`, `get_radius`)에게 부탁해야 합니다. 직원은 금고 열쇠를 가진 은행 사람(클래스의 멤버)이라 금고를 열 수 있고, 부탁이 말이 되는지 검사한 뒤에만 처리합니다.

### 3-1. 왜 숨기나 (캡슐화)

통장 잔액을 `public`으로 두면 누구나 `acc.balance = -100000;`처럼 말이 안 되는 값을 넣을 수 있습니다. 데이터는 `private`으로 숨기고, 값을 바꿀 때는 **검사하는 함수**를 거치게 하면 실수를 막을 수 있습니다. 이렇게 데이터를 숨기고 함수로만 다루게 하는 것을 **캡슐화**라고 합니다.

```cpp
#include <iostream>
using namespace std;

class Account {
private:
    int balance = 0;                  // 밖에서 직접 못 건드림
public:
    int getBalance() const { return balance; }   // getter: 읽기
    void deposit(int amount) {                   // 검사 후 변경
        if (amount > 0) balance += amount;
        else cout << "거부: " << amount << '\n';
    }
};

int main() {
    Account acc;
    acc.deposit(1000);
    acc.deposit(-5000);               // 검사에 걸려 무시된다
    // acc.balance = -5;              // 컴파일 오류: private
    cout << acc.getBalance() << '\n';
}
```

실행 결과

```text
거부: -5000
1000
```

주석 처리한 `acc.balance = -5;`를 살리면 위 Circle과 똑같이 `'int Account::balance' is private within this context` 오류가 납니다.

값을 읽는 함수를 **getter**, 바꾸는 함수를 **setter**라고 부릅니다. 족보의 클래스 작성 문제에 꼭 나옵니다(07강 끝). `int balance = 0;`처럼 멤버 선언에 바로 기본값을 줄 수도 있습니다(C++11부터).

### 3-2. 세 가지 접근 지정자

| 지정자 | 같은 클래스 멤버 함수 | 파생 클래스 멤버 함수 | 클래스 밖(main 등) |
| --- | :---: | :---: | :---: |
| `public` | O | O | O |
| `protected` | O | O (조건 있음) | X |
| `private` | O | **X** | X |

- `public`: 누구나
- `protected`: 나와 **나를 물려받은 자식**까지
- `private`: **나만**

> [!NOTE]
> **비유로 이해하기 — 집 안의 세 공간**
>
> `public`은 **현관 앞 우편함**(누구나 넣고 볼 수 있음), `protected`는 **거실**(나와 내 자식은 들어옴, 손님은 못 들어옴), `private`는 **내 방 금고**(나만, 자식도 못 엶)입니다.

### 3-3. 다른 객체를 통한 접근 (O/X 표의 함정)

> [!NOTE]
> **먼저 짚고 가기 — 상속 한 줄 요약**
>
> `class B : public A { ... };`는 "B는 A의 멤버를 **모두 물려받고** 거기에 더한다"는 뜻입니다. 그래서 B 객체 안에는 A의 `x`, `y`, `z`가 들어 있습니다. 이때 A를 **기반(부모) 클래스**, B를 **파생(자식) 클래스**라고 부릅니다. 자세한 내용은 07강이지만, O/X 표는 이 한 줄만 알면 풀 수 있습니다.

접근 권한은 **객체 단위가 아니라 클래스 단위**입니다. 같은 클래스의 멤버 함수라면 **다른 객체의 private 멤버**에도 접근할 수 있습니다. 반면 `protected`는 파생 클래스에서 **자기 클래스(또는 그 파생) 객체를 통할 때만** 접근할 수 있습니다.

> [!NOTE]
> **비유로 이해하기 — 사원증은 회사 단위**
>
> A 회사 사원증(A의 멤버 함수)이 있으면 A 회사의 **어느 사물함**(어느 A 객체의 private)이든 열 수 있습니다. 내 사물함만 열리는 게 아닙니다. 그런데 자회사 B의 직원은 "B 소속 물건"으로 들어온 것(물려받은 내 `y`, B 객체를 통한 `y`)만 열 수 있고, 모회사 A 창고에 따로 있는 물건(`objA.y`)은 못 엽니다.

문제에 쓰이는 정의는 다음과 같습니다.

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

O 칸들을 실제 멤버 함수에 넣어 컴파일한 완전한 프로그램입니다. 각 클래스에 `inA`, `inB`, `inC` 멤버 함수를 추가했습니다.

```cpp
#include <iostream>
using namespace std;

class A {
public:    int x; A* pa;
protected: int y;
private:   int z;
public:
    void inA() {
        x = 1; y = 2; z = 3;        // 자기 멤버: 모두 O
        pa = this;                  // pa가 자기 자신을 가리키게
        pa->y = 20; pa->z = 30;     // 같은 클래스(A) 안: 다른 A 객체의 protected·private도 O
        cout << "A: " << x << ' ' << pa->y << ' ' << pa->z << '\n';
    }
};

class B : public A {               // B는 A를 물려받는다
public:
    A objA;
    void inB() {
        x = 1; y = 2;               // 물려받은 내 것: O  (z는 X)
        objA.x = 5;                 // 다른 A 객체의 public: O
        // objA.y = 6;              // X: 부모(A) 자료형 객체를 통한 protected
        cout << "B: " << x << ' ' << y << ' ' << objA.x << '\n';
    }
};

class C : public B {
public:
    C* pc; B objB;
    void inC() {
        y = 7;                      // 물려받은 내 것: O
        pc = this;
        pc->y = 8;                  // C 안에서 C 객체를 통한 protected: O
        objB.x = 9;                 // public: O
        // objB.y = 10;             // X: 부모(B) 자료형 객체를 통한 protected
        cout << "C: " << y << ' ' << objB.x << '\n';
    }
};

int main() {
    A a; a.inA();
    B b; b.inB();
    C c; c.inC();
}
```

실행 결과

```text
A: 1 20 30
B: 1 2 5
C: 8 9
```

`C`에서 `pc = this`이므로 `pc->y = 8`이 바꾼 것은 자기 자신의 `y`입니다. 그래서 바로 앞에서 넣은 7이 8로 바뀌어 출력됩니다.

X 칸들을 넣으면 이렇게 거부됩니다.

**컴파일 오류 예시**

```cpp
class A {
public:    int x; A* pa;
protected: int y;
private:   int z;
};
class B : public A {
public:
    A objA;
    void inB() {
        z = 1;          // X: A의 private
        objA.y = 2;     // X: 다른 A 객체의 protected
    }
};
class C : public B {
public:
    C* pc; B objB;
    void inC() { objB.y = 3; }   // X: B 객체를 통한 protected
};
int main() {}
```

```text
error: 'int A::z' is private within this context
error: 'int A::y' is protected within this context
error: 'int A::y' is protected within this context
```

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
> 모든 칸은 컴파일러로 확인한 결과입니다. `objB.x`는 `objB`가 C에만 선언되어 있으므로 A, B에서는 X입니다.

---

## 4. 생성자와 소멸자

**생성자**는 새 객체가 만들어질 때 자동으로 불리는 특별한 멤버 함수입니다. 인수가 다른 생성자를 여러 개 둘 수 있습니다(오버로딩). **소멸자**는 객체가 사라질 때 자동으로 불리며 **하나뿐이고 인수가 없습니다**.

> [!NOTE]
> **비유로 이해하기 — 생성자는 개업 준비, 소멸자는 폐업 정리**
>
> 가게가 문을 여는 순간(객체 생성) **개업 준비**(생성자: 간판 달기, 진열하기 = 멤버 초기화)가 자동으로 실행되고, 문을 닫는 순간(객체 소멸) **폐업 정리**(소멸자: 빌린 창고 반납, 정산)가 자동으로 실행됩니다. 손님(`main`)이 "이제 개업 준비 하세요"라고 따로 부르지 않아도 됩니다. 개업 방식은 여러 가지(생성자 여러 개)일 수 있지만, 폐업 정리 절차는 한 가지(소멸자 하나)입니다.

```cpp
#include <iostream>
using namespace std;

class Circle {
public:
    double radius;
    double area();
    Circle(double r);   // 생성자 원형
    Circle();           // 기본 생성자 (초기값 없이 만들 때)
    ~Circle();          // 소멸자
};

Circle::Circle(double r) { radius = r; cout << "Hello r=" << radius << '\n'; }
Circle::Circle()         { radius = 0; cout << "Hello r=0 (기본)\n"; }
Circle::~Circle()        { cout << "Goodbye Object r=" << radius << '\n'; }
double Circle::area()    { return radius * radius * 3.14159; }

int main() {
    Circle c = Circle(5.0);    // 또는 Circle c(5.0);
    Circle e;                  // 기본 생성자
    cout << c.area() << ' ' << e.area() << '\n';
}   // main이 끝날 때 e, c 순서로 "Goodbye Object"
```

실행 결과

```text
Hello r=5
Hello r=0 (기본)
78.5397 0
Goodbye Object r=0
Goodbye Object r=5
```

생성자도 범위 연산자로 밖에서 정의합니다: `Circle::Circle(double r)`은 "Circle 소속의, 이름이 Circle인 함수(생성자)"입니다. 소멸자는 `Circle::~Circle()`입니다. `main`이 끝날 때 **나중에 만든 `e`가 먼저** 사라진다는 점도 보세요(4-4).

### 4-1. 객체가 태어날 때와 죽을 때

객체를 만들면서 바로 값을 채우고 싶을 때가 많습니다. 생성자는 **객체가 만들어지는 순간 자동으로 불리는 함수**, 소멸자는 **사라지는 순간 자동으로 불리는 함수**입니다. 블록 `{ }` 안에서 만든 지역 객체는 그 블록이 끝날 때 사라집니다.

```cpp
#include <iostream>
using namespace std;

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
```

실행 결과

```text
켜짐(60W) 켜짐(100W) 꺼짐(100W) | 꺼짐(60W) 
```

| | 생성자 | 소멸자 |
| --- | --- | --- |
| 이름 | 클래스 이름 | `~클래스이름` |
| 반환형 | 없음 (`void`도 안 씀) | 없음 |
| 매개변수 | 가질 수 있음, 오버로딩 가능 | **없음**, 하나만 |
| 호출 시점 | 객체가 만들어질 때 자동 | 객체가 사라질 때 자동 |

### 4-2. 기본 생성자 규칙

매개변수가 없는 생성자(또는 모든 매개변수에 기본값이 있어 인수 없이 부를 수 있는 생성자)를 **기본 생성자**라고 합니다. `P a;`처럼 괄호 없이 만들거나 `P arr[3];`처럼 배열을 만들 때 불립니다.

- 생성자를 **하나도 안 만들면** 컴파일러가 기본 생성자를 만들어 줍니다.
- 매개변수 있는 생성자를 **하나라도 만들면** 기본 생성자는 자동으로 생기지 않습니다. 그러면 `P a;`와 `P arr[3];`은 **컴파일 오류**입니다.

> [!NOTE]
> **비유로 이해하기 — "기본 사양으로 주세요"**
>
> 가게에 주문 방법이 하나도 적혀 있지 않으면 주인이 알아서 **기본 사양**으로 만들어 줍니다(컴파일러가 만든 기본 생성자). 그런데 메뉴판에 "반지름을 말해 주세요"(`P(int v)`)라고 한 줄이라도 써 붙이면, 주인은 그 방식만 받습니다. 이때 "그냥 하나 주세요"(`P a;`)라고 하면 거절당합니다.

**컴파일 오류 예시**

```cpp
class P {
    int x;
public:
    P(int v) : x(v) {}
};

int main() {
    P b(3);       // OK
    P a;          // 컴파일 오류: P() 없음
    P arr[3];     // 컴파일 오류: 원소마다 P()가 필요
}
```

```text
error: no matching function for call to 'P::P()'
error: no matching function for call to 'P::P()'
```

고치려면 기본 생성자를 직접 추가하거나 기본값을 줍니다: `P(int v = 0) : x(v) {}`.

```cpp
#include <iostream>
using namespace std;

class P {
    int x;
public:
    P(int v = 0) : x(v) {}        // 기본값 → P()로도 부를 수 있다
    int get() const { return x; }
};

int main() {
    P a;          // x = 0
    P b(3);       // x = 3
    P arr[3];     // 세 개 모두 x = 0
    cout << a.get() << ' ' << b.get() << ' ' << arr[2].get() << '\n';
}
```

실행 결과

```text
0 3 0
```

### 4-3. 멤버 초기화 목록

생성자 이름 뒤 `:`부터 `{` 앞까지를 **멤버 초기화 목록**이라고 합니다. 위 `P(int v) : x(v) {}`의 `: x(v)`가 바로 그것으로, 멤버 `x`가 만들어지는 **그 순간에** `v`를 넣습니다.

```cpp
#include <iostream>
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
    const int id;          // const 멤버는 초기화 목록에서만 초기화 가능
public:
    Player(string n, int h, int i) : name(n), hp(h), id(i) {}
    void show() const { cout << id << ':' << name << " hp=" << hp << '\n'; }
};

int main() {
    Player p("Lee", 100, 7);
    p.show();
}
```

실행 결과

```text
7:Lee hp=100
```

본문 `{ }` 안에서 `id = i;`라고 쓰면 이미 만들어진 `const` 멤버에 **대입**하는 것이 되어 오류입니다. "만들면서 넣기(초기화)"와 "만든 뒤에 넣기(대입)"가 다르다는 점이 핵심입니다. `const` 멤버와 참조 멤버(`int& r;`)는 반드시 초기화 목록을 써야 합니다.

**컴파일 오류 예시**

```cpp
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
    const int id;
public:
    Player(string n, int h, int i) {
        name = n; hp = h;
        id = i;            // 이미 만들어진 const 멤버에 대입 → 오류
    }
};

int main() { Player p("Lee", 100, 7); }
```

```text
error: uninitialized const member in 'const int' [-fpermissive]
error: assignment of read-only member 'Player::id'
```

> [!NOTE]
> **비유로 이해하기 — 콘크리트에 새긴 이름**
>
> 초기화 목록은 **콘크리트가 굳기 전에** 이름을 새기는 것이고, 본문 `{ }`은 **굳은 뒤에** 새기려는 것입니다. 보통 멤버는 굳은 뒤에도 페인트로 덧칠(대입)할 수 있지만, `const` 멤버는 굳으면 끝이라 반드시 굳기 전(초기화 목록)에 새겨야 합니다.

> [!TRAP]
> 멤버는 초기화 목록에 **적힌 순서가 아니라 클래스에 선언된 순서**대로 초기화됩니다. 아래 코드는 `b(v)`를 먼저 적었지만 선언이 `a`, `b` 순서라 `a(b + 1)`이 먼저 실행되고, 그 순간 `b`는 아직 값이 없습니다(쓰레기 값을 읽는 **정의되지 않은 동작**이므로 출력은 정해져 있지 않습니다).
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class Pair {
>     int a;
>     int b;
> public:
>     Pair(int v) : b(v), a(b + 1) {}   // 목록에 b를 먼저 적었지만...
>     void show() const { cout << "a=" << a << " b=" << b << '\n'; }
> };
>
> int main() {
>     Pair p(10);
>     p.show();
> }
> ```
>
> g++ `-Wall`은 이렇게 경고합니다.
>
> ```text
> warning: 'Pair::b' will be initialized after [-Wreorder]
> warning:   'int Pair::a' [-Wreorder]
> warning: member 'Pair::b' is used uninitialized [-Wuninitialized]
> ```
>
> 습관적으로 초기화 목록을 **선언 순서대로** 적으면 이 문제를 피할 수 있습니다.

### 4-4. 호출 순서 (시험 최빈출)

```text
생성: 기반 클래스 → 멤버 객체(선언 순서) → 자기 생성자 본문
소멸: 정확히 반대  (자기 소멸자 본문 → 멤버(선언 역순) → 기반)
```

여기서 **멤버 객체**는 다른 클래스의 객체를 멤버로 가진 것(`Part p1;`)이고, **기반 클래스**는 3-3에서 본 "물려준 부모 클래스"(`class Derived : public Base`의 `Base`)입니다.

> [!NOTE]
> **비유로 이해하기 — 집짓기와 철거**
>
> 집을 짓는 순서로 생각하세요. **기초**(기반 클래스)를 먼저 놓고, **방**(멤버 객체)을 설계도 순서대로 들이고, 마지막에 **입주**(자기 생성자 본문)합니다. 철거는 정반대로, 이사 나가고(자기 소멸자 본문) → 방을 빼고(멤버, 역순) → 기초를 허뭅니다(기반). 기초부터 허물면 집이 무너지니까요.
>
> 지역 객체 여러 개는 **접시 쌓기**와 같습니다. 나중에 올린 접시(나중에 만든 객체)를 먼저 내립니다.

- 지역 객체는 블록을 벗어날 때, **생성의 역순**으로 소멸합니다(먼저 만든 것이 나중에 사라짐).
- `new`로 만든 객체는 `delete`할 때 소멸합니다. `delete`하지 않으면 소멸자가 불리지 않습니다(`new`/`delete`는 5-0 참고).
- 전역 객체는 `main` 전에 생성되고 `main`이 끝난 뒤 소멸합니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> #include <string>
> using namespace std;
>
> class Part {
>     string n;
> public:
>     Part(string s) : n(s) { cout << "P(" << n << ") "; }
>     ~Part() { cout << "~P(" << n << ") "; }
> };
>
> class Base {
> public:
>     Base() { cout << "B "; }
>     ~Base() { cout << "~B "; }
> };
>
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
> 기반(B) → 멤버 선언 순서(p1, p2) → 자기 본문(D). 초기화 목록에 `p2`를 먼저 적어도 선언 순서를 따릅니다(g++도 `-Wreorder` 경고로 알려 줍니다). 소멸은 정확히 반대입니다. 위 프로그램을 실제로 실행한 출력입니다.

> [!QUIZ]
> 다음 출력을 쓰시오. (`Trace`는 생성자에서 `이름+`, 소멸자에서 `이름-`를 출력한다.)
>
> ```cpp
> #include <iostream>
> #include <string>
> using namespace std;
>
> class Trace {
>     string name;
> public:
>     Trace(string n) : name(n) { cout << name << "+ "; }
>     ~Trace() { cout << name << "- "; }
> };
>
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
> 전역 `g`는 `main` 전에 생성, 맨 마지막에 소멸합니다. `b`는 블록 끝에서, `p`는 `delete`할 때 소멸합니다. `main`이 끝나면 지역 객체가 생성 역순(c → a)으로 소멸합니다. 위 프로그램을 실제로 실행한 출력입니다.

---

## 5. 복사 생성자와 얕은 / 깊은 복사

### 5-0. 먼저 짚고 가기: 주소, 포인터, new / delete

> [!NOTE]
> **먼저 짚고 가기 — 05강 내용 요약**
>
> - 모든 변수는 메모리의 어떤 칸에 살고, 그 칸의 위치가 **주소**입니다. `&n`은 "n의 주소"입니다.
> - **포인터** `int* p`는 `int` 칸의 **주소를 담는 변수**입니다. `*p`는 "p가 가리키는 칸의 **값**"입니다.
> - 포인터를 다른 포인터에 대입하면(`int* q = p;`) **주소만** 복사됩니다. 그러면 `p`와 `q`는 **같은 칸**을 가리키므로 `*q`를 바꾸면 `*p`도 바뀐 것으로 보입니다.
> - `new int(7)`은 실행 중에 **힙**이라는 영역에서 `int` 한 칸을 빌려 7을 넣고, 그 **주소**를 돌려줍니다. 빌린 칸은 `delete p;`로 **직접 반납**할 때까지 남아 있습니다.
> - 반납을 잊으면 **메모리 누수**, 이미 반납한 칸을 또 반납하면 **이중 해제**(정의되지 않은 동작, 보통 프로그램이 비정상 종료)입니다.

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 42;
    int* p = &n;            // p에는 n의 주소가 들어 있다
    *p = 100;               // p가 가리키는 칸(n)에 100
    cout << n << '\n';

    int* h = new int(7);    // 힙에 int 한 칸을 빌리고 7을 넣음, 주소를 h에
    cout << *h << '\n';
    int* h2 = h;            // 주소만 복사 → 같은 칸을 가리킴
    *h2 = 9;
    cout << *h << ' ' << (h == h2) << '\n';
    delete h;               // 빌린 칸 반납 (한 번만!)
}
```

실행 결과

```text
100
7
9 1
```

`(h == h2)`가 `1`(참)이라는 것은 두 포인터가 **같은 주소**를 담고 있다는 뜻입니다. `h2`로 바꾼 9가 `*h`로도 보입니다. 칸은 하나뿐이므로 `delete`도 한 번만 합니다. 이 "주소만 복사하면 같은 칸을 공유한다"가 5-2 얕은 복사 문제의 전부입니다.

> [!NOTE]
> **비유로 이해하기 — 창고 대여와 반납**
>
> `new`는 **창고를 빌리고 창고 번호(주소)가 적힌 쪽지**를 받는 것, `delete`는 **창고를 반납**하는 것입니다. 쪽지를 복사하면(`h2 = h`) 쪽지는 두 장이지만 창고는 하나입니다. 쪽지를 잃어버리고 반납도 안 하면 그 창고는 영영 아무도 못 쓰는데, 이것이 **메모리 누수**입니다. 이미 반납한 창고를 또 반납하려 하면(이중 해제) 관리소가 난리가 납니다.

### 5-1. 복사 생성자가 불리는 때

복사 생성자 `T(const T& other)`는 **새 객체를 기존 객체로 초기화할 때** 호출되는 생성자입니다. 원본을 `const` 참조로 받는 이유는 ① 원본을 바꾸지 않기 위해서, ② 값으로 받으면 그 매개변수를 만들려고 또 복사 생성자를 불러야 해서(무한 반복)입니다. 직접 만들지 않으면 컴파일러가 "멤버를 하나씩 그대로 복사하는" 복사 생성자를 만들어 줍니다.

구분의 핵심은 **새 객체가 태어나는가**입니다.

| 코드 | 호출되는 것 | 새 객체가 태어나나 |
| --- | --- | :---: |
| `T b = a;` | 복사 생성자 (`=`가 있어도 **초기화**) | O |
| `T c(a);` | 복사 생성자 | O |
| `c = b;` (이미 있는 객체) | **대입 연산자** `operator=` | X |
| `void f(T t)`에 `f(a)` | 복사 생성자 (값 전달) | O (매개변수 t) |
| `void f(T& t)`에 `f(a)` | 아무것도 안 불림 (참조) | X |
| `catch (T e)` | 복사 생성자 | O |

`operator=`는 "이미 있는 객체에 `=`로 값을 넣을 때 불리는 멤버 함수"입니다. 직접 만들지 않으면 컴파일러가 멤버를 하나씩 대입하는 버전을 만들어 줍니다(07강 연산자 오버로딩에서 자세히).

> [!TRAP]
> `T b = a;`에 `=`가 보인다고 대입 연산자를 고르면 틀립니다. **선언과 동시에 쓰는 `=`는 초기화**이고, 이미 있는 변수에 쓰는 `=`만 대입입니다.

> [!QUIZ]
> 생성자는 `D `, 복사 생성자는 `C `, 대입 연산자는 `A `를 출력한다. 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class T {
> public:
>     T() { cout << "D "; }                               // 생성자
>     T(const T&) { cout << "C "; }                       // 복사 생성자
>     T& operator=(const T&) { cout << "A "; return *this; } // 대입 연산자
> };
>
> void byVal(T) {}   // 값 전달
> void byRef(T&) {}  // 참조 전달
>
> int main() {
>     T a;
>     T b = a;
>     T c(a);
>     c = b;
>     byVal(a);
>     byRef(a);
>     cout << '\n';
> }
> ```

> [!ANSWER]
> `D C C A C` — `T b = a`는 대입이 아니라 복사 **초기화**입니다. `byVal(a)`는 매개변수를 새로 만들므로 복사 생성자, `byRef`는 별명으로 받으므로 아무것도 복사하지 않습니다. 위 프로그램을 실제로 실행한 출력입니다.

### 5-2. 얕은 복사의 문제

컴파일러가 만든 기본 복사 생성자는 멤버를 **그대로 복사**합니다. 멤버가 포인터면 5-0에서 본 것처럼 **주소만** 복사되어 두 객체가 같은 메모리를 공유합니다(얕은 복사). 한쪽을 바꾸면 다른 쪽도 바뀌고, 둘 다 소멸자에서 `delete`하면 **이중 해제**가 됩니다.

```text
얕은 복사 (기본)                    깊은 복사 (직접 작성)
a.v ──┐                            a.v ──▶ [ 1 ]
      ├──▶ [ 1 ]                   b.v ──▶ [ 1 ]   ← 새로 빌린 칸
b.v ──┘                            
같은 칸을 공유 → b를 바꾸면 a도 바뀜   따로따로 → 서로 영향 없음
```

> [!NOTE]
> **비유로 이해하기 — 열쇠 복사 vs 집 통째로 복사**
>
> **얕은 복사**는 **열쇠만 복사**하는 것입니다. 열쇠가 두 개가 되었을 뿐 집은 하나라서, 동생이 자기 열쇠로 들어가 벽지를 바꾸면 내 집 벽지도 바뀝니다. 둘 다 이사 나가면서 "집을 철거(delete)"하면 같은 집을 두 번 철거하려는 사고(이중 해제)가 납니다.
>
> **깊은 복사**는 **똑같은 집을 한 채 더 짓고** 그 집 열쇠를 주는 것입니다. 처음엔 내용이 똑같지만 이후로는 서로 영향이 없고, 각자 자기 집만 철거하면 됩니다.

먼저 복사 생성자도 소멸자도 직접 만들지 **않은** `Box`입니다. (소멸자가 없으므로 `main` 끝에서 직접 한 번만 `delete`합니다.)

```cpp
#include <iostream>
using namespace std;

class Box {                 // 복사 생성자·소멸자를 직접 만들지 않음
public:
    int* v;
    Box(int x) { v = new int(x); }
};

int main() {
    Box a(1);
    Box b = a;              // 기본 복사 생성자: v의 "주소"만 복사
    *b.v = 5;               // b를 바꿨는데...
    cout << *a.v << ' ' << (a.v == b.v) << '\n';
    delete a.v;             // 칸은 하나뿐이므로 한 번만 반납
}
```

실행 결과

```text
5 1
```

`b`만 바꿨는데 `a`도 5가 되었고, 두 주소가 같습니다(`1`). 여기에 `~Box() { delete v; }`만 추가하고 복사 생성자는 그대로 두면, `main`이 끝날 때 `b`와 `a`의 소멸자가 **같은 칸을 두 번** `delete`합니다. 이것은 정의되지 않은 동작이라 출력을 정할 수 없고, 실제로는 보통 프로그램이 비정상 종료합니다.

이제 깊은 복사 생성자를 직접 쓴 `Box`입니다.

```cpp
#include <iostream>
using namespace std;

class Box {
public:
    int* v;
    Box(int x) { v = new int(x); }
    Box(const Box& o) { v = new int(*o.v); }   // 깊은 복사: 새 칸 + 값 복사
    ~Box() { delete v; }                        // 각자 자기 칸만 반납
};

int main() {
    Box a(1);
    Box b = a;              // 직접 만든 복사 생성자가 불림
    *b.v = 5;
    cout << *a.v << ' ' << (a.v == b.v) << '\n';
}                           // b, a 순서로 소멸 → 각자 다른 칸 delete → 안전
```

실행 결과

```text
1 0
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
>
> 두 `Box`의 완전한 프로그램과 실행 결과는 바로 위 5-2 본문에 있습니다.

### 5-3. 대입 연산자도 같은 문제를 가진다

복사 생성자만 깊게 만들어도 끝이 아닙니다. 이미 있는 객체끼리 `c = a;`를 하면 복사 생성자가 아니라 **대입 연산자**가 불리고(5-1 표), 컴파일러가 만든 대입 연산자도 포인터의 **주소만** 복사합니다. 포인터 멤버가 있는 클래스라면 대입 연산자도 직접 써야 안전합니다.

```cpp
#include <iostream>
using namespace std;

class Box {
public:
    int* v;
    Box(int x) { v = new int(x); }
    Box(const Box& o) { v = new int(*o.v); }      // 복사 생성자: 깊은 복사
    Box& operator=(const Box& o) {                 // 대입 연산자: 깊은 복사
        if (this != &o) {        // 자기 자신에게 대입(a = a) 대비
            *v = *o.v;           // 내 칸은 이미 있으니 값만 옮긴다
        }
        return *this;
    }
    ~Box() { delete v; }
};

int main() {
    Box a(1), c(3);
    c = a;                  // 이미 있는 c에 대입 → operator=
    *c.v = 7;
    cout << *a.v << ' ' << *c.v << ' ' << (a.v == c.v) << '\n';
}
```

실행 결과

```text
1 7 0
```

> [!TRAP]
> 소멸자에서 `delete`를 하는 클래스(= 자원을 직접 관리하는 클래스)라면 **소멸자 · 복사 생성자 · 대입 연산자** 세 개를 함께 직접 써야 합니다. 하나만 쓰고 나머지를 컴파일러에 맡기면 그 경로로 얕은 복사가 일어납니다. 이것을 흔히 **3의 법칙**(Rule of Three)이라고 부릅니다.

---

## 6. const 멤버 함수

멤버 함수 뒤의 `const`는 "이 함수는 객체를 바꾸지 않는다"는 약속입니다. **const 객체는 const 멤버 함수만** 호출할 수 있습니다. `const Cnt&`로 받은 매개변수도 const 객체처럼 취급됩니다.

```cpp
#include <iostream>
using namespace std;

class Cnt {
    int v;
public:
    Cnt(int x = 0) : v(x) {}
    int get() const { return v; }   // 읽기만 → const
    void inc() { v++; }             // 바꿈 → const 아님
};

void show(const Cnt& c) {          // const 참조로 받음
    cout << c.get() << '\n';       // const 함수라서 호출 가능
}

int main() {
    Cnt n(1);
    n.inc();                        // 일반 객체: 둘 다 호출 가능
    show(n);
    const Cnt k(5);
    cout << k.get() << '\n';        // OK
}
```

실행 결과

```text
2
5
```

const 객체로 `inc()`를 부르거나, const 함수 안에서 멤버를 바꾸면 컴파일러가 막습니다.

**컴파일 오류 예시**

```cpp
class Cnt {
    int v;
public:
    Cnt(int x = 0) : v(x) {}
    int get() const { return v; }
    void inc() { v++; }
    void bad() const { v++; }       // const 함수 안에서 멤버 변경
};

int main() {
    const Cnt k(5);
    k.get();      // OK
    k.inc();      // const 객체로 const 아닌 함수 호출
}
```

```text
error: increment of member 'Cnt::v' in read-only object
error: passing 'const Cnt' as 'this' argument discards qualifiers [-fpermissive]
```

두 번째 오류의 `this`는 "멤버 함수를 부른 객체 자신"입니다. "const인 `k`를 const 아닌 함수(`inc`)에 넘기면 const라는 보호(qualifier)를 버리게 된다"는 뜻입니다.

> [!NOTE]
> **비유로 이해하기 — 박물관 관람**
>
> `const` 객체는 **박물관 전시품**이고, `const` 멤버 함수는 **"눈으로만 보세요" 관람 코스**입니다. 전시품에는 관람 코스(`get`)만 허용되고, 손대는 체험(`inc`)은 금지입니다. 관람 코스 안내원(const 함수)이 몰래 전시품을 만지려 하면(`v++`) 그 자리에서 제지당합니다.

> [!NOTE]
> getter처럼 **읽기만 하는 함수에는 습관적으로 `const`를 붙이세요.** 그래야 `const` 객체나 `const T&` 매개변수로 받은 객체에서도 그 함수를 부를 수 있습니다. const 멤버 함수 안에서 멤버를 바꾸려 하면(`v++`) 컴파일 오류가 나서 실수를 막아 줍니다.

---

## 핵심 정리

1. 객체지향 = 추상화·캡슐화·정보 은닉·상속·다형성 → 신뢰성과 재사용.
2. 클래스는 속성(데이터 멤버)과 메서드를 묶은 자료형(붕어빵 틀), 객체는 그 인스턴스(붕어빵). 변수를 만들 때 생긴다.
3. 멤버는 `.`(포인터면 `->`)으로, 클래스 밖 정의는 `클래스::메서드`로.
4. private은 클래스 안에서만(금고), public은 어디서나(창구). 데이터는 private, getter·setter는 public. 접근 권한은 객체가 아니라 클래스 단위이고, 파생 클래스의 protected 접근은 자기 클래스 객체를 통할 때만.
5. 생성자는 여러 개 가능, 소멸자는 하나·인수 없음. 생성자를 하나라도 만들면 기본 생성자는 자동으로 생기지 않는다. const 멤버는 초기화 목록에서만, 멤버는 선언 순서대로 초기화.
6. 생성: 기반 → 멤버(선언 순서) → 자신, 소멸은 반대. 지역 객체는 생성 역순으로 소멸, `new`로 만든 객체는 `delete`할 때 소멸.
7. `T b = a;`는 복사 생성자, `c = b;`는 대입 연산자. 포인터 멤버의 기본 복사는 얕은 복사(열쇠 복사)라 공유·이중 해제 문제 → 깊은 복사(집 복사)를 직접 쓴다. 읽기 전용 메서드에는 `const`.

---

## 학습 경로

[← 05 오버로딩·포인터·동적 메모리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-05) · [07 상속·다형성·연산자 오버로딩 →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-07)
