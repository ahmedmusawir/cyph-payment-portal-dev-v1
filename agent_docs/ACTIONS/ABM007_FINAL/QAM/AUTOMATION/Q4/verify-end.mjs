import {readFileSync,writeFileSync,readlinkSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const repo=process.cwd(),q='agent_docs/ACTIONS/ABM007_FINAL/QAM',e=q+'/evidence/Q4/01';
const {assertServedScratch,servedReport}=await import(pathToFileURL(repo+'/'+q+'/AUTOMATION/Q4/auth.mjs'));
const rows=[],copies=[];
const finalStage=process.argv[2]==='--after-diagnostics'?'post-diagnostics-':'';
for(const [app,port] of [['ob',3100],['pp',3101]]){
 const check=JSON.parse(execFileSync('python3',[q+'/AUTOMATION/Q4/manifest.py','check',app],{encoding:'utf8'}));
 if(check.mismatches.length)throw Error('Manifest no longer matches for '+app);
 copies.push(check);
 const expected=JSON.parse(readFileSync(e+'/'+app+'-build-identity.json'));
 await assertServedScratch(app);
 const r=await fetch('http://localhost:'+port+'/api/build-info',{signal:AbortSignal.timeout(5000)});
 const actual=await r.json();
 if(r.status!==200||actual.app!==app||actual.revision!==expected.manifest||actual.artifactId!==expected.label)
   throw Error('Real compiled identity not verified for '+app);
 const pid=servedReport()[app].listener_pid, cwd=readlinkSync('/proc/'+pid+'/cwd');
 const modes=Object.fromEntries(readFileSync('/proc/'+pid+'/environ','utf8').split('\0').filter(Boolean)
   .map(v=>[v.slice(0,v.indexOf('=')),v.slice(v.indexOf('=')+1)]));
 if(cwd!=='/tmp/abm007-final-cody-q4/'+app||modes.NEXT_PUBLIC_APBM_DATA_MODE!=='real')throw Error('Real QA copy not serving');
 rows.push({app,port,pid,realCopy:true,revision:actual.revision,artifactId:actual.artifactId,status:r.status,target:servedReport()[app].runtime_backend_ref});
}
writeFileSync(e+'/'+finalStage+'final-served.json',JSON.stringify(rows,null,2)+'\n',{flag:'wx'});
writeFileSync(e+'/'+finalStage+'end-manifest-check.json',JSON.stringify(copies,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({rows,copies}));
