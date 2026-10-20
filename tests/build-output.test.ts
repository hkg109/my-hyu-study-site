import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { readCollection } from "../lib/content";
import { getHeadings } from "../lib/markdown";

const serverDir = path.join(process.cwd(), ".next/server/app");
const hasBuild = existsSync(path.join(process.cwd(), ".next/BUILD_ID"));

test("static production HTML includes MDX features, one H1, real TOC ids and no drafts; locked exams are never prerendered", { skip: !hasBuild && "Run npm run build first" }, (context) => {
  const lectures = readCollection("lectures");
  if (!lectures[0] || !existsSync(path.join(serverDir, `${lectures[0].path.slice(1)}.html`))) {
    context.skip("Routes are rendered dynamically from editable local files");
    return;
  }
  for (const kind of ["lectures", "assignments"] as const) {
    for (const doc of readCollection(kind)) {
      const html = readFileSync(path.join(serverDir, `${doc.path.slice(1)}.html`), "utf8");
      assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, doc.path);
      for (const heading of getHeadings(doc.content, doc.format)) assert.ok(html.includes(`id="${heading.id}"`), `${doc.path}: ${heading.id}`);
      assert.ok(html.includes("<title>"));
      assert.ok(!html.includes("반복문 (준비 중)"));
      if (kind === "lectures") assert.equal((html.match(/class="completion-box"/g) ?? []).length, 1);
    }
  }
  const printableLecture = readFileSync(path.join(serverDir, `${lectures[0].path.slice(1)}.html`), "utf8");
  assert.match(printableLecture, /class="document-print-button"/);
  assert.match(printableLecture, /기본 PDF/);
  assert.match(printableLecture, /다크 PDF/);
  assert.match(printableLecture, /PDF로 저장/);
  assert.match(printableLecture, /class="document-print-watermark"/);
  assert.match(printableLecture, /26학번 한지석 제공/);
  // Exams are rendered per request after the password check, so the build must not contain their HTML.
  const practices = readCollection("practice");
  assert.ok(practices.length > 0);
  for (const doc of practices) assert.ok(!existsSync(path.join(serverDir, `${doc.path.slice(1)}.html`)), `${doc.path} was prerendered`);
  const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  for (const doc of readCollection("lectures")) assert.ok(manifest.routes[doc.path]);
  assert.ok(manifest.dynamicRoutes["/lectures/[...slug]"]);
  for (const doc of practices) assert.equal(manifest.routes[doc.path], undefined, doc.path);
});
