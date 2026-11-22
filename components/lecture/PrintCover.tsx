import type { ContentDocument, LectureMeta } from "@/types/content";

// The first page of a lecture PDF. Hidden on screen; globals.css prints it full-bleed on its own page.

const two = (value: number) => String(value).padStart(2, "0");

/** Title size in mm so the subject name stays on one line across the cover's 172mm column. */
export function coverTitleSize(text: string) {
  // Rough glyph widths at weight 800: Hangul and other wide characters ≈ 0.95em, Latin and digits ≈ 0.62em, spaces ≈ 0.3em.
  const units = [...text].reduce((sum, char) => sum + (char === " " ? 0.3 : char.charCodeAt(0) < 0x2e80 ? 0.62 : 0.95), 0);
  return Math.max(11, Math.min(31, 172 / Math.max(units, 1)));
}

/** Rows of 0/1 for the cover art, the same for every render so the page doesn't change between builds. */
function bitRows(rows: number, length: number) {
  let seed = 7;
  const next = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: rows }, () => Array.from({ length }, () => (next() > 0.5 ? "1" : "0")).join(" "));
}

export function PrintCover({ document, lectures }: { document: ContentDocument; lectures: LectureMeta[] }) {
  const index = Math.max(0, lectures.findIndex(item => item.path === document.path));
  // Up to 9 rows of the subject's lecture list, kept around this lecture.
  const start = Math.max(0, Math.min(index - 4, lectures.length - 9));
  const shown = lectures.slice(start, start + 9);
  const subject = document.subjectName ?? document.title;
  return <section className="print-cover" aria-hidden="true">
    <div className="print-cover-spine" />
    <svg className="print-cover-art" viewBox="0 0 820 820" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="print-cover-disc"><circle cx="430" cy="410" r="330" /></clipPath></defs>
      <circle className="print-cover-disc" cx="430" cy="410" r="330" />
      <g className="print-cover-bits" clipPath="url(#print-cover-disc)">
        {bitRows(26, 24).map((row, i) => <text key={i} x="90" y={90 + i * 26}>{row}</text>)}
      </g>
      <path className="print-cover-wave" clipPath="url(#print-cover-disc)" d="M100 640 C 260 470, 420 700, 560 520 S 800 360, 820 300" />
      <circle className="print-cover-ring" cx="430" cy="410" r="250" />
    </svg>
    <div className="print-cover-top">
      <span className="print-cover-brand"><b>HJS</b>HJS STUDY</span>
      <span className="print-cover-term">{[document.gradeName, document.semesterName].filter(Boolean).join(" · ")}</span>
    </div>
    <div className="print-cover-series">LECTURE NOTE SERIES</div>
    <p className="print-cover-title" style={{ fontSize: `${coverTitleSize(subject).toFixed(1)}mm` }}>{subject}</p>
    <p className="print-cover-subtitle">{two(document.order)} · {document.title}</p>
    <div className="print-cover-chips"><span className="fill">강의 노트</span>{document.tags?.filter(tag => tag !== subject).slice(0, 2).map(tag => <span key={tag}>#{tag}</span>)}</div>
    <ol className="print-cover-toc">
      {shown.map(item => <li key={item.path} className={item.path === document.path ? "current" : undefined}><i>{two(item.order)}</i>{item.title}</li>)}
    </ol>
    <div className="print-cover-foot">
      <div><strong>강의 {two(document.order)} / {two(lectures.length)}</strong>26학번 한지석 제공</div>
      <div className="print-cover-vol">{two(document.order)}<small>VOL.</small></div>
    </div>
  </section>;
}
