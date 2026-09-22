import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from '../server/app.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:process.env.PW_CHANNEL||'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],api=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url());});
const output=await mkdtemp(join(tmpdir(),'cau-noi-qa-'));
const visible=async id=>assert(await page.locator('#'+id).isVisible(),id+' visible');
try{
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.waitForFunction(()=>document.querySelectorAll('#jobSamples button').length===3);
 assert.equal(await page.locator('h1').count(),1);
 await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Đến nội dung luyện tập');
 await page.keyboard.press('Enter');
 await page.locator('[data-option="few-seconds"]').click();
 await page.locator('[data-option="written"]').click();
 await page.locator('[data-option="structure"]').click();
 await page.locator('[data-strength="problem-solving"]').click();
 await page.locator('#ivSaveProfile').click();await visible('ivSummary');await visible('ivPractice');
 assert.match(await page.locator('#ivSummaryList').textContent(),/Cần thêm thời gian/);
 await page.locator('#ivSupports [data-id="question-breakdown"]').click();await visible('ivPanel');
 assert(await page.locator('#ivUseLine').isDisabled());
 await page.locator('#ivOptions button').first().click();await page.locator('#ivUseLine').click();
 await page.locator('#dismissSupport').click();
 await page.locator('#ivAnswer').fill('Bản nháp cần giữ');await page.locator('#ivNext').click();
 await page.locator('#ivCategories button').first().click();assert.equal(await page.locator('#ivAnswer').inputValue(),'Bản nháp cần giữ');
 await page.locator('#jobSamples button').first().click();await page.locator('#jobAnalyze').click();await visible('jobResult');
 assert.match(await page.locator('#jobCards').textContent(),/React/);
 await page.locator('#generateQuestions').click();await page.locator('#startPractice').click();
 await page.locator('#ivAnswer').fill('Tôi đọc log và tái hiện lỗi API bằng test, rồi sửa phần xử lý dữ liệu.');
 await page.locator('#analyzeAnswer').click();await visible('answerResult');
 assert.match(await page.locator('#answerCards').textContent(),/Chưa xác định/);
 assert.match(await page.locator('#preparationMap').textContent(),/1\/3/);
 await page.locator('#ivSupports [data-id="thinking-time"]').click();
 await page.locator('#ivFinish').click();await visible('ivReview');
 await page.locator('#ivReviewBody button').filter({hasText:'Ưu tiên'}).first().click();
 assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('cau-noi:interview-profile')))).kept.length);
 await page.locator('#buildPack').click();await visible('interviewPack');
 assert.equal(api.length,0,'local flow must never call an API');
 console.log('PASS local profile, draft persistence, supports, JD, questions, answer fallback, reflection, pack; zero API calls');

 // Provider thật không được gọi: server này cố ý không có key.
 await page.locator('#aiMode').check();await page.locator('#jobAnalyze').click();
 await page.waitForFunction(()=>document.getElementById('jobStatus').textContent.includes('NO_KEY'));
 await page.locator('#generateQuestions').click();await page.waitForFunction(()=>document.getElementById('questionSource').textContent.includes('NO_KEY'));
 await page.locator('#startPractice').click();await page.locator('#ivAnswer').fill('Tôi kiểm tra log để tìm nguyên nhân và sửa lỗi API.');
 await page.locator('#analyzeAnswer').click();await page.waitForFunction(()=>document.getElementById('answerStatus').textContent.includes('NO_KEY'));
 console.log('PASS all three backend NO_KEY fallbacks');

 await page.route('**/api/interview/generate-questions',route=>route.fulfill({json:{mode:'llm',data:{questions:[{questionId:'generated',categoryId:'technical',text:'Trong tình huống giả định, bạn kiểm tra lỗi API ra sao?',parts:['Thông tin cần kiểm tra','Cách xác minh giả thuyết'],focusOptions:['Cách tìm nguyên nhân','Cách kiểm tra kết quả'],difficulty:2,requirementIds:['api'],source:'llm'}]}}}));
 await page.locator('#generateQuestions').click();await page.waitForFunction(()=>document.getElementById('questionSource').textContent.includes('1 câu từ AI'));
 await page.locator('#startPractice').click();await page.locator('#ivSupports [data-id="question-breakdown"]').click();
 assert.match(await page.locator('#ivPanel').textContent(),/Thông tin cần kiểm tra/);
 await page.locator('#dismissSupport').click();await page.locator('#ivDifficulty').selectOption('4');
 assert.match(await page.locator('#ivQuestion').textContent(),/Chưa có câu hỏi/);
 await page.locator('#ivDifficulty').selectOption('0');
 await page.unroute('**/api/interview/generate-questions');
 await page.locator('#ivAnswer').fill('Tôi kiểm tra log để tìm nguyên nhân và sửa lỗi API.');
 console.log('PASS generated question parts/source and empty difficulty filter');

 // Kết quả mô phỏng LLM có bằng chứng và một câu thiếu parts để kiểm thử backend riêng.
 await page.route('**/api/interview/analyze-answer',async route=>{
  const data=route.request().postDataJSON();assert(!Object.hasOwn(data,'profile'));assert(!Object.hasOwn(data,'supportProfile'));
  await route.fulfill({json:{mode:'llm',data:{evidence:[{strength:'Debugging',quote:data.answer,requirementId:'debugging'}],addPrompts:['result']}}});
 });
 await page.locator('#analyzeAnswer').click();await page.waitForFunction(()=>document.querySelectorAll('#answerCards button').length===1);
 await page.locator('#answerCards button').click();await page.locator('#buildPack').click();assert.match(await page.locator('#interviewPack').textContent(),/Tôi kiểm tra log/);
 await page.locator('#ivAnswer').fill('Tôi chưa có ví dụ này.');await page.locator('#buildPack').click();assert.doesNotMatch(await page.locator('#interviewPack').textContent(),/Tôi kiểm tra log/);
 console.log('PASS approved evidence and invalidation on answer edit');
 await page.unroute('**/api/interview/analyze-answer');
 await page.route('**/api/interview/analyze-job',route=>route.fulfill({status:400,json:{mode:'error',message:'Kiểm tra dữ liệu thử nghiệm.'}}));
 await page.locator('#jobAnalyze').click();await page.waitForFunction(()=>document.getElementById('jobError').textContent.includes('Kiểm tra dữ liệu thử nghiệm'));
 await page.unroute('**/api/interview/analyze-job');
 // Quay về bộ câu mẫu để tiếp tục kiểm thử mất mạng và bản nháp.
 await page.locator('#generateQuestions').click();await page.waitForFunction(()=>document.getElementById('questionSource').textContent.includes('NO_KEY'));
 await page.locator('#startPractice').click();await page.locator('#ivAnswer').fill('Tôi mô tả cách kiểm tra lỗi theo từng bước.');

 // Hủy đáp ứng chậm: kết quả cũ không được gắn lên câu mới.
 let release;const gate=new Promise(r=>release=r);
 await page.route('**/api/interview/analyze-answer',async route=>{await gate;await route.fulfill({json:{mode:'llm',data:{evidence:[],addPrompts:['result']}}}).catch(()=>{});});
 await page.locator('#analyzeAnswer').click();await page.locator('#ivNext').click();release();
 assert(await page.locator('#answerResult').isHidden());
 await page.unroute('**/api/interview/analyze-answer');
 await context.setOffline(true);
 await page.locator('#ivAnswer').fill('Tôi kiểm tra và tự đối chiếu lại các bước.');await page.locator('#analyzeAnswer').click();
 await page.waitForFunction(()=>document.getElementById('answerStatus').textContent.includes('NETWORK_ERROR'));
 await page.locator('#ivSupports [data-id="question-focus"]').click();await page.waitForFunction(()=>document.getElementById('ivStatus').textContent.includes('NETWORK_ERROR'));
 await context.setOffline(false);console.log('PASS stale response cancellation and network fallback');

 await page.getByText('Thử vòng giao tiếp hai chiều với người phỏng vấn mô phỏng',{exact:true}).click();
 await page.locator('#aiMode').uncheck();await page.locator('#cStart').click();
 await page.locator('#cTypes button').first().click();await page.locator('#cOptions button').first().click();
 await page.locator('#btnViolate').click();assert.match(await page.locator('#error').textContent(),/Đã chặn/);assert(await page.locator('#cReceiver').isHidden());
 await page.locator('#cSend').click();await page.locator('#cRespond').click();await page.locator('#cResolve').click();
 assert.match(await page.locator('#cUserStatus').textContent(),/Đã hiểu/);console.log('PASS clarification approval gate and round trip');

 for(const width of [375,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
 }
 await page.screenshot({path:join(output,'desktop.png'),fullPage:true});
 await page.locator('#jobTitle').scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'desktop-job.png')});
 await page.setViewportSize({width:375,height:900});await page.screenshot({path:join(output,'mobile.png'),fullPage:true});
 await page.locator('#practiceTitle').scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'mobile-practice.png')});
 await page.evaluate(()=>{document.body.style.zoom='2';});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow 200% zoom');
 await page.evaluate(()=>{document.body.style.zoom='';});
 await page.locator('#clearSession').click();assert.match(await page.locator('#preparationMap').textContent(),/0\/3/);
 await page.reload();await page.waitForFunction(()=>document.getElementById('ivSummary').hidden===false);assert.match(await page.locator('#ivSummaryList').textContent(),/Cần thêm thời gian/);
 await page.locator('#ivEditProfile').click();await page.locator('[data-option="answer-now"]').click();await page.locator('#ivSaveProfile').click();assert.match(await page.locator('#ivSummaryList').textContent(),/Trả lời ngay/);
 await page.locator('#ivClearProfile').click();assert.equal(await page.evaluate(()=>localStorage.getItem('cau-noi:interview-profile')),null);
 assert.deepEqual(errors,[]);console.log('PASS responsive 375/768/1024/1440 + CSS 200% zoom, clear session/profile, no JS errors');
 console.log('Screenshots: '+output);
}finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}
