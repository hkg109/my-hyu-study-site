import { getDocument } from "@/lib/content";
import { practicePasswordFor } from "@/lib/academic-practice";
import { isPracticePassword, practiceCookieName, practiceToken, PRACTICE_COOKIE_MAX_AGE, safePracticePath } from "@/lib/access";

const redirect = (request: Request, path: string) => Response.redirect(new URL(path, request.url), 303);

export async function POST(request: Request) {
  const form = await request.formData().catch(() => undefined);
  const password = String(form?.get("password") ?? "");
  const next = safePracticePath(String(form?.get("next") ?? ""));
  const slug = next.split("/").slice(2);
  const doc = getDocument("practice", slug);
  const examPassword = doc && practicePasswordFor(slug);
  if (!doc || !examPassword) return redirect(request, "/practice");

  if (!isPracticePassword(password, examPassword)) {
    // A short delay makes guessing the password one attempt at a time slower.
    await new Promise(resolve => setTimeout(resolve, 600));
    return redirect(request, `/unlock?next=${encodeURIComponent(doc.path)}&error=1`);
  }

  const response = redirect(request, doc.path);
  const headers = new Headers(response.headers);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  headers.append("Set-Cookie", `${practiceCookieName(doc.path)}=${practiceToken(doc.path, examPassword)}; Path=${doc.path}; Max-Age=${PRACTICE_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`);
  return new Response(null, { status: 303, headers });
}
