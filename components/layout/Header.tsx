"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, BookOpen, FileArchive, Menu, Moon, RotateCcw, Sun, X, Search, ShieldCheck } from "lucide-react";
import type { AcademicCatalog, NavDocument } from "@/types/content";
import { Sidebar } from "./Sidebar";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { useAdmin } from "@/components/admin/AdminContext";
import { isNavActive, PRIMARY_NAV, type PrimaryNavItem } from "@/lib/navigation";
import { BookmarkButton } from "@/components/lecture/BookmarkButton";

const NAV_ICONS: Record<PrimaryNavItem["icon"], typeof BookOpen> = { lectures: BookOpen, practice: FileArchive, review: RotateCcw };

export function Header({ lectures, exams, catalog }: { lectures: NavDocument[]; exams: NavDocument[]; catalog: AcademicCatalog }) {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { available: adminAvailable, isAdmin, openAdmin, exitAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const current = [...lectures, ...exams].find(document => document.path === path);
  const subject = catalog.grades.flatMap(grade => grade.semesters).flatMap(semester => semester.subjects).find(subject => subject.id === current?.subjectId);
  // Close the drawer whenever the route changes, including back/forward navigation.
  const [drawerPath, setDrawerPath] = useState(path);
  if (drawerPath !== path) { setDrawerPath(path); setMenuOpen(false); }
  return <>
    <header className={`site-header${current ? " reading-header" : ""}`}><div className="header-inner">
      {current && <div className="mobile-reading-title"><Link href={current.path.startsWith("/practice") ? "/practice" : `/lectures/${current.slug.slice(0, 3).join("/")}`} aria-label="과목 목록으로"><ArrowLeft size={19} /></Link><div><span>{subject?.name} · {String(current.order).padStart(2, "0")}</span><strong>{current.title}</strong></div><BookmarkButton path={current.path} title={current.title} compact /></div>}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}><Dialog.Trigger asChild><button className="icon-button mobile-only" aria-label="메뉴 열기"><Menu size={21} /></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-drawer"><div className="drawer-heading"><Dialog.Title>메뉴</Dialog.Title><Dialog.Close asChild><button className="icon-button" aria-label="메뉴 닫기"><X size={20} /></button></Dialog.Close></div><Dialog.Description className="sr-only">주요 메뉴와 과목별 강의·족보 탐색</Dialog.Description>
        <button type="button" className="drawer-search" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><Search size={18} />노트·족보 검색</button>
        {/* The main sections stay pinned above the long subject list, so they are reachable without scrolling. */}
        <nav className="drawer-primary-nav" aria-label="주 메뉴">{PRIMARY_NAV.map(item => {
          const Icon = NAV_ICONS[item.icon];
          const active = isNavActive(path, item);
          return <Link prefetch={false} href={item.href} key={item.href} className={active ? "selected" : ""} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon size={17} aria-hidden="true" /><span>{item.label}</span></Link>;
        })}</nav>
        <div className="drawer-scroll"><Sidebar lectures={lectures} exams={exams} catalog={catalog} onNavigate={() => setMenuOpen(false)} /></div><div className="drawer-footer"><button className="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Moon size={17} />{resolvedTheme === "dark" ? "라이트 모드" : "다크 모드"}</button>{adminAvailable && <button className="button" onClick={() => { setMenuOpen(false); openAdmin(); }}><ShieldCheck size={17} />관리자</button>}</div></Dialog.Content></Dialog.Portal></Dialog.Root>
      <Link prefetch={false} href="/" className="brand" aria-label="HJS STUDY 홈"><span className="brand-symbol" aria-hidden="true"><svg viewBox="9 16 46 32" width="24" height="17"><g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 21.5V42.5M24 21.5V42.5M13 32H24" /><path d="M33 21.5V36.5C33 40.5 31.7 42.5 29 42.5" /><path d="M51 24.4C49.4 22.5 47.1 21.5 44.4 21.5C40.8 21.5 38.6 23.5 38.6 26.4C38.6 29.4 40.8 30.9 44.9 31.9C49.2 32.9 51.4 34.6 51.4 37.6C51.4 40.8 48.8 42.5 45.1 42.5C41.9 42.5 39.2 41.3 37.5 39.1" /></g></svg></span><span>HJS STUDY</span></Link>
      <nav className="header-nav" aria-label="주 메뉴">{PRIMARY_NAV.map(item => <Link prefetch={false} href={item.href} key={item.href} className={isNavActive(path, item) ? "selected" : ""} aria-current={isNavActive(path, item) ? "page" : undefined}>{item.label}</Link>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><Search size={16} /><span>노트 검색</span><kbd>⌘ K</kbd></button><button className="icon-button theme-toggle" aria-label="라이트·다크 테마 전환" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Moon size={18} className="moon-icon" /><Sun size={18} className="sun-icon" /></button>{adminAvailable && <button className={`admin-trigger${isAdmin ? " active" : ""}`} onClick={openAdmin} aria-label="관리자 모드 열기" aria-pressed={isAdmin}><ShieldCheck size={16} /><span>관리자</span></button>}</div>
    </div></header>
    {isAdmin && <div className="admin-mode-bar"><div><ShieldCheck size={15} /><strong>관리자 모드</strong><span>변경은 바로 저장됩니다</span></div><div>{current && <button type="button" onClick={() => window.dispatchEvent(new Event("hjs-create-document"))}>+ 새 노트</button>}<button type="button" className="admin-exit-button" onClick={() => void exitAdmin()}>관리자 모드 끄기</button></div></div>}
    <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
  </>;
}
