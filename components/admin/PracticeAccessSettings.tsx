"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { KeyRound, X } from "lucide-react";
import { useId, useState } from "react";
import { useAdmin } from "./AdminContext";

type Status = { own: boolean; set: boolean };

// Sets this exam's password. It is stored in the database as a hash and applies at once;
// the current password is never shown, and changing it signs everyone out of this exam.
export function PracticeAccessSettings({ slug, title }: { slug: string[]; title: string }) {
  const { isAdmin } = useAdmin();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [fileMode, setFileMode] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  if (!isAdmin) return null;
  const endpoint = `/api/admin/practice-access/${slug.map(encodeURIComponent).join("/")}`;

  const load = async () => {
    setError(""); setNotice(""); setStatus(undefined); setPassword(""); setConfirmation(""); setFileMode(false);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const result = await response.json() as Status & { error?: string };
      if (!response.ok) { setFileMode(response.status === 400); setError(result.error ?? "비밀번호 상태를 불러오지 못했습니다."); return; }
      setStatus(result);
    } catch { setError("비밀번호 상태를 불러오지 못했습니다."); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 4 || password.length > 100) { setError("비밀번호는 4~100자로 입력해 주세요."); return; }
    if (password !== confirmation) { setError("새 비밀번호가 서로 다릅니다."); return; }
    setPending(true); setError(""); setNotice("");
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json() as Status & { error?: string };
      if (!response.ok) { setError(result.error ?? "비밀번호를 저장하지 못했습니다."); return; }
      setStatus(result); setPassword(""); setConfirmation("");
      setNotice("저장했습니다. 지금부터 새 비밀번호로 열리고, 이미 연 사람도 다시 입력해야 합니다.");
    } catch { setError("비밀번호를 저장하지 못했습니다."); }
    finally { setPending(false); }
  };

  const current = !status ? "불러오는 중…"
    : status.own ? "이 족보만의 비밀번호가 설정되어 있습니다."
    : status.set ? "아직 이 족보만의 비밀번호가 없어 공통 기본 비밀번호로 열립니다."
    : "비밀번호가 없어 방문자에게 잠겨 있습니다.";

  return <Dialog.Root open={open} onOpenChange={next => { setOpen(next); if (next) void load(); }}>
    <Dialog.Trigger asChild><button type="button" className="document-access-button"><KeyRound size={15} />비밀번호</button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay admin-dialog-overlay" />
      <Dialog.Content className="admin-dialog admin-wide-dialog" aria-describedby={`${id}-description`}>
        <Dialog.Title>족보 비밀번호 바꾸기</Dialog.Title>
        <Dialog.Description id={`${id}-description`}><strong>{title}</strong>을(를) 여는 비밀번호를 정합니다.</Dialog.Description>
        <p className="access-help" role="status">{current}</p>
        <form onSubmit={save} className="access-settings-form access-key-fields">
          <label className="create-field-label" htmlFor={`${id}-password`}>새 비밀번호</label>
          <input id={`${id}-password`} type="password" value={password} onChange={event => { setPassword(event.target.value); setError(""); setNotice(""); }} placeholder="4~100자" autoComplete="new-password" maxLength={100} disabled={pending || fileMode} required />
          <label className="create-field-label" htmlFor={`${id}-confirmation`}>한 번 더</label>
          <input id={`${id}-confirmation`} type="password" value={confirmation} onChange={event => { setConfirmation(event.target.value); setError(""); }} autoComplete="new-password" maxLength={100} disabled={pending || fileMode} required />
          <p className="access-help">DB에 해시로만 저장되어, 저장한 뒤에는 이 화면에서도 다시 볼 수 없습니다. 다른 족보의 비밀번호에는 영향이 없습니다.</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          {notice && <p className="access-notice" role="status">{notice}</p>}
          <div className="admin-dialog-actions">
            <Dialog.Close asChild><button type="button" className="button">닫기</button></Dialog.Close>
            <button type="submit" className="button primary" disabled={pending || fileMode || !status}>{pending ? "저장 중…" : "저장"}</button>
          </div>
        </form>
        <Dialog.Close asChild><button className="icon-button admin-dialog-close" aria-label="비밀번호 창 닫기"><X size={18} /></button></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
