"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminContext } from "./AdminContext";

// The server checks the password and keeps the session in an HttpOnly cookie; this only mirrors the result.
export function AdminProvider({ children, initialAdmin }: { children: React.ReactNode; initialAdmin: boolean }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(initialAdmin);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const close = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) { setPassword(""); setError(""); }
  };

  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) { setError(result.error ?? "관리자 모드를 시작하지 못했습니다."); return; }
      setIsAdmin(true);
      close(false);
      // Locked exams render for a signed-in admin, so re-render with the new cookie.
      router.refresh();
    } catch { setError("관리자 모드를 시작하지 못했습니다. 개발 서버가 실행 중인지 확인해 주세요."); }
    finally { setPending(false); }
  };

  const signOut = async () => {
    setPending(true);
    try { await fetch("/api/admin/session", { method: "DELETE" }); }
    finally {
      setPending(false);
      setIsAdmin(false);
      close(false);
      router.refresh();
    }
  };

  const openAdmin = () => setOpen(true);

  return <AdminContext.Provider value={{ isAdmin, openAdmin }}>
    {children}
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay admin-dialog-overlay" />
        <Dialog.Content className="admin-dialog" aria-describedby="admin-description">
          <div className="admin-dialog-icon">{isAdmin ? <ShieldCheck size={22} /> : <LockKeyhole size={22} />}</div>
          <Dialog.Title>{isAdmin ? "관리자 모드가 켜져 있습니다" : "관리자 모드"}</Dialog.Title>
          <Dialog.Description id="admin-description">
            {isAdmin ? "분류와 강의 노트, 족보를 추가하거나 수정할 수 있습니다." : "학습 자료를 수정하려면 비밀번호를 입력하세요."}
          </Dialog.Description>
          {isAdmin ? <div className="admin-dialog-actions">
            <button className="button" onClick={signOut} disabled={pending}>관리자 모드 종료</button>
            <Dialog.Close asChild><button className="button primary">계속 편집하기</button></Dialog.Close>
          </div> : <form onSubmit={authenticate} className="admin-login-form">
            <label htmlFor="admin-password">비밀번호</label>
            <input id="admin-password" type="password" inputMode="numeric" autoComplete="current-password" autoFocus value={password} onChange={event => { setPassword(event.target.value); setError(""); }} placeholder="비밀번호 입력" aria-invalid={Boolean(error)} aria-describedby={error ? "admin-password-error" : undefined} />
            {error && <p id="admin-password-error" className="admin-error" role="alert">{error}</p>}
            <button className="button primary" type="submit" disabled={pending}>{pending ? "확인 중…" : "관리자 모드 시작"}</button>
          </form>}
          <Dialog.Close asChild><button className="icon-button admin-dialog-close" aria-label="관리자 창 닫기"><X size={18} /></button></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </AdminContext.Provider>;
}
