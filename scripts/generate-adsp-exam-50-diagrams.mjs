// Rebuild the five supplementary figures used inside the exam's folded answers.
// Run from the repository root: node scripts/generate-adsp-exam-50-diagrams.mjs
import fs from "node:fs";
import path from "node:path";
import { esc, textWidth } from "./mis-glossary-kit.mjs";

const out = path.resolve("public/materials/diagrams");
const files = [];
const ink = "#1d1d1a", muted = "#65645e", border = "#b9b6ac";
const teal = "#126b61", blue = "#315b8c";
const text = (x, y, value, size = 15, anchor = "start", color = ink, bold = false) => {
  const width = textWidth(value, size, bold);
  const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  if (left < 0 || left + width > 560) throw new Error(`Text outside viewBox: ${value}`);
  return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}"${bold ? ' font-weight="700"' : ""}>${esc(value)}</text>`;
};
const line = (x1, y1, x2, y2, color = border, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const rect = (x, y, w, h, fill = "#f0eee8", stroke = border) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" stroke="${stroke}"/>`;
const dot = (x, y, r = 3, fill = muted) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const curve = (points, color = teal, dash = "") => `<path d="${points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2.8"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
function figure(slug, height, title, description, body) {
  const id = `adsp-50-${slug}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="${height}" viewBox="0 0 560 ${height}" role="img" aria-labelledby="${id}-title ${id}-desc">
<title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc>
<g font-family="Pretendard, Malgun Gothic, Noto Sans KR, sans-serif">
<rect width="560" height="${height}" fill="#f7f6f2"/>
${text(24, 32, "[50회] ADsP · 복습 도식", 13.5, "start", muted)}
${text(24, 66, title, 22, "start", ink, true)}
${line(24, 86, 536, 86)}${body}</g></svg>\n`;
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, `${id}.svg`), svg);
  files.push(`${id}.svg`);
}

// Q12: readiness is horizontal; maturity is vertical.
{
  const parts = [text(24, 114, "가로축: 분석 준비도 · 세로축: 분석 성숙도", 14.5, "start", muted)];
  const cells = [
    [90, 148, "정착형", "준비도 낮음 · 성숙도 높음", false],
    [310, 148, "확산형", "준비도 높음 · 성숙도 높음", false],
    [90, 285, "준비형", "준비도 낮음 · 성숙도 낮음", true],
    [310, 285, "도입형", "준비도 높음 · 성숙도 낮음", false],
  ];
  for (const [x, y, name, detail, focus] of cells) {
    parts.push(rect(x, y, 210, 125, focus ? "#e1eee9" : "#f0eee8", focus ? teal : border));
    parts.push(text(x + 105, y + 47, name, 23, "middle", focus ? teal : ink, true));
    const [a, b] = detail.split(" · ");
    parts.push(text(x + 105, y + 76, a, 14.5, "middle", muted), text(x + 105, y + 98, b, 14.5, "middle", muted));
  }
  parts.push(line(76, 423, 530, 423, ink), line(76, 423, 76, 140, ink));
  parts.push(text(190, 450, "낮음", 14, "middle"), text(415, 450, "높음", 14, "middle"));
  parts.push(text(295, 478, "분석 준비도 →", 16, "middle", ink, true));
  parts.push(text(50, 215, "높음", 14, "middle"), text(50, 355, "낮음", 14, "middle"));
  parts.push(text(24, 516, "둘 다 낮으면, 분석을 위한 사전 준비부터 시작합니다.", 15, "start", teal));
  figure("readiness", 540, "준비도와 성숙도로 읽는 네 유형", "준비도를 가로축, 성숙도를 세로축으로 둔 사분면. 왼쪽 아래 준비형, 오른쪽 아래 도입형, 왼쪽 위 정착형, 오른쪽 위 확산형이며 준비형을 강조한다.", parts.join(""));
}

// Q24: principal axes of the correlation matrix [[1, .1], [.1, 1]].
{
  const parts = [text(24, 114, "표준화된 A, B · 상관계수 r = 0.1", 14.5, "start", muted)];
  const cx = 280, cy = 270;
  parts.push(line(115, cy, 445, cy), line(cx, 405, cx, 135));
  parts.push(text(455, cy + 6, "A", 17, "start", ink, true), text(cx, 130, "B", 17, "middle", ink, true));
  const ellipse = Array.from({ length: 121 }, (_, i) => {
    const a = i * Math.PI / 60;
    const u = 104 * Math.sqrt(1.1) * Math.cos(a), v = 104 * Math.sqrt(.9) * Math.sin(a);
    return [cx + (u + v) / Math.sqrt(2), cy - (u - v) / Math.sqrt(2)];
  });
  parts.push(curve(ellipse, border));
  parts.push(line(170, 380, 390, 160, blue), line(170, 160, 390, 380, teal, "7 5"));
  parts.push(text(395, 153, "PC₁", 17, "start", blue, true), text(395, 398, "PC₂", 17, "start", teal, true));
  parts.push(rect(24, 430, 512, 100));
  parts.push(text(42, 458, "PC₁ = (A + B) / √2", 18, "start", blue, true));
  parts.push(text(42, 487, "PC₂ = (A − B) / √2", 18, "start", teal, true));
  parts.push(text(42, 513, "고유값 1.1, 0.9 · 두 축은 서로 수직", 14.5, "start", muted));
  parts.push(text(24, 556, "타원: 같은 분산 수준의 개념도 · 전체 부호 반전도 같은 축", 13.5, "start", muted));
  figure("pca", 578, "주성분은 합 방향과 차 방향", "상관계수 0.1인 두 표준화 변수의 분산 타원과 수직인 두 주성분 축. 첫 주성분은 A와 B의 합, 두 번째 주성분은 차 방향이다.", parts.join(""));
}

// Q32: exact population ACF/PACF for stationary AR(3), phi=(.5,.2,.1).
{
  const rho = [1, 26 / 37, 23 / 37];
  for (let k = 3; k <= 10; k++) rho[k] = .5 * rho[k - 1] + .2 * rho[k - 2] + .1 * rho[k - 3];
  const pacf = [1];
  let phi = [];
  for (let k = 1; k <= 10; k++) {
    const reflection = (rho[k] - phi.reduce((s, v, j) => s + v * rho[k - j - 1], 0)) / (1 - phi.reduce((s, v, j) => s + v * rho[j + 1], 0));
    phi = [...phi.map((v, j) => v - reflection * phi[k - j - 2]), reflection];
    pacf.push(Math.abs(reflection) < 1e-12 ? 0 : reflection);
  }
  const parts = [text(24, 114, "예시: AR(3), 계수 (0.5, 0.2, 0.1)의 이론값", 14, "start", muted)];
  function stemPlot(values, top, title, caption, color) {
    parts.push(text(32, top, title, 18, "start", color, true));
    const baseline = top + 116, scale = 100;
    for (const value of [0, .5, 1]) {
      const y = baseline - value * scale;
      parts.push(line(62, y, 522, y, border, value ? "3 4" : ""), text(52, y + 5, String(value), 13, "end", muted));
    }
    for (let k = 1; k <= 10; k++) {
      const x = 72 + (k - 1) * 48, y = baseline - values[k] * scale;
      parts.push(line(x, baseline, x, y, color), dot(x, y, 3.5, color), text(x, baseline + 23, String(k), 13, "middle", muted));
    }
    parts.push(text(32, baseline + 53, caption, 15, "start", color), text(520, baseline + 44, "시차", 13, "end", muted));
  }
  stemPlot(rho, 151, "ACF · 자기상관함수", "서서히 감소하는 꼬리", blue);
  stemPlot(pacf, 357, "PACF · 부분자기상관함수", "시차 3까지 나타나고, 4부터 0으로 절단", teal);
  figure("acf-pacf", 550, "AR(3)를 구분하는 두 가지 패턴", "AR(3) 모형의 이론적 자기상관과 부분자기상관. ACF는 점차 감소하고 PACF는 시차 3 이후 0이 된다. 표본 추정값이 아닌 이론적 예시다.", parts.join(""));
}

// Q42: actual curves rather than hand-drawn approximations.
{
  const parts = [text(24, 114, "같은 입력 x에서 비교하는 함수의 모양과 출력 범위", 14, "start", muted)];
  const specs = [
    { name: "Sigmoid", fn: x => 1 / (1 + Math.exp(-x)), min: -.1, max: 1.1, ticks: [0, 1], range: "출력 (0, 1)", zero: "x = 0 → 0.5", color: blue },
    { name: "tanh", fn: Math.tanh, min: -1.2, max: 1.2, ticks: [-1, 0, 1], range: "출력 (−1, 1)", zero: "x = 0 → 0", color: teal },
    { name: "ReLU", fn: x => Math.max(0, x), min: -.4, max: 4.4, ticks: [0, 4], range: "출력 [0, ∞)", zero: "x ≤ 0 → 0", color: ink },
  ];
  specs.forEach((s, index) => {
    const top = 144 + index * 140, left = 64, width = 250, height = 92;
    const X = x => left + (x + 4) / 8 * width;
    const Y = y => top + height * (s.max - y) / (s.max - s.min);
    parts.push(line(left, Y(0), left + width, Y(0)), line(X(0), top, X(0), top + height));
    s.ticks.forEach(y => parts.push(text(left - 10, Y(y) + 4, String(y), 12.5, "end", muted), line(left, Y(y), left + width, Y(y), border, "2 5")));
    [-4, 0, 4].forEach(x => parts.push(text(X(x), top + height + 21, String(x), 12.5, "middle", muted)));
    parts.push(curve(Array.from({ length: 121 }, (_, i) => { const x = -4 + i / 15; return [X(x), Y(s.fn(x))]; }), s.color));
    parts.push(text(345, top + 20, s.name, 20, "start", s.color, true), text(345, top + 48, s.range, 16, "start", ink, true), text(345, top + 75, s.zero, 14, "start", muted));
    parts.push(text(328, top + height + 21, "x", 13, "start", muted));
  });
  figure("activations", 565, "활성화 함수의 출력 범위", "시그모이드, tanh, ReLU의 실제 함수 곡선. 시그모이드는 0과 1 사이, tanh는 마이너스 1과 1 사이, ReLU는 0 이상의 값을 출력한다. 그래프마다 세로축 눈금이 다르다.", parts.join(""));
}

// Q50: schematic comparison, not the output of fitting a clustering model.
{
  const parts = [text(24, 114, "군집을 묶는 기준과 결과 표현을 구분하세요.", 14, "start", muted)];
  parts.push(rect(24, 134, 512, 190), text(42, 164, "DBSCAN · 밀도로 연결", 18, "start", teal, true));
  for (let band = 0; band < 2; band++) {
    for (let i = 0; i < 22; i++) {
      const angle = i / 21 * Math.PI;
      for (const offset of [-4, 4]) {
        const x = 125 + Math.cos(angle) * 64 + band * 66;
        const y = band === 0 ? 205 - Math.sin(angle) * 22 + offset : 230 + Math.sin(angle) * 22 + offset;
        parts.push(dot(x, y, 3, band ? blue : teal));
      }
    }
  }
  [[52, 282], [273, 188], [290, 280]].forEach(([x, y]) => parts.push(line(x - 4, y - 4, x + 4, y + 4, muted), line(x - 4, y + 4, x + 4, y - 4, muted)));
  parts.push(text(336, 204, "● 밀집된 점: 군집", 14.5), text(336, 233, "× 고립된 점: 노이즈", 14.5), text(42, 302, "비구형 군집도 탐색 · 군집 수 k 사전 지정 불필요", 14));
  parts.push(rect(24, 342, 512, 192), text(42, 372, "계층적 군집 · 단계적으로 병합", 18, "start", ink, true));
  parts.push(line(78, 490, 78, 449, ink), line(130, 490, 130, 449, ink), line(78, 449, 130, 449, ink));
  parts.push(line(208, 490, 208, 432, ink), line(260, 490, 260, 432, ink), line(208, 432, 260, 432, ink));
  parts.push(line(104, 449, 104, 402, ink), line(234, 432, 234, 402, ink), line(104, 402, 234, 402, ink));
  [78, 130, 208, 260].forEach((x, i) => parts.push(text(x, 514, "ABCD"[i], 14, "middle")));
  parts.push(text(328, 432, "병합 과정을 트리로 표현", 14), text(328, 461, "→ 덴드로그램", 17, "start", ink, true));
  parts.push(text(24, 562, "위 점 배치와 아래 트리는 개념 설명을 위한 별개의 예시입니다.", 13, "start", muted));
  figure("clustering", 584, "밀도 기반 군집과 계층적 군집", "상단은 비구형 밀집 군집과 고립된 노이즈 점을 보여 주는 DBSCAN 개념도, 하단은 A B C D의 단계적 병합을 트리로 보여 주는 계층적 군집 덴드로그램이다. 두 그림은 별개의 예시다.", parts.join(""));
}

console.log(`Generated ${files.length} SVG figures:\n${files.join("\n")}`);
