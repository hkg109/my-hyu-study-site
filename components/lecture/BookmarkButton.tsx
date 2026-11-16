"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { listStudyRecords, removeStudyRecord, saveStudyRecord } from "@/lib/study-store";

export function BookmarkButton({ path, title, compact = false }: { path: string; title: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const id = `bookmark:${path}`;
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      void listStudyRecords(path).then(records => {
        if (!cancelled) setSaved(records.some(record => record.id === id));
      }).catch(() => undefined);
    };
    refresh();
    window.addEventListener("hjs-bookmark-change", refresh);
    return () => { cancelled = true; window.removeEventListener("hjs-bookmark-change", refresh); };
  }, [path, id]);
  const toggle = async () => {
    setPending(true); setError("");
    try {
      if (saved) await removeStudyRecord(id);
      else {
        const now = new Date().toISOString();
        const block = document.querySelector<HTMLElement>(".study-workspace [data-block-id]");
        await saveStudyRecord({ id, documentPath: path, blockId: block?.dataset.blockId ?? "document-start", type: "bookmark", selectedText: title, createdAt: now, updatedAt: now });
      }
      setSaved(!saved);
      window.dispatchEvent(new Event("hjs-bookmark-change"));
    } catch { setError("북마크를 저장하지 못했습니다."); }
    finally { setPending(false); }
  };
  return <span className="bookmark-control"><button type="button" className={compact ? "icon-button" : "document-bookmark-button"} aria-label={saved ? "북마크 해제" : "북마크"} aria-pressed={saved} disabled={pending} onClick={() => void toggle()}><Bookmark size={17} fill={saved ? "currentColor" : "none"} />{!compact && <span>{saved ? "북마크됨" : "북마크"}</span>}</button>{error && <span className="bookmark-error" role="alert">{error}</span>}</span>;
}
