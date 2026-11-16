import { Footer } from "@/components/layout/Footer";
import { getCollectionWithBodies, withoutBody } from "@/lib/content";
import { PracticeList } from "@/components/lecture/PracticeList";
import { questionCount } from "@/lib/document-stats";
export const metadata = { title: "족보", description: "과목별 시험 자료와 정리 노트입니다." };
export default async function PracticePage() {
  const exams = (await getCollectionWithBodies("practice")).map(document => ({ ...withoutBody(document), questionCount: questionCount(document.content, document.format) }));
  return <div className="index-page practice-index"><PracticeList exams={exams} /><Footer /></div>;
}
