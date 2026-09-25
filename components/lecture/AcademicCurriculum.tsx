import { LectureCard } from "./LectureCard";
import type { AcademicCatalog, LectureMeta } from "@/types/content";

export function AcademicCurriculum({ catalog, lectures, showDescriptions = true, itemLabel = "강의" }: { catalog: AcademicCatalog; lectures: LectureMeta[]; showDescriptions?: boolean; itemLabel?: string }) {
  return <div className="academic-curriculum">{[...catalog.grades].sort((a, b) => a.order - b.order).map(grade =>
    <section className="grade-section" key={grade.id} id={grade.id}>
      <div className="grade-heading"><span className="grade-badge">{String(grade.order).padStart(2, "0")}</span><h2>{grade.name}</h2></div>
      {[...grade.semesters].sort((a, b) => a.order - b.order).map(semester => <div className="semester-section" key={semester.id}>
        <div className="semester-heading"><h3>{semester.name}</h3><span className="meta">{semester.subjects.length}개 과목</span></div>
        {[...semester.subjects].sort((a, b) => a.order - b.order).map(subject => {
          const subjectLectures = lectures.filter(lecture => lecture.gradeId === grade.id && lecture.semesterId === semester.id && lecture.subjectId === subject.id);
          return <section className="subject-section" key={subject.id} id={`${grade.id}-${semester.id}-${subject.id}`}>
            <div className="section-heading"><h2>{subject.name}</h2><span className="meta">{subjectLectures.length}개의 {itemLabel}</span></div>
            {subjectLectures.length ? <div className="card-grid">{subjectLectures.map(lecture => <LectureCard key={lecture.path} lecture={lecture} showDescription={showDescriptions} />)}</div> : <div className="subject-empty">아직 작성된 {itemLabel}가 없습니다.</div>}
          </section>;
        })}
      </div>)}
    </section>)}</div>;
}
