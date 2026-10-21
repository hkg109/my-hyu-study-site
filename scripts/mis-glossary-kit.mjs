// Layout helpers for the mobile-width MIS glossary diagrams (lecture-00).
// Every figure is 560 units wide so it stays legible on a phone, and every text run is
// measured against its box: a label that would overflow throws instead of rendering clipped.
export const W = 560;
export const X0 = 24;
export const CW = W - X0 * 2;

const font = "'Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
const C = { paper: "#f7f6f2", surface: "#f0eee8", deep: "#e4e1d8", ink: "#1d1d1a", muted: "#65645e", subtle: "#929087", border: "#b9b6ac" };
export const SIZE = { title: 23, subtitle: 14.5, name: 17.5, body: 15, small: 13.5, label: 13.5 };
const LINE = { name: 23, body: 20.5, small: 18, subtitle: 20 };

export const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Conservative advance widths (em) for Malgun Gothic / Noto Sans KR, the fallbacks when Pretendard is absent.
function charWidth(ch) {
  const code = ch.codePointAt(0);
  if ((code >= 0xac00 && code <= 0xd7a3) || (code >= 0x3130 && code <= 0x318f) || (code >= 0x4e00 && code <= 0x9fff)) return 1;
  if (code >= 0x2190 && code <= 0x21ff) return 1;
  if (ch === " ") return 0.3;
  if (ch === "·") return 0.45;
  if (/[A-Z]/.test(ch)) return 0.7;
  if (/[a-z0-9]/.test(ch)) return 0.58;
  if (/[.,:;'"()\-/&+%?!]/.test(ch)) return 0.4;
  return 1;
}
export const textWidth = (text, size, bold = false) => [...String(text)].reduce((sum, ch) => sum + charWidth(ch), 0) * size * (bold ? 1.07 : 1);

// Splits a token that is wider than a line: after "·" first, then between Hangul syllables.
function pieces(word, max, size, bold) {
  if (textWidth(word, size, bold) <= max) return [word];
  const parts = word.split(/(?<=·)/);
  if (parts.length > 1) return parts.flatMap(part => pieces(part, max, size, bold));
  if (/^[가-힣]+[.,]?$/.test(word)) return [...word];
  throw new Error(`Word too wide for ${max}px at ${size}px: "${word}"`);
}

export function wrap(text, max, size, bold = false) {
  // Each token remembers whether a space precedes it, so split pieces rejoin without spaces.
  const tokens = String(text).split(" ").flatMap(word => pieces(word, max, size, bold).map((piece, i) => ({ piece, space: i === 0 })));
  const lines = [];
  let current = "";
  for (const { piece, space } of tokens) {
    const next = current ? `${current}${space ? " " : ""}${piece}` : piece;
    if (textWidth(next, size, bold) <= max) { current = next; continue; }
    lines.push(current);
    current = piece;
  }
  if (current) lines.push(current);
  return lines;
}

const t = (x, y, text, cls, anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}>${esc(text)}</text>`;

// ---- nodes ---------------------------------------------------------------------------------
const PAD_X = 13;
const PAD_Y = 13;

function nodeLines(spec, w) {
  const inner = w - PAD_X * 2;
  const tag = spec.tag ? wrap(spec.tag, inner, SIZE.small, true) : [];
  const title = spec.title ? wrap(spec.title, inner, SIZE.name, true) : [];
  const body = (spec.body ?? []).flatMap(item => wrap(item, inner, SIZE.body));
  return { tag, title, body };
}

export function nodeHeight(spec, w) {
  const { tag, title, body } = nodeLines(spec, w);
  const headed = tag.length + title.length > 0;
  return PAD_Y * 2 + tag.length * LINE.small + title.length * LINE.name + (body.length ? (headed ? 6 : 0) + body.length * LINE.body : 0) - 4;
}

export function node(spec, x, y, w, h) {
  const height = h ?? nodeHeight(spec, w);
  const need = nodeHeight(spec, w);
  if (need > height + 0.5) throw new Error(`Node "${spec.title}" needs ${need}px but has ${height}px`);
  const style = spec.style ?? "node";
  const inverse = style === "focal";
  const { tag, title, body } = nodeLines(spec, w);
  const left = spec.align === "left";
  const tx = left ? x + PAD_X : x + w / 2;
  const anchor = left ? "start" : "middle";
  let cy = y + (height - need) / 2 + PAD_Y + 13;
  const out = [`<rect class="${style}" x="${x}" y="${y}" width="${w}" height="${height}" rx="6"/>`];
  for (const line of tag) { out.push(t(tx, cy, line, inverse ? "small inv" : "small", anchor)); cy += LINE.small; }
  if (tag.length) cy += 1;
  for (const line of title) { out.push(t(tx, cy + 2, line, inverse ? "name inv" : "name", anchor)); cy += LINE.name; }
  if (body.length && tag.length + title.length) cy += 6;
  for (const line of body) { out.push(t(tx, cy, line, inverse ? "body inv" : "body", anchor)); cy += LINE.body; }
  return out.join("");
}

// ---- arrows and labels -----------------------------------------------------------------------
export function label(x, y, text) {
  const w = textWidth(text, SIZE.label, true) + 14;
  return `<rect class="mask" x="${(x - w / 2).toFixed(1)}" y="${y - 11}" width="${w.toFixed(1)}" height="22" rx="4"/>${t(x, y + 5, text, "lab")}`;
}

// A polyline arrow through points; `at` picks the segment (index) whose midpoint carries the label.
export function arrow(points, { text, dashed = false, both = false, at = 0, ends = true } = {}) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const cls = `${dashed ? "dash" : "flow"}${ends ? "" : " plain"}${both ? " both" : ""}`;
  let out = `<path class="${cls}" d="${d}"/>`;
  if (text) {
    const [a, b] = [points[at], points[at + 1]];
    out += label((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, text);
  }
  return out;
}

// ---- document -------------------------------------------------------------------------------
export function header({ eyebrow, title, subtitle }) {
  const titleLines = wrap(title, CW, SIZE.title, true);
  const subLines = wrap(subtitle, CW, SIZE.subtitle);
  let y = 40;
  const out = [t(X0, y, eyebrow, "tag", "start")];
  y += 34;
  for (const line of titleLines) { out.push(t(X0, y, line, "title", "start")); y += 30; }
  y += 0;
  for (const line of subLines) { out.push(t(X0, y, line, "subtitle", "start")); y += LINE.subtitle; }
  y += 6;
  out.push(`<line class="rule" x1="${X0}" y1="${y}" x2="${W - X0}" y2="${y}"/>`);
  return { svg: out.join(""), y: y + 22 };
}

export function legend(items, y) {
  // items: "flow" | "dash" | "focal" | "outside" | "zone"
  const samples = {
    flow: ["흐름·데이터 제공", x => `<path class="flow" d="M${x} ${y} H${x + 30}"/>`, 30],
    dash: ["영향·제약", x => `<path class="dash" d="M${x} ${y} H${x + 30}"/>`, 30],
    both: ["상호 영향", x => `<path class="flow both" d="M${x + 2} ${y} H${x + 30}"/>`, 30],
    focal: ["중심 개념", x => `<rect class="focal" x="${x}" y="${y - 8}" width="22" height="16" rx="3"/>`, 22],
    outside: ["조직 밖 주체", x => `<rect class="outside" x="${x}" y="${y - 8}" width="22" height="16" rx="3"/>`, 22],
    zone: ["범위·묶음", x => `<rect class="zone" x="${x}" y="${y - 8}" width="22" height="16" rx="3"/>`, 22],
  };
  let x = X0;
  const startY = y;
  const out = [];
  for (const key of items) {
    const [text, sample, sw] = samples[key];
    const width = sw + 8 + textWidth(text, SIZE.small, true);
    if (x + width > W - X0) { x = X0; y += 26; }
    // The sample closures read the current `y`, so wrapped items land on the new line.
    out.push(sample(x), t(x + sw + 8, y + 5, text, "small", "start"));
    x += width + 18;
  }
  return { svg: out.join(""), height: y - startY + 26 };
}

export function note(text, y, { align = "start" } = {}) {
  const lines = wrap(text, CW, SIZE.small, true);
  const x = align === "start" ? X0 : W / 2;
  return { svg: lines.map((line, i) => t(x, y + i * LINE.small, line, "small", align)).join(""), y: y + lines.length * LINE.small };
}

export function zone(x, y, w, h, caption, { style = "zone", center = false } = {}) {
  const out = [`<rect class="${style}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`];
  if (caption) {
    if (textWidth(caption, SIZE.small, true) > w - 24) throw new Error(`Zone caption too wide: ${caption}`);
    out.push(center ? t(x + w / 2, y + 20, caption, "small") : t(x + 12, y + 20, caption, "small", "start"));
  }
  return out.join("");
}

export function svgDocument(slug, meta, height, body) {
  const marker = (id, fill) => `<marker id="${slug}-${id}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="${fill}"/></marker>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Math.ceil(height)}" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">${esc(meta.title)}</title>
  <desc id="${slug}-desc">${esc(meta.desc)}</desc>
  <defs>${marker("a", C.ink)}${marker("m", C.muted)}</defs>
  <style>.bg{fill:${C.paper}}.rule{stroke:${C.border};stroke-width:1;fill:none}.node{fill:${C.paper};stroke:${C.border};stroke-width:1.5}.zone{fill:${C.surface};stroke:${C.border};stroke-width:1.5}.deep{fill:${C.deep};stroke:${C.border};stroke-width:1.5}.focal{fill:${C.ink};stroke:${C.ink};stroke-width:1.5}.outside{fill:${C.paper};stroke:${C.muted};stroke-width:1.5;stroke-dasharray:6 4}.flow{stroke:${C.ink};stroke-width:2;fill:none;marker-end:url(#${slug}-a)}.flow.both{marker-start:url(#${slug}-a)}.dash{stroke:${C.muted};stroke-width:1.8;fill:none;stroke-dasharray:7 5;marker-end:url(#${slug}-m)}.dash.both{marker-start:url(#${slug}-m)}.plain{marker-end:none}.line{stroke:${C.ink};stroke-width:2;fill:none}.mask{fill:${C.paper};stroke:${C.border};stroke-width:1}.tag{font:600 ${SIZE.small}px ${font};fill:${C.muted};letter-spacing:.02em}.title{font:700 ${SIZE.title}px ${font};fill:${C.ink}}.subtitle{font:400 ${SIZE.subtitle}px ${font};fill:${C.muted}}.name{font:700 ${SIZE.name}px ${font};fill:${C.ink}}.body{font:400 ${SIZE.body}px ${font};fill:${C.ink}}.small{font:600 ${SIZE.small}px ${font};fill:${C.muted}}.lab{font:700 ${SIZE.label}px ${font};fill:${C.ink}}.inv{fill:${C.paper}}</style>
  <rect class="bg" width="${W}" height="${Math.ceil(height)}"/>
  ${body}
</svg>
`;
}

// ---- row layout ------------------------------------------------------------------------------
// rows: [{ nodes: [spec...], widths?: [fractions], gap?: number, edge?: { type, text, texts, dashed } }]
// edge links a row to the next one: "flow" (1→1 or n→n), "bus" (1→n), "merge" (n→1), "none".
export function rows(list, startY) {
  const out = [];
  let y = startY;
  const placed = [];
  for (const row of list) {
    const n = row.nodes.length;
    const gap = row.gap ?? (row.link ? 64 : 14);
    const fractions = row.widths ?? Array(n).fill(1 / n);
    const usable = (row.span ?? CW) - gap * (n - 1);
    let x = X0 + (row.indent ?? 0);
    const boxes = row.nodes.map((spec, i) => {
      const w = Math.round(usable * fractions[i]);
      const box = { spec, x, w };
      x += w + gap;
      return box;
    });
    const h = row.height ?? Math.max(...boxes.map(b => nodeHeight(b.spec, b.w)));
    for (const b of boxes) { b.y = y; b.h = h; out.push(node(b.spec, b.x, y, b.w, h)); }
    // `link` draws left-to-right arrows between neighbours in the same row.
    if (row.link) {
      for (let j = 0; j < n - 1; j++) {
        const a = boxes[j], b = boxes[j + 1];
        const texts = Array.isArray(row.link.text) ? row.link.text : Array(n - 1).fill(row.link.text);
        out.push(arrow([[a.x + a.w, y + h / 2], [b.x, y + h / 2]], { text: texts[j], dashed: row.link.dashed, both: row.link.both }));
      }
    }
    placed.push({ row, boxes, y, h });
    y += h + (row.edge && row.edge.type !== "none" ? (row.edge.text || row.edge.texts ? 58 : 40) : (row.after ?? 18));
  }
  // Edges are drawn after layout so they can read the next row's position.
  for (let i = 0; i < placed.length - 1; i++) {
    const { row, boxes, y, h } = placed[i];
    const next = placed[i + 1];
    const edge = row.edge;
    if (!edge || edge.type === "none") continue;
    const top = y + h;
    const bottom = next.y;
    const mid = (top + bottom) / 2;
    const cx = b => b.x + b.w / 2;
    const ends = (a, b) => (edge.reverse ? [b, a] : [a, b]);
    if (edge.type === "drop") {
      // Each box in this row connects straight down (or up with reverse) into the wide box below.
      boxes.forEach((b, j) => out.push(arrow(ends([cx(b), top], [cx(b), bottom]), { text: edge.texts?.[j], dashed: edge.dashed, both: edge.both })));
    } else if (edge.type === "rise") {
      // A wide box above fans into each box of the next row at that box's x.
      next.boxes.forEach((b, j) => out.push(arrow(ends([cx(b), top], [cx(b), bottom]), { text: edge.texts?.[j], dashed: edge.dashed, both: edge.both })));
    } else if (edge.type === "flow") {
      if (boxes.length === next.boxes.length) {
        boxes.forEach((b, j) => out.push(arrow(ends([cx(b), top], [cx(next.boxes[j]), bottom]), { text: edge.texts ? edge.texts[j] : j === 0 && boxes.length === 1 ? edge.text : undefined, dashed: edge.dashed, both: edge.both })));
        if (edge.text && boxes.length > 1) out.push(label(W / 2, mid, edge.text));
      } else {
        out.push(arrow([[W / 2, top], [W / 2, bottom]], { text: edge.text, dashed: edge.dashed }));
      }
    } else if (edge.type === "bus") {
      const busY = top + (bottom - top) * 0.55;
      const from = cx(boxes[0]);
      const xs = next.boxes.map(cx);
      out.push(`<path class="line" d="M${from} ${top} V${busY}"/>`);
      out.push(`<path class="line" d="M${Math.min(...xs, from)} ${busY} H${Math.max(...xs, from)}"/>`);
      for (const x of xs) out.push(arrow([[x, busY], [x, bottom]], { dashed: edge.dashed }));
      if (edge.text) out.push(label(from, top + (busY - top) / 2, edge.text));
    } else if (edge.type === "merge") {
      const busY = top + (bottom - top) * 0.45;
      const to = cx(next.boxes[0]);
      const xs = boxes.map(cx);
      for (const x of xs) out.push(`<path class="line" d="M${x} ${top} V${busY}"/>`);
      out.push(`<path class="line" d="M${Math.min(...xs, to)} ${busY} H${Math.max(...xs, to)}"/>`);
      out.push(arrow([[to, busY], [to, bottom]], { dashed: edge.dashed }));
      if (edge.text) out.push(label(to, busY + (bottom - busY) / 2, edge.text));
    }
  }
  return { svg: out.join(""), y: y, placed };
}
