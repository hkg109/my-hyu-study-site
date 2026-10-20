"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { KeyRound, X } from "lucide-react";
import { useState } from "react";
import type { PracticeAccessOverview, PracticeDocumentAccess } from "@/types/admin";
import { useAdmin } from "./AdminContext";
import { AccessKeyPicker, accessChoiceFromDraft, accessDraftError, type AccessDraft } from "./AccessKeyPicker";

type Loaded = { access: PracticeDocumentAccess; overview: PracticeAccessOverview };

// Manages which environment variable unlocks this exam. It never shows, copies or changes password values.
export function PracticeAccessSettings({ slug, title }: { slug: string[]; title: string }) {
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState<Loaded>();
  const [draft, setDraft] = useState<AccessDraft>({ mode: "default", accessKey: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  if (!isAdmin) return null;
  const endpoint = `/api/admin/practice-access/${slug.map(encodeURIComponent).join("/")}`;

  const apply = (result: Loaded) => {
    setLoaded(result);
    setDraft({ mode: result.access.mode, accessKey: result.access.accessKey ?? "" });
  };

  const load = async () => {
    setError(""); setNotice(""); setLoaded(undefined);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const result = await response.json() as Loaded & { error?: string };
      if (!response.ok) { setError(result.error ?? "접근 설정을 불러오지 못했습니다."); return; }
      apply(result);
    } catch { setError("접근 설정을 불러오지 못했습니다."); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const draftError = accessDraftError(draft);
    if (draftError) { setError(draftError); return; }
    setPending(true); setError(""); setNotice("");
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(accessChoiceFromDraft(draft)) });
      const result = await response.json() as Loaded & { error?: string };
      if (!response.ok) { setError(result.error ?? "접근 설정을 저장하지 못했습니다."); return; }
      apply(result);
      setNotice(result.access.configuredLocally
        ? "저장했습니다. 이 족보에 대한 기존 접속은 비밀번호를 다시 입력해야 열립니다."
        : `저장했습니다. 하지만 ${result.access.envName}이(가) 이 개발 서버에 없어 방문자에게 이 족보는 잠긴 상태로 남습니다.`);
    } catch { setError("접근 설정을 저장하지 못했습니다."); }
    finally { setPending(false); }
  };

  const current = loaded?.access;
  return <Dialog.Root open={open} onOpenChange={next => { setOpen(next); if (next) void load(); }}>
    <Dialog.Trigger asChild><button type="button" className="document-access-button"><KeyRound size={15} />접근 설정</button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay admin-dialog-overlay" />
      <Dialog.Content className="admin-dialog admin-wide-dialog" aria-describedby="access-settings-description">
        <Dialog.Title>족보 접근 설정</Dialog.Title>
        <Dialog.Description id="access-settings-description"><strong>{title}</strong>을(를) 여는 비밀번호가 어떤 환경변수에 연결될지 정합니다.</Dialog.Description>
        {current && <dl className="access-current">
          <div><dt>현재 방식</dt><dd>{current.mode === "key" ? "개별 비밀번호 키" : "기본 비밀번호"}</dd></div>
          <div><dt>accessKey</dt><dd>{current.accessKey ? <code>{current.accessKey}</code> : "없음"}</dd></div>
          <div><dt>환경변수</dt><dd><code>{current.envName}</code></dd></div>
          <div><dt>이 개발 서버</dt><dd>{current.configuredLocally ? "설정됨" : "설정되지 않음 (방문자에게 잠김)"}</dd></div>
        </dl>}
        {current?.problem && <p className="admin-error" role="alert">현재 frontmatter를 사용할 수 없어 이 족보는 잠겨 있습니다: {current.problem}</p>}
        {!loaded && !error && <p className="access-help" role="status">불러오는 중…</p>}
        {loaded && <form onSubmit={save} className="access-settings-form">
          <AccessKeyPicker draft={draft} onChange={next => { setDraft(next); setError(""); setNotice(""); }} overview={loaded.overview} disabled={pending} />
          {error && <p className="admin-error" role="alert">{error}</p>}
          {notice && <p className="access-notice" role="status">{notice}</p>}
          <div className="admin-dialog-actions">
            <Dialog.Close asChild><button type="button" className="button">닫기</button></Dialog.Close>
            <button type="submit" className="button primary" disabled={pending}>{pending ? "저장 중…" : "설정 저장"}</button>
          </div>
        </form>}
        {!loaded && error && <p className="admin-error" role="alert">{error}</p>}
        <Dialog.Close asChild><button className="icon-button admin-dialog-close" aria-label="접근 설정 닫기"><X size={18} /></button></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
