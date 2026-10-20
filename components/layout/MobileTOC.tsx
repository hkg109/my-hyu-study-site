"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ListTree, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/types/content";
import { useActiveHeading, useDocumentHeadings } from "./useDocumentHeadings";

// Below 1280px the desktop TOC column is hidden, so a floating button opens the same headings in a sheet.
// It stays on screen while reading; choosing a heading closes the sheet and moves focus to that heading.
export function MobileTOC({ headings, documentPath, format = "mdx" }: { headings: Heading[]; documentPath?: string; format?: "md" | "mdx" }) {
  const liveHeadings = useDocumentHeadings(headings, documentPath, format);
  const active = useActiveHeading(liveHeadings);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<string | null>(null);
  const activeHeading = liveHeadings.find(heading => heading.id === active);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => listRef.current?.querySelector<HTMLElement>('[aria-current="location"]')?.scrollIntoView({ block: "center" }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (liveHeadings.length === 0) return null;

  const choose = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    targetRef.current = id;
    setOpen(false);
  };

  // Runs after the sheet has closed, instead of returning focus to the trigger button.
  const moveToTarget = (event: Event) => {
    const id = targetRef.current;
    targetRef.current = null;
    const element = id ? document.getElementById(id) : null;
    if (!element) return;
    event.preventDefault();
    if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, "", `#${id}`);
    // Wait until the sheet's scroll lock is released, then land just below the sticky header
    // (scroll-padding and scroll-margin would otherwise stack to ~200px).
    setTimeout(() => {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - headerBottom - 20, behavior: smooth ? "smooth" : "auto" });
    }, 0);
  };

  return <div className="mobile-toc">
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="mobile-toc-trigger" aria-label={activeHeading ? `목차 열기, 현재 위치: ${activeHeading.text}` : "목차 열기"}>
          <ListTree size={16} aria-hidden="true" /><span className="mobile-toc-label">목차</span>{activeHeading && <span className="mobile-toc-current" aria-hidden="true">{activeHeading.text}</span>}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="mobile-toc-sheet" aria-describedby={undefined} onCloseAutoFocus={moveToTarget}>
          <div className="mobile-toc-heading"><Dialog.Title>이 페이지 목차</Dialog.Title><Dialog.Close asChild><button type="button" className="icon-button" aria-label="목차 닫기"><X size={20} /></button></Dialog.Close></div>
          <div ref={listRef} className="mobile-toc-list">
            <nav aria-label="이 페이지의 목차">{liveHeadings.map(heading => <a key={heading.id} href={`#${heading.id}`} onClick={event => choose(event, heading.id)} className={`level-${heading.level}${heading.id === active ? " active" : ""}`} aria-current={heading.id === active ? "location" : undefined}>{heading.text}</a>)}</nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
