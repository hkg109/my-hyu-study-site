---
title: "9장 · 전사적 애플리케이션: ERP·SCM·CRM"
description: "전사 시스템(ERP)의 통합 데이터베이스, 공급망과 채찍 효과·푸시와 풀 모델(SCM), 운영적·분석적 CRM과 CLTV·이탈률, 전사 애플리케이션의 도입 과제와 차세대 애플리케이션·AI까지 교재 그림과 개념·판서·해설·오답 주의·예제·확인 문제로 정리한 Chapter 9 교재형 필기."
order: 7
published: true
duration: 110
tags: [정시개, MIS, 9장, ERP, SCM, CRM, 채찍 효과, 전사 애플리케이션]
objectives:
  - 전사 시스템(ERP)이 통합 모듈과 하나의 중앙 데이터베이스로 업무를 연결하는 방식과 비즈니스 가치를 설명한다.
  - 공급망의 상류·하류·내부 프로세스, 채찍 효과, JIT·안전 재고, 푸시·풀 모델을 구분하고 SCM 시스템의 두 종류를 설명한다.
  - 글로벌 공급망의 추가 과제와 인터넷·AI의 역할을 설명한다.
  - CRM의 영업·마케팅·서비스 기능, PRM·ERM, 운영적 CRM과 분석적 CRM, CLTV와 이탈률을 설명한다.
  - 전사 애플리케이션 도입의 과제(비용·프로세스 변화·전환 비용·데이터 표준화)와 차세대 애플리케이션·AI 활용을 평가한다.
---

## 학습 경로

[이전: 5장](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-06) · [1장으로 돌아가기](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-01)

**범위:** Chapter 9 슬라이드 1–31 · ERP → SCM → Global SCM → CRM → Challenges → Next-Generation → AI

[Chapter 9 원본 PDF](/materials/mis-exam-slides/ch09_18ed.pdf)

**장 순서:** 이 과목은 ==5장 다음에 9장==을 배운다. 6–8장은 이번 범위가 아니다. 9장은 2장에서 맛보기로 본 ==전사적 애플리케이션 네 가지(ERP·SCM·CRM·KMS) 가운데 ERP·SCM·CRM==을 자세히 다룬다.

**예시 박스 읽는 법:** **예시** 박스는 ==슬라이드의 실제 기업 사례·수치와 교수님 메모==를 교재 설명으로 보충한 것이다. 시험에서 “이 사례는 어떤 시스템·개념인가?”로 나오므로 ==사례 → 시스템 → 개념==을 함께 외운다. 장 끝 **사례 총정리**에 한 표로 모았다. 슬라이드에는 없고 교재에서 가져온 설명은 **교재 보충**이라고 표시했다.

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| ERP의 정의(통합 모듈 + 중앙 DB), “one company, one database” | ★★★ | 정의 고르기, Figure 9.1 해석 |
| ERP 구현 방식(기능 선택 → 프로세스 매핑 → configuration tables), 최소 커스터마이징 | ★★★ | 왜 회사가 소프트웨어에 맞춰야 하나 |
| 상류·하류·내부 공급망 | ★★ | 기업을 상류/하류로 분류 |
| JIT · 안전 재고 · 채찍 효과 | ★★★ | 채찍 효과의 원인과 해결 |
| SCM planning vs execution 시스템, demand planning | ★★★ | 기능을 두 시스템으로 분류 |
| 푸시(build-to-stock) vs 풀(build-to-order), 순차 vs 동시 공급망 | ★★★ | 모델 구분, 슬로건, 사례(Dell·Walmart) |
| CRM 정의, PRM·ERM, SFA·고객 서비스·마케팅, cross-selling | ★★★ | 기능 분류 |
| 운영적 CRM vs 분석적 CRM, CLTV, churn rate | ★★★ | 두 CRM 구분, 지표 정의 |
| 도입 과제(비용·프로세스 변화·switching costs·데이터 표준화) | ★★ | 전환 비용의 예 |
| 차세대 애플리케이션(SOA·클라우드·소셜 CRM·BI), AI | ★★ | 특징 고르기, 선도 업체 |

| 슬라이드 | 중심 질문 | 공부할 개념 |
| --- | --- | --- |
| 1–3 | 무엇을 배우며 사례는? | 영상 사례, 학습목표, TrueBlue |
| 4–7 | ERP는 어떻게 일하고 무엇을 주나? | 통합 모듈·중앙 DB, Figure 9.1, 구현, 비즈니스 가치 |
| 8–16 | 공급망은 어떻게 관리하나? | 상류·하류, Figure 9.2, JIT·안전 재고·채찍 효과, SCM 소프트웨어, 푸시·풀, 인터넷 공급망, 가치 |
| 17 | 공급망이 세계로 넓어지면? | 글로벌 SCM 과제, 인터넷·AI |
| 18–27 | 고객을 어떻게 알고 관리하나? | CRM 정의, Figure 9.6–9.10, PRM·ERM, SFA, 운영적·분석적 CRM, CLTV, churn rate |
| 28–31 | 도입은 왜 어렵고 앞으로는? | 비용·변화·전환 비용, 차세대 애플리케이션, 소셜 CRM, BI·AI |

**책 읽는 법:** 슬라이드 제목 아래의 짧은 목록과 요약 한 줄이 강의 **핵심 필기**다. **개념**은 정의, **판서**는 한눈 정리, **해설**은 쉬운 설명, **오답 주의**는 시험 함정, **예제**는 풀이 연습, **확인 문제**의 답은 단원 끝 *정답과 해설*에 있다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!BOARD]
> **9장 한 줄 지도**
>
> - ==blue:ERP== = 회사 **안**을 하나의 데이터베이스로 묶는다 (재무·인사·생산·영업)
> - ==blue:SCM== = 회사와 **공급자·유통 쪽** 바깥을 묶는다 (사고 → 만들고 → 옮기기)
> - ==blue:CRM== = 회사와 **고객 쪽**을 묶는다 (영업·마케팅·서비스)
> - 셋 다 ==모범 사례(best practices) 프로세스가 미리 들어 있는 소프트웨어== → 회사가 소프트웨어에 맞춰 일하는 방식을 바꿔야 효과가 난다

> [!PAGEBREAK]

## Slide 1 — Achieving Operational Excellence and Customer Intimacy: Enterprise Applications

- Chapter 9 주제: **전사적 애플리케이션(Enterprise Applications)으로 ==운영 탁월성(operational excellence)==과 ==고객 친밀성(customer intimacy)==을 달성하기**

> **ERP·SCM으로 일을 효율적으로(운영 탁월성), CRM으로 고객을 깊이 알기(고객 친밀성)**

> [!NOTE]
> 장 제목의 두 목표는 1장에서 본 ==정보시스템의 여섯 가지 전략적 목표== 가운데 두 개다. ERP와 SCM은 주로 ==운영 탁월성==(비용·시간·재고를 줄임)을, CRM은 ==고객 친밀성==(고객을 알고 붙잡음)을 돕는다.

> [!EXAMPLE]
> **원본 영상 사례 제목 (Slide 1)**
>
> | 영상 | 연결 개념 |
> | --- | --- |
> | **Case 1 · Maersk Develops a Global Shipping Management System** | 세계 해운사가 전 세계 화물·선박 정보를 한 시스템으로 관리 — 글로벌 SCM, 전사 시스템 |
> | **Case 2 · Life Time Fitness Gets in Shape with Salesforce CRM** | 피트니스 체인이 클라우드 CRM으로 회원·영업 정보를 통합 — CRM, 클라우드 기반 CRM(Salesforce) |

---

## Slide 2 — Learning Objectives

- 9.1 Understand ERP Systems.
- 9.2 Understand SCM Systems.
- 9.3 Describe global SCM challenges.
- 9.4 Understand CRM Systems.
- 9.5 Discuss enterprise application challenges.
- 9.6 Describe how enterprise applications are using AI.
- 9.7 Understand how the information in this chapter can help your career.

> **ERP → SCM → 글로벌 SCM → CRM → 도입 과제 → AI**

---

## Slide 3 — Opening Case: TrueBlue Speeds Ahead with Enterprise Applications

- **Problem** — (슬라이드 빈칸: 수업 때 채움)
- **Solutions** — (슬라이드 빈칸: 수업 때 채움)

> **오프닝 케이스는 “문제 → 해결(전사 애플리케이션) → 결과” 틀로 읽는다**

> [!NOTE]
> 슬라이드에는 Problem과 Solutions의 제목만 있고 내용이 비어 있다. 수업에서 받아 적은 내용을 아래 틀에 채워 두면 된다. 시험에서는 오프닝 케이스의 세부 수치보다 ==“어떤 문제를 어떤 전사 애플리케이션으로 풀었나”==가 나온다.
>
> | 칸 | 채울 내용 |
> | --- | --- |
> | 문제(Problem) | 흩어진 시스템·데이터 때문에 생긴 비효율은? |
> | 해결(Solutions) | 도입한 전사 애플리케이션(ERP·SCM·CRM 중 무엇?)과 기술(클라우드 등) |
> | 결과 | 속도·비용·고객 서비스가 어떻게 좋아졌나 |

> [!PAGEBREAK]

## PART 1 · 전사 시스템(ERP)

## Slide 4 — 9.1 Understand ERP Systems

- Also known as ==Enterprise resource planning (ERP) systems== (전사 시스템 = ERP)
- Based on a suite of ==integrated software modules== and a ==common central database==
- ==Collects data from many divisions== of firm for use in nearly all of firm’s internal business activities
- ==Information entered in one process is immediately available for other processes== (see Fig. 9.1)
- **AI and ERP Systems:** AI를 ERP에 통합하면 여러 기능에 걸쳐 조직 성과를 높일 수 있다. AI 기반 ERP는 ==아주 많은 양의 데이터에서 패턴==을 찾는다.

> **ERP = 통합 소프트웨어 모듈 + 하나의 중앙 데이터베이스 → 한 번 입력하면 모든 부서가 바로 쓴다**

> [!CONCEPT]
> **Enterprise systems (Enterprise resource planning, ERP)** — ==통합된 소프트웨어 모듈 묶음==과 ==공통 중앙 데이터베이스==를 기반으로, 회사의 여러 부서에서 데이터를 모아 ==거의 모든 내부 업무 활동==에 쓰게 하는 시스템. 한 프로세스에서 입력한 정보가 ==즉시== 다른 프로세스에서 쓰인다.

> [!BOARD]
> - 모듈: 재무·회계 / 인사 / 생산 / 영업·마케팅
> - 공통점: ==같은 데이터베이스 하나==를 함께 읽고 쓴다
> - 결과: 부서마다 따로 입력·대조하던 일이 사라진다 → ==중복 제거, 처리 시간 단축==

> [!NOTE]
> ERP가 없는 회사를 떠올려 보자. 영업팀은 주문을 엑셀에, 생산팀은 생산 계획을 다른 시스템에, 회계팀은 송장을 또 다른 프로그램에 적는다. 같은 주문을 세 번 입력하고, 숫자가 서로 안 맞으면 누군가 대조해야 한다. ERP에서는 영업이 주문을 한 번 입력하면 ==생산은 바로 만들 양을, 회계는 바로 받을 돈을== 본다.

> [!EXAMPLE]
> **Alcoa (Slide 4)** — 세계적 알루미늄 기업 Alcoa는 전사 소프트웨어를 도입해 ==중복된 프로세스와 시스템을 없애고==, ==requisition-to-pay(구매 요청 → 대금 지급) 주기 시간==을 줄여 ==전 세계 비용의 20%==를 절감했다.
>
> → 연결 개념: ERP의 비즈니스 가치(운영 효율). 효과적인 전사 소프트웨어 구현이 얼마나 큰 가치를 낼 수 있는지 보여 주는 사례.

---

## Slide 5 — Figure 9.1 How Enterprise Systems Work

[![가운데 중앙 데이터베이스를 재무·회계, 영업·마케팅, 인사, 생산 네 모듈이 둘러싸고 양방향 화살표로 연결되며 모듈마다 다루는 데이터가 적힌 그림](/materials/diagrams/mis-fig-9-01.svg)](/materials/diagrams/mis-fig-9-01.svg)

*Figure 9.1 · How Enterprise Systems Work — 누르면 원본 크기로 열린다.*

| 모듈 | 중앙 DB에 넣고 꺼내는 데이터 |
|---|---|
| **Finance & Accounting** | Cash on hand, Accounts receivable, Customer credit, Revenue |
| **Sales & Marketing** | Orders, Sales forecasts, Return requests, Price changes |
| **Human Resources** | Hours worked, Labor cost, Job skills |
| **Manufacturing & Production** | Materials, Production schedules, Shipment dates, Production capacity, Purchases |

> **핵심 아이디어 = ==“one company, one database”== — 따로 떨어진 데이터베이스들의 모음(a collection of disconnected databases)이 아니다**

**그림 읽기:** 네 모듈이 서로 직접 연결된 것이 아니라 ==모두 가운데 데이터베이스를 거친다==. 화살표가 양방향인 것은 각 모듈이 데이터를 ==넣기도 하고 꺼내기도== 한다는 뜻이다. 영업이 넣은 주문(Orders)은 생산의 생산 일정(Production schedules)과 회계의 매출(Revenue)로 이어진다.

> [!TRAP]
> ==red:ERP의 모듈들이 각자 자기 데이터베이스를 갖고 서로 데이터를 주고받는다==는 설명은 오답이다. 핵심은 ==하나의 공통 중앙 데이터베이스==다. “여러 DB를 연결한 것”이 아니라 “하나의 DB를 함께 쓰는 것”.

---

## Slide 6 — ERP Software

- Built around ==thousands of predefined business processes that reflect best practices==
  - Finance and accounting
  - Human resources
  - Manufacturing and production
  - Sales and marketing
- To implement, firms:
  - ==Select functions== of system they wish to use
  - ==Map business processes to software processes==
  - Use software’s ==configuration tables== for customizing (→ 교재 표)

> **ERP 소프트웨어 = 모범 사례 프로세스 수천 개를 미리 담은 상자 → 회사는 고르고, 맞추고, 설정표로 조정한다**

> [!CONCEPT]
> **Best practices (모범 사례)** — 업계에서 가장 성공적인 해법이나 문제 해결 방법. ERP 소프트웨어는 이런 프로세스를 ==미리 정의(predefined)==해 담고 있다.
>
> **Configuration tables (설정표)** — 프로그램 코드를 고치지 않고, 표의 값을 골라 소프트웨어를 회사 사정에 맞추는 도구. 예: 제품을 사업부별로 관리할지 지역별로 관리할지 선택.

> [!BOARD]
> **ERP 구현 3단계**
>
> ① ==blue:쓸 기능 선택== → ② ==blue:회사 프로세스를 소프트웨어 프로세스에 대응(mapping)== → ③ ==blue:configuration tables로 조정==

**교수님 메모 · 왜 최소한만 고치나:**
- ==ERP는 매우 복잡==해서, ==지나친 커스터마이징(extensive customization)은 시스템 성능을 떨어뜨리고==, ERP의 주된 이점인 ==정보·프로세스 통합을 해칠 수 있다==.
- 그래서 회사는 ==소프트웨어의 업무 프로세스에 맞춰 일하는 방식을 바꿔야== 한다 (Companies must change the way they work to conform to the business processes defined by the system’s software).

> [!NOTE]
> 맞춤 양복과 기성복으로 생각하면 쉽다. ERP는 잘 만든 기성복(모범 사례)이다. 소매 길이 정도는 설정표로 줄일 수 있지만, 옷을 뜯어 다시 짓기 시작하면(코드 수정) 비싸지고, 다음 버전으로 업그레이드할 때마다 또 뜯어야 하며, 부서끼리 딱 맞던 연결이 어긋난다. 그래서 ==옷에 몸을 맞추는== 쪽, 즉 회사 프로세스를 바꾸는 쪽이 권장된다.

> [!TRAP]
> ==red:“ERP를 도입할 때는 회사의 기존 프로세스에 맞게 소프트웨어를 최대한 많이 고쳐야 한다”==는 오답. 정답은 ==소프트웨어 변경은 최소화하고 회사가 소프트웨어의 프로세스에 맞춘다==.

---

## Slide 7 — Business Value of Enterprise Systems

- ==Increase operational efficiency==
- Provide ==firm-wide information== to support better decisions
- Enable ==rapid responses to customer requests== for information or products
- Include ==analytical tools== (to use the data the system captures) to evaluate overall organizational performance and improve decision-making
- Allow ==senior management to find out easily and at any moment== how a particular organizational unit is performing

> **ERP의 가치 = 효율↑ + 전사 정보로 더 나은 결정 + 고객 요청에 빠른 응답 + 분석 도구 + 경영진의 실시간 파악**

**교수님 메모:** 전사 시스템이 ==조직 전체에 공통의 표준화된 데이터 정의와 형식(common standardized definitions and formats for data)==을 강제한다는 것은 무엇을 뜻할까? → 모든 부서가 ==“고객”, “매출”, “재고” 같은 말을 같은 뜻으로 쓰게== 된다. 그래서 본사가 지사별 성과를 바로 비교할 수 있다.

> [!EXAMPLE]
> **가상 예시** — 전국 지점이 있는 회사에서 A지점은 “매출”을 주문 시점으로, B지점은 입금 시점으로 기록했다면 두 지점 숫자를 그대로 비교할 수 없다. ERP는 정의를 하나로 맞추므로 사장이 ==언제든 지점별 성과를 같은 기준으로== 본다(마지막 항목).

> [!CHECK]
> **1.** ERP를 “통합 모듈”과 “중앙 데이터베이스”라는 말을 넣어 정의하고, “one company, one database”의 뜻을 쓰시오.
>
> **2.** ERP 소프트웨어 구현의 세 단계를 쓰고, 지나친 커스터마이징이 피해야 할 이유 두 가지를 쓰시오.
>
> **3.** 전사 시스템의 비즈니스 가치 다섯 가지를 쓰시오.

> [!PAGEBREAK]

## PART 2 · 공급망 관리(SCM)

## Slide 8 — 9.2 Understand SCM Systems: The Supply Chain

- **Supply chain** = Network of organizations and processes for:
  - ==Procuring materials== (원자재 조달)
  - ==Transforming materials into products== (제품으로 변환)
  - ==Distributing the products== (제품 유통)
- **Upstream supply chain:** Firm’s ==suppliers, suppliers’ suppliers==, processes for managing relationships with them
- **Downstream supply chain:** Organizations and processes responsible for ==delivering products to customers==
- ==Internal supply chain processes== (교재 p.325)

> **공급망 = 사고(조달) → 만들고(변환) → 옮기는(유통) 조직과 프로세스의 네트워크. 회사를 기준으로 공급자 쪽은 상류, 고객 쪽은 하류**

> [!CONCEPT]
> **Supply chain (공급망)** — 원자재를 조달하고, 원자재를 중간재와 완제품으로 바꾸고, 완제품을 고객에게 유통하는 ==조직과 업무 프로세스의 네트워크==.
>
> **Upstream (상류)** — 회사의 공급자, 공급자의 공급자, 그리고 그들과의 관계를 관리하는 프로세스.
>
> **Downstream (하류)** — 제품을 고객에게 전달하는 조직과 프로세스(유통업체, 소매점 등).
>
> **Internal supply chain (내부 공급망)** — 회사 안에서 공급자에게 받은 재료를 완제품으로 바꾸는 프로세스(재고 관리, 생산 일정 등). *(교재 보충)*

> [!BOARD]
> ==blue:상류(공급자 ← ← )== — [ 회사 = 내부 공급망 ] — ==blue:하류( → → 고객)==

**교수님 메모:** SCM 소프트웨어는 ==수천 개의 공급자==가 얽힐 수 있는 복잡한 공급망을 관리하는 전사 소프트웨어의 한 종류다. 예: ==Nike 운동화의 공급망==. 상류에는 어떤 기업이? 하류에는? (다음 슬라이드)

> [!TRAP]
> 상류·하류는 ==기준이 되는 회사==에 따라 정해진다. 강물에 비유하면 원료가 흘러오는 쪽이 상류, 제품이 흘러가는 쪽이 하류다. ==red:유통업체·소매점은 하류==, ==red:부품 공급자·원자재 공급자는 상류==.

---

## Slide 9 — Figure 9.2 Nike’s Supply Chain

[![왼쪽에 3차·2차·1차 공급자가 나무 모양으로 계약 공급자에 연결되고 Nike에서 유통업체, 소매점, 고객으로 이어지며 위쪽은 상류 정보, 아래쪽은 하류 정보가 적힌 그림](/materials/diagrams/mis-fig-9-02.svg)](/materials/diagrams/mis-fig-9-02.svg)

*Figure 9.2 · Nike’s Supply Chain — 누르면 원본 크기로 열린다.*

| 위치 | 구성 | 오가는 정보 |
|---|---|---|
| **상류** | Tier 3 → Tier 2 → Tier 1 Suppliers(Contract Supplier) | ==Capacity, inventory level, delivery schedule, payment terms== |
| **회사** | Nike | — |
| **하류** | Distributor → Retailer → Customer | ==Orders, return requests, repair and service requests, payments== |

> **Nike 공급망은 운동화와 밑창 공급자(상류)부터 고객(하류)까지 정보가 양방향으로 흘러 사고·만들고·옮기는 활동을 조정한다**

**그림 읽기:** 왼쪽의 작은 상자들이 ==3차 공급자==(예: 고무·원단 원료), 가운데가 ==2차 공급자==(밑창·부품), 그 옆이 Nike와 직접 계약한 ==1차 공급자(contract supplier)==다. 화살표가 모두 ==양방향==이라는 점이 중요하다. 물건은 한쪽으로 가지만 ==정보는 양쪽으로== 흐른다.

**슬라이드 메모:** 이 그림은 단순화된 공급망으로, 상류는 ==운동화와 운동화 밑창 공급자==만 보여 준다. 계약 공급자로부터의 양방향 경로가 하류 프로세스를 나타낸다.

> [!NOTE]
> Nike는 공장을 직접 거의 갖지 않고 ==계약 제조업체(contract manufacturers)==에 생산을 맡긴다(교재 보충). 그래서 Nike의 핵심 능력은 “만들기”보다 ==수많은 공급자를 정보로 조정하는 능력==이고, 이것이 SCM 시스템이 필요한 이유다.

---

## Slide 10 — Supply Chain Management

- Inefficiencies ==cut into(= interrupt) a company’s operating costs==
  - Can ==waste up to 25 percent of operating expenses==
- **Just-in-time strategy**
  - 부품이 ==필요한 바로 그 순간에 도착==하고, 완제품은 조립 라인을 떠나자마자 출하되도록 하는 전략
- **Safety stock:** ==buffer for lack of flexibility== in supply chain (공급망의 유연성 부족에 대비한 완충 재고)
- **Bullwhip effect**
  - ==Information about product demand gets distorted== as it passes from one entity to next across supply chain
- ↔ ==Low fill rates also costly== because business may be lost from canceled orders (재고가 부족해 주문을 못 채우는 것도 비용 — 취소된 주문으로 사업을 잃는다)

> **공급망 비효율은 운영비의 최대 25%를 낭비 → 완벽한 정보면 JIT, 불확실하면 안전 재고, 정보가 왜곡되면 채찍 효과**

**교수님 메모 · 비효율의 원인:** ==부품 부족, 공장 가동률 저하(underutilized plant capacity), 과도한 완제품 재고, 높은 운송비== — 이것들은 모두 ==시기를 놓치거나 부정확한 정보(untimely or inaccurate information)== 때문에 생긴다.
- ==완벽한 정보==가 있으면 → ==Just-in-time== 전략이 가능
- ==불확실성== 때문에 → 제조업체는 ==safety stock==을 둔다. 왜 비효율인가? → 팔리지 않을 수도 있는 재고에 ==돈과 창고 공간이 묶이기== 때문
- 불확실성의 또 다른 결과 → ==bullwhip effect==
- ==채찍 효과는 수요·공급에 대한 불확실성을 줄여서 길들인다== — 공급망의 모든 구성원이 ==정확하고 최신의 정보==를 갖게 하면 된다

> [!CONCEPT]
> **Just-in-time (JIT)** — 부품이 필요한 순간에 정확히 도착하고 완제품은 생산 직후 출하되게 해 ==재고를 거의 두지 않는== 전략.
>
> **Safety stock (안전 재고)** — 공급망의 유연성 부족과 불확실성에 대비해 ==여유분으로 쌓아 두는 재고==.
>
> **Bullwhip effect (채찍 효과)** — 제품 수요 정보가 공급망의 한 단계에서 다음 단계로 넘어가며 ==왜곡·증폭==되는 현상.

> [!BOARD]
> 정보가 완벽 → ==JIT==(재고 0에 가깝게) · 정보가 불확실 → ==안전 재고==(여유분) · 정보가 왜곡 → ==채찍 효과==(재고가 상류로 갈수록 부풀어 오름)
>
> 해결책은 하나: ==정확하고 최신인 정보를 모두가 공유==

> [!TRAP]
> ==red:JIT와 안전 재고는 반대 방향==이다. JIT는 재고를 줄이고 안전 재고는 재고를 늘린다. 또 ==red:재고가 많으면 무조건 좋다/나쁘다==가 아니다 — 재고가 너무 많으면 돈이 묶이고, 너무 적으면(low fill rate) 주문 취소로 사업을 잃는다.

---

## Slide 11 — Figure 9.3 The Bullwhip Effect

[![Nike 공급망과 같은 모양의 공급망 아래에 단계마다 수요 변동 그래프를 그려 고객 쪽은 작은 흔들림, 공급자 쪽으로 갈수록 큰 흔들림이 되는 채찍 효과 그림](/materials/diagrams/mis-fig-9-03.svg)](/materials/diagrams/mis-fig-9-03.svg)

*Figure 9.3 · The Bullwhip Effect — 누르면 원본 크기로 열린다.*

- ==Inaccurate information==이 제품 수요의 ==작은 변동을 공급망 뒤쪽으로 갈수록 증폭==시킨다
- ==Minor fluctuations in retail sales== for a product can create ==excess inventory== for distributors, manufacturers, and suppliers

> **고객 수요가 조금 흔들림 → 각 단계가 “만약을 위해(just in case)” 조금씩 더 주문 → 공급자 쪽에서는 큰 흔들림**

**그림 읽기:** 아래 그래프의 봉우리 높이가 ==수요 변동의 크기==다. 오른쪽 고객은 작게 흔들리지만 소매점 → 유통업체 → 제조업체 → 1·2·3차 공급자로 갈수록 봉우리가 커진다. 소의 꼬리를 잡은 채찍(bullwhip)은 손목을 조금만 흔들어도 끝이 크게 휘는 것과 같다.

> [!EXAMPLE]
> **가상 예시 · 채찍 효과 계산**
>
> 평소 매주 100켤레가 팔리는 신발이 어느 주에 110켤레(10% 증가) 팔렸다.
>
> | 단계 | 판단 | 다음 단계에 주문 |
> | --- | --- | --- |
> | 소매점 | “수요가 늘었네, 여유분 10% 더” | 110 × 1.1 ≈ 121 |
> | 유통업체 | “주문이 21% 늘었다! 여유분 10% 더” | 121 × 1.1 ≈ 133 |
> | 제조업체 | “33% 늘었다! 여유분 10% 더” | 133 × 1.1 ≈ 146 |
>
> 고객 수요는 10% 늘었을 뿐인데 제조업체는 ==46% 늘어난 것처럼== 생산한다. 다음 주 수요가 다시 100으로 돌아오면 각 단계에 재고가 남는다. 모두가 ==실제 고객 판매 데이터(POS)를 함께 본다면== 이런 부풀림이 생기지 않는다.

> [!TRAP]
> 채찍 효과의 원인은 ==red:고객 수요가 크게 변해서가 아니라 정보가 부정확하게 전달되어서==다. 그래서 해결책도 “재고를 더 쌓기”가 아니라 ==정보 공유==다.

> [!PROBLEM]
> **문제.** 채찍 효과가 일어나는 이유와, SCM 시스템이 이를 줄이는 방법을 각각 한 문장으로 쓰시오.
>
> **풀이.** 이유: 수요 정보가 한 단계에서 다음 단계로 넘어갈 때마다 각 단계가 ==만약을 대비해 조금씩 더 주문하면서 왜곡·증폭==되기 때문이다. 방법: 공급망의 모든 구성원이 ==정확하고 최신의 수요·공급 정보를 공유==하게 해 불확실성을 줄인다.

---

## Slide 12 — Supply Chain Management Software

- **Supply chain planning systems** (계획 시스템)
  - ==Model existing supply chain== (현재 공급망을 모형화)
  - ==Enable demand planning== (수요 계획)
  - ==Optimize sourcing, manufacturing plans== (조달·생산 계획 최적화)
  - ==Establish inventory levels== (재고 수준 결정)
  - ==Identify transportation modes== (운송 수단 결정)
- **Supply chain execution systems** (실행 시스템)
  - ==Manage flow of products through distribution centers and warehouses== to ensure that products are delivered to the right locations in the most efficient manner
  - e.g., ==WMS== (warehouse management system, 창고 관리 시스템)

> **계획 시스템 = 얼마나 만들고 어디서 사고 어떻게 옮길지 “계획” · 실행 시스템 = 창고·물류센터에서 제품 흐름을 “실행”**

**교수님 메모 · Demand planning:** ==모든 고객의 수요를 채우려면 회사가 제품을 얼마나 만들어야 하는지 결정==하는 것이다 (It determines how much product a business needs to make to satisfy all its customers’ demands).

> [!CONCEPT]
> **Supply chain planning systems** — 현재 공급망을 모형화하고, 수요 계획을 세우고, 조달·생산 계획을 최적화하고, 재고 수준과 운송 수단을 정하는 시스템.
>
> **Supply chain execution systems** — 제품이 물류센터와 창고를 거쳐 ==가장 효율적으로 올바른 장소에 전달되도록 흐름을 관리==하는 시스템.
>
> **Demand planning (수요 계획)** — 모든 고객 수요를 채우려면 얼마나 만들어야 하는지 정하는 일. 계획 시스템의 가장 중요한 기능.

> [!BOARD]
> | 질문 | 시스템 |
> | --- | --- |
> | 다음 달에 몇 개 만들까? 재고는 몇 개 둘까? 배로 보낼까 트럭으로 보낼까? | ==Planning== |
> | 지금 이 상자를 어느 창고의 어느 선반에서 꺼내 어느 트럭에 실을까? | ==Execution== |

> [!TRAP]
> ==red:운송 수단을 정하는 것(Identify transportation modes)은 planning==이고, ==red:창고·물류센터를 통과하는 실제 흐름을 관리하는 것은 execution==이다. “운송”이라는 말만 보고 실행 시스템으로 고르지 않도록 주의.

---

## Slide 13 — Demand-Driven Supply Chains

- **Push-based model (build-to-stock)**
  - ==Earlier SCM systems==
  - Supply chain driven by ==forecasts or best guesses of demand== for products, rather than what customers order; products are ==“pushed” to customers==
- **Pull-based model (demand-driven; build-to-order)**
  - Supply chain driven by ==actual customer orders or purchases==; Web-based tools
  - ==Customer orders trigger events== in supply chain
- Internet enables move from ==sequential supply chains to concurrent supply chains==
  - Complex networks of suppliers can ==adjust immediately== to changes in schedules or orders

> **푸시 = 예측해서 만들어 밀어냄(build-to-stock) · 풀 = 주문이 오면 그만큼 당겨 만듦(build-to-order) · 인터넷 → 순차에서 동시(concurrent)로**

> [!CONCEPT]
> **Push-based model** — 생산 일정을 ==수요 예측이나 최선의 추측==에 맞추고, 만든 제품을 고객에게 밀어내는 모델. 초기 SCM 시스템의 방식.
>
> **Pull-based model (demand-driven)** — ==실제 고객 주문이나 구매==가 공급망의 활동을 시작시키는 모델. 주문 → 생산 → 배송 순.
>
> **Sequential vs concurrent supply chain** — 순차 공급망은 정보와 자재가 한 회사에서 다음 회사로 차례로 흐른다. 동시 공급망은 인터넷 덕분에 정보가 ==여러 방향으로 동시에== 흘러 공급자 네트워크가 일정·주문 변화에 ==즉시== 맞춘다.

**교수님 메모:** SCM 시스템은 ==효율적 고객 대응(efficient customer response)==을 가능하게 해, 회사가 고객 수요에 따라 움직이게 한다 — ==푸시 기반·순차 공급망에서 풀 기반·동시 공급망으로==. 교재의 풀 기반 사례: ==Walmart, Dell==.

> [!EXAMPLE]
> **Dell · Walmart (교수님 메모)**
>
> - **Dell** — 고객이 웹에서 PC 사양을 골라 주문하면 그때 조립을 시작한다. ==고객 주문이 생산을 촉발==하는 대표적 build-to-order.
> - **Walmart** — 매장 판매 데이터를 공급자와 공유해, 팔린 만큼 ==자동으로 재주문(continuous replenishment)==이 일어나게 한다. *(교재 보충)*
>
> → 연결 개념: Pull-based model, 수요 기반 공급망.

---

## Slide 14 — Figure 9.4 Push- Versus Pull-Based Supply Chain Models

[![위 줄은 공급자 제조업체 유통업체 소매점 고객이 예측에 따라 오른쪽으로 밀어내는 푸시 모델, 아래 줄은 고객 주문에서 시작해 왼쪽으로 당기는 풀 모델을 비교한 그림](/materials/diagrams/mis-fig-9-04.svg)](/materials/diagrams/mis-fig-9-04.svg)

*Figure 9.4 · Push- Versus Pull-Based Supply Chain Models — 누르면 원본 크기로 열린다.*

| 단계 | Push-based model | Pull-based model |
|---|---|---|
| Supplier | Supply to forecast | Supply to order |
| Manufacturer | ==Production based on forecasts== (출발점) | Produce to order |
| Distributor | Inventory based on forecasts | Automatically replenish warehouse |
| Retailer | Stock based on forecasts | Automatically replenish stock |
| Customer | Purchase what is on shelves | ==Customer orders== (출발점) |

> **슬로건: ==“Make what we sell, not sell what we make.”== (만든 것을 파는 게 아니라 팔리는 것을 만든다)**

**그림 읽기:** 두 줄의 ==화살표 방향이 반대==다. 푸시는 제조업체의 예측에서 시작해 고객 쪽으로 밀고, 풀은 고객 주문에서 시작해 공급자 쪽으로 당긴다. 원본 그림의 초록 점이 각 모델의 ==출발점==이다.

**교수님 메모 · 생각해 볼 질문:** 풀 모델에 특히 잘 맞는 산업이 있을까? ==자동차, 가전, 내구 소비재(consumer durables)==는? 풀 모델의 ==단점==은?

> [!NOTE]
> **풀 모델의 단점 생각해 보기** — 주문을 받고 나서 만들기 시작하므로 ==고객이 기다려야== 한다. 생산 설비가 갑작스러운 주문 몰림을 감당할 만큼 ==유연해야== 하고, 공급자도 빠르게 반응해야 한다. 그래서 사양을 고르는 비싼 제품(자동차·PC·맞춤 가전)에는 잘 맞지만, 우유·생수처럼 ==지금 당장 사야 하는 값싼 제품==에는 맞지 않는다.

> [!TRAP]
> ==red:Push = build-to-order==로 짝짓는 실수가 잦다. 정답은 ==Push = build-to-stock(예측)==, ==Pull = build-to-order(주문, demand-driven)==.

---

## Slide 15 — Figure 9.5 The Emerging Internet-Driven Supply Chain

[![공급자 제조업체 유통업체 소매점 고객 물류업체 가상 제조업체 계약 제조업체와 사설 산업 네트워크 넷 마켓플레이스, 물류 거래소가 모두 양방향 점선 화살표로 서로 연결된 그림](/materials/diagrams/mis-fig-9-05.svg)](/materials/diagrams/mis-fig-9-05.svg)

*Figure 9.5 · The Emerging Internet-Driven Supply Chain — 누르면 원본 크기로 열린다.*

- Internet-driven supply chain은 ==digital logistics nervous system(디지털 물류 신경계)==처럼 작동한다
- 기업, 기업 네트워크, 전자시장(e-marketplaces) 사이의 ==multidirectional communication==
- 공급망 파트너 네트워크 전체가 ==재고·주문·생산능력(inventories, orders, and capacities)을 즉시 조정==

> **인터넷 공급망 = 모두가 모두와 동시에 연결된 신경계 → 한 곳의 변화가 즉시 전체에 전달**

**슬라이드 메모:** ==모든 연결은 양방향 점선 화살표==로 그려져 있다.
- ==Private industrial networks==: 보통 대기업이 ==extranet==으로 공급자와 주요 사업 파트너를 연결한 네트워크
- ==Net marketplaces==: 많은 구매자와 판매자를 위한 인터넷 기반 디지털 시장
- 두 개념은 ==10장(전자상거래)==에서 자세히 다룬다

> [!BOARD]
> Figure 9.2(Nike) = ==한 줄로 늘어선 순차 공급망== · Figure 9.5 = ==그물처럼 얽힌 동시(concurrent) 공급망==

---

## Slide 16 — Business Value of Supply Chain Management Systems

- ==Match supply to demand== (공급을 수요에 맞춤)
- ==Reduce inventory levels== (재고 감소)
- ==Improve delivery service== (배송 서비스 향상)
- ==Speed product time to market== (출시 기간 단축)
- ==Use assets more effectively== (자산을 더 효과적으로 사용)
- Reduced supply chain costs lead to increased profitability
  - ==Total supply chain costs can be 75 percent of operating budget==
- ==Increase sales== (매출 증가)

> **SCM의 가치 = 수요·공급 일치 → 재고↓·배송↑·출시↑·자산 활용↑ → 공급망 비용(운영 예산의 최대 75%)↓ → 수익성↑ + 매출↑**

**교수님 메모:** 더 효율적인 공급망이 어떻게 ==매출 증가==로 이어질까? → 고객이 원하는 제품이 ==원하는 때에 매장에 있으면(품절 감소)== 판매 기회를 놓치지 않는다. 배송이 빨라지면 고객이 다시 찾는다.

> [!TRAP]
> 숫자 두 개를 헷갈리지 말 것: ==red:비효율은 운영비의 최대 25%를 낭비==(Slide 10) · ==red:공급망 총비용은 운영 예산의 최대 75%==(Slide 16).

> [!CHECK]
> **4.** 공급망의 상류·하류·내부 공급망을 각각 정의하고, Nike 공급망에서 상류와 하류의 예를 하나씩 쓰시오.
>
> **5.** JIT, 안전 재고, 채찍 효과를 정의하고, 채찍 효과를 줄이는 방법을 쓰시오.
>
> **6.** SCM 소프트웨어의 두 종류를 쓰고, “demand planning”은 어느 쪽에 속하는지 쓰시오.
>
> **7.** 푸시 기반 모델과 풀 기반 모델의 차이를 각각의 다른 이름(build-to-…)과 슬로건을 넣어 쓰시오.

> [!PAGEBREAK]

## PART 3 · 글로벌 공급망

## Slide 17 — 9.3 Describe Global Supply Chain Management Challenges

- **Global supply chain issues**
  - ==Greater geographical distances, time differences==
  - ==Participants from different countries==
    - Different performance standards
    - Different legal requirements
- **Internet helps manage global complexities** (↔ before the Internet)
  - Warehouse management
  - Transportation management
  - Logistics
  - Outsourcing
- **AI and SCM:** AI는 현대 글로벌 공급망이 만들어 내는 ==급증하는 빅데이터를 분석==하는 데 매우 유용하다 (교재 p.331)

> **글로벌 공급망 = 거리·시차 + 나라마다 다른 성과 기준·법 → 인터넷이 창고·운송·물류·아웃소싱 관리를 돕고, AI가 빅데이터를 분석**

**교수님 메모:** 오늘날 ==의류 산업은 중국 등 저임금 국가의 계약 제조업체에 대한 아웃소싱==에 크게 의존한다. 의류 회사들은 ==웹을 이용해 글로벌 공급망과 생산 문제를 관리==하기 시작했다.

> [!NOTE]
> 한국에 본사가 있는 의류 회사가 베트남 공장에 생산을 맡긴다고 하자. 시차 때문에 회의 시간을 잡기 어렵고, 베트남과 한국의 품질 기준·노동법·통관 규정이 다르다. 인터넷 이전에는 팩스와 전화로 이 모든 것을 맞췄지만, 지금은 웹 기반 시스템으로 ==어느 창고에 무엇이 있는지, 배가 어디쯤 왔는지==를 실시간으로 본다.

> [!CHECK]
> **8.** 글로벌 공급망이 국내 공급망보다 어려운 이유를 두 가지 이상 쓰고, 인터넷이 도움을 주는 관리 영역 네 가지를 쓰시오.

> [!PAGEBREAK]

## PART 4 · 고객관계관리(CRM)

## Slide 18 — 9.4 Understand CRM Systems

- ==Knowing the customer==
- In large businesses, ==too many customers and too many ways customers interact with firm==
- **CRM systems**
  - ==Capture and integrate customer data== from all over the organization
  - ==Consolidate and analyze== customer data
  - ==Distribute customer information== to various systems and ==customer touch points== across enterprise
  - Provide ==single enterprise view of customers==

> **CRM = 회사 곳곳에 흩어진 고객 데이터를 모으고(수집·통합) → 분석하고 → 모든 접점에 나눠 줘서 → “고객 한 명 = 하나의 모습”으로 본다**

> [!CONCEPT]
> **Customer relationship management (CRM) systems** — 조직 전체에서 고객 데이터를 ==수집·통합==하고, ==통합·분석==한 결과를 여러 시스템과 ==고객 접점(touch points)==에 ==배포==해, 회사 전체가 ==고객에 대한 하나의 통합된 시각(single enterprise view)==을 갖게 하는 시스템.
>
> **Customer touch point (고객 접점)** — 고객과 회사가 만나는 모든 지점. 전화, 이메일, 고객센터, 웹사이트, 매장, 영업사원, 모바일 앱, 소셜 미디어 등.

**교수님 메모:**
- 회사가 어떤 고객 데이터를 모을까? 고객에 대해 무엇을 알아야 할까? → ==가장 수익성 높은 고객(most profitable)==, ==충성 고객(loyal)==
- ==고객센터에 전화할 때마다== 여러분은 회사와의 상호작용 일부 또는 전부를 추적하는 ==어떤 형태의 CRM==을 상대하고 있는 것이다.
- ==경쟁의 핵심은 누가 고객을 “소유”하느냐==이며, ==고객 관계가 회사의 가장 소중한 자산==이다.

> [!NOTE]
> 동네 단골 가게 사장님은 손님 얼굴만 봐도 “늘 드시던 걸로요?” 하고 묻는다. 고객이 수백만 명인 대기업은 그럴 수 없다. 같은 고객이 어제는 앱으로, 오늘은 전화로, 내일은 매장에서 회사를 만나는데 부서마다 기록이 따로라면 ==같은 사람을 세 명으로== 안다. CRM은 이 기록을 합쳐 ==대기업도 단골 가게처럼 고객을 기억==하게 해 준다.

---

## Slide 19 — Figure 9.6 Customer Relationship Management (CRM)

[![가운데 고객을 두고 원을 영업 마케팅 서비스 세 부분으로 나누어 각 부분이 다루는 데이터를 적은 CRM 그림](/materials/diagrams/mis-fig-9-06.svg)](/materials/diagrams/mis-fig-9-06.svg)

*Figure 9.6 · Customer Relationship Management (CRM) — 누르면 원본 크기로 열린다.*

| 영역 | 다루는 데이터 |
|---|---|
| **Sales** | Telephone sales, Web sales, Retail store sales, Field sales |
| **Marketing** | Campaign data, Content, Data analysis |
| **Service** | Call center data, Web self-service data, Wireless data, Field service data, Social networking data |

> **CRM은 고객을 여러 면(multifaceted)에서 본다 — 통합 애플리케이션으로 ==고객 서비스·영업·마케팅==의 모든 측면을 다룬다**

**그림 읽기:** 원 가운데 타원이 ==고객==이고, 원은 ==영업·마케팅·서비스 세 부분==으로 나뉜다. 세 부서가 모두 같은 고객을 둘러싸고 있다는 점이 핵심이다 — 부서가 아니라 ==고객이 중심==이다.

---

## Slide 20 — Customer Relationship Management Software (1 of 2)

- Packages range from ==niche tools to large-scale (full-scale) enterprise applications==
- More comprehensive packages have modules for:
  - **Partner relationship management (PRM)**
    - Integrating lead generation, pricing, promotions, order configurations, and availability
    - Tools to assess partners’ performances
    - → CRM의 많은 기능을 써서 ==회사와 판매 파트너(selling partners) 사이의 협업==을 강화
  - **Employee relationship management (ERM)**
    - Setting objectives, employee performance management, performance-based compensation, employee training
    - → ==CRM과 밀접한 직원 문제==를 다룬다

> **CRM 패키지 = 작은 전문 도구부터 대규모 전사 애플리케이션까지 · 큰 패키지에는 PRM(판매 파트너)·ERM(직원) 모듈도 있다**

> [!CONCEPT]
> **Partner relationship management (PRM)** — 고객관리와 같은 데이터·도구·저장소를 써서 ==회사와 판매 파트너(대리점·딜러 등) 사이의 협업==을 강화한다. 잠재 고객 발굴(lead generation), 가격, 판촉, 주문 구성, 재고 가용성 정보를 통합하고 파트너 성과를 평가한다.
>
> **Employee relationship management (ERM)** — 목표 설정, 직원 성과 관리, 성과 기반 보상, 직원 교육처럼 ==CRM과 밀접하게 관련된 직원 문제==를 다룬다. 예: 고객센터 상담원의 성과·교육 관리.

> [!TRAP]
> ==red:ERM을 ERP와 헷갈리지 말 것.== ERM은 CRM 패키지 안의 ==직원 관계 관리 모듈==이고, ERP는 ==전사 시스템==이다. 또 PRM의 P는 ==red:Partner(판매 파트너)==이지 Product나 Process가 아니다.

---

## Slide 21 — Customer Relationship Management Software (2 of 2)

- CRM packages typically include tools for:
  - **Sales force automation (SFA):** helps sales staff ==increase productivity by focusing sales efforts on the most profitable customers==
    - Sales prospect and contact information
    - Sales quote generation capabilities
  - **Customer service:** provides information and tools to ==increase the efficiency of call centers, help desks, and customer support staff==
    - Assigning and managing customer service requests
    - Web-based self-service capabilities
  - **Marketing:** supports ==direct-marketing campaigns==
    - Capturing prospect and customer data, scheduling and tracking direct-marketing mailings or e-mail
    - ==Cross-selling==: the marketing of ==complementary products== to customers (cf. up-selling)

> **CRM의 세 도구 = SFA(영업사원 생산성) · 고객 서비스(콜센터 효율) · 마케팅(캠페인, 교차 판매)**

> [!CONCEPT]
> **Sales force automation (SFA)** — 영업사원이 ==가장 수익성 높은 고객에게 노력을 집중==해 생산성을 높이도록 돕는 CRM 모듈. 잠재 고객·연락처 정보, 견적서 작성 기능 등.
>
> **Cross-selling (교차 판매)** — 고객에게 ==보완 제품(complementary products)==을 함께 파는 마케팅. 예: 노트북을 산 고객에게 마우스·가방 추천.
>
> **Up-selling (상향 판매, 비교 개념)** — 고객이 사려는 제품보다 ==더 비싸거나 상위인 제품==을 권하는 것. 예: 256GB 대신 512GB 모델 추천.

> [!BOARD]
> | 도구 | 누구를 돕나 | 대표 기능 |
> | --- | --- | --- |
> | ==SFA== | 영업사원 | 잠재 고객·연락처, 견적서 |
> | ==Customer service== | 콜센터·헬프데스크 | 요청 배정·관리, 웹 셀프서비스 |
> | ==Marketing== | 마케터 | 고객 데이터 수집, 캠페인 일정·추적, cross-selling |

> [!TRAP]
> ==red:Cross-selling = 다른(보완) 제품을 함께==, ==red:Up-selling = 같은 종류의 더 비싼 제품으로==. 햄버거 가게에서 “감자튀김도 같이 드릴까요?”는 cross-selling, “라지 사이즈로 바꿔 드릴까요?”는 up-selling.

---

## Slide 22 — Figure 9.7 How CRM Systems Support Marketing

[![2019년 1월 판촉 캠페인의 채널별 반응을 전화 30.8%, 직접 우편 29.2%, 이메일 17.3%, 웹 16.0%, 소셜 미디어 6.7%로 나눈 원그래프](/materials/diagrams/mis-fig-9-07.svg)](/materials/diagrams/mis-fig-9-07.svg)

*Figure 9.7 · How CRM Systems Support Marketing — 누르면 원본 크기로 열린다.*

| 채널 | 반응 비율 (January 2019 Promotional Campaign) |
|---|---:|
| Telephone | ==30.8%== |
| Direct Mail | 29.2% |
| Email | 17.3% |
| Web | 16.0% |
| Social Media | 6.7% |

> **CRM은 이메일·직접 우편·전화·웹·무선 메시지 등 ==여러 채널의 마케팅 캠페인을 한 곳(a single point)에서 관리·평가==하게 한다**

**슬라이드 메모:** 이 그림은 CRM 시스템이 마케팅 캠페인을 ==분석·평가==해 마케팅을 지원하는 예이다. 원그래프는 CRM이 마케팅을 어떻게 지원하는지에 대한 데이터를 보여 준다.

> [!NOTE]
> 이 결과를 본 마케터는 다음 캠페인 예산을 ==반응이 큰 전화·직접 우편 쪽에 더== 배정하거나, 반응이 작은 소셜 미디어 캠페인의 방식을 바꿔 볼 수 있다. 채널마다 따로 집계하던 결과를 ==한 화면에서 비교==할 수 있다는 것이 CRM의 가치다.

---

## Slide 23 — Figure 9.8 CRM Software Capabilities

[![맨 위 고객 데이터 아래에 영업 마케팅 서비스 세 열이 있고 각 열에 관리 기능 다섯 개와 맨 아래 분석 기능이 놓인 CRM 소프트웨어 기능 그림](/materials/diagrams/mis-fig-9-08.svg)](/materials/diagrams/mis-fig-9-08.svg)

*Figure 9.8 · CRM Software Capabilities — 누르면 원본 크기로 열린다.*

| Sales | Marketing | Service |
|---|---|---|
| Account Management | Campaign Management | Service Delivery |
| Lead Management | Channel Promotions Management | Customer Satisfaction Management |
| Order Management | Events Management | Returns Management |
| Sales Planning | Market Planning | Service Planning |
| Field Sales | Marketing Operations | Call Center & Help Desk |
| ==Sales Analytics== | ==Marketing Analytics== | ==Service Analytics== |

> **주요 CRM 제품은 영업·서비스·마케팅의 업무 프로세스를 지원하며 여러 출처의 고객 정보를 통합한다 — ==운영적 측면과 분석적 측면을 모두== 지원**

**슬라이드 메모:**
- ==CRM software is business-process driven== — 각 영역의 ==모범 사례로 여겨지는 수백 개의 업무 프로세스==를 담고 있다.
- 최대 효과를 얻으려면 회사는 ==CRM 소프트웨어의 모범 사례 프로세스에 맞춰 자기 업무 프로세스를 고치고 모형화==해야 한다.

> [!BOARD]
> ERP(Slide 6)와 CRM(Slide 23)의 공통점: ==둘 다 모범 사례 프로세스를 담은 소프트웨어 → 회사가 소프트웨어에 맞춰 프로세스를 바꿔야 효과가 난다==

**그림 읽기:** 맨 위 ==Customer Data==를 세 열이 함께 쓴다(ERP의 중앙 DB와 같은 발상). 각 열의 위 다섯 칸은 고객을 직접 상대하는 ==운영 기능==, 맨 아래 칸(Analytics)은 ==분석 기능==이다. 이 구분이 Slide 25의 운영적·분석적 CRM으로 이어진다.

---

## Slide 24 — Figure 9.9 Customer Loyalty Management Process Map

[![서비스 요청 접수, 고객 정보 조회, 고객 정보 존재 여부 판단, 고객 점수화, 고가치 충성 고객 여부 판단, 특별 혜택 제공으로 이어지고 아니면 최적 상담원 연결과 문제 해결로 가는 흐름도](/materials/diagrams/mis-fig-9-09.svg)](/materials/diagrams/mis-fig-9-09.svg)

*Figure 9.9 · Customer Loyalty Management Process Map — 누르면 원본 크기로 열린다.*

1. ==Receive service request== (서비스 요청 접수)
2. ==Obtain customer information== (← Customer database)
3. Customer information available? → **No**: Route to best agent → Resolve service issue
4. **Yes** → ==Score customer== (고객 점수화)
5. High value and loyalty? → **Yes**: ==Provide special offers and service== / **No**: Route to best agent → Resolve service issue

> **고객 서비스로 충성도를 높이는 모범 사례를 CRM이 모형화한 것 — CRM은 ==고가치 고객을 가려 우대(preferential treatment)==하게 돕는다**

**교수님 메모 · 질문:** 어떤 정보가 고객이 충성스럽거나 고가치라는 것을 보여 줄까?

> [!NOTE]
> **답의 예** — 구매 빈도(얼마나 자주), 구매 금액(얼마나 많이), 최근 구매일(얼마나 최근에), 거래 기간(얼마나 오래), 반품·불만 횟수, 추천·리뷰 활동. 이런 값으로 고객에게 점수를 매기는 것이 그림의 ==Score customer== 단계다. 항공사가 상위 등급 회원의 전화를 전용 상담원에게 바로 연결하는 것이 이 프로세스의 실제 모습이다.

---

## Slide 25 — Operational and Analytical CRM

- **Operational CRM:**
  - Includes ==customer-facing applications==
  - Sales force automation, call center and customer service support
  - Marketing automation
- **Analytical CRM:** includes applications that ==analyze customer data generated by operational CRM applications== to provide information for improving business performance
  - Based on ==data warehouses== populated by operational CRM systems and customer touch points
  - Analyzes customer data (==OLAP, data mining==, etc.)
  - ==Customer lifetime value (CLTV)==: another important output of analytical CRM

> **운영적 CRM = 고객을 직접 상대하는 일(영업·콜센터·마케팅 자동화) · 분석적 CRM = 운영적 CRM이 만든 데이터를 데이터 웨어하우스에 모아 분석(OLAP·데이터 마이닝·CLTV)**

> [!CONCEPT]
> **Operational CRM (운영적 CRM)** — SFA, 콜센터·고객 서비스 지원, 마케팅 자동화처럼 ==고객과 직접 만나는(customer-facing)== 애플리케이션.
>
> **Analytical CRM (분석적 CRM)** — 운영적 CRM 애플리케이션이 만든 고객 데이터를 ==분석==해 사업 성과 향상을 위한 정보를 주는 애플리케이션. 운영적 CRM과 고객 접점이 채운 ==데이터 웨어하우스==를 바탕으로 OLAP·데이터 마이닝을 쓴다.
>
> **Customer lifetime value (CLTV, 고객 생애 가치)** — 한 고객이 회사와 관계를 맺는 동안 가져다줄 것으로 기대되는 가치. 분석적 CRM의 중요한 산출물.

**교수님 메모 · CLTV는 어떻게 계산하나:** ==특정 고객이 만들어 내는 수익(revenue)==, 그 고객을 ==확보하고 서비스하는 데 드는 비용(expenses)==, 그리고 그 고객과 회사의 ==예상 관계 기간(expected life of the relationship)== 사이의 관계에 바탕을 둔다.

> [!BOARD]
> CLTV ≈ (고객이 주는 수익 − 그 고객을 얻고 관리하는 비용) × 관계가 이어질 기간
>
> → 세 요소: ==blue:수익 · 비용 · 기간==

> [!PROBLEM]
> **문제.** 어떤 통신사 고객이 매년 60만 원의 요금을 내고, 그 고객을 유지하는 데 매년 20만 원이 든다. 이 고객이 평균 5년 동안 가입을 유지한다면, 할인율을 무시할 때 CLTV는 대략 얼마인가? 회사는 이 숫자를 어디에 쓸 수 있는가?
>
> **풀이.** (60만 − 20만) × 5년 = ==약 200만 원==. 회사는 신규 고객 하나를 데려오는 데 ==200만 원보다 적게 쓰면 이익==이라는 기준을 얻고, CLTV가 높은 고객에게 우대 서비스를 줘 오래 붙잡는 데(Figure 9.9) 쓴다. *(교재의 정확한 공식은 할인율 등을 포함할 수 있으며, 시험에는 세 요소가 무엇인지가 주로 나온다.)*

> [!TRAP]
> ==red:SFA·콜센터·마케팅 자동화는 운영적 CRM==이고, ==red:데이터 웨어하우스·OLAP·데이터 마이닝·CLTV는 분석적 CRM==이다. “분석”이라는 단어가 없어도 ==고객을 직접 상대하면 운영적==, ==쌓인 데이터를 뒤에서 분석하면 분석적==.

---

## Slide 26 — Figure 9.10 Analytical CRM Data Warehouse

[![왼쪽 고객 접점 채널과 기타 출처의 고객 데이터가 가운데 고객 데이터 웨어하우스로 모이고 아래 OLAP 데이터 마이닝 도구로 분석해 오른쪽에 수익성 높은 고객 시장 세분화 고객 프로필 이탈률을 내는 그림](/materials/diagrams/mis-fig-9-10.svg)](/materials/diagrams/mis-fig-9-10.svg)

*Figure 9.10 · Analytical CRM Data Warehouse — 누르면 원본 크기로 열린다.*

| 단계 | 내용 |
|---|---|
| ① 입력: Channels | Call center, Website, Wireless, Field sales, Direct mail, Email, Retail store, Partner, Social media |
| ① 입력: Other sources | Legacy systems, Demographic data, Third-party data, Marketing campaign data |
| ② 저장 | ==Customer data warehouse or analytic platform== |
| ③ 분석 도구 | ==OLAP, Data mining, Other data analysis tools== |
| ④ 산출 | ==Profitable customers, Market segments, Customer profiles, Churn rates== |

> **분석적 CRM = 고객 접점과 기타 출처의 데이터 → 고객 데이터 웨어하우스 → OLAP·데이터 마이닝 → 수익성 높은 고객·시장 세분화·고객 프로필·이탈률**

**슬라이드 메모:** 다양한 채널에서 데이터를 모아 ==고객 데이터 웨어하우스==에 넣고, 거기서 ==OLAP, 데이터 마이닝 등 분석 도구==가 ==수익성 높은 고객, 이탈률(churn rates)== 등을 찾아낸다.

> [!NOTE]
> 왼쪽 목록은 Slide 18의 ==customer touch points==를 구체적으로 나열한 것이다. 운영적 CRM(Slide 25)이 이 접점에서 쌓은 기록이 웨어하우스로 들어가므로, ==운영적 CRM은 분석적 CRM의 재료를 공급==하는 관계다.

---

## Slide 27 — Business Value of Customer Relationship Management Systems

- **Business value of CRM systems**
  - ==Increased customer satisfaction==
  - ==Reduced direct-marketing costs==
  - ==More effective marketing==
  - ==Lower costs for customer acquisition/retention==
  - ==Increased sales revenue==
- **Churn rate**
  - ==Number of customers who stop using or purchasing products or services from a company==
  - ==Indicator of growth or decline of firm’s customer base==

> **CRM의 가치 = 고객 만족↑ · 직접 마케팅 비용↓ · 더 효과적인 마케팅 · 고객 확보·유지 비용↓ · 매출↑ / 이탈률 = 고객 기반이 커지는지 줄어드는지 보여 주는 지표**

> [!CONCEPT]
> **Churn rate (이탈률)** — 회사의 제품이나 서비스 ==이용·구매를 중단한 고객의 수==. 회사 ==고객 기반의 성장 또는 감소를 보여 주는 지표==다.

**교수님 메모 · 질문:** CRM을 쓰면 마케팅이 어떻게 더 효과적이 되나? → 고객 데이터로 ==누가 무엇을 살지 예측해 그 사람에게만== 캠페인을 보낸다(타깃 마케팅). 전 국민에게 전단을 뿌리는 대신 관심 있을 고객에게만 보내므로 ==비용은 줄고 반응률은 오른다==.

> [!EXAMPLE]
> **가상 예시 · 이탈률** — 연초 고객이 10,000명인 OTT 서비스에서 한 해 동안 1,500명이 구독을 해지했다면 이탈한 고객은 1,500명(비율로 15%)이다. 이탈률이 높아지면 분석적 CRM으로 ==해지 직전 고객의 공통 패턴==(예: 3주 이상 미시청)을 찾아, 그 패턴을 보이는 고객에게 미리 할인 쿠폰을 보낸다.

> [!TRAP]
> ==red:이탈률이 높을수록 좋은 것이 아니다== — 고객을 잃고 있다는 뜻이다. 또 CRM의 가치에는 ==red:마케팅 비용 “증가”가 아니라 “감소”==가 들어간다.

> [!CHECK]
> **9.** CRM 시스템이 고객 데이터로 하는 일 네 가지를 쓰고, “single enterprise view of customers”의 뜻을 쓰시오.
>
> **10.** PRM과 ERM을 각각 정의하시오.
>
> **11.** CRM 패키지의 세 가지 도구(SFA·고객 서비스·마케팅)를 설명하고, cross-selling과 up-selling의 차이를 예와 함께 쓰시오.
>
> **12.** 운영적 CRM과 분석적 CRM을 구분하고, CLTV 계산에 쓰이는 세 요소를 쓰시오.
>
> **13.** Churn rate를 정의하고, 무엇을 보여 주는 지표인지 쓰시오.

> [!PAGEBREAK]

## PART 5 · 전사 애플리케이션의 과제와 미래

## Slide 28 — 9.5 Discuss Enterprise Application Challenges

- ==Expensive to purchase and implement== enterprise applications
  - Many projects experience ==cost overruns==
  - ==Long development times==
- Require ==Technology changes + Business process changes==
- ==Organizational learning, changes==
- ==Switching costs, dependence on software vendors==
- Integrating cloud applications
- ==Data standardization, management, cleansing==

> **전사 애플리케이션의 과제 = 비싸고 오래 걸림 + 기술·프로세스·조직이 모두 바뀌어야 함 + 공급업체에 묶임(전환 비용) + 데이터 표준화·정제**

> [!CONCEPT]
> **Switching costs (전환 비용)** — 한 공급업체의 제품·시스템에서 다른 것으로 바꿀 때 드는 ==돈·시간·노력·위험==. 전사 애플리케이션은 회사의 핵심 업무를 깊이 바꾸므로 전환 비용이 매우 크고, 그래서 회사가 ==특정 소프트웨어 공급업체에 의존==하게 된다.
>
> **Data cleansing (데이터 정제)** — 데이터베이스에서 틀리거나, 불완전하거나, 형식이 잘못되었거나, 중복된 데이터를 찾아 고치는 일. *(교재 보충)*

**교수님 메모 · 질문:** “전환 비용”의 개념을 예로 설명하라. ==한 소프트웨어 공급업체에 의존==하면 어떤 문제가 생길 수 있나?

> [!NOTE]
> **전환 비용의 예** — 회사가 A사 ERP를 5년 쓰다가 B사로 바꾸려 한다. 새 라이선스 값만 드는 것이 아니다. 5년 치 데이터를 옮기고, 수백 개 업무 프로세스를 다시 맞추고, 전 직원을 다시 교육하고, 바꾸는 동안 업무가 멈출 위험도 감수해야 한다. 이 부담이 너무 커서 회사는 A사에 ==묶이게(lock-in)== 된다.
>
> **공급업체 의존의 문제** — 공급업체가 ==가격을 올려도== 떠나기 어렵고, 그 회사가 ==기능 개발을 멈추거나 지원을 끊거나 망하면== 우리 회사 핵심 업무가 위험해진다. 업그레이드 일정도 공급업체가 정한다.

> [!TRAP]
> ==red:전사 애플리케이션 도입은 “기술 변화”만이 아니다== — ==기술 변화 + 업무 프로세스 변화 + 조직 학습·변화==가 함께 필요하다. 소프트웨어만 깔면 끝난다는 보기는 오답.

---

## Slide 29 — Next-Generation Enterprise Applications (1 of 2)

- **Enterprise solutions / enterprise suites / e-business suites:**
  - Make applications ==more flexible, web-enabled, integrated with other systems==
- Utilize ==Web services and SOA== standards
- Include ==open-source applications==
- ==On-demand solutions==
- ==Cloud-based versions==
- Functionality for ==mobile platform==
- Versions also available for ==small and medium-sized businesses==

> **차세대 전사 애플리케이션 = 더 유연하고 웹 기반이며 다른 시스템과 통합 → 웹 서비스·SOA, 오픈소스, 온디맨드·클라우드, 모바일, 중소기업용**

**슬라이드 메모:**
- ==SAP==은 웹사이트를 통해 ==500개가 넘는 웹 서비스==를 제공한다.
- 클라우드 기반 CRM의 ==명실상부한 세계 1위(undisputed global market leader)는 Salesforce.com==이다.
- 주요 공급업체: ==SAP, Oracle, Microsoft, NetSuite==

> [!CONCEPT]
> **Enterprise solutions (enterprise suites, e-business suites)** — ERP·SCM·CRM 등을 서로, 그리고 고객·공급자 시스템과 ==더 유연하게 통합==하도록 만든 차세대 전사 애플리케이션 묶음.
>
> **SOA (service-oriented architecture, 서비스 지향 아키텍처)** — 소프트웨어를 독립적인 ==서비스 단위==로 만들어, 웹 서비스로 서로 연결해 쓰게 하는 설계 방식. 5장의 웹 서비스와 이어진다.

> [!NOTE]
> 5장에서 본 ==웹 서비스(XML 기반)==와 ==클라우드(SaaS)==가 9장에서 다시 등장한다. 예전 ERP는 회사 서버에 통째로 설치하는 거대한 한 덩어리였다면, 차세대 애플리케이션은 ==필요한 기능을 웹 서비스로 조립하고 클라우드로 빌려 쓰는== 쪽으로 바뀌었다. 그래서 큰돈을 쓰기 어려운 ==중소기업도 쓸 수 있게== 되었다.

---

## Slide 30 — Next-Generation Enterprise Applications (2 of 2)

- **Social CRM**
  - Incorporating ==social networking technologies==
  - Company social networks
  - ==Monitor social media activity; social media analytics==
  - Manage social and web-based campaigns
- **Business intelligence (in Enterprise Applications)**
  - ==Inclusion of BI with enterprise applications==
  - Flexible reporting, ==ad hoc analysis, “what-if” scenarios, digital dashboards, data visualization==

> **소셜 CRM = CRM + 소셜 네트워킹(소셜 미디어 감시·분석, 소셜 캠페인) · 전사 애플리케이션 + BI = 유연한 보고서, 임의 분석, what-if, 대시보드, 시각화**

> [!CONCEPT]
> **Social CRM** — CRM에 ==소셜 네트워킹 기술==을 결합해, 소셜 미디어에서 고객이 회사·제품에 대해 하는 말을 ==감시·분석==하고 소셜·웹 캠페인을 관리하는 것.

> [!EXAMPLE]
> **가상 예시** — 화장품 회사가 새 제품을 낸 뒤 SNS에서 “트러블 났다”는 글이 늘어나는 것을 소셜 CRM으로 감지한다. 그 글을 쓴 고객의 CRM 기록(구매 이력)과 연결해 상담원이 먼저 연락하고, 분석 결과는 BI 대시보드로 경영진에게 보고된다.

---

## Slide 31 — 9.6 Describe How Enterprise Applications Are Using AI · 9.7 Career

- 전사 애플리케이션(EA) 공급업체들은 ==BI(Business Intelligence)와 AI 도구를 추가==해, 이 시스템들이 만들어 내는 ==막대한 양의 데이터(IoT 데이터 포함)==에서 관리자가 더 의미 있는 정보를 얻도록 돕는다.
- 교재 ==Table 9.5==는 주요 EA 공급업체의 AI 소프트웨어 도구 예를 보여 준다.
- 9.7 Understand how the information in this chapter can help your career.

> **EA + BI·AI = 거대한 데이터(IoT 포함)에서 의미 있는 정보를 꺼낸다**

> [!BOARD]
> 9장의 AI 세 군데: ==Slide 4 AI·ERP==(대량 데이터의 패턴) · ==Slide 17 AI·SCM==(글로벌 공급망 빅데이터) · ==Slide 31 EA 전반==(BI와 함께, IoT 데이터)

> [!NOTE]
> 9.7 커리어 연결: 신입 사원은 회사 ERP·CRM 화면에서 일을 시작하는 경우가 많다. 이 장의 용어(모듈, 마스터 데이터, 채찍 효과, 이탈률, CLTV)를 알면 업무 시스템을 빨리 익히고, ==“이 데이터로 무엇을 개선할 수 있나”==를 말할 수 있다.

> [!CHECK]
> **14.** 전사 애플리케이션 도입이 어려운 이유를 네 가지 이상 쓰고, switching costs를 예와 함께 설명하시오.
>
> **15.** 차세대 전사 애플리케이션의 특징을 네 가지 이상 쓰고, 클라우드 CRM의 세계 1위 기업과 주요 공급업체를 쓰시오.
>
> **16.** Social CRM과, 전사 애플리케이션에 포함된 BI의 기능을 각각 쓰시오.

> [!PAGEBREAK]

## 사례 총정리 · 9장에 나오는 사례·기업·수치

시험은 “이 사례는 어떤 시스템·개념인가?” 또는 “X의 예를 들라”로 나온다. ==blue:사례 → 시스템 → 개념==을 한 줄로 말할 수 있으면 된다.

| 슬라이드 | 사례·기업 | 내용 | 핵심 수치·결과 | 연결 개념 |
| --- | --- | --- | --- | --- |
| 1 | **Maersk** | 글로벌 해운 관리 시스템 개발 | — | 글로벌 SCM |
| 1 | **Life Time Fitness** | Salesforce CRM 도입 | — | 클라우드 CRM |
| 3 | **TrueBlue** | 전사 애플리케이션으로 속도 향상 | (수업 필기) | 전사 애플리케이션 |
| 4 | **Alcoa** | 중복 프로세스·시스템 제거, 구매 요청~지급 주기 단축 | ==전 세계 비용 20% 절감== | ERP의 가치 |
| 9 | **Nike** | 운동화·밑창 공급자 → Nike → 유통 → 소매 → 고객 | — | 상류·하류, Figure 9.2 |
| 10 | 공급망 비효율 | 부품 부족, 가동률 저하, 과잉 재고, 운송비 | ==운영비의 최대 25% 낭비== | JIT·안전 재고·채찍 효과 |
| 13 | **Dell, Walmart** | 주문 기반 생산·자동 재주문 | — | 풀 기반 모델 |
| 16 | 공급망 총비용 | — | ==운영 예산의 최대 75%== | SCM의 가치 |
| 17 | 의류 산업 | 중국 등 저임금 국가 계약 제조업체에 아웃소싱 | — | 글로벌 SCM |
| 22 | 2019년 1월 판촉 캠페인 | 채널별 반응 | 전화 30.8%, DM 29.2%, 이메일 17.3%, 웹 16.0%, 소셜 6.7% | CRM의 마케팅 지원 |
| 29 | **SAP** | 웹사이트로 웹 서비스 제공 | ==500개+== | 차세대 EA, SOA |
| 29 | **Salesforce.com** | 클라우드 CRM | ==세계 1위== | 클라우드 CRM |
| 29 | **SAP, Oracle, Microsoft, NetSuite** | 주요 EA 공급업체 | — | 차세대 EA |

> [!FLASHCARD]
> Q: 9장 사례 — Alcoa가 전사 소프트웨어로 얻은 결과는?
> A: 중복된 프로세스와 시스템을 없애고 requisition-to-pay 주기 시간을 줄여 전 세계 비용의 20%를 절감했다. 효과적인 ERP 구현의 가치를 보여 준다.

> [!FLASHCARD]
> Q: 9장 사례 — Nike 공급망에서 상류와 하류에 있는 것은?
> A: 상류는 Tier 1(계약 공급자)·Tier 2·Tier 3 공급자(운동화·밑창 공급자), 하류는 유통업체·소매점·고객이다. 정보는 양방향으로 흐른다.

> [!FLASHCARD]
> Q: 9장 숫자 — 25%와 75%는 각각 무엇인가?
> A: 공급망 비효율은 운영비의 최대 25%를 낭비할 수 있고, 공급망 총비용은 운영 예산의 최대 75%가 될 수 있다.

> [!FLASHCARD]
> Q: 9장 사례 — 풀 기반 모델의 교재 사례 두 개는?
> A: Dell(고객 주문 후 조립)과 Walmart(판매 데이터로 자동 재주문).

> [!FLASHCARD]
> Q: 9장 사례 — 클라우드 CRM 세계 1위 기업과 SAP의 웹 서비스 수는?
> A: Salesforce.com, SAP은 500개가 넘는 웹 서비스를 제공한다.

> [!PAGEBREAK]

## 단원 마무리

### 한 쪽 핵심 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| ERP | 통합 모듈 + 하나의 중앙 DB(one company, one database), 모범 사례 프로세스, 구현 = 기능 선택 → 프로세스 매핑 → configuration tables, 커스터마이징 최소화 |
| ERP 가치 | 운영 효율, 전사 정보로 결정, 고객 요청에 빠른 응답, 분석 도구, 경영진의 실시간 파악, 표준화된 데이터 정의 |
| 공급망 | 조달 → 변환 → 유통, 상류(공급자) · 내부 · 하류(고객), 정보는 양방향 |
| 비효율 | 운영비 최대 25% 낭비, 완벽한 정보 → JIT, 불확실 → 안전 재고, 왜곡 → 채찍 효과(해결 = 정보 공유) |
| SCM 소프트웨어 | Planning(모형화·demand planning·조달·생산·재고·운송 수단) vs Execution(물류센터·창고 흐름, WMS) |
| 푸시·풀 | Push = build-to-stock(예측) · Pull = build-to-order(주문, Dell·Walmart), “Make what we sell…”, 순차 → 동시 공급망 |
| SCM 가치 | 수요·공급 일치, 재고↓, 배송↑, 출시↑, 자산 활용, 비용↓(운영 예산의 최대 75%), 매출↑ |
| 글로벌 SCM | 거리·시차, 나라별 성과 기준·법 → 인터넷(창고·운송·물류·아웃소싱), AI(빅데이터) |
| CRM | 수집·통합 → 통합·분석 → 접점에 배포 → single enterprise view, PRM(파트너)·ERM(직원), SFA·서비스·마케팅(cross-selling) |
| 두 CRM | 운영적(고객 대면: SFA·콜센터·마케팅 자동화) vs 분석적(데이터 웨어하우스·OLAP·마이닝, CLTV) |
| CRM 가치 | 만족↑, 직접 마케팅 비용↓, 효과적 마케팅, 확보·유지 비용↓, 매출↑, churn rate = 이탈 고객 수 |
| 과제 | 비용·기간 초과, 기술 + 프로세스 + 조직 변화, switching costs·공급업체 의존, 클라우드 통합, 데이터 표준화·정제 |
| 차세대 | 웹 서비스·SOA, 오픈소스, 온디맨드·클라우드, 모바일, 중소기업, 소셜 CRM, BI, AI(SAP 500+ 웹 서비스, Salesforce 1위) |

### 단답형 연습 · Short Answer

Write the term or a short answer in English. 답은 맨 끝 **정답과 해설**의 단답형 정답에서 확인한다.

1. What systems are based on a suite of integrated software modules and a common central database?  
   Answer: ______________________________
2. What tables let a firm tailor an enterprise system to the way it does business without changing program code?  
   Answer: ______________________________
3. What part of the supply chain includes the firm's suppliers, the suppliers' suppliers, and the processes for managing relationships with them?  
   Answer: ______________________________
4. What is the buffer of extra inventory kept to cover for a lack of flexibility in the supply chain called?  
   Answer: ______________________________
5. What is the effect in which information about product demand gets distorted as it passes from one entity to the next across the supply chain?  
   Answer: ______________________________
6. What is the term for determining how much product a business needs to make to satisfy all its customers' demands?  
   Answer: ______________________________
7. What supply chain model, also called build-to-order, is driven by actual customer orders or purchases?  
   Answer: ______________________________
8. What CRM module helps sales staff increase productivity by focusing sales efforts on the most profitable customers?  
   Answer: ______________________________
9. What is the marketing of complementary products to customers called?  
   Answer: ______________________________
10. What type of CRM analyzes customer data from operational CRM using data warehouses, OLAP, and data mining?  
   Answer: ______________________________
11. What is the number of customers who stop using or purchasing products or services from a company called?  
   Answer: ______________________________
12. What term describes the cost, time, and effort of changing from one software vendor's system to another?  
   Answer: ______________________________

> [!PAGEBREAK]

## 개념 회상과 오개념 점검

> [!QUIZ]
> ERP를 도입한 회사가 “우리 회사만의 방식”을 지키려고 소프트웨어 코드를 대규모로 고쳤다. 어떤 문제가 생길 수 있는가?

> [!ANSWER]
> ERP는 매우 복잡해서 지나친 커스터마이징은 시스템 성능을 떨어뜨리고, ERP의 주된 이점인 정보·프로세스 통합을 해칠 수 있다. 또 새 버전으로 업그레이드할 때마다 고친 부분을 다시 맞춰야 한다. 그래서 회사가 소프트웨어의 모범 사례 프로세스에 맞춰 일하는 방식을 바꾸는 편이 권장된다.

> [!QUIZ]
> 채찍 효과를 “재고를 더 많이 쌓아서” 해결할 수 있는가? 이유를 쓰시오.

> [!ANSWER]
> 해결할 수 없다. 채찍 효과는 부정확한 수요 정보가 단계마다 증폭되어 생긴다. 재고를 더 쌓는 것은 오히려 “만약을 위한” 과잉 재고를 늘리는 일이다. 해결책은 공급망의 모든 구성원이 정확하고 최신인 수요·공급 정보를 공유해 불확실성을 줄이는 것이다.

> [!QUIZ]
> 운영적 CRM과 분석적 CRM은 서로 어떤 관계인가?

> [!ANSWER]
> 운영적 CRM(SFA, 콜센터, 마케팅 자동화)이 고객 접점에서 만든 데이터가 데이터 웨어하우스로 들어가고, 분석적 CRM이 그 데이터를 OLAP·데이터 마이닝으로 분석해 수익성 높은 고객, 시장 세분화, CLTV, 이탈률 같은 정보를 만든다. 운영적 CRM이 분석적 CRM의 재료를 공급하는 관계다.

> [!QUIZ]
> Which of the following best describes an enterprise system?
>
> **A.** A collection of separate databases, one for each functional area
>
> **B.** A suite of integrated software modules and a common central database
>
> **C.** A system that links a firm only to its suppliers
>
> **D.** A system that analyzes customer data only

> [!ANSWER]
> B. A suite of integrated software modules and a common central database
>
> **해설**: A는 ERP가 없애려는 상태(“a collection of disconnected databases”)다. C는 SCM, D는 분석적 CRM에 가깝다. ERP의 핵심은 “one company, one database”다.

> [!QUIZ]
> When implementing enterprise software, which approach is generally recommended?
>
> **A.** Extensively customize the software to match existing business processes
>
> **B.** Change the way the firm works to conform to the software’s business processes
>
> **C.** Build a separate database for each module
>
> **D.** Avoid using configuration tables

> [!ANSWER]
> B. Change the way the firm works to conform to the software’s business processes
>
> **해설**: 지나친 커스터마이징(A)은 성능과 통합을 해친다. 설정 조정은 configuration tables로 하므로 D는 틀렸고, C는 ERP의 중앙 DB 원칙에 어긋난다.

> [!QUIZ]
> Information about product demand gets distorted as it passes from one entity to the next across the supply chain. This is called the:
>
> **A.** Network effect
>
> **B.** Bullwhip effect
>
> **C.** Just-in-time effect
>
> **D.** Safety stock effect

> [!ANSWER]
> B. Bullwhip effect
>
> **해설**: 소매 수요의 작은 변동이 상류로 갈수록 증폭되는 현상이다. JIT는 필요한 순간에 부품이 도착하게 하는 전략이고, safety stock은 유연성 부족에 대비한 여유 재고다.

> [!QUIZ]
> Which of the following is a function of supply chain EXECUTION systems?
>
> **A.** Demand planning
>
> **B.** Establishing inventory levels
>
> **C.** Identifying transportation modes
>
> **D.** Managing the flow of products through distribution centers and warehouses

> [!ANSWER]
> D. Managing the flow of products through distribution centers and warehouses
>
> **해설**: A·B·C는 모두 supply chain planning systems의 기능이다. 실행 시스템은 물류센터·창고를 거치는 실제 제품 흐름을 관리한다(예: WMS).

> [!QUIZ]
> A supply chain driven by actual customer orders or purchases is a:
>
> **A.** Push-based model
>
> **B.** Build-to-stock model
>
> **C.** Pull-based model
>
> **D.** Sequential supply chain

> [!ANSWER]
> C. Pull-based model (demand-driven, build-to-order)
>
> **해설**: A와 B는 같은 것으로, 예측에 따라 만들어 밀어내는 모델이다. D는 정보와 자재가 차례로 흐르는 옛 방식이며 인터넷은 동시(concurrent) 공급망을 가능하게 했다.

> [!QUIZ]
> Which CRM module integrates lead generation, pricing, promotions, order configurations, and availability to enhance collaboration with selling partners?
>
> **A.** Employee relationship management (ERM)
>
> **B.** Partner relationship management (PRM)
>
> **C.** Sales force automation (SFA)
>
> **D.** Enterprise resource planning (ERP)

> [!ANSWER]
> B. Partner relationship management (PRM)
>
> **해설**: ERM은 직원의 목표·성과·보상·교육, SFA는 영업사원 생산성을 다룬다. ERP는 CRM 모듈이 아니라 전사 시스템이다.

> [!QUIZ]
> A bank offers a credit card to a customer who has just opened a checking account. This is an example of:
>
> **A.** Up-selling
>
> **B.** Cross-selling
>
> **C.** Churn
>
> **D.** Demand planning

> [!ANSWER]
> B. Cross-selling
>
> **해설**: 입출금 계좌와 다른 보완 상품(신용카드)을 함께 파는 것이다. Up-selling은 같은 종류의 더 비싼 상품으로 바꾸게 하는 것이다(예: 일반 카드 → 프리미엄 카드).

> [!QUIZ]
> Which of the following is part of ANALYTICAL CRM rather than operational CRM?
>
> **A.** Call center support
>
> **B.** Sales force automation
>
> **C.** Marketing automation
>
> **D.** Calculating customer lifetime value with data mining

> [!ANSWER]
> D. Calculating customer lifetime value with data mining
>
> **해설**: A·B·C는 고객을 직접 상대하는 운영적 CRM이다. 데이터 웨어하우스·OLAP·데이터 마이닝으로 CLTV를 구하는 것은 분석적 CRM이다.

> [!QUIZ]
> Which of the following is NOT listed as a challenge of enterprise applications?
>
> **A.** Switching costs and dependence on software vendors
>
> **B.** Data standardization, management, and cleansing
>
> **C.** Low purchase and implementation costs
>
> **D.** Business process changes and organizational learning

> [!ANSWER]
> C. Low purchase and implementation costs
>
> **해설**: 전사 애플리케이션은 구입·구현 비용이 “비싸고”(expensive) 비용 초과와 긴 개발 기간을 겪는 경우가 많다. 나머지는 모두 슬라이드에 나온 과제다.

> [!QUIZ]
> Which company is described as the undisputed global market leader in cloud-based CRM systems?
>
> **A.** SAP
>
> **B.** Oracle
>
> **C.** Salesforce.com
>
> **D.** NetSuite

> [!ANSWER]
> C. Salesforce.com
>
> **해설**: SAP·Oracle·Microsoft·NetSuite는 주요 전사 애플리케이션 공급업체로 함께 나오지만, 클라우드 CRM의 1위는 Salesforce.com이다. SAP은 500개가 넘는 웹 서비스를 제공한다는 수치로 나온다.

> [!PAGEBREAK]

## 정답과 해설

먼저 스스로 답을 쓴 뒤 확인한다.

### 확인 문제 정답

1. ERP는 **통합된 소프트웨어 모듈 묶음과 공통 중앙 데이터베이스**를 바탕으로 회사 여러 부서의 데이터를 모아 거의 모든 내부 업무에 쓰게 하는 시스템이다. “One company, one database”는 회사가 **따로 떨어진 데이터베이스들의 모음이 아니라 하나의 데이터베이스**를 함께 쓴다는 뜻이다.
2. ① **쓸 기능 선택** ② **업무 프로세스를 소프트웨어 프로세스에 매핑** ③ **configuration tables로 조정**. 지나친 커스터마이징은 **시스템 성능을 떨어뜨리고**, ERP의 핵심 이점인 **정보·프로세스 통합을 해칠** 수 있다.
3. **운영 효율 향상, 더 나은 결정을 위한 전사 정보, 고객 요청에 대한 빠른 응답, 성과 평가·결정 개선용 분석 도구, 경영진이 언제든 조직 단위의 성과를 쉽게 파악.**
4. 상류는 **공급자, 공급자의 공급자와 그 관계 관리 프로세스**, 하류는 **제품을 고객에게 전달하는 조직과 프로세스**, 내부 공급망은 **회사 안에서 재료를 완제품으로 바꾸는 프로세스**다. Nike의 상류 예: **계약 공급자(운동화·밑창 공급자)**, 하류 예: **유통업체·소매점·고객**.
5. JIT는 **부품이 필요한 순간에 도착하고 완제품은 생산 직후 출하**되는 전략, 안전 재고는 **유연성 부족에 대비한 완충 재고**, 채찍 효과는 **수요 정보가 단계마다 왜곡·증폭되는 현상**이다. 줄이는 방법은 **모든 구성원이 정확하고 최신인 정보를 공유해 불확실성을 줄이는 것**.
6. **Supply chain planning systems**와 **supply chain execution systems**. Demand planning은 **planning** 쪽이다.
7. 푸시는 **build-to-stock**으로 **수요 예측**에 따라 만들어 고객에게 밀어내고, 풀은 **build-to-order(demand-driven)**로 **실제 고객 주문**이 공급망을 움직인다. 슬로건: **“Make what we sell, not sell what we make.”**
8. **거리·시차가 크고, 참가자가 여러 나라라 성과 기준과 법적 요구가 다르다.** 인터넷이 돕는 영역: **창고 관리, 운송 관리, 물류, 아웃소싱.**
9. **고객 데이터 수집·통합, 통합·분석, 여러 시스템과 고객 접점에 배포, 전사적 단일 고객 시각 제공.** Single enterprise view는 **회사 어느 부서에서 보든 한 고객이 하나의 통합된 모습**으로 보인다는 뜻이다.
10. PRM은 **판매 파트너와의 협업을 강화**하는 모듈(잠재 고객 발굴·가격·판촉·주문 구성·가용성 통합, 파트너 성과 평가), ERM은 **목표 설정·성과 관리·성과 기반 보상·교육 등 CRM과 밀접한 직원 문제**를 다루는 모듈이다.
11. **SFA**는 영업사원이 가장 수익성 높은 고객에 집중하도록 돕고, **고객 서비스**는 콜센터·헬프데스크의 효율을 높이며, **마케팅**은 직접 마케팅 캠페인을 지원한다. **Cross-selling은 보완 제품을 함께 파는 것**(노트북 + 마우스), **up-selling은 더 비싼 상위 제품을 권하는 것**(256GB → 512GB).
12. 운영적 CRM은 **고객 대면 애플리케이션(SFA·콜센터·마케팅 자동화)**, 분석적 CRM은 **운영적 CRM의 데이터를 데이터 웨어하우스에서 OLAP·데이터 마이닝으로 분석**한다. CLTV의 세 요소: **고객이 만드는 수익, 고객 확보·서비스 비용, 예상 관계 기간.**
13. Churn rate는 **회사 제품·서비스의 이용·구매를 중단한 고객의 수**이며, **고객 기반의 성장 또는 감소**를 보여 주는 지표다.
14. **비싸고(비용 초과), 개발 기간이 길고, 기술 변화와 업무 프로세스 변화가 함께 필요하고, 조직 학습·변화가 필요하며, 전환 비용과 공급업체 의존, 클라우드 애플리케이션 통합, 데이터 표준화·관리·정제** 문제가 있다. Switching costs는 **다른 공급업체로 바꿀 때 드는 돈·시간·노력·위험**으로, 예: ERP를 바꾸려면 데이터 이전·프로세스 재설계·전 직원 재교육이 필요하다.
15. **더 유연하고 웹 기반이며 다른 시스템과 통합, 웹 서비스·SOA 활용, 오픈소스, 온디맨드·클라우드 버전, 모바일 기능, 중소기업용 버전.** 클라우드 CRM 1위는 **Salesforce.com**, 주요 공급업체는 **SAP, Oracle, Microsoft, NetSuite**.
16. Social CRM은 **CRM에 소셜 네트워킹 기술을 결합해 소셜 미디어 활동을 감시·분석하고 소셜·웹 캠페인을 관리**하는 것이다. 전사 애플리케이션 속 BI는 **유연한 보고서, 임의(ad hoc) 분석, what-if 시나리오, 디지털 대시보드, 데이터 시각화**를 제공한다.

### 단답형 정답

1. **Enterprise systems (ERP)** — 통합 모듈과 중앙 DB의 전사 시스템
2. **Configuration tables** — 코드 수정 없이 소프트웨어를 맞추는 설정표
3. **Upstream (supply chain)** — 공급자 쪽 상류 공급망
4. **Safety stock** — 유연성 부족에 대비한 안전 재고
5. **Bullwhip effect** — 수요 정보가 왜곡·증폭되는 채찍 효과
6. **Demand planning** — 얼마나 만들지 정하는 수요 계획
7. **Pull-based model** — 실제 주문이 움직이는 풀 기반(주문 생산) 모델
8. **Sales force automation (SFA)** — 영업 자동화
9. **Cross-selling** — 보완 제품을 함께 파는 교차 판매
10. **Analytical CRM** — 분석적 CRM
11. **Churn rate** — 이탈률
12. **Switching costs** — 전환 비용
