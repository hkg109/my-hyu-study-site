import type { Metadata } from "next";
import { getAllLectures } from "@/lib/lectures";
import { AcademicCurriculum } from "@/components/lecture/AcademicCurriculum";
import { Footer } from "@/components/layout/Footer";
import { readCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "강의 정리", description: "학년, 학기, 과목별로 정리한 강의 노트를 살펴보세요." };
export default function LecturesPage() {
  const lectures = getAllLectures();
  const catalog = readCatalog();
  return <div className="index-page"><header className="page-title"><span className="eyebrow">COURSE NOTES</span><h1>강의 정리</h1><p>학년, 학기, 과목별로 배운 내용을 정리합니다.</p><span className="meta">{catalog.grades.length}개 학년 · {lectures.length}개 강의</span></header>{catalog.grades.length ? <AcademicCurriculum catalog={catalog} lectures={lectures} /> : <div className="empty-state">강의를 준비하고 있습니다.</div>}<Footer /></div>;
}
