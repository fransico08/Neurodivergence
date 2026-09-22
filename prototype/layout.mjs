// Điều hướng "mỗi lần một bước" bằng sidebar.
// Module này chỉ bật/tắt panel và cập nhật trạng thái sidebar; không đọc hay ghi
// state nghiệp vụ của bridge.mjs / interview-flow.mjs.
const byId=id=>document.getElementById(id);
const panels=[...document.querySelectorAll('.step-panel')];
const links=[...document.querySelectorAll('[data-step-link]')];
const sequence=links.filter(a=>a.hasAttribute('data-step-sequence')).map(a=>a.dataset.stepLink);

// Bước bị khoá khi phần tử nghiệp vụ tương ứng còn `hidden`; JS nghiệp vụ tự gỡ khi đủ điều kiện.
const lockedBy={practice:'ivPractice',reflect:'ivReview'};
const doneWhen={profile:'ivSummary',role:'jobResult'};
// Các nút nghiệp vụ gọi focus() vào bước khác. Mở bước đích ở pha capture — chạy trước
// handler của nút — nếu không focus() sẽ rơi vào phần tử đang display:none và thất bại im lặng.
const crossStep={startPractice:'practice',ivFinish:'reflect',clearSession:'role'};

let active=null;
const panelOf=step=>panels.find(p=>p.dataset.step===step);
const labelOf=step=>links.find(a=>a.dataset.stepLink===step)?.querySelector('.step-label')?.textContent.trim()||step;
const isLocked=step=>Boolean(lockedBy[step]&&byId(lockedBy[step])?.hidden);
const isDone=step=>{const el=doneWhen[step]&&byId(doneWhen[step]);return Boolean(el&&!el.hidden);};

// Trên màn hẹp danh sách bước cuộn ngang; đưa bước đang chọn vào khung nhìn.
// Chỉnh scrollLeft trực tiếp thay vì scrollIntoView để không kéo cả trang cuộn lên sidebar.
function revealInList(link){
 const list=link.closest('.step-list');
 if(!list||list.scrollWidth<=list.clientWidth)return;
 const offset=link.getBoundingClientRect().left-list.getBoundingClientRect().left;
 if(offset<0||offset+link.offsetWidth>list.clientWidth)list.scrollLeft+=offset-12;
}

function refresh(){
 for(const p of panels)p.toggleAttribute('data-locked',isLocked(p.dataset.step));
 for(const a of links){
  const step=a.dataset.stepLink,locked=isLocked(step),done=!locked&&isDone(step);
  a.classList.toggle('is-locked',locked);
  a.classList.toggle('is-done',done);
  if(step===active){a.setAttribute('aria-current','step');revealInList(a);}else a.removeAttribute('aria-current');
  const state=a.querySelector('.step-state');
  if(state)state.textContent=locked?' (not open yet)':done?' (completed)':'';
 }
 const meta=byId('stepMeta'),index=sequence.indexOf(active);
 if(meta)meta.textContent=index>=0?`Step ${index+1} of ${sequence.length}`:'';
}

function activate(step,{focus=true,updateHash=true}={}){
 const panel=panelOf(step);if(!panel)return;
 active=step;
 for(const p of panels)p.classList.toggle('is-active',p===panel);
 refresh();
 if(updateHash)history.replaceState(null,'',`#step-${step}`);
 if(!focus)return;
 const target=panel.hasAttribute('data-locked')
  ?panel.querySelector('.step-locked-note [tabindex]')
  :panel.querySelector('[data-step-heading]');
 byId('mainContent')?.scrollIntoView({block:'start'});
 target?.focus({preventScroll:true});
}

function buildPagers(){
 sequence.forEach((step,i)=>{
  const panel=panelOf(step);if(!panel)return;
  const pager=document.createElement('div');pager.className='step-pager';
  const add=(target,dir)=>{
   const label=labelOf(target),button=document.createElement('button');
   button.type='button';button.dataset.dir=dir;
   if(dir==='next')button.className='primaryA';
   button.textContent=dir==='prev'?`← ${label}`:`${label} →`;
   button.setAttribute('aria-label',dir==='prev'?`Back: ${label}`:`Next: ${label}`);
   button.addEventListener('click',()=>activate(target));
   pager.append(button);
  };
  if(i>0)add(sequence[i-1],'prev');
  if(i<sequence.length-1)add(sequence[i+1],'next');
  panel.append(pager);
 });
}

for(const a of links)a.addEventListener('click',e=>{e.preventDefault();activate(a.dataset.stepLink);});
document.addEventListener('click',e=>{
 const go=e.target.closest('[data-step-go]');
 if(go)activate(go.dataset.stepGo);
});
document.addEventListener('click',e=>{
 const trigger=e.target.closest('button[id]'),step=trigger&&crossStep[trigger.id];
 if(step)activate(step,{focus:false});
},true);

const watched=[...new Set([...Object.values(lockedBy),...Object.values(doneWhen)])].map(byId).filter(Boolean);
const observer=new MutationObserver(refresh);
for(const el of watched)observer.observe(el,{attributes:true,attributeFilter:['hidden']});

const stepFromHash=()=>location.hash.match(/^#step-([a-z]+)$/)?.[1];
// Đổi hash trên cùng trang (gõ URL, link ngoài) không tải lại trang nên phải tự chuyển bước.
window.addEventListener('hashchange',()=>{const step=stepFromHash();if(panelOf(step))activate(step,{updateHash:false});});

buildPagers();
const initial=stepFromHash();
activate(panelOf(initial)?initial:'profile',{focus:false,updateHash:false});
