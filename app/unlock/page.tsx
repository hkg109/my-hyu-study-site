import { LockKeyhole } from "lucide-react";
import { safePracticePath } from "@/lib/access";

export const metadata = { title: "족보 잠금", description: "족보는 비밀번호를 입력해야 볼 수 있습니다.", robots: { index: false } };

export default async function UnlockPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return <div className="index-page unlock-page">
    <section className="unlock-card" aria-labelledby="unlock-title">
      <div className="admin-dialog-icon"><LockKeyhole size={22} /></div>
      <h1 id="unlock-title">비밀번호를 입력해주세요</h1>
      <p>강의 정리는 누구나 볼 수 있고, 족보는 비밀번호를 아는 사람만 열 수 있어요.</p>
      <form method="post" action="/api/practice-access" className="admin-login-form">
        <input type="hidden" name="next" value={safePracticePath(next)} />
        <label htmlFor="practice-password">비밀번호</label>
        <input id="practice-password" name="password" type="password" inputMode="numeric" autoComplete="current-password" autoFocus required aria-invalid={Boolean(error)} aria-describedby={error ? "practice-password-error" : undefined} />
        {error && <p id="practice-password-error" className="admin-error" role="alert">비밀번호가 맞지 않습니다. 다시 입력해 주세요.</p>}
        <button className="button primary" type="submit">족보 열기</button>
      </form>
    </section>
  </div>;
}
