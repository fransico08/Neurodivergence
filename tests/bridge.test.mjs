import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {detectIntent,norm,hasKeyword,extractTicket,fillTicket} from '../prototype/core.mjs';
import {suggest,validateOutput,validRequest} from '../server/ai.mjs';
import {createServer} from '../server/app.mjs';
const intents=JSON.parse(await readFile(new URL('../data/intents_vi.json',import.meta.url)));
const req={rawText:'em không hiểu task API-142',intentId:'unclear-task',allowedFacts:{ticket:'API-142'}};
const output={acknowledgedIntentId:'unclear-task',confident:true,options:{neutral:'Em chưa hiểu API-142. Anh/chị giải thích giúp em nhé?',direct:'Em cần làm rõ yêu cầu.',soft:'Anh/chị giúp em hiểu rõ hơn được không ạ?'}};
test('Vietnamese normalization, whole words, no-hit abstain, routing and ticket',()=>{
 assert.equal(norm('ĐẦU VÀO'),'dau vao');assert.equal(hasKeyword('trời đẹp','rối'),false);
 assert.equal(detectIntent('hom nay troi dep qua',intents),null);
 assert.equal(detectIntent('em khong hieu task nay',intents).intent.routeTo,'tech-lead');
 assert.equal(detectIntent('công việc lặp lại',intents).intent.intentId,'under-stimulated');
 assert.equal(extractTicket('api-142'),'API-142');assert.equal(fillTicket('{ticket}',null),'việc được giao');
});
test('request strict schema and server checks client ticket and intent',()=>{
 assert(validRequest(req,intents));assert.equal(validRequest({...req,intentId:'made-up'},intents),null);
 assert.equal(validRequest({...req,allowedFacts:{ticket:'API-999'}},intents),null);
 assert.equal(validRequest({...req,rawText:' '},intents),null);assert.equal(validRequest({...req,extra:1},intents),null);
});
test('output schema, ID echo, confidence, unsupported past and numeric fact',()=>{
 assert(validateOutput(output,req,[]));
 for(const bad of [null,{...output,confident:false},{...output,acknowledgedIntentId:'overload'},{...output,options:{...output.options,soft:'Em đã thử 9 lần.'}},{...output,options:{...output.options,direct:'Anh Đức giúp em.'}}])assert.equal(validateOutput(bad,req,[{name:'Anh Đức'}]),false);
});
test('LLM and deterministic fallback contracts with fake provider',async()=>{
 assert.equal((await suggest(req,{roles:[]})).reasonCode,'NO_KEY');
 assert.equal((await suggest(req,{roles:[],provider:async()=>output})).mode,'llm');
 assert.equal((await suggest(req,{roles:[],provider:async()=>null})).reasonCode,'VALIDATION_FAILED');
 assert.equal((await suggest(req,{roles:[],provider:async()=>{throw {status:429};}})).reasonCode,'RATE_LIMIT');
 assert.equal((await suggest(req,{roles:[],provider:async()=>{throw new Error('secret');}})).reasonCode,'API_ERROR');
 assert.equal((await suggest(req,{roles:[],provider:()=>new Promise(()=>{}),timeoutMs:10})).reasonCode,'TIMEOUT');
});
test('reject fabricated weekday, numeric substrings and bare recipient name',()=>{
 for(const phrase of ['Em sẽ làm thứ Hai.','Em cần 14 phút.','Đức giúp em nhé.','Em sẽ làm ngày 12/03.']){
  assert.equal(validateOutput({...output,options:{...output.options,soft:phrase}},req,[{name:'Anh Đức'}]),false);
 }
});
test('Vietnamese common words do not collide with diacritic-bearing names',()=>{
 const candidate={...output,options:{...output.options,soft:'Dạ, em chưa nắm rõ task API-142 này ạ.'}};
 assert(validateOutput(candidate,req,[{name:'Anh Nam'}]));
});
test('HTTP static allowlist, error, fallback, forbidden origin',async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try {
  assert.equal((await fetch(base+'/')).status,200);
  for(const p of ['/.env','/package.json','/server/app.mjs','/prompt-for-agent.md'])assert.equal((await fetch(base+p)).status,404);
  const post=body=>fetch(base+'/api/suggest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await (await post(req)).json()).reasonCode,'NO_KEY');assert.equal((await post({})).status,400);
  assert.equal((await fetch(base+'/',{headers:{Origin:'https://evil.example'}})).status,403);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
