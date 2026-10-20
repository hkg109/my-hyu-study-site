import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, adminRequestError, isPasswordMatch } from "@/lib/access";
import { adminCookieOptions, adminCookieValue, adminLoginTarget, endAdminSessions } from "@/lib/server/auth";

// Signing in can't require a session yet, so it runs the same local/origin checks with signedIn forced.
const refuse = (request: Request) => {
  const refusal = adminRequestError({ nodeEnv: process.env.NODE_ENV, url: request.url, origin: request.headers.get("origin"), host: request.headers.get("host"), mutation: true, signedIn: true });
  return refusal && Response.json({ error: refusal.error }, { status: refusal.status });
};

export async function POST(request: Request) {
  const refusal = refuse(request);
  if (refusal) return refusal;
  let body: { password?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  const target = adminLoginTarget();
  if ("error" in target) return Response.json({ error: target.error }, { status: 503 });
  if (typeof body.password !== "string" || !isPasswordMatch(body.password, target.credential.adminPassword)) {
    // A short delay makes guessing the password one attempt at a time slower.
    await new Promise(resolve => setTimeout(resolve, 600));
    return Response.json({ error: "비밀번호가 맞지 않습니다." }, { status: 401 });
  }
  (await cookies()).set(ADMIN_COOKIE_NAME, adminCookieValue(target.credential), adminCookieOptions);
  return Response.json({ admin: true });
}

export async function DELETE(request: Request) {
  const refusal = refuse(request);
  if (refusal) return refusal;
  endAdminSessions();
  (await cookies()).delete({ name: ADMIN_COOKIE_NAME, path: "/" });
  return Response.json({ admin: false });
}
