// Generates the concept diagrams for the MIS glossary note (lecture-00):
// one overall concept map, one overview per chapter, and one or more detail figures per concept group.
// Run: node scripts/generate-mis-glossary-diagrams.mjs
import fs from "node:fs";
import path from "node:path";
import { W, X0, CW, arrow, header, label, legend, node, nodeHeight, note, rows, svgDocument, SIZE, wrap, zone } from "./mis-glossary-kit.mjs";

const outDir = path.join("public", "materials", "diagrams");
const figures = [];
const fig = (slug, meta, build) => figures.push({ slug, meta, build });

// Finishes a figure: header, body, optional legend and caption note, bottom padding.
function compose(meta, body) {
  const head = header(meta);
  const parts = [head.svg];
  const result = body(head.y);
  parts.push(result.svg);
  let y = result.y;
  // Only list legend symbols the figure actually draws.
  const drawn = { flow: /class="flow[ "]/, dash: /class="dash/, both: /class="(flow|dash)[^"]* both/, focal: /class="focal"/, outside: /class="outside"/, zone: /class="(zone|deep)"/ };
  const keys = meta.legend ? Object.keys(drawn).filter(key => drawn[key].test(result.svg)) : [];
  if (keys.length) { const l = legend(keys, y + 6); parts.push(l.svg); y += l.height + 4; }
  if (meta.note) { const n = note(meta.note, y + 8); parts.push(n.svg); y = n.y; }
  return { svg: parts.join(""), height: y + 20 };
}

// Zone drawn behind a set of placed rows.
function zoneAround(placed, from, to, caption, pad = 10, style = "zone", center = false) {
  const top = placed[from].y - pad - (caption ? 24 : 0);
  const bottom = placed[to].y + placed[to].h + pad;
  return zone(X0 - 8, top, CW + 16, bottom - top, caption, { style, center });
}

// Two-column snake for chapter overviews: 1 → 2, ↓, 4 ← 3, ↓, 5 → 6 ...
function snake(items, labels, startY) {
  const gap = 64;
  const w = (CW - gap) / 2;
  const out = [];
  const rowsOf = [];
  for (let i = 0; i < items.length; i += 2) rowsOf.push(items.slice(i, i + 2));
  let y = startY;
  const boxes = [];
  rowsOf.forEach((pair, r) => {
    const h = Math.max(...pair.map(spec => nodeHeight(spec, w)));
    pair.forEach((spec, c) => {
      const col = r % 2 === 0 ? c : 1 - c;
      const x = X0 + col * (w + gap);
      out.push(node(spec, x, y, w, h));
      boxes.push({ x, y, w, h });
    });
    y += h + 58;
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i], b = boxes[i + 1];
    if (a.y === b.y) {
      const leftToRight = a.x < b.x;
      const y0 = a.y + a.h / 2;
      out.push(arrow([[leftToRight ? a.x + a.w : a.x, y0], [leftToRight ? b.x : b.x + b.w, y0]], { text: labels[i] }));
    } else {
      const x0 = a.x + a.w / 2;
      out.push(arrow([[x0, a.y + a.h], [x0, b.y]], { text: labels[i] }));
    }
  }
  return { svg: out.join(""), y: y - 58 + 24 };
}

const g = (num, title, body, style) => ({ tag: num, title, body, style });

// =============================================================================================
// A · overall concept map
fig("mis-gl-00-concept-map", {
  eyebrow: "Chapter 1–4 · 전체 개념 지도",
  title: "네 장은 하나의 질문 사슬이다",
  subtitle: "IS가 가치를 만드는 원리 → 업무를 지원하는 시스템 → 조직·전략과의 상호작용 → 윤리·사회적 책임",
  desc: "1장 정보시스템과 가치, 2장 프로세스·전사 시스템·지식관리, 3장 조직과 전략, 4장 윤리와 사회적 책임을 위에서 아래로 놓고, 각 장의 핵심 질문과 개념 묶음, 장 사이의 구체화·영향·새 쟁점 관계와 4장이 앞 장을 제약하는 점선 관계를 보여 주는 개념 지도",
  legend: ["flow", "dash", "focal"],
  note: "점선 화살표: 4장의 법·윤리 기준이 1–3장의 시스템 설계와 투자 판단을 다시 제약한다.",
}, y0 => {
  const bandW = CW - 64;
  const chapters = [
    ["1장 · 정보시스템과 비즈니스 가치", "같은 IT를 사도 왜 성과가 다를까?", "1-1 디지털 기업 · 1-2 여섯 투자 목표 · 1-3 IT·IS, 데이터·정보, IPO · 1-4 세 차원·IT 인프라 · 1-5 정보 가치사슬·보완 자산 · 1-6 사회기술적 관점"],
    ["2장 · 프로세스·전사 시스템·지식관리", "시스템은 업무·결정·지식을 어떻게 지원할까?", "2-1 프로세스 · 2-2 TPS·MIS·DSS·ESS · 2-3 ERP·SCM·CRM·KMS · 2-4 인트라넷·e-business · 2-5 협업 · 2-6~2-8 지식관리·AI · 2-9 IT 거버넌스"],
    ["3장 · 조직과 전략", "조직과 IT는 서로를 어떻게 바꾸고, IT로 어떻게 경쟁할까?", "3-1 조직의 정의·양방향 관계 · 3-2 루틴·문화·정치·구조 · 3-3 거래·대리인 비용, 변화 저항 · 3-4 다섯 경쟁 요인·네 전략 · 3-5 가치사슬·네트워크 전략"],
    ["4장 · 윤리와 사회적 책임", "IS가 만든 힘을 누가 어떤 책임으로 통제할까?", "4-1 다섯 도덕적 차원 · 4-2 프로파일링·NORA · 4-3 책임·판단 원칙 · 4-4 프라이버시·FIP · 4-5 지식재산 · 4-6 책임·시스템 품질 · 4-7 삶의 질"],
  ];
  const links = ["구체화: 원리 → 업무별 시스템", "영향: 시스템이 조직·경쟁을 바꿈", "새 쟁점: 데이터·권력의 집중"];
  const out = [];
  let y = y0;
  const bands = [];
  for (const [caption, question, groups] of chapters) {
    const inner = bandW - 24;
    const q = wrap(question, inner, SIZE.name, true);
    const body = wrap(groups, inner, SIZE.body);
    const h = 26 + q.length * 23 + 8 + body.length * 20.5 + 12;
    out.push(zone(X0, y, bandW, h, caption));
    let ty = y + 26 + 18;
    for (const line of q) { out.push(`<text class="name" x="${X0 + 12}" y="${ty}">${line}</text>`); ty += 23; }
    ty += 6;
    for (const line of body) { out.push(`<text class="body" x="${X0 + 12}" y="${ty}">${line.replace(/&/g, "&amp;")}</text>`); ty += 20.5; }
    bands.push({ y, h });
    y += h + 52;
  }
  bands.slice(0, -1).forEach((b, i) => {
    const x = X0 + bandW / 2;
    out.push(arrow([[x, b.y + b.h], [x, bands[i + 1].y]], { text: links[i] }));
  });
  const rx = X0 + bandW + 32;
  const first = bands[0], last = bands.at(-1);
  out.push(arrow([[X0 + bandW, last.y + last.h / 2], [rx, last.y + last.h / 2], [rx, first.y + first.h / 2], [X0 + bandW, first.y + first.h / 2]], { dashed: true }));
  out.push(label(rx, (first.y + last.y + last.h) / 2, "제약"));
  return { svg: out.join(""), y: y - 52 + 18 };
});

// =============================================================================================
// B · chapter overviews
fig("mis-gl-1-overview", {
  eyebrow: "1장 개요 · 개념 묶음 6개",
  title: "IT 투자가 비즈니스 가치가 되기까지",
  subtitle: "핵심 질문: 같은 정보기술을 사고도 왜 어떤 기업은 성과를 내고 어떤 기업은 실패할까?",
  desc: "1장의 여섯 개념 묶음을 디지털 기업과 변화, 여섯 투자 목표, 정보시스템의 기본 단위, 세 차원과 IT 인프라, 정보 가치사슬과 보완 자산, 세 가지 접근법 순서로 지그재그로 연결한 개요도",
  legend: ["flow", "focal"],
}, y0 => snake([
  g("1-1", "디지털 기업과 변화", ["세계화·새 사업모형이 디지털 전환을 압박"]),
  g("1-2", "IS 투자의 여섯 목표", ["운영 우수성부터 생존까지"]),
  g("1-3", "정보시스템의 기본 단위", ["IT ⊂ IS, 데이터 → 정보, 입력·처리·출력·피드백"]),
  g("1-4", "세 차원과 IT 인프라", ["조직 · 경영 · 기술"]),
  g("1-5", "IT 투자가 가치가 되는 길", ["정보 가치사슬 + 보완 자산"], "focal"),
  g("1-6", "IS를 보는 세 접근법", ["기술적 · 행동적 · 사회기술적"]),
], ["목적", "수단", "구성", "조건", "설명"], y0));

fig("mis-gl-2-overview", {
  eyebrow: "2장 개요 · 개념 묶음 9개",
  title: "업무 흐름에서 조직 지식과 IT 거버넌스까지",
  subtitle: "핵심 질문: 정보시스템은 기업의 업무·의사결정·협업·지식을 어떻게 지원하는가?",
  desc: "2장의 흐름을 프로세스, 관리 계층별 시스템, 전사 통합과 인터넷 연결, 협업, 지식관리, IS 기능의 여섯 단계로 지그재그로 연결하고 각 단계에 해당하는 개념 묶음 번호를 적은 개요도",
  legend: ["flow", "focal"],
}, y0 => snake([
  g("2-1", "비즈니스 프로세스와 IT", ["기능별·범기능 프로세스, 자동화·재설계, AI 역할"]),
  g("2-2", "관리 계층별 시스템", ["TPS → MIS · DSS → ESS, BI"]),
  g("2-3 · 2-4", "전사 통합과 연결 범위", ["ERP·SCM·CRM·KMS, 인트라넷·엑스트라넷·e-business"]),
  g("2-5", "협업과 소셜 비즈니스", ["역량 + 기술 → 협업의 질, 시간·공간 매트릭스"]),
  g("2-6 · 2-7 · 2-8", "지식관리", ["지식의 성격, KM 가치사슬, KMS 유형·AI"], "focal"),
  g("2-9", "IS 기능과 IT 거버넌스", ["IS 부서, C-level 역할, 결정 권한·책임"]),
], ["지원", "통합", "확장", "공유", "운영"], y0));

fig("mis-gl-3-overview", {
  eyebrow: "3장 개요 · 개념 묶음 5개",
  title: "조직을 이해해야 IT로 경쟁할 수 있다",
  subtitle: "핵심 질문: 조직과 IT는 서로를 어떻게 바꾸며, IT를 경쟁 전략에 어떻게 쓰는가?",
  desc: "3장의 다섯 개념 묶음을 조직의 정의와 양방향 관계, 조직의 특징과 구조, IT의 조직 영향, 경쟁 요인과 전략, 가치사슬과 네트워크 전략 순서로 지그재그로 연결한 개요도",
  legend: ["flow", "focal"],
}, y0 => snake([
  g("3-1", "조직의 정의와 양방향 관계", ["기술적·행동적 정의, 매개 요인"]),
  g("3-2", "조직의 특징과 구조", ["루틴·정치·문화·환경, 다섯 구조"]),
  g("3-3", "IT가 조직에 미치는 영향", ["거래·대리인 비용, 납작한 조직, 변화 저항"]),
  g("3-4", "경쟁 요인과 경쟁 전략", ["다섯 힘 → 네 기본 전략"], "focal"),
  g("3-5", "가치사슬과 네트워크 전략", ["가치 웹·시너지·핵심 역량·생태계"]),
], ["구체화", "매개", "전략화", "적용 지점"], y0));

fig("mis-gl-4-overview", {
  eyebrow: "4장 개요 · 개념 묶음 7개",
  title: "윤리 분석 틀을 다섯 차원에 적용한다",
  subtitle: "핵심 질문: 정보시스템이 만든 새로운 힘을 누가 어떤 권리·책임·규칙으로 통제할 것인가?",
  desc: "4-1 윤리 쟁점의 구조에서 4-3 책임 개념과 판단 원칙이 나오고, 이 원칙이 다섯 도덕적 차원에 대응하는 4-2와 4-4 정보 권리, 4-5 재산권, 4-6 책임과 시스템 품질, 4-7 삶의 질 묶음에 적용되는 구조",
  legend: ["flow", "focal", "zone"],
}, y0 => {
  const r = rows([
    { nodes: [g("4-1", "윤리 쟁점의 구조", ["개인 → 사회 → 정치로 번지는 파장, 다섯 도덕적 차원"], "focal")], edge: { type: "flow", text: "분석 도구 제공" } },
    { nodes: [g("4-3", "책임 개념과 판단 원칙", ["책임 → 추적 → 배상 → 적법 절차, 분석 5단계, 6원칙"])], edge: { type: "rise", texts: ["적용", "적용"] } },
    { nodes: [g("정보 권리", "4-2 · 4-4", ["프로파일링·NORA, 프라이버시·FIP·동의"]), g("재산권", "4-5", ["저작권·특허·상표·영업비밀"])], after: 14 },
    { nodes: [g("책임·통제 + 시스템 품질", "4-6", ["소프트웨어 책임, 데이터 품질"]), g("삶의 질", "4-7", ["권력 집중·범죄·격차·건강"])] },
  ], y0);
  const z = zoneAround(r.placed, 2, 3, "다섯 도덕적 차원별 쟁점", 10, "zone", true);
  return { svg: z + r.svg, y: r.y };
});

// =============================================================================================
// C · Chapter 1 detail figures
fig("mis-gl-1a-digital-firm", {
  eyebrow: "1장 · 1-1 디지털 기업과 변화",
  title: "디지털 기업의 세 특징",
  subtitle: "환경 변화가 디지털 전환을 압박하고, 세 특징이 갖춰지면 시간·장소의 제약이 줄어든다",
  desc: "세계화, IT 혁신, 새 사업모형이 디지털 기업을 만들도록 영향을 주고, 디지털 기업은 관계, 핵심 프로세스, 핵심 자산의 세 특징을 포함하며, 그 결과 time shifting과 space shifting이 가능해지는 계층 그림",
  legend: ["flow", "dash", "focal", "outside"],
}, y0 => rows([
  { nodes: [{ title: "세계화", body: ["연결 비용 ↓", "기회·경쟁 ↑"], style: "outside" }, { title: "IT 혁신", body: ["클라우드·모바일", "AI·빅데이터"], style: "outside" }, { title: "새 사업모형", body: ["스트리밍", "온디맨드"], style: "outside" }], edge: { type: "merge", text: "영향", dashed: true } },
  { nodes: [{ tag: "Digital firm", title: "디지털 기업", body: ["중요한 관계·핵심 프로세스·핵심 자산이 디지털로 연결·수행·관리된다"], style: "focal" }], edge: { type: "bus", text: "포함" } },
  { nodes: [{ title: "관계", body: ["고객·공급업체·직원"] }, { title: "핵심 프로세스", body: ["주문→결제→배송"] }, { title: "핵심 자산", body: ["지식재산·재무·인적"] }], edge: { type: "flow", text: "가능해짐" } },
  { nodes: [{ tag: "Time shifting", title: "시간 제약 ↓", body: ["24시간 업무가 이어짐"] }, { tag: "Space shifting", title: "장소 제약 ↓", body: ["어디서나 수행·조정"] }] },
], y0));

fig("mis-gl-1b-objectives", {
  eyebrow: "1장 · 1-2 IS 투자의 여섯 목표",
  title: "여섯 전략적 비즈니스 목표와 대표 사례",
  subtitle: "운·신·친·결 네 목표는 경쟁우위로 이어질 수 있고, 경쟁사가 따라 하면 같은 기술이 생존 조건이 된다",
  desc: "운영 우수성, 신제품·서비스·사업모형, 고객·공급업체 친밀성, 의사결정 개선의 네 목표와 슬라이드 사례가 경쟁우위로 이어지고, 경쟁사가 같은 시스템을 도입하면 생존 목표가 되는 관계를 보여 주는 그림",
  legend: ["flow", "dash", "focal", "zone"],
}, y0 => {
  const r = rows([
    { nodes: [{ tag: "① Operational excellence", title: "운영 우수성", body: ["Walmart Retail Link"] }, { tag: "② New products · business models", title: "신제품·사업모형", body: ["Apple iTunes"] }], after: 14 },
    { nodes: [{ tag: "③ Customer & supplier intimacy", title: "고객·공급업체 친밀성", body: ["Mandarin Oriental, JCPenney–TAL"] }, { tag: "④ Improved decision making", title: "의사결정 개선", body: ["Verizon 대시보드"] }], edge: { type: "flow", text: "결과로 이어질 수 있음" } },
    { nodes: [{ tag: "⑤ Competitive advantage", title: "경쟁우위", body: ["경쟁사 대비 우위 · Apple, Walmart, UPS"], style: "focal" }], edge: { type: "flow", text: "경쟁사가 따라 하면", dashed: true } },
    { nodes: [{ tag: "⑥ Survival", title: "생존", body: ["업계 표준·규제 대응 · Citibank ATM, SOX"] }] },
  ], y0 + 26);
  return { svg: zoneAround(r.placed, 0, 1, "앞의 네 목표 (자기 기업 기준의 개선)") + r.svg, y: r.y };
});

fig("mis-gl-1c-it-is", {
  eyebrow: "1장 · 1-3 정보시스템의 기본 단위 ①",
  title: "IT는 IS의 한 부분이다",
  subtitle: "IS는 기술에 사람과 절차가 결합된 체계이고, 데이터를 정보로 바꿔 결정·조정·통제를 돕는다",
  desc: "정보시스템이 IT, 사람, 절차와 조직을 포함하는 범위 안에 있고, 정보시스템이 원시 데이터를 처리해 의사결정에 쓰이는 정보로 바꾸는 관계를 슈퍼마켓 계산대 사례로 보여 주는 그림",
  legend: ["flow", "zone"],
}, y0 => {
  const r = rows([
    { nodes: [{ tag: "IT", title: "기술 도구", body: ["하드웨어", "소프트웨어"] }, { tag: "People", title: "사람", body: ["사용자", "관리자"] }, { tag: "Procedures", title: "절차·조직", body: ["규칙", "업무 방식"] }], edge: { type: "flow", text: "IS가 수행: 수집·처리·저장·배포" } },
    { nodes: [{ tag: "Data", title: "원시 사실", body: ["품목번호·품명·가격"] }, { tag: "Information", title: "의미 있는 정보", body: ["주방세제 지역별 매출·YTD"], style: "focal" }], link: { text: "처리" }, edge: { type: "flow", text: "사용" } },
    { nodes: [{ title: "의사결정 · 조정 · 통제", body: ["예: 지역별 발주량 조정"] }] },
  ], y0 + 26);
  return { svg: zoneAround(r.placed, 0, 0, "IS · 정보시스템 = IT + 사람 + 절차 (포함 관계)") + r.svg, y: r.y };
});

fig("mis-gl-1d-ipo-feedback", {
  eyebrow: "1장 · 1-3 정보시스템의 기본 단위 ②",
  title: "입력 · 처리 · 출력과 피드백",
  subtitle: "세 기본 활동이 정보를 만들고, 피드백은 출력을 돌려 입력·처리를 평가하고 고친다",
  desc: "조직 밖 환경의 고객, 공급업체, 경쟁자, 주주, 규제기관에서 원시 데이터가 들어와 입력, 처리, 출력을 거쳐 사람의 의사결정과 행동이 되고, 출력에서 입력으로 되돌아가는 피드백 점선 화살표가 있는 그림",
  legend: ["flow", "dash", "outside", "zone"],
}, y0 => {
  const span = Math.round(CW * 0.74);
  const r = rows([
    { nodes: [{ tag: "Environment · 조직 밖 환경", title: "고객 · 공급업체 · 경쟁자 · 주주 · 규제기관", style: "outside" }], span, edge: { type: "flow", text: "원시 데이터" } },
    { nodes: [{ tag: "Input", title: "입력", body: ["원시 데이터를 포착"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "Processing", title: "처리", body: ["분류·계산·요약"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "Output", title: "출력", body: ["필요한 사람·활동에 전달"], style: "focal" }], span, edge: { type: "flow", text: "정보 제공" } },
    { nodes: [{ title: "의사결정 · 행동", body: ["발주·조정·통제 (사람이 수행)"] }], span },
  ], y0 + 26);
  const p = r.placed;
  const rx = X0 + span + 34;
  const fb = arrow([[X0 + span, p[3].y + p[3].h / 2], [rx, p[3].y + p[3].h / 2], [rx, p[1].y + p[1].h / 2], [X0 + span, p[1].y + p[1].h / 2]], { dashed: true });
  const z = zone(X0 - 8, p[1].y - 34, span + 16, p[3].y + p[3].h - p[1].y + 44, "정보시스템 (IS)");
  return { svg: z + r.svg + fb + label(rx, (p[1].y + p[3].y + p[3].h) / 2, "피드백"), y: r.y };
});

fig("mis-gl-1e-dimensions", {
  eyebrow: "1장 · 1-4 세 차원과 IT 인프라",
  title: "정보시스템을 이해하는 세 차원",
  subtitle: "조직·경영·기술은 별도 제품이 아니라 같은 시스템을 보는 세 관점이다",
  desc: "비즈니스 문제의 해결책인 정보시스템이 조직, 경영, 기술의 세 차원으로 나뉘고, 기술 차원의 하드웨어·소프트웨어·데이터 관리·네트워킹이 운영 인력과 함께 IT 인프라를 이루는 계층 그림",
  legend: ["flow", "focal"],
}, y0 => {
  const r = rows([
    { nodes: [{ title: "정보시스템", body: ["환경이 던진 비즈니스 문제에 대한 조직적·경영적 해결책"], style: "focal" }], edge: { type: "bus", text: "세 관점" } },
    { nodes: [{ tag: "Organization", title: "조직", body: ["사람·구조", "프로세스", "정치·문화"] }, { tag: "Management", title: "경영", body: ["전략 설정", "자원 배분", "변화 주도"] }, { tag: "Technology", title: "기술", body: ["H/W·S/W", "데이터 관리", "네트워크"] }], after: 58 },
  ], y0);
  const tech = r.placed[1].boxes[2];
  const w = Math.round(CW * 0.62);
  const x = W - X0 - w;
  const spec = { tag: "IT infrastructure", title: "IT 인프라", body: ["여러 시스템이 함께 쓰는 기술 기반 + 운영 인력"] };
  const h = nodeHeight(spec, w);
  const y = r.y;
  const out = r.svg + node(spec, x, y, w, h) + arrow([[tech.x + tech.w / 2, tech.y + tech.h], [tech.x + tech.w / 2, y]], { text: "구성" });
  return { svg: out, y: y + h + 24 };
});

fig("mis-gl-1f-value-chain", {
  eyebrow: "1장 · 1-5 IT 투자가 가치가 되는 길 ①",
  title: "비즈니스 정보 가치사슬",
  subtitle: "정보 처리 활동이 경영 활동을 거쳐야 수익성과 전략적 위치라는 가치가 된다",
  desc: "데이터 수집·저장, 비즈니스 시스템으로의 변환, 배포의 정보 처리 활동이 비즈니스 프로세스와 경영 활동의 개선으로 이어지고 기업의 수익성과 전략적 위치를 높이며, 보완 자산이 경영 활동 단계를 지원하는 점선 화살표가 있는 그림",
  legend: ["flow", "dash", "focal"],
}, y0 => {
  const span = Math.round(CW * 0.6);
  const r = rows([
    { nodes: [{ tag: "정보 처리 활동", title: "수집·저장 → 변환 → 배포", body: ["데이터가 정보로 바뀐다"] }], span, edge: { type: "flow", text: "정보 제공" } },
    { nodes: [{ tag: "비즈니스 프로세스", title: "SCM·전사·고객·지식 관리", body: ["업무 방식이 바뀐다"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "경영 활동", title: "계획·조정·통제·결정", body: ["더 나은 결정을 내린다"] }], span, edge: { type: "flow", text: "결과" } },
    { nodes: [{ tag: "Business value", title: "수익성·전략적 위치", body: ["생산성·매출 ↑"], style: "focal" }], span },
  ], y0);
  const p = r.placed;
  const sideX = X0 + span + 40;
  const sideW = W - X0 - sideX;
  const spec = { tag: "Complementary assets", title: "보완 자산", body: ["교육·권한", "새 프로세스", "경영 지원"] };
  const sh = nodeHeight(spec, sideW);
  const sy = (p[1].y + p[2].y + p[2].h) / 2 - sh / 2;
  const out = node(spec, sideX, sy, sideW, sh)
    + arrow([[sideX, sy + sh * 0.3], [X0 + span, p[1].y + p[1].h / 2]], { dashed: true })
    + arrow([[sideX, sy + sh * 0.7], [X0 + span, p[2].y + p[2].h / 2]], { dashed: true })
    + label(sideX - 20 + 0, sy - 14, "지원");
  return { svg: r.svg + out, y: r.y };
});

fig("mis-gl-1g-complementary-assets", {
  eyebrow: "1장 · 1-5 IT 투자가 가치가 되는 길 ②",
  title: "보완 자산의 세 유형",
  subtitle: "같은 IT를 사도 성과가 갈리는 이유 — 기술을 쓸 수 있게 만드는 조건이 함께 있어야 한다",
  desc: "보완 자산이 조직적 자산, 경영적 자산, 사회적 자산의 세 유형을 포함하고, 세 유형이 IT 투자와 함께 높은 투자 수익을 지원한다는 계층 그림. 사회적 자산은 기업이 아니라 사회가 만든다",
  legend: ["flow", "focal", "outside"],
}, y0 => rows([
  { nodes: [{ tag: "Complementary assets", title: "보완 자산", body: ["주된 투자(IT)가 가치를 내도록 함께 필요한 자산"], style: "focal" }], edge: { type: "bus", text: "포함" } },
  { nodes: [{ tag: "Organizational", title: "조직적", body: ["적절한 사업모형", "효율적 프로세스"] }, { tag: "Managerial", title: "경영적", body: ["경영진 지원", "혁신 유인·팀워크"] }, { tag: "Social", title: "사회적", body: ["인터넷·통신 인프라", "기술 표준"], style: "outside" }], edge: { type: "merge", text: "지원" } },
  { nodes: [{ title: "IT 투자 + 보완 자산 → 높은 수익", body: ["보완 투자가 없으면 수익이 낮거나 0 (Figure 1.8)"] }] },
], y0));

fig("mis-gl-1h-approaches", {
  eyebrow: "1장 · 1-6 IS를 보는 세 접근법",
  title: "기술적 · 행동적 · 사회기술적 관점",
  subtitle: "두 접근의 강조점을 결합해 기술과 조직을 함께 조정하는 것이 사회기술적 관점이다",
  desc: "컴퓨터과학·경영과학·운영연구의 기술적 접근과 심리학·사회학·경제학의 행동적 접근이 결합되어 사회기술적 관점이 되고, 사회기술적 관점은 기술 대안과 조직 대안을 서로 맞추는 공동 최적화를 뜻하는 그림",
  legend: ["flow", "both", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Technical approach", title: "기술적 접근", body: ["컴퓨터과학·경영과학·운영연구", "수학적 모형·효율"] }, { tag: "Behavioral approach", title: "행동적 접근", body: ["심리학·사회학·경제학", "수용·변화·유인"] }], edge: { type: "merge", text: "결합" } },
  { nodes: [{ tag: "Sociotechnical view", title: "사회기술적 관점", body: ["Joint optimization: 만족스러운 적합까지 서로 맞춘다"], style: "focal" }], edge: { type: "bus", text: "함께 조정" } },
  { nodes: [{ title: "기술 쪽 대안", body: ["기능·화면·규칙"] }, { title: "조직 쪽 대안", body: ["역할·권한·프로세스"] }], link: { text: "상호", both: true } },
], y0));

// =============================================================================================
// C · Chapter 2 detail figures
fig("mis-gl-2a-order-fulfillment", {
  eyebrow: "2장 · 2-1 비즈니스 프로세스와 IT ①",
  title: "주문 이행은 세 부서를 가로지른다",
  subtitle: "Figure 2.1 · 한 주문이 영업 → 회계 → 생산 순서로 넘어가는 범기능(cross-functional) 프로세스",
  desc: "영업, 회계, 생산 세 기능 부서를 세로 열로 나누고, 주문 생성과 제출(영업), 신용 확인·승인과 송장 생성(회계), 제품 조립과 배송(생산)이 위에서 아래로 차례로 이어지는 수영 레인 그림",
  legend: ["flow", "zone"],
}, y0 => {
  const lanes = ["영업 Sales", "회계 Accounting", "생산 Production"];
  const steps = [[0, "주문 생성"], [0, "주문 제출"], [1, "신용 확인"], [1, "신용 승인"], [1, "송장 생성"], [2, "제품 조립"], [2, "제품 배송"]];
  const gap = 8;
  const lw = (CW + 16 - gap * 2) / 3;
  const top = y0;
  const rowH = 46, rowGap = 22;
  const height = 34 + steps.length * (rowH + rowGap);
  const out = [];
  lanes.forEach((name, i) => out.push(zone(X0 - 8 + i * (lw + gap), top, lw, height, name)));
  const boxes = steps.map(([lane, text], i) => {
    const x = X0 - 8 + lane * (lw + gap) + 8;
    const y = top + 34 + i * (rowH + rowGap);
    const w = lw - 16;
    out.push(node({ title: text }, x, y, w, rowH));
    return { x, y, w };
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i], b = boxes[i + 1];
    const ax = a.x + a.w / 2, bx = b.x + b.w / 2;
    if (ax === bx) out.push(arrow([[ax, a.y + rowH], [bx, b.y]]));
    else out.push(arrow([[ax, a.y + rowH], [ax, a.y + rowH + rowGap / 2], [bx, a.y + rowH + rowGap / 2], [bx, b.y]], { text: i === 1 ? "주문 정보 전달" : "승인 후 생산 지시", at: 1 }));
  }
  return { svg: out.join(""), y: top + height + 24 };
});

fig("mis-gl-2b-automation-redesign", {
  eyebrow: "2장 · 2-1 비즈니스 프로세스와 IT ②",
  title: "자동화 vs 프로세스 재설계",
  subtitle: "업무 순서가 그대로면 자동화, 정보 흐름이 바뀌어 순서 자체가 달라지면 재설계다",
  desc: "왼쪽은 접수, 확인, 승인의 순서가 그대로이고 각 단계가 빨라지는 자동화, 오른쪽은 같은 주문 정보를 여러 부서가 동시에 확인해 순차 단계가 병렬로 바뀌는 재설계를 비교하고, 아래에 IT가 가능하게 한 새 프로세스 사례를 둔 비교 그림",
  legend: ["flow", "zone"],
}, y0 => {
  const colW = (CW - 24) / 2;
  const out = [];
  const xL = X0, xR = X0 + colW + 24;
  const top = y0 + 26;
  out.push(zone(xL - 6, y0, colW + 12, 330, "Automation · 자동화"), zone(xR - 6, y0, colW + 12, 330, "Redesign · 재설계"));
  const step = (x, y, w, t) => node({ title: t }, x, y, w, 46);
  // left: same order, faster
  ["주문 접수", "재고 확인", "신용 승인", "출고"].forEach((t, i) => {
    out.push(step(xL + 10, top + 8 + i * 72, colW - 20, t));
    if (i < 3) out.push(arrow([[xL + colW / 2, top + 54 + i * 72], [xL + colW / 2, top + 80 + i * 72]]));
  });
  // right: parallel checks
  out.push(step(xR + 10, top + 8, colW - 20, "주문 접수"));
  const half = (colW - 30) / 2;
  out.push(step(xR + 10, top + 116, half, "재고 확인"), step(xR + 20 + half, top + 116, half, "신용 승인"));
  out.push(arrow([[xR + 10 + half / 2, top + 54], [xR + 10 + half / 2, top + 116]], { text: "동시에" }));
  out.push(arrow([[xR + 20 + half * 1.5, top + 54], [xR + 20 + half * 1.5, top + 116]]));
  out.push(step(xR + 10, top + 224, colW - 20, "출고"));
  out.push(arrow([[xR + 10 + half / 2, top + 162], [xR + 10 + half / 2, top + 224]]), arrow([[xR + 20 + half * 1.5, top + 162], [xR + 20 + half * 1.5, top + 224]]));
  out.push(`<text class="small" x="${xL + 4}" y="${top + 296}">순서 그대로 · 단계만 빨라짐</text>`, `<text class="small" x="${xR + 4}" y="${top + 296}">순차 → 병렬 · 대기 시간 제거</text>`);
  const spec = { tag: "IT가 가능하게 한 완전히 새로운 프로세스", title: "iTunes 노래 다운로드 · Kindle 원클릭 구매", body: ["이전에는 없던 업무 흐름 = 재설계의 극단"] };
  const y = y0 + 350;
  const h = nodeHeight(spec, CW);
  out.push(node(spec, X0, y, CW, h));
  return { svg: out.join(""), y: y + h + 24 };
});

fig("mis-gl-2c-ai-roles", {
  eyebrow: "2장 · 2-1 비즈니스 프로세스와 IT ③",
  title: "Assist → Automate → Agent",
  subtitle: "AI가 프로세스에 들어가는 세 수준: 아래로 갈수록 AI의 자율성이 커지고 사람의 통제 방식이 바뀐다",
  desc: "Assist는 사람이 일하고 AI가 검색·요약·초안·추천으로 보조하며 사람이 판단을 주도하고, Automate는 시스템이 정해진 반복 단계를 수행하며 사람이 규칙과 예외를 관리하고, Agent는 AI가 도구를 호출해 정의된 워크플로를 수행하며 사람이 목표·권한·검토 기준을 정하는 세 단계 그림",
  legend: ["flow"],
  note: "Agent일수록 권한 범위, 모니터링, 사람에게 넘기는 예외(escalation)를 먼저 정해야 한다.",
}, y0 => rows([
  { nodes: [{ tag: "Assist · AI가 보조", title: "사람이 수행", body: ["AI: 검색·요약·초안·추천"] }, { tag: "사람의 위치", title: "판단을 주도", body: ["제안을 검토해 행동"] }], link: { text: "통제" }, edge: { type: "flow", text: "자율성 ↑" } },
  { nodes: [{ tag: "Automate · 자동화", title: "시스템이 반복 단계 수행", body: ["규칙·모델이 처리"] }, { tag: "사람의 위치", title: "규칙·예외 관리", body: ["예외만 처리"] }], link: { text: "통제" }, edge: { type: "flow", text: "자율성 ↑" } },
  { nodes: [{ tag: "Agent · 에이전트", title: "AI가 워크플로 수행", body: ["도구·시스템 호출"], style: "focal" }, { tag: "사람의 위치", title: "목표·권한·검토 설정", body: ["모니터링·에스컬레이션"] }], link: { text: "통제" } },
], y0));

fig("mis-gl-2d-management-systems", {
  eyebrow: "2장 · 2-2 관리 계층별 정보시스템",
  title: "TPS → MIS · DSS → ESS",
  subtitle: "아래 시스템의 데이터가 위 시스템의 품질을 결정한다. BI는 분석 시스템 전체를 묶는 큰 범주다",
  desc: "운영 수준의 TPS가 거래 데이터를 중간관리층의 MIS와 DSS에 제공하고, MIS와 DSS가 요약 정보를 최고경영진의 ESS에 제공하며, 세법·경쟁사 같은 외부 정보가 DSS와 ESS에 들어가고, BI 범주가 MIS·DSS·ESS를 포함하는 계층 그림",
  legend: ["flow", "dash", "focal", "outside", "zone"],
}, y0 => {
  const span = Math.round(CW * 0.66);
  const r = rows([
    { nodes: [{ tag: "최고경영진 · 전략적·비정형", title: "ESS", body: ["디지털 대시보드·KPI"], style: "focal" }], span, after: 64 },
    { nodes: [{ tag: "중간 · 정형", title: "MIS", body: ["정기 보고서"] }, { tag: "중간 · 비정형", title: "DSS", body: ["모델·what-if"] }], span, after: 70 },
    { nodes: [{ tag: "운영 수준 · 정형 거래", title: "TPS", body: ["주문·급여·배송 기록"] }], span },
  ], y0 + 34);
  const p = r.placed;
  const ess = p[0].boxes[0];
  const [mis, dss] = p[1].boxes;
  const tps = p[2].boxes[0];
  const extX = X0 + span + 30, extW = W - X0 - extX;
  const extSpec = { tag: "External", title: "외부 정보", body: ["세법·경쟁사", "주가"], style: "outside" };
  const extH = nodeHeight(extSpec, extW);
  const extY = (ess.y + dss.y + dss.h) / 2 - extH / 2;
  const out = [zone(X0 - 8, p[0].y - 34, span + 16, p[1].y + p[1].h - p[0].y + 44, "BI 범주 · 분석 도구 전체"), r.svg, node(extSpec, extX, extY, extW, extH)];
  const misX = mis.x + mis.w / 2, dssX = dss.x + dss.w / 2;
  out.push(arrow([[misX, tps.y], [misX, mis.y + mis.h]], { text: "데이터 제공" }));
  out.push(arrow([[dssX, tps.y], [dssX, dss.y + dss.h]]));
  out.push(arrow([[misX, mis.y], [misX, ess.y + ess.h]], { text: "요약 제공" }));
  out.push(arrow([[dssX, dss.y], [dssX, ess.y + ess.h]]));
  out.push(arrow([[extX, extY + extH * 0.25], [X0 + span, ess.y + ess.h / 2]], { dashed: true }));
  out.push(arrow([[extX, extY + extH * 0.75], [X0 + span, dss.y + dss.h / 2]], { dashed: true }));
  return { svg: out.join(""), y: r.y };
});

fig("mis-gl-2e-enterprise-apps", {
  eyebrow: "2장 · 2-3 전사 애플리케이션",
  title: "ERP를 중심으로 안팎을 잇는 네 시스템",
  subtitle: "TPS~ESS가 관리 계층(세로) 분류라면, 전사 애플리케이션은 부서와 회사 경계(가로)를 잇는 분류다",
  desc: "공급업체·물류와 SCM, 고객·유통과 CRM이 각각 연결되고, SCM과 CRM이 ERP의 단일 중앙 저장소와 데이터를 주고받으며, KMS가 이 과정의 노하우를 수집·적용하는 구조. SCM은 조직 경계를 넘는 조직 간 시스템이다",
  legend: ["flow", "both", "focal", "outside", "zone"],
}, y0 => {
  const r = rows([
    { nodes: [{ tag: "공급 측 · 조직 밖", title: "공급업체 · 물류", style: "outside" }, { tag: "고객 측 · 조직 밖", title: "고객 · 유통", style: "outside" }], edge: { type: "flow", both: true } },
    { nodes: [{ tag: "Supply chain management", title: "SCM", body: ["주문·생산·재고 공유", "조직 간 시스템"] }, { tag: "Customer relationship mgmt.", title: "CRM", body: ["영업·마케팅·서비스 통합", "고객 유지"] }], edge: { type: "drop", texts: ["데이터 공유", "데이터 공유"], both: true } },
    { nodes: [{ tag: "Enterprise system = ERP", title: "ERP · 단일 중앙 저장소", body: ["영업·생산·회계·인사 데이터를 통합"], style: "focal" }], edge: { type: "flow", text: "노하우 수집·적용", both: true } },
    { nodes: [{ tag: "Knowledge management", title: "KMS", body: ["조직 지식을 수집·공유·적용"] }] },
  ], y0 + 26);
  return { svg: zoneAround(r.placed, 1, 3, "전사 애플리케이션", 10, "zone", true) + r.svg, y: r.y };
});

fig("mis-gl-2f-connection-scope", {
  eyebrow: "2장 · 2-4 인터넷 기반 연결 범위",
  title: "누구에게 열리고 무엇을 포함하나",
  subtitle: "Intranet ⊂ Extranet의 접근 범위, E-commerce ⊂ E-business의 업무 범위를 포함 관계로 본다",
  desc: "왼쪽은 직원만 쓰는 인트라넷을 허가된 외부 파트너까지 여는 엑스트라넷이 감싸는 접근 범위, 오른쪽은 인터넷으로 사고파는 전자상거래를 주요 비즈니스 프로세스 전체의 전자 비즈니스가 감싸는 업무 범위, 아래는 공공부문의 전자정부를 보여 주는 포함 관계 그림",
  legend: ["zone", "outside"],
}, y0 => {
  const colW = (CW - 20) / 2;
  const out = [];
  const xs = [X0, X0 + colW + 20];
  const outer = [["Extranet", "+ 허가된 외부 파트너"], ["E-business", "주요 프로세스 전체를 디지털로"]];
  const inner = [["Intranet", "직원만 · 인터넷 표준 기반"], ["E-commerce", "인터넷으로 사고팔기"]];
  xs.forEach((x, i) => {
    out.push(zone(x, y0, colW, 230, ""));
    out.push(`<text class="name" x="${x + 12}" y="${y0 + 28}">${outer[i][0]}</text>`);
    wrap(outer[i][1], colW - 24, SIZE.body).forEach((line, j) => out.push(`<text class="body" x="${x + 12}" y="${y0 + 52 + j * 20.5}">${line}</text>`));
    out.push(node({ tag: "포함", title: inner[i][0], body: [inner[i][1]] }, x + 14, y0 + 100, colW - 28, 112));
  });
  const spec = { tag: "E-government · 공공부문", title: "전자정부", body: ["시민·직원·기업에 공공 정보·서비스 제공"], style: "outside" };
  const h = nodeHeight(spec, CW);
  out.push(node(spec, X0, y0 + 248, CW, h));
  return { svg: out.join(""), y: y0 + 248 + h + 24 };
});

fig("mis-gl-2g-collaboration", {
  eyebrow: "2장 · 2-5 협업과 소셜 비즈니스 ①",
  title: "협업 역량 + 협업 기술 → 협업의 질",
  subtitle: "Figure 2.7 · 도구만 깔면 협업이 생기지 않는다. 문화·구조라는 역량이 함께 있어야 한다",
  desc: "개방적 문화, 분권적 구조, 협업의 폭으로 이루어진 협업 역량과 실행·운영 및 전략 계획을 지원하는 협업 기술이 합쳐져 협업의 질을 정하고, 협업의 질이 생산성·품질·혁신·고객 서비스를 거쳐 기업 성과에 영향을 주는 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Collaboration capability", title: "협업 역량", body: ["개방적 문화", "분권적 구조", "협업의 폭"] }, { tag: "Collaboration technology", title: "협업 기술", body: ["실행·운영 지원", "전략 계획 지원"] }], edge: { type: "merge", text: "함께 결정" } },
  { nodes: [{ title: "협업의 질", body: ["내부 정치로 함께 일하지 못하면 낮아진다"] }], edge: { type: "flow", text: "영향" } },
  { nodes: [{ title: "생산성 · 품질 · 혁신 · 고객 서비스", body: ["지식 공유·빠른 문제 해결"] }], edge: { type: "flow", text: "누적" } },
  { nodes: [{ title: "기업 성과 (재무 성과)", style: "focal" }] },
], y0));

fig("mis-gl-2h-time-space", {
  eyebrow: "2장 · 2-5 협업과 소셜 비즈니스 ②",
  title: "시간 · 공간 협업 매트릭스",
  subtitle: "Figure 2.8 · “같은 시간인가?”와 “같은 장소인가?” 두 질문으로 협업 도구의 칸이 정해진다",
  desc: "가로축은 같은 시간(동기)과 다른 시간(비동기), 세로축은 같은 장소와 다른 장소로 나눈 2×2 표. 같은 시간·같은 장소는 대면 상호작용, 다른 시간·같은 장소는 연속 작업, 같은 시간·다른 장소는 원격 상호작용, 다른 시간·다른 장소는 커뮤니케이션과 조정이다",
}, y0 => {
  const head = 92;
  const cellW = (CW - head - 12) / 2;
  const cellH = 132;
  const out = [];
  const cx = [X0 + head + 6, X0 + head + 12 + cellW];
  const cols = ["같은 시간 · 동기", "다른 시간 · 비동기"];
  const rowsL = [["같은", "장소"], ["다른", "장소"]];
  cols.forEach((c, i) => out.push(`<text class="lab" x="${cx[i] + cellW / 2}" y="${y0 + 18}" text-anchor="middle">${c}</text>`));
  const cells = [
    [{ tag: "Face-to-face", title: "대면 상호작용", body: ["회의실·의사결정실"] }, { tag: "Continuous task", title: "연속 작업", body: ["교대 인수인계 노트", "팀 공용 공간"] }],
    [{ tag: "Remote interactions", title: "원격 상호작용", body: ["화상회의·메신저"] }, { tag: "Communication + coordination", title: "커뮤니케이션·조정", body: ["이메일·공유 캘린더", "워크플로·버전 관리"] }],
  ];
  cells.forEach((row, r) => {
    const y = y0 + 34 + r * (cellH + 10);
    out.push(zone(X0, y, head, cellH, ""));
    rowsL[r].forEach((line, j) => out.push(`<text class="lab" x="${X0 + head / 2}" y="${y + cellH / 2 - 4 + j * 20}" text-anchor="middle">${line}</text>`));
    row.forEach((spec, c) => out.push(node(spec, cx[c], y, cellW, cellH)));
  });
  return { svg: out.join(""), y: y0 + 34 + 2 * (cellH + 10) + 14 };
});

fig("mis-gl-2i-knowledge", {
  eyebrow: "2장 · 2-6 지식의 성격",
  title: "Data → Information → Knowledge → Wisdom",
  subtitle: "위 단계는 아래 단계를 없애지 않고 해석과 판단을 더한다. 지식은 문서화 여부로 두 형태로 나뉜다",
  desc: "데이터에 맥락을 붙이면 정보가 되고, 패턴·규칙·맥락을 발견하면 지식이 되며, 지식은 문서화된 형식지와 경험 속 암묵지로 나뉘고, 언제 어디서 어떻게 적용할지 아는 경험이 지혜가 되는 위계 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Data", title: "데이터", body: ["정리되지 않은 사실"] }], edge: { type: "flow", text: "맥락·정리" } },
  { nodes: [{ tag: "Information", title: "정보", body: ["이해하고 행동할 수 있게 정리된 데이터"] }], edge: { type: "flow", text: "패턴·규칙·맥락 발견" } },
  { nodes: [{ tag: "Knowledge", title: "지식 · 기업의 무형 자산", body: ["sticky · situated · contextual"], style: "focal" }], edge: { type: "bus", text: "두 형태" } },
  { nodes: [{ tag: "Explicit", title: "형식지", body: ["문서화됨: 매뉴얼·보고서", "옮기기 쉬움"] }, { tag: "Tacit", title: "암묵지", body: ["사람 안의 노하우·감각", "옮기기 어려움"] }], edge: { type: "merge", text: "경험으로 적용" } },
  { nodes: [{ tag: "Wisdom", title: "지혜", body: ["언제·어디서·어떻게 적용할지 아는 경험"] }] },
], y0));

fig("mis-gl-2j-km-value-chain", {
  eyebrow: "2장 · 2-7 지식관리 가치사슬",
  title: "Acquire → Store → Disseminate → Apply",
  subtitle: "Figure 11.1 · 각 단계에 IS 활동과 경영·조직 활동이 함께 있고, 적용 결과가 다시 획득으로 돌아온다",
  desc: "데이터와 정보 수집을 기반으로 획득, 저장, 전파, 적용의 네 단계가 차례로 이어지고 각 단계에 정보시스템 활동과 경영·조직 활동이 적혀 있으며, 적용 결과인 새 프로세스·제품·시장이 피드백 점선으로 획득 단계에 돌아가는 그림",
  legend: ["flow", "dash", "focal", "outside"],
}, y0 => {
  const span = Math.round(CW * 0.78);
  const r = rows([
    { nodes: [{ title: "데이터·정보 수집", body: ["TPS·외부 원천"] }], span, edge: { type: "flow", text: "기반" } },
    { nodes: [{ tag: "1 Acquire 획득", title: "문서화·전문가 네트워크", body: ["IS: 데이터 마이닝·ML · 조직: 지식 문화"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "2 Store 저장", title: "지식 DB·콘텐츠 관리", body: ["IS: CMS·전문가 시스템 · 조직: 색인 스키마·보상"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "3 Disseminate 전파", title: "필요한 사람에게 전달", body: ["IS: 포털·검색·협업 도구 · 조직: 교육·COP"] }], span, edge: { type: "flow" } },
    { nodes: [{ tag: "4 Apply 적용", title: "결정·프로세스에 반영", body: ["IS: DSS·전사 앱 · 조직: 새 루틴"], style: "focal" }], span, edge: { type: "flow", text: "결과" } },
    { nodes: [{ title: "새 프로세스 · 제품 · 서비스 · 시장" }], span },
  ], y0);
  const p = r.placed;
  const rx = X0 + span + 34;
  const fb = arrow([[X0 + span, p[5].y + p[5].h / 2], [rx, p[5].y + p[5].h / 2], [rx, p[1].y + p[1].h / 2], [X0 + span, p[1].y + p[1].h / 2]], { dashed: true });
  return { svg: r.svg + fb + label(rx, (p[1].y + p[5].y) / 2 + 20, "피드백"), y: r.y };
});

fig("mis-gl-2k-kms-types", {
  eyebrow: "2장 · 2-8 KMS 유형과 AI 지식 도구 ①",
  title: "KMS의 세 유형: 관리 · 창출 · 발견",
  subtitle: "Figure 11.2 · 사용 기술이 아니라 지원하는 지식 활동으로 구분한다",
  desc: "지식관리시스템이 전사적 KMS, 지식작업시스템, 지능형 기법의 세 유형을 포함하고, 각각 관리·창출·발견을 지원하며 그 아래에 대표 시스템 예시가 있는 계층 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Knowledge management systems", title: "KMS · 지식관리시스템", style: "focal" }], edge: { type: "bus", text: "포함" } },
  { nodes: [{ tag: "Enterprise-wide", title: "전사적 KMS", body: ["관리 · Manage"] }, { tag: "KWS", title: "지식작업 시스템", body: ["창출 · Create"] }, { tag: "Intelligent", title: "지능형 기법", body: ["발견 · Discover"] }], edge: { type: "flow", texts: ["예", "예", "예"] } },
  { nodes: [{ body: ["ECM·CMS", "협업·소셜 도구", "LMS", "전문가 디렉터리"] }, { body: ["CAD", "VR·AR", "투자 워크스테이션"] }, { body: ["전문가 시스템", "데이터 마이닝", "신경망·GA", "ML·NLP·RAG"] }] },
], y0));

fig("mis-gl-2l-ai-ready-rag", {
  eyebrow: "2장 · 2-8 KMS 유형과 AI 지식 도구 ②",
  title: "AI-ready content와 RAG",
  subtitle: "RAG는 승인된 기업 콘텐츠를 먼저 검색하고 그 근거로 답한다. 콘텐츠가 준비되지 않으면 답도 틀린다",
  desc: "사용자 질문과 품질·메타데이터·접근 권한·출처·평가를 갖춘 승인 저장소가 검색 단계로 합쳐지고, 검색된 근거로 답변을 생성한 뒤 사람이 검토해 업무에 적용하는 RAG 흐름 그림",
  legend: ["flow", "focal", "zone"],
}, y0 => rows([
  { nodes: [{ tag: "Question", title: "사용자 질문" }, { tag: "AI-ready content", title: "승인된 저장소", body: ["품질 · 메타데이터", "접근 권한 · 출처", "평가"] }], edge: { type: "merge", text: "함께 입력" } },
  { nodes: [{ tag: "Retrieve", title: "관련 근거 검색", body: ["권한이 있는 원본만 찾는다"] }], edge: { type: "flow", text: "근거 제공" } },
  { nodes: [{ tag: "Generate", title: "근거 기반 답변 생성", body: ["출처 인용 · grounding"], style: "focal" }], edge: { type: "flow", text: "검증 필요한 주장" } },
  { nodes: [{ tag: "Apply", title: "사람이 검토 후 적용", body: ["권한 · 모니터링 · 에스컬레이션"] }] },
], y0));

fig("mis-gl-2m-is-function", {
  eyebrow: "2장 · 2-9 IS 기능과 IT 거버넌스",
  title: "누가 IT를 결정하고 누가 책임지는가",
  subtitle: "IT 거버넌스가 결정 권한과 책임을 배분하고, IS 부서와 C-level 역할이 그 틀 안에서 일한다",
  desc: "IT 거버넌스가 결정 권한과 책임을 중앙 IT와 사업부에 배분하고, 두 쪽이 데이터와 AI 책임을 공유하며, CIO가 이끄는 IS 부서와 시스템 분석가, 그리고 CIO·CISO·CPO·CKO·CDO·CAIO의 담당 영역을 보여 주는 그림",
  legend: ["flow", "both", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "IT governance", title: "결정 권한 + 책임", body: ["IT가 사업 전략을 지원하게 하는 틀"], style: "focal" }], edge: { type: "bus", text: "배분" } },
  { nodes: [{ tag: "Central · 중앙 IT", title: "표준·통제", body: ["아키텍처·보안", "공유 플랫폼·데이터 표준"] }, { tag: "Distributed · 사업부", title: "현장 실행", body: ["성과 정의·우선순위", "프로세스 개선·도입"] }], link: { text: "공유", both: true }, edge: { type: "merge", text: "운영" } },
  { nodes: [{ tag: "IS department · CIO가 지휘", title: "IS 부서", body: ["시스템 분석가 = 업무 ↔ 기술 번역자"] }], edge: { type: "bus", text: "임원 역할" } },
  { nodes: [{ title: "CIO", body: ["IT 전체"] }, { title: "CISO", body: ["보안"] }, { title: "CPO", body: ["프라이버시"] }], after: 12 },
  { nodes: [{ title: "CKO", body: ["지식"] }, { title: "CDO", body: ["데이터"] }, { title: "CAIO", body: ["AI"] }] },
], y0));

// =============================================================================================
// C · Chapter 3 detail figures
fig("mis-gl-3a-organization-it", {
  eyebrow: "3장 · 3-1 조직의 정의와 IT와의 관계 ①",
  title: "조직과 IT의 양방향 관계",
  subtitle: "Figure 3.1 · 조직이 IT를 형성하고 IT가 조직을 바꾼다. 그 사이를 여섯 매개 요인이 조정한다",
  desc: "위의 조직과 아래의 정보기술이 왼쪽 형성 화살표와 오른쪽 변화 화살표로 양방향 연결되고, 가운데에 환경·문화·구조·비즈니스 프로세스·정치·경영 의사결정의 매개 요인이 놓인 그림",
  legend: ["flow", "focal", "zone"],
}, y0 => {
  const top = { tag: "Organizations", title: "조직", body: ["전략 · 구조 · 프로세스"] };
  const mid = { tag: "Mediating factors · 매개 요인", title: "환경 · 문화 · 구조", body: ["비즈니스 프로세스 · 정치", "경영 의사결정"] };
  const bot = { tag: "Information technology", title: "정보기술", body: ["데이터 · 소프트웨어 · 네트워크"], style: "focal" };
  const mw = Math.round(CW * 0.56);
  const ht = nodeHeight(top, CW), hm = nodeHeight(mid, mw), hb = nodeHeight(bot, CW);
  const yM = y0 + ht + 40, yB = yM + hm + 40;
  const lx = X0 + 44, rx = W - X0 - 44;
  const out = [node(top, X0, y0, CW, ht), zone(X0 + (CW - mw) / 2 - 6, yM - 6, mw + 12, hm + 12, ""), node(mid, X0 + (CW - mw) / 2, yM, mw, hm), node(bot, X0, yB, CW, hb)];
  out.push(arrow([[lx, y0 + ht], [lx, yB]], { text: "형성" }));
  out.push(arrow([[rx, yB], [rx, y0 + ht]], { text: "변화" }));
  return { svg: out.join(""), y: yB + hb + 24 };
});

fig("mis-gl-3b-organization-definitions", {
  eyebrow: "3장 · 3-1 조직의 정의와 IT와의 관계 ②",
  title: "기술적 정의 vs 행동적 정의",
  subtitle: "Figure 3.2 · 3.3 · 둘은 경쟁하는 정의가 아니라 서로 보완한다",
  desc: "왼쪽 기술적 미시경제 정의는 환경의 자본·노동이 생산 과정을 거쳐 제품·서비스가 되는 흐름이고, 오른쪽 행동적 정의는 권리·특권·의무·책임이 갈등과 해결을 거쳐 균형 잡힌 사회 시스템이 되는 흐름이며, 아래에서 두 정의가 보완 관계로 합쳐지는 비교 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Technical", title: "기술적 정의", style: "focal" }, { tag: "Behavioral", title: "행동적 정의", style: "focal" }], after: 18 },
  { nodes: [{ title: "자본 · 노동", body: ["환경에서 들어오는 입력"] }, { title: "권리 · 특권 · 의무 · 책임" }], edge: { type: "flow", texts: ["생산 과정", "갈등과 해결"] } },
  { nodes: [{ title: "제품 · 서비스", body: ["환경으로 나가는 산출"] }, { title: "섬세하게 균형 잡힌 사회 시스템" }], edge: { type: "flow", texts: ["관점", "관점"] } },
  { nodes: [{ title: "생산 기계", body: ["쉽게 재배열 가능", "사람 요소는 거의 고려 X"] }, { title: "사람과 관계", body: ["위계·규칙·문화 때문에", "바꾸기 어렵고 느림"] }], edge: { type: "merge", text: "보완" } },
  { nodes: [{ title: "IS 도입 = 기술 설치 + 조직 변화를 함께 다룬다" }] },
], y0));

fig("mis-gl-3c-organization-features", {
  eyebrow: "3장 · 3-2 조직의 특징과 구조",
  title: "루틴 ⊂ 프로세스 ⊂ 기업, 그리고 네 가지 특징",
  subtitle: "Figure 3.4 · 3.5 · 안쪽 루틴이 바뀌어야 바깥 프로세스가 바뀐다. 정치·문화·환경·구조가 같은 IT의 효과를 조직마다 다르게 만든다",
  desc: "기업 범위 안에 비즈니스 프로세스 범위가 있고 그 안에 개별 루틴(SOP)들이 있는 포함 관계, 그리고 정치·문화·환경·구조 네 특징이 기업에 영향을 주는 그림. 환경은 정보시스템이라는 렌즈를 통해 기업에 들어온다",
  legend: ["dash", "outside", "zone"],
}, y0 => {
  const out = [];
  const firmH = 196;
  out.push(zone(X0 - 8, y0, CW + 16, firmH, "Business firm · 기업 = 프로세스의 묶음"));
  out.push(zone(X0 + 8, y0 + 34, CW - 16, firmH - 46, "Business process = 루틴의 묶음", { style: "deep" }));
  const rw = (CW - 16 - 24 - 20) / 3;
  ["루틴 A", "루틴 B", "루틴 C"].forEach((t, i) => out.push(node({ tag: "SOP", title: t, body: ["정해진 절차"] }, X0 + 20 + i * (rw + 10), y0 + 72, rw, 98)));
  const r = rows([
    { nodes: [{ tag: "Politics", title: "정치", body: ["정보 = 권력", "정치적 저항"] }, { tag: "Culture", title: "문화", body: ["공유된 기본 가정", "통합력이자 제약"] }], after: 12 },
    { nodes: [{ tag: "Environment", title: "환경", body: ["IS = 환경을 보는 렌즈", "환경 탐색"], style: "outside" }, { tag: "Structure", title: "구조", body: ["Mintzberg 다섯 유형", "목표·리더십·업무"] }] },
  ], y0 + firmH + 58);
  out.push(r.svg);
  out.push(arrow([[W / 2, y0 + firmH + 58], [W / 2, y0 + firmH]], { text: "영향", dashed: true }));
  return { svg: out.join(""), y: r.y };
});

fig("mis-gl-3d-cost-theories", {
  eyebrow: "3장 · 3-3 IT가 조직에 미치는 영향 ①",
  title: "거래 비용(바깥) vs 대리인 비용(안쪽)",
  subtitle: "IT가 정보 비용을 낮추면 두 비용이 모두 줄지만, 기업 규모에 미치는 방향은 다를 수 있다",
  desc: "IT와 인터넷이 정보 비용을 낮추고, 그 결과 시장에서 거래할 때의 거래 비용과 직원을 감독할 때의 대리인 비용이 함께 낮아지며, 거래 비용 감소는 외주 증가와 기업 규모 축소로, 대리인 비용 감소는 관리자를 크게 늘리지 않는 확장과 조직 납작화로 이어지는 비교 그림",
  legend: ["flow", "focal", "outside"],
}, y0 => rows([
  { nodes: [{ tag: "IT · Internet", title: "정보 비용 ↓", body: ["IT도 자본·노동 같은 생산 요소"], style: "focal" }], edge: { type: "bus", text: "낮춤" } },
  { nodes: [{ tag: "Transaction cost · 바깥(시장)", title: "거래 비용 ↓", body: ["공급자 탐색·계약", "품질 확인·감시"] }, { tag: "Agency cost · 안쪽(직원)", title: "대리인 비용 ↓", body: ["대리인(직원)", "감독·관리"] }], edge: { type: "flow", texts: ["결과", "결과"] } },
  { nodes: [{ title: "외주 ↑", body: ["기업 규모 축소 가능", "(수직 통합 필요 ↓)"] }, { title: "적은 관리자로 확장", body: ["계층 ↓ · 통제 범위 ↑", "(Flattening)"] }] },
], y0));

fig("mis-gl-3e-resistance", {
  eyebrow: "3장 · 3-3 IT가 조직에 미치는 영향 ②",
  title: "변화 저항의 네 요소",
  subtitle: "Figure 3.7 · 기술만 바꾸면 나머지 셋이 원래 방식으로 끌어당긴다. 넷을 동시에 조정해야 한다",
  desc: "가운데 정보시스템 혁신에 대한 조직 저항을 두고 위에 정보기술, 아래에 사람, 왼쪽에 조직 구조, 오른쪽에 직무가 놓여 서로 묶여 있는 그림. 네 요소를 동시에 조정해야 저항이 줄어든다",
  legend: ["both", "focal"],
}, y0 => {
  const side = 138, centerW = 150;
  const cx = W / 2;
  const spec = t => ({ title: t[0], body: [t[1]] });
  const topS = spec(["정보기술", "새 시스템·화면"]), botS = spec(["사람", "역량·교육·태도"]), leftS = spec(["조직 구조", "권한·보고 체계"]), rightS = spec(["직무", "업무 순서·역할"]);
  const center = { title: "변화 저항", body: ["Resistance to IS innovation"], style: "focal" };
  const hT = nodeHeight(topS, 220), hC = Math.max(nodeHeight(center, centerW), nodeHeight(leftS, side));
  const yT = y0, yC = yT + hT + 50, yB = yC + hC + 50;
  const out = [
    node(topS, cx - 110, yT, 220, hT), node(botS, cx - 110, yB, 220, nodeHeight(botS, 220)),
    node(leftS, X0, yC, side, hC), node(rightS, W - X0 - side, yC, side, hC), node(center, cx - centerW / 2, yC, centerW, hC),
  ];
  out.push(arrow([[cx, yT + hT], [cx, yC]], { both: true, text: "동시 조정" }));
  out.push(arrow([[cx, yC + hC], [cx, yB]], { both: true }));
  out.push(arrow([[X0 + side, yC + hC / 2], [cx - centerW / 2, yC + hC / 2]], { both: true }));
  out.push(arrow([[cx + centerW / 2, yC + hC / 2], [W - X0 - side, yC + hC / 2]], { both: true }));
  return { svg: out.join(""), y: yB + nodeHeight(botS, 220) + 24 };
});

fig("mis-gl-3f-five-forces", {
  eyebrow: "3장 · 3-4 경쟁 요인과 경쟁 전략 ①",
  title: "Porter의 다섯 가지 경쟁 요인",
  subtitle: "Figure 3.8 · 기존 경쟁자 외에 네 방향의 힘이 기업의 전략적 위치와 수익성을 압박한다",
  desc: "가운데 기업과 기존 경쟁자를 두고 위의 신규 진입자, 아래의 대체 제품·서비스, 왼쪽의 공급자, 오른쪽의 고객이 각각 압력 화살표로 기업을 향하는 그림. 기존 경쟁자는 같은 산업 안의 힘이라 가운데에 함께 놓인다",
  legend: ["flow", "focal", "outside"],
}, y0 => {
  const cx = W / 2;
  const sideW = 140, centerW = 190;
  const top = { tag: "New market entrants", title: "신규 진입자", body: ["진입 장벽은 높은가?"], style: "outside" };
  const bot = { tag: "Substitutes", title: "대체 제품·서비스", body: ["가격이 오르면 옮겨 가나?"], style: "outside" };
  const left = { tag: "Suppliers", title: "공급자", body: ["원가 인상 전가?"], style: "outside" };
  const right = { tag: "Customers", title: "고객", body: ["쉽게 바꾸나?"], style: "outside" };
  const center = { tag: "기업 + Traditional competitors", title: "기존 경쟁자와 경쟁", body: ["가격·제품·효율·전환 비용"], style: "focal" };
  const hT = nodeHeight(top, 260), hB = nodeHeight(bot, 260);
  const hC = Math.max(nodeHeight(center, centerW), nodeHeight(left, sideW), nodeHeight(right, sideW));
  const yC = y0 + hT + 52, yB = yC + hC + 52;
  const out = [node(top, cx - 130, y0, 260, hT), node(bot, cx - 130, yB, 260, hB), node(left, X0, yC, sideW, hC), node(right, W - X0 - sideW, yC, sideW, hC), node(center, cx - centerW / 2, yC, centerW, hC)];
  out.push(arrow([[cx, y0 + hT], [cx, yC]], { text: "압력" }), arrow([[cx, yB], [cx, yC + hC]], { text: "압력" }));
  out.push(arrow([[X0 + sideW, yC + hC / 2], [cx - centerW / 2, yC + hC / 2]]), arrow([[W - X0 - sideW, yC + hC / 2], [cx + centerW / 2, yC + hC / 2]]));
  return { svg: out.join(""), y: yB + hB + 24 };
});

fig("mis-gl-3g-generic-strategies", {
  eyebrow: "3장 · 3-4 경쟁 요인과 경쟁 전략 ②",
  title: "압력에 맞는 네 가지 기본 전략",
  subtitle: "다섯 힘은 분석, 네 전략은 대응이다. 왼쪽 압력을 읽고 오른쪽 전략과 사례를 고른다",
  desc: "가격 경쟁이 심하면 저원가 리더십(Walmart), 대체재가 많으면 제품 차별화(Apple·Nike·Google), 큰 시장에서 열세면 틈새시장 집중(Hilton OnQ), 고객·공급자가 쉽게 떠나면 고객·공급자 친밀성(Amazon·Toyota)으로 대응하는 네 쌍의 화살표 그림",
  legend: ["flow", "focal"],
  note: "압력과 전략의 짝은 강의 판서(3장 Slide 32)의 정리다. 실제 기업은 여러 전략을 함께 쓸 수 있다.",
}, y0 => rows([
  { nodes: [{ tag: "압력", title: "가격 경쟁이 심하다" }, { tag: "Low-cost leadership", title: "저원가 리더십", body: ["Walmart 연속 보충"], style: "focal" }], widths: [0.44, 0.56], link: { text: "대응" }, after: 14 },
  { nodes: [{ tag: "압력", title: "대체재가 많다" }, { tag: "Product differentiation", title: "제품 차별화", body: ["Apple·Nike·Google, 대량 맞춤화"], style: "focal" }], widths: [0.44, 0.56], link: { text: "대응" }, after: 14 },
  { nodes: [{ tag: "압력", title: "큰 시장에서 열세" }, { tag: "Focus on market niche", title: "틈새시장 집중", body: ["Hilton OnQ (CRM 분석)"], style: "focal" }], widths: [0.44, 0.56], link: { text: "대응" }, after: 14 },
  { nodes: [{ tag: "압력", title: "고객·공급자가 쉽게 떠난다" }, { tag: "Customer & supplier intimacy", title: "고객·공급자 친밀성", body: ["Amazon 추천, Toyota · 전환 비용 ↑"], style: "focal" }], widths: [0.44, 0.56], link: { text: "대응" } },
], y0));

fig("mis-gl-3h-value-chain", {
  eyebrow: "3장 · 3-5 가치사슬과 네트워크 전략 ①",
  title: "가치사슬: 지원 활동과 본원적 활동",
  subtitle: "Figure 3.9 · Porter 모형이 “어떤 압력인가”라면 가치사슬은 “기업 안 어디를 고칠까”를 묻는다",
  desc: "관리, 인적자원, 기술, 조달의 지원 활동 네 개가 본원적 활동을 지원하고, 입고 물류, 운영, 판매·마케팅, 서비스, 출고 물류의 본원적 활동 다섯 개가 고객 가치와 이윤을 만드는 그림. 각 칸에 교재의 정보시스템 예가 있다",
  legend: ["flow", "focal", "zone"],
}, y0 => {
  const r = rows([
    { nodes: [{ tag: "Administration", title: "관리", body: ["전자 일정·메시징"] }, { tag: "Human resources", title: "인적자원", body: ["인력 계획"] }], after: 10 },
    { nodes: [{ tag: "Technology", title: "기술", body: ["CAD"] }, { tag: "Procurement", title: "조달", body: ["전산 발주"] }], after: 86 },
    { nodes: [{ tag: "Inbound logistics", title: "입고 물류", body: ["자동 창고"] }, { tag: "Operations", title: "운영", body: ["컴퓨터 제어 가공"] }], after: 10 },
    { nodes: [{ tag: "Sales and marketing", title: "판매·마케팅", body: ["전산 주문"] }, { tag: "Service", title: "서비스", body: ["장비 유지보수"] }], after: 10 },
    { nodes: [{ tag: "Outbound logistics", title: "출고 물류", body: ["자동 출하 일정"] }], after: 70 },
    { nodes: [{ tag: "Margin", title: "고객 가치 · 이윤", style: "focal" }] },
  ], y0 + 26);
  const p = r.placed;
  const z1 = zoneAround(p, 0, 1, "Support activities · 지원 활동");
  const z2 = zoneAround(p, 2, 4, "Primary activities · 본원적 활동");
  // One arrow per zone boundary: support activities as a whole enable the primary activities.
  const a1 = arrow([[W / 2, p[1].y + p[1].h + 10], [W / 2, p[2].y - 34]], { text: "지원" });
  const a2 = arrow([[W / 2, p[4].y + p[4].h + 10], [W / 2, p[5].y]], { text: "가치 추가" });
  return { svg: z1 + z2 + r.svg + a1 + a2, y: r.y };
});

fig("mis-gl-3i-network-strategies", {
  eyebrow: "3장 · 3-5 가치사슬과 네트워크 전략 ②",
  title: "가치사슬 → 가치 웹 → 비즈니스 생태계",
  subtitle: "분석 단위가 한 기업에서 같은 산업의 기업 네트워크, 다시 여러 산업의 플랫폼 네트워크로 넓어진다",
  desc: "한 기업의 가치사슬이 IT로 동기화되어 같은 산업 안 독립 기업들의 가치 웹이 되고, 플랫폼을 중심으로 여러 산업까지 넓어지면 키스톤 기업과 니치 기업이 있는 비즈니스 생태계가 되는 포함 관계 그림. 네트워크 경제와 가상 기업도 함께 표시한다",
  legend: ["flow", "focal", "zone"],
}, y0 => rows([
  { nodes: [{ tag: "Value chain", title: "한 기업의 가치사슬", body: ["시너지 · 핵심 역량으로 강화"] }], edge: { type: "flow", text: "IT로 연결·동기화" } },
  { nodes: [{ tag: "Value web", title: "같은 산업의 독립 기업 네트워크", body: ["덜 선형적 · 고객 주도 · 유연", "가상 기업(Li & Fung)"] }], edge: { type: "flow", text: "플랫폼으로 확장" } },
  { nodes: [{ tag: "Business ecosystem", title: "여러 산업의 느슨한 네트워크", body: ["경쟁 단위: 생태계 대 생태계"], style: "focal" }], edge: { type: "bus", text: "역할" } },
  { nodes: [{ tag: "Keystone firm", title: "플랫폼 제공·지배", body: ["Microsoft, Facebook"] }, { tag: "Niche firm", title: "플랫폼 위 특정 가치", body: ["앱 개발사"] }], edge: { type: "none" } },
  { nodes: [{ tag: "Network economics", title: "참여자 추가 한계비용 ≈ 0", body: ["참여자가 늘수록 네트워크 가치 ↑"] }] },
], y0));

// =============================================================================================
// C · Chapter 4 detail figures
fig("mis-gl-4a-ethical-ripple", {
  eyebrow: "4장 · 4-1 윤리 쟁점의 구조",
  title: "기술 충격은 개인 → 사회 → 정치로 번진다",
  subtitle: "Figure 4.1 · 연못에 던진 돌(새 IT)이 만든 물결을 다섯 도덕적 차원으로 점검한다",
  desc: "가운데 새 정보기술을 개인의 윤리 문제, 사회의 사회 문제, 정치의 정치 문제가 차례로 감싸는 동심 범위로 그리고, 아래에 정보 권리·재산권·책임과 통제·시스템 품질·삶의 질의 다섯 도덕적 차원을 나열한 그림. 기술은 빠르고 법은 느리다",
  legend: ["flow", "focal", "zone"],
}, y0 => {
  const out = [];
  const rock = { tag: "Rock in the pond", title: "새로운 정보기술", body: ["기존 규칙으로 설명 안 되는 상황"], style: "focal" };
  const rh = nodeHeight(rock, CW - 120);
  const inner = rh + 48, mid = inner + 50, outer = mid + 50;
  out.push(zone(X0 - 8, y0, CW + 16, outer, "Polity · 정치 문제: 법·책임 배분"));
  out.push(zone(X0 + 14, y0 + 34, CW - 28, mid, "Society · 사회 문제: 규범·기대", { style: "deep" }));
  out.push(zone(X0 + 36, y0 + 68, CW - 72, inner, "Individual · 윤리 문제: 개인의 선택"));
  out.push(node(rock, X0 + 60, y0 + 100, CW - 120, rh));
  const top = y0 + outer + 58 + 26;
  const r = rows([
    { nodes: [{ body: ["① 정보 권리·의무"] }, { body: ["② 재산권·의무"] }], after: 10 },
    { nodes: [{ body: ["③ 책임과 통제"] }, { body: ["④ 시스템 품질"] }, { body: ["⑤ 삶의 질"] }] },
  ], top);
  out.push(zoneAround(r.placed, 0, 1, "Five moral dimensions · 다섯 도덕적 차원"));
  out.push(arrow([[W / 2, y0 + outer], [W / 2, top - 34]], { text: "분석 틀" }));
  out.push(r.svg);
  return { svg: out.join(""), y: r.y };
});

fig("mis-gl-4b-profiling-nora", {
  eyebrow: "4장 · 4-2 데이터 분석 기법과 감시",
  title: "Profiling vs NORA",
  subtitle: "둘 다 여러 출처를 결합한다. 프로파일링은 한 사람을 깊게, NORA는 사람들 사이의 숨은 관계를 본다",
  desc: "여러 데이터 출처가 결합되는 공통 단계 뒤에, 왼쪽 프로파일링은 한 개인의 상세 파일(dossier)을 만들어 광고·보험·신용 판단에 쓰고, 오른쪽 NORA는 이름 표준화·대조·병합으로 숨은 관계를 찾아 경고를 내는 비교 그림",
  legend: ["flow", "focal", "outside"],
}, y0 => rows([
  { nodes: [{ title: "여러 출처의 데이터", body: ["구매·위치·온라인 행동·전화·인사·범죄 기록"] }], edge: { type: "rise", texts: ["결합", "결합"] } },
  { nodes: [{ tag: "Profiling", title: "한 사람을 깊게", body: ["상세 파일(dossier)"] }, { tag: "NORA", title: "관계를 넓게", body: ["표준화 → 대조 → 병합"] }], edge: { type: "flow", texts: ["사용", "사용"] } },
  { nodes: [{ title: "맞춤 광고·위험 평가", body: ["데이터 브로커가 판매"] }, { title: "NORA 경고", body: ["카지노·항공 보안"], style: "focal" }], edge: { type: "flow", text: "프라이버시 쟁점", dashed: true } },
  { nodes: [{ title: "무고한 사람의 기록도 함께 분석된다" }] },
], y0));

fig("mis-gl-4c-responsibility-chain", {
  eyebrow: "4장 · 4-3 책임 개념과 판단 원칙 ①",
  title: "책임 → 추적 → 배상 → 적법 절차",
  subtitle: "앞 고리가 없으면 뒤 고리가 작동하지 않는다. 누가 했는지 추적할 수 없으면 배상도 물을 수 없다",
  desc: "Responsibility(개인이 결정의 비용·의무를 받아들임), Accountability(누가 무엇을 했는지 추적 가능한 제도), Liability(피해자가 법적으로 배상받을 수 있는 정치 체제의 특징), Due process(법이 알려지고 이의 제기가 가능한 법치 사회의 특징)가 차례로 이어지는 사슬과 윤리적 분석 다섯 단계",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Responsibility · 개인", title: "결정의 비용·의무를 받아들임" }], edge: { type: "flow", text: "전제" } },
  { nodes: [{ tag: "Accountability · 제도", title: "누가 무엇을 했는지 추적 가능", style: "focal" }], edge: { type: "flow", text: "전제" } },
  { nodes: [{ tag: "Liability · 정치 체제", title: "피해를 법적으로 배상받음" }], edge: { type: "flow", text: "전제" } },
  { nodes: [{ tag: "Due process · 법치 사회", title: "법이 알려지고 이의 제기 가능" }], after: 34 },
  { nodes: [{ tag: "Ethical analysis · 다섯 단계", title: "사실 → 가치 → 이해관계자 → 선택지 → 결과" }] },
], y0));

fig("mis-gl-4d-ethical-principles", {
  eyebrow: "4장 · 4-3 책임 개념과 판단 원칙 ②",
  title: "여섯 윤리 원칙이 묻는 질문",
  subtitle: "원칙 이름보다 그 원칙이 던지는 질문으로 구분한다. 원칙마다 결론이 다를 수 있다",
  desc: "황금률은 입장을 바꾸면 괜찮은가, 칸트의 정언명령은 모두가 해도 되는가, 미끄러운 비탈 규칙은 계속 반복해도 되는가, 공리주의 원칙은 가장 큰 가치는 무엇인가, 위험 회피 원칙은 가장 적은 피해는 무엇인가, 공짜 점심은 없다 규칙은 허락 없이 써도 되는가를 묻는다는 대응 그림",
  legend: ["flow"],
}, y0 => rows(
  [
    ["Golden Rule", "황금률", "입장을 바꿔도 괜찮은가?"],
    ["Kant's categorical imperative", "칸트의 정언명령", "모두가 해도 되는가?"],
    ["Slippery slope (rule of change)", "미끄러운 비탈", "계속 반복해도 되는가?"],
    ["Utilitarian principle", "공리주의", "가장 큰 가치는?"],
    ["Risk aversion principle", "위험 회피", "가장 적은 피해는?"],
    ["No free lunch rule", "공짜 점심은 없다", "허락 없이 써도 되나?"],
  ].map(([en, ko, q], i, all) => ({ nodes: [{ tag: en, title: ko }, { title: q }], widths: [0.5, 0.5], link: { text: "질문" }, after: i === all.length - 1 ? 18 : 10 })),
  y0,
));

fig("mis-gl-4e-privacy-fip", {
  eyebrow: "4장 · 4-4 프라이버시와 정보 권리 ①",
  title: "Privacy → FIP → 다섯 원칙 → 법",
  subtitle: "FIP는 프라이버시라는 권리를 실제 데이터 처리 규칙으로 바꾸는 중간 틀이다",
  desc: "혼자 있을 권리와 자기 정보를 통제할 권리인 프라이버시가 기록 보유자와 개인의 상호 이익에 기반한 공정 정보 관행으로 구체화되고, FIP가 고지·선택·접근·보안·집행의 다섯 원칙을 포함하며 그중 고지와 선택이 핵심이고, 미국의 COPPA·Gramm-Leach-Bliley·HIPAA와 EU의 GDPR로 이어지는 계층 그림",
  legend: ["flow", "focal"],
}, y0 => {
  const r = rows([
    { nodes: [{ tag: "Privacy", title: "프라이버시", body: ["혼자 있을 권리 + 내 정보를 통제할 권리"] }], edge: { type: "flow", text: "구체화" } },
    { nodes: [{ tag: "Fair Information Practices", title: "FIP · 공정 정보 관행", body: ["기록 보유자와 개인의 상호 이익"], style: "focal" }], after: 84 },
    { nodes: [{ tag: "핵심", title: "고지", body: ["Notice"], style: "focal" }, { tag: "핵심", title: "선택", body: ["Choice"], style: "focal" }, { title: "접근", body: ["Access"] }], after: 10 },
    { nodes: [{ title: "보안", body: ["Security"] }, { title: "집행", body: ["Enforcement"] }], after: 96 },
    { nodes: [{ tag: "미국 · 영역별 법", title: "COPPA · GLBA · HIPAA" }, { tag: "EU · 포괄적 법", title: "GDPR", body: ["명시적 동의·잊힐 권리"] }] },
  ], y0);
  const p = r.placed;
  const zoneTop = p[2].y - 34, zoneBottom = p[3].y + p[3].h + 10;
  const busY = zoneBottom + 52;
  const laws = p[4].boxes.map(b => b.x + b.w / 2);
  const out = [
    zone(X0 - 8, zoneTop, CW + 16, zoneBottom - zoneTop, "FIP 다섯 원칙", { center: true }),
    r.svg,
    arrow([[W / 2, p[1].y + p[1].h], [W / 2, zoneTop]], { text: "포함" }),
    `<path class="line" d="M${W / 2} ${zoneBottom} V${busY} M${laws[0]} ${busY} H${laws[1]}"/>`,
    ...laws.map(x => arrow([[x, busY], [x, p[4].y]])),
    label(W / 2, zoneBottom + 24, "법의 기반"),
  ];
  return { svg: out.join(""), y: r.y };
});

fig("mis-gl-4f-consent-tracking", {
  eyebrow: "4장 · 4-4 프라이버시와 정보 권리 ②",
  title: "Opt-in vs Opt-out, 그리고 보이지 않는 추적",
  subtitle: "차이는 “아무것도 하지 않았을 때 데이터 사용이 허용되는가”다. 쿠키 자체는 식별자이지만 기록과 결합되면 프로필이 된다",
  desc: "위에서 옵트인은 기본값이 사용 금지라 사용자가 동의해야 쓸 수 있고 옵트아웃은 기본값이 사용 허용이라 사용자가 거부해야 멈추는 비교, 아래에서 쿠키·슈퍼 쿠키·웹 비컨·스파이웨어가 행동 기록을 모아 행동 타기팅 프로필이 되는 흐름 그림",
  legend: ["flow", "focal", "outside"],
}, y0 => rows([
  { nodes: [{ tag: "Opt-in · 더 강한 보호", title: "기본값 = 사용 금지", body: ["명시적으로 동의해야 사용"], style: "focal" }, { tag: "Opt-out", title: "기본값 = 사용 허용", body: ["거부해야 사용 중단"] }], after: 34 },
  { nodes: [{ tag: "Cookies", title: "브라우저 식별자" }, { tag: "Super cookies", title: "지우기 어려움" }], after: 10 },
  { nodes: [{ tag: "Web beacons", title: "열람 여부 추적" }, { tag: "Spyware", title: "몰래 설치·수집" }], edge: { type: "merge", text: "행동 기록 결합" } },
  { nodes: [{ tag: "Behavioral targeting", title: "프로필 → 맞춤 광고", body: ["Do Not Track 신호는 강제력이 약함"] }] },
], y0));

fig("mis-gl-4g-intellectual-property", {
  eyebrow: "4장 · 4-5 지식재산",
  title: "지식재산의 네 가지 보호",
  subtitle: "강도가 다른 단계가 아니라 보호 대상이 다른 병렬 분류다. 무엇을 지키려는지부터 확인한다",
  desc: "지식재산이 저작권, 특허, 상표, 영업비밀의 네 보호 방식을 포함하고 각각 표현(저자 생존 기간+70년, 기업 저작물 95년), 발명 아이디어(20년), 브랜드 표지(소비자 혼동 방지), 공개되지 않은 영업 정보(공개되면 보호 상실)를 보호하며, 디지털 매체에서는 복제·전송·변경이 쉬워 DMCA가 보호 기술 우회를 금지한다는 계층 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Intellectual property", title: "지식재산", body: ["개인·기업이 만든 유형·무형의 지적 창작물"], style: "focal" }], edge: { type: "bus", text: "포함" } },
  { nodes: [{ tag: "Copyright", title: "저작권", body: ["표현을 보호", "생존 + 70년 (기업 95년)"] }, { tag: "Patent", title: "특허", body: ["발명 아이디어 독점", "20년 · 심사"] }], after: 10 },
  { nodes: [{ tag: "Trademark", title: "상표", body: ["브랜드 표지", "소비자 혼동 방지"] }, { tag: "Trade secret", title: "영업비밀", body: ["비공개 영업 정보", "공개되면 보호 상실"] }], edge: { type: "flow", text: "디지털 매체의 도전" } },
  { nodes: [{ title: "복제·전송·변경이 쉬움", body: ["DMCA(1998): 보호 기술 우회 자체를 불법화"] }] },
], y0));

fig("mis-gl-4h-liability-quality", {
  eyebrow: "4장 · 4-6 책임·시스템 품질",
  title: "누가 책임지고, 어디까지 품질을 요구할까",
  subtitle: "소프트웨어를 무엇으로 보느냐에 따라 책임이 달라지고, 실패의 가장 흔한 원인은 입력 데이터다",
  desc: "위에서 소프트웨어 오류의 책임이 기계의 일부로 보면 제조사·운영자 책임, 책으로 보면 저자 책임을 묻기 어려움, 서비스로 보면 전달 내용 책임이 제한되는 세 관점으로 나뉘고, 아래에서 시스템 성능 저하의 세 원인인 소프트웨어 버그, 하드웨어·시설 고장, 낮은 입력 데이터 품질 중 입력 데이터가 가장 흔한 원인임을 보여 주는 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Computer-related liability", title: "소프트웨어 오류로 피해 — 누구 책임?" }], edge: { type: "bus", text: "보는 관점" } },
  { nodes: [{ title: "기계의 일부", body: ["제조사·운영자 책임 가능"] }, { title: "책과 유사", body: ["저자 책임 묻기 어려움"] }, { title: "서비스와 유사", body: ["전달 내용 책임 제한"] }], after: 34 },
  { nodes: [{ tag: "System quality", title: "경제적으로 가능한 수준의 품질", body: ["완벽한 소프트웨어는 비경제적"] }], edge: { type: "bus", text: "성능 저하 원인" } },
  { nodes: [{ title: "버그·오류" }, { title: "하드웨어·시설 고장" }, { title: "낮은 입력 데이터 품질", body: ["가장 흔함"], style: "focal" }] },
], y0));

fig("mis-gl-4i-quality-of-life", {
  eyebrow: "4장 · 4-7 삶의 질",
  title: "정보시스템의 사회적 비용",
  subtitle: "효율의 대가로 권력 집중·경계 약화·범죄·격차·건강 위험이 생긴다. 불법인지가 crime과 abuse를 가른다",
  desc: "삶의 질 차원이 권력 집중과 변화 속도 같은 사회 변화, 컴퓨터 범죄와 남용, 디지털 격차, 건강 위험의 네 묶음을 포함하고, 범죄는 불법 행위이고 남용은 비윤리적이지만 반드시 불법은 아니며, 건강 위험에는 반복 긴장성 손상(대표 손목터널증후군), 컴퓨터 시각 증후군, 테크노스트레스가 있다는 그림",
  legend: ["flow", "focal"],
}, y0 => rows([
  { nodes: [{ tag: "Quality of life", title: "삶의 질 차원", style: "focal" }], edge: { type: "bus", text: "포함" } },
  { nodes: [{ tag: "사회 변화", title: "권력·경계", body: ["빅테크 권력 집중(DMA)", "변화 속도·일과 삶 경계", "의존·취약성"] }, { tag: "Crime vs abuse", title: "불법인가?", body: ["범죄 = 불법", "남용 = 비윤리 (스팸)", "CAN-SPAM은 기만만 금지"] }], after: 10 },
  { nodes: [{ tag: "Equity & access", title: "디지털 격차", body: ["소득·인구 집단별 접근 격차", "time-wasting gap"] }, { tag: "Health risks", title: "건강 위험", body: ["RSI ⊃ CTS(손목)", "CVS(눈) · 테크노스트레스"] }] },
], y0));

// =============================================================================================
const written = [];
for (const { slug, meta, build } of figures) {
  const { svg, height } = compose(meta, build);
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), svgDocument(slug, meta, height, svg), "utf8");
  written.push(`${slug} (${W}×${Math.ceil(height)})`);
}
console.log(`generated ${written.length} glossary diagrams`);
for (const line of written) console.log(`  ${line}`);
