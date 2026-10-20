import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { readAcademicLectures } from "@/lib/academic-lectures";
import { findCatalogPath, readCatalog } from "@/lib/catalog";
import { nextDocumentSlot } from "@/lib/note-files";
import { findTemplate, type TemplateKind } from "@/lib/note-templates";
import { parseAccessChoice } from "./practice-access";

// Creates a new lecture note or exam from a template. Templates never touch existing files:
// the file is opened with the "wx" flag, so a repeated or racing request fails instead of overwriting.

const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const label = (kind: TemplateKind) => kind === "practice" ? "족보" : "강의 노트";
const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function createDocumentFromTemplate(kind: TemplateKind, request: Request) {
  let body: { gradeId?: unknown; semesterId?: unknown; subjectId?: unknown; title?: unknown; templateId?: unknown; access?: unknown };
  try { body = await request.json(); }
  catch { return fail(400, "요청 내용을 읽을 수 없습니다."); }
  const { gradeId, semesterId, subjectId } = body;
  if (!validId(gradeId) || !validId(semesterId) || !validId(subjectId)) return fail(400, "분류 정보가 올바르지 않습니다.");
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 120) return fail(400, "제목은 1~120자로 입력해 주세요.");
  const template = findTemplate(kind, body.templateId);
  if (!template) return fail(400, `${label(kind)}에 쓸 수 없는 템플릿입니다.`);
  let accessKey: string | undefined;
  if (kind === "practice") {
    const parsed = parseAccessChoice(body.access);
    if ("error" in parsed) return fail(400, parsed.error);
    if (parsed.choice.mode === "key") accessKey = parsed.choice.accessKey;
  }
  if (!findCatalogPath(readCatalog(), gradeId, semesterId, subjectId)) return fail(404, "과목을 찾을 수 없습니다.");

  const directory = path.resolve(process.cwd(), "content", kind, gradeId, semesterId, subjectId);
  // Legacy week-based notes have no files here but still occupy lecture orders.
  const legacyOrders = kind === "lectures" ? readAcademicLectures().filter(item => item.gradeId === gradeId && item.semesterId === semesterId && item.subjectId === subjectId).map(item => item.order) : [];
  const { order, id } = nextDocumentSlot(kind, directory, legacyOrders);
  const target = path.resolve(directory, `${id}.md`);
  if (!target.startsWith(`${directory}${path.sep}`)) return fail(400, "저장 경로가 올바르지 않습니다.");
  const content = matter.stringify(template.body(kind), { title, description: "", order, published: true, ...(accessKey && { accessKey }) });
  try {
    await mkdir(directory, { recursive: true });
    await writeFile(target, content, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return fail(409, `같은 번호의 ${label(kind)} 파일(${id}.md)이 이미 있어 만들지 않았습니다. 목록을 새로고침한 뒤 다시 시도해 주세요.`);
    console.error(`Failed to create ${kind} document:`, error instanceof Error ? error.message : error);
    return fail(500, `새 ${label(kind)}를 만들지 못했습니다. 파일 쓰기 권한과 폴더를 확인해 주세요.`);
  }
  const documentPath = `/${kind}/${gradeId}/${semesterId}/${subjectId}/${id}`;
  revalidatePath("/", "layout"); revalidatePath(documentPath);
  return Response.json({ created: true, path: documentPath, file: path.relative(process.cwd(), target), templateId: template.id, order });
}
