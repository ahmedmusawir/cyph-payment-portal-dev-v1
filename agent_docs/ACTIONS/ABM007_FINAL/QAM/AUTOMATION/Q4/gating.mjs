import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { scratchTarget, scrub, SCRATCH_REF, DEV_REF } from '../../../../../../scripts/apbm007b/lib/env.mjs';

const output='agent_docs/ACTIONS/ABM007_FINAL/QAM/evidence/Q4/01';
const root='/tmp/abm007-final-cody-q4';
const sc=scratchTarget();
const sessionEnv={PATH:process.env.PATH,HOME:process.env.HOME,CI:'1',NEXT_TELEMETRY_DISABLED:'1'};
const patchLog=s=>scrub(s).split(sc.secretKey).join('[scrubbed]').split(sc.dbUrl).join('[scrubbed]');
const app=process.argv[2];
if(!['ob','pp','mock-ob'].includes(app))throw Error('Explicit build app required');
const source=app==='mock-ob'?'ob':app;
const fake=app==='mock-ob';
const dir=join(root,app);
const manifest=createHash('sha256').update(readFileSync(join(output,source+'-manifest.json'))).digest('hex');
const port=source==='ob'?3100:3101;
const label='q4-'+app+'-'+manifest.slice(0,16);
const env={...sessionEnv, NEXT_PUBLIC_SUPABASE_URL:sc.url,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:sc.publishableKey,
  NEXT_PUBLIC_SITE_URL:'http://localhost:'+port,NEXT_PUBLIC_APP_ENV:'local-proof',
  NEXT_PUBLIC_APBM_DATA_MODE:fake?'mock':'real',APBM_BUILD_REVISION:manifest,APBM_BUILD_ARTIFACT_ID:label};
const rows=[];
async function run(name,cmd,args,vars=sessionEnv) {
  const started=new Date().toISOString();
  const child=spawn(cmd,args,{cwd:dir,env:vars,stdio:['ignore','pipe','pipe']});
  let body='';
  for(const stream of [child.stdout,child.stderr]) stream.on('data',s=>body+=s.toString());
  const code=await new Promise((ok,reject)=>{ child.on('error',reject); child.on('close',(n,signal)=>ok(n??signal)); });
  const out=join(output,app+'-'+name+'.log');
  writeFileSync(out,patchLog(body),{flag:'wx'});
  rows.push({name, cmd:[cmd,...args],cwd:dir, exit:code, started, finished:new Date().toISOString(), evidence:out});
  writeFileSync(join(output,app+'-gating.json'),JSON.stringify({app,manifest,label,rows},null,2));
  console.log(JSON.stringify({app,name,code}));
  return code;
}
if(await run('install','npm',['ci','--no-audit','--no-fund'])!==0)process.exit(1);
if(!fake){
  for(const [name,cmd,args] of [
    ['unit','npm',['test','--','--runInBand']],
    ['typecheck','node_modules/.bin/tsc',['--noEmit']],
    ['lint','npm',['run','lint']]
  ]) await run(name,cmd,args);
}
if(await run('build','npm',['run','build'],env)!==0)process.exit(1);
let counts={scratch:0,devUnexpected:0};
function walk(path){
  for(const name of readdirSync(path)){
    const child=join(path,name);if(statSync(child).isDirectory())walk(child);
    else if(child.endsWith('.js')){
      const text=readFileSync(child,'utf8');
      if(text.includes(SCRATCH_REF+'.supabase.co')) counts.scratch++;
      const all=text.split(DEV_REF+'.supabase.co').length-1;
      const policy=text.split('"'+DEV_REF+'.supabase.co"===new URL(').length-1;
      if(all>policy)counts.devUnexpected++;
    }
  }
}
for(const section of ['static','server'])walk(join(dir,'.next',section));
const r={app,manifest,label,compiledBuildId:readFileSync(join(dir,'.next/BUILD_ID'),'utf8').trim(),counts,pass:(fake||counts.scratch>0)&&counts.devUnexpected===0};
writeFileSync(join(output,app+'-build-identity.json'),JSON.stringify(r,null,2),{flag:'wx'});
if(!r.pass)process.exitCode=1;
