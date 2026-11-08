"use client";

import { FileDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildExamPaper, subjectTitle, type ExamPaperMode } from "@/lib/exam-paper";

type PrintTheme = "light" | "dark";
const RUNNING_HEADER_ID = "print-running-header";
const EXAM_PAPER_CLASS = "print-exam-paper";

interface PrintState {
  title: string;
  detailStates: boolean[];
  paper?: Element;
}

interface Props {
  title: string;
  kind?: "lecture" | "practice";
  /** Catalog subject name, used for the exam paper's "<과목> 영역" title. */
  subjectName?: string;
  /** This exam's position among the subject's exams, printed as "제 N 교시". */
  period?: number;
}

const answerDetails = () => [...document.querySelectorAll<HTMLDetailsElement>("details.answer, details.study-answer, details.study-translation, details.study-hint, details.study-flashcard")];

export function PrintLectureButton({ title, kind = "lecture", subjectName, period }: Props) {
  const { resolvedTheme } = useTheme();
  const printState = useRef<PrintState | null>(null);
  const choseTheme = useRef(false);
  const [theme, setTheme] = useState<PrintTheme>("light");
  const [mode, setMode] = useState<ExamPaperMode>("both");

  useEffect(() => {
    if (!choseTheme.current && resolvedTheme) setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  const preparePrint = useCallback(() => {
    if (printState.current) return;
    const details = answerDetails();
    const root = document.documentElement;
    printState.current = { title: document.title, detailStates: details.map(detail => detail.open) };
    for (const detail of details) detail.open = true;
    const header = document.createElement("style");
    header.id = RUNNING_HEADER_ID;

    // Exams print as a test paper and an answer booklet; lectures print as the page itself.
    const article = document.querySelector(".printable-document");
    const prose = article?.querySelector(".study-workspace .prose");
    const paper = kind === "practice" && prose ? buildExamPaper(prose, { mode, title, subjectName, period }) : undefined;
    if (article && paper) {
      article.append(paper);
      printState.current.paper = paper;
      root.classList.add("printing-document", "print-theme-light", EXAM_PAPER_CLASS);
      const { main } = subjectTitle(subjectName);
      // The first page already shows the subject in its masthead.
      header.textContent = `@page exam-paper { @top-center { content: ${JSON.stringify(`${main} 영역`)}; } } @page exam-paper:first { @top-center { content: none; } }`;
    } else {
      root.classList.add("printing-document", `print-theme-${theme}`);
      // Print the document title in the top margin of every page.
      header.textContent = `@page study-document { @top-left { content: ${JSON.stringify(title)}; } }`;
    }
    document.head.appendChild(header);
    document.title = `${title.replace(/[\\/:*?"<>|]/g, "-")}${paper ? mode === "answers" ? " 정답과 해설" : mode === "questions" ? " 문제지" : "" : ""} - HJS STUDY`;
  }, [kind, mode, period, subjectName, theme, title]);

  const restorePage = useCallback(() => {
    const state = printState.current;
    if (!state) return;
    answerDetails().forEach((detail, index) => { detail.open = state.detailStates[index] ?? false; });
    state.paper?.remove();
    document.title = state.title;
    document.documentElement.classList.remove("printing-document", "print-theme-light", "print-theme-dark", EXAM_PAPER_CLASS);
    document.getElementById(RUNNING_HEADER_ID)?.remove();
    printState.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("beforeprint", preparePrint);
    window.addEventListener("afterprint", restorePage);
    return () => {
      window.removeEventListener("beforeprint", preparePrint);
      window.removeEventListener("afterprint", restorePage);
      restorePage();
    };
  }, [preparePrint, restorePage]);

  const print = () => {
    preparePrint();
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  return <div className="document-print-controls">
    {kind === "practice" ? <>
      <label className="sr-only" htmlFor="practice-print-mode">PDF에 넣을 내용</label>
      <select id="practice-print-mode" className="document-print-theme" value={mode} onChange={event => setMode(event.target.value as ExamPaperMode)} aria-label="시험지 PDF에 넣을 내용 선택">
        <option value="both">시험지+정답·해설</option>
        <option value="questions">시험지만</option>
        <option value="answers">정답·해설만</option>
      </select>
    </> : <>
      <label className="sr-only" htmlFor={`${kind}-print-theme`}>PDF 테마</label>
      <select
        id={`${kind}-print-theme`}
        className="document-print-theme"
        value={theme}
        onChange={event => {
          choseTheme.current = true;
          setTheme(event.target.value as PrintTheme);
        }}
        aria-label="PDF 테마 선택"
      >
        <option value="light">기본 PDF</option>
        <option value="dark">다크 PDF</option>
      </select>
    </>}
    <button type="button" className="document-print-button" onClick={print} aria-label={kind === "practice" ? "족보를 시험지 양식 PDF로 저장" : "선택한 테마로 강의 노트를 PDF로 저장"}>
      <FileDown size={15} />
      PDF로 저장
    </button>
  </div>;
}
