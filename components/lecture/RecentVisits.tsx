"use client";

import { useEffect, useSyncExternalStore } from "react";
import { parseRecent, pushRecent, RECENT_KEY } from "@/lib/recent";

const RECENT_EVENT = "hyu-hjs-recent-change";
const empty: string[] = [];
let cachedRaw: string | null | undefined;
let cached: string[] = empty;

function read() {
  let raw: string | null = null;
  try { raw = localStorage.getItem(RECENT_KEY); } catch { /* Storage can be blocked; recent visits are optional. */ }
  // useSyncExternalStore needs a stable snapshot while storage is unchanged.
  if (raw !== cachedRaw) { cachedRaw = raw; cached = parseRecent(raw); }
  return cached;
}

function subscribe(listener: () => void) {
  const sync = (event: Event) => { if (!(event instanceof StorageEvent) || event.key === RECENT_KEY || event.key === null) listener(); };
  window.addEventListener("storage", sync);
  window.addEventListener(RECENT_EVENT, sync);
  return () => { window.removeEventListener("storage", sync); window.removeEventListener(RECENT_EVENT, sync); };
}

export const useRecentPaths = () => useSyncExternalStore(subscribe, read, () => empty);

/** Remembers that this document was opened, so the home page can offer to continue from it. */
export function RecentVisitTracker({ path }: { path: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(pushRecent(parseRecent(localStorage.getItem(RECENT_KEY)), path)));
      window.dispatchEvent(new Event(RECENT_EVENT));
    } catch { /* Ignore unavailable storage. */ }
  }, [path]);
  return null;
}
