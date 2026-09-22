import {norm,hasKeyword,extractTicket,fillTicket,detectIntent} from './core.mjs';
const $=id=>document.getElementById(id);
let INT,ORG,GLO,CLAR,draft=null,active=null,selected=null,replyChoice=null,controller=null,revision=0,seq=0;
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
  button.append(node('span',INT.toneLabels[option.tone]||option.tone,'toneTag'),node('span',option.text),node('span',source==='llm'?'AI · đã qua kiểm tra tự động, cần bạn kiểm tra ý nghĩa':`Câu mẫu · ${option.phrasingId}`,'src'));
  button.onclick=()=>{for(const other of $('cOptions').children)other.setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true');clarificationSelection={...option,source};$('cApproved').value=option.text;updateClarificationSend();$('cApproved').focus({preventScroll:true});};
  $('cOptions').append(button);
 }
}
function showClarificationSample(){
 if(!CLAR)return;
 const sample=CLAR.sampleMessages[sampleIndex%CLAR.sampleMessages.length];
 const role=ORG.roles.find(item=>item.roleId===sample.senderRoleId);
 text('cSender',`${role?.title||'Người giao việc'} · tin nhắn mô phỏng`);text('cOriginal',sample.text);
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
 if(!$('aiMode').checked){text('cUserStatus','Đang dùng câu hỏi mẫu; chưa gửi dữ liệu tới AI.');return;}
 clarificationController=new AbortController();const localController=clarificationController;
 text('cUserStatus','Đang lấy gợi ý câu hỏi từ AI…');$('cTypes').inert=true;$('cOptions').inert=true;$('cApproved').disabled=true;
 const timeout=setTimeout(()=>localController.abort(),5500);
 try{
  const response=await fetch('/api/clarify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({originalMessage:sample.text,clarificationId:type.clarificationId}),signal:localController.signal});
  const result=await response.json();if(current!==clarificationRevision)return;
  if(response.status===400){clarification.reasonCode='BAD_INPUT';text('cUserStatus',result.message||'Dữ liệu làm rõ không hợp lệ.');}
  else if(response.ok&&result.mode==='llm'){
   clarification.reasonCode=null;renderClarificationOptions(Object.entries(result.options).map(([tone,value])=>({tone,text:value,phrasingId:`llm-${tone}`})),'llm');
   text('cUserStatus','Gợi ý AI đã qua kiểm tra tự động; hãy kiểm tra lại ý nghĩa trước khi gửi.');
  }else{clarification.reasonCode=result.reasonCode||'API_ERROR';text('cUserStatus',`Dùng câu hỏi mẫu dự phòng (${clarification.reasonCode}).`);}
 }catch(error){if(current===clarificationRevision){clarification.reasonCode=error.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';text('cUserStatus',`Dùng câu hỏi mẫu dự phòng (${clarification.reasonCode}).`);}}
 finally{clearTimeout(timeout);if(current===clarificationRevision){clarificationController=null;$('cTypes').inert=false;$('cOptions').inert=false;$('cApproved').disabled=false;}}
}
function sendClarification(){
 const approved=$('cApproved').value.trim();if(!clarification||clarification.status!=='draft'||!approved)return;
 const record={recordType:'clarification',id:`clarify-${++clarificationSeq}`,originalMessageId:clarification.sample.messageId,originalMessage:clarification.sample.text,fromRoleId:clarification.sample.senderRoleId,clarificationId:clarification.type.clarificationId,userApprovedText:approved,source:clarificationSelection?.source==='llm'?'llm':clarificationSelection?'fallback':'user',sourceFile:clarificationSelection?.source==='static'?'data/clarifications_vi.json':clarificationSelection?.source==='llm'?'/api/clarify':null,pickedPhrasingId:clarificationSelection?.phrasingId||null,wasEdited:!clarificationSelection||approved!==clarificationSelection.text,reasonCode:clarification.reasonCode,status:'awaiting-response',response:null};
 clarification={...clarification,record,status:'awaiting-response'};records.push(record);evidence();
 text('cReceiverOriginal',record.originalMessage);text('cReceiverQuestion',record.userApprovedText);$('cReceiverEmpty').hidden=true;$('cReceiver').hidden=false;
 $('cResponse').value=CLAR.responseExamples[sampleIndex%CLAR.responseExamples.length]||'';$('cRespond').disabled=!$('cResponse').value.trim();
 text('cUserStatus','Đã gửi trong demo · Đang chờ người giao việc phản hồi.');$('cTypes').inert=true;$('cOptions').inert=true;$('cApproved').disabled=true;$('cSend').disabled=true;$('cResponse').focus({preventScroll:true});
}
function respondToClarification(){
 if(!clarification?.record||clarification.status!=='awaiting-response'||!$('cResponse').value.trim())return;
 clarification.record.response={userApprovedText:$('cResponse').value.trim(),respondedByRoleId:clarification.sample.senderRoleId};clarification.record.status='answered';clarification.status='answered';evidence();
 text('cAnswer',`Người giao việc trả lời:\n${clarification.record.response.userApprovedText}`);$('cAnswer').hidden=false;$('cResolve').hidden=false;$('cRespond').disabled=true;text('cUserStatus','Đã nhận câu trả lời · Minh quyết định khi nào đã đủ rõ.');$('cAnswer').focus?.({preventScroll:true});
}
function resolveClarification(){
 if(!clarification?.record||clarification.status!=='answered')return;
 clarification.status='resolved';clarification.record.status='resolved';evidence();text('cUserStatus','Đã hiểu · Vòng làm rõ đã được Minh đóng.');$('cResolve').hidden=true;
}
/* ===================== Personalized AI Interview Support =====================
   Ngân hàng câu hỏi và phần tách cấu trúc là dữ liệu tĩnh — luôn chạy được, kể cả offline.
   AI chỉ tham gia ở lớp "nói câu đó ra sao", và luôn phải qua bước người dùng xác nhận.
   Hồ sơ hỗ trợ do người dùng tự khai, lưu trên máy họ, hiển thị công khai và sửa/xoá được. */
const IV_KEY='cau-noi:interview-profile';
let IVS=null,IVCLAR=null,ivProfile=null,ivCategory='all',ivQueue=[],ivIndex=0,ivQuestion=null;
let ivSupport=null,ivSelection=null,ivController=null,ivRevision=0,ivSeq=0,ivReason='LOCAL_MODE';
const ivUsage=new Map();
function ivReadStored(){try{const raw=localStorage.getItem(IV_KEY);return raw?JSON.parse(raw):null;}catch{return null;}}
function ivStore(){try{localStorage.setItem(IV_KEY,JSON.stringify(ivProfile));}catch{/* chế độ riêng tư chặn lưu: vẫn chạy trong phiên */}}
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
  const grid=node('div','','choiceGrid');
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
 if(names.length)dl.append(node('dt','Thế mạnh'),node('dd',names.join(' · ')));
 const enabled=[...ivEnabled()].map(id=>IVS.supportActions.find(a=>a.supportId===id)?.label).filter(Boolean);
 dl.append(node('dt','Hỗ trợ bật sẵn'),node('dd',enabled.length?enabled.join(' · '):'Chưa bật sẵn hỗ trợ nào'));
 $('ivSummary').hidden=false;$('ivForm').hidden=true;
}
function ivRenderCategories(){
 $('ivCategories').replaceChildren();
 for(const c of [{categoryId:'all',label:'Tất cả'},...IVS.categories]){
  const b=node('button',c.label,'supportBtn');
  b.setAttribute('aria-pressed',c.categoryId===ivCategory?'true':'false');
  b.onclick=()=>{ivCategory=c.categoryId;ivBuildQueue();ivRenderCategories();ivShowQuestion();};
  $('ivCategories').append(b);
 }
}
function ivRenderSupports(){
 const enabled=ivEnabled();
 $('ivSupports').replaceChildren();
 for(const action of IVS.supportActions){
  const b=node('button','','supportBtn');b.dataset.id=action.supportId;b.setAttribute('aria-pressed','false');b.title=action.description;
  b.append(node('span',action.label));
  if(enabled.has(action.supportId))b.append(node('span','gợi ý cho bạn','rec'));
  b.onclick=()=>ivChooseSupport(action);
  $('ivSupports').append(b);
 }
}
function ivBuildQueue(){ivQueue=IVS.questions.filter(q=>ivCategory==='all'||q.categoryId===ivCategory);ivIndex=0;}
function ivResetSupport(){
 ivRevision++;ivController?.abort();ivController=null;ivSupport=null;ivSelection=null;ivReason='LOCAL_MODE';
 $('ivPanel').hidden=true;$('ivPanel').replaceChildren();
 $('ivComposer').hidden=true;$('ivOptions').replaceChildren();$('ivApproved').value='';$('ivUseLine').disabled=true;
 for(const b of $('ivSupports').children)b.setAttribute('aria-pressed','false');
}
function ivShowQuestion(){
 if(!ivQueue.length)return;
 ivQuestion=ivQueue[ivIndex%ivQueue.length];
 const cat=IVS.categories.find(c=>c.categoryId===ivQuestion.categoryId);
 text('ivAsker',`Người phỏng vấn · ${cat?.label||''} · câu hỏi mô phỏng`);
 text('ivQuestion',ivQuestion.text);text('ivStatus','');$('ivAnswer').value='';ivResetSupport();
}
function ivRenderOptions(options,source){
 $('ivOptions').replaceChildren();ivSelection=null;$('ivApproved').value='';$('ivUseLine').disabled=true;
 for(const option of options){
  const b=node('button','','opt');b.setAttribute('aria-pressed','false');
  b.append(node('span',IVCLAR.toneLabels?.[option.tone]||INT.toneLabels[option.tone]||option.tone,'toneTag'),node('span',option.text),node('span',source==='llm'?'AI · đã qua kiểm tra tự động, cần bạn kiểm tra ý nghĩa':`Câu mẫu · ${option.phrasingId}`,'src'));
  b.onclick=()=>{for(const other of $('ivOptions').children)other.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');ivSelection={...option,source};$('ivApproved').value=option.text;$('ivUseLine').disabled=false;$('ivApproved').focus({preventScroll:true});};
  $('ivOptions').append(b);
 }
}
async function ivChooseSupport(action){
 if(!ivQuestion)return;
 ivRevision++;ivController?.abort();ivController=null;const current=ivRevision;
 ivSupport=action;ivSelection=null;ivReason='LOCAL_MODE';
 for(const b of $('ivSupports').children)b.setAttribute('aria-pressed',b.dataset.id===action.supportId?'true':'false');
 ivUsage.set(action.supportId,(ivUsage.get(action.supportId)||0)+1);
 // (a) Trợ giúp cấu trúc lấy thẳng từ ngân hàng câu hỏi — không do AI sinh ra.
 const panel=$('ivPanel');panel.replaceChildren();
 if(action.supportId==='question-breakdown'){
  panel.append(node('h4','Câu hỏi này gồm các phần:'));
  const list=document.createElement('ol');list.className='ivParts';
  for(const part of ivQuestion.parts)list.append(node('li',part));
  panel.append(list);
 } else if(action.supportId==='question-focus'){
  panel.append(node('h4','Câu hỏi có thể đang nhắm tới:'));
  const list=document.createElement('ul');list.className='ivParts';
  for(const focus of ivQuestion.focusOptions)list.append(node('li',focus));
  panel.append(list);
 } else {
  panel.append(node('h4','Xin thêm thời gian là điều hợp lệ'),node('p','Một khoảng lặng ngắn để sắp xếp ý thường cho câu trả lời tốt hơn là trả lời vội.','tiny'));
 }
 panel.hidden=false;
 // (b) Cách nói ra: câu mẫu trước, AI cá nhân hoá sau nếu bật chế độ AI.
 const type=IVCLAR.clarificationTypes.find(t=>t.clarificationId===action.clarificationId);
 if(!type)return;
 $('ivComposer').hidden=false;ivRenderOptions(type.phrasings,'static');$('ivOptionsHeading').focus({preventScroll:true});
 if(!$('aiMode').checked){text('ivStatus','Đang dùng câu mẫu; chưa gửi dữ liệu tới AI.');return;}
 ivController=new AbortController();const localController=ivController;
 text('ivStatus','Đang lấy gợi ý cách nói từ AI…');$('ivSupports').inert=true;$('ivOptions').inert=true;$('ivApproved').disabled=true;
 const timeout=setTimeout(()=>localController.abort(),5500);
 try{
  const response=await fetch('/api/clarify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({originalMessage:ivQuestion.text,clarificationId:action.clarificationId,packId:'interview'}),signal:localController.signal});
  const result=await response.json();if(current!==ivRevision)return;
  if(response.status===400){ivReason='BAD_INPUT';text('ivStatus',result.message||'Dữ liệu không hợp lệ.');}
  else if(response.ok&&result.mode==='llm'){ivReason=null;ivRenderOptions(Object.entries(result.options).map(([tone,value])=>({tone,text:value,phrasingId:`llm-${tone}`})),'llm');text('ivStatus','Gợi ý AI đã qua kiểm tra tự động; hãy kiểm tra lại ý nghĩa trước khi nói.');}
  else{ivReason=result.reasonCode||'API_ERROR';text('ivStatus',`Dùng câu mẫu dự phòng (${ivReason}).`);}
 }catch(error){if(current===ivRevision){ivReason=error.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';text('ivStatus',`Dùng câu mẫu dự phòng (${ivReason}).`);}}
 finally{clearTimeout(timeout);if(current===ivRevision){ivController=null;$('ivSupports').inert=false;$('ivOptions').inert=false;$('ivApproved').disabled=false;}}
}
function ivUseLine(){
 const approved=$('ivApproved').value.trim();if(!ivSupport||!ivQuestion||!approved)return;
 records.push({recordType:'interview-support',id:`interview-${++ivSeq}`,questionId:ivQuestion.questionId,categoryId:ivQuestion.categoryId,supportId:ivSupport.supportId,userApprovedText:approved,source:ivSelection?.source==='llm'?'llm':ivSelection?'fallback':'user',sourceFile:ivSelection?.source==='static'?'data/clarifications_interview_vi.json':ivSelection?.source==='llm'?'/api/clarify':null,pickedPhrasingId:ivSelection?.phrasingId||null,wasEdited:!ivSelection||approved!==ivSelection.text,reasonCode:ivReason});
 evidence();$('ivUseLine').disabled=true;
 text('ivStatus','Đã ghi lại câu bạn chọn. Trong buổi phỏng vấn thật, bạn là người nói câu này — sản phẩm không nói thay bạn.');
}
function ivFinish(){
 $('ivReview').hidden=false;
 const body=$('ivReviewBody');body.replaceChildren();
 if(!ivUsage.size){body.append(node('p','Buổi này bạn chưa dùng hỗ trợ nào. Không sao — hỗ trợ chỉ dùng khi bạn thấy cần.','tiny'));return;}
 body.append(node('p','Đây là ghi nhận từ buổi luyện này, không phải kết luận về bạn. Bạn quyết định giữ hay bỏ.','tiny'));
 const enabled=ivEnabled();
 for(const [id,count] of ivUsage){
  const action=IVS.supportActions.find(a=>a.supportId===id);if(!action)continue;
  const card=node('div','','ivPanel');
  card.append(node('h4',`${action.label} — bạn đã dùng ${count} lần`));
  if(enabled.has(id))card.append(node('p','Đang bật sẵn trong hồ sơ của bạn.','tiny'));
  else{
   card.append(node('p','Bật sẵn cho những lần luyện sau?','tiny'));
   const row=node('div','','row');
   const keep=node('button','Bật sẵn');keep.onclick=()=>ivDecide(id,true);
   const skip=node('button','Không cần');skip.onclick=()=>ivDecide(id,false);
   row.append(keep,skip);card.append(row);
  }
  body.append(card);
 }
}
function ivDecide(id,keep){
 ivProfile={answers:{},strengths:[],...(ivProfile||{}),
  kept:keep?[...new Set([...(ivProfile?.kept||[]),id])]:(ivProfile?.kept||[]).filter(x=>x!==id),
  declined:keep?(ivProfile?.declined||[]).filter(x=>x!==id):[...new Set([...(ivProfile?.declined||[]),id])]};
 ivStore();ivShowSummary();ivRenderSupports();ivFinish();
}
function ivSaveProfile(){
 const answers={};
 for(const b of $('ivProfileQuestions').querySelectorAll('button[aria-pressed="true"]'))answers[b.dataset.group]=b.dataset.option;
 const strengths=[...$('ivStrengths').querySelectorAll('button[aria-pressed="true"]')].map(b=>b.dataset.strength);
 ivProfile={...(ivProfile||{}),answers,strengths,kept:ivProfile?.kept||[],declined:ivProfile?.declined||[]};
 ivStore();ivShowSummary();ivBeginPractice();
}
function ivBeginPractice(){
 $('ivPractice').hidden=false;ivRenderCategories();ivRenderSupports();ivBuildQueue();ivShowQuestion();
}
function ivInit(){
 ivProfile=ivReadStored();ivRenderForm();
 if(ivProfile){ivShowSummary();ivBeginPractice();}
}
function cancel(){revision++;controller?.abort();controller=null;$('btnAnalyze').disabled=!INT;$('optsOut').inert=false;$('approved').disabled=false;}
function invalidate(){cancel();draft=null;selected=null;$('analysis').hidden=true;$('approved').value='';$('btnSend').disabled=true;text('notice','');text('error','');}
function updateSend(){$('btnSend').disabled=!draft||!$('approved').value.trim();}
function renderOptions(options,source){
 $('optsOut').replaceChildren();selected=null;$('approved').value='';updateSend();
 for(const p of options){const b=node('button','', 'opt');b.setAttribute('aria-pressed','false');b.append(node('span',INT.toneLabels[p.tone]||p.tone,'toneTag'),node('span',p.text),node('span',source==='llm'?'AI · đã qua kiểm tra tự động, cần bạn kiểm tra ý nghĩa':`Câu mẫu · ${p.phrasingId}`,'src'));
  b.onclick=()=>{for(const other of $('optsOut').children)other.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');selected={...p,source};$('approved').value=p.text;updateSend();$('approved').focus({preventScroll:true});};$('optsOut').append(b);
 }
 text('bGen',source==='llm'?'Nguồn: AI · người dùng duyệt':'Nguồn: câu mẫu · người dùng duyệt');
}
function renderContext(){
 const {intent,ticket,role,raw}=draft;
 $('analysis').hidden=false;$('chipsOut').replaceChildren(node('span',intent.label,'chip'));
 if(ticket)$('chipsOut').append(node('span',ticket,'chip'));
 for(const t of (GLO.entries||GLO.terms).filter(t=>t.entryType!=='workplace-norm')) {
  if(hasKeyword(raw,t.term)){const chip=node('span',t.term,'chip glo');chip.title=t.plain||t.meaning||t.explanation||'';$('chipsOut').append(chip);}
 }
 const card=node('div','',`routeCard${intent.intentId==='abstain'?' abstain':''}`);
 card.append(node('div',`${role.name} — ${role.title}`,'name'),node('p',intent.intentId==='abstain'?intent.abstainMessage+' '+intent.abstainGuidance:'Gợi ý theo từ khóa và sơ đồ tổ chức mẫu; không phải kết luận về nhu cầu của bạn.','meta'));
 const label=node('label','Nếu hệ thống hiểu chưa đúng, chọn lại nhu cầu');const select=document.createElement('select');select.setAttribute('aria-label','Chọn lại nhu cầu');
 for(const i of [...INT.intents,INT.fallback]){const opt=node('option',i.label);opt.value=i.intentId;opt.selected=i.intentId===intent.intentId;select.append(opt);}
 select.onchange=()=>analyze(select.value);card.append(label,select);$('routeOut').replaceChildren(card);
 $('normOut').replaceChildren();
 for(const n of (GLO.entries||[]).filter(e=>e.entryType==='workplace-norm'&&e.relatedIntentIds.includes(intent.intentId)).slice(0,2)){$('normOut').append(node('p',`Quy ước mẫu — ${n.title}: ${n.plain}`,'tiny'));}
 renderOptions(intent.phrasings.map(p=>({...p,text:fillTicket(p.text,ticket)})),'static');
}
async function analyze(forcedId){
 cancel();const current=revision,raw=$('raw').value.trim();text('error','');
 if(!raw||raw.length>500){text('error','Nhập từ 1 đến 500 ký tự trước khi tiếp tục.');$('raw').focus();return;}
 const match=detectIntent(raw,INT);const intent=forcedId?[...INT.intents,INT.fallback].find(i=>i.intentId===forcedId):(match?.intent||INT.fallback);
 draft={raw,intent,ticket:extractTicket(raw),role:ORG.roles.find(r=>r.roleId===intent.routeTo),matchedKeywords:match?.hits||[],reasonCode:'LOCAL_MODE'};renderContext();$('optionsHeading').focus({preventScroll:true});
 if(!$('aiMode').checked || intent.intentId==='abstain'){text('notice',intent.intentId==='abstain'?'Chưa đủ thông tin: dùng câu mẫu làm rõ, không gọi AI.':'Đang dùng câu mẫu, không gửi dữ liệu tới AI.');return;}
 controller=new AbortController();const localController=controller;
 text('notice','Đang lấy gợi ý AI…');$('btnAnalyze').disabled=true;
 // Không cho chọn câu trong lúc thay bộ gợi ý để tránh ghi đè bản đang sửa.
 $('optsOut').inert=true;$('approved').disabled=true;
 const timeout=setTimeout(()=>localController.abort(),5500);
 try {
  const response=await fetch('/api/suggest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rawText:raw,intentId:intent.intentId,allowedFacts:{ticket:draft.ticket}}),signal:localController.signal});
  const result=await response.json();if(current!==revision)return;
  if(response.status===400){draft.reasonCode='BAD_INPUT';text('error',result.message||'Dữ liệu không hợp lệ.');text('notice','Không gọi lại tự động. Bạn có thể sửa hoặc dùng câu mẫu.');}
  else if(response.ok&&result.mode==='llm'){draft.reasonCode=null;renderOptions(Object.entries(result.options).map(([tone,value])=>({tone,text:value,phrasingId:`llm-${tone}`})),'llm');text('notice','Gợi ý AI đã qua kiểm tra tự động; hãy kiểm tra lại ý nghĩa trước khi gửi.');}
  else {draft.reasonCode=result.reasonCode||'API_ERROR';text('notice',`Dùng câu mẫu dự phòng (${draft.reasonCode}).`);}
 } catch(e){if(current===revision){draft.reasonCode=e.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';text('notice',`Dùng câu mẫu dự phòng (${draft.reasonCode}).`);}}
 finally {clearTimeout(timeout);if(current===revision){controller=null;$('btnAnalyze').disabled=false;$('optsOut').inert=false;$('approved').disabled=false;}}
}
function send(confirmed=false){
 if(!confirmed){text('error','Đã chặn: thao tác thử không có xác nhận. Không tin nhắn nào được gửi.');return false;}
 const approved=$('approved').value;
 if(!draft||!approved.trim())return;
 if(active&&active.status!=='resolved'){text('error','Hãy hoàn tất yêu cầu hiện tại hoặc bấm Làm lại trước khi gửi yêu cầu mới.');return;}
 active={id:++seq,rawInput:draft.raw,detectedIntent:draft.intent.intentId,matchedKeywords:draft.matchedKeywords,ticket:draft.ticket,routedTo:draft.role.roleId,routeConfidence:draft.intent.routeConfidence,reasonCode:draft.reasonCode,userApprovedText:approved,source:selected?.source==='llm'?'llm':selected?'fallback':'user',sourceFile:selected?.source==='static'?'data/intents_vi.json':selected?.source==='llm'?'/api/suggest':null,pickedPhrasingId:selected?.phrasingId||null,wasEdited:!selected||approved!==selected.text,status:'sent',replies:[],followups:[]};records.push(active);evidence();
 text('bWho',`${draft.role.name} — ${draft.role.title} · hộp thư mô phỏng`);text('bApproved',active.userApprovedText);
 for(const [id,key] of [['bAsk','ask'],['bAction','action'],['bWhy','why']])text(id,fillTicket(draft.intent.bSide[key],draft.ticket));
 text('bMins',`~${draft.intent.bSide.actionMinutes} phút (ước tính mẫu)`);
 $('bEmpty').hidden=true;$('bContent').hidden=false;$('replyOptions').replaceChildren();$('bReply').value='';replyChoice=null;$('bSend').disabled=true;
 for(const option of draft.intent.bSide.replyOptions){const b=node('button',option.label,'opt');b.onclick=()=>{replyChoice=option.replyId;$('bReply').value=option.text;$('bSend').disabled=false;$('bReply').focus({preventScroll:true});};$('replyOptions').append(b);}
 text('aStatus','Đã gửi trong demo. Đang chờ phản hồi.');$('btnResolve').hidden=true;$('followupBox').hidden=true;$('btnSend').disabled=true;$('bMessageHeading').focus({preventScroll:true});text('error','');
}
function reply(){
 if(!active||active.status==='resolved'||!$('bReply').value.trim())return;
 active.bReplyId=replyChoice||'custom';active.bReplyApprovedText=$('bReply').value;active.replies.push({replyId:active.bReplyId,userApprovedText:active.bReplyApprovedText});active.status=replyChoice==='clarify'?'needs-clarification':replyChoice==='redirect'?'redirect-proposed':'responded';
 text('aStatus',`Người nhận phản hồi:\n${$('bReply').value}\n${active.status==='redirect-proposed'?'Chỉ đề xuất đầu mối khác; chưa chuyển tin cho ai.':'Đã phản hồi, chưa có nghĩa là đã giải quyết.'}`);evidence();$('bSend').disabled=true;$('btnResolve').hidden=false;$('followupBox').hidden=false;$('followup').value='';$('sendFollowup').disabled=true;$('followup').focus({preventScroll:true});
}
function reset(){invalidate();active=null;records.length=0;seq=0;clarificationSeq=0;$('raw').value='';$('bReply').value='';$('followup').value='';$('followupBox').hidden=true;$('bContent').hidden=true;$('bEmpty').hidden=false;$('btnResolve').hidden=true;for(const id of ['aStatus','bApproved'])text(id,'');text('bWho','Chưa có gì được gửi');resetClarificationView();evidence();$('raw').focus();}
$('raw').addEventListener('input',()=>{invalidate();$('optsOut').inert=false;$('approved').disabled=false;});
$('approved').addEventListener('input',updateSend);
$('bReply').addEventListener('input',()=>{$('bSend').disabled=!active||active.status==='resolved'||!$('bReply').value.trim();});
$('aiMode').onchange=()=>{invalidate();resetClarificationView();$('optsOut').inert=false;$('approved').disabled=false;text('notice','Đã đổi chế độ. Bấm Tìm cách diễn đạt hoặc mở Làm rõ để tạo gợi ý; chưa gửi dữ liệu.');};
$('btnAnalyze').onclick=()=>analyze();$('btnSend').onclick=()=>send(true);$('bSend').onclick=reply;$('btnReset').onclick=reset;
$('btnViolate').onclick=()=>send(false);
$('followup').oninput=()=>{$('sendFollowup').disabled=!$('followup').value.trim();};
$('sendFollowup').onclick=()=>{if(!active||active.status==='resolved'||!$('followup').value.trim())return;active.followups.push($('followup').value);active.status='sent';text('bApproved',active.userApprovedText+'\n\nBổ sung từ Minh:\n'+active.followups.join('\n\n'));text('aStatus','Đã gửi bổ sung trong demo. Đang chờ phản hồi.');$('followupBox').hidden=true;$('btnResolve').hidden=true;$('bReply').value='';replyChoice=null;$('bSend').disabled=true;evidence();$('bMessageHeading').focus({preventScroll:true});};
$('btnResolve').onclick=()=>{if(!active)return;active.status='resolved';evidence();text('aStatus','Bạn đã xác nhận được hỗ trợ và đóng yêu cầu.');$('btnResolve').hidden=true;$('followupBox').hidden=true;$('bSend').disabled=true;updateSend();$('raw').focus({preventScroll:true});};
$('cStart').onclick=()=>{$('cFlow').hidden=false;$('cTypes').querySelector('button')?.focus({preventScroll:true});};
$('cNextSample').onclick=()=>{sampleIndex=(sampleIndex+1)%CLAR.sampleMessages.length;resetClarificationView();};
$('cApproved').oninput=updateClarificationSend;
$('cResponse').oninput=()=>{$('cRespond').disabled=!clarification||clarification.status!=='awaiting-response'||!$('cResponse').value.trim();};
$('cSend').onclick=sendClarification;$('cRespond').onclick=respondToClarification;$('cResolve').onclick=resolveClarification;
$('ivSaveProfile').onclick=ivSaveProfile;
$('ivSkipProfile').onclick=()=>{ivProfile={answers:{},strengths:[],kept:[],declined:[]};ivShowSummary();ivBeginPractice();};
$('ivEditProfile').onclick=()=>{$('ivSummary').hidden=true;$('ivForm').hidden=false;ivRenderForm();$('ivForm').querySelector('button')?.focus({preventScroll:true});};
$('ivClearProfile').onclick=()=>{ivProfile=null;try{localStorage.removeItem(IV_KEY);}catch{}ivRenderForm();$('ivSummary').hidden=true;$('ivForm').hidden=false;$('ivPractice').hidden=true;$('ivReview').hidden=true;ivUsage.clear();};
$('ivApproved').oninput=()=>{$('ivUseLine').disabled=!ivSupport||!$('ivApproved').value.trim();};
$('ivUseLine').onclick=ivUseLine;
$('ivNext').onclick=()=>{ivIndex++;ivShowQuestion();$('ivQuestion').focus?.({preventScroll:true});};
$('ivFinish').onclick=ivFinish;
$('btnAnalyze').disabled=true;
try {
 [INT,ORG,GLO,CLAR,IVS,IVCLAR]=await Promise.all(['intents_vi','org_map','glossary_vi','clarifications_vi','interview_support_vi','clarifications_interview_vi'].map(async name=>{const r=await fetch(`/data/${name}.json`);if(!r.ok)throw new Error('data');return r.json();}));
 text('bData',`Domain: ${INT.intents.length} ý định · ${ORG.roles.length} đầu mối`);$('btnAnalyze').disabled=false;
 const samples=[['Chưa rõ task','em không hiểu task API-142 lắm mà hỏi thì sợ phiền'],['Quá tải','nhiều task cùng lúc em không kịp'],['Quyền truy cập','em chưa có quyền truy cập repo'],['Cần viết lại','mọi người nói nhanh em không nhớ kịp'],['Thiếu thử thách','công việc lặp lại em muốn thử thách hơn'],['Chưa rõ nhu cầu','em muốn nói một chuyện']];
 for(const [label,value] of samples){const b=node('button',label);b.onclick=()=>{invalidate();$('raw').value=value;$('optsOut').inert=false;$('approved').disabled=false;$('raw').focus();};$('samples').append(b);}
 for(const type of CLAR.clarificationTypes){const button=node('button','', 'clarifyType');button.dataset.id=type.clarificationId;button.setAttribute('aria-pressed','false');button.append(node('strong',type.label),node('span',type.description));button.onclick=()=>chooseClarification(type);$('cTypes').append(button);}
 showClarificationSample();
 ivInit();
 $('loadedList').replaceChildren(...[`${INT.intents.length} ý định, mỗi ý định có định tuyến và phản hồi mẫu.`,`${ORG.roles.length} vai trò hư cấu; cần thay bằng đầu mối thật khi triển khai.`,`${(GLO.entries||GLO.terms).length} mục tri thức; quy ước mẫu không phải cam kết của công ty.`].map(s=>node('li',s)));
}catch{$('loadError').hidden=false;text('bData','Lỗi tải dữ liệu');}
