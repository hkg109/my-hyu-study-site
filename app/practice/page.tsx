import { AcademicCurriculum } from "@/components/lecture/AcademicCurriculum";
import { Footer } from "@/components/layout/Footer";
import { readCatalog } from "@/lib/catalog";
import { getAllExams, getSubjects } from "@/lib/lectures";
export const metadata = { title: "족보", description: "과목별 시험 자료와 정리 노트입니다." };
export default function PracticePage() {
  const catalog = readCatalog();
  const exams = getAllExams();
  return <div className="index-page"><header className="page-title"><h1>족보</h1><p>학년, 학기, 과목별 시험 자료와 해설을 정리합니다.</p><span className="meta">{getSubjects().filter(subject => subject.exams.length).length}개 과목 · {exams.length}개 족보 · PDF는 시험지 양식으로 저장됩니다</span></header><AcademicCurriculum catalog={catalog} lectures={exams} itemLabel="족보" /><Footer /></div>;
}
