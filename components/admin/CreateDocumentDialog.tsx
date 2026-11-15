"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FilePlus2, X } from "lucide-react";
import { useId, useState } from "react";
import { defaultTemplateId, findTemplate, templatesFor, type TemplateKind } from "@/lib/note-templates";
import { examPasswordError, ExamPasswordField } from "./ExamPasswordField";
import { UploadDocumentForm } from "./UploadDocumentForm";

export interface CreateTarget { gradeId: string; semesterId: string; subjectId: string; subjectName: string }

const kindLabel = (kind: TemplateKind) => kind === "practice" ? "족보" : "강의 노트";

// Creates a new note from one of lib/note-templates.ts. On failure the title and choices stay as typed.
export function CreateDocumentDialog({ kind, target, onClose, onCreated }: { kind: TemplateKind; target?: CreateTarget; onClose: () => void; onCreated: (path: string) => void }) {
  const [mode, setMode] = useState<"template" | "upload">("template");
  return <Dialog.Root open={Boolean(target)} onOpenChange={open => { if (!open) { onClose(); setMode("template"); } }}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay admin-dialog-overlay" />
      <Dialog.Content className="admin-dialog admin-wide-dialog create-document-dialog" aria-describedby="create-document-description">
        <div className="create-mode-tabs" role="tablist" aria-label="만드는 방법">
          <button type="button" role="tab" aria-selected={mode === "template"} className={mode === "template" ? "active" : undefined} onClick={() => setMode("template")}>템플릿으로 만들기</button>
          <button type="button" role="tab" aria-selected={mode === "upload"} className={mode === "upload" ? "active" : undefined} onClick={() => setMode("upload")}>MD 파일 올리기</button>
        </div>
        {target && (mode === "template"
          ? <CreateDocumentForm key={`${kind}:${target.subjectId}`} kind={kind} target={target} onCreated={onCreated} />
          : <UploadDocumentForm key={`upload:${kind}:${target.subjectId}`} kind={kind} target={target} onCreated={onCreated} />)}
        <Dialog.Close asChild><button className="icon-button admin-dialog-close" aria-label="새 문서 창 닫기"><X size={18} /></button></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function CreateDocumentForm({ kind, target, onCreated }: { kind: TemplateKind; target: CreateTarget; onCreated: (path: string) => void }) {
  const id = useId();
  const templates = templatesFor(kind);
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState(defaultTemplateId(kind));
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const template = findTemplate(kind, templateId) ?? templates[0];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) { setError("제목을 입력해 주세요."); return; }
    const passwordError = kind === "practice" ? examPasswordError(password) : undefined;
    if (passwordError) { setError(passwordError); return; }
    setPending(true); setError("");
    try {
      const response = await fetch(kind === "practice" ? "/api/admin/practice" : "/api/admin/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeId: target.gradeId, semesterId: target.semesterId, subjectId: target.subjectId, title: title.trim(), templateId: template.id, ...(kind === "practice" && { access: { mode: "default", ...(password && { password }) } }) }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; path?: string };
      if (!response.ok || !result.path) { setError(result.error ?? `${kindLabel(kind)}를 만들지 못했습니다.`); return; }
      onCreated(result.path);
    } catch { setError(`${kindLabel(kind)}를 만들지 못했습니다. 개발 서버가 실행 중인지 확인해 주세요.`); }
    finally { setPending(false); }
  };

  const frontmatter = ["---", `title: ${JSON.stringify(title.trim() || `새 ${kindLabel(kind)}`)}`, 'description: ""', "order: (과목의 다음 번호)", "published: true", "---"].join("\n");

  return <form onSubmit={submit} className="create-document-form">
    <div className="admin-dialog-icon"><FilePlus2 size={22} /></div>
    <Dialog.Title>새 {kindLabel(kind)}</Dialog.Title>
    <Dialog.Description id="create-document-description"><strong>{target.subjectName}</strong>에 새 {kindLabel(kind)}를 만듭니다. 파일 이름과 순서는 자동으로 정해집니다.</Dialog.Description>

    <label className="create-field-label" htmlFor={`${id}-title`}>제목</label>
    <input id={`${id}-title`} className="create-title-input" value={title} onChange={event => { setTitle(event.target.value); setError(""); }} maxLength={120} placeholder={kind === "practice" ? "예: 자료구조 중간고사 족보" : "예: 3주차 반복문"} autoFocus required />

    <fieldset className="template-picker" disabled={pending}>
      <legend>템플릿</legend>
      {templates.map(item => <label key={item.id} className={`template-option${item.id === template.id ? " selected" : ""}`}>
        <input type="radio" name={`${id}-template`} value={item.id} checked={item.id === template.id} onChange={() => { setTemplateId(item.id); setError(""); }} />
        <span><strong>{item.label}</strong><small>{item.description}</small></span>
      </label>)}
    </fieldset>

    <section className="template-preview" aria-labelledby={`${id}-preview`}>
      <h3 id={`${id}-preview`}>생성될 구조</h3>
      <ol>{template.outline.map(section => <li key={section}>{section}</li>)}</ol>
      <details><summary>Markdown 미리보기</summary><pre>{`${frontmatter}\n\n${template.body(kind)}`}</pre></details>
    </section>

    {kind === "practice" && <ExamPasswordField value={password} onChange={next => { setPassword(next); setError(""); }} disabled={pending} />}

    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-dialog-actions">
      <Dialog.Close asChild><button type="button" className="button">취소</button></Dialog.Close>
      <button type="submit" className="button primary" disabled={pending}>{pending ? "만드는 중…" : `${kindLabel(kind)} 만들기`}</button>
    </div>
  </form>;
}
