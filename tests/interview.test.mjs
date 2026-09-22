import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pipeline,Question} from '../server/interview.mjs';
import {localJob,groundedJob,localQuestions,groundedEvidence,canApprove} from '../prototype/interview-core.mjs';
import {createServer} from '../server/app.mjs';
import {runModel} from '../server/ai.mjs';
const read=name=>readFile(new URL('../data/'+name+'.json',import.meta.url),'utf8').then(JSON.parse);
const jobs=await read('job_profiles_vi'),bank=await read('interview_support_vi');
const jdText=jobs.samples[0].text,jobProfile=localJob(jdText,jobs);
const answer='Tôi đọc log, tái hiện lỗi API bằng test rồi sửa phần xử lý dữ liệu.';
const requests={job:{jdText},questions:{jdText,jobProfile},answer:{jdText,jobProfile,question:bank.questions[0].text,answer}};
const evidence={strength:'Debugging',quote:answer,requirementId:'debugging'};
const makeQuestion=c=>({...bank.questions.find(q=>q.categoryId===c),requirementIds:['debugging']});
const outputs={job:jobProfile,questions:{questions:bank.categories.map(c=>makeQuestion(c.categoryId))},answer:{evidence:[evidence],addPrompts:['result']}};
const run=(kind,provider,extra={})=>pipeline(kind,requests[kind],{provider,jobs,bank,...extra});

test('local JD extraction uses whole words and source quotes',()=>{
 assert(jobProfile.items.some(i=>i.id==='react'));assert(jobProfile.items.every(i=>jdText.includes(i.sourceQuote)));
 assert.equal(localJob('Phản ứng reaction',jobs).items.length,0);
 assert.equal(localJob(' ',jobs).items.length,0);
});
test('JD validator rejects fabricated skill, quote, kind and ungrounded label',()=>{
 for(const item of [{...jobProfile.items[0],sourceQuote:'not in JD'},{...jobProfile.items[0],kind:'behavioral'},{id:'python',label:'Python',kind:'technical',categoryId:'technical',sourceQuote:jdText}]){
  assert.equal(groundedJob({items:[item]},jdText,jobs).items.length,0);
 }
});
test('unknown skills require literal grounded label',()=>{
 assert.equal(groundedJob({items:[{id:'custom',label:'Kotlin',kind:'technical',categoryId:'technical',sourceQuote:'Cần Kotlin'}]},'Cần Kotlin',jobs).items.length,1);
});
for(const kind of Object.keys(requests)){
 test(kind+' pipeline returns structured LLM with fake provider',async()=>{
  const r=await run(kind,async(payload,_signal,mode)=>{assert.equal(mode,kind);assert(!payload.supportProfile);return outputs[kind];});
  assert.equal(r.mode,'llm');assert(r.data);
 });
 test(kind+' no-key, timeout, rate limit, API error and malformed output have deterministic fallback',async()=>{
  const baseline=await run(kind,null);assert.equal(baseline.reasonCode,'NO_KEY');
  for(const [provider,reason] of [[async()=>null,'VALIDATION_FAILED'],[async()=>{throw {status:429};},'RATE_LIMIT'],[async()=>{throw Error('not logged');},'API_ERROR'],[()=>new Promise(()=>{}),'TIMEOUT']]){
   const r=await run(kind,provider,{timeoutMs:5});assert.equal(r.mode,'fallback');assert.equal(r.reasonCode,reason);assert.deepEqual(r.data,baseline.data);
  }
 });
}
test('questions missing parts/focus are rejected and category replaced from bank',async()=>{
 const invalid={...makeQuestion('technical')};delete invalid.parts;
 assert(!Question.safeParse(invalid).success);
 const result=await run('questions',async()=>({questions:[invalid,makeQuestion('behavioral')]}));
 assert.equal(result.mode,'llm');assert.equal(result.data.questions.length,4);
 assert.equal(result.data.questions.find(q=>q.categoryId==='technical').source,'static');
 assert.equal(result.data.questions.find(q=>q.categoryId==='behavioral').source,'llm');
 assert(result.data.questions.every(q=>q.parts.length&&q.focusOptions.length));
});
test('question with invented requirement falls back rather than claiming relevance',async()=>{
 const result=await run('questions',async()=>({questions:[{...makeQuestion('technical'),requirementIds:['fabricated']}]}));
 assert.equal(result.reasonCode,'VALIDATION_FAILED');assert.equal(result.data.questions.length,12);
});
test('answer evidence exact substring and valid requirement only',()=>{
 assert(groundedEvidence(outputs.answer,answer,jobProfile));
 for(const e of [{...evidence,quote:'Tôi tiết kiệm hàng triệu đồng'},{...evidence,requirementId:'invented'},{...evidence,quote:'Tôi'}])assert.equal(groundedEvidence({evidence:[e]},answer,jobProfile),null);
});
test('negative quote, clinical label and score never become evidence',()=>{
 for(const e of [{...evidence,strength:'72% ADHD'},{...evidence,strength:'7/10'},{...evidence,quote:'Tôi chưa từng làm debugging'}])assert.equal(groundedEvidence({evidence:[e]},answer+' Tôi chưa từng làm debugging',jobProfile),null);
});
test('no valid evidence uses four reflection prompts without claims',async()=>{
 const result=await run('answer',async()=>({evidence:[{...evidence,quote:'fabricated text'}],addPrompts:[]}));
 assert.equal(result.mode,'fallback');assert.deepEqual(result.data.evidence,[]);assert.equal(result.data.addPrompts.length,4);
});
test('approval is explicit, nonempty and not a truthy event object',()=>{
 assert(canApprove(true,'Tôi chọn câu này'));for(const confirm of [false,undefined,{},'true',1])assert(!canApprove(confirm,'text'));assert(!canApprove(true,' '));
});
test('strict input limits and job tampering rejected before provider call',async()=>{
 let calls=0;const options={jobs,bank,provider:async()=>{calls++;return null;}};
 for(const [kind,body] of [['job',{jdText:''}],['job',{jdText:'a'.repeat(5001)}],['questions',{jdText,jobProfile:{items:[{...jobProfile.items[0],sourceQuote:'made up'}]}}],['answer',{...requests.answer,answer:'a'.repeat(2001)}],['answer',{...requests.answer,diagnosis:'ADHD'}]])assert.equal(await pipeline(kind,body,options),null);
 assert.equal(calls,0);
});
test('static bank complete and distinct IDs',()=>{
 const questions=localQuestions(bank);assert.equal(questions.length,12);assert.equal(new Set(questions.map(q=>q.questionId)).size,12);assert(questions.every(q=>q.source==='static'&&q.parts.length&&q.focusOptions.length));
});
test('external cancellation does not await an uncooperative provider',async()=>{
 const controller=new AbortController();
 const pending=runModel({}, {provider:()=>new Promise(()=>{}),mode:'job',validate:()=>true,signal:controller.signal,timeoutMs:10000});
 controller.abort();
 const result=await Promise.race([pending,new Promise((_,reject)=>{const timer=setTimeout(()=>reject(Error('not cancelled')),200);timer.unref();})]);
 assert.equal(result.mode,'fallback');
});
test('HTTP pipeline success, bad JSON/input, UTF-8 and private files',async()=>{
 const server=createServer(async(_r,_s,mode)=>outputs[mode]);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const post=(endpoint,body)=>fetch(base+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{
  for(const [kind,endpoint] of [['job','analyze-job'],['questions','generate-questions'],['answer','analyze-answer']]){
   const response=await post('/api/interview/'+endpoint,requests[kind]);assert.equal(response.status,200);assert.equal((await response.json()).mode,'llm');
   assert.equal((await post('/api/interview/'+endpoint,{})).status,400);
  }
  assert.equal((await post('/api/interview/analyze-job',{jdText:'ế'.repeat(5000)})).status,200);
  assert.equal((await post('/api/interview/analyze-job',{jdText:'ế'.repeat(5001)})).status,400);
  assert.equal((await fetch(base+'/api/interview/analyze-job',{method:'POST',headers:{'Content-Type':'application/json'},body:'broken'})).status,400);
  assert.equal((await fetch(base+'/prototype/interview-flow.mjs')).status,200);
  assert.equal((await fetch(base+'/.env')).status,404);
 }finally{await new Promise(r=>server.close(r));}
});
