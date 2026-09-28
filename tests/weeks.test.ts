import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { loadWeekTitles, readWeeks } from "../lib/weeks";
import { getHeadings, markdownText, parseMarkdown } from "../lib/markdown";
import { visit } from "unist-util-visit";
import { syncWeeks, watchWeeks, loadWeekFiles } from "../scripts/sync-weeks.mjs";

const readFixture = (root: string) => readWeeks(loadWeekFiles(path.join(root, "weeks")));

test("week manifest reflects additions, edits and deletions and sorts numerically", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-weeks-test-"));
  try {
    const directory = path.join(root, "weeks");
    const output = path.join(root, "generated.json");
    fs.mkdirSync(directory);
    assert.deepEqual(readFixture(root), []);
    fs.writeFileSync(path.join(directory, "week-10.md"), "# 열 번째\n\n첫 내용");
    fs.writeFileSync(path.join(directory, "week-10-02.md"), "# 열 번째의 두 번째\n\n둘째 내용");
    fs.writeFileSync(path.join(directory, "week-2.md"), "제목 없는 내용");
    syncWeeks(directory, output);
    assert.equal(syncWeeks(directory, output), false);
    assert.deepEqual(readFixture(root).map(doc => [doc.week, doc.order]), [[2, 1], [10, 1], [10, 2]]);
    assert.equal(readFixture(root)[0].title, "Lecture 02");
    assert.equal(readFixture(root)[2].path, "/lectures/week-10-02");
    assert.equal(readFixture(root)[2].title, "Lecture 10-02");
    assert.equal(readWeeks([{ name: "week-3-2.md", source: "# 두 번째 강의" }], { "week-03-02": "별도 두 번째 제목" })[0].title, "별도 두 번째 제목");
    assert.equal(readWeeks([{ name: "week-3.md", source: "# 본문 제목" }], { "week-03": "별도 강의 제목" })[0].title, "별도 강의 제목");
    fs.writeFileSync(path.join(directory, "week-10.md"), "# 변경된 제목\n\n수정한 본문");
    assert.equal(syncWeeks(directory, output), true);
    assert.match(fs.readFileSync(output, "utf8"), /수정한 본문/);
    fs.unlinkSync(path.join(directory, "week-2.md"));
    syncWeeks(directory, output);
    assert.equal(JSON.parse(fs.readFileSync(output, "utf8")).length, 2);
    fs.writeFileSync(path.join(directory, "week-0.md"), "# 시작 전 안내");
    assert.deepEqual(readFixture(root).map(doc => [doc.week, doc.order]), [[0, 1], [10, 1], [10, 2]]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("plain Markdown keeps every body heading and ignores fenced headings", () => {
  const source = '# 강의 제목\n\n## 소개\n\n# 함수\n\n## 함수 호출\n\n```cpp\n# 가짜 제목\n```\n\n# 재귀\n\n## 기저 조건';
  assert.deepEqual(getHeadings(source, "md").map(h => [h.text, h.level]), [["강의 제목", 2], ["소개", 3], ["함수", 2], ["함수 호출", 3], ["재귀", 2], ["기저 조건", 3]]);
});

test("study syntax creates stable block ids, callouts and colored highlights", () => {
  const source = "## 핵심 개념\n\n일반 문단과 ==중요 내용==, ==red:주의 내용==입니다.\n\n> [!DEFINITION]\n> 확산은 입자가 퍼지는 현상입니다.\n\n- 첫 항목\n- 둘째 항목";
  const first = parseMarkdown(source, "md");
  const second = parseMarkdown(source, "md");
  const blockIds = (tree: ReturnType<typeof parseMarkdown>) => {
    const ids: string[] = [];
    visit(tree, node => {
      const id = node.data?.hProperties?.["data-block-id"];
      if (typeof id === "string") ids.push(id);
    });
    return ids;
  };
  assert.deepEqual(blockIds(first), blockIds(second));
  assert.equal(new Set(blockIds(first)).size, blockIds(first).length);

  let calloutFound = false;
  const colors: string[] = [];
  visit(first, node => {
    if (node.data?.hProperties?.["data-study-callout"] === "definition") calloutFound = true;
    const color = node.data?.hProperties?.["data-highlight-color"];
    if (typeof color === "string") colors.push(color);
  });
  assert.equal(calloutFound, true);
  assert.deepEqual(colors, ["yellow", "red"]);
  assert.equal(markdownText(source, "md"), "핵심 개념 일반 문단과 중요 내용 , 주의 내용 입니다. 확산은 입자가 퍼지는 현상입니다. 첫 항목 둘째 항목");
});

test("study syntax creates revealable blanks and reviewable flashcards", () => {
  const source = "액체가 기체로 변하는 현상은 {{기화}}이다.\n\n> [!FLASHCARD]\n> Q: 응고란 무엇인가?\n> A: 액체가 고체로 변하는 상태 변화이다.";
  const tree = parseMarkdown(source, "md");
  let blankAnswer = "";
  let cardId = "";
  const results: string[] = [];

  visit(tree, node => {
    const properties = node.data?.hProperties;
    if (properties?.["data-blank-answer"]) blankAnswer = String(properties["data-blank-answer"]);
    if (properties?.["data-card-id"] && properties.className?.includes("study-flashcard")) cardId = String(properties["data-card-id"]);
    if (properties?.["data-card-result"]) results.push(String(properties["data-card-result"]));
  });

  assert.equal(blankAnswer, "기화");
  assert.match(cardId, /^card-/);
  assert.deepEqual(results, ["wrong", "unsure", "correct"]);
});

test("lecture Markdown with an Answer toggle is rendered as trusted MDX", () => {
  const source = "## 문제\n\n<Answer>\n\n~~~cpp\nint main() {}\n~~~\n\n</Answer>";
  const [lecture] = readWeeks([{ name: "week-0-2.md", source }]);
  assert.equal(lecture.format, "mdx");
  assert.equal(lecture.path, "/lectures/week-00-02");
});

test("week titles are read fresh from disk on every request", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-titles-test-"));
  const file = path.join(root, "titles.json");
  try {
    fs.writeFileSync(file, JSON.stringify({ "week-01": "처음 제목" }));
    assert.equal(loadWeekTitles(file)["week-01"], "처음 제목");
    fs.writeFileSync(file, JSON.stringify({ "week-01": "바뀐 제목" }));
    assert.equal(loadWeekTitles(file)["week-01"], "바뀐 제목");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("development watcher automatically rebuilds the manifest after saving a file", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-watch-test-"));
  const directory = path.join(root, "weeks");
  const output = path.join(root, "manifest.json");
  let stop = () => {};
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error("File change was not detected")), 5000);
      stop = watchWeeks(resolve, reject, directory, output);
      fs.writeFileSync(path.join(directory, "week-4.md"), "# 새 주차\n\n자동 업데이트");
    });
    assert.match(fs.readFileSync(output, "utf8"), /자동 업데이트/);
  } finally { clearTimeout(timeout); stop(); fs.rmSync(root, { recursive: true, force: true }); }
});
