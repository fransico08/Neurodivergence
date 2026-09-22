import {z} from 'zod';
import {runModel,prompts,responseSchemas} from './ai.mjs';
import {CATEGORIES,groundedJob,completedQuestions,groundedEvidence,localJob,localQuestions,STRUCTURE} from '../prototype/interview-core.mjs';
const text=z.string().trim().min(1);
const jd=z.string().trim().min(1).max(5000);
const category=z.enum(CATEGORIES);
const Item=z.object({id:text.max(100),label:text.max(120),kind:z.enum(['technical','behavioral','responsibility']),categoryId:category,sourceQuote:text.max(5000)}).strict();
export const JobOutput=z.object({items:z.array(Item).max(32)}).strict();
export const Question=z.object({questionId:text.max(100),categoryId:category,text:text.max(500),parts:z.array(text.max(240)).min(2).max(6),focusOptions:z.array(text.max(240)).min(2).max(6),difficulty:z.number().int().min(1).max(4),requirementIds:z.array(text.max(100)).min(1).max(8)}).strict();
// Validate each question independently so one invalid item does not discard valid ones.
export const QuestionOutput=z.object({questions:z.array(z.unknown()).min(1).max(12)}).strict();
export const AnswerOutput=z.object({evidence:z.array(z.object({strength:text.max(120),quote:text.max(2000),requirementId:z.string().max(100)}).strict()).max(8),addPrompts:z.array(z.enum(Object.keys(STRUCTURE))).max(4)}).strict();
const context={jdText:z.string().max(5000),jobProfile:JobOutput};
export const requests={
 job:z.object({jdText:jd}).strict(),
 questions:z.object({jdText:jd,jobProfile:JobOutput}).strict(),
 answer:z.object({...context,question:text.max(500),answer:text.max(2000)}).strict()
};
const S={type:'STRING'},array=items=>({type:'ARRAY',items}),object=properties=>({type:'OBJECT',properties,required:Object.keys(properties)});
const item=object({id:S,label:S,kind:{type:'STRING',enum:['technical','behavioral','responsibility']},categoryId:{type:'STRING',enum:CATEGORIES},sourceQuote:S});
responseSchemas['clarify-interview']=object({acknowledgedClarificationId:S,confident:{type:'BOOLEAN'},options:object({neutral:S,direct:S,soft:S})});
responseSchemas.job=object({items:array(item)});
responseSchemas.questions=object({questions:array(object({questionId:S,categoryId:{type:'STRING',enum:CATEGORIES},text:S,parts:array(S),focusOptions:array(S),difficulty:{type:'INTEGER'},requirementIds:array(S)}))});
responseSchemas.answer=object({evidence:array(object({strength:S,quote:S,requirementId:S})),addPrompts:array({type:'STRING',enum:Object.keys(STRUCTURE)})});
prompts.job='Analyze the job description. Return {items:[{id,label,kind,categoryId,sourceQuote}]}. kind must be technical, behavioral, or responsibility. categoryId must be technical, behavioral, situational, or job-specific. Every sourceQuote must be an exact substring of jdText. For an item from the provided dictionary, use its exact id, label, kind, and categoryId plus a quote containing its keyword. For a new item, its label must appear verbatim in sourceQuote. Do not add a skill merely because it is common in the profession. If no evidence exists, return an empty items array. Return at most 16 items. Use English.';
prompts.questions='Create four realistic practice questions in English, one for each category: technical, behavioral, situational, and job-specific. Ground them in jobProfile. Return {questions:[{questionId,categoryId,text,parts,focusOptions,difficulty,requirementIds}]}. text must be at most 500 characters; parts and focusOptions must each contain 2–6 strings; difficulty must be an integer from 1–4. requirementIds must contain at least one ID from jobProfile.items. Do not claim to predict exact interview questions. Do not invent the candidate’s past; clearly label hypothetical situations. Do not provide answers.';
prompts.answer='Analyze job-relevant evidence in answer. Do not infer a diagnosis, personality, or support need from the answer. Return {evidence:[{strength,quote,requirementId}],addPrompts:[]}. Every quote must be an exact substring of answer and genuinely demonstrate the strength. Do not use negated statements or another person’s actions as evidence of the candidate’s ability. If no evidence exists, return an empty evidence array. requirementId must be a matching job requirement ID or an empty string. Do not score or rank the candidate, and do not assess speaking speed or eye contact. addPrompts may contain only context, action, result, or lesson when useful. Never invent experiences or metrics. This is a suggestion for the user to confirm, not verification of ability. Use English.';
export async function pipeline(kind,body,{provider,jobs,bank,timeoutMs=10000,signal}){
 const p=requests[kind]?.safeParse(body);
 if(!p?.success)return null;
 const request=p.data;
 let job;
 if(kind!=='job'){
  job=groundedJob(request.jobProfile,request.jdText,jobs);
  if(job.items.length!==request.jobProfile.items.length)return null;
  request.jobProfile=job;
 }
 const fallback=()=>kind==='job'?localJob(request.jdText,jobs):kind==='questions'?{questions:localQuestions(bank)}:{evidence:[],addPrompts:Object.keys(STRUCTURE)};
 const validate=value=>{
  if(kind==='job'){const v=JobOutput.safeParse(value);if(!v.success)return false;const data=groundedJob(v.data,request.jdText,jobs);return data.items.length?data:false;}
  if(kind==='questions'){
   const v=QuestionOutput.safeParse(value);if(!v.success)return false;
   const valid=v.data.questions.map(q=>Question.safeParse(q)).filter(p=>p.success).map(p=>p.data);
   const questions=completedQuestions(valid,bank,job);
   return questions?{questions}:false;
  }
  const v=AnswerOutput.safeParse(value);
  return v.success?groundedEvidence(v.data,request.answer,job):false;
 };
 const result=await runModel(kind==='job'?{...request,dictionary:jobs.dictionary}:request,{provider,mode:kind,validate,timeoutMs,signal});
 return result.mode==='llm'?result:{...result,data:fallback()};
}
