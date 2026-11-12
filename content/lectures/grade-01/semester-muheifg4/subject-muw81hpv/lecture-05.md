---
title: "클래스와 객체지향 프로그래밍"
description: "클래스가 왜 필요한지부터 시작해 멤버와 접근 지정자, 생성자·소멸자와 호출 순서, 복사 생성자와 얕은/깊은 복사, const 멤버 함수, 상속과 접근 표, 가상 함수와 다형성까지 그림과 출력 추적으로 처음부터 설명합니다."
order: 5
published: true
---

# 클래스와 객체지향 프로그래밍

지금까지는 `int`, `double`, 배열처럼 C++가 준 자료형만 썼습니다. 클래스는 **내가 새 자료형을 만드는 방법**입니다. 이 강의는 "왜 클래스가 필요한가"에서 출발해, 시험에 나오는 접근 표·호출 순서·virtual 출력까지 한 단계씩 올라갑니다.

## 학습 흐름

```text
왜 클래스인가 → 클래스와 객체 → 접근 지정자 (public / protected / private)
        ↓
생성자 · 멤버 초기화 목록 · 소멸자 → 호출 순서
        ↓
복사 생성자와 얕은 / 깊은 복사 → const 멤버 함수
        ↓
상속 → 상속 종류별 접근 표 → 오버라이딩과 가리기
        ↓
virtual과 다형성 → 가상 소멸자 → 추상 클래스
```

> [!EXAM]
> 기말 족보의 클래스 문제는 세 가지입니다. ① **접근 가능 여부 O/X 표**, ② **virtual 유무에 따른 출력**, ③ **조건에 맞는 클래스 작성**(char 배열 멤버, getter/setter, 기본 생성자, protected 상속). 이 단원의 예제는 이 셋에 맞춰져 있습니다.

### 이 강의에서 쓰는 말

| 말 | 뜻 | 비유 |
| --- | --- | --- |
| 클래스(class) | 데이터와 그 데이터를 다루는 함수를 묶은 **설계도** | 붕어빵 틀 |
| 객체(object) | 클래스로 실제로 만든 것(변수) | 틀로 찍은 붕어빵 |
| 멤버 변수 | 객체가 가진 데이터 | 붕어빵의 속(팥, 크림) |
| 멤버 함수 | 객체가 할 수 있는 동작 | "데우기", "포장하기" |
| 생성자 / 소멸자 | 객체가 생길 때 / 사라질 때 자동으로 불리는 함수 | 개점 준비 / 마감 정리 |
| 상속 | 기존 클래스를 물려받아 새 클래스를 만드는 것 | "동물"을 물려받은 "강아지" |
| 다형성 | 같은 호출이 실제 객체 종류에 따라 다르게 동작 | 같은 "소리 내!"에 개는 멍, 고양이는 야옹 |

---

## 0. 왜 클래스가 필요한가

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

## 1. 클래스와 객체

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

## 2. 접근 지정자

### 2-1. 왜 숨기나 (캡슐화)

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

값을 읽는 함수를 **getter**, 바꾸는 함수를 **setter**라고 부릅니다. 족보의 클래스 작성 문제에 꼭 나옵니다(8절).

### 2-2. 세 가지 접근 지정자

| 지정자 | 같은 클래스 멤버 함수 | 파생 클래스 멤버 함수 | 클래스 밖(main 등) |
| --- | :---: | :---: | :---: |
| `public` | O | O | O |
| `protected` | O | O (조건 있음) | X |
| `private` | O | **X** | X |

- `public`: 누구나
- `protected`: 나와 **나를 물려받은 자식**까지
- `private`: **나만**

### 2-3. 다른 객체를 통한 접근 (O/X 표의 함정)

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

## 3. 생성자와 소멸자

### 3-1. 객체가 태어날 때와 죽을 때

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

### 3-2. 기본 생성자 규칙

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

### 3-3. 멤버 초기화 목록

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

### 3-4. 호출 순서 (시험 최빈출)

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

## 4. 복사 생성자와 얕은 / 깊은 복사

### 4-1. 복사 생성자가 불리는 때

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

### 4-2. 얕은 복사의 문제

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

## 5. const 멤버 함수

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

## 6. 상속

### 6-1. "~은 ~이다" 관계

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
- 생성은 부모 → 자식, 소멸은 자식 → 부모(3-4절 규칙 그대로).

기반 클래스에 기본 생성자가 없으면 파생 클래스 생성자의 초기화 목록에서 **직접 호출**해야 합니다: `Dog(string n) : Animal(n) {}`.

### 6-2. 상속 종류별 접근 표

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

## 7. 오버라이딩, 가리기, 가상 함수

### 7-1. 이름이 같은 함수 세 경우

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

### 7-2. 왜 virtual이 필요한가

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

### 7-3. virtual: 포인터·참조로 부를 때 실제 객체의 함수

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

### 7-4. 가상 소멸자

기반 포인터로 파생 객체를 `delete`하려면 기반 소멸자가 **virtual**이어야 합니다. 아니면 파생 소멸자가 불리지 않습니다(표준상 UB). 소멸자도 함수라서 7-2의 규칙이 그대로 적용되는 것입니다.

```cpp
NB* p = new ND; delete p;   // 소멸자가 virtual 아님 → 보통 "~NB"만 출력
VB* q = new VD; delete q;   // virtual ~VB() → "~VD ~VB"
```

파생 클래스가 `new`로 빌린 메모리를 소멸자에서 반납한다면, 파생 소멸자가 불리지 않는 순간 **메모리 누수**가 됩니다. 그래서 virtual 함수가 하나라도 있는 기반 클래스는 소멸자도 virtual로 만듭니다.

### 7-5. 추상 클래스

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

## 8. 클래스 작성 문제 모범 답안 (족보형)

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

1. 클래스는 데이터와 함수를 묶은 새 자료형(설계도), 객체는 그것으로 만든 변수. `class` 기본 private, `struct` 기본 public.
2. private은 그 클래스만, protected는 파생 클래스도(단, 자기 클래스 객체를 통할 때만), public은 어디서나. 데이터는 숨기고 getter/setter로 다룬다(캡슐화).
3. 같은 클래스의 멤버 함수는 다른 객체의 private에도 접근할 수 있다.
4. 생성자를 하나라도 만들면 기본 생성자는 자동으로 생기지 않는다. const·참조 멤버는 초기화 목록에서만 초기화한다.
5. 생성: 기반 → 멤버(선언 순서) → 자신. 소멸은 반대. 지역 객체는 생성 역순으로 소멸.
6. `T b = a;`는 복사 생성자, `c = b;`는 대입 연산자. 값 전달도 복사 생성자.
7. 포인터 멤버의 기본 복사는 얕은 복사다 → 깊은 복사 생성자 필요.
8. 상속: public → 그대로, protected → public이 protected로, private → 모두 private. 생략하면 private 상속.
9. 기반 포인터·참조로 부를 때 virtual이면 실제 객체, 아니면 포인터 자료형의 함수. virtual은 **기반에** 있어야 한다. 값으로 복사하면 슬라이싱.
10. 다형적 기반 클래스의 소멸자는 virtual로. 순수 가상 함수가 있으면 추상 클래스.
