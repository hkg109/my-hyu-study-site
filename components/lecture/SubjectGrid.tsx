"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SubjectSummary } from "@/lib/subjects";
import { useProgress } from "./ProgressProvider";

/** Subjects grouped by grade and semester, each with its own completion bar. */
export function SubjectGrid({ subjects }: { subjects: SubjectSummary[] }) {
  const { progress, ready } = useProgress();
  const groups = new Map<string, { label: string; subjects: SubjectSummary[] }>();
  for (const subject of subjects) {
    const id = `${subject.gradeId}/${subject.semesterId}`;
    const group = groups.get(id) ?? { label: `${subject.gradeName} · ${subject.semesterName}`, subjects: [] };
    group.subjects.push(subject);
    groups.set(id, group);
  }
  return <div className="subject-groups">{[...groups.entries()].map(([id, group]) => <section className="subject-group" key={id}>
    <h3>{group.label}</h3>
    <div className="subject-grid">{group.subjects.map(subject => {
      const total = subject.lectures.length;
      const done = subject.lectures.filter(lecture => progress[lecture.slug.join("/")]).length;
      return <Link prefetch={false} href={total ? subject.path : `${subject.path}#practice`} key={subject.path} className="subject-card">
        <span className="subject-card-top"><span>{[total && `강의 ${total}`, subject.exams.length && `족보 ${subject.exams.length}`].filter(Boolean).join(" · ")}</span><ArrowUpRight size={17} aria-hidden="true" /></span>
        <strong>{subject.subjectName}</strong>
        {total > 0 ? <span className="subject-card-progress">
          <span className="progress-track" role="progressbar" aria-label={`${subject.subjectName} 진행률`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}><span style={{ width: `${done / total * 100}%` }} /></span>
          <span className="meta">{ready ? done === total ? "모두 완료" : `${done} / ${total} 완료` : " "}</span>
        </span> : <span className="subject-card-progress"><span className="meta">족보만 있는 과목</span></span>}
      </Link>;
    })}</div>
  </section>)}</div>;
}
