import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getDocument } from "@/lib/content";
import { practicePasswordFor } from "@/lib/academic-practice";
import { hasPracticeAccess, practiceCookieName } from "@/lib/access";
import { DocumentPage } from "@/components/lecture/DocumentPage";

interface Props { params: Promise<{ slug: string[] }> }
export async function generateMetadata({ params }: Props) {
  const doc = getDocument("practice", (await params).slug);
  if (!doc) notFound();
  return { title: doc.title, description: doc.description, robots: { index: false } };
}
// Each exam is locked by its own password, checked here so the page body is never rendered without it.
export default async function PracticeDocument({ params }: Props) {
  const { slug } = await params;
  const doc = getDocument("practice", slug);
  const password = practicePasswordFor(slug);
  if (!doc || !password) notFound();
  const cookie = (await cookies()).get(practiceCookieName(doc.path))?.value;
  if (!hasPracticeAccess(doc.path, password, cookie)) redirect(`/unlock?next=${encodeURIComponent(doc.path)}`);
  return <DocumentPage document={doc} />;
}
