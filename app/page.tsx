import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAllExams, getAllLectures, getSubjects } from "@/lib/lectures";
import { hasContent } from "@/lib/subjects";
import { ContinueLearning } from "@/components/lecture/ContinueLearning";
import { SubjectGrid } from "@/components/lecture/SubjectGrid";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const lectures = getAllLectures();
  const exams = getAllExams();
  const subjects = getSubjects().filter(hasContent);
  return <div className="index-page">
    <section className="home-hero"><div className="hero-copy"><div className="hero-label"><span className="status-dot" />HJS STUDY</div><h1>2026년도<br /><span className="muted">한지석 제작</span></h1><p>이해와 복습에 도움이 되는 학습 자료를 제공합니다<br className="desktop-break" />최대한 학습에 도움되는 자료로 만들었습니다</p><div className="hero-actions"><Link href={lectures[0]?.path ?? "/lectures"} className="button primary">학습 시작하기<ArrowRight size={17} /></Link></div></div><ContinueLearning lectures={lectures} exams={exams} /></section>
    <div className="curriculum-heading"><h2>과목별 학습</h2><span className="meta">{subjects.length}개 과목 · 강의 {lectures.length}개 · 족보 {exams.length}개</span></div>
    {subjects.length ? <SubjectGrid subjects={subjects} /> : <div className="empty-state">새로운 강의를 준비하고 있습니다.</div>}
    <div className="home-all-link"><Link prefetch={false} href="/lectures" className="text-link">전체 강의 목록 보기<ArrowRight size={16} /></Link></div>
    <section className="practice-banner"><div className="practice-icon"><BookOpen size={25} /></div><div><h2>시험 자료도 한곳에서 확인하세요.</h2><p>과목별 족보는 시험지 양식 PDF와 정답·해설지로 뽑을 수 있습니다.</p></div><Link href="/practice" className="text-link">족보 보기<ArrowRight size={17} /></Link></section>
    <Footer />
  </div>;
}
