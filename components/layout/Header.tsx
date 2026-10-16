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
      <Link href="/" className="brand" aria-label="HJS STUDY 홈"><span className="brand-symbol" aria-hidden="true"><svg viewBox="6 10 52 46" width="24" height="21"><rect x="9" y="47" width="46" height="5" rx="1" fill="#fde047" /><g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15v26M21 15v26M11 28h10" /><path d="M34 15v19.5c0 4.5-2.5 6.5-5.5 6.5" /><path d="M53 18.5c-1.5-2.3-3.7-3.5-6.3-3.5-3.6 0-6.2 2.3-6.2 5.6 0 7.9 12.5 5.6 12.5 13.4 0 4-2.9 7-6.8 7-2.9 0-5.1-1.3-6.4-3.6" /></g></svg></span><span>HJS STUDY</span></Link>
      <nav className="header-nav" aria-label="주 메뉴">{[["/lectures", "강의 정리"], ["/practice", "족보"], ["/review", "복습"]].map(([href, label]) => <Link href={href} key={href} className={path.startsWith(href) ? "selected" : ""} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><Search size={16} /><span>노트 검색</span><kbd>⌘ K</kbd></button><button className="icon-button theme-toggle" aria-label="라이트·다크 테마 전환" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Moon size={18} className="moon-icon" /><Sun size={18} className="sun-icon" /></button>{adminAvailable && <button className={`admin-trigger${isAdmin ? " active" : ""}`} onClick={openAdmin} aria-label="관리자 모드 열기" aria-pressed={isAdmin}><ShieldCheck size={16} /><span>관리자</span></button>}</div>
    </div></header>
    <SearchDialog entries={searchIndex} open={searchOpen} setOpen={setSearchOpen} />
  </>;
}
