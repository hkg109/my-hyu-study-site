import { contentFromDb } from "@/lib/content-source";
import { adminGuard } from "@/lib/server/auth";

// An exam's password, set from the site. Stored only as a hash in the database and used at once;
// each exam has its own, so changing one never affects another. Values are never sent back.

type Params = { params: Promise<{ slug: string[] }> };
const noStore = { "Cache-Control": "no-store" };
const fileMode = () => Response.json({ error: "족보 비밀번호는 DB 모드(CONTENT_SOURCE=db)에서 바꿀 수 있습니다." }, { status: 400 });

export async function GET(request: Request, { params }: Params) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  if (!contentFromDb()) return fileMode();
  const { dbExamPasswordStatus } = await import("@/lib/server/content-admin");
  const status = await dbExamPasswordStatus((await params).slug);
  return status ? Response.json(status, { headers: noStore }) : Response.json({ error: "족보를 찾을 수 없습니다." }, { status: 404 });
}

export async function PUT(request: Request, { params }: Params) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  if (!contentFromDb()) return fileMode();
  let body: { password?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  if (typeof body.password !== "string") return Response.json({ error: "비밀번호를 입력해 주세요." }, { status: 400 });
  const { slug } = await params;
  const { dbExamPasswordStatus, dbSetExamPassword } = await import("@/lib/server/content-admin");
  const result = await dbSetExamPassword(slug, body.password);
  if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
  return Response.json({ saved: true, ...(await dbExamPasswordStatus(slug)) }, { headers: noStore });
}
