import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { accessKeyError } from "./access-keys";
import { findCatalogPath, readCatalog, sortedGrades } from "./catalog";
import type { ContentDocument } from "@/types/content";

const practiceRoot = path.resolve(process.cwd(), "content", "practice");

export type PracticeAccessReference = { accessKey?: string; error?: undefined } | { accessKey?: undefined; error: string };

// Exams name their password with a non-secret `accessKey`; the password itself lives in the environment.
// A bad reference only locks that exam (fail closed) instead of breaking every page that lists exams.
function readAccessReference(data: Record<string, unknown>): PracticeAccessReference {
  if (data.password !== undefined) return { error: "password 필드는 더 이상 쓰지 않습니다. 비밀번호는 환경변수에 두고 accessKey로 연결해 주세요." };
  if (data.accessKey === undefined) return {};
  const error = accessKeyError(data.accessKey);
  return error ? { error } : { accessKey: data.accessKey as string };
}

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

/** How many exam files (drafts included) use each valid accessKey. */
export function practiceAccessKeyUsage(): Map<string, number> {
  const usage = new Map<string, number>();
  const visit = (directory: string) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (/^exam-[a-z0-9-]+\.md$/.test(entry.name)) {
        const { accessKey } = readAccessReference(matter(fs.readFileSync(target, "utf8")).data);
        if (accessKey) usage.set(accessKey, (usage.get(accessKey) ?? 0) + 1);
      }
    }
  };
  visit(practiceRoot);
  return usage;
}

// The accessKey stays out of ContentDocument, which is sent to the browser.
export function practiceAccessReference(slug: string[]): PracticeAccessReference | undefined {
  if (!resolvePracticeSource(slug)) return undefined;
  const [gradeId, semesterId, subjectId, documentId] = slug;
  // Built inline under practiceRoot so the bundler traces only content/practice, not the whole project.
  return readAccessReference(matter(fs.readFileSync(path.join(practiceRoot, gradeId, semesterId, subjectId, `${documentId}.md`), "utf8")).data);
}
