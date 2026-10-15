---
title: 0장 · 전공 용어 정리집
description: 'TPS·ERP·KMS부터 RAG·IT 거버넌스까지, 시험에서 헷갈리는 정시개 핵심 용어를 분야별 표와 구조도로 정리한다.'
order: 0
published: true
duration: 55
tags:
  - 정시개
  - 핵심용어
  - 시험대비
  - 개념비교
  - 총정리
objectives:
  - 관리 계층별 정보시스템과 전사 애플리케이션을 기준에 따라 구분한다.
  - 지식관리·AI·콘텐츠 관리 용어의 관계와 흐름을 설명한다.
  - 조직 직책·IT 거버넌스·투자 용어를 사례에 맞게 선택한다.
---

## 이 정리집을 쓰는 법

이 강의는 1–5강의 핵심 전공 용어를 **무엇을 관리하는가**, **누가 사용하는가**, **어떤 결정을 돕는가**라는 기준으로 다시 묶은 시험 직전용 용어집이다. 각 분야는 먼저 표로 차이를 확인하고, 바로 아래 구조도로 용어 사이의 관계를 한 번 더 정리한다.

> **EXAM** 약어의 Full Name만 외우지 말고, `사용자 → 입력 → 처리 → 결과` 네 칸으로 설명할 수 있는지 확인한다.

## 1. Management Level별 Information Systems

| 용어 | Full Name | 핵심 의미 | 구분 포인트 |
|---|---|---|---|
| **TPS** | Transaction Processing System | 일상적인 **routine transaction**을 처리·기록 | Operational level · 주문, 급여, 배송 |
| **BI** | Business Intelligence | 데이터를 조직·분석해 **better decision making** 지원 | 분석을 위한 큰 개념 |
| **MIS** | Management Information System | TPS 데이터를 요약해 **middle manager**에게 정기 보고서 제공 | Routine · predefined questions |
| **DSS** | Decision Support System | 데이터와 분석 모델로 **non-routine decision** 지원 | Middle management · 분석 중심 |
| **ESS** | Executive Support System | Senior management의 **strategic, non-routine decision** 지원 | 외부 데이터 + MIS/DSS 요약 정보 |

### MIS와 DSS 비교

| MIS | DSS |
|---|---|
| Routine decision | Non-routine decision |
| 정기 보고서 | 분석·Simulation |
| Predefined procedure | Flexible analytical model |
| “이번 달 매출은?” | “판매량이 2배 되면 생산계획은?” |

![TPS에서 ESS까지 관리 수준별 정보시스템의 흐름](/materials/diagrams/mis-02-management-systems.svg)

*그림 읽기: TPS의 거래 데이터가 BI 분석 기반이 되고, MIS·DSS를 거쳐 ESS의 전략 판단으로 올라간다.*

## 2. Enterprise Applications

| 용어 | Full Name | 핵심 의미 | 주요 대상 |
|---|---|---|---|
| **Enterprise Applications** | Enterprise Applications | 기업 전체와 외부 조직까지 연결하는 시스템의 **큰 범주** | ERP + SCM + CRM + KMS |
| **ES** | Enterprise System | 여러 Functional Area를 통합하는 시스템 | 이 장에서는 보통 **ERP와 같은 의미** |
| **ERP** | Enterprise Resource Planning | 여러 부서 데이터를 **single central repository**에 통합 | 회사 내부 전체 |
| **SCM** | Supply Chain Management | Supplier부터 Distribution까지 공급망 관리 | Suppliers · logistics |
| **CRM** | Customer Relationship Management | 고객 관련 Sales·Marketing·Service 프로세스 통합 | Customers |
| **KMS** | Knowledge Management System | 조직 지식의 생성·저장·공유·활용 지원 | Knowledge |

### ERP·SCM·CRM 빠른 구분

| 시스템 | 누구를 연결하는가 | 핵심 질문 |
|---|---|---|
| **ERP** | 회사 내부 부서 | “회사 내부 데이터를 어떻게 통합하지?” |
| **SCM** | Supplier · Logistics | “제품을 어떻게 효율적으로 공급하지?” |
| **CRM** | Customer | “고객을 어떻게 더 잘 관리하지?” |

![ERP를 중심으로 SCM CRM KMS가 기업 안팎을 연결하는 구조](/materials/diagrams/mis-02-enterprise-applications.svg)

*핵심 관계: `Enterprise Applications = ERP(ES) + SCM + CRM + KMS`, 그리고 이 장에서는 `ES ≈ ERP`로 본다.*

## 3. Knowledge Management

| 용어 | Full Name | 핵심 의미 |
|---|---|---|
| **KMS** | Knowledge Management System | Knowledge를 create · store · transfer · apply |
| **KWS** | Knowledge Work System | 전문가가 **new knowledge**를 생성하도록 지원 |
| **ECM / CMS** | Enterprise Content Management / Content Management System | 기업의 문서·콘텐츠를 수집·저장·검색·배포 |
| **LMS** | Learning Management System | 직원 Learning · Training 관리 |
| **COP** | Community of Practice | 같은 전문 영역의 사람들이 경험과 Know-how를 공유하는 informal network |
| **CKO** | Chief Knowledge Officer | Knowledge Management 총괄 책임자 |

### KMS의 세 가지 유형

| 유형 | 핵심 역할 | 기억할 동사 |
|---|---|---|
| **Enterprise-Wide KMS** | 전사 지식의 수집·정리·공유 | **Manage** |
| **KWS** | 전문가의 새로운 지식 창출 | **Create** |
| **Intelligent Techniques** | 데이터에서 패턴과 지식 발견 | **Discover** |

![Manage Create Discover로 구분하는 KMS 세 가지 유형](/materials/diagrams/mis-03-kms-types.svg)

*암기 흐름: **Manage → Create → Discover**.*

## 4. Knowledge 자체와 관련된 용어

| 용어 | 의미 | 예시 |
|---|---|---|
| **Tacit Knowledge** | 암묵지 · 사람의 경험과 감각 속 지식 | 숙련자의 Know-how |
| **Explicit Knowledge** | 형식지 · 문서화된 지식 | Manual, Report |
| **Structured Knowledge** | 구조가 명확한 지식 | Report, Formal Rule |
| **Semistructured Knowledge** | 일부만 구조화된 지식 | E-mail, Video |
| **Unstructured Knowledge** | 일정한 구조로 표현하기 어려운 지식 | 경험, 대화, Know-how |
| **Wisdom** | 지식을 언제·어디서·어떻게 적용할지 아는 경험 | 상황에 맞는 판단 |
| **Core Competency** | 경쟁사가 쉽게 복제할 수 없는 조직의 핵심 능력 | 독특한 생산 Know-how |

![데이터가 정보 지식 지혜로 발전하는 지식 위계](/materials/diagrams/mis-03-knowledge-hierarchy.svg)

*핵심 흐름은 **Data → Information → Knowledge → Wisdom**이며, `Tacit = 사람 안`, `Explicit = 문서 밖`으로 기억한다.*

## 5. Knowledge Management Value Chain

| 단계 | 의미 | 확인 질문 |
|---|---|---|
| **Acquire** | Knowledge 수집·생성 | 무엇을 새로 얻었는가? |
| **Store** | Knowledge 저장 | 다시 찾을 수 있는가? |
| **Disseminate** | 필요한 사람에게 전달 | 필요한 사람에게 도달했는가? |
| **Apply** | Decision · Business Process에 실제 적용 | 행동과 성과가 달라졌는가? |

![Acquire Store Disseminate Apply로 이어지는 지식관리 가치사슬](/materials/diagrams/mis-03-knowledge-value-chain.svg)

*Knowledge는 저장만으로 가치가 생기지 않는다. **Apply**되어 의사결정이나 프로세스를 바꿔야 가치가 완성된다.*

## 6. GenAI·AI 핵심 용어

| 용어 | Full Name | 핵심 의미 |
|---|---|---|
| **AI** | Artificial Intelligence | 인간의 지적 작업을 수행하는 기술의 큰 범주 |
| **ML** | Machine Learning | 데이터에서 Pattern을 학습 |
| **NLP** | Natural Language Processing | 인간의 Language를 처리 |
| **GenAI** | Generative AI | Text, Code 등 새로운 Content 생성 |
| **RAG** | Retrieval-Augmented Generation | Source를 먼저 검색한 뒤 그 근거로 답변 생성 |
| **AI Agent** | AI Agent | Tool·System을 사용해 여러 단계 Workflow 수행 |
| **Expert System** | Expert System | 전문가 지식을 Rule 형태로 저장·활용 |
| **Data Mining** | Data Mining | 대규모 데이터에서 숨은 Pattern 발견 |
| **Neural Network** | Neural Network | 복잡한 Pattern을 학습하는 ML 구조 |
| **Fuzzy Logic** | Fuzzy Logic | 0/1이 아닌 애매한 정도를 다루는 Logic |
| **Genetic Algorithm** | Genetic Algorithm | 진화 원리로 좋은 Solution 탐색 |

![AI를 중심으로 학습 언어 생성 추론 최적화 기술을 분류한 지도](/materials/diagrams/mis-00-ai-landscape.svg)

### RAG는 이렇게 기억

| 단계 | 하는 일 | 시험 키워드 |
|---|---|---|
| **Question** | 사용자의 질문을 받음 | query |
| **Retrieve** | 승인된 외부·기업 Source 검색 | grounding |
| **Generate** | 검색 근거를 사용해 답변 생성 | evidence-based answer |

![질문 검색 근거 생성으로 이어지는 RAG 흐름](/materials/diagrams/mis-00-rag-flow.svg)

*일반 GenAI는 모델이 학습한 지식으로 답하고, **RAG는 외부 지식을 검색한 뒤 그 근거로 답한다**.*

## 7. Assist·Automate·Agent

| AI 역할 | 의미 | 사람의 위치 |
|---|---|---|
| **Assist** | Human이 일하고 AI가 보조 | 사람이 작업과 판단을 주도 |
| **Automate** | 정해진 반복 Task를 시스템이 자동 수행 | 사람이 규칙과 예외를 관리 |
| **Agent** | AI가 여러 Task를 연결해 defined workflow 수행 | 사람이 목표·권한·검토 기준 설정 |

![Assist Automate Agent로 자율성이 커지는 흐름](/materials/diagrams/mis-00-assist-automate-agent.svg)

*암기: **Assist = 도와줌 → Automate = 일부 대신함 → Agent = Workflow를 수행**.*

## 8. Content Management·AI-Ready Content

| 용어 | 핵심 의미 | 예시 |
|---|---|---|
| **Taxonomy** | Knowledge를 분류하기 위한 Category 체계 | Finance · HR · Sales |
| **Tagging** | Knowledge Object에 Category·Tag 부여 | `#Finance` |
| **Metadata** | Content를 설명하는 데이터 | 작성자, 작성일, Category |
| **Provenance** | 정보가 어디서 왔는지 추적하는 정보 | 원본 문서와 변경 이력 |
| **Repository** | Content를 저장하는 통합 저장소 | 사내 문서 저장소 |
| **Unified Repository** | 여러 Enterprise Content를 하나로 통합한 저장소 | 부서 저장소의 통합 |
| **Information Governance** | 정보의 소유·권한·보존·관리 규칙 | 접근권한, 보존기간 |

![콘텐츠가 메타데이터와 거버넌스를 거쳐 AI가 사용할 수 있는 지식이 되는 흐름](/materials/diagrams/mis-00-ai-ready-content.svg)

*문서 내용 자체는 **Content**, 문서를 설명하는 값은 **Metadata**, 분류의 전체 체계는 **Taxonomy**, 실제로 붙인 표지는 **Tagging**이다.*

## 9. Collaboration 관련 용어

| 용어 | 핵심 의미 | 반대 개념 |
|---|---|---|
| **Synchronous** | 같은 시간에 Collaboration | Asynchronous |
| **Asynchronous** | 서로 다른 시간에 Collaboration | Synchronous |
| **Co-located** | 같은 장소 | Remote |
| **Remote** | 다른 장소 | Co-located |
| **Intranet** | Employees만 사용하는 내부 Network | 내부 경계 |
| **Extranet** | Authorized external partners까지 접근 가능한 Network | 허가된 외부까지 확장 |
| **Enterprise Social Networking** | 기업 내부 Communication · Collaboration Platform | 조직 협업 기반 |

![시간과 장소 두 축으로 구분한 협업 방식](/materials/diagrams/mis-00-collaboration-matrix.svg)

*현대 Collaboration Platform은 **Work Fit + Integration + Governance + AI Quality + Adoption**으로 평가한다.*

## 10. IT Organization·Management 직책

| 용어 | Full Name | 담당 영역 |
|---|---|---|
| **CIO** | Chief Information Officer | 기업 전체 IT · IS 전략 |
| **CISO** | Chief Information Security Officer | Cybersecurity |
| **CKO** | Chief Knowledge Officer | Knowledge |
| **CPO** | Chief Privacy Officer | Privacy |
| **CDO** | Chief Data Officer | Data |
| **CAIO** | Chief AI Officer | AI strategy · governance |

![CIO와 보안 지식 개인정보 데이터 AI 책임자의 역할 지도](/materials/diagrams/mis-00-it-leadership.svg)

*직책 문제는 약어보다 담당 객체를 연결한다: **CIO–전체 IT, CISO–Security, CKO–Knowledge, CPO–Privacy, CDO–Data, CAIO–AI**.*

## 11. IT Governance·IS Organization

| 용어 | 핵심 의미 | 구분 포인트 |
|---|---|---|
| **IT Governance** | 누가 IT 결정을 내리고 누가 책임지는지 정하는 Framework | 권한과 책임의 설계 |
| **Decision Rights** | 누가 Decision을 내릴 권한이 있는가 | 결정 전의 권한 |
| **Accountability** | 결과에 누가 책임지는가 | 결정 후의 책임 |
| **Centralized** | 중앙 IT 조직에 Decision 집중 | 표준화·통제에 유리 |
| **Decentralized** | 각 Business Unit에 Decision 분산 | 현장 대응·자율성에 유리 |
| **Systems Analyst** | Business Requirements를 Information·System Requirements로 변환 | Business ↔ Technology 번역자 |

![의사결정 권한에서 책임과 시스템 요구사항으로 이어지는 IT 거버넌스 흐름](/materials/diagrams/mis-00-it-governance.svg)

*Systems Analyst는 한 문장으로 **Business와 Technology 사이의 Translator**다.*

## 12. Business·투자 관련 용어

| 용어 | Full Name | 핵심 의미 |
|---|---|---|
| **ROI** | Return on Investment | 투자 비용 대비 얻은 Return |
| **Intangible Assets** | Intangible Assets | 눈에 보이지 않는 기업 자산 |
| **Business Process** | Business Process | 특정 Business Task를 수행하기 위한 logically related tasks |
| **Cross-functional Process** | Cross-functional Business Process | 여러 Functional Area를 가로지르는 Process |
| **Complementary Assets** | Complementary Assets | IT 투자가 실제 가치를 만들게 하는 조직·경영·사회적 자산 |

![IT 투자와 보완 자산이 프로세스 변화를 거쳐 성과와 ROI를 만드는 구조](/materials/diagrams/mis-00-value-realization.svg)

*ROI는 “투자 대비 얼마나 이익을 얻었는가”를 묻는다. 지식·브랜드·평판·독특한 프로세스는 대표적인 **Intangible Assets**다.*

## 시험에서 특히 헷갈리는 용어 최종 비교

| 헷갈리는 용어 | 가장 빠른 구분 |
|---|---|
| **ES vs ERP** | 이 장에서는 거의 같은 의미 |
| **Enterprise Applications vs ERP** | Enterprise Applications가 더 큰 범주 |
| **TPS vs BI** | 거래 처리 vs 데이터 분석 |
| **MIS vs DSS** | Routine report vs non-routine analysis |
| **DSS vs ESS** | Middle manager vs senior executive |
| **ERP vs SCM vs CRM** | 내부 통합 vs 공급망 vs 고객 |
| **KMS vs KWS** | 조직 지식 관리 vs 전문가의 새 지식 생성 |
| **Tacit vs Explicit** | 사람의 경험 속 암묵지 vs 문서화된 형식지 |
| **CMS vs KMS** | 콘텐츠 관리 vs 조직 지식 전체 관리 |
| **RAG vs GenAI** | 검색 근거 기반 생성 vs 일반 생성 AI |
| **Assist vs Automate vs Agent** | 보조 vs Task 자동화 vs Workflow 수행 |
| **CIO vs CISO vs CKO** | IT 전체 vs Security vs Knowledge |
| **Taxonomy vs Metadata** | 분류 체계 vs Content 설명 정보 |
| **Intranet vs Extranet** | 직원 내부 vs 허가된 외부 파트너까지 |

## 3줄 총정리

**TPS–MIS–DSS–ESS**는 Management Level과 Decision 유형으로, **ERP–SCM–CRM–KMS**는 무엇을 관리하고 누구를 연결하는지로 구분한다.  
Knowledge 분야에서는 **Tacit/Explicit, KMS/KWS, Acquire–Store–Disseminate–Apply, RAG**가 핵심이다.  
조직 분야에서는 **CIO/CISO/CKO/CPO/CDO/CAIO, IT Governance, Systems Analyst**를 권한·책임·대상과 함께 기억한다.

> **EXAM** 마지막 점검은 세 문장으로 한다. `이 시스템의 사용자는 누구인가?`, `무엇을 입력받아 무엇을 내놓는가?`, `일상적 결정인가 비일상적 결정인가?`
