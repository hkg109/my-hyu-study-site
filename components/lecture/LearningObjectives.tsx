"use client";

import { useEffect, useState } from "react";

export function LearningObjectives({ objectives, documentPath }: { objectives?: string[]; documentPath: string }) {
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(`hjs-objectives:${documentPath}`) ?? "[]");
        if (Array.isArray(saved)) setChecked(saved.filter((value): value is string => typeof value === "string"));
      } catch { /* A malformed local record starts with unchecked objectives. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [documentPath]);
  if (!objectives?.length) return null;
  const toggle = (objective: string) => {
    const next = checked.includes(objective) ? checked.filter(value => value !== objective) : [...checked, objective];
    setChecked(next);
    try { localStorage.setItem(`hjs-objectives:${documentPath}`, JSON.stringify(next)); } catch { /* The current page keeps the selection when storage is unavailable. */ }
  };
  return <section className="objectives" aria-label="학습 목표"><h2>이번 강의에서 배울 것 <span>{objectives.filter(objective => checked.includes(objective)).length} / {objectives.length}</span></h2><ul>{objectives.map(objective => <li key={objective}><label><input type="checkbox" checked={checked.includes(objective)} onChange={() => toggle(objective)} />{objective}</label></li>)}</ul></section>;
}
