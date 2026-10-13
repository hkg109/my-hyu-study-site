---
title: "2장 A · 프로세스에서 전사 시스템까지"
description: "비즈니스 프로세스에서 TPS·MIS·DSS·ESS와 ERP·SCM·CRM·KMS까지, 슬라이드 흐름을 따라 연결하는 Chapter 2 전반부 필기."
order: 2
published: true
duration: 65
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

---

## Slide 4 — Sharp Corporation Case (2/2)

- new information systems를 사용해 performance / competitiveness 개선
- **teamwork + collaboration** → innovation / profit growth
- knowledge dissemination에는 **organizational culture + business processes**가 중요

> **Information system의 효과는 technology만이 아니라 organization과 process에 달려 있음**

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

---

## Slide 9 — AI Changes the Design of Business Processes

| Role | Human / AI 관계 | 핵심 |
|---|---|---|
| **Assist** | Human이 process 수행 | AI가 retrieve / summarize / draft / recommend |
| **Automate** | System이 routine steps 수행 | rules / models가 repeatable work 수행 |
| **Agent** | AI가 defined workflow 수행 | tools / systems 호출, permissions / monitoring / escalation 필요 |

> **AI 활용 수준: Assist → Automate → Agent**

---

## Slide 10 — TPS (Transaction Processing Systems)

- **Target**: operational managers & staff
- **Function**: perform + record **daily routine transactions**
  - sales order entry / payroll / shipping
- **Purpose**: operations status와 external environment monitor
- **Decision**: **predefined + structured**
- routine questions에 답하기 위한 필수 system

> **TPS = operational level의 반복적이고 structured한 transaction을 처리·기록**

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

---

## Slide 23 — Enterprise Systems Are Moving to Cloud Platforms

| 관점 | 핵심 내용 |
|---|---|
| **Market** | Cloud ERP 확산 / SAP Cloud ERP Suite revenue 증가 |
| **Architecture** | standardized processes / shared data / APIs / analytics / continuous updates |
| **Management** | subscription cost / configuration / data migration / integration / skills / vendor dependence |
| **AI** | ERP에 **copilots / agents** embedded → decision support / task execution |

> **ERP trend = on-premise → Cloud ERP + embedded AI**

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

---

## Slide 29 — E-Business, E-Commerce, E-Government

| 개념 | 정의 | 범위 |
|---|---|---|
| **E-business** | digital technology / Internet으로 major business processes 수행 | 가장 넓음 |
| **E-commerce** | Internet을 통한 buying / selling | **E-business의 subset** |
| **E-government** | Internet으로 citizens / employees / businesses에 public information / services 제공 | public sector |

> **E-commerce ⊂ E-business / E-government는 공공부문의 Internet 활용**

---
