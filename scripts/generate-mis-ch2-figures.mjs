import { writeFileSync } from "node:fs";
import path from "node:path";
import { box, chevron, circle, ellipse, frame, lines, p, t } from "./mis-figure-kit.mjs";

// Redraws the Chapter 2 textbook figures (incl. the Chapter 11 KM figures used in the slides): node scripts/generate-mis-ch2-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const f = (figure, meta, body) => {
  const [major, minor] = figure.split(".");
  const slug = `mis-fig-${major}-${minor.padStart(2, "0")}`;
  return [slug, frame(slug, { chapter: 2, figure, ...meta }, body.join("\n  "))];
};
const db = (cx, cy, w, h, cls = "node") => `<g><ellipse class="${cls}" cx="${cx}" cy="${cy + h}" rx="${w / 2}" ry="${h * 0.18}"/><rect class="${cls}" x="${cx - w / 2}" y="${cy}" width="${w}" height="${h}" style="stroke:none"/><path class="line" d="M${cx - w / 2} ${cy} V ${cy + h} M${cx + w / 2} ${cy} V ${cy + h}" style="stroke:#b9b6ac;stroke-width:1.5"/><ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h * 0.18}"/></g>`;

const figures = [
  f("2.1", { title: "The Order Fulfillment Process", subtitle: "한 고객 주문이 영업·회계·생산 부서를 차례로 가로지르는 cross-functional 프로세스", height: 640 }, [
    ...[[220, "Sales", "영업"], [370, "Accounting", "회계"]].map(([y, en, ko]) => `${circle(160, y, 64, "zone")}${t(160, y - 2, en, "name", "middle")}${t(160, y + 22, ko, "sub", "middle")}`),
    circle(160, 530, 64, "zone"), t(160, 518, "Manufacturing", "name", "middle"), t(160, 538, "and Production", "small", "middle"), t(160, 560, "생산", "sub", "middle"),
    p("M260 300 H 1200", "dash"), p("M260 450 H 1200", "dash"), p("M260 610 H 1200", "dash"),
    ...[[280, 184, "Generate order", "주문 작성"], [500, 184, "Submit order", "주문 제출"], [500, 334, "Check credit", "신용 확인"], [720, 334, "Approve credit", "신용 승인"], [940, 334, "Generate invoice", "송장 발행"], [720, 494, "Assemble product", "제품 조립"], [940, 494, "Ship product", "배송"]]
      .map(([x, y, en, ko]) => `${box(x, y, 180, 74, "node")}${t(x + 90, y + 32, en, "name", "middle")}${t(x + 90, y + 56, ko, "sub", "middle")}`),
    p("M460 221 H 496", "flow"), p("M590 258 V 330", "flow"), p("M680 371 H 716", "flow"), p("M900 371 H 936", "flow"), p("M810 408 V 490", "flow"), p("M900 531 H 936", "flow"),
  ]),
  f("2.2", { title: "A Payroll TPS", subtitle: "급여 TPS는 직원 데이터를 받아 급여를 계산하고 명세서·경영 보고서·총계정원장·정부 자료로 내보낸다", height: 700 }, [
    box(520, 300, 200, 90, "focal"), t(620, 340, "Payroll", "name inverse", "middle"), t(620, 364, "System", "name inverse", "middle"),
    t(300, 196, "Employee Data · 직원 데이터", "label"), p("M300 210 H 620 V 296", "flow"),
    db(260, 300, 110, 80, "zone"), lines(150, 316, ["Employee/File", "Database"], "label", 22, "end"), p("M318 345 H 516", "both"),
    p("M680 300 V 196 H 1180", "flow"), t(900, 186, "To General Ledger · 총계정원장", "label"),
    p("M720 345 H 900", "flow"), lines(920, 340, ["Management reports", "경영 보고서"], "label", 22),
    p("M660 390 V 470 H 1180", "flow"), t(900, 460, "To government agencies · 정부 기관", "label"),
    p("M640 390 V 540 H 1180", "flow"), t(900, 530, "Employee paychecks · 급여명세서", "label"),
    p("M600 394 V 570", "both"), lines(600, 600, ["Online queries", "온라인 조회"], "label", 22, "middle"),
    box(96, 420, 300, 250, "zone"), t(116, 448, "Payroll data on master file", "small"),
    lines(116, 478, ["Employee Number · Name · Address", "Pay rate · Gross pay", "Federal tax · FICA · Medicare", "State tax · Net pay", "Earnings (YTD)"], "sub", 30),
  ]),
  f("2.3", { title: "How MIS Obtain Their Data from the Organization’s TPS", subtitle: "TPS의 거래 데이터가 MIS 파일로 요약되어 보고서와 대시보드로 관리자에게 전달된다", height: 680 }, [
    t(240, 186, "Transaction Processing Systems", "name", "middle"), t(640, 186, "Management Information Systems", "name", "middle"),
    ...[[240, "Order processing system", "Order file"], [400, "Materials resource planning system", "Production master file"], [560, "General ledger system", "Accounting files"]]
      .map(([y, sys, file]) => `${db(110, y - 34, 70, 56, "zone")}${t(110, y + 50, file, "small", "middle")}${p(`M150 ${y} H 196`, "both")}${box(200, y - 40, 220, 80, "node")}${lines(310, y - 6, sys.length > 20 ? [sys.split(" ").slice(0, 2).join(" "), sys.split(" ").slice(2).join(" ")] : [sys], "label", 20, "middle")}`),
    box(500, 210, 230, 420, "zone"), t(615, 236, "MIS FILES", "small", "middle"),
    ...[[270, "Sales data"], [360, "Unit product cost data"], [450, "Product change data"], [540, "Expense data"]].map(([y, label]) => `${db(560, y, 56, 48, "node")}${t(600, y + 30, label, "small")}`),
    p("M420 240 C 460 240, 460 290, 528 290", "dash"), p("M420 400 C 460 400, 460 380, 528 380", "dash"), p("M420 410 C 460 410, 460 470, 528 470", "dash"), p("M420 560 H 528", "dash"),
    p("M734 420 H 790", "flow"), box(794, 380, 130, 80, "focal"), t(859, 426, "MIS", "name inverse", "middle"),
    p("M924 400 C 960 400, 960 300, 1000 300", "flow"), p("M924 440 C 960 440, 960 540, 1000 540", "flow"),
    lines(1010, 296, ["Reports", "보고서"], "label", 22), lines(1010, 536, ["Online Displays", "and Dashboards"], "label", 22),
    box(1080, 390, 130, 60, "node"), t(1145, 418, "Managers", "name", "middle"), t(1145, 438, "관리자", "sub", "middle"),
    p("M1160 318 V 386", "flow"), p("M1160 516 V 454", "flow"),
  ]),
  f("2.5", { title: "Voyage-Estimating Decision Support System", subtitle: "선박·항구·연료·용선 데이터를 분석 모델 데이터베이스로 모아 운항 결정을 지원하는 모델 중심 DSS", height: 680 }, [
    ...[["Ship file (speed, capacity)", "선박 파일"], ["Port distance restrictions file", "항구 거리·제약"], ["Fuel consumption cost file", "연료비"], ["Ship charter hire history cost file", "용선료 이력"], ["Port expense file", "항구 비용"]]
      .map(([en, ko], i) => `${db(840, 186 + i * 96, 64, 50, "zone")}${t(890, 206 + i * 96, en, "label")}${t(890, 228 + i * 96, ko, "sub")}${p(`M760 ${211 + i * 96} H 806`, "line")}`),
    p("M760 211 V 595", "line"), p("M760 400 H 600", "flow"),
    db(530, 360, 120, 90, "focal"), lines(530, 490, ["Analytical models", "database", "분석 모델 DB"], "label", 22, "middle"),
    p("M466 400 H 330", "flow"),
    box(120, 340, 200, 120, "node"), lines(220, 392, ["PC · Online queries", "온라인 조회"], "label", 24, "middle"),
    lines(220, 520, ["어느 배를 어디로?", "적재량 · 속도 · 이익"], "sub", 22, "middle"),
  ]),
  f("2.6", { title: "Enterprise Application Architecture", subtitle: "전사 시스템은 기능 부서와 관리 계층을 가로지르고, SCM은 공급자를, CRM은 고객을, KMS는 조직 지식을 연결한다", height: 760 }, [
    `<path class="zone" d="M640 170 L 1060 640 L 220 640 Z"/>`,
    ellipse(640, 430, 100, 220, "deep"), ellipse(640, 400, 380, 100, "node"),
    t(640, 250, "Enterprise Systems · 전사적 시스템", "name", "middle"),
    lines(400, 390, ["Supply Chain", "Management Systems"], "name", 22, "middle"), lines(880, 390, ["Customer Relationship", "Management Systems"], "name", 22, "middle"),
    lines(640, 560, ["Knowledge", "Management Systems"], "name", 22, "middle"),
    p("M520 300 H 760", "dashboth"), p("M520 420 H 760", "dashboth"), t(640, 292, "Processes", "small", "middle"), t(640, 412, "Processes", "small", "middle"),
    lines(220, 220, ["Suppliers,", "Business Partners"], "label", 22, "middle"), p("M250 250 L 330 330", "both"),
    lines(1060, 220, ["Customers,", "Distributors"], "label", 22, "middle"), p("M1030 250 L 950 330", "both"),
    ...["Sales and Marketing", "Manufacturing and Production", "Finance and Accounting", "Human Resources"].map((label, i) => t(325 + i * 210, 672, label, "small", "middle")),
    t(640, 720, "FUNCTIONAL AREAS · 기능 부서", "name", "middle"),
  ]),
  f("2.7", { title: "The Requirements for Collaboration", subtitle: "협업 역량(문화·구조)과 협업 기술이 함께 협업의 질을 높이고, 그것이 기업 성과로 이어진다", height: 660 }, [
    t(96, 196, "Collaboration Capability · 협업 역량", "name"), box(96, 210, 360, 150, "zone"),
    lines(120, 250, ["• Open culture · 개방적 문화", "• Decentralized structure · 분권적 구조", "• Breadth of collaboration · 협업의 폭"], "label", 34),
    t(96, 420, "Collaboration Technology · 협업 기술", "name"), box(96, 434, 360, 190, "zone"),
    lines(120, 472, ["• Collaboration and social technology", "  for implementation and operations", "• Collaborative and social technology", "  for strategic planning"], "label", 34),
    p("M456 290 L 600 390", "flow"), p("M456 530 L 600 430", "flow"),
    box(604, 370, 230, 80, "focal"), t(719, 406, "Collaboration Quality", "name inverse", "middle"), t(719, 430, "협업의 질", "sub inverse", "middle"),
    p("M834 410 H 900", "flow"), box(904, 370, 230, 80, "node"), t(1019, 406, "Firm Performance", "name", "middle"), t(1019, 430, "기업 성과", "sub", "middle"),
  ]),
  f("2.8", { title: "The Time/Space Collaboration and Social Tool Matrix", subtitle: "같은 시간인지(동기·비동기), 같은 장소인지(대면·원격)에 따라 협업 도구가 나뉜다", height: 760 }, [
    t(470, 190, "Same time · synchronous", "name", "middle"), t(910, 190, "Different time · asynchronous", "name", "middle"),
    t(150, 360, "Same place", "name", "middle"), t(150, 384, "colocated", "sub", "middle"), t(150, 600, "Different place", "name", "middle"), t(150, 624, "remote", "sub", "middle"),
    box(250, 210, 440, 240, "node", 0), box(690, 210, 440, 240, "zone", 0), box(250, 450, 440, 240, "zone", 0), box(690, 450, 440, 240, "deep", 0),
    ...[[470, 280, "Face-to-face interactions", ["decision rooms, single display groupware,", "shared table, wall displays, roomware"]], [910, 280, "Continuous task", ["team rooms, large public display,", "shift work groupware, project management"]], [470, 560, "Remote interactions", ["video conferencing, instant messaging,", "virtual worlds, shared screens, multi-user editors"]], [910, 560, "Communication + coordination", ["e-mail, bulletin boards, blogs, group calendars,", "workflow, version control, wikis"]]]
      .map(([x, y, head, body]) => `${t(x, y, head, "name", "middle")}${lines(x, y + 30, body, "sub", 22, "middle")}`),
    box(500, 412, 380, 76, "focal"), lines(690, 444, ["Time/Space Collaboration", "and Social Tool Matrix"], "name inverse", 24, "middle"),
  ]),
  f("11.1", { title: "The Knowledge Management Value Chain", subtitle: "획득·저장·전파·적용의 각 단계에서 정보시스템 활동과 경영·조직 활동이 함께 가치를 더한다", height: 720 }, [
    t(640, 186, "Knowledge Business Value Chain", "name", "middle"),
    ...["Data and Information", "Acquire", "Store", "Disseminate", "Apply"].map((label, i) => `${chevron(64 + i * 226, 200, 190, 56, 22, i ? "zone" : "deep")}${t(170 + i * 226, 234, label, "label", "middle")}`),
    box(290, 290, 900, 200, "deep"), t(740, 316, "Information System Activities · 정보시스템 활동", "name", "middle"),
    ...[["Acquire", ["Business analytics", "Data mining · Neural networks", "Machine learning", "Knowledge workstations"]], ["Store", ["Content management systems", "Knowledge databases", "Expert systems"]], ["Disseminate", ["Portals · Search engines", "Collaboration and", "social business tools"]], ["Apply", ["Decision support systems", "Enterprise applications", "Robotics"]]]
      .map(([head, items], i) => `${t(310 + i * 222, 350, head, "name")}${lines(310 + i * 222, 376, items, "sub", 22)}`),
    t(740, 530, "Management and Organizational Activities · 경영·조직 활동", "name", "middle"),
    ...[["Knowledge culture", "Communities of practice", "Social networks"], ["Organizational routines", "Organizational culture"], ["Training", "Collaboration"], ["New IT-based processes", "New products and services", "New markets"]]
      .map((items, i) => lines(310 + i * 222, 562, items, "sub", 22)),
    lines(80, 330, ["Data and", "Information", "Acquisition", "Collecting", "Storing", "Disseminating"], "label", 24),
    p("M1210 256 V 690 H 100 V 486", "flow"), t(110, 660, "Feedback · 피드백", "small"),
  ]),
  f("11.2", { title: "Major Types of Knowledge Management Systems", subtitle: "지식관리시스템은 전사적 KMS·지식작업시스템·지능형 기법의 세 유형으로 나뉜다", height: 700 }, [
    p("M180 230 C 180 190, 640 210, 640 176 C 640 210, 1100 190, 1100 230", "line"),
    ...[[240, "Enterprise-Wide Knowledge", "Management Systems", ["General-purpose, firmwide efforts to", "collect, store, disseminate, and use", "digital content and knowledge"], ["Enterprise content management", "Collaboration and social tools", "Learning management systems"], "zone"], [640, "Knowledge Work", "Systems", ["Specialized workstations that help", "scientists, engineers, and knowledge", "workers create new knowledge"], ["Computer-aided design (CAD)", "Virtual reality"], "focal"], [1040, "“Intelligent”", "Techniques", ["Tools for discovering patterns and", "applying knowledge to discrete", "decisions and knowledge domains"], ["Data mining · Neural networks", "Expert systems · Machine learning", "NLP · Computer vision · Robotics", "Genetic algorithms · Intelligent agents"], "deep"]]
      .map(([cx, a, b, desc, items, cls]) => `${ellipse(cx, 290, 180, 62, cls)}${t(cx, 286, a, cls === "focal" ? "name inverse" : "name", "middle")}${t(cx, 310, b, cls === "focal" ? "name inverse" : "name", "middle")}${lines(cx - 170, 392, desc, "sub", 22)}${lines(cx - 170, 480, items, "label", 26)}`),
    t(240, 660, "관리하기 (Manage)", "name", "middle"), t(640, 660, "만들기 (Create)", "name", "middle"), t(1040, 660, "발견하기 (Discover)", "name", "middle"),
  ]),
  f("11.8", { title: "An Enterprise Content Management System", subtitle: "사용자는 콘텐츠를 만들고 태그를 붙이고 저장·검토·배포하며, 모든 콘텐츠는 하나의 통합 저장소에 모인다", height: 660 }, [
    box(96, 260, 200, 200, "zone"), t(196, 350, "Users", "name", "middle"), t(196, 374, "사용자", "sub", "middle"),
    p("M300 360 H 446", "both"),
    box(450, 180, 280, 400, "focal"),
    ...["Create / Capture", "Tag", "Store / Retrieve", "Manage / Review", "Distribute / Publish"].map((label, i) => t(480, 236 + i * 72, label, "name inverse")),
    p("M734 360 H 840", "both"),
    db(990, 220, 260, 110, "deep"), t(990, 300, "Unified repository · 통합 저장소", "name", "middle"),
    lines(880, 400, ["• Reports / presentations · Best practices", "• Memos · Digital slides · Email", "• Graphics · Video · News feeds", "• Wikis, blogs · Employee profiles"], "label", 30),
  ]),
  f("11.9", { title: "Requirements of Knowledge Work Systems", subtitle: "지식작업시스템은 외부 지식 기반, 전문 소프트웨어, 쓰기 쉬운 인터페이스, 강력한 워크스테이션으로 이루어진다", height: 660 }, [
    box(96, 190, 360, 180, "zone"), lines(276, 270, ["External knowledge base", "외부 지식 기반"], "name", 26, "middle"),
    p("M456 280 H 576", "flow"),
    box(580, 176, 600, 330, "deep"), t(880, 214, "SOFTWARE · 소프트웨어", "name", "middle"),
    lines(880, 252, ["Graphics → Visualization", "Modeling → Simulation", "Document management", "Communications"], "label", 28, "middle"),
    p("M880 350 V 410", "both"),
    box(720, 414, 320, 70, "focal"), t(880, 446, "User interface", "name inverse", "middle"), t(880, 470, "사용자 인터페이스", "sub inverse", "middle"),
    p("M880 576 V 510", "flow"),
    box(96, 580, 1084, 64, "zone"), t(638, 618, "Hardware platform: knowledge workstation · 지식 워크스테이션", "name", "middle"),
  ]),
];

for (const [slug, svg] of figures) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(figures.map(([slug]) => slug).join(" "));
