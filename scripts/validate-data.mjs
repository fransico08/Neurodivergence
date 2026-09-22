import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url),'utf8'));
const [intents,org,glossary,clarifications,interviewClar,interviewOrg,interviewSupport]=await Promise.all(['intents_vi','org_map','glossary_vi','clarifications_vi','clarifications_interview_vi','org_map_interview_vi','interview_support_vi'].map(read));
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
// Kiểm tra theo TỪNG pack thay vì chốt cứng một danh sách ID, để thêm pack mới không phải sửa validator.
const allClarificationPhrases=new Set();
function checkClarificationPack(pack,roleIds,expectedIds,packName){
 const packIds=new Set();
 assert(Array.isArray(pack.sampleMessages)&&pack.sampleMessages.length>=2,`${packName}: cần ít nhất 2 tin nhắn mẫu`);
 for(const sample of pack.sampleMessages){assert(roleIds.has(sample.senderRoleId),`${packName}: senderRoleId ${sample.senderRoleId} không có trong sơ đồ vai trò`);}
 for(const item of pack.clarificationTypes){
  assert(item.clarificationId&&!packIds.has(item.clarificationId),`${packName}: trùng clarificationId`);packIds.add(item.clarificationId);
  assert(item.label&&item.description);assert.equal(item.phrasings.length,3,`${packName}: mỗi loại cần đúng 3 cách nói`);
  const tones=new Set();
  for(const phrase of item.phrasings){
   assert(!allClarificationPhrases.has(phrase.phrasingId),`${packName}: trùng phrasingId ${phrase.phrasingId}`);allClarificationPhrases.add(phrase.phrasingId);
   assert(phrase.text.trim().endsWith('?'),`${packName}: câu làm rõ phải là câu hỏi`);
   assert(['neutral','direct','soft'].includes(phrase.tone));tones.add(phrase.tone);
  }
  assert.equal(tones.size,3,`${packName}: cần đủ neutral/direct/soft`);
 }
 assert.deepEqual([...packIds],expectedIds,`${packName}: danh sách loại làm rõ không khớp`);
 return packIds;
}
const clarificationIds=checkClarificationPack(clarifications,roles,['scope','priority','outcome','coordination'],'clarifications_vi');
const interviewRoles=new Set(interviewOrg.roles.map(r=>r.roleId));
assert.equal(interviewRoles.size,interviewOrg.roles.length,'Trùng roleId trong sơ đồ phỏng vấn');
for(const id of interviewRoles)assert(!roles.has(id),`roleId ${id} trùng giữa hai sơ đồ vai trò`);
const interviewClarIds=checkClarificationPack(interviewClar,interviewRoles,['question-focus','question-breakdown','answer-format','thinking-time'],'clarifications_interview_vi');

// Ngân hàng câu hỏi luyện phỏng vấn
const categoryIds=new Set(interviewSupport.categories.map(c=>c.categoryId));
const supportIds=new Set(),questionIds=new Set(),profileGroupIds=new Set(),strengthIds=new Set();
for(const action of interviewSupport.supportActions){
 assert(action.supportId&&!supportIds.has(action.supportId));supportIds.add(action.supportId);
 assert(action.label&&action.description);
 assert(interviewClarIds.has(action.clarificationId),`supportAction ${action.supportId} trỏ tới clarificationId không tồn tại`);
}
for(const group of interviewSupport.profileQuestions){
 assert(group.groupId&&!profileGroupIds.has(group.groupId));profileGroupIds.add(group.groupId);
 assert(group.label&&group.question&&group.options.length>=2);
 const optionIds=new Set();
 for(const option of group.options){
  assert(option.optionId&&!optionIds.has(option.optionId));optionIds.add(option.optionId);assert(option.text.trim());
  assert(Array.isArray(option.enablesSupport));
  assert(option.enablesSupport.every(id=>supportIds.has(id)),`profile option ${option.optionId} bật hỗ trợ không tồn tại`);
 }
}
for(const strength of interviewSupport.strengths){assert(strength.strengthId&&!strengthIds.has(strength.strengthId));strengthIds.add(strength.strengthId);assert(strength.text.trim());}
for(const question of interviewSupport.questions){
 assert(question.questionId&&!questionIds.has(question.questionId));questionIds.add(question.questionId);
 assert(categoryIds.has(question.categoryId),`câu hỏi ${question.questionId} thuộc nhóm không tồn tại`);
 assert(question.text.trim().endsWith('?')||question.text.trim().endsWith('.'),`câu hỏi ${question.questionId} cần kết thúc bằng ? hoặc .`);
 assert(Array.isArray(question.parts)&&question.parts.length>=2,`câu hỏi ${question.questionId} cần ít nhất 2 phần để tách nhỏ`);
 assert(Array.isArray(question.focusOptions)&&question.focusOptions.length>=2,`câu hỏi ${question.questionId} cần ít nhất 2 khía cạnh`);
}
for(const categoryId of categoryIds)assert(interviewSupport.questions.some(q=>q.categoryId===categoryId),`nhóm ${categoryId} chưa có câu hỏi nào`);

console.log(`PASS: ${ids.size} intents including fallback, ${phrases.size} phrases, ${normIds.size} linked workplace norms, ${clarificationIds.size}+${interviewClarIds.size} clarification types across 2 packs, ${questionIds.size} interview questions in ${categoryIds.size} categories, ${supportIds.size} support actions.`);
