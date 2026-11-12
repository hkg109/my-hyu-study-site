// Drawing kit for the C++ lecture figures. It follows the diagram-design skill's rules
// (orthogonal connectors with r=8 elbows, masked arrow labels off the stroke, legend strip,
// accessible <title>/<desc>) in the site's paper/ink palette, with system fonts because
// the figures are embedded through <img> and cannot load web fonts.
export const W = 720;
export const C = { paper: "#f7f6f2", paper2: "#f0eee8", deep: "#e4e1d8", ink: "#1d1d1a", muted: "#65645e", soft: "#929087", rule: "#b9b6ac", accent: "#a8431f", accentTint: "#f3e3dc" };
const sans = "'Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
const mono = "'Cascadia Mono','Consolas','D2Coding','Menlo',monospace";
export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Width budget per the skill: wide (Hangul) characters cost 1em, others ~0.6em.
export const textW = (s, size, isMono = false) => [...String(s)].reduce((w, ch) => {
  const c = ch.codePointAt(0);
  const wide = (c >= 0xac00 && c <= 0xd7a3) || (c >= 0x3130 && c <= 0x318f) || (c >= 0x2190 && c <= 0x21ff) || (c >= 0x2500 && c <= 0x25ff);
  return w + (wide ? 1 : ch === " " ? 0.32 : isMono ? 0.62 : 0.6) * size;
}, 0);
const r4 = v => Math.ceil(v / 4) * 4;

export const T = (x, y, s, { size = 14, weight = 400, fill = C.ink, anchor = "middle", code = false, italic = false } = {}) =>
  `<text x="${x}" y="${y}" font-family="${code ? mono : sans}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}${italic ? ' font-style="italic"' : ""}>${esc(s)}</text>`;

const KIND = {
  node: { fill: C.paper, stroke: C.rule, text: C.ink, sub: C.muted },
  soft: { fill: C.paper2, stroke: C.rule, text: C.ink, sub: C.muted },
  deep: { fill: C.deep, stroke: C.rule, text: C.ink, sub: C.muted },
  focal: { fill: C.ink, stroke: C.ink, text: C.paper, sub: "#d9d6cc" },
  accent: { fill: C.accentTint, stroke: C.accent, text: C.ink, sub: C.accent },
  outside: { fill: C.paper, stroke: C.muted, text: C.ink, sub: C.muted, dash: "5,4" },
};

// Box with optional tag (small rect label at top-left), name and sublabel (code or prose).
export function box(x, y, w, h, { name = "", sub = "", tag = "", kind = "node", code = false, subCode = false, size = 14 } = {}) {
  const k = KIND[kind];
  const parts = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.paper}"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1.5"${k.dash ? ` stroke-dasharray="${k.dash}"` : ""}/>`];
  const lines = sub ? (Array.isArray(sub) ? sub : [sub]) : [];
  const top = tag ? y + 24 : y, avail = y + h - top;
  const total = (name ? size : 0) + (name && lines.length ? 6 : 0) + lines.length * 16 - (lines.length ? 4 : 0);
  let base = top + (avail - total) / 2 + (name ? size - 2 : 10);
  if (tag) {
    const tw = r4(textW(tag, 11) + 12);
    parts.push(`<rect x="${x + 8}" y="${y + 6}" width="${tw}" height="16" rx="2" fill="${kind === "focal" ? "#3a3a36" : C.paper2}" stroke="${kind === "focal" ? "#55554f" : C.rule}"/>`, T(x + 8 + tw / 2, y + 18, tag, { size: 11, fill: k.sub, weight: 600 }));
  }
  if (name) { parts.push(T(x + w / 2, base, name, { size, weight: 700, fill: k.text, code })); base += 8 + 12; }
  for (const line of lines) { parts.push(T(x + w / 2, base, line, { size: 12, fill: k.sub, code: subCode })); base += 16; }
  return parts.join("");
}

export function zone(x, y, w, h, caption = "", { kind = "soft", dash = false } = {}) {
  const fill = kind === "deep" ? C.deep : kind === "paper" ? C.paper : C.paper2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${C.rule}" stroke-width="1.2"${dash ? ' stroke-dasharray="6,4"' : ""}/>` +
    (caption ? T(x + 12, y + 20, caption, { size: 12, weight: 600, fill: C.muted, anchor: "start" }) : "");
}

// Orthogonal connector through the given points; interior corners are r=8 quarter elbows.
export function wire(points, { dashed = false, color = C.muted, head = true, both = false, width = 1.6 } = {}) {
  const r = 8;
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    if (i < points.length - 1) {
      const [px, py] = points[i - 1], [nx, ny] = points[i + 1];
      const ix = Math.sign(x - px), iy = Math.sign(y - py), ox = Math.sign(nx - x), oy = Math.sign(ny - y);
      d += ` L${x - ix * r} ${y - iy * r} Q${x} ${y} ${x + ox * r} ${y + oy * r}`;
    } else d += ` L${x} ${y}`;
  }
  const m = color === C.accent ? "a" : color === C.ink ? "k" : "m";
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dashed ? ' stroke-dasharray="5,4"' : ""}${head ? ` marker-end="url(#SLUG-${m})"` : ""}${both ? ` marker-start="url(#SLUG-${m})"` : ""}/>`;
}

// Arrow label on an opaque mask; caller places it 6–10px clear of the stroke.
export function tag(x, y, s, { size = 12, code = false } = {}) {
  const w = r4(textW(s, size, code) + 12), h = 20;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" fill="${C.paper}" stroke="${C.rule}" stroke-width="1"/>` + T(x, y + size * 0.36, s, { size, fill: C.muted, weight: 600, code });
}

// A run of memory cells: [{label, value, note, kind}] drawn left to right.
export function cells(x, y, items, { w = 64, h = 40, top = true, size = 13 } = {}) {
  return items.map((it, i) => {
    const cx = x + i * w;
    const k = it.kind ? KIND[it.kind] : KIND.node;
    return `<rect x="${cx}" y="${y}" width="${w}" height="${h}" fill="${k.fill}" stroke="${it.kind === "focal" ? C.ink : C.rule}" stroke-width="1.4"/>` +
      (it.value !== undefined ? T(cx + w / 2, y + h / 2 + 5, it.value, { size, weight: 700, fill: k.text, code: true }) : "") +
      (it.label ? T(cx + w / 2, top ? y - 8 : y + h + 16, it.label, { size: 12, fill: C.muted, code: true }) : "") +
      (it.note ? T(cx + w / 2, top ? y + h + 16 : y - 8, it.note, { size: 11, fill: C.soft, code: true }) : "");
  }).join("");
}

const LEGEND = {
  flow: (x, y) => `<path d="M${x} ${y} H${x + 28}" stroke="${C.muted}" stroke-width="1.6" marker-end="url(#SLUG-m)"/>`,
  dash: (x, y) => `<path d="M${x} ${y} H${x + 28}" stroke="${C.muted}" stroke-width="1.6" stroke-dasharray="5,4" marker-end="url(#SLUG-m)"/>`,
  accent: (x, y) => `<path d="M${x} ${y} H${x + 28}" stroke="${C.accent}" stroke-width="1.8" marker-end="url(#SLUG-a)"/>`,
  focal: (x, y) => `<rect x="${x + 4}" y="${y - 8}" width="20" height="16" rx="3" fill="${C.ink}"/>`,
  accentBox: (x, y) => `<rect x="${x + 4}" y="${y - 8}" width="20" height="16" rx="3" fill="${C.accentTint}" stroke="${C.accent}"/>`,
  zone: (x, y) => `<rect x="${x + 4}" y="${y - 8}" width="20" height="16" rx="3" fill="${C.paper2}" stroke="${C.rule}"/>`,
  outside: (x, y) => `<rect x="${x + 4}" y="${y - 8}" width="20" height="16" rx="3" fill="${C.paper}" stroke="${C.muted}" stroke-dasharray="4,3"/>`,
  cell: (x, y) => `<rect x="${x + 4}" y="${y - 8}" width="20" height="16" fill="${C.paper}" stroke="${C.rule}"/>`,
};

export function figure(slug, { eyebrow, title, desc, height, legend = [] }, body) {
  const legendH = legend.length ? 48 : 0;
  const H = height + legendH;
  let lx = 32;
  const leg = legend.map(([key, text]) => { const s = LEGEND[key](lx, height + 22) + T(lx + 36, height + 27, text, { size: 12, fill: C.muted, anchor: "start" }); lx += 36 + textW(text, 12) + 28; return s; }).join("");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">${esc(title)}</title>
  <desc id="${slug}-desc">${esc(desc)}</desc>
  <defs>
    <marker id="${slug}-m" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L10,4 L0,8 Z" fill="${C.muted}"/></marker>
    <marker id="${slug}-k" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L10,4 L0,8 Z" fill="${C.ink}"/></marker>
    <marker id="${slug}-a" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L10,4 L0,8 Z" fill="${C.accent}"/></marker>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${T(32, 40, eyebrow, { size: 12, weight: 600, fill: C.muted, anchor: "start" })}
  ${T(32, 72, title, { size: 22, weight: 700, anchor: "start" })}
  <line x1="32" y1="92" x2="${W - 32}" y2="92" stroke="${C.rule}"/>
  ${body}
  ${legend.length ? `<line x1="32" y1="${height}" x2="${W - 32}" y2="${height}" stroke="${C.rule}"/>${leg}` : ""}
</svg>
`;
  return svg.replace(/SLUG-/g, `${slug}-`);
}
