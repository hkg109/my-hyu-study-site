import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { findCatalogPath, readCatalog } from "@/lib/catalog";
import { readAcademicPractice } from "@/lib/academic-practice";

const allowed = (request: Request) => process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "::1"].includes(new URL(request.url).hostname);

export async function POST(request: Request) {
  if (!allowed(request)) return Response.json({ error: "로컬 개발 환경에서만 족보를 만들 수 있습니다." }, { status: process.env.NODE_ENV === "development" ? 403 : 404 });
  let body: { gradeId?: unknown; semesterId?: unknown; subjectId?: unknown; title?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  const ids = [body.gradeId, body.semesterId, body.subjectId];
  if (!ids.every(value => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))) return Response.json({ error: "분류 정보가 올바르지 않습니다." }, { status: 400 });
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 120) return Response.json({ error: "제목은 1~120자로 입력해 주세요." }, { status: 400 });
  const [gradeId, semesterId, subjectId] = ids as string[];
  if (!findCatalogPath(readCatalog(), gradeId, semesterId, subjectId)) return Response.json({ error: "과목을 찾을 수 없습니다." }, { status: 404 });
  const subjectDocuments = readAcademicPractice().filter(item => item.gradeId === gradeId && item.semesterId === semesterId && item.subjectId === subjectId);
  const order = Math.max(0, ...subjectDocuments.map(item => item.order)) + 1;
  const id = `exam-${String(order).padStart(2, "0")}`;
  const directory = path.resolve(process.cwd(), "content", "practice", gradeId, semesterId, subjectId);
  const target = path.resolve(directory, `${id}.md`);
  if (!target.startsWith(`${directory}${path.sep}`)) return Response.json({ error: "저장 경로가 올바르지 않습니다." }, { status: 400 });
  const content = matter.stringify("# 새 족보\n\n여기에 시험 자료와 해설을 작성하세요.\n", { title, description: "", order, published: true });
  try {
    await mkdir(directory, { recursive: true });
    await writeFile(target, content, { encoding: "utf8", flag: "wx" });
    const documentPath = `/practice/${gradeId}/${semesterId}/${subjectId}/${id}`;
    revalidatePath("/", "layout"); revalidatePath(documentPath);
    return Response.json({ created: true, path: documentPath, file: path.relative(process.cwd(), target) });
  } catch (error) {
    console.error("Failed to create exam note:", error);
    return Response.json({ error: "새 족보를 만들지 못했습니다. 순서가 중복되었는지 확인해 주세요." }, { status: 500 });
  }
}
