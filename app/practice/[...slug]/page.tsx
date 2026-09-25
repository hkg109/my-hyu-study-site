import { notFound } from "next/navigation";
import { getDocument, readCollection } from "@/lib/content";
import { DocumentPage } from "@/components/lecture/DocumentPage";

interface Props { params: Promise<{ slug: string[] }> }
export const dynamicParams = true;
export const generateStaticParams = () => readCollection("practice").map(doc => ({ slug: doc.slug }));
export async function generateMetadata({ params }: Props) {
  const doc = getDocument("practice", (await params).slug);
  if (!doc) notFound();
  return { title: doc.title, description: doc.description };
}
export default async function PracticeDocument({ params }: Props) {
  const doc = getDocument("practice", (await params).slug);
  if (!doc) notFound();
  return <DocumentPage document={doc} />;
}
