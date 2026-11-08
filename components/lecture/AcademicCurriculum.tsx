import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LectureCard } from "./LectureCard";
import { subjectPath } from "@/lib/subjects";
import type { AcademicCatalog, LectureMeta } from "@/types/content";

/** Full catalog listing. Grades, semesters and subjects without any item are left out. */
export function AcademicCurriculum({ catalog, lectures, showDescriptions = true, itemLabel = "강의" }: { catalog: AcademicCatalog; lectures: LectureMeta[]; showDescriptions?: boolean; itemLabel?: string }) {
  const grades = [...catalog.grades].sort((a, b) => a.order - b.order).map(grade => ({
    grade,
    semesters: [...grade.semesters].sort((a, b) => a.order - b.order).map(semester => ({
      semester,
      subjects: [...semester.subjects].sort((a, b) => a.order - b.order)
        .map(subject => ({ subject, items: lectures.filter(lecture => lecture.gradeId === grade.id && lecture.semesterId === semester.id && lecture.subjectId === subject.id) }))
        .filter(item => item.items.length > 0),
    })).filter(item => item.subjects.length > 0),
  })).filter(item => item.semesters.length > 0);
  if (!grades.length) return <div className="empty-state">아직 올린 {itemLabel}가 없습니다.</div>;
  const anchor = itemLabel === "족보" ? "#practice" : "";
  return <div className="academic-curriculum">{grades.map(({ grade, semesters }) =>
    <section className="grade-section" key={grade.id} id={grade.id}>
      <div className="grade-heading"><span className="grade-badge">{String(grade.order).padStart(2, "0")}</span><h2>{grade.name}</h2></div>
      {semesters.map(({ semester, subjects }) => <div className="semester-section" key={semester.id}>
        <div className="semester-heading"><h3>{semester.name}</h3><span className="meta">{subjects.length}개 과목</span></div>
        {subjects.map(({ subject, items }) => <section className="subject-section" key={subject.id} id={`${grade.id}-${semester.id}-${subject.id}`}>
          <div className="section-heading"><h2><Link prefetch={false} href={`${subjectPath(grade.id, semester.id, subject.id)}${anchor}`} className="subject-heading-link">{subject.name}<ArrowRight size={15} aria-hidden="true" /></Link></h2><span className="meta">{items.length}개의 {itemLabel}</span></div>
          <div className="card-grid">{items.map(lecture => <LectureCard key={lecture.path} lecture={lecture} showDescription={showDescriptions} />)}</div>
        </section>)}
      </div>)}
    </section>)}</div>;
}
