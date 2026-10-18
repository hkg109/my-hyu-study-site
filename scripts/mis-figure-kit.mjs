// Shared drawing helpers for the redrawn MIS textbook figures (site palette, Korean labels).
export const sans = "'Pretendard','Noto Sans KR','Malgun Gothic',sans-serif";
export const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function frame(slug, { chapter, figure, title, subtitle, height }, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 ${height}" role="img" aria-labelledby="${slug}-title ${slug}-desc">
  <title id="${slug}-title">Figure ${figure} ${esc(title)}</title>
  <desc id="${slug}-desc">${esc(subtitle)}</desc>
  <defs><marker id="${slug}-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="#1d1d1a"/></marker></defs>
  <style>.bg{fill:#f7f6f2}.rule{stroke:#b9b6ac;stroke-width:1;fill:none}.line{stroke:#1d1d1a;stroke-width:1.6;fill:none}.soft{stroke:#929087;stroke-width:1.4;fill:none}.dash{stroke:#929087;stroke-width:1.4;fill:none;stroke-dasharray:6 6}.flow{stroke:#1d1d1a;stroke-width:2;fill:none;marker-end:url(#${slug}-arrow)}.both{stroke:#1d1d1a;stroke-width:2;fill:none;marker-start:url(#${slug}-arrow);marker-end:url(#${slug}-arrow)}.dashboth{stroke:#65645e;stroke-width:1.6;fill:none;stroke-dasharray:5 5;marker-start:url(#${slug}-arrow);marker-end:url(#${slug}-arrow)}.node{fill:#f7f6f2;stroke:#b9b6ac;stroke-width:1.5}.zone{fill:#f0eee8;stroke:#b9b6ac;stroke-width:1.5}.deep{fill:#e4e1d8;stroke:#b9b6ac;stroke-width:1.5}.focal{fill:#1d1d1a;stroke:#1d1d1a;stroke-width:1.5}.dot{fill:#65645e}.tag{font:600 13px ${sans};fill:#65645e}.title{font:700 28px ${sans};fill:#1d1d1a}.subtitle,.sub{font:400 14px ${sans};fill:#65645e}.name{font:700 17px ${sans};fill:#1d1d1a}.label{font:500 15px ${sans};fill:#1d1d1a}.small{font:600 12px ${sans};fill:#65645e}.inverse{fill:#f7f6f2}</style>
  <rect class="bg" width="1280" height="${height}"/><text class="tag" x="64" y="52">${chapter}장 · Figure ${figure}</text><text class="title" x="64" y="92">${esc(title)}</text><text class="subtitle" x="64" y="122">${esc(subtitle)}</text><line class="rule" x1="64" y1="148" x2="1216" y2="148"/>
  ${body}
</svg>
`;
}

export const t = (x, y, text, cls = "label", anchor = "start") => `<text class="${cls}" x="${x}" y="${y}"${anchor === "start" ? "" : ` text-anchor="${anchor}"`}>${esc(text)}</text>`;
export const lines = (x, y, items, cls = "label", gap = 22, anchor = "start") => items.map((item, i) => t(x, y + i * gap, item, cls, anchor)).join("");
export const box = (x, y, w, h, cls = "node", rx = 6) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
export const circle = (cx, cy, r, cls = "node") => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
export const ellipse = (cx, cy, rx, ry, cls = "zone") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
export const p = (d, cls = "line") => `<path class="${cls}" d="${d}"/>`;
export const chevron = (x, y, w, h, tip, cls) => `<path class="${cls}" d="M${x} ${y} H ${x + w} L ${x + w + tip} ${y + h / 2} L ${x + w} ${y + h} H ${x} L ${x + tip} ${y + h / 2} Z"/>`;

// A pie-like sector of a circle or ellipse between two angles (degrees, 0 = right, clockwise).
export function sector(cx, cy, rx, ry, from, to, cls = "zone") {
  const point = deg => [cx + rx * Math.cos((deg * Math.PI) / 180), cy + ry * Math.sin((deg * Math.PI) / 180)].map(v => v.toFixed(1));
  const [x1, y1] = point(from), [x2, y2] = point(to);
  return `<path class="${cls}" d="M${cx} ${cy} L ${x1} ${y1} A ${rx} ${ry} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2} Z"/>`;
}
