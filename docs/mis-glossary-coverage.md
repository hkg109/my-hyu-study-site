# 정시개 용어 정리집(lecture-00) 개념 대응표

`content/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-00.md`를 Chapter 1–4 통합 개념서로 다시 쓸 때 쓴 작업 문서다. 범위를 고정하고, 개념마다 **어디서 설명·예시·개념도로 다루는지** 대응시켰다.

## 1. 범위와 원칙

- **출처:** lecture-01(1장), lecture-02(2장 A), lecture-03(2장 B), lecture-04(3장), lecture-05(4장)의 본문·표·그림 캡션·사례·보충과 `public/materials/mis-exam-slides/*.pdf`. 새 사실·수치·교수님 강조는 만들지 않았다.
- **구조:** 장(H2) → 개념 묶음(H3, `1-1` … `4-7`) → 개별 개념(H4). 사이트 목차가 같은 3단계로 보인다.
- **대표 설명:** 같은 개념이 여러 강에 나오면 한 카드만 대표 설명으로 두고 다른 곳은 링크한다. 예: Business process → 2-1, Core competency → 3-5, Accountability(윤리) → 4-3, Intranet/Extranet → 2-4, Complementary assets → 1-5.
- **카드 형식:** 정의 박스(영문·한국어·약어 풀이 + 한 문장 정의) → 쉽게·특징 → 헷갈림 주의 → 연결(관련 개념 + 원문 슬라이드 앵커) → 예시 박스(상황 → 적용 개념 → 이유 → 결과). 짧은 용어는 묶음 끝 표.
- **예시:** 강의 사례를 우선하고 출처 슬라이드를 적었다. 지어낸 예시는 “가상 예시”로 표시했다.

## 2. 개념도

`scripts/generate-mis-glossary-diagrams.mjs`(레이아웃 도구: `scripts/mis-glossary-kit.mjs`)가 `public/materials/diagrams/mis-gl-*.svg` 44장을 만든다.

- A 전체 지도 1장(`mis-gl-00-concept-map`), B 장 개요 4장(`mis-gl-1-overview` … `mis-gl-4-overview`), C 묶음 세부도 39장.
- 폭 560 단위(휴대폰에서 축소 비율을 줄이기 위해), 사이트 팔레트·Pretendard 계열 글꼴, 외부 리소스 없음, `<title>`·`<desc>` 포함.
- 모든 글자는 상자 폭에 맞춰 측정·줄바꿈되고, 넘치면 생성 단계에서 오류가 난다.
- 관계는 화살표 이름표(포함·데이터 제공·지원·영향·비교·구체화·제약 등)와 선 모양(실선 흐름·점선 영향), 상자 모양(검은 칸 중심 개념·점선 칸 조직 밖 주체)으로 표시해 색에만 의존하지 않는다. 범례는 그 그림에 실제로 쓰인 기호만 보여 준다.
- 본문에서 그림을 누르면 원본 SVG가 열려 확대할 수 있다. 데스크톱에서는 원래 크기(560px)로 보이도록 `app/globals.css`에 한 줄을 더했다.
- 다시 생성: `node scripts/generate-mis-glossary-diagrams.mjs`

## 3. 개념 대응표

`구분`의 **개선**은 이전 용어집에 표 한 줄 등으로 있던 개념을 카드로 다시 쓴 것, **신규**는 이전 용어집에 없던 개념이다. `예시`가 “카드”면 개념 카드에 예시 박스가 있고, “묶음 그림·해설”이면 같은 묶음의 개념도 해설 박스 예시로 다룬다. `개념도`는 그 개념이 속한 묶음의 세부도다.

| 장 | 개념 묶음 | 개념 | 구분 | 정의 | 예시 | 개념도 | 원문 링크 |
|---|---|---|---|---|---|---|---|
| 1장 | 1-1 디지털 기업과 변화 | Digital Firm · 디지털 기업 | 개선 | ✓ | 카드 | mis-gl-1a-digital-firm | lecture-01 |
| 1장 | 1-1 디지털 기업과 변화 | Digital Transformation · 디지털 전환 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-1a-digital-firm | lecture-01 |
| 1장 | 1-1 디지털 기업과 변화 | Time Shifting / Space Shifting · 시간·장소 제약의 완화 | 개선 | ✓ | 카드 | mis-gl-1a-digital-firm | lecture-01 |
| 1장 | 1-1 디지털 기업과 변화 | Globalization · 세계화와 정보시스템 | 신규 | ✓ | 카드 | mis-gl-1a-digital-firm | lecture-01 |
| 1장 | 1-1 디지털 기업과 변화 | Business Model · 사업모형 | 개선 | ✓ | 카드 | mis-gl-1a-digital-firm | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Strategic Business Objectives · 여섯 전략적 비즈니스 목표 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Operational Excellence · 운영 우수성 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | New Products, Services & Business Models · 신제품·서비스·사업모형 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Customer & Supplier Intimacy · 고객·공급업체 친밀성 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Improved Decision Making · 의사결정 개선 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Competitive Advantage · 경쟁우위 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Survival · 생존 | 개선 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-2 IS 투자의 여섯 목표 | Interdependence Between Organizations and IS · 조직과 IS의 상호의존 | 신규 | ✓ | 카드 | mis-gl-1b-objectives | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | IT · Information Technology · 정보기술 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | IS · Information System · 정보시스템 | 개선 | ✓ | 카드 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | Data / Information · 데이터와 정보 | 개선 | ✓ | 카드 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | Input · Processing · Output · 입력·처리·출력 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | Feedback · 피드백 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-3 정보시스템의 기본 단위 | Environment · 정보시스템의 환경 | 개선 | ✓ | 카드 | mis-gl-1c-it-is, mis-gl-1d-ipo-feedback | lecture-01 |
| 1장 | 1-4 세 차원과 IT 인프라 | Organization · Management · Technology · 정보시스템의 세 차원 | 개선 | ✓ | 카드 | mis-gl-1e-dimensions | lecture-01 |
| 1장 | 1-4 세 차원과 IT 인프라 | Levels of Management · 관리 계층과 근로자 유형 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-1e-dimensions | lecture-01 |
| 1장 | 1-4 세 차원과 IT 인프라 | IT Infrastructure · IT 인프라 | 개선 | ✓ | 카드 | mis-gl-1e-dimensions | lecture-01 |
| 1장 | 1-4 세 차원과 IT 인프라 | Computer Literacy / IS Literacy · 컴퓨터 활용 능력과 정보시스템 이해 능력 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-1e-dimensions | lecture-01 |
| 1장 | 1-5 IT 투자가 가치가 되는 길 | Business Information Value Chain · 비즈니스 정보 가치사슬 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-1f-value-chain, mis-gl-1g-complementary-assets | lecture-01 |
| 1장 | 1-5 IT 투자가 가치가 되는 길 | IT Investment Returns · IT 투자 수익의 편차 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-1f-value-chain, mis-gl-1g-complementary-assets | lecture-01 |
| 1장 | 1-5 IT 투자가 가치가 되는 길 | Complementary Assets · 보완 자산 | 개선 | ✓ | 카드 | mis-gl-1f-value-chain, mis-gl-1g-complementary-assets | lecture-01, lecture-03 |
| 1장 | 1-6 IS를 보는 세 접근법 | Technical Approach · 기술적 접근 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1h-approaches | lecture-01 |
| 1장 | 1-6 IS를 보는 세 접근법 | Behavioral Approach · 행동적 접근 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-1h-approaches | lecture-01 |
| 1장 | 1-6 IS를 보는 세 접근법 | Sociotechnical View · 사회기술적 관점 | 개선 | ✓ | 카드 | mis-gl-1h-approaches | lecture-01 |
| 2장 | 2-1 비즈니스 프로세스와 IT | Business Process · 비즈니스 프로세스 | 개선 | ✓ | 카드 | mis-gl-2a-order-fulfillment, mis-gl-2b-automation-redesign, mis-gl-2c-ai-roles | lecture-02 |
| 2장 | 2-1 비즈니스 프로세스와 IT | Functional / Cross-functional Process · 기능별·범기능 프로세스 | 개선 | ✓ | 카드 | mis-gl-2a-order-fulfillment, mis-gl-2b-automation-redesign, mis-gl-2c-ai-roles | lecture-02 |
| 2장 | 2-1 비즈니스 프로세스와 IT | Automation vs Process Redesign · 자동화와 프로세스 재설계 | 신규 | ✓ | 카드 | mis-gl-2a-order-fulfillment, mis-gl-2b-automation-redesign, mis-gl-2c-ai-roles | lecture-02 |
| 2장 | 2-1 비즈니스 프로세스와 IT | Assist · Automate · Agent · AI가 프로세스에 들어가는 세 수준 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2a-order-fulfillment, mis-gl-2b-automation-redesign, mis-gl-2c-ai-roles | lecture-02 |
| 2장 | 2-2 관리 계층별 정보시스템 | TPS · Transaction Processing System · 거래처리시스템 | 개선 | ✓ | 카드 | mis-gl-2d-management-systems | lecture-02 |
| 2장 | 2-2 관리 계층별 정보시스템 | BI · Business Intelligence · 비즈니스 인텔리전스 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2d-management-systems | lecture-02 |
| 2장 | 2-2 관리 계층별 정보시스템 | MIS · Management Information System · 경영정보시스템 | 개선 | ✓ | 카드 | mis-gl-2d-management-systems | lecture-02 |
| 2장 | 2-2 관리 계층별 정보시스템 | DSS · Decision Support System · 의사결정지원시스템 | 개선 | ✓ | 카드 | mis-gl-2d-management-systems | lecture-02 |
| 2장 | 2-2 관리 계층별 정보시스템 | ESS · Executive Support System · 중역지원시스템 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2d-management-systems | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | Enterprise Applications · 전사 애플리케이션 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | ERP · Enterprise Resource Planning · 전사적 자원 관리 | 개선 | ✓ | 카드 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | Cloud ERP · 클라우드 ERP | 신규 | ✓ | 카드 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | SCM · Supply Chain Management · 공급망 관리 | 개선 | ✓ | 카드 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | CRM · Customer Relationship Management · 고객관계관리 | 개선 | ✓ | 카드 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-3 전사 애플리케이션 | KMS · Knowledge Management System · 지식관리시스템 | 개선 | ✓ | 카드 | mis-gl-2e-enterprise-apps | lecture-02 |
| 2장 | 2-4 인터넷 기반 연결 범위 | Intranet / Extranet · 인트라넷·엑스트라넷 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2f-connection-scope | lecture-02, lecture-01 |
| 2장 | 2-4 인터넷 기반 연결 범위 | E-business / E-commerce / E-government · 전자 비즈니스·전자상거래·전자정부 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2f-connection-scope | lecture-02 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Collaboration · 협업 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Social Business · 소셜 비즈니스 | 개선 | ✓ | 카드 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03, lecture-02 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Human-Agent Team · 사람–AI 에이전트 팀 | 신규 | ✓ | 카드 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Requirements for Collaboration · 협업의 요건 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Collaborative Culture · 협업 문화 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Enterprise Social Networking · 기업용 소셜 네트워킹 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Time/Space Collaboration Matrix · 시간·공간 협업 매트릭스 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-5 협업과 소셜 비즈니스 | Evaluating Collaboration Tools · 협업 도구 평가 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2g-collaboration, mis-gl-2h-time-space | lecture-03 |
| 2장 | 2-6 지식의 성격 | Knowledge as a Firm Asset · 기업 자산으로서의 지식 | 신규 | ✓ | 카드 | mis-gl-2i-knowledge | lecture-03 |
| 2장 | 2-6 지식의 성격 | Data → Information → Knowledge → Wisdom · 지식의 위계 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2i-knowledge | lecture-03 |
| 2장 | 2-6 지식의 성격 | Tacit Knowledge / Explicit Knowledge · 암묵지·형식지 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2i-knowledge | lecture-03 |
| 2장 | 2-6 지식의 성격 | Knowledge Location & Situational Knowledge · 지식의 위치와 상황성 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2i-knowledge | lecture-03 |
| 2장 | 2-6 지식의 성격 | Organizational Learning · 조직 학습 | 개선 | ✓ | 카드 | mis-gl-2i-knowledge | lecture-03 |
| 2장 | 2-6 지식의 성격 | ROI · Return on Investment · 투자수익률 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2i-knowledge |  |
| 2장 | 2-7 지식관리 가치사슬 | Knowledge Management Value Chain · 지식관리 가치사슬 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2j-km-value-chain | lecture-03 |
| 2장 | 2-7 지식관리 가치사슬 | GenAI in the KM Value Chain · 생성형 AI와 지식관리 가치사슬 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2j-km-value-chain | lecture-03 |
| 2장 | 2-7 지식관리 가치사슬 | COP · Communities of Practice · 실천 공동체 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2j-km-value-chain | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Three Types of KMS · 지식관리시스템의 세 유형 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Structured / Semistructured / Unstructured Knowledge · 전사 지식의 세 형태 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | ECM / CMS · Enterprise Content Management · 기업 콘텐츠 관리 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | AI-Ready Content · AI가 쓸 수 있는 콘텐츠 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Expertise Location · 전문가 찾기 | 신규 | ✓ | 카드 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | LMS · Learning Management System · 학습관리시스템 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Knowledge Workers · 지식근로자 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | KWS · Knowledge Work System · 지식작업시스템 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Intelligent Techniques · 지능형 기법 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | AI · ML · NLP · GenAI · AI Agent · 인공지능 용어 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-01, lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | RAG · Retrieval-Augmented Generation · 검색 증강 생성 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-8 KMS 유형과 AI 지식 도구 | Responsible Use of Generative AI · 책임 있는 생성형 AI 사용 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2k-kms-types, mis-gl-2l-ai-ready-rag | lecture-03 |
| 2장 | 2-9 IS 기능과 IT 거버넌스 | IS Department · 정보시스템 부서 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2m-is-function | lecture-03 |
| 2장 | 2-9 IS 기능과 IT 거버넌스 | Systems Analyst · 시스템 분석가 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2m-is-function | lecture-03 |
| 2장 | 2-9 IS 기능과 IT 거버넌스 | C-level Roles · CIO · CISO · CPO · CKO · CDO · CAIO | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2m-is-function | lecture-03 |
| 2장 | 2-9 IS 기능과 IT 거버넌스 | IT Governance · IT 거버넌스 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-2m-is-function | lecture-03 |
| 2장 | 2-9 IS 기능과 IT 거버넌스 | Modern IS Operating Model · 현대 IS 운영 모델 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-2m-is-function | lecture-03 |
| 3장 | 3-1 조직의 정의와 IT와의 관계 | Two-Way Relationship · 조직과 IT의 양방향 관계 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-3a-organization-it, mis-gl-3b-organization-definitions | lecture-04 |
| 3장 | 3-1 조직의 정의와 IT와의 관계 | Technical / Behavioral Definition of Organization · 조직의 기술적·행동적 정의 | 개선 | ✓ | 카드 | mis-gl-3a-organization-it, mis-gl-3b-organization-definitions | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Features of Organizations · 조직의 공통 특징 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Routines (SOPs) · 표준 운영 절차 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Organizational Politics · 조직 정치 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Organizational Culture · 조직 문화 | 개선 | ✓ | 카드 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Organizational Environment · 조직 환경과 환경 탐색 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Disruptive Technology · 파괴적 기술 | 개선 | ✓ | 카드 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-2 조직의 특징과 구조 | Organizational Structure · 조직 구조 (Mintzberg 다섯 유형) | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3c-organization-features | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Economic Impacts of IS · IS의 경제적 영향 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Transaction Cost Theory · 거래 비용 이론 | 개선 | ✓ | 카드 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Agency Theory · 대리인 이론 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Flattening · Span of Control · 납작한 조직과 통제 범위 | 개선 | ✓ | 카드 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Resistance to Change · 변화 저항 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-3 IT가 조직에 미치는 영향 | Internet and Organizations · 인터넷과 조직 / IS 설계 시 조직 요인 | 신규 | ✓ | 카드 | mis-gl-3d-cost-theories, mis-gl-3e-resistance | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Competitive Forces Model · Porter의 경쟁 요인 모형 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Four Generic Strategies · 네 가지 기본 경쟁 전략 | 개선 | ✓ | 카드 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Switching Cost · 전환 비용 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Mass Customization · 대량 맞춤화 | 개선 | ✓ | 카드 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Internet's Impact on Competition · 인터넷이 경쟁에 미친 영향 | 신규 | ✓ | 묶음 그림·해설 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-04 |
| 3장 | 3-4 경쟁 요인과 경쟁 전략 | Smart Products & IoT · 스마트 제품과 사물인터넷 | 개선 | ✓ | 카드 | mis-gl-3f-five-forces, mis-gl-3g-generic-strategies | lecture-01, lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Value Chain Model · 가치사슬 모형 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Value Web · 가치 웹 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Synergy · 시너지 | 개선 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Core Competency · 핵심 역량 | 개선 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04, lecture-03 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Network Economics · 네트워크 경제 | 개선 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Virtual Company · 가상 기업 | 개선 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Business Ecosystem · Keystone / Niche Firm · 비즈니스 생태계 | 개선 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | AI in Competitive Strategy · 경쟁 전략과 AI | 신규 | ✓ | 묶음 그림·해설 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 3장 | 3-5 가치사슬과 네트워크 전략 | Challenges of Strategic IS · 전략적 정보시스템의 과제 | 신규 | ✓ | 카드 | mis-gl-3h-value-chain, mis-gl-3i-network-strategies | lecture-04 |
| 4장 | 4-1 윤리 쟁점의 구조 | Ethics · 윤리 | 개선 | ✓ | 카드 | mis-gl-4a-ethical-ripple | lecture-05 |
| 4장 | 4-1 윤리 쟁점의 구조 | Ethical, Social, Political Issues · 윤리·사회·정치 쟁점의 파장 모형 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4a-ethical-ripple | lecture-05 |
| 4장 | 4-1 윤리 쟁점의 구조 | Five Moral Dimensions · 다섯 가지 도덕적 차원 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4a-ethical-ripple | lecture-05 |
| 4장 | 4-2 데이터 분석 기법과 감시 | Profiling · 프로파일링 | 개선 | ✓ | 카드 | mis-gl-4b-profiling-nora | lecture-05 |
| 4장 | 4-2 데이터 분석 기법과 감시 | NORA · Nonobvious Relationship Awareness · 비명시적 관계 인식 | 개선 | ✓ | 카드 | mis-gl-4b-profiling-nora | lecture-05 |
| 4장 | 4-3 책임 개념과 판단 원칙 | Responsibility · Accountability · Liability · Due Process · 책임의 네 고리 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4c-responsibility-chain, mis-gl-4d-ethical-principles | lecture-05 |
| 4장 | 4-3 책임 개념과 판단 원칙 | Ethical Analysis · 윤리적 분석 다섯 단계 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4c-responsibility-chain, mis-gl-4d-ethical-principles | lecture-05 |
| 4장 | 4-3 책임 개념과 판단 원칙 | Ethical Principles · 여섯 가지 윤리 원칙 | 개선 | ✓ | 카드 | mis-gl-4c-responsibility-chain, mis-gl-4d-ethical-principles | lecture-05 |
| 4장 | 4-3 책임 개념과 판단 원칙 | Ethical Dilemmas · Professional Codes · 윤리적 딜레마와 전문직 행동 강령 | 개선 | ✓ | 카드 | mis-gl-4c-responsibility-chain, mis-gl-4d-ethical-principles | lecture-05 |
| 4장 | 4-4 프라이버시와 정보 권리 | Privacy · 프라이버시 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4e-privacy-fip, mis-gl-4f-consent-tracking | lecture-05 |
| 4장 | 4-4 프라이버시와 정보 권리 | FIP · Fair Information Practices · 공정 정보 관행 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4e-privacy-fip, mis-gl-4f-consent-tracking | lecture-05 |
| 4장 | 4-4 프라이버시와 정보 권리 | GDPR · General Data Protection Regulation · EU 일반 개인정보 보호 규정 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4e-privacy-fip, mis-gl-4f-consent-tracking | lecture-05 |
| 4장 | 4-4 프라이버시와 정보 권리 | Informed Consent · Opt-in / Opt-out · 동의 방식 | 개선 | ✓ | 카드 | mis-gl-4e-privacy-fip, mis-gl-4f-consent-tracking | lecture-05 |
| 4장 | 4-4 프라이버시와 정보 권리 | Cookies & Tracking · 쿠키와 온라인 추적 기술 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4e-privacy-fip, mis-gl-4f-consent-tracking | lecture-05 |
| 4장 | 4-5 지식재산 | Intellectual Property · 지식재산과 네 가지 보호 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4g-intellectual-property | lecture-05 |
| 4장 | 4-5 지식재산 | DMCA · Digital Millennium Copyright Act · 디지털 밀레니엄 저작권법 | 개선 | ✓ | 카드 | mis-gl-4g-intellectual-property | lecture-05 |
| 4장 | 4-6 책임과 시스템 품질 | Computer-Related Liability · Section 230 · 소프트웨어 책임과 플랫폼 책임 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4h-liability-quality | lecture-05 |
| 4장 | 4-6 책임과 시스템 품질 | System Quality · Data Quality · 시스템 품질과 데이터 품질 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4h-liability-quality | lecture-05 |
| 4장 | 4-7 삶의 질 | Quality of Life · 삶의 질에 미치는 부정적 영향 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4i-quality-of-life | lecture-05 |
| 4장 | 4-7 삶의 질 | Computer Crime / Computer Abuse · 컴퓨터 범죄와 남용 | 개선 | ✓ | 카드 | mis-gl-4i-quality-of-life | lecture-05 |
| 4장 | 4-7 삶의 질 | Digital Divide · 디지털 격차 | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4i-quality-of-life | lecture-05 |
| 4장 | 4-7 삶의 질 | Health Risks · RSI · CTS · CVS · Technostress | 개선 | ✓ | 묶음 그림·해설 | mis-gl-4i-quality-of-life | lecture-05 |

## 4. 공백 점검(1–5강 대조)

1–5강의 슬라이드 단위 H2 절 185개 가운데 lecture-00이 링크하지 않는 절은 학습목표·장 소개 절(1장 Slides 1–3, 2장 Slide 2, 3장 Slides 1–2, 4장 Slides 1–2)뿐이다. 이 절들에는 따로 정의할 개념이 없다. (점검 방법: 각 강의 `Slide…` H2 앵커가 lecture-00 링크에 있는지 비교)

## 5. 앵커 변경

이전 용어집의 H3 번호 절(`#1-정보시스템-기본-개념` … `#24-시스템-품질책임삶의-질`)과 `#시험에서-특히-헷갈리는-용어-최종-비교`는 새 구조로 바뀌어 더 이상 없다. 저장소 안에서 이 앵커를 가리키는 링크는 없었다. 유지한 앵커: `#이-정리집을-쓰는-법`, 네 장 제목(`#1장--정보시스템과-비즈니스-가치` 등), `#장별-총정리`. URL·frontmatter의 `title`·`order`·`published`는 그대로다.
