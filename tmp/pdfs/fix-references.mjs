import fs from 'node:fs';
const files = ['subject-muhy9cpw','subject-muhz2xir'].map(subject => `content/lectures/grade-01/semester-muheifg4/${subject}/lecture-03.md`);
for (const file of files) {
  const source = fs.readFileSync(file,'utf8');
  fs.writeFileSync(file,source.replace('94–95 / 95–96','94–96 / 95–97'));
}
