import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import type { SubjectSummary } from "@/lib/subjects";
import { SubjectLectureList, SubjectProgress } from "./SubjectLectures";

export function SubjectPage({ subject }: { subject: SubjectSummary }) {
  const { lectures, exams } = subject;
  return <div className="index-page subject-page">
    <nav className="breadcrumb" aria-label="현재 위치"><Link prefetch={false} href="/lectures">강의 정리</Link><ChevronRight size={13} /><span>{subject.gradeName}</span><ChevronRight size={13} /><span>{subject.semesterName}</span></nav>
    <header className="subject-hero">
      <div>
        <span className="eyebrow">{subject.gradeName} · {subject.semesterName}</span>
        <h1>{subject.subjectName}</h1>
        <p className="meta">강의 노트 {lectures.length}개 · 족보 {exams.length}개</p>
      </div>
      <SubjectProgress lectures={lectures} />
    </header>

    {lectures.length > 0 && <section className="subject-block" id="lectures" aria-labelledby="subject-lectures-heading">
      <div className="subject-block-heading"><h2 id="subject-lectures-heading">강의 노트</h2><span className="meta">{lectures.length}개</span></div>
      <SubjectLectureList lectures={lectures} />
    </section>}

    {exams.length > 0 && <section className="subject-block" id="practice" aria-labelledby="subject-practice-heading">
      <div className="subject-block-heading"><h2 id="subject-practice-heading">족보</h2><span className="meta">{exams.length}개 · 비밀번호로 열람</span></div>
      <ol className="subject-list">{exams.map(exam => <li key={exam.path}><Link prefetch={false} href={exam.path} className="subject-row">
        <span className="subject-row-order">{String(exam.order).padStart(2, "0")}</span>
        <span className="subject-row-body"><strong>{exam.title}</strong>{exam.description && <span>{exam.description}</span>}</span>
        <span className="subject-row-status"><Lock size={14} aria-label="비밀번호 필요" /></span>
      </Link></li>)}</ol>
    </section>}

    {!lectures.length && !exams.length && <div className="empty-state">아직 이 과목에 올린 자료가 없습니다.</div>}
    <Footer />
  </div>;
}
