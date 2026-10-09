import fs from 'node:fs';
import assert from 'node:assert/strict';
import { readAcademicLectures } from '../../lib/academic-lectures';
import { parseMarkdown, getHeadings } from '../../lib/markdown';
import { visit } from 'unist-util-visit';
const all = readAcademicLectures();
const paths = new Set(all.map(doc => doc.path));
const docs = all.filter(doc => ['subject-muhy9cpw','subject-muhz2xir'].includes(doc.subjectId ?? ''));
assert.equal(docs.length,10);
const totals = {documents: 0, quizzes: 0, answers: 0, cards: 0, blanks: 0, links: 0};
for (const doc of docs) {
  const tree = parseMarkdown(doc.content, doc.format);
  const counts = {quizzes:0,answers:0,cards:0,blanks:0};
  visit(tree, node => {
    const props = node.data?.hProperties ?? {};
    const classes = Array.isArray(props.className) ? props.className : [];
    if(classes.includes('study-quiz')) counts.quizzes++;
    if(classes.includes('study-answer')) counts.answers++;
    if(classes.includes('study-flashcard')) counts.cards++;
    if(classes.includes('study-blank')) counts.blanks++;
    if(node.type === 'link' && node.url.startsWith('/lectures/')) { assert(paths.has(node.url), `${doc.path}: broken ${node.url}`); totals.links++; }
  });
  assert.equal(counts.quizzes,4,doc.path);
  assert.equal(counts.answers,4,doc.path);
  assert.equal(counts.cards,3,doc.path);
  assert(counts.blanks >= 4,doc.path);
  const headings = getHeadings(doc.content, doc.format);
  assert.equal(new Set(headings.map(h=>h.id)).size,headings.length);
  assert(!/ch0[1-4]_17ed\.pdf|50-slide|\*pp\. 1-3\*/.test(doc.content));
  totals.documents++;
  for(const key of ['quizzes','answers','cards','blanks'] as const) totals[key]+=counts[key];
  console.log(doc.subjectName,doc.order,headings.length,'headings',counts);
}
console.log('CONTENT AUDIT PASSED',totals);
fs.writeFileSync('tmp/pdfs/routes.json',JSON.stringify(docs.map(d=>({path:d.path,title:d.title})),null,2));
