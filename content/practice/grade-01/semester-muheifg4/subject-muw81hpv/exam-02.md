---
title: C++ 기말고사 족보
description: 클래스·상속·다형성·예외 처리·템플릿 문제와 변형 유형을 코드·비교표·접이식 해설·자가 채점으로 복습합니다.
week: 0
order: 2
published: true
---

> [!EXAM]
> **학습 순서:** 문제 풀기 → 정답·해설 확인 → 자가 채점 → 헷갈린 문제 복습. 코드와 출력은 구분해서 읽고, 표는 답을 보기 전에 직접 채워 보세요.

> **범위:** 클래스부터 그 이후 내용 전체
> 
> 여러 족보에서 완전히 같거나 구조가 거의 같은 문제는 중복 제거했습니다. 값이나 호출 순서만 달라지는 문제는 같은 문항 안의 **변형 문제**로 묶었고, 정답·코드·해설은 아래의 **정답 확인**에서 펼쳐 볼 수 있습니다.

---


## F1. 상속과 접근 지정자 O/X 표

> 이 유형은 여러 족보에 반복 등장합니다. **동일한 표는 중복 제거**하고, 실제로 구조가 다른 3개 변형만 남겼습니다.

### F1-A. `private y` + `protected z` + `C* objCref`

```cpp
class A {
public:
    int x;
    A *objAref;
private:
    int y;
};

class B : public A {
public:
    A objA;
protected:
    int z;
};

class C : public B {
public:
    C *objCref;
};
```

각 표현을 `class A`, `class B`, `class C` 내부에서 사용할 수 있는지 O/X로 표시하시오.

> [!QUIZ]
> **F1. 상속과 접근 지정자 O/X 표 · 확인 1** — 정답표 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답표 보기**
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | O | O | O |
> | `y` | O | X | X |
> | `z` | X | O | O |
> | `objA.x` | X | O | O |
> | `objA.y` | X | X | X |
> | `objA.z` | X | X | X |
> | `objAref->x` | O | O | O |
> | `objAref->y` | O | X | X |
> | `objAref->z` | X | X | X |
> | `objCref->x` | X | X | O |
> | `objCref->y` | X | X | X |
> | `objCref->z` | X | X | O |

### F1-B. `B objB`가 있는 경우

```cpp
class A {
public:
    int x;
    A *objAref;
private:
    int y;
};

class B : public A {
public:
    A objA;
protected:
    int z;
};

class C : public B {
public:
    B objB;
};
```

> [!QUIZ]
> **F1. 상속과 접근 지정자 O/X 표 · 확인 2** — 정답표 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답표 보기**
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | O | O | O |
> | `y` | O | X | X |
> | `z` | X | O | O |
> | `objA.x` | X | O | O |
> | `objA.y` | X | X | X |
> | `objA.z` | X | X | X |
> | `objAref->x` | O | O | O |
> | `objAref->y` | O | X | X |
> | `objAref->z` | X | X | X |
> | `objB.x` | X | X | O |
> | `objB.y` | X | X | X |
> | `objB.z` | X | X | X |
> 
> ### 핵심 함정
> 
> `class C`가 `B`를 상속하더라도
> 
> ```cpp
> objB.z
> ```
> 
> 처럼 **`B` 타입 객체를 통해 `protected` 멤버에 접근하는 것은 불가**합니다.

### F1-C. `A::z`가 protected이고 `C`는 상속하지 않는 경우

```cpp
class A {
public:
    int x;
    A *objAref;
private:
    int y;
protected:
    int z;
};

class B : public A {
public:
    A objA;
};

class C {
public:
    A objA;
    A *objAref;
    B objB;
};
```

> [!QUIZ]
> **F1. 상속과 접근 지정자 O/X 표 · 확인 3** — 정답표 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답표 보기**
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | O | O | X |
> | `y` | O | X | X |
> | `z` | O | O | X |
> | `objA.x` | X | O | O |
> | `objA.y` | X | X | X |
> | `objA.z` | X | X | X |
> | `objAref->x` | O | O | O |
> | `objAref->y` | O | X | X |
> | `objAref->z` | O | X | X |
> | `objB.x` | X | X | O |
> | `objB.y` | X | X | X |
> | `objB.z` | X | X | X |

### 접근 지정자 한 줄 정리

- `public` → 외부에서도 접근 가능
- `private` → **선언한 클래스 내부에서만** 접근 가능
- `protected` → 선언 클래스 + 파생 클래스에서 접근 가능
- 단, 파생 클래스의 `protected` 접근은 **객체의 정적 타입** 때문에 함정이 자주 생김

---

## F2. Student 클래스 + 기본 생성자

### 문제
다음 조건을 만족하는 `Student` 클래스를 작성하시오.

1. `number`와 `name[20]` 멤버를 가진다.
2. 두 값을 출력하는 `print()`를 만든다.
3. 기본 생성자에서
   - `number = 0`
   - `name`을 빈 문자열로 초기화한다.
4. `main()`에서 학생 번호와 이름을 입력받아 출력한다.

> [!QUIZ]
> **F2. Student 클래스 + 기본 생성자 · 확인 4** — 정답 코드 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 코드 보기**
>
> ```cpp
> #include <iostream>
> using namespace std;
> 
> class Student {
> public:
>     int number;
>     char name[20];
> 
>     Student()
>     {
>         number = 0;
>         name[0] = '\0';
>     }
> 
>     void print()
>     {
>         cout << "Number : " << number << endl;
>         cout << "Name : " << name << endl;
>     }
> };
> 
> int main()
> {
>     Student s;
> 
>     cout << "Enter student's number : ";
>     cin >> s.number;
> 
>     cout << "Enter student's name : ";
>     cin >> s.name;
> 
>     s.print();
>     return 0;
> }
> ```
> 
> ### 빈 문자열 초기화 핵심
> 
> ```cpp
> name[0] = '\0';
> ```

---

## F3. Book 클래스 + 캡슐화

### 문제
다음 조건을 만족하는 `Book` 클래스를 작성하시오.

1. `public`인 `char title[50]`
2. `private`인 `float price`
3. `price`의 getter `get_price()`와 setter `set_price()`
4. 기본 생성자에서
   - `price = 0`
   - `title`을 빈 문자열로 초기화
5. `title`, `price`를 출력하는 멤버함수
6. `main()`에서 `Book` 객체를 만들고 `price = 10.0`으로 설정한 뒤 출력

> [!QUIZ]
> **F3. Book 클래스 + 캡슐화 · 확인 5** — 정답 코드 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 코드 보기**
>
> ```cpp
> #include <iostream>
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
>         price = 0.0f;
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
>     b.set_price(10.0f);
>     b.display();
> 
>     return 0;
> }
> ```

---

## F4. Animal → Mouse 상속

### 문제
다음 조건을 만족하도록 클래스를 작성하시오.

1. `Animal` 클래스의 `id`는 `protected`
2. `getId()`, `setId()` 작성
3. 기본 생성자와 소멸자 작성
4. `Mouse`는 `Animal`을 `public` 상속
5. `Mouse::print()`에서 `id` 출력

> [!QUIZ]
> **F4. Animal → Mouse 상속 · 확인 6** — 정답 코드 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 코드 보기**
>
> ```cpp
> #include <iostream>
> using namespace std;
> 
> class Animal {
> protected:
>     int id;
> 
> public:
>     void setId(int _id)
>     {
>         id = _id;
>     }
> 
>     int getId()
>     {
>         return id;
>     }
> 
>     Animal()
>     {
>         id = 0;
>     }
> 
>     ~Animal() {}
> };
> 
> class Mouse : public Animal {
> public:
>     void print()
>     {
>         cout << "ID : " << id;
>     }
> };
> 
> int main()
> {
>     Mouse m;
>     int num;
> 
>     cin >> num;
>     m.setId(num);
>     m.print();
> 
>     return 0;
> }
> ```
> 
> 예시 입력이 `131`이면
> 
> ```text
> ID : 131
> ```

---

## F5. `virtual` 함수와 동적 바인딩

### F5-A. 가장 자주 나온 대표 유형

```cpp
#include <iostream>

class C1 {
public:
    void funA()
    {
        std::cout << "C1 fun A" << std::endl;
    }

    virtual void funB()
    {
        std::cout << "C1 fun B" << std::endl;
    }
};

class C2 : public C1 {
public:
    void funA()
    {
        std::cout << "C2 fun A" << std::endl;
    }

    virtual void funB()
    {
        std::cout << "C2 fun B" << std::endl;
    }
};

int main()
{
    C1 *o1 = new C1();
    C1 *o2 = new C2();
    C2 *o3 = new C2();

    o1->funA();
    o1->funB();
    o2->funA();
    o2->funB();
    o3->funA();
    o3->funB();
}
```

출력을 쓰시오.

> [!QUIZ]
> **F5. `virtual` 함수와 동적 바인딩 · 확인 7** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> C1 fun A
> C1 fun B
> C1 fun A
> C2 fun B
> C2 fun A
> C2 fun B
> ```
> 
> ### 핵심
> 
> - `funA()`는 base에서 `virtual`이 아님 → **포인터 타입 기준**
> - `funB()`는 base에서 `virtual` → **실제 객체 타입 기준**
> 
> | 호출 | 결과 |
> |---|---|
> | `o1->funA()` | C1 |
> | `o1->funB()` | C1 |
> | `o2->funA()` | C1 |
> | `o2->funB()` | C2 |
> | `o3->funA()` | C2 |
> | `o3->funB()` | C2 |

### F5-B. 호출 순서만 바꾼 변형

다른 족보에서는 호출 순서가 다음과 같이 나옵니다.

```cpp
o1->funcA();
o1->funcB();
o3->funcA();
o3->funcB();
o2->funcA();
o2->funcB();
```

> [!QUIZ]
> **F5. `virtual` 함수와 동적 바인딩 · 확인 8** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> funcA in C1
> funcB in C1
> funcA in C2
> funcB in C2
> funcA in C1
> funcB in C2
> ```
> 
> > 원본 정답에는 첫 줄이 `funA in C1`로 적혀 있지만, 문제 코드의 출력 문자열은 `funcA in C1`입니다. 위 답은 **문제 코드 기준**으로 정리했습니다.
> 
> > 개념은 F5-A와 같아서 전체 코드는 중복 제거했습니다.

### F5-C. 파생 클래스에서만 `virtual`을 붙인 경우

```cpp
class car {
public:
    void showa() { std::cout << "기본 A" << std::endl; }
    void showb() { std::cout << "기본 B" << std::endl; }
};

class rcar : public car {
public:
    virtual void showa() { std::cout << "파생 A" << std::endl; }
    virtual void showb() { std::cout << "파생 B" << std::endl; }
};

int main()
{
    car *ptrObjCar = new rcar;
    ptrObjCar->showa();
    ptrObjCar->showb();
}
```

> [!QUIZ]
> **F5. `virtual` 함수와 동적 바인딩 · 확인 9** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> 기본 A
> 기본 B
> ```
> 
> `virtual`은 **기본 클래스의 함수 선언에서** 붙어 있어야 기본 클래스 포인터를 통한 동적 바인딩이 일어납니다.

---

## F6. `try-catch` 출력 추적

> 같은 구조에서 `throw`의 자료형만 바꾸는 문제가 여러 번 반복되어 **한 문제로 통합**했습니다.

### 기본 코드 — `double`을 던지는 경우

```cpp
#include <iostream>

void fun()
{
    try
    {
        std::cout << "FA\n";
        throw (double)5.0;
        std::cout << "BA\n";
    }
    catch (int i)
    {
        std::cout << "FCA " << i << "\n";
    }
    catch (char c)
    {
        std::cout << "FCB " << c << "\n";
        throw;
    }

    std::cout << "BC\n";
}

int main()
{
    try
    {
        std::cout << "A\n";
        fun();
        std::cout << "B\n";
    }
    catch (int i)
    {
        std::cout << "C " << i << "\n";
    }
    catch (double d)
    {
        std::cout << "D " << d << "\n";
    }
    catch (...)
    {
        std::cout << "E\n";
    }

    std::cout << "F\n";
}
```

> [!QUIZ]
> **F6. `try-catch` 출력 추적 · 확인 10** — 정답 — double 5.0. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 — double 5.0**
>
> ```text
> A
> FA
> D 5
> F
> ```
> 
> `double`은 `fun()` 안의 `int`, `char` catch에 잡히지 않으므로 바로 `main()`의 `catch(double)`로 이동합니다.
> 
> 따라서 다음은 실행되지 않습니다.
> 
> ```cpp
> std::cout << "BA\n";
> std::cout << "BC\n";
> std::cout << "B\n";
> ```

### 자료형 변형 모음

> [!QUIZ]
> **F6. `try-catch` 출력 추적 · 확인 11** — ① `throw 3;`. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **① `throw 3;`**
>
> `int`가 `fun()` 내부에서 잡히며 재던지지 않습니다.
> 
> ```text
> A
> FA
> FCA 3
> BC
> B
> F
> ```

> [!QUIZ]
> **F6. `try-catch` 출력 추적 · 확인 12** — ② `throw 'c';`. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **② `throw 'c';`**
>
> `char`가 `fun()` 안의 `catch(char)`에 잡힌 뒤 `throw;`로 다시 던져집니다.
> 
> ```text
> A
> FA
> FCB c
> E
> F
> ```

> [!QUIZ]
> **F6. `try-catch` 출력 추적 · 확인 13** — ③ `throw true;`. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **③ `throw true;`**
>
> `bool`은 여기의 `int`, `char`, `double` catch와 정확히 일치하지 않으므로 `catch(...)`로 갑니다.
> 
> ```text
> A
> FA
> E
> F
> ```

> [!QUIZ]
> **F6. `try-catch` 출력 추적 · 확인 14** — ④ `throw "K";`. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **④ `throw "K";`**
>
> `"K"`는 문자 하나인 `char`가 아니라 문자열 리터럴이며 예외로 던질 때 `const char*` 타입으로 취급됩니다.
> 
> ```text
> A
> FA
> E
> F
> ```

### 시험에서 자주 틀리는 규칙

1. `throw`가 실행되면 같은 `try` 블록의 그 아래 문장은 실행되지 않음
2. 현재 함수의 적절한 `catch`가 없으면 호출한 함수 쪽으로 예외가 전달됨
3. `throw;`는 **현재 잡은 예외를 그대로 다시 던짐**
4. `catch(...)`는 앞에서 잡히지 않은 나머지 예외를 처리

---

## F7. `rethrow`가 있는 중첩 예외처리

### 문제
다음 프로그램의 출력을 쓰시오.

```cpp
#include <iostream>
using namespace std;

void fun()
{
    try
    {
        cout << "fun pos A\n";
        throw (int)4;
        cout << "fun pos B\n";
    }
    catch (int i)
    {
        cout << "in catch CA with i:" << i << "\n";
        throw;
    }

    cout << "fun pos C\n";
}

int main()
{
    try
    {
        cout << "main pos A\n";
        fun();
        throw (double)2.0;
        cout << "main pos B\n";
    }
    catch (double j)
    {
        cout << "in catch CB with j:" << j << "\n";
    }
    catch (...)
    {
        cout << "in catch CC\n";
    }

    cout << "main pos C\n";
    return 0;
}
```

> [!QUIZ]
> **F7. `rethrow`가 있는 중첩 예외처리 · 확인 15** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> main pos A
> fun pos A
> in catch CA with i:4
> in catch CC
> main pos C
> ```
> 
> ### 흐름
> 
> ```text
> throw int 4
> → fun의 catch(int)
> → throw; 로 다시 int 4를 던짐
> → main의 catch(double)은 불일치
> → catch(...) 실행
> ```
> 
> 따라서 아래 코드는 도달하지 않습니다.
> 
> ```cpp
> throw (double)2.0;
> cout << "main pos B\n";
> ```

---

## F8. `try`와 `catch` 사이 문장 T/F

### 문제
다음 문장은 참인가 거짓인가?

> A catch-block must immediately follow its corresponding try-block. No statements are allowed between these blocks.

> [!QUIZ]
> **F8. `try`와 `catch` 사이 문장 T/F · 확인 16** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> **T (True)**
> 
> 다음처럼 `try`와 `catch` 사이에 일반 문장을 넣을 수 없습니다.
> 
> ```cpp
> try {
>     // ...
> }
> 
> std::cout << "중간 문장";   // 불가
> 
> catch (...) {
>     // ...
> }
> ```

---

## F9. 사용자 정의 `Exception` 클래스

### 문제
다음 프로그램의 출력을 쓰시오.

```cpp
#include <iostream>

class Exception
{
public:
    int code;

    Exception(int i)
    {
        code = i;
    }
};

void foo()
{
    try
    {
        throw Exception(1);
    }
    catch (Exception e)
    {
        std::cout << e.code;
    }
}

int main()
{
    foo();
}
```

> [!QUIZ]
> **F9. 사용자 정의 `Exception` 클래스 · 확인 17** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> 1
> ```
> 
> `Exception(1)` 객체가 생성되고, `catch(Exception e)`가 이를 받아 `e.code`를 출력합니다.

---

## F10. 함수 템플릿 `swap`

### 문제
정수뿐 아니라 여러 자료형에서 사용할 수 있도록 두 값을 바꾸는 함수를 **template 함수**로 작성하시오.

> [!QUIZ]
> **F10. 함수 템플릿 `swap` · 확인 18** — 정답 코드 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 코드 보기**
>
> ```cpp
> #include <iostream>
> using namespace std;
> 
> template <class T>
> void change(T &a, T &b)
> {
>     T temp = a;
>     a = b;
>     b = temp;
> }
> 
> int main()
> {
>     int a = 2;
>     int b = 3;
> 
>     change(a, b);
> 
>     cout << a << ' ' << b << endl;
>     return 0;
> }
> ```
> 
> ### 출력
> 
> ```text
> 3 2
> ```
> 
> ### 핵심 형태
> 
> ```cpp
> template <class T>
> void 함수이름(T &a, T &b)
> ```

---

## F11. 클래스 템플릿 `Factorial`

### 문제
다음 코드의 출력을 쓰시오.

```cpp
#include <iostream>

template <long N>
class Factorial
{
public:
    long Value(void)
    {
        return N * fn_1.Value();
    }

private:
    Factorial<N - 1> fn_1;
};

template <>
class Factorial<0>
{
public:
    long Value(void)
    {
        return 1;
    }
};

int main()
{
    Factorial<5> f;
    std::cout << f.Value() << std::endl;
}
```

> [!QUIZ]
> **F11. 클래스 템플릿 `Factorial` · 확인 19** — 정답 보기. 답을 먼저 적거나 코드를 작성한 뒤 해설과 비교하세요.

> [!ANSWER]
> **정답 보기**
>
> ```text
> 120
> ```
> 
> 전개하면
> 
> ```text
> Factorial<5>
> = 5 × Factorial<4>
> = 5 × 4 × Factorial<3>
> = ...
> = 5 × 4 × 3 × 2 × 1
> = 120
> ```
> 
> 종료 조건은 명시적 특수화입니다.
> 
> ```cpp
> template <>
> class Factorial<0>
> ```

---

## F12. 자료에 언급만 된 추가 출제 포인트

아래 항목들은 총정리 자료에서 **출제 가능성이 있다고 언급**되었지만, 업로드된 자료 안에 완전한 문제+정답 형태가 없어 새 문제를 임의로 만들지는 않았습니다.

- `operator +` 손코딩
- `friend`
- `public / protected / private` 심화
- 포인터 / 더블 포인터를 섞은 접근 가능 여부
- 짧은 생성자 코드 작성
- 간단한 클래스 작성

> 특히 총정리 자료에는 **접근 지정자 표, 생성자, 다형성, template, try-catch를 중요하게 본다**는 메모가 반복해서 나옵니다.

---

## 시험 직전 체크리스트

- [ ] `public / protected / private` 접근 가능 여부를 표로 판단할 수 있다.
- [ ] 기본 생성자에서 `char[]`를 `name[0] = '\0';`로 초기화할 수 있다.
- [ ] 상속 클래스 코드를 직접 작성할 수 있다.
- [ ] base의 `virtual` 유무에 따라 출력 결과를 판단할 수 있다.
- [ ] `throw` 이후 같은 `try`의 아래 코드는 실행되지 않는다는 것을 안다.
- [ ] `throw` 자료형에 맞는 `catch`를 찾을 수 있다.
- [ ] `throw;`가 rethrow라는 것을 안다.
- [ ] 함수 template을 직접 작성할 수 있다.
- [ ] 클래스 template 특수화 구조를 읽을 수 있다.

---

## 중복 제거 기록

| 원본 파일 | 통합된 위치 |
|---|---|
| `cpp족보1번.pdf` | F1 접근 지정자 문제 |
| `cpp족보3번.pdf` | F5 virtual C1/C2 |
| `CPP족보3번-2.pdf` | F5 virtual 문제와 동일 개념 |
| `CPP족보4번.pdf` | F6 `throw double` |
| `CPP족보4번-2.pdf` | F6 `throw "K"` |
| `CPP족보 5번.pdf` | F9 사용자 정의 Exception |
| `CPP족보7번.pdf` | F11 Factorial template |
| `C+++기말고사+총정리+by+박세은.hwp.pdf` | 기말 각 파트의 중복 문제 + 출제 메모 |

---

## 반영 자료

아래 출처와 중복 제거 내역은 제공된 Markdown의 기록입니다. 원본 PDF·문서와의 대조 검증은 이번 편집에 포함되지 않았습니다.

- `C++ 2023 기말고사.pdf` → F1, F2, F4, F5-A, F6, F9, F10, F11
- `C기말_조민성.docx` → F3, F5-B, F7, F8
- `C+++기말고사+총정리+by+박세은.hwp.pdf` → 변형 문제 및 출제 포인트 검증
- 나머지 `CPP족보*.pdf` → 중복 여부 확인 및 교차검증

**추천 사용법:** 먼저 풀고 **정답 확인**을 펼친 뒤, **맞음·헷갈림·틀림**으로 기록하세요. 헷갈리거나 틀린 문제는 복습 화면에서 다시 확인하세요.
