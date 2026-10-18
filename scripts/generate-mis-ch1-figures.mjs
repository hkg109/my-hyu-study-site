import { writeFileSync } from "node:fs";
import path from "node:path";
import { box, chevron, circle, ellipse, frame, lines, p, sector, t } from "./mis-figure-kit.mjs";

// Redraws the Chapter 1 textbook figures as site-style SVGs: node scripts/generate-mis-ch1-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const f = (n, meta, body) => [`mis-fig-1-${String(n).padStart(2, "0")}`, frame(`mis-fig-1-${String(n).padStart(2, "0")}`, { chapter: 1, figure: `1.${n}`, ...meta }, body.join("\n  "))];

// Values read approximately from the textbook chart (US$ billions).
const years = Array.from({ length: 19 }, (_, i) => 1999 + i);
const total = [2150, 2300, 2270, 2200, 2280, 2450, 2620, 2660, 2610, 2430, 2020, 2050, 2180, 2400, 2500, 2640, 2750, 2220, 2360];
const it = [450, 540, 540, 510, 560, 620, 660, 720, 800, 810, 760, 810, 840, 880, 920, 960, 1010, 730, 770];
const chartX = i => 200 + i * 52, chartY = v => 600 - v * 0.14;
const series = (values, cls) => `${p(`M${values.map((v, i) => `${chartX(i)} ${chartY(v)}`).join(" L ")}`, cls)}${values.map((v, i) => circle(chartX(i), chartY(v), 4, cls === "line" ? "focal" : "deep")).join("")}`;

const figures = [
  f(1, { title: "Information Technology Capital Investment", subtitle: "IT 투자는 1999년 전체 투자 자본의 21%에서 2017년 33%로 늘었다 (값은 교재 그래프를 읽은 근사치)", height: 700 }, [
    p("M180 600 H 1160", "rule"), p("M180 600 V 180", "rule"),
    ...[0, 500, 1000, 1500, 2000, 2500, 3000].map(v => `${p(`M176 ${chartY(v)} H 1160`, "rule")}${t(168, chartY(v) + 5, String(v), "small", "end")}`),
    ...years.map((y, i) => (i % 2 === 0 ? t(chartX(i), 626, String(y), "small", "middle") : "")),
    series(total, "line"), series(it, "soft"),
    t(560, 206, "Total investment · 전체 투자", "name"), t(560, 560, "IT investment · IT 투자", "name"),
    t(chartX(0), chartY(it[0]) - 18, "21%", "name", "middle"), t(chartX(18) + 20, chartY(it[18]) - 18, "33%", "name", "middle"),
    t(96, 400, "US$ billions", "small", "middle"),
    t(640, 664, "IT 투자 = 하드웨어 · 소프트웨어 · 통신 장비 투자", "sub", "middle"),
  ]),
  f(2, { title: "The Interdependence Between Organizations and Information Systems", subtitle: "기업의 전략·프로세스와 정보시스템(소프트웨어·하드웨어·데이터 관리·통신)은 서로에게 의존한다", height: 640 }, [
    ellipse(290, 380, 210, 110, "zone"), lines(290, 352, ["Business Strategic", "Objectives", "Business Processes"], "name", 26, "middle"), t(290, 446, "전략 목표 · 비즈니스 프로세스", "sub", "middle"),
    p("M560 176 V 600", "soft"), p("M506 380 H 664", "both"),
    circle(740, 380, 78, "focal"), t(740, 386, "Software", "name inverse", "middle"),
    p("M818 380 H 880 M880 230 V 530 M880 230 H 920 M880 380 H 920 M880 530 H 920"),
    ...[[230, "Hardware", "하드웨어"], [380, "Data Management", "데이터 관리"], [530, "Telecommunications", "통신"]]
      .map(([y, en, ko]) => `${ellipse(1060, y, 140, 58, "node")}${t(1060, y - 2, en, "name", "middle")}${t(1060, y + 22, ko, "sub", "middle")}`),
    lines(290, 560, ["Business Firm", "기업"], "name", 24, "middle"), lines(740, 560, ["Information System", "정보시스템"], "name", 24, "middle"),
  ]),
  f(3, { title: "Data and Information", subtitle: "가공되지 않은 판매 데이터가 정보시스템을 거쳐 의미 있는 정보가 된다", height: 600 }, [
    `<path class="zone" d="M80 190 L 520 360 L 80 530 Z"/>`, `<path class="zone" d="M1200 190 L 760 360 L 1200 530 Z"/>`,
    t(150, 228, "Data · 데이터", "name"),
    lines(100, 290, ["331 Brite Dish Soap  1.29", "863 BL Hill Coffee  4.69", "173 Meow Cat  .79", "331 Brite Dish Soap  1.29", "663 Country Ham  3.29", "524 Fiery Mustard  1.49", "113 Ginger Root  .85"], "sub", 24),
    circle(640, 360, 110, "focal"), t(640, 352, "Information", "name inverse", "middle"), t(640, 376, "System", "name inverse", "middle"),
    t(1130, 228, "Information · 정보", "name", "end"),
    lines(1180, 300, ["Sales Region: Northwest", "Store: Superstore #122"], "sub", 22, "end"),
    lines(1180, 370, ["ITEM 331 · Brite Dish Soap", "UNITS SOLD 7,156", "YTD SALES $9,231.24"], "label", 26, "end"),
    t(640, 570, "같은 품목(331)의 거래를 모아 지역·매장·누적 판매로 정리하면 관리자가 쓸 수 있는 정보가 된다", "sub", "middle"),
  ]),
  f(4, { title: "Functions of an Information System", subtitle: "정보시스템은 입력·처리·출력과 피드백으로 작동하며, 조직과 환경 속에서 외부 주체와 상호작용한다", height: 720 }, [
    box(64, 168, 1152, 530, "zone"), t(640, 196, "ENVIRONMENT · 환경", "name", "middle"),
    t(640, 262, "ORGANIZATION · 조직", "name", "middle"),
    box(150, 286, 980, 250, "deep"), t(640, 314, "INFORMATION SYSTEM · 정보시스템", "name", "middle"),
    box(200, 350, 220, 100, "node"), t(310, 396, "Input", "name", "middle"), t(310, 420, "입력", "sub", "middle"),
    box(530, 340, 220, 120, "focal"), lines(640, 376, ["Processing", "Classify · Arrange", "Calculate"], "name inverse", 26, "middle"),
    box(860, 350, 220, 100, "node"), t(970, 396, "Output", "name", "middle"), t(970, 420, "출력", "sub", "middle"),
    p("M420 400 H 526", "flow"), p("M750 400 H 856", "flow"),
    p("M970 450 V 506 H 310 V 454", "flow"), t(640, 526, "Feedback · 피드백", "small", "middle"),
    ...[[200, 216, "Suppliers", "공급업체", "M240 236 L 280 280"], [1080, 216, "Customers", "고객", "M1040 236 L 1000 280"], [200, 640, "Regulatory Agencies", "규제기관", "M240 600 L 280 544"], [640, 640, "Stockholders", "주주", "M640 600 V 544"], [1080, 640, "Competitors", "경쟁자", "M1040 600 L 1000 544"]]
      .map(([x, y, en, ko, d]) => `${t(x, y, en, "label", "middle")}${t(x, y + 22, ko, "sub", "middle")}${p(d, "dashboth")}`),
  ]),
  f(5, { title: "Information Systems Are More Than Computers", subtitle: "정보시스템을 이해하려면 조직·경영·기술의 세 차원을 함께 봐야 한다", height: 700 }, [
    sector(640, 430, 300, 250, -90, 30, "zone"), sector(640, 430, 300, 250, 30, 150, "deep"), sector(640, 430, 300, 250, 150, 270, "node"),
    circle(640, 430, 84, "focal"), t(640, 424, "Information", "name inverse", "middle"), t(640, 448, "Systems", "name inverse", "middle"),
    t(470, 360, "Organizations", "name", "middle"), t(470, 384, "조직", "sub", "middle"),
    t(810, 360, "Technology", "name", "middle"), t(810, 384, "기술", "sub", "middle"),
    t(640, 590, "Management", "name", "middle"), t(640, 614, "경영", "sub", "middle"),
  ]),
  f(6, { title: "Levels in a Firm", subtitle: "기업은 최고경영진·중간관리자·운영관리자의 계층으로 나뉘고, 계층마다 일하는 사람과 정보 요구가 다르다", height: 700 }, [
    `<path class="node" d="M640 170 L 760 340 L 520 340 Z"/>`, `<path class="zone" d="M520 340 L 760 340 L 880 510 L 400 510 Z"/>`, `<path class="deep" d="M400 510 L 880 510 L 1000 680 L 280 680 Z"/>`,
    t(640, 290, "Senior", "name", "middle"), t(640, 314, "Management", "name", "middle"),
    t(640, 412, "Middle Management · 중간관리자", "name", "middle"), t(640, 440, "Scientists and knowledge workers", "sub", "middle"),
    t(640, 580, "Operational Management · 운영관리자", "name", "middle"), t(640, 608, "Production and service workers · Data workers", "sub", "middle"),
    t(712, 270, "← 최고경영진: 장기 전략 결정", "small"),
  ]),
  f(7, { title: "The Business Information Value Chain", subtitle: "데이터 수집에서 시작한 정보 처리 활동이 비즈니스 프로세스와 경영 활동을 거쳐 수익성과 전략적 위치를 높인다", height: 760 }, [
    ...[["Data Collection", "and Storage"], ["Transformation into", "Business Systems"], ["Dissemination", ""]]
      .map(([a, b], i) => `${chevron(64 + i * 138, 360, 112, 80, 22, "deep")}${t(64 + i * 138, 472, a, "small")}${b ? t(64 + i * 138, 490, b, "small") : ""}`),
    p("M470 360 L 520 300", "flow"), p("M470 440 L 520 500", "flow"),
    t(700, 196, "Business Processes · 비즈니스 프로세스", "name"),
    ...["Supply Chain Management", "Enterprise Management", "Customer Management", "Knowledge Management"]
      .map((label, i) => `${chevron(540 + i * 140, 216, 112, 70, 22, "node")}${lines(540 + i * 140, 308, label.split(" ").length > 2 ? [label.split(" ").slice(0, 2).join(" "), label.split(" ").slice(2).join(" ")] : label.split(" "), "small", 17)}`),
    t(700, 520, "Management Activities · 경영 활동", "name"),
    ...["Planning", "Coordinating", "Controlling", "Modeling and Decision Making"]
      .map((label, i) => `${chevron(540 + i * 140, 540, 112, 70, 22, "node")}${lines(540 + i * 140, 632, label.length > 14 ? ["Modeling and", "Decision Making"] : [label], "small", 17)}`),
    chevron(1066, 320, 112, 150, 28, "focal"), lines(1134, 364, ["Firm", "Profitability", "and Strategic", "Position"], "small inverse", 20, "middle"),
    t(1134, 500, "수익성 · 전략적 위치", "small", "middle"),
    p("M64 700 H 1200", "flow"), t(64, 690, "Information Processing Activities", "small"), t(700, 690, "Management Activities", "small"), t(640, 734, "Business Value · 비즈니스 가치", "name", "middle"),
  ]),
  f(8, { title: "Variation in Returns on Information Technology Investment", subtitle: "평균적으로 IT 투자가 많을수록 생산성이 높지만, 같은 투자에도 기업마다 결과가 크게 다르다 (점은 개념 설명용 예시)", height: 720 }, [
    box(260, 176, 760, 460, "zone", 0), p("M640 176 V 636", "line"), p("M260 406 H 1020", "line"),
    p("M260 560 L 1020 250", "soft"),
    ...[[330, 420], [420, 372], [440, 540], [470, 300], [500, 470], [530, 452], [560, 430], [580, 470], [600, 380], [620, 440], [640, 470], [660, 360], [680, 400], [700, 330], [720, 410], [740, 300], [760, 370], [780, 260], [800, 350], [830, 470], [860, 200], [880, 330], [910, 300], [940, 360], [960, 290], [520, 520], [690, 520], [560, 340], [640, 420], [610, 410]]
      .map(([x, y]) => circle(x, y, 7, "focal")),
    t(290, 210, "1", "name"), t(990, 210, "2", "name"), t(290, 620, "3", "name"), t(990, 620, "4", "name"),
    lines(64, 380, ["Productivity", "(relative to", "industry average)", "생산성"], "label", 24),
    t(640, 676, "IT Capital Stock (relative to industry average) · IT 자본 투자", "label", "middle"),
    t(1040, 290, "2: 많이 투자하고", "small"), t(1040, 308, "성과도 높음", "small"), t(1040, 560, "4: 많이 투자했지만", "small"), t(1040, 578, "성과는 낮음", "small"),
  ]),
  f(9, { title: "Contemporary Approaches to Information Systems", subtitle: "정보시스템 연구는 기술적 접근(컴퓨터과학·경영과학·운영과학)과 행동적 접근(사회학·경제학·심리학)을 아우른다", height: 720 }, [
    ...[[-150, -90, "zone"], [-90, -30, "zone"], [-210, -150, "zone"], [-30, 30, "deep"], [30, 90, "deep"], [90, 150, "deep"]].map(([a, b, cls]) => sector(640, 440, 400, 250, a, b, cls)),
    ellipse(640, 440, 120, 72, "focal"), t(640, 448, "MIS", "name inverse", "middle"),
    ...[[520, 280, "Computer Science", "컴퓨터과학"], [770, 280, "Operations Research", "운영과학"], [350, 420, "Management Science", "경영과학"], [930, 420, "Sociology", "사회학"], [770, 610, "Economics", "경제학"], [510, 610, "Psychology", "심리학"]]
      .map(([x, y, en, ko]) => `${t(x, y, en, "label", "middle")}${t(x, y + 22, ko, "sub", "middle")}`),
    lines(96, 210, ["Technical Approaches", "기술적 접근"], "name", 24), lines(1184, 660, ["Behavioral Approaches", "행동적 접근"], "name", 24, "end"),
  ]),
  f(10, { title: "A Sociotechnical Perspective on Information Systems", subtitle: "기술과 조직의 대안을 서로 맞춰 가며 조정할 때 최종 설계가 함께 결정된다 (joint optimization)", height: 620 }, [
    t(96, 196, "TECHNOLOGY · 기술", "name"), t(1184, 196, "ORGANIZATION · 조직", "name", "end"),
    ...[0, 1, 2].map(i => `${box(96 + i * 150, 216 + i * 86, 190, 76, "node")}${t(191 + i * 150, 252 + i * 86, `Alternative ${i + 1}`, "name", "middle")}${t(191 + i * 150, 274 + i * 86, `대안 ${i + 1}`, "sub", "middle")}${box(994 - i * 150, 216 + i * 86, 190, 76, "zone")}${t(1089 - i * 150, 252 + i * 86, `Alternative ${i + 1}`, "name", "middle")}${t(1089 - i * 150, 274 + i * 86, `대안 ${i + 1}`, "sub", "middle")}${p(`M${290 + i * 150} ${254 + i * 86} H ${990 - i * 150}`, "both")}`),
    box(450, 476, 190, 110, "focal"), lines(545, 516, ["Final Design of", "Technology"], "name inverse", 24, "middle"),
    box(640, 476, 190, 110, "deep"), lines(735, 516, ["Final Design of", "Organization"], "name", 24, "middle"),
  ]),
];

for (const [slug, svg] of figures) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(figures.map(([slug]) => slug).join(" "));
