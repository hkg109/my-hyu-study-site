import { accessKeyError } from "@/lib/access-keys";
import { contentFromDb } from "@/lib/content-source";
import { adminGuard } from "@/lib/server/auth";
import { practiceAccessOverview } from "@/lib/server/practice-access";

// Lists the access keys exams use and whether each has a password (DB) or a variable on this dev server (files).
// `?candidate=<key>` also reports one key that no exam uses yet.
export async function GET(request: Request) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  const raw = new URL(request.url).searchParams.get("candidate") ?? undefined;
  if (contentFromDb()) {
    const { dbPracticeAccessOverview } = await import("@/lib/server/content-admin");
    const candidate = raw !== undefined && !accessKeyError(raw) ? raw : undefined;
    return Response.json(await dbPracticeAccessOverview(candidate), { headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(practiceAccessOverview(raw), { headers: { "Cache-Control": "no-store" } });
}
