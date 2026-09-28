import { ReviewDashboard } from "@/components/study/ReviewDashboard";
import { getAllLectures } from "@/lib/lectures";
import { readCollection } from "@/lib/content";

export const metadata = { title: "복습", description: "형광펜, 메모, 북마크와 오답을 한곳에서 복습합니다." };

export default function ReviewPage() {
  const documents = [...getAllLectures(), ...readCollection("practice")].map(document => ({ path: document.path, title: document.title, grade: document.gradeName ?? "기타", semester: document.semesterName ?? "기타", subject: document.subjectName ?? (document.kind === "practice" ? "족보" : "기타") }));
  return <ReviewDashboard documents={documents} />;
}
