import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PRACTICE_PASSWORD_ENV, practicePasswordEnvName } from "@/lib/access-keys";
import type { ContentKind } from "@/types/content";
import type { AccessChoice, PracticeAccessOverview, PracticeDocumentAccess } from "@/types/admin";
import { CONTENT_TAG } from "./content-db";

// Admin writes and password checks against Supabase (CONTENT_SOURCE=db). Every caller has already
// passed adminGuard (or, for exam passwords, is checking a visitor's typed password). Reads here are
// never cached: they must see the latest saved content and the current password hash.

type Slug = [string, string, string, string];

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("CONTENT_SOURCE=db needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
}

const validSlug = (slug: string[]): slug is Slug => slug.length === 4 && slug.every(part => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part));

/** Refreshes every page that shows content: static pages re-render on their next request. */
export function refreshContent() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

async function findDocument(kind: ContentKind, slug: string[]) {
  if (!validSlug(slug)) return undefined;
  const [grade_id, semester_id, subject_id, docSlug] = slug;
  const { data, error } = await client().from("documents")
    .select("id, title, description, access_key, published")
    .match({ kind, grade_id, semester_id, subject_id, slug: docSlug })
    .maybeSingle();
  if (error) throw new Error(`document lookup: ${error.message}`);
  return data ?? undefined;
}

// ---------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------

/** The stored hash that signs an exam's cookie, or undefined when the exam can't be opened. */
export async function dbPracticeLock(slug: string[]) {
  const doc = await findDocument("practice", slug);
  if (!doc?.published) return undefined;
  const key = doc.access_key ?? "default";
  const { data } = await client().from("practice_keys").select("password_hash, locked").eq("key", key).maybeSingle();
  // A locked key has no password anyone knows: the exam reads as "can't be opened right now".
  return data && !data.locked ? { documentId: doc.id, accessKey: doc.access_key ?? undefined, passwordHash: data.password_hash } : undefined;
}

export async function dbVerifyPracticePassword(documentId: string, password: string) {
  const { data, error } = await client().rpc("verify_practice_password", { p_document_id: documentId, p_password: password });
  return !error && data === true;
}

async function keyUsage() {
  const [{ data: keys }, { data: docs }] = await Promise.all([
    client().from("practice_keys").select("key, locked"),
    client().from("documents").select("access_key").eq("kind", "practice"),
  ]);
  const usage = new Map<string, number>();
  for (const doc of docs ?? []) if (doc.access_key) usage.set(doc.access_key, (usage.get(doc.access_key) ?? 0) + 1);
  // "stored": a password someone actually set (a locked key only holds an unknown random one)
  return { stored: new Set((keys ?? []).filter(k => !k.locked).map(k => k.key)), usage };
}

/** Same shape as the file-mode overview; "configured" means a password is stored for the key. */
export async function dbPracticeAccessOverview(candidate?: string): Promise<PracticeAccessOverview> {
  const { stored, usage } = await keyUsage();
  const status = (accessKey: string) => ({ accessKey, envName: practicePasswordEnvName(accessKey), configuredLocally: stored.has(accessKey), documents: usage.get(accessKey) ?? 0 });
  return {
    defaultEnvName: DEFAULT_PRACTICE_PASSWORD_ENV,
    defaultConfiguredLocally: stored.has("default"),
    authSecretConfiguredLocally: Boolean(process.env.AUTH_SECRET),
    keys: [...new Set([...usage.keys(), ...[...stored].filter(k => k !== "default")])].sort().map(status),
    ...(candidate && { candidate: status(candidate) }),
    storage: "db",
  };
}

export async function dbPracticeDocumentAccess(slug: string[]): Promise<PracticeDocumentAccess | undefined> {
  const doc = await findDocument("practice", slug);
  if (!doc) return undefined;
  const { stored } = await keyUsage();
  return doc.access_key
    ? { mode: "key", accessKey: doc.access_key, envName: practicePasswordEnvName(doc.access_key), configuredLocally: stored.has(doc.access_key) }
    : { mode: "default", envName: DEFAULT_PRACTICE_PASSWORD_ENV, configuredLocally: stored.has("default") };
}

/** Makes sure a key row exists (documents reference it). A new key gets an unknown random password, so it stays locked until one is set. */
export async function dbEnsurePracticeKey(key: string) {
  const { data } = await client().from("practice_keys").select("key").eq("key", key).maybeSingle();
  if (data) return;
  const { randomBytes } = await import("node:crypto");
  const { error } = await client().rpc("set_practice_password", { p_key: key, p_password: randomBytes(24).toString("base64url") });
  if (error) throw new Error(`practice key: ${error.message}`);
  await client().from("practice_keys").update({ locked: true }).eq("key", key);
}

/** Sets (or replaces) the password for a key; stored only as a hash. */
export async function dbSetPracticeKeyPassword(key: string, password: string) {
  const { error } = await client().rpc("set_practice_password", { p_key: key, p_password: password });
  if (error) return { error: error.message.includes("4~100") ? "비밀번호는 4~100자로 입력해 주세요." : "비밀번호를 저장하지 못했습니다." };
  return {};
}

/** Points an exam at a key (or the default). A key without a password yet keeps the exam locked until one is set. */
export async function dbSetPracticeAccess(slug: string[], choice: AccessChoice, password?: string) {
  const doc = await findDocument("practice", slug);
  if (!doc) return { error: "족보를 찾을 수 없습니다.", status: 404 };
  const key = choice.mode === "key" ? choice.accessKey : "default";
  if (password !== undefined) {
    const { error } = await client().rpc("set_practice_password", { p_key: key, p_password: password });
    if (error) return { error: error.message.includes("4~100") ? "비밀번호는 4~100자로 입력해 주세요." : "비밀번호를 저장하지 못했습니다.", status: 400 };
  } else {
    const { data } = await client().from("practice_keys").select("key, locked").eq("key", key).maybeSingle();
    if (!data || data.locked) return { error: "이 키에는 아직 비밀번호가 없습니다. 비밀번호를 함께 입력해 주세요.", status: 400 };
  }
  const { error } = await client().from("documents").update({ access_key: choice.mode === "key" ? choice.accessKey : null }).eq("id", doc.id);
  if (error) return { error: "접근 설정을 저장하지 못했습니다.", status: 500 };
  refreshContent();
  return { saved: true as const };
}

// ---------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------

export async function dbDocumentSource(kind: ContentKind, slug: string[]) {
  const doc = await findDocument(kind, slug);
  if (!doc) return undefined;
  const { data } = await client().from("document_bodies").select("body").eq("document_id", doc.id).maybeSingle();
  return { content: data?.body ?? "", title: doc.title, description: doc.description };
}

export async function dbSaveDocument(kind: ContentKind, slug: string[], change: { content: string } | { title: string; description?: string }) {
  const doc = await findDocument(kind, slug);
  if (!doc) return false;
  const db = client();
  const { error } = "content" in change
    ? await db.from("document_bodies").upsert({ document_id: doc.id, body: change.content })
    : await db.from("documents").update({ title: change.title, ...(change.description !== undefined && { description: change.description }) }).eq("id", doc.id);
  if (error) throw new Error(`save: ${error.message}`);
  refreshContent();
  return true;
}

export async function dbDeleteDocument(kind: ContentKind, slug: string[]) {
  const doc = await findDocument(kind, slug);
  if (!doc) return false;
  const { error } = await client().from("documents").delete().eq("id", doc.id);
  if (error) throw new Error(`delete: ${error.message}`);
  refreshContent();
  return true;
}

/** Next free order and slug in a subject, counting drafts too, so numbers are never reused. */
export async function dbNextSlot(kind: ContentKind, gradeId: string, semesterId: string, subjectId: string) {
  const prefix = kind === "practice" ? "exam" : "lecture";
  const { data, error } = await client().from("documents").select("slug, sort").match({ kind, grade_id: gradeId, semester_id: semesterId, subject_id: subjectId });
  if (error) throw new Error(`slot: ${error.message}`);
  const numbers = (data ?? []).flatMap(d => [d.sort, Number(new RegExp(`^${prefix}-(\\d+)$`).exec(d.slug)?.[1] ?? NaN)]).filter(Number.isInteger);
  const order = Math.max(0, ...numbers) + 1;
  return { order, slug: `${prefix}-${String(order).padStart(2, "0")}` };
}

export interface NewDocument {
  kind: ContentKind; gradeId: string; semesterId: string; subjectId: string;
  slug: string; order: number; title: string; description?: string; body: string;
  meta?: Record<string, unknown>; format?: "md" | "mdx"; accessKey?: string; published?: boolean;
}

/** Creates or (with overwrite) replaces one document and its body. Returns the page path. */
export async function dbUpsertDocument(doc: NewDocument, { overwrite = false } = {}) {
  const db = client();
  const row = {
    kind: doc.kind, grade_id: doc.gradeId, semester_id: doc.semesterId, subject_id: doc.subjectId,
    slug: doc.slug, sort: doc.order, title: doc.title, description: doc.description ?? "",
    meta: doc.meta ?? {}, format: doc.format ?? "md", access_key: doc.kind === "practice" ? doc.accessKey ?? null : null,
    published: doc.published ?? true,
  };
  const query = overwrite
    ? db.from("documents").upsert(row, { onConflict: "kind,grade_id,semester_id,subject_id,slug" })
    : db.from("documents").insert(row);
  const { data, error } = await query.select("id").single();
  if (error) return { error: error.code === "23505" ? "같은 이름이나 순서의 문서가 이미 있습니다." : `문서를 저장하지 못했습니다: ${error.message}` };
  const body = await db.from("document_bodies").upsert({ document_id: data.id, body: doc.body });
  if (body.error) return { error: `본문을 저장하지 못했습니다: ${body.error.message}` };
  refreshContent();
  return { path: `/${doc.kind}/${doc.gradeId}/${doc.semesterId}/${doc.subjectId}/${doc.slug}` };
}

export async function dbDocumentExists(kind: ContentKind, gradeId: string, semesterId: string, subjectId: string, slug: string) {
  return Boolean(await findDocument(kind, [gradeId, semesterId, subjectId, slug]));
}

// ---------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------

type Level = "grade" | "semester" | "subject";
const table = { grade: "grades", semester: "semesters", subject: "subjects" } as const;

export async function dbCatalogChange(action: "add" | "rename" | "delete", level: Level, ids: { gradeId?: string; semesterId?: string; subjectId?: string }, name?: string) {
  const db = client();
  const where = level === "grade" ? { id: ids.gradeId } : level === "semester" ? { grade_id: ids.gradeId, id: ids.semesterId } : { grade_id: ids.gradeId, semester_id: ids.semesterId, id: ids.subjectId };
  if (action === "delete") {
    if (level === "subject") {
      const { count } = await db.from("documents").select("id", { count: "exact", head: true }).match({ grade_id: ids.gradeId, semester_id: ids.semesterId, subject_id: ids.subjectId });
      if (count) return { error: "강의 노트 또는 족보가 남아 있는 과목은 삭제할 수 없습니다.", status: 409 };
    }
    const { error, count } = await db.from(table[level]).delete({ count: "exact" }).match(where);
    if (error) return { error: error.code === "23503" ? "하위 분류가 남아 있어 삭제할 수 없습니다. 하위 분류를 먼저 삭제해 주세요." : "삭제하지 못했습니다.", status: 409 };
    if (!count) return { error: "삭제할 분류를 찾을 수 없습니다.", status: 404 };
  } else if (action === "rename") {
    const { error, count } = await db.from(table[level]).update({ name }, { count: "exact" }).match(where);
    if (error || !count) return { error: "수정할 분류를 찾을 수 없습니다.", status: 404 };
  } else {
    const parent = level === "grade" ? {} : level === "semester" ? { grade_id: ids.gradeId } : { grade_id: ids.gradeId, semester_id: ids.semesterId };
    const { data: siblings } = await db.from(table[level]).select("name, sort").match(parent);
    if ((siblings ?? []).some(s => s.name.localeCompare(name ?? "", "ko", { sensitivity: "base" }) === 0)) return { error: "같은 이름의 분류가 있습니다.", status: 409 };
    const sort = Math.max(0, ...(siblings ?? []).map(s => s.sort)) + 1;
    const { error } = await db.from(table[level]).insert({ ...parent, id: `${level}-${Date.now().toString(36)}`, name, sort });
    if (error) return { error: error.code === "23503" ? "상위 분류를 찾을 수 없습니다." : "추가하지 못했습니다.", status: 404 };
  }
  refreshContent();
  return { saved: true as const };
}
