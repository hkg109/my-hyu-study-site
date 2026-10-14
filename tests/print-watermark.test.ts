import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("lecture and practice PDFs use a page-margin watermark with an iPad fallback", () => {
  const css = readFileSync("app/globals.css", "utf8");
  const documentPage = readFileSync("components/lecture/DocumentPage.tsx", "utf8");

  assert.match(css, /@page study-document\s*\{[\s\S]*?@bottom-right\s*\{\s*content:"26학번 한지석 제공"/);
  assert.match(css, /\.printable-document\s*\{\s*page:study-document;/);
  assert.match(css, /@supports \(-webkit-touch-callout: none\)\s*\{\s*\.document-print-watermark\s*\{\s*display:block;/);
  assert.doesNotMatch(css, /\.document-print-watermark\s*\{[^}]*position:fixed/);
  assert.match(documentPage, /isPrintable \? " printable-document" : ""/);
});
