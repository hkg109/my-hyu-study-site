import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import { accessKeyError } from "@/lib/access-keys";
import { findCatalogPath } from "@/lib/catalog";
import { getCatalog } from "@/lib/content";
import { contentFromDb } from "@/lib/content-source";
import { adminGuard } from "@/lib/server/auth";
import { guessTitle, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_MARKDOWN_BYTES, rewriteImageReferences, safeFileName } from "@/lib/upload-markdown";

// Creates a lecture note or exam from an uploaded .md file plus the images it uses (svg/png/jpg/webp/gif).
// Images go to the public "materials" bucket under uploads/<subject>/<document>/, and the markdown's
// references to them are rewritten to their public URLs. DB content only: a deployment can't write files.

const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  if (!contentFromDb()) return fail(400, "MD 파일 올리기는 DB 모드(CONTENT_SOURCE=db)에서만 쓸 수 있습니다.");

  const form = await request.formData().catch(() => undefined);
  if (!form) return fail(400, "요청 내용을 읽을 수 없습니다.");
  const kind = form.get("kind");
  const gradeId = form.get("gradeId"), semesterId = form.get("semesterId"), subjectId = form.get("subjectId");
  if (kind !== "lectures" && kind !== "practice") return fail(400, "문서 종류가 올바르지 않습니다.");
  if (!validId(gradeId) || !validId(semesterId) || !validId(subjectId)) return fail(400, "분류 정보가 올바르지 않습니다.");
  if (!findCatalogPath(await getCatalog(), gradeId, semesterId, subjectId)) return fail(404, "과목을 찾을 수 없습니다.");

  const markdown = form.get("markdown");
  if (!(markdown instanceof File) || !/\.(md|mdx|markdown)$/i.test(markdown.name)) return fail(400, "MD 파일을 하나 골라 주세요.");
  if (markdown.size > MAX_MARKDOWN_BYTES) return fail(400, "MD 파일은 2MB 이하여야 합니다.");
  const images = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  for (const image of images) {
    const ext = image.name.split(".").pop()?.toLowerCase() ?? "";
    if (!IMAGE_TYPES[ext]) return fail(400, `${image.name}: svg, png, jpg, webp, gif 그림만 올릴 수 있습니다.`);
    if (image.size > MAX_IMAGE_BYTES) return fail(400, `${image.name}: 그림 하나는 5MB 이하여야 합니다.`);
  }

  const parsed = matter((await markdown.text()).replace(/\r\n/g, "\n"));
  const typedTitle = String(form.get("title") ?? "").trim();
  const title = (typedTitle || guessTitle(parsed.data.title, parsed.content, markdown.name)).slice(0, 120);
  const description = typeof parsed.data.description === "string" ? parsed.data.description.slice(0, 300) : "";

  // Exams: which password unlocks this one (and optionally a new password for it)
  let accessKey: string | undefined;
  const accessMode = form.get("accessMode");
  if (kind === "practice" && accessMode === "key") {
    const key = String(form.get("accessKey") ?? "");
    const error = accessKeyError(key);
    if (error) return fail(400, error);
    accessKey = key;
  }
  const password = String(form.get("password") ?? "");
  if (password && (password.length < 4 || password.length > 100)) return fail(400, "비밀번호는 4~100자로 입력해 주세요.");

  const admin = await import("@/lib/server/content-admin");
  const { order, slug } = await admin.dbNextSlot(kind, gradeId, semesterId, subjectId);

  // Upload images first, so the document is only created once every picture it needs is in place.
  const storage = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } }).storage.from("materials");
  const uploaded = new Map<string, string>();
  for (const image of images) {
    const name = safeFileName(image.name);
    const objectPath = `uploads/${subjectId}/${kind === "practice" ? "exam" : "lecture"}-${slug.split("-").pop()}/${name}`;
    const ext = name.split(".").pop()!.toLowerCase();
    const { error } = await storage.upload(objectPath, await image.arrayBuffer(), { upsert: true, contentType: IMAGE_TYPES[ext] });
    if (error) return fail(500, `${image.name}을(를) 올리지 못했습니다: ${error.message}`);
    uploaded.set(name, storage.getPublicUrl(objectPath).data.publicUrl);
  }
  const body = rewriteImageReferences(parsed.content, uploaded);

  const meta: Record<string, unknown> = {};
  if (Number.isInteger(parsed.data.duration) && parsed.data.duration > 0) meta.duration = parsed.data.duration;
  for (const field of ["tags", "objectives"] as const) {
    if (Array.isArray(parsed.data[field])) meta[field] = parsed.data[field].filter((item: unknown) => typeof item === "string");
  }

  if (kind === "practice") {
    if (password) {
      const { error } = await admin.dbSetPracticeKeyPassword(accessKey ?? "default", password);
      if (error) return fail(400, error);
    } else if (accessKey) await admin.dbEnsurePracticeKey(accessKey);
  }
  const result = await admin.dbUpsertDocument({
    kind, gradeId, semesterId, subjectId, slug, order, title, description, body, meta,
    format: /<[A-Z][A-Za-z]*(?:\s|>)/.test(body) ? "mdx" : "md", accessKey,
  });
  if ("error" in result) return fail(409, result.error ?? "문서를 만들지 못했습니다.");
  return Response.json({ created: true, path: result.path, images: uploaded.size });
}
