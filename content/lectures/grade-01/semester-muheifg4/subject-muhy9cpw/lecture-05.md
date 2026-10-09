---
title: "Chapter 4 · Evaluate the rights, risks, and responsibilities of IS"
description: "A practical reading companion to five moral dimensions, ethical analysis, privacy, intellectual property, system quality, accountability, and quality of life."
order: 5
published: true
duration: 80
tags: [MIS, Chapter 4, Ethics, Privacy, Intellectual property, Accountability]
objectives:
  - Classify a case using the five moral dimensions of information systems.
  - Apply the five-step ethical analysis and compare ethical principles.
  - Distinguish privacy, property, quality, and accountability issues.
  - Connect a business benefit to its social consequences and possible safeguards.
---

## Reading route · A valuable system can still create harm

[한국어](/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-05) · [Previous: Chapter 3](/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/lecture-04) · [Return to Chapter 1](/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/lecture-01)

Chapter 3 asked whether an IS creates competitive advantage. Chapter 4 adds another question: **whose rights, opportunities, or well-being might be affected by the way it creates that value?** Efficiency is one consideration, not the entire ethical evaluation.

**Source:** the supplied *Management Information Systems*, **18th edition, Chapter 4**. The supplied 17th-edition file contains no Chapter 4 body. **Book = printed page; PDF = book + 29.** Legal examples below describe the textbook's framework and context; they are not an update on current legislation or court cases.

| Stop | Book / PDF | Reading question |
| --- | --- | --- |
| Tracking-app opening case | 109–110 / 138–139 | What benefit and what privacy cost coexist? |
| §4.1: issues and five dimensions | 111–116 / 140–145 | Why do institutions struggle to keep pace? |
| §4.2: ethical analysis and principles | 116–118 / 145–147 | How can a decision be justified? |
| §4.3: information rights and privacy | 119–124 / 148–153 | Who can collect, combine, and use personal data? |
| §4.4: intellectual property | 124–128 / 153–157 | What is protected, and what changes with digital copying? |
| §§4.5–4.6: quality and accountability | 128–133 / 157–162 | How good must a system be, and who answers for harm? |
| §4.7: quality of life | 133–137 / 162–166 | How are work, opportunity, power, and health affected? |
| Career, closing case, review | 137–143 / 166–172 | Apply the framework to a complete case |

## 1. Start with a tension, not a slogan

Our **invented café case** now adds a loyalty app. Location data help predict arrivals and reduce queues. The same data could reveal routines or be reused for unrelated advertising. The benefit does not erase the risk, and the risk does not by itself identify the best design.

The textbook's opening case, **Apps That Track: A Double-Edged Sword**, puts this tension in a broader setting. While reading, distinguish data collection, later sharing, and inferences drawn from combined records. A user can understand the first without understanding the other two.

**Ethical issues** concern choices about what ought to be done. **Social issues** concern shared expectations and institutions. **Political issues** concern rules, rights, and enforcement. New technology can change what is possible faster than norms and laws adapt—the chapter's ripple model explains their interaction.

> [!DEFINITION]
> The five moral dimensions are **information rights and obligations; property rights and obligations; system quality; accountability and control; quality of life**. They are lenses for analysis, not five mutually exclusive boxes.

| Dimension | Question to ask about the café app |
| --- | --- |
| Information rights | Is location collection necessary and understandable to the customer? |
| Property rights | Who owns or licenses the code, images, and training material used? |
| System quality | What happens if an arrival prediction is inaccurate? |
| Accountability and control | Who approves data reuse and handles complaints or errors? |
| Quality of life | Are people excluded, monitored, pressured, or disadvantaged? |

### Why technology makes these questions more urgent

More computing power increases dependence on systems. Cheap storage enables extensive histories. Data analysis combines fragments into profiles. Networks spread information rapidly. Mobile devices add persistent location signals. AI can infer, generate, or recommend at scale while making the basis of a decision difficult to inspect.

**Profiling** combines information into a picture of a person. **NORA (nonobvious relationship awareness)** looks for connections across datasets that are not obvious within one source. A set of individually mundane facts can become sensitive when combined. Study the chapter's NORA discussion and diagram around book pp.114–115, rather than assuming that removing a name always prevents identification.

> [!QUIZ]
> 4 Q1. A company says, “Customers get shorter queues, so collecting continuous location data is ethical.” What is missing from the argument?

> [!ANSWER]
> It names a benefit but does not evaluate necessity, proportionality, informed choice, later uses, retention, security, affected groups, or less intrusive alternatives. For example, a customer-triggered arrival signal may support pickup without continuous tracking. The best conclusion requires facts and comparison, not the benefit alone.

## 2. Separate four kinds of responsibility

Read book p.116 closely. These terms are related but answer different questions.

| Term | Meaning in the chapter | Design implication, invented |
| --- | --- | --- |
| Responsibility | Accepting duties and consequences of one's choices | A manager owns a deployment decision |
| Accountability | Mechanisms identify actions and responsible actors | Decision records and named owners |
| Liability | A legal framework allows recovery for harm | Questions of legally assigned compensation |
| Due process | Known rules and a route to appeal their application | A person can challenge an adverse decision |

A log may help establish accountability, but it does not automatically settle legal liability. An appeals form is not useful if nobody is authorized to review a decision. A statement that “the AI decided” does not identify who selected, approved, or operated the system.

## 3. Work through an ethical analysis

The chapter offers a **five-step process**. Use it before applying a favorite ethical rule.

1. **Establish the facts:** what happened, to whom, under what conditions? Separate verified facts from assumptions.
2. **Identify the dilemma and values:** for example, convenience and operational efficiency versus privacy and autonomy.
3. **Identify stakeholders:** include customers, employees, managers, partners, and those indirectly affected.
4. **Identify feasible options:** include redesign, a narrower data scope, a manual alternative, or postponement for evaluation.
5. **Examine consequences:** consider distribution, severity, likelihood, and what happens if the choice is repeated.

For the café app, the options are not limited to “track everyone” or “close the business.” Alternatives might include optional check-in, approximate arrival windows, or short-lived data use. These are **original design examples**, not prescriptions quoted from the book.

### Compare the six ethical principles

| Principle | Test it asks you to apply | Question for the café |
| --- | --- | --- |
| Golden Rule | Consider being on the receiving side | Would I accept the same tracking as a customer? |
| Kant's categorical imperative | Consider whether the action could be acceptable for everyone | Could every business adopt this rule consistently? |
| Slippery slope rule | Consider repeated application over time | Would repeated expansions of data collection remain acceptable? |
| Utilitarian principle | Seek the greater overall value | Have benefits and harms to all affected groups been considered? |
| Risk aversion principle | Avoid choices with severe potential harm | Is a small convenience worth a potentially serious exposure? |
| Ethical no-free-lunch rule | Assume valuable creations have an owner unless stated otherwise | What permission or license supports reuse of this material? |

The principles are lenses, not an algorithm guaranteed to deliver the same answer. A strong response makes its value judgment visible, considers competing claims, and explains the chosen option.

Professional codes articulate obligations associated with expertise. Organizational **governance codes** translate principles into roles, policies, technical controls, and monitoring. “Respect privacy” becomes operational only when someone determines scope, access, review, and correction.

> [!QUIZ]
> 4 Q2. How do the categorical imperative and slippery slope rule differ? Apply both to a one-time exception allowing broader data use.

> [!ANSWER]
> The categorical imperative asks whether the rule could be acceptable for everyone. The slippery slope rule asks what happens if the action is repeated over time. An exception may appear minor once yet become unacceptable as repeated exceptions normalize broader use. Both require more reasoning than “we only did it once.”

## 4. Follow personal information across boundaries

Read §4.3. **Privacy** concerns people's interests in freedom from unwanted intrusion and in how information about them is handled. Privacy and security overlap but are not identical: a well-secured database can still support an inappropriate use.

| Mechanism or concept | What to understand |
| --- | --- |
| Cookies | Small data stored by a browser that can support sessions, preferences, or recognition; use and context matter |
| Web beacons and tracking mechanisms | Can record interactions such as viewing content and connect behavior to other records |
| Behavioral targeting | Uses observed or inferred behavior to tailor advertising |
| Informed consent | Requires understanding relevant uses, not merely encountering a button |
| Opt-in / opt-out | Prior affirmative choice versus use unless the person declines; distinguish the default |
| Data combination | Can produce new sensitive inferences beyond each individual record |

The textbook introduces **Fair Information Practices (FIP)** around book pp.119–120. Use the categories as a reading checklist: **notice/awareness, choice/consent, access/participation, security/integrity, enforcement**. Ask what each would mean in an actual workflow.

It contrasts U.S. sector-specific protections with the broader European GDPR framework and discusses AI-related privacy concerns. Study the principles and jurisdictional context in the supplied edition. Do not infer that a short textbook summary resolves every legal case or reflects subsequent changes.

**Technical measures** such as controlling tracking, permissions, or identification can support privacy, but technical settings do not replace decisions about purpose and access. AI adds questions about inference, training data, and the reuse of information supplied through prompts.

> [!QUIZ]
> 4 Q3. Employees can access customer records only after authentication, but the company reuses those records for an undisclosed purpose. Has authentication solved the privacy problem?

> [!ANSWER]
> No. Authentication controls access and supports security. Privacy also concerns the purpose, expectations, scope, and conditions of use. Authorized access can still enable an inappropriate use. Analyze both dimensions instead of treating security as sufficient.

## 5. Identify what kind of intellectual property is involved

Read §4.4. Digital content is easy to copy and distribute, while copies may be difficult to distinguish from originals. The chapter discusses four forms of protection.

| Form | Main subject in the textbook | Avoid this confusion |
| --- | --- | --- |
| Copyright | Creative expression | An expression and the underlying general idea are different |
| Patent | Inventions meeting relevant requirements | Not every useful idea automatically has a patent |
| Trademark | Source-identifying names, symbols, and branding | A brand identifier differs from the work's expressive content |
| Trade secret | Valuable business information kept confidential | Public availability and secrecy are different conditions |

The chapter also discusses the **DMCA** in the digital-rights context. For study, connect this to the problem of copying and technological protections; do not treat a concept list as permission to reuse any particular work.

AI-related questions appear on both the **input** and **output** sides: what material is used for training, what the output reproduces, what human contribution exists, whether branding causes confusion, and whether confidential information is disclosed. Keep these distinct rather than treating “AI copyright” as one question with one universal answer.

## 6. Quality and accountability must be designed together

Read §§4.5–4.6. The chapter identifies three major sources of poor system performance: **software errors, hardware/facility failures, and poor input data**. Perfect code would not correct an inaccurate customer record.

System quality raises the question of acceptable reliability given costs and consequences. An error in a café recommendation and an error in a safety-critical decision have different stakes. The textbook's point is to analyze foreseeable harm and feasible quality, not to declare every remaining error acceptable.

Accountability asks what happens when something goes wrong. Software and platform examples, including the **Section 230 case** on book pp.130–131, show that responsibility for content and actions can be contested. AI can make causal explanation harder through opacity and multiple participating organizations.

> [!EXAMPLE]
> **Original control example:** if an automated loyalty decision wrongly excludes a customer, retain the relevant record, identify an owner, offer human review, correct the record, and check for repeated errors. These steps connect quality to accountability; they do not determine legal liability by themselves.

**Computer crime** concerns unlawful acts involving computers or systems. **Computer abuse** concerns unethical acts that may not be illegal. Spam illustrates why social harm, organizational burden, and legal treatment need to be distinguished. **Legal and ethical are related but not identical categories.**

## 7. Look beyond the individual transaction

Read §4.7. A system can improve firm-level performance while shifting costs to workers, customers, or communities.

| Quality-of-life issue | Causal question | Café extension, invented |
| --- | --- | --- |
| Concentration of power | Who controls data, infrastructure, and access? | A small business depends on one ordering platform |
| Digital divide | Who lacks access, skills, or usable design? | App-only ordering excludes some customers |
| Employment and automation | Which tasks change, and who can transition? | Scheduling software changes staff roles |
| Pace of change | Can people and organizations adapt in time? | Constant process changes overwhelm training |
| Work/life boundaries | Does connectivity become permanent availability? | Staff receive work requests after shifts |
| Physical, mental, cognitive effects | How does sustained use affect people? | Repetitive work, screen strain, distraction, or monitoring pressure |

These are questions about system design and distribution of effects. Do not assume that an increase in efficiency benefits every stakeholder equally. Likewise, distinguish a potential risk from a demonstrated outcome in a specific case.

## 8. Apply the chapter to its cases

**Tracking apps**, book pp.109–110: map the actors and data flow, then compare a useful function with secondary data use. **Meta's Many Ethical Challenges**, pp.139–140: identify which of the five dimensions are implicated and support each with evidence from the case. Avoid a generic list detached from the actual facts.

The **privacy-analyst career scenario**, book p.138, connects privacy work to organizational operations. Translate a general principle into a concrete requirement: an owner, a limited purpose, a review step, or a usable complaint process.

> [!QUIZ]
> 4 Q4. Analyze the café loyalty app using all five ethical-analysis steps. Give a defensible option and one remaining tradeoff.

> [!ANSWER]
> **Facts:** establish which location data are collected, why, how long, and with whom they are shared. **Values:** convenience and efficiency conflict with privacy and autonomy. **Stakeholders:** customers, staff, managers, and service providers. **Options:** continuous tracking, optional check-in, or manual pickup. **Consequences:** compare service quality, exposure, exclusion, and ongoing costs. One defensible design is optional check-in with a manual alternative, limited retention, and named responsibility. It may reduce forecast precision, so the tradeoff should be acknowledged and measured. Other conclusions need their own evidence and reasoning.

## 9. Retrieval and the four-chapter synthesis

- Mechanisms that identify who acted establish {{accountability}}.
- A legal route to recover damages concerns {{liability}}.
- A route to challenge the application of rules relates to {{due process}}.
- Undocumented expertise is a Chapter 2 knowledge issue; unauthorized reuse of a recorded work raises Chapter 4 {{property rights}} questions.

> [!FLASHCARD]
> Q: Chapter 4 — Name the five moral dimensions.
> A: Information rights and obligations; property rights and obligations; system quality; accountability and control; quality of life.

> [!FLASHCARD]
> Q: Chapter 4 — What are the five ethical-analysis steps?
> A: Establish facts; identify the dilemma and values; identify stakeholders; identify feasible options; examine consequences.

> [!FLASHCARD]
> Q: Chapter 4 — Why is privacy not equivalent to security?
> A: Security protects access and systems; privacy also concerns whether collecting, combining, and using personal information is appropriate.

**Use the entire course on one proposal:**

| Chapter | Question for the café app |
| --- | --- |
| 1 · Value | Which objective is served, and what complementary assets are needed? |
| 2 · Work | Which processes, systems, people, and knowledge must connect? |
| 3 · Strategy | Which pressure and value-chain activity are addressed, and can rivals imitate it? |
| 4 · Ethics | Who benefits, who bears risk, and what rights and responsibilities must be protected? |

> [!EXAM]
> **Final writing task:** in one page, recommend whether and how to implement the app. Include the business problem, system design, organizational conditions, strategic mechanism, ethical tradeoff, and an outcome measure. The goal is a connected argument, not a paragraph of abbreviations.

You are ready for a second pass when you can make that argument without looking at the tables. Use the **헷갈림/틀림** results in [Review](/review), then reopen the relevant textbook reading stop.
