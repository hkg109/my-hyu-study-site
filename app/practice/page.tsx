import { AcademicCurriculum } from "@/components/lecture/AcademicCurriculum";
import { Footer } from "@/components/layout/Footer";
import { readCatalog } from "@/lib/catalog";
import { readCollection, withoutBody } from "@/lib/content";
export const metadata = { title: "족보", description: "과목별 시험 자료와 정리 노트입니다." };
export default function PracticePage() {
  const catalog = readCatalog();
  const exams = readCollection("practice").map(withoutBody);
  return <div className="index-page"><header className="page-title"><span className="eyebrow">PAST EXAMS</span><h1>족보</h1><p>학년, 학기, 과목별 시험 자료와 해설을 정리합니다.</p><span className="meta">{catalog.grades.length}개 학년 · {exams.length}개 족보</span></header><AcademicCurriculum catalog={catalog} lectures={exams} itemLabel="족보" /><Footer /></div>;
}
