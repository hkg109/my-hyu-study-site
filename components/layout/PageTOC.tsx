"use client";

import { useEffect, useRef } from "react";
import type { Heading } from "@/types/content";
import { useActiveHeading, useDocumentHeadings } from "./useDocumentHeadings";

export function PageTOC({ headings, documentPath, format = "mdx" }: { headings: Heading[]; documentPath?: string; format?: "md" | "mdx" }) {
  const liveHeadings = useDocumentHeadings(headings, documentPath, format);
  const active = useActiveHeading(liveHeadings);
  const tocRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const container = tocRef.current;
    const link = container?.querySelector<HTMLElement>(`[data-heading-id="${CSS.escape(active)}"]`);
    if (!container || !link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < container.scrollTop + 42) container.scrollTo({ top: Math.max(0, top - 42) });
    else if (bottom > container.scrollTop + container.clientHeight - 24) container.scrollTo({ top: bottom - container.clientHeight + 24 });
  }, [active]);
  return <aside ref={tocRef} className="page-toc"><nav aria-label="이 페이지의 목차"><p className="nav-label">이 페이지 목차</p>{liveHeadings.map(heading => <a key={heading.id} href={`#${heading.id}`} data-heading-id={heading.id} className={`${heading.level >= 3 ? "nested" : ""} level-${heading.level} ${heading.id === active ? "active" : ""}`} aria-current={heading.id === active ? "location" : undefined}>{heading.text}</a>)}</nav><div className="toc-bottom"><p>조금씩, 확실하게.</p></div></aside>;
}
