import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {norm,hasKeyword} from '../prototype/core.mjs';
import {clarify,validateClarificationOutput,validClarificationRequest} from '../server/ai.mjs';
import {createServer} from '../server/app.mjs';
const pack=JSON.parse(await readFile(new URL('../data/clarifications_interview_vi.json',import.meta.url)));
const req={originalMessage:'Bạn sẽ gỡ lỗi API như thế nào?',clarificationId:'question-focus',packId:'interview'};
const output={acknowledgedClarificationId:'question-focus',confident:true,options:{neutral:'Anh/chị muốn em tập trung vào phần nào ạ?',direct:'Em nên giải thích cách tìm lỗi hay cách kiểm tra kết quả ạ?',soft:'Anh/chị làm rõ trọng tâm giúp em được không ạ?'}};
test('Vietnamese normalization and whole-word matching',()=>{
 assert.equal(norm('ĐẦU VÀO'),'dau vao');assert.equal(hasKeyword('trời đẹp','rối'),false);assert(hasKeyword('Tôi dùng React','react'));
});
test('strict interview request and allowed pack',()=>{
 assert(validClarificationRequest(req,pack));
 for(const bad of [{...req,packId:'workplace'},{...req,clarificationId:'scope'},{...req,originalMessage:' '},{...req,extra:1}])assert.equal(validClarificationRequest(bad,pack),null);
});
test('output schema, echo and confidence',()=>{
 assert(validateClarificationOutput(output,req,[]));
 for(const bad of [null,{...output,confident:false},{...output,acknowledgedClarificationId:'thinking-time'},{...output,score:8}])assert.equal(validateClarificationOutput(bad,req,[]),false);
});
test('reject unsupported past action and numeric fact',()=>{
 for(const phrase of ['Em đã thử cách này, đúng không?','Em cần 14 phút được không?'])assert.equal(validateClarificationOutput({...output,options:{...output.options,soft:phrase}},req,[]),false);
});
test('reject fabricated weekday, date and recipient name',()=>{
 for(const phrase of ['Thứ Hai được không?','Ngày 12/03 được không?','Đức giúp em nhé?'])assert.equal(validateClarificationOutput({...output,options:{...output.options,soft:phrase}},req,[{name:'Anh Đức'}]),false);
});
test('Vietnamese diacritics do not confuse nắm and Nam',()=>{
 assert(validateClarificationOutput({...output,options:{...output.options,soft:'Em chưa nắm rõ, anh/chị nói thêm được không?'}},req,[{name:'Anh Nam'}]));
});
test('LLM and deterministic fallback with fake provider',async()=>{
 assert.equal((await clarify(req)).reasonCode,'NO_KEY');
 assert.equal((await clarify(req,{provider:async(_r,_s,mode)=>{assert.equal(mode,'clarify-interview');return output;}})).mode,'llm');
 assert.equal((await clarify(req,{provider:async()=>null})).reasonCode,'VALIDATION_FAILED');
 assert.equal((await clarify(req,{provider:async()=>{throw {status:429};}})).reasonCode,'RATE_LIMIT');
 assert.equal((await clarify(req,{provider:async()=>{throw new Error('not returned');}})).reasonCode,'API_ERROR');
 assert.equal((await clarify(req,{provider:()=>new Promise(()=>{}),timeoutMs:10})).reasonCode,'TIMEOUT');
});
test('HTTP allowlist, removed endpoint, default interview, invalid pack and origin',async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  assert.equal((await fetch(base+'/')).status,200);
  for(const p of ['/.env','/package.json','/server/app.mjs','/data/intents_vi.json','/api/suggest'])assert.equal((await fetch(base+p)).status,404);
  const post=body=>fetch(base+'/api/clarify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await (await post(req)).json()).reasonCode,'NO_KEY');
  const {packId,...defaultReq}=req;assert.equal((await post(defaultReq)).status,200);
  assert.equal((await post({...req,packId:'made-up'})).status,400);
  assert.equal((await post({})).status,400);
  assert.equal((await fetch(base+'/',{headers:{Origin:'https://evil.example'}})).status,403);
 }finally{await new Promise(r=>server.close(r));}
});
