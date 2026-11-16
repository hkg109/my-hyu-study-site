import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDocument } from "@/lib/content";
import { safePracticePath } from "@/lib/access";
import { isAdminViewer, practiceLockFor } from "@/lib/server/auth";
import { questionCount } from "@/lib/document-stats";

export const metadata = { title: "족보 잠금", description: "족보는 비밀번호를 입력해야 볼 수 있습니다.", robots: { index: false } };

export default async function UnlockPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  // Every exam has its own password, so the form always unlocks one specific exam.
  const slug = safePracticePath(next).split("/").slice(2);
  const doc = await getDocument("practice", slug);
  if (!doc) redirect("/practice");
  // A signed-in admin goes straight to the exam.
  if (await isAdminViewer()) redirect(doc.path);
  // Visitors only learn that the exam can't be opened right now, never which setting is missing.
  const available = (await practiceLockFor(slug)).ok;
  return <div className="index-page unlock-page">
    <nav className="breadcrumb" aria-label="현재 위치"><Link href="/practice">족보</Link><span>/</span><span>{doc.subjectName}</span></nav>
    <section className="unlock-card" aria-labelledby="unlock-title">
      <div className="unlock-preview"><span className="eyebrow">족보 {String(doc.order).padStart(2, "0")} · {doc.subjectName}</span><h2>{doc.title}</h2><p>{doc.description}</p><div className="unlock-stats"><span><strong>{questionCount(doc.content, doc.format)}</strong>문항</span><span><strong>{doc.duration ? `${doc.duration}분` : "자율"}</strong>권장 시간</span></div><div className="unlock-includes"><span>정답·해설</span><span>포함</span></div><div className="unlock-includes"><span>시험지 양식 PDF</span><span>저장 가능</span></div></div>
      <div className="unlock-form-pane">
      <div className="admin-dialog-icon"><LockKeyhole size={22} /></div>
      <h1 id="unlock-title">{available ? "비밀번호가 필요해요" : "지금은 열 수 없는 족보입니다"}</h1>
      {available ? <>
        <p>스터디에서 받은 이 족보의 비밀번호를 입력하세요.</p>
        <form method="post" action="/api/practice-access" className="admin-login-form">
          <input type="hidden" name="next" value={doc.path} />
          <label htmlFor="practice-password">비밀번호</label>
          <input id="practice-password" name="password" type="password" autoComplete="current-password" autoFocus required aria-invalid={Boolean(error)} aria-describedby={error ? "practice-password-error" : undefined} />
          {error && <p id="practice-password-error" className="admin-error" role="alert">비밀번호가 맞지 않습니다. 다시 입력해 주세요.</p>}
          <button className="button primary" type="submit">족보 열기</button>
        </form>
      </> : <p><strong>{doc.title}</strong>의 잠금 설정이 아직 준비되지 않았습니다. 잠시 후 다시 시도하거나 사이트 운영자에게 알려 주세요.</p>}
      <Link className="unlock-back" href="/practice">← 족보 목록으로</Link>
      </div>
    </section>
  </div>;
}
