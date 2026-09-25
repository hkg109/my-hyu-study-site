import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { findCatalogPath, readCatalog, sortedGrades } from "./catalog";
import type { ContentDocument } from "@/types/content";

const practiceRoot = path.resolve(process.cwd(), "content", "practice");

function readSubjectFiles(gradeId: string, semesterId: string, subjectId: string): ContentDocument[] {
  const directory = path.join(practiceRoot, gradeId, semesterId, subjectId);
  if (!fs.existsSync(directory)) return [];
  const catalogPath = findCatalogPath(readCatalog(), gradeId, semesterId, subjectId);
  if (!catalogPath) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).filter(entry => entry.isFile() && /^exam-[a-z0-9-]+\.md$/.test(entry.name)).map(entry => {
    const file = path.join(directory, entry.name);
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const order = Number(parsed.data.order);
    if (typeof parsed.data.title !== "string" || !parsed.data.title.trim()) throw new Error(`${file}: title이 필요합니다.`);
    if (!Number.isInteger(order) || order < 1) throw new Error(`${file}: order는 1 이상의 정수여야 합니다.`);
    if (typeof parsed.data.published !== "boolean") throw new Error(`${file}: published는 boolean이어야 합니다.`);
    const id = entry.name.replace(/\.md$/, "");
    const slug = [gradeId, semesterId, subjectId, id];
    const format = /<[A-Z][A-Za-z]*(?:\s|>)/.test(parsed.content) ? "mdx" as const : "md" as const;
    return {
      title: parsed.data.title.trim(), description: typeof parsed.data.description === "string" ? parsed.data.description : "",
      week: 0, order, published: parsed.data.published,
      gradeId, gradeName: catalogPath.grade.name, semesterId, semesterName: catalogPath.semester.name, subjectId, subjectName: catalogPath.subject.name,
      slug, path: `/practice/${slug.join("/")}`, kind: "practice" as const, content: parsed.content, format,
    };
  });
}

export function readAcademicPractice(): ContentDocument[] {
  const catalog = readCatalog();
  const documents = sortedGrades(catalog).flatMap(grade => [...grade.semesters].sort((a, b) => a.order - b.order).flatMap(semester => [...semester.subjects].sort((a, b) => a.order - b.order).flatMap(subject => readSubjectFiles(grade.id, semester.id, subject.id))));
  const positions = new Set<string>();
  for (const document of documents) {
    const position = `${document.gradeId}/${document.semesterId}/${document.subjectId}/${document.order}`;
    if (positions.has(position)) throw new Error(`족보의 과목 내 순서가 중복됩니다 (${document.path}).`);
    positions.add(position);
  }
  return documents.filter(document => document.published).sort((a, b) => {
    const aPath = findCatalogPath(catalog, a.gradeId!, a.semesterId!, a.subjectId!)!;
    const bPath = findCatalogPath(catalog, b.gradeId!, b.semesterId!, b.subjectId!)!;
    return aPath.grade.order - bPath.grade.order || aPath.semester.order - bPath.semester.order || aPath.subject.order - bPath.subject.order || a.order - b.order;
  });
}

export function resolvePracticeSource(slug: string[]): string | undefined {
  if (slug.length !== 4 || slug.some(part => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) return undefined;
  const [gradeId, semesterId, subjectId, documentId] = slug;
  if (!findCatalogPath(readCatalog(), gradeId, semesterId, subjectId) || !documentId.startsWith("exam-")) return undefined;
  const file = path.join(practiceRoot, gradeId, semesterId, subjectId, `${documentId}.md`);
  return fs.existsSync(file) ? file : undefined;
}
