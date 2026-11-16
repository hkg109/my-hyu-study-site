"use client";

import { useId } from "react";

/** Optional position in the subject. Empty puts the document last; a taken number pushes that one and the rest back by one. */
export function DocumentOrderField({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const id = useId();
  return <div className="access-key-fields">
    <label className="create-field-label" htmlFor={id}>순서</label>
    <input id={id} type="number" inputMode="numeric" min={1} max={999} step={1} value={value} onChange={event => onChange(event.target.value)} placeholder="비워 두면 맨 뒤에 추가됩니다" disabled={disabled} />
    <p className="access-help">이미 있는 번호를 넣으면 그 자리에 들어가고, 원래 있던 문서부터 뒤로 한 칸씩 밀립니다.</p>
  </div>;
}

export const documentOrderError = (value: string) => value && !(/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 999) ? "순서는 1~999 사이의 정수로 입력해 주세요." : undefined;
