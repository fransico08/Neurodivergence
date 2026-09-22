import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import {validRequest,validClarificationRequest,suggest,clarify,makeProvider} from './ai.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
dotenv.config({path:path.join(root,'.env'),quiet:true});
const intents=JSON.parse(await readFile(path.join(root,'data/intents_vi.json'),'utf8'));
const org=JSON.parse(await readFile(path.join(root,'data/org_map.json'),'utf8'));
const clarifications=JSON.parse(await readFile(path.join(root,'data/clarifications_vi.json'),'utf8'));
const paths=new Set(['/prototype/bridge.html','/prototype/bridge.mjs','/prototype/core.mjs','/data/intents_vi.json','/data/org_map.json','/data/glossary_vi.json','/data/clarifications_vi.json']);
export function createServer(provider=null) {
 return http.createServer(async(req,res)=>{
  const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  const host=req.headers.host||'';
  if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return send(403,{error:'Forbidden host'});
  if(req.headers.origin && req.headers.origin!==`http://${host}`) return send(403,{error:'Forbidden origin'});
  const pathname=new URL(req.url,`http://${host}`).pathname;
  if(pathname==='/api/suggest' && req.method==='POST') {
   if(!req.headers['content-type']?.startsWith('application/json')) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Cần JSON.'});
   try {
    let body=''; for await(const chunk of req) {body+=chunk; if(Buffer.byteLength(body)>8192) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Nội dung quá dài.'});}
    const request=validRequest(JSON.parse(body),intents);
    if(!request) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Kiểm tra nội dung, ý định và mã công việc.'});
    return send(200,await suggest(request,{provider,roles:org.roles}));
   } catch {return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'JSON không hợp lệ.'});}
  }
  if(pathname==='/api/clarify' && req.method==='POST') {
   if(!req.headers['content-type']?.startsWith('application/json')) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Cần JSON.'});
   try {
    let body=''; for await(const chunk of req) {body+=chunk; if(Buffer.byteLength(body)>8192) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Nội dung quá dài.'});}
    const request=validClarificationRequest(JSON.parse(body),clarifications);
    if(!request) return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'Kiểm tra tin nhắn và loại câu hỏi làm rõ.'});
    return send(200,await clarify(request,{provider,roles:org.roles}));
   } catch {return send(400,{mode:'error',reasonCode:'BAD_INPUT',message:'JSON không hợp lệ.'});}
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
 createServer(provider).listen(Number(process.env.PORT)||8777,'127.0.0.1',()=>console.log('Cầu Nối: http://127.0.0.1:'+(Number(process.env.PORT)||8777)+' — AI '+(provider?'configured':'NO_KEY; static fallback ready')));
}
