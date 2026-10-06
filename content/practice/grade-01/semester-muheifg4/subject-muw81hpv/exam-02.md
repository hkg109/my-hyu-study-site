---
title: C++ 기말고사 족보
description: 19개 문항으로 구성한 C++ 기말고사 연습 문제와 정답·해설입니다.
week: 0
order: 2
published: true
---

**응시 안내**

- 각 문항의 조건에 따라 출력값, 코드 또는 이유를 작성하시오.
- 별도 언급이 없으면 각 프로그램은 독립적으로 실행하며, 정수 계산 결과는 자료형 범위 안에 있다고 가정한다.
- 답안을 작성한 뒤 정답을 펼쳐 확인하고, 맞음·헷갈림·틀림을 기록할 수 있다.
- 제공된 족보를 연습 시험 형식으로 재구성한 자료이며, 실제 시험의 문항 순서나 배점과는 다를 수 있다.

출처 표기는 제공된 Markdown의 기록을 기준으로 하며, 원본 시험지와 별도로 대조하지 않았습니다.

## 문제 1

**참고 자료:** 2023 기말고사 및 cpp족보1번.pdf를 통합한 접근 지정자 문제. 이 코드별 연도는 제공 자료에 구분되어 있지 않음.

> [!QUIZ]
> 다음 클래스 선언을 기준으로 표를 완성하시오. 각 클래스의 일반 멤버 함수 내부에서 해당 표현을 사용할 수 있으면 O, 없으면 X를 쓰시오. 객체나 포인터의 초기화 여부가 아닌 이름 검색과 접근 권한만 판단하시오.
>
> ```cpp
> class A {
> public:
>     int x;
>     A *objAref;
> private:
>     int y;
> };
>
> class B : public A {
> public:
>     A objA;
> protected:
>     int z;
> };
>
> class C : public B {
> public:
>     C *objCref;
> };
> ```
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | □ | □ | □ |
> | `y` | □ | □ | □ |
> | `z` | □ | □ | □ |
> | `objA.x` | □ | □ | □ |
> | `objA.y` | □ | □ | □ |
> | `objA.z` | □ | □ | □ |
> | `objAref->x` | □ | □ | □ |
> | `objAref->y` | □ | □ | □ |
> | `objAref->z` | □ | □ | □ |
> | `objCref->x` | □ | □ | □ |
> | `objCref->y` | □ | □ | □ |
> | `objCref->z` | □ | □ | □ |

> [!ANSWER]
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

## 문제 2

**참고 자료:** 2023 기말고사 및 cpp족보1번.pdf를 통합한 접근 지정자 문제. 이 코드별 연도는 제공 자료에 구분되어 있지 않음.

> [!QUIZ]
> 다음 클래스 선언을 기준으로 표를 완성하시오. 각 클래스의 일반 멤버 함수 내부에서 해당 표현을 사용할 수 있으면 O, 없으면 X를 쓰시오. 객체나 포인터의 초기화 여부가 아닌 이름 검색과 접근 권한만 판단하시오.
>
> ```cpp
> class A {
> public:
>     int x;
>     A *objAref;
> private:
>     int y;
> };
>
> class B : public A {
> public:
>     A objA;
> protected:
>     int z;
> };
>
> class C : public B {
> public:
>     B objB;
> };
> ```
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | □ | □ | □ |
> | `y` | □ | □ | □ |
> | `z` | □ | □ | □ |
> | `objA.x` | □ | □ | □ |
> | `objA.y` | □ | □ | □ |
> | `objA.z` | □ | □ | □ |
> | `objAref->x` | □ | □ | □ |
> | `objAref->y` | □ | □ | □ |
> | `objAref->z` | □ | □ | □ |
> | `objB.x` | □ | □ | □ |
> | `objB.y` | □ | □ | □ |
> | `objB.z` | □ | □ | □ |

> [!ANSWER]
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

## 문제 3

**참고 자료:** 2023 기말고사 및 cpp족보1번.pdf를 통합한 접근 지정자 문제. 이 코드별 연도는 제공 자료에 구분되어 있지 않음.

> [!QUIZ]
> 다음 클래스 선언을 기준으로 표를 완성하시오. 각 클래스의 일반 멤버 함수 내부에서 해당 표현을 사용할 수 있으면 O, 없으면 X를 쓰시오. 객체나 포인터의 초기화 여부가 아닌 이름 검색과 접근 권한만 판단하시오.
>
> ```cpp
> class A {
> public:
>     int x;
>     A *objAref;
> private:
>     int y;
> protected:
>     int z;
> };
>
> class B : public A {
> public:
>     A objA;
> };
>
> class C {
> public:
>     A objA;
>     A *objAref;
>     B objB;
> };
> ```
>
> | 표현 | in class A | in class B | in class C |
> |---|:---:|:---:|:---:|
> | `x` | □ | □ | □ |
> | `y` | □ | □ | □ |
> | `z` | □ | □ | □ |
> | `objA.x` | □ | □ | □ |
> | `objA.y` | □ | □ | □ |
> | `objA.z` | □ | □ | □ |
> | `objAref->x` | □ | □ | □ |
> | `objAref->y` | □ | □ | □ |
> | `objAref->z` | □ | □ | □ |
> | `objB.x` | □ | □ | □ |
> | `objB.y` | □ | □ | □ |
> | `objB.z` | □ | □ | □ |

> [!ANSWER]
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

## 문제 4

**참고 자료:** 2023 기말고사.

> [!QUIZ]
> 다음 조건을 만족하는 `Student` 클래스를 작성하시오.
>
> 1. `number`와 `name[20]` 멤버를 가진다.
> 2. 두 값을 출력하는 `print()`를 만든다.
> 3. 기본 생성자에서
>    - `number = 0`
>    - `name`을 빈 문자열로 초기화한다.
> 4. `main()`에서 학생 번호와 이름을 입력받아 출력한다.
>
> 이름은 공백 없이 최대 19글자로 입력한다고 가정한다.

> [!ANSWER]
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

## 문제 5

**참고 자료:** C기말_조민성.docx. 연도 미상.

> [!QUIZ]
> 다음 조건을 만족하는 `Book` 클래스를 작성하시오.
>
> 1. `public`인 `char title[50]`
> 2. `private`인 `float price`
> 3. `price`의 getter `get_price()`와 setter `set_price()`
> 4. 기본 생성자에서
>    - `price = 0`
>    - `title`을 빈 문자열로 초기화
> 5. `title`, `price`를 출력하는 멤버함수
> 6. `main()`에서 `Book` 객체를 만들고 `price = 10.0`으로 설정한 뒤 출력

> [!ANSWER]
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

## 문제 6

**참고 자료:** 2023 기말고사.

> [!QUIZ]
> 다음 조건을 만족하도록 클래스를 작성하시오.
>
> 1. `Animal` 클래스의 `id`는 `protected`
> 2. `getId()`, `setId()` 작성
> 3. 기본 생성자와 소멸자 작성
> 4. `Mouse`는 `Animal`을 `public` 상속
> 5. `Mouse::print()`에서 `id` 출력
>
> main에서 정수 하나를 입력받아 id로 설정한 뒤 출력하시오.

> [!ANSWER]
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

## 문제 7

**참고 자료:** 2023 기말고사 및 cpp족보3번.pdf·CPP족보3번-2.pdf. 개별 PDF의 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 출력을 호출 순서대로 쓰시오.
>
> ```cpp
> #include <iostream>
>
> class C1 {
> public:
>     void funA()
>     {
>         std::cout << "C1 fun A" << std::endl;
>     }
>
>     virtual void funB()
>     {
>         std::cout << "C1 fun B" << std::endl;
>     }
> };
>
> class C2 : public C1 {
> public:
>     void funA()
>     {
>         std::cout << "C2 fun A" << std::endl;
>     }
>
>     virtual void funB()
>     {
>         std::cout << "C2 fun B" << std::endl;
>     }
> };
>
> int main()
> {
>     C1 *o1 = new C1();
>     C1 *o2 = new C2();
>     C2 *o3 = new C2();
>
>     o1->funA();
>     o1->funB();
>     o2->funA();
>     o2->funB();
>     o3->funA();
>     o3->funB();
> }
> ```

> [!ANSWER]
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

## 문제 8

**참고 자료:** C기말_조민성.docx. 연도 미상. 생략되어 있던 클래스와 출력문을 독립 실행 가능한 코드로 재구성.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
>
> class C1 {
> public:
>     void funcA()
>     {
>         std::cout << "funcA in C1" << std::endl;
>     }
>
>     virtual void funcB()
>     {
>         std::cout << "funcB in C1" << std::endl;
>     }
> };
>
> class C2 : public C1 {
> public:
>     void funcA()
>     {
>         std::cout << "funcA in C2" << std::endl;
>     }
>
>     virtual void funcB()
>     {
>         std::cout << "funcB in C2" << std::endl;
>     }
> };
>
> int main()
> {
>     C1 *o1 = new C1();
>     C1 *o2 = new C2();
>     C2 *o3 = new C2();
>
>     o1->funcA();
>     o1->funcB();
>     o3->funcA();
>     o3->funcB();
>     o2->funcA();
>     o2->funcB();
> }
> ```

> [!ANSWER]
> ```text
> funcA in C1
> funcB in C1
> funcA in C2
> funcB in C2
> funcA in C1
> funcB in C2
> ```
>

## 문제 9

**참고 자료:** 제공된 기말 족보의 파생 클래스 virtual 항목. 정확한 출제 연도와 개별 출처는 명시되지 않음.

> [!QUIZ]
> 다음 프로그램의 출력을 쓰고 그 이유를 설명하시오.
>
> ```cpp
> #include <iostream>
>
> class car {
> public:
>     void showa() { std::cout << "기본 A" << std::endl; }
>     void showb() { std::cout << "기본 B" << std::endl; }
> };
>
> class rcar : public car {
> public:
>     virtual void showa() { std::cout << "파생 A" << std::endl; }
>     virtual void showb() { std::cout << "파생 B" << std::endl; }
> };
>
> int main()
> {
>     car *ptrObjCar = new rcar;
>     ptrObjCar->showa();
>     ptrObjCar->showb();
> }
> ```

> [!ANSWER]
> ```text
> 기본 A
> 기본 B
> ```
>
> `virtual`은 **기본 클래스의 함수 선언에서** 붙어 있어야 기본 클래스 포인터를 통한 동적 바인딩이 일어납니다.

## 문제 10

**참고 자료:** 2023 기말고사 및 CPP족보4번.pdf. 개별 PDF의 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오. 예외를 처리하는 catch와 처리 후 실행되는 문장을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> void fun()
> {
>     try
>     {
>         std::cout << "FA\n";
>         throw (double)5.0;
>         std::cout << "BA\n";
>     }
>     catch (int i)
>     {
>         std::cout << "FCA " << i << "\n";
>     }
>     catch (char c)
>     {
>         std::cout << "FCB " << c << "\n";
>         throw;
>     }
>
>     std::cout << "BC\n";
> }
>
> int main()
> {
>     try
>     {
>         std::cout << "A\n";
>         fun();
>         std::cout << "B\n";
>     }
>     catch (int i)
>     {
>         std::cout << "C " << i << "\n";
>     }
>     catch (double d)
>     {
>         std::cout << "D " << d << "\n";
>     }
>     catch (...)
>     {
>         std::cout << "E\n";
>     }
>
>     std::cout << "F\n";
> }
> ```

> [!ANSWER]
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

## 문제 11

**참고 자료:** 제공된 기말 족보의 throw 3 항목. 정확한 출제 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오. 예외를 처리하는 catch와 처리 후 실행되는 문장을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> void fun()
> {
>     try
>     {
>         std::cout << "FA\n";
>         throw 3;
>         std::cout << "BA\n";
>     }
>     catch (int i)
>     {
>         std::cout << "FCA " << i << "\n";
>     }
>     catch (char c)
>     {
>         std::cout << "FCB " << c << "\n";
>         throw;
>     }
>
>     std::cout << "BC\n";
> }
>
> int main()
> {
>     try
>     {
>         std::cout << "A\n";
>         fun();
>         std::cout << "B\n";
>     }
>     catch (int i)
>     {
>         std::cout << "C " << i << "\n";
>     }
>     catch (double d)
>     {
>         std::cout << "D " << d << "\n";
>     }
>     catch (...)
>     {
>         std::cout << "E\n";
>     }
>
>     std::cout << "F\n";
> }
> ```

> [!ANSWER]
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

## 문제 12

**참고 자료:** 제공된 기말 족보의 throw char 항목. 정확한 출제 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오. 예외를 처리하는 catch와 처리 후 실행되는 문장을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> void fun()
> {
>     try
>     {
>         std::cout << "FA\n";
>         throw 'c';
>         std::cout << "BA\n";
>     }
>     catch (int i)
>     {
>         std::cout << "FCA " << i << "\n";
>     }
>     catch (char c)
>     {
>         std::cout << "FCB " << c << "\n";
>         throw;
>     }
>
>     std::cout << "BC\n";
> }
>
> int main()
> {
>     try
>     {
>         std::cout << "A\n";
>         fun();
>         std::cout << "B\n";
>     }
>     catch (int i)
>     {
>         std::cout << "C " << i << "\n";
>     }
>     catch (double d)
>     {
>         std::cout << "D " << d << "\n";
>     }
>     catch (...)
>     {
>         std::cout << "E\n";
>     }
>
>     std::cout << "F\n";
> }
> ```

> [!ANSWER]
> `char`가 `fun()` 안의 `catch(char)`에 잡힌 뒤 `throw;`로 다시 던져집니다.
>
> ```text
> A
> FA
> FCB c
> E
> F
> ```

## 문제 13

**참고 자료:** 제공된 기말 족보의 throw bool 항목. 정확한 출제 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오. 예외를 처리하는 catch와 처리 후 실행되는 문장을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> void fun()
> {
>     try
>     {
>         std::cout << "FA\n";
>         throw true;
>         std::cout << "BA\n";
>     }
>     catch (int i)
>     {
>         std::cout << "FCA " << i << "\n";
>     }
>     catch (char c)
>     {
>         std::cout << "FCB " << c << "\n";
>         throw;
>     }
>
>     std::cout << "BC\n";
> }
>
> int main()
> {
>     try
>     {
>         std::cout << "A\n";
>         fun();
>         std::cout << "B\n";
>     }
>     catch (int i)
>     {
>         std::cout << "C " << i << "\n";
>     }
>     catch (double d)
>     {
>         std::cout << "D " << d << "\n";
>     }
>     catch (...)
>     {
>         std::cout << "E\n";
>     }
>
>     std::cout << "F\n";
> }
> ```

> [!ANSWER]
> `bool`은 여기의 `int`, `char`, `double` catch와 정확히 일치하지 않으므로 `catch(...)`로 갑니다.
>
> ```text
> A
> FA
> E
> F
> ```

## 문제 14

**참고 자료:** CPP족보4번-2.pdf. 연도 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰시오. 예외를 처리하는 catch와 처리 후 실행되는 문장을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> void fun()
> {
>     try
>     {
>         std::cout << "FA\n";
>         throw "K";
>         std::cout << "BA\n";
>     }
>     catch (int i)
>     {
>         std::cout << "FCA " << i << "\n";
>     }
>     catch (char c)
>     {
>         std::cout << "FCB " << c << "\n";
>         throw;
>     }
>
>     std::cout << "BC\n";
> }
>
> int main()
> {
>     try
>     {
>         std::cout << "A\n";
>         fun();
>         std::cout << "B\n";
>     }
>     catch (int i)
>     {
>         std::cout << "C " << i << "\n";
>     }
>     catch (double d)
>     {
>         std::cout << "D " << d << "\n";
>     }
>     catch (...)
>     {
>         std::cout << "E\n";
>     }
>
>     std::cout << "F\n";
> }
> ```

> [!ANSWER]
> `"K"`는 문자 하나인 `char`가 아니라 문자열 리터럴이며 예외로 던질 때 `const char*` 타입으로 취급됩니다.
>
> ```text
> A
> FA
> E
> F
> ```

## 문제 15

**참고 자료:** C기말_조민성.docx. 연도 미상.

> [!QUIZ]
> 다음 프로그램의 전체 출력을 쓰고, throw; 이후 예외가 전달되는 경로를 설명하시오.
>
> ```cpp
> #include <iostream>
> using namespace std;
>
> void fun()
> {
>     try
>     {
>         cout << "fun pos A\n";
>         throw (int)4;
>         cout << "fun pos B\n";
>     }
>     catch (int i)
>     {
>         cout << "in catch CA with i:" << i << "\n";
>         throw;
>     }
>
>     cout << "fun pos C\n";
> }
>
> int main()
> {
>     try
>     {
>         cout << "main pos A\n";
>         fun();
>         throw (double)2.0;
>         cout << "main pos B\n";
>     }
>     catch (double j)
>     {
>         cout << "in catch CB with j:" << j << "\n";
>     }
>     catch (...)
>     {
>         cout << "in catch CC\n";
>     }
>
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

## 문제 16

**참고 자료:** C기말_조민성.docx. 연도 미상.

> [!QUIZ]
> 다음 문장의 참·거짓을 판단하고 이유를 설명하시오.
>
> “try 블록과 바로 뒤의 catch 블록 사이에는 일반 실행문을 삽입할 수 없다.”

> [!ANSWER]
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

## 문제 17

**참고 자료:** 2023 기말고사 및 CPP족보 5번.pdf. 개별 PDF의 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 출력을 쓰시오.
>
> ```cpp
> #include <iostream>
>
> class Exception
> {
> public:
>     int code;
>
>     Exception(int i)
>     {
>         code = i;
>     }
> };
>
> void foo()
> {
>     try
>     {
>         throw Exception(1);
>     }
>     catch (Exception e)
>     {
>         std::cout << e.code;
>     }
> }
>
> int main()
> {
>     foo();
> }
> ```

> [!ANSWER]
> ```text
> 1
> ```
>
> `Exception(1)` 객체가 생성되고, `catch(Exception e)`가 이를 받아 `e.code`를 출력합니다.

## 문제 18

**참고 자료:** 2023 기말고사.

> [!QUIZ]
> 같은 자료형의 두 변수 값을 서로 바꾸는 함수 템플릿 change를 작성하시오. 원본 값이 변경되도록 매개변수를 선언하시오. main에서 정수 a = 2, b = 3으로 호출한 뒤 두 값을 출력하는 프로그램과 예상 출력도 쓰시오.

> [!ANSWER]
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

## 문제 19

**참고 자료:** 2023 기말고사 및 CPP족보7번.pdf. 개별 PDF의 연도는 미상.

> [!QUIZ]
> 다음 프로그램의 출력값을 구하고, `Factorial<0>`의 역할을 설명하시오.
>
> ```cpp
> #include <iostream>
>
> template <long N>
> class Factorial
> {
> public:
>     long Value(void)
>     {
>         return N * fn_1.Value();
>     }
>
> private:
>     Factorial<N - 1> fn_1;
> };
>
> template <>
> class Factorial<0>
> {
> public:
>     long Value(void)
>     {
>         return 1;
>     }
> };
>
> int main()
> {
>     Factorial<5> f;
>     std::cout << f.Value() << std::endl;
> }
> ```

> [!ANSWER]
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
