import { writeFileSync } from "node:fs";
import path from "node:path";

// Redraws the Chapter 3 textbook figures as site-style SVGs: node scripts/generate-mis-ch3-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const sans = "'Pretendard','Noto Sans KR','Malgun Gothic',sans-serif";
const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function frame(slug, { figure, title, subtitle, height }, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 ${height}" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">Figure ${figure} ${esc(title)}</title>
  <desc id="${slug}-desc">${esc(subtitle)}</desc>
  <defs><marker id="${slug}-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="#1d1d1a"/></marker></defs>
  <style>.bg{fill:#f7f6f2}.rule{stroke:#b9b6ac;stroke-width:1;fill:none}.line{stroke:#1d1d1a;stroke-width:1.6;fill:none}.soft{stroke:#929087;stroke-width:1.4;fill:none}.dash{stroke:#929087;stroke-width:1.4;fill:none;stroke-dasharray:6 6}.flow{stroke:#1d1d1a;stroke-width:2;fill:none;marker-end:url(#${slug}-arrow)}.both{stroke:#1d1d1a;stroke-width:2;fill:none;marker-start:url(#${slug}-arrow);marker-end:url(#${slug}-arrow)}.node{fill:#f7f6f2;stroke:#b9b6ac;stroke-width:1.5}.zone{fill:#f0eee8;stroke:#b9b6ac;stroke-width:1.5}.deep{fill:#e4e1d8;stroke:#b9b6ac;stroke-width:1.5}.focal{fill:#1d1d1a;stroke:#1d1d1a;stroke-width:1.5}.tag{font:600 13px ${sans};fill:#65645e}.title{font:700 28px ${sans};fill:#1d1d1a}.subtitle,.sub{font:400 14px ${sans};fill:#65645e}.name{font:700 17px ${sans};fill:#1d1d1a}.label{font:500 15px ${sans};fill:#1d1d1a}.small{font:600 12px ${sans};fill:#65645e}.inverse{fill:#f7f6f2}</style>
  <rect class="bg" width="1280" height="${height}"/><text class="tag" x="64" y="52">3장 · Figure ${figure}</text><text class="title" x="64" y="92">${esc(title)}</text><text class="subtitle" x="64" y="122">${esc(subtitle)}</text><line class="rule" x1="64" y1="148" x2="1216" y2="148"/>
  ${body}
</svg>
`;
}

// Text helpers: t = single line, lines = stacked lines from a starting baseline.
const t = (x, y, text, cls = "label", anchor = "start") => `<text class="${cls}" x="${x}" y="${y}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}>${esc(text)}</text>`;
const lines = (x, y, items, cls = "label", gap = 22, anchor = "start") => items.map((item, i) => t(x, y + i * gap, item, cls, anchor)).join("");
const box = (x, y, w, h, cls = "node", rx = 6) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
const circle = (cx, cy, r, cls = "node") => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
const ellipse = (cx, cy, rx, ry, cls = "zone") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const p = (d, cls = "line") => `<path class="${cls}" d="${d}"/>`;

const figures = {};

figures["mis-fig-3-01"] = frame("mis-fig-3-01", {
  figure: "3.1", title: "The Two-Way Relationship Between Organizations and Information Technology",
  subtitle: "조직과 IT는 서로에게 영향을 주며, 그 사이를 여러 매개 요인이 조정한다", height: 720,
}, [
  p("M262 330 C 420 180, 860 180, 1018 330", "flow"),
  p("M1018 530 C 860 690, 420 690, 262 530", "flow"),
  t(640, 214, "조직의 구조·전략이 어떤 IT를 도입할지 정한다", "small", "middle"),
  t(640, 666, "도입된 IT가 다시 조직의 일하는 방식을 바꾼다", "small", "middle"),
  circle(240, 430, 120, "zone"), t(240, 424, "Organizations", "name", "middle"), t(240, 450, "조직", "sub", "middle"),
  circle(1040, 430, 120, "zone"), t(1040, 414, "Information", "name", "middle"), t(1040, 438, "Technology", "name", "middle"), t(1040, 464, "정보기술", "sub", "middle"),
  box(450, 280, 380, 300, "focal"),
  t(480, 320, "Mediating Factors · 매개 요인", "name inverse"),
  ...[["Environment", "환경"], ["Culture", "문화"], ["Structure", "구조"], ["Business Processes", "비즈니스 프로세스"], ["Politics", "정치"], ["Management Decisions", "경영 의사결정"]]
    .map(([en, ko], i) => `${t(480, 362 + i * 34, en, "label inverse")}${t(800, 362 + i * 34, ko, "sub inverse", "end")}`),
].join("\n  "));

figures["mis-fig-3-02"] = frame("mis-fig-3-02", {
  figure: "3.2", title: "The Technical Microeconomic Definition of the Organization",
  subtitle: "기술적 관점: 환경에서 자본과 노동을 받아 생산 과정을 거쳐 제품과 서비스를 내보내는 구조", height: 560,
}, [
  box(64, 176, 1152, 340, "zone"),
  lines(110, 330, ["Inputs from the", "environment"], "name"), t(110, 380, "자본 · 노동", "sub"),
  p("M300 340 H 384", "flow"),
  t(640, 218, "Organization · 조직", "name", "middle"),
  box(390, 236, 500, 200, "node"),
  box(430, 266, 120, 44, "focal", 3), box(730, 266, 120, 44, "focal", 3), box(430, 362, 120, 44, "focal", 3), box(730, 362, 120, 44, "focal", 3),
  p("M550 288 H 730"), p("M550 384 H 730"), p("M490 310 V 362"), p("M790 310 V 362"),
  t(640, 466, "Production process · 생산 과정", "label", "middle"),
  p("M896 340 H 980", "flow"),
  lines(992, 330, ["Outputs to the", "environment"], "name"), t(992, 380, "제품 · 서비스", "sub"),
  p("M1090 396 V 490 H 150 V 404", "flow"),
  t(640, 506, "판매 수익이 다시 자본과 노동을 사는 데 쓰인다 (feedback)", "small", "middle"),
].join("\n  "));

figures["mis-fig-3-03"] = frame("mis-fig-3-03", {
  figure: "3.3", title: "The Behavioral View of Organizations",
  subtitle: "행동적 관점: 조직은 구조와 사람·권리·가치가 얽힌 사회 시스템이라 쉽게 바뀌지 않는다", height: 720,
}, [
  t(640, 186, "FORMAL ORGANIZATION · 공식 조직", "name", "middle"),
  box(420, 204, 440, 490, "zone"),
  t(452, 240, "Structure · 구조", "name"),
  ...[["Hierarchy", "위계"], ["Division of labor", "분업"], ["Rules, procedures", "규칙 · 절차"], ["Business processes", "비즈니스 프로세스"], ["Culture", "문화"]]
    .map(([en, ko], i) => `${t(476, 272 + i * 30, en)}${t(828, 272 + i * 30, ko, "sub", "end")}`),
  p("M452 430 H 828", "soft"),
  t(452, 462, "Process · 과정", "name"),
  ...[["Rights / obligations", "권리 · 의무"], ["Privileges / responsibilities", "특권 · 책임"], ["Values", "가치"], ["Norms", "규범"], ["People", "사람"]]
    .map(([en, ko], i) => `${t(476, 494 + i * 30, en)}${t(828, 494 + i * 30, ko, "sub", "end")}`),
  lines(96, 430, ["Environmental", "resources"], "name"), t(96, 480, "환경의 자원", "sub"),
  p("M290 440 H 414", "flow"),
  p("M866 440 H 990", "flow"),
  lines(1004, 430, ["Environmental", "outputs"], "name"), t(1004, 480, "환경으로의 산출", "sub"),
].join("\n  "));

const routineRows = (cx, cy) => {
  const dots = [];
  for (let row = 0; row < 2; row += 1) for (let i = 0; i < 6; i += 1) dots.push(circle(cx - 60 + i * 20 + row * 26, cy - 40 + i * 14 + row * -12, 9, row ? "deep" : "node"));
  return dots.join("");
};
figures["mis-fig-3-04"] = frame("mis-fig-3-04", {
  figure: "3.4", title: "Routines, Business Processes, and Firms",
  subtitle: "개별 루틴이 모여 비즈니스 프로세스가 되고, 여러 프로세스가 모여 기업이 된다", height: 760,
}, [
  ...[[330, 250, "Business Process 1"], [610, 330, "Business Process 2"], [610, 560, "Business Process 3"], [330, 640, "Business Process N"]]
    .map(([cx, cy, label]) => `${circle(cx, cy, 102, "zone")}${routineRows(cx, cy + 12)}${t(cx, cy - 62, label, "label", "middle")}`),
  box(70, 410, 170, 84, "focal"), t(155, 446, "Individual", "name inverse", "middle"), t(155, 470, "Routines", "name inverse", "middle"),
  p("M240 430 L 300 300"), p("M240 446 L 540 360"), p("M240 474 L 540 580"), p("M240 490 L 300 600"),
  t(155, 524, "개별 루틴(SOP)", "sub", "middle"),
  p("M760 176 C 800 176, 800 196, 800 236 V 650 C 800 690, 800 710, 760 710", "line"),
  p("M832 452 H 920", "both"),
  `<path class="node" d="M1060 330 L 1180 570 L 940 570 Z"/>`,
  t(1060, 506, "Business", "name", "middle"), t(1060, 530, "Firm", "name", "middle"), t(1060, 600, "기업 = 프로세스의 묶음", "sub", "middle"),
].join("\n  "));

figures["mis-fig-3-05"] = frame("mis-fig-3-05", {
  figure: "3.5", title: "Environments and Organizations Have a Reciprocal Relationship",
  subtitle: "정보시스템은 환경의 신호를 걸러 기업 안으로 전달하는 렌즈 역할을 한다", height: 680,
}, [
  box(64, 168, 1152, 488, "zone"),
  t(400, 204, "The Organization and Its Environment · 조직과 환경", "name", "middle"),
  lines(96, 252, ["Environmental Resources", "and Constraints"], "label"), t(96, 300, "환경의 자원과 제약", "sub"),
  circle(980, 420, 220, "node"), t(1040, 250, "The Firm · 기업", "name", "middle"),
  ellipse(822, 420, 44, 156, "deep"),
  ...[["Governments", "정부", 344], ["Competitors", "경쟁자", 372], ["Customers", "고객", 400], ["Financial Institutions", "금융기관", 428], ["Culture", "문화", 456], ["Knowledge", "지식", 584], ["Technology", "기술", 612]]
    .map(([en, ko, y]) => `${t(96, y, en)}${t(300, y, ko, "sub")}${p(`M${en.length > 12 ? 360 : 340} ${y - 5} L 822 ${y < 500 ? 410 : 430}`, "soft")}`),
  p("M822 410 L 1100 330"), p("M822 420 L 1120 420"), p("M822 430 L 1110 520"),
  t(822, 600, "Information Systems", "name", "middle"), t(822, 624, "정보시스템 = 렌즈", "sub", "middle"),
].join("\n  "));

const tier = (count, y, top, cls) => {
  const gap = 46, start = 640 - ((count - 1) * gap) / 2;
  const xs = Array.from({ length: count }, (_, i) => start + i * gap);
  const bar = count > 1 ? p(`M${xs[0]} ${y - 26} H ${xs.at(-1)}`) + xs.map(x => p(`M${x} ${y - 26} V ${y - 17}`)).join("") + p(`M640 ${top} V ${y - 26}`) : "";
  return bar + xs.map(x => circle(x, y, 16, cls)).join("");
};
figures["mis-fig-3-06"] = frame("mis-fig-3-06", {
  figure: "3.6", title: "Flattening Organizations",
  subtitle: "정보시스템은 관리 계층을 줄여 의사결정을 아래로 내리고 조직을 납작하게 만든다", height: 900,
}, [
  `<path class="zone" d="M640 170 L 1120 500 L 160 500 Z"/>`,
  tier(1, 214, 0, "node"), tier(3, 276, 230, "node"), tier(5, 338, 292, "node"), tier(7, 400, 354, "node"), tier(11, 462, 416, "node"),
  t(640, 536, "A traditional hierarchical organization with many levels of management", "label", "middle"),
  t(640, 560, "관리 계층이 많은 전통적 위계 조직", "sub", "middle"),
  `<path class="deep" d="M640 600 L 1120 810 L 160 810 Z"/>`,
  tier(1, 644, 0, "node"), tier(3, 706, 660, "node"), tier(11, 768, 722, "node"),
  t(640, 846, "An organization that has been “flattened” by removing layers of management", "label", "middle"),
  t(640, 870, "관리 계층을 없애 납작해진 조직: 결정이 빨라지고 관리자 수가 줄어든다", "sub", "middle"),
].join("\n  "));

figures["mis-fig-3-07"] = frame("mis-fig-3-07", {
  figure: "3.7", title: "Organizational Resistance to Information Systems Innovations",
  subtitle: "새 시스템은 구조·업무·기술·사람이 맞물려 있어 저항을 부르며, 네 요소를 함께 바꿔야 한다", height: 760,
}, [
  circle(640, 450, 230, "deep"), circle(640, 450, 120, "focal"),
  p("M640 190 V 330", "line"), p("M640 570 V 710", "line"), p("M380 450 H 520", "line"), p("M760 450 H 900", "line"),
  t(640, 436, "Resistance", "name inverse", "middle"), t(640, 460, "to Change", "name inverse", "middle"), t(640, 486, "변화에 대한 저항", "sub inverse", "middle"),
  t(640, 180, "Organizational Structure · 조직 구조", "name", "middle"),
  t(640, 740, "Information Technology · 정보기술", "name", "middle"),
  t(368, 444, "People", "name", "end"), t(368, 470, "사람", "sub", "end"),
  t(912, 444, "Job Tasks", "name"), t(912, 470, "직무", "sub"),
].join("\n  "));

figures["mis-fig-3-08"] = frame("mis-fig-3-08", {
  figure: "3.8", title: "Porter’s Competitive Forces Model",
  subtitle: "기업의 전략적 위치는 기존 경쟁자뿐 아니라 산업 환경의 네 가지 힘에 의해 결정된다", height: 620,
}, [
  ellipse(640, 390, 330, 170, "zone"),
  circle(560, 370, 46, "focal"), circle(720, 370, 46, "node"),
  p("M612 370 H 668", "both"),
  t(560, 450, "The Firm", "name", "middle"), t(560, 474, "기업", "sub", "middle"),
  t(720, 450, "Competitors", "name", "middle"), t(720, 474, "기존 경쟁자", "sub", "middle"),
  ...[[96, 190, "New market entrants", "신규 진입자"], [884, 190, "Substitute products", "대체 제품"], [96, 500, "Suppliers", "공급자"], [884, 500, "Customers", "고객"]]
    .map(([x, y, en, ko]) => `${box(x, y, 300, 92, "node")}${t(x + 150, y + 42, en, "name", "middle")}${t(x + 150, y + 68, ko, "sub", "middle")}`),
].join("\n  "));

const chevron = (x, y, w, h, tip, cls) => `<path class="${cls}" d="M${x} ${y} H ${x + w} L ${x + w + tip} ${y + h / 2} L ${x + w} ${y + h} H ${x} L ${x + tip} ${y + h / 2} Z"/>`;
figures["mis-fig-3-09"] = frame("mis-fig-3-09", {
  figure: "3.9", title: "The Value Chain Model",
  subtitle: "기업 가치사슬의 지원·본원적 활동마다 IS를 적용할 수 있고, 기업 가치사슬은 산업 가치사슬과 이어진다", height: 960,
}, [
  `<path class="zone" d="M190 176 H 1050 L 1140 436 L 1050 696 H 190 Z"/>`,
  ...[["Administration and Management · 관리", "Electronic scheduling and messaging systems"], ["Human Resources · 인적자원", "Workforce planning systems"], ["Technology · 기술", "Computer-aided design systems"], ["Procurement · 조달", "Computerized ordering systems"]]
    .map(([head, sys], i) => `${p(`M190 ${176 + (i + 1) * 64} H 1050`, "soft")}${t(214, 202 + i * 64, head, "name")}${t(214, 226 + i * 64, sys, "sub")}`),
  ...[["Inbound", "Logistics", ["Automated", "warehousing", "systems"]], ["Operations", "", ["Computer-", "controlled", "machining systems"]], ["Sales and", "Marketing", ["Computerized", "ordering", "systems"]], ["Service", "", ["Equipment", "maintenance", "systems"]], ["Outbound", "Logistics", ["Automated", "shipment", "scheduling systems"]]]
    .map(([a, b, sys], i) => {
      const x = 190 + i * 172;
      return `${i ? p(`M${x} 432 V 696`, "soft") : ""}${t(x + 16, 462, a, "name")}${b ? t(x + 16, 484, b, "name") : ""}${lines(x + 16, 530, sys, "sub", 20)}`;
    }),
  t(1080, 420, "Firm Value", "name", "middle"), t(1080, 444, "Chain", "name", "middle"),
  p("M174 176 H 150 V 428 H 174", "dash"), p("M174 440 H 150 V 696 H 174", "dash"),
  lines(72, 296, ["Support", "Activities"], "name", 22), t(72, 344, "지원 활동", "sub"),
  lines(72, 560, ["Primary", "Activities"], "name", 22), t(72, 608, "본원적 활동", "sub"),
  p("M420 696 L 560 800", "dash"), p("M820 696 L 700 800", "dash"),
  lines(96, 740, ["Sourcing and Procurement", "Systems"], "label"), t(96, 786, "조달 시스템", "sub"),
  lines(940, 740, ["Customer Relationship", "Management Systems"], "label"), t(940, 786, "고객관계관리 시스템", "sub"),
  ...[["Suppliers’ Suppliers", "공급자의 공급자"], ["Suppliers", "공급자"], ["Firm", "기업"], ["Distributors", "유통업체"], ["Customers", "고객"]]
    .map(([en, ko], i) => `${chevron(80 + i * 224, 808, 206, 72, 24, i === 2 ? "focal" : "node")}${t(196 + i * 224, 840, en, i === 2 ? "name inverse" : "name", "middle")}${t(196 + i * 224, 862, ko, i === 2 ? "sub inverse" : "sub", "middle")}`),
  t(640, 920, "Industry Value Chain · 산업 가치사슬", "name", "middle"),
].join("\n  "));

figures["mis-fig-3-10"] = frame("mis-fig-3-10", {
  figure: "3.10", title: "The Value Web",
  subtitle: "독립된 기업들이 IT로 가치사슬을 연결해 공급과 수요 변화에 함께 대응하는 네트워크", height: 900,
}, [
  circle(640, 520, 138, "focal"),
  lines(640, 470, ["Industry Firms", "ERP Systems", "Core Transaction", "Systems"], "name inverse", 28, "middle"),
  t(640, 594, "산업 내 기업 · ERP · 핵심 거래 시스템", "sub inverse", "middle"),
  ...[[640, 246, ["Strategic Alliance", "and Partner Firms"], "전략적 제휴 · 파트너 기업"], [290, 520, ["Suppliers", "Suppliers’ Suppliers"], "공급자 · 공급자의 공급자"], [990, 520, ["Customers", "Customers’ Customers"], "고객 · 고객의 고객"], [640, 794, ["Indirect Suppliers"], "간접 공급자"]]
    .map(([cx, cy, names, ko]) => `${circle(cx, cy, 102, "zone")}${lines(cx, cy - (names.length - 1) * 12, names, "name", 24, "middle")}${t(cx, cy + 12 + names.length * 12 + 10, ko, "sub", "middle")}`),
  p("M640 352 V 378", "both"), p("M640 662 V 688", "both"),
  p("M396 520 H 498", "both"), p("M782 520 H 884", "both"),
  lines(96, 700, ["Supply Chain Management Systems", "Supplier Extranets", "Net Marketplaces"], "label", 28),
  t(96, 788, "공급망관리 · 공급자 엑스트라넷 · 넷 마켓플레이스", "sub"),
  lines(860, 700, ["Customer Relationship", "Management Systems"], "label", 28),
  t(860, 760, "고객관계관리 시스템", "sub"),
].join("\n  "));

figures["mis-fig-3-11"] = frame("mis-fig-3-11", {
  figure: "3.11", title: "An Ecosystem Strategic Model",
  subtitle: "디지털 시대에는 여러 산업이 묶인 생태계 전체가 다섯 가지 경쟁 요인과 맞선다", height: 640,
}, [
  box(64, 168, 1152, 448, "zone"),
  ellipse(640, 380, 280, 170, "deep"),
  ...[[540, 320, "Industry 1"], [740, 320, "Industry 2"], [540, 440, "Industry 3"], [740, 440, "Industry 4"]]
    .map(([cx, cy, label]) => `${circle(cx, cy, 50, "node")}${t(cx, cy + 6, label, "name", "middle")}`),
  t(640, 588, "Industry Ecosystem · 산업 생태계", "name", "middle"),
  ...[[96, 196, ["New Market", "Entrants"], "신규 진입자", "M356 262 L 404 300"], [924, 196, ["Substitute Products", "and Services"], "대체 제품·서비스", "M924 262 L 876 300"], [96, 470, ["Suppliers"], "공급자", "M356 500 L 404 462"], [924, 470, ["Customers"], "고객", "M924 500 L 876 462"]]
    .map(([x, y, names, ko, d]) => `${box(x, y, 260, 100, "node")}${lines(x + 130, y + 40 - (names.length - 1) * 11, names, "name", 22, "middle")}${t(x + 130, y + 82, ko, "sub", "middle")}${p(d, "flow")}`),
].join("\n  "));

for (const [slug, svg] of Object.entries(figures)) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(Object.keys(figures).join(" "));
