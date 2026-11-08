"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { LectureMeta } from "@/types/content";
import { useProgress } from "./ProgressProvider";

const key = (lecture: LectureMeta) => lecture.slug.join("/");

/** Completion bar and the next unfinished lecture of one subject. */
export function SubjectProgress({ lectures }: { lectures: LectureMeta[] }) {
  const { progress, ready } = useProgress();
  if (!lectures.length) return null;
  const completed = lectures.filter(lecture => progress[key(lecture)]).length;
  const next = lectures.find(lecture => !progress[key(lecture)]);
  const percent = Math.round(completed / lectures.length * 100);
  return <div className="subject-progress">
    <div className="subject-progress-top"><span className="eyebrow">학습 진행률</span><span className="meta">{ready ? `${completed} / ${lectures.length} 완료 · ${percent}%` : "학습 기록 불러오는 중"}</span></div>
    <div className="progress-track" role="progressbar" aria-label="과목 학습 진행률" aria-valuemin={0} aria-valuemax={lectures.length} aria-valuenow={completed}><span style={{ width: `${percent}%` }} /></div>
    <Link prefetch={false} href={(next ?? lectures[0]).path} className="button primary subject-continue">
      <span><small>{next ? completed ? "이어서 학습" : "첫 강의" : "모두 완료 · 처음부터 복습"}</small>{(next ?? lectures[0]).title}</span>
      <ArrowRight size={17} />
    </Link>
  </div>;
}

export function SubjectLectureList({ lectures }: { lectures: LectureMeta[] }) {
  const { progress } = useProgress();
  return <ol className="subject-list">{lectures.map(lecture => {
    const done = progress[key(lecture)];
    return <li key={lecture.path}><Link prefetch={false} href={lecture.path} className={`subject-row${done ? " done" : ""}`}>
      <span className="subject-row-order">{String(lecture.order).padStart(2, "0")}</span>
      <span className="subject-row-body"><strong>{lecture.title}</strong>{lecture.description && <span>{lecture.description}</span>}</span>
      <span className="subject-row-status">{done ? <><Check size={14} />완료</> : <ArrowUpRight size={17} aria-hidden="true" />}</span>
    </Link></li>;
  })}</ol>;
}
