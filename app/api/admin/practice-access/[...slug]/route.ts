import { readFile, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { resolvePracticeSource } from "@/lib/academic-practice";
import { contentFromDb } from "@/lib/content-source";
import { setFrontmatterField } from "@/lib/frontmatter-edit";
import { adminGuard } from "@/lib/server/auth";
import { parseAccessChoice, practiceAccessOverview, practiceDocumentAccess } from "@/lib/server/practice-access";

type Params = { params: Promise<{ slug: string[] }> };
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request, { params }: Params) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  const { slug } = await params;
  if (contentFromDb()) {
    const { dbPracticeAccessOverview, dbPracticeDocumentAccess } = await import("@/lib/server/content-admin");
    const access = await dbPracticeDocumentAccess(slug);
    if (!access) return Response.json({ error: "족보를 찾을 수 없습니다." }, { status: 404 });
    return Response.json({ access, overview: await dbPracticeAccessOverview() }, { headers: noStore });
  }
  const access = practiceDocumentAccess(slug);
  if (!access) return Response.json({ error: "족보를 찾을 수 없습니다." }, { status: 404 });
  return Response.json({ access, overview: practiceAccessOverview() }, { headers: noStore });
}

// File mode: only the accessKey line changes; the title, body and every other frontmatter line stay byte-for-byte.
// DB mode: also sets the key's password when one is sent (stored as a hash).
export async function PUT(request: Request, { params }: Params) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  const { slug } = await params;
  let body: { password?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  const parsed = parseAccessChoice(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  const { choice } = parsed;

  if (contentFromDb()) {
    const { dbPracticeAccessOverview, dbPracticeDocumentAccess, dbSetPracticeAccess } = await import("@/lib/server/content-admin");
    const password = typeof body.password === "string" && body.password ? body.password : undefined;
    const result = await dbSetPracticeAccess(slug, choice, password);
    if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
    return Response.json({ saved: true, access: await dbPracticeDocumentAccess(slug), overview: await dbPracticeAccessOverview() }, { headers: noStore });
  }

  const file = resolvePracticeSource(slug);
  if (!file) return Response.json({ error: "족보를 찾을 수 없습니다." }, { status: 404 });
  const current = practiceDocumentAccess(slug);
  const unchanged = current && !current.problem && (choice.mode === "default" ? current.mode === "default" : current.accessKey === choice.accessKey);
  if (unchanged) return Response.json({ saved: true, access: current, overview: practiceAccessOverview() }, { headers: noStore });
  try {
    const source = await readFile(file, "utf8");
    // A leftover plaintext `password` line is dropped too, since saving here means the exam now uses an env var.
    const next = setFrontmatterField(setFrontmatterField(source, "password", undefined), "accessKey", choice.mode === "key" ? choice.accessKey : undefined);
    if (next !== source) await writeFile(file, next, "utf8");
    revalidatePath("/practice"); revalidatePath(`/practice/${slug.join("/")}`);
    return Response.json({ saved: true, access: practiceDocumentAccess(slug), overview: practiceAccessOverview() }, { headers: noStore });
  } catch (error) {
    console.error("Failed to save exam access settings:", error instanceof Error ? error.message : error);
    return Response.json({ error: "접근 설정을 저장하지 못했습니다. 파일의 frontmatter를 확인해 주세요." }, { status: 500 });
  }
}
