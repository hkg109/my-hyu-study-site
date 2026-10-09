import fs from 'node:fs';
for(let n=1;n<=5;n++){
 const file=`content/lectures/grade-01/semester-muheifg4/subject-muhz2xir/lecture-0${n}.md`;
 const source=fs.readFileSync(file,'utf8');
 fs.writeFileSync(file,source.replace(/\*\*([^*\n()]+)\(([^*\n()]+)\)\*\*/g,'**$1** ($2)'));
}
const audit='tmp/pdfs/audit-html.mjs';
fs.writeFileSync(audit,fs.readFileSync(audit,'utf8').replace(".split('<script')[0]", ".replace(/<script\\b[^>]*>[\\s\\S]*?<\\/script>/g,'')"));
