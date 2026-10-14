"use client";

import { FileDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type PrintTheme = "light" | "dark";

interface PrintState {
  title: string;
  detailStates: boolean[];
}

export function PrintLectureButton({ title, kind = "lecture" }: { title: string; kind?: "lecture" | "practice" }) {
  const { resolvedTheme } = useTheme();
  const printState = useRef<PrintState | null>(null);
  const choseTheme = useRef(false);
  const [theme, setTheme] = useState<PrintTheme>("light");

  useEffect(() => {
    if (!choseTheme.current && resolvedTheme) setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  const preparePrint = useCallback(() => {
    if (printState.current) return;
    const details = [...document.querySelectorAll<HTMLDetailsElement>("details.answer, details.study-answer, details.study-translation, details.study-hint, details.study-flashcard")];
    printState.current = { title: document.title, detailStates: details.map(detail => detail.open) };

    for (const detail of details) detail.open = true;
    document.documentElement.classList.add("printing-document", `print-theme-${theme}`);
    document.title = `${title.replace(/[\\/:*?"<>|]/g, "-")} - HJS STUDY`;
  }, [theme, title]);

  const restorePage = useCallback(() => {
    const state = printState.current;
    if (!state) return;
    const details = [...document.querySelectorAll<HTMLDetailsElement>("details.answer, details.study-answer, details.study-translation, details.study-hint, details.study-flashcard")];
    details.forEach((detail, index) => { detail.open = state.detailStates[index] ?? false; });
    document.title = state.title;
    document.documentElement.classList.remove("printing-document", "print-theme-light", "print-theme-dark");
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
    <button type="button" className="document-print-button" onClick={print} aria-label={`선택한 테마로 ${kind === "practice" ? "족보" : "강의 노트"}를 PDF로 저장`}>
      <FileDown size={15} />
      PDF로 저장
    </button>
  </div>;
}
