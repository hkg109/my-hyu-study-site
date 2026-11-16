"use client";

import Link from "next/link";
import { LockKeyhole, Search } from "lucide-react";
import { useState } from "react";
import type { LectureMeta } from "@/types/content";
import { subjectPathOf } from "@/lib/subjects";

type Exam = LectureMeta & { questionCount: number };
const examType = (exam: LectureMeta) => /모의|practice exam/i.test(exam.title) ? "모의고사" : /원문|test.?bank/i.test(exam.title) ? "Test Bank 원문" : /복원|중간|기말|recollection|midterm|final/i.test(exam.title) ? "기출 복원" : "연습 문제";

export function PracticeList({ exams }: { exams: Exam[] }) {
  const [type, setType] = useState("전체");
  const [query, setQuery] = useState("");
  const types = ["전체", ...new Set(exams.map(examType))];
  const visible = exams.filter(exam => (type === "전체" || examType(exam) === type) && `${exam.title} ${exam.description} ${exam.subjectName} ${exam.gradeName} ${exam.semesterName}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const groups = new Map<string, Exam[]>();
  for (const exam of visible) {
    const key = subjectPathOf(exam) ?? exam.path;
    const group = groups.get(key) ?? [];
    group.push(exam); groups.set(key, group);
  }
  return <div className="practice-library">
    <header className="practice-library-header"><div><h1>족보</h1><p>시험지 형식의 연습 문제와 해설. 비밀번호로 열고 이 기기에서 이어서 학습하세요.</p></div><div className="practice-library-stats"><span><strong>{exams.length}</strong>족보</span><span><strong>{new Set(exams.map(subjectPathOf)).size}</strong>과목</span></div></header>
    <div className="practice-library-tools"><div className="practice-filter-tabs" aria-label="족보 유형">{types.map(item => <button key={item} type="button" aria-pressed={type === item} onClick={() => setType(item)}>{item} <span>{item === "전체" ? exams.length : exams.filter(exam => examType(exam) === item).length}</span></button>)}</div><label className="practice-search"><Search size={16} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="족보 이름·연도 검색" aria-label="족보 이름·연도 검색" /></label></div>
    <div aria-live="polite" className="sr-only">검색 결과 {visible.length}개</div>
    {[...groups.entries()].map(([path, items]) => <section className="practice-subject" key={path}>
      <header><div><span>{items[0].gradeName} {items[0].semesterName}</span><h2>{items[0].subjectName}</h2><small>{items.length}개</small></div><Link href={path}>강의 노트로 →</Link></header>
      <div className="practice-table-head" aria-hidden="true"><span>번호</span><span>족보</span><span>유형</span><span>문항</span><span>시간</span><span /></div>
      {items.map(exam => <Link prefetch={false} href={exam.path} key={exam.path} className="practice-row"><span className="practice-number">{String(exam.order).padStart(2, "0")}</span><div className="practice-row-title"><strong>{exam.title}</strong><p>{exam.description}</p></div><span className="practice-type">{examType(exam)}</span><span className="practice-row-count">{exam.questionCount || "—"}</span><span className="practice-row-time">{exam.duration ? `${exam.duration}분` : "—"}</span><LockKeyhole className="practice-row-lock" size={15} aria-label="비밀번호로 열기" /></Link>)}
    </section>)}
    {visible.length === 0 && <div className="empty-state">조건에 맞는 족보가 없습니다. 검색어나 유형을 바꿔 보세요.</div>}
  </div>;
}
