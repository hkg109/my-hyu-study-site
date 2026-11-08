// Subject-level grouping shared by server pages and client navigation, so it must not touch the filesystem.
import type { AcademicCatalog, LectureMeta } from "@/types/content";

export interface SubjectSummary {
  gradeId: string;
  gradeName: string;
  semesterId: string;
  semesterName: string;
  subjectId: string;
  subjectName: string;
  path: string;
  lectures: LectureMeta[];
  exams: LectureMeta[];
}

export const subjectPath = (gradeId: string, semesterId: string, subjectId: string) => `/lectures/${gradeId}/${semesterId}/${subjectId}`;

const sameSubject = (document: LectureMeta, gradeId: string, semesterId: string, subjectId: string) =>
  document.gradeId === gradeId && document.semesterId === semesterId && document.subjectId === subjectId;

/** Every catalog subject in display order, with its published lectures and exams. Empty subjects are kept; callers decide whether to show them. */
export function listSubjects(catalog: AcademicCatalog, lectures: LectureMeta[], exams: LectureMeta[]): SubjectSummary[] {
  return [...catalog.grades].sort((a, b) => a.order - b.order).flatMap(grade =>
    [...grade.semesters].sort((a, b) => a.order - b.order).flatMap(semester =>
      [...semester.subjects].sort((a, b) => a.order - b.order).map(subject => ({
        gradeId: grade.id, gradeName: grade.name, semesterId: semester.id, semesterName: semester.name, subjectId: subject.id, subjectName: subject.name,
        path: subjectPath(grade.id, semester.id, subject.id),
        lectures: lectures.filter(lecture => sameSubject(lecture, grade.id, semester.id, subject.id)),
        exams: exams.filter(exam => sameSubject(exam, grade.id, semester.id, subject.id)),
      }))));
}

export const hasContent = (subject: Pick<SubjectSummary, "lectures" | "exams">) => subject.lectures.length > 0 || subject.exams.length > 0;

export function findSubject(subjects: SubjectSummary[], slug: string[]) {
  if (slug.length !== 3) return undefined;
  const [gradeId, semesterId, subjectId] = slug;
  return subjects.find(subject => subject.gradeId === gradeId && subject.semesterId === semesterId && subject.subjectId === subjectId);
}

/** The subject page that a lecture or exam belongs to. */
export const subjectPathOf = (document: Pick<LectureMeta, "gradeId" | "semesterId" | "subjectId">) =>
  document.gradeId && document.semesterId && document.subjectId ? subjectPath(document.gradeId, document.semesterId, document.subjectId) : undefined;
