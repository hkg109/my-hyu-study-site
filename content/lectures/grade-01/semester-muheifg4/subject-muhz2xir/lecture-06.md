---
title: "5장 · IT 인프라와 신기술"
description: "IT 인프라의 정의와 다섯 시대, 일곱 구성요소, 모바일·BYOD·양자·그린 컴퓨팅, 가상화·클라우드·엣지, 오픈소스·웹 서비스, 소프트웨어 조달, 인프라 관리 과제까지 교재 그림과 개념·판서·해설·오답 주의·예제·확인 문제로 정리한 Chapter 5 교재형 필기."
order: 6
published: true
duration: 120
tags: [정시개, MIS, 5장, IT 인프라, 클라우드, 가상화, 오픈소스, TCO]
objectives:
  - IT 인프라를 장비·소프트웨어와 전사 서비스의 두 관점으로 정의하고 다섯 시대의 진화를 설명한다.
  - IT 인프라의 일곱 구성요소와 대표 공급업체를 구분한다.
  - 모바일·BYOD, 양자·그린 컴퓨팅, 가상화·클라우드·엣지 컴퓨팅, 현대 소프트웨어 플랫폼과 소프트웨어 조달 방식을 비교한다.
  - 확장성, IT 거버넌스, TCO, 경쟁세력 모형으로 인프라 투자를 평가한다.
---

## 학습 경로

[이전: 4장](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-05) · [1장으로 돌아가기](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-01)

**범위:** Chapter 5 슬라이드 1–43 · Infrastructure → Evolution → Components → Hardware Trends → Cloud → Software Platforms → Management

[Chapter 5 원본 PDF](/materials/mis-exam-slides/ch05_18ed.pdf) · [Sec 1·2 수업본 PDF](/materials/mis-exam-slides/ch05_18ed_sec1-2.pdf)

**두 PDF의 관계:** Sec 1·2 수업본은 슬라이드 1–22만 담은 앞선 배포본이고, 전체본(43장)은 같은 슬라이드에 짧은 설명을 덧붙였다. 예: ==NOS software==, ==Microsoft Windows Server==, Web-hosting services의 ==“maintain websites for fee-paying clients”==, Software integration의 ==“새 요소끼리도 맞물리게”==. 아래 필기는 설명이 더 자세한 전체본 문구를 따르고, 차이가 의미 있는 곳에 *Sec 1·2 수업본*을 따로 적었다.

**예시 박스 읽는 법:** **예시** 박스는 ==슬라이드의 실제 기업 사례·수치와 교수님 메모==를 교재 설명으로 보충한 것이다. 시험에서 “이 사례는 어떤 기술·모델인가?”로 나오므로 ==사례 → 기술 → 개념==을 함께 외운다. 장 끝 **사례 총정리**에 한 표로 모았다.

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| IT 인프라 정의(장비 vs 서비스 플랫폼) | ★★ | 두 관점 구분, service platform의 의미 |
| 인프라 진화 다섯 시대와 연도 | ★★★ | 시대 순서, 시대별 특징 고르기 |
| 일곱 구성요소와 공급업체 | ★★★ | 업체·기술을 구성요소로 분류 |
| 클라우드(IaaS·PaaS·SaaS, public·private·hybrid), 가상화 | ★★★ | 모델 정의와 사례 매칭 |
| BYOD·consumerization, 양자·그린 컴퓨팅, 엣지 | ★★ | 정의와 장단점 |
| 오픈소스·Linux, Java·HTML5, 웹 서비스·XML | ★★ | XML vs HTML, 웹 서비스의 역할 |
| 소프트웨어 아웃소싱·SaaS·SLA, 매시업·앱 | ★★ | 세 외부 출처, SLA 정의 |
| 확장성, IT 거버넌스, TCO, 경쟁세력 모형 | ★★★ | TCO 비중, 여섯 요인 내부/외부 분류 |

| 슬라이드 | 중심 질문 | 공부할 개념 |
| --- | --- | --- |
| 1–4 | 무엇을 배우며 사례는? | 학습목표, 영상 사례, Grab |
| 5–13 | IT 인프라란 무엇이고 어떻게 변해 왔나? | 두 정의, Figure 5.1, 다섯 시대, N-tier |
| 14–22 | 인프라는 무엇으로 이루어지나? | 일곱 구성요소, 레거시 시스템 |
| 23–30 | 요즘 하드웨어·컴퓨팅은 어디로 가나? | 모바일·BYOD, 양자·그린, 가상화, 클라우드, 엣지 |
| 31–37 | 소프트웨어는 어떻게 만들고 얻나? | 오픈소스, Java·HTML5, 웹 서비스, 아웃소싱·SaaS, AI 인프라 |
| 38–43 | 인프라를 어떻게 관리·투자하나? | 확장성, MDM, 거버넌스, TCO, 경쟁세력 모형 |

**책 읽는 법:** 슬라이드 제목 아래의 짧은 목록과 요약 한 줄이 강의 **핵심 필기**다. **개념**은 정의, **판서**는 한눈 정리, **해설**은 쉬운 설명, **오답 주의**는 시험 함정, **예제**는 풀이 연습, **확인 문제**의 답은 단원 끝 *정답과 해설*에 있다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!PAGEBREAK]

## Slide 1 — IT Infrastructure and Emerging Technologies

- Chapter 5 주제: **IT Infrastructure / Evolution / Components / Mobile·Quantum·Green / Virtualization·Cloud / Software Platforms / Management**

> **기업의 모든 정보시스템을 떠받치는 기반(infrastructure)과 그 기반을 바꾸는 신기술을 다루는 장**

---

## Slide 2 — Learning Objectives

- 5.1 IT infrastructure와 그 **evolution**
- 5.2 IT infrastructure의 **components**
- 5.3 **mobile platform, apps, BYOD**
- 5.4 **quantum computing, green computing**
- 5.5 **virtualization, cloud computing**
- 5.6 contemporary **software platforms**
- 5.7 소프트웨어를 얻는 다른 방법(**alternative ways of obtaining software**)
- 5.8 **IT infrastructure for AI**
- 5.9 IT infrastructure **management challenges**
- career relevance (슬라이드에는 번호가 “5.8”로 한 번 더 찍혀 있다 — 오타)

> **핵심 흐름: ==blue:정의·진화 → 구성요소 → 하드웨어 트렌드 → 가상화·클라우드 → 소프트웨어 플랫폼 → 조달 → AI 인프라 → 관리==**

---

## PART 1 · IT 인프라의 정의와 진화

## Slide 3 — Video Cases

- **Rockwell Automation** — 석유·가스 산업과 **Internet of Things (IoT)**
- **ESPN.com** — 클라우드에서의 스포츠 방송
- **Netflix** — 클라우드 위에 사업을 세우기

> **5장 영상 사례는 모두 IoT·클라우드 같은 ==인프라 선택이 사업 방식 자체를 바꾼== 이야기**

> [!EXAMPLE]
> **원본 영상 사례 제목 (Slide 3)**
>
> | 영상 | 연결 개념 |
> | --- | --- |
> | **Case 1 · Rockwell Automation Fuels the Oil and Gas Industry with the Internet of Things (IoT)** | 멀리 떨어진 현장 장비의 센서 데이터를 네트워크로 모아 감시·관리 — IoT, 네트워킹, 데이터 관리 |
> | **Case 2 · ESPN.com: The Future of Sports Broadcasting in the Cloud** | 경기 때마다 몰리는 트래픽을 클라우드로 감당 — 확장성, 클라우드 컴퓨팅 |
> | **Case 3 · Netflix: Building a Business in the Cloud** | 스트리밍 서비스를 자체 데이터센터 대신 퍼블릭 클라우드(AWS) 위에 구축 — 클라우드, AWS |

> [!NOTE]
> 세 사례의 공통 질문은 ==“우리 사업에 필요한 컴퓨팅 능력을 직접 소유할 것인가, 빌려 쓸 것인가?”==다. 이 질문이 5장 전체(클라우드, 가상화, 아웃소싱, TCO, rent-versus-buy)를 관통한다.

---

## Slide 4 — Opening Case: Southeast Asia's Grab

### Opening Case
- **Southeast Asia's Grab Leverages Information Technology to Enhance Its Services**
- Problem: (슬라이드에는 빈칸 — 수업에서 채우는 부분)
- Solutions: ==scalable services==, ==GrabMaps==
- ==cloud computing으로 effectiveness를 높이고 costs를 통제==하는 사례

> **Grab = 클라우드 기반의 확장 가능한(scalable) 서비스로 성장과 비용을 동시에 관리**

> [!EXAMPLE]
> **Grab 사례 읽기**
>
> - Grab은 동남아시아의 **슈퍼앱**(차량 호출, 음식 배달, 결제 등)이다. 이용자가 폭발적으로 늘고 서비스가 계속 추가되므로 ==수요가 갑자기 늘어도 멈추지 않는 시스템==이 문제다.
> - 해법 ① **scalable services**: 클라우드 자원을 수요에 맞춰 늘리고 줄인다 → Slide 38의 ==scalability==, Slide 27의 클라우드와 연결.
> - 해법 ② **GrabMaps**: 동남아 현지 도로 사정에 맞춘 자체 지도 서비스.
> - 시험 연결: “이 사례가 보여 주는 것은?” → ==cloud computing으로 효과성을 높이고 비용을 통제==.

---

## Slide 5 — Defining IT Infrastructure

### IT Infrastructure의 두 정의
- ==전사(entire enterprise)를 운영하는 데 필요한 physical devices와 software applications의 집합==
- ==firmwide services의 집합==
  - Computing platforms: computing services 제공
  - Telecommunications services
  - Data management services
  - Application software services: ==ERP, CRM, SCM, KMS== 제공
  - Physical facilities management services
  - IT management, standards, education, R&D 등의 services

### “Service platform” perspective
- 투자의 (business) value를 ==더 정확하게== 보는 관점

> **IT Infrastructure = 장비·소프트웨어의 집합 + 경영진과 사용자가 쓰는 전사 서비스 플랫폼**

> [!CONCEPT]
> **IT infrastructure** — 기업 전체를 운영하는 데 필요한 물리적 장치와 소프트웨어의 집합이자, 경영진과 예산이 지원하는 **전사 서비스**(컴퓨팅, 통신, 데이터 관리, 애플리케이션, 시설 관리, IT 관리·표준·교육·R&D)의 집합.

> [!BOARD]
> - 정의 ① 물건으로 보기: ==장치 + 소프트웨어==
> - 정의 ② 서비스로 보기: ==blue:컴퓨팅 · 통신 · 데이터 관리 · 애플리케이션 · 시설 관리 · IT 관리/표준/교육/R&D==
> - 투자 가치는 ② **service platform** 관점에서 더 정확히 보인다

> [!NOTE]
> 새 PC를 사는 것을 “PC 한 대 = 100만 원”으로만 보면 비용만 보인다. 서비스 관점에서 보면 그 PC 덕분에 직원이 정보를 기다리는 시간이 하루 한 시간 줄어든다는 **가치**가 보인다. 그래서 인프라 투자는 장비 목록보다 ==그 장비가 가능하게 하는 서비스==로 평가해야 한다.

**교수님 메모:** IT 인프라는 ==2024년 5.06조 달러(trillion) 규모의 산업==이고, 대기업에서 ==인프라 투자는 IT 지출의 25–50%==를 차지한다. Service platform 관점은 ==새 기술 도구가 가능하게 하는 실제 서비스를 분석==하는 것이다. 예: 새 PC가 직원의 ==정보 대기 시간을 하루 한 시간 줄여== 그 직원의 가치를 크게 높일 수 있다.

> [!TRAP]
> ==red:IT 인프라는 하드웨어만이 아니다.== 소프트웨어와 **서비스**(통신, 데이터 관리, 시설 관리, 교육, R&D까지)를 포함한다. “IT infrastructure consists only of hardware”는 오답.

---

## Slide 6 — Figure 5.1 Connection Between the Firm, IT Infrastructure, and Business Capabilities

### 흐름
- **Business Strategy** · **IT Strategy** · **Information Technology**가 서로 영향을 주고받음
- 셋이 → **IT Services and Infrastructure**를 결정
- IT Services and Infrastructure → **Customer Services / Supplier Services / Enterprise Services**

> **기업이 고객·공급자·직원에게 제공할 수 있는 서비스는 ==IT 인프라의 직접적인 함수(direct function)==**

> [!BOARD]
> 사업 전략 ⇄ IT 전략 ⇄ 정보기술 → ==IT 서비스·인프라== → 고객 서비스 · 공급자 서비스 · 전사 서비스

> [!NOTE]
> 그림의 왼쪽 굽은 화살표는 사업 전략, IT 전략, 정보기술이 ==서로를 바꾼다==는 뜻이다. 새 기술(예: 클라우드)이 나오면 IT 전략과 사업 전략도 달라질 수 있다. 오른쪽 끝의 서비스 품질은 결국 가운데 인프라의 힘에 달려 있다.

**슬라이드 원문:** 기업이 고객·공급자·직원에게 제공할 수 있는 서비스는 ==IT 인프라의 직접적인 함수==다. 이상적으로 인프라는 ==기업의 사업·정보시스템 전략을 지원==해야 하며, 새 정보기술은 사업·IT 전략과 고객에게 제공할 수 있는 서비스에 강한 영향을 준다.

> [!EXAMPLE]
> **Amazon (교수님 메모)**
>
> - 이 슬라이드의 요점: ==IT 인프라와 서비스가 기업 성공의 중심==이다. 기업이 고객에게 전달하는 것과 그 품질은 ==인프라의 힘에 직접 달려 있다.==
> - Amazon은 가장 인기 있는 온라인 쇼핑 사이트로 꼽히고 ==서비스 품질과 처리 속도==로 높은 평가를 받는다. 이유: ==수십만 개의 프로세서==로 이루어진 세계 최대급 컴퓨팅 인프라.

---

## Slide 7 — Evolution of IT Infrastructure

1. ==blue:Mainframe and minicomputer era: 1959 to present==
2. ==blue:Personal computer era: 1981 to present==
3. ==blue:Client/server era: 1983 to present==
4. ==blue:Enterprise computing era: 1992 to present==
5. ==blue:Cloud and mobile computing: 2000 to present==

> **다섯 시대 = ==blue:Mainframe(1959) → PC(1981) → Client/Server(1983) → Enterprise(1992) → Cloud·Mobile(2000)==**

> [!TRAP]
> 모든 시대가 ==red:“to present”==다. 새 시대가 옛 시대를 끝낸 것이 아니라 ==red:지금도 함께 쓰인다.== “메인프레임 시대는 PC 시대가 시작되며 끝났다”는 보기는 오답.

> [!TRAP]
> PC(1981)와 Client/Server(1983)는 2년 차이로 붙어 있다. ==red:Enterprise computing은 1992, Cloud·Mobile은 2000==이다. 순서 문제에서 ==red:Client/Server를 Enterprise 뒤에 놓는 실수==가 잦다.

---

## Slide 8 — Figure 5.2 Stages in IT Infrastructure Evolution

| 시대 | 그림의 모습 |
|---|---|
| **Mainframe/Minicomputer** | 서버 한 대에 여러 데스크톱(단말기)이 연결 |
| **Personal Computer** | 연결 없는 데스크톱 여러 대 |
| **Client/Server** | 노란 고리(LAN)로 서버와 데스크톱이 연결 |
| **Enterprise Computing** | 여러 네트워크가 하나의 enterprise server로 묶이고 인터넷과 연결 |
| **Cloud and Mobile** | 인터넷 구름 안의 서버들에 데스크톱·노트북·스마트폰이 접속 |

> **그림 읽기의 열쇠 = ==연결의 범위가 넓어진다==: 없음 → LAN → 전사 → 인터넷(클라우드)**

### 교재 그림 · Figure 5.2

![메인프레임 PC 클라이언트서버 엔터프라이즈 클라우드 모바일의 다섯 시대 카드와 각 시대가 시작 연도부터 현재까지 이어지는 막대](/materials/diagrams/mis-fig-5-02.svg)

*Figure 5.2 · Stages in IT Infrastructure Evolution — 다섯 시대의 전형적 구성과 공존.*

**그림 읽기:** 위 카드는 시대마다 ==처리가 어디서 일어나는가==를 보여 준다. 메인프레임은 중앙에서 모두 처리하고, PC는 각자 처리하고, 클라이언트/서버는 나눠 처리하며, 엔터프라이즈는 전사를 인터넷 표준으로 묶고, 클라우드는 처리 능력 자체를 인터넷 너머에서 빌려 온다. 아래 막대는 ==red:모든 시대가 현재까지 이어진다==는 점을 강조한다.

**슬라이드 메모:** 클라이언트/서버 그림의 ==노란 고리는 LAN(local area network)==을 나타낸다. ==LAN이 개발되기 전 PC는 독립형(stand-alone) 시스템==이었다.

---

## Slide 9 — Evolution of IT Infrastructure: Mainframe, PC, Client/Server

### General-purpose mainframe and minicomputer era: 1959 to present
- 1958: ==IBM 최초 메인프레임== 도입 (판서: IBM 360 series)
- 1965: ==더 저렴한 DEC minicomputers== 도입

### Personal computer era: 1981 to present
- 1981: ==IBM PC== 도입 (판서: ==Wintel PC==)
- 80–90년대 PC 확산 → personal software 성장

### Client/server era: 1983 to present
- ==desktop clients가 servers에 연결, processing work를 clients와 servers가 나눔==
- network는 ==two-tiered 또는 multitiered (N-tiered)==
- 여러 종류의 servers (network, application, Web)

> **Client/Server의 핵심 = ==처리 작업의 분담(split)==**

> [!CONCEPT]
> **Client/server computing** — 클라이언트(데스크톱·노트북)가 네트워크로 서버에 연결되어 ==처리 작업을 클라이언트와 서버가 나누어 맡는== 분산 컴퓨팅 모형. **Client**는 사용자 쪽 입력 장치, **server**는 데이터를 저장·처리하거나 네트워크 활동을 관리하는 컴퓨터.

> [!NOTE]
> **Wintel PC**는 Windows 운영체제와 Intel 칩을 쓰는 PC로, PC 시대의 사실상 표준이 되었다. 판서의 *effects*는 각 시대가 무엇을 바꿨는지(효과)를 함께 보라는 표시다: 메인프레임은 ==중앙 집중 처리==, PC는 ==개인 생산성 SW==, 클라이언트/서버는 ==처리 분산==.

**교수님 메모 · 메인프레임:** 오늘날 컴퓨터와 비교해 ==크기는 훨씬 크고 컴퓨팅 능력은 훨씬 작았던== 초기 메인프레임을 떠올리면 ==70년 동안== 컴퓨팅 산업이 얼마나 발전했는지 감이 온다. 그러나 현대 메인프레임(==IBM z-Series==)은 ==Fortune 1000 대기업의 네트워크와 기업 웹사이트에 쓰이는 매우 강력한 서버==다. ==메인프레임은 죽지 않았고, 여전히 IBM의 큰 수입원==이다.

---

## Slide 10 — Evolution of IT Infrastructure (cont.): Enterprise, Cloud and Mobile

### Enterprise computing era: 1992 to present
- ==disparate networks, applications를 Internet standards와 enterprise applications로 integrate==
- 판서: ==TCP/IP== → ==information이 조직 안에서, 그리고 기업과 다른 조직 사이에서 자유롭게 흐름==

### Cloud and mobile computing: 2000 to present
- ==Cloud computing: computing power와 software applications를 Internet 또는 다른 network로 공급==
- ==fastest growing form of computing==
- 판서 · Driver: ==the growing bandwidth power of the Internet==

> **Enterprise = 인터넷 표준(TCP/IP)으로 전사 통합 / Cloud = 컴퓨팅 능력 자체를 네트워크로 공급**

> [!TRAP]
> ==red:인터넷 표준(TCP/IP)으로 흩어진 네트워크를 통합한 것은 Enterprise computing 시대==다. 클라우드 시대의 특징은 통합이 아니라 ==red:컴퓨팅 능력과 소프트웨어를 인터넷으로 “공급받는” 것==이다.

**교수님 메모 · 클라우드의 예와 한계:**
- 예: ==Google Apps==(Microsoft Office에 맞서는 Google의 소프트웨어 모음, ==훨씬 싼 비용==), ==Salesforce.com의 CRM 소프트웨어==(인터넷으로 제공).
- ==대부분의 Fortune 500 기업==은 클라우드에서 돌아가는 애플리케이션을 일부 가지고 있다.
- 하지만 같은 기업 대부분이 ==전략적·핵심(critical) 시스템은 아직 클라우드에 올리지 않는다== — ==신뢰성(reliability)과 보안(security)에 대한 우려== 때문.

> [!NOTE]
> **교재 보충 · 인프라 진화를 이끈 기술 동인 (이번 18판 슬라이드에는 없음)**
>
> 이전 판 교재 5.1절은 다섯 시대를 가능하게 한 동인을 따로 정리했다. 슬라이드 판서의 “인터넷 대역폭 증가”가 그중 하나다. 시험 범위는 수업 공지를 따르되, 다른 장과 문제에서 자주 등장하므로 이름과 뜻만 알아 둔다.
>
> | 동인 | 뜻 |
> | --- | --- |
> | **Moore's law** | 마이크로프로세서의 처리 능력(트랜지스터 수)이 ==약 2년(초기 표현은 18개월)마다 두 배==가 되고, 그만큼 컴퓨팅 비용은 떨어진다 |
> | **Law of mass digital storage** | 저장되는 디지털 정보량이 해마다 대략 두 배로 늘고, 저장 비용은 빠르게 하락한다 |
> | **Metcalfe's law** | 네트워크의 가치는 ==구성원 수의 제곱에 비례==해 커진다 → 참여자가 늘수록 가치가 급증(네트워크 효과) |
> | **통신 비용 하락과 인터넷** | 통신 비용이 0에 가까워지며 네트워크 사용이 폭발적으로 증가 |
> | **Standards** | 기술 표준이 규모의 경제와 가격 하락을 만든다(예: TCP/IP, Wintel) |

---

## Slide 11 — Figure 5.3 A Multitiered (N-Tier) Client/Server Network

### 구조
- **Client** ⇢ **Internet** ⇄ **Web Server** ⇄ **Application Server** ⇄ Sales · Production · Accounting · HR ⇅ **Data**
- ==client requests for service를 different levels of servers가 처리==

> **N-tier = 웹 서버, 애플리케이션 서버처럼 ==서버의 단계(tier)를 나눠== 요청을 처리**

![클라이언트가 인터넷을 거쳐 웹 서버와 애플리케이션 서버로 요청을 보내고 판매 생산 회계 인사 기능과 데이터로 이어지는 다계층 구조](/materials/diagrams/mis-fig-5-03.svg)

*Figure 5.3 · A Multitiered (N-Tier) Client/Server Network — 요청을 여러 단계의 서버가 나눠 맡는다.*

> [!CONCEPT]
> **Web server** — 요청받은 웹 페이지를 찾아 전달하는 소프트웨어(또는 그 컴퓨터). **Application server** — 사용자와 기업의 백엔드 시스템·데이터 사이에서 ==업무 처리(애플리케이션)를 담당==하는 소프트웨어.

**그림 읽기:** 클라이언트가 주문 화면을 열면 웹 서버가 페이지를 보내고, 주문 버튼을 누르면 애플리케이션 서버가 판매·생산·회계 같은 업무 로직을 실행하며, 결과는 데이터 저장소에 기록된다. ==한 대의 거대한 컴퓨터 대신 역할별 서버로 일을 나눈 것==이 핵심이다.

**교수님 메모:** 클라이언트/서버 컴퓨팅이 가능하게 한 ==더 작고 저렴한 컴퓨터로의 처리 능력 분산==은 기업 전체에서 컴퓨팅 능력과 애플리케이션이 급증한 원인의 일부다. 값싼 서버가 나오기 전에는 ==컴퓨팅 능력을 큰 덩어리로, 매우 비싸게== 사야 했다. 클라이언트/서버에서는 ==현재 수요에 맞춰 컴퓨터를 조금씩 늘려 갈 수 있다.==

> [!PROBLEM]
> **문제.** 온라인 서점에서 고객이 책 상세 페이지를 열고(㉠), 장바구니 결제를 누르면 재고 차감과 결제 처리가 이루어지고(㉡), 주문 내역이 저장된다(㉢). ㉠–㉢을 Figure 5.3의 계층에 대응시키시오.
>
> **풀이.** ㉠ 페이지를 찾아 보내는 일 → **Web server** ㉡ 업무 로직 실행 → **Application server** ㉢ 저장 → **Data**. ==red:웹 서버는 페이지 전달, 애플리케이션 서버는 업무 처리==로 구분한다.

---

## Slides 12–13 — Stages in IT Infrastructure Evolution

- Figure 5-2를 확대해 다섯 시대를 두 장에 나눠 보여 주는 슬라이드
- Slide 12: Mainframe/Minicomputer(1959) · Personal Computer(1981) · Client/Server(1983)
- Slide 13: Enterprise Computing(1992) · Cloud and Mobile Computing(2000)

> **각 시대의 ==typical computing configurations==를 그림으로 비교**

**슬라이드 메모:**
- 클라이언트/서버 그림의 ==노란 고리 = LAN==. LAN 이전의 PC는 ==stand-alone==.
- ==Enterprise Internet 그림==은 여러 개별 네트워크가 ==하나의 전사 네트워크로 연결==된 모습이다.
- ==Cloud computing 그림==은 인터넷에 연결해 ==클라우드를 통해 애플리케이션과 서비스에 접근==하는 여러 종류의 기기를 나타낸다. 구름 안의 목록: Hardware · Software · Services.

> [!CHECK]
> **1.** IT 인프라의 두 가지 정의를 쓰고, 투자 가치를 평가할 때 어느 관점이 더 정확한지 쓰시오.
>
> **2.** IT 인프라 진화의 다섯 시대를 시작 연도와 함께 순서대로 쓰시오.
>
> **3.** 클라이언트/서버 컴퓨팅이 기업의 컴퓨팅 능력을 크게 늘린 이유를 한 문장으로 쓰시오.

---

> [!PAGEBREAK]

## PART 2 · IT 인프라의 일곱 구성요소

## Slide 14 — Components of IT Infrastructure

### Seven main components
1. ==blue:Computer hardware platforms==
2. ==blue:Operating system platforms==
3. ==blue:Enterprise software applications==
4. ==blue:Data management and storage==
5. ==blue:Networking/telecommunications platforms==
6. ==blue:Internet platforms==
7. ==blue:Consulting system integration services==

> **일곱 구성요소 = ==blue:HW · OS · 전사 SW · 데이터 · 네트워크 · 인터넷 · 컨설팅/통합==**

> [!BOARD]
> 외우는 요령: ==“하·오·엔·데·네·인·컨”== — Hardware, OS, Enterprise SW, Data, Network, Internet, Consulting

> [!TRAP]
> 일곱 번째 요소는 ==red:사람이 제공하는 서비스(consulting and system integration)==다. 구성요소가 전부 기술 제품이라고 생각하면 이 항목을 빠뜨린다.

---

## Slide 15 — Figure 5.4 IT Infrastructure Components

### IT Infrastructure Ecosystem
- 일곱 구성요소가 ==coordinated==되어야 ==coherent IT infrastructure==
- 각 구성요소 아래에 대표 기술과 suppliers

### 교재 그림 · Figure 5.4

![IT 인프라 생태계를 가운데 두고 일곱 구성요소 원이 둘러싸며 각 원에 대표 공급업체가 적힌 그림](/materials/diagrams/mis-fig-5-04.svg)

*Figure 5.4 · IT Infrastructure Components — 일곱 요소가 맞물린 생태계.*

**그림 읽기:** 같은 회사가 여러 원에 반복해서 나온다. ==IBM==은 하드웨어·데이터·전사 SW·컨설팅에, ==Oracle==은 하드웨어(Sun)·데이터·전사 SW에, ==Microsoft==는 운영체제·데이터(SQL Server)·전사 SW·네트워킹(Windows Server)·인터넷(IIS, .NET)에, ==Linux==는 운영체제와 네트워킹에, ==Cisco==는 네트워킹과 인터넷 플랫폼에 등장한다. 원들이 점선으로 이어진 것은 ==red:한 요소만 바꿔도 다른 요소와의 호환을 다시 맞춰야 한다==는 뜻이다.

**슬라이드 질문:** 각 제목 아래 예시 기업을 보라. ==어떤 회사가 반복해서 나오는가? 낯선 항목은 몇 개인가?==

> [!PROBLEM]
> **문제.** 다음을 일곱 구성요소로 분류하시오. ㉠ SAP ㉡ Apache Hadoop ㉢ Accenture ㉣ Cisco 라우터 ㉤ Android
>
> **풀이.** ㉠ **Enterprise software applications** ㉡ **Data management and storage** ㉢ **Consulting and system integration services** ㉣ **Networking/telecommunications** (그림에서는 Internet platforms에도 등장) ㉤ **Operating system platforms**.

---

## Slide 16 — Computer Hardware Platforms

### Client machines
- Desktop PCs, laptops
- Mobile computing: smartphones, tablets (==전 세계 70억 명 이상이 스마트폰 사용==)
- Desktop chips vs. mobile chips (판서: ==NVIDIA==)

### Mainframes
- IBM mainframe (==수천 대의 blade servers에 해당==)
- ==banking과 telecommunications networks의 digital workhorse==
- ==Mainframes have not disappeared==

> **하드웨어 플랫폼 = 클라이언트 기기 + 서버 + 메인프레임**

> [!NOTE]
> 메인프레임은 박물관 유물이 아니다. 은행의 계좌 처리나 통신사의 통화 기록처럼 ==엄청난 양의 거래를 쉬지 않고 정확하게== 처리해야 하는 곳에서는 지금도 핵심 장비다. 한 대가 블레이드 서버 수천 대 몫을 한다.

**교수님 메모:** 컴퓨터 하드웨어 시장의 규모 — ==2020년 전 세계 기업은 메인프레임부터 태블릿·스마트폰까지 컴퓨터 하드웨어에 약 6,880억 달러==를 지출한다.

> [!TRAP]
> ==red:“Mainframes have disappeared”는 오답.== Slide 9의 메모(IBM z-Series), Slide 16의 문구 모두 메인프레임이 여전히 쓰인다고 강조한다.

---

## Slide 17 — Operating System Platforms

### Operating system
- ==computer의 activities를 manage / control하는 system software==
- 판서: ==desktop·tablet의 68% 이상이 Microsoft Windows 계열 사용== · Chrome OS, Android, iOS(==multitouch interface==)

### Corporate servers
- Microsoft Windows Server
- Unix
- **Linux**: ==전 세계 cloud computing infrastructure의 90%가 Linux 위에서 동작==

### Client level
- Microsoft Windows
- Android, iOS, Windows 10 (mobile/multitouch)
- Google's ==Chrome OS (cloud computing)==

> **서버 OS = Windows Server · Unix · Linux / 클라이언트 OS = Windows · Android · iOS · Chrome OS**

> [!NOTE]
> **Chrome OS**는 웹 브라우저 중심의 가벼운 운영체제다. 프로그램과 파일 대부분을 기기 안이 아니라 클라우드에 두기 때문에 “cloud computing”이라는 꼬리표가 붙었다. **Multitouch**는 손가락 여러 개로 확대·스크롤하는 터치 방식이다.

*Sec 1·2 수업본*에는 서버 항목이 “Windows Server”로만 적혀 있고, 전체본은 ==Microsoft Windows Server==로 회사명을 밝혔다.

> [!TRAP]
> ==red:Linux는 클라이언트 PC보다 서버·클라우드에서 압도적==이다(클라우드 인프라의 90%). “Linux는 개인용 데스크톱 시장을 지배한다”는 보기는 오답 — 데스크톱은 Windows가 68% 이상.

---

## Slide 18 — Enterprise Software Applications

- ==2020년 기업은 enterprise applications 소프트웨어에 5,000억 달러 이상== 지출 예상
- ==Largest providers: SAP and Oracle==
- ==Middleware providers: IBM, Oracle==

> **전사 SW(ERP·CRM·SCM 등)도 IT 인프라의 일부이며 SAP·Oracle이 최대 공급자**

> [!CONCEPT]
> **Middleware** — 서로 다른 애플리케이션과 시스템을 연결해 데이터를 주고받게 하는 중간 소프트웨어. 그림 5.4에서 Enterprise Software Applications에 “including middleware”로 함께 묶였다.

**교수님 메모:** 이 애플리케이션들은 ==IT 인프라의 일부==로 간주된다. 전통적으로 ==대기업이 전사 소프트웨어의 주된 사용자==였지만, ==Microsoft 같은 회사가 중소기업(small- and medium-size businesses) 시장==으로 들어왔다.

---

## Slide 19 — Data Management and Storage

### Database software providers
- IBM (==Db2==)
- Oracle
- Microsoft (==SQL Server==)
- SAP (==HANA==)
- MySQL
- ==Apache Hadoop: very large data sets를 관리하는 open source software framework==

> **데이터 관리 = DBMS 공급자 + 빅데이터용 Hadoop**

**교수님 메모:** 세계의 ==새로운 정보량은 3년마다 두 배==로 늘고 있어, 더 효율적인 데이터 관리와 저장의 필요가 커진다.

> [!TRAP]
> ==red:Hadoop은 DBMS 회사의 상용 제품이 아니라 오픈소스 프레임워크==다. 대용량 데이터(big data)를 여러 컴퓨터에 나눠 저장·처리한다.

---

## Slide 20 — Networking/Telecommunications Platforms

### Network operating system software (NOS software)
- Windows Server, Linux, Unix

### Network equipment providers
- ==Huawei, Nokia, Ericsson, Cisco Systems==

### Telecommunication services
- ==voice / data connectivity, WAN, wireless services, Internet access==를 제공하는 통신·전화 서비스 회사
- ==AT&T, Verizon==

> **네트워킹 = NOS + 네트워크 장비 + 통신 서비스**

**교수님 메모:** ==2020년 전 세계 기업은 통신 서비스에 1조 5,000억 달러==를 지출할 것으로 예상된다.

*Sec 1·2 수업본*은 “Network operating system software”로만 적었고, 전체본에 ==NOS software==라는 약어가 추가됐다.

> [!TRAP]
> Windows Server와 Linux는 ==red:운영체제 플랫폼과 네트워킹 플랫폼 양쪽==에 등장한다. 서버 OS가 네트워크 자원을 관리하는 NOS 역할도 하기 때문이다. 분류 문제에서 “둘 중 하나만 맞다”고 단정하지 않는다.

---

## Slide 21 — Internet Platforms

### Company websites, intranets를 지원하는 hardware, software, services
- ==Web-hosting services: fee-paying clients의 websites를 유지·관리==
- Routers
- Cabling or wireless equipment

### Internet hardware server market
- ==소수 기업에 집중(concentrated)==: Dell, Cisco, HPE, IBM, Oracle

### Web and app SW development tools/suites
- Microsoft (==Visual Studio, Microsoft .NET development platform==), Oracle, 다수의 independent software developers

> **인터넷 플랫폼 = 웹사이트·인트라넷을 위한 호스팅·장비·서버·개발 도구**

> [!CONCEPT]
> **Web hosting service** — 대형 웹 서버(또는 그 일부)를 보유하고 ==요금을 내는 고객의 웹사이트를 유지·관리==해 주는 서비스.

*Sec 1·2 수업본*은 “Web-hosting services”라는 항목명만 있고, 전체본이 ==“maintain websites for fee-paying clients”==라는 정의를 덧붙였다. 서버 시장 항목의 “has become concentrated in the hands of”는 두 판 모두 같다.

---

## Slide 22 — Consulting and System Integration Services

- ==대기업도 새롭고 복잡한 인프라를 전부 지원할 자원이 없음==
- Leading consulting firms: ==Accenture, IBM Global Services, HPE, Infosys, Wipro==
- **Software integration**: ==새 인프라가 기존 legacy systems와 함께 작동하고, 새 인프라 요소끼리도 서로 맞물려 작동하도록 보장==
- **Legacy systems**: ==교체·재설계 비용이 너무 커서 계속 쓰는 오래된 시스템== (메인프레임용 TPS 등)
- Another big change: ==IT 인프라를 cloud나 outside services로 옮기는 기업 증가==

> **Consulting/Integration = 새 것과 옛 것(legacy)을, 새 것끼리를 맞물리게 하는 일**

> [!CONCEPT]
> **Legacy system** — 대체하거나 재설계하는 높은 비용을 피하려고 계속 사용하는 오래된 시스템. 대표 예는 메인프레임용으로 만든 거래처리시스템(TPS).

*Sec 1·2 수업본*은 software integration을 “새 인프라가 legacy systems와 작동하도록 보장”까지만 적었다. 전체본은 ==“새 인프라 요소끼리도 서로 작동하도록”==을 추가해 통합의 범위를 넓혔다.

> [!NOTE]
> 은행이 모바일 앱을 새로 만들어도 계좌 원장은 30년 된 메인프레임에 있을 수 있다. 앱과 원장을 연결하고(옛 것 ↔ 새 것), 새로 들인 클라우드 서버와 앱도 서로 맞추는(새 것 ↔ 새 것) 작업이 **software integration**이고, 대개 Accenture 같은 컨설팅·통합 업체가 맡는다.

> [!CHECK]
> **4.** IT 인프라의 일곱 구성요소를 쓰시오.
>
> **5.** Legacy system을 정의하고, 기업이 이를 계속 쓰는 이유를 쓰시오.
>
> **6.** 데스크톱 OS와 클라우드 인프라 OS에서 각각 우세한 운영체제와 비율을 쓰시오.

---

> [!PAGEBREAK]

## PART 3 · 모바일·양자·그린·가상화·클라우드

## Slide 23 — The Mobile Platform, Apps, and BYOD

### The mobile platform
- ==Smartphones (iPhone, Android)==: data transmission, Web surfing, e-mail, IM
- ==Netbooks==: wireless communication과 core tasks에 최적화된 작고 가벼운 subnotebooks
- Tablet computers
- Digital e-book readers and apps (==Kindle==)
- ==Wearable computing devices==: smartwatches, smart glasses, smart badges, activity trackers
- 판서: ==Apps → switching costs high==

### Consumerization of IT and BYOD
- ==IT equipment와 services를 어떻게 acquire / manage할지 기업과 IT 부서가 다시 생각하게 만듦==

> **업무 컴퓨팅이 PC에서 모바일 기기로 이동 → BYOD와 IT 소비자화가 IT 관리 방식을 바꿈**

**교수님 메모:** 비즈니스 컴퓨팅은 ==PC·데스크톱에서 모바일 기기로 점점 이동==하고, 관리자는 모바일 기기로 업무를 조율하고 직원·고객과 소통한다.

> [!NOTE]
> 판서의 “Apps → switching costs high”는, 앱을 많이 사고 데이터를 쌓아 둔 사용자는 iPhone에서 Android로(또는 그 반대로) 옮기기 어렵다는 뜻이다. 앱 생태계가 ==사용자를 플랫폼에 묶는(lock-in)== 효과로, Slide 36의 “Tie user to platform”과 같은 이야기다.

---

## Slide 24 — BYOD and Consumerization of IT

### BYOD (Bring Your Own Device)
- ==직원이 개인 mobile devices를 직장에서 사용하도록 허용==
- 판서: ==BYOD는 consumerization of IT의 한 측면==
- 판서: ==IT 부서가 hardware에 대한 control을 잃을 위험 → 취약점(vulnerabilities) 증가==

### Consumerization of IT
- ==새 정보기술이 consumer markets에서 먼저 나오고 business organizations로 퍼지는 현상==
- 기업과 IT 부서가 IT 장비·서비스의 획득·관리 방식을 다시 생각하게 만듦
- ==mobile personal devices + 소비자 시장에서 시작된 software services의 업무 사용== (Google Search, Gmail, Google Maps, Dropbox, Facebook, TikTok)

> **Consumerization = 기술의 흐름이 ==소비자 → 기업== / BYOD = 그 한 측면**

> [!CONCEPT]
> **BYOD** — 직원이 개인 소유 모바일 기기를 업무에 쓰도록 허용하는 것. **Consumerization of IT** — 새 정보기술이 ==소비자 시장에서 먼저 등장해 기업으로 확산==되는 현상.

**교수님 메모:** 예전에는 대기업 IT 부서가 직원이 사내외에서 ==어떤 기기를 쓸지 지시==했다. 이제는 ==직원이 쓰고 싶은 도구를 IT 부서에 말하고, IT가 그것을 지원하라고 요구==한다.

> [!TRAP]
> ==red:Consumerization의 방향은 소비자 → 기업==이다. “기업에서 먼저 쓰인 기술이 소비자로 퍼지는 것”은 오답. 또 BYOD는 consumerization의 ==red:“한 측면”이지 같은 말이 아니다==(Gmail·Dropbox 같은 소비자 서비스의 업무 사용도 포함).

> [!PROBLEM]
> **문제.** 한 회사가 직원들이 개인 스마트폰으로 사내 메일과 업무용 Dropbox에 접속하도록 허용했다. ① 이 정책의 이름 ② 이 현상을 포괄하는 더 큰 흐름 ③ IT 부서의 가장 큰 걱정을 쓰시오.
>
> **풀이.** ① **BYOD** ② **Consumerization of IT** ③ 기기에 대한 ==통제를 잃어 보안 취약점이 커지는 것==. 대응책은 Slide 38의 **MDM**.

---

## Slide 25 — Quantum Computing and Green Computing

### Quantum computing
- ==quantum physics를 이용해 data를 표현하고 처리==
- ==computing speed / power의 극적인 증가==
- Leading company: ==IBM, Microsoft Azure, Google (Cirq)==
- Benefits and Limitations

### Green computing (Green IT)
- ==environment에 대한 impact를 최소화==하도록 computers와 IT equipment를 ==designing, manufacturing, using, disposing==하는 practices와 technologies
- ==Reducing computing power consumption → a high priority==
- 판서: ==Green data center → 세계 에너지 사용의 1.5%==
- ==E-waste (electronic waste)==: 버려진 모든 종류의 전자 장비

> **양자 컴퓨팅 = 아직 실험 단계의 초고속 계산 / 그린 컴퓨팅 = 설계부터 폐기까지 환경 영향 최소화**

> [!CONCEPT]
> **Green computing** — 컴퓨터와 IT 장비를 ==설계·제조·사용·폐기하는 전 과정==에서 환경 영향을 최소화하는 관행과 기술. 핵심 과제는 ==전력 소비 감축==.

> [!NOTE]
> 일반 컴퓨터의 비트는 0 또는 1이지만, 양자 컴퓨터의 큐비트는 0과 1을 동시에 가진 상태를 이용해 특정 문제(암호 해독, 신약·소재 시뮬레이션, 최적화)를 훨씬 빨리 풀 수 있다. 다만 아직 실험 단계이고 오류가 많으며 극저온 같은 특수 환경이 필요하다 — 슬라이드의 *Benefits and Limitations*.

**교수님 메모:** ==양자 컴퓨팅은 아직 실험적(experimental)==이지만 컴퓨팅 속도와 능력을 혁신할 잠재력이 있다. 같은 메모에 다음 절의 예고가 붙어 있다 — ==가상화는 하나의 자원이 여러 자원처럼 작동하게 해서 남는 컴퓨팅 능력을 활용==하게 한다.

> [!TRAP]
> 그린 컴퓨팅은 ==red:“사용 단계의 절전”만이 아니다.== 정의에 ==red:설계·제조·사용·폐기(E-waste)==가 모두 들어간다.

> [!NOTE]
> **교재 보충 · 멀티코어와 전력 관리 (이번 슬라이드에는 없음)**
>
> 이전 판 교재의 하드웨어 트렌드에는 **multicore processor**가 있었다 — ==두 개 이상의 처리 코어를 한 칩에 넣어== 클럭 속도를 무리하게 올리지 않고도 성능을 높이고, ==전력 소비와 발열을 줄인다.== 그린 컴퓨팅의 “전력 소비 감축”과 연결해 기억한다.

---

## Slide 26 — Virtualization

### Virtualization
- ==computing resources를 physical configuration이나 geographic location에 제한되지 않는 방식으로 접근하도록 제공하는 방법==
- ==하나의 physical resource가 여러 logical resources처럼 작동== (예: 여러 OS instances 실행)
- 반대로 ==여러 physical resources(storage devices 등)가 하나의 logical resource처럼 보이게== 함 (예: SDS)
- ==hardware와 power 지출 감소== (판서: server virtualization)
- ==hardware administration의 centralization과 consolidation==
- 판서 · leading vendor: ==VMware==

### Software-defined storage (SDS)
- ==data storage를 관리하는 software를 physical storage hardware에서 분리==한 storage architecture
- ==비싼 storage hardware를 저렴한 commodity hardware와 cloud storage hardware로 대체== 가능

> **가상화 = 물리적 위치·구성에서 자원을 분리 → 1개를 여럿처럼, 여럿을 1개처럼**

> [!BOARD]
> - 1 physical → many logical: ==서버 가상화== (한 서버에 여러 OS)
> - many physical → 1 logical: ==SDS== (여러 디스크를 하나의 저장소로)
> - 효과: 서버 가동률 ==15–20% → 70%==, 하드웨어·전력 비용 ↓

> [!NOTE]
> 회사 서버 10대가 각자 하루 대부분을 놀고 있다면(가동률 15–20%), 가상화로 서버 3대 위에 가상 서버 10개를 올려도 업무는 그대로 돌아간다. 장비, 전기료, 냉방비, 관리 인력이 모두 줄어든다. 이 남는 능력을 여러 고객에게 나눠 파는 것이 다음 슬라이드의 클라우드다.

**교수님 메모:** 가상화는 ==서버 가동률을 15–20%에서 70%까지== 끌어올린다.

> [!TRAP]
> 가상화는 ==red:“하나 → 여럿”과 “여럿 → 하나” 두 방향==이다. “가상화는 하나의 물리 자원을 여러 논리 자원으로 나누는 것뿐”이라는 보기는 불완전. ==red:SDS는 여럿 → 하나 방향==의 예다.

---

## Slide 27 — Cloud Computing

### Cloud computing
- ==network로 얻는 on-demand (utility) computing services==
  - 판서: On-demand / utility computing = ==실제 사용 시간이나 사용 전력량에 따라 요금을 내는 구조==
- 세 서비스 모델
  - ==Infrastructure as a service (IaaS)==: users' IS를 **운영**하기 위해
  - ==Platform as a service (PaaS)==: users' own applications를 **개발**하기 위해
  - ==Software as a service (SaaS)==: 예: Google Workspace, Salesforce.com
- Cloud can be ==public or private== (판서: 교재 p.191)
- ==IT investments를 최소화==할 수 있음
- Drawbacks: ==security, reliability에 대한 우려==
- ==Hybrid cloud computing model==
- 판서: As-needed basis · ==Essential characteristics (교재 p.189)==

> **클라우드 = 필요할 때 필요한 만큼 네트워크로 빌려 쓰고 쓴 만큼 내는 컴퓨팅**

**슬라이드 원문:** 클라우드 컴퓨팅은 조직이 ==자체 하드웨어·소프트웨어를 유지하는 비용을 피하고 클라우드에 의존==하게 한다. ==가상화는 클라우드 컴퓨팅에서 결정적인 역할==을 한다.

> [!CONCEPT]
> **Cloud computing** — 컴퓨팅 처리, 저장, 소프트웨어 등의 서비스를 ==가상화된 자원 풀로 네트워크(주로 인터넷)를 통해 제공==하는 모형. 다섯 특징(교재 p.189): ==blue:on-demand self-service · ubiquitous network access · location-independent resource pooling · rapid elasticity · measured service==.

| 구분 | 뜻 | 슬라이드 키워드 |
|---|---|---|
| **IaaS** | 서버·스토리지·네트워크를 빌려 ==자기 정보시스템을 돌림== | to run users' IS |
| **PaaS** | 개발 도구·실행 환경까지 빌려 ==자기 앱을 개발== | to develop users' own applications |
| **SaaS** | 완성된 소프트웨어를 ==인터넷으로 구독해 사용== | Google Workspace, Salesforce.com |
| **Public cloud** | 외부 제공자가 소유·운영, ==여러 고객이 공유== | p.191 |
| **Private cloud** | ==한 조직 전용==, 사내 네트워크·데이터센터 | p.191 |
| **Hybrid cloud** | 핵심 업무 = 자체/private, 덜 중요한 업무·피크 = public | 대기업 선호 |

### 개념도 · 클라우드 서비스 모델과 배치 모델

![자체 보유 IaaS PaaS SaaS에서 제공자와 사용자가 관리하는 범위 매트릭스와 퍼블릭 프라이빗 하이브리드 클라우드, 다섯 특징, 가상화 기반](/materials/diagrams/mis-06-cloud-models.svg)

**그림 읽기:** 왼쪽 표에서 검은 칸이 많을수록 ==제공자가 더 많이 관리==한다. IaaS는 인프라만, PaaS는 개발 플랫폼까지, SaaS는 애플리케이션까지 빌린다. 오른쪽은 ==어디에 두고 누가 소유하는가==의 구분이다. 맨 아래 가상화가 이 모두를 떠받친다. ==red:서비스 모델(관리 범위)과 배치 모델(소유·위치)은 서로 다른 축==이라서, 예컨대 “프라이빗 클라우드에서 운영하는 PaaS”도 가능하다.

**교수님 메모 · Hybrid:** ==대기업==이 하이브리드를 가장 많이 채택한다. ==가장 핵심적인 활동에는 자체 인프라==를 쓰고, ==덜 중요한 시스템이나 사업 성수기(peak)의 추가 처리 용량에는 퍼블릭 클라우드==를 쓴다.

> [!TRAP]
> ==red:IaaS는 “운영(run)”, PaaS는 “개발(develop)”==이다. “자체 애플리케이션을 개발하려고 빌리는 클라우드 서비스”는 PaaS. 그리고 클라우드의 단점은 ==red:비용이 아니라 보안·신뢰성 우려==다(비용은 오히려 장점: IT 투자 최소화).

> [!PROBLEM]
> **문제.** 다음은 어떤 클라우드 모델인가? ㉠ 스타트업이 서버를 사지 않고 가상 서버와 저장소를 빌려 자사 주문 시스템을 운영 ㉡ 개발팀이 클라우드 제공자의 개발 도구·실행 환경에서 새 앱을 만듦 ㉢ 영업팀이 브라우저로 Salesforce.com CRM을 구독해 사용 ㉣ 은행이 계좌 원장은 자체 데이터센터에 두고, 연말정산 시즌의 웹 트래픽은 퍼블릭 클라우드로 처리
>
> **풀이.** ㉠ **IaaS** ㉡ **PaaS** ㉢ **SaaS** ㉣ **Hybrid cloud** — 핵심은 자체 인프라, 피크 용량은 퍼블릭.

---

## Slide 28 — Figure 5.5 Cloud Computing Platform

### 구성
- Cloud 안: ==Platform Services / Application Services / Infrastructure Services==
- Cloud 밖: Servers, Laptops, Desktops, iPhone, Tablet Computers
- ==hardware와 software capabilities가 network(주로 Internet)로 제공되는 a pool of virtualized resources==
- 기업과 직원은 ==anywhere, at any time, on any device==로 접근

> **클라우드 플랫폼 = 가상화된 자원 풀 + 어디서나·언제나·어떤 기기로나 접근**

### 교재 그림 · Figure 5.5

![서버가 제공하는 클라우드 안에 플랫폼 애플리케이션 인프라 세 층의 서비스가 있고 노트북 스마트폰 데스크톱 태블릿이 접속하는 그림](/materials/diagrams/mis-fig-5-05.svg)

*Figure 5.5 · Cloud Computing Platform — 세 층의 서비스를 가상화 자원 풀로 제공한다.*

**그림 읽기:** 맨 아래 Infrastructure Services(컴퓨팅 자원·네트워크·스토리지 관리)가 기반이고, 그 위에서 Application Services(콘텐츠·프로세스 관리, 전사 SW, 협업 환경)와 Platform Services(블록 스토리지, 통신 네트워크, ID 관리, 콘텐츠 서버)가 제공된다. 사용자는 어떤 기기로든 같은 자원에 접근한다.

### 판서 · Industry cloud platform
- ==특정 산업(healthcare, finance 등)의 요구에 맞춘 전문 cloud services== 모델
- 다른 이름: ==vertical cloud platform==
- ==Cloud AI Services: AWS, Microsoft Azure, GCP, Salesforce==

> [!CONCEPT]
> **Industry cloud platform (vertical cloud)** — 의료의 환자 기록 규정, 금융의 거래 규제처럼 ==특정 산업의 요구 사항에 맞춘 클라우드 서비스==를 제공하는 모델.

---

## Slide 29 — Figure 5.6 Amazon Web Services

### AWS 서비스 묶음
- Computing · Networking · Content delivery · Data storage · Database · Deployment · Management · Application services · Analytics

### 슬라이드 메모
- ==AWS = Amazon이 자사 클라우드 플랫폼 사용자에게 제공하는 web services의 모음==
- ==AWS는 미국 최대의 cloud computing services 제공자==

> **AWS = 컴퓨팅부터 분석까지 아홉 갈래 서비스를 제공하는 대표적 퍼블릭 클라우드**

> [!EXAMPLE]
> **AWS와 영상 사례의 연결**
>
> - Figure 5.6의 아홉 서비스는 IaaS(Computing, Data storage, Networking)부터 PaaS·SaaS 성격의 서비스(Deployment, Application services, Analytics)까지 걸쳐 있다.
> - **Netflix (Video Case 3)**: 자체 데이터센터 대신 ==AWS 위에 스트리밍 사업을 구축==한 대표 사례 — 시청자가 몰리는 시간에 맞춰 자원을 늘린다(rapid elasticity).
> - Slide 6의 Amazon 메모와 연결: 자사 쇼핑몰을 위해 만든 ==거대한 인프라를 서비스로 외부에 판매==한 것이 AWS다.

---

## Slide 30 — Edge Computing

### Edge computing
- ==network의 edge, 즉 data source 가까이에 있는 linked servers에서 일부 data processing을 수행==해 cloud computing systems를 최적화하는 방법
- ==Servers at the edge of the Internet==
- ==latency와 network traffic 감소==

### 슬라이드 메모
- 전국에 흩어진 consumers에게 ==efficient service==를 제공하려면 필요
- ==local computers와 web resources 사이의 distance를 줄이고, total load를 여러 regional computing facilities에 분산==
- ==AI applications에 필요한 대량 데이터의 전송·처리 지연도 줄임==

> **Edge = 처리를 데이터가 생기는 곳 가까이로 → 지연·트래픽 감소**

> [!NOTE]
> 서울 사용자의 요청을 미국 데이터센터까지 보내면 왕복 시간이 길다. 서울 근처 서버(엣지)에서 처리하면 빠르다. 자율주행차나 공장 센서처럼 ==0.1초가 중요한 곳==, 그리고 ==AI가 쓰는 대량 데이터==를 다룰 때 특히 중요하다. Slide 37의 **Edge AI**로 이어진다.

> [!TRAP]
> 엣지 컴퓨팅은 클라우드를 ==red:대체==하는 것이 아니라 ==red:클라우드 시스템을 “최적화”==하는 방법이다(일부 처리를 가장자리로 옮김).

> [!CHECK]
> **7.** BYOD와 consumerization of IT의 관계를 쓰시오.
>
> **8.** 가상화의 두 방향을 예와 함께 쓰시오.
>
> **9.** IaaS·PaaS·SaaS를 각각 한 줄로 구분하고, 하이브리드 클라우드를 대기업이 어떻게 쓰는지 쓰시오.
>
> **10.** 엣지 컴퓨팅이 줄이는 두 가지를 쓰시오.

---

> [!PAGEBREAK]

## PART 4 · 소프트웨어 플랫폼과 소프트웨어 조달

## Slide 31 — Contemporary Software Platforms: Open Source and Linux

판서: 현대 소프트웨어 플랫폼 진화의 ==blue:세 가지 주요 테마 = Open-source software · Software for the Web · Web services==

### Open-source software
- ==community of programmers가 만듦==
- ==Free and modifiable by user==
- Examples: ==Apache HTTP web server, Mozilla Firefox web browser, Apache OpenOffice== desktop productivity suite

### Linux
- ==high-performance computing에 쓰이는 open-source OS==
- ==mobile devices, local area networks, Web servers, Android OS==에 사용
- 판서: ==Linux는 LAN 관리에 중요한 역할==

### Software for the web: Java, HTML, and HTML5
- Java Virtual Machine · Web browsers · HTML and HTML5 · Ruby and Python

> **오픈소스 = 공동체가 만들고 누구나 무료로 고쳐 쓸 수 있는 SW / Linux = 그 대표 OS**

> [!CONCEPT]
> **Open-source software** — 프로그래머 공동체가 만든 ==무료이며 사용자가 수정할 수 있는== 소프트웨어. **Linux** — 대표적인 오픈소스 운영체제로, 서버·LAN·모바일(Android) 등에 쓰인다.

> [!NOTE]
> Android가 Linux 위에 만들어졌다는 점을 기억하면, “Linux는 서버 전용”이라는 오해를 피할 수 있다. Slide 17의 “클라우드 인프라의 90%”, 4장 No free lunch 원칙의 메모(오픈소스 = 창작자가 무료 배포에 동의한 경우)와 함께 묶어 둔다.

---

## Slide 32 — Software for the Web: Java, HTML, and HTML5

### Java
- ==Object-oriented programming language==
- ==Operating system, processor-independent==
- 판서: ==Java Virtual Machine==으로 어떤 컴퓨팅 기기(스마트폰 포함)에서도 실행되도록 설계

### HTML / HTML5
- ==Web page description language==
- 판서: HTML은 ==컴퓨터 종류·제조사와 상관없이 모든 브라우저가 해석·표시==할 수 있는 웹 페이지를 만드는 markup/formatting 도구
- ==HTML5 is latest evolution==
  - ==media, animation을 processor-intensive add-ons 없이 문서에 직접 삽입==
  - ==cross-platform apps, offline data storage 지원==

### Ruby and Python
- web applications용 인기 programming tools

> **Java = 어디서나 실행(JVM) / HTML = 웹 페이지 기술 / HTML5 = 플러그인 없는 멀티미디어·오프라인 저장**

> [!NOTE]
> 예전에는 웹에서 동영상을 보려면 Flash 같은 별도 플러그인(add-on)을 설치해야 했다. HTML5는 동영상·애니메이션을 문서 안에 직접 넣을 수 있어 플러그인이 필요 없고, 인터넷이 끊겨도 일부 데이터를 저장해 쓸 수 있다.

> [!TRAP]
> Java의 핵심은 ==red:운영체제·프로세서 독립성(JVM)==이다. HTML은 ==red:프로그래밍 언어가 아니라 페이지 기술(markup) 언어==다.

---

## Slide 33 — Web Services and XML

### Web services
- ==Web standards와 languages를 사용해 information을 교환하는 software components==

### XML: Extensible Markup Language
- 판서: ==Web services의 foundation technology==
- ==HTML보다 more powerful and flexible한 markup language==
- ==Tagging으로 computers가 data를 automatically process==

> **웹 서비스 = 서로 다른 시스템을 웹 표준으로 대화하게 하는 SW 부품 / 그 기반 = XML**

> [!CONCEPT]
> **Web services** — 웹 표준과 언어로 서로 정보를 주고받는 느슨하게 결합된 소프트웨어 구성요소. 운영체제나 프로그래밍 언어가 달라도 애플리케이션끼리 데이터를 교환할 수 있다. **XML** — 데이터에 의미를 나타내는 태그를 붙여 ==컴퓨터가 자동으로 처리==할 수 있게 하는 마크업 언어.

| | HTML | XML |
|---|---|---|
| 역할 | 데이터를 ==보여 주기(present)== | 데이터를 ==분류·표현·전달·저장== |
| 태그 | 정해진 태그(제목, 굵게 등) | ==사용자가 정의하는 태그==(예: 가격, 수량) |
| 결과 | 사람이 읽는 화면 | ==컴퓨터가 자동으로 조작== |

**교수님 메모 · 왜 웹 서비스인가:** 기업은 ==수년에 걸쳐 만든 수천 개의 프로그램과 시스템==의 모음이다. 일반적으로 이 시스템들은 ==서로 “대화(talk)”하지 못하고, 정보 공유에 큰 비용==이 든다. 함께 작동하게 하는 한 방법은 그 사이에 ==소프트웨어 연결 고리를 만드는 것== — 이것이 ==웹 서비스 방식==이다. 웹에서는 브라우저만 있으면 어떤 컴퓨터든 수십억 개의 웹 페이지에 접근하고, Adobe Acrobat만 있으면 어떤 컴퓨터든 PDF를 연다. 기업 안에서도 ==어떤 프로그램이든 다른 어떤 프로그램의 데이터를 가져올 수 있는 환경==을 원하며, 웹 서비스가 이를 가능하게 한다.

**교수님 메모 · XML vs HTML:** ==XML과 HTML의 차이(XML이 더 가진 기능)를 반드시 설명할 수 있어야 한다.== XML은 데이터를 ==분류·표현·전달·저장==할 수 있지만, HTML은 ==데이터를 보여 주기만== 한다. 이 기능 덕분에 컴퓨터가 XML 문서를 ==자동으로 조작==할 수 있다. 메모의 질문 “Does this remind you of autonomic computing?”은, 사람이 개입하지 않아도 시스템이 스스로 설정·복구하는 ==autonomic computing(자율 컴퓨팅)==처럼 XML도 사람 손을 거치지 않는 자동 처리를 가능하게 한다는 연결이다.

> [!TRAP]
> ==red:XML은 HTML보다 강력하고 유연하다== — “XML은 화면 표시만 하는 단순한 언어”는 오답(그건 HTML). 웹 서비스의 기반(foundation) 기술은 ==red:HTML이 아니라 XML==이다.

---

## Slide 34 — Figure 5.7 How Dollar Rent A Car Uses Web Services

### 연결 대상
- Southwest Airlines Systems
- Tour Operator's Systems
- Travel Reservation System
- Wireless WebSite
- Future Business Partners' Systems (점선 — 앞으로 연결)
- ↔ **Web Services** ↔ Server ↔ ==Legacy Reservation System== (Dollar Rent A Car Systems)

### 슬라이드 메모
- ==다른 회사의 정보시스템과 “대화”하는 표준 중간 소프트웨어 계층(standard intermediate layer)==으로 웹 서비스를 사용
- ==각 회사 시스템마다 별도의 연결을 만들 필요 없이== 이 웹 서비스 묶음으로 다른 회사 시스템에 연결

> **웹 서비스 = 하나의 표준 계층으로 여러 파트너와 연결 → ==파트너마다 따로 만들 필요 없음==**

> [!EXAMPLE]
> **Dollar Rent A Car (Figure 5.7)**
>
> - 렌터카 회사의 예약 시스템은 오래된 ==legacy reservation system==이다.
> - 항공사(Southwest), 여행사(tour operator), 여행 예약 시스템, 모바일 웹사이트가 모두 이 예약 시스템과 데이터를 주고받아야 한다.
> - 파트너마다 전용 연결을 만들면 N개의 연결이 필요하지만, ==웹 서비스 계층 하나==를 두면 모든 파트너가 같은 표준으로 접속한다. ==미래의 파트너==도 같은 방식으로 붙일 수 있다(그림의 점선).
> - 개념 연결: Slide 22의 ==software integration(새 것 ↔ legacy)==, Slide 33의 ==웹 서비스·XML==.

> [!PROBLEM]
> **문제.** 한 호텔 체인이 여행 앱 다섯 곳과 객실 정보를 공유하려 한다. 파트너마다 전용 연결을 만드는 방식과 웹 서비스 방식을 비교하시오.
>
> **풀이.** 전용 연결은 파트너가 늘 때마다 새 연결을 개발·유지해야 한다. 웹 서비스는 ==표준 중간 계층 하나==로 모든 파트너가 같은 방식(웹 표준·XML)으로 접속하므로, 새 파트너를 붙이는 비용이 작고 기존 legacy 예약 시스템도 그대로 쓸 수 있다.

---

## Slide 35 — Alternative Ways of Obtaining Software

판서: 소프트웨어의 ==blue:세 가지 외부 출처(three external sources)==

### Software outsourcing and cloud services
- ==Software packages and software services==
- **Software outsourcing**: ==custom software development 또는 maintenance를 outside firm에 계약==
  - 판서: ==Offshore software outsourcing==, 예: People.ai
- **Cloud-based software services**
  - ==Software as a service (SaaS)==, 예: Salesforce.com
  - ==Web browser로 Internet을 통해 접근==
- **Service Level Agreements (SLAs)**: ==customers와 service providers 사이의 formal contract로, provider의 specific responsibilities와 customer가 기대하는 level of service를 정의==

> **세 외부 출처 = ==blue:Software packages · Software outsourcing · Cloud-based services(SaaS)== / 계약의 핵심 = SLA**

### 개념도 · 소프트웨어를 얻는 방법

![소프트웨어 패키지 아웃소싱 클라우드 서비스의 세 외부 출처를 소유에서 임대까지 늘어놓고 SLA rent versus buy 매시업 앱을 함께 보인 그림](/materials/diagrams/mis-06-software-sourcing.svg)

**그림 읽기:** 왼쪽으로 갈수록 기업이 소프트웨어를 ==직접 소유·통제==하고, 오른쪽으로 갈수록 ==빌려 쓰며 초기 투자가 작다.== 아웃소싱과 SaaS는 남에게 의존하므로 ==서비스 수준을 계약(SLA)으로 못 박는 것==이 중요하다.

> [!CONCEPT]
> **SLA (Service Level Agreement)** — 고객과 서비스 제공자 사이의 공식 계약으로, ==제공자의 구체적 책임==과 ==고객이 기대하는 서비스 수준==(가동률, 응답 시간, 장애 대응 등)을 정한다.

> [!NOTE]
> **Offshore outsourcing**은 인건비가 낮은 다른 나라(예: 인도)의 회사에 개발·유지보수를 맡기는 것이다. 비용은 줄지만 시차, 의사소통, 품질 관리 비용이 숨어 있다. SaaS는 소프트웨어를 사지 않고 구독하므로 설치·업그레이드 부담이 제공자에게 넘어간다.

> [!TRAP]
> SLA는 ==red:제공자의 책임과 서비스 수준을 정한 “계약”==이다. “제공자가 고객에게 청구하는 요금표”나 “소프트웨어 사용권(license)”이 아니다.

---

## Slide 36 — Mashups and Apps

### Mashups
- ==두 개 이상의 online applications를 결합== — 예: ==mapping software (Google Maps) + local content==

### Apps
- ==Internet, 컴퓨터, mobile device에서 실행되는 small pieces of software==
- 흔히 ==mobile applications==를 가리킴 — iPhone, Android
- ==Tie user to platform==
- 판서: ==Apps for business users; e-commerce apps==

> **Mashup = 기존 앱을 섞어 새 서비스 / App = 작은 SW, 사용자를 플랫폼에 묶음**

> [!NOTE]
> 부동산 매물 정보에 Google 지도를 얹어 “지도 위의 매물”을 보여 주면 매시업이다. 새로 처음부터 만들지 않고 이미 있는 서비스를 조합하므로 빠르고 싸다. 앱은 사용자가 많이 깔수록 다른 플랫폼으로 옮기기 어려워진다(Slide 23의 높은 switching costs).

---

## Slide 37 — IT Infrastructure for AI

### AI and Edge Computing
- **Edge artificial intelligence (Edge AI)**: ==AI algorithms와 models를 smartphones, sensors, IoT devices 같은 local edge devices에 직접 배치==
- ==AI H/W Components: CPU, GPU, TPU, RAM, Data Storage and Management==
- ==AI S/W Components: OS, AI Frameworks and Libraries (TensorFlow, PyTorch, Keras), Version control (GitHub platform), Cloud services==

> **AI 인프라 = 전용 칩(GPU·TPU)과 대용량 데이터 저장 + AI 프레임워크·버전 관리·클라우드, 그리고 기기에서 바로 추론하는 Edge AI**

> [!NOTE]
> 스마트폰이 사진 속 얼굴을 인터넷 연결 없이 바로 인식하는 것이 Edge AI다. 데이터를 클라우드로 보내지 않으니 빠르고, 개인정보가 기기 밖으로 덜 나간다. 반대로 거대한 모델을 학습시키는 일은 GPU·TPU가 가득한 클라우드 데이터센터에서 한다. Slide 16 판서의 ==NVIDIA==가 바로 이 AI용 GPU의 대표 기업이다.

> [!TRAP]
> ==red:TPU는 Tensor Processing Unit==으로 AI 연산 전용 칩이다. ==red:GitHub는 AI 프레임워크가 아니라 버전 관리 플랫폼==, TensorFlow·PyTorch·Keras가 프레임워크·라이브러리다.

> [!CHECK]
> **11.** 현대 소프트웨어 플랫폼 진화의 세 가지 테마를 쓰시오.
>
> **12.** XML이 HTML보다 더 할 수 있는 일을 쓰고, 웹 서비스와의 관계를 쓰시오.
>
> **13.** 소프트웨어의 세 가지 외부 출처와 SLA의 정의를 쓰시오.

---

> [!PAGEBREAK]

## PART 5 · IT 인프라 관리 과제

## Slide 38 — Dealing with Platform and Infrastructure Change

- ==기업이 shrink 또는 grow할 때 IT는 flexible하고 scalable해야 함==
- **Scalability**: ==computer, product, system이 무너지지 않고(without breaking down) 더 많은 users에게 서비스하도록 확장할 수 있는 능력==

### For mobile computing and cloud computing
- 새 플랫폼을 관리할 ==new policies and procedures==
- **Mobile device management (MDM)**: ==조직에서 쓰는 여러 mobile OS에 걸쳐 배포된 mobile devices를 monitor, manage, secure하는 software==
- ==cloud computing과 SaaS를 쓰는 기업은 cloud 운영 기업·SW 배포 기업과 새로운 contractual agreements가 필요==

> **변화 관리의 핵심 = 확장성(scalability) + 모바일은 MDM + 클라우드·SaaS는 새 계약(SLA)**

> [!CONCEPT]
> **Scalability** — 컴퓨터·제품·시스템이 ==무너지지 않고 더 많은 사용자에게 서비스하도록 확장==할 수 있는 능력. **MDM** — 조직의 여러 모바일 OS에 걸친 모바일 기기를 ==감시·관리·보호==하는 소프트웨어.

**교수님 메모 · 생각해 볼 질문:** IT가 ==유연하면서도 하드웨어·소프트웨어에 장기 투자==할 수 있는 방법은? ==SaaS가 일부 문제를 해결==할 수 있다. 하지만 Google이나 Salesforce.com 같은 ==외부 공급업체와 일할 때의 함정==도 생각하라. 기업이 대비해야 할 악몽 시나리오: ==공급업체가 중요한 애플리케이션을 필요할 때 제공하지 못함==, ==고객 서비스가 형편없음==, ==투자 비용을 아끼려고 장비 업그레이드를 하지 않음== 등.

> [!NOTE]
> 메모의 악몽 시나리오를 막는 도구가 Slide 35의 **SLA**다. “가동률 99.9% 미만이면 요금 환불”, “장애 시 1시간 안에 대응” 같은 조항으로 공급업체의 책임을 계약에 적는다.

---

## Slide 39 — Management and Governance

### IT Governance
- ==Who will control and manage a firm's IT infrastructure?==
- ==How should IT department be organized?==
  - **Centralized**: ==central IT department가 decisions를 내림==
  - **Decentralized**: ==business unit IT departments가 각자 decisions를 내림==
- ==How are costs allocated between divisions, departments?==

> **IT 거버넌스 = 누가 통제하나 · 어떻게 조직하나(집중/분산) · 비용을 어떻게 나누나**

> [!CONCEPT]
> **IT governance** — 조직에서 IT를 적절히 사용하도록 ==의사결정 권한과 책임의 틀==을 정하는 전략과 정책. 누가 결정하고, 무엇을 감독하며, 비용을 어떻게 배분하는지를 정한다.

**교수님 메모 · 생각해 볼 질문:** IT 거버넌스가 부실하면 어떤 결과가 생길까? 예컨대 ==어느 부서가 스스로 IT 결정을 내릴 책임이 있는지 명확히 정하지 않으면?== 가능한 결과: ==데이터 관리 부실(data mismanagement), 의사소통 부족, 위기 대응 속도 저하.==

> [!TRAP]
> ==red:Centralized = 중앙 IT 부서가 결정, Decentralized = 사업부 IT 부서가 각자 결정==. 방향을 바꿔 놓은 보기가 자주 나온다. 거버넌스는 기술 문제가 아니라 ==red:결정 권한과 책임==의 문제다.

---

## Slide 40 — Making Wise Infrastructure Investments

- ==IT에 얼마를 쓸지는 복잡한 문제==
- ==Under-investment와 over-investment 모두 firm performance를 해칠 수 있음==
- ==Rent-versus-buy decision==
- Cloud computing
  - Security requirements
  - Impact on business processes and workflow
- Outsourcing

> **현명한 투자 = 너무 적지도 많지도 않게 + 빌릴지 살지 + 클라우드·아웃소싱의 보안·프로세스 영향 검토**

**교수님 메모 · Rent vs buy:** 어떤 회사가 소프트웨어를 ==사는 대신 빌려야(rent)== 할까? ==계절 직원(seasonal employees)이 있거나 반기(semi-annual) 업무량이 몰리는 회사==가 후보다.

> [!NOTE]
> 과소 투자하면 시스템이 느리고 경쟁사에 뒤처지며, 과다 투자하면 놀고 있는 장비와 라이선스에 돈이 묶인다. 연말에만 주문이 폭증하는 쇼핑몰은 1년 내내 최대 용량을 사 두기보다 그 시기에만 클라우드로 빌리는 편이 합리적이다.

---

## Slide 41 — Total Cost of Ownership (TCO) Model

### TCO
- ==technology resources를 소유하는 실제 총비용==: 하드웨어·소프트웨어 ==초기 구입·설치 비용== + ==업그레이드, 유지보수, 기술 지원, 교육==의 지속적 관리 비용 + 기술을 운영·수용하는 ==utility와 real estate 비용==까지
- 판서: ==TCO는 hardware의 hidden costs 일부를 수치화하는 방법==
- ==direct and indirect costs== 분석에 사용
- ==Hardware, software는 TCO의 약 20%뿐==
- 기타 비용: ==Installation, training, support, maintenance, infrastructure, downtime, space, energy==
- **TCO can be reduced**: ==cloud services 사용, hardware·software resources의 greater centralization and standardization==

> **TCO = 구입가는 빙산의 일각(약 20%) — 나머지 80%는 설치·교육·지원·유지보수·다운타임·공간·에너지**

> [!CONCEPT]
> **Total cost of ownership (TCO)** — 기술 자원을 소유하는 데 드는 ==직접·간접 비용의 총합==. 초기 하드웨어·소프트웨어 구입비뿐 아니라 설치, 교육, 지원, 유지보수, 인프라, 다운타임, 공간, 에너지 비용까지 포함한다.

> [!PROBLEM]
> **문제.** 노트북 100대를 대당 150만 원에 사려 한다(총 1억 5천만 원). TCO에서 하드웨어·소프트웨어가 약 20%라면, 이 노트북의 실제 총소유비용은 대략 얼마로 볼 수 있는가? 나머지 비용의 예를 세 가지 쓰시오.
>
> **풀이.** 구입비가 TCO의 20%이므로 1.5억 ÷ 0.2 = ==약 7억 5천만 원==. 나머지 80%: ==설치, 사용자 교육, 기술 지원, 유지보수, 다운타임, 사무 공간, 전력== 등. 줄이려면 ==클라우드 서비스, 하드웨어·소프트웨어의 중앙화·표준화==.

> [!TRAP]
> ==red:TCO에서 하드웨어·소프트웨어 구입비는 약 20%뿐==이다. “TCO의 대부분은 구입 가격”은 오답. ==red:다운타임(downtime)==처럼 눈에 안 보이는 비용도 TCO에 들어간다.

---

## Slide 42 — Competitive Forces Model for IT Infrastructure Investment

판서: IT 인프라에 ==얼마를 쓰고 어떻게 쓸지==에 답하기 위한 ==Six factors to consider==

1. ==blue:Market demand for firm's services==
2. ==blue:Firm's business strategy==
3. ==blue:Firm's IT strategy, infrastructure, and cost==
4. ==blue:Information technology assessment==
5. ==blue:Competitor firm services==
6. ==blue:Competitor firm IT infrastructure investments==

> **여섯 요인 = 내부 셋(사업 전략 · IT 전략·인프라·비용 · IT 평가) + 외부 셋(시장 수요 · 경쟁사 서비스 · 경쟁사 IT 투자)**

**교수님 메모 · 생각해 볼 질문:** 경쟁사의 서비스와 투자가 우리 회사의 IT 서비스·인프라에 얼마나 큰 영향을 미칠까? ==그 요인만으로 우리 서비스를 정하는 것이 현명할까?== 경쟁사가 IT 서비스를 개발하는 ==업계 최고의 본보기가 아닐 수 있고==, ==업계 전체가 기술적으로 뒤처져(technological laggards) 있을 수도== 있다. 그럴 때는 ==뛰어난 IT 서비스로 평판이 높은 다른 업계의 모범 사례(best practices)==를 보는 것이 낫다.

> [!TRAP]
> 3장의 Porter 경쟁세력 모형(신규 진입자, 대체재, 고객, 공급자, 기존 경쟁자)과 ==red:이름이 비슷하지만 다른 모형==이다. 5장 모형은 ==red:IT 인프라 투자 규모를 정하는 여섯 요인==이다.

---

## Slide 43 — Figure 5.8 Competitive Forces Model for IT Infrastructure

### 그림 구성
- 가운데: ==Your Firm's IT Services and Infrastructure==
- 왼쪽 ==Internal Factors==: 2 Business Strategy · 3 IT Strategy, Infrastructure, and Cost · 4 Information Technology
- 오른쪽 ==External Market Factors==: 1 Market Demand (Customer · Supplier · Enterprise Services) · 5 Competitor Firms' IT Services · 6 Competitor Firms' IT Infrastructure Investments

> **왼쪽 = 내부 요인, 오른쪽 = 외부 시장 요인 → 모두 가운데 IT 서비스·인프라를 결정**

### 교재 그림 · Figure 5.8

![가운데 기업의 IT 서비스와 인프라를 왼쪽 내부 요인 세 개와 오른쪽 외부 시장 요인 세 개가 둘러싸고 화살표로 영향을 주는 그림](/materials/diagrams/mis-fig-5-08.svg)

*Figure 5.8 · Competitive Forces Model for IT Infrastructure — 여섯 요인이 IT 인프라 투자를 결정한다.*

**그림 읽기:** 왼쪽 셋은 ==회사 안에서 정하는 것==(사업 전략, 현재 IT 전략·인프라·비용, 쓸 만한 신기술 평가)이고, 오른쪽 셋은 ==시장이 정하는 것==(고객·공급자·전사 서비스 수요, 경쟁사가 제공하는 IT 서비스, 경쟁사의 인프라 투자)이다. ==red:“Information technology(4)”는 외부처럼 보이지만 그림에서는 내부 요인==이다 — 회사가 어떤 기술을 쓸 수 있는지 스스로 평가하는 일이기 때문이다.

**교수님 메모:** 이 그림은 ==어떤 기업이 왜 제대로 된 강력한 IT 인프라를 만들지 못하는지==를 이해하는 틀로도 쓸 수 있다.

> [!PROBLEM]
> **문제.** 다음 요인을 내부·외부로 분류하시오. ㉠ 경쟁 은행이 모바일 앱에 대규모 투자를 발표 ㉡ 우리 은행의 “디지털 우선” 사업 전략 ㉢ 고객들이 24시간 모바일 대출 서비스를 요구 ㉣ 생성형 AI 상담 기술이 쓸 만한지 우리 IT팀이 평가
>
> **풀이.** ㉠ **외부** — 경쟁사 IT 인프라 투자(6) ㉡ **내부** — 사업 전략(2) ㉢ **외부** — 시장 수요(1) ㉣ **내부** — 정보기술 평가(4).

> [!CHECK]
> **14.** Scalability를 정의하고, 모바일과 클라우드 환경에서 새로 필요한 관리 도구·조치를 각각 쓰시오.
>
> **15.** IT 거버넌스가 답해야 할 세 질문을 쓰시오.
>
> **16.** TCO에서 하드웨어·소프트웨어의 비중과 TCO를 줄이는 방법을 쓰시오.
>
> **17.** 경쟁세력 모형의 여섯 요인을 내부·외부로 나누어 쓰시오.

---

> [!PAGEBREAK]

## 사례 총정리 · 5장에 나오는 사례·기업·수치

시험은 “이 사례는 어떤 기술·모델인가?” 또는 “X의 예를 들라”로 나온다. ==blue:사례 → 기술 → 개념==을 한 줄로 말할 수 있으면 된다.

| 슬라이드 | 사례·기업 | 내용 | 핵심 수치·결과 | 연결 개념 |
| --- | --- | --- | --- | --- |
| 3 | **Rockwell Automation** | 석유·가스 현장 장비에 IoT 적용 | — | IoT, 네트워킹 |
| 3 | **ESPN.com** | 스포츠 방송을 클라우드로 | — | 클라우드, 확장성 |
| 3, 29 | **Netflix** | 클라우드(AWS) 위에 사업 구축 | — | 퍼블릭 클라우드 |
| 4 | **Grab** | 동남아 슈퍼앱, scalable services·GrabMaps | — | 클라우드로 효과성↑·비용 통제 |
| 5 | IT 인프라 산업 | 시장 규모, 대기업 IT 지출 비중 | 2024년 5.06조 달러, 25–50% | IT 인프라 정의 |
| 5 | 새 PC | 하루 한 시간 대기 시간 절약 | — | Service platform 관점 |
| 6 | **Amazon** | 수십만 프로세서의 인프라 → 서비스 품질 | — | Figure 5.1 |
| 9 | **IBM**(1958 메인프레임, 360, z-Series), **DEC**(1965 미니), IBM PC(1981), Wintel | 시대별 대표 제품 | — | 인프라 진화 |
| 10 | **Google Apps, Salesforce.com** | 인터넷으로 제공되는 SW | Fortune 500 대부분 일부 사용 | 클라우드 시대 |
| 16 | IBM mainframe, NVIDIA | 블레이드 서버 수천 대 몫 | HW 지출 6,880억 달러(2020), 스마트폰 70억 명+ | 하드웨어 플랫폼 |
| 17 | Windows, Linux, Chrome OS | 데스크톱·클라우드 OS | Windows 68%+, Linux 클라우드 90% | OS 플랫폼 |
| 18 | **SAP, Oracle**, IBM | 전사 SW·미들웨어 | 5,000억 달러+(2020) | 전사 SW |
| 19 | Db2, SQL Server, HANA, MySQL, **Hadoop** | DBMS·빅데이터 | 정보량 3년마다 2배 | 데이터 관리 |
| 20 | Huawei, Nokia, Ericsson, Cisco, AT&T, Verizon | 네트워크 장비·통신 서비스 | 통신 지출 1.5조 달러(2020) | 네트워킹 |
| 21 | Dell, Cisco, HPE, IBM, Oracle, Visual Studio·.NET | 인터넷 서버·개발 도구 | 서버 시장 집중 | 인터넷 플랫폼 |
| 22 | **Accenture, IBM Global Services, HPE, Infosys, Wipro** | 컨설팅·통합 | — | Software integration, legacy |
| 23–24 | iPhone, Android, Kindle, Gmail, Dropbox, TikTok | 모바일·소비자 서비스의 업무 사용 | — | BYOD, consumerization |
| 25 | **IBM, Microsoft Azure, Google (Cirq)** | 양자 컴퓨팅 선도 | 데이터센터 = 세계 에너지 1.5% | 양자·그린 컴퓨팅 |
| 26 | **VMware** | 가상화 선도 업체 | 서버 가동률 15–20% → 70% | 가상화, SDS |
| 27 | Google Workspace, Salesforce.com | SaaS 예 | — | 클라우드 서비스 모델 |
| 28 | AWS, Azure, GCP, Salesforce | Cloud AI services | — | Industry cloud(vertical) |
| 29 | **AWS** | 9개 서비스 묶음, 미국 최대 클라우드 | — | 퍼블릭 클라우드 |
| 31 | Apache HTTP, Firefox, OpenOffice, **Linux**, Android | 오픈소스 예 | — | 오픈소스 |
| 34 | **Dollar Rent A Car** | 웹 서비스로 항공사·여행사와 legacy 예약 시스템 연결 | 파트너별 개별 연결 불필요 | 웹 서비스, XML |
| 35 | People.ai, Salesforce.com | offshore 아웃소싱, SaaS | — | 소프트웨어 조달, SLA |
| 36 | Google Maps + 지역 콘텐츠 | 매시업 | — | Mashups, apps |
| 37 | TensorFlow, PyTorch, Keras, GitHub | AI SW 구성요소 | — | AI 인프라, Edge AI |
| 38 | Google, Salesforce.com | 외부 공급업체의 악몽 시나리오 | — | Scalability, MDM, 계약 |

> [!TRAP]
> ==red:Enterprise 시대(1992)는 TCP/IP로 통합, Cloud 시대(2000)는 인터넷으로 공급.== ==red:IaaS는 운영, PaaS는 개발, SaaS는 사용.== ==red:TCO에서 HW·SW는 약 20%.== ==red:Linux는 클라우드의 90%, Windows는 데스크톱의 68%+.==

> [!FLASHCARD]
> Q: 5장 사례 — Grab 오프닝 케이스의 해법과 교훈은?
> A: 해법은 scalable services와 GrabMaps. 클라우드 컴퓨팅으로 서비스 효과성을 높이고 비용을 통제하는 사례다.

> [!FLASHCARD]
> Q: 5장 사례 — Figure 5.1과 관련해 교수님이 든 Amazon 예의 요점은?
> A: Amazon의 높은 서비스 품질과 속도는 수십만 개의 프로세서로 이루어진 세계 최대급 컴퓨팅 인프라 덕분이다. 기업이 제공하는 서비스는 IT 인프라의 직접적인 함수다.

> [!FLASHCARD]
> Q: 5장 사례 — 클라우드 시대 메모의 예와, 대기업이 핵심 시스템을 클라우드에 올리지 않는 이유는?
> A: 예는 Google Apps(Office 경쟁, 훨씬 싼 비용)와 Salesforce.com CRM. 대부분의 Fortune 500 기업이 일부 앱을 클라우드에서 쓰지만, 신뢰성과 보안 우려 때문에 전략적·핵심 시스템은 아직 올리지 않는다.

> [!FLASHCARD]
> Q: 5장 사례 — 메인프레임은 사라졌는가?
> A: 아니다. IBM mainframe은 블레이드 서버 수천 대에 해당하며 은행·통신 네트워크의 디지털 일꾼이다. 현대 IBM z-Series는 Fortune 1000 기업의 네트워크와 웹사이트에 쓰이고 여전히 IBM의 큰 수입원이다.

> [!FLASHCARD]
> Q: 5장 사례 — Dollar Rent A Car는 웹 서비스를 어떻게 썼나?
> A: 표준 중간 소프트웨어 계층으로 웹 서비스를 두어 Southwest Airlines, 여행사, 여행 예약 시스템, 무선 웹사이트를 자사 legacy 예약 시스템과 연결했다. 파트너마다 별도 연결을 만들 필요가 없다.

> [!FLASHCARD]
> Q: 5장 사례 — 가상화의 대표 업체와 효과 수치는?
> A: VMware. 서버 가동률을 15–20%에서 70%로 높이고 하드웨어·전력 지출을 줄인다.

> [!FLASHCARD]
> Q: 5장 사례 — 교수님이 든 rent-versus-buy에서 rent가 맞는 회사는?
> A: 계절 직원이 있거나 반기마다 업무량이 몰리는 회사.

> [!FLASHCARD]
> Q: 5장 사례 — 경쟁사의 IT 투자만 보고 우리 IT 서비스를 정하면 안 되는 이유는?
> A: 경쟁사가 업계 최고의 본보기가 아닐 수 있고 업계 전체가 기술적으로 뒤처져 있을 수 있다. 다른 업계의 모범 사례도 봐야 한다.

> [!PAGEBREAK]

## 단원 마무리

### 한 쪽 핵심 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 정의 | 장치·SW의 집합 + 전사 서비스 플랫폼(투자 가치는 서비스 관점) |
| 진화 | Mainframe 1959 → PC 1981 → Client/Server 1983 → Enterprise 1992 → Cloud·Mobile 2000, 모두 to present |
| 구성요소 | HW · OS · 전사 SW · 데이터 · 네트워크 · 인터넷 · 컨설팅/통합 |
| 하드웨어 트렌드 | 모바일·BYOD(consumerization), 양자(실험 단계), 그린(설계→폐기), 가상화(1↔多, SDS) |
| 클라우드 | IaaS 운영 · PaaS 개발 · SaaS 사용 / public · private · hybrid / 단점 = 보안·신뢰성 / Edge = 지연·트래픽↓ |
| 소프트웨어 | 오픈소스·Linux, Java(JVM)·HTML5, 웹 서비스(기반 = XML), 패키지·아웃소싱·SaaS, SLA, 매시업·앱 |
| 관리 | Scalability, MDM, IT 거버넌스(집중/분산), rent vs buy, TCO(HW·SW 약 20%), 경쟁세력 여섯 요인 |

### 단답형 연습 · Short Answer

Write the term or a short answer in English. 답은 맨 끝 **정답과 해설**의 단답형 정답에서 확인한다.

1. In which era of IT infrastructure, beginning in 1992, were disparate networks integrated using Internet standards?  
   Answer: ______________________________
2. What is the term for an older system that continues to be used to avoid the high cost of replacing or redesigning it?  
   Answer: ______________________________
3. What is the term for new information technology that first emerges in the consumer market and spreads to business organizations?  
   Answer: ______________________________
4. What technology lets a single physical resource act as multiple logical resources?  
   Answer: ______________________________
5. Which cloud service model provides tools for customers to develop their own applications?  
   Answer: ______________________________
6. What cloud model uses a firm's own infrastructure for core activities and public cloud for less-critical systems or peak capacity?  
   Answer: ______________________________
7. What markup language is the foundation technology for Web services?  
   Answer: ______________________________
8. What formal contract defines the specific responsibilities of a service provider and the level of service expected by the customer?  
   Answer: ______________________________
9. What is the ability of a system to expand to serve a larger number of users without breaking down called?  
   Answer: ______________________________
10. What model analyzes the actual total cost, direct and indirect, of owning technology resources?  
   Answer: ______________________________

> [!PAGEBREAK]

## 개념 회상과 오개념 점검

> [!QUIZ]
> 같은 새 PC 구입을 “장치의 집합” 관점과 “service platform” 관점으로 각각 평가하면 무엇이 달라지는가?

> [!ANSWER]
> 장치 관점은 구입 가격과 사양만 본다. Service platform 관점은 그 PC가 가능하게 하는 서비스(예: 정보 대기 시간이 하루 한 시간 줄어 직원의 가치가 커짐)를 보므로 투자의 비즈니스 가치를 더 정확히 평가한다.

> [!QUIZ]
> 서비스 모델(IaaS·PaaS·SaaS)과 배치 모델(public·private·hybrid)이 서로 다른 축인 이유를 설명하시오.

> [!ANSWER]
> 서비스 모델은 제공자가 어디까지 관리하는가(인프라 / 플랫폼 / 애플리케이션)의 구분이고, 배치 모델은 자원을 누가 소유하고 어디에 두는가의 구분이다. 그래서 프라이빗 클라우드의 PaaS, 퍼블릭 클라우드의 SaaS처럼 두 축을 조합할 수 있다.

> [!QUIZ]
> 경쟁세력 모형에서 “Information technology”가 외부가 아니라 내부 요인으로 분류되는 이유는?

> [!ANSWER]
> 기술 자체는 시장에 있지만, 그 기술이 우리 회사에 쓸 만한지 평가하고 선택하는 일(IT assessment)은 회사 안에서 이루어지기 때문이다. 외부 시장 요인은 시장 수요, 경쟁사의 IT 서비스, 경쟁사의 IT 인프라 투자다.

> [!QUIZ]
> Which era of IT infrastructure evolution is characterized by integrating disparate networks and applications into an enterprise-wide infrastructure using Internet standards such as TCP/IP?
>
> **A.** Personal computer era
>
> **B.** Client/server era
>
> **C.** Enterprise computing era
>
> **D.** Cloud and mobile computing era

> [!ANSWER]
> C. Enterprise computing era (1992 to present)
>
> **해설**: A는 독립형 PC의 확산, B는 클라이언트와 서버의 처리 분담(LAN), D는 컴퓨팅 능력과 소프트웨어를 인터넷으로 공급받는 시대다. TCP/IP로 전사를 통합해 정보가 조직 안팎으로 자유롭게 흐르게 한 것은 엔터프라이즈 컴퓨팅 시대다.

> [!QUIZ]
> Which of the following is NOT one of the seven major components of IT infrastructure?
>
> **A.** Operating system platforms
>
> **B.** Consulting and system integration services
>
> **C.** Data management and storage
>
> **D.** Business process reengineering platforms

> [!ANSWER]
> D. Business process reengineering platforms
>
> **해설**: 일곱 구성요소는 하드웨어, 운영체제, 전사 SW, 데이터 관리·저장, 네트워킹·통신, 인터넷 플랫폼, 컨설팅·시스템 통합 서비스다. B처럼 사람이 제공하는 서비스도 구성요소에 포함된다는 점이 함정이다.

> [!QUIZ]
> A firm rents a cloud provider's development tools and runtime environment so its programmers can build their own new applications. Which cloud service model is this?
>
> **A.** Infrastructure as a service (IaaS)
>
> **B.** Platform as a service (PaaS)
>
> **C.** Software as a service (SaaS)
>
> **D.** Private cloud

> [!ANSWER]
> B. Platform as a service (PaaS)
>
> **해설**: IaaS는 자기 정보시스템을 “운영”하려고 서버·스토리지·네트워크를 빌리는 것, SaaS는 완성된 소프트웨어를 구독해 쓰는 것이다. D는 서비스 모델이 아니라 소유·위치에 따른 배치 모델이다.

> [!QUIZ]
> Which statement best describes the hybrid cloud computing model as large firms use it?
>
> **A.** All systems are moved to a single public cloud provider to minimize IT investment.
>
> **B.** The firm's own infrastructure handles the most essential core activities, while public cloud handles less-critical systems or extra capacity at peak periods.
>
> **C.** Several firms in the same industry share one private data center.
>
> **D.** Applications run only on employees' personal devices.

> [!ANSWER]
> B. 핵심 활동은 자체 인프라, 덜 중요한 시스템과 피크 용량은 퍼블릭 클라우드
>
> **해설**: A는 퍼블릭 클라우드 전면 이전, C는 산업 공동 시설(교재 모델 아님), D는 BYOD와 혼동한 보기다. 교수님 메모: 하이브리드는 대기업이 가장 많이 채택한다.

> [!QUIZ]
> Software-defined storage (SDS) is an example of which aspect of virtualization?
>
> **A.** A single physical resource acting as multiple logical resources
>
> **B.** Multiple physical resources appearing as a single logical resource
>
> **C.** Moving all storage to quantum computers
>
> **D.** Replacing the operating system with a web browser

> [!ANSWER]
> B. 여러 물리 자원 → 하나의 논리 자원
>
> **해설**: A는 서버 가상화(한 서버에서 여러 OS 실행)의 방향이다. SDS는 저장소 관리 소프트웨어를 물리 하드웨어에서 분리해 여러 저장 장치를 하나처럼 쓰게 하고, 비싼 저장 장비를 저렴한 범용 하드웨어·클라우드 저장소로 대체하게 한다.

> [!QUIZ]
> "New information technology that first emerges in the consumer market and then spreads into business organizations" defines which concept?
>
> **A.** BYOD
>
> **B.** Consumerization of IT
>
> **C.** Green computing
>
> **D.** Legacy system

> [!ANSWER]
> B. Consumerization of IT
>
> **해설**: A의 BYOD는 개인 기기를 업무에 쓰게 하는 것으로, consumerization의 한 측면일 뿐이다. Gmail·Dropbox 같은 소비자 서비스의 업무 사용까지 포괄하는 더 큰 흐름이 consumerization이다.

> [!QUIZ]
> Which statement about green computing and quantum computing is correct?
>
> **A.** Green computing covers only reducing the power used by computers already in operation.
>
> **B.** Quantum computing is a mature, widely deployed replacement for all business servers.
>
> **C.** Green computing covers designing, manufacturing, using, and disposing of IT equipment to minimize environmental impact.
>
> **D.** Quantum computing uses classical binary bits more efficiently than ordinary chips.

> [!ANSWER]
> C. 그린 컴퓨팅은 설계·제조·사용·폐기 전 과정
>
> **해설**: A는 사용 단계만 본 불완전한 정의다(E-waste 처리도 포함). B는 틀렸다 — 교수님 메모대로 양자 컴퓨팅은 아직 실험 단계다. D도 틀렸다 — 양자 컴퓨팅은 양자 물리학으로 데이터를 표현·처리한다.

> [!QUIZ]
> About what share of the world's cloud computing infrastructure runs on Linux, according to the slide?
>
> **A.** About 20%
>
> **B.** About 50%
>
> **C.** About 68%
>
> **D.** About 90%

> [!ANSWER]
> D. About 90%
>
> **해설**: 68%는 Windows 계열을 쓰는 데스크톱·태블릿의 비율이고, 20%는 TCO에서 하드웨어·소프트웨어의 비중이다. 숫자를 서로 바꿔 놓는 보기에 주의한다.

> [!QUIZ]
> Why is XML, rather than HTML, the foundation technology for Web services?
>
> **A.** XML can only display data in a browser, which makes it simpler.
>
> **B.** XML tags describe the meaning of data, so computers can classify, communicate, store, and process data automatically.
>
> **C.** XML is a programming language that replaces Java.
>
> **D.** XML requires processor-intensive add-ons that HTML lacks.

> [!ANSWER]
> B. XML 태그는 데이터의 의미를 나타내 컴퓨터가 자동 처리할 수 있다
>
> **해설**: A는 HTML의 특징(보여 주기만 함)이다. C는 틀렸다 — XML은 프로그래밍 언어가 아니라 마크업 언어다. D는 HTML5 설명(add-on 없이 미디어 삽입)을 거꾸로 쓴 보기다.

> [!QUIZ]
> A company outsources its CRM to a SaaS vendor and wants a contract that specifies the vendor's responsibilities and the level of service (such as uptime) it can expect. What is this contract called?
>
> **A.** Service level agreement (SLA)
>
> **B.** Total cost of ownership (TCO)
>
> **C.** Mobile device management (MDM)
>
> **D.** Software-defined storage (SDS)

> [!ANSWER]
> A. Service level agreement (SLA)
>
> **해설**: B는 비용 분석 모델, C는 모바일 기기 관리 소프트웨어, D는 저장소 가상화 구조다. SLA는 Slide 38 메모의 “공급업체 악몽 시나리오”를 막는 계약 도구다.

> [!QUIZ]
> According to the TCO model, hardware and software account for roughly what share of total cost of ownership?
>
> **A.** About 20%
>
> **B.** About 50%
>
> **C.** About 70%
>
> **D.** About 90%

> [!ANSWER]
> A. About 20%
>
> **해설**: 나머지 약 80%는 설치, 교육, 지원, 유지보수, 인프라, 다운타임, 공간, 에너지 같은 숨은 비용이다. TCO는 클라우드 서비스와 하드웨어·소프트웨어의 중앙화·표준화로 줄일 수 있다.

> [!QUIZ]
> Under a centralized model of IT governance, who makes IT decisions?
>
> **A.** Each business unit's own IT department
>
> **B.** The central IT department
>
> **C.** The cloud provider under the SLA
>
> **D.** Individual employees under BYOD

> [!ANSWER]
> B. The central IT department
>
> **해설**: A는 분산(decentralized) 모델이다. 거버넌스는 누가 통제·관리하는지, IT 부서를 어떻게 조직하는지, 비용을 부서 간에 어떻게 배분하는지를 정한다. 교수님 메모: 거버넌스가 부실하면 데이터 관리 부실, 의사소통 부족, 위기 대응 지연이 생긴다.

> [!QUIZ]
> In the competitive forces model for IT infrastructure investment, which of the following is an EXTERNAL market factor?
>
> **A.** The firm's business strategy
>
> **B.** The firm's IT strategy, infrastructure, and cost
>
> **C.** Information technology assessment
>
> **D.** Competitor firms' IT infrastructure investments

> [!ANSWER]
> D. Competitor firms' IT infrastructure investments
>
> **해설**: A, B, C는 그림 왼쪽의 내부 요인이다. 외부 시장 요인은 시장 수요, 경쟁사의 IT 서비스, 경쟁사의 IT 인프라 투자 세 가지다.

> [!QUIZ]
> Which best describes the purpose of edge computing?
>
> **A.** Replacing cloud computing entirely with personal computers
>
> **B.** Performing some data processing on linked servers near the source of the data to reduce latency and network traffic
>
> **C.** Moving all processing to a single central mainframe
>
> **D.** Storing data only on optical disks at the network edge

> [!ANSWER]
> B. 데이터 근처의 서버에서 일부 처리 → 지연·트래픽 감소
>
> **해설**: 엣지 컴퓨팅은 클라우드를 대체하지 않고 최적화한다(A 오답). 부하를 여러 지역 시설에 나누므로 C의 중앙 집중과 반대다. AI 애플리케이션의 대량 데이터 전송 지연도 줄인다.

> [!QUIZ]
> (교재 보충) Which law states that the value of a network grows roughly with the square of the number of its members?
>
> **A.** Moore's law
>
> **B.** Metcalfe's law
>
> **C.** Law of mass digital storage
>
> **D.** Law of diminishing returns

> [!ANSWER]
> B. Metcalfe's law
>
> **해설**: A의 Moore's law는 마이크로프로세서 처리 능력이 약 2년(초기 표현 18개월)마다 두 배가 되고 컴퓨팅 비용이 하락한다는 법칙이다. C는 디지털 저장량 증가와 저장 비용 하락이다. 이 법칙들은 이번 18판 슬라이드에는 없는 교재 보충 내용이다.

> [!PAGEBREAK]

## 정답과 해설

먼저 스스로 답을 쓴 뒤 확인한다.

### 확인 문제 정답

1. ① **물리적 장치와 소프트웨어의 집합** ② **경영진이 예산을 쓰는 전사 서비스의 집합**(컴퓨팅, 통신, 데이터 관리, 애플리케이션, 시설 관리, IT 관리·표준·교육·R&D). 투자 가치는 **service platform 관점**이 더 정확하다.
2. **Mainframe·minicomputer(1959) → Personal computer(1981) → Client/server(1983) → Enterprise computing(1992) → Cloud and mobile(2000)**, 모두 현재까지 이어진다.
3. 처리 능력을 **작고 값싼 컴퓨터에 분산**해, 큰 덩어리로 비싸게 사지 않고 **수요에 맞춰 조금씩 늘릴 수** 있었기 때문이다.
4. **Computer hardware platforms, operating system platforms, enterprise software applications, data management and storage, networking/telecommunications platforms, Internet platforms, consulting and system integration services.**
5. Legacy system은 **교체·재설계 비용이 너무 커서 계속 쓰는 오래된 시스템**(예: 메인프레임용 TPS)이다. 이유는 바꾸는 비용과 위험이 크기 때문이다.
6. 데스크톱·태블릿은 **Microsoft Windows 계열이 68% 이상**, 클라우드 인프라는 **Linux가 90%**.
7. BYOD는 **consumerization of IT의 한 측면**이다. Consumerization은 소비자 시장의 기술이 기업으로 퍼지는 더 큰 흐름으로, 개인 기기 사용(BYOD)과 Gmail·Dropbox 같은 소비자 서비스의 업무 사용을 모두 포함한다.
8. ① **하나의 물리 자원 → 여러 논리 자원**: 서버 가상화(한 서버에서 여러 OS) ② **여러 물리 자원 → 하나의 논리 자원**: SDS(여러 저장 장치를 하나처럼).
9. **IaaS**는 자기 IS를 운영하려고 인프라를 빌림, **PaaS**는 자기 앱을 개발하려고 플랫폼을 빌림, **SaaS**는 완성된 SW를 인터넷으로 사용. 대기업은 **핵심 활동은 자체 인프라, 덜 중요한 시스템·피크 용량은 퍼블릭 클라우드**로 처리한다.
10. 지연 시간(**latency**)과 네트워크 트래픽(**network traffic**).
11. **Open-source software, software for the Web(Java·HTML·HTML5), Web services.**
12. XML은 데이터를 **분류·표현·전달·저장**하고 컴퓨터가 **자동으로 처리**하게 한다(HTML은 보여 주기만). XML은 웹 서비스의 기반 기술(**foundation technology**)이다.
13. **Software packages, software outsourcing, cloud-based software services(SaaS).** SLA는 고객과 제공자 사이의 공식 계약으로, **제공자의 구체적 책임과 고객이 기대하는 서비스 수준**을 정한다.
14. Scalability는 시스템이 **무너지지 않고 더 많은 사용자에게 서비스하도록 확장**하는 능력이다. 모바일에는 **MDM**, 클라우드·SaaS에는 운영 기업과의 새 계약(**SLA**)과 새 정책·절차가 필요하다.
15. ① **누가 IT 인프라를 통제·관리하는가** ② **IT 부서를 어떻게 조직하는가(집중/분산)** ③ **비용을 부서 간에 어떻게 배분하는가.**
16. 하드웨어·소프트웨어는 **약 20%**. **클라우드 서비스 사용**과 **하드웨어·소프트웨어의 중앙화·표준화**로 줄인다.
17. 내부: **사업 전략, IT 전략·인프라·비용, 정보기술 평가.** 외부: **시장 수요, 경쟁사의 IT 서비스, 경쟁사의 IT 인프라 투자.**

### 단답형 정답

1. **Enterprise computing era** — 인터넷 표준(TCP/IP)으로 전사를 통합한 엔터프라이즈 컴퓨팅 시대
2. **Legacy system** — 교체 비용이 커서 계속 쓰는 오래된 레거시 시스템
3. **Consumerization of IT** — 소비자 시장에서 기업으로 퍼지는 IT 소비자화
4. **Virtualization** — 하나의 물리 자원을 여러 논리 자원처럼 쓰게 하는 가상화
5. **Platform as a service (PaaS)** — 자체 앱 개발용 플랫폼 서비스
6. **Hybrid cloud computing model** — 핵심은 자체, 나머지·피크는 퍼블릭인 하이브리드 클라우드
7. **XML (Extensible Markup Language)** — 웹 서비스의 기반 기술
8. **Service level agreement (SLA)** — 제공자의 책임과 서비스 수준을 정한 서비스 수준 협약
9. **Scalability** — 무너지지 않고 더 많은 사용자로 확장하는 확장성
10. **Total cost of ownership (TCO)** — 직접·간접 비용을 모두 더한 총소유비용
