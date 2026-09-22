import {localJob,localQuestions,STRUCTURE,canApprove} from './interview-core.mjs';

// Practice content stays in memory. Only the profile explicitly saved by the user persists.
export function initInterviewFlow({bank,jobs,glossary,getQuestion,getProfile,setQuestions,startPractice,clearPractice}){
 const $=id=>document.getElementById(id);
 const el=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;};
 const say=(id,value)=>{$(id).textContent=value;};
 let job={items:[]},jd='',questions=localQuestions(bank),contextVersion=0;
 const saved=new Map(),approved=new Map(),pending=new Map();
 const endpoints={job:'analyze-job',questions:'generate-questions',answer:'analyze-answer'};
 const statusId={job:'jobStatus',questions:'questionSource',answer:'answerStatus'};
 const errorId={job:'jobError',questions:'jobError',answer:'answerError'};
 const buttonId={job:'jobAnalyze',questions:'generateQuestions',answer:'analyzeAnswer'};
 const source=r=>r.mode==='llm'?'Made by AI':r.reasonCode==='LOCAL_MODE'?'Made without AI':'AI not available, made without AI';
 function cancel(kind){
  const active=pending.get(kind);if(active){pending.delete(kind);active.controller.abort();say(statusId[kind],'Canceled.');}
  $(buttonId[kind]).disabled=kind==='questions'&&!job.items.length;
  if(kind==='job'||kind==='answer')$(kind+'Cancel').hidden=true;
  if(kind==='questions'&&!pending.has('job'))$('jobCancel').hidden=true;
 }
 function cancelAll(){for(const kind of Object.keys(endpoints))cancel(kind);}
 async function request(kind,body,fallback){
  cancel(kind);say(errorId[kind],'');
  if(!$('aiMode').checked)return {mode:'fallback',reasonCode:'LOCAL_MODE',data:fallback()};
  const token={controller:new AbortController()};pending.set(kind,token);
  $(buttonId[kind]).disabled=true;
  if(kind==='job'||kind==='answer')$(kind+'Cancel').hidden=false;
  if(kind==='questions')$('jobCancel').hidden=false;
  say(statusId[kind],'Working… You can cancel anytime.');
  const timer=setTimeout(()=>token.controller.abort(),11000);
  try{
   const response=await fetch('/api/interview/'+endpoints[kind],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:token.controller.signal});
   const result=await response.json();if(pending.get(kind)!==token)return null;
   if(response.status===400){say(errorId[kind],result.message||'Something went wrong. Try again.');say(statusId[kind],'');return null;}
   if(!response.ok||!['llm','fallback'].includes(result.mode)||!result.data)throw new Error('invalid response');
   return result;
  }catch(error){
   if(pending.get(kind)!==token)return null;
   return {mode:'fallback',reasonCode:error.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR',data:fallback()};
  }finally{
   clearTimeout(timer);
   if(pending.get(kind)===token){pending.delete(kind);$(buttonId[kind]).disabled=kind==='questions'&&!job.items.length;if(kind==='job'||kind==='answer')$(kind+'Cancel').hidden=true;if(kind==='questions')$('jobCancel').hidden=true;}
  }
 }
 function invalidateJob(){
  cancelAll();contextVersion++;job={items:[]};jd='';saved.clear();approved.clear();
  questions=localQuestions(bank);setQuestions(questions);$('jobResult').hidden=true;$('generateQuestions').disabled=true;
  say('questionSource','General questions. Real interviews may differ.');$('startPractice').textContent='Practice with general questions';
  $('answerResult').hidden=true;$('interviewPack').hidden=true;$('ivReview').hidden=true;
  say('jobStatus','Job ad changed. Press “Analyze job ad” again.');
  renderMap();
 }
 function renderMap(){
  $('preparationMap').replaceChildren();
  for(const category of bank.categories){
   const group=questions.filter(q=>q.categoryId===category.categoryId);
   const count=group.filter(q=>saved.has(q.questionId)).length;
   $('preparationMap').append(el('li',`${category.label}: ${count} of ${group.length}`));
  }
  const focus=[...new Set(questions.flatMap(q=>q.requirementIds||[]))].map(id=>job.items.find(i=>i.id===id)?.label).filter(Boolean);
  say('focusAreas',focus.length?'This job asks about: '+focus.join(' · '):'Not a score. Just what you practiced.');
 }
 function renderJob(result){
  job=result.data;jd=$('jdText').value.trim();$('jobCards').replaceChildren();
  for(const [kind,label] of [['technical','Technical skills'],['behavioral','Collaboration skills'],['responsibility','Responsibilities']]){
   const card=el('section','','result-card');card.append(el('h4',label));
   const items=job.items.filter(i=>i.kind===kind);
   if(!items.length)card.append(el('p','Nothing clear in the ad.'));
   for(const item of items){card.append(el('strong',item.label),el('blockquote',item.sourceQuote));}
   $('jobCards').append(card);
  }
  const areas=[...new Set(job.items.map(i=>i.categoryId))].map(id=>bank.categories.find(c=>c.categoryId===id)?.label).filter(Boolean);
  $('jobCards').append(el('p','Good areas to practice: '+(areas.join(' · ')||'none found')));
  say('jobStatus',source(result)+'. Each item shows the words from the ad.');
  $('jobResult').hidden=false;$('generateQuestions').disabled=!job.items.length;
  if(!job.items.length)say('jobError','Nothing clear found. Try general questions, or edit the ad.');
  $('jobResultTitle').focus();
 }
 $('jobAnalyze').onclick=async()=>{
  const input=$('jdText').value.trim();
  if(!input||input.length>5000){say('jobError','Paste a job ad first (up to 5,000 characters).');$('jdText').focus();return;}
  const version=contextVersion;
  const result=await request('job',{jdText:input},()=>localJob(input,jobs));
  if(result&&version===contextVersion&&input===$('jdText').value.trim())renderJob(result);
 };
 $('generateQuestions').onclick=async()=>{
  if(!job.items.length)return;
  const version=contextVersion;
  const result=await request('questions',{jdText:jd,jobProfile:job},()=>({questions:localQuestions(bank)}));
  if(!result||version!==contextVersion)return;
  // Generation-specific IDs prevent old answers or evidence from attaching to new questions.
  contextVersion++;saved.clear();approved.clear();$('interviewPack').hidden=true;$('ivReview').hidden=true;
  questions=result.data.questions.map((q,index)=>({...q,questionId:`generation-${contextVersion}-${index}`}));
  setQuestions(questions);renderMap();
  $('startPractice').textContent='Practice with these questions';
  const count=questions.filter(q=>q.source==='llm').length;
  say('questionSource',`${source(result)}. ${questions.length} questions ready.`);
 };
 $('startPractice').onclick=()=>{startPractice();$('practiceTitle').focus();};
 $('jobCancel').onclick=()=>{cancel('job');cancel('questions');};
 $('answerCancel').onclick=()=>cancel('answer');
 $('jdText').addEventListener('input',invalidateJob);
 for(const sample of jobs.samples){
  const b=el('button',sample.title);b.onclick=()=>{$('jdText').value=sample.text;invalidateJob();$('jdText').focus();};$('jobSamples').append(b);
 }
 for(const entry of glossary.entries.filter(e=>e.entryType==='term'))$('interviewGlossary').append(el('dt',entry.term),el('dd',entry.plain));
 function onQuestionChange(){cancel('answer');$('answerResult').hidden=true;say('answerError','');say('answerStatus','');const q=getQuestion();say('currentQuestionSource',q?.source==='llm'?'Made by AI. Skip it if it doesn’t fit.':'General practice question.');}
 $('ivAnswer').addEventListener('input',()=>{
  cancel('answer');$('answerResult').hidden=true;
  const q=getQuestion();
  if(q&&saved.has(q.questionId)){
   saved.delete(q.questionId);approved.delete(q.questionId);$('interviewPack').hidden=true;$('ivReview').hidden=true;
   say('answerStatus','Edited. Save again to update.');renderMap();
  }
 });
 $('analyzeAnswer').onclick=async()=>{
  const q=getQuestion(),answer=$('ivAnswer').value.trim();
  if(!q||!answer||answer.length>2000){say('answerError','Write an answer first (up to 2,000 characters).');$('ivAnswer').focus();return;}
  const version=contextVersion;
  saved.set(q.questionId,{question:{...q},answer,evidence:[]});approved.delete(q.questionId);renderMap();$('interviewPack').hidden=true;
  const result=await request('answer',{jdText:jd,jobProfile:job,question:q.text,answer},()=>({evidence:[],addPrompts:Object.keys(STRUCTURE)}));
  if(!result||version!==contextVersion||getQuestion()?.questionId!==q.questionId||answer!==$('ivAnswer').value.trim())return;
  saved.set(q.questionId,{question:{...q},answer,evidence:result.data.evidence});
  $('answerCards').replaceChildren();
  if(!result.data.evidence.length)$('answerCards').append(el('p','No clear strengths found yet. The tips below can help. This is not a grade.'));
  for(const item of result.data.evidence){
   const card=el('section','','result-card');
   card.append(el('h4',item.strength),el('blockquote',item.quote));
   const requirement=job.items.find(i=>i.id===item.requirementId);
   card.append(el('p',requirement?`Matches the job: ${requirement.label}`:'Not tied to the job ad.'));
   const keep=el('button','Yes, this is me — keep');keep.setAttribute('aria-pressed','false');
   keep.onclick=()=>{
    if(!canApprove(true,item.quote))return;
    const list=approved.get(q.questionId)||[];const chosen=list.includes(item);
    approved.set(q.questionId,chosen?list.filter(x=>x!==item):[...list,item]);
    keep.setAttribute('aria-pressed',String(!chosen));keep.textContent=chosen?'Yes, this is me — keep':'Kept · press to remove';$('interviewPack').hidden=true;
   };
   card.append(keep);$('answerCards').append(card);
  }
  const prompts=el('section','','result-card');prompts.append(el('h4','Tips to add more'));
  for(const key of result.data.addPrompts)prompts.append(el('p',STRUCTURE[key]));
  if(result.data.addPrompts.length)$('answerCards').append(prompts);
  say('answerStatus',source(result)+'. Saved. You choose what to keep.');
  $('answerResult').hidden=false;$('answerTitle').focus();
 };
 function reflect(){
  const body=$('reflectionBody');body.replaceChildren(el('h4','Strengths you kept'));
  const evidence=[...approved.values()].flat();
  if(!evidence.length)body.append(el('p','None kept yet. That’s okay.'));
  for(const item of evidence)body.append(el('strong',item.strength),el('blockquote',item.quote));
  body.append(el('p',`${saved.size} ${saved.size===1?'answer':'answers'} saved. You pick what to practice next.`));
  renderMap();
 }
 $('buildPack').onclick=()=>{
  const target=$('interviewPack');target.replaceChildren(el('h3','Your interview pack'));
  target.append(el('h4','Role'),el('p',jd.split('\n')[0]||'No job ad yet'));
  const profile=getProfile();
  target.append(el('h4','Your strengths'),el('p',(profile?.strengths||[]).map(id=>bank.strengths.find(s=>s.strengthId===id)?.text).filter(Boolean).join(' · ')||'Not provided'));
  target.append(el('h4','Strengths from your answers'));
  const evidence=[...approved.values()].flat();
  if(!evidence.length)target.append(el('p','None kept yet.'));
  for(const item of evidence)target.append(el('strong',item.strength),el('blockquote',item.quote));
  target.append(el('h4','Practice questions'));
  const list=el('ul','');for(const q of questions)list.append(el('li',q.text));target.append(list);
  target.append(el('h4','Help that works for me'));
  for(const group of bank.profileQuestions){const option=group.options.find(o=>o.optionId===profile?.answers?.[group.groupId]);if(option)target.append(el('p',`${group.label}: ${option.text}`));}
  for(const id of profile?.kept||[]){const action=bank.supportActions.find(a=>a.supportId===id);if(action)target.append(el('p','I also like: '+action.label));}
  target.append(el('h4','My questions for them'),el('p',$('employerQuestions').value.trim()||'What would you like to know about the interview process or the team’s way of working?'));
  target.hidden=false;target.focus();
 };
 $('employerQuestions').addEventListener('input',()=>{$('interviewPack').hidden=true;});
 $('clearSession').onclick=()=>{
  cancelAll();contextVersion++;saved.clear();approved.clear();job={items:[]};jd='';questions=localQuestions(bank);
  $('jdText').value='';$('employerQuestions').value='';$('jobResult').hidden=true;$('answerResult').hidden=true;$('interviewPack').hidden=true;$('ivReview').hidden=true;
  say('jobError','');say('answerError','');clearPractice();setQuestions(questions);$('generateQuestions').disabled=true;
  say('jobStatus','Practice cleared. Your profile is still saved.');
  say('questionSource','General questions. Real interviews may differ.');say('answerStatus','');renderMap();$('jobTitle').focus();
 };
 renderMap();
 return {cancelAll,onQuestionChange,reflect,invalidatePack:()=>{$('interviewPack').hidden=true;}};
}
