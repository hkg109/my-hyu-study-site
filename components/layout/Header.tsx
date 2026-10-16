"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Moon, Sun, X, Search, ShieldCheck } from "lucide-react";
import type { AcademicCatalog, LectureMeta, SearchEntry } from "@/types/content";
import { Sidebar } from "./Sidebar";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { useAdmin } from "@/components/admin/AdminContext";

export function Header({ lectures, exams, catalog, searchIndex }: { lectures: LectureMeta[]; exams: LectureMeta[]; catalog: AcademicCatalog; searchIndex: SearchEntry[] }) {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isAdmin, openAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const adminAvailable = process.env.NODE_ENV === "development";
  return <>
    <header className="site-header"><div className="header-inner">
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}><Dialog.Trigger asChild><button className="icon-button mobile-only" aria-label="강의 메뉴 열기"><Menu size={21} /></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-drawer"><div className="drawer-heading"><Dialog.Title>HJS STUDY</Dialog.Title><Dialog.Close asChild><button className="icon-button" aria-label="강의 메뉴 닫기"><X size={20} /></button></Dialog.Close></div><Dialog.Description className="sr-only">과목별 강의와 족보 탐색</Dialog.Description><Sidebar lectures={lectures} exams={exams} catalog={catalog} onNavigate={() => setMenuOpen(false)} /></Dialog.Content></Dialog.Portal></Dialog.Root>
      <Link href="/" className="brand" aria-label="HJS STUDY 홈"><span className="brand-symbol" aria-hidden="true"><svg viewBox="9 16 46 32" width="24" height="17"><g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 21.5V42.5M24 21.5V42.5M13 32H24" /><path d="M33 21.5V36.5C33 40.5 31.7 42.5 29 42.5" /><path d="M51 24.4C49.4 22.5 47.1 21.5 44.4 21.5C40.8 21.5 38.6 23.5 38.6 26.4C38.6 29.4 40.8 30.9 44.9 31.9C49.2 32.9 51.4 34.6 51.4 37.6C51.4 40.8 48.8 42.5 45.1 42.5C41.9 42.5 39.2 41.3 37.5 39.1" /></g></svg></span><span>HJS STUDY</span></Link>
      <nav className="header-nav" aria-label="주 메뉴">{[["/lectures", "강의 정리"], ["/practice", "족보"], ["/review", "복습"]].map(([href, label]) => <Link href={href} key={href} className={path.startsWith(href) ? "selected" : ""} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><Search size={16} /><span>노트 검색</span><kbd>⌘ K</kbd></button><button className="icon-button theme-toggle" aria-label="라이트·다크 테마 전환" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Moon size={18} className="moon-icon" /><Sun size={18} className="sun-icon" /></button>{adminAvailable && <button className={`admin-trigger${isAdmin ? " active" : ""}`} onClick={openAdmin} aria-label="관리자 모드 열기" aria-pressed={isAdmin}><ShieldCheck size={16} /><span>관리자</span></button>}</div>
    </div></header>
    <SearchDialog entries={searchIndex} open={searchOpen} setOpen={setSearchOpen} />
  </>;
}
