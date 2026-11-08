import test from "node:test";
import assert from "node:assert/strict";
import { isKeyAnswer, parseQuestionHeading, subjectTitle } from "../lib/exam-paper";

test("exam paper finds question numbers and points in the heading styles the exams use", () => {
  assert.deepEqual(parseQuestionHeading("1. DIKW 피라미드"), { number: "1", topic: "DIKW 피라미드", points: undefined });
  assert.deepEqual(parseQuestionHeading("01 · 1 point"), { number: "1", topic: "", points: "1" });
  assert.deepEqual(parseQuestionHeading("001"), { number: "1", topic: "", points: undefined });
  assert.deepEqual(parseQuestionHeading("문제 11 · XOR in DES `4점`"), { number: "11", topic: "XOR in DES", points: "4" });
  assert.deepEqual(parseQuestionHeading("Question 2 · References"), { number: "2", topic: "References", points: undefined });
  // Section headings, years and sub-questions are not questions.
  for (const heading of ["Part 1 · 데이터 분석의 이해 (1–10)", "I. Multiple choice · 24 points", "2025 Midterm", "1-1) Time Complexity", "3장 · 조직", "Exam instructions"]) {
    assert.equal(parseQuestionHeading(heading), undefined, heading);
  }
});

test("exam paper titles split the subject name and the answer key skips labels", () => {
  assert.deepEqual(subjectTitle("정시개 · 경영정보시스템"), { main: "정시개", sub: "경영정보시스템" });
  assert.deepEqual(subjectTitle("C++"), { main: "C++", sub: "" });
  for (const answer of ["T", "7", "O(2ⁿ)", "적합하지 않다."]) assert.ok(isKeyAnswer(answer), answer);
  for (const label of ["", "(1)", "1)", "가.", "모범 답안", "정답:", "해설", "이 답은 열여덟 글자를 훌쩍 넘는 긴 설명입니다"]) assert.ok(!isKeyAnswer(label), label);
});
