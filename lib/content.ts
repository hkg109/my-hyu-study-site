import { readAcademicLectures } from "./academic-lectures";
import { readAcademicPractice } from "./academic-practice";
import type { ContentDocument, ContentKind } from "@/types/content";

const productionCollections: Partial<Record<ContentKind, ContentDocument[]>> = {};

export function readCollection(kind: ContentKind): ContentDocument[] {
  const read = () => kind === "lectures" ? readAcademicLectures() : readAcademicPractice();
  // Content is fixed for a production build, so every page and request shares one read;
  // development reads the files again so admin edits show up at once.
  return process.env.NODE_ENV === "production" ? productionCollections[kind] ??= read() : read();
}

export function getDocument(kind: ContentKind, slug: string[]) {
  // Resolve only from the published manifest; never read a user-supplied filesystem path.
  return readCollection(kind).find(doc => doc.slug.join("/") === slug.join("/"));
}

export function withoutBody({ content: _content, ...meta }: ContentDocument) {
  void _content;
  return meta;
}
