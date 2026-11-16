"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

const SIDEBAR_KEY = "hyu-hjs-sidebar-collapsed";
const WIDTH_KEY = "hyu-hjs-sidebar-width";
const SIDEBAR_EVENT = "hyu-hjs-sidebar-change";
const MIN_WIDTH = 200, MAX_WIDTH = 480;
const clampWidth = (width: number) => Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width)));
const getCollapsed = () => {
  try { return localStorage.getItem(SIDEBAR_KEY) === "true"; } catch { return false; }
};
// 0 means "never resized": the stylesheet's width for the screen size applies.
const getWidth = () => {
  try { const width = Number(localStorage.getItem(WIDTH_KEY)); return width ? clampWidth(width) : 0; } catch { return 0; }
};
const save = (key: string, value: string | undefined) => {
  try { if (value === undefined) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* Ignore unavailable storage. */ }
  window.dispatchEvent(new Event(SIDEBAR_EVENT));
};
const subscribe = (listener: () => void) => {
  const sync = (event: Event) => { if (!(event instanceof StorageEvent) || event.key === SIDEBAR_KEY || event.key === WIDTH_KEY || event.key === null) listener(); };
  window.addEventListener("storage", sync);
  window.addEventListener(SIDEBAR_EVENT, sync);
  return () => { window.removeEventListener("storage", sync); window.removeEventListener(SIDEBAR_EVENT, sync); };
};

export function AppShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribe, getCollapsed, () => false);
  const savedWidth = useSyncExternalStore(subscribe, getWidth, () => 0);
  const [dragWidth, setDragWidth] = useState<number>();
  const shell = useRef<HTMLDivElement>(null);
  const aside = useRef<HTMLElement>(null);
  const width = dragWidth ?? savedWidth;

  const toggle = () => save(SIDEBAR_KEY, String(!collapsed));
  const widthAt = (clientX: number) => clampWidth(clientX - shell.current!.getBoundingClientRect().left);
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragWidth(widthAt(event.clientX));
  };
  const drag = (event: React.PointerEvent<HTMLDivElement>) => { if (dragWidth !== undefined) setDragWidth(widthAt(event.clientX)); };
  const endDrag = () => {
    if (dragWidth === undefined) return;
    save(WIDTH_KEY, String(dragWidth));
    setDragWidth(undefined);
  };
  const nudge = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowLeft" ? -16 : event.key === "ArrowRight" ? 16 : 0;
    if (!step) return;
    event.preventDefault();
    save(WIDTH_KEY, String(clampWidth((width || aside.current?.offsetWidth || 248) + step)));
  };

  // A chosen width overrides the per-screen-size widths in globals.css; collapsing still wins.
  const custom = width && !collapsed;
  return <div ref={shell} className={`app-shell${collapsed ? " sidebar-collapsed" : ""}${dragWidth !== undefined ? " sidebar-resizing" : ""}`} style={custom ? { gridTemplateColumns: `${width}px minmax(0,1fr)` } : undefined}>
    <aside ref={aside} className="desktop-sidebar">{sidebar}</aside>
    {/* The rail spans the page height so the sticky button stays below the header while scrolling. */}
    <div className="sidebar-toggle-rail" style={custom ? { left: width - 30 } : undefined}>
      <button type="button" className="sidebar-toggle" onClick={toggle} aria-label={collapsed ? "왼쪽 학습 메뉴 펼치기" : "왼쪽 학습 메뉴 접기"} aria-expanded={!collapsed}>
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>
      {!collapsed && <div className="sidebar-resizer" role="separator" aria-orientation="vertical" aria-label="학습 메뉴 너비 조절 (더블클릭하면 원래대로)" aria-valuemin={MIN_WIDTH} aria-valuemax={MAX_WIDTH} aria-valuenow={width || undefined} tabIndex={0}
        onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={nudge} onDoubleClick={() => save(WIDTH_KEY, undefined)} />}
    </div>
    <main id="main-content" tabIndex={-1}>{children}</main>
  </div>;
}
