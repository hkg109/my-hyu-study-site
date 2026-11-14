#!/usr/bin/env node
// content/의 강의 노트·족보와 public/materials의 그림을 Supabase로 옮긴다.
//
//   node scripts/import-content.mjs --dry-run      # 무엇을 옮길지 개수만 본다(DB를 건드리지 않는다)
//   node scripts/import-content.mjs                # 분류·문서·본문·족보 비밀번호
//   node scripts/import-content.mjs --materials    # 위 + public/materials 업로드
//
// 필요한 환경변수(.env.local에서 읽는다): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
// 족보 비밀번호는 PRACTICE_PASSWORD_DEFAULT, PRACTICE_PASSWORD_<KEY>에서 읽어 DB 함수가 해시로 바꾼다.
// 값이 없으면 그 key는 아무 비밀번호로도 열리지 않는 상태로 만든다(지금처럼 잠긴 채로 둔다). 평문은 출력하지 않는다.
// 같은 문서(kind+분류+slug)는 덮어쓰므로 여러 번 돌려도 된다. DB에만 있는 문서는 지우지 않는다.

import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(import.meta.dirname, "..");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const withMaterials = args.has("--materials");

if (fs.existsSync(path.join(root, ".env.local"))) process.loadEnvFile(path.join(root, ".env.local"));

// ---------------------------------------------------------------------
// 1. 파일 읽기 (lib/academic-lectures.ts·academic-practice.ts와 같은 규칙)
// ---------------------------------------------------------------------
const catalog = JSON.parse(fs.readFileSync(path.join(root, "content/lectures/catalog.json"), "utf8"));
const grades = [], semesters = [], subjects = [];
for (const g of catalog.grades) {
  grades.push({ id: g.id, name: g.name, sort: g.order });
  for (const s of g.semesters) {
    semesters.push({ grade_id: g.id, id: s.id, name: s.name, sort: s.order });
    for (const sub of s.subjects) subjects.push({ grade_id: g.id, semester_id: s.id, id: sub.id, name: sub.name, sort: sub.order });
  }
}
const subjectKey = (g, s, sub) => `${g}/${s}/${sub}`;
const knownSubjects = new Set(subjects.map((s) => subjectKey(s.grade_id, s.semester_id, s.id)));

const FILE_PATTERN = { lectures: /^lecture-[a-z0-9-]+\.mdx?$/, practice: /^exam-[a-z0-9-]+\.md$/ };

function readDocuments(kind) {
  const base = path.join(root, "content", kind);
  const docs = [];
  for (const sub of subjects) {
    const dir = path.join(base, sub.grade_id, sub.semester_id, sub.id);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).filter((n) => FILE_PATTERN[kind].test(n)).sort()) {
      const file = path.join(dir, name);
      // Windows 체크아웃은 CRLF일 수 있다. 줄바꿈을 LF로 맞춰 저장한다(CRLF는 코드 강조를 깨뜨린다)
      const { data, content } = matter(fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"));
      const where = path.relative(root, file);
      const order = Number(data.order);
      if (typeof data.title !== "string" || !data.title.trim()) throw new Error(`${where}: title이 필요합니다.`);
      if (!Number.isInteger(order) || order < 0) throw new Error(`${where}: order가 올바르지 않습니다.`);
      if (typeof data.published !== "boolean") throw new Error(`${where}: published는 boolean이어야 합니다.`);
      const format = kind === "lectures"
        ? (name.endsWith(".mdx") || /<Answer(?:\s|>)/.test(content) ? "mdx" : "md")
        : (/<[A-Z][A-Za-z]*(?:\s|>)/.test(content) ? "mdx" : "md");
      const meta = {};
      if (Number.isInteger(data.duration) && data.duration > 0) meta.duration = data.duration;
      if (typeof data.difficulty === "string") meta.difficulty = data.difficulty;
      for (const field of ["tags", "objectives"]) {
        if (Array.isArray(data[field])) meta[field] = data[field].filter((x) => typeof x === "string");
      }
      docs.push({
        row: {
          kind, grade_id: sub.grade_id, semester_id: sub.semester_id, subject_id: sub.id,
          slug: name.replace(/\.mdx?$/, ""), title: data.title.trim(),
          description: typeof data.description === "string" ? data.description : "",
          sort: order, meta, format, published: data.published,
          access_key: kind === "practice" && typeof data.accessKey === "string" ? data.accessKey : null,
        },
        body: content,
      });
    }
  }
  // 파일이 있는데 catalog에 없는 과목 폴더는 알려 준다(옮기지 않는다)
  for (const g of fs.existsSync(base) ? fs.readdirSync(base) : []) {
    const gDir = path.join(base, g);
    if (!fs.statSync(gDir).isDirectory()) continue;
    for (const s of fs.readdirSync(gDir)) for (const sub of fs.readdirSync(path.join(gDir, s))) {
      if (!knownSubjects.has(subjectKey(g, s, sub))) console.warn(`  catalog에 없는 과목 폴더라 건너뜀: content/${kind}/${g}/${s}/${sub}`);
    }
  }
  return docs;
}

const documents = [...readDocuments("lectures"), ...readDocuments("practice")];
const accessKeys = ["default", ...new Set(documents.map((d) => d.row.access_key).filter(Boolean))];

const materialsRoot = path.join(root, "public", "materials");
const materials = [];
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else materials.push(path.relative(materialsRoot, full).split(path.sep).join("/"));
  }
})(materialsRoot);

console.log(`분류: 학년 ${grades.length}, 학기 ${semesters.length}, 과목 ${subjects.length}`);
console.log(`문서: 강의 ${documents.filter((d) => d.row.kind === "lectures").length}, 족보 ${documents.filter((d) => d.row.kind === "practice").length}`);
console.log(`족보 비밀번호 key: ${accessKeys.join(", ")}`);
console.log(`자료 파일: ${materials.length}${withMaterials ? "" : " (--materials 없이는 올리지 않음)"}`);
if (dryRun) process.exit(0);

// ---------------------------------------------------------------------
// 2. DB에 쓰기
// ---------------------------------------------------------------------
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SECRET_KEY가 필요합니다(.env.local).");
  process.exit(1);
}
const db = createClient(url, secret, { auth: { persistSession: false } });
const check = (step, { error }) => {
  if (error) throw new Error(`${step}: ${error.message}`);
};

check("학년", await db.from("grades").upsert(grades));
check("학기", await db.from("semesters").upsert(semesters));
check("과목", await db.from("subjects").upsert(subjects));

// 이미 DB에 있는 key는 환경변수가 없으면 건드리지 않는다(관리자가 바꾼 비밀번호를 지우지 않는다)
const existing = await db.from("practice_keys").select("key");
check("비밀번호 목록", existing);
const existingKeys = new Set(existing.data.map((k) => k.key));
let locked = 0;
for (const key of accessKeys) {
  const envName = `PRACTICE_PASSWORD_${key.toUpperCase().replaceAll("-", "_")}`;
  const password = process.env[envName];
  if (!password && existingKeys.has(key)) continue;
  if (!password) locked++;
  // 처음 보는 key인데 값이 없으면 아무도 모르는 무작위 값으로: key는 있되 열리지 않는다
  check(`비밀번호 ${key}`, await db.rpc("set_practice_password", { p_key: key, p_password: password || randomBytes(32).toString("base64url") }));
}

let written = 0;
for (const { row, body } of documents) {
  const { data, error } = await db
    .from("documents")
    .upsert(row, { onConflict: "kind,grade_id,semester_id,subject_id,slug" })
    .select("id")
    .single();
  check(`문서 ${row.kind}/${row.slug}`, { error });
  check(`본문 ${row.kind}/${row.slug}`, await db.from("document_bodies").upsert({ document_id: data.id, body }));
  written++;
}
console.log(`문서 ${written}개를 저장했습니다. 새로 만든 잠긴 key(비밀번호 없음): ${locked}개`);

if (withMaterials) {
  const types = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", pdf: "application/pdf" };
  let uploaded = 0;
  for (const file of materials) {
    const ext = file.split(".").pop().toLowerCase();
    const { error } = await db.storage.from("materials").upload(file, fs.readFileSync(path.join(materialsRoot, file)), {
      upsert: true,
      contentType: types[ext] ?? "application/octet-stream",
    });
    check(`자료 ${file}`, { error });
    uploaded++;
  }
  console.log(`자료 파일 ${uploaded}개를 올렸습니다.`);
}
