"use client";

import { useId } from "react";

/** Optional password for a new exam. Empty means it opens with the shared default password until one is set. */
export function ExamPasswordField({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const id = useId();
  return <div className="access-key-fields">
    <label className="create-field-label" htmlFor={id}>족보 비밀번호</label>
    <input id={id} type="password" value={value} onChange={event => onChange(event.target.value)} placeholder="비워 두면 공통 기본 비밀번호로 열립니다" autoComplete="new-password" maxLength={100} disabled={disabled} />
    <p className="access-help">DB에 해시로만 저장되고, 나중에 족보 화면의 ‘비밀번호’에서 바로 바꿀 수 있습니다.</p>
  </div>;
}

export const examPasswordError = (value: string) => value && (value.length < 4 || value.length > 100) ? "비밀번호는 4~100자로 입력해 주세요." : undefined;
