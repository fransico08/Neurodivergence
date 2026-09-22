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
 const source=r=>r.mode==='llm'?'AI · suggestion to review':r.reasonCode==='LOCAL_MODE'?'Local · rules/templates':`Fallback · ${r.reasonCode||'API_ERROR'}`;
 function cancel(kind){
  const active=pending.get(kind);if(active){pending.delete(kind);active.controller.abort();say(statusId[kind],'Canceled. The previous result was not applied.');}
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
  say(statusId[kind],'Processing with AI… You can cancel, and there is no need to respond quickly.');
  const timer=setTimeout(()=>token.controller.abort(),11000);
  try{
   const response=await fetch('/api/interview/'+endpoints[kind],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:token.controller.signal});
   const result=await response.json();if(pending.get(kind)!==token)return null;
   if(response.status===400){say(errorId[kind],result.message||'The data is invalid. Review it and try again.');say(statusId[kind],'No new result was created.');return null;}
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
  say('questionSource','Practice question bank · not personalized to the new job description.');$('startPractice').textContent='Practice with templates';
  $('answerResult').hidden=true;$('interviewPack').hidden=true;$('ivReview').hidden=true;
  say('jobStatus','The job description changed. Analyze it again to preserve the right context. Saved evidence from the previous role was cleared; drafts remain.');
  renderMap();
 }
 function renderMap(){
  $('preparationMap').replaceChildren();
  for(const category of bank.categories){
   const group=questions.filter(q=>q.categoryId===category.categoryId);
   const count=group.filter(q=>saved.has(q.questionId)).length;
   $('preparationMap').append(el('li',`${category.label}: ${count}/${group.length} answered questions saved.`));
  }
  const focus=[...new Set(questions.flatMap(q=>q.requirementIds||[]))].map(id=>job.items.find(i=>i.id===id)?.label).filter(Boolean);
  say('focusAreas',`This is a practice count, not an ability score. ${focus.length?'Focus areas from the job description: '+focus.join(' · '):'Software interview question bank; not yet personalized to a job description.'}`);
 }
 function renderJob(result){
  job=result.data;jd=$('jdText').value.trim();$('jobCards').replaceChildren();
  for(const [kind,label] of [['technical','Technical skills'],['behavioral','Collaboration skills'],['responsibility','Responsibilities']]){
   const card=el('section','','result-card');card.append(el('h4',label));
   const items=job.items.filter(i=>i.kind===kind);
   if(!items.length)card.append(el('p','No clear evidence was found in the job description.'));
   for(const item of items){card.append(el('strong',item.label),el('blockquote',item.sourceQuote));}
   $('jobCards').append(card);
  }
  const areas=[...new Set(job.items.map(i=>i.categoryId))].map(id=>bank.categories.find(c=>c.categoryId===id)?.label).filter(Boolean);
  $('jobCards').append(el('p','Suggested practice areas from the job description: '+(areas.join(' · ')||'not identified')+'. These are not predictions of exact interview questions.'));
  say('jobStatus',source(result)+'. Every item includes a source quote; review it in context.');
  $('jobResult').hidden=false;$('generateQuestions').disabled=!job.items.length;
  if(!job.items.length)say('jobError','No sourced requirement could be extracted. You can still use the practice bank or revise the job description.');
  $('jobResultTitle').focus();
 }
 $('jobAnalyze').onclick=async()=>{
  const input=$('jdText').value.trim();
  if(!input||input.length>5000){say('jobError','Paste a job description between 1 and 5,000 characters.');$('jdText').focus();return;}
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
  $('startPractice').textContent='Practice with this question set';
  const count=questions.filter(q=>q.source==='llm').length;
  say('questionSource',`${source(result)}. ${count} AI questions, ${questions.length-count} template questions. Templates are not personalized. This set replaces saved results from the previous set.`);
 };
 $('startPractice').onclick=()=>{startPractice();$('practiceTitle').focus();};
 $('jobCancel').onclick=()=>{cancel('job');cancel('questions');};
 $('answerCancel').onclick=()=>cancel('answer');
 $('jdText').addEventListener('input',invalidateJob);
 for(const sample of jobs.samples){
  const b=el('button',sample.title);b.onclick=()=>{$('jdText').value=sample.text;invalidateJob();$('jdText').focus();};$('jobSamples').append(b);
 }
 for(const entry of glossary.entries.filter(e=>e.entryType==='term'))$('interviewGlossary').append(el('dt',entry.term),el('dd',entry.plain));
 function onQuestionChange(){cancel('answer');$('answerResult').hidden=true;say('answerError','');say('answerStatus','');const q=getQuestion();say('currentQuestionSource',q?.source==='llm'?'Question and breakdown: AI · review whether they fit your context.':'Question and breakdown: practice bank · not a prediction of exact interview questions.');}
 $('ivAnswer').addEventListener('input',()=>{
  cancel('answer');$('answerResult').hidden=true;
  const q=getQuestion();
  if(q&&saved.has(q.questionId)){
   saved.delete(q.questionId);approved.delete(q.questionId);$('interviewPack').hidden=true;$('ivReview').hidden=true;
   say('answerStatus','You edited this answer. Save it again to update the evidence.');renderMap();
  }
 });
 $('analyzeAnswer').onclick=async()=>{
  const q=getQuestion(),answer=$('ivAnswer').value.trim();
  if(!q||!answer||answer.length>2000){say('answerError','Choose a question and write an answer between 1 and 2,000 characters.');$('ivAnswer').focus();return;}
  const version=contextVersion;
  saved.set(q.questionId,{question:{...q},answer,evidence:[]});approved.delete(q.questionId);renderMap();$('interviewPack').hidden=true;
  const result=await request('answer',{jdText:jd,jobProfile:job,question:q.text,answer},()=>({evidence:[],addPrompts:Object.keys(STRUCTURE)}));
  if(!result||version!==contextVersion||getQuestion()?.questionId!==q.questionId||answer!==$('ivAnswer').value.trim())return;
  saved.set(q.questionId,{question:{...q},answer,evidence:result.data.evidence});
  $('answerCards').replaceChildren();
  if(!result.data.evidence.length)$('answerCards').append(el('p','No sufficiently grounded evidence was identified. The prompts below support reflection; they are not an AI assessment of your ability.'));
  for(const item of result.data.evidence){
   const card=el('section','','result-card');
   card.append(el('h4',item.strength),el('blockquote',item.quote));
   const requirement=job.items.find(i=>i.id===item.requirementId);
   card.append(el('p',requirement?`Suggested link to the job description: ${requirement.label}`:'Not linked to a specific job requirement.'));
   const keep=el('button','This reflects my experience — keep it');keep.setAttribute('aria-pressed','false');
   keep.onclick=()=>{
    if(!canApprove(true,item.quote))return;
    const list=approved.get(q.questionId)||[];const chosen=list.includes(item);
    approved.set(q.questionId,chosen?list.filter(x=>x!==item):[...list,item]);
    keep.setAttribute('aria-pressed',String(!chosen));keep.textContent=chosen?'This reflects my experience — keep it':'Kept — select to remove';$('interviewPack').hidden=true;
   };
   card.append(keep);$('answerCards').append(card);
  }
  const prompts=el('section','','result-card');prompts.append(el('h4','Prompts to review or expand your answer'));
  for(const key of result.data.addPrompts)prompts.append(el('p',STRUCTURE[key]));
  if(result.data.addPrompts.length)$('answerCards').append(prompts);
  say('answerStatus',source(result)+'. The answer is saved for this session. A correct quote does not prove the interpretation; you decide what to keep.');
  $('answerResult').hidden=false;$('answerTitle').focus();
 };
 function reflect(){
  const body=$('reflectionBody');body.replaceChildren(el('h4','Evidence you chose to keep'));
  const evidence=[...approved.values()].flat();
  if(!evidence.length)body.append(el('p','You have not confirmed any evidence yet. This does not mean you lack ability.'));
  for(const item of evidence)body.append(el('strong',item.strength),el('blockquote',item.quote));
  body.append(el('p',`${saved.size} ${saved.size===1?'answer':'answers'} saved in this session. Choose what you want to practice next; difficulty never increases automatically.`));
  renderMap();
 }
 $('buildPack').onclick=()=>{
  const target=$('interviewPack');target.replaceChildren(el('h3','Interview Pack — personal preparation, not a credential'));
  target.append(el('h4','Role'),el('p',jd.split('\n')[0]||'No job description analyzed'));
  const profile=getProfile();
  target.append(el('h4','Self-reported strengths'),el('p',(profile?.strengths||[]).map(id=>bank.strengths.find(s=>s.strengthId===id)?.text).filter(Boolean).join(' · ')||'Not provided'));
  target.append(el('h4','Evidence you confirmed'));
  const evidence=[...approved.values()].flat();
  if(!evidence.length)target.append(el('p','No evidence selected yet.'));
  for(const item of evidence)target.append(el('strong',item.strength),el('blockquote',item.quote));
  target.append(el('h4','Practice questions — not predicted interview questions'));
  const list=el('ul','');for(const q of questions)list.append(el('li',q.text));target.append(list);
  target.append(el('h4','How I prefer to be supported'));
  for(const group of bank.profileQuestions){const option=group.options.find(o=>o.optionId===profile?.answers?.[group.groupId]);if(option)target.append(el('p',`${group.label}: ${option.text}`));}
  for(const id of profile?.kept||[]){const action=bank.supportActions.find(a=>a.supportId===id);if(action)target.append(el('p','Support I chose to keep: '+action.label));}
  target.append(el('h4','My questions for the employer'),el('p',$('employerQuestions').value.trim()||'What would you like to know about the interview process or the team’s way of working?'));
  target.hidden=false;target.focus();
 };
 $('employerQuestions').addEventListener('input',()=>{$('interviewPack').hidden=true;});
 $('clearSession').onclick=()=>{
  cancelAll();contextVersion++;saved.clear();approved.clear();job={items:[]};jd='';questions=localQuestions(bank);
  $('jdText').value='';$('employerQuestions').value='';$('jobResult').hidden=true;$('answerResult').hidden=true;$('interviewPack').hidden=true;$('ivReview').hidden=true;
  say('jobError','');say('answerError','');clearPractice();setQuestions(questions);$('generateQuestions').disabled=true;
  say('jobStatus','Practice content was cleared from this session. Your support profile remains; use Delete profile to remove it.');
  say('questionSource','Practice question bank.');say('answerStatus','');renderMap();$('jobTitle').focus();
 };
 renderMap();
 return {cancelAll,onQuestionChange,reflect,invalidatePack:()=>{$('interviewPack').hidden=true;}};
}
