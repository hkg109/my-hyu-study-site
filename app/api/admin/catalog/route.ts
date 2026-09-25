import { writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { catalogFile, readCatalog } from "@/lib/catalog";
import { readAcademicLectures } from "@/lib/academic-lectures";
import { readAcademicPractice } from "@/lib/academic-practice";

type Level = "grade" | "semester" | "subject";
const allowed = (request: Request) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "::1"].includes(new URL(request.url).hostname);
const cleanName = (value: unknown) => typeof value === "string" ? value.trim() : "";
const nextId = (level: Level) => `${level}-${Date.now().toString(36)}`;

export async function POST(request: Request) {
  if (!allowed(request)) return Response.json({ error: "로컬 개발 환경에서만 수정할 수 있습니다." }, { status: process.env.NODE_ENV === "development" ? 403 : 404 });
  let body: { action?: unknown; level?: unknown; name?: unknown; gradeId?: unknown; semesterId?: unknown; subjectId?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  if (!["add", "rename", "delete"].includes(String(body.action)) || !["grade", "semester", "subject"].includes(String(body.level))) return Response.json({ error: "지원하지 않는 작업입니다." }, { status: 400 });
  const action = body.action as "add" | "rename" | "delete";
  const level = body.level as Level;
  const name = cleanName(body.name);
  if (action !== "delete" && (!name || name.length > 60)) return Response.json({ error: "이름은 1~60자로 입력해 주세요." }, { status: 400 });
  const catalog = readCatalog();
  const grade = catalog.grades.find(item => item.id === body.gradeId);
  const semester = grade?.semesters.find(item => item.id === body.semesterId);
  const subject = semester?.subjects.find(item => item.id === body.subjectId);
  const duplicate = (names: string[]) => names.some(item => item.localeCompare(name, "ko", { sensitivity: "base" }) === 0);

  if (action === "delete") {
    if (level === "grade") {
      if (!grade) return Response.json({ error: "삭제할 학년을 찾을 수 없습니다." }, { status: 404 });
      if (grade.semesters.length) return Response.json({ error: "학기가 남아 있는 학년은 삭제할 수 없습니다. 하위 학기를 먼저 삭제해 주세요." }, { status: 409 });
      catalog.grades = catalog.grades.filter(item => item.id !== grade.id);
    } else if (level === "semester") {
      if (!grade || !semester) return Response.json({ error: "삭제할 학기를 찾을 수 없습니다." }, { status: 404 });
      if (semester.subjects.length) return Response.json({ error: "과목이 남아 있는 학기는 삭제할 수 없습니다. 하위 과목을 먼저 삭제해 주세요." }, { status: 409 });
      grade.semesters = grade.semesters.filter(item => item.id !== semester.id);
    } else {
      if (!semester || !subject) return Response.json({ error: "삭제할 과목을 찾을 수 없습니다." }, { status: 404 });
      const hasLectures = readAcademicLectures().some(item => item.gradeId === grade?.id && item.semesterId === semester.id && item.subjectId === subject.id);
      const hasExams = readAcademicPractice().some(item => item.gradeId === grade?.id && item.semesterId === semester.id && item.subjectId === subject.id);
      if (hasLectures || hasExams) return Response.json({ error: "강의 노트 또는 족보가 남아 있는 과목은 삭제할 수 없습니다." }, { status: 409 });
      semester.subjects = semester.subjects.filter(item => item.id !== subject.id);
    }
  } else if (action === "add") {
    if (level === "grade") {
      if (duplicate(catalog.grades.map(item => item.name))) return Response.json({ error: "같은 이름의 학년이 있습니다." }, { status: 409 });
      catalog.grades.push({ id: nextId(level), name, order: Math.max(0, ...catalog.grades.map(item => item.order)) + 1, semesters: [] });
    } else if (level === "semester" && grade) {
      if (duplicate(grade.semesters.map(item => item.name))) return Response.json({ error: "같은 이름의 학기가 있습니다." }, { status: 409 });
      grade.semesters.push({ id: nextId(level), name, order: Math.max(0, ...grade.semesters.map(item => item.order)) + 1, subjects: [] });
    } else if (level === "subject" && semester) {
      if (duplicate(semester.subjects.map(item => item.name))) return Response.json({ error: "같은 이름의 과목이 있습니다." }, { status: 409 });
      semester.subjects.push({ id: nextId(level), name, order: Math.max(0, ...semester.subjects.map(item => item.order)) + 1 });
    } else return Response.json({ error: "상위 분류를 찾을 수 없습니다." }, { status: 404 });
  } else {
    const target = level === "grade" ? grade : level === "semester" ? semester : subject;
    if (!target) return Response.json({ error: "수정할 분류를 찾을 수 없습니다." }, { status: 404 });
    const siblings = level === "grade" ? catalog.grades : level === "semester" ? grade!.semesters : semester!.subjects;
    if (siblings.some(item => item.id !== target.id && item.name.localeCompare(name, "ko", { sensitivity: "base" }) === 0)) return Response.json({ error: "같은 이름의 분류가 있습니다." }, { status: 409 });
    target.name = name;
  }
  await writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  revalidatePath("/", "layout");
  return Response.json({ saved: true, catalog });
}
