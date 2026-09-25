import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAllLectures } from "@/lib/lectures";
import { ContinueLearning } from "@/components/lecture/ContinueLearning";
import { AcademicCurriculum } from "@/components/lecture/AcademicCurriculum";
import { Footer } from "@/components/layout/Footer";
import { readCatalog } from "@/lib/catalog";

export default function HomePage() {
  const lectures = getAllLectures();
  const catalog = readCatalog();
  return <div className="index-page">
    <div className="page-kicker"><span className="eyebrow">HJS STUDY NOTE</span><span className="meta">과목별로 차곡차곡</span></div>
    <section className="home-hero"><div className="hero-copy"><div className="hero-label"><span className="status-dot" />HJS STUDY</div><h1>배운 내용을,<br /><span className="muted">나만의 노트로</span></h1><p>학년과 학기, 과목별 강의를 한곳에 정리합니다.<br className="desktop-break" />읽고 기록하며 오래 남는 학습 자료를 만듭니다.</p><div className="hero-actions"><Link href={lectures[0]?.path ?? "/lectures"} className="button primary">학습 시작하기<ArrowRight size={17} /></Link></div></div><ContinueLearning lectures={lectures} /></section>
    <div className="curriculum-heading"><div><span className="eyebrow">COURSE NOTES</span><h2>강의 정리</h2></div><span className="meta">{catalog.grades.length} GRADES <span className="separator">/</span> {lectures.length} LECTURES</span></div>
    {catalog.grades.length ? <AcademicCurriculum catalog={catalog} lectures={lectures} showDescriptions={false} /> : <div className="empty-state">새로운 강의를 준비하고 있습니다.</div>}
    <section className="practice-banner"><div className="practice-icon"><BookOpen size={25} /></div><div><h2>시험 자료도 한곳에서 확인하세요.</h2><p>Markdown으로 정리한 과목별 족보와 해설을 살펴봅니다.</p></div><Link href="/practice" className="text-link">족보 보기<ArrowRight size={17} /></Link></section>
    <Footer />
  </div>;
}
