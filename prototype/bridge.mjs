import {norm,hasKeyword,extractTicket,fillTicket,detectIntent} from './core.mjs';
const $=id=>document.getElementById(id);
let INT,ORG,GLO,draft=null,active=null,selected=null,replyChoice=null,controller=null,revision=0,seq=0;
const records=[];
const text=(id,value)=>{$(id).textContent=value;};
function node(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
function evidence(){text('evidence',JSON.stringify(records,null,2));}
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
function reset(){invalidate();active=null;records.length=0;seq=0;$('raw').value='';$('bReply').value='';$('followup').value='';$('followupBox').hidden=true;$('bContent').hidden=true;$('bEmpty').hidden=false;$('btnResolve').hidden=true;for(const id of ['aStatus','bApproved'])text(id,'');text('bWho','Chưa có gì được gửi');evidence();$('raw').focus();}
$('raw').addEventListener('input',()=>{invalidate();$('optsOut').inert=false;$('approved').disabled=false;});
$('approved').addEventListener('input',updateSend);
$('bReply').addEventListener('input',()=>{$('bSend').disabled=!active||active.status==='resolved'||!$('bReply').value.trim();});
$('aiMode').onchange=()=>{invalidate();$('optsOut').inert=false;$('approved').disabled=false;text('notice','Đã đổi chế độ. Bấm Tìm cách diễn đạt để tạo gợi ý; chưa gửi dữ liệu.');};
$('btnAnalyze').onclick=()=>analyze();$('btnSend').onclick=()=>send(true);$('bSend').onclick=reply;$('btnReset').onclick=reset;
$('btnViolate').onclick=()=>send(false);
$('followup').oninput=()=>{$('sendFollowup').disabled=!$('followup').value.trim();};
$('sendFollowup').onclick=()=>{if(!active||active.status==='resolved'||!$('followup').value.trim())return;active.followups.push($('followup').value);active.status='sent';text('bApproved',active.userApprovedText+'\n\nBổ sung từ Minh:\n'+active.followups.join('\n\n'));text('aStatus','Đã gửi bổ sung trong demo. Đang chờ phản hồi.');$('followupBox').hidden=true;$('btnResolve').hidden=true;$('bReply').value='';replyChoice=null;$('bSend').disabled=true;evidence();$('bMessageHeading').focus({preventScroll:true});};
$('btnResolve').onclick=()=>{if(!active)return;active.status='resolved';evidence();text('aStatus','Bạn đã xác nhận được hỗ trợ và đóng yêu cầu.');$('btnResolve').hidden=true;$('followupBox').hidden=true;$('bSend').disabled=true;updateSend();$('raw').focus({preventScroll:true});};
$('btnAnalyze').disabled=true;
try {
 [INT,ORG,GLO]=await Promise.all(['intents_vi','org_map','glossary_vi'].map(async name=>{const r=await fetch(`/data/${name}.json`);if(!r.ok)throw new Error('data');return r.json();}));
 text('bData',`Domain: ${INT.intents.length} ý định · ${ORG.roles.length} đầu mối`);$('btnAnalyze').disabled=false;
 const samples=[['Chưa rõ task','em không hiểu task API-142 lắm mà hỏi thì sợ phiền'],['Quá tải','nhiều task cùng lúc em không kịp'],['Quyền truy cập','em chưa có quyền truy cập repo'],['Cần viết lại','mọi người nói nhanh em không nhớ kịp'],['Thiếu thử thách','công việc lặp lại em muốn thử thách hơn'],['Chưa rõ nhu cầu','em muốn nói một chuyện']];
 for(const [label,value] of samples){const b=node('button',label);b.onclick=()=>{invalidate();$('raw').value=value;$('optsOut').inert=false;$('approved').disabled=false;$('raw').focus();};$('samples').append(b);}
 $('loadedList').replaceChildren(...[`${INT.intents.length} ý định, mỗi ý định có định tuyến và phản hồi mẫu.`,`${ORG.roles.length} vai trò hư cấu; cần thay bằng đầu mối thật khi triển khai.`,`${(GLO.entries||GLO.terms).length} mục tri thức; quy ước mẫu không phải cam kết của công ty.`].map(s=>node('li',s)));
}catch{$('loadError').hidden=false;text('bData','Lỗi tải dữ liệu');}
