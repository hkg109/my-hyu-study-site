import { isPracticePassword, practiceToken, PRACTICE_COOKIE, PRACTICE_COOKIE_MAX_AGE, safePracticePath } from "@/lib/access";

const redirect = (request: Request, path: string) => Response.redirect(new URL(path, request.url), 303);

export async function POST(request: Request) {
  const form = await request.formData().catch(() => undefined);
  const password = String(form?.get("password") ?? "");
  const next = safePracticePath(String(form?.get("next") ?? ""));

  if (!isPracticePassword(password)) {
    // A short delay makes guessing the password one attempt at a time slower.
    await new Promise(resolve => setTimeout(resolve, 600));
    return redirect(request, `/unlock?next=${encodeURIComponent(next)}&error=1`);
  }

  const response = redirect(request, next);
  const headers = new Headers(response.headers);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  headers.append("Set-Cookie", `${PRACTICE_COOKIE}=${practiceToken()}; Path=/; Max-Age=${PRACTICE_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`);
  return new Response(null, { status: 303, headers });
}
