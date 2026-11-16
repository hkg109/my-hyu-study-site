"use client";

import { Bold, Download, Edit3, Highlighter, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { expandSlashShortcut } from "@/lib/admin-markdown";
import { remarkDocumentHeadings, remarkStudySyntax } from "@/lib/markdown";
import { loadNoteDraft, NOTE_FILE_STATUS_EVENT, NOTE_UPDATE_EVENT, removeNoteDraft, saveNoteDraft, type NoteFileStatus } from "@/lib/note-draft";
import { useAdmin } from "./AdminContext";

// source: the markdown, when the page carries it (dev server). A deployed page doesn't send it to every
// visitor, so the editor fetches it from the admin API the first time an admin opens it.
export function MarkdownEditor({ path, filename, source: initialSource, children }: { path: string; filename: string; source?: string; children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [source, setSource] = useState(initialSource);
  const [value, setValue] = useState(initialSource ?? "");
  const [loaded, setLoaded] = useState(false);
  const [fileStatus, setFileStatus] = useState<NoteFileStatus | "idle">("idle");
  const [view, setView] = useState<"edit" | "split" | "preview">("split");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("note-editor-open", isAdmin && editing);
    return () => document.documentElement.classList.remove("note-editor-open");
  }, [isAdmin, editing]);

  const fetchSource = async () => {
    if (source !== undefined) return source;
    const response = await fetch(`/api/admin/notes${path.replace(/^\/(lectures|practice)/, "")}?kind=${path.split("/")[1]}`, { cache: "no-store" });
    const result = await response.json().catch(() => ({})) as { content?: string; error?: string };
    if (!response.ok || typeof result.content !== "string") throw new Error(result.error ?? "원본을 불러오지 못했습니다.");
    setSource(result.content);
    return result.content;
  };

  useEffect(() => {
    const syncDraft = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; value: string }>).detail;
      if (detail.path === path) { setValue(detail.value); setLoaded(true); }
    };
    window.addEventListener(NOTE_UPDATE_EVENT, syncDraft);
    const syncFileStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; status: NoteFileStatus }>).detail;
      if (detail.path === path) setFileStatus(detail.status);
    };
    window.addEventListener(NOTE_FILE_STATUS_EVENT, syncFileStatus);
    return () => {
      window.removeEventListener(NOTE_UPDATE_EVENT, syncDraft);
      window.removeEventListener(NOTE_FILE_STATUS_EVENT, syncFileStatus);
    };
  }, [path]);

  const beginEditing = async () => {
    if (!loaded) {
      try { setValue(loadNoteDraft(path, await fetchSource())); setLoaded(true); }
      catch (error) { setFileStatus("error"); window.alert(error instanceof Error ? error.message : "원본을 불러오지 못했습니다."); return; }
    }
    setEditing(true);
  };

  // A note created from a template opens with ?edit=1 so the admin lands straight in the editor.
  useEffect(() => {
    if (!isAdmin || editing) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("edit") !== "1") return;
    const frame = requestAnimationFrame(() => {
      url.searchParams.delete("edit");
      window.history.replaceState(window.history.state, "", url);
      void beginEditing();
    });
    return () => cancelAnimationFrame(frame);
    // beginEditing reads the latest state; re-running on its identity would reopen the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, editing]);

  const update = (next: string) => { setValue(next); saveNoteDraft(path, next); };
  const insert = (before: string, after = "", placeholder = "내용") => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    update(value.slice(0, start) + before + selected + after + value.slice(end));
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start + before.length, start + before.length + selected.length); });
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const expanded = expandSlashShortcut(event.target.value, event.target.selectionStart);
    if (expanded) {
      update(expanded.value);
      requestAnimationFrame(() => event.target.setSelectionRange(expanded.caret, expanded.caret));
      return;
    }
    update(event.target.value);
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
  };

  if (!isAdmin || !editing) return <div className={isAdmin ? "admin-editable-note" : undefined} onClick={isAdmin ? () => void beginEditing() : undefined}>
    {isAdmin && <button className="admin-edit-hint" onClick={() => void beginEditing()}><Edit3 size={15} />본문 눌러서 수정</button>}
    <div className="prose">{children}</div>
  </div>;

  return <section className={`markdown-editor editor-view-${view}`} aria-label="문서 편집기">
    <div className="editor-toolbar"><div><span className="admin-live-dot" />관리자 편집 중 <span className={`editor-saved ${fileStatus === "error" ? "error" : ""}`}><Save size={13} />{fileStatus === "saving" ? "MD 파일 저장 중…" : fileStatus === "saved" ? "MD 파일 저장됨" : fileStatus === "error" ? "MD 파일 저장 실패" : "MD 파일 자동 저장"}</span></div><div className="editor-toolbar-actions">
      <div className="editor-view-tabs" role="tablist" aria-label="편집 화면">{([ ["edit", "편집"], ["split", "나란히"], ["preview", "미리보기"] ] as const).map(([mode, label]) => <button type="button" role="tab" aria-selected={view === mode} key={mode} onClick={() => setView(mode)}>{label}</button>)}</div>
      <button onClick={download}><Download size={15} />MD 받기</button>
      <button onClick={() => { setValue(source ?? ""); removeNoteDraft(path, source ?? ""); }}><RotateCcw size={15} />원본 복원</button>
      <button onClick={() => setEditing(false)} aria-label="편집기 닫기"><X size={16} />닫기</button>
    </div></div>
    <div className="editor-format-toolbar" role="toolbar" aria-label="마크다운 서식"><button type="button" aria-label="굵은 글씨" onClick={() => insert("**", "**")}><Bold size={15} /></button><button type="button" onClick={() => insert("==", "==")}><Highlighter size={15} />형광펜</button><button type="button" onClick={() => insert("{{", "}}", "정답")}>빈칸</button><button type="button" onClick={() => insert("\n> [!NOTE]\n> ", "\n", "안내 내용")}>안내 상자</button><button type="button" onClick={() => insert("\n> [!QUIZ]\n> ", "\n\n> [!ANSWER]\n> 정답과 해설\n", "질문")}>확인 문제</button><button type="button" onClick={() => insert("\n> [!FLASHCARD]\n> Q: ", "\n> A: 정답\n", "질문")}>플래시카드</button><span>/ 를 입력해도 됩니다</span></div>
    <div className="editor-grid">
      <div className="editor-input-pane"><div className="editor-pane-label">MARKDOWN <span>학습 문법을 실시간으로 확인할 수 있습니다.</span></div><details className="editor-syntax-help"><summary>학습 문법 도움말</summary><div><code>==중요 내용==</code><code>==red:주의 내용==</code><code>{"{{빈칸 정답}}"}</code><code>&gt; [!DEFINITION]</code><code>&gt; [!EXAM]</code><code>&gt; [!CAUTION]</code><code>&gt; [!EXAMPLE]</code><code>&gt; [!ADVANCED]</code><code>&gt; [!QUIZ] + [!ANSWER]</code><code>&gt; [!FLASHCARD] + Q: + A:</code></div></details><textarea ref={inputRef} value={value} spellCheck={false} onChange={onChange} aria-label="마크다운 노트 내용" /></div>
      <div className="editor-preview-pane"><div className="editor-pane-label">미리보기 · 독자 화면과 같음</div><div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm, remarkStudySyntax, remarkDocumentHeadings]} components={{ table: ({ children: tableChildren }) => <div className="table-scroll"><table>{tableChildren}</table></div>, details: ({ children: detailChildren, className }) => <details className={className} open>{detailChildren}</details> }}>{value}</ReactMarkdown></div></div>
    </div>
    <footer className="editor-status"><span>줄 {value.split("\n").length} · {value.length.toLocaleString()}자</span><span>변경 내용은 자동 저장됩니다</span></footer>
  </section>;
}
