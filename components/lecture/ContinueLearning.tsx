"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { LectureMeta } from "@/types/content";
import { useProgress } from "./ProgressProvider";
import { useRecentPaths } from "./RecentVisits";

const key = (lecture: LectureMeta) => lecture.slug.join("/");
const sameSubject = (a: LectureMeta, b: LectureMeta) => a.gradeId === b.gradeId && a.semesterId === b.semesterId && a.subjectId === b.subjectId;

export function ContinueLearning({ lectures, exams = [] }: { lectures: LectureMeta[]; exams?: LectureMeta[] }) {
  const { progress, ready } = useProgress();
  const recentPaths = useRecentPaths();
  if (!lectures.length) return <section className="continue-panel"><p>첫 강의를 준비하고 있습니다.</p></section>;
  const completed = lectures.filter(lecture => progress[key(lecture)]).length;
  const finished = completed === lectures.length;
  const byPath = new Map([...lectures, ...exams].map(document => [document.path, document]));
  const recentDocuments = recentPaths.map(path => byPath.get(path)).filter((document): document is LectureMeta => Boolean(document));

  // Pick up where this browser left off: the last lecture opened, or the next unfinished one in its subject.
  const lastLecture = recentDocuments.find(document => document.kind === "lectures");
  let next: LectureMeta | undefined;
  let label = "다음 강의";
  if (lastLecture && !progress[key(lastLecture)]) { next = lastLecture; label = "최근 보던 강의"; }
  else if (lastLecture) {
    next = lectures.find(lecture => sameSubject(lecture, lastLecture) && lecture.order > lastLecture.order && !progress[key(lecture)])
      ?? lectures.find(lecture => sameSubject(lecture, lastLecture) && !progress[key(lecture)]);
    if (next) label = "이어서 학습";
  }
  next ??= lectures.find(lecture => !progress[key(lecture)]) ?? lectures[0];
  const others = recentDocuments.filter(document => document.path !== next.path).slice(0, 3);

  return <section className="continue-panel" aria-label="이어서 학습">
    <div className="continue-top"><span className="eyebrow">{finished ? "모두 완료" : label}</span><span className="meta">{ready ? `${completed} / ${lectures.length} 완료` : "학습 기록 불러오는 중"}</span></div>
    <div className="progress-track" role="progressbar" aria-label="전체 학습 진행률" aria-valuemin={0} aria-valuemax={lectures.length} aria-valuenow={completed}><span style={{ width: `${completed / lectures.length * 100}%` }} /></div>
    <span className="eyebrow">{`${next.gradeName ?? "강의"} / ${next.semesterName ?? ""} / ${next.subjectName ?? ""}`}</span>
    <h2>{finished ? "모든 강의를 완주했어요." : next.title}</h2>
    {finished && <p>잘 해냈습니다. 배운 내용을 다시 살펴보세요.</p>}
    <Link prefetch={false} href={next.path} className="text-link">{finished ? "복습하기" : completed || lastLecture ? "이어서 학습하기" : "첫 강의 시작하기"}{finished ? <CheckCircle2 size={18} /> : <ArrowUpRight size={18} />}</Link>
    {others.length > 0 && <div className="recent-list"><span className="eyebrow">최근 본 자료</span><ul>{others.map(document => <li key={document.path}><Link prefetch={false} href={document.path}><span className="recent-kind">{document.kind === "practice" ? "족보" : "강의"}</span><span>{document.title}</span></Link></li>)}</ul></div>}
  </section>;
}
