---
title: "과목 안내와 전체 지도"
description: "2026 C++ Programming(Arne Kutzner 교수) 강의의 목표·주차 계획·평가 기준과, 이 사이트의 11편 강의가 슬라이드 덱과 어떻게 짝지어지는지 한 장의 지도로 정리합니다."
order: 0
published: true
duration: 20
---

# 과목 안내와 전체 지도

이 과목은 **절차형 프로그래밍(중간고사 전) → 객체지향 프로그래밍(중간고사 후)** 순서로 진행됩니다. 이 사이트의 C++ 강의는 2026년 2학기 슬라이드(Lecture 1–11)를 기준으로 처음부터 다시 짰습니다. 강의 번호는 슬라이드 번호가 아니라 **배우는 순서**이고, 각 강의 첫머리에 어느 슬라이드 덱을 정리한 것인지 적었습니다.

---

## 1. 한 장으로 보는 과목

[![중간고사 범위의 기초 문법, 형 변환·제어 구조, 함수, 참조·배열, 포인터와 기말고사 범위의 클래스, 상속·다형성, 예외, 템플릿, 시험 직전 정리를 두 구간으로 나눈 C++ 과목 지도](/materials/diagrams/cpp-00-course-map.svg)](/materials/diagrams/cpp-00-course-map.svg)

*그림 0-1 · C++ 과목 지도 — 누르면 원본 크기로 열린다.*

| 사이트 강의 | 슬라이드 | 주차(Schedule) | 핵심 질문 |
| --- | --- | --- | --- |
| [01 C++ 시작하기](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-01) | Lecture 2 | 2주 | 프로그램은 어떻게 실행 파일이 되고, 값은 어떻게 저장·계산되나? |
| [02 형 변환과 제어 구조](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-02) | Lecture 3 | 3주 | 자료형이 섞이면? 조건과 반복으로 흐름을 어떻게 바꾸나? |
| [03 함수·재귀·스코프](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-03) | Lecture 4 | 4주 | 코드를 함수로 나누면 값은 어떻게 오가고, 이름은 어디까지 보이나? |
| [04 참조·배열·vector](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-04) | Lecture 5 | 5주 | 같은 칸의 다른 이름(참조)과 붙어 있는 칸들(배열) |
| [05 오버로딩·포인터·동적 메모리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-05) | Lecture 6 | 6주 | 주소로 칸을 다루는 법, 실행 중에 메모리를 빌리는 법 |
| [06 객체지향과 클래스](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-06) | Lecture 9 | 9주 | 데이터와 함수를 묶은 새 자료형, 생성자·소멸자 |
| [07 상속·다형성·연산자 오버로딩](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-07) | Lecture 10 | 10–11주 | 물려받고, 바꿔 끼우고, 연산자를 정의하기 |
| [08 예외 처리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-08) | Lecture 11 | 12주 | 문제가 생겼을 때 정상 흐름에서 빠져나와 처리하기 |
| [09 템플릿과 STL](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-09) | (슬라이드 공개 전) | 13–14주 | 자료형만 다른 코드를 하나의 틀로 |
| [10 시험 직전 정리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-10) | 족보 | 8·15주 대비 | 자주 틀리는 규칙 모음 |

> [!NOTE]
> 슬라이드 7(구조체·열거형·비트 연산)은 아직 받지 않아 이 사이트에는 없습니다. 템플릿·STL(09)은 이전 학기 자료와 족보를 바탕으로 썼고, 2026 슬라이드가 나오면 맞춰 고칩니다.

---

## 2. 과목 목표와 진행 방식

**목표(Lecture 1 Goals)**

- C++ 언어와 객체지향 프로그래밍의 기본 개념을 익힌다.
- 객체(Object), 클래스(Class), 상속(Inheritance)의 뜻을 이해한다.
- 기초 프로그래밍 능력을 기른다.
- Python, TypeScript, Rust, Java 같은 다른 언어 사이에서 C++의 위치를 이해한다(01강 1절).
- Codex 같은 AI 코딩 에이전트 시대에 C++을 어떻게 다룰지 생각한다.

**진행 방식**

| 항목 | 내용 |
| --- | --- |
| 강의 | 영어로 진행, 녹화본은 Hanyang LMS에 올라옴 |
| 실습(Exercising) | TA가 강의를 요약하고 학생과 함께 연습, 주로 한국어 |
| 과제 | 중간·기말 대비용. 보고서를 PDF로 Hanyang LMS에 제출 |
| 교재 | Stephen Prata, *C++ Primer Plus* (6th ed.) — **권장일 뿐 구매 필수 아님** |

**평가와 출석**

| 항목 | 비율 |
| --- | ---: |
| 중간고사 | 35% |
| 기말고사 | 35% |
| 과제 보고서 | 20% |
| 출석 | 10% |

- **절대평가:** A는 만점의 90% 이상(A+는 95%), B는 75%(B+는 85%), C는 60%(C+는 70%), D는 45% 이상.
- **출석:** 전체 수업의 2/3 이상 출석해야 하며, **10번 넘게 결석하면 자동으로 F**.
- **병결 서류:** 결석 후 **2주 안에** 제출. 예비군·건강 문제는 학교 시스템에서 바로 처리 가능.
- **늦은 과제:** LMS에서 "late"로 표시되면 받은 점수의 **30% 감점**(100점 → 70점).

---

## 3. 이 사이트로 공부하는 법

1. **강의 순서대로** 읽는다. 뒤 강의는 앞 강의의 용어를 그대로 쓴다.
2. 각 절의 **그림**을 먼저 보고, 코드를 **한 줄씩 손으로 추적**한다(변수마다 상자를 그리고 값을 갱신).
3. **QUIZ** 상자는 답을 열기 전에 종이에 먼저 쓴다. 족보와 같은 유형이다.
4. 시험 전에는 [10 시험 직전 정리](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-10)와 **족보** 탭의 문제를 푼다.

> [!EXAM]
> 시험 문제는 대부분 **출력 추적, 컴파일 오류 찾기, 짧은 코드 작성**입니다. 실행해 보지 않고 머리로 답을 내야 하므로, 표를 그려 추적하는 습관이 점수를 가릅니다.

---

## 학습 경로

[01 C++ 시작하기 →](/lectures/grade-01/semester-muheifg4/subject-muw81hpv/lecture-01)
