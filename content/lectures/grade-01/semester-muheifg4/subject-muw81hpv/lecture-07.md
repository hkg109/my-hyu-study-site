---
title: "상속·다형성·연산자 오버로딩"
description: "Circle과 Cylinder로 보는 상속과 오버라이딩, 기반 생성자 호출, protected 접근, new·delete로 만드는 힙 객체, 다형성과 virtual 동적 바인딩, static 멤버, friend, this, 클래스와 파일, 연산자 오버로딩을 Lecture 10 순서로 그림과 출력 추적으로 설명합니다."
order: 7
published: true
duration: 110
---

# 상속·다형성·연산자 오버로딩

**슬라이드:** Lecture 10 (10–11주차) · Inheritance (protected), Method Overriding, Polymorphism, static, friend, this, Operator Overloading

06강에서 만든 `Circle`을 그대로 물려받아 `Cylinder`(원기둥)를 만들면서 상속과 다형성을 배우고, 클래스에 붙는 나머지 기능(static, friend, this, 연산자 오버로딩)을 정리합니다.

---

## 학습 흐름

```text
상속(Circle → Cylinder) → 오버라이딩 → 기반 생성자 호출 → protected
        ↓
힙 객체 new/delete → 다형성 → virtual과 동적 바인딩 → 가상 소멸자 · 추상 클래스
        ↓
static 멤버 → friend → this → 클래스와 파일
        ↓
연산자 오버로딩(함수 / 메서드) → 오버로딩할 수 있는 연산자와 제한
```

---

## 1. 상속: Circle에서 Cylinder로

[![기반 클래스 Circle의 protected radius와 virtual area를 파생 클래스 Cylinder가 물려받아 height와 volume을 더하고 area를 오버라이딩하며 생성자에서 Circle r을 먼저 호출하는 UML 그림](/materials/diagrams/cpp-07-inheritance.svg)](/materials/diagrams/cpp-07-inheritance.svg)

*그림 7-1 · Circle과 Cylinder — 누르면 원본 크기로 열린다.*

기존 클래스를 물려받아 새 클래스를 만들 수 있습니다. 새 클래스는 기존 클래스의 **특수화(specialization)**로, 멤버와 메서드를 **더하거나 바꿀** 수 있습니다. 동기는 **기존 코드의 재사용**입니다.

| 용어 | 뜻 |
| --- | --- |
| 기반 클래스 (base class, superclass) | 물려주는 쪽 — Circle |
| 파생 클래스 (derived class, subclass) | 물려받는 쪽 — Cylinder |

**파생 클래스의 객체는 기반 클래스의 객체이기도 합니다.** (원기둥은 원의 성질을 모두 가짐 — 이것이 다형성의 출발점.)

```cpp
class Cylinder : public Circle {      // Cylinder는 Circle의 subclass
private:
    double height;
public:
    double volume();
    double area();                    // 오버라이딩: 원기둥 겉넓이
    Cylinder(double r, double h);
};

double Cylinder::area() {
    return Circle::area() * 2 + (2 * radius * 3.14159) * height;   // 기반의 area 호출
}
Cylinder::Cylinder(double r, double h) : Circle(r) {   // 기반 생성자를 먼저 호출
    height = h;
}
```

- **메서드 오버라이딩:** 파생 클래스가 기반의 메서드를 같은 모양으로 다시 정의. 기반 버전은 `Circle::area()`로 부를 수 있습니다.
- **기반 생성자 호출:** 파생 생성자의 초기화 목록에 `: Circle(r)`을 적습니다.

### 1-1. "~은 ~이다" 관계

생쥐는 동물입니다. 동물이 가진 것(번호, 번호 읽기·쓰기)을 생쥐도 모두 가지고, 생쥐만의 기능을 더합니다. 이렇게 **기존 클래스를 물려받아** 새 클래스를 만드는 것이 상속입니다. 물려주는 쪽을 **기반(부모) 클래스**, 물려받는 쪽을 **파생(자식) 클래스**라고 합니다.

```cpp
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
```

`Mouse m; m.setId(7); m.print();` → `Animal() Mouse() id=7 ` 그리고 블록이 끝나면 `~Mouse() ~Animal()`.

- `Mouse`에는 `setId`가 없지만 `Animal`에서 물려받았으므로 `m.setId(7)`이 됩니다.
- `id`가 `protected`라서 파생 클래스 `Mouse`의 멤버 함수가 직접 쓸 수 있습니다. `private`이었다면 `getId()`를 거쳐야 합니다.
- 생성은 부모 → 자식, 소멸은 자식 → 부모(06강의 생성·소멸 순서 그대로).

기반 클래스에 기본 생성자가 없으면 파생 클래스 생성자의 초기화 목록에서 **직접 호출**해야 합니다: `Dog(string n) : Animal(n) {}`.

### 1-2. 상속 종류별 접근 표

상속할 때 `public`/`protected`/`private`을 붙입니다. 이것은 "물려받은 멤버의 접근 수준을 **최소 몇까지 낮출지**"를 정합니다.

| 기반 멤버 \ 상속 | `public` 상속 | `protected` 상속 | `private` 상속 |
| --- | --- | --- | --- |
| public | public | protected | private |
| protected | protected | protected | private |
| private | 접근 불가 | 접근 불가 | 접근 불가 |

> [!NOTE]
> 표 외우는 요령: **둘 중 더 좁은 쪽**을 고릅니다. 넓은 순서는 public > protected > private. 예를 들어 public 멤버를 protected 상속하면 둘 중 좁은 protected가 됩니다. 단, 기반의 private은 어떤 상속이든 파생 클래스에서 **보이지 않습니다**.

결과 확인(`A`의 `x`: public, `y`: protected, `z`: private / `D : ? A` / `G : public D`):

| 상속 | D 안 `x`, `y` | D 안 `z` | main에서 `d.x` | G(손자) 안 `x`, `y` |
| --- | :---: | :---: | :---: | :---: |
| public | O | X | **O** | O |
| protected | O | X | **X** | O |
| private | O | X | **X** | **X** |

> [!TRAP]
> - private 멤버는 어떤 상속에서도 파생 클래스가 **직접** 쓸 수 없습니다. 기반의 public getter/setter를 거쳐야 합니다.
> - `class D : A`처럼 상속 지정자를 생략하면 **private 상속**입니다(`struct`면 public).

---

## 2. protected 접근

**protected** 속성·메서드는 **파생 클래스에서는 접근 가능**하고, 그 밖에서는 private처럼 막힙니다.

```cpp
class Circle {
protected:
    double radius;      // Cylinder::area()가 radius를 직접 쓸 수 있는 이유
public:
    double area();
};
```

**슬라이드 12의 접근 표** — `class C1 { protected: int x; };`, `class C2 : public C1`, 상관없는 `class C3`에서 멤버 함수 안에 `C1 c1; C2 c2;`가 있을 때:

| 어디서 | `x = 2;` (자기 것) | `c1.x = 2;` | `c2.x = 2;` |
| --- | :---: | :---: | :---: |
| C1 안 | O | O | — |
| C2 안 (파생) | O | **X** | O |
| C3 안 (무관) | X | X | X |

C2 안에서도 **C1 자료형 객체를 통한** protected 접근(`c1.x`)은 안 됩니다. 06강의 O/X 표와 같은 규칙입니다.

---

## 3. 힙 객체와 다형성

[![Circle 포인터 cir1이 Cylinder 객체를 가리킬 때 area가 virtual이면 Cylinder의 area를, 아니면 Circle의 area를 호출하는 결정 흐름](/materials/diagrams/cpp-07-dynamic-binding.svg)](/materials/diagrams/cpp-07-dynamic-binding.svg)

*그림 7-2 · 정적 바인딩과 동적 바인딩 — 누르면 원본 크기로 열린다.*

**힙 객체** — 객체도 `new`로 힙에 만들 수 있고, `new`는 포인터를 돌려줍니다. 다 쓰면 `delete`로 지웁니다. 배열은 `new[]`/`delete[]`. C++에는 Java·C#처럼 **자동 가비지 컬렉션이 없습니다.**

```cpp
Circle* c = new Circle(9);
std::cout << c->area();    // 포인터로 멤버 접근은 ->
delete c;
```

**다형성** — 파생 클래스 객체는 기반 클래스 객체를 다루도록 만든 코드 어디에나 쓸 수 있습니다.

```cpp
Cylinder* cyl = new Cylinder(10, 5);
Circle* cir1 = cyl;              // 기반 포인터로 파생 객체를 가리킴 (다형성)
std::cout << cir1->area();       // 어느 area()?
```

**가상 함수와 동적 바인딩** — 기반 클래스에서 `virtual`로 선언한 메서드는 파생 클래스가 오버라이딩했을 때 **실행 중에 실제 객체를 보고** 구현을 고릅니다(동적 바인딩). 그래서 위 코드는 **Cylinder의 area()**를 부릅니다. virtual이 없으면 포인터 자료형(Circle)의 것이 불립니다.

```cpp
class Circle {
public:
    double radius;
    Circle();
    virtual double area();      // 동적 바인딩을 원한다는 표시
};
```

### 3-1. 이름이 같은 함수 세 경우

| 용어 | 뜻 |
| --- | --- |
| 오버로딩 | **같은 범위**에서 이름이 같고 매개변수가 다른 함수 여러 개 |
| 오버라이딩 | 파생 클래스가 기반의 **virtual** 함수를 같은 형태로 다시 정의 |
| 가리기(hiding) | 파생 클래스에 같은 **이름**을 선언하면 기반의 같은 이름 함수가 **모두** 가려짐 |

```cpp
class H  { public: void f(); void f(int); };
class HD : public H { public: void f(int); };   // H의 f()와 f(int)를 모두 가림

HD d;
d.f(1);       // HD::f(int)
d.f();        // 컴파일 오류: H::f()가 가려짐
d.H::f();     // OK: 기반 이름을 직접 지정
```

### 3-2. 왜 virtual이 필요한가

동물 여러 마리를 **한 배열**에 담아 한꺼번에 "소리 내!"라고 시키고 싶다고 합시다. 강아지와 고양이는 자료형이 다르므로 한 배열에 담으려면 **기반 클래스 포인터**(`Animal*`)를 씁니다.

```cpp
class Animal {
public:
    virtual void sound() { cout << "... "; }   // virtual!
};
class Dog : public Animal {
public:
    void sound() override { cout << "멍 "; }
};
class Cat : public Animal {
public:
    void sound() override { cout << "야옹 "; }
};

Dog d; Cat c;
Animal* zoo[2] = {&d, &c};
for (Animal* a : zoo) a->sound();   // 출력: 멍 야옹
```

`a`의 자료형은 모두 `Animal*`인데, `virtual` 덕분에 **실제로 가리키는 객체**(Dog, Cat)의 함수가 불립니다. 이것이 **다형성**입니다. `virtual`을 지우면 둘 다 `Animal::sound()`가 불려 `... ...`가 출력됩니다.

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

> [!EXAM]
> virtual이 **기반 클래스에** 붙어 있어야 합니다. 기반에는 없고 파생 클래스에서만 `virtual`을 붙이면, **기반 포인터로 부를 때는 여전히 기반 함수**가 실행됩니다. 기반에서 한 번 virtual이면 파생에서 `virtual`을 생략해도 virtual입니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
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
> C2 obj;
> C1* p = &obj;
> C1& r = obj;
> C1 s = obj;
> p->f(); p->g(); r.f(); r.g(); s.g(); obj.f();
> ```

> [!ANSWER]
> ```text
> C1f C2g C1f C2g C1g C2f
> ```
>
> `f`는 virtual이 아니므로 포인터·참조의 자료형(C1)을 따릅니다. `g`는 virtual이라 실제 객체(C2)를 따릅니다. `s`는 C1 **값**으로 복사된 객체라서 C1의 `g`가 불립니다.

> [!QUIZ]
> 다음 출력을 쓰시오.
>
> ```cpp
> class car {
> public:
>     void showa() { cout << "baseA "; }
>     virtual void showb() { cout << "baseB "; }
> };
> class rcar : public car {
> public:
>     virtual void showa() { cout << "derA "; }
>     void showb() { cout << "derB "; }
> };
>
> car* p = new rcar;
> p->showa();
> p->showb();
> rcar* q = new rcar;
> q->showa();
> ```

> [!ANSWER]
> `baseA derB derA`
>
> - `showa`는 **기반 car에서 virtual이 아니므로** car 포인터로는 car의 것이 불립니다(파생에서 붙인 virtual은 소용없음).
> - `showb`는 기반에서 virtual이므로 파생에서 `virtual`을 안 써도 오버라이딩됩니다.
> - `q`는 rcar 포인터이므로 rcar의 `showa`입니다.

### 3-4. 가상 소멸자

기반 포인터로 파생 객체를 `delete`하려면 기반 소멸자가 **virtual**이어야 합니다. 아니면 파생 소멸자가 불리지 않습니다(표준상 UB). 소멸자도 함수라서 3-2의 규칙이 그대로 적용되는 것입니다.

```cpp
NB* p = new ND; delete p;   // 소멸자가 virtual 아님 → 보통 "~NB"만 출력
VB* q = new VD; delete q;   // virtual ~VB() → "~VD ~VB"
```

파생 클래스가 `new`로 빌린 메모리를 소멸자에서 반납한다면, 파생 소멸자가 불리지 않는 순간 **메모리 누수**가 됩니다. 그래서 virtual 함수가 하나라도 있는 기반 클래스는 소멸자도 virtual로 만듭니다.

### 3-5. 추상 클래스

`virtual double area() const = 0;`처럼 `= 0`인 함수를 **순수 가상 함수**라 하고, 하나라도 있으면 **추상 클래스**입니다. 추상 클래스는 객체를 만들 수 없고(`Shape s;` 컴파일 오류), 포인터·참조로만 씁니다. 파생 클래스가 모두 구현해야 객체를 만들 수 있습니다.

```cpp
class Shape {
public:
    virtual double area() const = 0;   // "도형이면 넓이를 구할 수 있어야 한다"는 약속만
    virtual ~Shape() {}
};
class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }   // 약속을 지킴
};

// Shape s;                  // 컴파일 오류: 추상 클래스
Shape* sp = new Rect(2, 3);
cout << sp->area();          // 6
delete sp;
```

"도형"이라는 막연한 것은 넓이를 계산할 수 없으니 객체로 만들 수 없고, "사각형"처럼 구체적인 도형만 만들 수 있다는 뜻입니다.

---

## 4. static 멤버

[![foo 클래스의 static cnt는 클래스에 하나만 있고 세 객체가 함께 쓰며 일반 속성 i는 객체마다 따로 있는 그림](/materials/diagrams/cpp-07-static-member.svg)](/materials/diagrams/cpp-07-static-member.svg)

*그림 7-3 · static 속성은 모두가 함께 쓰는 하나 — 누르면 원본 크기로 열린다.*

**static 데이터 멤버**는 클래스의 모든 객체가 **함께 쓰는 변수 하나**입니다. 클래스 안에서 **선언**하고, 클래스 밖(전역·파일 스코프, 보통 `.cpp`)에서 **정의·초기화**합니다.

```cpp
// foo.h                         // foo.cpp
class foo {                      #include "foo.h"
    static int cnt;              int foo::cnt = 1;   // 정의는 한 번만
    …
};
```

**static 메서드**는 객체 없이 `foo::method()`로 부르는 클래스 메서드입니다. 객체가 없을 수 있으므로 **static이 아닌 데이터 멤버는 쓸 수 없습니다.**

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

## 5. friend · this · 클래스와 파일

**friend** — 클래스는 다른 **클래스**나 외부 **함수**를 friend로 선언해 private 속성·메서드에 접근하게 할 수 있습니다.

```cpp
class foo {
private:
    int i, j;
    friend class fee;                   // fee 클래스 전체에 허락
    friend int printfoo(foo &f1);       // 외부 함수 하나에 허락
};
```

**this** — 지금 객체를 가리킵니다. 매개변수 이름이 멤버와 같을 때 구분에 씁니다.

```cpp
Circle::Circle(double radius) { this->radius = radius; }   // 왼쪽: 멤버, 오른쪽: 매개변수
```

**클래스와 파일** — 보통 클래스 정의는 `클래스이름.h`에, 클래스 밖에서 정의한 메서드는 `클래스이름.cpp`에 둡니다.

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

friend가 가장 많이 쓰이는 곳은 6절의 `cout << p` 연산자 오버로딩입니다.

### 5-1. "나"를 가리키는 포인터

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

### 5-2. 연결 호출: 참조 반환 vs 값 반환

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

## 6. 연산자 오버로딩

연산자도 함수처럼 오버로딩할 수 있습니다. 사실 `cout <<`와 `cin >>`도 연산자 오버로딩으로 구현된 것입니다. **일반 함수**로도, **클래스 메서드**로도 만들 수 있습니다.

```cpp
// ① 일반 함수로: 두 Circle을 더하면 반지름의 합
Circle operator+(const Circle &c1, const Circle &c2) {
    return Circle(c1.radius + c2.radius);
}
// ② 메서드로
Circle Circle::operator+(const Circle &other) const {
    Circle c = *this;
    c.radius += other.radius;
    return c;
}
Circle c1(5.0), c2(3.0);
std::cout << (c1 + c2).get_radius();   // 8
```

**언제 어느 쪽?** 메서드 방식이면 C++은 `<변수> <연산자> <값>`을 `<변수>.operator<연산자>(<값>)`으로 바꿉니다. **왼쪽이 클래스 자료형이 아니면**(예: `2 * c`, `cout << c`) 이 변환이 안 되므로 **일반 함수**로 만듭니다. `<<`·`>>`에서 private 속성에 접근해야 하면 friend로 선언합니다.

**오버로딩할 수 있는 연산자** — 단항 `+ - * & ~ ! ++ -- ->`, 이항 `+ - * / % ^ & | << >> = += -= *= /= %= ^= &= |= <<= >>= < <= > >= == != && || , [] () new new[] delete delete[]`.

**할 수 없는 것** — 완전히 새 연산자 만들기, `int`·`double` 같은 기본 자료형끼리의 연산 의미 바꾸기, 우선순위·결합 방향 바꾸기.

### 6-1. 왜 필요한가

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

### 6-2. 멤버로 만들까, 밖에 만들까

규칙은 하나입니다. **멤버 연산자는 "왼쪽 피연산자"가 내 클래스일 때만** 만들 수 있습니다. `p + q`는 `p.operator+(q)`이므로 왼쪽 `p`가 Point여야 합니다.

| 연산 | 형태 | 이유 |
| --- | --- | --- |
| `p + q` | 멤버 `p.operator+(q)` | 왼쪽이 Point |
| `2 * p` | **비멤버** `operator*(2, p)` | 왼쪽이 int라서 멤버로 만들 수 없음 |
| `cout << p` | **비멤버** (보통 friend) | 왼쪽이 `ostream` |

`cout << p`의 왼쪽 `cout`은 `ostream` 클래스이고, 그 클래스는 우리가 고칠 수 없습니다. 그래서 바깥 함수 `operator<<(cout, p)`로 만들고, private `x`, `y`를 읽어야 하니 friend로 지정합니다.

`operator<<`가 `out`을 **참조로 돌려주는** 이유: `cout << a << b`는 `(cout << a) << b`입니다. 앞 결과가 다시 `cout`이어야 `<< b`를 이어서 쓸 수 있습니다(5-2절의 연결 호출과 같은 원리).

### 6-3. 전위 ++와 후위 ++

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

1. `class Cylinder : public Circle` — 파생 클래스는 기반의 멤버를 물려받아 더하거나 바꾼다. 파생 객체는 기반 객체이기도 하다.
2. 오버라이딩한 메서드에서 기반 버전은 `Circle::area()`, 기반 생성자는 초기화 목록 `: Circle(r)`.
3. protected는 파생 클래스에서만 접근 가능. 단, 기반 자료형 객체를 통한 접근(`c1.x`)은 안 된다.
4. 힙 객체는 `new`(포인터 반환)와 `delete`. 가비지 컬렉션 없음.
5. 기반 포인터·참조로 부를 때 virtual이면 실제 객체(동적 바인딩), 아니면 포인터 자료형(정적 바인딩). virtual은 기반에.
6. static 속성은 클래스에 하나, 밖에서 정의. static 메서드는 일반 속성을 못 쓴다.
7. friend는 private 접근 허락, this는 지금 객체. 왼쪽이 내 클래스가 아니면 연산자는 일반 함수로 오버로딩.

---

## 학습 경로

[← 06 객체지향과 클래스](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-06) · [08 예외 처리 →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-08)
