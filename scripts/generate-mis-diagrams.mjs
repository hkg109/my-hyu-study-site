import fs from "node:fs";
import path from "node:path";

const publicDir = path.join("public", "materials", "diagrams");
const sourceDir = path.join("docs", "diagrams");
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });

const colors = {
  paper: "#f7f6f2",
  surface: "#f0eee8",
  ink: "#1d1d1a",
  muted: "#65645e",
  subtle: "#929087",
  border: "#b9b6ac",
  white: "#f7f6f2",
};

const font = `'Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif`;

function frame(slug, title, description, eyebrow, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">${title}</title>
  <desc id="${slug}-desc">${description}</desc>
  <defs>
    <marker id="${slug}-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="${colors.muted}"/></marker>
    <marker id="${slug}-arrow-strong" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="${colors.ink}"/></marker>
  </defs>
  <style>
    .bg{fill:${colors.paper}}.rule{stroke:${colors.border};stroke-width:1;fill:none}.flow{stroke:${colors.muted};stroke-width:2;fill:none;marker-end:url(#${slug}-arrow)}.flow-strong{stroke:${colors.ink};stroke-width:2.5;fill:none;marker-end:url(#${slug}-arrow-strong)}
    .node{fill:${colors.paper};stroke:${colors.border};stroke-width:1.5}.node-focal{fill:${colors.ink};stroke:${colors.ink};stroke-width:1.5}.zone{fill:${colors.surface};stroke:${colors.border};stroke-width:1.5}.tag{font:600 12px ${font};letter-spacing:.12em;fill:${colors.muted}}.title{font:700 28px ${font};fill:${colors.ink}}.subtitle{font:400 15px ${font};fill:${colors.muted}}.name{font:700 18px ${font};fill:${colors.ink}}.name-inverse{font:700 18px ${font};fill:${colors.white}}.sub{font:400 14px ${font};fill:${colors.muted}}.sub-inverse{font:400 14px ${font};fill:${colors.white}}.small{font:600 12px ${font};fill:${colors.muted};letter-spacing:.04em}.label-mask{fill:${colors.paper}}
  </style>
  <rect class="bg" width="1280" height="720"/>
  <text class="tag" x="64" y="52">${eyebrow}</text>
  <text class="title" x="64" y="92">${title}</text>
  <text class="subtitle" x="64" y="122">${description}</text>
  <line class="rule" x1="64" y1="148" x2="1216" y2="148"/>
  ${body}
</svg>`;
}

function node(x, y, width, height, title, sub, focal = false) {
  const titleClass = focal ? "name-inverse" : "name";
  const subClass = focal ? "sub-inverse" : "sub";
  return `<g><rect class="${focal ? "node-focal" : "node"}" x="${x}" y="${y}" width="${width}" height="${height}" rx="6"/><text class="${titleClass}" x="${x + width / 2}" y="${y + 47}" text-anchor="middle">${title}</text><text class="${subClass}" x="${x + width / 2}" y="${y + 76}" text-anchor="middle">${sub}</text></g>`;
}

function processDiagram({ slug, title, description, eyebrow, steps, feedbackLabel }) {
  const xs = [56, 292, 528, 764, 1000];
  const y = 256;
  const width = 192;
  const height = 128;
  const arrows = xs.slice(0, -1).map((x, index) => `<line class="${index === 2 ? "flow-strong" : "flow"}" x1="${x + width}" y1="320" x2="${xs[index + 1]}" y2="320"/>`).join("\n  ");
  const feedback = `<path class="flow" d="M1096 384 V504 Q1096 512 1088 512 H160 Q152 512 152 504 V384"/><rect class="label-mask" x="548" y="496" width="184" height="32"/><text class="small" x="640" y="516" text-anchor="middle">${feedbackLabel}</text>`;
  const nodes = steps.map((step, index) => node(xs[index], y, width, height, step.title, step.sub, step.focal)).join("\n  ");
  const footer = `<text class="small" x="64" y="636">READ LEFT → RIGHT · THE RETURN PATH CHANGES THE NEXT CYCLE</text>`;
  return frame(slug, title, description, eyebrow, `${arrows}\n  ${feedback}\n  ${nodes}\n  ${footer}`);
}

function systemsDiagram() {
  const slug = "mis-02-management-systems";
  const arrows = `<path class="flow" d="M560 488 V452 Q560 444 552 444 H420 Q412 444 412 436 V404"/><path class="flow" d="M720 488 V452 Q720 444 728 444 H860 Q868 444 868 436 V404"/><path class="flow-strong" d="M412 276 V244 Q412 236 420 236 H560 Q568 236 568 228 V212"/><path class="flow-strong" d="M868 276 V244 Q868 236 860 236 H720 Q712 236 712 228 V212"/>`;
  const body = `${arrows}
  <rect class="zone" x="1016" y="188" width="200" height="396" rx="8"/>
  <text class="small" x="1116" y="224" text-anchor="middle">ENTERPRISE APPLICATIONS</text>
  <text class="name" x="1116" y="292" text-anchor="middle">ERP</text><text class="sub" x="1116" y="318" text-anchor="middle">internal integration</text>
  <text class="name" x="1116" y="372" text-anchor="middle">SCM · CRM</text><text class="sub" x="1116" y="398" text-anchor="middle">partners · customers</text>
  <text class="name" x="1116" y="452" text-anchor="middle">KMS</text><text class="sub" x="1116" y="478" text-anchor="middle">organizational knowledge</text>
  <text class="sub" x="1116" y="548" text-anchor="middle">모든 기능과 관리 수준 연결</text>
  ${node(480, 164, 320, 128, "ESS", "strategic · senior management", true)}
  ${node(252, 276, 320, 128, "MIS", "routine reports · middle management")}
  ${node(708, 276, 320, 128, "DSS", "non-routine analysis · middle management")}
  ${node(480, 488, 320, 128, "TPS", "structured transactions · operations")}
  <text class="small" x="64" y="206">STRATEGIC</text><line class="rule" x1="64" y1="216" x2="212" y2="216"/>
  <text class="small" x="64" y="332">MANAGERIAL</text><line class="rule" x1="64" y1="342" x2="212" y2="342"/>
  <text class="small" x="64" y="544">OPERATIONAL</text><line class="rule" x1="64" y1="554" x2="212" y2="554"/>`;
  return frame(slug, "관리 수준별 정보시스템", "거래 데이터가 TPS에서 MIS와 DSS를 거쳐 ESS의 전략적 판단으로 올라가는 구조", "CHAPTER 2A · SYSTEM LAYERS", body);
}

function organizationLoopDiagram() {
  const slug = "mis-04-organization-it-loop";
  const arrows = `<line class="flow-strong" x1="536" y1="252" x2="744" y2="252"/><line class="flow" x1="928" y1="316" x2="928" y2="436"/><line class="flow-strong" x1="744" y1="500" x2="536" y2="500"/><line class="flow" x1="352" y1="436" x2="352" y2="316"/>`;
  const body = `${arrows}
  ${node(168, 188, 368, 128, "Organization", "strategy · structure · processes")}
  ${node(744, 188, 368, 128, "Mediating factors", "culture · politics · environment")}
  ${node(744, 436, 368, 128, "IT capabilities", "data · software · networks", true)}
  ${node(168, 436, 368, 128, "Changed work &amp; decisions", "tasks · authority · coordination")}
  <text class="small" x="640" y="246" text-anchor="middle">REQUIREMENTS</text>
  <text class="small" x="640" y="494" text-anchor="middle">ORGANIZATIONAL CHANGE</text>
  <text class="subtitle" x="640" y="640" text-anchor="middle">성과는 기술 단독 효과가 아니라 네 요소가 서로 맞춰지는 과정에서 결정된다.</text>`;
  return frame(slug, "조직과 정보기술의 양방향 관계", "조직의 조건이 IT 설계를 만들고 IT가 다시 업무·권한·의사결정을 바꾸는 순환", "CHAPTER 3 · CAUSAL LOOP", body);
}

function ethicsNestedDiagram() {
  const slug = "mis-05-ethical-ripple";
  const body = `<rect class="zone" x="64" y="184" width="720" height="432" rx="8"/>
  <text class="small" x="88" y="216">POLITY · POLITICAL ISSUES</text>
  <rect class="node" x="120" y="240" width="608" height="320" rx="8"/>
  <text class="small" x="144" y="272">SOCIETY · SOCIAL ISSUES</text>
  <rect class="zone" x="184" y="296" width="480" height="208" rx="8"/>
  <text class="small" x="208" y="328">INDIVIDUAL · ETHICAL ISSUES</text>
  <rect class="node-focal" x="280" y="356" width="288" height="96" rx="6"/>
  <text class="name-inverse" x="424" y="398" text-anchor="middle">New IT capability</text>
  <text class="sub-inverse" x="424" y="426" text-anchor="middle">rules보다 빠른 기술 변화</text>
  <path class="flow" d="M568 404 H812"/>
  <rect class="node" x="828" y="184" width="388" height="432" rx="8"/>
  <text class="small" x="860" y="224">FIVE MORAL DIMENSIONS</text>
  <line class="rule" x1="860" y1="244" x2="1184" y2="244"/>
  <text class="name" x="860" y="288">01 · Information rights</text><text class="sub" x="860" y="314">privacy · consent · obligations</text>
  <text class="name" x="860" y="360">02 · Property rights</text><text class="sub" x="860" y="386">ownership · intellectual property</text>
  <text class="name" x="860" y="432">03 · Accountability</text><text class="sub" x="860" y="458">responsibility · liability · control</text>
  <text class="name" x="860" y="504">04 · System quality</text><text class="sub" x="860" y="530">data quality · errors · standards</text>
  <text class="name" x="860" y="576">05 · Quality of life</text><text class="sub" x="860" y="602">equity · access · social effects</text>
  <text class="subtitle" x="64" y="660">기술 충격은 개인의 판단에서 시작해 사회 규범과 법·정책의 문제로 확장된다.</text>`;
  return frame(slug, "정보기술이 만드는 윤리적 파장", "새로운 정보기술이 개인의 윤리 문제에서 사회와 정치의 쟁점으로 확장되는 구조", "CHAPTER 4 · NESTED RIPPLE", body);
}

const diagrams = [
  {
    slug: "mis-01-information-feedback",
    svg: processDiagram({
      slug: "mis-01-information-feedback",
      title: "기록이 의사결정이 되는 과정",
      description: "현실의 사건이 입력·처리·출력을 거쳐 행동이 되고, 피드백이 다음 주기를 수정하는 흐름",
      eyebrow: "CHAPTER 1 · INFORMATION FLOW",
      feedbackLabel: "FEEDBACK · 기준과 운영 수정",
      steps: [
        { title: "Reality", sub: "거래 · 사건 · 환경" },
        { title: "Input", sub: "원시 데이터 포착" },
        { title: "Processing", sub: "분류 · 계산 · 요약" },
        { title: "Output", sub: "보고서 · 경고 · 화면", focal: true },
        { title: "Decision &amp; action", sub: "발주 · 조정 · 통제" },
      ],
    }),
  },
  { slug: "mis-02-management-systems", svg: systemsDiagram() },
  {
    slug: "mis-03-knowledge-value-chain",
    svg: processDiagram({
      slug: "mis-03-knowledge-value-chain",
      title: "지식관리 가치사슬",
      description: "지식을 획득하고 보존·전달해 실제 업무에 적용하며 결과를 다시 학습하는 과정",
      eyebrow: "CHAPTER 2B · KNOWLEDGE MANAGEMENT",
      feedbackLabel: "ORGANIZATIONAL LEARNING",
      steps: [
        { title: "Acquire", sub: "경험 · 문서 · 데이터" },
        { title: "Store", sub: "구조화 · 소유권 · 보존" },
        { title: "Disseminate", sub: "검색 · 포털 · 협업" },
        { title: "Apply", sub: "결정 · 프로세스 내재화", focal: true },
        { title: "Outcome", sub: "새 업무 · 제품 · 시장" },
      ],
    }),
  },
  { slug: "mis-04-organization-it-loop", svg: organizationLoopDiagram() },
  { slug: "mis-05-ethical-ripple", svg: ethicsNestedDiagram() },
];

for (const { slug, svg } of diagrams) {
  fs.writeFileSync(path.join(publicDir, `${slug}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`, "utf8");
  fs.writeFileSync(path.join(sourceDir, `${slug}.html`), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${slug}</title><style>html,body{margin:0;background:${colors.paper}}.diagram-container{width:100%;overflow-x:auto}svg{display:block;width:100%;height:auto;min-width:1280px}</style></head><body><main class="diagram-container">${svg}</main></body></html>\n`, "utf8");
  console.log(`generated ${slug}.svg`);
}
