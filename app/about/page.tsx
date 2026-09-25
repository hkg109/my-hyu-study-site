import fs from "node:fs";
import path from "node:path";
import { renderMDX } from "@/lib/mdx";
import { getAllLectures } from "@/lib/lectures";
import { readCatalog } from "@/lib/catalog";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "학습 노트 소개", description: "HJS STUDY의 과목별 학습 기록 방식을 소개합니다." };
export default async function AboutPage() {
  const { content } = await renderMDX(fs.readFileSync(path.join(process.cwd(), "content/about.mdx"), "utf8"));
  const lectures = getAllLectures();
  const catalog = readCatalog();
  return <div className="index-page about-page"><header className="page-title"><span className="eyebrow">ABOUT THE NOTES</span><h1>배운 내용을 오래 남기는 공간.</h1><p>학년과 학기, 과목별 기록을 한곳에서 관리합니다.</p></header><div className="prose">{content}<h2>현재 공개된 강의 정리</h2>{catalog.grades.map(grade => <section key={grade.id}><h3>{grade.name}</h3><ul>{lectures.filter(lecture => lecture.gradeId === grade.id).map(lecture => <li key={lecture.path}><Link href={lecture.path}>{lecture.semesterName} · {lecture.subjectName} · {lecture.title}</Link></li>)}</ul></section>)}</div><Footer /></div>;
}
