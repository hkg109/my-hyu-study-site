import test from "node:test";
import assert from "node:assert/strict";
import access from "../config/access.json";
import { hasPracticeAccess, isPracticePassword, practiceToken, safePracticePath } from "../lib/access";
import { getSearchIndex } from "../lib/search";

test("practice password comes from config/access.json", () => {
  assert.ok(isPracticePassword(access.practicePassword));
  assert.ok(!isPracticePassword(`${access.practicePassword}0`));
  assert.ok(!isPracticePassword(""));
});

test("practice cookie must match the current password token", () => {
  assert.ok(hasPracticeAccess(practiceToken()));
  assert.ok(!hasPracticeAccess(undefined));
  assert.ok(!hasPracticeAccess(access.practicePassword));
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
