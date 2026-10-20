import test from "node:test";
import assert from "node:assert/strict";
import access from "../config/access.json";
import { hasPracticeAccess, isPracticePassword, practiceCookieName, practiceToken, safePracticePath } from "../lib/access";
import { practicePasswordFor } from "../lib/academic-practice";
import { getSearchIndex } from "../lib/search";

const cseMidterm = ["grade-01", "semester-01", "subject-muhy8vqy", "exam-01"];
const cppMidterm = ["grade-01", "semester-muheifg4", "subject-muw81hpv", "exam-03"];
const examPath = (slug: string[]) => `/practice/${slug.join("/")}`;

test("an exam's own password overrides practicePassword from config/access.json", () => {
  assert.equal(practicePasswordFor(cseMidterm), "071009");
  assert.equal(practicePasswordFor(cppMidterm), "071025");
  assert.equal(practicePasswordFor(["grade-01", "semester-muheifg4", "subject-muhz2xir", "exam-08"]), "071025");
  assert.equal(practicePasswordFor(["grade-01", "semester-muheifg4", "subject-muhz2xir", "exam-01"]), access.practicePassword);
  assert.equal(practicePasswordFor(["grade-01", "semester-01", "subject-muhy8vqy", "exam-99"]), undefined);
});

test("practice password check is exact", () => {
  assert.ok(isPracticePassword("071025", "071025"));
  assert.ok(!isPracticePassword("71025", "071025"));
  assert.ok(!isPracticePassword("", "071025"));
});

test("an exam cookie only unlocks that exam with its current password", () => {
  const cpp = examPath(cppMidterm);
  const cse = examPath(cseMidterm);
  assert.ok(hasPracticeAccess(cpp, "071025", practiceToken(cpp, "071025")));
  assert.ok(!hasPracticeAccess(cse, "071025", practiceToken(cpp, "071025")));
  assert.ok(!hasPracticeAccess(cpp, "071026", practiceToken(cpp, "071025")));
  assert.ok(!hasPracticeAccess(cpp, "071025", undefined));
  assert.ok(!hasPracticeAccess(cpp, "071025", "071025"));
  assert.notEqual(practiceCookieName(cpp), practiceCookieName(cse));
});

test("unlock redirects stay inside the practice section", () => {
  assert.equal(safePracticePath("/practice/grade-01/semester-muheifg4/subject-muhz2xir/exam-04"), "/practice/grade-01/semester-muheifg4/subject-muhz2xir/exam-04");
  assert.equal(safePracticePath("https://example.com/practice"), "/practice");
  assert.equal(safePracticePath("//example.com"), "/practice");
  assert.equal(safePracticePath("/lectures"), "/practice");
  assert.equal(safePracticePath(undefined), "/practice");
});

test("search index does not expose locked practice content", () => {
  const practice = getSearchIndex().filter(entry => entry.kind === "practice");
  assert.ok(practice.length > 0);
  assert.ok(practice.every(entry => entry.body === ""));
});

test("passwords are never part of the documents sent to the browser", () => {
  const practice = getSearchIndex().filter(entry => entry.kind === "practice");
  assert.ok(practice.every(entry => !JSON.stringify(entry).includes("071025") && !JSON.stringify(entry).includes("071009")));
});
