import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url),'utf8'));
const [intents,org,glossary]=await Promise.all(['intents_vi','org_map','glossary_vi'].map(read));
const ids=new Set(),phrases=new Set(),roles=new Set(org.roles.map(r=>r.roleId));
assert.equal(roles.size,org.roles.length,'Duplicate roleId');
for(const i of [...intents.intents,intents.fallback]){
 assert(!ids.has(i.intentId));ids.add(i.intentId);assert(roles.has(i.routeTo));assert.equal(i.phrasings.length,3);
 for(const p of i.phrasings){assert(!phrases.has(p.phrasingId));phrases.add(p.phrasingId);assert(p.text.trim());assert(['neutral','direct','soft'].includes(p.tone));}
 assert.deepEqual(i.bSide.replyOptions.map(p=>p.replyId),['accept','clarify','redirect']);
 for(const p of i.bSide.replyOptions)assert(p.text.trim());
}
const normIds=new Set(),termIds=new Set();
for(const e of glossary.entries){
 assert(['term','workplace-norm'].includes(e.entryType));
 if(e.entryType==='term'){assert(e.termId&&e.term&&e.plain);assert(!termIds.has(e.termId));termIds.add(e.termId);continue;}
 assert(e.normId&&!normIds.has(e.normId));normIds.add(e.normId);assert(e.title&&e.plain);
 assert(Array.isArray(e.relatedIntentIds)&&e.relatedIntentIds.length>0);
 assert(e.relatedIntentIds.every(id=>ids.has(id)));
}
assert(normIds.size>=5);
console.log(`PASS: ${ids.size} intents including fallback, ${phrases.size} phrases, ${normIds.size} linked workplace norms.`);
