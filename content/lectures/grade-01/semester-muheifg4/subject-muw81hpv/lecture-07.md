---
title: "상속·다형성·연산자 오버로딩"
description: "Circle 클래스 전체를 먼저 보여 주고 그것을 물려받는 Cylinder로 상속과 오버라이딩, 기반 생성자 호출, protected 접근을 익힌 뒤, 포인터·new·delete 복습과 함께 힙 객체, 다형성과 virtual 동적 바인딩, 가상 소멸자·추상 클래스, static 멤버, friend, this, 클래스와 파일, 연산자 오버로딩을 Lecture 10 순서로 설명합니다. 모든 예제는 그대로 컴파일되는 완전한 프로그램과 실제 실행 결과로 제시합니다."
order: 7
published: true
duration: 110
---

# 상속·다형성·연산자 오버로딩

**슬라이드:** Lecture 10 (10–11주차) · Inheritance (protected), Method Overriding, Polymorphism, static, friend, this, Operator Overloading

원(`Circle`) 클래스를 물려받아 원기둥(`Cylinder`) 클래스를 만들면서 상속과 다형성을 배우고, 클래스에 붙는 나머지 기능(static, friend, this, 연산자 오버로딩)을 정리합니다. 이 강의만 읽어도 이해할 수 있도록 **필요한 클래스는 매번 전체 코드로** 보여 주고, 모든 예제는 그대로 복사해 컴파일하면 돌아가는 **완전한 프로그램**과 그 **실제 실행 결과**로 제시합니다.

---

## 학습 흐름

```text
먼저 짚고 가기(클래스·객체·생성자) → 이 강의의 Circle 전체 코드
        ↓
상속(Circle → Cylinder) → 오버라이딩 → 기반 생성자 호출 → protected
        ↓
먼저 짚고 가기(포인터·new·delete) → 힙 객체 → 다형성 → virtual과 동적 바인딩 → 가상 소멸자 · 추상 클래스
        ↓
static 멤버 → friend → this → 클래스와 파일
        ↓
연산자 오버로딩(함수 / 메서드) → 오버로딩할 수 있는 연산자와 제한
```

---

## 0. 출발점: 클래스 복습과 이 강의의 Circle

> [!CONCEPT]
> **먼저 짚고 가기 — 클래스, 객체, 생성자, 멤버 함수**
>
> - **클래스(class)**: 새 자료형의 **설계도**. 데이터(**속성**, 멤버 변수)와 그 데이터를 다루는 함수(**메서드**, 멤버 함수)를 묶습니다.
> - **객체(object)**: 설계도로 실제로 만든 것. `Circle c(10);`이라고 쓰는 순간 메모리에 원 하나가 생깁니다.
> - **접근 지정자**: `public`은 어디서나, `private`은 클래스 안에서만 쓸 수 있습니다. `protected`는 이 강의 2절에서 다룹니다(클래스 안 + 물려받은 클래스 안).
> - **생성자(constructor)**: 클래스 이름과 같고 반환형이 없는 함수. 객체가 만들어질 때 **자동으로** 한 번 불려 속성을 초기화합니다. `Circle()`처럼 인자가 없으면 **기본 생성자**입니다.
> - **소멸자(destructor)**: `~Circle()`. 객체가 사라질 때 자동으로 불립니다.
> - **멤버 접근**: 객체는 `c.area()`처럼 점(`.`)으로, 클래스 밖에서 메서드 본문을 쓸 때는 `Circle::area`처럼 범위 연산자 `::`로 소속을 밝힙니다.
> - **const 멤버 함수**: `double get_radius() const`처럼 끝에 `const`가 붙으면 "이 함수는 객체를 바꾸지 않는다"는 약속입니다. `const` 객체나 `const` 참조로도 부를 수 있게 됩니다.

> [!NOTE]
> **비유로 이해하기 — 붕어빵 틀과 붕어빵**
>
> 클래스는 **붕어빵 틀**, 객체는 그 틀로 구운 **붕어빵**입니다. 틀 하나로 팥 붕어빵, 슈크림 붕어빵을 여러 개 구울 수 있듯이, `Circle` 클래스 하나로 반지름이 다른 원 객체를 여러 개 만듭니다. 생성자는 붕어빵을 꺼낼 때 속을 채우는 순간(초기화), 소멸자는 다 먹고 봉지를 치우는 순간입니다. 틀만 있다고 붕어빵이 생기지 않듯, **클래스를 정의만 해서는 객체가 생기지 않습니다.**

이 강의 전체에서 쓰는 `Circle`은 아래와 같습니다. 06강의 Circle(반지름 `radius`, 기본 생성자·반지름 생성자, `set_radius`/`get_radius`, `area`)과 같은 모양이고, 상속을 위해 세 가지만 달라졌습니다.

| 06강 Circle과 다른 점 | 이유 |
| --- | --- |
| `radius`가 `private` → **`protected`** | 물려받는 `Cylinder`가 `radius`를 직접 쓰게 하려고 (2절) |
| `area()` 앞에 **`virtual`** | 기반 포인터로 불러도 실제 객체의 `area`가 불리게 하려고 (3절) |
| 소멸자가 **`virtual ~Circle() {}`** | 기반 포인터로 `delete`해도 파생 소멸자가 불리게 하려고 (3-4절). 06강처럼 "Goodbye Object"를 찍으면 출력이 길어져 여기서는 비워 둡니다. |

```cpp
// 이 강의의 Circle (모든 예제에서 이 코드를 그대로 씁니다)
class Circle {
protected:
    double radius;                           // 반지름: 파생 클래스도 직접 쓸 수 있게 protected
public:
    Circle() { radius = 0; }                 // 기본 생성자
    Circle(double r) { radius = r; }         // 반지름을 받는 생성자
    virtual ~Circle() {}                     // 소멸자 (virtual인 이유는 3-4절)
    void set_radius(double r) { radius = r; }        // setter
    double get_radius() const { return radius; }     // getter
    virtual double area() const {                    // 원의 넓이 (virtual은 3절)
        return radius * radius * 3.14159;
    }
};
```

위 코드는 클래스 **정의만** 있는 문법 모양입니다. 바로 아래 1절의 프로그램이 이 Circle을 그대로 포함한 완전한 프로그램입니다.

---

## 1. 상속: Circle에서 Cylinder로

[![기반 클래스 Circle의 protected radius와 virtual area를 파생 클래스 Cylinder가 물려받아 height와 volume을 더하고 area를 오버라이딩하며 생성자에서 Circle r을 먼저 호출하는 UML 그림](/materials/diagrams/cpp-07-inheritance.svg)](/materials/diagrams/cpp-07-inheritance.svg)

*그림 7-1 · Circle과 Cylinder — 누르면 원본 크기로 열린다.*

기존 클래스를 물려받아 새 클래스를 만들 수 있습니다. 새 클래스는 기존 클래스의 **특수화**(specialization)로, 멤버와 메서드를 **더하거나 바꿀** 수 있습니다. 동기는 **기존 코드의 재사용**입니다.

| 용어 | 뜻 |
| --- | --- |
| 기반 클래스 (base class, superclass) | 물려주는 쪽 — Circle |
| 파생 클래스 (derived class, subclass) | 물려받는 쪽 — Cylinder |

**파생 클래스의 객체는 기반 클래스의 객체이기도 합니다.** (원기둥은 원의 성질을 모두 가짐 — 이것이 다형성의 출발점.)

> [!NOTE]
> **비유로 이해하기 — 원기둥은 "원을 밑면으로 가진 확장판"**
>
> 원기둥을 만들려고 원을 처음부터 다시 설계할 필요는 없습니다. 이미 있는 원(반지름, 넓이 계산)을 **그대로 물려받고**, 원기둥에만 필요한 것(높이, 부피)을 **덧붙이면** 됩니다. 부모에게 집과 살림살이를 물려받은 자식이 방 하나를 더 짓고, 낡은 부엌은 자기 방식으로 고치는(오버라이딩) 것과 같습니다. 단, 이 비유는 "부모 것이 자식에게 옮겨 간다"는 느낌을 주지만, 실제로는 Cylinder 객체 **안에** Circle 부분이 통째로 들어 있는 구조입니다. 부모(Circle 클래스)는 그대로 남아 있고 원 객체도 계속 만들 수 있습니다.

```text
Cylinder 객체 cy 의 메모리 모양
┌──────────────────────────────┐
│ Circle 부분:  radius = 10    │ ← 물려받은 부분 (Circle 생성자가 채움)
│ Cylinder 부분: height = 5    │ ← 새로 더한 부분 (Cylinder 생성자가 채움)
└──────────────────────────────┘
```

**완전한 프로그램 — Circle 전체 + Cylinder**

```cpp
#include <iostream>
using namespace std;

// ---- 기반 클래스: Circle (원) ----
class Circle {
protected:
    double radius;                           // 파생 클래스(Cylinder)도 직접 쓸 수 있게 protected
public:
    Circle() { radius = 0; }                 // 기본 생성자
    Circle(double r) { radius = r; }         // 반지름을 받는 생성자
    virtual ~Circle() {}                     // 소멸자 (virtual인 이유는 3-4절)
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    virtual double area() const {            // 원의 넓이 (virtual은 3절에서 설명)
        return radius * radius * 3.14159;
    }
};

// ---- 파생 클래스: Cylinder (원기둥) ----
class Cylinder : public Circle {             // Cylinder는 Circle의 subclass
private:
    double height;                           // 원기둥에만 있는 속성
public:
    Cylinder(double r, double h);
    double volume() const;                   // 새로 더한 메서드
    double area() const;                     // 오버라이딩: 원기둥 겉넓이
};

Cylinder::Cylinder(double r, double h) : Circle(r) {   // 기반 생성자를 먼저 호출
    height = h;
}
double Cylinder::volume() const {
    return Circle::area() * height;                      // 밑넓이 × 높이
}
double Cylinder::area() const {
    return Circle::area() * 2 + (2 * radius * 3.14159) * height;   // 두 밑면 + 옆면
}

int main() {
    Circle c(10);
    Cylinder cy(10, 5);

    cout << "원 넓이: " << c.area() << '\n';
    cout << "원기둥 반지름: " << cy.get_radius() << '\n';   // 물려받은 메서드
    cout << "원기둥 밑넓이: " << cy.Circle::area() << '\n'; // 기반 버전 직접 호출
    cout << "원기둥 겉넓이: " << cy.area() << '\n';         // 오버라이딩한 버전
    cout << "원기둥 부피: " << cy.volume() << '\n';         // 새로 더한 메서드
    return 0;
}
```

**실행 결과**

```text
원 넓이: 314.159
원기둥 반지름: 10
원기둥 밑넓이: 314.159
원기둥 겉넓이: 942.477
원기둥 부피: 1570.8
```

한 줄씩 읽어 봅시다.

- `class Cylinder : public Circle` — "Cylinder는 Circle을 public으로 물려받는다". 그래서 Cylinder에는 직접 쓰지 않은 `radius`, `get_radius()`, `set_radius()`가 이미 들어 있습니다(`cy.get_radius()`가 10).
- **메서드 오버라이딩:** 파생 클래스가 기반의 메서드를 **같은 모양**(이름·매개변수·const까지)으로 다시 정의. `cy.area()`는 Cylinder의 겉넓이(942.477)입니다. 기반 버전은 `Circle::area()`로 부를 수 있습니다(`cy.Circle::area()`가 밑넓이 314.159).
- **기반 생성자 호출:** 파생 생성자의 초기화 목록에 `: Circle(r)`을 적습니다. Cylinder 객체 안의 Circle 부분은 **Circle 생성자가** 만들어야 하기 때문입니다. 실행 순서는 `Circle(r)` → Cylinder 생성자 본문(`height = h`).
- `Cylinder::area()` 안에서 `radius`를 바로 쓸 수 있는 것은 Circle에서 `radius`가 **protected**이기 때문입니다(private이었다면 `get_radius()`를 거쳐야 함).
- 겉넓이 계산: 밑면 두 개 `314.159 × 2 = 628.318` + 옆면 `2 × 10 × 3.14159 × 5 = 314.159` = 942.477. 부피는 `314.159 × 5 = 1570.795`인데 `cout`은 기본으로 유효숫자 6자리까지 찍으므로 `1570.8`로 보입니다.

> [!TRAP]
> 기반 생성자를 초기화 목록에 적지 않으면 **기반의 기본 생성자** `Circle()`이 자동으로 불립니다. 그러면 `radius`는 0이 됩니다. 기반에 기본 생성자가 아예 없다면 컴파일 오류이므로, 파생 생성자의 초기화 목록에서 **직접 호출**해야 합니다: `Cylinder(double r, double h) : Circle(r) { … }`.

### 1-1. "~은 ~이다" 관계

생쥐는 동물입니다. 동물이 가진 것(번호, 번호 읽기·쓰기)을 생쥐도 모두 가지고, 생쥐만의 기능을 더합니다. 이렇게 **기존 클래스를 물려받아** 새 클래스를 만드는 것이 상속입니다. 물려주는 쪽을 **기반(부모) 클래스**, 물려받는 쪽을 **파생(자식) 클래스**라고 합니다.

> [!NOTE]
> **비유로 이해하기 — "is-a" 시험**
>
> 상속을 써도 되는지는 "**파생은 기반이다**"라는 문장이 자연스러운지로 판단합니다. "생쥐는 동물이다", "원기둥은 (밑면이 원인) 원의 확장이다"는 자연스럽습니다. "자동차는 바퀴다"는 어색합니다. 자동차는 바퀴를 **가지고 있을** 뿐이므로 상속이 아니라 멤버 변수로 넣습니다(has-a).

```cpp
#include <iostream>
using namespace std;

class Animal {
protected:
    int id;
public:
    Animal() : id(0) { cout << "Animal() "; }
    ~Animal() { cout << "~Animal() "; }
    int getId() const { return id; }
    void setId(int v) { id = v; }
};

class Mouse : public Animal {         // public 상속
public:
    Mouse() { cout << "Mouse() "; }   // Animal()이 먼저 자동 호출
    ~Mouse() { cout << "~Mouse() "; }
    void print() const { cout << "id=" << id << ' '; }   // protected라서 접근 가능
};

int main() {
    {
        Mouse m;
        m.setId(7);      // Animal에서 물려받은 함수
        m.print();
    }                    // 블록 끝: m 소멸
    cout << '\n';
    return 0;
}
```

**실행 결과**

```text
Animal() Mouse() id=7 ~Mouse() ~Animal() 
```

- `Mouse`에는 `setId`가 없지만 `Animal`에서 물려받았으므로 `m.setId(7)`이 됩니다.
- `id`가 `protected`라서 파생 클래스 `Mouse`의 멤버 함수가 직접 쓸 수 있습니다. `private`이었다면 `getId()`를 거쳐야 합니다.
- 생성은 부모 → 자식, 소멸은 자식 → 부모입니다.

> [!NOTE]
> **비유로 이해하기 — 생성·소멸 순서는 건물 짓기와 철거**
>
> 건물은 **1층(기반)을 먼저 짓고 2층(파생)을 올립니다**. 철거할 때는 **2층부터 헐고 1층을 헙니다**. 파생 생성자가 기반 부분을 믿고 쓰려면 기반이 먼저 완성되어 있어야 하고, 파생 소멸자가 정리하는 동안 기반 부분이 아직 살아 있어야 하기 때문입니다.

기반 클래스에 기본 생성자가 없으면 파생 클래스 생성자의 초기화 목록에서 **직접 호출**해야 합니다: `Dog(string n) : Animal(n) {}`(위 1절의 `: Circle(r)`과 같은 원리).

### 1-2. 상속 종류별 접근 표

상속할 때 `public`/`protected`/`private`을 붙입니다. 이것은 "물려받은 멤버의 접근 수준을 **최소 몇까지 낮출지**"를 정합니다.

| 기반 멤버 \ 상속 | `public` 상속 | `protected` 상속 | `private` 상속 |
| --- | --- | --- | --- |
| public | public | protected | private |
| protected | protected | protected | private |
| private | 접근 불가 | 접근 불가 | 접근 불가 |

> [!NOTE]
> 표 외우는 요령: **둘 중 더 좁은 쪽**을 고릅니다. 넓은 순서는 public > protected > private. 예를 들어 public 멤버를 protected 상속하면 둘 중 좁은 protected가 됩니다. 단, 기반의 private은 어떤 상속이든 파생 클래스에서 **보이지 않습니다**.
>
> 비유하자면 상속 지정자는 물려받은 물건에 씌우는 **포장의 최소 두께**입니다. public 상속은 원래 포장 그대로, protected 상속은 "적어도 가족 전용", private 상속은 "적어도 나 혼자만". 원래 더 두꺼운 포장(기반의 private)은 얇아지지 않습니다.

결과 확인(`A`의 `x`: public, `y`: protected, `z`: private / `D : ? A` / `G : public D`):

| 상속 | D 안 `x`, `y` | D 안 `z` | main에서 `d.x` | G(손자) 안 `x`, `y` |
| --- | :---: | :---: | :---: | :---: |
| public | O | X | **O** | O |
| protected | O | X | **X** | O |
| private | O | X | **X** | **X** |

**완전한 프로그램 — 표의 O 칸만 사용 (X 칸은 주석 처리)**

```cpp
#include <iostream>
using namespace std;

class A {
public:    int x = 1;
protected: int y = 2;
private:   int z = 3;
};

class DPub  : public A    { public: int sum() { return x + y; } };   // z는 못 씀
class DProt : protected A { public: int sum() { return x + y; } };
class DPriv : private A   { public: int sum() { return x + y; } };

class GPub  : public DPub  { public: int sum2() { return x + y; } };  // 손자도 OK
class GProt : public DProt { public: int sum2() { return x + y; } };  // 손자도 OK
// class GPriv : public DPriv { public: int sum2() { return x + y; } }; // 오류: 손자는 못 씀

int main() {
    DPub a; DProt b; DPriv c;
    cout << a.sum() << ' ' << b.sum() << ' ' << c.sum() << '\n';
    cout << a.x << '\n';        // public 상속만 main에서 x 접근 가능
    // cout << b.x;             // 오류: protected 상속 → x가 protected
    // cout << c.x;             // 오류: private 상속 → x가 private
    GPub g1; GProt g2;
    cout << g1.sum2() << ' ' << g2.sum2() << '\n';
    return 0;
}
```

**실행 결과**

```text
3 3 3
1
3 3
```

**컴파일 오류 예시 — 표의 X 칸을 실제로 써 보면**

```cpp
#include <iostream>
using namespace std;

class A {
public:    int x = 1;
protected: int y = 2;
private:   int z = 3;
};

class DProt : protected A { };
class DPriv : private A { };
class GPriv : public DPriv {
public:
    int sum2() { return x + y; }   // 손자 클래스에서 x 사용
};

int main() {
    DProt b;
    cout << b.x;                   // main에서 protected 상속된 x 사용
    return 0;
}
```

**g++ 오류 메시지 (핵심 줄)**

```text
error: 'int A::x' is private within this context
error: 'int A::y' is private within this context
error: 'int A::x' is inaccessible within this context
```

앞의 두 줄은 손자 `GPriv` 안(private 상속으로 `x`, `y`가 DPriv의 private이 됨), 마지막 줄은 `main`의 `b.x`(protected 상속으로 `x`가 protected가 됨)에서 난 오류입니다.

> [!TRAP]
> - private 멤버는 어떤 상속에서도 파생 클래스가 **직접** 쓸 수 없습니다. 기반의 public getter/setter를 거쳐야 합니다.
> - `class D : A`처럼 상속 지정자를 생략하면 **private 상속**입니다(`struct`면 public).

---

## 2. protected 접근

**protected** 속성·메서드는 **파생 클래스에서는 접근 가능**하고, 그 밖에서는 private처럼 막힙니다. 0절의 Circle에서 `radius`를 protected로 둔 덕분에 1절의 `Cylinder::area()`가 `radius`를 직접 쓸 수 있었습니다.

```cpp
// 문법 모양 — 0절 Circle의 앞부분 (전체 프로그램은 1절)
class Circle {
protected:
    double radius;      // Cylinder::area()가 radius를 직접 쓸 수 있는 이유
public:
    virtual double area() const;
};
```

> [!NOTE]
> **비유로 이해하기 — public은 거실, protected는 가족 방, private은 개인 금고**
>
> public은 손님(클래스 밖의 아무 코드)도 들어오는 **거실**, private은 그 클래스 혼자만 여는 **금고**, protected는 **가족(파생 클래스)만 들어가는 방**입니다. 단, 이 "가족 방" 비유에는 함정이 있습니다. C++에서 파생 클래스가 들어갈 수 있는 것은 **자기 집의** 가족 방(자기 객체 안의 물려받은 부분)뿐이고, 남의 집(기반 자료형의 다른 객체) 가족 방까지 열어 주지는 않습니다. 아래 표의 `c1.x`가 바로 그 경우입니다.

**슬라이드 12의 접근 표** — `class C1 { protected: int x; };`, `class C2 : public C1`, 상관없는 `class C3`에서 멤버 함수 안에 `C1 c1; C2 c2;`가 있을 때:

| 어디서 | `x = 2;` (자기 것) | `c1.x = 2;` | `c2.x = 2;` |
| --- | :---: | :---: | :---: |
| C1 안 | O | O | — |
| C2 안 (파생) | O | **X** | O |
| C3 안 (무관) | X | X | X |

C2 안에서도 **C1 자료형 객체를 통한** protected 접근(`c1.x`)은 안 됩니다. 06강에서 본 "다른 객체를 통한 접근" O/X 표와 같은 규칙입니다.

**컴파일 오류 예시 — C2 안에서 C1 객체의 protected 접근**

```cpp
class C1 {
protected:
    int x;
};

class C2 : public C1 {
public:
    void test() {
        C1 c1;
        C2 c2;
        x = 2;       // O: 자기(C2 객체)의 물려받은 x
        c2.x = 2;    // O: 같은 C2 자료형 객체를 통한 접근
        c1.x = 2;    // X: C1 자료형 객체를 통한 접근
    }
};

int main() {
    C2 obj;
    obj.test();
    return 0;
}
```

**g++ 오류 메시지 (핵심 줄)**

```text
error: 'int C1::x' is protected within this context
```

오류는 `c1.x = 2;` 줄 하나에서만 납니다. `x = 2;`와 `c2.x = 2;`는 통과합니다.

---

## 3. 힙 객체와 다형성

> [!CONCEPT]
> **먼저 짚고 가기 — 주소, 포인터, new, delete**
>
> - 모든 변수는 메모리의 어딘가에 있고, 그 위치가 **주소**입니다. `&n`은 "n의 주소".
> - **포인터**는 주소를 담는 변수입니다. `int* p = &n;`이면 `p`에는 `n`의 주소가 들어 있고, `*p`는 "그 주소로 가서 본 값", 즉 `n` 자체입니다.
> - 지금까지의 변수(`int n;`, `Circle c(10);`)는 **스택**에 생겨서 블록 `{ }`이 끝나면 자동으로 사라집니다.
> - `new 자료형`은 **힙**(프로그램이 직접 관리하는 메모리)에 공간을 빌리고 그 **주소**를 돌려줍니다. 그래서 받는 쪽은 포인터입니다: `int* h = new int(5);`
> - 힙에 빌린 것은 블록이 끝나도 사라지지 않습니다. 다 쓰면 반드시 `delete h;`로 반납합니다. 배열은 `new 자료형[개수]`로 빌리고 `delete[]`로 반납합니다.
> - 포인터로 객체의 멤버를 쓸 때는 `->`를 씁니다. `c->area()`는 `(*c).area()`와 같습니다.

> [!NOTE]
> **비유로 이해하기 — 주소가 적힌 쪽지, 창고 대여와 반납**
>
> 포인터는 **집 주소가 적힌 쪽지**입니다. 쪽지 자체는 집이 아니지만, 쪽지를 따라가면(`*p`, `p->`) 집에 도착합니다. `new`는 **창고를 대여**하고 창고 주소가 적힌 쪽지를 받는 것, `delete`는 **창고를 반납**하는 것입니다. 반납을 잊으면 아무도 못 쓰는 빈 창고가 계속 쌓이는데, 이것이 **메모리 누수**입니다. 비유가 어긋나는 점: 반납한 뒤에도 쪽지(포인터)는 손에 남아 있고, 그 주소로 다시 찾아가면(해제 후 사용) 무슨 일이 일어날지 알 수 없습니다(정의되지 않은 동작). 쪽지만 남았다고 창고가 내 것은 아닙니다.

**포인터와 new/delete 기초 프로그램**

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 42;
    int* p = &n;            // p에는 n의 주소가 들어 있다
    cout << *p << '\n';     // *p: 주소를 따라가서 값 읽기 → 42
    *p = 7;                 // 주소를 따라가서 값 바꾸기
    cout << n << '\n';      // n이 바뀌었다 → 7

    int* h = new int(5);    // 힙에 int 하나를 빌리고 그 주소를 받음
    cout << *h << '\n';     // 5
    delete h;               // 빌린 것 반납

    int* arr = new int[3];  // 배열을 빌릴 때는 new[]
    for (int i = 0; i < 3; i++) arr[i] = i * 10;
    cout << arr[0] << ' ' << arr[1] << ' ' << arr[2] << '\n';
    delete[] arr;           // 배열은 delete[]로 반납
    return 0;
}
```

**실행 결과**

```text
42
7
5
0 10 20
```

[![Circle 포인터 cir1이 Cylinder 객체를 가리킬 때 area가 virtual이면 Cylinder의 area를, 아니면 Circle의 area를 호출하는 결정 흐름](/materials/diagrams/cpp-07-dynamic-binding.svg)](/materials/diagrams/cpp-07-dynamic-binding.svg)

*그림 7-2 · 정적 바인딩과 동적 바인딩 — 누르면 원본 크기로 열린다.*

**힙 객체** — 객체도 `new`로 힙에 만들 수 있고, `new`는 포인터를 돌려줍니다. 다 쓰면 `delete`로 지웁니다. 배열은 `new[]`/`delete[]`. C++에는 Java·C#처럼 **자동 가비지 컬렉션이 없습니다.**

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle() { radius = 0; }
    Circle(double r) { radius = r; }
    virtual ~Circle() {}
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    virtual double area() const {
        return radius * radius * 3.14159;
    }
};

int main() {
    Circle s(1);                    // 스택 객체: 블록이 끝나면 자동으로 사라짐
    Circle* c = new Circle(9);      // 힙 객체: new가 주소(포인터)를 돌려줌
    cout << s.area() << '\n';       // 객체로 멤버 접근은 .
    cout << c->area() << '\n';      // 포인터로 멤버 접근은 ->
    cout << (*c).area() << '\n';    // c->area()와 같은 뜻
    delete c;                       // 다 쓰면 직접 반납 (가비지 컬렉션 없음)

    Circle* many = new Circle[3];   // 객체 배열: 기본 생성자 Circle()이 3번 불림
    many[1].set_radius(2);
    cout << many[0].get_radius() << ' ' << many[1].area() << '\n';
    delete[] many;                  // new[]로 만든 것은 delete[]로
    return 0;
}
```

**실행 결과**

```text
3.14159
254.469
254.469
0 12.5664
```

`new Circle[3]`처럼 객체 배열을 만들 때는 인자를 줄 수 없으므로 **기본 생성자** `Circle()`이 필요합니다. 그래서 `many[0]`의 반지름이 0입니다.

**다형성** — 파생 클래스 객체는 기반 클래스 객체를 다루도록 만든 코드 어디에나 쓸 수 있습니다. 원기둥은 원이기도 하므로, **`Circle*` 포인터가 `Cylinder` 객체를 가리킬 수 있습니다.**

**가상 함수와 동적 바인딩** — 기반 클래스에서 `virtual`로 선언한 메서드는 파생 클래스가 오버라이딩했을 때 **실행 중에 실제 객체를 보고** 구현을 고릅니다(동적 바인딩). 그래서 아래 코드의 `cir1->area()`는 **Cylinder의 area 함수**, 즉 `Cylinder::area()`를 부릅니다. virtual이 없으면 포인터 자료형(Circle)의 것이 불립니다.

> [!NOTE]
> **비유로 이해하기 — 리모컨 버튼은 같은데 기기마다 다르게 동작**
>
> 만능 리모컨(기반 포인터 `Circle*`)의 "넓이" 버튼을 누른다고 합시다. **virtual이면** 리모컨이 지금 연결된 기기(실제 객체)를 확인하고 그 기기의 동작을 합니다. 원기둥에 연결돼 있으면 원기둥 겉넓이를 계산합니다. **virtual이 아니면** 리모컨은 자기 몸에 적힌 이름표("Circle용")만 보고 원 넓이 동작을 해 버립니다. 이 비유의 한계: 리모컨으로 누를 수 있는 버튼은 **리모컨에 있는 버튼(기반 클래스에 있는 함수)뿐**입니다. Cylinder에만 있는 `volume()`은 `Circle*`로 부를 수 없습니다.

**완전한 프로그램 — Circle* 로 Cylinder 가리키기 (virtual 있음)**

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle() { radius = 0; }
    Circle(double r) { radius = r; }
    virtual ~Circle() {}
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    virtual double area() const {
        return radius * radius * 3.14159;
    }
};

class Cylinder : public Circle {
private:
    double height;
public:
    Cylinder(double r, double h) : Circle(r) { height = h; }
    double volume() const { return Circle::area() * height; }
    double area() const {                                      // 오버라이딩
        return Circle::area() * 2 + (2 * radius * 3.14159) * height;
    }
};

int main() {
    Cylinder* cyl = new Cylinder(10, 5);
    Circle* cir1 = cyl;                 // 기반 포인터로 파생 객체를 가리킴 (다형성)
    Circle& ref = *cyl;                 // 기반 참조도 마찬가지

    cout << cyl->area() << '\n';        // Cylinder 포인터 → Cylinder::area
    cout << cir1->area() << '\n';       // virtual → 실제 객체(Cylinder)의 area
    cout << ref.area() << '\n';         // 참조도 실제 객체 기준
    // cir1->volume();                  // 오류: Circle에는 volume()이 없다
    delete cyl;
    return 0;
}
```

**실행 결과**

```text
942.477
942.477
942.477
```

**비교 — 같은 프로그램에서 Circle의 `area()` 앞 `virtual`만 지우면** (Circle의 그 줄이 `double area() const {`가 되고 나머지는 위와 똑같음)

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle() { radius = 0; }
    Circle(double r) { radius = r; }
    virtual ~Circle() {}
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    double area() const {          // virtual을 지움
        return radius * radius * 3.14159;
    }
};

class Cylinder : public Circle {
private:
    double height;
public:
    Cylinder(double r, double h) : Circle(r) { height = h; }
    double volume() const { return Circle::area() * height; }
    double area() const {                                      // 오버라이딩
        return Circle::area() * 2 + (2 * radius * 3.14159) * height;
    }
};

int main() {
    Cylinder* cyl = new Cylinder(10, 5);
    Circle* cir1 = cyl;                 // 기반 포인터로 파생 객체를 가리킴 (다형성)
    Circle& ref = *cyl;                 // 기반 참조도 마찬가지

    cout << cyl->area() << '\n';        // Cylinder 포인터 → Cylinder::area
    cout << cir1->area() << '\n';       // virtual 없음 → 포인터 자료형(Circle)의 area
    cout << ref.area() << '\n';         // 참조 자료형(Circle)의 area
    delete cyl;
    return 0;
}
```

**실행 결과**

```text
942.477
314.159
314.159
```

같은 Cylinder 객체인데도 `Circle*`·`Circle&`로 부르면 원 넓이(314.159)가 나옵니다. 컴파일러가 **포인터·참조에 적힌 자료형**만 보고 함수를 정했기 때문입니다(정적 바인딩).

> [!TRAP]
> 오버라이딩은 **모양이 완전히 같아야** 합니다. 기반이 `virtual double area() const`인데 파생에서 `double area()`처럼 `const`를 빠뜨리면 오버라이딩이 아니라 **다른 함수**가 되어, `cir1->area()`가 다시 Circle의 것을 부릅니다(g++는 `-Wall`에서 "was hidden" 경고만 냄). 파생 함수 뒤에 `override`를 붙여 두면 이런 실수가 **컴파일 오류**로 잡힙니다: `error: 'double Cylinder::area()' marked 'override', but does not override`.

### 3-1. 이름이 같은 함수 세 경우

| 용어 | 뜻 |
| --- | --- |
| 오버로딩 | **같은 범위**에서 이름이 같고 매개변수가 다른 함수 여러 개 |
| 오버라이딩 | 파생 클래스가 기반의 **virtual** 함수를 같은 형태로 다시 정의 |
| 가리기(hiding) | 파생 클래스에 같은 **이름**을 선언하면 기반의 같은 이름 함수가 **모두** 가려짐 |

> [!NOTE]
> **비유로 이해하기 — 가리기는 같은 이름표를 덧붙인 것**
>
> 파생 클래스가 `f`라는 이름표를 하나 붙이면, 컴파일러는 이름 `f`를 찾을 때 **파생 클래스에서 먼저 찾고 거기서 멈춥니다**. 기반에 있는 `f()`, `f(int)`는 아래층에 그대로 있지만 위층 이름표에 가려 안 보입니다. 아래층 것을 쓰려면 `d.H::f()`처럼 "아래층(H)의 f"라고 정확히 불러야 합니다.

**컴파일 오류 예시 — 가려진 기반 함수 호출**

```cpp
#include <iostream>
using namespace std;

class H {
public:
    void f()      { cout << "H::f() "; }
    void f(int)   { cout << "H::f(int) "; }
};
class HD : public H {
public:
    void f(int)   { cout << "HD::f(int) "; }   // H의 f()와 f(int)를 모두 가림
};

int main() {
    HD d;
    d.f(1);
    d.f();         // 가려진 H::f() 호출 시도
    return 0;
}
```

**g++ 오류 메시지 (핵심 줄)**

```text
error: no matching function for call to 'HD::f()'
```

**고친 프로그램 — 기반 이름을 직접 지정**

```cpp
#include <iostream>
using namespace std;

class H {
public:
    void f()      { cout << "H::f() "; }
    void f(int)   { cout << "H::f(int) "; }
};
class HD : public H {
public:
    void f(int)   { cout << "HD::f(int) "; }   // H의 f()와 f(int)를 모두 가림
};

int main() {
    HD d;
    d.f(1);        // HD::f(int)
    d.H::f();      // 기반 이름을 직접 지정하면 OK
    d.H::f(2);     // 가려진 H::f(int)도 이렇게 부름
    cout << '\n';
    return 0;
}
```

**실행 결과**

```text
HD::f(int) H::f() H::f(int) 
```

### 3-2. 왜 virtual이 필요한가

동물 여러 마리를 **한 배열**에 담아 한꺼번에 "소리 내!"라고 시키고 싶다고 합시다. 강아지와 고양이는 자료형이 다르므로 한 배열에 담으려면 **기반 클래스 포인터**(`Animal*`)를 씁니다.

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual void sound() { cout << "... "; }   // virtual!
    virtual ~Animal() {}
};
class Dog : public Animal {
public:
    void sound() override { cout << "멍 "; }
};
class Cat : public Animal {
public:
    void sound() override { cout << "야옹 "; }
};

int main() {
    Dog d;
    Cat c;
    Animal* zoo[2] = {&d, &c};          // 자료형이 달라도 Animal*로 한 배열에
    for (Animal* a : zoo) a->sound();   // 각자 자기 소리
    cout << '\n';
    return 0;
}
```

**실행 결과**

```text
멍 야옹 
```

`a`의 자료형은 모두 `Animal*`인데, `virtual` 덕분에 **실제로 가리키는 객체**(Dog, Cat)의 함수가 불립니다. 이것이 **다형성**입니다. `override`는 "기반의 virtual 함수를 오버라이딩한다"는 표시로, 붙이지 않아도 동작은 같지만 실수를 잡아 줍니다. Animal의 `sound()` 앞 `virtual`(과 파생 쪽 `override`)을 지우면 둘 다 `Animal::sound()`가 불려 다음처럼 출력됩니다(실제로 그렇게 바꿔 실행한 결과).

```text
... ... 
```

> [!NOTE]
> `virtual`이 없으면 컴파일러는 **포인터에 적힌 자료형**만 보고 함수를 정합니다(정적 바인딩, 컴파일 때 결정). `virtual`이 있으면 실행 중에 **포인터가 실제로 가리키는 객체**를 보고 정합니다(동적 바인딩). 리모컨(포인터)에 "TV"라고 적혀 있어도, virtual이면 실제 연결된 기기에 맞는 동작을 하는 셈입니다.

### 3-3. virtual: 포인터·참조로 부를 때 실제 객체의 함수

| 호출 방법 | virtual이 아닌 함수 | virtual 함수 |
| --- | --- | --- |
| 객체로 직접 `obj.f()` | 객체의 자료형 | 객체의 자료형 |
| 기반 포인터 `p->f()` / 기반 참조 `r.f()` | **포인터·참조의 자료형**(정적 바인딩) | **실제 객체의 자료형**(동적 바인딩) |
| 기반 **값**으로 복사 `C1 s = obj;` | 기반 | **기반** (잘려서 기반 객체가 됨: 슬라이싱) |

> [!NOTE]
> **슬라이싱**: `C1 s = obj;`는 C2 객체를 C1 크기의 **새 상자**에 복사합니다. C2에만 있는 부분은 상자에 안 들어가 잘려 나가고, `s`는 처음부터 끝까지 **진짜 C1 객체**가 됩니다. 그래서 virtual이어도 C1의 함수가 불립니다. 다형성은 **포인터와 참조**로만 일어납니다.
>
> 비유하자면 포인터·참조는 원기둥을 **가리키는 손가락**이라 가리키는 대상이 여전히 원기둥이지만, 값 복사는 원기둥을 **원 모양 틀로 찍어 낸 새 물건**이라 이미 그냥 원입니다.

> [!EXAM]
> virtual이 **기반 클래스에** 붙어 있어야 합니다. 기반에는 없고 파생 클래스에서만 `virtual`을 붙이면, **기반 포인터로 부를 때는 여전히 기반 함수**가 실행됩니다. 기반에서 한 번 virtual이면 파생에서 `virtual`을 생략해도 virtual입니다.

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class C1 {
> public:
>     void f() { cout << "C1f "; }
>     virtual void g() { cout << "C1g "; }
> };
> class C2 : public C1 {
> public:
>     void f() { cout << "C2f "; }
>     void g() override { cout << "C2g "; }
> };
>
> int main() {
>     C2 obj;
>     C1* p = &obj;
>     C1& r = obj;
>     C1 s = obj;
>     p->f(); p->g(); r.f(); r.g(); s.g(); obj.f();
>     cout << '\n';
>     return 0;
> }
> ```

> [!ANSWER]
> ```text
> C1f C2g C1f C2g C1g C2f
> ```
>
> `f`는 virtual이 아니므로 포인터·참조의 자료형(C1)을 따릅니다. `g`는 virtual이라 실제 객체(C2)를 따릅니다. `s`는 C1 **값**으로 복사된 객체라서 C1의 `g`가 불립니다. `obj.f()`는 객체로 직접 불렀으므로 C2의 `f`입니다.

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class car {
> public:
>     void showa() { cout << "baseA "; }
>     virtual void showb() { cout << "baseB "; }
>     virtual ~car() {}
> };
> class rcar : public car {
> public:
>     virtual void showa() { cout << "derA "; }
>     void showb() { cout << "derB "; }
> };
>
> int main() {
>     car* p = new rcar;
>     p->showa();
>     p->showb();
>     rcar* q = new rcar;
>     q->showa();
>     cout << '\n';
>     delete p;
>     delete q;
>     return 0;
> }
> ```

> [!ANSWER]
> `baseA derB derA`
>
> - `showa`는 **기반 car에서 virtual이 아니므로** car 포인터로는 car의 것이 불립니다(파생에서 붙인 virtual은 소용없음).
> - `showb`는 기반에서 virtual이므로 파생에서 `virtual`을 안 써도 오버라이딩됩니다.
> - `q`는 rcar 포인터이므로 rcar의 `showa`입니다.
> - `virtual ~car() {}`는 `delete p;`를 안전하게 하려고 넣은 것입니다(3-4절). 출력에는 영향이 없습니다.

### 3-4. 가상 소멸자

기반 포인터로 파생 객체를 `delete`하려면 기반 소멸자가 **virtual**이어야 합니다. 아니면 파생 소멸자가 불리지 않습니다(표준상 UB). 소멸자도 함수라서 3-2의 규칙이 그대로 적용되는 것입니다.

> [!NOTE]
> **비유로 이해하기 — 폐업 정리는 2층 가게부터**
>
> 소멸자는 **폐업 정리**입니다. 2층(파생)에 입주한 가게가 따로 창고(힙 메모리)를 빌려 썼다면, 폐업할 때 2층 가게가 먼저 창고를 반납하고 그다음 1층(기반)이 정리해야 합니다. 기반 소멸자가 virtual이 아니면 `Circle*` 같은 기반 포인터로 폐업을 지시했을 때 **1층에만 연락이 가고** 2층의 창고 반납이 빠질 수 있습니다.

**완전한 프로그램 — virtual 소멸자**

```cpp
#include <iostream>
using namespace std;

class VB {
public:
    virtual ~VB() { cout << "~VB "; }       // 기반 소멸자가 virtual
};
class VD : public VB {
    int* data;
public:
    VD() { data = new int[100]; }           // 파생 클래스가 힙 메모리를 빌림
    ~VD() { delete[] data; cout << "~VD "; } // 소멸자에서 반납
};

int main() {
    VB* q = new VD;     // 기반 포인터로 파생 객체를 가리킴
    delete q;           // virtual 소멸자 → ~VD가 먼저, 그다음 ~VB
    cout << '\n';
    return 0;
}
```

**실행 결과**

```text
~VD ~VB 
```

**virtual이 아니면?** 위 프로그램에서 `virtual ~VB()`를 `~VB()`로 바꾼(이름은 NB/ND) `NB* p = new ND; delete p;`는 C++ 표준상 **정의되지 않은 동작**(UB)이라 "정답 출력"이 없습니다. g++로 실행하면 보통 `~NB`만 찍히고 `~ND`가 불리지 않아 `data`의 `new int[100]`이 반납되지 않습니다(**메모리 누수**). g++는 `-Wall`에서 "deleting object of polymorphic class type … which has non-virtual destructor might cause undefined behavior" 같은 경고로 알려 줍니다. 시험에서는 "virtual이 아니면 파생 소멸자가 불리지 않는다(보통 `~NB`만)"로 답하면 됩니다.

파생 클래스가 `new`로 빌린 메모리를 소멸자에서 반납한다면, 파생 소멸자가 불리지 않는 순간 **메모리 누수**가 됩니다. 그래서 virtual 함수가 하나라도 있는 기반 클래스는 소멸자도 virtual로 만듭니다. 0절의 Circle에 `virtual ~Circle() {}`이 있는 이유입니다.

### 3-5. 추상 클래스

`virtual double area() const = 0;`처럼 `= 0`인 함수를 **순수 가상 함수**라 하고, 하나라도 있으면 **추상 클래스**입니다. 추상 클래스는 객체를 만들 수 없고(`Shape s;` 컴파일 오류), 포인터·참조로만 씁니다. 파생 클래스가 모두 구현해야 객체를 만들 수 있습니다.

> [!NOTE]
> **비유로 이해하기 — 빈칸이 있는 계약서**
>
> 추상 클래스는 "도형이라면 **넓이를 구하는 방법을 반드시 적을 것**"이라는 빈칸이 있는 **계약서 양식**입니다. 빈칸이 남은 양식으로는 실제 계약(객체)을 맺을 수 없고, 사각형·삼각형처럼 빈칸을 채운 파생 클래스만 객체가 될 수 있습니다. 양식 자체는 "도형을 가리키는 손가락(`Shape*`)"으로는 얼마든지 쓸 수 있습니다.

```cpp
#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;   // 순수 가상 함수: "넓이를 구할 수 있어야 한다"는 약속만
    virtual ~Shape() {}
};
class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }          // 약속을 지킴
};
class Tri : public Shape {
    double b, h;
public:
    Tri(double b, double h) : b(b), h(h) {}
    double area() const override { return b * h / 2; }
};

int main() {
    // Shape s;                     // 컴파일 오류: 추상 클래스는 객체를 못 만듦
    Shape* sp = new Rect(2, 3);
    cout << sp->area() << '\n';     // 6
    delete sp;

    Rect r(4, 5);
    Tri t(4, 5);
    Shape* list[2] = {&r, &t};      // 추상 클래스 포인터는 OK
    for (Shape* s : list) cout << s->area() << ' ';
    cout << '\n';
    return 0;
}
```

**실행 결과**

```text
6
20 10 
```

주석 처리한 `Shape s;`를 살리면 g++는 다음 오류를 냅니다.

```text
error: cannot declare variable 's' to be of abstract type 'Shape'
```

"도형"이라는 막연한 것은 넓이를 계산할 수 없으니 객체로 만들 수 없고, "사각형"처럼 구체적인 도형만 만들 수 있다는 뜻입니다.

---

## 4. static 멤버

[![foo 클래스의 static cnt는 클래스에 하나만 있고 세 객체가 함께 쓰며 일반 속성 i는 객체마다 따로 있는 그림](/materials/diagrams/cpp-07-static-member.svg)](/materials/diagrams/cpp-07-static-member.svg)

*그림 7-3 · static 속성은 모두가 함께 쓰는 하나 — 누르면 원본 크기로 열린다.*

**static 데이터 멤버**는 클래스의 모든 객체가 **함께 쓰는 변수 하나**입니다. 클래스 안에서 **선언**하고, 클래스 밖(전역·파일 스코프, 보통 `.cpp`)에서 **정의·초기화**합니다.

```cpp
// 문법 모양 — 파일 두 개로 나눌 때 (한 파일 완전한 프로그램은 바로 아래)
// foo.h                         // foo.cpp
class foo {                      #include "foo.h"
    static int cnt;              int foo::cnt = 1;   // 정의는 한 번만
    …
};
```

**static 메서드**는 객체 없이 `foo::method()`로 부르는 클래스 메서드입니다. 객체가 없을 수 있으므로 **static이 아닌 데이터 멤버는 쓸 수 없습니다.**

> [!NOTE]
> **비유로 이해하기 — 반 전체가 쓰는 칠판**
>
> 일반 멤버는 학생마다 가진 **공책**입니다. 내 공책에 쓴 것은 짝의 공책에 나타나지 않습니다. static 멤버는 교실 앞의 **칠판 하나**입니다. 누가 칠판에 쓰든 모두가 같은 내용을 보고, 학생이 한 명도 없어도 칠판은 교실(클래스)에 붙어 있습니다. static 메서드는 칠판만 다루는 **담임 선생님의 일**이라, 특정 학생의 공책(일반 멤버)은 "누구 공책?"인지 몰라 볼 수 없습니다.

**완전한 프로그램 — 그림 7-3의 foo**

```cpp
#include <iostream>
using namespace std;

class foo {
public:
    static int cnt;           // 선언: 클래스 전체에 하나
    int i;                    // 일반 속성: 객체마다 하나
    foo(int v) { i = v; cnt++; }
    static int getCnt() { return cnt; }      // static 메서드
};
int foo::cnt = 1;             // 정의 + 초기화 (클래스 밖, 한 번만)

int main() {
    cout << foo::getCnt() << '\n';           // 객체 없이 호출 → 1
    foo a(10), b(20), c(30);
    cout << a.i << ' ' << b.i << ' ' << c.i << '\n';      // 각자 다른 i
    cout << a.cnt << ' ' << b.cnt << ' ' << foo::cnt << '\n'; // 모두 같은 cnt
    a.cnt = 100;                             // 하나를 바꾸면
    cout << c.cnt << '\n';                   // 모두에게 보인다
    return 0;
}
```

**실행 결과**

```text
1
10 20 30
4 4 4
100
```

`cnt`는 1에서 시작해 객체 세 개가 만들어질 때마다 1씩 늘어 4가 됩니다. `a.cnt`, `b.cnt`, `foo::cnt`는 모두 **같은 변수 하나**를 부르는 다른 이름입니다.

### 4-1. 객체마다 vs 클래스에 하나

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

아래 퀴즈 프로그램의 `Player`에서 생성자가 `count`를 1 늘리고 소멸자가 1 줄이므로, `count`는 **지금 살아 있는 Player 객체 수**가 됩니다.

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class Player {
>     static int count;
> public:
>     Player()  { count++; }
>     ~Player() { count--; }
>     static int getCount() { return count; }
> };
> int Player::count = 0;          // 빠뜨리면 링크 오류
>
> int main() {
>     cout << Player::getCount() << ' ';
>     Player a;
>     {
>         Player b, c;
>         cout << Player::getCount() << ' ';
>     }
>     cout << Player::getCount() << ' ';
>     Player* p = new Player;
>     cout << Player::getCount() << ' ';
>     delete p;
>     cout << Player::getCount();
>     cout << '\n';
>     return 0;
> }
> ```

> [!ANSWER]
> `0 3 1 2 1` — 블록이 끝나면 `b`, `c`의 소멸자가 `count`를 줄입니다. `new`로 만든 객체도 생성자·소멸자에서 똑같이 세어집니다.

> [!TRAP]
> static 멤버 함수 안에서 일반 멤버 `v`를 쓰면 **컴파일 오류**입니다. 어느 객체의 `v`인지 알 수 없기 때문입니다(this가 없음). `Player::getCount()`처럼 객체 없이 부를 수 있다는 것 자체가 "특정 객체와 상관없다"는 뜻입니다.

**컴파일 오류 예시 — static 함수에서 일반 멤버 사용**

```cpp
class Player {
    static int count;
    int hp = 100;
public:
    static int getHp() { return hp; }   // static 함수에서 일반 멤버 사용
};
int Player::count = 0;

int main() { return Player::getHp(); }
```

**g++ 오류 메시지 (핵심 줄)**

```text
error: invalid use of member 'Player::hp' in static member function
```

클래스 밖 정의 `int Player::count = 0;`을 빠뜨리면 컴파일은 되지만 **링크**에서 `undefined reference to 'Player::count'` 오류가 납니다. 클래스 안의 `static int count;`는 "이런 칠판이 있다"는 **선언**일 뿐이고, 칠판을 실제로 거는 것(메모리 확보)은 밖의 **정의**이기 때문입니다.

---

## 5. friend · this · 클래스와 파일

**friend** — 클래스는 다른 **클래스**나 외부 **함수**를 friend로 선언해 private 속성·메서드에 접근하게 할 수 있습니다.

> [!NOTE]
> **비유로 이해하기 — 집 열쇠를 준 친한 친구**
>
> private 멤버는 잠긴 집 안의 물건입니다. 보통은 집주인(그 클래스의 멤버 함수)만 들어갈 수 있지만, 집주인이 **스스로** 친구에게 열쇠를 건네면(friend 선언) 그 친구는 들어올 수 있습니다. 친구가 "나도 열쇠 줘"라고 해서 생기는 것이 아니라 **집주인이 클래스 안에 적어야만** 생깁니다. 열쇠는 그 친구 한 명에게만 주어지고(친구의 자식에게 상속되지 않음), 내가 친구에게 열쇠를 줬다고 친구 집 열쇠가 내게 생기지도 않습니다(한쪽 방향).

```cpp
#include <iostream>
using namespace std;

class foo {
private:
    int i, j;
public:
    foo(int a, int b) { i = a; j = b; }
    friend class fee;                   // fee 클래스 전체에 허락
    friend int printfoo(foo &f1);       // 외부 함수 하나에 허락
};

class fee {
public:
    int sum(foo &f) { return f.i + f.j; }      // friend 클래스라서 private 접근 OK
};

int printfoo(foo &f1) {                         // 멤버 함수가 아님 (foo:: 없음)
    cout << "i=" << f1.i << " j=" << f1.j << '\n';  // friend 함수라서 OK
    return f1.i;
}

int main() {
    foo f(3, 4);
    printfoo(f);                 // f.printfoo()가 아니라 printfoo(f)
    fee e;
    cout << e.sum(f) << '\n';
    // cout << f.i;              // 오류: main은 friend가 아니다
    return 0;
}
```

**실행 결과**

```text
i=3 j=4
7
```

**this** — 지금 객체를 가리킵니다. 매개변수 이름이 멤버와 같을 때 구분에 씁니다.

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle(double radius) { this->radius = radius; }   // 왼쪽: 멤버, 오른쪽: 매개변수
    double get_radius() { return radius; }             // radius는 this->radius의 줄임
    Circle* me() { return this; }                      // this = 이 함수를 부른 객체의 주소
};

int main() {
    Circle a(3), b(5);
    cout << a.get_radius() << ' ' << b.get_radius() << '\n';
    cout << (a.me() == &a) << ' ' << (b.me() == &b) << ' ' << (a.me() == &b) << '\n';
    return 0;
}
```

**실행 결과**

```text
3 5
1 1 0
```

이 예제는 `this`만 보여 주려고 Circle을 생성자 하나짜리로 줄인 것입니다. `a.me()`가 돌려준 `this`는 `&a`와 같고(1), `&b`와는 다릅니다(0). `bool`은 `cout`에서 1/0으로 찍힙니다.

**클래스와 파일** — 보통 클래스 정의는 `클래스이름.h`에, 클래스 밖에서 정의한 메서드는 `클래스이름.cpp`에 둡니다(5-3절).

`friend`로 지정한 함수(또는 클래스)는 그 클래스의 private·protected 멤버에 접근할 수 있습니다. 클래스가 "이 함수는 믿으니 내 private을 봐도 된다"고 **스스로** 허락하는 것입니다.

```cpp
#include <iostream>
using namespace std;

class Wallet {
    int money = 500;                         // private (class의 기본)
    friend void peek(const Wallet& w);       // 이 함수에게 허락
};

void peek(const Wallet& w) { cout << w.money << '\n'; }   // OK: friend라서 private 접근

int main() {
    Wallet w;
    peek(w);      // w.peek()이 아니라 peek(w)
    return 0;
}
```

**실행 결과**

```text
500
```

- friend 함수는 **멤버 함수가 아닙니다**. `this`가 없고, `obj.f()`가 아니라 `f(obj)`로 호출합니다.
- friend 관계는 **상속되지 않고**, **한쪽 방향**입니다(A가 B를 friend로 지정해도 B가 A를 지정한 것은 아님).

> [!CONCEPT]
> **먼저 짚고 가기 — 참조(&)**
>
> `const Wallet& w`, `Counter&`처럼 자료형 뒤의 `&`는 **참조**입니다. 참조는 이미 있는 변수의 **별명**이라서, `w`를 통해 읽는 것은 원본 지갑 그 자체입니다(복사본이 아님). 매개변수를 `const 자료형&`로 받으면 큰 객체를 **복사하지 않고** 읽기만 할 수 있고, 함수가 `자료형&`를 돌려주면 **원본 객체 그 자체**를 돌려줍니다. 이 성질이 5-2절의 연결 호출과 6절의 `operator<<`에서 핵심입니다.

friend가 가장 많이 쓰이는 곳은 6절의 `cout << p` 연산자 오버로딩입니다.

### 5-1. "나"를 가리키는 포인터

`a.add(3)`과 `b.add(3)`은 같은 함수 코드를 실행합니다. 그런데 함수 안의 `v`가 어떻게 한 번은 `a.v`, 한 번은 `b.v`가 될까요? 컴파일러가 몰래 **호출한 객체의 주소**를 함수에 넘겨주기 때문입니다. 그 주소가 `this`입니다.

> [!NOTE]
> **비유로 이해하기 — this는 "나 자신"**
>
> 반 학생 모두가 같은 지시문 "**내** 공책에 3을 더해 적어라"를 받았다고 합시다. 지시문(멤버 함수 코드)은 하나지만, 읽는 학생마다 "내"가 가리키는 사람이 다릅니다. `this`가 바로 이 "**나**"입니다. 철수가 읽으면 철수(`&a`), 영희가 읽으면 영희(`&b`). 정확히는 "나 자신"이 아니라 "**나의 주소**"이고, 나 자신은 `*this`입니다.

- 일반 멤버 함수 안의 `this`는 **함수를 호출한 객체의 주소**입니다(`a.add()`면 `&a`).
- `*this`는 그 객체 자체입니다.
- 함수 안의 `v`는 사실 `this->v`를 줄여 쓴 것입니다.

```cpp
// 문법 모양 — Counter 클래스 (완전한 프로그램은 아래 퀴즈)
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

### 5-2. 연결 호출: 참조 반환 vs 값 반환

`c.add(3).add(5)`는 `c.add(3)`이 돌려준 것에 다시 `.add(5)`를 부릅니다. 그래서 **무엇을 돌려주느냐**가 중요합니다.

```text
add (참조 반환):      c.add(3)  → c 자신 → .add(5) → 다시 c에 더함
addCopy (값 반환):    c.addCopy(1) → c의 복사본(임시) → .addCopy(1) → 복사본에 더함 (c는 모름)
```

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class Counter {
>     int v;
> public:
>     Counter(int v) { this->v = v; }
>     Counter& add(int a)    { v += a; return *this; }
>     Counter addCopy(int a) { v += a; return *this; }
>     int get() const { return v; }
> };
>
> int main() {
>     Counter c(0);
>     c.add(3).add(5);
>     cout << c.get() << ' ';
>     c.addCopy(1).addCopy(1);
>     cout << c.get() << '\n';
>     return 0;
> }
> ```

> [!ANSWER]
> `8 9` — `add`는 `c` 자신을 참조로 반환하므로 두 번 모두 `c`에 더합니다. `addCopy`는 첫 호출에서 `c`를 9로 만들고 **복사본**을 반환하므로, 두 번째 `addCopy(1)`은 복사본에 더해져 `c`에는 반영되지 않습니다.

### 5-3. 클래스를 파일로 나누기

프로그램이 커지면 클래스를 **선언**(.h)과 **구현**(.cpp)으로 나눕니다. 다른 파일은 `.h`만 `#include`해서 클래스를 씁니다.

> [!NOTE]
> **비유로 이해하기 — 책의 목차와 본문**
>
> `.h`는 **목차**(어떤 함수가 있는지), `.cpp`는 **본문**(함수가 실제로 무엇을 하는지)입니다. 다른 파일은 목차만 보고 "이런 함수가 있구나" 하고 부르고, 본문은 링크 단계에서 이어 붙습니다. 헤더 가드는 같은 목차가 책에 두 번 끼워지는 것을 막는 장치입니다.

**완전한 프로그램 — 파일 세 개**

```cpp
// Counter.h — 선언 (목차)
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
```

```cpp
// Counter.cpp — 구현 (본문). 클래스이름:: 으로 소속 표시
#include "Counter.h"

Counter::Counter(int initial) : value(initial) {}
void Counter::increase() { value++; }
int Counter::getValue() const { return value; }
```

```cpp
// main.cpp — 사용하는 쪽은 .h만 포함
#include <iostream>
#include "Counter.h"
using namespace std;

int main() {
    Counter c(10);
    c.increase();
    c.increase();
    cout << c.getValue() << '\n';
    return 0;
}
```

세 파일을 같은 폴더에 두고 `.cpp` 두 개를 함께 컴파일합니다: `g++ Counter.cpp main.cpp -o app`

**실행 결과**

```text
12
```

- 클래스 밖에서 멤버 함수를 정의할 때는 `Counter::`를 붙여 **어느 클래스의 함수인지** 밝힙니다.
- 헤더 가드(`#ifndef … #define … #endif`)가 없으면 같은 헤더가 두 번 포함될 때 "클래스 재정의" 오류가 납니다.
- 내가 만든 헤더는 `"Counter.h"`(큰따옴표), 표준 헤더는 `<iostream>`(꺾쇠)로 포함합니다.
- `.h`는 컴파일 명령에 적지 않습니다. `#include`가 그 내용을 `.cpp` 안에 붙여 넣기 때문입니다.

---

## 6. 연산자 오버로딩

연산자도 함수처럼 오버로딩할 수 있습니다. 사실 `cout <<`와 `cin >>`도 연산자 오버로딩으로 구현된 것입니다. **일반 함수**로도, **클래스 메서드**로도 만들 수 있습니다.

> [!NOTE]
> **비유로 이해하기 — 같은 + 기호를 새 타입에 맞게 정의**
>
> 숫자끼리의 `+`는 "더하기", 문자열끼리의 `+`는 "이어 붙이기"입니다. 같은 기호지만 **무엇끼리** 쓰느냐에 따라 뜻이 다릅니다. 연산자 오버로딩은 내가 만든 자료형에 대해 "이 기호는 이런 뜻이다"라고 **사전에 새 항목을 추가하는 것**입니다. 원 두 개의 `+`를 "반지름의 합인 원"으로 정의하면 `c1 + c2`가 그 뜻이 됩니다. 단, 사전의 기존 항목(int끼리의 `+`)을 고치거나 새 기호를 발명할 수는 없습니다.

**① 일반 함수로** — 두 Circle을 더하면 반지름의 합인 새 Circle. 이 강의의 Circle은 `radius`가 protected라서 클래스 밖 함수는 `get_radius()`로 읽습니다.

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle() { radius = 0; }
    Circle(double r) { radius = r; }
    virtual ~Circle() {}
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    virtual double area() const { return radius * radius * 3.14159; }
};

// ① 일반 함수로: 두 Circle을 더하면 반지름의 합인 새 Circle
//    radius는 protected라서 밖에서는 get_radius()로 읽는다
Circle operator+(const Circle &c1, const Circle &c2) {
    return Circle(c1.get_radius() + c2.get_radius());
}

int main() {
    Circle c1(5.0), c2(3.0);
    Circle c3 = c1 + c2;                     // operator+(c1, c2) 호출
    cout << c3.get_radius() << '\n';         // 8
    cout << operator+(c1, c2).get_radius() << '\n';   // 같은 호출을 함수 이름으로
    return 0;
}
```

**실행 결과**

```text
8
8
```

**② 메서드로** — 같은 Circle에 `operator+`를 멤버로 추가합니다. 멤버 함수이므로 protected `radius`를 직접 쓸 수 있습니다. (①과 ②를 **한 프로그램에 동시에** 두면 `c1 + c2`가 어느 쪽인지 표준상 모호한 호출이 됩니다. g++는 "ISO C++ says that these are ambiguous" 경고를 내고, 다른 컴파일러는 오류로 처리할 수 있으므로 둘 중 하나만 둡니다. 그래서 프로그램을 나눴습니다.)

```cpp
#include <iostream>
using namespace std;

class Circle {
protected:
    double radius;
public:
    Circle() { radius = 0; }
    Circle(double r) { radius = r; }
    virtual ~Circle() {}
    void set_radius(double r) { radius = r; }
    double get_radius() const { return radius; }
    virtual double area() const { return radius * radius * 3.14159; }
    Circle operator+(const Circle &other) const;    // ② 메서드로 선언
};

Circle Circle::operator+(const Circle &other) const {
    Circle c = *this;               // 왼쪽 피연산자(나 자신)를 복사
    c.radius += other.radius;       // 같은 클래스 안이라 radius 직접 사용
    return c;
}

int main() {
    Circle c1(5.0), c2(3.0);
    cout << (c1 + c2).get_radius() << '\n';           // c1.operator+(c2) → 8
    cout << c1.operator+(c2).get_radius() << '\n';    // 같은 호출
    cout << c1.get_radius() << '\n';                  // c1은 그대로 5
    return 0;
}
```

**실행 결과**

```text
8
8
5
```

**언제 어느 쪽?** 메서드 방식이면 C++은 `<변수> <연산자> <값>`을 `<변수>.operator<연산자>(<값>)`으로 바꿉니다. **왼쪽이 클래스 자료형이 아니면**(예: `2 * c`, `cout << c`) 이 변환이 안 되므로 **일반 함수**로 만듭니다. `<<`·`>>`에서 private 속성에 접근해야 하면 friend로 선언합니다.

**오버로딩할 수 있는 연산자** — 단항 `+ - * & ~ ! ++ -- ->`, 이항 `+ - * / % ^ & | << >> = += -= *= /= %= ^= &= |= <<= >>= < <= > >= == != && || , [] () new new[] delete delete[]`.

**할 수 없는 것** — 완전히 새 연산자 만들기, `int`·`double` 같은 기본 자료형끼리의 연산 의미 바꾸기, 우선순위·결합 방향 바꾸기.

### 6-1. 왜 필요한가

`int`끼리는 `a + b`가 되지만, 내가 만든 `Point`끼리는 `p + q`를 쓰면 컴파일러가 무엇을 해야 할지 모릅니다. 연산자 오버로딩은 `operator+`라는 **이름의 함수**를 정의해서 `p + q`를 쓸 수 있게 합니다. `p + q`는 사실 `p.operator+(q)` 호출입니다.

```cpp
// 문법 모양 — Point 클래스 (완전한 프로그램은 6-3절 퀴즈)
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

### 6-2. 멤버로 만들까, 밖에 만들까

규칙은 하나입니다. **멤버 연산자는 "왼쪽 피연산자"가 내 클래스일 때만** 만들 수 있습니다. `p + q`는 `p.operator+(q)`이므로 왼쪽 `p`가 Point여야 합니다.

| 연산 | 형태 | 이유 |
| --- | --- | --- |
| `p + q` | 멤버 `p.operator+(q)` | 왼쪽이 Point |
| `2 * p` | **비멤버** `operator*(2, p)` | 왼쪽이 int라서 멤버로 만들 수 없음 |
| `cout << p` | **비멤버** (보통 friend) | 왼쪽이 `ostream` |

**컴파일 오류 예시 — 멤버 `operator*`만 있을 때 `2 * p`**

```cpp
class Point {
    int x, y;
public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}
    Point operator*(int k) const { return Point(x * k, y * k); }   // p * 2 만 가능
};

int main() {
    Point p(1, 2);
    Point a = p * 2;    // OK: p.operator*(2)
    Point b = 2 * p;    // 왼쪽이 int → 멤버 함수로는 안 됨
    return 0;
}
```

**g++ 오류 메시지 (핵심 줄)**

```text
error: no match for 'operator*' (operand types are 'int' and 'Point')
```

`2 * p`를 멤버로 바꾸면 `2.operator*(p)`가 되어야 하는데, `int`에는 멤버 함수를 붙일 수 없습니다.

`cout << p`의 왼쪽 `cout`은 `ostream` 클래스이고, 그 클래스는 우리가 고칠 수 없습니다. 그래서 바깥 함수 `operator<<(cout, p)`로 만들고, private `x`, `y`를 읽어야 하니 friend로 지정합니다.

`operator<<`가 `out`을 **참조로 돌려주는** 이유: `cout << a << b`는 `(cout << a) << b`입니다. 앞 결과가 다시 `cout`이어야 `<< b`를 이어서 쓸 수 있습니다(5-2절의 연결 호출과 같은 원리).

### 6-3. 전위 ++와 후위 ++

`++n`과 `n++`는 둘 다 `operator++`인데, 이름이 같으니 구분이 필요합니다. 그래서 C++는 **후위 버전에 쓰지 않는 `int` 매개변수**를 하나 붙이기로 약속했습니다.

```cpp
// 문법 모양 — Num 클래스의 두 연산자 (완전한 프로그램은 아래 퀴즈)
Num& operator++()    { ++v; return *this; }                     // 전위 ++n: 증가 후 자기 자신
Num  operator++(int) { Num old = *this; ++v; return old; }      // 후위 n++: int는 구분용 더미
```

```text
n = 5에서
전위 ++n:  v를 6으로 → n 자신을 돌려줌        → 식의 값 6
후위 n++:  old에 5를 저장 → v를 6으로 → old 반환 → 식의 값 5
```

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> class Point {
>     int x, y;
> public:
>     Point(int x = 0, int y = 0) : x(x), y(y) {}
>
>     Point operator+(const Point& o) const { return Point(x + o.x, y + o.y); }
>     bool operator==(const Point& o) const { return x == o.x && y == o.y; }
>
>     friend Point operator*(int k, const Point& p);
>     friend ostream& operator<<(ostream& out, const Point& p);
> };
> Point operator*(int k, const Point& p) { return Point(k * p.x, k * p.y); }
> ostream& operator<<(ostream& out, const Point& p) {
>     out << '(' << p.x << ", " << p.y << ')';
>     return out;
> }
>
> class Num {
>     int v;
> public:
>     Num(int v) : v(v) {}
>     Num& operator++()    { ++v; return *this; }
>     Num  operator++(int) { Num old = *this; ++v; return old; }
>     int get() const { return v; }
> };
>
> int main() {
>     Num n(5);
>     Num a = n++;
>     Num b = ++n;
>     cout << a.get() << ' ' << b.get() << ' ' << n.get() << '\n';
>
>     Point p(1, 2), q(3, 4);
>     cout << p + q << ' ' << (p + q == Point(4, 6)) << ' ' << 2 * p << '\n';
>     return 0;
> }
> ```

> [!ANSWER]
> ```text
> 5 7 7
> (4, 6) 1 (2, 4)
> ```
>
> 후위는 증가 **전** 복사본(5)을, 전위는 증가 **후** 값(7)을 돌려줍니다. `p + q == Point(4, 6)`은 괄호로 묶었기 때문에 비교 결과 `true`가 `1`로 찍힙니다(괄호가 없으면 `<<`가 `==`보다 먼저 묶여 컴파일 오류).

> [!TRAP]
> 연산자 오버로딩으로 **우선순위, 결합 방향, 피연산자 개수는 바꿀 수 없습니다**. 새 연산자를 만들 수도 없고, `::`, `.`, `?:`, `sizeof`는 오버로딩할 수 없습니다.

---

## 7. 클래스 작성 문제 모범 답안 (족보형)

> [!QUIZ]
> 다음 조건을 만족하는 `Book` 클래스와 `main`을 작성하시오.
>
> 1. `public`인 `char title[50]`, `private`인 `float price`
> 2. `get_price()`, `set_price()`
> 3. 기본 생성자에서 `price = 0`, `title`은 빈 문자열
> 4. `title`과 `price`를 출력하는 멤버 함수
> 5. `main`에서 객체를 만들고 제목은 `"CPP"`, 가격은 10.0으로 설정해 출력

> [!ANSWER]
> ```cpp
> #include <iostream>
> #include <cstring>
> using namespace std;
>
> class Book {
> public:
>     char title[50];
>
>     Book() : price(0) { title[0] = '\0'; }     // 또는 strcpy(title, "");
>     float get_price() const { return price; }
>     void set_price(float p) { price = p; }
>     void print() const { cout << title << ' ' << price << '\n'; }
>
> private:
>     float price;
> };
>
> int main() {
>     Book b;
>     strcpy(b.title, "CPP");     // 배열은 = 로 대입 불가
>     b.set_price(10.0f);
>     b.print();                  // CPP 10
> }
> ```
>
> 실행 결과:
>
> ```text
> CPP 10
> ```
>
> `b.price = 10;`은 private이라 컴파일 오류입니다. `float` 10.0은 `cout`에서 `10`으로 출력됩니다.

> [!NOTE]
> **작성 문제 채점 포인트 체크리스트**
>
> - [ ] 접근 지정자를 조건대로 나눴나 (`public:` / `private:` / `protected:`)
> - [ ] getter에 `const`, setter는 매개변수를 받아 멤버에 대입
> - [ ] 기본 생성자에서 모든 멤버를 초기화 (문자 배열은 `title[0] = '\0'` 또는 `strcpy`)
> - [ ] `main`에서 private 멤버는 setter로만 바꿈
> - [ ] 문자 배열에는 `=` 대신 `strcpy`
> - [ ] 클래스 끝 `};` 세미콜론

---

## 핵심 정리

1. `class Cylinder : public Circle` — 파생 클래스는 기반의 멤버를 물려받아 더하거나 바꾼다. 파생 객체는 기반 객체이기도 하다(원기둥은 원을 밑면으로 가진 확장).
2. 오버라이딩한 메서드에서 기반 버전은 `Circle::area()`, 기반 생성자는 초기화 목록 `: Circle(r)`. 생성은 기반 → 파생, 소멸은 파생 → 기반.
3. protected는 파생 클래스에서만 접근 가능. 단, 기반 자료형 객체를 통한 접근(`c1.x`)은 안 된다.
4. 힙 객체는 `new`(포인터 반환)와 `delete`, 배열은 `new[]`/`delete[]`. 포인터로 멤버 접근은 `->`. 가비지 컬렉션 없음.
5. 기반 포인터·참조로 부를 때 virtual이면 실제 객체(동적 바인딩), 아니면 포인터 자료형(정적 바인딩). virtual은 기반에. 값 복사는 슬라이싱.
6. virtual 함수가 있는 기반 클래스는 소멸자도 virtual. 순수 가상 함수(`= 0`)가 있으면 추상 클래스라 객체를 못 만든다.
7. static 속성은 클래스에 하나, 밖에서 정의. static 메서드는 일반 속성을 못 쓴다.
8. friend는 private 접근 허락, this는 지금 객체의 주소. 왼쪽이 내 클래스가 아니면 연산자는 일반 함수로 오버로딩.

---

## 학습 경로

[← 06 객체지향과 클래스](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-06) · [08 예외 처리 →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-08)
