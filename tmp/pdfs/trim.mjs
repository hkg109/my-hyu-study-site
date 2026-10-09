import fs from 'node:fs';
for(const subject of ['subject-muhy9cpw','subject-muhz2xir']) {
 const file=`content/lectures/grade-01/semester-muheifg4/${subject}/lecture-01.md`;
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').trimEnd()+'\n');
}
