import { adminGuard } from "@/lib/server/auth";
import { practiceAccessOverview } from "@/lib/server/practice-access";

// Lists the access keys exams use and whether their variables are set on this dev server.
// `?candidate=<key>` also reports one key that no exam uses yet.
export async function GET(request: Request) {
  const refusal = await adminGuard(request);
  if (refusal) return refusal;
  const candidate = new URL(request.url).searchParams.get("candidate") ?? undefined;
  return Response.json(practiceAccessOverview(candidate), { headers: { "Cache-Control": "no-store" } });
}
