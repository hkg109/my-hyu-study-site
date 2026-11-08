import { notFound } from "next/navigation";
import { getAllLectures, getLectureBySlug, getSubjects } from "@/lib/lectures";
import { findSubject, hasContent } from "@/lib/subjects";
import { DocumentPage } from "@/components/lecture/DocumentPage";
import { SubjectPage } from "@/components/lecture/SubjectPage";

interface Props { params: Promise<{ slug: string[] }> }
// Only a three-part path can be a subject page; skip reading every exam for lecture pages.
const subjectFor = (slug: string[]) => slug.length === 3 ? findSubject(getSubjects(), slug) : undefined;
export const dynamicParams = true;
// Lectures live at /lectures/<grade>/<semester>/<subject>/<lecture>; the three-part prefix is the subject page.
export const generateStaticParams = () => [
  ...getSubjects().filter(hasContent).map(subject => ({ slug: [subject.gradeId, subject.semesterId, subject.subjectId] })),
  ...getAllLectures().map(lecture => ({ slug: lecture.slug })),
];
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const subject = subjectFor(slug);
  if (subject) return { title: subject.subjectName, description: `${subject.gradeName} ${subject.semesterName} ${subject.subjectName}의 강의 노트와 족보입니다.` };
  const lecture = getLectureBySlug(slug);
  if (!lecture) notFound();
  return { title: lecture.title, description: lecture.description };
}
export default async function LecturePage({ params }: Props) {
  const { slug } = await params;
  const subject = subjectFor(slug);
  if (subject) return <SubjectPage subject={subject} />;
  const lecture = getLectureBySlug(slug);
  if (!lecture) notFound();
  return <DocumentPage document={lecture} />;
}
