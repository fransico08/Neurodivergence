import {initInterviewFlow} from './interview-flow.mjs';
import {localQuestions} from './interview-core.mjs';
const $=id=>document.getElementById(id);
let interviewFlow=null,practiceQuestions=null;
let ORG,GLO,CLAR;
let clarification=null,clarificationSelection=null,clarificationController=null,clarificationRevision=0,clarificationSeq=0,sampleIndex=0;
const records=[];
const text=(id,value)=>{$(id).textContent=value;};
function node(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
function evidence(){text('evidence',JSON.stringify(records,null,2));}
function cancelClarification(){clarificationRevision++;clarificationController?.abort();clarificationController=null;}
function updateClarificationSend(){$('cSend').disabled=!clarification||!$('cApproved').value.trim()||clarification.status!=='draft';}
function renderClarificationOptions(options,source){
 $('cOptions').replaceChildren();clarificationSelection=null;$('cApproved').value='';updateClarificationSend();
 for(const option of options){
  const button=node('button','', 'opt');button.setAttribute('aria-pressed','false');
  button.append(node('span',CLAR.toneLabels[option.tone]||option.tone,'toneTag'),node('span',option.text),node('span',source==='llm'?'AI · automatically checked; review the meaning':`Template · ${option.phrasingId}`,'src'));
  button.onclick=()=>{for(const other of $('cOptions').children)other.setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true');clarificationSelection={...option,source};$('cApproved').value=option.text;updateClarificationSend();$('cApproved').focus({preventScroll:true});};
  $('cOptions').append(button);
 }
}
function showClarificationSample(){
 if(!CLAR)return;
 const sample=CLAR.sampleMessages[sampleIndex%CLAR.sampleMessages.length];
 const role=ORG.roles.find(item=>item.roleId===sample.senderRoleId);
 text('cSender',`${role?.title||'Interviewer'} · simulated message`);text('cOriginal',sample.text);
}
function resetClarificationView(){
 cancelClarification();clarification=null;clarificationSelection=null;
 $('cFlow').hidden=true;$('cComposer').hidden=true;$('cReceiver').hidden=true;$('cReceiverEmpty').hidden=false;$('cAnswer').hidden=true;$('cResolve').hidden=true;
 $('cApproved').value='';$('cResponse').value='';$('cRespond').disabled=true;text('cUserStatus','');$('cTypes').inert=false;$('cOptions').inert=false;$('cApproved').disabled=false;
 for(const button of $('cTypes').children)button.setAttribute('aria-pressed','false');
 showClarificationSample();
}
async function chooseClarification(type){
 cancelClarification();const current=clarificationRevision;
 const sample=CLAR.sampleMessages[sampleIndex%CLAR.sampleMessages.length];
 clarification={status:'draft',sample,type,reasonCode:'LOCAL_MODE'};
 for(const button of $('cTypes').children)button.setAttribute('aria-pressed',button.dataset.id===type.clarificationId?'true':'false');
 $('cComposer').hidden=false;renderClarificationOptions(type.phrasings,'static');$('cOptionsHeading').focus({preventScroll:true});
 if(!$('aiMode').checked){text('cUserStatus','Using a template; no data has been sent to AI.');return;}
 clarificationController=new AbortController();const localController=clarificationController;
 text('cUserStatus','Getting clarification suggestions from AI…');$('cTypes').inert=true;$('cOptions').inert=true;$('cApproved').disabled=true;
 const timeout=setTimeout(()=>localController.abort(),5500);
 try{
  const response=await fetch('/api/clarify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({originalMessage:sample.text,clarificationId:type.clarificationId,packId:'interview'}),signal:localController.signal});
  const result=await response.json();if(current!==clarificationRevision)return;
  if(response.status===400){clarification.reasonCode='BAD_INPUT';text('cUserStatus',result.message||'The clarification data is invalid.');}
  else if(response.ok&&result.mode==='llm'){
   clarification.reasonCode=null;renderClarificationOptions(Object.entries(result.options).map(([tone,value])=>({tone,text:value,phrasingId:`llm-${tone}`})),'llm');
   text('cUserStatus','The AI suggestion passed automated checks; review the meaning before sending.');
  }else{clarification.reasonCode=result.reasonCode||'API_ERROR';text('cUserStatus',`Using a fallback template (${clarification.reasonCode}).`);}
 }catch(error){if(current===clarificationRevision){clarification.reasonCode=error.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';text('cUserStatus',`Using a fallback template (${clarification.reasonCode}).`);}}
 finally{clearTimeout(timeout);if(current===clarificationRevision){clarificationController=null;$('cTypes').inert=false;$('cOptions').inert=false;$('cApproved').disabled=false;}}
}
function sendClarification(confirmed=false){
 if(confirmed!==true){text('error','Blocked: approval is required. The interviewer received nothing and no record was created.');return false;}
 const approved=$('cApproved').value.trim();if(!clarification||clarification.status!=='draft'||!approved)return;
 const record={recordType:'clarification',id:`clarify-${++clarificationSeq}`,originalMessageId:clarification.sample.messageId,originalMessage:clarification.sample.text,fromRoleId:clarification.sample.senderRoleId,clarificationId:clarification.type.clarificationId,userApprovedText:approved,source:clarificationSelection?.source==='llm'?'llm':clarificationSelection?'fallback':'user',sourceFile:clarificationSelection?.source==='static'?'data/clarifications_interview_vi.json':clarificationSelection?.source==='llm'?'/api/clarify':null,pickedPhrasingId:clarificationSelection?.phrasingId||null,wasEdited:!clarificationSelection||approved!==clarificationSelection.text,reasonCode:clarification.reasonCode,status:'awaiting-response',response:null};
 clarification={...clarification,record,status:'awaiting-response'};records.push(record);evidence();
 text('cReceiverOriginal',record.originalMessage);text('cReceiverQuestion',record.userApprovedText);$('cReceiverEmpty').hidden=true;$('cReceiver').hidden=false;
 $('cResponse').value=CLAR.responseExamples[sampleIndex%CLAR.responseExamples.length]||'';$('cRespond').disabled=!$('cResponse').value.trim();
 text('cUserStatus','Sent in the simulation · Waiting for the interviewer response.');$('cTypes').inert=true;$('cOptions').inert=true;$('cApproved').disabled=true;$('cSend').disabled=true;$('cResponse').focus({preventScroll:true});
}
function respondToClarification(){
 if(!clarification?.record||clarification.status!=='awaiting-response'||!$('cResponse').value.trim())return;
 clarification.record.response={userApprovedText:$('cResponse').value.trim(),respondedByRoleId:clarification.sample.senderRoleId};clarification.record.status='answered';clarification.status='answered';evidence();
 text('cAnswer',`Interviewer response:\n${clarification.record.response.userApprovedText}`);$('cAnswer').hidden=false;$('cResolve').hidden=false;$('cRespond').disabled=true;text('cUserStatus','Response received · You decide when the question is clear enough.');$('cAnswer').focus?.({preventScroll:true});
}
function resolveClarification(){
 if(!clarification?.record||clarification.status!=='answered')return;
 clarification.status='resolved';clarification.record.status='resolved';evidence();text('cUserStatus','Understood · You closed the clarification loop.');$('cResolve').hidden=true;
}
/* ===================== Personalized AI Interview Support =====================
   The question bank and decompositions are static and always available offline.
   Job analysis, questions, and evidence analysis have independent fallbacks.
   The user owns their self-reported support profile and can edit or delete it. */
const IV_KEY='bridge:interview-profile';
const LEGACY_IV_KEY='cau-noi:interview-profile';
let IVS=null,IVCLAR=null,ivProfile=null,ivCategory='all',ivQueue=[],ivIndex=0,ivQuestion=null;
let ivSupport=null,ivSelection=null,ivController=null,ivRevision=0,ivSeq=0,ivReason='LOCAL_MODE';
const ivUsage=new Map();
const ivDrafts=new Map();
function ivRememberDraft(){if(ivQuestion)ivDrafts.set(ivQuestion.questionId,$('ivAnswer').value);}
function ivReadStored(){
 try{
  const p=JSON.parse(localStorage.getItem(IV_KEY)||localStorage.getItem(LEGACY_IV_KEY)||'null');
  if(!p||typeof p!=='object'||Array.isArray(p)||!p.answers||typeof p.answers!=='object'||Array.isArray(p.answers)||!['strengths','kept','declined'].every(k=>Array.isArray(p[k])&&p[k].every(v=>typeof v==='string')))return null;
  return p;
 }catch{return null;}
}
function ivStore(){try{localStorage.setItem(IV_KEY,JSON.stringify(ivProfile));localStorage.removeItem(LEGACY_IV_KEY);}catch{text('notice','This browser could not save your profile. You can still practice in this session.');}}
function ivEnabled(){
 const set=new Set(ivProfile?.kept||[]);
 for(const group of IVS.profileQuestions){
  const chosen=group.options.find(o=>o.optionId===ivProfile?.answers?.[group.groupId]);
  for(const id of chosen?.enablesSupport||[])set.add(id);
 }
 for(const id of ivProfile?.declined||[])set.delete(id);
 return set;
}
function ivRenderForm(){
 $('ivProfileQuestions').replaceChildren();
 for(const group of IVS.profileQuestions){
  const box=node('div','');
  box.append(node('div',`${group.label} — ${group.question}`,'sectionTitle'));
  const grid=node('div','','choiceGrid');grid.setAttribute('role','group');grid.setAttribute('aria-label',group.question);
  for(const option of group.options){
   const b=node('button',option.text,'opt');b.dataset.group=group.groupId;b.dataset.option=option.optionId;
   b.setAttribute('aria-pressed',ivProfile?.answers?.[group.groupId]===option.optionId?'true':'false');
   b.onclick=()=>{for(const other of grid.children)other.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');};
   grid.append(b);
  }
  box.append(grid);$('ivProfileQuestions').append(box);
 }
 $('ivStrengths').replaceChildren();
 for(const s of IVS.strengths){
  const b=node('button',s.text,'opt');b.dataset.strength=s.strengthId;
  b.setAttribute('aria-pressed',ivProfile?.strengths?.includes(s.strengthId)?'true':'false');
  b.onclick=()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');
  $('ivStrengths').append(b);
 }
}
function ivShowSummary(){
 const dl=$('ivSummaryList');dl.replaceChildren();
 for(const group of IVS.profileQuestions){
  const chosen=group.options.find(o=>o.optionId===ivProfile?.answers?.[group.groupId]);
  if(chosen)dl.append(node('dt',group.label),node('dd',chosen.text));
 }
 const names=(ivProfile?.strengths||[]).map(id=>IVS.strengths.find(s=>s.strengthId===id)?.text).filter(Boolean);
 if(names.length)dl.append(node('dt','Strengths'),node('dd',names.join(' · ')));
 const enabled=[...ivEnabled()].map(id=>IVS.supportActions.find(a=>a.supportId===id)?.label).filter(Boolean);
 dl.append(node('dt','Prioritized support'),node('dd',enabled.length?enabled.join(' · '):'No support prioritized yet'));
 $('ivSummary').hidden=false;$('ivForm').hidden=true;
}
function ivRenderCategories(){
 $('ivCategories').replaceChildren();
 for(const c of [{categoryId:'all',label:'All'},...IVS.categories]){
  const b=node('button',c.label,'supportBtn');
  b.setAttribute('aria-pressed',c.categoryId===ivCategory?'true':'false');
  b.onclick=()=>{ivRememberDraft();ivCategory=c.categoryId;ivBuildQueue();ivRenderCategories();ivShowQuestion();};
  $('ivCategories').append(b);
 }
}
function ivRenderSupports(){
 const enabled=ivEnabled();
 $('ivSupports').replaceChildren();
 for(const action of IVS.supportActions){
  const b=node('button','','supportBtn');b.dataset.id=action.supportId;b.setAttribute('aria-pressed','false');b.title=action.description;
  b.append(node('span',action.label));
  if(enabled.has(action.supportId))b.append(node('span','suggested for you','rec'));
  b.onclick=()=>ivChooseSupport(action);
  $('ivSupports').append(b);
 }
}
function ivBuildQueue(){ivQueue=(practiceQuestions||IVS.questions).filter(q=>(ivCategory==='all'||q.categoryId===ivCategory)&&(!$('ivDifficulty').value||$('ivDifficulty').value==='0'||q.difficulty===Number($('ivDifficulty').value)));ivIndex=0;}
function ivResetSupport(){
 $('dismissSupport').hidden=true;
 ivRevision++;ivController?.abort();ivController=null;$('ivSupports').inert=false;$('ivOptions').inert=false;$('ivApproved').disabled=false;ivSupport=null;ivSelection=null;ivReason='LOCAL_MODE';
 $('ivPanel').hidden=true;$('ivPanel').replaceChildren();
 $('ivComposer').hidden=true;$('ivOptions').replaceChildren();$('ivApproved').value='';$('ivUseLine').disabled=true;
 for(const b of $('ivSupports').children)b.setAttribute('aria-pressed','false');
}
function ivShowQuestion(){
 if(!ivQueue.length){ivQuestion=null;ivResetSupport();$('ivSupports').inert=true;text('ivQuestion','No questions match this filter. Choose another level or All.');text('ivAsker','');$('ivAnswer').value='';interviewFlow?.onQuestionChange();return;}
 ivQuestion=ivQueue[ivIndex%ivQueue.length];
 const cat=IVS.categories.find(c=>c.categoryId===ivQuestion.categoryId);
 text('ivAsker',`Interviewer · ${cat?.label||''} · practice question`);
 text('ivQuestion',ivQuestion.text);text('ivStatus','');$('ivAnswer').value=ivDrafts.get(ivQuestion.questionId)||'';ivResetSupport();interviewFlow?.onQuestionChange();
}
function ivRenderOptions(options,source){
 $('ivOptions').replaceChildren();ivSelection=null;$('ivApproved').value='';$('ivUseLine').disabled=true;
 for(const option of options){
  const b=node('button','','opt');b.setAttribute('aria-pressed','false');
  b.append(node('span',IVCLAR.toneLabels?.[option.tone]||option.tone,'toneTag'),node('span',option.text),node('span',source==='llm'?'AI · automatically checked; review the meaning':`Template · ${option.phrasingId}`,'src'));
  b.onclick=()=>{for(const other of $('ivOptions').children)other.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');ivSelection={...option,source};$('ivApproved').value=option.text;$('ivUseLine').disabled=false;$('ivApproved').focus({preventScroll:true});};
  $('ivOptions').append(b);
 }
}
async function ivChooseSupport(action){
 if(!ivQuestion)return;
 $('dismissSupport').hidden=false;
 ivRevision++;ivController?.abort();ivController=null;const current=ivRevision;
 ivSupport=action;ivSelection=null;ivReason='LOCAL_MODE';
 for(const b of $('ivSupports').children)b.setAttribute('aria-pressed',b.dataset.id===action.supportId?'true':'false');
 ivUsage.set(action.supportId,(ivUsage.get(action.supportId)||0)+1);
 // Question structure and source are displayed together.
 const panel=$('ivPanel');panel.replaceChildren();
 for(const n of GLO.entries.filter(n=>n.entryType==='interview-norm'&&n.relatedSupportIds.includes(action.supportId)))panel.append(node('p',n.plain,'tiny'));
 if(action.supportId==='question-breakdown'){
  panel.append(node('h4','This question has these parts:'));
  const list=document.createElement('ol');list.className='ivParts';
  for(const part of ivQuestion.parts)list.append(node('li',part));
  panel.append(list);
 } else if(action.supportId==='question-focus'){
  panel.append(node('h4','This question may be asking about:'));
  const list=document.createElement('ul');list.className='ivParts';
  for(const focus of ivQuestion.focusOptions)list.append(node('li',focus));
  panel.append(list);
 } else {
  panel.append(node('h4','It is okay to ask for processing time'),node('p','A short pause to organize your thoughts is often more useful than rushing an answer.','tiny'));
 }
 panel.hidden=false;
 // Offer templates first; use AI phrasing only when the user enables it.
 const type=IVCLAR.clarificationTypes.find(t=>t.clarificationId===action.clarificationId);
 if(!type)return;
 $('ivComposer').hidden=false;ivRenderOptions(type.phrasings,'static');$('ivOptionsHeading').focus({preventScroll:true});
 if(!$('aiMode').checked){text('ivStatus','Using a template; no data has been sent to AI.');return;}
 ivController=new AbortController();const localController=ivController;
 text('ivStatus','Getting phrasing suggestions from AI…');$('ivSupports').inert=true;$('ivOptions').inert=true;$('ivApproved').disabled=true;
 const timeout=setTimeout(()=>localController.abort(),5500);
 try{
  const response=await fetch('/api/clarify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({originalMessage:ivQuestion.text,clarificationId:action.clarificationId,packId:'interview'}),signal:localController.signal});
  const result=await response.json();if(current!==ivRevision)return;
  if(response.status===400){ivReason='BAD_INPUT';text('ivStatus',result.message||'The data is invalid.');}
  else if(response.ok&&result.mode==='llm'){ivReason=null;ivRenderOptions(Object.entries(result.options).map(([tone,value])=>({tone,text:value,phrasingId:`llm-${tone}`})),'llm');text('ivStatus','The AI suggestion passed automated checks; review the meaning before speaking.');}
  else{ivReason=result.reasonCode||'API_ERROR';text('ivStatus',`Using a fallback template (${ivReason}).`);}
 }catch(error){if(current===ivRevision){ivReason=error.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';text('ivStatus',`Using a fallback template (${ivReason}).`);}}
 finally{clearTimeout(timeout);if(current===ivRevision){ivController=null;$('ivSupports').inert=false;$('ivOptions').inert=false;$('ivApproved').disabled=false;}}
}
function ivUseLine(){
 const approved=$('ivApproved').value.trim();if(!ivSupport||!ivQuestion||!approved)return;
 records.push({recordType:'interview-support',id:`interview-${++ivSeq}`,questionId:ivQuestion.questionId,categoryId:ivQuestion.categoryId,supportId:ivSupport.supportId,userApprovedText:approved,source:ivSelection?.source==='llm'?'llm':ivSelection?'fallback':'user',sourceFile:ivSelection?.source==='static'?'data/clarifications_interview_vi.json':ivSelection?.source==='llm'?'/api/clarify':null,pickedPhrasingId:ivSelection?.phrasingId||null,wasEdited:!ivSelection||approved!==ivSelection.text,reasonCode:ivReason});
 evidence();$('ivUseLine').disabled=true;
 text('ivStatus','Your chosen line was recorded. In a real interview, you say it yourself—the product never speaks for you.');
}
function ivFinish(){
 ivRememberDraft();ivResetSupport();
 interviewFlow?.cancelAll();interviewFlow?.reflect();
 $('ivReview').hidden=false;
 $('reviewTitle').focus();
 const body=$('ivReviewBody');body.replaceChildren();
 if(!ivUsage.size){body.append(node('p','You did not use any support in this session. That is fine—support is available only when you want it.','tiny'));return;}
 body.append(node('p','This is a record of the practice session, not a conclusion about you. You decide what to keep.','tiny'));
 const enabled=ivEnabled();
 for(const [id,count] of ivUsage){
  const action=IVS.supportActions.find(a=>a.supportId===id);if(!action)continue;
  const card=node('div','','ivPanel');
  card.append(node('h4',`${action.label} — used ${count} ${count===1?'time':'times'}`));
  if(enabled.has(id))card.append(node('p','This support is prioritized in your profile. You can still turn it off.','tiny'));
  {
   card.append(node('p','Prioritize this for next time? Only you can decide whether it helped.','tiny'));
   const row=node('div','','row');
   const keep=node('button','Prioritize');keep.onclick=()=>ivDecide(id,true);
   const skip=node('button','Not needed');skip.onclick=()=>ivDecide(id,false);
   row.append(keep,skip);card.append(row);
  }
  body.append(card);
 }
}
function ivDecide(id,keep){
 ivResetSupport();
 ivProfile={answers:{},strengths:[],...(ivProfile||{}),
  kept:keep?[...new Set([...(ivProfile?.kept||[]),id])]:(ivProfile?.kept||[]).filter(x=>x!==id),
  declined:keep?(ivProfile?.declined||[]).filter(x=>x!==id):[...new Set([...(ivProfile?.declined||[]),id])]};
 ivStore();interviewFlow?.invalidatePack();ivShowSummary();ivRenderSupports();ivFinish();
}
function ivSaveProfile(){
 const answers={};
 for(const b of $('ivProfileQuestions').querySelectorAll('button[aria-pressed="true"]'))answers[b.dataset.group]=b.dataset.option;
 const strengths=[...$('ivStrengths').querySelectorAll('button[aria-pressed="true"]')].map(b=>b.dataset.strength);
 ivProfile={...(ivProfile||{}),answers,strengths,kept:ivProfile?.kept||[],declined:ivProfile?.declined||[]};
 ivStore();interviewFlow?.invalidatePack();ivShowSummary();ivBeginPractice();
}
function ivBeginPractice(){
 ivRememberDraft();
 $('ivPractice').hidden=false;ivRenderCategories();ivRenderSupports();ivBuildQueue();ivShowQuestion();
}
function ivInit(){
 ivProfile=ivReadStored();ivRenderForm();
 if(ivProfile){ivShowSummary();ivBeginPractice();}
}
$('cStart').onclick=()=>{$('cFlow').hidden=false;$('cTypes').querySelector('button')?.focus({preventScroll:true});};
$('cNextSample').onclick=()=>{sampleIndex=(sampleIndex+1)%CLAR.sampleMessages.length;resetClarificationView();};
$('cApproved').oninput=updateClarificationSend;
$('cResponse').oninput=()=>{$('cRespond').disabled=!clarification||clarification.status!=='awaiting-response'||!$('cResponse').value.trim();};
$('cSend').onclick=()=>sendClarification(true);$('cRespond').onclick=respondToClarification;$('cResolve').onclick=resolveClarification;
$('ivSaveProfile').onclick=ivSaveProfile;
$('ivSkipProfile').onclick=()=>{ivResetSupport();ivProfile={answers:{},strengths:[],kept:[],declined:[]};interviewFlow?.invalidatePack();ivShowSummary();ivBeginPractice();};
$('ivEditProfile').onclick=()=>{$('ivSummary').hidden=true;$('ivForm').hidden=false;ivRenderForm();$('ivForm').querySelector('button')?.focus({preventScroll:true});};
$('ivClearProfile').onclick=()=>{ivResetSupport();interviewFlow?.cancelAll();interviewFlow?.invalidatePack();ivProfile=null;try{localStorage.removeItem(IV_KEY);localStorage.removeItem(LEGACY_IV_KEY);}catch{}ivRenderForm();$('ivSummary').hidden=true;$('ivForm').hidden=false;$('ivReview').hidden=true;ivUsage.clear();ivRenderSupports();$('ivForm').querySelector('button')?.focus();text('ivStatus','Profile deleted. Practice content remains in this session.');};
$('ivApproved').oninput=()=>{$('ivUseLine').disabled=!ivSupport||!$('ivApproved').value.trim();};
$('ivUseLine').onclick=ivUseLine;
$('ivNext').onclick=()=>{ivRememberDraft();ivIndex++;ivShowQuestion();$('ivQuestion').focus?.({preventScroll:true});};
$('ivFinish').onclick=ivFinish;
$('dismissSupport').onclick=()=>{ivResetSupport();$('ivAnswer').focus();};
$('ivDifficulty').onchange=()=>{ivRememberDraft();ivBuildQueue();ivShowQuestion();};

$('btnViolate').onclick=()=>sendClarification(false);
$('aiMode').onchange=()=>{resetClarificationView();ivResetSupport();interviewFlow?.cancelAll();text('notice','Mode changed; no additional content has been sent to AI.');};
try {
 [ORG,GLO,CLAR,IVS]=await Promise.all(['org_map_interview_vi','glossary_vi','clarifications_interview_vi','interview_support_vi'].map(async name=>{const r=await fetch('/data/'+name+'.json');if(!r.ok)throw new Error('data');return r.json();}));
 IVCLAR=CLAR;
 for(const type of CLAR.clarificationTypes){const button=node('button','','clarifyType');button.dataset.id=type.clarificationId;button.setAttribute('aria-pressed','false');button.append(node('strong',type.label),node('span',type.description));button.onclick=()=>chooseClarification(type);$('cTypes').append(button);}
 const jobResponse=await fetch('/data/job_profiles_vi.json');if(!jobResponse.ok)throw new Error('jobs');
 practiceQuestions=localQuestions(IVS);
 interviewFlow=initInterviewFlow({bank:IVS,jobs:await jobResponse.json(),glossary:GLO,getQuestion:()=>ivQuestion,getProfile:()=>ivProfile,
  setQuestions:questions=>{ivRememberDraft();practiceQuestions=questions;ivBuildQueue();if(!$('ivPractice').hidden)ivShowQuestion();},
  startPractice:ivBeginPractice,
  clearPractice:()=>{ivResetSupport();ivQuestion=null;ivDrafts.clear();ivUsage.clear();records.length=0;evidence();resetClarificationView();$('ivAnswer').value='';ivCategory='all';$('ivDifficulty').value='0';ivRenderCategories();}
 });
 showClarificationSample();ivInit();
 text('bData','Interview Pack · 12 practice questions · 4 categories');
 $('loadedList').replaceChildren(...['Self-reported support profile with no diagnostic labels.','12 practice questions, 4 clarification types, and a simulated interviewer role.'].map(s=>node('li',s)));
}catch{$('loadError').hidden=false;text('bData','Data loading error');}
