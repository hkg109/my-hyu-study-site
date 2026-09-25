import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { resolveLectureSource } from "@/lib/academic-lectures";
import { resolvePracticeSource } from "@/lib/academic-practice";

const MAX_NOTE_BYTES = 2 * 1024 * 1024;
const localRequest = (request: Request) => {
  const hostname = new URL(request.url).hostname;
  return process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "::1"].includes(hostname);
};

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  if (!localRequest(request)) return Response.json({ error: "로컬 개발 환경에서만 저장할 수 있습니다." }, { status: process.env.NODE_ENV === "development" ? 403 : 404 });
  const { slug } = await params;
  let body: { kind?: unknown; content?: unknown; title?: unknown; description?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  if (body.kind !== "lectures" && body.kind !== "practice") return Response.json({ error: "수정할 수 없는 문서 종류입니다." }, { status: 400 });

  if (body.kind === "practice") {
    const target = resolvePracticeSource(slug);
    if (!target) return Response.json({ error: "올바르지 않은 족보 파일입니다." }, { status: 400 });
    try {
      const parsed = matter(await readFile(target, "utf8"));
      if (typeof body.title === "string" && typeof body.description === "string") {
        const title = body.title.trim();
        const description = body.description.trim();
        if (!title || title.length > 120 || description.length > 300) return Response.json({ error: "제목 또는 설명 길이를 확인해 주세요." }, { status: 400 });
        parsed.data.title = title; parsed.data.description = description;
      } else if (typeof body.content === "string" && Buffer.byteLength(body.content, "utf8") <= MAX_NOTE_BYTES) parsed.content = body.content;
      else return Response.json({ error: "족보 내용이 올바르지 않거나 너무 큽니다." }, { status: 400 });
      await writeFile(target, matter.stringify(parsed.content, parsed.data), "utf8");
      revalidatePath("/practice"); revalidatePath(`/practice/${slug.join("/")}`);
      return Response.json({ saved: true, file: path.relative(process.cwd(), target) });
    } catch (error) {
      console.error("Failed to save exam document:", error);
      return Response.json({ error: "족보 파일을 저장하지 못했습니다." }, { status: 500 });
    }
  }

  const source = resolveLectureSource(slug);
  if (!source) return Response.json({ error: "올바르지 않은 강의 노트입니다." }, { status: 400 });
  try {
    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (!title || title.length > 120) return Response.json({ error: "제목은 1~120자로 입력해 주세요." }, { status: 400 });
      if (source.legacyKey) {
        const titlesFile = path.resolve(process.cwd(), "content", "weeks", "titles.json");
        let titles: Record<string, string> = {};
        try { titles = JSON.parse(await readFile(titlesFile, "utf8")) as Record<string, string>; } catch { /* Recreate a missing legacy title map. */ }
        titles[source.legacyKey] = title;
        await writeFile(titlesFile, `${JSON.stringify(titles, null, 2)}\n`, "utf8");
      } else {
        const parsed = matter(await readFile(source.file, "utf8"));
        parsed.data.title = title;
        await writeFile(source.file, matter.stringify(parsed.content, parsed.data), "utf8");
      }
    } else if (typeof body.content === "string" && Buffer.byteLength(body.content, "utf8") <= MAX_NOTE_BYTES) {
      if (source.legacyKey) await writeFile(source.file, body.content, "utf8");
      else {
        const parsed = matter(await readFile(source.file, "utf8"));
        parsed.content = body.content;
        await writeFile(source.file, matter.stringify(parsed.content, parsed.data), "utf8");
      }
    } else return Response.json({ error: "노트 내용이 올바르지 않거나 너무 큽니다." }, { status: 400 });
    const documentPath = `/lectures/${slug.join("/")}`;
    revalidatePath(documentPath); revalidatePath("/", "layout");
    return Response.json({ saved: true, file: path.relative(process.cwd(), source.file) });
  } catch (error) {
    console.error("Failed to save lecture note:", error);
    return Response.json({ error: "강의 노트를 저장하지 못했습니다." }, { status: 500 });
  }
}
