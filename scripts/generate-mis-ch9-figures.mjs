import { writeFileSync } from "node:fs";
import path from "node:path";
import { box, circle, ellipse, frame, lines, p, sector, t } from "./mis-figure-kit.mjs";

// Redraws the Chapter 9 textbook figures from ch09_18ed.pdf: node scripts/generate-mis-ch9-figures.mjs
const outDir = process.argv[2] ?? path.join("public", "materials", "diagrams");
const f = (n, meta, body) => {
  const slug = `mis-fig-9-${String(n).padStart(2, "0")}`;
  return [slug, frame(slug, { chapter: 9, figure: `9.${n}`, ...meta }, body.join("\n  "))];
};
const note = height => t(1216, height - 20, "교재 그림의 구성을 바탕으로 다시 그림", "small", "end");
const db = (cx, cy, w, h, cls = "node") => `<g><ellipse class="${cls}" cx="${cx}" cy="${cy + h}" rx="${w / 2}" ry="${h * 0.16}"/><rect class="${cls}" x="${cx - w / 2}" y="${cy}" width="${w}" height="${h}" style="stroke:none"/><path class="line" d="M${cx - w / 2} ${cy} V ${cy + h} M${cx + w / 2} ${cy} V ${cy + h}" style="stroke:#b9b6ac;stroke-width:1.5"/><ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h * 0.16}"/></g>`;
const named = (x, y, w, h, en, ko, cls = "node") => `${box(x, y, w, h, cls)}${t(x + w / 2, y + h / 2 + (ko ? -2 : 6), en, cls === "focal" ? "name inverse" : "name", "middle")}${ko ? t(x + w / 2, y + h / 2 + 20, ko, cls === "focal" ? "small inverse" : "sub", "middle") : ""}`;
const diamond = (cx, cy, w, h, cls = "deep") => `<path class="${cls}" d="M${cx} ${cy - h / 2} L ${cx + w / 2} ${cy} L ${cx} ${cy + h / 2} L ${cx - w / 2} ${cy} Z"/>`;

// Tier-3 → tier-2 → tier-1 supplier tree feeding one focal firm; shared by Figures 9.2 and 9.3.
function supplierTree(top) {
  const parts = [];
  [0, 1].forEach(g => {
    const t1y = top + 60 + g * 230;
    parts.push(named(330, t1y, 150, 70, "Contract", "Supplier", "zone"));
    [0, 1].forEach(k => {
      const t2y = top + g * 230 + k * 120;
      parts.push(box(190, t2y + 10, 80, 60, "deep"), p(`M270 ${t2y + 40} L 330 ${t1y + 35}`, "soft"));
      [0, 1, 2].forEach(j => parts.push(box(96, t2y + 6 + j * 24, 22, 18, "node"), p(`M118 ${t2y + 15 + j * 24} L 190 ${t2y + 40}`, "soft")));
    });
  });
  return parts.join("");
}

const figures = [
  f(1, { title: "How Enterprise Systems Work", subtitle: "통합 소프트웨어 모듈과 하나의 중앙 데이터베이스 — 한 부서에서 입력한 정보가 곧바로 다른 모든 부서에서 쓰인다", height: 900 }, [
    box(450, 330, 380, 240, "zone"), db(640, 380, 220, 110, "focal"), lines(640, 440, ["Centralized", "Database"], "name inverse", 24, "middle"),
    named(500, 176, 280, 84, "Finance & Accounting", "재무·회계", "deep"), p("M640 264 V 360", "both"),
    lines(810, 196, ["• Cash on hand", "• Accounts receivable", "• Customer credit", "• Revenue"], "sub", 22),
    named(96, 410, 260, 84, "Sales & Marketing", "영업·마케팅", "deep"), p("M360 452 H 524", "both"),
    lines(110, 530, ["• Orders", "• Sales forecasts", "• Return requests", "• Price changes"], "sub", 22),
    named(924, 410, 260, 84, "Human Resources", "인사", "deep"), p("M756 452 H 920", "both"),
    lines(940, 530, ["• Hours worked", "• Labor cost", "• Job skills"], "sub", 22),
    named(500, 650, 280, 84, "Manufacturing & Production", "생산", "deep"), p("M640 520 V 646", "both"),
    lines(810, 676, ["• Materials", "• Production schedules", "• Shipment dates", "• Production capacity", "• Purchases"], "sub", 22),
    t(96, 820, "핵심 = ‘one company, one database’ — 따로 떨어진 데이터베이스들의 모음이 아니다", "label"),
    note(900),
  ]),
  f(2, { title: "Nike’s Supply Chain", subtitle: "공급자(상류) → Nike → 유통업체 → 소매점 → 고객(하류)으로 정보와 제품이 양방향으로 흐른다", height: 780 }, [
    p("M100 196 V 182 H 400 V 196", "line"), t(250, 174, "Upstream · 상류", "name", "middle"),
    supplierTree(216),
    ...[["Nike", 530], ["Distributor", 710], ["Retailer", 890], ["Customer", 1070]].map(([en, x], i) => `${named(x, 410, 130, 70, en, ["", "유통업체", "소매점", "고객"][i], i === 0 ? "focal" : "deep")}${i ? p(`M${x - 46} 445 H ${x - 4}`, "both") : ""}`),
    p("M484 314 L 528 410", "both"), p("M484 540 L 528 482", "both"),
    t(560, 330, "Capacity, inventory level, delivery schedule, payment terms", "label"), t(560, 352, "생산능력 · 재고 수준 · 납기 · 지급 조건 (상류 쪽 정보)", "sub"),
    t(560, 540, "Orders, return requests, repair and service requests, payments", "label"), t(560, 562, "주문 · 반품 · 수리·서비스 요청 · 대금 (하류 쪽 정보)", "sub"),
    p("M710 596 V 612 H 1200 V 596", "line"), t(955, 636, "Downstream · 하류", "name", "middle"),
    lines(107, 712, ["Tier 3", "Suppliers"], "small", 18, "middle"), lines(230, 712, ["Tier 2", "Suppliers"], "small", 18, "middle"), lines(405, 712, ["Tier 1", "Suppliers"], "small", 18, "middle"),
    note(780),
  ]),
  f(3, { title: "The Bullwhip Effect", subtitle: "부정확한 정보 때문에 소매 수요의 작은 흔들림이 상류로 갈수록 ‘만약을 위해’ 쌓은 재고로 크게 증폭된다", height: 920 }, [
    p("M100 196 V 182 H 400 V 196", "line"), t(250, 174, "Upstream", "name", "middle"),
    supplierTree(216),
    ...[["Manufacturer", 530], ["Distributor", 710], ["Retailer", 890], ["Customer", 1070]].map(([en, x], i) => `${named(x, 410, 130, 70, en, "", i === 0 ? "deep" : "zone")}${i ? p(`M${x - 46} 445 H ${x - 4}`, "both") : ""}`),
    p("M484 314 L 528 410", "both"), p("M484 540 L 528 482", "both"),
    p("M710 520 V 536 H 1200 V 520", "line"), t(955, 560, "Downstream", "name", "middle"),
    ...[[107, 120], [230, 104], [405, 88], [595, 72], [775, 52], [955, 34], [1135, 20]].map(([x, h]) => {
      const base = 840;
      return p(`M${x - 40} ${base} H ${x - 22} L ${x - 12} ${base - h} L ${x - 2} ${base} L ${x + 8} ${base - h * 0.85} L ${x + 18} ${base} H ${x + 40}`, "line");
    }),
    t(640, 696, "수요 변동 크기 (오른쪽 고객 → 왼쪽 공급자로 갈수록 커진다)", "label", "middle"),
    p("M1150 870 H 110", "flow"), t(640, 892, "‘just in case’ 과잉 재고가 단계마다 더해진다", "sub", "middle"),
  ]),
  f(4, { title: "Push- Versus Pull-Based Supply Chain Models", subtitle: "“Make what we sell, not sell what we make.” — 푸시는 예측이, 풀은 실제 주문이 공급망을 움직인다", height: 760 }, [
    t(640, 190, "Push-Based Model · 예측 기반 (build-to-stock)", "name", "middle"),
    ...[["Supplier", "Supply to forecast"], ["Manufacturer", "Production based on forecasts"], ["Distributor", "Inventory based on forecasts"], ["Retailer", "Stock based on forecasts"], ["Customer", "Purchase what is on shelves"]]
      .map(([en, sub], i) => `${named(96 + i * 228, 212, 176, 70, en, "", "deep")}${lines(184 + i * 228, 312, sub.length > 18 ? [sub.split(" ").slice(0, 2).join(" "), sub.split(" ").slice(2).join(" ")] : [sub], "sub", 20, "middle")}`),
    p("M320 247 H 276", "flow"), ...[1, 2, 3].map(i => p(`M${276 + i * 228 - 4} 247 H ${320 + i * 228 - 4}`, "flow")),
    circle(412, 368, 9, "focal"), t(426, 373, "출발점: 제조업체의 예측", "small"),
    t(640, 440, "Pull-Based Model · 주문 기반 (build-to-order, demand-driven)", "name", "middle"),
    ...[["Supplier", "Supply to order"], ["Manufacturer", "Produce to order"], ["Distributor", "Automatically replenish warehouse"], ["Retailer", "Automatically replenish stock"], ["Customer", "Customer orders"]]
      .map(([en, sub], i) => `${named(96 + i * 228, 462, 176, 70, en, "", i === 4 ? "focal" : "zone")}${lines(184 + i * 228, 562, sub.length > 18 ? [sub.split(" ").slice(0, 2).join(" "), sub.split(" ").slice(2).join(" ")] : [sub], "sub", 20, "middle")}`),
    ...[0, 1, 2, 3].map(i => p(`M${320 + i * 228} 497 H ${276 + i * 228}`, "flow")),
    circle(1096, 618, 9, "focal"), t(1082, 623, "출발점: 고객 주문", "small", "end"),
    box(96, 660, 1088, 56, "zone"), t(640, 694, "푸시: 예측 → 만들어 밀어냄 · 풀: 주문 → 그만큼 당겨 만듦 (화살표 방향이 반대)", "label", "middle"),
    note(760),
  ]),
  f(5, { title: "The Emerging Internet-Driven Supply Chain", subtitle: "디지털 물류 신경계 — 기업·기업 네트워크·전자시장이 다방향으로 연결되어 재고·주문·생산능력을 즉시 조정한다", height: 820 }, (() => {
    const n = {
      dist: [700, 210, "Distributors"], ret: [980, 270, "Retailers"], man: [520, 300, "Manufacturers"], sup: [190, 400, "Suppliers"],
      log: [800, 420, "Logistics Providers"], cus: [1080, 420, "Customers"], vir: [560, 500, "Virtual Manufacturers"], con: [650, 660, "Contract Manufacturers"],
    };
    const ovals = { pin: [300, 600, "Private Industrial Networks", "Net Marketplaces"], lex: [1010, 620, "Logistics", "Exchanges"] };
    const pos = k => (n[k] ? [n[k][0], n[k][1]] : [ovals[k][0], ovals[k][1]]);
    const links = [["dist", "man"], ["dist", "ret"], ["dist", "log"], ["dist", "con"], ["man", "sup"], ["man", "log"], ["man", "pin"], ["man", "lex"], ["sup", "pin"], ["sup", "con"], ["ret", "cus"], ["log", "cus"], ["log", "lex"], ["log", "con"], ["vir", "pin"], ["vir", "lex"], ["vir", "con"], ["pin", "con"], ["con", "lex"]];
    return [
      ...links.map(([a, b]) => { const [x1, y1] = pos(a), [x2, y2] = pos(b); const dx = x2 - x1, dy = y2 - y1, clip = k => (n[k] ? Math.min(98 / Math.abs(dx || 1e-9), 40 / Math.abs(dy || 1e-9)) : 1 / Math.hypot(dx / 128, dy / 96)), k1 = clip(a), k2 = clip(b); return p(`M${(x1 + dx * k1).toFixed(0)} ${(y1 + dy * k1).toFixed(0)} L ${(x2 - dx * k2).toFixed(0)} ${(y2 - dy * k2).toFixed(0)}`, "dashboth"); }),
      ...Object.values(n).map(([x, y, label]) => { const parts = label.split(" "); return `${box(x - 90, y - 32, 180, 64, "deep")}${lines(x, parts.length > 1 ? y - 3 : y + 6, parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : parts, "label", 20, "middle")}`; }),
      ...Object.values(ovals).map(([x, y, a, b]) => `${ellipse(x, y, 120, 88, "zone")}${lines(x, y - 18, a.split(" ").length > 2 ? ["Private Industrial", "Networks"] : [a], "label", 20, "middle")}${p(`M${x - 80} ${y + 14} H ${x + 80}`, "soft")}${lines(x, y + 38, b.split(" ").length > 1 && b.length > 12 ? ["Net", "Marketplaces"] : [b], "label", 20, "middle")}`),
      t(640, 780, "모든 연결은 양방향 점선 — 한 곳의 변화가 네트워크 전체에 즉시 전달된다 (사설 산업 네트워크·넷 마켓플레이스는 10장)", "sub", "middle"),
      note(820),
    ];
  })()),
  f(6, { title: "Customer Relationship Management (CRM)", subtitle: "CRM은 고객을 가운데 두고 영업·마케팅·서비스 세 영역의 통합 애플리케이션으로 고객 관계의 모든 면을 다룬다", height: 840 }, [
    sector(640, 480, 300, 300, -150, -30, "zone"), sector(640, 480, 300, 300, -30, 90, "deep"), sector(640, 480, 300, 300, 90, 210, "node"),
    `<circle cx="640" cy="480" r="300" fill="none" stroke="#1d1d1a" stroke-width="4"/>`,
    ellipse(640, 480, 78, 46, "focal"), t(640, 486, "Customer", "name inverse", "middle"),
    t(560, 250, "Sales · 영업", "name"), lines(560, 280, ["• Telephone sales", "• Web sales", "• Retail store sales", "• Field sales"], "sub", 22),
    t(760, 470, "Service · 서비스", "name"), lines(760, 500, ["• Call center data", "• Web self-service data", "• Wireless data", "• Field service data", "• Social networking data"], "sub", 22),
    t(380, 480, "Marketing · 마케팅", "name"), lines(380, 510, ["• Campaign data", "• Content", "• Data analysis"], "sub", 22),
    note(840),
  ]),
  f(7, { title: "How CRM Systems Support Marketing", subtitle: "Responses by Channel for January 2019 Promotional Campaign — 여러 채널의 캠페인 반응을 한 곳에서 관리·평가한다", height: 760 }, (() => {
    const data = [["Direct Mail", 29.2, "zone"], ["Telephone", 30.8, "deep"], ["Web", 16.0, "node"], ["Email", 17.3, "zone"], ["Social Media", 6.7, "deep"]];
    let a = -90;
    const parts = [];
    data.forEach(([label, pct, cls]) => {
      const to = a + pct * 3.6, mid = ((a + to) / 2) * Math.PI / 180;
      parts.push(sector(560, 450, 250, 220, a, to, cls));
      const lx = 560 + Math.cos(mid) * (pct < 10 ? 300 : 150), ly = 450 + Math.sin(mid) * (pct < 10 ? 250 : 130);
      parts.push(t(lx, ly, label, "name", "middle"), t(lx, ly + 22, `${pct.toFixed(1)}%`, "label", "middle"));
      a = to;
    });
    return [...parts, `<ellipse cx="560" cy="450" rx="250" ry="220" fill="none" stroke="#1d1d1a" stroke-width="2"/>`,
      box(880, 300, 320, 200, "zone"), lines(900, 336, ["읽는 법", "• 전화 30.8%·DM 29.2%가 가장 큼", "• 소셜 미디어는 6.7%로 가장 작음", "• 채널별 반응을 비교해", "  다음 캠페인 예산을 정한다"], "label", 30), note(760)];
  })()),
  f(8, { title: "CRM Software Capabilities", subtitle: "고객 데이터를 공유하는 영업·마케팅·서비스 모듈 — 운영적 CRM(위 다섯 줄)과 분석적 CRM(맨 아래 Analytics)을 모두 지원한다", height: 900 }, [
    box(96, 176, 1088, 640, "zone"), named(140, 196, 1000, 56, "Customer Data", "", "focal"),
    ...[["Sales", ["Account Management", "Lead Management", "Order Management", "Sales Planning", "Field Sales", "Sales Analytics"]],
      ["Marketing", ["Campaign Management", "Channel Promotions Management", "Events Management", "Market Planning", "Marketing Operations", "Marketing Analytics"]],
      ["Service", ["Service Delivery", "Customer Satisfaction Management", "Returns Management", "Service Planning", "Call Center & Help Desk", "Service Analytics"]]]
      .map(([head, items], c) => {
        const x = 140 + c * 350, cx = x + 150;
        return [p(`M${cx} 252 V 274`, "line"), ellipse(cx, 300, 150, 26, "deep"), t(cx, 306, head, "name", "middle"), p(`M${cx} 326 V 720`, "soft"),
          ...items.map((it, i) => `${box(x, 340 + i * 76, 300, 56, i === 5 ? "deep" : "node")}${t(x + 16, 374 + i * 76, it, i === 5 ? "name" : "label")}`)].join("");
      }),
    t(640, 850, "CRM 소프트웨어는 업무 프로세스 중심 — 수백 개 모범 사례 프로세스에 맞춰 회사 프로세스를 고쳐야 효과가 크다", "label", "middle"),
    note(900),
  ]),
  f(9, { title: "Customer Loyalty Management Process Map", subtitle: "고객 서비스로 충성도를 높이는 모범 사례 프로세스 — CRM이 고가치 고객을 가려 우대한다", height: 760 }, [
    named(64, 210, 150, 80, "Receive", "service request", "deep"), p("M214 250 H 244", "flow"),
    named(248, 210, 160, 80, "Obtain", "customer info", "zone"), p("M408 250 H 438", "flow"),
    p("M328 290 V 470", "dash"), db(328, 470, 140, 80, "zone"), lines(328, 512, ["Customer", "database"], "label", 20, "middle"),
    diamond(540, 250, 200, 150), lines(540, 240, ["Customer info", "available?"], "label", 20, "middle"), p("M640 250 H 680", "flow"), t(660, 236, "Yes", "small", "middle"),
    named(684, 210, 140, 80, "Score", "customer", "node"), p("M824 250 H 854", "flow"),
    diamond(950, 250, 190, 150), lines(950, 240, ["High value", "and loyalty?"], "label", 20, "middle"), p("M1045 250 H 1070", "flow"), t(1058, 236, "Yes", "small", "middle"),
    named(1074, 200, 150, 100, "Provide special", "offers & service", "focal"),
    p("M540 325 V 600 H 760", "flow"), t(556, 420, "No", "small"),
    p("M950 325 V 556", "flow"), t(966, 420, "No", "small"),
    named(764, 560, 200, 80, "Route to", "best agent", "zone"), p("M964 600 H 1000", "flow"),
    named(1004, 560, 200, 80, "Resolve", "service issue", "deep"),
    t(640, 712, "고객 정보가 없거나 고가치가 아니면 → 가장 알맞은 상담원에게 연결해 문제를 해결한다", "sub", "middle"),
    note(760),
  ]),
  f(10, { title: "Analytical CRM Data Warehouse", subtitle: "고객 접점과 다른 출처의 데이터를 고객 데이터 웨어하우스에 모아 OLAP·데이터 마이닝으로 분석한다", height: 820 }, [
    box(64, 176, 330, 560, "zone"), t(84, 208, "Channels · 접점", "name"),
    lines(84, 238, ["• Call center", "• Website", "• Wireless", "• Field sales", "• Direct mail", "• Email", "• Retail store", "• Partner", "• Social media"], "label", 26),
    t(84, 498, "Other sources · 기타 출처", "name"), lines(84, 528, ["• Legacy systems", "• Demographic data", "• Third-party data", "• Marketing campaign data"], "label", 26),
    t(84, 770, "Customer data · 고객 데이터", "name"),
    p("M394 200 L 520 270", "dash"), p("M394 720 L 520 470", "dash"), p("M394 450 H 476", "flow"),
    db(620, 270, 260, 200, "deep"), lines(620, 350, ["Customer data", "warehouse or", "analytic platform"], "name", 26, "middle"),
    p("M754 370 H 840", "flow"), lines(860, 330, ["• Profitable customers", "• Market segments", "• Customer profiles", "• Churn rates"], "label", 30),
    t(860, 300, "분석 결과", "small"),
    p("M620 510 V 590", "both"), named(500, 594, 240, 120, "OLAP · Data mining", "Other data analysis tools", "focal"),
    note(820),
  ]),
];

for (const [slug, svg] of figures) writeFileSync(path.join(outDir, `${slug}.svg`), svg);
console.log(figures.map(([slug]) => slug).join(" "));
