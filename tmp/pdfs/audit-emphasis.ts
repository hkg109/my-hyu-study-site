import fs from 'node:fs';
import {readAcademicLectures} from '../../lib/academic-lectures';
import {parseMarkdown} from '../../lib/markdown';
import {visit} from 'unist-util-visit';
for(const doc of readAcademicLectures().filter(d=>['subject-muhy9cpw','subject-muhz2xir'].includes(d.subjectId??''))) {
 visit(parseMarkdown(doc.content,doc.format),'text',node=>{if(node.value.includes('**'))console.log(doc.subjectId,doc.order,node.value.slice(0,250));});
}
