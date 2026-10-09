import fs from 'node:fs';
import assert from 'node:assert/strict';
const routes=JSON.parse(fs.readFileSync('tmp/pdfs/routes.json','utf8'));
for(const route of routes) {
 const html=fs.readFileSync(`.next/server/app${route.path}.html`,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,route.path);
 assert.equal((html.match(/class="study-quiz"/g)||[]).length,4,route.path);
 assert.equal((html.match(/class="study-answer"/g)||[]).length,4,route.path);
 assert.equal((html.match(/class="study-flashcard"/g)||[]).length,3,route.path);
 assert((html.match(/class="table-scroll"/g)||[]).length>=3,route.path);
 assert(!/\[!(?:QUIZ|ANSWER|FLASHCARD|DEFINITION)\]/.test(html),route.path);
 assert(!/\{\{[^{}]+\}\}/.test(html),route.path);
 console.log('RENDER OK',route.path);
}
