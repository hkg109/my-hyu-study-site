import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getHeadings } from "../lib/markdown";
import { isNavActive, PRIMARY_NAV } from "../lib/navigation";
import { outlineHeadings } from "../components/layout/useDocumentHeadings";

test("part and slide titles form three levels without changing real heading ids", () => {
  const headings = [
    { id: "intro", text: "단원 도입", level: 2 },
    { id: "part", text: "PART 1 · 프로세스", level: 2 },
    { id: "slide", text: "Slide 3 — 사례", level: 2 },
    { id: "detail", text: "Problem", level: 3 },
    { id: "end", text: "단원 마무리", level: 2 },
  ];
  assert.deepEqual(outlineHeadings(headings).map(heading => [heading.id, heading.level]), [["intro", 2], ["part", 2], ["slide", 3], ["detail", 4], ["end", 2]]);
  assert.deepEqual(outlineHeadings(headings.slice(0, 1)), headings.slice(0, 1));
});

test("TOC headings skip folded answers but keep ids in step with the page", () => {
  const source = "## 문제 1\n\n> [!QUIZ]\n> 질문\n\n> [!ANSWER]\n> ### 정답은 42\n> 해설\n\n> [!HINT 1]\n> ### 힌트 제목\n\n## 문제 2\n\n## 정답은 42\n";
  const headings = getHeadings(source, "md");
  assert.deepEqual(headings.map(item => item.text), ["문제 1", "문제 2", "정답은 42"]);
  // The hidden "정답은 42" took the first slug, so the visible one is "-1" exactly as rendered.
  assert.equal(headings.at(-1)?.id, "정답은-42-1");
  const mdx = getHeadings("## 보이는 제목\n\n<Answer>\n\n### 정답 코드\n\n</Answer>\n\n<details>\n\n### 숨긴 제목\n\n</details>\n", "mdx");
  assert.deepEqual(mdx.map(item => item.text), ["보이는 제목"]);
});

test("desktop and mobile menus share one definition", () => {
  assert.deepEqual(PRIMARY_NAV.map(item => item.label), ["강의 정리", "족보", "복습"]);
  const practice = PRIMARY_NAV.find(item => item.href === "/practice")!;
  assert.ok(isNavActive("/practice/grade-01/x", practice));
  assert.ok(isNavActive("/unlock", practice));
  assert.ok(!isNavActive("/practices", practice));
  const header = readFileSync("components/layout/Header.tsx", "utf8");
  assert.equal((header.match(/PRIMARY_NAV\.map/g) ?? []).length, 2);
});

test("the mobile TOC is hidden in PDFs", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.match(css, /@media print \{ \.mobile-toc,\.mobile-toc-sheet,\.document-access-button \{ display:none!important; \} \}/);
});
