import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isPasswordMatch } from "@/lib/access";
import { adminAvailable, adminCookieOptions, adminCookieValue, adminLoginTarget, adminRefusal, endAdminSessions, isAdminViewer } from "@/lib/server/auth";

// Pages are static, so the browser asks here whether this visitor is signed in (the cookie is HttpOnly).
export async function GET() {
  return Response.json({ available: adminAvailable(), admin: await isAdminViewer() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Signing in can't require a session yet, so it runs the same availability/origin checks with signedIn forced.
  const refusal = await adminRefusal(request, { mutation: true, signedIn: true });
  if (refusal) return refusal;
  let body: { password?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }
  const target = adminLoginTarget();
  if ("error" in target) return Response.json({ error: target.error }, { status: 503 });
  if (typeof body.password !== "string" || !isPasswordMatch(body.password, target.credential.adminPassword)) {
    // A short delay makes guessing the password one attempt at a time slower.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Response.json({ error: "비밀번호가 맞지 않습니다." }, { status: 401 });
  }
  (await cookies()).set(ADMIN_COOKIE_NAME, adminCookieValue(target.credential), adminCookieOptions());
  return Response.json({ admin: true });
}

export async function DELETE(request: Request) {
  const refusal = await adminRefusal(request, { mutation: true, signedIn: true });
  if (refusal) return refusal;
  endAdminSessions();
  (await cookies()).delete({ name: ADMIN_COOKIE_NAME, path: "/" });
  return Response.json({ admin: false });
}
