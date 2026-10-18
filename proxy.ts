import { NextResponse, type NextRequest } from "next/server";
import { hasPracticeAccess, PRACTICE_COOKIE } from "@/lib/access";

// Lecture notes stay public; practice exams need the password from config/access.json.
export function proxy(request: NextRequest) {
  if (hasPracticeAccess(request.cookies.get(PRACTICE_COOKIE)?.value)) return NextResponse.next();
  const unlock = new URL("/unlock", request.url);
  unlock.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(unlock);
}

export const config = {
  matcher: ["/practice", "/practice/:path*"],
};
