import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import {pipeline} from './interview.mjs';
import {validClarificationRequest,clarify,makeProvider} from './ai.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
dotenv.config({path:path.join(root,'.env'),quiet:true});
const interviewClarifications=JSON.parse(await readFile(path.join(root,'data/clarifications_interview_vi.json'),'utf8'));
const interviewOrg=JSON.parse(await readFile(path.join(root,'data/org_map_interview_vi.json'),'utf8'));
// Each pack owns its roles so name checks use the current context only.
const jobs=JSON.parse(await readFile(path.join(root,'data/job_profiles_vi.json'),'utf8'));
const bank=JSON.parse(await readFile(path.join(root,'data/interview_support_vi.json'),'utf8'));
const clarificationPacks={
 interview:{data:interviewClarifications,roles:interviewOrg.roles,promptMode:'clarify-interview'}
};
const paths=new Set(['/prototype/bridge.html','/prototype/bridge.mjs','/prototype/layout.mjs','/prototype/core.mjs','/prototype/interview-core.mjs','/prototype/interview-flow.mjs','/data/job_profiles_vi.json','/data/glossary_vi.json','/data/clarifications_interview_vi.json','/data/org_map_interview_vi.json','/data/interview_support_vi.json']);
export function createServer(provider=null) {
 return http.createServer(async(req,res)=>{
  const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  const host=req.headers.host||'';
  if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return send(403,{error:'Forbidden host'});
  if(req.headers.origin && req.headers.origin!==`http://${host}`) return send(403,{error:'Forbidden origin'});
  const pathname=new URL(req.url,`http://${host}`).pathname;
  const pipelineKind={'/api/interview/analyze-job':'job','/api/interview/generate-questions':'questions','/api/interview/analyze-answer':'answer'}[pathname];
  if(pipelineKind&&req.method==='POST'){
   if(!req.headers['content-type']?.startsWith('application/json'))return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'JSON is required.'});
   try{
    const chunks=[];let size=0;
    for await(const chunk of req){size+=chunk.length;if(size>131072)return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'The request is too large.'});chunks.push(chunk);}
    const controller=new AbortController();res.on('close',()=>{if(!res.writableEnded)controller.abort();});
    const result=await pipeline(pipelineKind,JSON.parse(Buffer.concat(chunks).toString('utf8')),{provider,jobs,bank,signal:controller.signal});
    return result?send(200,result):send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Review the content and its source evidence.'});
   }catch{return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Invalid JSON.'});}
  }
  if(pathname==='/api/clarify' && req.method==='POST') {
   if(!req.headers['content-type']?.startsWith('application/json')) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'JSON is required.'});
   try {
    let body=''; for await(const chunk of req) {body+=chunk; if(Buffer.byteLength(body)>8192) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'The request is too large.'});}
    const parsed=JSON.parse(body);
    if(parsed?.packId!==undefined&&parsed.packId!=='interview')return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Invalid interview pack.'});
    const pack=clarificationPacks.interview;
    const request=validClarificationRequest(parsed,pack.data);
    if(!request) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Review the message and clarification type.'});
    return send(200,await clarify(request,{provider,roles:pack.roles,promptMode:pack.promptMode}));
   } catch {return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Invalid JSON.'});}
  }
  const target=pathname==='/'?'/prototype/bridge.html':pathname;
  if(req.method!=='GET'||!paths.has(target)) return send(404,{error:'Not found'});
  try {
   const content=await readFile(path.join(root,target));
   res.writeHead(200,{'Content-Type':target.endsWith('.html')?'text/html; charset=utf-8':target.endsWith('.mjs')?'text/javascript; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(content);
  } catch {send(404,{error:'Not found'});}
 });
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const provider=await makeProvider(process.env.GEMINI_API_KEY,process.env.GEMINI_MODEL||'gemini-3.5-flash-lite');
 createServer(provider).listen(Number(process.env.PORT)||8777,'127.0.0.1',()=>console.log('Bridge: http://127.0.0.1:'+(Number(process.env.PORT)||8777)+' — AI '+(provider?'configured':'NO_KEY; static fallback ready')));
}
