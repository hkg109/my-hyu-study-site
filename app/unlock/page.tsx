import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { getDocument } from "@/lib/content";
import { safePracticePath } from "@/lib/access";
import { isAdminViewer, practiceLockFor } from "@/lib/server/auth";

export const metadata = { title: "족보 잠금", description: "족보는 비밀번호를 입력해야 볼 수 있습니다.", robots: { index: false } };

export default async function UnlockPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  // Every exam has its own password, so the form always unlocks one specific exam.
  const slug = safePracticePath(next).split("/").slice(2);
  const doc = getDocument("practice", slug);
  if (!doc) redirect("/practice");
  // A signed-in local admin goes straight to the exam (development only).
  if (await isAdminViewer()) redirect(doc.path);
  // Visitors only learn that the exam can't be opened right now, never which setting is missing.
  const available = practiceLockFor(slug).ok;
  return <div className="index-page unlock-page">
    <section className="unlock-card" aria-labelledby="unlock-title">
      <div className="admin-dialog-icon"><LockKeyhole size={22} /></div>
      <h1 id="unlock-title">{available ? "비밀번호를 입력해주세요" : "지금은 열 수 없는 족보입니다"}</h1>
      {available ? <>
        <p><strong>{doc.title}</strong>을(를) 열려면 이 족보의 비밀번호가 필요합니다</p>
        <form method="post" action="/api/practice-access" className="admin-login-form">
          <input type="hidden" name="next" value={doc.path} />
          <label htmlFor="practice-password">비밀번호</label>
          <input id="practice-password" name="password" type="password" autoComplete="current-password" autoFocus required aria-invalid={Boolean(error)} aria-describedby={error ? "practice-password-error" : undefined} />
          {error && <p id="practice-password-error" className="admin-error" role="alert">비밀번호가 맞지 않습니다. 다시 입력해 주세요.</p>}
          <button className="button primary" type="submit">족보 열기</button>
        </form>
      </> : <p><strong>{doc.title}</strong>의 잠금 설정이 아직 준비되지 않았습니다. 잠시 후 다시 시도하거나 사이트 운영자에게 알려 주세요.</p>}
    </section>
  </div>;
}
