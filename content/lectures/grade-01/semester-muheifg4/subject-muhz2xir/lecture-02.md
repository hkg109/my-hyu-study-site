---
title: "2장 A · 프로세스에서 전사 시스템까지"
description: "비즈니스 프로세스에서 TPS·MIS·DSS·ESS와 ERP·SCM·CRM·KMS까지, 슬라이드 흐름을 따라 연결하는 Chapter 2 전반부 필기."
order: 2
published: true
duration: 80
tags: [정시개, MIS, 2장, 비즈니스 프로세스, TPS, ERP]
objectives:
  - 비즈니스 프로세스와 정보시스템의 관계를 설명한다.
  - TPS·MIS·DSS·ESS를 관리 수준과 의사결정 유형에 따라 구분한다.
  - ERP·SCM·CRM·KMS가 조직의 어떤 경계를 연결하는지 비교한다.
---

## 학습 경로

[이전: 1장](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-01) · [다음: 2장 B](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-03)

**범위:** Chapter 2 슬라이드 2–29 · Process → Management Systems → Enterprise Integration

[Chapter 2 원본 PDF](/materials/mis-exam-slides/ch02_17ed.pdf) · [Chapter 2 확장 PDF](/materials/mis-exam-slides/ch02_17ed_final.pdf)

## Chapter 2 개요

- Chapter 2 주제: **business processes, management systems, enterprise applications, collaboration, knowledge management**

> **기업의 업무 흐름과 의사결정을 information systems가 어떻게 지원하는지 보는 장**

---

## Slide 2 — Learning Objectives

- **Business Processes ↔ Information Systems** 관계
- management level별 system: **TPS / MIS / DSS / ESS**
- enterprise-wide applications: **ERP / SCM / CRM / KMS**
- **Collaboration / Social Business**의 필요성과 도구
- **Knowledge Management Systems**
- **Information Systems Function / Career**

> **핵심 흐름: Process → Systems → Enterprise Integration → Collaboration → Knowledge → IS Function**

---

## Slide 3 — Sharp Corporation Case (1/2)

### Problem
- hierarchical **top-down processes**
- new competitors
- 부족한 **collaboration / idea sharing**

### Solution
- knowledge-sharing strategy와 goal 설정
- knowledge-sharing / collaboration process 재설계
- organizational culture 변화
- **Microsoft Yammer** 도입

> **문제는 단순히 software 부족이 아니라 process + culture + collaboration의 문제**

**풀어 이해하기:** Sharp의 문제는 “메신저가 없어서”가 아니었다. 위에서 아래로만 지시가 내려가는 구조라 현장의 아이디어가 위로 올라가지 못했고, 새 경쟁자가 빠르게 따라오는 동안 부서끼리 알고 있는 것을 나누지 못했다. 그래서 해결책도 도구(Yammer) 하나가 아니라 **목표 설정 → 공유 절차 재설계 → 문화 변화 → 도구 도입**의 묶음이었다.

> [!EXAM]
> 사례 문제에서 해결책을 쓸 때 기술 이름만 쓰면 감점된다. 1장의 세 차원처럼 **조직(문화·절차) + 경영(목표) + 기술(도구)**을 함께 쓴다.

---

## Slide 4 — Sharp Corporation Case (2/2)

- new information systems를 사용해 performance / competitiveness 개선
- **teamwork + collaboration** → innovation / profit growth
- knowledge dissemination에는 **organizational culture + business processes**가 중요

> **Information system의 효과는 technology만이 아니라 organization과 process에 달려 있음**

**풀어 이해하기:** 같은 협업 도구를 도입한 회사가 모두 성과를 내지는 못한다. 도구에 글을 올려도 상사가 읽지 않거나, 공유한 아이디어가 평가에 반영되지 않으면 직원은 다시 예전처럼 일한다. 지식이 퍼지려면 **공유하는 행동이 보상받는 문화**와 그 지식을 실제 업무에 쓰는 **프로세스**가 함께 있어야 한다.

---

## Slide 5 — Business Processes (1/2)

- **Business Process**
  - material / information / knowledge의 flow
  - 특정 business task를 수행하는 **logically related set of tasks**
  - 한 functional area 내부 또는 **cross-functional** 가능
- business = 여러 business processes의 집합으로 볼 수 있음
- business process는 **asset 또는 liability**가 될 수 있음
  - outdated process → responsiveness / efficiency 저하

> **Business Process = 업무를 수행하는 연결된 task들의 흐름**

**풀어 이해하기:** 카페에서 “주문 받기 → 음료 만들기 → 전달하기 → 결제 기록하기”는 하나의 business process다. 각 단계는 따로 떨어진 일이 아니라 앞 단계의 정보(주문 내용)를 받아 다음 단계로 넘기는 흐름이다. 이 흐름이 잘 설계되어 있으면 손님이 몰려도 실수가 적은 **asset**이 되고, 예전 방식 그대로라 주문이 자주 누락되면 **liability**가 된다.

**답안 틀:** 무엇이 흐르는가(material · information · knowledge) → 어떤 task가 이어지는가 → 한 부서 안인가, 여러 부서를 가로지르는가.

---

## Slide 6 — Business Processes (2/2)

### Functional Business Processes

| Functional Area | 주요 Business Process |
|---|---|
| **Manufacturing & Production** | assembling product / quality checking |
| **Sales & Marketing** | identifying customers / selling product |
| **Finance & Accounting** | financial statements / paying creditors |
| **Human Resources** | hiring employees / evaluating job performance |

> **각 functional area마다 고유한 business process가 존재**

**풀어 이해하기:** 표의 프로세스는 부서 이름으로 묶여 있지만, 실제 일은 부서 경계에서 자주 막힌다. 예를 들어 인사팀의 “채용”은 현업 부서가 필요 인원을 알려 줘야 시작되고, 회계팀이 급여를 등록해야 끝난다. 그래서 다음 슬라이드의 주문 이행처럼 **중요한 프로세스는 대부분 cross-functional**이라는 점이 시험에 나온다.

---

## Slide 7 — Figure 2.1 Order Fulfillment Process

### Flow

**Sales**
- Generate order → Submit order

↓

**Accounting**
- Check credit → Approve credit → Generate invoice

↓

**Manufacturing & Production**
- Assemble product → Ship product

### Key
- 하나의 customer order가 여러 functional areas를 통과
- 중요한 business process는 보통 **cross-functional**

> **Order fulfillment = Sales + Accounting + Manufacturing의 coordination**

### 개념도 · 한 주문이 부서를 가로지르는 과정

![고객 주문이 영업, 회계, 재고 확인, 생산과 배송을 거쳐 완료되고 예외와 고객 피드백이 다시 영업으로 돌아오는 흐름](/materials/diagrams/mis-02-order-fulfillment.svg)

**그림 읽기:** order fulfillment는 한 부서의 독립 작업이 아니라 여러 functional area가 같은 주문 정보를 넘겨받는 cross-functional process이다. 어느 한 단계의 지연이나 오류도 전체 delivery outcome에 영향을 준다.

---

## Slide 8 — How IT Improves Business Processes

### 1. Existing Process 효율화
- manual steps를 **automation**

### 2. Entirely New Process 가능
- information flow 변경
- sequential steps → **parallel steps**
- decision-making delay 제거
- new business models 지원

### Example
- digital music download
- e-book purchase / one-click purchase

> **IT는 기존 process를 빠르게 만들 뿐 아니라 새로운 process 자체를 가능하게 함**

자동화와 프로세스 재설계의 차이는 **업무 순서가 바뀌었는가**로 확인할 수 있다. 기존 승인 절차를 그대로 두고 입력만 빨라졌다면 효율화이고, 같은 주문 정보를 여러 부서가 동시에 확인해 순차적인 전달·대기를 줄였다면 정보 흐름 자체를 바꾼 것이다.

---

## Slide 9 — AI Changes the Design of Business Processes

| Role | Human / AI 관계 | 핵심 |
|---|---|---|
| **Assist** | Human이 process 수행 | AI가 retrieve / summarize / draft / recommend |
| **Automate** | System이 routine steps 수행 | rules / models가 repeatable work 수행 |
| **Agent** | AI가 defined workflow 수행 | tools / systems 호출, permissions / monitoring / escalation 필요 |

> **AI 활용 수준: Assist → Automate → Agent**

세 수준의 차이는 AI가 결과를 만드는 데서 끝나는지, 실제 업무 단계를 수행하는지에 있다. Assist에서는 사람이 제안을 검토해 행동하고, Automate에서는 정해진 반복 단계를 시스템이 처리한다. Agent가 여러 도구를 이용해 흐름을 이어 간다면 권한 범위와 사람이 넘겨받아야 할 예외를 먼저 정해야 한다.

---

## Slide 10 — TPS (Transaction Processing Systems)

- **Target**: operational managers & staff
- **Function**: perform + record **daily routine transactions**
  - sales order entry / payroll / shipping
- **Purpose**: operations status와 external environment monitor
- **Decision**: **predefined + structured**
- routine questions에 답하기 위한 필수 system

> **TPS = operational level의 반복적이고 structured한 transaction을 처리·기록**

**풀어 이해하기:** TPS는 회사의 “기록 담당”이다. 카페의 POS가 주문 한 건 한 건을 시간·메뉴·금액과 함께 남기는 것처럼, 매일 반복되는 거래를 정확하게 처리하고 저장한다. 판단은 거의 하지 않고 “어제 몇 잔 팔았나?”, “이 주문은 결제됐나?” 같은 **정해진 질문**에 답한다. TPS가 멈추면 주문도 급여도 처리되지 않으므로 위 단계 시스템 모두가 이 데이터에 의존한다.

---

## Slide 11 — Figure 2.2 Payroll TPS

### Input
- Employee Data
- Employee/File Database
  - pay rate / gross pay / tax / net pay 등

### Processing
- **Payroll System**
- employee payment transaction 처리

### Output
- employee paychecks
- management reports
- General Ledger
- government agencies
- online queries

> **Employee Data → Payroll Processing → Paychecks / Reports / Ledger / Government**

**풀어 이해하기:** 급여 TPS는 직원 데이터(시급·근무시간·세율)를 받아 급여를 계산하고, 그 결과를 여러 곳으로 내보낸다. 직원은 급여명세서를, 관리자는 인건비 보고서를, 회계는 총계정원장(General Ledger) 기록을, 정부는 세금 자료를 받는다. **하나의 거래 처리 결과가 여러 사용자에게 다른 형태로 쓰인다**는 점이 TPS가 회사 전체의 기반인 이유다.

---

## Slide 12 — Business Intelligence (BI)

- **Definition**: data + software tools for **organizing & analyzing data**
- **Purpose**: support **better decision making**

### Related Systems

| System | 역할 |
|---|---|
| **MIS** | routine report / current performance 제공 |
| **DSS** | non-routine decision 분석 지원 |
| **ESS** | senior management의 strategic decision 지원 |

> **BI = data를 organize/analyze해서 decision making을 지원하는 tools**

**풀어 이해하기:** BI는 특정 시스템 한 개의 이름이 아니라 **데이터를 모아 분석하는 도구와 방법 전체**를 부르는 큰 우산이다. MIS·DSS·ESS는 그 우산 아래에서 누구의 어떤 결정을 돕느냐에 따라 나뉜다. 그래서 “BI vs MIS” 문제는 “큰 범주 vs 그 안의 한 유형”으로 답한다.

---

## Slide 13 — Management Information Systems (MIS)

- **Target**: middle management
- **Input**: data from **TPS**
- **Output**: firm의 **current performance report**
- routine questions + **predefined procedures**
- analytic capability가 적고 flexible하지 않음

### 주의
- 학문 분야로서의 MIS와 **system 종류로서 MIS**는 의미가 다름

> **MIS = TPS data를 요약해 middle managers에게 정기 report 제공**

**풀어 이해하기:** 카페 점장이 매주 받는 “메뉴별 판매량과 지난주 대비 증감” 보고서가 MIS의 결과물이다. TPS가 쌓은 거래 기록을 정해진 형식으로 요약해 주기 때문에 **현황을 확인하고 이상한 점을 발견**하는 데 좋다. 하지만 “신메뉴를 내면 매출이 얼마나 늘까?”처럼 조건을 바꿔 보는 질문에는 약하다. 그건 DSS의 역할이다.

---

## Slide 14 — Figure 2.3 TPS → MIS

### TPS
- Order processing system
- Materials resource planning system
- General ledger system

↓ **summarized transaction data**

### MIS Files
- Sales data
- Unit product cost data
- Product change data
- Expense data

↓

### MIS

↓

### Output
- Reports
- Online Displays / Dashboards

↓

### Users
- Managers

> **TPS → summarized data → MIS → Reports / Dashboards → Managers**

**풀어 이해하기:** 그림의 핵심 화살표는 **summarized transaction data**다. MIS는 새 데이터를 만들지 않고 TPS가 이미 기록한 주문·자재·회계 데이터를 요약해 파일로 모은 뒤, 보고서와 대시보드로 관리자에게 보여 준다. 그래서 TPS 데이터가 틀리면 MIS 보고서도 그대로 틀린다.

---

## Slide 15 — Figure 2.4 Sample MIS Report

- MIS가 만든 **summarized annual sales report**
- 핵심 비교: **Actual Sales ↔ Planned Sales**

### Actual Versus Planned

| 값 | 의미 |
|---|---|
| `> 1.00` | Actual Sales > Planned Sales |
| `= 1.00` | 실제 = 계획 |
| `< 1.00` | Actual Sales < Planned Sales |

### Example

| 값 | 해석 |
|---|---|
| `1.19` | 계획의 **119% 판매** |
| `0.85` | 계획의 **85% 판매** |

> **MIS report는 manager가 performance를 비교·monitor하기 쉽게 요약한 정보**

**풀어 이해하기:** 숫자 하나로 계획 대비 실적을 읽는 방법이다. 1.19는 계획보다 19% 더 팔았다는 뜻이고 0.85는 계획의 85%만 팔았다는 뜻이다. 관리자는 수백 개의 거래를 다 보지 않고도 **1.00에서 크게 벗어난 항목만 골라** 원인을 살펴볼 수 있다. 이것이 MIS가 “요약”을 하는 이유다.

---

## Slide 16 — Decision Support Systems (DSS)

- **Target**: middle management
- **Purpose**: **non-routine decision making** 지원
  - ex) December sales가 2배라면 production schedule 영향?
- **Data**
  - internal: TPS / MIS data
  - external information 가능

### Types
- **Model-driven DSS**: analytical model 중심
- **Data-driven DSS**: large data에서 useful information 추출

> **DSS = analytical model / data를 이용해 non-routine decision 지원**

MIS와 DSS는 사용자나 데이터만으로 구분하면 헷갈린다. 같은 middle manager가 같은 판매 기록을 보더라도, MIS는 ‘계획 대비 실적이 얼마인가’를 정해진 형식으로 보여 주고 DSS는 ‘수요가 달라지면 어떤 선택이 유리한가’를 분석한다. 핵심은 **정기적인 현황 확인인지, 조건을 바꿔 보는 판단인지**이다.

---

## Slide 17 — Figure 2.5 Voyage-Estimating DSS

### Data
- ship speed / capacity
- port distance / restrictions
- fuel consumption cost
- charter hire history cost
- port expense

↓

### Analytical Models Database

↓

### Decision Support
- 어떤 vessel을 어느 destination에 보낼지
- optimal loading pattern
- optimal speed
- profit maximization

> **다양한 data + analytical model → shipping bid와 운항 의사결정 지원**

**풀어 이해하기:** 해운회사는 배의 속도·적재량, 항구 간 거리, 연료비, 항구 비용을 조합해 “어느 배를 어디로, 얼마나 싣고, 어떤 속도로 보내야 이익이 가장 큰가”를 계산한다. 조건이 매번 달라서 정해진 보고서로는 답할 수 없는 **non-routine decision**이고, 분석 모델(Analytical Models)이 여러 시나리오를 비교해 준다. DSS가 **model-driven**이라는 말의 대표 사례다.

---

## Slide 18 — Executive Support Systems (ESS) (1/2)

- **Target**: senior management
- **Purpose**: **non-routine / strategic decisions** 지원
- 요구되는 것
  - judgment
  - evaluation
  - insight

### Data
- external events
  - tax law / competitors
- summarized internal information from **MIS + DSS**

### Example
- **Digital Dashboard**
- real-time KPI / financial performance
  - working capital / cash flow / inventory

> **ESS = senior managers가 strategic decision을 빠르게 내리도록 핵심 정보를 제공**

**풀어 이해하기:** 사장은 “이번 달 아메리카노가 몇 잔 팔렸나”보다 “경쟁사가 근처에 매장을 내면 우리는 어떻게 대응할까”를 고민한다. 이런 결정에는 정답 공식이 없어서 판단(judgment)과 통찰(insight)이 필요하다. ESS는 세법 변화·경쟁사 동향 같은 **외부 정보**와 MIS·DSS가 요약한 **내부 핵심 지표**를 한 화면의 Digital Dashboard로 보여 줘서 그 판단을 돕는다.

---

## Slide 19 — ESS + MIS + DSS Connection

- **ESS relies on MIS + DSS inputs**
- systems는 서로 isolated되면 안 됨
- accurate MIS / DSS data가 ESS 품질을 결정
- modern ESS: **Digital Dashboard / ease of use / simple display / quick access**

### Management System 비교

| System | Main User | Decision | 핵심 역할 |
|---|---|---|---|
| **TPS** | operational managers & staff | routine / structured | daily transaction 처리·기록 |
| **MIS** | middle management | routine / predefined | TPS data 요약·report |
| **DSS** | middle management | non-routine / analytical | model / data 기반 분석 |
| **ESS** | senior management | non-routine / strategic | 핵심 KPI와 strategic information 제공 |

> **TPS → MIS / DSS → ESS → Senior Management**

### 개념도 · 관리 수준별 시스템 연결

![운영 수준의 TPS가 MIS와 DSS를 거쳐 전략 수준의 ESS에 정보를 공급하고 전사 애플리케이션이 모든 수준을 연결하는 구조](/materials/diagrams/mis-02-management-systems.svg)

**그림 읽기:** TPS는 일상 거래를 기록하는 기반이고, MIS는 이를 정기 보고서로 요약하며 DSS는 같은 내부 데이터와 외부 데이터를 분석한다. ESS는 MIS와 DSS의 핵심 정보를 받아 전략적 판단을 지원한다. 오른쪽의 ERP·SCM·CRM·KMS는 특정 계층에만 속하는 시스템이 아니라 부서와 관리 수준의 경계를 가로질러 연결한다.

---

## Slide 20 — Enterprise Applications

- enterprise 전체를 **linking**하는 systems
- 여러 functional areas를 span
- firm-wide business processes 실행
- 모든 management levels 포함

### Four Major Applications

| Application | 주요 대상 / 역할 |
|---|---|
| **ERP / Enterprise Systems** | 내부 functional areas와 data 통합 |
| **SCM** | suppliers / logistics / supply chain 관리 |
| **CRM** | customers / sales / marketing / service 관리 |
| **KMS** | organizational knowledge 수집·공유·활용 |

> **Enterprise Applications = 여러 부서와 management level을 연결하는 firm-wide systems**

**풀어 이해하기:** 앞의 TPS·MIS·DSS·ESS가 **관리 계층(세로)**으로 나눈 시스템이라면, Enterprise Applications는 **부서와 회사 경계(가로)**를 연결하는 시스템이다. 영업·생산·회계가 각자 다른 프로그램과 엑셀을 쓰면 같은 고객 주문도 부서마다 다르게 기록된다. 전사 애플리케이션은 이 흩어진 기록을 하나의 흐름으로 묶는다.

> [!EXAM]
> “TPS는 ERP의 일부인가?” 같은 질문은 분류 기준이 다르다는 점으로 답한다. 관리 수준별 분류(TPS–ESS)와 연결 범위별 분류(ERP·SCM·CRM·KMS)는 서로 다른 축이다.

---

## Slide 21 — Figure 2.6 Enterprise Application Architecture

### Internal Functional Areas
- Sales & Marketing
- Manufacturing & Production
- Finance & Accounting
- Human Resources

### Major Systems
- **Enterprise Systems** → 내부 기능 통합
- **SCM** → suppliers / business partners 연결
- **CRM** → customers / distributors 연결
- **KMS** → organization-wide knowledge 연결

### Purpose
- cross-functional process 자동화
- information sharing
- accurate decision information 제공

> **Enterprise Applications는 내부 부서뿐 아니라 suppliers / customers까지 연결**

### 개념도 · Enterprise applications의 역할 분담

![ERP의 공통 내부 데이터를 중심으로 SCM은 공급자와 물류를, CRM은 고객 접점을, KMS는 조직 지식을 연결하는 구조](/materials/diagrams/mis-02-enterprise-applications.svg)

**그림 읽기:** ERP는 내부 data와 process의 공통 기반이고, SCM과 CRM은 각각 supplier side와 customer side를 연결한다. KMS는 이 과정에서 생긴 know-how를 수집·공유·적용한다. 네 system은 대체 관계가 아니라 서로 다른 경계를 연결한다.

---

## Slide 22 — Enterprise Systems (ES / ERP)

- **aka ERP (Enterprise Resource Planning)**
- 여러 functional areas의 data 수집
- **single central data repository**에 저장
- **fragmented data problem** 해결

### Benefits
- information flow 통합
- daily activities coordination
- customer orders에 빠르게 대응
- overall view of operations 제공
- daily operation + long-term planning 지원

### 구분
- **Enterprise Applications** = ERP / SCM / CRM / KMS 전체
- **Enterprise Systems** = 그중 ERP를 의미

> **ERP = 여러 부서의 data를 하나의 central repository로 통합**

앞의 주문 이행 사례에 대입하면 ERP의 의미가 선명해진다. 영업이 입력한 주문을 회계와 생산이 각자 다시 입력하는 대신 같은 기록을 기준으로 업무를 이어 간다. 중앙 저장소의 목적은 데이터를 한곳에 모으는 것 자체보다 부서마다 다른 기록 때문에 생기는 조정 문제를 줄이는 데 있다.

---

## Slide 23 — Enterprise Systems Are Moving to Cloud Platforms

| 관점 | 핵심 내용 |
|---|---|
| **Market** | Cloud ERP 확산 / SAP Cloud ERP Suite revenue 증가 |
| **Architecture** | standardized processes / shared data / APIs / analytics / continuous updates |
| **Management** | subscription cost / configuration / data migration / integration / skills / vendor dependence |
| **AI** | ERP에 **copilots / agents** embedded → decision support / task execution |

> **ERP trend = on-premise → Cloud ERP + embedded AI**

**풀어 이해하기:** 예전에는 회사가 서버를 사서 ERP를 직접 설치했다면, 지금은 구독료를 내고 클라우드에서 빌려 쓰는 방식이 늘고 있다. 업데이트가 자동으로 되고 AI 기능이 빨리 붙는 장점이 있지만, 매달 비용이 나가고 기존 데이터를 옮기는 작업이 어렵고 특정 공급업체에 묶이는(**vendor dependence**) 위험도 있다. 시험에서는 장점과 관리상의 부담을 함께 쓴다.

---

## Slide 24 — Supply Chain Management (SCM) Systems

- 관계 관리 대상
  - suppliers
  - purchasing firms
  - distributors
  - logistics companies
- shared information
  - orders
  - production
  - inventory levels

### Goal
- correct amount of product
- source → point of consumption
- as quickly as possible
- at lowest cost

### Type
- **inter-organizational system**
- organizational boundaries를 넘어 information flow 자동화

> **SCM = supply chain 전체의 product / information flow를 최적화**

**풀어 이해하기:** 카페가 원두 업체, 우유 업체, 배송 업체와 주문·재고 정보를 공유하면, 원두가 떨어지기 전에 자동으로 발주가 나가고 배송 일정도 맞출 수 있다. SCM은 이렇게 **회사 바깥의 여러 조직을 잇는 inter-organizational system**이라는 점이 ERP와 다르다. 목표는 “필요한 양을, 필요한 곳에, 가장 빨리, 가장 싸게”라는 네 조건을 동시에 맞추는 것이다.

---

## Slide 25 — Walmart’s AI-Enabled Supply Chain

| 단계 | 역할 |
|---|---|
| **Sense** | demand / inventory / transportation / operational signals 수집 |
| **Predict** | ML로 demand / stock / fulfillment / routing problems 예측 |
| **Act** | 필요한 location으로 inventory redirect |
| **Learn** | operating feedback으로 개선 |
| **Control** | data quality / access / exception / performance / accountability 관리 |

> **AI-enabled SCM = Sense → Predict → Act → Learn + Control**

**풀어 이해하기:** 다섯 단계는 사람이 재고를 관리하는 방식을 시스템으로 옮긴 것이다. 신호를 모으고(Sense), 부족해질 곳을 미리 예측하고(Predict), 재고를 옮기고(Act), 결과를 보고 다음 예측을 고친다(Learn). 마지막 **Control**은 AI가 틀렸을 때 누가 확인하고 책임지는지를 정하는 단계로, 자동화가 커질수록 더 중요해진다.

---

## Slide 26 — Customer Relationship Management (CRM) Systems

- **Purpose**: customers와의 relationship 관리
- sales / marketing / customer service의 customer-related processes 통합

### Goals
- optimize revenue
- improve customer satisfaction
- increase customer retention
- identify & retain profitable customers
- increase sales

> **CRM = customer data와 customer-facing processes를 통합해 관계와 sales를 개선**

**풀어 이해하기:** 단골손님이 매번 디카페인 라테를 주문한다는 기록이 영업·마케팅·서비스 담당자 모두에게 보이면, 신메뉴 쿠폰을 그 손님에게 맞춰 보내고 불만 전화가 와도 이력을 보고 응대할 수 있다. CRM의 핵심은 고객 정보를 **한곳에 모아 고객 접점 프로세스 전체가 같은 정보를 쓰게** 하는 것이다. 특히 이익을 많이 주는 고객을 찾아 유지(retention)하는 데 초점이 있다.

---

## Slide 27 — Knowledge Management Systems (KMS)

- knowledge / expertise를 **capture + apply**
- relevant knowledge를 collect하고 필요한 곳에서 사용 가능하게 함
- business processes / management decisions 개선
- external knowledge sources와 연결

### Example
- product creation know-how
- problem solving method
- best practices

> **KMS = organizational knowledge를 수집·공유·활용하는 system**

**풀어 이해하기:** 10년 차 바리스타가 알고 있는 “습한 날 원두 분쇄도를 조절하는 법”은 그 사람이 그만두면 사라진다. KMS는 이런 노하우와 문제 해결 방법을 모아 두고, 필요한 직원이 필요한 순간에 찾아 쓰게 한다. 데이터가 아니라 **경험과 전문성**을 다룬다는 점이 다른 전사 시스템과의 차이이며, 자세한 내용은 2장 B의 지식관리 부분에서 이어진다.

---

## Slide 28 — Intranets and Extranets

### Intranet
- internal network
- Internet standards 기반
- employees only

### Extranet
- authorized vendors / suppliers / partners에게 제한적 접근 허용
- supply chain coordination
- collaboration 지원

| | Intranet | Extranet |
|---|---|---|
| 대상 | Employees | Authorized external partners |
| 범위 | Internal | Internal + selected external |
| 목적 | 내부 정보 공유 | 외부 partner와 collaboration |

> **Intranet = 내부용 / Extranet = 제한된 외부 partner까지 확장**

**풀어 이해하기:** 직원만 들어가는 사내 공지·매뉴얼 사이트가 Intranet이고, 여기에 원두 공급업체가 로그인해 우리 재고와 발주서를 볼 수 있게 열어 주면 Extranet이다. 둘 다 인터넷 기술을 쓰지만 **누구에게 문을 열어 주느냐**가 다르다. Extranet은 SCM처럼 외부 파트너와의 협업을 위한 통로가 된다.

---

## Slide 29 — E-Business, E-Commerce, E-Government

| 개념 | 정의 | 범위 |
|---|---|---|
| **E-business** | digital technology / Internet으로 major business processes 수행 | 가장 넓음 |
| **E-commerce** | Internet을 통한 buying / selling | **E-business의 subset** |
| **E-government** | Internet으로 citizens / employees / businesses에 public information / services 제공 | public sector |

> **E-commerce ⊂ E-business / E-government는 공공부문의 Internet 활용**

**풀어 이해하기:** 카페가 앱으로 원두를 판매하면 E-commerce이고, 그 판매를 포함해 직원 근무표·발주·회계까지 디지털로 처리하면 E-business다. 즉 E-commerce는 “사고파는 것”만 보는 **부분집합**이다. 정부가 온라인으로 민원과 공공 정보를 제공하는 것은 E-government로, 주체가 공공부문이라는 점이 다르다.

---

## 개념 회상과 오개념 점검

> [!QUIZ]
> 정형화된 주간 실적 보고서를 만드는 MIS와, 운송 경로처럼 비정형 의사결정을 분석하는 DSS의 핵심 차이를 설명하시오.

> [!ANSWER]
> MIS는 주로 TPS의 내부 데이터를 정기 보고서로 요약해 routine decision을 지원한다. DSS는 내부·외부 데이터와 analytical model을 결합해 non-routine decision을 지원한다.

> [!QUIZ]
> 주문 접수, 월별 판매 요약, 신규 항로 수익성 분석, 전사 전략 지표 확인에 각각 가장 직접적으로 대응하는 system을 순서대로 쓰시오.

> [!ANSWER]
> TPS → MIS → DSS → ESS이다. 거래 기록에서 관리 보고, 분석, 최고경영진의 전략적 조망으로 의사결정 범위가 넓어진다.

> [!QUIZ]
> E-commerce가 E-business의 subset인 이유를 한 문장으로 설명하시오.

> [!ANSWER]
> E-commerce는 Internet을 통한 buying과 selling에 초점을 두지만, E-business는 이를 포함해 기업의 더 넓은 digital business process 전체를 다루기 때문이다.

> [!QUIZ]
> A middle manager must compare several shipping routes for a new, non-routine delivery decision. Which system is the best primary support?
>
> - A. TPS
> - B. MIS
> - C. DSS
> - D. ESS

> [!ANSWER]
> **정답은 C, DSS이다.** A는 operational transaction 기록과 의사결정 분석을 혼동한 선택이다. B는 routine report와 non-routine analysis를 혼동한 선택이다. D는 middle management와 senior management의 전략적 조망을 혼동한 선택이다.
