import { readAcademicLectures } from "./academic-lectures";
import { readAcademicPractice } from "./academic-practice";
import type { ContentDocument, ContentKind } from "@/types/content";

export function readCollection(kind: ContentKind): ContentDocument[] {
  return kind === "lectures" ? readAcademicLectures() : readAcademicPractice();
}

export function getDocument(kind: ContentKind, slug: string[]) {
  // Resolve only from the published manifest; never read a user-supplied filesystem path.
  return readCollection(kind).find(doc => doc.slug.join("/") === slug.join("/"));
}

export function withoutBody({ content: _content, ...meta }: ContentDocument) {
  void _content;
  return meta;
}
