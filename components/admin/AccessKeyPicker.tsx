"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { accessKeyError, practicePasswordEnvName } from "@/lib/access-keys";
import type { AccessChoice, AccessKeyStatus, PracticeAccessOverview } from "@/types/admin";

export interface AccessDraft { mode: "default" | "key"; accessKey: string }

export const accessDraftError = (draft: AccessDraft) => draft.mode === "key" ? accessKeyError(draft.accessKey) : undefined;
export const accessChoiceFromDraft = (draft: AccessDraft): AccessChoice => draft.mode === "key" ? { mode: "key", accessKey: draft.accessKey } : { mode: "default" };

// Shows only variable names and whether they are set on this dev server; password values never reach the browser.
export function AccessKeyPicker({ draft, onChange, overview, disabled }: { draft: AccessDraft; onChange: (draft: AccessDraft) => void; overview?: PracticeAccessOverview; disabled?: boolean }) {
  const id = useId();
  const keyError = draft.mode === "key" ? accessKeyError(draft.accessKey) : undefined;
  const known = overview?.keys.find(item => item.accessKey === draft.accessKey);
  const [probe, setProbe] = useState<AccessKeyStatus>();

  // A key no exam uses yet isn't in the overview, so ask the server whether its variable is set.
  useEffect(() => {
    if (draft.mode !== "key" || keyError || known) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/admin/practice-access?candidate=${encodeURIComponent(draft.accessKey)}`, { signal: controller.signal })
        .then(response => response.ok ? response.json() as Promise<PracticeAccessOverview> : undefined)
        .then(result => { if (result?.candidate) setProbe(result.candidate); })
        .catch(() => undefined);
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [draft.mode, draft.accessKey, keyError, known]);

  const status = draft.mode === "default"
    ? overview && { envName: overview.defaultEnvName, configuredLocally: overview.defaultConfiguredLocally }
    : !keyError && (known ?? (probe?.accessKey === draft.accessKey ? probe : undefined));
  const envName = draft.mode === "default" ? overview?.defaultEnvName ?? "PRACTICE_PASSWORD_DEFAULT" : keyError ? undefined : practicePasswordEnvName(draft.accessKey);
  const keyOptions = overview?.keys ?? [];
  const selectValue = keyOptions.some(item => item.accessKey === draft.accessKey) ? draft.accessKey : "";

  return <fieldset className="access-picker" disabled={disabled}>
    <legend>접근 방식</legend>
    <label className="access-option">
      <input type="radio" name={`${id}-mode`} checked={draft.mode === "default"} onChange={() => onChange({ ...draft, mode: "default" })} />
      <span><strong>기본 비밀번호 사용</strong><small>accessKey 없이 PRACTICE_PASSWORD_DEFAULT로 엽니다.</small></span>
    </label>
    <label className="access-option">
      <input type="radio" name={`${id}-mode`} checked={draft.mode === "key"} onChange={() => onChange({ ...draft, mode: "key" })} />
      <span><strong>개별 비밀번호 키 사용</strong><small>이 족보만의 환경변수로 엽니다. 변수가 없으면 기본 비밀번호로 대체하지 않고 잠깁니다.</small></span>
    </label>

    {draft.mode === "key" && <div className="access-key-fields">
      {keyOptions.length > 0 && <>
        <label htmlFor={`${id}-existing`}>사용 중인 키</label>
        <select id={`${id}-existing`} value={selectValue} onChange={event => onChange({ ...draft, accessKey: event.target.value })}>
          <option value="">새 키 직접 입력</option>
          {keyOptions.map(item => <option key={item.accessKey} value={item.accessKey}>{item.accessKey} · 족보 {item.documents}개</option>)}
        </select>
      </>}
      <label htmlFor={`${id}-key`}>accessKey</label>
      <input id={`${id}-key`} value={draft.accessKey} onChange={event => onChange({ ...draft, accessKey: event.target.value.trim() })} placeholder="예: cse-midterm" autoComplete="off" spellCheck={false} maxLength={40} aria-invalid={Boolean(draft.accessKey && keyError)} aria-describedby={`${id}-key-help`} />
      <p id={`${id}-key-help`} className={draft.accessKey && keyError ? "admin-error" : "access-help"}>{draft.accessKey && keyError ? keyError : "소문자 영문·숫자와 하이픈(-)만, 32자 이하. default는 쓸 수 없습니다."}</p>
    </div>}

    {envName && <dl className="access-status">
      <div><dt>환경변수</dt><dd><code>{envName}</code></dd></div>
      <div><dt>이 개발 서버</dt><dd>{!status ? "확인 중…" : status.configuredLocally ? <span className="access-ok"><CheckCircle2 size={14} />설정됨</span> : <span className="access-missing"><AlertTriangle size={14} />설정되지 않음</span>}</dd></div>
    </dl>}
    {status && !status.configuredLocally && <p className="access-warning" role="status"><AlertTriangle size={15} /><span><code>{envName}</code>이(가) 이 개발 서버에 없습니다. 이대로 저장하면 방문자에게 이 족보는 <strong>잠긴 상태로 남습니다</strong>. <code>.env.local</code>에 추가한 뒤 개발 서버를 다시 시작하고, 배포 환경에도 같은 이름으로 등록해 주세요.</span></p>}
    {overview && !overview.authSecretConfiguredLocally && <p className="access-warning" role="status"><AlertTriangle size={15} /><span><code>AUTH_SECRET</code>이 없어 이 개발 서버에서는 모든 족보가 잠겨 있습니다.</span></p>}
    <p className="access-note"><Info size={14} /><span>‘설정됨’은 이 개발 서버(.env.local) 기준입니다. 배포 환경(Vercel)에 등록됐는지는 여기서 알 수 없습니다. 비밀번호 값은 이 화면에서 보거나 바꿀 수 없고, <code>.env.local</code>이나 배포 환경변수에서 관리합니다.</span></p>
  </fieldset>;
}
