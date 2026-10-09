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
