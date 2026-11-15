"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FileUp } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { guessTitle, IMAGE_TYPES, localImageReferences, safeFileName } from "@/lib/upload-markdown";
import type { TemplateKind } from "@/lib/note-templates";
import { examPasswordError, ExamPasswordField } from "./ExamPasswordField";
import type { CreateTarget } from "./CreateDocumentDialog";

const kindLabel = (kind: TemplateKind) => kind === "practice" ? "족보" : "강의 노트";
const frontmatterTitle = (text: string) => /^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$[\s\S]*?^---/m.exec(text)?.[1];
const withoutFrontmatter = (text: string) => text.replace(/^---\n[\s\S]*?\n---\n?/, "");

// Creates a document from an .md file and the pictures it uses. The server stores the pictures,
// rewrites the markdown's image paths to them, and gives the document the subject's next number.
export function UploadDocumentForm({ kind, target, onCreated }: { kind: TemplateKind; target: CreateTarget; onCreated: (path: string) => void }) {
  const id = useId();
  const [markdown, setMarkdown] = useState<File>();
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const chooseMarkdown = async (file?: File) => {
    setError(""); setMarkdown(file); setText("");
    if (!file) return;
    const content = (await file.text()).replace(/\r\n/g, "\n");
    setText(content);
    setTitle(guessTitle(frontmatterTitle(content), withoutFrontmatter(content), file.name));
  };

  // Which pictures the markdown points at, and which of them haven't been attached yet
  const references = useMemo(() => localImageReferences(withoutFrontmatter(text)), [text]);
  const attached = new Set(images.map(image => safeFileName(image.name)));
  const missing = references.filter(reference => !attached.has(safeFileName(decodeURIComponent(reference))));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!markdown) { setError("MD 파일을 골라 주세요."); return; }
    const passwordError = kind === "practice" ? examPasswordError(password) : undefined;
    if (passwordError) { setError(passwordError); return; }
    const form = new FormData();
    form.set("kind", kind);
    form.set("gradeId", target.gradeId); form.set("semesterId", target.semesterId); form.set("subjectId", target.subjectId);
    form.set("title", title.trim());
    form.set("markdown", markdown);
    for (const image of images) form.append("images", image);
    if (kind === "practice" && password) form.set("password", password);
    setPending(true); setError("");
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json().catch(() => ({})) as { error?: string; path?: string };
      if (!response.ok || !result.path) { setError(result.error ?? `${kindLabel(kind)}를 만들지 못했습니다.`); return; }
      onCreated(result.path);
    } catch { setError(`${kindLabel(kind)}를 만들지 못했습니다. 네트워크 연결을 확인해 주세요.`); }
    finally { setPending(false); }
  };

  return <form onSubmit={submit} className="create-document-form">
    <div className="admin-dialog-icon"><FileUp size={22} /></div>
    <Dialog.Title>MD 파일로 새 {kindLabel(kind)}</Dialog.Title>
    <Dialog.Description id="create-document-description"><strong>{target.subjectName}</strong>에 MD 파일과 그림으로 새 {kindLabel(kind)}를 만듭니다. 번호는 과목의 다음 번호로 정해지고, 본문의 그림 경로는 올린 그림 주소로 바뀝니다.</Dialog.Description>

    <label className="create-field-label" htmlFor={`${id}-md`}>MD 파일</label>
    <input id={`${id}-md`} type="file" accept=".md,.mdx,.markdown,text/markdown" onChange={event => void chooseMarkdown(event.target.files?.[0])} disabled={pending} required />

    <label className="create-field-label" htmlFor={`${id}-images`}>그림 (svg, png, jpg, webp, gif · 여러 개 선택 가능)</label>
    <input id={`${id}-images`} type="file" multiple accept={Object.keys(IMAGE_TYPES).map(ext => `.${ext}`).join(",")} onChange={event => { setImages([...(event.target.files ?? [])]); setError(""); }} disabled={pending} />
    {images.length > 0 && <p className="access-help">그림 {images.length}개: {images.map(image => image.name).join(", ")}</p>}

    {markdown && <>
      <label className="create-field-label" htmlFor={`${id}-title`}>제목</label>
      <input id={`${id}-title`} className="create-title-input" value={title} onChange={event => { setTitle(event.target.value); setError(""); }} maxLength={120} required />
      {references.length > 0 && <section className="template-preview" aria-label="본문의 그림">
        <h3>본문이 쓰는 그림 {references.length}개</h3>
        {missing.length ? <p className="admin-error" role="status">아직 고르지 않은 그림: {missing.join(", ")} — 같은 이름의 파일을 그림 칸에 추가해 주세요. 그대로 만들면 이 그림들은 깨져 보입니다.</p>
          : <p className="access-help">모든 그림이 준비됐습니다.</p>}
      </section>}
    </>}

    {kind === "practice" && <ExamPasswordField value={password} onChange={next => { setPassword(next); setError(""); }} disabled={pending} />}

    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-dialog-actions">
      <Dialog.Close asChild><button type="button" className="button">취소</button></Dialog.Close>
      <button type="submit" className="button primary" disabled={pending || !markdown}>{pending ? "올리는 중…" : `${kindLabel(kind)} 만들기`}</button>
    </div>
  </form>;
}
