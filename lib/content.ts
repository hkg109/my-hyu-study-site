import { cache } from "react";
import { readAcademicLectures } from "./academic-lectures";
import { readAcademicPractice } from "./academic-practice";
import { readCatalog } from "./catalog";
import type { AcademicCatalog, ContentDocument, ContentKind, LectureMeta } from "@/types/content";

// The DB module is server-only, so it is loaded only when the DB is the source (file mode and tests never load it).
const db = () => import("./server/content-db");

// Where lecture notes and exams come from: the files in content/ (default) or Supabase (CONTENT_SOURCE=db).
// Both sources give the same shapes in the same order, so pages don't know which one they read.
const fromDb = () => process.env.CONTENT_SOURCE === "db";

const productionCollections: Partial<Record<ContentKind, ContentDocument[]>> = {};

function fileCollection(kind: ContentKind): ContentDocument[] {
  const read = () => kind === "lectures" ? readAcademicLectures() : readAcademicPractice();
  // Files are fixed for a production build, so every page and request shares one read;
  // development reads the files again so admin edits show up at once.
  return process.env.NODE_ENV === "production" ? productionCollections[kind] ??= read() : read();
}

export function withoutBody({ content: _content, ...meta }: ContentDocument): LectureMeta {
  void _content;
  return meta;
}

// cache(): one read per request even when the layout and the page both ask
export const getCatalog = cache(async (): Promise<AcademicCatalog> => fromDb() ? (await db()).dbCatalog() : readCatalog());

const dbMetas = cache(async (kind: ContentKind) => (await db()).dbDocuments(kind, await getCatalog()));

/** Published documents of one kind, without bodies. */
export const getCollection = cache(async (kind: ContentKind): Promise<LectureMeta[]> =>
  fromDb() ? (await dbMetas(kind)).map(({ id: _id, ...meta }) => { void _id; return meta; }) : fileCollection(kind).map(withoutBody),
);

/** One published document with its body, or undefined. Only ever resolved from the published list. */
export const getDocument = cache(async (kind: ContentKind, slug: string[]): Promise<ContentDocument | undefined> => {
  const key = slug.join("/");
  if (!fromDb()) return fileCollection(kind).find(doc => doc.slug.join("/") === key);
  const meta = (await dbMetas(kind)).find(doc => doc.slug.join("/") === key);
  if (!meta) return undefined;
  const { id, ...rest } = meta;
  return { ...rest, content: await (await db()).dbBody(id) };
});

/** Every published document of one kind with bodies (search index). */
export async function getCollectionWithBodies(kind: ContentKind): Promise<ContentDocument[]> {
  if (!fromDb()) return fileCollection(kind);
  const metas = await dbMetas(kind);
  const bodies = await (await db()).dbBodies(metas.map(meta => meta.id));
  return metas.map(({ id, ...meta }) => ({ ...meta, content: bodies.get(id) ?? "" }));
}

/** Same as getCollectionWithBodies; kept for scripts and tests that read whole documents. */
export const readCollection = getCollectionWithBodies;
