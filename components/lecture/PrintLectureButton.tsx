"use client";

import { FileDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type PrintTheme = "light" | "dark";
type PrintMode = "full" | "questions";
const RUNNING_HEADER_ID = "print-running-header";

interface PrintState {
  title: string;
  detailStates: boolean[];
}

export function PrintLectureButton({ title, kind = "lecture" }: { title: string; kind?: "lecture" | "practice" }) {
  const { resolvedTheme } = useTheme();
  const printState = useRef<PrintState | null>(null);
  const choseTheme = useRef(false);
  const [theme, setTheme] = useState<PrintTheme>("light");
  const [mode, setMode] = useState<PrintMode>("full");

  useEffect(() => {
    if (!choseTheme.current && resolvedTheme) setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  const preparePrint = useCallback(() => {
    if (printState.current) return;
    const details = [...document.querySelectorAll<HTMLDetailsElement>("details.answer, details.study-answer, details.study-translation, details.study-hint, details.study-flashcard")];
    printState.current = { title: document.title, detailStates: details.map(detail => detail.open) };

    for (const detail of details) detail.open = true;
    document.documentElement.classList.add("printing-document", `print-theme-${theme}`);
    if (mode === "questions") document.documentElement.classList.add("print-mode-questions");
    // Print the document title in the top margin of every page.
    const header = document.createElement("style");
    header.id = RUNNING_HEADER_ID;
    header.textContent = `@page study-document { @top-left { content: ${JSON.stringify(title)}; } }`;
    document.head.appendChild(header);
    document.title = `${title.replace(/[\\/:*?"<>|]/g, "-")} - HJS STUDY`;
  }, [mode, theme, title]);

  const restorePage = useCallback(() => {
    const state = printState.current;
    if (!state) return;
    const details = [...document.querySelectorAll<HTMLDetailsElement>("details.answer, details.study-answer, details.study-translation, details.study-hint, details.study-flashcard")];
    details.forEach((detail, index) => { detail.open = state.detailStates[index] ?? false; });
    document.title = state.title;
    document.documentElement.classList.remove("printing-document", "print-theme-light", "print-theme-dark", "print-mode-questions");
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
    {kind === "practice" && <>
      <label className="sr-only" htmlFor="practice-print-mode">PDF에 넣을 내용</label>
      <select id="practice-print-mode" className="document-print-theme" value={mode} onChange={event => setMode(event.target.value as PrintMode)} aria-label="PDF에 넣을 내용 선택">
        <option value="full">문제+해설</option>
        <option value="questions">문제만</option>
      </select>
    </>}
    <button type="button" className="document-print-button" onClick={print} aria-label={`선택한 테마로 ${kind === "practice" ? "족보" : "강의 노트"}를 PDF로 저장`}>
      <FileDown size={15} />
      PDF로 저장
    </button>
  </div>;
}
