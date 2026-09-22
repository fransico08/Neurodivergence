import {hasKeyword,norm} from './core.mjs';
export const CATEGORIES=['technical','behavioral','situational','job-specific'];
export const STRUCTURE={
 context:'Context: what was the situation or goal?',
 action:'Action: what steps did you personally take?',
 result:'Result: what changed? Include numbers only if they are real.',
 lesson:'Learning: what did you learn, or what would you do differently next time?'
};
export const plainSafe=s=>typeof s==='string'&&!/(?:\d+\s*\/\s*10|\d+\s*%|\bADHD\b|\bautis|\bIQ\b|diagnos|disorder|patient)/iu.test(s);
export function localJob(jdText,pack){
 const lines=jdText.split(/[\n.!?]+/).map(s=>s.trim()).filter(Boolean);
 const items=pack.dictionary.flatMap(d=>{
  const sourceQuote=lines.find(line=>d.keywords.some(k=>hasKeyword(line,k)));
  return sourceQuote?[{id:d.id,label:d.label,kind:d.kind,categoryId:d.categoryId,sourceQuote}]:[];
 });
 return {items};
}
// Keep only labels that can be traced to a source quote.
export function groundedJob(value,jdText,pack){
 if(!Array.isArray(value?.items))return {items:[]};
 const items=[];
 for(const item of value.items){
  if(!item||!['technical','behavioral','responsibility'].includes(item.kind)||!CATEGORIES.includes(item.categoryId)||!item.sourceQuote?.trim()||!jdText.includes(item.sourceQuote)||!plainSafe(item.label))continue;
  const known=pack.dictionary.find(d=>d.id===item.id&&d.label===item.label);
  if(known){
   if(known.kind!==item.kind||known.categoryId!==item.categoryId||!known.keywords.some(k=>hasKeyword(item.sourceQuote,k)))continue;
  }else if(!hasKeyword(item.sourceQuote,item.label))continue;
  const id=known?.id||'jd-'+norm(item.label).replaceAll(' ','-').slice(0,80);
  if(items.some(x=>x.id===id))continue;
  items.push({...item,id});
 }
 return {items};
}
export function localQuestions(bank){return bank.questions.map(q=>({...q,requirementIds:[],source:'static'}));}
export function completedQuestions(candidates,bank,job){
 const ids=new Set(job.items.map(x=>x.id)),used=new Set(),questions=[];
 for(const q of candidates||[]){
  if(!CATEGORIES.includes(q.categoryId)||!plainSafe(q.text)||!Array.isArray(q.parts)||q.parts.length<2||!q.parts.every(plainSafe)||!Array.isArray(q.focusOptions)||q.focusOptions.length<2||!q.focusOptions.every(plainSafe)||!q.requirementIds?.length||!q.requirementIds.every(id=>ids.has(id))||used.has(q.questionId))continue;
  used.add(q.questionId);questions.push({...q,source:'llm'});
 }
 if(!questions.length)return null;
 for(const c of CATEGORIES)if(!questions.some(q=>q.categoryId===c)){
  const q=bank.questions.find(q=>q.categoryId===c);
  questions.push({...q,requirementIds:[],source:'static'});
 }
 return questions;
}
export function groundedEvidence(value,answer,job){
 const ids=new Set(job.items.map(i=>i.id));
 const evidence=(value?.evidence||[]).filter(e=>
  e.quote?.trim().length>=8&&answer.includes(e.quote)&&plainSafe(e.strength)&&
  (!e.requirementId||ids.has(e.requirementId))&&
  // Basic negation guardrail; this is not semantic proof.
  !/(?:have not|haven't|never|did not|didn't|cannot|can't)\s+(?:know|have|used|done|worked|built|learned)/iu.test(e.quote)
 );
 if(!evidence.length)return null;
 return {evidence,addPrompts:(value.addPrompts||[]).filter(k=>Object.hasOwn(STRUCTURE,k))};
}
export function canApprove(confirmed,value){return confirmed===true&&typeof value==='string'&&value.trim().length>0;}
