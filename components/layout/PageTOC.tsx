"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/types/content";
import { outlineHeadings, useActiveHeading, useDocumentHeadings } from "./useDocumentHeadings";

export function PageTOC({ headings, documentPath, format = "mdx" }: { headings: Heading[]; documentPath?: string; format?: "md" | "mdx" }) {
  const liveHeadings = useDocumentHeadings(headings, documentPath, format);
  const tocRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"sections" | "questions">("sections");
  const [questions, setQuestions] = useState<Heading[]>([]);
  const active = useActiveHeading(tab === "questions" ? questions : liveHeadings);
  const [readPercent, setReadPercent] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const blocks = [...document.querySelectorAll<HTMLElement>(".study-workspace .study-quiz, .study-workspace [data-study-callout='check']")];
      setQuestions(blocks.map((block, index) => {
        block.id ||= block.dataset.quizId ?? block.dataset.blockId ?? `document-question-${index + 1}`;
        const text = block.querySelector("p")?.textContent?.trim() ?? "";
        return { id: block.id, text: `문제 ${index + 1} · ${text.slice(0, 42)}`, level: 2 };
      }));
    });
    return () => cancelAnimationFrame(frame);
  }, [liveHeadings]);
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReadPercent(height > 0 ? Math.round(window.scrollY / height * 100) : 0);
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const outline = outlineHeadings(liveHeadings);
  const activeIndex = outline.findIndex(heading => heading.id === active);
  const currentSection = outline.slice(0, activeIndex + 1).findLast(heading => heading.level === 2)?.id;
  let section = "";
  const visibleHeadings = tab === "questions" ? questions : outline.filter(heading => {
    if (heading.level === 2) section = heading.id;
    return heading.level === 2 || section === currentSection;
  });
  useEffect(() => {
    const container = tocRef.current;
    const link = container?.querySelector<HTMLElement>(`[data-heading-id="${CSS.escape(active)}"]`);
    if (!container || !link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < container.scrollTop + 42) container.scrollTo({ top: Math.max(0, top - 42) });
    else if (bottom > container.scrollTop + container.clientHeight - 24) container.scrollTo({ top: bottom - container.clientHeight + 24 });
  }, [active]);
  return <aside ref={tocRef} className="page-toc"><div className="toc-heading"><strong>이 페이지</strong><span>{readPercent}% 읽음</span></div><div className="toc-tabs" role="tablist" aria-label="목차 보기"><button role="tab" aria-selected={tab === "sections"} onClick={() => setTab("sections")}>섹션</button><button role="tab" aria-selected={tab === "questions"} onClick={() => setTab("questions")}>문제 {questions.length}</button></div><nav aria-label="이 페이지의 목차">{visibleHeadings.map(heading => <a key={heading.id} href={`#${heading.id}`} data-heading-id={heading.id} className={`${heading.level >= 3 ? "nested" : ""} level-${heading.level} ${heading.id === active ? "active" : ""}`} aria-current={heading.id === active ? "location" : undefined}>{heading.text}</a>)}{visibleHeadings.length === 0 && <p className="toc-empty">이 문서에는 문제 제목이 없습니다.</p>}</nav><div className="toc-bottom"><a href="#document-start">↑ 맨 위로</a></div></aside>;
}
