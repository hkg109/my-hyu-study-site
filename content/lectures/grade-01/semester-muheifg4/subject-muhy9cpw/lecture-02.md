---
title: "Chapter 2A · Follow the process, then choose the system"
description: "Order fulfillment → TPS/MIS/DSS/ESS → ERP/SCM/CRM/KMS. Read the shared 17th/18th-edition foundations through one connected business example."
order: 2
published: true
duration: 55
tags: [MIS, Chapter 2, Business processes, TPS, ERP]
objectives:
  - Trace a cross-functional process and distinguish automation from redesign.
  - Choose TPS, MIS, DSS, or ESS by the decision being supported.
  - Explain how enterprise applications coordinate work across boundaries.
---

## Reading route · The first half of Chapter 2

[한국어](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-02) · [Previous: Chapter 1](/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/lecture-01) · [Next: Chapter 2B](/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/lecture-03)

Chapter 1 explained **why information systems matter**. Now ask **where they work**. This note covers the shared process and system foundations; Chapter 2B continues with collaboration, knowledge, and the IS function. The two notes together cover Chapter 2, without repeating it as separate edition summaries.

| Stop | 18th book / PDF | 17th book / PDF | Reading task |
| --- | --- | --- | --- |
| Opening case | 36–38 / 65–67 | 71–73 / 72–74 | Identify a coordination problem |
| Processes: §2.1 | 38–40 / 67–69 | 73–76 / 74–77 | Trace Figure 2.1 across departments |
| Management groups: §2.2 | 40–45 / 69–74 | 76–81 / 77–82 | Match questions to systems |
| Enterprise applications: §2.3 | 45–47 / 74–76 | 81–84 / 82–85 | Find the boundary each system connects |
| E-business terminology | Compare enterprise context | 84–85 / 85–86 | Separate digital business from online selling |

**Source:** the supplied 18th edition and 17th Global Edition of *Management Information Systems*. Book/PDF numbers refer to these files: 18th PDF = book + 29; 17th PDF = book + 1. The café examples and practice answers are original learning aids.

## Exam PDFs · Chapter 2 sequence, part A (final slides 1–29)

[Open the original 61-slide deck](/materials/mis-exam-slides/ch02_17ed.pdf) · [Open the expanded 73-slide final deck](/materials/mis-exam-slides/ch02_17ed_final.pdf)

> [!EXAM]
> **Chapter 2A in one line:** map the process → match the system to management level and decision structure → use ERP, SCM, CRM, and KMS to cross functional and organizational boundaries.

### Note board · two axes for choosing a system

`Who decides (operational/middle/senior) × how repeatable is the decision (structured/nonroutine)`

| System | Main user | Decision | Main input | Typical output |
| --- | --- | --- | --- | --- |
| TPS | Operations | Routine, structured | Daily transactions | Payroll, order, shipment record |
| MIS | Middle management | Routine reporting | TPS summaries | Actual-versus-plan report |
| DSS | Middle management | Analytical, nonroutine | Internal/external data + model | Scenario and alternative comparison |
| ESS | Senior management | Strategic, nonroutine | MIS/DSS summaries + external events | KPI, trend, forecast dashboard |

==blue:Moving upward, transaction detail is summarized while judgment, external information, and the time horizon increase.==

The final deck preserves the original sequence and adds 12 current-update slides. Original slides 1–8 map to final 1–8; 9–21 to 10–22; 22 to 24; 23–28 to 26–31; 29–30 to 33–34; 31–34 to 36–39; 35–42 to 41–48; 43–50 to 50–57; 51–58 to 59–66; 59–60 to 68–69; and 61 to 71. Final slides 9, 23, 25, 32, 35, 40, 49, 58, 67, 70, 72, and 73 are the added updates. Thus both supplied Chapter 2 PDFs are covered without repeating the unchanged slides.

| Final slides | What appears in order |
| --- | --- |
| 1–9 | Video cases and objectives → Sharp social-network case → processes and order fulfillment → automation/redesign → AI process roles |
| 10–19 | TPS → payroll → BI → MIS and its TPS inputs/report → DSS → voyage model → ESS and its MIS/DSS relationship |
| 20–27 | Enterprise application architecture → ERP/cloud ERP → SCM/Walmart → CRM → KMS |
| 28–29 | Intranets/extranets → e-business, e-commerce, and e-government |

### Slides 1–9 · from a business process to an AI-enabled process

#### Note skeleton

`Customer need → connected tasks across functions → material/information/knowledge flow → result → performance measure`

- **Automation:** keep the process shape and let a system perform a repeatable manual step.
- **Redesign:** change information flow, sequence, authority, or the business model.
- **Assist:** a person owns the process; AI retrieves, summarizes, drafts, or recommends.
- **Automate:** rules/models complete routine work; people handle exceptions.
- **Agent:** AI calls tools within defined permission, monitoring, review, and escalation boundaries.

> [!CAUTION]
> Tool-calling does not justify unlimited autonomy. Specify permitted scope, stop conditions, human handoff, logs, and outcome accountability.

#### Explanation

The deck begins with Walmart Retail Link, Cemex social business, and US Foodservice CRM video cases, then states ten objectives spanning processes, management systems, enterprise applications, collaboration/social business, tool evaluation, knowledge management, the IS function, and careers. Sharp Corporation supplies the opening problem: hierarchical top-down work, new competitors, and weak idea sharing. Its response combines a knowledge-sharing strategy, redesigned collaboration processes, cultural change, and Yammer. The point is not that software alone caused innovation; teamwork, culture, process, and technology worked together.

A business process is a logically related set of tasks carrying material, information, and knowledge. It can stay inside a function or cross functions and can be an asset or a liability when outdated work slows response. Manufacturing/production assembles and checks quality; sales/marketing identifies and sells to customers; finance/accounting prepares statements and pays creditors; HR hires and evaluates staff. Figure 2.1 shows order fulfillment crossing sales, accounting, and manufacturing, so local speed is insufficient if handoffs fail.

IT can automate an existing manual step or enable a different process by changing information flow, running formerly sequential steps in parallel, removing decision delay, and supporting a new business model. Final slide 9 adds three AI roles: **assist**, where a person performs the process and AI retrieves, summarizes, drafts, or recommends; **automate**, where rules/models complete repeatable steps and people handle exceptions; and **agent**, where AI executes a defined workflow through tools under permissions, monitoring, review, and escalation.

### Slides 10–19 · match the system to the management question

#### Reverse-map the question

- “Was today's payroll completed?” → {{TPS}}
- “How did quarterly product sales compare with plan?” → {{MIS}}
- “What happens to production if demand doubles?” → {{DSS}}
- “How may the business and its KPIs change in five years?” → {{ESS}}

> [!DEFINITION]
> **BI** is the broad data-and-analysis capability. MIS, DSS, and ESS apply it to different management questions. Also distinguish the academic field called MIS from the specific reporting-system category called MIS.

#### Figure notes

- **Figure 2.2:** time card → payroll processing → employee, management, and external outputs.
- **Figures 2.3–2.4:** several TPS → period summary → MIS report; actual/plan `> 1` exceeds plan and `< 1` misses it.
- **Figure 2.5:** vessel, port, fuel, charter, and expense data + analytical model → bid, vessel, loading, and speed alternatives.

#### Explanation

**TPS** serves operational staff and managers by performing and recording routine daily transactions such as order entry, payroll, and shipping. It answers predefined, structured questions and exposes operational status and external relationships. Figure 2.2 follows a time card into payroll processing, paychecks, management reports, and legally relevant outputs; accuracy matters beyond the firm.

**Business intelligence** is the data and software capability used to organize and analyze information. Within that broad capability, **MIS**, **DSS**, and **ESS** support different questions. Here “MIS” is the specific middle-management reporting system, not the name of the whole academic field. It summarizes TPS data, answers routine questions through predefined procedures, and usually has limited analytical flexibility. Figures 2.3–2.4 show several TPS feeding a reporting system and a product/region sales report in which actual-to-plan values above 1.00 exceed the plan and values below 1.00 miss it.

**DSS** also serves middle management but supports nonroutine, analytical questions such as the production impact of doubled December sales. It can combine internal TPS/MIS data with external data. Model-driven DSS applies analytical models; data-driven DSS finds patterns in large datasets. Figure 2.5's voyage-estimating system combines vessel, port, fuel, charter, and expense inputs to choose bids, vessels, loading, and travel rates.

**ESS** serves senior management where judgment, evaluation, and insight are needed and no agreed procedure exists. It combines external events with summarized MIS/DSS information, often through a simple portal or KPI dashboard showing items such as working capital, cash flow, and inventory. ESS depends on accurate MIS and DSS rather than standing alone; its display must make the most critical information quickly accessible.

### Slides 20–27 · connect functions and organizations

#### Enterprise-application map

| System | Boundary connected | Central question | Failure risk |
| --- | --- | --- | --- |
| ERP | Internal functions and levels | Can operations share data and process? | Bad standardization, migration error, resistance |
| SCM | Supplier, purchasing, production, logistics | Can the right quantity move quickly and cheaply? | Partner data/process mismatch |
| CRM | Sales, marketing, service, customer | Can the complete relationship improve retention and revenue? | Fragmented touchpoints, bad customer data |
| KMS | Employees, experts, external knowledge | Can know-how be captured and applied where needed? | Isolated, lost, or stale knowledge |

**Cloud ERP pair:** standardized process/shared data/API/continuous update/embedded AI **versus** subscription, migration, integration, skills, and vendor-dependence risk.

**Walmart SCM loop:** `sense → predict → act → learn → control`. Without control, faster automation can spread an error faster.

> [!EXAM]
> ERP is not the name for SCM, CRM, and KMS together. **Enterprise applications** is the umbrella; ERP/enterprise systems are one type centered on shared internal data and processes.

#### Explanation

Enterprise applications span functions, processes, management levels, and sometimes organizational boundaries. Figure 2.6 places ERP/enterprise systems, SCM, CRM, and KMS around sales, manufacturing, finance, HR, customers, and suppliers. The purpose is shared information and cross-functional execution, not merely a larger database.

An **enterprise system/ERP** collects functional data in a central repository, resolves fragmentation, coordinates daily activity, improves order response and accuracy, and gives managers an organization-wide operating and planning view. Final slide 23 updates the architecture to cloud ERP: standardized processes, shared data, APIs, analytics, continuous service updates, and embedded copilots/agents. Subscription cost, configuration, migration, integration, skills, and vendor dependence still require governance.

**SCM** coordinates suppliers, purchasing firms, distributors, and logistics using shared order, production, and inventory information to move the right quantity from source to consumption quickly and cheaply. It is interorganizational and must fit partners' processes. The updated Walmart sequence is **sense** operational signals, **predict** demand and likely problems, **act** by redirecting inventory, **learn** from reusable components and local feedback, and **control** data quality, access, exceptions, measures, and accountability.

**CRM** integrates sales, marketing, and service interactions to optimize revenue, satisfaction, retention, profitable relationships, and sales. **KMS** captures and applies internal expertise, makes it available where work and decisions need it, and links to external knowledge. Without it, know-how can remain in individual minds or disappear. The next note returns to knowledge management in depth.

### Slides 28–29 · name the digital boundary correctly

#### Scope note

`Intranet (employees) → extranet (authorized partners) → e-business (all major digital processes) ⊃ e-commerce (online buying/selling)`

> [!QUIZ]
> A company gives suppliers restricted access to inventory and gives customers online purchasing. Name each activity.

> [!ANSWER]
> Supplier-only access is an **extranet**; online buying and selling is **e-commerce**. Both may sit inside the broader **e-business** use of digital technology across processes.

#### Explanation

An **intranet** is an employee-only network or site using Internet standards; an **extranet** exposes authorized areas to vendors or suppliers, often for supply-chain coordination. The labels are less common now, but the access boundary remains useful. **E-business** is the broad use of digital and Internet technologies across major business processes; **e-commerce** is the buying/selling subset; **e-government** applies Internet technology to public information and services for citizens, employees, and businesses.

## 1. Follow one customer order

Suppose the café accepts a prepaid lunch order. Sales records the order, the payment process confirms it, kitchen staff prepare the food, and the pickup team hands it over. An apparently simple customer action crosses several responsibilities.

> [!DEFINITION]
> A **business process** is an organized set of related activities that produces a business result. It includes the flow of information, materials, and knowledge, as well as how participants coordinate their work.

**Order received → payment/credit checked → product prepared → delivery arranged → invoice and customer follow-up.** This is a simplified study sequence. Compare it with the book's **Figure 2.1, The Order Fulfillment Process**: 18th book p.39 / PDF 68; 17th book p.75 / PDF 76.

At each arrow ask: *What must the next participant know? Who supplies it? What causes waiting?* The diagram is useful because it reveals dependencies, not because it gives you a list of departments to memorize.

| Functional area | Typical process | Link to another function |
| --- | --- | --- |
| Sales and marketing | Identify customers and generate orders | Accounting needs payment information |
| Manufacturing and production | Assemble and check products | Sales needs availability and completion status |
| Finance and accounting | Manage cash, pay creditors, report finances | Purchasing needs spending constraints |
| Human resources | Hire and assess employees | Operations needs trained staff |

A **cross-functional process** crosses internal departments. An **interorganizational process** also crosses firm boundaries, such as coordinating with a delivery partner. One process can be both.

### Improve a step or change the flow?

**Automation** makes an existing activity faster or more reliable, such as calculating an invoice. **Redesign** changes the arrangement of activities: shared order data can allow independent checks to run simultaneously, eliminate re-entry, or enable a new service. Faster execution of a poorly designed process can preserve its underlying problem.

> [!QUIZ]
> 2A Q1. A shop replaces a handwritten invoice with an automatically calculated PDF, but staff still retype each order into three systems. What improved, and what remains unresolved?

> [!ANSWER]
> Invoice calculation was automated. Duplicate entry and fragmented information flow remain. Redesign might establish a shared order record and revise the handoffs between functions. The benefit should be evaluated through errors and cycle time, not file format alone.

## 2. Different decisions need different information

Read §2.2. The same sale can support several purposes, but it must be transformed differently for each. Start with the **question**, then name the system.

| System | Main purpose and typical user | Café question | Typical input/output |
| --- | --- | --- | --- |
| TPS · Transaction Processing System | Routine operations; operational staff/managers | Was order 104 paid? | Individual transaction → updated record or receipt |
| MIS · Management Information System | Routine performance reporting; middle management | How did actual weekly sales compare with plan? | Aggregated TPS data → periodic/exception report |
| DSS · Decision Support System | Analysis of less routine problems; managers/analysts | What if supplier prices rise and demand falls? | Data plus models/assumptions → scenario comparison |
| ESS · Executive Support System | Strategic, long-term judgment; senior management | Should we expand to another region? | Internal summaries plus external trends → strategic view |

> [!CAUTION]
> **MIS has two meanings.** It names the field studied in this course and a narrower reporting-system category. In a TPS/MIS/DSS/ESS comparison, use the narrower meaning. **BI (business intelligence)** is a broad set of data and analytical capabilities; it is not simply another name for MIS or ESS.

### Watch the data move

**TPS records → MIS summaries → managerial monitoring.** DSS can combine operational data, external information, and models. ESS can draw on MIS/DSS outputs plus external events. This is not a compulsory four-stage pipeline: systems can share data in several directions.

Inspect **Figure 2.3** (18th book p.42 / PDF 71). Trace order, production, and accounting records into reports. Then compare the **sample MIS report, Figure 2.4**, on the same page: the important transformation is from individual transactions to performance against a plan.

A DSS changes the question from “what happened?” to “what might happen under these assumptions?” The answer is conditional. An ESS supports judgment on long-term uncertainty; it does not remove the need for judgment. Dashboards can serve multiple levels, so appearance alone does not identify the system category.

> [!EXAMPLE]
> **Original mini-calculation:** suppose the café sells 100 lunches at 8,000 won each, with a variable cost of 5,000 won per lunch. The contribution before fixed costs is 300,000 won. A DSS could compare a 10% price reduction: at unchanged volume, contribution falls to 220,000 won. Maintaining 300,000 won would require about 137 lunches at the new 2,200-won contribution per lunch. This is a conditional scenario, not a forecast that demand will rise.

> [!QUIZ]
> 2A Q2. Classify these requests and justify each: (a) record a refund, (b) report weekly refunds by branch, (c) simulate a new refund policy, (d) assess a five-year shift toward subscription services.

> [!ANSWER]
> (a) **TPS:** records a routine transaction. (b) **MIS:** summarizes performance using a predefined report. (c) **DSS:** compares alternatives under assumptions. (d) **ESS:** supports a long-term strategic judgment using internal and external information. A real product may provide several of these capabilities.

## 3. Integration connects the enterprise

Good departmental systems can still produce poor company performance. Sales may promise stock that production has already allocated, or accounting may use a customer code that service staff cannot match. §2.3 introduces **enterprise applications** to coordinate processes, decisions, and knowledge across functions and levels.

| Application | Center of attention | Information it connects | Café chain example |
| --- | --- | --- | --- |
| ERP · Enterprise Resource Planning | Integrated internal business processes | Orders, inventory, finance, production, HR | A sale updates inventory and accounting consistently |
| SCM · Supply Chain Management | Flows among suppliers, firm, and distribution partners | Demand, sourcing, production, delivery | Share replenishment needs and delivery schedules |
| CRM · Customer Relationship Management | The customer relationship across touchpoints | Sales, marketing, service interactions | Service staff see an earlier complaint and purchase history |
| KMS · Knowledge Management System | Creation, sharing, and use of knowledge | Documents, experience, expertise | Branches reuse a tested method for reducing waste |

==blue:TPS/MIS/DSS/ESS classify the decision need; ERP/SCM/CRM/KMS classify the process or relationship being connected.== The two tables describe different dimensions. An ERP can process transactions and supply management reports. A CRM can support both routine customer records and analytical decisions.

ERP uses integrated software and shared data to reduce fragmentation. It requires agreement on data definitions and processes. Installing one package does not automatically make departments agree about what counts as a completed order.

SCM focuses on coordinating supply rather than merely buying cheaply. A low purchase price may lose its value if deliveries are unreliable. CRM focuses on consistent customer understanding rather than merely a contact list. KMS focuses on usable organizational knowledge rather than indiscriminate file accumulation; Chapter 2B develops this further.

> [!QUIZ]
> 2A Q3. A customer complains three times, but each representative asks for the full story again. Is an ERP automatically the best answer? What must you investigate?

> [!ANSWER]
> The immediate need points toward **CRM**, because service interactions are fragmented. Investigate shared customer identifiers, access to past cases, responsibility for follow-up, and links to order information. ERP integration may also help, but naming a package without diagnosing the process is insufficient.

## 4. Name the boundary and the scope

An **intranet** supports internal access using Internet technologies. An **extranet** gives authorized external partners access to selected resources. Neither means the data are openly available to everyone. These networks can support enterprise applications but are not themselves synonyms for ERP or SCM.

The 17th edition explicitly develops the following terms on book pp.84–85. Keep this material when studying both editions.

| Term | Scope | Example |
| --- | --- | --- |
| E-business | Digital technology supporting major business processes | Supplier coordination plus internal scheduling and online selling |
| E-commerce | Buying and selling through digital networks | A customer places and pays for an order online |
| E-government | Digital delivery of government information and services | Online access to a municipal service |

**E-commerce is part of e-business.** An organization can use digital tools internally even if it does not sell products online. Government services are not defined merely by whether payment occurs.

## 5. Read the opening cases with a process lens

In the **18th edition**, Toyota Motor North America uses Microsoft Teams and AI in a collaboration setting (book pp.36–38). In the **17th edition**, Sharp's case concerns enterprise social networking (pp.71–73). Start with the coordination and knowledge-sharing problem, then identify the new information flow. Chapter 2B will examine the human conditions for these changes to work.

For the **17th-edition Mississauga case** (book p.85), identify the service recipient, the process, and the information required. Ask whether the value comes from a digital interface, a redesigned back-office process, or both. Use the text to support your answer instead of assuming all public digital services succeed.

> [!EXAM]
> A strong system-selection answer has four parts: **business question → system category → required information → expected improvement**. Add a condition or limit when relevant. “Use ERP because it is integrated” is weaker than identifying the conflicting records it must reconcile.

## 6. Retrieval practice

- A process crossing sales and accounting is {{cross-functional}}.
- A routine payment record is primarily handled by a {{TPS}}.
- Changing assumptions to compare alternatives is a typical {{DSS}} use.
- Online buying and selling is {{e-commerce}}, within the broader scope of e-business.

> [!FLASHCARD]
> Q: Chapter 2A — What separates MIS from DSS in this classification?
> A: MIS typically reports on predefined recurring questions; DSS supports less routine analysis using models or flexible data analysis.

> [!FLASHCARD]
> Q: Chapter 2A — Why can an ERP also have TPS functions?
> A: ERP describes integrated business-process scope; TPS describes routine transaction processing. These classifications are compatible.

> [!FLASHCARD]
> Q: Chapter 2A — What is the key difference between an intranet and an extranet?
> A: An intranet serves internal access; an extranet extends selected access to authorized outsiders.

> [!QUIZ]
> 2A Q4. The café chain has accurate sales records but frequent stockouts. Propose a chain from data to action using at least three system categories, then state one organizational condition.

> [!ANSWER]
> TPS captures sales and stock movements; MIS reports stockouts and demand patterns; DSS compares replenishment options; SCM shares chosen schedules with suppliers. One possible condition is that branch staff record stock movements consistently and someone has authority to act on the analysis. Merely having accurate sales data does not establish reliable replenishment.

**Before moving on:** redraw an order flow, explain the two classification tables without mixing their axes, and distinguish automation from redesign. Continue to [Chapter 2B · Collaboration and knowledge](/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/lecture-03).
