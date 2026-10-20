---
title: "2장 B · 협업에서 조직 지식과 IS 기능까지"
description: "협업과 소셜 비즈니스에서 지식관리 가치사슬·KMS·IT 거버넌스까지, 교재 그림과 개념·판서·해설·오답 주의·예제·확인 문제로 정리한 Chapter 2 후반부 교재형 필기."
order: 3
published: true
duration: 125
tags: [정시개, MIS, 2장, 협업, 지식관리, IT 거버넌스]
objectives:
  - 협업 성과를 만드는 문화·프로세스·도구의 조건을 설명한다.
  - 지식관리 가치사슬과 주요 KMS 유형을 구분한다.
  - IS 부서·IT 거버넌스·책임 있는 AI의 역할을 연결한다.
---

## 학습 경로

[이전: 2장 A](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-02) · [다음: 3장](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-04)

**범위:** Chapter 2 슬라이드 30–73 · Collaboration → Knowledge → IS Function

[Chapter 2 원본 PDF](/materials/mis-exam-slides/ch02_17ed.pdf) · [Chapter 2 확장 PDF](/materials/mis-exam-slides/ch02_17ed_final.pdf)

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 지식관리 가치사슬 4단계 | ★★★ | 순서, 막힌 단계 찾기 |
| Tacit vs Explicit knowledge | ★★★ | 사례 분류 |
| KMS 세 유형(전사 KMS · KWS · 지능형 기법) | ★★★ | 사례에 맞는 유형 고르기 |
| 시간·공간 협업 매트릭스 | ★★ | 도구를 칸에 넣기 |
| 협업의 요건, social business | ★★ | 기술만으로 안 되는 이유 |
| IS 부서 · systems analyst · IT governance | ★★ | 역할과 정의 |

**책 읽는 법:** 슬라이드 제목 아래의 짧은 목록과 요약 한 줄이 강의 **핵심 필기**다. **개념**은 정의, **판서**는 한눈 정리, **해설**은 쉬운 설명, **오답 주의**는 시험 함정, **예제**는 풀이 연습, **확인 문제**의 답은 단원 끝 *정답과 해설*에 있다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!PAGEBREAK]

## PART 1 · 협업과 소셜 비즈니스

## Slide 30 — What Is Collaboration?

- collaboration은
  - short-term / long-term
  - informal / formal(team)

### Importance가 커진 이유
- changing nature of work
- professional **interaction jobs** 증가
- firm organization 변화
- firm scope 변화
- innovation 강조
- work culture 변화

> **현대 업무는 개인 작업보다 interaction과 collaboration 비중이 커짐**

> [!NOTE]
> 협업은 공통 목표를 위해 둘 이상이 함께 일하는 것이다(신메뉴 출시처럼 short-term도, 매장 운영 개선처럼 long-term도 있다). 중요해진 이유는 ==다른 사람과 정보를 주고받아야 끝나는 일(interaction jobs)==이 늘었기 때문이다.

**예시 박스 읽는 법:** **예시** 박스는 ==슬라이드의 실제 사례·수치와 교수님 메모==를 교재로 보충한 것이다. ==기업 → 시스템 → 결과 → 개념==을 함께 외운다. 장 끝 **사례 총정리**에 한 표로 모았다.

---

## Slide 31 — What Is Social Business?

- internal / external **social networking platforms** 활용
- employees / customers / suppliers engagement
- interaction 심화 + information sharing 가속
- customer와의 conversation 강화
- **information transparency** 필요

### Expected Benefits
- operational efficiency
- innovation
- faster decision making

> **Social Business = social platform을 business interaction과 information sharing에 활용**

> [!CONCEPT]
> **Social business** — 사내외 소셜 네트워킹 플랫폼으로 직원·고객·공급업체와의 상호작용을 깊게 하고 정보 공유를 빠르게 하는 것. ==red:정보 투명성==이 전제다.


> [!NOTE]
> 고객 리뷰에 직원이 바로 답하고 그 의견을 개발팀이 같은 피드에서 보는 식이다. ==red:위에서 정보를 통제하는 문화에서는 플랫폼을 깔아도 대화가 일어나지 않는다.==

> [!EXAMPLE]
> **슬라이드 원문과 사례**
>
> - Information transparency의 원문 정의: ==경영진이나 다른 사람의 개입 없이(without intervention from executives or others) 정보 교환을 이끄는 것==.
> - 고객과의 =="conversations(대화)"==로 유대를 강화한다.
> - 대표 사례: ==Sharp의 Yammer==(2장 A Slide 3), 영상 ==Cemex: Becoming a Social Business==(소셜 비즈니스의 best practice).
---

## Slide 32 — Collaboration Is Expanding to Human-Agent Teams

- collaboration 범위가 **people + AI agents**로 확대
- effective teams는 AI 사용법 / mistakes / quality standards를 공유
- agent workflow를 문서화
  - human handoff
  - review criteria
  - authority

### Management
- people
- data
- applications
- AI agents
를 함께 coordinate

> **Human-Agent Team의 핵심 = ==blue:workflow + handoff + review + authority를 명확히 정의==**

> [!CONCEPT]
> **Human-agent team** — 사람과 AI agent가 함께 일하는 팀. AI가 어디서 사람에게 넘기는지(**handoff**), 무엇으로 검토하는지(**review**), 무엇을 할 수 있는지(**authority**)를 문서로 정한다.


> [!EXAMPLE]
> **Microsoft 2026 연구 (슬라이드 수치)**
>
> | 항목 | 내용 |
> | --- | --- |
> | 조사 대상 | ==10개국 AI 사용 근로자 2만 명== + Microsoft 365 사용 데이터(telemetry) |
> | Shared learning | AI를 잘 쓰는 ==Frontier Professionals==는 AI 활용법과 실수를 팀과 더 자주 공유: ==61% vs 36%== |
> | Quality | AI 지원 작업의 품질 기준을 더 자주 논의: ==54% vs 29%== |
> | Repeatability | 효과적인 팀은 ==agent workflow, 사람에게 넘기는 지점(human handoffs), 검토 기준(review criteria), 프로세스 변경 권한(authority)==을 문서화 |
> | Management | 협업 = ==사람, 데이터, 애플리케이션, AI agent==를 함께 조정하는 일 |

> [!NOTE]
> 사람 팀원과 역할을 나누듯 AI의 handoff·review·authority를 문서로 정한다. ==red:이게 없으면 AI의 실수를 아무도 발견하지 못하거나 책임이 불분명해진다.==
---

## Slide 33 — Business Benefits of Collaboration and Teamwork

| Benefit | 효과 |
|---|---|
| **Productivity** | knowledge sharing / faster problem solving |
| **Quality** | quality issue 신속 해결 |
| **Innovation** | product / service ideas 증가 |
| **Customer Service** | complaints 빠르게 처리 |
| **Financial Performance** | 위 개선이 재무성과로 연결 |

> **Collaboration은 productivity / quality / innovation / service를 통해 firm performance에 영향**

> [!NOTE]
> 표의 다섯 효과는 순서대로 이어진다. 지식을 나누면 문제를 빨리 풀고(productivity), 품질 문제를 빨리 고치고(quality), 아이디어가 늘고(innovation), 고객 불만에 빨리 대응한다(customer service). 이 네 가지가 쌓인 결과가 **financial performance**다. ==red:그래서 답안에서 협업이 바로 매출을 올린다고 쓰기보다 중간 효과를 거쳐 설명하는 것이 좋다.==

**슬라이드·교수님 메모:** 협업 기술 투자는 특히 ==영업·마케팅, 연구개발(R&D)==에서 큰 보상을 낸다. 협업의 효과에 대한 연구는 ==일화적(anecdotal)==이지만, 업계와 학계는 협업을 성공의 필수 동력으로 본다: ==“더 많이 협업하는 기업이 더 많이 번다.”==

---

## Slide 34 — Figure 2.7 Requirements for Collaboration

### Collaboration Capability
- ==blue:open culture==
- ==blue:decentralized structure==
- ==blue:breadth of collaboration==

### Collaboration Technology
- implementation / operations 지원
- strategic planning 지원

↓

**Collaboration Quality**

↓

**Firm Performance**

> **좋은 collaboration = 적절한 organizational culture/structure + technology**

협업 도구는 대화를 전달할 통로를 제공하지만, 누구의 의견을 받아들이고 어떤 정보를 공유할지는 팀의 일하는 방식이 결정한다. ==따라서 협업 성과가 낮을 때는 도구의 기능 부족과 의견을 말하거나 활용하기 어려운 조직 조건을 나누어 살펴봐야 한다.==

![협업 역량과 협업 기술이 협업의 질로 모이고 협업의 질이 기업 성과로 이어지는 그림](/materials/diagrams/mis-fig-2-07.svg)

*Figure 2.7 · The Requirements for Collaboration — 역량과 기술이 함께 있어야 협업의 질이 높아진다.*

**교수님 메모:** 두 핵심 재료는 ==협업 역량(collaboration capability)==과 ==협업 기술(technology or means)==이며, 둘의 질이 높을수록 기업 성과가 좋다. ==저품질 협업의 예: 사업 문제를 풀려고 팀을 꾸렸지만 내부 정치(internal politics) 때문에 함께 일하지 못하는 경우.==

---

## Slide 35 — Digital Infrastructure Has an Environmental Footprint

### Business Issue
- AI / cloud → data-center computing, electricity, cooling, water, hardware 수요 증가

### Evaluation Point
- energy
- carbon
- water
- hardware
- supply-chain impacts

### Efficiency
- cleaner energy + more efficient hardware 중요

> ==Digital investment는 service value뿐 아니라 environmental cost도 함께 평가==

> [!NOTE]
> 클라우드와 AI는 보이지 않지만 데이터센터가 전기·냉각수·하드웨어를 대량으로 쓴다. 그래서 IS 투자는 ==blue:에너지·탄소·물·하드웨어·공급망== 비용까지 함께 평가한다.

> [!EXAMPLE]
> **Google 2024 (슬라이드 수치)**
>
> - 에너지 수요가 늘었는데도 ==데이터센터 에너지 배출량 12% 감소==.
> - 2024년 ==8 GW(기가와트) 이상의 청정에너지 발전 계약== 체결.
> - ==Ironwood TPU==는 2018년의 첫 Cloud TPU보다 ==전력 효율이 약 30배==.
> - MIS 교훈: 관리자는 ==서비스 가치를 에너지·탄소·물·하드웨어·공급망 영향과 함께== 평가해야 한다.

---

## Slide 36 — Building a Collaborative Culture and Business Processes

### 과거: Command and Control
- teamwork / lower-level participation 가치 낮음

### Collaborative Business Culture
- senior managers가 teams 활용
- policies / products / designs / processes / systems를 team 기반으로 운영
- manager의 역할 = **build teams**

### Key
- ==red:collaboration technology만 도입해도 collaboration이 자동으로 생기지는 않음==
- culture / reward / process가 필요

> ==Collaboration은 technology보다 culture와 management design이 선행되어야 함==

> [!NOTE]
> 예전 조직(command and control)은 위에서 결정하고 아래는 실행만 했기 때문에, 직원이 의견을 내는 것 자체가 기대되지 않았다. 협업 문화에서는 관리자의 역할이 지시하는 사람에서 ==팀을 만드는 사람==으로 바뀐다. Sharp 사례처럼 도구보다 먼저 보상·평가·절차를 바꿔야 협업이 실제로 일어난다.

> [!TRAP]
> ==red:“협업 도구를 도입하면 협업이 자동으로 늘어난다”는 보기는 오답이다.== ==blue:문화·보상·프로세스==가 먼저 바뀌어야 한다.

**교수님 메모:** 협업은 저절로 생기지 않고 ==가능하게 만들고 길러야(enabled and nurtured)== 한다. 협업 기술이 있어도 협업이 ==업무의 일부로 여겨지고 보상받지 않으면== 협업은 일어나지 않는다. “command and control”은 ==과거의 대기업== 방식이다. 생각해 볼 질문: 협업이 적을수록 이득인 업무가 있을까? 협업의 단점은?

---

## Slide 37 — Tools and Technologies for Collaboration

- E-mail / IM
- Wikis
- Virtual worlds
- Virtual meeting systems / telepresence
- Cloud collaboration
  - Google Drive / Docs
- Microsoft Teams / SharePoint
- Slack / Zoom
- Google Workspace
- Notion
- embedded **Generative AI assistants**
- human direction 아래 task 수행하는 **AI agents**

> ==blue:Collaboration tools는 messaging → shared workspace → cloud → AI-assisted workflow로 확장==

> [!NOTE]
> 발전 방향: 메시지(e-mail, IM) → 공동 문서(wiki, Google Docs) → 클라우드 협업(Teams, Slack, Notion) → AI가 요약·초안·일부 작업 수행.

> [!EXAMPLE]
> **슬라이드의 도구 예시와 교재 사례**
>
> - **Virtual worlds:** ==Second Life== (온라인 3D 가상 환경, 초기 협업 도구의 예).
> - **Virtual meeting systems:** ==telepresence==.
> - **Cloud collaboration services:** ==Google Drive, Google Docs== 등.
> - **현재 플랫폼:** ==Microsoft Teams, Microsoft SharePoint, Slack, Zoom, Google Workspace, Notion==.
> - **Spotlight on Technology Case Study: ==AI Accelerates Drug Discovery and Development==** (사람–AI 협업 사례)
>   - 신약 하나를 허가받기까지 ==10–15년 이상==, 실험실에서 수천 개의 화합물을 시험해야 하나를 찾는다.
>   - AI는 ==후보 화합물의 특성을 예측==해 가망 없는 화합물 작업을 막고, ==수천 장의 세포 현미경 이미지 분석 같은 반복 작업==을 줄이며, ==완전히 새로운 화합물 아이디어를 생성==한다.
>   - 교재 표의 다른 사람–AI 협업 예: Johnson & Johnson과 Mayo Clinic 등의 의료 영상 진단 AI, ==CarMax==가 GPT-3.5로 고객 리뷰 5,000건을 요약해 사람 검토 후 웹사이트에 게시, ==JP Morgan Chase== 트레이더가 25년간의 연준 연설을 분석하는 모델 사용.

---

## Slide 38 — Enterprise Social Networking Software

### Capabilities
- Profiles
- Content sharing
- Feeds / notifications
- Groups / team workspaces
- Tagging / social bookmarking
- Permissions / privacy

### Modern Platform 평가 요소
- identity
- information governance
- data location
- integration
- accessibility
- search quality
- AI-generated answer quality

> **Enterprise social platform = communication + content + workflow + governance + AI**

> [!NOTE]
> 기업용 소셜 네트워크는 사내 SNS다. 개인 SNS와 다른 점은 ==red:권한·보존·데이터 위치 같은 governance==와 사내 시스템과의 **integration**이 평가 기준에 들어간다는 것이다.

**교수님 메모(원본 PDF):** ==Facebook에서 보는 거의 모든 기능이 기업용 소셜 네트워킹 커뮤니티에 다시 만들어져 있다.== 단, Facebook에는 팀 작업공간(team workspaces)이 없다. 대표 제품 예: ==Yammer==(Sharp 사례).

---

## Slide 39 — Evaluating Collaboration Tools

### Two Dimensions

| Dimension | 구분 |
|---|---|
| **Space** | ==blue:remote / co-located== |
| **Time** | ==blue:synchronous / asynchronous== |

### Six Steps

| Step | 평가 내용 |
|---|---|
| 1 | collaboration challenges identify |
| 2 | available solutions identify |
| 3 | cost / benefit analyze |
| 4 | security risks evaluate |
| 5 | users에게 implementation / training issue 확인 |
| 6 | vendors evaluate |

> ==blue:Tool 선택은 기능보다 work context + cost + security + users + vendor를 함께 봐야 함==

> [!NOTE]
> 협업 도구를 고를 때는 먼저 팀이 ==blue:같은 시간에 일하는지(synchronous), 같은 장소에 있는지(co-located)==부터 확인한다. 그다음 여섯 단계로 ==blue:문제 정의 → 대안 탐색 → 비용·편익 → 보안 → 사용자 교육 → 공급업체== 순으로 따진다. 기능이 많은 도구가 아니라 ==우리 팀의 일하는 방식에 맞는 도구==가 좋은 도구다.

> [!PROBLEM]
> **문제.** 서울과 부산 매장 직원들이 교대 시간이 달라 공유 캘린더와 인수인계 위키로 일정을 맞춘다. 시간·공간 매트릭스의 어느 칸인가?
>
> **풀이.** ① 근무 시간이 다르다 → **different time** ② 장소가 다르다 → **different place** ③ **Communication + coordination** 칸.

---

## Slide 40 — Current Criteria for Collaboration Platforms

| Criteria | 확인할 내용 |
|---|---|
| **Work Fit** | synchronous / asynchronous / remote / co-located / cross-company |
| **Integration** | identity / calendar / documents / enterprise apps / workflow / APIs |
| **Governance** | ownership / permissions / retention / e-discovery / data location / external sharing |
| **AI Quality** | grounding / citations / access-aware retrieval / monitoring / human review |
| **Adoption** | active use / search success / cycle time / quality / employee experience / outcomes |

> ==blue:Collaboration platform 평가는 Work Fit + Integration + Governance + AI Quality + Adoption==

> [!NOTE]
> 다섯 기준은 “잘 맞는가 → 잘 연결되는가 → 잘 통제되는가 → AI 답변을 믿을 수 있는가 → 실제로 쓰이는가”라는 질문으로 바꿔 기억하면 쉽다. 특히 마지막 **Adoption**은 ==red:도입 여부가 아니라 직원들이 실제로 쓰고 일이 빨라졌는지를 본다.== 깔아 놓고 아무도 안 쓰면 실패다.

---

## Slide 41 — Figure 2.8 Time/Space Collaboration Matrix

| | Same Time | Different Time |
|---|---|---|
| **Same Place** | ==red:Face-to-face interactions== | ==red:Continuous task== |
| **Different Place** | ==red:Remote interactions== | ==red:Communication + coordination== |

### Examples
- Same place + same time: meeting / decision room
- Different place + same time: video conference / IM
- Different place + different time: e-mail / blogs / group calendars / workflow / version control

> **Collaboration technology는 Time × Space 기준으로 분류 가능**

![같은 시간 다른 시간과 같은 장소 다른 장소의 두 축으로 나눈 네 칸에 협업 도구 예시가 들어간 매트릭스](/materials/diagrams/mis-fig-2-08.svg)

*Figure 2.8 · The Time/Space Collaboration and Social Tool Matrix — 시간과 장소로 협업 도구를 나눈다.*

> [!NOTE]
> 두 질문만 하면 칸이 정해진다. “같은 시간에 하는가?”와 “같은 장소에서 하는가?” 매장 회의는 같은 시간·같은 장소, 화상회의는 같은 시간·다른 장소, ==red:교대 근무자끼리 남기는 인수인계 노트는 다른 시간·같은 장소(continuous task)==, 이메일과 공유 캘린더는 다른 시간·다른 장소다.

> [!CHECK]
> **1.** 협업에 필요한 두 가지 요건(Figure 2.7)을 쓰시오.
>
> **2.** 화상회의는 시간·공간 매트릭스의 어느 칸에 속하는가?
>
> **3.** Social business가 효과를 내려면 어떤 조직 조건이 필요한가?

---

> [!PAGEBREAK]

## PART 2 · 지식관리

## Slide 42 — Role of KMS in Business

- KMS는 software investment의 빠르게 성장하는 영역
- knowledge / information workers 비중 큼
- firm value의 상당 부분이 ==intangible assets==와 연결
  - knowledge
  - brands
  - reputation
  - unique business processes
- well-executed knowledge project → 높은 ROI 가능

> ==현대 기업의 핵심 자산 중 상당 부분은 physical asset이 아니라 knowledge==

> [!NOTE]
> 많은 기업 가치가 건물·기계가 아니라 지식·브랜드·평판 같은 **무형 자산**에서 나오므로 KMS 투자가 빠르게 늘고 있다.

> [!EXAMPLE]
> **정보 경제 수치 (Slide 42) — 숫자를 정확히 외운다**
>
> | 항목 | 수치 |
> | --- | --- |
> | 미국 노동력 중 지식·정보 근로자 | ==37%== |
> | 미국 GDP 중 지식·정보 부문 | ==55%== |
> | 뉴욕증권거래소(NYSE) 상장 주식 가치 | ==절반 이상이 지식·노하우 같은 무형 자산에서 나옴== |
>
> 잘 실행된 지식 기반 프로젝트는 ==extraordinary ROI(투자수익률)==를 낼 수 있다.

---

## Slide 43 — Important Dimensions of Knowledge (1/5)

### Core Concepts
- Data / Knowledge / Wisdom
- **Tacit Knowledge / Explicit Knowledge**

### Four Dimensions
- Knowledge is a ==blue:firm asset==
- Knowledge has ==blue:different forms==
- Knowledge has a ==blue:location==
- Knowledge is ==blue:situational==

> **Knowledge는 단순 정보가 아니라 조직 안에서 형태·위치·상황을 갖는 asset**

> [!NOTE]
> 네 차원은 다음 슬라이드들의 목차다. 지식은 회사의 **자산**이고(44), 문서와 경험이라는 **다른 형태**로 있으며(44), 특정 사람과 장소에 **붙어 있고**(45), 언제 어떻게 쓸지 아는 **상황성**이 있다(45). 이 네 가지 때문에 지식은 데이터처럼 복사해서 옮기기 어렵다.

**교수님 메모 · “지식은 기업 자산이다”의 예:** ==가전제품 회사라면, 가장 효율적이고 가장 싼 에어컨을 만드는 방법을 아는 것.== 각 차원마다 예를 들 수 있게 준비한다 — 예: 사회적 기반을 가진 지식의 예는? ==sticky(옮기기 어려운) 지식의 예와 무엇이 sticky한지==?

---

## Slide 44 — Important Dimensions of Knowledge (2/5)

### Knowledge Is a Firm Asset
- intangible
- data / information → knowledge 변환에 organizational resources 필요
- 공유될수록 ==network effects== 발생

### Explicit vs Tacit Knowledge

| | Explicit Knowledge | Tacit Knowledge |
|---|---|---|
| 형태 | ==red:documented== | ==red:사람의 mind / experience에 존재== |
| 예 | procedure / manual / report | know-how / craft / skill |
| 전달 | ==red:비교적 쉬움== | ==red:문서화·이전이 어려움== |

> **Explicit = 문서화 가능 / Tacit = 경험과 사람에게 내재된 know-how**

> [!CONCEPT]
> **Explicit knowledge** — ==문서화된 지식(매뉴얼·보고서)==. **Tacit knowledge** — ==사람의 경험 속에 있어 문서로 옮기기 어려운 지식(노하우·감각)==.

> [!NOTE]
> 레시피 매뉴얼은 explicit, 숙련 바리스타의 우유 거품 감각은 tacit knowledge다. 지식은 공유될수록 가치가 커지는 **network effect**가 있다.

**슬라이드 원문 · 지식의 형태:** ==know-how, craft, skill== / ==how to follow procedure(절차를 따르는 법)== / ==knowing why things happen(인과관계, causality)==.

> [!TRAP]
> ==red:지식을 문서로 많이 남겼다고 tacit knowledge가 다 옮겨진 것은 아니다.== **언제·어떻게 적용하는지**는 사람과 상황에 붙어 있다.

---

## Slide 45 — Important Dimensions of Knowledge (3/5)

### Knowledge Has a Location
- cognitive event
- individual + social
- ==blue:sticky==: 이동하기 어려움
- ==blue:situated==: firm culture에 얽혀 있음
- ==blue:contextual==: 특정 context에서만 작동 가능

### Knowledge Is Situational
- **Conditional**: 언제 procedure를 적용할지 앎
- **Contextual**: 어떤 상황에서 tool을 쓸지 앎

> ==Knowledge는 context에서 분리하면 그대로 이전되지 않는 경우가 많음==

매뉴얼은 절차를 기록할 수 있어도 숙련자가 **언제 그 절차를 적용하거나 예외로 처리하는지**까지 모두 담기는 어렵다. 그래서 tacit knowledge를 다룰 때는 문서를 늘리는 것뿐 아니라 경험을 가진 사람과 연결하고 적용 상황을 함께 전달하는 방법이 필요하다.

---

## Slide 46 — Important Dimensions of Knowledge (4/5)

- information → knowledge 변환에는
  - patterns
  - rules
  - context
  발견이 필요

### Wisdom
- knowledge를 실제 문제에 적용한 collective / individual experience
- ==where / when / how to apply knowledge==

### Knowledge-Based Core Competencies
- ==competitors가 쉽게 duplicate하지 못하는 know-how==
- profit / competitive advantage의 원천
- 슬라이드 예: ==독특한 주문생산(build-to-order) 생산 시스템을 갖는 것==

> **Information + context/pattern → Knowledge → 경험을 통한 적용 = Wisdom**

### 개념도 · Data에서 Wisdom까지의 위계

![Data가 information으로 정리되고 patterns, rules, context가 더해져 knowledge가 되며 경험과 적용 판단을 거쳐 wisdom으로 올라가는 네 단계 위계](/materials/diagrams/mis-03-knowledge-hierarchy.svg)

이 위계에서 위 단계는 아래 단계를 없애는 것이 아니라 **해석과 판단을 추가**한다. ==red:따라서 data를 많이 모았다는 사실만으로 knowledge나 wisdom이 자동으로 생기지는 않는다.==

---

## Slide 47 — Important Dimensions of Knowledge (5/5)

### Organizational Learning
1. data collection / measurement / trial and error / feedback로 experience 획득
2. experience에 맞게 behavior 조정
3. 결과
   - new business processes
   - changed management decision patterns

> **Organizational Learning = 경험을 수집하고 행동과 process를 실제로 바꾸는 과정**

> [!CONCEPT]
> **Organizational learning** — 데이터 수집·시행착오·피드백으로 경험을 얻고, 그 결과 ==새 비즈니스 프로세스와 바뀐 의사결정 패턴==을 만들어 내는 과정.


> [!NOTE]
> 비 오는 날 폐기가 많다는 데이터를 보고 날씨에 따라 준비량을 줄이는 규칙을 만들었다면 조직이 학습한 것이다. 결과로 **새 프로세스**나 **바뀐 의사결정 패턴**이 나와야 학습이다.

> [!EXAMPLE]
> **교수님 메모 (Slide 47)**
>
> - 경쟁우위를 주는 기업 지식의 예: ==Apple, eBay, Burger King== 등이 가진 지식.
> - ==skilled labor force(숙련 노동력)==의 가치는 직원들이 일을 효율적·효과적으로 하는 지식에서 나온다. ==직원 머릿속의 지식은 대체하기 어렵다.==
> - Organizational learning에서 ==지식이 새로운 행동(의사결정, 신제품·서비스, 새 프로세스)의 동력==이 된다. 조직이 환경을 ==감지하고 대응하는(sensing and responding)== 과정으로도 볼 수 있다. 배우기를 거부한 조직의 예도 많다.

---

## Slide 48 — Knowledge Management Value Chain (1/3)

### Knowledge Management
- knowledge를 ==blue:create / store / transfer / apply==하기 위한 business processes

### Value Chain

| Stage | 의미 |
|---|---|
| **1. Acquisition** | knowledge를 획득·생성 |
| **2. Storage** | knowledge를 저장·관리 |
| **3. Dissemination** | 필요한 사람에게 전달 |
| **4. Application** | decision / process에 실제 적용 |

- 각 stage가 raw data / information에 value 추가

> **KM Value Chain = ==blue:Acquire → Store → Disseminate → Apply==**

> [!BOARD]
> - **Acquire** → **Store** → **Disseminate** → **Apply**
> - 각 단계가 가치를 더한다. **Apply**==red:가 빠지면 ROI가 없다==


> [!NOTE]
> 가치사슬이라는 이름은 각 단계가 지식에 가치를 더한다는 뜻이다. 회의록을 모으고(Acquisition), 찾기 쉽게 정리해 두고(Storage), 필요한 직원에게 보내고(Dissemination), 실제 결정에 쓰는(Application) 순서다. ==red:어느 한 단계라도 끊기면 앞 단계의 노력이 성과로 이어지지 않는다.==
---

## Slide 49 — Generative AI in the KM Value Chain

| Stage | GenAI 활용 | 관리 포인트 |
|---|---|---|
| **Acquire** | transcription / extraction / classification | meetings / documents를 searchable knowledge로 변환 |
| **Store** | knowledge base 관리 | metadata / ownership / permissions / retention / provenance |
| **Disseminate** | enterprise search / **RAG** | approved source와 question 연결 |
| **Apply** | decision / action 지원 | human review / authority / monitoring / escalation |

> **GenAI도 KM Value Chain 안에서 Acquire → Store → Retrieve → Apply 구조로 관리**

> [!NOTE]
> ==red:GenAI는 가치사슬의 각 단계를 빠르게 만들지만 단계를 없애지는 않는다.== 회의 녹음을 글로 바꾸는 것(Acquire), 문서에 메타데이터와 권한을 붙이는 것(Store), RAG로 승인된 문서만 찾아 답하는 것(Disseminate), 사람이 검토하고 결정하는 것(Apply)이 각각 관리 대상이다. 특히 ==red:Apply 단계의 사람 검토==가 빠지면 틀린 답이 그대로 업무에 쓰인다.

---

## Slide 50 — Figure 11.1 Knowledge Management Value Chain

### Data & Information Acquisition
- collection / storing / disseminating

### Information System Activities
- **Acquire**: business analytics / data mining / ML / expert networks
- **Store**: content management / knowledge databases / expert systems
- **Disseminate**: portals / search / collaboration tools
- **Apply**: DSS / enterprise apps / robotics

### Management & Organizational Activities
- knowledge culture
- communities of practice
- organizational routines / culture
- training / collaboration
- new process / products / services / markets

### Feedback
- application 결과가 다시 data / knowledge acquisition으로 연결

> ==KM은 IT activity만이 아니라 management / organization activity가 함께 있어야 완성==

### 교재 그림 · Figure 11.1

![지식 비즈니스 가치사슬의 획득 저장 전파 적용 단계마다 정보시스템 활동과 경영 조직 활동이 놓이고 피드백이 돌아오는 그림](/materials/diagrams/mis-fig-11-01.svg)

*Figure 11.1 · The Knowledge Management Value Chain — 각 단계에 IS 활동과 경영·조직 활동이 함께 있다.*

**슬라이드 메모:** 오늘날의 지식관리는 ==정보시스템 활동 + 그것을 가능하게 하는 수많은 경영·조직 활동==으로 이루어진다. 그림 옆 판서 ==“80:20”==은 지식관리에서 기술보다 ==경영·조직 쪽 비중이 훨씬 크다==는 뜻으로 읽는다(정확한 의미는 수업 필기로 확인). 그림의 두 추가 요건: 지식의 기반이 되는 ==초기 데이터·정보 획득==, 적용 단계에서 새 기회로 이어지는 ==피드백==.

### 개념도 · 지식이 조직 성과가 되는 과정

![지식을 획득하고 저장하고 전달해 업무에 적용한 뒤 결과를 다시 조직 학습으로 연결하는 지식관리 가치사슬](/materials/diagrams/mis-03-knowledge-value-chain.svg)

**그림 읽기:** ==red:지식을 많이 저장하는 것만으로는 가치가 생기지 않는다.== 필요한 사람에게 전달된 지식이 의사결정과 프로세스에 ==적용(Application)==되어야 새 업무·제품·시장이 만들어진다. 그 결과를 다시 획득 단계로 돌려 기준과 행동을 바꾸는 것이 ==조직 학습(Organizational Learning)==이다.

---

## Slide 51 — Knowledge Management Value Chain (2/3)

### Knowledge Acquisition
- tacit / explicit knowledge document화
- reports / presentations / best practices 저장
- e-mails 같은 unstructured documents 저장
- expert networks 구축
- new knowledge creation
- TPS / external sources data tracking

### Knowledge Storage
- databases
- document management systems

### Management Role
- planned storage system 지원
- corporate-wide schema / indexing 설계
- employees가 문서를 update / store하도록 incentive 제공

> ==Acquire는 지식을 모으는 단계 / Store는 구조화·관리 가능한 형태로 보존하는 단계==

> [!NOTE]
> 지식을 모으는 방법은 문서화만이 아니다. 전문가 네트워크를 만들어 “누가 아는지”를 모으는 것도 획득이다. 저장 단계에서는 관리자의 역할이 크다. 회사 전체가 같은 분류 체계(**schema · indexing**)를 써야 나중에 찾을 수 있고, 직원이 문서를 올리고 고치도록 **incentive**를 줘야 저장소가 살아 있다.

**슬라이드 메모:** ==Schema: 지식의 추상적 구조(abstract structure of knowledge).== 경영진의 세 역할: ① ==계획된 지식 저장 시스템 개발 지원== ② ==전사적 문서 색인 스키마 개발 장려== ③ ==문서를 제대로 갱신·저장하는 데 시간을 쓴 직원에게 보상==.

---

## Slide 52 — Knowledge Management Value Chain (3/3)

### Knowledge Dissemination
- portals / wikis
- e-mail / IM
- search engines
- collaboration tools

### Information Overload 대응
- training
- informal networks
- shared management experience

### Knowledge Application
- ==ROI를 내려면 knowledge가 실제 decision making에 들어가야 함==
- DSS / management process에 embed
- 결과
  - new business practices
  - new products / services
  - new markets

> **Knowledge는 전달만 해서는 가치가 없고 실제 decision / process에 적용되어야 함**

네 단계는 각각 다른 질문에 답한다. ‘자료가 있는가’는 획득·저장, ‘필요한 사람이 찾을 수 있는가’는 전달, ‘찾은 내용을 실제 결정에 썼는가’는 적용의 문제다. 보고서가 많아도 업무가 바뀌지 않았다면 어느 단계에서 흐름이 끊겼는지 이 순서로 확인한다.

> [!PROBLEM]
> **문제.** 한 회사가 프로젝트 보고서 수천 개를 저장했지만, 직원들은 관련 교훈을 찾지 못하고 업무도 바뀌지 않았다. 가치사슬의 어느 단계가 막혔는가?
>
> **풀이.** ① 보고서가 있다 → 획득·저장은 됐다 ② 찾지 못한다 → ==red:전파(dissemination)== 문제 ③ 업무가 그대로다 → ==red:적용(application)== 문제.

---

## Slide 53 — Collaboration, Communities of Practice, Office Environments

### New Organizational Roles
- **CKO (Chief Knowledge Officer)**
- knowledge managers / dedicated staff

### Communities of Practice (COPs)
- ==professionals / employees의 informal social networks==
- education
- newsletters
- knowledge sharing
- ==new employee learning curve 감소==

> **COP = 같은 전문영역 사람들이 경험과 know-how를 지속적으로 공유하는 network**

> [!CONCEPT]
> **Communities of practice (COPs)** — 같은 일을 하는 전문가·직원의 비공식 네트워크. 노하우를 나누고 신입의 **learning curve**를 줄인다. 지식관리 총괄 임원은 **CKO**다.


> [!NOTE]
> COP는 공식 부서가 아니라 같은 일을 하는 사람들의 비공식 모임이다(여러 지점 바리스타들의 단체방처럼). 신입이 질문할 곳이 생겨 **learning curve**가 줄어든다.

**교재 보충 (p.455 표시):** ==CKO(chief knowledge officer)==는 기업의 지식관리 프로그램을 책임지는 임원으로, ==새로운 지식 원천을 찾거나 기존 지식을 조직·경영 프로세스에 더 잘 쓰도록== 프로그램과 시스템을 설계한다. COP 활동 예: ==교육, 온라인 뉴스레터, 지식 공유==.

---

## Slide 54 — Three Major Types of KMS

| Type | 대상 / 목적 |
|---|---|
| **Enterprise-Wide KMS** | ==firm-wide knowledge의 collection / storage / distribution / application== |
| **Knowledge Work Systems (KWS)** | ==engineers / scientists 등 knowledge workers의 new knowledge 생성== |
| **Intelligent Techniques** | ==data mining 등으로 knowledge discovery / optimal solution 탐색== |

> **KMS 3종류 = Enterprise-wide KMS / KWS / Intelligent Techniques**

> [!NOTE]
> 세 유형은 지식을 ==blue:관리하는가, 만드는가, 발견하는가==로 나뉜다. 회사 문서와 노하우를 모아 공유하면 enterprise-wide KMS, 엔지니어가 설계하며 새 지식을 만들면 KWS, 데이터에서 기계가 패턴을 찾아내면 intelligent techniques다.

> [!TRAP]
> **KMS**는 지식관리시스템 전체의 이름이고, **KWS**는 그중 전문가가 새 지식을 만들도록 돕는 한 유형이다. ==red:KMS ⊃ KWS.==

**교수님 메모:** 세 범주는 ==지원 대상(constituencies), 사용 목적, 강조점==이 다르다. Intelligent techniques는 흔히 ==인공지능(AI)==이라고 부른다.

---

## Slide 55 — Figure 11.2 Major Types of KMS

### Enterprise-Wide KMS
- enterprise content management
- collaboration / social tools
- learning management systems

### Knowledge Work Systems
- CAD
- virtual reality

### Intelligent Techniques
- data mining
- neural networks
- expert systems
- machine learning
- NLP
- computer vision
- robotics
- genetic algorithms
- intelligent agents

> **KMS는 조직 전체 지식관리 / 지식 생성 작업 / AI 기반 지식기술로 나뉨**

### 교재 그림 · Figure 11.2

![전사적 지식관리시스템 지식작업시스템 지능형 기법의 세 유형과 각각의 설명과 예시를 나란히 놓은 그림](/materials/diagrams/mis-fig-11-02.svg)

*Figure 11.2 · Major Types of Knowledge Management Systems — 관리하기 · 만들기 · 발견하기.*

### 개념도 · KMS 유형을 나누는 기준

![Knowledge management systems가 enterprise-wide KMS, knowledge work systems, intelligent techniques의 세 유형으로 나뉘는 구조](/materials/diagrams/mis-03-kms-types.svg)

**그림 읽기:** enterprise-wide KMS는 조직 전체의 지식 공유, KWS는 전문가의 새로운 지식 창출, intelligent techniques는 규칙·사례·data에서 pattern이나 해법을 찾는 데 초점이 있다. ==red:사용 기술보다 지원하는 knowledge activity로 구분한다.==

---

## Slide 56 — Enterprise-Wide Knowledge Types

| Type | 예시 | 특징 |
|---|---|---|
| **Structured** | ==red:reports / presentations / formal rules== | 형식과 구조가 명확 |
| **Semistructured** | ==red:e-mails / videos== | 일부 구조는 있으나 완전히 정형화되지 않음 |
| **Unstructured / Tacit** | ==red:experience / know-how== | 사람과 상황에 내재 |

- informal / unstructured knowledge도 business에서 중요
- 비율은 organization마다 다름

> **기업 지식은 structured + semistructured + tacit/unstructured 모두 관리해야 함**

> [!NOTE]
> 보고서(structured)만 관리하면 회사 지식의 일부만 담긴다. 이메일·영상(semistructured), 직원의 경험(tacit)에도 중요한 지식이 많다.

> [!EXAMPLE]
> **슬라이드 수치와 메모 (Slide 56)**
>
> - 원문: ==조직 비즈니스 콘텐츠의 80%가 semistructured 또는 unstructured==다.
> - 단, 최신 슬라이드 메모: ==비율은 조직마다 다르므로 관리자는 보편적 비율에 기대지 말고 자기 조직의 콘텐츠를 직접 측정해야 한다.==
> - 생각해 볼 것: 보고서 같은 structured knowledge보다 ==더 중요한 tacit knowledge의 예==는?

---

## Slide 57 — Enterprise Content Management Systems (CMS)

### Purpose
- documents / semistructured knowledge를
  - capture
  - store
  - retrieve
  - distribute
  - preserve

### External Sources
- news feeds / research

### Collaboration
- blogs / wikis

### Key Problem: Taxonomy
- knowledge object를 category로 **tagging**해야 retrieval 가능

### Digital Asset Management
- photos / graphics / video / audio 등 unstructured digital assets 관리

> **CMS의 핵심 = content 저장보다 classification / taxonomy / retrieval**

> [!CONCEPT]
> **Taxonomy** — 콘텐츠를 쉽게 찾을 수 있도록 회사 전체가 함께 쓰는 ==분류 체계==. 각 지식 객체에 이 분류로 **tag**를 붙인다.


> [!NOTE]
> 문서를 많이 저장하는 것보다 ==다시 찾을 수 있게== 하는 것이 어렵다. 그래서 CMS의 핵심 과제는 taxonomy다.

**교수님 메모:** CMS 구축의 첫 단계는 지식 객체(문서)를 ==나중에 찾을 수 있게 설명하는 것==이다. 기업은 ==사용자에게 의미 있는 범주를 정의하는 taxonomy==를 정하고, 지식 객체에 분류를 붙여(tagged) 검색되게 한다. ==기업마다 taxonomy가 다를 수 있는 이유==도 생각해 볼 것. **Digital asset management 시스템이 필요한 기업:** ==출판사, 광고회사, 로펌, 방송사, 엔터테인먼트 제작사== 등.

---

## Slide 58 — AI-Ready Content Management

| Criteria | 핵심 |
|---|---|
| **Quality** | duplicates 제거 / authoritative version 식별 / obsolete info 수정 |
| **Metadata** | category / date / sensitivity / business context / retention |
| **Access** | source와 동일한 permissions / legal restrictions |
| **Provenance** | source link / creation date / version history / correction path |
| **Evaluation** | retrieval coverage / accuracy / confidentiality / bias / real-work performance |

> **AI-ready content = ==blue:clean + well-labeled + access-controlled + traceable + evaluated==**

AI가 문서를 검색해 답할 때도 원래 문서의 품질과 접근 권한을 건너뛸 수는 없다. 오래된 판본과 최신 판본을 구분하지 못하면 그럴듯한 답을 잘못된 근거로 만들 수 있고, ==red:권한을 지키지 못하면 찾을 수 있다는 이유만으로 보여서는 안 되는 정보까지 노출될 수 있다.==

---

## Slide 59 — Figure 11.8 Enterprise Content Management System

### User Actions
- Create / Capture
- Tag
- Store / Retrieve
- Manage / Review
- Distribute / Publish

↓

### Unified Repository
- reports / presentations
- best practices
- memos
- e-mail
- graphics / video
- news feeds
- wikis / blogs
- employee profiles

> **ECM = 다양한 enterprise content를 unified repository에서 분류·관리·배포**

![사용자가 생성 태그 저장 검토 배포 활동을 거쳐 보고서 이메일 영상 위키 등을 담은 통합 저장소와 연결되는 그림](/materials/diagrams/mis-fig-11-08.svg)

*Figure 11.8 · An Enterprise Content Management System — 모든 콘텐츠가 하나의 통합 저장소에 모인다.*


> [!NOTE]
> 그림 위쪽은 사용자가 하는 일(만들기 → 태그 → 저장·검색 → 검토 → 배포), 아래쪽은 그 결과가 모이는 **unified repository**다. 보고서·이메일·영상·위키·직원 프로필까지 한 저장소에 모으기 때문에, 부서마다 따로 흩어진 자료를 한 번에 검색할 수 있다.
---

## Slide 60 — Locating and Sharing Expertise

- well-defined knowledge domain별 **corporate expert directory** 제공
- search tools로 적절한 expert 찾기
- social networking / social business tools로 external knowledge 탐색
- saving / tagging / sharing web pages

> ==모든 knowledge를 문서화할 수 없으므로 ‘누가 알고 있는지’를 찾는 기능도 중요==

> [!NOTE]
> tacit knowledge는 문서로 옮기기 어려우므로 **그 지식을 가진 사람을 빨리 찾게** 하는 것이 현실적이다. 2장 A의 Sharp Yammer ==People Directory==가 바로 이런 전문가 검색 기능이다.

---

## Slide 61 — Learning Management Systems (LMS)

- employee learning / training의
  - management
  - delivery
  - tracking
  - assessment
- web-based classes / online forums 등 multiple modes 지원
- course selection / administration 자동화
- learning content 제공
- learning effectiveness 측정
- **MOOCs** 지원 가능

> **LMS = organizational learning을 체계적으로 운영·추적하는 system**

> [!NOTE]
> LMS는 누가 어떤 교육을 들었는지 기록하고(tracking), 이해도를 확인하며(assessment), 교육 효과를 측정한다.

**슬라이드 원문:** ==MOOCs(Massively Open Online Courses)==: ==아주 많은 참여자에게 열린 웹 강좌==. LMS는 기업이 ==직원 학습을 추적·관리==할 수 있게 한다.

> [!CHECK]
> **4.** 지식관리 가치사슬의 네 단계를 순서대로 쓰시오.
>
> **5.** Explicit knowledge와 tacit knowledge의 차이를 쓰시오.
>
> **6.** KMS의 세 가지 유형을 쓰시오.

---

## Slide 62 — Knowledge Workers and Knowledge Work

### Knowledge Workers
- researchers / designers / architects / scientists / engineers
- organization을 위한 new knowledge 생성

### Three Roles
- organization의 knowledge를 current하게 유지
- internal consultant 역할
- ==blue:change agent== 역할

### Knowledge Work Systems
- knowledge workers가 new knowledge를 만들고 business에 integrate하도록 지원

> **Knowledge Worker = 지식을 사용하는 사람을 넘어 새로운 organizational knowledge를 만드는 사람**

> [!NOTE]
> 지식 근로자는 지식을 쓰기만 하는 사람이 아니라 ==새로 만드는 사람==이다. 세 역할을 한 문장으로 묶으면, ==blue:회사 지식을 최신으로 유지하고(current), 다른 부서에 조언하며(internal consultant), 변화를 이끈다(change agent).==

---

## Slide 63 — Requirements of Knowledge Work Systems

- high computing power
- powerful graphics / analytical tools
- communications / document management
- external databases access
- user-friendly interfaces
- specific task에 optimized
  - design engineering
  - financial analysis

> **KWS는 일반 office system보다 specialized hardware/software와 external knowledge access가 중요**

> [!NOTE]
> 설계 엔지니어가 쓰는 3D 모델링 프로그램은 일반 사무용 컴퓨터로는 돌아가지 않는다. KWS는 강한 계산 능력과 그래픽, 외부 데이터베이스 접근, 쓰기 쉬운 화면이 필요하고, 무엇보다 ==특정 전문 작업에 최적화==되어 있다는 점이 일반 office system과 다르다.

---

## Slide 64 — Figure 11.9 Requirements of KWS

### External Knowledge Base
↓

### Software
- Graphics → Visualization
- Modeling → Simulation
- Document Management
- Communications

↕

### User Interface

↑

### Hardware Platform
- Knowledge Workstation

> **KWS = ==blue:External Knowledge + Specialized Software + Strong Hardware + Usable Interface==**

### 교재 그림 · Figure 11.9

![외부 지식 기반이 소프트웨어로 들어가고 소프트웨어 안의 사용자 인터페이스가 아래의 지식 워크스테이션 위에 놓인 그림](/materials/diagrams/mis-fig-11-09.svg)

*Figure 11.9 · Requirements of Knowledge Work Systems — 외부 지식, 전문 소프트웨어, 인터페이스, 워크스테이션.*

### 개념도 · Knowledge Work System의 구성 층위

![Knowledge workstation을 기반으로 user interface, specialized software, external knowledge base가 층을 이루어 전문 지식 작업을 지원하는 구조](/materials/diagrams/mis-03-kws-stack.svg)

KWS는 한 가지 software의 이름이 아니라, 전문 작업에 필요한 **기반·접근 방식·도구·외부 지식**이 맞물린 전체 작업 환경이다.

---

## Slide 65 — Examples of Knowledge Work Systems

### CAD
- engineering / architectural design
- 3D printing

### Virtual Reality
- ==red:real-life environment simulation==
- 3D medical modeling

### Augmented Reality
- ==red:physical environment 위에 digital data / image overlay==

### Investment Workstations
- internal + external financial data 통합
- brokers / traders / portfolio managers 지원

> **KWS는 전문직이 복잡한 knowledge creation task를 수행하도록 설계된 specialized system**

> [!NOTE]
> 네 사례 모두 “전문가가 새로운 것을 설계하거나 판단하는 일”을 돕는다는 공통점이 있다. CAD는 설계를, VR은 실제 환경을 흉내 낸 시뮬레이션을, AR은 현실 위에 정보를 겹쳐 보여 주는 것을, 투자 워크스테이션은 여러 금융 데이터를 한 화면에서 분석하는 것을 지원한다.

> [!EXAMPLE]
> **KWS 예시 — 슬라이드 원문 그대로**
>
> | 시스템 | 원문 예시 |
> | --- | --- |
> | **CAD** (computer-aided design) | 공학·건축 설계 생성, ==3D printing== |
> | **Virtual reality** | 실제 환경 시뮬레이션, ==외과의를 위한 3D 의료 모델링(3D medical modeling for surgeons)== |
> | **Augmented reality (AR)** | 현실 위에 디지털 데이터·이미지를 겹쳐 시각화 강화 (판서: ==MR== — mixed reality) |
> | **VRML** | ==Virtual Reality Modeling Language== |
> | **Investment workstations** | ==브로커·트레이더·포트폴리오 매니저==를 위해 내부·외부 데이터를 통합하고 투자 과정을 간소화 |
>
> Figure 11.9 메모: 엔지니어·재무 분석가·의학 연구자에게 ==어떤 외부 지식==이 가치 있을지 생각해 볼 것. 소프트웨어 구성: ==Graphics → Visualization, Modeling → Simulation, Document management, Communications==.

---

## Slide 66 — Intelligent Techniques for Knowledge Management

### Traditional Intelligent Techniques

| 목적 | Technique |
|---|---|
| **Tacit knowledge capture** | ==blue:expert systems / case-based reasoning / fuzzy logic== |
| **Knowledge discovery** | ==blue:neural networks / data mining== |
| **Complex problem solution** | ==blue:genetic algorithms== |
| **Task automation** | ==blue:intelligent agents== |

### Modern Techniques

| Technique | 역할 |
|---|---|
| **Machine Learning** | patterns identify / outcomes predict |
| **NLP** | documents / conversations의 meaning extract |
| **Generative AI** | drafts / summaries / code / explanations 생성 |
| **RAG** | ==approved enterprise source에 grounded answer 생성== |
| **Knowledge Graphs** | people / concepts / records / relationships 연결 |
| **AI Agents** | policy와 human oversight 아래 defined task 실행 |

> **Intelligent Techniques = knowledge를 capture / discover / generate / apply / automate하는 AI 기반 방법**

> [!NOTE]
> 표는 **목적별로** 묶어 외운다. 전문가의 tacit knowledge를 규칙이나 사례로 담는 것(expert system, case-based reasoning, fuzzy logic), 데이터에서 새 패턴을 찾는 것(neural network, data mining), 복잡한 문제의 최적 해를 찾는 것(genetic algorithm), 반복 업무를 대신하는 것(intelligent agent)이다. 최신 기술인 ML·NLP·GenAI·RAG·knowledge graph도 결국 이 목적 중 하나에 들어간다.

> [!TRAP]
> 기법은 이름이 아니라 ==red:목적==으로 묶는다. 전문가 지식 담기(expert system, CBR, fuzzy logic) / 패턴 발견(neural network, data mining) / 최적해 찾기(genetic algorithm) / 업무 대신하기(intelligent agent).

---

## Slide 67 — Responsible Use of Generative AI

- **Govern**: ownership / approved use / prohibited use / risk tolerance / accountability
- **Map**: users / affected people / data / dependencies / misuse identify
- **Measure**: accuracy / security / privacy / bias / transparency / robustness / human oversight
- **Manage**: controls / monitoring / incidents / updates / retirement
- **Knowledge**: AI output을 authoritative knowledge가 아니라 ==red:verification이 필요한 claim==으로 취급

> **Responsible AI = ==blue:Govern → Map → Measure → Manage + Verify==**

> [!NOTE]
> 네 단계는 위험 관리의 순서다. 누가 책임지고 무엇을 허용할지 정하고(Govern), 누가 영향을 받는지 파악하고(Map), 정확성·편향·보안을 측정하고(Measure), 문제가 생기면 통제하고 고친다(Manage). 그리고 AI가 낸 답은 확정된 지식이 아니라 ==red:검증이 필요한 주장(claim)==으로 다룬다.

---

> [!PAGEBREAK]

## PART 3 · 정보시스템 기능과 조직

## Slide 68 — Information Systems Department

- IT services를 책임지는 formal organizational unit
- 보통 **CIO**가 이끎

### Senior Roles

| Role | 핵심 영역 |
|---|---|
| **CIO** | information systems / IT leadership |
| **CSO / CISO** | security |
| **CKO** | knowledge |
| **CPO** | privacy |
| **CDO** | data |
| **CAIO** | AI / responsible AI leadership |

### Members
- programmers
- systems analysts
- information systems managers

### Systems Analyst
- business problems / requirements → information requirements / systems로 translate

> **IS Department = business need와 technology를 연결하고 IT services를 운영하는 조직**

> [!CONCEPT]
> **Systems analyst** — 현업의 문제와 요구를 정보 요구사항과 시스템으로 **번역**하는 사람. ==Business ↔ Technology 사이의 translator.==


> [!NOTE]
> **Systems analyst**는 현업의 요구(“주문이 자꾸 누락돼요”)를 시스템 요구사항(“주문 상태를 실시간 공유하는 기능”)으로 번역하는 사람이다.

> [!EXAMPLE]
> **C-level 직책 — 교재 정의로 구분하기**
>
> | 직책 | 책임 |
> | --- | --- |
> | **CIO** (chief information officer) | 기업의 IT·IS 사용을 총괄하는 고위 관리자. ==강한 비즈니스 배경 + IS 전문성==으로 기술을 사업 전략과 통합 |
> | **CSO** (chief security officer) | IS 보안 담당, ==보안 정책 시행==. 물리 보안과 분리될 때는 ==CISO==라고도 함. 사용자 교육, 위협 보고, 보안 도구·정책 유지 |
> | **CPO** (chief privacy officer) | ==데이터 프라이버시 법규 준수== 보장 |
> | **CKO** (chief knowledge officer) | ==지식관리 프로그램== 책임 |
> | **CDO** (chief data officer) | ==전사 데이터 거버넌스와 활용==, 데이터에서 얻는 가치 극대화 |
> | **CAIO** (chief AI officer) | ==AI 전략·도입·구현·모니터링== 총괄 (새로 생긴 C-suite 직책) |
>
> - **Programmers:** 컴퓨터 소프트웨어 명령을 작성하는 고도로 훈련된 기술 전문가.
> - **Systems analysts:** IS 그룹과 나머지 조직 사이의 ==주된 연결 고리(principal liaisons)==.
> - **IS managers:** 프로그래머·분석가·프로젝트 관리자·통신 관리자·DB 전문가 팀의 리더.
> - 교수님 메모: 부서 구성은 ==기업의 성격과 규모==에 따라 다르다. ==작은 회사는 공식 IS 부서가 없을 수도== 있고, 큰 회사는 사업부마다 IT 부서를 두기도 한다. 최근에는 ==AI governance(responsible AI) 리더십==이 추가되었다.

---

## Slide 69 — Organizing the Information Systems Function

### End Users
- applications를 사용하는 other departments의 representatives
- system design / development 참여 증가

### IT Governance
- organization에서 IT를 사용하는 strategies / policies
- ==decision rights + accountability framework==
- IT가 business strategy / objectives를 지원하도록 보장

### Organization
- centralized / decentralized 등 가능

> **IT Governance = ==누가 IT 결정을 내리고 누가 책임지는지 정의하는 framework==**

> [!CONCEPT]
> **IT governance** — 누가 IT 결정을 내리고(**decision rights**) 누가 결과에 책임지는지(**accountability**)를 정해, IT가 기업 전략을 지원하게 하는 틀.

> [!NOTE]
> IT governance는 기술 선택보다 먼저 정해야 할 **규칙**이다. 새 시스템 도입을 누가 결정하는지(decision rights), 결과가 나쁘면 누가 책임지는지(accountability)를 정해 IT가 사업 목표를 따르게 한다. ==중앙 IT가 모두 결정할지(centralized), 각 사업부가 결정할지(decentralized)는 조직 상황에 따라 고른다.==

**교수님 메모:** 시스템 개발이 성숙하면서 ==end user가 성공적인 시스템 개발의 핵심(pivotal)==으로 인정받게 되었다. IS 부서도 ==신제품·서비스·효율을 만드는 강력한 자원==으로 인정받으므로 ==IT governance는 핵심 경영 관심사==다. 교재: 초기 IS 부서는 주로 프로그래머였지만, 지금은 ==systems analyst와 네트워크 전문가 비중이 커지고 IS 부서가 강력한 변화 주도자(change agent)== 역할을 한다.

> [!CHECK]
> **7.** IS 부서를 이끄는 임원의 직책은?
>
> **8.** IT 거버넌스가 정하는 두 가지는 무엇인가?
>
> **9.** 중앙집중형 IT와 분산형 IT 중 표준화와 통제에 더 유리한 것은?

---

## Slide 70 — Modern Information Systems Operating Model

| Central Responsibilities | Distributed Responsibilities |
|---|---|
| enterprise architecture | business outcomes 정의 |
| cybersecurity | work prioritization |
| shared platforms | process improvement |
| data standards | adoption management |
| vendor management | business product team 실행 |
| service reliability | data accountability 공유 |
| organization-wide governance | responsible AI accountability 공유 |

> **Modern IS = ==핵심 standards/governance는 중앙화하고 business execution은 분산 협업==**

> [!NOTE]
> 요즘 방식은 중앙과 현업이 일을 나눈다. 보안·공통 플랫폼·데이터 표준처럼 ==red:회사 전체가 같아야 하는 것==은 중앙 IT가 맡고, 어떤 성과를 낼지·무엇부터 할지·실제로 쓰게 만들기처럼 ==red:현업이 더 잘 아는 것==은 사업부가 맡는다. 데이터와 AI의 책임은 양쪽이 함께 진다.

---

## Slide 71 — Career Relevance

### Related Careers
- Business Systems Analyst
- Product Manager / Product Owner
- Data / BI Analyst
- Cybersecurity / Privacy Specialist
- Enterprise Applications / Cloud Consultant
- AI Business Process Analyst
- Information / Knowledge Manager

### Career Advantage
- business process knowledge
- data literacy
- collaboration
- responsible AI use

> **강점 = Business + Data + Technology + Collaboration + Responsible AI를 연결하는 능력**

**원본 PDF의 진로 사례:** 회사 ==Comprehensive Supplemental Insurance USA==, 직무 ==Sales support specialist== — Job requirements, Interview questions, Author tips로 구성. (17판 원본 슬라이드에는 Microsoft Teams·SharePoint와 AI 협업 슬라이드도 함께 있었다.)

---

## Slide 72 — Current Career Context

### Workforce Change
- macrotrends로 job creation / displacement 동시 발생
- ==World Economic Forum: 2030년까지 일자리 1억 7천만 개 창출, 9,200만 개 대체(displaced)== 전망

### Growing Roles
- big data specialists
- AI / ML specialists
- software developers

### Important Business Roles
- operations managers
- project managers
- security specialists
- BI professionals

### Task Design
- human work + technology + human-machine collaboration의 혼합 증가

### Student Focus
- redesign processes
- evaluate evidence
- communicate with stakeholders
- use AI responsibly

> **미래 경쟁력은 AI 자체보다 process redesign + evidence + stakeholder communication 능력에서 나옴**

---

## Slide 73 — Learning Check

| Topic | Learning Check |
|---|---|
| **Process** | AI-enabled process는 simple task automation과 어떻게 다른가? |
| **Enterprise Systems** | ERP / analytics가 cloud로 이동할 때 어떤 management risks가 증가하는가? |
| **Collaboration** | human-agent team의 reliable work를 위해 어떤 controls가 필요한가? |
| **Knowledge** | enterprise content가 RAG에 적합하려면 무엇이 필요한가? |
| **Sustainability** | IS investment decision에 어떤 environmental measures를 포함해야 하는가? |

> **시험 체크: ==blue:AI process / Cloud ERP risk / Human-Agent control / RAG-ready knowledge / Sustainability==**

---

> [!PAGEBREAK]

## 사례 총정리 · 2장 B에 나오는 예시와 수치

| 슬라이드 | 기업·사례 | 내용 | 핵심 수치·결과 | 연결 개념 |
| --- | --- | --- | --- | --- |
| 31 | **Sharp (Yammer), Cemex** | 사내외 소셜 플랫폼 | 경영진 개입 없는 정보 교환 | Social business |
| 32 | **Microsoft 2026 연구** | 10개국 AI 사용자 2만 명 | 실수 공유 61% vs 36%, 품질 기준 논의 54% vs 29% | Human-agent teams |
| 34 | 내부 정치로 실패한 팀 | 저품질 협업의 예 | — | Collaboration capability |
| 35 | **Google 2024** | 데이터센터 | 배출 12%↓, 청정에너지 8 GW+, Ironwood TPU 약 30배 효율 | 디지털 인프라의 환경 발자국 |
| 37 | Second Life, Google Docs, Teams, SharePoint, Slack, Zoom, Notion | 협업 도구 | — | Collaboration tools |
| 37 | **AI Accelerates Drug Discovery** | 사람–AI 협업 신약 개발 | 신약 10–15년, AI가 특성 예측·이미지 분석·새 화합물 아이디어 | Human-AI collaboration |
| 38 | Facebook → 기업용 SNS, Yammer | 기능 재현 | Facebook엔 팀 작업공간 없음 | Enterprise social networking |
| 42 | 정보 경제 | 지식·정보 근로자·GDP·NYSE | 37%, 55%, 주식 가치 절반 이상 무형 | KMS의 중요성 |
| 43 | 가전제품 회사 | 가장 효율적이고 싼 에어컨 제조법 | — | Knowledge = firm asset |
| 46 | build-to-order 생산 시스템 | 따라 하기 어려운 노하우 | — | Core competency |
| 47 | Apple, eBay, Burger King | 기업 지식 | 숙련 노동력은 대체 어려움 | Organizational learning |
| 56 | 기업 콘텐츠 | 80% semistructured·unstructured | 조직마다 직접 측정 | Enterprise-wide KM |
| 57 | 출판사·광고사·로펌·방송사 | Digital asset management | — | CMS |
| 65 | CAD·3D printing, VR 3D 의료 모델링, AR, VRML, 투자 워크스테이션 | 전문가 작업 | — | KWS |
| 68 | CIO, CSO/CISO, CPO, CKO, CDO, CAIO | C-level 직책 | — | IS function |
| 72 | **World Economic Forum** | 2030년까지 | 1억 7천만 창출, 9,200만 대체 | Career context |

> [!TRAP]
> ==red:CSO(보안)와 CPO(프라이버시), CKO(지식)와 CDO(데이터)를 섞지 말 것.== ==red:VR은 현실을 흉내 내는 시뮬레이션, AR은 현실 위에 정보를 겹치는 것이다.== ==red:37%는 노동력, 55%는 GDP다.==

> [!FLASHCARD]
> Q: 2장 사례 — Microsoft 2026 연구의 대상과 두 비교 수치는?
> A: 10개국 AI 사용 근로자 2만 명과 Microsoft 365 데이터. Frontier Professionals는 AI 활용법과 실수를 팀과 더 자주 공유(61% vs 36%)하고 품질 기준을 더 자주 논의(54% vs 29%)한다.

> [!FLASHCARD]
> Q: 2장 사례 — Google 2024의 환경 관련 수치 세 가지는?
> A: 데이터센터 에너지 배출 12% 감소, 8 GW 이상의 청정에너지 계약, Ironwood TPU가 2018년 첫 Cloud TPU보다 전력 효율 약 30배.

> [!FLASHCARD]
> Q: 2장 사례 — 정보 경제를 보여 주는 Slide 42의 수치는?
> A: 미국 노동력의 37%가 지식·정보 근로자, 미국 GDP의 55%가 지식·정보 부문, NYSE 상장 주식 가치의 절반 이상이 지식·노하우 같은 무형 자산.

> [!FLASHCARD]
> Q: 2장 사례 — 조직 비즈니스 콘텐츠 중 semistructured·unstructured 비율과 최신 메모는?
> A: 80%. 단, 비율은 조직마다 다르므로 관리자는 자기 조직의 콘텐츠를 직접 측정해야 한다.

> [!FLASHCARD]
> Q: 2장 사례 — KWS의 슬라이드 예시를 모두 쓰면?
> A: CAD(3D printing 포함), virtual reality(외과의를 위한 3D 의료 모델링), augmented reality, VRML, investment workstations(브로커·트레이더·포트폴리오 매니저).

> [!FLASHCARD]
> Q: 2장 사례 — CSO, CPO, CKO, CDO, CAIO의 책임은?
> A: CSO = IS 보안·보안 정책 시행(CISO), CPO = 개인정보 법규 준수, CKO = 지식관리 프로그램, CDO = 전사 데이터 거버넌스·활용, CAIO = AI 전략·도입·모니터링.

> [!FLASHCARD]
> Q: 2장 사례 — AI Accelerates Drug Discovery 사례에서 AI가 돕는 세 가지는?
> A: 후보 화합물의 특성을 예측해 가망 없는 작업을 막음, 수천 장의 세포 이미지 분석 같은 반복 작업을 줄임, 새로운 화합물 아이디어를 생성. 신약 개발은 보통 10–15년 이상 걸린다.

> [!PAGEBREAK]

## 단원 마무리

### 한 쪽 핵심 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 협업 | 역량(개방 문화·분권 구조) + 기술 → 협업의 질 → 기업 성과 |
| 시간·공간 매트릭스 | 같은/다른 시간 × 같은/다른 장소의 네 칸 |
| 지식의 형태 | Explicit(문서) vs Tacit(경험), 지식은 sticky·situated·contextual |
| KM 가치사슬 | Acquire → Store → Disseminate → Apply, Apply가 있어야 가치 |
| KMS 세 유형 | 전사 KMS(관리) · KWS(창출) · 지능형 기법(발견) |
| 콘텐츠 관리 | Taxonomy와 tagging이 검색의 핵심 |
| IS 조직 | CIO · systems analyst · IT governance(decision rights + accountability) |

### 단답형 연습 · Short Answer

Write the term or a short answer in English. 답은 맨 끝 **정답과 해설**의 단답형 정답에서 확인한다.

1. What is the use of internal and external social networking platforms to engage employees, customers, and suppliers called?  
   Answer: ______________________________
2. In the time/space collaboration matrix, what do we call collaboration that happens at the same time?  
   Answer: ______________________________
3. What is knowledge that resides in the minds of employees and has not been documented called?  
   Answer: ______________________________
4. What do we call the process by which organizations gain experience and change their business processes and decision patterns as a result?  
   Answer: ______________________________
5. List the four stages of the knowledge management value chain.  
   Answer: ______________________________
6. What are informal social networks of professionals and employees who share similar work-related activities and interests called?  
   Answer: ______________________________
7. Which type of KMS supports engineers and scientists in creating new knowledge, such as CAD and virtual reality systems?  
   Answer: ______________________________
8. What is the scheme of classifying information and knowledge so that it can be easily accessed called?  
   Answer: ______________________________
9. Who in the IS department translates business problems and requirements into information requirements and systems?  
   Answer: ______________________________
10. What framework specifies the decision rights and accountability that ensure IT supports the firm's strategies and objectives?  
   Answer: ______________________________

> [!PAGEBREAK]

## 개념 회상과 오개념 점검

> [!QUIZ]
> Knowledge Management Value Chain을 순서대로 쓰고, 마지막 단계가 빠지면 왜 business value가 생기기 어려운지 설명하시오.

> [!ANSWER]
> Acquisition → Storage → Dissemination → Application이다. 지식을 저장하고 공유해도 실제 decision이나 business process에 적용하지 않으면 성과 개선으로 연결되지 않는다.

> [!QUIZ]
> explicit knowledge와 tacit knowledge의 차이를 각각 하나의 조직 사례로 설명하시오.

> [!ANSWER]
> explicit knowledge는 매뉴얼·보고서처럼 기록하고 전달하기 쉬운 지식이다. tacit knowledge는 숙련자의 문제 해결 감각처럼 개인의 경험에 묻혀 있어 문서만으로 완전히 옮기기 어려운 지식이다.

> [!QUIZ]
> AI-ready content를 만들 때 taxonomy, metadata, access control이 함께 필요한 이유는 무엇인가?

> [!ANSWER]
> taxonomy와 metadata는 관련 지식을 정확히 찾고 맥락을 해석하게 하며, access control은 허가된 정보만 사용하게 한다. 셋 중 하나가 빠지면 검색 정확성이나 보안이 약해진다.

> [!QUIZ]
> A firm has stored thousands of project reports, but employees cannot find relevant lessons and no process uses them. Which KM stage is the clearest bottleneck?
>
> - A. Acquisition only
> - B. Storage only
> - C. Dissemination and application
> - D. Hardware platform only

> [!ANSWER]
> **정답은 C이다.** A는 자료가 이미 수집되었다는 조건을 놓친 선택이다. B는 저장 자체를 가치 창출로 보는 오개념이다. D는 KM 문제를 hardware 문제로만 축소한 선택이다. 찾을 수 있게 전달하고 실제 업무에 적용해야 지식이 성과로 이어진다.

> [!PAGEBREAK]

## 정답과 해설

먼저 스스로 답을 쓴 뒤 확인한다.

### 확인 문제 정답

1. **Collaboration capability**(개방적 문화, 분권적 구조, 협업의 폭)와 **collaboration technology**.
2. **Same time · different place** → Remote interactions.
3. 정보를 숨기지 않는 **정보 투명성**과 공유를 보상하는 문화.
4. **Acquisition → Storage → Dissemination → Application.**
5. Explicit knowledge는 **문서화된** 지식이고, tacit knowledge는 사람의 **경험 속에** 있어 문서로 옮기기 어려운 지식이다.
6. **Enterprise-wide KMS, knowledge work systems, intelligent techniques.**
7. **CIO**(Chief Information Officer).
8. **Decision rights**(누가 결정하는가)와 **accountability**(누가 책임지는가).
9. **중앙집중형(centralized).** 분산형은 현장 대응과 자율성에 유리하다.

### 단답형 정답

1. **Social business** — 소셜 플랫폼으로 직원·고객·공급업체와의 상호작용을 깊게 하는 것
2. **Synchronous collaboration** — 같은 시간에 이루어지는 동기식 협업
3. **Tacit knowledge** — 문서화되지 않고 사람의 경험 속에 있는 암묵지
4. **Organizational learning** — 경험을 바탕으로 프로세스와 의사결정 방식을 바꾸는 조직 학습
5. **Acquisition, storage, dissemination, application** — 획득 → 저장 → 전파 → 적용
6. **Communities of practice (COPs)** — 같은 일을 하는 사람들의 비공식 네트워크
7. **Knowledge work systems (KWS)** — 전문가의 새 지식 창출을 돕는 지식작업시스템
8. **Taxonomy** — 콘텐츠를 쉽게 찾도록 분류하는 체계
9. **Systems analyst** — 현업 요구를 시스템 요구사항으로 번역하는 시스템 분석가
10. **IT governance** — IT 결정 권한과 책임을 정하는 IT 거버넌스
