import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { AcademicCatalog, ContentDocument, ContentKind, Difficulty } from "@/types/content";

// Reads lecture notes and exams from Supabase (CONTENT_SOURCE=db).
// Uses the secret key on the server only: exam bodies are closed to every client role, and pages
// still render an exam only after its password check, exactly as with the files.
// Every request is a Next fetch tagged CONTENT_TAG, so pages stay static and an admin save can
// refresh them with revalidateTag. Bodies are fetched one document (or a small batch) at a time
// because a single cached response must stay under the data cache's per-entry size limit.

export const CONTENT_TAG = "content";

export type DocumentMeta = Omit<ContentDocument, "content"> & { id: string };

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("CONTENT_SOURCE=db needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Admin saves refresh at once via the tag; the 60s limit catches DB changes made outside the site, which a redeploy doesn't clear.
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60, tags: [CONTENT_TAG] } }) },
  });
}

function must<T>(what: string, result: { data: T | null; error: { message: string } | null }): T {
  if (result.error || result.data === null) throw new Error(`${what}: ${result.error?.message ?? "no data"}`);
  return result.data;
}

export async function dbCatalog(): Promise<AcademicCatalog> {
  const db = client();
  const [grades, semesters, subjects] = await Promise.all([
    db.from("grades").select("id, name, sort"),
    db.from("semesters").select("grade_id, id, name, sort"),
    db.from("subjects").select("grade_id, semester_id, id, name, sort"),
  ]);
  const g = must("grades", grades), s = must("semesters", semesters), sub = must("subjects", subjects);
  return {
    grades: g.map(grade => ({
      id: grade.id, name: grade.name, order: grade.sort,
      semesters: s.filter(x => x.grade_id === grade.id).map(semester => ({
        id: semester.id, name: semester.name, order: semester.sort,
        subjects: sub.filter(x => x.grade_id === grade.id && x.semester_id === semester.id).map(subject => ({ id: subject.id, name: subject.name, order: subject.sort })),
      })),
    })),
  };
}

type Meta = { duration?: unknown; difficulty?: unknown; tags?: unknown; objectives?: unknown };
const strings = (value: unknown) => Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : undefined;

/** Published documents of one kind, without bodies, in catalog order (same order as the file reader). */
export async function dbDocuments(kind: ContentKind, catalog: AcademicCatalog): Promise<DocumentMeta[]> {
  const rows = must(`documents ${kind}`, await client()
    .from("documents")
    .select("id, grade_id, semester_id, subject_id, slug, title, description, sort, meta, format, published")
    .eq("kind", kind)
    .eq("published", true));
  const place = new Map<string, { names: [string, string, string]; rank: [number, number, number] }>();
  for (const grade of catalog.grades) for (const semester of grade.semesters) for (const subject of semester.subjects) {
    place.set(`${grade.id}/${semester.id}/${subject.id}`, { names: [grade.name, semester.name, subject.name], rank: [grade.order, semester.order, subject.order] });
  }
  const documents = rows.flatMap(row => {
    const at = place.get(`${row.grade_id}/${row.semester_id}/${row.subject_id}`);
    if (!at) return [];
    const meta = (row.meta ?? {}) as Meta;
    const slug = [row.grade_id, row.semester_id, row.subject_id, row.slug];
    const document: DocumentMeta & { rank: number[] } = {
      id: row.id, title: row.title, description: row.description, order: row.sort, published: row.published,
      ...(Number.isInteger(meta.duration) && Number(meta.duration) > 0 && { duration: Number(meta.duration) }),
      ...(typeof meta.difficulty === "string" && { difficulty: meta.difficulty as Difficulty }),
      ...(strings(meta.tags) && { tags: strings(meta.tags) }),
      ...(kind === "lectures" && strings(meta.objectives) && { objectives: strings(meta.objectives) }),
      gradeId: row.grade_id, gradeName: at.names[0], semesterId: row.semester_id, semesterName: at.names[1], subjectId: row.subject_id, subjectName: at.names[2],
      slug, path: `/${kind}/${slug.join("/")}`, kind, format: row.format === "mdx" ? "mdx" : "md",
      rank: [...at.rank, row.sort],
    };
    return [document];
  });
  documents.sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2] - b.rank[2] || a.rank[3] - b.rank[3]);
  return documents.map(({ rank: _rank, ...document }) => { void _rank; return document; });
}

export async function dbBody(id: string): Promise<string> {
  const { data, error } = await client().from("document_bodies").select("body").eq("document_id", id).maybeSingle();
  if (error) throw new Error(`body: ${error.message}`);
  return data?.body ?? "";
}

/** Bodies for many documents, fetched in small batches. */
export async function dbBodies(ids: string[]): Promise<Map<string, string>> {
  const bodies = new Map<string, string>();
  const db = client();
  for (let i = 0; i < ids.length; i += 10) {
    const rows = must("bodies", await db.from("document_bodies").select("document_id, body").in("document_id", ids.slice(i, i + 10)));
    for (const row of rows) bodies.set(row.document_id, row.body);
  }
  return bodies;
}
