"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, FileArchive, Pencil, Plus, Trash2 } from "lucide-react";
import type { AcademicCatalog, LectureMeta } from "@/types/content";
import { useProgress } from "@/components/lecture/ProgressProvider";
import { useAdmin } from "@/components/admin/AdminContext";
import { useEffect, useState } from "react";
import { forgetNoteDraft, NOTE_TITLE_EVENT } from "@/lib/note-draft";

type Level = "grade" | "semester" | "subject";

export function Sidebar({ lectures, exams, catalog, onNavigate }: { lectures: LectureMeta[]; exams: LectureMeta[]; catalog: AcademicCatalog; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { progress } = useProgress();
  const { isAdmin } = useAdmin();
  const practiceMode = pathname.startsWith("/practice");
  const documents = practiceMode ? exams : lectures;
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const syncTitle = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; title: string }>).detail;
      const lecture = documents.find(item => item.path === detail.path);
      if (lecture) setEditedTitles(current => ({ ...current, [detail.path]: detail.title || lecture.title }));
    };
    window.addEventListener(NOTE_TITLE_EVENT, syncTitle);
    return () => window.removeEventListener(NOTE_TITLE_EVENT, syncTitle);
  }, [documents]);

  const catalogAction = async (action: "add" | "rename", level: Level, currentName?: string, ids: { gradeId?: string; semesterId?: string; subjectId?: string } = {}) => {
    const labels = { grade: "학년", semester: "학기", subject: "과목" };
    const name = window.prompt(`${labels[level]} 이름을 입력하세요.`, currentName ?? "");
    if (!name?.trim()) return;
    setPending(true);
    try {
      const response = await fetch("/api/admin/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, level, name, ...ids }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { window.alert(result.error ?? "분류를 저장하지 못했습니다."); return; }
      router.refresh();
    } finally { setPending(false); }
  };

  const addDocument = async (gradeId: string, semesterId: string, subjectId: string) => {
    const title = window.prompt(practiceMode ? "새 족보 제목을 입력하세요." : "새 강의 노트 제목을 입력하세요.", practiceMode ? "새 족보" : "새 강의 노트");
    if (!title?.trim()) return;
    setPending(true);
    try {
      const response = await fetch(practiceMode ? "/api/admin/practice" : "/api/admin/lectures", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gradeId, semesterId, subjectId, title }) });
      const result = await response.json().catch(() => ({})) as { error?: string; path?: string };
      if (!response.ok || !result.path) { window.alert(result.error ?? "노트를 만들지 못했습니다."); return; }
      router.refresh(); router.push(result.path); onNavigate?.();
    } finally { setPending(false); }
  };

  const deleteCategory = async (level: Level, label: string, ids: { gradeId?: string; semesterId?: string; subjectId?: string }) => {
    if (!window.confirm(`'${label}' 카테고리를 삭제할까요?\n하위 분류나 노트가 있으면 삭제되지 않습니다.`)) return;
    setPending(true);
    try {
      const response = await fetch("/api/admin/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", level, ...ids }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { window.alert(result.error ?? "카테고리를 삭제하지 못했습니다."); return; }
      router.refresh();
    } finally { setPending(false); }
  };

  const deleteDocument = async (document: LectureMeta) => {
    const documentType = practiceMode ? "족보" : "강의 노트";
    if (!window.confirm(`'${editedTitles[document.path] ?? document.title}' ${documentType}를 삭제할까요?\n삭제한 파일은 복구할 수 없습니다.`)) return;
    setPending(true);
    try {
      const response = await fetch(`/api/admin/notes/${document.slug.map(encodeURIComponent).join("/")}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: practiceMode ? "practice" : "lectures" }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) { window.alert(result.error ?? `${documentType}를 삭제하지 못했습니다.`); return; }
      forgetNoteDraft(document.path);
      setEditedTitles(current => {
        const next = { ...current };
        delete next[document.path];
        return next;
      });
      if (pathname === document.path) router.push(practiceMode ? "/practice" : "/");
      router.refresh();
    } finally { setPending(false); }
  };

  const editButton = (label: string, onClick: () => void) => isAdmin && <button type="button" className="catalog-icon-button" disabled={pending} aria-label={`${label} 이름 수정`} onClick={event => { event.preventDefault(); event.stopPropagation(); onClick(); }}><Pencil size={12} /></button>;
  const addButton = (label: string, onClick: () => void) => isAdmin && <button type="button" className="catalog-icon-button" disabled={pending} aria-label={`${label} 추가`} onClick={event => { event.preventDefault(); event.stopPropagation(); onClick(); }}><Plus size={13} /></button>;
  const deleteButton = (label: string, onClick: () => void) => isAdmin && <button type="button" className="catalog-icon-button catalog-delete-button" disabled={pending} aria-label={`${label} 삭제`} onClick={event => { event.preventDefault(); event.stopPropagation(); onClick(); }}><Trash2 size={12} /></button>;

  return <nav className="sidebar-content" aria-label="강의 탐색">
    <div className="sidebar-admin-heading"><span className="nav-label">{practiceMode ? "PAST EXAMS" : "COURSE NOTES"}</span>{addButton("학년", () => catalogAction("add", "grade"))}</div>
    {[...catalog.grades].sort((a, b) => a.order - b.order).map(grade => <details open className="catalog-grade" key={grade.id}>
      <summary><span>{grade.name}</span><span className="catalog-actions">{editButton(grade.name, () => catalogAction("rename", "grade", grade.name, { gradeId: grade.id }))}{deleteButton(grade.name, () => deleteCategory("grade", grade.name, { gradeId: grade.id }))}{addButton("학기", () => catalogAction("add", "semester", undefined, { gradeId: grade.id }))}<ChevronDown size={14} /></span></summary>
      {[...grade.semesters].sort((a, b) => a.order - b.order).map(semester => <details open className="catalog-semester" key={semester.id}>
        <summary><span>{semester.name}</span><span className="catalog-actions">{editButton(semester.name, () => catalogAction("rename", "semester", semester.name, { gradeId: grade.id, semesterId: semester.id }))}{deleteButton(semester.name, () => deleteCategory("semester", semester.name, { gradeId: grade.id, semesterId: semester.id }))}{addButton("과목", () => catalogAction("add", "subject", undefined, { gradeId: grade.id, semesterId: semester.id }))}<ChevronDown size={13} /></span></summary>
        {[...semester.subjects].sort((a, b) => a.order - b.order).map(subject => {
          const subjectDocuments = documents.filter(document => document.gradeId === grade.id && document.semesterId === semester.id && document.subjectId === subject.id);
          return <details open className="catalog-subject" key={subject.id}><summary><span>{subject.name}</span><span className="catalog-actions">{editButton(subject.name, () => catalogAction("rename", "subject", subject.name, { gradeId: grade.id, semesterId: semester.id, subjectId: subject.id }))}{deleteButton(subject.name, () => deleteCategory("subject", subject.name, { gradeId: grade.id, semesterId: semester.id, subjectId: subject.id }))}{addButton(practiceMode ? "족보" : "노트", () => addDocument(grade.id, semester.id, subject.id))}<ChevronDown size={12} /></span></summary>
            <div>{subjectDocuments.map(document => <div className="side-document-row" key={document.path}><Link href={document.path} onClick={onNavigate} className={`side-link ${pathname === document.path ? "active" : ""}`} aria-current={pathname === document.path ? "page" : undefined}><span className="side-order">{String(document.order).padStart(2, "0")}</span><span>{editedTitles[document.path] ?? document.title}</span>{!practiceMode && progress[document.slug.join("/")] && <Check size={14} aria-label="학습 완료" className="trailing" />}</Link>{isAdmin && <button type="button" className="catalog-icon-button catalog-delete-button side-document-delete" disabled={pending} aria-label={`${editedTitles[document.path] ?? document.title} 삭제`} onClick={() => deleteDocument(document)}><Trash2 size={12} /></button>}</div>)}</div>
          </details>;
        })}
      </details>)}
    </details>)}
    <div className="sidebar-section resources"><span className="nav-label">ARCHIVE</span><Link href="/practice" onClick={onNavigate} className={`side-link ${pathname.startsWith("/practice") ? "active" : ""}`}><FileArchive size={16} />족보</Link></div>
    <div className="sidebar-note"><span className="small-logo">HJS STUDY NOTE</span><p>학년·학기·과목별로<br />차곡차곡 기록합니다.</p><span>STUDY NOTES</span></div>
  </nav>;
}
