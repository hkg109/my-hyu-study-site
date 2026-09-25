import fs from "node:fs";
import path from "node:path";
import type { AcademicCatalog, CatalogGrade, CatalogSemester, CatalogSubject } from "@/types/content";

export const catalogFile = path.resolve(process.cwd(), "content", "lectures", "catalog.json");
const validId = (value: unknown) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const validName = (value: unknown) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= 60;

export function validateCatalog(value: unknown, file = catalogFile): AcademicCatalog {
  if (!value || typeof value !== "object" || !Array.isArray((value as AcademicCatalog).grades)) throw new Error(`${file}: grades 배열이 필요합니다.`);
  const ids = new Set<string>();
  const validateItem = (item: { id: unknown; name: unknown; order: unknown }, label: string) => {
    if (!validId(item.id) || ids.has(String(item.id))) throw new Error(`${file}: ${label} id가 올바르지 않거나 중복됩니다.`);
    if (!validName(item.name)) throw new Error(`${file}: ${label} 이름은 1~60자로 작성하세요.`);
    if (!Number.isInteger(item.order) || Number(item.order) < 1) throw new Error(`${file}: ${label} 순서가 올바르지 않습니다.`);
    ids.add(String(item.id));
  };
  for (const grade of (value as AcademicCatalog).grades) {
    validateItem(grade, "학년");
    if (!Array.isArray(grade.semesters)) throw new Error(`${file}: 학기 배열이 필요합니다.`);
    for (const semester of grade.semesters) {
      validateItem(semester, "학기");
      if (!Array.isArray(semester.subjects)) throw new Error(`${file}: 과목 배열이 필요합니다.`);
      for (const subject of semester.subjects) validateItem(subject, "과목");
    }
  }
  return value as AcademicCatalog;
}

export function readCatalog(file = catalogFile): AcademicCatalog {
  return validateCatalog(JSON.parse(fs.readFileSync(file, "utf8")), file);
}

export function sortedGrades(catalog = readCatalog()): CatalogGrade[] {
  return [...catalog.grades].sort((a, b) => a.order - b.order);
}

export function findCatalogPath(catalog: AcademicCatalog, gradeId: string, semesterId: string, subjectId: string): { grade: CatalogGrade; semester: CatalogSemester; subject: CatalogSubject } | undefined {
  const grade = catalog.grades.find(item => item.id === gradeId);
  const semester = grade?.semesters.find(item => item.id === semesterId);
  const subject = semester?.subjects.find(item => item.id === subjectId);
  return grade && semester && subject ? { grade, semester, subject } : undefined;
}
