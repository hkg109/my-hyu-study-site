import test from "node:test";
import assert from "node:assert/strict";
import { getDocument, readCollection } from "../lib/content";
import { getAllExams, getAllLectures, getPrevNextLecture, getSubjects } from "../lib/lectures";
import { findSubject, hasContent, subjectPathOf } from "../lib/subjects";
import { parseRecent, pushRecent, RECENT_LIMIT } from "../lib/recent";
import { getHeadings, markdownText } from "../lib/markdown";
import { getSearchIndex } from "../lib/search";
import { parseProgress } from "../lib/progress";
import Fuse from "fuse.js";

test("published manifest hides drafts from routes, navigation and search", () => {
  const lectures = getAllLectures();
  const subjectOrders = new Map<string, number[]>();
  for (const lecture of lectures) {
    const subject = [lecture.gradeId, lecture.semesterId, lecture.subjectId].join("/");
    subjectOrders.set(subject, [...(subjectOrders.get(subject) ?? []), lecture.order]);
  }
  for (const orders of subjectOrders.values()) assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
  assert.ok(lectures.every(doc => doc.order >= 0));
  assert.ok(lectures.every(doc => doc.published));
  assert.equal(getDocument("lectures", ["week-02", "02-loop"]), undefined);
  assert.equal(getDocument("lectures", ["..", "..", "package"]), undefined);
  assert.ok(getSearchIndex().every(entry => !entry.path.endsWith("02-loop")));
});

test("MIS practice exams have complete questions and solutions with translations where provided", () => {
  const exams = readCollection("practice").filter(doc => doc.subjectId === "subject-muhz2xir");
  // Exams 1–3 are 26-item mock exams; exam 8 is the 35-item 2025 recollection. Chapter sets 4–7 were removed.
  // Orders 9–12 are test bank transcripts (Ch.1 17e, Ch.2 18e, Ch.3 17e GE, Ch.4 17e), also with Korean reveals.
  // Order 13 is the 34-question 2026 recollection, with English questions and no translation blocks.
  const expected = new Map([[1, 26], [2, 26], [3, 26], [8, 35], [9, 100], [10, 75], [11, 100], [12, 100], [13, 34]]);
  assert.deepEqual(exams.map(exam => exam.order).sort((a, b) => a - b), [...expected.keys()]);
  for (const exam of exams) {
    const count = expected.get(exam.order);
    const translations = exam.order === 13 ? 0 : count;
    assert.equal((exam.content.match(/^> \[!QUIZ\]$/gm) ?? []).length, count, exam.path);
    assert.equal((exam.content.match(/^> \[!TRANSLATION\]$/gm) ?? []).length, translations, exam.path);
    assert.equal((exam.content.match(/^> \[!ANSWER\]$/gm) ?? []).length, count, exam.path);
    assert.equal((exam.content.match(/^> \[!ANSWER-TRANSLATION\]$/gm) ?? []).length, translations, exam.path);
  }
});

test("previous/next navigation crosses subject boundaries and handles endpoints", context => {
  const lectures = getAllLectures();
  if (lectures.length < 2) { context.skip("At least two published weeks needed"); return; }
  assert.equal(getPrevNextLecture(lectures[0].slug).prev, undefined);
  assert.equal(getPrevNextLecture(lectures.at(-1)!.slug).next, undefined);
  const transition = lectures.findIndex((doc, index) => index > 0 && `${doc.gradeId}/${doc.semesterId}/${doc.subjectId}` !== `${lectures[index - 1].gradeId}/${lectures[index - 1].semesterId}/${lectures[index - 1].subjectId}`);
  assert.ok(transition > 0);
  assert.equal(getPrevNextLecture(lectures[transition - 1].slug).next?.path, lectures[transition].path);
});

test("TOC ignores code fences, handles Korean and disambiguates repeated headings", () => {
  const source = '# 제목\n\n## 조건문\n\n```cpp\n## not a heading\n```\n\n### `if` 사용\n\n## 조건문';
  assert.deepEqual(getHeadings(source).map(h => h.id), ["제목", "조건문", "if-사용", "조건문-1"]);
  assert.equal(getHeadings(source)[2].level, 4);
  assert.equal(markdownText("<Callout>실제 본문</Callout>"), "실제 본문");
});

test("search can find body-only Korean terms and code syntax", () => {
  const index = getSearchIndex();
  const search = new Fuse(index, { keys: ["title", "description", "tags", "body"], ignoreLocation: true, threshold: .3 });
  for (const entry of index) assert.ok(search.search(entry.title).some(result => result.item.path === entry.path));
  const body = markdownText("# 제목\n\n본문에만 있는 한글키워드와 {value}\n\n```cpp\nstd::cin >> value;\n```", "md");
  const bodySearch = new Fuse([{ body }], { keys: ["body"], ignoreLocation: true });
  assert.ok(bodySearch.search("한글키워드").length > 0);
  assert.ok(bodySearch.search("std::cin").length > 0);
});

test("malformed or stale progress does not break the application", () => {
  assert.deepEqual(parseProgress(null), {});
  assert.deepEqual(parseProgress("not json"), {});
  assert.deepEqual(parseProgress("[]"), {});
  // Keys from the retired week-based notes are dropped.
  assert.deepEqual(parseProgress('{"week-04":true}'), {});
  assert.deepEqual(parseProgress('{"grade-01/semester-01/subject-a/lecture-01":true,"grade-01/semester-01/subject-a/lecture-02":"yes","__proto__":true}'), { "grade-01/semester-01/subject-a/lecture-01": true });
});

test("every published lecture and exam belongs to exactly one subject page, and empty subjects are only kept for the admin", () => {
  const subjects = getSubjects();
  const lectures = getAllLectures();
  const exams = getAllExams();
  assert.equal(subjects.reduce((sum, subject) => sum + subject.lectures.length, 0), lectures.length);
  assert.equal(subjects.reduce((sum, subject) => sum + subject.exams.length, 0), exams.length);
  for (const document of [...lectures, ...exams]) {
    const home = subjectPathOf(document);
    assert.ok(home, document.path);
    const subject = findSubject(subjects, home.split("/").slice(2));
    assert.ok(subject && hasContent(subject), document.path);
  }
  assert.equal(findSubject(subjects, ["..", "..", "package"]), undefined);
  assert.equal(findSubject(subjects, lectures[0].slug), undefined);
});

test("recent visits keep the newest unique document paths only", () => {
  assert.deepEqual(parseRecent(null), []);
  assert.deepEqual(parseRecent("{}"), []);
  assert.deepEqual(parseRecent('["/lectures/a/b/c/lecture-01","/lectures/a/b/c/lecture-01","/assignments/week-01","javascript:alert(1)",3]'), ["/lectures/a/b/c/lecture-01"]);
  const first = pushRecent([], "/lectures/a/b/c/lecture-01");
  const second = pushRecent(first, "/practice/a/b/c/exam-01");
  assert.deepEqual(pushRecent(second, "/lectures/a/b/c/lecture-01"), ["/lectures/a/b/c/lecture-01", "/practice/a/b/c/exam-01"]);
  assert.deepEqual(pushRecent(second, "/review"), second);
  let many: string[] = [];
  for (let index = 0; index < RECENT_LIMIT + 3; index += 1) many = pushRecent(many, `/lectures/a/b/c/lecture-${index}`);
  assert.equal(many.length, RECENT_LIMIT);
});
