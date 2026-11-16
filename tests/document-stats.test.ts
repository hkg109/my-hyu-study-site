import test from "node:test";
import assert from "node:assert/strict";
import { questionCount } from "../lib/document-stats";

test("exam count uses the most common numbered heading level and ignores folded answer headings", () => {
  const source = "## 1. 객관식\n\n### 문제 1\n\n> [!QUIZ]\n> 질문\n\n> [!ANSWER]\n> ### 문제 99\n> 해설\n\n### 문제 2\n\n> [!QUIZ]\n> 질문\n\n> [!ANSWER]\n> 답";
  assert.equal(questionCount(source), 2);
});

test("unnumbered quizzes still contribute to the displayed exam count", () => {
  assert.equal(questionCount("> [!QUIZ]\n> 질문\n\n> [!ANSWER]\n> 답\n\n> [!QUIZ]\n> 다른 질문\n\n> [!ANSWER]\n> 다른 답"), 2);
  assert.equal(questionCount("## 응시 안내\n\n연습 자료"), 0);
});
