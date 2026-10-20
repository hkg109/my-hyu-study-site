import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { setFrontmatterField } from "../lib/frontmatter-edit";
import { getHeadings, parseMarkdown } from "../lib/markdown";
import { nextDocumentSlot } from "../lib/note-files";
import { findTemplate, NOTE_TEMPLATES, templatesFor } from "../lib/note-templates";

const html = (source: string) => JSON.stringify(parseMarkdown(source, "md"));
test("each create dialog offers exactly the requested templates", () => {
  assert.deepEqual(templatesFor("lectures").map(item => item.label), ["빈 노트", "강의 정리", "코딩 과제"]);
  assert.deepEqual(templatesFor("practice").map(item => item.label), ["빈 노트", "객관식 족보", "서술형 족보"]);
  assert.equal(findTemplate("lectures", "exam-essay"), undefined);
  assert.equal(findTemplate("practice", "lecture-summary"), undefined);
  assert.equal(findTemplate("practice", "../blank"), undefined);
  assert.equal(new Set(NOTE_TEMPLATES.map(item => item.id)).size, NOTE_TEMPLATES.length);
});

test("template bodies use the existing quiz, hint and answer syntax", () => {
  const sections = (id: string, kind: "lectures" | "practice") => getHeadings(findTemplate(kind, id)!.body(kind), "md").map(item => item.text);
  assert.deepEqual(sections("lecture-summary", "lectures"), ["학습 목표", "핵심 개념", "예제", "헷갈리는 점", "확인 문제", "요약"]);
  assert.deepEqual(sections("coding-assignment", "lectures"), ["문제 설명", "입력·출력 예시", "접근 방법", "코드", "시간·공간 복잡도", "주의할 점"]);

  const mcq = html(findTemplate("practice", "exam-multiple-choice")!.body("practice"));
  assert.match(mcq, /study-quiz-mcq/);
  assert.match(mcq, /"data-quiz-answer":"B"/);
  assert.match(mcq, /study-quiz-confirm/);
  assert.match(mcq, /"hName":"details"/);
  assert.match(mcq, /출처/);

  const essay = html(findTemplate("practice", "exam-essay")!.body("practice"));
  assert.match(essay, /"data-hint-level":"1"/);
  assert.match(essay, /"data-hint-level":"2"/);
  assert.match(essay, /study-answer/);
  assert.match(essay, /채점 기준/);
  assert.doesNotMatch(essay, /study-quiz-mcq/);

  const lecture = html(findTemplate("lectures", "lecture-summary")!.body("lectures"));
  assert.match(lecture, /study-callout-definition/);
  assert.match(lecture, /study-answer/);
});

test("access settings change only the accessKey line", () => {
  const crlf = "---\r\ntitle: \"제목: 그대로\"\r\norder: 3\r\npublished: true\r\n---\r\n본문 --- 그대로\r\n";
  const withKey = setFrontmatterField(crlf, "accessKey", "cse-midterm");
  assert.equal(withKey, "---\r\ntitle: \"제목: 그대로\"\r\norder: 3\r\npublished: true\r\naccessKey: \"cse-midterm\"\r\n---\r\n본문 --- 그대로\r\n");
  const moved = setFrontmatterField(withKey.replace("order: 3\r\npublished: true\r\naccessKey", "accessKey: \"old\"\r\norder: 3\r\npublished: true\r\nx"), "accessKey", "new-key");
  assert.match(moved, /^---\r\ntitle: "제목: 그대로"\r\naccessKey: "new-key"\r\norder: 3/);
  assert.equal(setFrontmatterField(withKey, "accessKey", undefined), crlf);
  assert.equal(matter(setFrontmatterField("---\ntitle: a\n---\nx", "accessKey", "2025")).data.accessKey, "2025", "numeric-looking keys stay strings");
  assert.throws(() => setFrontmatterField("본문만", "accessKey", "x"));
});

test("new notes get the next free number and order, counting drafts and legacy notes", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "hjs-slot-test-"));
  try {
    assert.deepEqual(nextDocumentSlot("practice", path.join(directory, "missing"), []), { order: 1, id: "exam-01" });
    writeFileSync(path.join(directory, "exam-01.md"), "---\ntitle: a\norder: 1\npublished: true\n---\n");
    writeFileSync(path.join(directory, "exam-02.md"), "---\ntitle: draft\norder: 7\npublished: false\n---\n");
    writeFileSync(path.join(directory, "exam-09.md"), "---\ntitle: odd\norder: 2\npublished: true\n---\n");
    assert.deepEqual(nextDocumentSlot("practice", directory, []), { order: 10, id: "exam-10" });
    assert.deepEqual(nextDocumentSlot("lectures", directory, [1, 2, 3]), { order: 4, id: "lecture-04" });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
