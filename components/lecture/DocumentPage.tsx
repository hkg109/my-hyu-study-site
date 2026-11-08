import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { renderMDX } from "@/lib/mdx";
import { getAllExams, getPrevNextLecture } from "@/lib/lectures";
import type { ContentDocument } from "@/types/content";
import { PageTOC } from "@/components/layout/PageTOC";
import { MobileTOC } from "@/components/layout/MobileTOC";
import { Footer } from "@/components/layout/Footer";
import { LectureHeader } from "./LectureHeader";
import { LearningObjectives } from "./LearningObjectives";
import { ProgressCheck } from "./ProgressCheck";
import { PrevNextNavigation } from "./PrevNextNavigation";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { PrintLectureButton } from "./PrintLectureButton";
import { StudyWorkspace } from "@/components/study/StudyWorkspace";
import { PracticeAccessSettings } from "@/components/admin/PracticeAccessSettings";
import { subjectPathOf } from "@/lib/subjects";
import { RecentVisitTracker } from "./RecentVisits";

export async function DocumentPage({ document }: { document: ContentDocument }) {
  const { content, headings } = await renderMDX(document.content, document.format);
  const isLecture = document.kind === "lectures";
  const isPractice = document.kind === "practice";
  const isEditable = process.env.NODE_ENV === "development";
  const label = isLecture ? "강의 정리" : "족보";
  const subjectHome = subjectPathOf(document);
  // "제 N 교시" on the exam paper: this exam's place among the subject's exams.
  const period = isPractice ? getAllExams().filter(exam => subjectPathOf(exam) === subjectHome).findIndex(exam => exam.path === document.path) + 1 || 1 : undefined;
  return <div className="document-grid"><RecentVisitTracker path={document.path} /><article className="document-main printable-document">
    <div className="document-toolbar"><nav className="breadcrumb" aria-label="현재 위치"><Link prefetch={false} href={`/${document.kind}`}>{label}</Link><ChevronRight size={13} />{document.gradeName ? <><span>{document.gradeName}</span><ChevronRight size={13} /><span>{document.semesterName}</span><ChevronRight size={13} />{subjectHome ? <Link prefetch={false} href={isPractice ? `${subjectHome}#practice` : subjectHome}>{document.subjectName}</Link> : <span>{document.subjectName}</span>}</> : <span>{document.title}</span>}</nav><div className="document-toolbar-actions">{isEditable && isPractice && <PracticeAccessSettings slug={document.slug} title={document.title} />}<PrintLectureButton title={document.title} kind={isPractice ? "practice" : "lecture"} subjectName={document.subjectName} period={period} /></div></div>
    <LectureHeader lecture={document} hideDescription={isLecture} /><LearningObjectives objectives={document.objectives} />
    {/* Exams only reach this component after their password check, so their headings are never sent before unlocking. */}
    <MobileTOC key={document.path} headings={headings} documentPath={isEditable ? document.path : undefined} format={document.format} />
    <StudyWorkspace documentPath={document.path}>{isEditable ? <MarkdownEditor path={document.path} filename={`${document.slug.at(-1) ?? "document"}.${isPractice || document.format === "md" ? "md" : "mdx"}`} source={document.content}>{content}</MarkdownEditor> : <div className="prose">{content}</div>}</StudyWorkspace>
    <div className="document-print-watermark" aria-hidden="true">26학번 한지석 제공</div>
    {isLecture ? <><ProgressCheck slug={document.slug.join("/")} /><PrevNextNavigation {...getPrevNextLecture(document.slug)} /></> : <div className="prev-next"><Link prefetch={false} href={`/${document.kind}`}><span>목록으로 돌아가기</span><strong>전체 {label} 보기</strong></Link></div>}
    <Footer />
  </article><PageTOC key={document.path} headings={headings} documentPath={isEditable ? document.path : undefined} format={document.format} /></div>;
}
