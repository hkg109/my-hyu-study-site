import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readWeeks } from "./weeks";
import { findCatalogPath, readCatalog, sortedGrades } from "./catalog";
import type { ContentDocument } from "@/types/content";

const lecturesRoot = path.resolve(process.cwd(), "content", "lectures");
const pad = (value: number) => String(value).padStart(2, "0");

function academicFields(grade: { id: string; name: string }, semester: { id: string; name: string }, subject: { id: string; name: string }) {
  return { gradeId: grade.id, gradeName: grade.name, semesterId: semester.id, semesterName: semester.name, subjectId: subject.id, subjectName: subject.name };
}

function readSubjectFiles(gradeId: string, semesterId: string, subjectId: string): ContentDocument[] {
  const directory = path.join(lecturesRoot, gradeId, semesterId, subjectId);
  if (!fs.existsSync(directory)) return [];
  const catalogPath = findCatalogPath(readCatalog(), gradeId, semesterId, subjectId);
  if (!catalogPath) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).filter(entry => entry.isFile() && /^lecture-[a-z0-9-]+\.mdx?$/.test(entry.name)).map(entry => {
    const file = path.join(directory, entry.name);
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const order = Number(parsed.data.order);
    if (typeof parsed.data.title !== "string" || !parsed.data.title.trim()) throw new Error(`${file}: title이 필요합니다.`);
    if (!Number.isInteger(order) || order < 1) throw new Error(`${file}: order는 1 이상의 정수여야 합니다.`);
    if (typeof parsed.data.published !== "boolean") throw new Error(`${file}: published는 boolean이어야 합니다.`);
    const id = entry.name.replace(/\.mdx?$/, "");
    const slug = [gradeId, semesterId, subjectId, id];
    const format = path.extname(file) === ".mdx" || /<Answer(?:\s|>)/.test(parsed.content) ? "mdx" as const : "md" as const;
    return {
      title: parsed.data.title.trim(), description: typeof parsed.data.description === "string" ? parsed.data.description : "",
      week: 0, order, published: parsed.data.published,
      ...(Number.isInteger(parsed.data.duration) && parsed.data.duration > 0 && { duration: parsed.data.duration }),
      ...(Array.isArray(parsed.data.tags) && { tags: parsed.data.tags.filter((tag: unknown): tag is string => typeof tag === "string") }),
      ...(Array.isArray(parsed.data.objectives) && { objectives: parsed.data.objectives.filter((item: unknown): item is string => typeof item === "string") }),
      ...academicFields(catalogPath.grade, catalogPath.semester, catalogPath.subject),
      slug, path: `/lectures/${slug.join("/")}`, kind: "lectures" as const, content: parsed.content, format,
    };
  });
}

export function readAcademicLectures(): ContentDocument[] {
  const catalog = readCatalog();
  const documents: ContentDocument[] = [];
  for (const grade of sortedGrades(catalog)) for (const semester of [...grade.semesters].sort((a, b) => a.order - b.order)) for (const subject of [...semester.subjects].sort((a, b) => a.order - b.order)) {
    if (subject.legacySource === "weeks") {
      readWeeks().forEach((document, index) => {
        const id = `lecture-${pad(index + 1)}`;
        const slug = [grade.id, semester.id, subject.id, id];
        documents.push({ ...document, order: index + 1, ...academicFields(grade, semester, subject), slug, path: `/lectures/${slug.join("/")}` });
      });
    }
    documents.push(...readSubjectFiles(grade.id, semester.id, subject.id));
  }
  const paths = new Set<string>();
  const positions = new Set<string>();
  for (const document of documents) {
    const position = `${document.gradeId}/${document.semesterId}/${document.subjectId}/${document.order}`;
    if (paths.has(document.path) || positions.has(position)) throw new Error(`강의 경로 또는 과목 내 순서가 중복됩니다 (${document.path}).`);
    paths.add(document.path); positions.add(position);
  }
  return documents.filter(document => document.published).sort((a, b) => {
    const aPath = findCatalogPath(catalog, a.gradeId!, a.semesterId!, a.subjectId!)!;
    const bPath = findCatalogPath(catalog, b.gradeId!, b.semesterId!, b.subjectId!)!;
    return aPath.grade.order - bPath.grade.order || aPath.semester.order - bPath.semester.order || aPath.subject.order - bPath.subject.order || a.order - b.order;
  });
}

export function resolveLectureSource(slug: string[]): { file: string; legacyKey?: string } | undefined {
  if (slug.length !== 4 || slug.some(part => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) return undefined;
  const [gradeId, semesterId, subjectId, lectureId] = slug;
  const catalogPath = findCatalogPath(readCatalog(), gradeId, semesterId, subjectId);
  if (!catalogPath) return undefined;
  if (catalogPath.subject.legacySource === "weeks" && /^lecture-\d+$/.test(lectureId)) {
    const legacy = readWeeks()[Number(lectureId.slice(8)) - 1];
    if (legacy) return { file: path.join(process.cwd(), "content", "weeks", `${legacy.slug[0]}.md`), legacyKey: legacy.slug[0] };
  }
  for (const extension of [".md", ".mdx"]) {
    const file = path.join(lecturesRoot, gradeId, semesterId, subjectId, `${lectureId}${extension}`);
    if (fs.existsSync(file)) return { file };
  }
  return undefined;
}
