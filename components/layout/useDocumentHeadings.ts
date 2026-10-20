"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/types/content";
import { getHeadings } from "@/lib/markdown";
import { NOTE_UPDATE_EVENT } from "@/lib/note-draft";

// Shared by the desktop and mobile tables of contents so both follow live edits and the same scroll position.

/** The page's headings, updated while an admin edits the note. */
export function useDocumentHeadings(headings: Heading[], documentPath?: string, format: "md" | "mdx" = "mdx") {
  const [liveHeadings, setLiveHeadings] = useState(headings);
  useEffect(() => {
    if (!documentPath) return;
    const syncHeadings = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; value: string }>).detail;
      if (detail.path === documentPath) setLiveHeadings(getHeadings(detail.value, format));
    };
    window.addEventListener(NOTE_UPDATE_EVENT, syncHeadings);
    return () => window.removeEventListener(NOTE_UPDATE_EVENT, syncHeadings);
  }, [documentPath, format]);
  return liveHeadings;
}

/** The last heading scrolled past the fixed header. */
export function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState(headings[0]?.id ?? "");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = headings[0]?.id ?? "";
        for (const heading of headings) {
          const element = document.getElementById(heading.id);
          if (element && element.getBoundingClientRect().top <= 150) current = heading.id;
        }
        // At the very bottom the last headings can't scroll up to the line, so the last visible one wins.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          const visible = headings.filter(heading => (document.getElementById(heading.id)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight);
          if (visible.length) current = visible.at(-1)!.id;
        }
        setActive(current);
      });
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, [headings]);
  return active;
}
