import { notFound, redirect } from "next/navigation";
import { getDocument } from "@/lib/content";
import { getSubjects } from "@/lib/lectures";
import { findSubject } from "@/lib/subjects";
import { hasPracticeCookie, isAdminViewer, practiceLockFor } from "@/lib/server/auth";
import { DocumentPage } from "@/components/lecture/DocumentPage";

interface Props { params: Promise<{ slug: string[] }> }
export async function generateMetadata({ params }: Props) {
  const doc = getDocument("practice", (await params).slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description, robots: { index: false } };
}
// Each exam is locked by its own password, checked here so the page body and its TOC are never rendered without it.
export default async function PracticeDocument({ params }: Props) {
  const { slug } = await params;
  // A subject's exams are listed on its subject page.
  const subject = slug.length === 3 ? findSubject(getSubjects(), slug) : undefined;
  if (subject) redirect(`${subject.path}#practice`);
  const doc = getDocument("practice", slug);
  if (!doc) notFound();
  // A signed-in admin on the local dev server can open (and edit) any exam, even one whose password isn't configured.
  if (await isAdminViewer()) return <DocumentPage document={doc} />;
  const lock = practiceLockFor(slug);
  if (!lock.ok || !(await hasPracticeCookie(lock.credential))) redirect(`/unlock?next=${encodeURIComponent(doc.path)}`);
  return <DocumentPage document={doc} />;
}
