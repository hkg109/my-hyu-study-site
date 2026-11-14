import test from "node:test";
import assert from "node:assert/strict";
import { guessTitle, localImageReferences, rewriteImageReferences, safeFileName } from "../lib/upload-markdown";

test("finds only local image references", () => {
  const body = [
    "![그림](./figs/stack.svg)", "![원격](https://example.com/a.png)", "![사이트](/materials/x.svg)",
    '<img src="heap.png" alt="">', "![데이터](data:image/png;base64,AAAA)", '![제목 있음](queue.svg "큐")',
  ].join("\n");
  assert.deepEqual(localImageReferences(body).sort(), ["./figs/stack.svg", "heap.png", "queue.svg"]);
});

test("rewrites references to uploaded files by name and leaves the rest", () => {
  const uploaded = new Map([["stack.svg", "https://cdn.example/stack.svg"], ["heap.png", "https://cdn.example/heap.png"]]);
  const body = '![스택](./figs/stack.svg)\n<img src="heap.png">\n![없음](missing.svg)\n![원격](https://example.com/stack.svg)';
  assert.equal(
    rewriteImageReferences(body, uploaded),
    '![스택](https://cdn.example/stack.svg)\n<img src="https://cdn.example/heap.png">\n![없음](missing.svg)\n![원격](https://example.com/stack.svg)',
  );
});

test("file names are made storage-safe and titles fall back sensibly", () => {
  assert.equal(safeFileName("../../그림 1 (최종).svg"), "그림-1-최종-.svg");
  assert.equal(safeFileName("C:\\figs\\heap.png"), "heap.png");
  assert.equal(guessTitle("  포인터  ", "# 다른 제목", "a.md"), "포인터");
  assert.equal(guessTitle(undefined, "본문\n# 3주차 반복문\n", "a.md"), "3주차 반복문");
  assert.equal(guessTitle(undefined, "본문만", "lecture-note.md"), "lecture-note");
});
