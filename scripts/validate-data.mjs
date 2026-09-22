import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=async n=>JSON.parse(await readFile(new URL('../data/'+n+'.json',import.meta.url),'utf8'));
const [clar,org,support,glossary,jobs]=await Promise.all(['clarifications_interview_vi','org_map_interview_vi','interview_support_vi','glossary_vi','job_profiles_vi'].map(read));
const unique=(items,key)=>{const ids=items.map(x=>x[key]);assert(ids.every(Boolean));assert.equal(new Set(ids).size,ids.length,'Duplicate '+key);return new Set(ids);};
const roles=unique(org.roles,'roleId'),types=unique(clar.clarificationTypes,'clarificationId');
assert.deepEqual([...types],['question-focus','question-breakdown','answer-format','thinking-time']);
unique(clar.sampleMessages,'messageId');
for(const m of clar.sampleMessages)assert(roles.has(m.senderRoleId)&&m.text.trim());
assert.deepEqual(Object.keys(clar.toneLabels).sort(),['direct','neutral','soft']);
const phrasingIds=[];
for(const t of clar.clarificationTypes){
 assert(t.label&&t.description);assert.equal(t.phrasings.length,3);
 assert.deepEqual(t.phrasings.map(p=>p.tone).sort(),['direct','neutral','soft']);
 for(const p of t.phrasings){assert(p.text.trim().endsWith('?'));phrasingIds.push(p);}
}
unique(phrasingIds,'phrasingId');
const actions=unique(support.supportActions,'supportId'),categories=unique(support.categories,'categoryId');
assert.equal(actions.size,3);assert.equal(categories.size,4);
for(const a of support.supportActions)assert(types.has(a.clarificationId));
unique(support.profileQuestions,'groupId');unique(support.strengths,'strengthId');
for(const g of support.profileQuestions){unique(g.options,'optionId');for(const o of g.options)assert(o.enablesSupport.every(id=>actions.has(id)));}
unique(support.questions,'questionId');
assert.equal(support.questions.length,12);
for(const q of support.questions){
 assert(categories.has(q.categoryId));assert(q.text.trim()&&q.text.length<=500);
 assert(q.parts.length>=2&&q.parts.every(s=>s.trim()));
 assert(q.focusOptions.length>=2&&q.focusOptions.every(s=>s.trim()));
 assert(Number.isInteger(q.difficulty)&&q.difficulty>=1&&q.difficulty<=4);
}
for(const id of categories)assert(support.questions.some(q=>q.categoryId===id));
unique(glossary.entries.filter(x=>x.entryType==='term'),'termId');
unique(glossary.entries.filter(x=>x.entryType==='interview-norm'),'normId');
for(const e of glossary.entries){
 assert(['term','interview-norm'].includes(e.entryType));assert(e.plain.trim());
 if(e.entryType==='interview-norm')assert(e.relatedSupportIds.length&&e.relatedSupportIds.every(id=>actions.has(id)));
}
assert(jobs.samples.length>=2&&jobs.samples.length<=3);unique(jobs.samples,'jobId');unique(jobs.dictionary,'id');
for(const j of jobs.samples)assert(j.text.length>0&&j.text.length<=5000);
for(const d of jobs.dictionary)assert(d.label&&d.keywords.length&&d.keywords.every(s=>s.trim())&&categories.has(d.categoryId)&&['technical','behavioral','responsibility'].includes(d.kind));
console.log('PASS: interview pack, 12 questions / 4 categories, 3 supports, contextual norms and job dictionary.');
